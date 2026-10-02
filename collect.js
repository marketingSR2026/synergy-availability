#!/usr/bin/env node
/**
 * Synergy availability collector, near-live version (runs on GitHub Actions, outside WordPress).
 *
 * How it works
 * - One logged-out headless browser session on Synergy's public Jane booking site. No logins, no patient pages.
 * - At start it reads each location's public /book page once (spaced >= 5 s) to learn location id, services
 *   (disciplines), treatments and practitioner names.
 * - Then it loops until the deadline: every ~10 s (+-2 s) it asks Jane for ONE location+service pair
 *   (one call covers every treatment of that service). Core services (physio, massage, chiro) are due every
 *   10 min, everything else every 60 min. The most overdue pair goes first. That is ~6 Jane calls a minute.
 * - Every 2 min it writes the merged file and force-pushes it as a single orphan commit to the `data` branch,
 *   so git history never grows. WordPress pulls that file.
 * - Any 403 / 429 / captcha / non-JSON answer: stop calling Jane for 15 min. After 3 such pauses, final publish and exit.
 * - Output rows are whitelisted fields only. booked_patient_ids and every other Jane field are never copied.
 *
 * Usage: node collect.js [--minutes 330] [--only langley,delta] [--no-publish] [--out data/availability.json]
 *        [--max-api N] (stop after N Jane API calls, for tests)
 * Env:   PW_CHROMIUM = path to a Chromium binary (optional)
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const BASE = 'https://synergyrehab.janeapp.com';
const UA = 'Mozilla/5.0 (compatible; SynergyAvailabilityBot/1.0; +https://synergyrehab.ca; marketing@synergy-rehab.ca)';
const DATA_BRANCH = 'data';
const DATA_FILE = 'availability.json'; // path inside the data branch (repo root). WordPress reads this exact path.
const CORE_EVERY = 10 * 60e3;
const OTHER_EVERY = 60 * 60e3;
const CALL_GAP = 10e3;          // ~6 Jane API calls per minute
const CALL_JITTER = 2e3;        // +-2 s
const PAGE_GAP = 5e3;           // >= 5 s between page loads
const PUBLISH_EVERY = 2 * 60e3;
const PAUSE_MS = 15 * 60e3;
const MAX_PAUSES = 3;
const KEEP_UNREFRESHED_MIN = 180; // rows from pairs we could not refresh are dropped after this (WordPress hides them after 150)
const CORE = /physio|massage|chiro/i;
const NOT_CORE = /shockwave|\bims\b|dry needling|prenatal|pelvic|vestibular|mobile/i;
const PREFER_AVOID = /icbc|wcb|worksafe|mva|initial|assessment|concussion|msp/i; // same slot, same length: show the plain session

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);

// ---------- pure helpers (unit-testable, no network) ----------

function decode(s) {
  return String(s == null ? '' : s)
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}

/** Extract the JSON array that follows `key:` inside the routerOptions block (string-aware bracket matching). */
function extractArray(src, key) {
  const m = new RegExp('\\b' + key + '\\s*:\\s*\\[').exec(src);
  if (!m) return null;
  let i = m.index + m[0].length - 1, depth = 0, inStr = false, esc = false;
  for (let j = i; j < src.length; j++) {
    const c = src[j];
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inStr = false; continue; }
    if (c === '"') inStr = true;
    else if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') { depth--; if (depth === 0) { try { return JSON.parse(src.slice(i, j + 1)); } catch (e) { return null; } } }
  }
  return null;
}

/** Location slugs + names from any Jane page that lists locations. */
function parseLocationLinks(html) {
  const out = new Map();
  const re = /href="(?:https:\/\/synergyrehab\.janeapp\.com)?\/locations\/([a-z0-9-]+)\/book"[^>]*>([^<]*)</g;
  let m;
  while ((m = re.exec(html))) if (!out.has(m[1])) out.set(m[1], decode(m[2]) || m[1]);
  return out;
}

/** Parse one /locations/{slug}/book page into lookups. Returns null if the page has no booking data. */
function parseBookPage(html, slug, fallbackName) {
  const idm = html.match(/App\.location_id\s*=\s*(\d+)/);
  const ro = html.indexOf('routerOptions');
  if (!idm || ro < 0) return null;
  const block = html.slice(ro, ro + 2e6);
  const treatmentsRaw = extractArray(block, 'treatments') || [];
  const disciplinesRaw = extractArray(block, 'disciplines') || [];
  const staffRaw = extractArray(block, 'staff_members') || [];
  const nm = html.match(/Book an Appointment\s*<small>\s*at\s*([^<]+?)\s*<\/small>/i);
  const treatments = new Map();
  for (const t of treatmentsRaw) {
    if (!t || !t.id) continue;
    treatments.set(+t.id, { id: +t.id, name: decode(t.name), minutes: Math.round((+t.treatment_duration || 0) / 60), discipline_id: +t.discipline_id, call_to_book: !!t.call_to_book });
  }
  const staff = new Map();
  for (const s of staffRaw) if (s && s.id) staff.set(+s.id, decode(s.professional_name || s.full_name));
  const disciplines = [];
  for (const d of disciplinesRaw) {
    if (!d || !d.id) continue;
    const bookable = [...treatments.values()].some((t) => t.discipline_id === +d.id && !t.call_to_book);
    if (!bookable) continue;
    const name = decode(d.name);
    disciplines.push({ id: +d.id, name, core: CORE.test(name) && !NOT_CORE.test(name) });
  }
  return { slug, id: +idm[1], name: nm ? decode(nm[1]) : (fallbackName || slug), disciplines, treatments, staff };
}

/** Jane openings for one location+discipline -> whitelisted output rows. One row per practitioner/start/length. */
function buildRows(list, loc, disc, checkedAt) {
  const best = new Map();
  for (const o of list) {
    if (!o || o.state !== 'opening' || o.call_to_book || !o.start_at) continue;
    if (o.location_id != null && +o.location_id !== loc.id) continue;
    const t = loc.treatments.get(+o.treatment_id);
    if (!t || t.discipline_id !== disc.id || t.call_to_book) continue; // only treatments the public page offers, so the link works
    // Treatment length as Jane shows it to patients. o.duration is the practitioner's blocked time (often +10 min buffer).
    const duration = t.minutes || Math.round((+o.duration || 0) / 60);
    const key = o.staff_member_id + '|' + o.start_at + '|' + duration;
    const rank = PREFER_AVOID.test(t.name) ? 1 : 0;
    const prev = best.get(key);
    if (prev && prev.rank <= rank) continue;
    best.set(key, {
      rank,
      row: { // whitelist: never copy booked_patient_ids or any other Jane field
        location: loc.name, location_slug: loc.slug, service: disc.name, treatment: t.name,
        practitioner: loc.staff.get(+o.staff_member_id) || '', duration, datetime: String(o.start_at),
        booking_url: `${BASE}/locations/${loc.slug}/book#/discipline/${disc.id}/treatment/${t.id}`, source: 'jane', checked_at: checkedAt,
      },
    });
  }
  return [...best.values()].map((b) => b.row).sort((a, b) => Date.parse(a.datetime) - Date.parse(b.datetime));
}

const pairKey = (slug, did) => slug + '#' + did;
function pairKeyOfRow(r) { const m = /#\/discipline\/(\d+)\//.exec(r.booking_url || ''); return m ? pairKey(r.location_slug, m[1]) : null; }

/** Most overdue pair (core every 10 min, others every 60). Never-fetched pairs first, core before others. */
function pickNext(pairs, now) {
  let best = null, bestScore = -Infinity;
  for (const p of pairs) {
    const score = p.last ? now - p.last - p.every : 1e15 + (p.core ? 1e12 : 0) - p.order;
    if (score > bestScore) { best = p; bestScore = score; }
  }
  return best && (bestScore >= 0 ? best : null);
}

/** Merge all pairs into one file: future slots only, drop rows from pairs we have not refreshed for a long time. */
function mergeRows(map, now) {
  const out = [];
  for (const rows of map.values()) for (const r of rows) {
    if (Date.parse(r.datetime) < now) continue;
    if (now - Date.parse(r.checked_at) > KEEP_UNREFRESHED_MIN * 60e3) continue;
    out.push(r);
  }
  return out.sort((a, b) => Date.parse(a.datetime) - Date.parse(b.datetime) || a.location_slug.localeCompare(b.location_slug));
}

/**
 * Publish `file` as the only commit on `branch` (orphan, force-pushed), using git plumbing inside the checkout,
 * so the checkout's stored credentials (actions/checkout) are used and the working tree is untouched.
 */
function publish(file, { repo = process.cwd(), remote = 'origin', branch = DATA_BRANCH, name = DATA_FILE } = {}) {
  const git = (args, input) => execFileSync('git', ['-C', repo, ...args], {
    input, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, GIT_AUTHOR_NAME: 'availability-bot', GIT_AUTHOR_EMAIL: 'availability-bot@users.noreply.github.com', GIT_COMMITTER_NAME: 'availability-bot', GIT_COMMITTER_EMAIL: 'availability-bot@users.noreply.github.com' },
  }).trim();
  const blob = git(['hash-object', '-w', path.resolve(file)]);
  const tree = git(['mktree'], `100644 blob ${blob}\t${name}\n`);
  const commit = git(['commit-tree', tree, '-m', 'availability ' + new Date().toISOString()]);
  git(['push', '-q', '--force', remote, `${commit}:refs/heads/${branch}`]);
  return { blob, commit };
}

/** Last published rows (so a restart does not blank the site while the first sweep runs). */
function loadPrevious(repo, out, doPublish) {
  try {
    if (doPublish) {
      execFileSync('git', ['-C', repo, 'fetch', '-q', '--depth=1', 'origin', DATA_BRANCH], { stdio: 'ignore' });
      return JSON.parse(execFileSync('git', ['-C', repo, 'show', 'FETCH_HEAD:' + DATA_FILE], { encoding: 'utf8', maxBuffer: 64e6 }));
    }
    return JSON.parse(fs.readFileSync(out, 'utf8'));
  } catch (e) { return []; }
}

// ---------- browser / main loop ----------

class Blocked extends Error {}

async function main() {
  const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > -1 ? (process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : true) : d; };
  const only = arg('only', '') ? String(arg('only')).split(',') : null;
  const minutes = +arg('minutes', 330);
  const doPublish = !process.argv.includes('--no-publish');
  const OUT = String(arg('out', 'data/availability.json'));
  const maxApi = +arg('max-api', Infinity);
  const repo = process.cwd();
  const deadline = Date.now() + minutes * 60e3;

  const { chromium } = require('playwright');
  const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
  const ctx = await browser.newContext({ userAgent: UA });
  const page = await ctx.newPage();
  // Only Jane, no images/fonts/css, and no background API calls from Jane's own scripts: only our own two kinds of request.
  await page.route('**/*', (r) => {
    const q = r.request(); const u = new URL(q.url()); const type = q.resourceType();
    if (!/(^|\.)janeapp\.(com|net)$/.test(u.hostname) || ['image', 'font', 'media', 'stylesheet'].includes(type)) return r.abort();
    if (['fetch', 'xhr'].includes(type) && !/^\/api\/v2\/openings\/for_discipline$|^\/locations\/[a-z0-9-]+\/book$/.test(u.pathname)) return r.abort();
    return r.continue();
  });

  const stats = { api: 0, pages: 0, ok: 0, errors: 0, pauses: 0, published: 0 };
  const rowsByPair = new Map();
  for (const r of loadPrevious(repo, OUT, doPublish)) { const k = pairKeyOfRow(r); if (!k) continue; if (!rowsByPair.has(k)) rowsByPair.set(k, []); rowsByPair.get(k).push(r); }
  if (rowsByPair.size) log(`seeded ${rowsByPair.size} pairs from last published file`);

  const isBlockedBody = (s) => /captcha|verify you are human|cf-challenge|access denied/i.test(s);
  async function janeGet(p, kind) {
    const res = await page.evaluate(async (u) => {
      const ac = new AbortController(); const timer = setTimeout(() => ac.abort(), 30000); // a hung request must not stall the loop
      try { const r = await fetch(u, { credentials: 'same-origin', signal: ac.signal, headers: { Accept: u.includes('/api/') ? 'application/json' : 'text/html' } }); return { status: r.status, type: r.headers.get('content-type') || '', body: await r.text() }; }
      catch (e) { return { status: 0, type: '', body: String(e) }; }
      finally { clearTimeout(timer); }
    }, p);
    if (res.status === 403 || res.status === 429) throw new Blocked(`${res.status} on ${kind}`);
    if (res.status === 200 && isBlockedBody(res.body.slice(0, 5000)) && !(kind === 'page' && res.body.includes('routerOptions'))) throw new Blocked(`captcha on ${kind}`);
    return res;
  }
  async function openSession() {
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 30000 }); stats.pages++;
    const html = await page.content();
    if (isBlockedBody(html) && !html.includes('/locations/')) throw new Blocked('captcha on home page');
    return html;
  }

  let pairs = [];
  const locations = [];
  let lastPublish = 0, lastPublishedBlob = '';
  function writeAndPublish(reason) {
    const merged = mergeRows(rowsByPair, Date.now());
    fs.mkdirSync(path.dirname(path.resolve(OUT)), { recursive: true });
    fs.writeFileSync(OUT, JSON.stringify(merged));
    lastPublish = Date.now();
    if (!doPublish) { log(`wrote ${merged.length} rows to ${OUT} (${reason})`); return; }
    if (!merged.length) { log('not publishing an empty file; last published data stays live'); return; }
    try {
      const { blob, commit } = publish(OUT, { repo });
      if (blob !== lastPublishedBlob) stats.published++;
      lastPublishedBlob = blob;
      log(`published ${merged.length} rows -> ${DATA_BRANCH}:${DATA_FILE} ${commit.slice(0, 7)} (${reason})`);
    } catch (e) { log('publish failed:', String(e.stderr || e.message).slice(0, 200)); }
  }

  async function pause(why) {
    stats.pauses++;
    log(`BLOCKED (${why}). Pause ${stats.pauses}/${MAX_PAUSES}: no Jane calls for 15 min.`);
    writeAndPublish('pause');
    if (stats.pauses >= MAX_PAUSES) return false;
    const until = Date.now() + PAUSE_MS;
    while (Date.now() < until && Date.now() < deadline) { await sleep(Math.min(PUBLISH_EVERY, until - Date.now())); writeAndPublish('during pause'); }
    if (Date.now() >= deadline) return false;
    try { await openSession(); } catch (e) { if (e instanceof Blocked) return pause(e.message); log('session reopen failed:', e.message); }
    return true;
  }

  try {
    // 1. Session + location discovery (home page), then each location's /book page once.
    let homeHtml;
    for (;;) { try { homeHtml = await openSession(); break; } catch (e) { if (!(e instanceof Blocked) || !(await pause(e.message))) throw e; } }
    let links = parseLocationLinks(homeHtml);
    if (only) links = new Map([...links].filter(([s]) => only.includes(s)));
    if (!links.size) throw new Error('No locations found on Jane home page');
    log(`locations: ${[...links.keys()].join(', ')}`);
    const queue = [...links];
    while (queue.length) {
      const [slug, name] = queue[0];
      if (Date.now() >= deadline) break;
      await sleep(PAGE_GAP + Math.random() * 1500);
      try {
        const res = await janeGet(`/locations/${slug}/book`, 'page'); stats.pages++;
        queue.shift();
        if (res.status !== 200) { log(`${slug}: page HTTP ${res.status}, skipped`); continue; }
        const loc = parseBookPage(res.body, slug, name);
        if (!loc || !loc.disciplines.length) { log(`${slug}: no bookable services, skipped`); continue; }
        locations.push(loc);
        log(`${slug} (id ${loc.id}): ${loc.disciplines.map((d) => d.name + (d.core ? '*' : '')).join(', ')}`);
      } catch (e) {
        if (e instanceof Blocked) { if (!(await pause(e.message))) throw e; continue; } // retry the same location after the pause
        queue.shift();
        log(`${slug}: ${String(e.message).slice(0, 120)}`);
      }
    }
    pairs = locations.flatMap((loc) => loc.disciplines.map((d) => ({ key: pairKey(loc.slug, d.id), loc, disc: d, core: d.core, every: d.core ? CORE_EVERY : OTHER_EVERY, last: 0 })));
    pairs.forEach((p, i) => { p.order = i; });
    log(`${pairs.length} location-service pairs (${pairs.filter((p) => p.core).length} core)`);
    if (!pairs.length) throw new Error('No location-service pairs');

    // 2. Scheduler loop.
    let lastCall = 0;
    lastPublish = Date.now();
    while (Date.now() < deadline && stats.api < maxApi) {
      const gap = CALL_GAP + (Math.random() * 2 - 1) * CALL_JITTER - (Date.now() - lastCall);
      if (gap > 0) await sleep(gap);
      if (Date.now() - lastPublish >= PUBLISH_EVERY) writeAndPublish('timer');
      const p = pickNext(pairs, Date.now());
      if (!p) { await sleep(5000); continue; }
      lastCall = Date.now();
      stats.api++;
      try {
        const res = await janeGet(`/api/v2/openings/for_discipline?location_id=${p.loc.id}&discipline_id=${p.disc.id}&num_days=7&treatment_id=&date=`, 'api');
        let list = null;
        if (res.status === 200) { if (!/json/i.test(res.type)) throw new Blocked('non-JSON answer'); try { list = JSON.parse(res.body); } catch (e) { throw new Blocked('malformed JSON'); } }
        p.last = Date.now();
        if (!Array.isArray(list)) { stats.errors++; log(`${p.key} ${p.disc.name}: HTTP ${res.status}, skipped until next turn`); continue; }
        const rows = buildRows(list, p.loc, p.disc, new Date().toISOString());
        rowsByPair.set(p.key, rows);
        stats.ok++;
        log(`${p.loc.slug} / ${p.disc.name}: ${rows.length} slots (${list.length} raw)`);
      } catch (e) {
        if (e instanceof Blocked) { if (!(await pause(e.message))) break; lastCall = Date.now(); continue; }
        stats.errors++; p.last = Date.now(); log(`${p.key}: ${String(e.message).slice(0, 120)}`);
      }
    }
  } catch (e) {
    log('stopping:', String(e.message).slice(0, 200));
  }
  writeAndPublish('final');
  await browser.close();
  log('done', JSON.stringify(stats));
}

module.exports = { decode, extractArray, parseLocationLinks, parseBookPage, buildRows, pickNext, mergeRows, pairKeyOfRow, publish, CORE_EVERY, OTHER_EVERY, DATA_BRANCH, DATA_FILE };
if (require.main === module) main().catch((e) => { console.error(e); process.exit(1); });

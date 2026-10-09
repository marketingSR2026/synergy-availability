#!/usr/bin/env node
/**
 * Synergy availability collector v3 (runs on GitHub Actions, outside WordPress).
 *
 * How Jane answers (checked 2026-10-09):
 * - /api/v2/openings/for_discipline takes date=YYYY-MM-DD and num_days=1..7 (8 or more is HTTP 422).
 * - num_days=7 is snapped to the Sunday-Saturday week that contains `date`. An empty date means the current week
 *   (or the first week with openings). On a Friday that is only Friday and Saturday. v2 asked that way, which is
 *   why the widget showed only Today and Tomorrow on Fridays.
 * - num_days=1..6 starts exactly at `date`.
 * So every location + service pair is read with two calls that together cover 8 days:
 *   near: date=today,   num_days=6 -> today .. today+5    (physio, massage, chiro due every 10 min, others every 50)
 *   far:  date=today+6, num_days=2 -> today+6 .. today+7  (due every 200 min; today+7 keeps the week whole after midnight)
 *
 * How it works
 * - One logged-out headless browser session on Synergy's public Jane booking site. No logins, no patient pages.
 * - At start it reads each location's public /book page (spaced >= 5 s) for location id, services, treatments and
 *   practitioner names. A page that fails is retried every 10 min.
 * - Then one Jane call every ~10 s (+-2 s), about 6 a minute. The most overdue call goes first. Lateness is counted
 *   in intervals, so when there is more to read than time, every call slows by the same factor and nothing starves.
 * - Results are kept per pair and per day: an answer replaces exactly the days it asked for (an empty day included).
 * - Every 2 min it writes the merged file (today .. today+7, future slots only) and force-pushes it as a single
 *   orphan commit to the `data` branch, together with a small state file (when each call last ran) so a restart
 *   carries on where the last run stopped. WordPress pulls availability.json.
 * - Any 403 / 429 / captcha / non-JSON answer: no Jane calls for 15 min. After 3 such pauses, final publish and exit.
 * - Output rows are whitelisted fields only. booked_patient_ids and every other Jane field are never copied.
 *   Consultations and Mobile Kinesiology are not collected (the website does not offer them).
 *
 * Usage: node collect.js [--minutes 330] [--only langley,delta] [--no-publish] [--out data/availability.json]
 *        [--max-api N] (stop after N Jane API calls, for tests)
 * Env:   PW_CHROMIUM = path to a Chromium binary (optional)
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const BASE = 'https://synergyrehab.janeapp.com';
const UA = 'Mozilla/5.0 (compatible; SynergyAvailabilityBot/1.0; +https://synergyrehab.ca; marketing@synergy-rehab.ca)';
const TZ = 'America/Vancouver';
const DATA_BRANCH = 'data';
const DATA_FILE = 'availability.json';     // path inside the data branch (repo root). WordPress reads this exact path.
const STATE_FILE = 'collector-state.json'; // when each call last ran (collector only; WordPress ignores it)
const NEAR_DAYS = 6;       // today .. today+5 in one call (num_days=7 would snap to the calendar week)
const FAR_FROM = 6;        // second call: today+6 ..
const FAR_DAYS = 2;        // .. today+7
const PUBLISH_DAYS = 8;    // the file holds today .. today+7; the widget shows 7 days
const CORE_EVERY = 10 * 60e3;
const OTHER_EVERY = 50 * 60e3;
const FAR_EVERY = 200 * 60e3;
const CALL_GAP = 10e3;     // ~6 Jane calls per minute
const CALL_JITTER = 2e3;   // +-2 s
const PAGE_GAP = 5e3;      // >= 5 s between page loads at start
const PUBLISH_EVERY = 2 * 60e3;
const PAUSE_MS = 15 * 60e3;
const MAX_PAUSES = 3;
const LOC_RETRY_EVERY = 10 * 60e3;
const LOC_RETRY_MAX = 6;
const KEEP_NEAR_MIN = 180; // today/tomorrow rows not refreshed for this long are dropped (WordPress hides them after 150)
const KEEP_FAR_MIN = 780;  // later days (WordPress hides them after 720)
const CORE = /physio|massage|chiro/i;
const NOT_CORE = /shockwave|\bims\b|dry needling|prenatal|pelvic|vestibular|mobile/i;
const PREFER_AVOID = /icbc|wcb|worksafe|mva|initial|assessment|concussion|msp/i; // same slot, same length: show the plain session
const SKIP_TREATMENT = /consult/i; // free / phone consultations are not treatment appointments
const SKIP_SERVICE = /mobile/i;    // Mobile Kinesiology: staff book it for patients, not bookable online

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);

// ---------- pure helpers (unit-testable, no network) ----------

const ymdFmt = new Intl.DateTimeFormat('en-US', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' });
/** Calendar date (YYYY-MM-DD) of a moment, in clinic time. */
function clinicDate(ms) {
  const p = {};
  for (const x of ymdFmt.formatToParts(new Date(ms))) p[x.type] = x.value;
  return `${p.year}-${p.month}-${p.day}`;
}
/** YYYY-MM-DD plus n calendar days (pure date math, no time zone involved). */
function addDays(ymd, n) { const d = new Date(ymd + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
/** Whole days from a to b (both YYYY-MM-DD). */
function dayDiff(a, b) { return Math.round((Date.parse(b + 'T12:00:00Z') - Date.parse(a + 'T12:00:00Z')) / 864e5); }

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
    const name = decode(t.name);
    treatments.set(+t.id, { id: +t.id, name, minutes: Math.round((+t.treatment_duration || 0) / 60), discipline_id: +t.discipline_id, call_to_book: !!t.call_to_book, skip: SKIP_TREATMENT.test(name) });
  }
  const staff = new Map();
  for (const s of staffRaw) if (s && s.id) staff.set(+s.id, decode(s.professional_name || s.full_name));
  const disciplines = [];
  for (const d of disciplinesRaw) {
    if (!d || !d.id) continue;
    const name = decode(d.name);
    if (SKIP_SERVICE.test(name)) continue;
    const bookable = [...treatments.values()].some((t) => t.discipline_id === +d.id && !t.call_to_book && !t.skip);
    if (!bookable) continue;
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
    if (!t || t.discipline_id !== disc.id || t.call_to_book || t.skip) continue; // only treatments the public page offers, so the link works
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
function pairKeyOfRow(r) { const m = /#\/discipline\/(\d+)\//.exec((r && r.booking_url) || ''); return m && r.location_slug ? pairKey(r.location_slug, m[1]) : null; }

/** The days one call asks Jane for, in clinic time. */
function taskWindow(kind, now) {
  const today = clinicDate(now);
  return kind === 'far' ? { from: addDays(today, FAR_FROM), days: FAR_DAYS } : { from: today, days: NEAR_DAYS };
}
function openingsPath(locId, discId, w) {
  return `/api/v2/openings/for_discipline?location_id=${locId}&discipline_id=${discId}&num_days=${w.days}&treatment_id=&date=${w.from}`;
}

/** Store one answer: every asked day of this pair is replaced, an empty day included. Rows outside the asked days are ignored. */
function storeWindow(entries, pk, w, rows, at) {
  const byDay = new Map();
  for (const r of rows) {
    const d = clinicDate(Date.parse(r.datetime));
    if (!byDay.has(d)) byDay.set(d, []);
    byDay.get(d).push(r);
  }
  for (let i = 0; i < w.days; i++) { const d = addDays(w.from, i); entries.set(pk + '|' + d, { at, rows: byDay.get(d) || [] }); }
}

/** Rebuild per-day entries from the last published rows (each row carries the time of the call that found it). */
function seedEntries(rows) {
  const entries = new Map();
  for (const r of Array.isArray(rows) ? rows : []) {
    const pk = pairKeyOfRow(r), at = Date.parse((r && r.checked_at) || ''), t = Date.parse((r && r.datetime) || '');
    if (!pk || !at || !t) continue;
    const k = pk + '|' + clinicDate(t), e = entries.get(k);
    if (!e) entries.set(k, { at, rows: [r] });
    else { e.rows.push(r); if (at < e.at) e.at = at; }
  }
  return entries;
}

/**
 * Everything the website may show: today .. today+7, future slots only, days refreshed recently enough
 * (today/tomorrow within KEEP_NEAR_MIN, later days within KEEP_FAR_MIN). Days before today are removed from `entries`.
 */
function mergeRows(entries, now) {
  const today = clinicDate(now), last = addDays(today, PUBLISH_DAYS - 1), out = [];
  for (const [k, e] of entries) {
    const d = k.slice(k.lastIndexOf('|') + 1);
    if (d < today) { entries.delete(k); continue; }
    if (d > last) continue;
    if (now - e.at > (dayDiff(today, d) <= 1 ? KEEP_NEAR_MIN : KEEP_FAR_MIN) * 60e3) continue;
    for (const r of e.rows) if (Date.parse(r.datetime) >= now) out.push(r);
  }
  return out.sort((a, b) => Date.parse(a.datetime) - Date.parse(b.datetime) || a.location_slug.localeCompare(b.location_slug));
}

/** Rows per day ahead (+0 = today), for the run log. */
function coverage(rows, now) {
  const today = clinicDate(now), c = {};
  for (const r of rows) { const k = '+' + dayDiff(today, clinicDate(Date.parse(r.datetime))); c[k] = (c[k] || 0) + 1; }
  return c;
}

/** Two calls per pair (near, far). `saved` = state file tasks, so a restart keeps each call's last run time. */
function tasksFor(p, order, saved) {
  return ['near', 'far'].map((kind) => {
    const key = p.key + '|' + kind, s = saved && saved[key];
    return { key, kind, pair: p, core: p.core, order, every: kind === 'far' ? FAR_EVERY : p.core ? CORE_EVERY : OTHER_EVERY, last: (s && Date.parse(s.at)) || 0 };
  });
}

/**
 * Next Jane call. Lateness = time since last read / interval, so when there is more to read than time, every call
 * slows by the same factor and nothing starves.
 * Never-read calls (first run, new service): core near, then core far (physio/massage/chiro get the whole week first),
 * then other near. Other far calls start 2 intervals late and keep growing, so they fill in soon after,
 * while a core near call that is further behind still goes first.
 */
function pickNext(tasks, now, startedAt) {
  let best = null, bestScore = -Infinity;
  for (const t of tasks) {
    let s;
    if (t.last) s = Math.max(0, now - t.last) / t.every;
    else if (t.kind === 'near') s = 1e9 + (t.core ? 1e6 : 0) - t.order;
    else if (t.core) s = 1e9 + 5e5 - t.order;
    else s = 2 + Math.max(0, now - (startedAt || now)) / t.every - t.order / 1e6;
    if (s > bestScore) { best = t; bestScore = s; }
  }
  return bestScore >= 1 ? best : null;
}

/** State file: previous state, updated with this run's call times. Entries older than 2 days are dropped. */
function stateOf(tasks, prevState, now) {
  const out = {}, keepFrom = now - 2 * 864e5;
  const prev = (prevState && prevState.tasks) || {};
  for (const k of Object.keys(prev)) { const t = Date.parse((prev[k] && prev[k].at) || ''); if (t && t >= keepFrom) out[k] = { at: new Date(t).toISOString() }; }
  for (const t of tasks || []) if (t.last) out[t.key] = { at: new Date(t.last).toISOString() };
  return { v: 3, saved: new Date(now).toISOString(), tasks: out };
}

/**
 * Publish files as the only commit on `branch` (orphan, force-pushed), using git plumbing inside the checkout,
 * so the checkout's stored credentials (actions/checkout) are used and the working tree is untouched.
 * `files` = [[nameInBranch, localPath], ...] (or one local path, published as availability.json). Returns the first file's blob.
 */
function publish(files, { repo = process.cwd(), remote = 'origin', branch = DATA_BRANCH } = {}) {
  const list = typeof files === 'string' ? [[DATA_FILE, files]] : files;
  const git = (args, input) => execFileSync('git', ['-C', repo, ...args], {
    input, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, GIT_AUTHOR_NAME: 'availability-bot', GIT_AUTHOR_EMAIL: 'availability-bot@users.noreply.github.com', GIT_COMMITTER_NAME: 'availability-bot', GIT_COMMITTER_EMAIL: 'availability-bot@users.noreply.github.com' },
  }).trim();
  const blobs = list.map(([name, file]) => [name, git(['hash-object', '-w', path.resolve(file)])]);
  const tree = git(['mktree'], blobs.map(([name, blob]) => `100644 blob ${blob}\t${name}`).join('\n') + '\n');
  const commit = git(['commit-tree', tree, '-m', 'availability ' + new Date().toISOString()]);
  git(['push', '-q', '--force', remote, `${commit}:refs/heads/${branch}`]);
  return { blob: blobs[0][1], commit };
}

const statePath = (out) => path.join(path.dirname(path.resolve(out)), STATE_FILE);

/** Last published rows and state (so a restart does not blank the site or re-read everything). */
function loadPrevious(repo, out, doPublish) {
  const parse = (s) => { try { return JSON.parse(s); } catch (e) { return null; } };
  let rows = null, state = null;
  if (doPublish) {
    try {
      execFileSync('git', ['-C', repo, 'fetch', '-q', '--depth=1', 'origin', DATA_BRANCH], { stdio: 'ignore' });
      const show = (name) => { try { return execFileSync('git', ['-C', repo, 'show', 'FETCH_HEAD:' + name], { encoding: 'utf8', maxBuffer: 256e6, stdio: ['ignore', 'pipe', 'ignore'] }); } catch (e) { return ''; } };
      rows = parse(show(DATA_FILE)); state = parse(show(STATE_FILE));
    } catch (e) { /* nothing published yet */ }
  } else {
    const read = (f) => { try { return fs.readFileSync(f, 'utf8'); } catch (e) { return ''; } };
    rows = parse(read(out)); state = parse(read(statePath(out)));
  }
  return { rows: Array.isArray(rows) ? rows : [], state: state && typeof state === 'object' && !Array.isArray(state) ? state : null };
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
  const startedAt = Date.now();
  const deadline = startedAt + minutes * 60e3;

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
  const prev = loadPrevious(repo, OUT, doPublish);
  const entries = seedEntries(prev.rows);
  const saved = (prev.state && prev.state.tasks) || {};
  if (entries.size) log(`seeded ${entries.size} location-service-days from the last published file; ${Object.keys(saved).length} saved call times`);

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

  const tasks = [];
  let pairCount = 0;
  const retry = []; // location pages to try again: { slug, name, tries, next }
  function addLocation(loc) {
    for (const d of loc.disciplines) {
      const p = { key: pairKey(loc.slug, d.id), loc, disc: d, core: d.core };
      tasks.push(...tasksFor(p, pairCount++, saved));
    }
    log(`${loc.slug} (id ${loc.id}): ${loc.disciplines.map((d) => d.name + (d.core ? '*' : '')).join(', ')}`);
  }
  /** Read one location page. Throws Blocked; returns true when done (added or nothing bookable), false to retry later. */
  async function loadLocation(slug, name) {
    let res;
    try { res = await janeGet(`/locations/${slug}/book`, 'page'); stats.pages++; } catch (e) { if (e instanceof Blocked) throw e; log(`${slug}: ${String(e.message).slice(0, 120)}`); return false; }
    if (res.status !== 200) { log(`${slug}: page HTTP ${res.status}`); return false; }
    let loc = null;
    try { loc = parseBookPage(res.body, slug, name); } catch (e) { log(`${slug}: page parse error ${String(e.message).slice(0, 80)}`); }
    if (!loc) { log(`${slug}: no booking data on page`); return false; }
    if (!loc.disciplines.length) { log(`${slug}: no bookable services, skipped`); return true; }
    addLocation(loc);
    return true;
  }

  let lastPublish = 0, lastPublishedBlob = '';
  function writeAndPublish(reason) {
    const now = Date.now();
    const merged = mergeRows(entries, now);
    fs.mkdirSync(path.dirname(path.resolve(OUT)), { recursive: true });
    fs.writeFileSync(OUT, JSON.stringify(merged));
    fs.writeFileSync(statePath(OUT), JSON.stringify(stateOf(tasks, prev.state, now)));
    lastPublish = now;
    const days = JSON.stringify(coverage(merged, now));
    if (!doPublish) { log(`wrote ${merged.length} rows to ${OUT} (${reason}) per day ${days}`); return; }
    if (!merged.length) { log('not publishing an empty file; last published data stays live'); return; }
    try {
      const { blob, commit } = publish([[DATA_FILE, OUT], [STATE_FILE, statePath(OUT)]], { repo });
      if (blob !== lastPublishedBlob) stats.published++;
      lastPublishedBlob = blob;
      log(`published ${merged.length} rows -> ${DATA_BRANCH}:${DATA_FILE} ${commit.slice(0, 7)} (${reason}) per day ${days}`);
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
    while (queue.length && Date.now() < deadline) {
      const [slug, name] = queue[0];
      await sleep(PAGE_GAP + Math.random() * 1500);
      try {
        if (!(await loadLocation(slug, name))) retry.push({ slug, name, tries: 1, next: Date.now() + LOC_RETRY_EVERY });
        queue.shift();
      } catch (e) {
        if (e instanceof Blocked) { if (!(await pause(e.message))) throw e; continue; } // same location again after the pause
        throw e;
      }
    }
    log(`${pairCount} location-service pairs (${tasks.filter((t) => t.kind === 'near' && t.core).length} core), ${tasks.length} calls to keep fresh` + (retry.length ? `; will retry ${retry.map((r) => r.slug).join(', ')}` : ''));
    if (!tasks.length && !retry.length) throw new Error('No location-service pairs');

    // 2. Scheduler loop: one Jane request per turn.
    let lastCall = 0, failStreak = 0;
    lastPublish = Date.now();
    while (Date.now() < deadline && stats.api < maxApi) {
      const gap = CALL_GAP + (Math.random() * 2 - 1) * CALL_JITTER - (Date.now() - lastCall);
      if (gap > 0) await sleep(gap);
      if (Date.now() - lastPublish >= PUBLISH_EVERY) writeAndPublish('timer');
      const now = Date.now();
      const r = retry.find((x) => x.next <= now);
      if (r) { // a location page that failed earlier
        lastCall = now;
        try {
          if (await loadLocation(r.slug, r.name)) retry.splice(retry.indexOf(r), 1);
          else if (++r.tries > LOC_RETRY_MAX) { retry.splice(retry.indexOf(r), 1); log(`${r.slug}: giving up for this run`); }
          else r.next = Date.now() + LOC_RETRY_EVERY;
        } catch (e) { if (e instanceof Blocked) { if (!(await pause(e.message))) break; lastCall = Date.now(); continue; } throw e; }
        continue;
      }
      const t = pickNext(tasks, now, startedAt);
      if (!t) { await sleep(5000); continue; }
      const p = t.pair, w = taskWindow(t.kind, now);
      lastCall = Date.now();
      stats.api++;
      let broken = false; // the browser session itself failed (not a Jane answer)
      try {
        const res = await janeGet(openingsPath(p.loc.id, p.disc.id, w), 'api');
        let list = null;
        if (res.status === 200) { if (!/json/i.test(res.type)) throw new Blocked('non-JSON answer'); try { list = JSON.parse(res.body); } catch (e) { throw new Blocked('malformed JSON'); } }
        const at = Date.now();
        t.last = at;
        if (!Array.isArray(list)) {
          stats.errors++; broken = res.status === 0;
          log(`${t.key} ${p.disc.name}: HTTP ${res.status} ${String(res.body).slice(0, 120)}, skipped until next turn`);
        } else {
          const rows = buildRows(list, p.loc, p.disc, new Date(at).toISOString());
          storeWindow(entries, p.key, w, rows, at);
          stats.ok++; failStreak = 0;
          log(`${p.loc.slug} / ${p.disc.name} ${t.kind} ${w.from} +${w.days}d: ${rows.length} slots (${list.length} raw)`);
        }
      } catch (e) {
        if (e instanceof Blocked) { if (!(await pause(e.message))) break; lastCall = Date.now(); continue; }
        stats.errors++; t.last = Date.now(); broken = true; log(`${t.key}: ${String(e.message).slice(0, 120)}`);
      }
      if (broken && ++failStreak >= 5) { // e.g. the page crashed: open a fresh session instead of failing for hours
        failStreak = 0;
        log('5 failed calls in a row: reopening the browser session');
        try { await openSession(); } catch (e) { if (e instanceof Blocked) { if (!(await pause(e.message))) break; } else log('session reopen failed:', String(e.message).slice(0, 120)); }
        lastCall = Date.now();
      }
    }
  } catch (e) {
    log('stopping:', String(e.message).slice(0, 200));
  }
  writeAndPublish('final');
  await browser.close();
  log('done', JSON.stringify(stats));
}

module.exports = {
  decode, extractArray, parseLocationLinks, parseBookPage, buildRows, pickNext, mergeRows, seedEntries, storeWindow, taskWindow,
  openingsPath, tasksFor, stateOf, coverage, clinicDate, addDays, dayDiff, pairKeyOfRow, publish, loadPrevious,
  NEAR_DAYS, FAR_FROM, FAR_DAYS, PUBLISH_DAYS, CORE_EVERY, OTHER_EVERY, FAR_EVERY, KEEP_NEAR_MIN, KEEP_FAR_MIN, DATA_BRANCH, DATA_FILE, STATE_FILE,
};
if (require.main === module) main().catch((e) => { console.error(e); process.exit(1); });

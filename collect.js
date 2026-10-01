#!/usr/bin/env node
/**
 * Synergy availability collector (runs OUTSIDE WordPress, one central job).
 * - Real headless browser, logged out. No logins, no patient data, never touches account pages.
 * - Sequential, jittered, one treatment per discipline per location (not every treatment).
 * - Stops immediately on 403 / 429 / captcha. Never retries aggressively.
 * Usage: node collect.js [--only langley,delta] [--out availability.json] [--push]
 * Push env: WP_URL (e.g. https://synergyrehabilitation.ca) and WP_TOKEN (from WP admin page).
 */
const { chromium } = require('playwright');
const fs = require('fs');
const BASE = 'https://synergyrehab.janeapp.com';
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > -1 ? (process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : true) : d; };
const only = arg('only', '') ? String(arg('only')).split(',') : null;
const OUT = arg('out', 'availability.json');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const jitter = (a, b) => sleep(a + Math.random() * (b - a));
const PREFER_AVOID = /icbc|wcb|worksafe|mva|initial|assessment|concussion/i; // prefer a plain follow-up session as the representative treatment

class Blocked extends Error {}

(async () => {
  const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
  const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (compatible; SynergyAvailabilityBot/1.0; +https://synergyrehab.ca; marketing@synergy-rehab.ca)' });
  const page = await ctx.newPage();
  await page.route('**/*', (r) => {
    const q = r.request(); const u = new URL(q.url());
    const ok = /(^|\.)janeapp\.(com|net)$/.test(u.hostname) && !['image', 'font', 'media', 'stylesheet'].includes(q.resourceType());
    return ok ? r.continue() : r.abort();
  });
  let blocked = null;
  page.on('response', (r) => { if (/janeapp\.com/.test(r.url()) && [403, 429].includes(r.status()) && !/feature_flags/.test(r.url())) blocked = r.status() + ' ' + r.url().slice(0, 90); });

  const rows = []; const errors = []; let requests = 0;
  try {
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 30000 }); requests++;
    await page.waitForTimeout(1500);
    let slugs = await page.$$eval('a[href*="/locations/"]', (a) => [...new Set(a.map((x) => (x.getAttribute('href') || '').match(/\/locations\/([^/]+)\/book/)).filter(Boolean).map((m) => m[1]))]);
    if (only) slugs = slugs.filter((s) => only.includes(s));
    if (!slugs.length) throw new Error('No locations found on Jane home page');

    for (const slug of slugs) {
      if (blocked) throw new Blocked(blocked);
      await jitter(1500, 3500);
      try {
        await page.goto(`${BASE}/locations/${slug}/book`, { waitUntil: 'domcontentloaded', timeout: 30000 }); requests++;
        await page.waitForSelector('a[href*="#/discipline/"]', { timeout: 12000 });
        if (/captcha|verify you are human/i.test(await page.content())) throw new Blocked('captcha');
        const meta = await page.evaluate(() => {
          const h = document.body.innerText.match(/Book an Appointment at ([^\n]+)/);
          const staff = {}; document.querySelectorAll('a[href^="#/staff_member/"]').forEach((a) => { const m = a.getAttribute('href').match(/staff_member\/(\d+)$/); if (m && a.textContent.trim()) staff[m[1]] = a.textContent.trim(); });
          const tabs = [...document.querySelectorAll('a[href^="#/"]')].filter((a) => /^#\/[a-z-]+$/.test(a.getAttribute('href')) && !/team|staff/.test(a.getAttribute('href'))).map((a) => ({ name: a.textContent.trim(), href: a.getAttribute('href') }));
          return { name: h ? h[1].trim() : null, staff, tabs };
        });
        // All treatments are on the page at once, each link carries its discipline id. Group by id, name by tab order.
        const links = await page.$$eval('a[href*="#/discipline/"]', (as) => as.map((a) => ({ href: a.getAttribute('href'), text: a.innerText.replace(/\s+/g, ' ').trim() })));
        const groups = new Map();
        for (const t of links) {
          const m = t.href.match(/discipline\/(\d+)\/treatment\/(\d+)/); if (!m) continue;
          const dm = t.text.match(/(\d+)\s*minutes?/i);
          if (!groups.has(m[1])) groups.set(m[1], []);
          groups.get(m[1]).push({ d: m[1], t: m[2], name: t.text.split('Offered by')[0].trim(), minutes: dm ? +dm[1] : 0 });
        }
        const ids = [...groups.keys()];
        if (ids.length !== meta.tabs.length) { errors.push(`${slug}: discipline/tab count mismatch (${ids.length} vs ${meta.tabs.length}), skipped`); continue; }
        const disciplines = ids.map((id, i) => ({ id, name: meta.tabs[i].name, treatments: groups.get(id) }));
        for (const dsc of disciplines) {
          if (blocked) throw new Blocked(blocked);
          const rep = dsc.treatments.find((t) => !PREFER_AVOID.test(t.name)) || dsc.treatments[0];
          await jitter(800, 1800);
          const wait = page.waitForResponse((r) => r.url().includes('/api/v2/openings/for_discipline') && r.url().includes('treatment_id=' + rep.t), { timeout: 15000 }).catch(() => null);
          await page.evaluate((h) => { location.hash = h; }, `#/discipline/${dsc.id}/treatment/${rep.t}`); requests++;
          const resp = await wait; if (!resp) { errors.push(`${slug}/${dsc.name}: no openings response`); continue; }
          if (resp.status() !== 200) { errors.push(`${slug}/${dsc.name}: HTTP ${resp.status()}`); continue; }
          let list; try { list = await resp.json(); } catch (e) { errors.push(`${slug}/${dsc.name}: malformed JSON`); continue; }
          if (!Array.isArray(list)) { errors.push(`${slug}/${dsc.name}: unexpected shape`); continue; }
          for (const o of list) {
            if (o.state !== 'opening' || o.call_to_book || !o.start_at) continue;
            rows.push({ // whitelist fields only: never copy booked_patient_ids or anything else
              location: meta.name || slug, location_slug: slug, service: dsc.name, treatment: rep.name,
              practitioner: meta.staff[o.staff_member_id] || '', duration: rep.minutes || Math.round((o.duration || 0) / 60),
              datetime: o.start_at, booking_url: `${BASE}/locations/${slug}/book#/discipline/${dsc.id}/treatment/${rep.t}`, source: 'jane',
            });
          }
        }
      } catch (e) { if (e instanceof Blocked) throw e; errors.push(`${slug}: ${String(e.message).slice(0, 120)}`); }
    }
  } catch (e) {
    errors.push((e instanceof Blocked ? 'BLOCKED: ' : 'FATAL: ') + String(e.message).slice(0, 160));
  }
  await browser.close();
  fs.writeFileSync(OUT, JSON.stringify(rows));
  console.log(JSON.stringify({ rows: rows.length, requests, errors, blocked: !!blocked }));

  // Push only if we got data and were not blocked (never overwrite good cache with an empty/failed run)
  if (arg('push', false)) {
    if (blocked || !rows.length) { console.log('Not pushing (blocked or empty). Last good data stays live.'); process.exit(2); }
    const res = await fetch(process.env.WP_URL.replace(/\/$/, '') + '/wp-json/synergy/v1/ingest', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Synergy-Token': process.env.WP_TOKEN }, body: JSON.stringify(rows) });
    console.log('push', res.status, (await res.text()).slice(0, 120)); if (!res.ok) process.exit(1);
  }
})();

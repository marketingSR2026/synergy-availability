#!/usr/bin/env node
// Build WorkSafe pages from data + templates. Node 22, no dependencies.
// Usage: node build/build_pages.mjs [--mode preview|publish] [--markers on|off] [--link all|wave1|published]
// preview: renders all pages; pending claims and empty staff slots are visible (dashed) when --markers on.
// publish: renders only pages whose gates and claims pass; exits 1 with a list of blockers otherwise.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pillar, pillarMeta, pillarFaq } from '../pages/src/pillar.mjs';
import { location, locationMeta } from '../pages/src/location.mjs';
import { SITE, PILLAR_PATH, esc, openingSpec } from '../pages/src/shared.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
const MODE = arg('mode', 'preview');
const MARKERS = arg('markers', MODE === 'preview' ? 'on' : 'off') === 'on';
const LINK = arg('link', MODE === 'preview' ? 'wave1' : 'published');
const OUT = path.join(ROOT, 'pages', MODE === 'publish' ? 'publish' : 'dist');
const WAVE1 = new Set(['new-westminster', 'richmond', 'abbotsford']);

// ---------- data ----------
function parseCSV(text) {
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"' && text[i + 1] === '"') { f += '"'; i++; } else if (ch === '"') q = false; else f += ch; }
    else if (ch === '"') q = true; else if (ch === ',') { row.push(f); f = ''; }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(f); rows.push(row); row = []; f = ''; }
    else f += ch;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  const [h, ...rest] = rows.filter((r) => r.length > 1);
  return rest.map((r) => Object.fromEntries(h.map((k, i) => [k, r[i] ?? ''])));
}
const clinics = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/worksafe-locations.json'), 'utf8'));
const claims = Object.fromEntries(parseCSV(fs.readFileSync(path.join(ROOT, 'data/claims-register.csv'), 'utf8')).map((r) => [r.claim_id, r]));
const signoff = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/claims-signoff.json'), 'utf8'));
const photos = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/photos.json'), 'utf8'));
const bySlug = Object.fromEntries(clinics.map((x) => [x.page_slug, x]));
const gatesPass = (x) => Object.values(x.publish_gates).every(Boolean);
const G3_FIELDS = ['getting_here', 'parking', 'accessibility', 'languages', 'wcb_team_with_consent', 'photo_with_consent', 'nearby_workplaces'];
const janeIso = clinics.map((x) => x.wcb_data_checked_at).sort().pop();
const janeDate = new Date(janeIso).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Vancouver' });

// ---------- per-page context ----------
function makeCtx(page) {
  const used = new Map(); const blockers = []; const missing = [];
  const pendingAttr = (why) => (MARKERS ? ` data-claim-status="pending" title="${esc(why)}"` : '');
  const ctx = {
    clinics, bySlug, janeDate,
    linked: (slug) => (LINK === 'all' ? true : LINK === 'wave1' ? WAVE1.has(slug) || gatesPass(bySlug[slug]) : gatesPass(bySlug[slug])),
    href: (x) => `${PILLAR_PATH}${x.page_slug}/`,
    claim(id, html, tag = 'span', clinic = null) {
      const r = claims[id];
      if (!r) { blockers.push(`unknown claim id ${id}`); return html; }
      const rule = r.publish_rule;
      let pending = null;
      if (rule === 'DO_NOT_PUBLISH') blockers.push(`${id} is DO_NOT_PUBLISH`);
      if (rule === 'STAFF_CONFIRM' && !signoff.signed?.[id]) pending = `${id}: staff sign-off needed`;
      if ((id === 'SYN-01' || id === 'SYN-08') && clinic && !clinic.publish_gates.G1_contract) pending = `${id}: 2026 contract not confirmed for ${clinic.name} (gate G1)`;
      used.set(id, { rule, status: r.status, pending: Boolean(pending) });
      if (pending && MODE === 'publish') blockers.push(pending);
      return `<${tag} data-claim="${id}"${pending ? pendingAttr(pending) : ''}>${html}</${tag}>`;
    },
    slot(x, field, label) {
      const v = x.staff_facts?.[field];
      if (v) return esc(v);
      missing.push(field);
      return MODE === 'publish' ? '' : `<span class="sr-ws-staff-slot">Staff to confirm: ${esc(label)}</span>`;
    },
    photo(key, alt, w, h, hero = false, x = null) {
      const src = photos[key];
      const attrs = hero ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"';
      if (src) return `<img class="${hero ? 'sr-ws-hero__img' : ''}" src="${esc(src)}" width="${w}" height="${h}" alt="${alt}" ${attrs}>`;
      missing.push(`photo:${key}`);
      if (MODE === 'publish') { if (hero) blockers.push(`hero photo missing (${key})`); return ''; }
      return `<div class="${hero ? 'sr-ws-hero__img ' : ''}sr-ws-photo-slot" role="img" aria-label="Photo placeholder" style="aspect-ratio:${w}/${h}"><span>Clinic photo<br>staff to supply<br>(consent required)</span></div>`;
    },
    team(x) {
      const team = x.staff_facts?.wcb_team_with_consent;
      if (Array.isArray(team) && team.length) {
        return `<section class="sr-ws-band sr-ws-band--soft" aria-labelledby="sr-ws-team-h"><div class="sr-ws-container">
          <div class="sr-ws-head"><p class="sr-ws-eyebrow">Your team</p><h2 class="sr-ws-h2" id="sr-ws-team-h">WCB physiotherapists at ${esc(x.name)}</h2></div>
          <ul class="sr-ws-team" role="list">${team.map((p) => `<li class="sr-ws-person"><article class="sr-ws-card">
            <div class="sr-ws-person__top"><span class="sr-ws-person__mono" aria-hidden="true">${esc(p.name.split(' ').map((s) => s[0]).join('').slice(0, 2))}</span>
            <div><h3 class="sr-ws-h3 sr-ws-person__name">${esc(p.name)}</h3><p class="sr-ws-person__role">${esc(p.credential)}</p></div></div>
            <p class="sr-ws-person__text">${esc(p.focus || '')}</p>
            <ul class="sr-ws-chips" role="list">${(p.languages || []).map((l) => `<li><span class="sr-ws-pill sr-ws-pill--blue">${esc(l)}</span></li>`).join('')}</ul>
          </article><a class="sr-ws-person__foot" href="${x.jane.wcb_initial_url}">Book WCB physio at ${esc(x.name)}</a></li>`).join('')}</ul></div></section>`;
      }
      missing.push('wcb_team_with_consent');
      if (MODE === 'publish') return '';
      return `<section class="sr-ws-band sr-ws-band--soft" aria-labelledby="sr-ws-team-h"><div class="sr-ws-container">
        <div class="sr-ws-head"><p class="sr-ws-eyebrow">Your team</p><h2 class="sr-ws-h2" id="sr-ws-team-h">WCB physiotherapists at ${esc(x.name)}</h2></div>
        <p><span class="sr-ws-staff-slot">Staff to confirm: physiotherapists who treat WCB claims here and consent to a profile card (name, registration, languages, focus). This band is left out until consent is on file. Jane currently shows ${x.wcb_physios_with_openings} physiotherapist(s) with WCB openings this week.</span></p>
      </div></section>`;
    },
    asof() {
      if (signoff.checked_as_of && signoff.reviewer) return `Facts checked against worksafebc.com on ${esc(signoff.checked_as_of)}. Reviewed by ${esc(signoff.reviewer)}.`;
      if (MODE === 'publish') blockers.push('claims-signoff.json has no checked_as_of / reviewer');
      return `Sources researched November 2, 2026. <span class="sr-ws-staff-slot">Staff to confirm: date checked on worksafebc.com and reviewing physiotherapist</span>`;
    },
  };
  return { ctx, used, blockers, missing };
}

// ---------- schema ----------
const ORG = { '@type': 'MedicalOrganization', '@id': `${SITE}/#organization`, name: 'Synergy Rehabilitation', url: `${SITE}/` };
function crumbs(items) {
  return { '@type': 'BreadcrumbList', itemListElement: items.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${SITE}${p}` })) };
}
function pillarSchema(meta, ctx) {
  const url = `${SITE}${meta.path}`;
  const plain = (h) => h.replace(/<[^>]+>/g, '').replace(/&#8217;/g, '’').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  return { '@context': 'https://schema.org', '@graph': [
    ORG,
    { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: 'Synergy Rehabilitation', publisher: { '@id': `${SITE}/#organization` } },
    { '@type': 'MedicalWebPage', '@id': `${url}#webpage`, url, name: meta.title, description: meta.description, inLanguage: 'en-CA', isPartOf: { '@id': `${SITE}/#website` }, about: { '@id': `${SITE}/#organization` }, publisher: { '@id': `${SITE}/#organization` } },
    crumbs([['Home', '/'], ['WorkSafeBC physiotherapy', meta.path]]),
    { '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: pillarFaq(ctx).map(([q, a]) => ({ '@type': 'Question', name: plain(q), acceptedAnswer: { '@type': 'Answer', text: plain(a) } })) },
  ] };
}
function clinicSchema(x, meta) {
  const url = `${SITE}${meta.path}`;
  const clinic = {
    '@type': ['MedicalClinic', 'Physiotherapy'], '@id': `${url}#clinic`, name: `Synergy Rehab ${x.name}`, url,
    telephone: x.phone_e164,
    address: { '@type': 'PostalAddress', streetAddress: [x.address.street, x.address.unit].filter(Boolean).join(', '), addressLocality: x.address.city, addressRegion: 'BC', postalCode: x.address.postal, addressCountry: 'CA' },
    openingHoursSpecification: openingSpec(x.hours),
    medicalSpecialty: 'https://schema.org/Physiotherapy',
    availableService: { '@type': 'MedicalTherapy', name: 'WorkSafeBC (WCB) physiotherapy' },
    parentOrganization: { '@id': `${SITE}/#organization` },
  };
  if (x.gbp.lat && x.gbp.lng) clinic.geo = { '@type': 'GeoCoordinates', latitude: +x.gbp.lat, longitude: +x.gbp.lng };
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'MedicalWebPage', '@id': `${url}#webpage`, url, name: meta.title, description: meta.description, inLanguage: 'en-CA', about: { '@id': `${url}#clinic` }, isPartOf: { '@id': `${SITE}/#website` } },
    clinic,
    crumbs([['Home', '/'], ['WorkSafeBC physiotherapy', PILLAR_PATH], [x.name, meta.path]]),
  ] };
}

// ---------- QA helpers ----------
const text = (html) => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
const shingles = (t, n = 5) => { const w = t.toLowerCase().split(' '); const s = new Set(); for (let i = 0; i + n <= w.length; i++) s.add(w.slice(i, i + n).join(' ')); return s; };
const jaccard = (a, b) => { let i = 0; for (const x of a) if (b.has(x)) i++; return i / (a.size + b.size - i || 1); };

// ---------- preview shell ----------
const PREVIEW_CSS = `body{margin:0;background:#fff;font-family:Inter,system-ui,sans-serif}
.pv-header{position:sticky;top:0;z-index:1000;display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#fff;border-bottom:1px solid #d9e0ee;font:600 14px/1.2 Montserrat,system-ui,sans-serif;color:#16233d}
.pv-header small{font:400 12px Inter,system-ui,sans-serif;color:#4d5b73}
.pv-banner{padding:10px 16px;background:#fff8e6;color:#5a3d00;font:400 13px/1.4 Inter,system-ui,sans-serif;border-bottom:1px solid #f0d9a8}
[data-claim-status="pending"]{outline:2px dashed #c77700;outline-offset:2px;border-radius:3px}
.sr-ws-staff-slot{display:inline-block;border:2px dashed #c77700;background:#fff8e6;color:#5a3d00;padding:8px 10px;border-radius:10px;font-size:14px;line-height:1.4}
.sr-ws-photo-slot{display:flex;align-items:center;justify-content:center;width:100%;height:auto;border-radius:20px;background:repeating-linear-gradient(135deg,#e3e9f4 0 12px,#f5f7fa 12px 24px);color:#4d5b73;font:600 14px/1.4 Inter,system-ui,sans-serif;text-align:center}
.sr-ws-finder-group + .sr-ws-finder-group{margin-top:32px}`;
const ASSET_CSS = fs.readFileSync(path.join(ROOT, 'pages/assets/worksafe.css'), 'utf8');
function previewHtml(meta, fragment, schema) {
  const local = fragment
    .replace(/href="\/worksafe-physiotherapy\/([a-z-]+)\/"/g, 'href="../$1/preview.html"')
    .replace(/href="\/worksafe-physiotherapy\/(#[a-z]+)?"/g, (_, h) => `href="../pillar/preview.html${h || ''}"`)
    .replace(/href="\/worksafe-physiotherapy\/#/g, 'href="../pillar/preview.html#');
  return `<!doctype html><html lang="en-CA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(meta.title)}</title><meta name="description" content="${esc(meta.description)}"><link rel="canonical" href="${SITE}${meta.path}">
<meta name="robots" content="noindex">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Montserrat:wght@600;700&display=swap" rel="stylesheet">
<style>${ASSET_CSS}</style><style>${PREVIEW_CSS}</style>
<script type="application/ld+json">${JSON.stringify(schema)}</script></head><body>
<div class="pv-header"><span>Synergy Rehabilitation <small>(site header from the WordPress theme goes here)</small></span><small>${esc(meta.path)}</small></div>
${MARKERS ? '<div class="pv-banner">Preview. Dashed outlines mark facts waiting for staff sign-off or clinic facts staff must supply. They do not appear on the live page.</div>' : ''}
${local}
</body></html>`;
}

// ---------- build ----------
fs.rmSync(OUT, { recursive: true, force: true });
const report = { mode: MODE, built: [], skipped: [], errors: [], generated_note: 'run build/build_pages.mjs' };
const locTexts = {};
function write(meta, html, schema, used, missing, blockers, kind) {
  const dir = path.join(OUT, meta.id); fs.mkdirSync(dir, { recursive: true });
  const issues = [...blockers];
  if (/[—–]/.test(html + meta.title + meta.description)) issues.push('em or en dash found');
  if (meta.title.length > 65) issues.push(`title ${meta.title.length} chars`);
  if (meta.description.length > 165) issues.push(`meta description ${meta.description.length} chars`);
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) issues.push('H1 count is not 1');
  if (!/19\+ locations/.test(html)) issues.push('missing "19+ locations"');
  const janeLinks = [...html.matchAll(/https:\/\/synergyrehab\.janeapp\.com\/locations\/([a-z0-9-]+)\/book[^"]*/g)].map((m) => m[1]);
  const badJane = janeLinks.filter((s) => !clinics.some((c) => c.jane.slug === s));
  if (badJane.length) issues.push(`unknown Jane slugs: ${badJane.join(',')}`);
  if (MODE === 'publish' && issues.length) { report.skipped.push({ page: meta.id, issues }); return; }
  fs.writeFileSync(path.join(dir, 'fragment.html'), html);
  fs.writeFileSync(path.join(dir, 'schema.json'), JSON.stringify(schema, null, 1));
  fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify({ ...meta, canonical: `${SITE}${meta.path}` }, null, 1));
  fs.writeFileSync(path.join(dir, 'preview.html'), previewHtml(meta, html, schema));
  const t = text(html);
  if (kind === 'location') locTexts[meta.id] = t;
  report.built.push({ page: meta.id, path: meta.path, title: meta.title, title_len: meta.title.length, description_len: meta.description.length, words: t.split(' ').length,
    claims: Object.fromEntries(used), pending_claims: [...used].filter(([, v]) => v.pending).map(([k]) => k), missing_staff_facts: [...new Set(missing)], jane_links: janeLinks.length, issues });
}

{ // pillar
  const { ctx, used, blockers, missing } = makeCtx('pillar');
  const html = pillar(ctx);
  write(pillarMeta, html, pillarSchema(pillarMeta, ctx), used, missing, blockers, 'pillar');
}
for (const x of clinics) {
  if (MODE === 'publish' && !gatesPass(x)) { report.skipped.push({ page: x.page_slug, issues: Object.entries(x.publish_gates).filter(([, v]) => !v).map(([k]) => `gate ${k} false`) }); continue; }
  const { ctx, used, blockers, missing } = makeCtx(x.page_slug);
  let html = location(x, ctx);
  const filled = G3_FIELDS.filter((f) => x.staff_facts?.[f]).length;
  if (MODE === 'publish' && filled < 4) blockers.push(`G3: only ${filled} of 7 clinic facts filled (need 4)`);
  if (MODE === 'publish') html = html.replace(/<div><dt>[^<]+<\/dt><dd><\/dd><\/div>/g, '').replace(/<details class="sr-ws-faq__item"><summary class="sr-ws-faq__q">[^<]*<\/summary><div class="sr-ws-faq__a"><p><\/p><\/div><\/details>/g, '').replace(/<p><strong>When you arrive:<\/strong> <\/p>/g, '');
  const meta = locationMeta(x);
  write(meta, html, clinicSchema(x, meta), used, missing, blockers, 'location');
}
// uniqueness: max 5-word-shingle Jaccard similarity of each location page to any other
const ids = Object.keys(locTexts); const sh = Object.fromEntries(ids.map((k) => [k, shingles(locTexts[k])]));
for (const b of report.built) {
  if (!sh[b.page]) continue;
  let max = 0, with_ = null;
  for (const k of ids) if (k !== b.page) { const j = jaccard(sh[b.page], sh[k]); if (j > max) { max = j; with_ = k; } }
  b.max_similarity = +max.toFixed(3); b.most_similar_to = with_;
}
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'qa-report.json'), JSON.stringify(report, null, 1));
console.log(`mode=${MODE} markers=${MARKERS} link=${LINK} built=${report.built.length} skipped=${report.skipped.length}`);
for (const b of report.built) console.log(`  ${b.page.padEnd(24)} words=${String(b.words).padStart(4)} title=${b.title_len} desc=${b.description_len} pending=${b.pending_claims.length} missing=${b.missing_staff_facts.length} sim=${b.max_similarity ?? '-'} ${b.issues.length ? 'ISSUES: ' + b.issues.join('; ') : ''}`);
for (const s of report.skipped) console.log(`  SKIP ${s.page}: ${s.issues.join('; ')}`);
if (MODE === 'publish' && report.skipped.length) process.exitCode = 1;

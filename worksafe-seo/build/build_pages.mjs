#!/usr/bin/env node
// Build WorkSafe pages from data + templates. Node 22, no dependencies.
//
//   node build/build_pages.mjs --mode preview   -> pages/dist/<page>/preview.html (+ meta.json, schema.json). NEVER paste these.
//   node build/build_pages.mjs --mode publish   -> pages/publish/<page>/fragment.html (+ schema.json, meta.json, preview.html)
//                                                  only for pages whose gates and claims pass; exit 1 lists every blocker.
// Options: --data <dir> (default worksafe-seo/data), --out <dir>, --today YYYY-MM-DD, --markers on|off.
//
// Sources of truth
//   data/worksafe-locations.json  machine data (merge_locations.py): NAP from the client-filled list, Jane slugs/types, nearby clinics
//   data/clinic-signoff.csv       human-owned, per clinic: contract (G1), NAP sign-off (G2), clinic facts (G3), URL plan (G4),
//                                 tracking (G5), confirmed WCB services, photos with consent. merge never writes it.
//   data/claims-register.csv      every WorkSafeBC/Synergy fact; publishable only after checked_by/checked_on/quote_matches
//   data/claims-additions.csv     extra rows from article drafting (same columns), merged at load
//   data/review.json              site-level: clinical reviewer, live pages, pillar photos, privacy gate G6
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { pillar, pillarMeta, pillarFaq } from '../pages/src/pillar.mjs';
import { location, locationMeta } from '../pages/src/location.mjs';
import { SITE, PILLAR_PATH, GUIDE_PATH, RTW_PATH, AREAS, esc, ev, openingSpec, addressLine } from '../pages/src/shared.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const words = (s) => (String(s || '').trim().match(/\S+/g) || []).length;

export function parseCSV(text) {
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
  return rest.map((r) => Object.fromEntries(h.map((k, i) => [k, (r[i] ?? '').trim()])));
}

export function loadData(dataDir) {
  const read = (f) => fs.readFileSync(path.join(dataDir, f), 'utf8');
  const clinics = JSON.parse(read('worksafe-locations.json'));
  const signoff = Object.fromEntries(parseCSV(read('clinic-signoff.csv')).map((r) => [r.page_slug, r]));
  const claimRows = parseCSV(read('claims-register.csv'));
  if (fs.existsSync(path.join(dataDir, 'claims-additions.csv'))) claimRows.push(...parseCSV(read('claims-additions.csv')));
  const claims = Object.fromEntries(claimRows.map((r) => [r.claim_id, r]));
  const review = JSON.parse(read('review.json'));
  for (const x of clinics) x.signoff = signoff[x.page_slug] || {};
  return { clinics, claims, review };
}

// ---------- gates ----------
export function clinicGates(x) {
  const s = x.signoff;
  const team = s.team_json ? JSON.parse(s.team_json) : [];
  const facts = ['getting_here', 'accessibility', 'check_in', 'parking'];
  const factWords = facts.reduce((n, f) => n + words(s[f]), 0) + words(s.languages) + team.reduce((n, p) => n + words(p.focus), 0);
  return {
    G1_contract: s.contract_2026_confirmed === 'yes' && Boolean(s.vendor_number && s.contract_confirmed_by) && ISO.test(s.contract_confirmed_on || '') && ['yes', 'correction_filed'].includes(s.worksafebc_list_matches),
    G2_nap: Boolean(s.nap_signed_by) && ISO.test(s.nap_signed_on || ''),
    G3_facts: facts.every((f) => words(s[f]) >= 8) && Boolean(s.languages) && (team.length > 0 || Boolean(s.photo_hero_url && s.photo_consent_by)) && factWords >= 120,
    G4_url_plan: ISO.test(s.url_plan_done_on || ''),
    G5_tracking: ISO.test(s.tracking_added_on || ''),
  };
}
const serviceConfirmed = (x, kind) => Boolean(x.signoff[`wcb_${kind}_confirmed_by`]) && ISO.test(x.signoff[`wcb_${kind}_confirmed_on`] || '');

export function claimVerified(r, today) {
  if (!r || r.publish_rule === 'DO_NOT_PUBLISH') return false;
  if (!r.checked_by || !ISO.test(r.checked_on || '') || r.quote_matches !== 'yes') return false;
  if (r.expires_on && r.expires_on <= today) return false;
  const age = (Date.parse(today) - Date.parse(r.checked_on)) / 864e5;
  return age >= 0 && age <= 180;
}

// ---------- build ----------
export async function build(opts = {}) {
  const MODE = opts.mode || 'preview';
  const dataDir = opts.dataDir || path.join(ROOT, 'data');
  const OUT = opts.outDir || path.join(ROOT, 'pages', MODE === 'publish' ? 'publish' : MODE === 'draft' ? 'draft' : 'dist');
  const today = opts.today || new Date().toISOString().slice(0, 10);
  const MARKERS = opts.markers ?? (MODE !== 'publish');
  const DRAFT = MODE === 'draft';
  // Draft mode: same gating as preview, but writes a WordPress-pasteable fragment.html that carries a visible
  // "DRAFT, do not publish" banner and its own marker styles, for saving as a WordPress Draft (never Published).
  const DRAFT_BANNER = `<style>.sr-ws-draft-banner{position:sticky;top:0;z-index:950;padding:12px 16px;background:#fff8e6;color:#5a3d00;border:2px dashed #c77700;font:600 15px/1.4 Montserrat,system-ui,sans-serif;text-align:center}
[data-claim-status="pending"]{outline:2px dashed #c77700;outline-offset:2px;border-radius:3px}[data-claim-status="unchecked"]{outline:1px dotted #77849f;outline-offset:2px;border-radius:3px}
.sr-ws-staff-slot{display:inline-block;border:2px dashed #c77700;background:#fff8e6;color:#5a3d00;padding:8px 10px;border-radius:10px;font-size:14px;line-height:1.4}
.sr-ws-photo-slot{display:flex;align-items:center;justify-content:center;width:100%;border-radius:20px;background:repeating-linear-gradient(135deg,#e3e9f4 0 12px,#f5f7fa 12px 24px);color:#4d5b73;font:600 14px/1.4 Montserrat,system-ui,sans-serif;text-align:center}</style>
<div class="sr-ws-draft-banner" role="note">DRAFT. Do not publish. Save as Draft in WordPress only. Dashed items still need staff sign-off.</div>`;
  const write = opts.write !== false;
  const { clinics, claims, review } = loadData(dataDir);
  const bySlug = Object.fromEntries(clinics.map((x) => [x.page_slug, x]));
  for (const x of clinics) x.gates = clinicGates(x);
  const pub = MODE === 'publish';
  const gatesPass = (x) => Object.values(x.gates).every(Boolean);
  const G6 = Boolean(review.privacy_gate_G6?.confirmed_by) && ISO.test(review.privacy_gate_G6?.confirmed_on || '');
  const reviewerOk = Boolean(review.reviewer?.name && review.reviewer?.credential);
  const wcbOk = (x) => x.gates.G1_contract;
  const janeIso = clinics.map((x) => x.wcb_data_checked_at).sort().pop();

  function makeCtx(pageId) {
    const used = new Map(); const blockers = []; const missing = []; const pendingMarks = [];
    const mark = (kind, why) => { pendingMarks.push(why); return MARKERS ? ` data-claim-status="${kind}" title="${esc(why)}"` : ''; };
    const linked = (t) => (pub ? gatesPass(t) : ['1', '1b'].includes(t.signoff.wave) || gatesPass(t));
    const ctx = {
      clinics, bySlug,
      listInFinder: (x) => (pub ? wcbOk(x) : true),
      link: (key) => (key === 'pillar' ? PILLAR_PATH : review.live_pages?.[key] ? (key === 'guide' ? GUIDE_PATH : RTW_PATH) : null),
      bookUrl: (x) => `https://synergyrehab.janeapp.com/locations/${x.jane.slug}/book#/discipline/3/treatment/${x.signoff.wcb_initial_treatment_id || 442}`,
      claim(id, html, tag = 'span') {
        const r = claims[id];
        if (!r) { blockers.push(`unknown claim id ${id}`); return html; }
        if (r.publish_rule === 'DO_NOT_PUBLISH') blockers.push(`${id} is DO_NOT_PUBLISH`);
        const ok = claimVerified(r, today);
        used.set(id, { rule: r.publish_rule, status: r.status, verified: ok });
        let attr = '';
        if (!ok) {
          const why = r.publish_rule === 'OK_TO_PUBLISH' ? `${id}: open the official page and record checked_by/checked_on/quote_matches` : `${id} (${r.publish_rule}): needs staff decision and verification`;
          if (pub) blockers.push(why);
          attr = mark(r.publish_rule === 'OK_TO_PUBLISH' ? 'unchecked' : 'pending', why);
        }
        return `<${tag} data-claim="${id}"${attr}>${html}</${tag}>`;
      },
      contractClaim(x, html, id = 'SYN-01') {
        const why = `${id}: 2026 WorkSafeBC contract not confirmed for ${x.name} (gate G1)`;
        if (!wcbOk(x)) { if (pub) blockers.push(why); }
        if (id !== 'SYN-01') ctx.claim(id, '');
        return `<span data-claim="${id}"${wcbOk(x) ? '' : mark('pending', why)}>${html}</span>`;
      },
      service: (x, kind) => (pub ? serviceConfirmed(x, kind) : x[`wcb_${kind}_bookable`] || serviceConfirmed(x, kind)),
      serviceClaim(x, kind, html) {
        const ok = serviceConfirmed(x, kind);
        const why = `WCB ${kind} at ${x.name}: Jane shows it bookable; ops must confirm the clinic bills WorkSafeBC for it`;
        if (!ok && pub) blockers.push(why);
        return `<span data-claim="SVC-${kind}"${ok ? '' : mark('pending', why)}>${html}</span>`;
      },
      nearbyWcb: (x) => x.nearby.map((n) => ({ ...n, clinic: bySlug[n.slug] })).filter((n) => n.clinic && ctx.listInFinder(n.clinic)),
      clinicAnchor(t, placement, pageType, label = t.name) {
        const own = linked(t);
        const href = own ? `${PILLAR_PATH}${t.page_slug}/` : ctx.bookUrl(t);
        return `<a href="${esc(href)}" ${ev(own ? 'worksafe_location_select' : 'worksafe_book_click', t.page_slug, placement, pageType)}>${esc(label)}</a>`;
      },
      clinicCard(t, sub, placement, pageType) {
        const own = linked(t);
        const href = own ? `${PILLAR_PATH}${t.page_slug}/` : ctx.bookUrl(t);
        const cta = own ? `WorkSafe physio at ${esc(t.name)}` : `Book WCB physio at ${esc(t.name)}`;
        const flag = wcbOk(t) ? '' : mark('pending', `${t.name}: hidden on the live page until its 2026 contract is confirmed (G1)`);
        return `<li class="sr-ws-card sr-ws-card--soft sr-ws-card--interactive sr-ws-loccard"${flag}>
          <h4 class="sr-ws-h4 sr-ws-card__title"><a class="sr-ws-card__link" href="${esc(href)}" ${ev(own ? 'worksafe_location_select' : 'worksafe_book_click', t.page_slug, placement, pageType)}>Synergy Rehab ${esc(t.name)}</a></h4>
          <p class="sr-ws-loccard__area">${sub}</p><span class="sr-ws-loccard__cta">${cta}</span></li>`;
      },
      // Compact finder (guide, rtw): chips grouped by the AREAS groups, west to east, each with a small visible area label.
      // Surrey neighbourhood chips read "<Name>, Surrey" when the clinic's own area_label already says Surrey.
      finderCompact() {
        const pt = pageId === 'guide' || pageId === 'rtw' ? 'article' : 'pillar';
        const chip = (x) => (/\bSurrey\b/.test(x.area_label) && !/\bSurrey\b/.test(x.name) ? `${x.name}, Surrey` : x.name);
        const groups = AREAS.map(([area, slugs]) => [area, slugs.map((s) => bySlug[s]).filter((x) => x && ctx.listInFinder(x))]).filter(([, l]) => l.length);
        return `<p class="sr-ws-h4" id="sr-ws-finder-h">${ctx.claim('SYN-JANE', 'Book WCB physio online at a Synergy Rehab clinic near home or work')}</p>
    <div class="sr-ws-finder-areas">${groups.map(([area, list]) => { const id = `sr-ws-finder-${area.toLowerCase().replace(/[^a-z]+/g, '-').replace(/-+$/, '')}`;
      return `<div class="sr-ws-finder-area"><p class="sr-ws-label" id="${id}">${esc(area)}</p><ul class="sr-ws-chips" role="list" aria-labelledby="${id}">${list.map((x) => `<li>${ctx.clinicAnchor(x, 'finder', pt, chip(x)).replace('<a ', '<a class="sr-ws-chip" ')}</li>`).join('')}</ul></div>`; }).join('')}</div>`;
      },
      slot(x, field, label) {
        const v = x.signoff?.[field];
        if (v) return esc(v);
        missing.push(field);
        return pub ? '' : `<span class="sr-ws-staff-slot">Staff to confirm: ${esc(label)}</span>`;
      },
      photo(x, which, alt, w, h, hero = false) {
        const src = x.signoff?.[`photo_${which}_url`];
        const consent = x.signoff?.photo_consent_by;
        return ctx._img(src && consent ? src : null, `${x.page_slug}_${which}`, alt, w, h, hero);
      },
      pillarPhoto(key, alt, w, h, hero = false) {
        const src = review.pillar_photos?.[key];
        return ctx._img(src && review.pillar_photos?.consent_by ? src : null, key, alt, w, h, hero);
      },
      _img(src, key, alt, w, h, hero) {
        const attrs = hero ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"';
        if (src) return `<img class="${hero ? 'sr-ws-hero__img' : ''}" src="${esc(src)}" width="${w}" height="${h}" alt="${alt}" ${attrs}>`;
        missing.push(`photo:${key}`);
        if (pub) return '';
        return `<div class="${hero ? 'sr-ws-hero__img ' : ''}sr-ws-photo-slot" role="img" aria-label="Photo placeholder" style="aspect-ratio:${w}/${h}"><span>Clinic photo<br>staff to supply<br>(consent required)</span></div>`;
      },
      team(x) {
        const team = x.signoff?.team_json ? JSON.parse(x.signoff.team_json) : [];
        if (team.length) {
          return `<section class="sr-ws-band sr-ws-band--soft" aria-labelledby="sr-ws-team-h"><div class="sr-ws-container">
            <div class="sr-ws-head"><p class="sr-ws-eyebrow">Your team</p><h2 class="sr-ws-h2" id="sr-ws-team-h">Physiotherapists at ${esc(x.name)}</h2></div>
            <ul class="sr-ws-team" role="list">${team.map((p) => `<li class="sr-ws-person"><article class="sr-ws-card">
              <div class="sr-ws-person__top"><span class="sr-ws-person__mono" aria-hidden="true">${esc(p.name.split(' ').map((s) => s[0]).join('').slice(0, 2))}</span>
              <div><h3 class="sr-ws-h3 sr-ws-person__name">${esc(p.name)}</h3><p class="sr-ws-person__role">${esc(p.credential)}</p></div></div>
              ${p.focus ? `<p class="sr-ws-person__text">${esc(p.focus)}</p>` : ''}
              <ul class="sr-ws-chips" role="list">${(p.languages || []).map((l) => `<li><span class="sr-ws-pill sr-ws-pill--blue">${esc(l)}</span></li>`).join('')}</ul>
            </article><a class="sr-ws-person__foot" href="${ctx.bookUrl(x)}">Book WCB physio at ${esc(x.name)}</a></li>`).join('')}</ul></div></section>`;
        }
        missing.push('team_json');
        if (pub) return '';
        return `<section class="sr-ws-band sr-ws-band--soft" aria-labelledby="sr-ws-team-h"><div class="sr-ws-container">
          <div class="sr-ws-head"><p class="sr-ws-eyebrow">Your team</p><h2 class="sr-ws-h2" id="sr-ws-team-h">Physiotherapists at ${esc(x.name)}</h2></div>
          <p><span class="sr-ws-staff-slot">Staff to confirm: physiotherapists who see WCB claims here and have signed written consent for a profile card (name, CHCPBC registration checked, languages). Left out until consent is on file.</span></p>
        </div></section>`;
      },
      asof: () => '%%ASOF%%',
    };
    const finish = (html) => {
      const dates = [...used.keys()].map((k) => claims[k]?.checked_on).filter((d) => ISO.test(d || '')).sort();
      let line;
      if (reviewerOk && dates.length && ![...used.values()].some((v) => !v.verified)) {
        line = `Facts checked against worksafebc.com between ${dates[0]} and ${dates[dates.length - 1]}. Reviewed by ${esc(review.reviewer.name)}, ${esc(review.reviewer.credential)}.`;
      } else {
        if (pub) blockers.push('reviewer or claim check dates missing for the as-of line');
        line = `Sources researched November 2, 2026. <span class="sr-ws-staff-slot">Staff to confirm: date each fact was checked on worksafebc.com and the reviewing physiotherapist</span>`;
      }
      return html.split('%%ASOF%%').join(line);
    };
    return { ctx, used, blockers, missing, pendingMarks, finish };
  }

  // ---------- schema ----------
  // ORG and WEBSITE are declared in every page graph (pillar, clinics, articles) so @id references resolve on each page.
  const ORG = { '@type': 'MedicalOrganization', '@id': `${SITE}/#organization`, name: 'Synergy Rehabilitation', alternateName: 'Synergy Rehab', url: `${SITE}/`,
    ...(review.org_logo_url ? { logo: { '@type': 'ImageObject', url: review.org_logo_url } } : {}) };
  const WEBSITE = { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: 'Synergy Rehabilitation', publisher: { '@id': `${SITE}/#organization` } };
  // dateModified is the content date a human sets in review.json (content_updated_on), never the build date; omitted when unset.
  const contentUpdated = ISO.test(review.content_updated_on || '') ? review.content_updated_on : null;
  // WorkSafeBC as a referenced entity: name and official domain only. Its WCB names appear only once GEN-01 is verified.
  const WSBC = { '@type': 'Organization', name: 'WorkSafeBC', url: 'https://www.worksafebc.com/',
    ...(claimVerified(claims['GEN-01'], today) ? { alternateName: ['WCB', "Workers' Compensation Board of British Columbia"] } : {}) };
  const crumbs = (items) => ({ '@type': 'BreadcrumbList', itemListElement: items.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${SITE}${p}` })) });
  const plain = (h) => h.replace(/<[^>]+>/g, '').replace(/&#8217;/g, '’').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  // reviewedBy uses the same review.json reviewer as the visible as-of line (publish builds only when every claim is verified).
  const page = (meta, about, extra = {}) => ({ '@type': 'MedicalWebPage', '@id': `${SITE}${meta.path}#webpage`, url: `${SITE}${meta.path}`, name: meta.title, description: meta.description, inLanguage: 'en-CA', ...(contentUpdated ? { dateModified: contentUpdated } : {}),
    isPartOf: { '@id': `${SITE}/#website` }, publisher: { '@id': `${SITE}/#organization` }, about, ...(about === WSBC ? {} : { mentions: WSBC }),
    ...(reviewerOk ? { reviewedBy: { '@type': 'Person', name: review.reviewer.name, jobTitle: review.reviewer.credential } } : {}), ...extra });
  const clinicNode = (x) => {
    const node = {
      '@type': ['MedicalClinic', 'Physiotherapy'], '@id': `${SITE}/#clinic-${x.jane.slug}`, name: `Synergy Rehab ${x.name}`,
      url: x.existing_pages.clinic || `${SITE}${PILLAR_PATH}${x.page_slug}/`, telephone: x.phone_e164,
      address: { '@type': 'PostalAddress', streetAddress: [x.address.unit, x.address.street].filter(Boolean).join(', '), addressLocality: x.address.city, addressRegion: 'BC', postalCode: x.address.postal, addressCountry: 'CA' },
      openingHoursSpecification: openingSpec(x.hours), medicalSpecialty: 'https://schema.org/Physiotherapy',
      parentOrganization: { '@id': `${SITE}/#organization` },
    };
    // WCB services in schema read the clinic's G1 and the ops-confirmed services, exactly like the visible page.
    if (wcbOk(x)) node.availableService = [{ '@type': 'PhysicalTherapy', name: 'WorkSafeBC (WCB) physiotherapy' },
      ...['massage', 'acupuncture'].filter((k) => serviceConfirmed(x, k)).map((k) => ({ '@type': 'MedicalTherapy', name: k === 'massage' ? 'WorkSafeBC (WCB) massage therapy' : 'WorkSafeBC (WCB) acupuncture' }))];
    if (x.gbp.lat && x.gbp.lng) node.geo = { '@type': 'GeoCoordinates', latitude: +x.gbp.lat, longitude: +x.gbp.lng };
    if (x.gbp.maps_url) { node.hasMap = x.gbp.maps_url; node.sameAs = [x.gbp.maps_url]; }
    if (x.signoff.photo_hero_url && x.signoff.photo_consent_by) node.image = x.signoff.photo_hero_url;
    return node;
  };

  // ---------- QA ----------
  const text = (html) => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
  const shingles = (t, n = 5) => { const w = t.toLowerCase().split(' '); const s = new Set(); for (let i = 0; i + n <= w.length; i++) s.add(w.slice(i, i + n).join(' ')); return s; };
  const jaccard = (a, b) => { let i = 0; for (const x of a) if (b.has(x)) i++; return i / (a.size + b.size - i || 1); };
  function lint(meta, html) {
    const issues = [], warnings = [];
    const all = html + meta.title + meta.description;
    if (/[—–]/.test(all)) issues.push('em or en dash found');
    if (/\bicbc\b/i.test(text(html) + meta.title)) issues.push('ICBC mentioned (WorkSafe-only scope)');
    if (/(worksafebc|wcb)[\s-]+approved|approved\s+(physio|provider|clinic|physiotherapist)/i.test(text(html) + meta.title)) issues.push('"approved" wording (WorkSafeBC contracts providers)');
    if (meta.title.length > 62) issues.push(`title ${meta.title.length} chars`);
    if (meta.description.length > 160) issues.push(`meta description ${meta.description.length} chars`);
    if ((html.match(/<h1[\s>]/g) || []).length !== 1) issues.push('H1 count is not 1');
    if (!/19\+ locations/.test(html)) issues.push('missing "19+ locations"');
    if (/\b\d+\s+(physio(therapy)?\s+)?(visits|sessions|treatments)\b/i.test(text(html).replace(/up to 6 treatments/g, ''))) warnings.push('a visit or session count appears; check it is cleared (WSBC-18)');
    const janeSlugs = [...html.matchAll(/https:\/\/synergyrehab\.janeapp\.com\/locations\/([a-z0-9-]+)\/book[^"]*/g)].map((m) => m[1]);
    const bad = janeSlugs.filter((s) => !clinics.some((c) => c.jane.slug === s));
    if (bad.length) issues.push(`unknown Jane slugs: ${[...new Set(bad)].join(',')}`);
    if (/Staff to confirm|data-claim-status/.test(html) && pub) issues.push('preview placeholder left in publish output');
    const untagged = text(html.replace(/<span data-claim="[^"]*"[^>]*>[\s\S]*?<\/span>/g, ' ')).split(/(?<=[.?!])\s+/)
      .filter((s) => /\b(pay|fees?|bill(s|ed)?|covers?|covered|referral|reimburse\w*|pre-approval|approve)\b/i.test(s)).slice(0, 10);
    if (untagged.length) warnings.push(...untagged.map((s) => `untagged coverage wording: "${s.slice(0, 120)}"`));
    return { issues, warnings, janeLinks: janeSlugs.length };
  }

  // ---------- preview shell ----------
  const PREVIEW_CSS = `body{margin:0;background:#fff}
.pv-header{position:sticky;top:0;z-index:1000;display:flex;align-items:center;justify-content:space-between;gap:12px;height:56px;padding:0 16px;background:#fff;border-bottom:1px solid #d9e0ee;font:600 15px/1.2 Montserrat,system-ui,sans-serif;color:#16233d;box-sizing:border-box}
.pv-header small{font:400 12px Montserrat,system-ui,sans-serif;color:#4d5b73;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pv-banner{padding:8px 16px;background:#fff8e6;color:#5a3d00;font:400 13px/1.4 Montserrat,system-ui,sans-serif;border-bottom:1px solid #f0d9a8}
[data-claim-status="pending"]{outline:2px dashed #c77700;outline-offset:2px;border-radius:3px}
[data-claim-status="unchecked"]{outline:1px dotted #77849f;outline-offset:2px;border-radius:3px}
.sr-ws-staff-slot{display:inline-block;border:2px dashed #c77700;background:#fff8e6;color:#5a3d00;padding:8px 10px;border-radius:10px;font-size:14px;line-height:1.4}
.sr-ws-photo-slot{display:flex;align-items:center;justify-content:center;width:100%;height:auto;border-radius:20px;background:repeating-linear-gradient(135deg,#e3e9f4 0 12px,#f5f7fa 12px 24px);color:#4d5b73;font:600 14px/1.4 Montserrat,system-ui,sans-serif;text-align:center}`;
  const ASSET_CSS = fs.readFileSync(path.join(ROOT, 'pages/assets/worksafe.css'), 'utf8');
  function previewHtml(meta, fragment, schema) {
    const local = fragment
      .replace(/href="\/worksafe-physiotherapy\/([a-z-]+)\/"/g, 'href="../$1/preview.html"')
      .replace(/href="\/worksafe-physiotherapy\/(#[a-z-]+)?"/g, (_, h) => `href="../pillar/preview.html${h || ''}"`)
      .replace(/href="\/worksafebc-physiotherapy-what-is-covered\/"/g, 'href="../guide/preview.html"')
      .replace(/href="\/return-to-work-after-a-workplace-injury\/"/g, 'href="../rtw/preview.html"');
    return `<!doctype html><html lang="en-CA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(meta.title)}</title><meta name="description" content="${esc(meta.description)}"><link rel="canonical" href="${SITE}${meta.path}"><meta name="robots" content="noindex">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">
<style>${ASSET_CSS}</style><style>${PREVIEW_CSS}</style>
<script type="application/ld+json">${JSON.stringify(schema)}</script></head><body>
<div class="pv-header"><span>Synergy Rehabilitation</span><small>theme header &middot; ${esc(meta.path)}</small></div>
${MARKERS ? '<div class="pv-banner">Preview only. Amber dashes: waiting for a staff decision or clinic fact. Grey dots: official source not yet opened and recorded. Neither appears on the live page.</div>' : ''}
${local}
</body></html>`;
  }

  // ---------- render ----------
  const report = { mode: MODE, today, built: [], skipped: [], site_gates: { G6_privacy: G6, reviewer: reviewerOk } };
  const outputs = [];
  function emit(meta, rawHtml, schema, r, kind, extraBlockers = []) {
    for (const id of meta.claims || []) r.ctx.claim(id, ''); // facts stated in the title or meta description go through the same checks
    const html = r.finish(rawHtml);
    // citation mirrors the visible Sources list exactly (same URLs and titles, nothing added).
    const wp = schema['@graph'].find((n) => n['@id'] === `${SITE}${meta.path}#webpage`);
    const cites = [...html.matchAll(/<ol class="sr-ws-sources">([\s\S]*?)<\/ol>/g)].flatMap((o) => [...o[1].matchAll(/<a href="([^"]+)">([^<]+)<\/a>/g)])
      .map(([, u, t]) => ({ '@type': 'WebPage', name: t.replace(/&amp;/g, '&'), url: u.replace(/&amp;/g, '&') }));
    if (wp && cites.length) wp.citation = cites;
    const { issues, warnings, janeLinks } = lint(meta, html);
    const blockers = [...new Set([...r.blockers, ...extraBlockers, ...(pub ? issues : [])])];
    const entry = { page: meta.id, kind, path: meta.path, title: meta.title, title_len: meta.title.length, description_len: meta.description.length,
      words: text(html).split(' ').length, claims: Object.fromEntries(r.used), unverified_claims: [...r.used].filter(([, v]) => !v.verified).map(([k]) => k),
      missing: [...new Set(r.missing)], jane_links: janeLinks, issues, warnings };
    if (pub && blockers.length) { report.skipped.push({ page: meta.id, blockers }); return; }
    outputs.push({ meta, html, schema, kind, entry });
  }
  { const r = makeCtx('pillar'); const html = pillar(r.ctx);
    const extra = pub ? [...(G6 ? [] : ['G6 privacy gate not confirmed (review.json)']), ...(clinics.some(wcbOk) ? [] : ['no clinic has G1 (contract) confirmed'])] : [];
    emit(pillarMeta, html, { '@context': 'https://schema.org', '@graph': [ORG, WEBSITE,
      page(pillarMeta, { '@id': `${SITE}/#organization` }), crumbs([['Home', '/'], ['WorkSafeBC physiotherapy', PILLAR_PATH]]),
      { '@type': 'ItemList', '@id': `${SITE}${PILLAR_PATH}#clinics`, name: 'Synergy Rehab clinics for WorkSafeBC physiotherapy',
        itemListElement: clinics.filter((x) => r.ctx.listInFinder(x)).map((x, i) => ({ '@type': 'ListItem', position: i + 1, item: (({ openingHoursSpecification, ...n }) => n)(clinicNode(x)) })) },
      { '@type': 'FAQPage', '@id': `${SITE}${PILLAR_PATH}#faq`, isPartOf: { '@id': `${SITE}${PILLAR_PATH}#webpage` }, mainEntity: pillarFaq(r.ctx).map(([q, a]) => ({ '@type': 'Question', name: plain(q), acceptedAnswer: { '@type': 'Answer', text: plain(r.finish(a)) } })) }] }, r, 'pillar', extra); }
  for (const x of clinics) {
    if (pub && !gatesPass(x)) { report.skipped.push({ page: x.page_slug, blockers: Object.entries(x.gates).filter(([, v]) => !v).map(([k]) => `gate ${k} not met`) }); continue; }
    const r = makeCtx(x.page_slug);
    // NAP check against the KNOWN Google Business Profile postal code (merge_locations.py): flag it for the G2 signer, never auto-fix.
    if (x.gbp.postal && x.gbp.postal !== x.address.postal) r.missing.push(`nap:postalCode ${x.address.postal} differs from GBP ${x.gbp.postal}; resolve at G2 (fix the page data or the GBP) before publishing`);
    let html = location(x, r.ctx);
    if (pub) html = html.replace(/<div><dt>[^<]+<\/dt><dd><\/dd><\/div>/g, '').replace(/<details class="sr-ws-faq__item"><summary class="sr-ws-faq__q">[^<]*<\/summary><div class="sr-ws-faq__a"><p><\/p><\/div><\/details>/g, '');
    const meta = locationMeta(x);
    emit(meta, html, { '@context': 'https://schema.org', '@graph': [ORG, WEBSITE, page(meta, { '@id': `${SITE}/#clinic-${x.jane.slug}` }), clinicNode(x), crumbs([['Home', '/'], ['WorkSafeBC physiotherapy', PILLAR_PATH], [x.name, meta.path]])] }, r, 'location', pub && !G6 ? ['G6 privacy gate not confirmed (review.json)'] : []);
  }
  for (const mod of ['guide', 'rtw']) {
    const file = path.join(ROOT, 'pages/src', `${mod}.mjs`);
    if (!fs.existsSync(file)) continue;
    const m = await import(pathToFileURL(file).href);
    const r = makeCtx(mod);
    const raw = m.render(r.ctx);
    const crumbName = plain((raw.match(/<span aria-current="page">([^<]+)<\/span>/) || [null, m.meta.h1])[1]);
    const faqFn = m.guideFaq || m.rtwFaq;
    emit(m.meta, raw, { '@context': 'https://schema.org', '@graph': [ORG, WEBSITE, page(m.meta, WSBC), crumbs([['Home', '/'], ['WorkSafeBC physiotherapy', PILLAR_PATH], [crumbName, m.meta.path]]),
      ...(faqFn ? [{ '@type': 'FAQPage', '@id': `${SITE}${m.meta.path}#faq`, isPartOf: { '@id': `${SITE}${m.meta.path}#webpage` }, mainEntity: faqFn(r.ctx).map(([q, a]) => ({ '@type': 'Question', name: plain(q), acceptedAnswer: { '@type': 'Answer', text: plain(r.finish(a)) } })) }] : [])] }, r, 'article', pub && !G6 ? ['G6 privacy gate not confirmed (review.json)'] : []);
  }
  // uniqueness across location pages in this run
  const locs = outputs.filter((o) => o.kind === 'location'); const sh = new Map(locs.map((o) => [o.meta.id, shingles(text(o.html))]));
  for (const o of locs) {
    let max = 0, w = null;
    for (const [k, s] of sh) if (k !== o.meta.id) { const j = jaccard(sh.get(o.meta.id), s); if (j > max) { max = j; w = k; } }
    o.entry.max_similarity = +max.toFixed(3); o.entry.most_similar_to = w;
  }
  const final = [];
  for (const o of outputs) {
    if (pub && o.kind === 'location' && o.entry.max_similarity > 0.4) { report.skipped.push({ page: o.meta.id, blockers: [`too similar to ${o.entry.most_similar_to} (${o.entry.max_similarity} > 0.40)`] }); continue; }
    final.push(o); report.built.push(o.entry);
  }
  // Orphan check: every built page except the pillar (sitewide "Worksafe" menu) needs a link from another page built in this run.
  for (const o of final) {
    if (o.kind === 'pillar') continue;
    const p = o.meta.path;
    o.entry.inbound_from = final.filter((f) => f !== o && (f.html.includes(`href="${p}"`) || f.html.includes(`href="${p}#`))).map((f) => f.meta.id);
    if (!o.entry.inbound_from.length) o.entry.warnings.push(`orphan: no other built page links to ${p}; set live_pages in data/review.json or finish the clinic gates, then rebuild and re-paste the linking pages`);
  }
  if (write) {
    fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
    for (const o of final) {
      const dir = path.join(OUT, o.meta.id); fs.mkdirSync(dir, { recursive: true });
      if (pub) fs.writeFileSync(path.join(dir, 'fragment.html'), o.html);
      if (DRAFT) fs.writeFileSync(path.join(dir, 'fragment.html'), DRAFT_BANNER + '\n' + o.html);
      fs.writeFileSync(path.join(dir, 'schema.json'), JSON.stringify(o.schema, null, 1));
      fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify({ ...o.meta, canonical: `${SITE}${o.meta.path}`, robots: DRAFT ? 'noindex,nofollow (draft)' : 'index,follow', ...(DRAFT ? { wordpress_status: 'draft (do not publish)' } : {}) }, null, 1));
      fs.writeFileSync(path.join(dir, 'preview.html'), previewHtml(o.meta, DRAFT ? DRAFT_BANNER + '\n' + o.html : o.html, o.schema));
    }
    fs.writeFileSync(path.join(OUT, 'qa-report.json'), JSON.stringify(report, null, 1));
  }
  return { report, outputs: final };
}

// ---------- CLI ----------
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
  const mode = arg('mode', 'preview');
  const { report } = await build({ mode, dataDir: arg('data'), outDir: arg('out'), today: arg('today'), markers: arg('markers') ? arg('markers') === 'on' : undefined });
  console.log(`mode=${mode} today=${report.today} built=${report.built.length} skipped=${report.skipped.length} G6=${report.site_gates.G6_privacy} reviewer=${report.site_gates.reviewer}`);
  for (const b of report.built) console.log(`  ${b.page.padEnd(24)} words=${String(b.words).padStart(4)} title=${b.title_len} desc=${b.description_len} unverified=${b.unverified_claims.length} missing=${b.missing.length} sim=${b.max_similarity ?? '-'}${b.issues.length ? ' ISSUES: ' + b.issues.join('; ') : ''}${b.warnings.length ? ` warnings=${b.warnings.length}` : ''}`);
  for (const s of report.skipped) console.log(`  SKIP ${s.page}: ${s.blockers.slice(0, 4).join('; ')}${s.blockers.length > 4 ? ` (+${s.blockers.length - 4} more)` : ''}`);
  if (mode === 'publish' && report.skipped.length) process.exitCode = 1;
}

// Run: node --test build/test/   (from worksafe-seo/). Uses a temp copy of data/ so real files are never touched.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, parseCSV, claimVerified } from '../build_pages.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const TODAY = '2026-11-02';
const csvLine = (cols, r) => cols.map((c) => `"${String(r[c] ?? '').replace(/"/g, '""')}"`).join(',');
const writeCSV = (file, rows) => { const cols = Object.keys(rows[0]); fs.writeFileSync(file, [cols.join(','), ...rows.map((r) => csvLine(cols, r))].join('\n') + '\n'); };

function fixture({ verifyAll = true, contract = ['new-westminster', 'richmond'], facts = ['new-westminster', 'richmond'], g6 = true, mutate } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ws-fixture-'));
  for (const f of ['worksafe-locations.json', 'review.json']) fs.copyFileSync(path.join(ROOT, 'data', f), path.join(dir, f));
  const claims = parseCSV(fs.readFileSync(path.join(ROOT, 'data/claims-register.csv'), 'utf8'));
  const extra = fs.existsSync(path.join(ROOT, 'data/claims-additions.csv')) ? parseCSV(fs.readFileSync(path.join(ROOT, 'data/claims-additions.csv'), 'utf8')) : [];
  const all = [...claims, ...extra].map((r) => ({ ...r, ...(verifyAll && r.publish_rule !== 'DO_NOT_PUBLISH' ? { checked_by: 'Test Ops', checked_on: '2026-10-30', quote_matches: 'yes' } : {}) }));
  const so = parseCSV(fs.readFileSync(path.join(ROOT, 'data/clinic-signoff.csv'), 'utf8'));
  const UNIQUE = {
    'new-westminster': ['Take SkyTrain to Columbia Station, walk two blocks east along Columbia Street and enter through the glass lobby doors beside the pharmacy, then ride the elevator to the fourth floor.', 'Paid street parking on Columbia Street and a public lot behind the building on Begbie Street with two hour limits on weekdays.', 'Step-free lobby entrance from Columbia Street, two elevators to suite 405 and an accessible washroom inside the clinic beside the front desk.', 'Check in at the fourth floor front desk, show photo identification, fill a short intake form on a tablet and your physiotherapist will meet you in the waiting area.', 'English, Punjabi, Hindi and Tagalog'],
    richmond: ['The clinic sits inside Ironwood Plaza near the corner of Steveston Highway and Number Five Road, with bus stops for the 401 and 407 routes outside the plaza.', 'Free surface parking across Ironwood Plaza with plenty of spaces near the main doors, including marked accessible stalls close to the entrance.', 'Ground level entrance with automatic doors, wide hallways inside the unit and an accessible washroom at the end of the treatment corridor.', 'Walk in through unit 8060, check in with reception on the left, confirm your employer and injury date, then wait in the bright seating area by the window.', 'English, Cantonese and Mandarin. Ask for a Cantonese-speaking physiotherapist when you book and the front desk will match you where they can.'],
  };
  for (const r of so) {
    if (contract.includes(r.page_slug)) Object.assign(r, { contract_2026_confirmed: 'yes', legal_entity: 'Test Entity Ltd', vendor_number: 'V123', contract_confirmed_by: 'Ops Lead', contract_confirmed_on: '2026-10-20', worksafebc_list_matches: 'yes', nap_signed_by: 'Manager', nap_signed_on: '2026-10-21', url_plan_done_on: '2026-10-22', tracking_added_on: '2026-10-23' });
    if (facts.includes(r.page_slug)) {
      const [g, p, a, c, l] = UNIQUE[r.page_slug];
      Object.assign(r, { getting_here: g, parking: p, accessibility: a, check_in: c, languages: l, team_json: JSON.stringify([{ name: 'Test Physio', credential: 'Registered Physiotherapist', languages: ['English'], focus: 'Lifting injuries in warehouse and trades work, with graded strength work for shift duties.' }]) });
    }
  }
  if (mutate) mutate({ claims: all, signoff: so });
  writeCSV(path.join(dir, 'claims-register.csv'), all.map((r) => Object.fromEntries(Object.keys(claims[0]).map((k) => [k, r[k] ?? '']))));
  writeCSV(path.join(dir, 'clinic-signoff.csv'), so);
  const review = JSON.parse(fs.readFileSync(path.join(dir, 'review.json'), 'utf8'));
  review.reviewer = { name: 'Test Reviewer', credential: 'PT', reviewed_on: '2026-10-31' };
  if (g6) review.privacy_gate_G6 = { confirmed_by: 'Marketing', confirmed_on: '2026-10-31' };
  fs.writeFileSync(path.join(dir, 'review.json'), JSON.stringify(review));
  return dir;
}
const run = (dir, mode = 'publish') => build({ mode, dataDir: dir, today: TODAY, write: false });

test('happy path: pillar and two gated clinics publish, ungated clinics are skipped', async () => {
  const { report, outputs } = await run(fixture());
  const built = report.built.map((b) => b.page);
  assert.ok(built.includes('pillar'), JSON.stringify(report.skipped.find((s) => s.page === 'pillar')));
  assert.ok(built.includes('new-westminster') && built.includes('richmond'), JSON.stringify(report.skipped.slice(0, 3)));
  assert.ok(!built.includes('cedar-hills-surrey'));
  for (const o of outputs) {
    assert.doesNotMatch(o.html, /Staff to confirm|data-claim-status|[—–]/);
    assert.equal((o.html.match(/<h1[\s>]/g) || []).length, 1);
  }
});

test('pillar finder shows only clinics with G1 confirmed', async () => {
  const { outputs } = await run(fixture());
  const p = outputs.find((o) => o.meta.id === 'pillar').html;
  assert.match(p, /Synergy Rehab New Westminster/);
  assert.doesNotMatch(p, /Synergy Rehab Cedar Hills/);
  assert.doesNotMatch(p, /locations\/cedar-hills\/book/);
});

test('nearby block never links to clinics without G1', async () => {
  const { outputs } = await run(fixture());
  const nw = outputs.find((o) => o.meta.id === 'new-westminster').html;
  assert.doesNotMatch(nw, /locations\/(cedar-hills|central-city|nordel-88-ave|burnaby)\/book/);
});

test('DO_NOT_PUBLISH claim used on a page blocks it', async () => {
  const dir = fixture({ mutate: ({ claims }) => { const r = claims.find((c) => c.claim_id === 'WSBC-46'); r.publish_rule = 'DO_NOT_PUBLISH'; } });
  const { report } = await run(dir);
  assert.ok(report.skipped.some((s) => s.page === 'pillar' && s.blockers.some((b) => /WSBC-46 is DO_NOT_PUBLISH/.test(b))));
});

test('unverified STAFF_CONFIRM claim blocks publish but only marks preview', async () => {
  const dir = fixture({ mutate: ({ claims }) => { const r = claims.find((c) => c.claim_id === 'WSBC-16'); r.checked_by = ''; } });
  const pub = await run(dir);
  assert.ok(pub.report.skipped.some((s) => s.page === 'pillar'));
  const prev = await build({ mode: 'preview', dataDir: dir, today: TODAY, write: false, markers: true });
  assert.match(prev.outputs.find((o) => o.meta.id === 'pillar').html, /data-claim="WSBC-16" data-claim-status="pending"/);
});

test('empty sign-off values do not count (by without ISO date)', async () => {
  const dir = fixture({ mutate: ({ signoff }) => { signoff.find((r) => r.page_slug === 'richmond').contract_confirmed_on = 'soon'; } });
  const { report } = await run(dir);
  assert.ok(report.skipped.some((s) => s.page === 'richmond' && s.blockers.includes('gate G1_contract not met')));
});

test('expired or stale claim checks are rejected', () => {
  assert.equal(claimVerified({ publish_rule: 'OK_TO_PUBLISH', checked_by: 'a', checked_on: '2026-01-01', quote_matches: 'yes' }, TODAY), false);
  assert.equal(claimVerified({ publish_rule: 'OK_TO_PUBLISH', checked_by: 'a', checked_on: '2026-10-01', quote_matches: 'yes', expires_on: '2026-10-31' }, TODAY), false);
  assert.equal(claimVerified({ publish_rule: 'OK_TO_PUBLISH', checked_by: 'a', checked_on: '2026-10-01', quote_matches: 'yes' }, TODAY), true);
});

test('missing G6 privacy gate blocks every page', async () => {
  const { report } = await run(fixture({ g6: false }));
  assert.equal(report.built.length, 0);
});

test('G3 fails when clinic facts are too thin', async () => {
  const dir = fixture({ mutate: ({ signoff }) => { signoff.find((r) => r.page_slug === 'richmond').parking = 'Free lot.'; } });
  const { report } = await run(dir);
  assert.ok(report.skipped.some((s) => s.page === 'richmond' && s.blockers.includes('gate G3_facts not met')));
});

test('WCB massage only appears when ops confirmed it', async () => {
  const { outputs } = await run(fixture());
  const nw = outputs.find((o) => o.meta.id === 'new-westminster').html;
  assert.doesNotMatch(nw, /WCB massage therapy/);
  const dir = fixture({ mutate: ({ signoff }) => { Object.assign(signoff.find((r) => r.page_slug === 'new-westminster'), { wcb_massage_confirmed_by: 'Ops', wcb_massage_confirmed_on: '2026-10-25' }); } });
  const again = await run(dir);
  assert.match(again.outputs.find((o) => o.meta.id === 'new-westminster').html, /WCB massage therapy/);
});

test('publish never writes preview placeholders and preview never writes fragments', async () => {
  const dir = fixture();
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'ws-out-'));
  await build({ mode: 'preview', dataDir: dir, outDir: out, today: TODAY });
  assert.ok(!fs.existsSync(path.join(out, 'pillar', 'fragment.html')));
  const out2 = fs.mkdtempSync(path.join(os.tmpdir(), 'ws-out-'));
  await build({ mode: 'publish', dataDir: dir, outDir: out2, today: TODAY });
  assert.ok(fs.existsSync(path.join(out2, 'pillar', 'fragment.html')));
});

test('location pages with filled facts stay under the similarity limit', async () => {
  const { report } = await run(fixture());
  const r = report.built.find((b) => b.page === 'richmond');
  assert.ok(r, 'richmond built');
  assert.ok(r.max_similarity <= 0.4, `similarity ${r.max_similarity}`);
});

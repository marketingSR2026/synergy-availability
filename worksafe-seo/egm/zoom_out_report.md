# Zoom-Out Review (Skeptical Architect): spec/design_draft.md

**Mode:** REVIEW. **Scope:** the full file. **Standard:** zoom-out-standard.md.

**Context sufficiency:** passes. The objective, the scope rule and the motivation are clear.

**Verdict:** not ready. The pillar gets around the per-clinic contract gate that the whole design rests on. The gates themselves live in a generated file that the merge script overwrites. The delivery model (hand-pasted static fragments) cannot enforce the gates. It also copies NAP (name, address, phone) across many WordPress pages, and the existing WordPress plugin was never considered as an alternative. The design also leaves in place the "second WorkSafe location family" that its own cited evidence warns against.

---

## Blocker

### 1. The pillar gets around the per-clinic contract gate (G1)
- **Severity:** Blocker
- **Affected Scope:** Open Questions Q-1 (L52); §4 Gates and Waves (L145-161); §5 (L172); §6.1 title, meta, bands 1, 3 and 8 (L181-194)
- **Simplicity Rationale:** The gates are per clinic, but the pillar ships first and makes the gated claim for all 19 clinics:
  - The title, meta and hero tiles say "WorkSafeBC physiotherapy at 19+ clinics".
  - The band 8 finder gives every clinic a "Book WCB assessment" Jane link. That includes Cedar Hills and Clayton Corners, which §4 holds to Wave 3 "only after Q-1 is answered yes". Both are rated HIGH eligibility risk, and SYN-16 shows Medimap listing Cedar Hills as private pay only.
  - Band 3 says "SYN-07, SYN-08 pending G1", but G1 is a clinic flag and nothing defines G1 for the pillar.
  - Q-1 says it blocks "publishing any page".

  So either the pillar waits until all 19 contracts are confirmed, which blocks the whole program on the slowest clinic, or it publishes exactly the unverified claim the gate exists to stop.
- **Recommendation:** Derive the pillar from clinic gates:
  - The finder lists only clinics with G1 true; leave the others out or show them without WCB wording.
  - Compute any clinic count from G1-true clinics, or drop the count from the title, meta and hero.
  - Keep billing statements on the pillar to WorkSafeBC's general rule (WSBC-11).
  - Write the rule into §4 so the pillar's launch depends only on the Wave 1 clinics.

## Major

### 2. Hand-pasted static fragments are a maintenance dead-end and cannot enforce the gates; existing infrastructure is ignored
- **Severity:** Major
- **Affected Scope:** §10 WordPress delivery (L253-257); Steps 3 and 5 (L323-337); Alternatives Considered (L259-283)
- **Simplicity Rationale:**
  - **NAP is copied everywhere.** Each clinic's NAP and hours land in the pillar finder, the clinic's own page, up to 4 siblings' nearby blocks and the JSON-LD. G2 (NAP sign-off) is open for all 19 clinics, and research/09 lists unresolved NAP for at least 8, so NAP edits are certain. Each edit means a rebuild plus re-pasting several Elementor HTML widgets by hand.
  - **The repo stops being the source of truth** at the first edit made in WordPress.
  - **The gates exist only in the build.** Nothing in WordPress stops someone pasting a preview fragment (with its "STAFF TO CONFIRM" boxes) or editing a claim after paste. The G-4 accuracy goal therefore depends on manual discipline.
  - **The content team cannot edit** Custom HTML widgets visually.
  - **The repo already has a data-to-WordPress path:** `collect.js` pushes JSON to the `data` branch, and the Synergy Availability plugin renders it server-side. That plugin has shortcodes, enqueues its stylesheet inside the shortcode render, has an authenticated ingest endpoint and keeps its own `data/locations.json`.
  - **No delivery alternative is weighed.** The Alternatives section compares page structures only.
- **Recommendation:** Add a delivery alternative and decide it explicitly. Either option removes the re-paste loop:
  - **(a) Wave 1 by hand:** author the pillar, the 3 pages and the 2 articles directly in WordPress, using the stylesheet and a saved Elementor template, with the claims register as the review checklist. Postpone any generator until Wave 2 is approved.
  - **(b) Shortcode:** render the clinic-data parts (finder cards, clinic card, hours, nearby, JSON-LD) through a shortcode in the existing plugin, fed by the same JSON, with G1 and G2 checked at render time. This also gives "enqueue CSS only on WorkSafe pages" for free.

### 3. Hand-entered state has no single home, and CUJ 4 edits a file that gets regenerated
- **Severity:** Major
- **Affected Scope:** CUJ 4 (L83-87); §5 (L168-173); Step 1 (L311-315); `build/merge_locations.py`
- **Simplicity Rationale:**
  - **Re-running the merge wipes human input.** `merge_locations.py` rebuilds `data/worksafe-locations.json` from scratch with `staff_facts` all null and `publish_gates` hard-coded (G4 true, the rest false), then overwrites the file. CUJ 4 has marketing set gates to true in that same file. A re-run, which is needed to refresh the "dated" Jane data shown in band 3, silently wipes every signed gate and staff fact.
  - **Human inputs then get three more homes:**
    - `staff-questionnaire.csv`, which holds the same Q-6/Q-7 fields as `staff_facts`;
    - `claims-signoff.json`, a second store for claim publishability next to the register's `publish_rule`;
    - the register itself.
  - **Two stores will drift.** A claim can be signed in the JSON while the register still says STAFF_CONFIRM, or be moved to DO_NOT_PUBLISH while its sign-off stays.
- **Recommendation:** Keep generated data and human-owned data apart:
  - Staff facts and the G1/G2 sign-offs (with name and date) live only in the questionnaire CSV.
  - The register gets `signed_by` and `signed_on` columns, and the reviewer flips STAFF_CONFIRM to OK_TO_PUBLISH there.
  - Drop `claims-signoff.json`.
  - The merge never writes gate or staff fields; the build joins the files instead.

### 4. A second WorkSafe location family stays indexable, which is the failure the design names as its main risk
- **Severity:** Major
- **Affected Scope:** The Problem #5 (L25); §3 rows for general clinic pages and `/physiotherapy-in-new-west/` (L133-134); D6 (L141); Alternative A (L261-265)
- **Simplicity Rationale:**
  - **The cited source says not to do this.** research/07 §3.2, the source for Problem 5, says the build "should not leave a second indexable WorkSafe location family". It names the legacy city pages with WCB copy and the 5 clinic pages with "More About Worksafe" sections: Abbotsford, Newton/Amson, Cloverdale, Delta and King George (research/01 §5).
  - **The draft only trims those pages.** It swaps visit-count and fee sentences on those pages and leaves `/physiotherapy-in-new-west/` unchanged. The pilot markets Abbotsford and New Westminster will therefore each have several Synergy URLs for one intent, so the pilot cannot tell "the page works" apart from "the URLs are splitting".
  - **The case for a page per clinic is thinner than stated.** research/06 §7.2 justifies location pages as "a real clinic and GBP landing page", because geo demand is zero: all 114 geo combinations returned no data or 0, the same evidence used to reject city hubs. D6 removes the GBP-landing half of that justification.
  - **Alternative A is rejected on an overread scope rule.** The rejection says the scope rule rules out mixed pages, but that rule governs the new WorkSafe pages, and §3 already edits WorkSafe copy on the mixed general pages.
- **Recommendation:**
  - Pick one WorkSafe owner per clinic.
  - Cut the other pages' WorkSafe sections to one line plus a link in the same wave as that clinic's page.
  - Decide the New Westminster owner before the pilot, rather than running both URLs and narrowing later.
  - State the pilot hypothesis, and the result that would retire the location-page layer.

### 5. Five gates, of which three are real, and three overlapping distinctness tests, one of them inverted
- **Severity:** Major
- **Affected Scope:** §4 gate table (L145-153); §6.2 uniqueness test (L217); Step 3.4 unique-text ratio (L328)
- **Simplicity Rationale:**
  - **G4 gates nothing.** It is hard-coded true for all 19 clinics in the merge script.
  - **G5 is not a clinic property.** It is a launch-checklist item, and it makes publishing depend on a paid tool. Q-8 notes an SE Ranking subscription ending 2026-11-06.
  - **Distinctness is defined three ways:**
    - G3 counts 4 of 7 filled fields;
    - a manual review test in §6.2;
    - a computed unique-text ratio with no threshold, which nothing acts on.
  - **The review test fails every page as written.** It removes the unique bands (2, 4, 5 and 6), then asks whether the remaining template bands could describe another clinic. They always can.
  - **G3 can pass with four short strings,** with no team and no photo. research/09 notes the Yelp "free parking" value is the same template value on all 19 rows.
- **Recommendation:**
  - Keep three per-clinic gates: G1 contract, G2 NAP, G3 distinct facts.
  - Move G4 and G5 to the runbook's launch checklist.
  - Define G3 once: either the corrected review test (keep only bands 2, 4, 5 and 6 with name and address stripped, and check it still identifies this clinic), or the ratio with a stated threshold. Drop the other.

### 6. The scale-up rule contradicts itself and only tests for absence of harm
- **Severity:** Major
- **Affected Scope:** §4 Scale rule (L163); §9 Cadence (L251); G-1 and G-2 (L31-32)
- **Simplicity Rationale:**
  - §4 starts Wave 2 (14 clinics) after the day-30 review; §9 puts the Wave 2/3 decision at day 90.
  - The day-30 criteria (indexed, no G-5 regression, no cannibalization alarm) only show the pages did no harm. The value goals come later: G-2 at day 60 and G-1 at day 90.
  - Under §4, the program can grow from 3 to 17 location pages before there is any evidence they help. That growth is the expensive part: questionnaires, consent, photos and NAP sign-off for 14 clinics.
- **Recommendation:** Use one decision point tied to value: day 60 with G-2 met in at least 2 of 3 pilot markets, or day 90 with G-1 and G-2. Wave 2 staff data collection can run in parallel; page production waits for the result.

### 7. The schema graph is designed before the site's existing structured data is known
- **Severity:** Major
- **Affected Scope:** §7 Structured data (L224-229)
- **Simplicity Rationale:**
  - research/01 §0 says schema is Not Available for every URL and that a structured-data crawl is needed "before any schema decisions are made".
  - The site already outputs duplicate canonicals on 388 pages and a second meta description on 82, which suggests two sources write into the page head.
  - The draft hand-declares `Organization` at a guessed `@id` on the pillar. If the SEO plugin already outputs one under another `@id`, the site ends up with two.
  - It also declares a new `<WorkSafe url>#clinic` entity per clinic, separate from the general clinic page (the GBP landing page) and the ICBC page. That splits one clinic into several entities.
- **Recommendation:**
  - Run a Rich Results Test or view-source check on the live pillar and one clinic page first; put it in the runbook.
  - Reuse the existing Organization `@id`.
  - Give each clinic one canonical entity, preferably on the general page, and have the WorkSafe page reference it by `@id` (`about` or `provider`).

### 8. The cheapest existing lever is missing: correcting the WorkSafeBC provider-list entries
- **Severity:** Major
- **Affected Scope:** §1 URL map (L99); Open Questions; claims register SYN-18
- **Simplicity Rationale:**
  - research/08 (bottom line 3) shows WorkSafeBC's own provider-list pages rank #1 for `wcb physio surrey`, `wcb physio abbotsford` and `wcb physio new westminster`.
  - SYN-18 records wrong entries there: New Westminster unit 202 instead of 405, a different Vancouver phone, Central City listed as "King George Hub", and Cedar Hills and Clayton Corners missing.
  - Fixing them needs no build. The same ops contact that answers Q-1 (contract and vendor number) can request it.
  - The draft only links out to these lists, so users can land on a listing that does not match the page (research/09 P-11).
- **Recommendation:** Add a provider-list correction step to Q-1 (owner: ops/billing), and count the provider list as a NAP surface under G2.

### 9. D6 contradicts the project's own acceptance checklist
- **Severity:** Major
- **Affected Scope:** D6 (L141); Non-Goals (L44); §7
- **Simplicity Rationale:**
  - `spec/modern-seo-cluster.md` says every WorkSafe page "must pass each row before publish".
  - Two of those rows are "GBP website links point to the matching page" and "sameAs to GBP / official profiles".
  - D6 keeps GBP links on the general pages, and the §7 JSON-LD has no `sameAs`. Every location page fails the checklist by design, and the draft never reconciles the two.
- **Recommendation:** Either amend that checklist row with the owner's sign-off, or drop D6. In both cases, add `sameAs` (the GBP URL where it is known) to the single clinic entity.

### 10. The build reinvents a CSV parser and a template engine across two runtimes
- **Severity:** Major
- **Affected Scope:** Steps 2-3 (L319-329); `build/merge_locations.py`; `package.json`
- **Simplicity Rationale:**
  - The merge is Python with the stdlib `csv` module. The build is to be "Node 22, no dependencies".
  - That forces a hand-written parser for `claims-register.csv`, the file that drives the claims gate. In it, 102 fields contain commas and 36 contain quotes.
  - It also needs a new `{{...}}` slot syntax with conditional blocks, which is a template engine in all but name.
  - The repo already depends on npm packages (Playwright), so "no dependencies" is self-imposed.
- **Recommendation:** Use one language. Either write the build in Python (`csv`, `json`, `html.escape`, functions that return strings), or port the merge to Node and allow one CSV library. Write templates as plain functions with ordinary `if`. Use Playwright only for screenshots.

## Nit

### 11. New event names are defined before the existing GA4 setup is seen; existing tracking goes unused
- **Severity:** Nit
- **Affected Scope:** §9 Events (L248); G-3
- **Simplicity Rationale:** The draft defines 4 custom events now and says they will be "aligned ... once GA4 access exists". GA4 enhanced measurement already logs outbound clicks to janeapp.com, and CallTrackingMetrics (already on the site) measures real calls rather than taps on phone links.
- **Recommendation:** Start G-3 from outbound-click events filtered to janeapp.com plus CallTrackingMetrics call counts per page. Add custom events only if those cannot separate placements.

### 12. Performance is measured on the wrong thing, and the local preview duplicates WordPress preview
- **Severity:** Nit
- **Affected Scope:** Non-Functional Requirements, Performance (L290); Step 3.3 `preview.html`; Step 4 (L331-333)
- **Simplicity Rationale:** Lab-testing the fragment with a mock header leaves out the 3 to 3.8 MB of theme JavaScript that decides the real page's speed. It will always pass and tells nothing. The screenshot check at 4 widths also repeats, at lower fidelity, the WordPress draft preview the rollout already includes.
- **Recommendation:** Budget the change against the live page measured on the WordPress draft: 0 added JS, a capped CSS size, and no regression in mobile LCP or CLS. Keep one local preview for content review.

### 13. Implementation detail buries the design decisions
- **Severity:** Nit
- **Affected Scope:** §8 Jane-link paragraph (L244); Step 1.2 (L314); Steps 3.2-3.4 (L326-328); Step 4.2 (L333)
- **Simplicity Rationale:** The JSON shape of the sign-off file, CLI flags, four output files per page, QA report fields, `rel` handling, the em-dash lint and viewport widths belong in a build README. Separate `schema.json` and `meta.json` files also add manual paste steps.
- **Recommendation:** Move this detail to `build/README` or the runbook. Keep only the inputs, the outputs (one fragment per page with embedded JSON-LD, plus title and meta) and the conditions under which publish mode refuses.

### 14. The articles are routed through the fragment build
- **Severity:** Nit
- **Affected Scope:** §6.3 (L221) vs Step 2.3 (L321)
- **Simplicity Rationale:** §6.3 says the articles are delivered as content drafts for the content owner, but Step 2.3 builds them as HTML fragments. That turns editorial posts into hard-to-edit Custom HTML blocks and adds them to the rebuild-and-re-paste loop.
- **Recommendation:** Take the articles out of the build. Deliver tagged copy to the content owner and check claims at review.

### 15. The stylesheet ships components the templates do not use
- **Severity:** Nit
- **Affected Scope:** §6 (L177); §10 (L256); `pages/assets/worksafe.css`
- **Simplicity Rationale:** §10 makes the map a directions link, and the location page uses a nearby-clinics block. Yet the CSS still carries `.sr-ws-map` (10 occurrences) and `.sr-ws-locsel` (13 occurrences).
- **Recommendation:** Trim the CSS to the components §6.1 and §6.2 reference.

### 16. D3 contradicts keyword Rule 1
- **Severity:** Nit
- **Affected Scope:** D3 (L104) vs §2 Rule 1 (L122)
- **Simplicity Rationale:** Rule 1 says a title names only its owner cluster. D3 keeps the pillar's head term "WorkSafeBC physiotherapy" in the coverage guide's title, against research/06 §7.2.
- **Recommendation:** Record D3 as a time-boxed exception, with a day-30 check of whether the guide and the pillar alternate for the head term.

### 17. The nearby-clinic data is broken for 15 of 19 clinics
- **Severity:** Nit
- **Affected Scope:** §6.2 band 7 (L214); Step 1 "done" (L313); `merge_locations.py` `km_list`
- **Simplicity Rationale:** The parsing regex runs across neighbouring entries. It produces 16 nearby rows whose names are address fragments and whose `slug` is null, for example "8056 King George Blvd, Surrey ; 02 Sullivan Heights". Band 7 would render them as they are.
- **Recommendation:** Fix the parser, or use coordinates or a staff-confirmed list. Add a build check that every nearby entry resolves to a known clinic slug.

### 18. Band 3 depends on collector data that the design itself treats as not yet approved
- **Severity:** Nit
- **Affected Scope:** Overview (L11); band 3 (L210); Future Improvements (L305); Step 1 (L313)
- **Simplicity Rationale:** Future Improvements makes live availability conditional on the data source being approved. Yet the WCB services and openings data come from that same collector, and showing them "dated" means re-running the collector and the merge for every refresh (see #3). The plugin's own README says live Jane collection stays off until Jane gives permission.
- **Recommendation:** Use the collector output once as a seed. Make "WCB services at this clinic" a staff-confirmed questionnaire field.

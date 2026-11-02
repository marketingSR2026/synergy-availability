# egm-implementation-readiness

# Implementation Readiness Review: design_draft.md lines 309-338 (Detailed Implementation Plan)

**Verdict: FAIL.** The plan does not meet the Zero-Decision Rule. It has no test plan. It contradicts the code already committed for Steps 2 and 3. It also has no rollout phase that says in what order pages are built, pasted and re-pasted. An engineer new to the project cannot run Steps 1 to 5 and get correct, publishable output on the first try.

Evidence was checked against the repo: `build/build_pages.mjs`, `build/merge_locations.py`, `build/screenshot.mjs`, `pages/src/*.mjs`, `data/*.json|csv` and `pages/dist/qa-report.json`.

---

## Blockers

### B1. There is no test plan for the build gates (lines 323-328, the whole plan)
- **Affected scope:** Step 3 (`build/build_pages.mjs`). No test file is listed anywhere.
- **Finding:** The build script is the only thing that enforces G-4 (accuracy) and gates G1 to G5. The plan names no test cases, fixtures, test runner or assertions. The standard requires happy-path and edge-case tests.
- **Extra hazard:** the build starts with `fs.rmSync(OUT)`, so any ad-hoc test run against the real data deletes `pages/dist`.
- **Guidance:**
  - Add `build/test/build_pages.test.mjs` using `node:test`, which is built into Node 22, so there are still no dependencies.
  - Add a `--root <fixture dir>` (or `--data`/`--out`) flag so tests use fixture copies of `worksafe-locations.json`, `claims-register.csv`, `claims-signoff.json` and `photos.json`.
  - Required cases:
    1. A `DO_NOT_PUBLISH` id in a template: publish exits 1 and the page appears in `skipped`.
    2. An unsigned `STAFF_CONFIRM` id: blocked in publish; dashed `data-claim-status="pending"` in preview.
    3. `SYN-01`/`SYN-08` on a clinic with `G1_contract=false`: blocked.
    4. A clinic with one gate false: skipped, and the false gates are listed.
    5. 3 of 7 G3 facts filled: blocked; 4 of 7: passes.
    6. An em dash or en dash in the HTML, title or description: blocked.
    7. A 66-character title: blocked.
    8. An unknown claim id: blocked.
    9. Another clinic's Jane slug on a location page: blocked.
    10. `checked_as_of=null`: the pillar is blocked.
    11. A missing hero photo: blocked.
    12. An all-pass fixture: exactly 4 files written per page plus `qa-report.json`.

### B2. Step 2 contradicts the committed implementation, and two of its four deliverables have no spec (lines 319-321)
- **Affected scope:** Step 2.1 to 2.3 (`pages/src/`).
- **Finding:** The plan says to create `pages/src/pillar.html` and `location.template.html` with `{{...}}` slots and "conditional blocks". The repo already has `pages/src/pillar.mjs`, `location.mjs` and `shared.mjs`: JavaScript template functions that `build_pages.mjs` imports. Nothing in the repo reads `.html` templates, and the plan never defines a slot or conditional syntax.
  - An engineer following the plan either writes templates nothing reads, or has to design a template engine and rewrite the build.
  - The committed copy also differs from §6. The location title in code is `WCB & WorkSafeBC Physio in ${place} | Synergy Rehab`; §6.2 specifies `WorkSafeBC Physio <Name> | WCB Physiotherapy | Synergy Rehab`. The pillar title also differs from §6.1. The plan does not say which one is correct.
  - Step 2.3 names `coverage-guide.html` and `return-to-work.html`, but neither exists. Step 3 does not render them. They have no title, H1, meta, outline, claim-id mapping, length, schema or delivery format: §6.3 gives one sentence each.
- **Guidance:**
  - Rewrite Step 2 to match the `.mjs` modules. Name each exported function (`pillar(ctx)`, `pillarMeta`, `pillarFaq(ctx)`, `location(x, ctx)`, `locationMeta(x)`) and the `ctx` API (`claim`, `slot`, `photo`, `team`, `asof`, `linked`, `href`).
  - State that §6 titles and H1s are authoritative and that the code must be changed to match, or the reverse.
  - For the coverage guide and the RTW article, either add full page specs (title, H1, meta, H2 list, claim ids per H2, word range, JSON-LD type, `pages/src/*.mjs` module, build output) or state that they are hand-written outside the build, and say by whom.

### B3. There is no rollout phase, and links depend on build-time gates rather than what is live (lines 323-338 and NFR rollback)
- **Affected scope:** Steps 3 to 5, Wave 1 launch, the pillar finder, the location nearby block, the RTW link.
- **Finding:** The plan describes a build pipeline. It never describes a publish sequence. Concrete failure modes:
  - The pillar fragment already links `/return-to-work-after-a-workplace-injury/` twice. That URL is new, and nothing says it must go live before the pillar. Publishing the pillar first creates 404 links.
  - With `--link published`, the pillar finder and the sibling nearby cards link to a clinic as soon as its gates are true in JSON, not when its WordPress page is live. A pillar rebuilt and pasted before the clinic page is published links to a 404.
  - Publishing or rolling back one clinic means rebuilding and re-pasting the pillar and every sibling whose nearby block lists that clinic. The plan and the NFR rollback ("remove the finder link") never say this.
  - The pillar has no gates. Its publish criteria are not stated, even though it carries `SYN-08` and the global sign-off line.
- **Guidance:** Add Phase 6, "Wave rollout", with numbered steps:
  1. Publish the coverage guide refresh and the RTW article.
  2. Publish the Wave 1 location pages as live pages.
  3. Rebuild the pillar with `--link published` and re-paste it.
  4. Rebuild and re-paste the affected siblings.
  5. Run the post-publish checks.

  Add a rollback procedure: set the gate false, rebuild, re-paste the pillar and the listed siblings, then set the page to draft. Define the pillar's publish preconditions, for example a complete `claims-signoff.json`, the `SYN-08` decision, and the RTW and guide URLs returning 200.

---

## Major

### M1. Step 1.1 is marked "done", but it overwrites manual state and its output is defective (line 313)
- **Affected scope:** `build/merge_locations.py`, `data/worksafe-locations.json`.
- **Finding:**
  - **Overwrite:** every run rewrites `staff_facts` (all null) and `publish_gates` (G4 true, others false) from hard-coded defaults. CUJ 4 has Marketing editing gates by hand in that same file. Re-running the merge to refresh Jane WCB data, NAP or nearby clinics silently wipes every sign-off and clinic fact.
  - **Undocumented input:** the script needs a positional `availability.json` path (from `origin/data`). The plan does not name it.
  - **Defective data:** 16 of 76 `nearby` entries were mis-parsed, with names like `"8056 King George Blvd, Surrey ; 03 Central City"` and `slug: null`. `location.mjs` drops them silently (`if (!t) return ''`). As a result, 15 pages show fewer than the 4 nearby clinics §6.2 requires, and Newton shows only 2.
  - **No acceptance criterion** exists for this step.
- **Guidance:**
  - Split the data into a generated file and a hand-maintained overlay (for example `data/worksafe-staff.json` for `staff_facts`, `publish_gates` and NAP overrides). The merge must never touch the overlay, and the build reads both.
  - Document the exact command: `python3 -I build/merge_locations.py <(git show origin/data:availability.json)` or the equivalent.
  - Fix the `km_list` regex.
  - Add a check: every clinic has 4 `nearby` entries with non-null slugs, sorted by km ascending.

### M2. The staff questionnaire and `staff_facts` schema are undefined and inconsistent (lines 313, 315, 320)
- **Affected scope:** `data/staff-questionnaire.csv` (missing), `staff_facts`, `data/photos.json`.
- **Finding:**
  - "Q-6 and Q-7 fields" are not a column list, and no step says how the filled CSV flows back into JSON.
  - The template calls `slot(x, 'check_in')`, but `check_in` is not in the merge schema or the G3 list.
  - The shape of `wcb_team_with_consent` (the code expects an array of `{name, credential, focus, languages}`) is not specified.
  - Photos live in two places:
    - `staff_facts.photo_with_consent` counts toward G3 but is never rendered.
    - `data/photos.json` keys `<slug>_hero` and `<slug>_inside` are rendered, and a missing hero blocks publish, but they do not count toward G3.
  - `photos.json` is not mentioned anywhere in the plan, although the build reads it (Step 3.1 omits it).
- **Guidance:**
  - Give the exact CSV header with one column per `staff_facts` key, plus NAP fields, the consent flag, the photo Drive id and the signer and date.
  - Add an ingestion script, for example `build/ingest_questionnaire.py`, that writes to the overlay from M1.
  - Define the `wcb_team_with_consent` item schema.
  - Make one field the single source of truth for photos, and make G3 count it.

### M3. The `claims-signoff.json` schema cannot record what §5 requires (line 314)
- **Affected scope:** Step 1.2, §5, pillar band 3.
- **Finding:**
  - §5 says staff open each cited official URL and record the check date. The schema has one global `checked_as_of` and per-claim entries only for STAFF_CONFIRM ids, so the `OK_TO_PUBLISH` URL checks cannot be recorded.
  - `SYN-01` and `SYN-08` are per-clinic facts, but sign-off is keyed by claim id only.
  - On the pillar, `claim('SYN-08')` is called with no clinic, so G1 never applies. Once `SYN-08` is signed globally, the pillar publishes "we handle WorkSafeBC billing" for all 19 clinics, including Cedar Hills and Clayton Corners (HIGH eligibility risk, G1 false).
- **Guidance:**
  - Extend the schema with `"sources": {"<url>": {"checked": "YYYY-MM-DD", "by": ""}}`, and make the build block a claim whose `official_source_url` has no entry.
  - Make SYN-01 and SYN-08 sign-off per clinic, or derive them from G1 only.
  - State the pillar rule, for example: SYN-08 wording on the pillar is allowed only when every clinic listed in the finder has G1 true, or the wording is reduced to "at clinics marked WorkSafeBC-contracted".

### M4. Publish-mode semantics are undefined, and the output path conflicts with the code (lines 326-327)
- **Affected scope:** Step 3.2 and 3.3.
- **Finding:**
  - "Fails on..." does not say whether the whole build aborts or only the failing page is skipped. CUJ 4 says it "stops". The code skips page by page, writes the passing pages and exits 1.
  - Step 3.3 says outputs go to `pages/dist/<page>/`. Publish mode actually writes to `pages/publish/`.
  - "Any empty required slot" names no slots. The code does not block on an empty slot: it strips them. It blocks only on fewer than 4 G3 facts and on a missing hero photo.
  - G3 exists both as a manual JSON flag and as a computed count, and the plan does not say which one decides.
  - The plan omits the `--markers` and `--link` flags.
  - Step 3.2 says "em dash"; the code also rejects en dashes.
- **Guidance:**
  - State the exact behaviour: per-page skip plus exit 1 with `qa-report.json.skipped[]`, or abort with no output.
  - State the output directory for each mode.
  - List the required slots per template.
  - Make G3 computed only, removing the flag, or manual only.
  - Document all CLI flags and their defaults.

### M5. The uniqueness metric and threshold are undefined (line 328 and §6.2 line 217)
- **Affected scope:** `qa-report.json` `max_similarity`, gate G3.
- **Finding:**
  - "Unique-text ratio" has no definition. The code reports the maximum 5-word-shingle Jaccard similarity to any other page. Current values are 0.418 to 0.530, and nothing says whether that passes.
  - In publish mode only gate-passing pages are built, so in Wave 1 the comparison set is 2 pages and the number is not comparable to the preview run.
  - The §6.2 band-removal test is manual and appears in no step.
- **Guidance:**
  - Define the metric: Jaccard of 5-word shingles, measured with the shared footer and sources band excluded.
  - Always compute it against all 19 preview renders.
  - Set a hard threshold, for example max 0.35 or lower to publish.
  - Add the band-removal check to Step 4 with a named reviewer.

### M6. The Step 4 QA checks cannot be executed or checked as written (lines 332-333)
- **Affected scope:** `build/screenshot.mjs`, Step 4.2.
- **Finding:**
  - The overflow check runs at 390 and 1280 only. The plan requires 320, 390, 768 and 1280 and does not say which tool covers the other two.
  - `screenshot.mjs` prints JSON and always exits 0, so nothing ever fails.
  - QA reads only `pages/dist` preview output (markers on, staff slots visible). The publish output that is actually pasted, with empty slots stripped, is never screenshotted or checked.
  - "Every Jane link matches the clinic's jane.slug" cannot hold on the pillar finder or the nearby cards, which link other clinics. The code checks only that the slug belongs to some clinic.
  - "Every tel: matches the clinic phone" would fail on the Teleclaim link `tel:+18889675377` on every page, and it is not implemented.
  - The "19+ locations" rule is undefined (must it be present? are other variants banned?). It also conflicts with the §6.1 title and meta, which say "19+ Clinics" and "19+ Synergy Rehab clinics".
  - The NFR checks have no step: LCP under 2.5 s, CLS under 0.1, the 48 px tap targets (the script counts targets under 24 px) and WCAG 2.2 AA contrast.
- **Guidance:**
  - Make the QA a script with exit codes, for example `build/qa.mjs --dir pages/publish`.
  - Use viewports 320, 390, 768 and 1280.
  - Precise rules:
    - Hero and booking links must use the page's own clinic slug.
    - Finder and nearby links must use the slug of the card's clinic.
    - `tel:` links must equal the page clinic's `phone_e164`, or `+18889675377` on a Teleclaim element.
  - Define the "19+" wording rule.
  - Add Lighthouse mobile lab thresholds and a 48 px tap-target assertion.

### M7. The RUNBOOK leaves WordPress design choices to the implementer (line 337)
- **Affected scope:** `worksafe-seo/RUNBOOK.md`.
- **Finding:** "Create pages, paste fragment, add JSON-LD, set title/meta in the SEO plugin, enqueue CSS" leaves these choices open:
  - **Page parent and slug.** Location pages must be child pages of `/worksafe-physiotherapy/`, or WordPress creates `/<slug>/` or `-2` URLs.
  - **Which SEO plugin.** research/01 does not identify it.
  - **How JSON-LD is inserted.** Options are a `<script>` in the HTML widget or a plugin field. The plan also does not say how to avoid clashing with the plugin's own WebPage and Organization graph.
  - **How the CSS is enqueued only on WorkSafe URLs.** Options are a child-theme `wp_enqueue_scripts` hook with `is_page()` or parent checks, Elementor custom CSS, or a snippets plugin. The plan also does not say where the file is uploaded.
  - **How to stop the auto-generated second meta description and second canonical.** research/01 says the template repeats both on new pages, and §10 says the new pages must not add to these defects.
  - **How to apply `noindex, follow` to `/tag/worksafebc/`.**
- **Guidance:** Decide each item in the spec and write the exact WordPress admin path or code snippet into the runbook steps.

### M8. The analytics event markup and GTM configuration are unspecified (Step 2 and Step 5, lines 319-320 and 337)
- **Affected scope:** `shared.mjs` `ev()`, GTM.
- **Finding:**
  - Step 2 never tells the implementer to add the `data-sr-event` attributes.
  - §9 names the parameter `clinic_slug`, but the code emits `data-clinic` (with the value `all` on the pillar hero), `data-placement` and `data-page-type`.
  - The GTM trigger, Data Layer or DOM-element variables and GA4 event tag mapping are only "GTM triggers" in the runbook.
  - §9 says event names may change once GA4 access exists, but no step covers that re-mapping.
- **Guidance:**
  - Define the attribute contract (attribute name to GA4 parameter name, and the allowed values per placement).
  - Give the GTM recipe: a Click – All Elements trigger with Click Element matching the CSS selector `[data-sr-event], [data-sr-event] *`, plus 4 DOM-attribute variables and one GA4 event tag with `{{sr_event}}`.
  - State that event names are frozen for Wave 1.

### M9. Deliverables named in the spec have no implementation step (the plan as a whole)
- **Affected scope:** G5 tracking, §3 existing-URL changes, `data/keyword-master.csv`.
- **Finding:**
  - G5 needs WorkSafe keywords tracked with target URLs. No step builds the SE Ranking import: `URL Target` is "Not Available" on all 508 rows of `keyword-master.csv`, and the "about 121 pairs" and the "10 AI prompts" exist in no file.
  - The §3 changes have no replacement copy and no step: the homepage module (SYN-02), the blog sentence (SYN-11), the general clinic pages, `/icbc-claims/` (SYN-03) and the `/tag/worksafebc/` noindex. The runbook only says "existing-URL changes from §3".
  - No step captures the GA4 and SE Ranking baseline, even though §9's cadence starts from one.
- **Guidance:**
  - Add a step that writes `data/tracking-import.csv` (keyword, engine, target URL, group) and `data/ai-prompts.csv` (10 rows) from `keyword-master.csv` and the §2 ownership table.
  - Add a step that produces `pages/dist/existing-url-edits.md` with the exact old sentence and new sentence for each URL, plus claim ids.
  - Add a baseline-export step dated before launch.

### M10. Gate G4 is pre-set to true and has no checkable condition (line 313, §4)
- **Affected scope:** `publish_gates.G4_url_plan` for all 19 clinics.
- **Finding:** The merge sets G4 true for every clinic, including Delta (blocked by Q-2) and the close-sibling pairs. "§2 and §3 applied" has no criterion, so the gate always passes.
- **Guidance:**
  - Default G4 to false.
  - Define a build-checkable rule: the title, H1 and meta contain no sibling `area_label` or `name` (§2 rule 2); multi-clinic Surrey pages use "<neighbourhood>, Surrey"; and the clinic's §3 existing-URL rows are marked done in the tracking file.

---

## Nit

### N1. The conditions for the massage and acupuncture blocks are undefined (line 320)
- **Finding:** `wcb_massage_bookable` and `wcb_acupuncture_bookable` mean "had an open slot in one 7-day snapshot" (`availability.json`, checked 2026-11-02T07:31Z). A clinic that offers WCB massage but is fully booked that week loses the band. The plan defines neither the condition nor a refresh-before-publish step.
- **Guidance:** State the condition (the service appears in Jane's treatment list, not just in open slots, or N weeks of snapshots) and add "re-run merge with the latest data snapshot before each publish build".

### N2. The content of REPORT.md is undefined (line 338)
- **Finding:** "Executive summary, deliverables list, 10 next actions" names no source for the actions.
- **Guidance:** Derive the 10 actions from the open Q-1 to Q-10, the `qa-report.json` blockers and the M9 tracking step.

---

# egm-codebase-details

# Codebase Details Goldfish: REVIEW of spec/design_draft.md lines 309-338 (Detailed Implementation Plan)

Standard applied: Implementation Readiness Standard (Zero-Decision Rule, phasing and checkpoints, target scope, actionable steps, test plan).

Overall verdict: **FAIL.** The plan is out of date against the code. Commit 1b0caad ("Add WorkSafe page templates, claim-gated build script and previews") already contains `build/build_pages.mjs`, `build/screenshot.mjs`, `data/claims-signoff.json`, `data/photos.json`, `pages/src/{pillar,location,shared}.mjs` and `pages/dist/*`. Steps 1.2, 2, 3 and 4.1 still describe these files as future work, in a different form. In several places the plan describes gating behaviour the build does not have. I checked these on a scratch copy (`/tmp/claude-0/-home-user-synergy-availability/7fb27b37-db08-5b4c-bf1d-e36db1a2ed16/scratchpad/ws`); the workspace was not touched.

---

## Blockers

**B1. Steps 2 and 3 do not match the code that exists (lines 317-328).**
- Step 2 calls for `pages/src/pillar.html` with a `{{finder}}` placeholder and `pages/src/location.template.html` with `{{...}}` slots.
- What exists instead is `pages/src/pillar.mjs`, `location.mjs` and `shared.mjs`. These are JS template-literal modules exporting `pillar(ctx)`, `pillarMeta`, `pillarFaq(ctx)`, `location(x, ctx)`, `locationMeta(x)` and `locationFaq(x, ctx)`, plus `finder(ctx)` and `ctx.claim/slot/photo/team/asof`.
- `build_pages.mjs` imports these modules (lines 9-11). No code reads `.html` templates or replaces `{{}}` placeholders.
- An implementer who follows Step 2 would write templates that nothing reads, or would rewrite a working build.

**B2. Step 3.3 points to the wrong folder for paste-ready output (line 327).**
- The plan labels `pages/dist/<page>/fragment.html` as "paste into WordPress".
- The build writes `pages/dist` only in preview mode (`OUT`, line 18). Publish output goes to `pages/publish/<page>/`, which is gitignored.
- The committed preview fragments contain "Staff to confirm" slot spans (7 on new-westminster), `data-claim-status="pending"` plus `title` markers (11 on the pillar), and links to unpublished Wave 1 pages (`--link wave1` is the preview default).
- Following the plan as written puts placeholders and links to missing pages on the live site.

**B3. The sign-off file shape in Step 1.2 bypasses the claim gate (line 314; build_pages.mjs line 59).**
- The plan's own template is `{"<claim_id>": {"by": "", "date": ""}}`. The build only checks that `signoff.signed?.[id]` is truthy, and an empty object is truthy.
- Scratch test: every STAFF_CONFIRM id filled with empty strings gave `pending=0`, and the pillar built in publish mode.
- This defeats goal G-4. Sign-off is also keyed per claim only, so SYN-01 (per-clinic by nature) cannot be signed per clinic.
- The file already exists with `_how_to_use` and `signed: {}`, so "Add" is wrong.

**B4. "Fails on any empty required slot" is not what the code does (line 326).**
- In publish mode, `slot()` returns `''` and records the field in `missing` only (lines 65-70). Line 212 then strips empty `<dt>/<dd>` rows, empty FAQ items and the empty "When you arrive" paragraph.
- Scratch test: Langley with all gates true, and with getting_here, parking, accessibility and check_in empty, was written to `pages/publish/langley/`. Only "Phone" was left in its details list.
- The G3 count (lines 41, 210-211) includes `nearby_workplaces` and `photo_with_consent`. Neither is rendered by `location.mjs`.
- `check_in` is rendered (location.mjs line 149) but is not counted for G3 and is not in the `staff_facts` schema written by merge_locations.py.
- The plan never says which slots are "required".

**B5. Step 1.1 is marked "done", but the nearby-clinic data it produced is corrupt (line 313; merge_locations.py line 54).**
- The regex `0\d (.+?) About ([\d.]+) km` also matches digits inside addresses (for example `#101 8056 ...` and `8045 204 Street`).
- Result: 15 of 19 clinics have a junk `nearby` entry with `slug: null`, and a real clinic is dropped in its place. Newton loses Sullivan Heights (3.6 km) and Strawberry Hill (4.1 km).
- The junk is in the committed page copy. Burnaby: "New Westminster (about 7.7 km) and - 301 East Columbia Street, New Westminster ; 02 Delta (about 12 km)". Abbotsford, Newton, Strawberry Hill and South Surrey have the same problem.
- No QA check in Step 4.2 would catch it.

**B6. Re-running merge_locations.py wipes the gate flags and staff facts (lines 313-315; merge_locations.py lines 91-97).**
- The script rebuilds `worksafe-locations.json` from scratch, with `staff_facts` set to null and gates fixed at G4=true, others false.
- CUJ 4 has marketing set the gates by hand in that same file, and the SYN-JANE register row says to re-check Jane before each publish. Doing both erases every approval.
- Step 1.3's `staff-questionnaire.csv` has no defined columns and no step that imports it into `staff_facts`. Value types are also undefined: `wcb_team_with_consent` must be an array of `{name, credential, languages, focus}` objects.

## Majors

- **M1.** No file in the plan is marked Create, Modify or Delete. Several of the "create" files already exist.
- **M2. Step 3.1 inputs and options are incomplete.**
  - The build also reads `data/photos.json` and inlines `pages/assets/worksafe.css`. Photo keys are `pillar_hero`, `pillar_first_visit`, `<slug>_hero` and `<slug>_inside`; a missing hero photo blocks publish.
  - Undocumented flags: `--markers on|off` and `--link all|wave1|published`, with defaults that depend on mode.
  - `WAVE1` is hardcoded in the script.
  - `fs.rmSync(OUT)` wipes the output folder on every run.
  - No step fills `photos.json`, and it is a second, unconnected photo source next to `staff_facts.photo_with_consent`.
- **M3. Step 3.2 lists only some of the publish blockers, and the exit code is misleading.**
  - The code also blocks on: en dashes, title over 65 characters, description over 165, H1 count not 1, missing literal "19+ locations", unknown Jane slug, unknown claim id, missing hero photo, missing `checked_as_of`/`reviewer`, fewer than 4 G3 facts, and SYN-01/SYN-08 when G1 is false.
  - `process.exitCode = 1` is set whenever any page is skipped (line 229), including clinics skipped only because their gates are false. Scratch test: Langley built correctly and the run still exited 1. In CUJ 4, success looks the same as failure.
- **M4. Pending claims block whole pages.**
  - Any unsigned STAFF_CONFIRM claim blocks the entire page. The pillar is blocked by GEN-01, WSBC-16, WSBC-30, WSBC-36, WSBC-49, SYN-08 and SYN-PEND.
  - The Open Questions section says each question "blocks only the items named". The plan never decides whether to drop the sentence or block the page.
  - The pillar's SYN-08 line ("We bill WorkSafeBC for your care") is called with `clinic = null`, so the G1 check is skipped.
- **M5. The two articles have no build path.**
  - Step 2.3 adds the coverage guide and the return-to-work article, but the build renders only the pillar and 19 clinic pages. §6.3 says the guide is a separate file for the content owner, which conflicts.
  - The pillar links twice to the new `/return-to-work-after-a-workplace-injury/` URL, and no ordering rule prevents a broken link at launch.
- **M6. Step 3.4 report fields do not match `qa-report.json`.**
  - H1 and internal links are not reported.
  - The "unique-text ratio" is really the highest 5-word-shingle Jaccard similarity to any other page (`max_similarity`, `most_similar_to`), and there is no pass threshold.
  - It is computed on preview text that includes the same "Staff to confirm" strings on every page, which inflates it.
  - In publish mode it compares only published pages, so a single page scores 0 (seen in the scratch test). `errors[]` is never filled.
- **M7. Most Step 4.2 checks are not implemented or not assigned.**
  - The 320 and 768 px widths are never captured.
  - Overflow and small-target results are only printed, not asserted or saved. The small-target threshold is 24 px; the requirement is 48 px.
  - There is no `tel:` check, and a naive one would fail on the Teleclaim `tel:+18889675377` link on every page.
  - The Jane check only tests that the slug belongs to *any* clinic, and it does not verify treatment 442.
  - The JSON-LD "parses" check is trivially true.
  - "19+ locations" is enforced as required text, although research/09 Q18 says brand approval is still pending.
  - The plan does not say which checks are automated, which are manual, or which fail the build.
- **M8. Step 4.1 screenshots.**
  - By default the script captures the pillar and Wave 1 only, not "each preview", and writes both full-page and `-fold` images.
  - `page.goto(...).catch(() => {})` swallows load errors, so a missing page gives a blank screenshot with no error.
  - It reads only `pages/dist`, so it captures preview markers rather than publish output.
  - Playwright resolves only through the environment's `NODE_PATH` and `PLAYWRIGHT_BROWSERS_PATH`. The repo has no `node_modules`.
- **M9. Jane data is an unpinned snapshot.**
  - `wcb_*_bookable` means "an open slot was seen in the collector's 8-day window". The input is a force-pushed orphan commit on the `data` branch; it is not pinned or committed, and the plan gives no command to fetch it.
  - A busy week can switch a clinic's massage content off.
  - Treatment 442 is hardcoded for every clinic, not checked per clinic; other ids exist (948, 968, 1013, 1019, 1081).
- **M10. Steps 2-3 rely on §6 and §7, but the code differs.**
  - Location title in code: `WCB & WorkSafeBC Physio in <place> | Synergy Rehab`, with a fallback above 62 characters. This differs from §6.2.
  - The pillar title differs from §6.1, and the pillar hero has no call button.
  - Location meta descriptions differ from §6.2.
  - The Organization schema has no logo or telephone; `dateModified` and `hasMap` are missing.
  - The plan does not say whether the spec or the code is authoritative.
- **M11. No test plan.** There are no test cases or fixtures for the gating logic.
- **M12. No checkpoints.** No step has a verification command or exit criterion, and there is no npm script for the build.
- **M13. The RUNBOOK step leaves decisions open.**
  - The SEO plugin is not identified anywhere in the research.
  - `schema.json` is raw JSON with no rule for wrapping it in a `<script type="application/ld+json">` tag.
  - The way to enqueue the CSS only on WorkSafe pages is not given.
  - The stylesheet is 11.4 KB gzipped unminified against the ~8 KB requirement, and there is no minify step.
  - The GTM triggers need container access the project does not have.

## Nits

- **N1.** The dash check misses `&mdash;` and `&#8212;` entities. It also rejects en dashes, which the plan does not mention.
- **N2.** The "as of" wording in the code differs from §5, and the preview fallback hardcodes "Sources researched November 2, 2026".
- **N3.** Skipped pages leave empty `pages/publish/<id>/` folders, and the plan does not say that `pages/publish` is gitignored.
- **N4.** merge_locations.py raises an uncaught KeyError if a clinic is missing from yelp-nap.csv.
- **N5.** REPORT.md's "10 next actions" are not specified.


---

# egm-style-impl

# Style Goldfish Review: design_draft.md lines 309-338 (Detailed Implementation Plan)

Mode: REVIEW. Scope: Steps 1 to 5. I checked each statement against the repo files it names (build/merge_locations.py, build/build_pages.mjs, build/screenshot.mjs, pages/src/, pages/dist/, data/claims-signoff.json, previews/).

Main problem: the section reads as an earlier plan that the code has since overtaken. Several of its claims are now false: file names, template syntax, output paths, build checks and report fields. One of them would lead staff to paste placeholder text into WordPress. Separately, the prose relies on undefined terms ("collector's public data branch", "unique-text ratio", "required slot"), noun-phrase lists with no actor or pass condition, and status markers that disagree with each other.

---

## Findings

### 1. Blocker: the WordPress paste source is wrong
- **Affected Scope:** Step 3, item 3 (line 327).
- **Style Rationale:** "`pages/dist/<page>/fragment.html` (paste into WordPress)" is true only for preview mode. `build_pages.mjs` writes to `pages/dist/` in preview mode and to `pages/publish/` in publish mode (`const OUT = ... MODE === 'publish' ? 'publish' : 'dist'`). The current `pages/dist/richmond/fragment.html` holds 7 "Staff to confirm" text boxes and pending markers such as `title="SYN-01: 2026 contract not confirmed for Richmond (gate G1)"`. Followed literally, the instruction publishes that placeholder text. An instruction with no mode attached is too imprecise for a hand-off document.
- **Recommendation:** Give the output directory for each mode. Make `pages/publish/<page>/fragment.html` the only paste source. Label `pages/dist/` "preview only, never paste".

### 2. Major: Step 2 names files and a template syntax that do not exist
- **Affected Scope:** Step 2, items 1 and 2 (lines 319-320).
- **Style Rationale:** The text names `pages/src/pillar.html` and `pages/src/location.template.html`, with `{{...}}` slots and a `{{finder}}` placeholder. The repo has `pages/src/pillar.mjs`, `location.mjs` and `shared.mjs`, which are JS template functions with no `{{` tokens. A reader cannot check these claims and would look for files that are not there. Item 1 also drops an article ("and `{{finder}}` placeholder"). "Using design-system components" is vague.
- **Recommendation:** Name the real modules and their exports (`pillar`, `pillarMeta`, `pillarFaq`, `location`, `locationMeta`). Describe the mechanism as "`ctx.claim(id, html)` wraps each WorkSafeBC fact in `data-claim`". Cite spec/design-system.md §4 to §9 in place of "design-system components".

### 3. Major: the build-mode description is wrong and uses undefined terms
- **Affected Scope:** Step 3, item 2 (line 326). The input list in item 1 (line 325) has the same problem.
- **Style Rationale:**
  - (a) The "STAFF TO CONFIRM" boxes are labelled "Staff to confirm:" in the code. Pending claims appear as dashed outlines, not boxes. Markers depend on the undocumented `--markers` flag. The `--link` flag is also left out. "Visible ... boxes" is redundant.
  - (b) "Renders only clinics with all gates true" switches nouns from pages to clinics, and the pillar has no gates.
  - (c) "Fails on" is ambiguous. The code skips the page, records it under `skipped` in qa-report.json and exits with code 1.
  - (d) "Any empty required slot" uses an undefined term. Publish mode removes empty slots. It blocks only when fewer than 4 of the 7 G3 facts are filled or the hero photo is missing.
  - (e) "Any em dash" is incomplete. The build also rejects en dashes, titles over 65 characters, meta descriptions over 165 characters, an H1 count other than 1, a missing "19+ locations" and unknown Jane slugs.
  - (f) Item 1 leaves out `data/photos.json` and `pages/assets/worksafe.css`, which the build reads.
- **Recommendation:** Replace the sentence with a list of publish blockers that matches `build_pages.mjs` one for one. Document `--markers` and `--link`. Complete the input list.

### 4. Major: "unique-text ratio" is undefined, has no threshold, and the report fields do not match
- **Affected Scope:** Step 3, item 4 (line 328) and Step 4, item 2 (line 333).
- **Style Rationale:**
  - The build does not compute a "unique-text ratio". It computes `max_similarity`: the highest Jaccard score over 5-word shingles against the most similar other location page (`most_similar_to`). That is a similarity, which runs the opposite way to a uniqueness ratio.
  - No threshold is given, so "reported" leads to no action. This matters because §The Problem item 5 names about 94% shared text as the main risk.
  - The listed qa-report fields are not the real ones. There is no H1 field and no internal-link count. `jane_links` is a count only. Unlisted fields exist: `pending_claims`, `missing_staff_facts`, `issues`.
- **Recommendation:** Name the metric exactly ("max 5-word-shingle Jaccard similarity to any other location page"). Set a pass threshold or name who sets it and when. List the report fields by their real keys.

### 5. Major: the QA check list has no verb, actor or method, and repeats Step 3
- **Affected Scope:** Step 4, item 2 (line 333).
- **Style Rationale:**
  - "QA checks:" is followed by bare noun phrases. The reader cannot tell which checks are automated and which are manual.
  - Three checks repeat Step 3.2 and 3.4, and the build already enforces them: em dash, Jane slug, unique-text.
  - Some listed checks are not implemented anywhere. No code checks that `tel:` matches the clinic phone. `screenshot.mjs` measures horizontal scroll only at 390 px and 1280 px, not at 320 px or 768 px. No step parses the JSON-LD.
  - "Reported" is not a pass condition.
- **Recommendation:** Split the list into "Enforced by build_pages.mjs" and "Checked by screenshot.mjs or manually", naming the tool for each check. Delete the duplicates. Give each remaining item a verb and a pass condition.

### 6. Major: "the Q-6 and Q-7 fields" is an indirect reference that loses a G3 field
- **Affected Scope:** Step 1, item 3 (line 315).
- **Style Rationale:** Q-6 and Q-7 are prose questions, not field lists. Q-7 lists six items and leaves out "nearby workplaces served". G3 (§4) requires that item, and `staff_facts.nearby_workplaces` stores it. A questionnaire built from this reference would lack a G3 column.
- **Recommendation:** List the CSV columns by key: the NAP fields (name, street, unit, postal, phone, hours) and the 7 `staff_facts` keys used in `worksafe-locations.json`.

### 7. Major: Step 1.1 uses jargon for its data sources and gets one source wrong
- **Affected Scope:** Step 1, item 1 (line 313).
- **Style Rationale:**
  - "The collector's public data branch", "client-filled Yelp list", "ICBC page data" and "GBP fields where known" are undefined for a new reader. The script's own docstring names the files: `data/yelp-nap.csv`, `research/02-icbc-location-pages.csv`, `data/locations-master.csv` and `origin/data availability.json`.
  - "Jane slug ... from the collector's public data branch" is wrong. Jane slugs are hard-coded in `CLINICS` in merge_locations.py. The Jane location id comes from locations-master.csv.
  - The item is one 70-word sentence with a nine-part inline list.
- **Recommendation:** Replace the sentence with a two-column table (output field, source file), using repo paths.

### 8. Major: status markers disagree with each other
- **Affected Scope:** Steps 1 to 5 (lines 313-338).
- **Style Rationale:**
  - Only Step 1.1 carries a status ("(done 2026-11-02)").
  - Step 1.2 says "Add `data/claims-signoff.json`", but the file exists. It also carries a `_how_to_use` key that the stated schema does not show.
  - The outputs of Steps 3 and 4 already exist with no status shown: `build_pages.mjs`, `screenshot.mjs`, 20 `pages/dist/` folders and 8 preview PNGs.
  - A reader cannot tell which work remains.
- **Recommendation:** Either give every item a status and date, or remove status from the plan and track it in PROJECT-STATE.md.

### 9. Major: "19+ locations" wording has no verb and contradicts §6.1
- **Affected Scope:** Step 4, item 2 (line 333); conflicts with §6.1 (lines 181, 183, 187).
- **Style Rationale:**
  - The check does not say whether it tests that the phrase is present, that it is exact, or that no other count wording appears. The build tests presence only.
  - §6.1 specifies "19+ Clinics", "19+ Synergy Rehab clinics" and "19+ clinics". spec/design-system.md line 699 requires "19+ locations" exactly.
  - A presence-only check passes pages that also carry the non-compliant variants. The document breaks the wording rule it checks.
- **Recommendation:** State the rule as "every page contains the exact string '19+ locations' and no other location-count wording". Align the §6.1 strings with it.

### 10. Nit: Step 4.1 says "each preview"
- **Affected Scope:** Step 4, item 1 (line 332).
- **Style Rationale:** By default `screenshot.mjs` captures 4 of the 20 pages (the pillar and the three Wave 1 pages). Each capture is both a full-page shot and a first-screen ("fold") shot. "Pre-installed Chromium" describes the environment, not the plan.
- **Recommendation:** "Captures the pillar and Wave 1 previews by default (other page ids by argument) at 390 px and 1280 px, full page and first screen, into `previews/`."

### 11. Nit: inconsistent path base
- **Affected Scope:** Step 5 (lines 337-338).
- **Style Rationale:** `worksafe-seo/RUNBOOK.md` and `worksafe-seo/REPORT.md` carry a prefix. Every other path in the scope is relative to `worksafe-seo/` (`build/...`, `data/...`, `pages/...`).
- **Recommendation:** Drop the prefix, or state the base directory once at the top of the section.

### 12. Nit: post-publish checks are labels without pass conditions
- **Affected Scope:** Step 5, item 1 (line 337).
- **Style Rationale:** One 75-word item packs in two nested parenthetical lists. "Live URL 200", "canonical" and "rendered meta" name a topic, not an expected result. §10 records a duplicate `rel=canonical` on 388 pages and a second meta description on 82 pages, so the expected counts matter here.
- **Recommendation:** Use sub-bullets with one expected result each, for example "URL returns HTTP 200" and "exactly one `rel=canonical`, equal to the page URL; exactly one meta description".

### 13. Nit: "10 next actions" is an arbitrary fixed count
- **Affected Scope:** Step 5, item 2 (line 338).
- **Style Rationale:** A fixed count with no rationale invites padding or cutting. "Executive summary" does not say what the summary contains.
- **Recommendation:** "A prioritised list of next actions, each with owner and blocking question (Q-n)."

### 14. Nit: the articles' place in the build is unclear
- **Affected Scope:** Step 2, item 3 (line 321) and Step 3, item 3 (line 327).
- **Style Rationale:** "Article bodies" does not say who writes them. §6.3 says the coverage guide is "delivered as a separate file for the content owner" and that the RTW article needs clinical sign-off. Step 3.3's "for each page" suggests the build renders the articles, but `build_pages.mjs` renders only the pillar and the 19 location pages.
- **Recommendation:** State that the build does not render the coverage guide or the RTW article, and name who writes and signs off each one.

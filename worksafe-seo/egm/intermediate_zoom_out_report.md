# Zoom Out Review (Intermediate, Stage 8): worksafe-seo/spec/design_draft.md

## Verdict: the architecture does not hold as written

The target page shape can stay: one pillar, a coverage guide, an RTW article, and per-clinic pages behind gates. Three load-bearing parts do not hold once the earlier findings are taken together:

1. **The gate is attached to the wrong thing.** The risky fact is the WorkSafeBC contract, and it belongs to a clinic. The design gates a page. Every page that mentions another clinic republishes that clinic's WCB status without checking its gate. This is true of the pillar (already reported) and of the three pilot pages after they pass all five gates (new, see Finding 1).
2. **The delivery model is the common root.** A templated build plus hand-pasted static fragments is the shared cause of most delivery, drift, rollback, editing and "hours today" findings. The site already runs a page-builder stack that renders data-driven templates natively.
3. **Scope, inputs and measurement are sized past the evidence.** They are built for 19 pages, a Jane collector the repo itself flags, and paid or unsecured tools. The evidence is about 1,000 searches a month across Canada with zero geo demand, and only 3 pilot pages can ship before the day-90 decision. That supports a pillar plus a pilot.

Recommended re-shape:
- (a) Make WCB status one switch per clinic, applied everywhere that clinic appears.
- (b) Cut this document to the pillar, the pilot, the criteria for scaling, and a launch plan ordered by dependency.
- (c) Choose the delivery model by page count.
- (d) Take the Jane collector out of the page data flow.
- (e) Measure outcomes with first-party sources, compared against clinics outside the pilot.
- (f) Move fact control from build time only to a recurring audit of the live pages.

---

## Findings

### 1. [Blocker] The gate is per page, but the contract fact is per clinic, so gated pilot pages still advertise WCB booking at ungated clinics
**Affected scope:** §4 (L145-153), §5 (L172), §6.2 band 6 "nearest clinic if this one is full" (L213), band 7 (L214); `pages/src/location.mjs` L41, L44-45, L63-71.

**Rationale:** The earlier stages found the leak on the pillar finder. It is structural, not specific to the pillar. Any page that mentions a neighbour clinic also renders:
- a "Book WCB physio at <neighbour>" link to Jane treatment 442;
- the FAQ line "Our nearest clinics also book WCB physio online: ...";
- the "nearest clinic that books WCB massage" sentence.

All three are tagged `SYN-JANE`, which is OK_TO_PUBLISH. The build only checks `SYN-01` and `SYN-08` against G1, so publish mode will never block them. The current build output shows it:
- New Westminster sends WCB bookings to Cedar Hills (HIGH risk, held to Wave 3) and Central City.
- Abbotsford sends them to Clayton Corners (HIGH risk).
- Richmond sends them to Delta (blocked by Q-2).

The register's own note on SYN-JANE says "Bookability is not proof of a WorkSafeBC contract". Adding a pillar-level gate, as the earlier stages imply, would still leave this leak open.

**Simplification:** Use one per-clinic attribute: contract confirmed yes or no, with vendor number, who confirmed and when. Every place a clinic appears reads it: finder card, nearby card, FAQ sentence, CTA label and schema. An unconfirmed clinic never gets a WCB CTA or a WCB claim anywhere. This one rule replaces:
- the G1 page gate;
- the special case for SYN-01 and SYN-08 inside `claim()`;
- most of the pillar gate problem.

The pillar can then ship with only clinic-independent WorkSafeBC process facts, plus a clinic count taken from confirmed clinics.

### 2. [Major] The architecture is sized for 19 pages; the evidence and the decision window support a pillar plus 3 pages
**Affected scope:** Overview (L13), §2 rules 2-3 (L123-124), §4 waves (L155-163), §6.2, Steps 1-4; `build/build_pages.mjs` (`--link` modes, cross-page Jaccard).

**Rationale:** The measured "WorkSafeBC physiotherapy" cluster in `data/keyword-master.csv` sums to about 1,050 searches a month. That figure is for all of Canada; the BC share is unknown, and "wcb" is also the name used in other provinces. Almost all of it sits in head terms the pillar owns. All 114 geo combinations had no volume. Near-me demand (about 180 a month) is won through the local pack, which means GBP, and D6 keeps GBP pointed away from these pages.

Inside this document's own horizon (day 90), only New Westminster, Richmond and Abbotsford can ship. None is in Surrey and none has a sibling within 2.5 km. So the following all govern pages that cannot exist before the scale decision:
- the close-sibling rule (rule 2);
- the Surrey city-word rule (rule 3);
- the 16 Wave 2/3 slugs;
- the nearby-clinic graph;
- the 19-page Jaccard comparison;
- the `--link all|wave1|published` switch.

The document also never sizes the prize. There is no estimate of WCB patients reachable through search compared with WorkSafeBC provider lists, employer referral or Maps. Without that estimate, a reader cannot judge whether a 19-page program is proportionate.

**Simplification:** Make this document pillar + pilot + scaling criteria. Write the Wave 2/3 rules in a follow-up document informed by pilot data. If the pilot is meant to reduce scaling risk, one pilot market should be a close Surrey pair; otherwise the scale decision has no evidence on the risk that matters (the ICBC rotation).

### 3. [Major] The critical path is ops and access, not build, and the plan has no step for any of it
**Affected scope:** Open Questions (L48-61), Non-Goals (L46), Detailed Implementation Plan Steps 1-5 (L309-338).

**Rationale:** All five Steps are build tooling, and most of it already exists (commit 1b0caad). Every real launch blocker is outside the build:
- Q-1 contract status: UNVERIFIED for 19 of 19 clinics, and it decides whether any WCB claim can appear at all.
- WordPress access: not connected.
- GA4 and GTM access: none.
- SE Ranking: the Data API ends 2026-11-06, four days after the document date, and whether tracking survives is unknown. Unit balance is also inconsistent: PROJECT-STATE.md says about 9,300; research/09 C-28 says 1,320 remained.
- worksafebc.com line checks: blocked from this environment.

None of these has a plan step, owner or date. There is also no branch for Q-1 coming back "some" or "none". The program's shape differs a lot between those cases: pillar only, a partial finder, or no WCB CTAs at all.

**Simplification:** Replace the Implementation Plan with a launch plan ordered by dependency:
- Step 0: Q-1 answers by a date, and a decision on SE Ranking renewal versus Search Console as the rank source (due before 2026-11-06).
- Step 0: WordPress and GA4 access.
- An explicit outcome for each Q-1 answer: all, some or none.

The build steps become one line: "built; re-run at hand-off". This also gives the G-1 and G-2 windows a start event.

### 4. [Major] The delivery model depends on page count and is not decided; the hybrid carries the costs of both options, and the site's own builder stack is not considered
**Affected scope:** §10 (L253-257), NFR rollout (L292), Alternatives (L259-283), Steps 2-5; research/02 §2.6.

**Rationale:**
- **At pilot scale** (pillar, 3 location pages, guide, article), there is little left to template. Authoring the pages in WordPress from a reviewed draft is the simplest path, and the build adds a paste step and a second copy that will drift.
- **At 19 pages**, the site already loads:
  - Elementor Pro (Theme Builder templates for header and footer are likely);
  - JetEngine (custom post types, meta fields, listing grids, queries by meta);
  - TeamPress (practitioner records by location, `/extp-location/` taxonomy, 102 `/member/` profiles);
  - Agile Store Locator (CSS observed).

  A clinic post type with one single template and a listing grid for the finder gives:
  - NAP edits in one field;
  - finder and nearby blocks that drop an unpublished clinic automatically (a contract-loss takedown becomes unpublishing one post);
  - editors working in fields instead of HTML;
  - post status with required fields as the gate;
  - server-rendered "hours today".

  Band 5 (WCB team) duplicates TeamPress as a new `staff_facts.wcb_team_with_consent` array.

The current design builds a parallel CMS: a JSON file, a Python merge, Node templating, a claims engine and manual paste. The earlier stages pointed to the availability plugin's data path. The installed page-builder stack is the more standard reuse.

**Simplification:** Add an Alternatives entry, "WordPress-native rendering (JetEngine and Theme Builder) vs static fragments", decided by page count. Confirm plugin licences and usage once WordPress access exists. For the pilot, author directly in WordPress.

### 5. [Major] Published content depends on a Jane collector the repo itself flags, and the dependency is avoidable
**Affected scope:** Overview (L11), §6.2 band 3 (L210), band 6 (L213), Step 1.1 (L313); `build/merge_locations.py` (needs `availability.json`); `collect.js`; plugin README in `synergy-next-availability (1).zip`.

**Rationale:** The merge needs `availability.json` from `collect.js`. That collector drives a headless browser against Jane's openings API, around the clock, from GitHub Actions. The plugin README in the same repo says Jane's Acceptable Use Policy prohibits collecting data with bots or scrapers, and that live collection stays off until Jane gives written permission. The repo contradicts itself here, and the design adds a new dependency on the contested side.

The feed supplies:
- which WCB types each clinic offers;
- the WCB massage answers and "nearest massage clinic" logic;
- the "N physiotherapists with WCB openings this week" counts;
- the dated "as of" line.

SYN-JANE says to re-check before every publish, which makes re-running the collector and the merge routine. Re-running the merge is the trigger for the gate-wipe the earlier stages found.

Which WCB appointment types a clinic offers changes slowly. It can be confirmed once per clinic in the Step 1.3 questionnaire, or exported by a Jane admin.

**Simplification:** Remove the collector from the page data flow. Get WCB service types from staff or a Jane admin export, and drop the counts of openings this week. One change removes a compliance exposure, the dated-data problem and the reason to re-run the merge.

### 6. [Major] Fact control sits at build time, but the live WordPress page is what must be correct
**Affected scope:** §5 (L165-173), G-4 (L34), Step 3.2 (L326), NFR rollback (L292), §3 rows for existing pages (L132-139).

**Rationale:** The claims engine (data-claim tags, register, sign-off file, publish mode) checks a fragment before it is pasted. After paste, WordPress is the source of truth, and nothing checks it again. Editors change copy. WorkSafeBC changes rules (research/05 expects a new agreement cycle). Contracts lapse. Wrong facts already live on the homepage, `/icbc-claims/` and the King George and Delta pages (Problem 3).

The earlier stages listed these as unmitigated risks, and found that titles, meta descriptions and JSON-LD bypass the tags. Extending the build to cover those adds machinery at a layer that still cannot see drift.

**Simplification:** Add one recurring check on the rendered live pages. The repo already runs scheduled GitHub Actions, so a scheduled fetch of the WorkSafe URLs is a direct reuse. It flags:
- register DO_NOT_PUBLISH phrasings ("approved", visit counts, "referral after 60 days");
- WCB CTAs to clinics without a confirmed contract;
- "as of" dates older than a set limit.

Give it an owner and a cadence (monthly, and whenever WorkSafeBC publishes a change). It sees heads and JSON-LD, so per-element tagging can become an authoring aid and a pre-publish review checklist rather than the main control.

### 7. [Major] The measurement stack is heavier than the two decisions it serves, and it does not measure the outcome
**Affected scope:** Goals G-1 to G-6 (L31-36), §9 (L246-251), Q-8 (L59), Non-Goals "No paid tools" (L45).

**Rationale:** The program has two decisions to make: scale after the pilot or not, and for each page, keep, narrow or noindex. The design instead specifies:
- about 121 SE Ranking pairs on a subscription with an unknown future;
- 10 AI prompts;
- 4 custom GA4 events via GTM, on a site that loads three GA4 gtags and two Meta pixels (research/02 §2.6), with no GA4 access (research/07 #7);
- position guardrails of ±3.

None of these counts WCB bookings. Two first-party sources come closer:
- Search Console at page level: free, direct, and shows query and page.
- Jane's appointment reports: WCB Physio Initial bookings per clinic per week. Staff access is likely; not yet checked.

Comparing pilot clinics with clinics outside the pilot over a pre-launch baseline period gives a usable read on effect, and does not depend on attribution across the Jane domain.

**Simplification:** Make Search Console plus Jane WCB initial bookings per clinic (pilot vs non-pilot, with a 4 to 8 week baseline) the primary measures. Keep SE Ranking and GA4 events as optional extras once access exists. This also matches the "no paid tools" non-goal.

### 8. [Major] A second design system for a handful of pages inside an Elementor kit
**Affected scope:** §6 (L177), NFR performance (L290); `pages/assets/worksafe.css` (59 KB, 162 `sr-ws-` classes, its own tokens, radii and shadows, Inter as body font); `spec/design-system.md` (753 lines, §5.1 says Inter is likely not loaded on the site).

**Rationale:** The site's visual system is the Elementor kit (Montserrat, global colours) plus the availability widget's tokens. The WorkSafe pages bring their own token layer and a new font family, so they become an island:
- Kit-level changes will not reach them.
- Editors cannot extend them with native widgets.
- They need conditional enqueue, which requires theme access nobody owns.

This compounds Finding 4: the bespoke CSS is what forces hand-coded HTML.

**Simplification:** Use the kit globals and native Elementor widgets (accordion, icon list, buttons). Keep a small scoped stylesheet only for components the kit lacks: steps and finder cards. Drop the extra font family.

### 9. [Nit] No precedence rule across the document set
**Affected scope:** §6 (L177), Additional Resources (L296-300); `spec/design-system.md`, `spec/modern-seo-cluster.md`, PROJECT-STATE.md, `build/` and `pages/src/`.

**Rationale:** The earlier stages found specific conflicts: band numbering, VERIFIED vs publish_rule, checklist rows marked "must pass", and build code that differs from the spec. They all share one cause: nothing says which artifact wins.

**Simplification:** State that design_draft.md is normative. Mark the other files as informative, or fold the few rules this design needs into it. State whether code follows the document or the reverse.

---

## Mitigations the earlier findings imply, grouped by the one structural change that covers each group

| Earlier findings (group) | Structural change |
|---|---|
| Pillar has no gate; finder gives all 19 clinics WCB links; "pending G1" undefined; title and meta bypass data-claim; "19+" not in the register | Per-clinic WCB status read at every mention (Finding 1); pillar limited to clinic-independent claims; clinic count taken from data |
| Hand-paste re-paste loop; drift; content team cannot edit; takedown touches 5+ pages; rollback leaves broken links; "hours today" impossible; unused CSS | Choose delivery by page count; WordPress-native rendering at scale (Finding 4) |
| Merge re-run wipes gates and staff facts; two claim stores; dated Jane data; corrupt nearby entries | Collector out of the data flow; human inputs captured once and stored in one place; at scale, store them as WordPress fields (Findings 4, 5) |
| No Risks section; contract lapse; WorkSafeBC rule change; G-4 unenforceable on heads and JSON-LD; wrong facts live sitewide | Live-page audit with owner and cadence (Finding 6) |
| SE Ranking expiry; GA4 access missing; ±3 guardrail noise; pilot cannot attribute; Wave 2 before value is shown | First-party outcome measures with a non-pilot comparison and a baseline period; the scale decision tied to them (Findings 3, 7) |
| G3 test inverted; G4 and G5 not real gates; Wave 1 never exercises the close-pair rules | Narrow the document to the pilot; include a close pair if scaling risk is to be tested; move the Wave 2/3 rules to a follow-up (Finding 2) |

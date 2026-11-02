# egm-design

# Design Critic Goldfish: REVIEW of spec/design_draft.md (lines 1-308)

Standard: feature-spec-standard.md. Evidence comes from the cited research/data files and the existing build (`build/build_pages.mjs`, `build/merge_locations.py`, `pages/src/*.mjs`, `pages/dist/qa-report.json`).

**Verdict: does not pass.** There are two Blockers. First, the pillar has no publish gate, yet it claims WorkSafeBC physio at "19+" clinics while SYN-01 (2026 contract) is UNVERIFIED for all 19. Second, the standard requires a Risks & Mitigations section and the document has none. The core anti-cannibalization design also has gaps. It copies the ICBC hub-and-child URL pattern, title pattern and H1 source. It sends head-term signals to location pages instead of the pillar. Its uniqueness test is logically inverted, and its pilot cannot exercise the multi-clinic risk it is meant to test.

---

## Blockers

### B1. Pillar is ungated but makes contract-dependent claims for all 19 clinics
- **Scope:** lines 52, 145-153, 172, 181-183, 187, 189, 194
- **Finding:** The gates G1-G5 apply only to location pages. The pillar launches with no gate, and Q-1 ("blocks publishing any page") is never applied to it. The pillar's title, meta, hero copy, trust tiles ("19+ clinics", "WCB online booking") and finder all assert WorkSafeBC physio at every clinic. Each finder card carries a "Book WCB assessment" Jane link, including Cedar Hills and Clayton Corners. Both are HIGH risk: neither appears on the cached WorkSafeBC MSK list, and Medimap shows private pay only (SYN-16).
  - Under §5 the SYN-01 coupling is per clinic. Pillar statements have no clinic, so one global sign-off of SYN-08 ("we bill WorkSafeBC") unblocks it for all 19. That is how `build_pages.mjs` `claim()` works: the G1 check runs only when `clinic` is set.
  - Title and meta description cannot carry `data-claim`, so they bypass §5 entirely.
  - "19+" is not in the claims register. research/09 C-10 counts 19 rehab clinics.
  - **Harm:** a worker books WCB at a clinic not contracted under the April 2026 agreement. They pay up front and are reimbursed only at $95/visit, paying any difference themselves (WSBC-26).
- **Recommendation:** Add a pillar gate.
  - The finder lists WCB booking only for clinics with G1 true. Other clinics get "Call to confirm WCB" or are left out.
  - Title, meta and trust-tile counts are computed from the G1-true count, and the "+" is dropped.
  - Pillar-level Synergy statements (SYN-08, SYN-09, WSBC-24 framing) require G1 for every clinic named or implied.
  - Title, meta and JSON-LD go through the same claim check as body copy.

### B2. No Risks & Mitigations section (standard compliance)
- **Scope:** whole document. Risk content is scattered across lines 25, 163, 257 and 289-292.
- **Finding:** The standard requires the spec to list its failure modes, security implications and scalability limits, each with a mitigation. The document has no risk register, and several major failure modes are not covered at all:
  - A clinic's contract lapses or is revoked after its page is live. There is no SLA or takedown owner.
  - WorkSafeBC changes rules mid-program. PABC expects further changes in the next agreement (WSBC-09). There is no re-check cadence and no bulletin watch; the "as of" date is set once.
  - Rank tracking stops when the SE Ranking Data API lapses on 2026-11-06.
  - A merge-script re-run wipes gate and staff-fact state (M10).
  - Static fragments drift from the repo (M13).
  - Health-adjacent analytics data reaches ad tools (M17).
- **Recommendation:** Add a Risks & Mitigations table. Each row gives the trigger, detection signal, owner, mitigation and time-to-mitigate. At minimum cover the six items above plus the cannibalization outcomes in M1-M5. Add a quarterly or bulletin-triggered claims re-verification with a stale-date gate in the build. For example: refuse publish if `checked_as_of` is more than 90 days old.

---

## Major

### M1. Head-term ownership is inverted
- **Scope:** lines 110-115, 122-124, 181, 202-203
- **Finding:** Rule 1 says only the owner URL names its cluster. The location title template does the opposite: `WorkSafeBC Physio <Name> | WCB Physiotherapy | Synergy Rehab`.
  - The pillar's own title is 68 characters. It therefore always hits the over-65 fallback, which drops "| WCB Physio". The pillar ships with no "WCB" in its title, even though `wcb physiotherapy` (210/mo) is its largest term.
  - 12 of 19 location titles are 65 characters or fewer, so they keep "WCB Physiotherapy" (Vancouver, Burnaby, Richmond, Delta, Nordel, Cedar Hills, King George, Newton, Fleetwood, Cloverdale, Langley, Abbotsford).
  - For Surrey, the pillar is the declared owner but its H1 lacks "Surrey". Twelve location H1s read "WorkSafeBC physiotherapy in X, Surrey" (rule 3).
  - This reproduces the ICBC result: the `/icbc-treatments/` hub ranks in only 6 of 93 pairs, and child pages win (research/07 §2.3).
  - The shipped build already uses different titles from the spec (location: `WCB & WorkSafeBC Physio in <place>`), so the spec is not the source of truth.
- **Recommendation:**
  - Location titles and H1s: lead with the clinic or neighbourhood and street, and leave out the bare head term. For example, `Newton WorkSafeBC physio clinic, 72 Ave Surrey`.
  - Pillar: keep both "WorkSafeBC" and "WCB" within 65 characters.
  - Give the pillar an explicit "Surrey" finder heading in an H2.
  - State that the spec's formulas are normative and have the build test title vocabulary against the owner table.

### M2. Pillar and coverage guide overlap on head term and question set
- **Scope:** lines 75, 104, 117, 122, 188, 190, 196, 221
- **Finding:**
  - D3 keeps "WorkSafeBC physiotherapy" in the guide's title. This breaks rule 1 and goes against research/06 §7.2 and research/01 (guide rated "High" cannibalization risk; retitle it).
  - CUJ2 sends the pending-claim query to the pillar FAQ with a full sourced answer, but §2 assigns "pending claim" to the guide.
  - Pillar bands 2, 4 and 10 cover claim number, pending claims, "will I pay" and referral. Those are the same measured questions the guide uses as its H2s.
  - The design picks research/08 (guide ranks in 4 cities) over research/07 and research/01 (guide ranks for 0 keywords in the SE Ranking database) without reconciling the two.
- **Recommendation:** Decide one owner per question and enforce it. Either the pillar gives 1-2 sentences plus a link and the guide answers in full, or the guide is merged into the pillar with a 301. Rewrite CUJ2 to match. If the guide keeps the head term, show the expected rank trade-off and add a specific pillar-vs-guide alternation alarm.

### M3. The main risk premise is an unproven causal claim
- **Scope:** lines 25, 123, 203, 217
- **Finding:** Problem 5 says the 94% shared text "causes" rotation of about 5 URLs per query and that "17 of 29 rank the wrong clinic's page". The data does not support that cause:
  - The 5.0 distinct URLs come from all ICBC URL families: hub, `/icbc-physiotherapy-in-*`, blog posts and `/icbc-claims/` (research/07 §2.3, §3.2).
  - The ICBC location pages first ranked on 2026-10-02, so the 31-day window is mostly post-indexing settling.
  - research/07 says "a different page from their target, usually another clinic's", not always the wrong clinic.
  - The proposed mitigation is the same one the ICBC pages already have. `area_label` is copied from the ICBC H1 (`merge_locations.py`). Own-area H1 plus a templated body is the ICBC pattern with the program name swapped.
- **Recommendation:**
  - Restate the claim as a correlation.
  - Separate rotation across URL families from rotation among sibling location pages, and re-measure ICBC after 60-90 days.
  - Make the mitigation something the ICBC pages do not already have: substantive unique facts, a similarity threshold (M4), and no second WorkSafe URL family (M6).

### M4. Uniqueness test is inverted and unquantified; no cross-program check
- **Scope:** lines 151, 217
- **Finding:**
  - The test removes the unique bands (2, 4, 5, 6) and then asks whether the rest "could describe any other clinic". The rest is the shared template, so as written the test fails every page, or in practice it gets ignored.
  - G3's "4 of 7" can be met with low-information facts such as parking, a language list or "nearby workplaces served", which is a marketing claim, not a fact.
  - The build computes a 5-word-shingle Jaccard similarity (0.42-0.53 in qa-report.json) but applies no threshold, and compares only against other WorkSafe location pages. It never compares a page to the same clinic's ICBC page, which is the page that already ranks for WorkSafe queries in Richmond and Abbotsford.
- **Recommendation:** Fix the test: swap the name and NAP into another clinic's page; if every sentence is still true, fail. Set a numeric maximum similarity (for example 0.35) against both sibling WorkSafe pages and the same clinic's `/icbc-treatments/` page, and fail publish mode above it. Define minimum content per G3 fact, such as word count and specificity.

### M5. Pilot cannot test the risk that matters, and Wave 2 scales 14 pages at once
- **Scope:** lines 155-163, 125
- **Finding:** Wave 1 is New Westminster, Richmond and Abbotsford. All three are single-clinic markets, with no Surrey clinic and no close pair. The scale gate ("no cannibalization alarm") barely has a chance to fire there. Wave 2 then publishes 14 pages at once, including 9 Surrey clinics and the King George/Newton pair (2.4 km), which are exactly the multi-clinic conditions that produced the ICBC churn.
- **Recommendation:** Add one Surrey close pair (King George + Newton) or one Surrey cluster to Wave 1, or split Wave 2 into Surrey sub-waves with their own day-30 review. Define pass/fail numbers for "no cannibalization": maximum distinct WorkSafe URLs per query per engine and minimum pillar share for Surrey queries.

### M6. Legacy WorkSafe-intent pages are not dispositioned (second URL family)
- **Scope:** lines 127-139
- **Finding:** §3 only swaps visit-count/fee sentences on "general clinic pages". Left untouched:
  - The 5 newer clinic pages with full WorkSafe sections, including `/physiotherapy-abbotsford-chiropractor/` in the Abbotsford pilot.
  - 66 legacy city/service pages with "We Accept ICBC, WCB, MSP".
  - `/richmond-physiotherapy-2/` (#7 for `wcb physio richmond`, Richmond pilot), the shared `/clayton-physiotherapy-treatment-clinic/`, 8 neighbourhood pages and 35 `/extp-location/` archives (research/01 §1.3; research/08 row 123).
  - research/07 §3.2 says explicitly not to leave a second indexable WorkSafe location family.
- **Recommendation:** Add a full URL inventory for WorkSafe intent, with a per-URL action (shorten to a pointer, canonicalize, noindex or 301) and a trigger tied to each clinic's launch. Make G4 mean "this inventory is applied for the clinic".

### M7. New Westminster: G-2 contradicts the §3 decision
- **Scope:** lines 32, 133, 61
- **Finding:** `/physiotherapy-in-new-west/` is kept unchanged at #3/#3/#6 and remains an AI Overview source. G-2 requires the new page to be Synergy's best-ranking URL within 60 days. The day-30 decision tree covers "new page outranks" and "both alternate" but not the likeliest outcome: the old page keeps winning. Q-10 (ads landing page?) has no owner or date, and it decides whether anything can change.
- **Recommendation:** Add the missing branch with an action, such as moving WorkSafe copy to the new page with a pointer or a canonical. Alternatively, exempt New Westminster from G-2 and say so. Resolve Q-10 before Wave 1.

### M8. G-5 guardrail cannot work at a ±3 tolerance
- **Scope:** line 35
- **Finding:** The baseline is a single day (2026-11-02). The observed 30-day ranges for the guardrail terms are far wider than ±3:
  - `icbc physiotherapy`: Delta 1-80, Richmond 1-79, Vancouver 1-56.
  - `icbc physio`: New Westminster 2-72.
  - `car accident physiotherapy`: Abbotsford baseline #85 (data/rank-baseline.csv).
  - The guardrail will alarm on normal volatility and cannot attribute changes to WorkSafe pages. research/07 §7E proposed the right signal: the ranking URL switching to a WorkSafe page.
- **Recommendation:** Replace it with:
  - a URL-takeover rule (any guardrail term ranked by a WorkSafe URL);
  - a rolling median against the prior 28-day median, with a tolerance derived from each pair's historical spread.

### M9. Measurement plan depends on tools and access that are not secured
- **Scope:** lines 31-36, 45, 59, 246-251
- **Finding:**
  - The SE Ranking Data API expires 2026-11-06. Whether rank tracking stops with it is UNKNOWN (research/07 §7).
  - Adding about 121 pairs on top of 172 may exceed an unknown plan limit. A renewal or upgrade conflicts with the "No paid tools" non-goal.
  - GA4 and GTM access do not exist (research/07 §5), and neither is an Open Question, so G-3 ("per 100 organic sessions") cannot be measured.
  - GSC is available only through SE Ranking, with no page URLs or date range.
  - G-6 relies on per-prompt AI results, which the API returns as null groups, and the whole-site project has no AI Overview engine.
  - No requirement for a 2-week pre-launch baseline.
- **Recommendation:**
  - Add Open Questions with owners for GA4 read access, GTM publish access, direct GSC access, SE Ranking renewal and keyword quota, and an AI Overview engine.
  - Add "tracking live 14 days before launch" to G5.
  - Define a manual fallback for G-6 (data/ai-visibility-log.csv) and for rankings if SE Ranking lapses.
  - Reconcile with the "No paid tools" non-goal.

### M10. Data-store integrity: gates and staff facts can be silently wiped; G4 is pre-passed; nearby data is corrupt
- **Scope:** lines 85-87, 145-153, 123, 214, 239
- **Finding:**
  - `merge_locations.py` rewrites the whole `worksafe-locations.json` with `publish_gates` false and `staff_facts` null. CUJ4 has Marketing hand-edit the same file, so any re-run (for example to refresh Jane or NAP data) wipes them.
  - G4 is hard-coded true for all 19 clinics although none of §3 has been applied.
  - Gates are bare booleans flipped by Marketing, with no evidence fields (vendor number, signer, date) for the compliance-critical G1. The Q-1 answer has nowhere to live.
  - The `nearby` data is corrupt in 15 of 19 clinics. The regex lets address fragments through as names with `slug: null` (for example `"- 301 East Columbia Street, New Westminster ; 04 Delta"`). This feeds band 7, the `<Name>, <distance> km` anchors and rule 2's distances. The distance method is UNKNOWN (research/09 A-09).
- **Recommendation:**
  - Split generated data from human-attested state, for example a separate `clinic-gates.json` with `{value, by, date, evidence}` per gate. The build reads both, and the merge never touches attested state.
  - Default G4 to false.
  - Fix the nearby parser and fail the build on any null slug.
  - State the distance method (straight-line or driving).

### M11. Claims enforcement cannot deliver G-4
- **Scope:** lines 34, 167-173
- **Finding:**
  - The build checks only elements that already carry `data-claim`. An untagged WorkSafeBC fact, title, meta description or JSON-LD value passes silently.
  - One claim id per element cannot express compound statements. For example, "no fees at this clinic" needs both SYN-01 and WSBC-24, but §5 tags it SYN-01 only, so the fee rule (STAFF_CONFIRM) is never checked.
  - design-system.md §13 and §15 still gate on `status = VERIFIED`, while §5 gates on `publish_rule` (research/09 C-25 unresolved). Two governing documents disagree.
- **Recommendation:** Allow multiple ids per element (`data-claim="SYN-01 WSBC-24"`). Run claim checks over title, meta and JSON-LD. Add a lint that flags WorkSafeBC keywords or numbers outside tagged elements, and name a human reviewer step for whatever the lint cannot catch. Amend design-system §13 and §15 to use `publish_rule`.

### M12. "No visit counts" rule conflicts with the claims used, and the Open Questions miss pillar-blocking claims
- **Scope:** lines 34, 171, 195, 210, 48-61
- **Finding:**
  - WSBC-35 (used in band 9 and location band 3) states "up to 6 treatments in the first 8 weeks". WSBC-36 states "up to 8 visits in 8 weeks". Both are visit counts that the build would publish (pillar.mjs already does).
  - The pillar's pending claims per qa-report.json are GEN-01, WSBC-16, SYN-PEND, WSBC-30, SYN-08, WSBC-49 and WSBC-36. Only WSBC-16 and WSBC-30/SYN-PEND map to Q-4 and Q-5. GEN-01, SYN-08 (pillar-wide), WSBC-36 and WSBC-49 have no question or owner, so the pillar's critical path is hidden.
- **Recommendation:** Either extend the visit-count ban to massage and acupuncture or explicitly exempt WSBC-35 and WSBC-36. Generate the Open Questions list from the build's pending-claim output, with an owner and due date for each.

### M13. Cross-selling WCB massage/acupuncture ignores the concurrent-care caution and unknown RMT status
- **Scope:** lines 119, 195, 210
- **Finding:**
  - research/05 §7 flags "one therapy type at a time / no concurrent treatment for the same injury" (LIKELY) and says staff must confirm before cross-selling massage or acupuncture alongside physio.
  - RMT and acupuncturist WorkSafeBC status at Synergy is UNKNOWN.
  - Jane shows only "WCB Massage Subsequent", with no initial type (research/09 C-16).
  - None of this is in the Open Questions, yet the pillar and 9 location pages promote it.
- **Recommendation:** Add an Open Question with an owner covering concurrent care, RMT and acupuncture contract status, and how a first WCB massage visit is booked. Keep band 9 and the location massage and acupuncture rows out of publish mode until it is answered.

### M14. Static paste-in delivery creates drift and a manual, fragile rollback
- **Scope:** lines 208, 236-240, 253-257, 292
- **Finding:**
  - Each page is a hand-pasted Elementor HTML fragment. Any data change requires a rebuild and a re-paste across many pages: Jane types, hours, "as of" date, claim wording, or a new sibling going live (pillar finder plus up to 4 nearby blocks).
  - Nothing detects drift between the repo and WordPress.
  - Rollback sets the page to draft, which makes it a 404. It removes only the finder link, so sibling nearby blocks and the general clinic page's link become broken. A contract-loss takedown therefore touches 5 or more pages by hand.
  - Pillar rollback to the previous revision brings back known-wrong facts (SYN-02, SYN-04).
  - "Hours today summary" (band 1) cannot work in static HTML with "no new JavaScript".
- **Recommendation:**
  - Consider WordPress-native templating (Elementor dynamic tags, ACF or custom fields, or a shortcode reading one JSON) in Alternatives.
  - Otherwise add a page-to-dependency manifest and a post-deploy diff check against the live HTML.
  - Define the takedown as one runbook step that rebuilds every dependent page, and decide between a 410 and a 301 to the pillar.
  - Forbid restoring pillar revisions from before the rebuild.
  - Replace "hours today" with static weekly hours.

### M15. Alternatives section is thin and partly circular (Alternatives Rule)
- **Scope:** lines 259-283
- **Finding:**
  - Alternative A is rejected because "the scope rule rules out mixed pages". The scope rule governs these new pages, so this is circular, and A's main advantages (no new cannibalizing URL, GBP landing pages gain relevance) are not weighed.
  - Viable designs not evaluated:
    - merge the guide into the pillar with a 301 (research/08 F7);
    - pillar-only plus finder until pilot data exists;
    - location pages indexable only after a threshold, otherwise noindex;
    - WordPress-native templating versus static fragments;
    - a path-scoped SE Ranking project for `/worksafe-physiotherapy/` (research/07 §7).
- **Recommendation:** Add these alternatives with specific rejection reasons (cost, risk, measured evidence). Re-argue Alternative A without leaning on the scope rule.

### M16. CUJ1 asks the user for something they cannot have yet
- **Scope:** lines 67-69, 189, 204
- **Finding:**
  - The persona has not reported to WorkSafeBC. The hero CTA lets them book before they see the 3-step path, but WSBC-13 says to report before or when booking.
  - The claim number arrives by mail (WSBC-46), yet the location meta description says "Bring your WorkSafeBC claim number". Someone injured yesterday cannot do that, and nothing says what to do instead.
  - The CUJ's "Then" measures an event firing, not a correctly prepared booking.
- **Recommendation:** Put "Report to WorkSafeBC first (Teleclaim/online)" next to or above the primary CTA. Change the meta description to "Report your injury, then book". Add a CUJ outcome such as "worker knows to report first and that a pending claim is enough for the assessment".

### M17. Head-term SERP assumption is unsupported, and the main term is not BC-specific
- **Scope:** lines 102, 270, 31
- **Finding:**
  - D1 and the rejection of Alternative B say both head terms "show a local pack". research/06 §4.1 says the local pack appears on the "wcb" and "approved" variants. The "worksafebc"/"wsbc" spellings lean informational (video, PAA, AI Overview), and `worksafebc physiotherapy` SERP features are Not Available.
  - Part of `wcb physiotherapy` (210/mo) is out of province (research/06 §1.3), yet G-1 uses it as a primary success term.
- **Recommendation:** Correct D1 and Alternative B to the evidence. Assess whether `worksafebc physiotherapy` favours the informational guide. Make G-1 use BC-specific spellings, or weight them separately.

### M18. Privacy: ad-tool and remarketing exposure not addressed
- **Scope:** lines 248, 289, 61
- **Finding:** Events fire through GTM on pages whose subject implies a workplace injury. Google Ads is in use (Q-10). Nothing forbids sending `worksafe_*` events as Ads conversions or building remarketing audiences from WorkSafe visitors, which is a health-related sensitive category. CallTrackingMetrics swaps numbers on these pages (design-system §14.6) and logs calls tied to the page. Only the event payload contents are restricted.
- **Recommendation:** Add NFRs:
  - WorkSafe pages are excluded from remarketing and audience lists.
  - `worksafe_*` events are not imported to ad platforms.
  - The GTM tags firing on WorkSafe URLs are listed and approved.
  - Call-tracking retention is reviewed under BC PIPA.

### M19. Design knowingly fails its own acceptance checklist, and the CWV target is tested on the wrong artifact
- **Scope:** lines 141, 177, 196, 226-229, 290
- **Finding:** spec/modern-seo-cluster.md says every page "must pass each row before publish". The design conflicts with four rows:
  - The checklist says GBP links point to the matching page; D6 says no.
  - The checklist sets INP below 200 ms; the design says it is "reported, not promised".
  - The checklist requires sameAs to GBP; §7 has none.
  - The checklist sets 40-60 word answers; the design uses 40-80.

  LCP and CLS are targeted on "lab tests of the fragment". That means `preview.html` with a mock header, not the live theme with about 3.8 MB of JS and 46-51 CSS files.
- **Recommendation:** Amend the checklist or comply, and record each deviation. Measure CWV on WordPress drafts of the real page (PageSpeed Insights mobile, p75 field data after launch). State the expected miss and the dependency on the site-wide JS fix.

### M20. Problem 3 is not actually closed
- **Scope:** lines 23, 136-139
- **Finding:** The ICBC "No change" rule and the owner-pending `/icbc-claims/` row leave wrong WorkSafeBC facts live on the domain. That includes SYN-03 (15/6) on `/icbc-claims/` and "up to 15" on the King George and Delta pages, where page type is unclear in research/05 §9. AI Overviews already quote wrong clinic FAQs (research/08 F8). G-4 only covers the new pages. Homepage and blog fixes depend on WordPress access, with no owner or date.
- **Recommendation:** Add a scope-rule exception that allows removing incorrect WorkSafeBC statements from ICBC or mixed pages without adding ICBC content. List every live instance by URL with an owner and a deadline tied to pillar launch. Extend G-4 to "domain-wide".

---

## Nits

- **N1. Jane deep link** (lines 11, 69, 244): treatment 442 is hard-coded for all clinics. Richmond and New Westminster (both pilots) also have WCB initial variants, such as "(40 mins)". That the link opens the type directly is only LIKELY (research/04 §7). Confirm per clinic and allow an override.
- **N2. Schema** (lines 226-229):
  - The site's existing JSON-LD is unknown. research/01 says a structured-data crawl is needed before schema decisions. The SEO plugin may emit its own WebPage, Organization or Breadcrumb nodes, which would duplicate or conflict.
  - Organization is declared only on the pillar. Google evaluates each page on its own, so `parentOrganization` by `@id` is unresolved on location pages.
  - `hasMap` has no data field, and `sameAs` is missing.
- **N3. CSS budget** (line 290): `worksafe.css` ships as 59 KB unminified (11.4 KB gzip), and there is no minify step. The hero target is 120 KB here but 150 KB in design-system §11. The map is "directions link only" here but a `<details>` iframe in design-system §9.7.
- **N4. Open Questions** (lines 48-61) have no owner, due date or launch timeline. The G-1 and G-2 windows start at a pilot launch whose date depends on them.
- **N5. G-1 wording** (line 31) is unclear: does it require both keywords or either? The 90-day window will include Wave 2 effects, which confounds the pilot.
- **N6. Overstatement** (line 24): "Most competitors publish an incorrect 'referral after 60 days' rule". research/08 names two (Reform, NewLeaf) plus the AI Overview.
- **N7. Abbotsford Maps** (line 158): no WorkSafe Maps keyword is tracked for Abbotsford, and Q-8 does not cover SE Ranking Local. With D6, GBP never links to the WorkSafe page, so Maps effects will be hard to attribute.
- **N8. Capacity**: Vancouver, Burnaby and Clayton Corners each have 2 WCB physios with openings. No gate checks capacity before driving traffic.
- **N9. "Call button to the main line"** (line 187) is undefined. The corporate line is Nordel's number (research/09 C-05), so `worksafe_phone_click` attribution and call routing would be skewed.
- **N10. Display names** (lines 202-204): there is no canonical-name rule (research/09 C-08). Titles use `<Name>` ("Central City", "Clayton Corners") while H1s use `area_label` ("Surrey City Centre", "East Clayton"), and WorkSafeBC lists use "King George Hub". This weakens entity consistency.
- **N11. Hero photo**: the build treats it as a hard publish blocker, but G3 lists the consented photo as optional (4 of 7). Align the spec and the build.


---

# egm-structural

STRUCTURAL GOLDFISH REVIEW: worksafe-seo/spec/design_draft.md, lines 1-308, checked against feature-spec-standard.md

Heading map in scope: H1 (L1) > H2 Overview, The Problem, Goals, Non-Goals, Open Questions, CUJs (H3 x4), Technical Plan (H3 §1-§10, H4 6.1-6.3), Alternatives Considered (H3 A-D), Non-Functional Requirements > H3 Additional Resources, H3 Future Improvements. Every table has the same number of columns in each row. There are no unclosed code fences and no em/en dashes. The document contains no Markdown hyperlinks at all.

---

**1. Severity: Blocker**
Affected scope: whole document. Expected between Alternatives Considered (L259) and NFR (L287).
There is no "Risks & Mitigations" section. The standard ("Risks & Limits") requires the spec to name its failure modes, security implications and scalability limits, and to say how each is mitigated. Risk material is scattered across Problem #5 (L25), §2 rule 4 (L125) and NFR (L289-292). None of it lists the failure modes the plan depends on:
- The SE Ranking Data API expires 2026-11-06 (L59), 4 days after the doc date. G-1, G-2, G-5, G-6 and gate G5 all measure through it.
- Fragments are pasted by hand into Elementor, and nothing keeps WordPress in sync with build output.
- WorkSafeBC facts go stale after the one-time check date, and no re-check cadence exists.
- The staff questionnaire may never be returned.
- Contracts may be denied for Wave 3 clinics.
- The sitewide duplicate canonical (L257) will apply to the new pages. "Must not add to these" does not stop that.
- Scaling to 19 manual pastes plus 19 JSON-LD blocks has no stated limit.

**2. Severity: Major**
Affected scope: Alternatives Considered (L259-283), §10 (L253-257), D2 (L103), D6 (L141), §3 `/tag/worksafebc/` row (L135).
Alternatives cover only page architecture. Several committed designs are single paths with no rejected options:
- The delivery and build mechanism (Node-built static fragments pasted into an Elementor HTML widget). Alternatives would be Elementor templates with dynamic fields, a custom post type with ACF, or a programmatic-page plugin.
- The child URL pattern D2, against a flat `/wcb-physio-<city>/`.
- The GBP target decision D6.
- noindex against redirect or consolidation for the tag archive.
The Alternatives Rule fails for these components.

**3. Severity: Major**
Affected scope: Alternatives B, C, D, "Reason for Rejection" (L271, L277, L283).
These fields restate the adopted design instead of giving a rejection reason:
- B: "Kept as the coverage owner instead"
- C: "Pillar finder owns multi-clinic city queries"
- D: "Gated waves with a 30-day pilot review"
The standard requires specific, documented reasons such as cost, complexity, performance or scalability. As written, only A has a real rejection rationale.

**4. Severity: Major**
Affected scope: §1 D3 (L104) against §2 rule 1 (L122) and the §2 owner table (L111, L117).
D3 keeps "WorkSafeBC physiotherapy" in the coverage guide's title. Rule 1 says the title, H1 and first paragraph name only the owner cluster. The table assigns "worksafebc physiotherapy" to the pillar and claim/coverage terms to the guide. The cited evidence also points the other way: research/06 §7.2 says "change its title/H1 away from the head term", and research/01 §5.2 rates this as High cannibalization risk. The spec breaks its own rule and its own evidence, and does not record the retitle option as a rejected alternative.

**5. Severity: Major**
Affected scope: §2 owner table (L113, L119) and rule 4 (L125).
The "Owner URL" column is meant to name one owner, and rule 4 uses that owner to break ties. Two rows have more than one owner:
- "near me": location pages and pillar finder
- WCB massage/acupuncture: pillar and clinic pages
For these clusters the tie-break cannot be applied.

**6. Severity: Major**
Affected scope: Goals (L31-36), gates table (L147-153), and mixed use at L52, L56-59, L136, L157, L163, L173, L189. Decision IDs at L102-105 and L141.
Goals use G-1 to G-6 and publish gates use G1 to G5, so each pair differs only by a hyphen (G-1/G1, G-5/G5). L163 ("no G-5 regressions"), L173 ("if G1 is false") and L189 ("pending G1") depend on the reader noticing the hyphen. Decision IDs also jump from D4 to D6. D5 does not exist, which looks like a deleted decision.

**7. Severity: Major**
Affected scope: Open Questions (L48-61).
The intro says "Each blocks only the items named":
- Q-9 and Q-10 name nothing, unlike Q-1 to Q-8.
- Q-9 in fact blocks publishing every page, because L173 needs the reviewer name from claims-signoff.json, and L222 requires clinical sign-off for the RTW article.
The list has no owner or needed-by field, unlike the gates table, which has an Owner column. Q-8 has a hard deadline of 2026-11-06 that is not flagged.

**8. Severity: Major**
Affected scope: §4 (L145) against §6.1 (L181-183, L187, L189) and Q-1 (L52).
Publish gates are defined only for clinic pages. The pillar, coverage guide and RTW article have no publish criteria, yet Q-1 "blocks publishing any page". The pillar's title, meta description and trust tile ("19+ Clinics") and band 3 ("we handle WorkSafeBC billing") assert SYN-01 (STAFF_CONFIRM, UNVERIFIED) for every clinic, including HIGH-risk Cedar Hills and Clayton Corners. A `<title>` or meta tag cannot carry `data-claim`, so §5 (L167) cannot be enforced on it.

**9. Severity: Major**
Affected scope: §5 (L172) against the §6.1 table (L188, L189, L195).
The claim-tagging conventions conflict:
- §5 says direct-billing elements carry `data-claim="SYN-01"`. §6.1 band 3 tags the same statement SYN-08 "pending G1".
- The table annotates status three ways: "pending G1", "pending", and nothing at all. The band 2 referral answer depends on WSBC-16 (STAFF_CONFIRM, blocked by Q-4) and is not marked.
Because build refusal is keyed to these tags, the inconsistency changes what passes publish mode.

**10. Severity: Major**
Affected scope: §2 rule 2 (L123) against §6.2 title (L202), and §6.1 title (L181).
Rule 2 requires each page's title to use its own area label and street. The §6.2 formula `WorkSafeBC Physio <Name> | ...` uses neither. For Central City, for example, the title says "Central City" while the area label is "Surrey City Centre".
- The pillar title as written is 68 characters, so it always fails its own 65-character check and the stated title never ships.
- The location formula drops "| WCB Physiotherapy" for 6 of 19 clinics, including pilot New Westminster (69 characters). The title pattern is therefore not uniform across the set.

**11. Severity: Major**
Affected scope: §6.2 band 1 (L208) against §10 (L256) and NFR Performance (L290).
"Hours today summary" needs runtime date logic. §10 forbids new JavaScript, and the pages are static fragments in an Elementor HTML widget.

**12. Severity: Major**
Affected scope: §3 table (L129-139) and gate G4 (L152).
The table omits URLs that research/09 §3.1 flags for a decision:
- `/richmond-physiotherapy-2/` (ranks #7 in pilot Richmond, which bears on G-2)
- `/physiotherapy-delta-chiropractor/` (Delta GBP landing page, organic #2)
- Newton's GBP target `/physiotherapy-amson-chiropractor/`
G4 ("§2 and §3 applied to the clinic") is already hard-coded true for all 19 clinics (build/merge_locations.py L93-94). The gate reads as passed while no clinic-specific decision exists.

**13. Severity: Major**
Affected scope: §6.2 band 7 (L214), §8 (L239), §7 (L227).
Band 7 and §8 draw "nearby" from the ICBC data. In data/worksafe-locations.json, 16 nearby entries across 15 of 19 clinics have `slug: null` and garbled names, for example "- 301 East Columbia Street, New Westminster ; 04 Delta". Pilots Richmond and Abbotsford are among them. §7 sets `hasMap` "where the GBP maps URL is KNOWN", but the data has no maps-URL field for any clinic. The spec gives no fallback for either.

**14. Severity: Major**
Affected scope: Additional Resources (L299) against §4, §6.1 band 10 (L196), §7 (L226-228), NFR (L290).
spec/modern-seo-cluster.md says every pillar and location page "must pass each row before publish". It appears only as a resource line: it is not a gate in §4 and not a QA step. The spec also conflicts with it in three places:
- FAQ answers are 40 to 80 words here; the checklist says 40 to 60.
- INP is "reported, not promised" here; the checklist sets INP < 200 ms.
- §7 has no `sameAs` to GBP; the checklist requires it.
None of these differences is acknowledged.

**15. Severity: Major**
Affected scope: NFR rollout and rollback (L292).
Rollback is defined only for location pages and the pillar. There is none for:
- the coverage-guide fact replacement
- the RTW article
- the §3 existing-URL edits: tag noindex, homepage module, blog correction, general clinic page sentences, `/icbc-claims/`
- the GTM triggers
- the CSS enqueue
- SEO-plugin title and meta, which a WordPress revision restore may not revert

**16. Severity: Major**
Affected scope: L17 against L59, L119, L123, L156-158, L270, L290. Overview L11.
L17 says "Every number below cites its file". These lines carry uncited figures: L59 (subscription end date), L119 (9 massage clinics), L123 (clinic distances), L156 (#3/#4, Maps average 3.36), L270 (9 in-links), L290 (about 8 KB). Overview L11 (8 of 78,145 impressions) is uncited too, though it sits above that line.
research/04 supplies the Wave 1 Maps data but is never cited. It also contradicts L158: "Abbotsford tracks no WorkSafe keyword" in Maps, so Abbotsford Maps effects cannot be measured as stated. research/09, the source of the gates and open questions, is also never cited in the body.

**17. Severity: Nit**
Affected scope: "Additional Resources" (L296) and "Future Improvements" (L302).
Both are H3 directly under the H2 "Non-Functional Requirements", so the outline files them as NFR subsections. They should be H2.

**18. Severity: Nit**
Affected scope: §4 waves (L155-161).
"**Wave 2:**" and "**Wave 3 ...**" sit on consecutive lines with no blank line, so they render as one run-on paragraph. Wave 1 is a bold lead with a bullet list, while Waves 2 and 3 are inline paragraphs, so the three waves are formatted differently.

**19. Severity: Nit**
Affected scope: L3-5, L67-69, L263-265, L31-36, L121-125.
The colon after bold labels is placed inconsistently:
- inside the bold: `**Author:**`, `**G-1 Visibility:**`
- outside the bold: `**Given**:`, `**Pros**:`
Ordered lists use `1. ` while bullets use `*   `. "Rules:" (L121) has no blank line before its list, unlike every other list.

**20. Severity: Nit**
Affected scope: L17, L177, L291, L298-300, L197.
- No citation is a link.
- Paths start from different roots: `worksafe-seo/research/01`, `research/07`, `spec/design-system.md`, `design-system §10`.
- "Google Search Central guidance on doorway pages and scaled content" has no URL.
- Band 11's "official WorkSafeBC links" are not listed.
- Bare "§n" references work only inside the numbered Technical Plan, since no other H2 is numbered.

**21. Severity: Nit**
Affected scope: L19, L27, L29/L38, L3-5.
- "The Problem" does not match the standard's "Problem Statement".
- The proposed solution (L27) sits inside the problem section instead of the Overview.
- The metadata has no human owner, reviewers or approvers, and no version history, although Status is "In Review".

**22. Severity: Nit**
Affected scope: Goals G-3 (L33).
G-3 is the only goal with no numeric target or deadline ("A target is set at day 30"), unlike G-1, G-2 and G-4 to G-6.

---

# egm-style

# Style Goldfish Review: spec/design_draft.md, lines 1-308

Mode: REVIEW. Standard applied: the copy rules in spec/design-system.md §13 and the acceptance rows in spec/modern-seo-cluster.md, both of which the draft cites. Every claim the draft uses as a rationale was checked against the research file it cites.

The main problems:
1. Several decision rationales and baselines misstate the evidence they cite (D1 local pack, the G-1 and G-6 baselines, Problem 1, Problem 4, Problem 5).
2. Confidence labels from the research (LIKELY, ASSUMPTION) are dropped, so inferences read as facts.
3. Key terms are overloaded: G-n vs Gn, "pending", "owner", "verified".
4. Several rules are not measurable or contradict other sections: §2 rule 1, the uniqueness test, "required slots", the timing of Wave 2.
5. The draft does not comply with the copy standard it cites.

---

## Blocker

**B1. D1 and Alternative B rest on a local-pack claim that the cited evidence does not support.**
- Affected scope: §1 D1 (line 102); Alternative B Cons (line 270).
- Style rationale:
  - The draft says: "`worksafebc physiotherapy` (140/mo) and `wcb physiotherapy` (210/mo) show a local pack (research/06)."
  - In the research/06 keyword table, `local_pack` appears only for `wcb physiotherapy`. The SERP features for `worksafebc physiotherapy` are "Not Available".
  - The research/08 live SERP for `worksafebc physiotherapy` (Vancouver location, task 264768352) shows "Local pack: none".
  - research/06 finding 3 also states that part of the 210/mo for "wcb" is out of province (Alberta and other provinces still use "WCB").
  - The main architecture decision and the rejection of Alternative B both depend on this sentence.

---

## Major

**M1. The draft understates current visibility, and some of its claims cannot be verified.**
- Affected scope: Overview (line 11), Problem 1 (line 21).
- Style rationale:
  - "Search visibility ... is close to zero" and "No WorkSafe page earns search traffic" are contradicted by research/08 bottom line 1:
    - Synergy is in the organic top 10 in 9 of 25 WorkSafe city SERPs.
    - It is in the local pack in 3.
    - It is an AI Overview source in 3.
  - The coverage guide ranks #4 in New West, #7 in Burnaby, #9 and #10 in Langley and #10 in Surrey. The draft itself says so at lines 104 and 133.
  - GSC returns no page URLs (research/07), so "earns no traffic" cannot be verified. The GSC data also records 1 WCB click.

**M2. "Every number below cites its file" is false.**
- Affected scope: line 17.
- Style rationale: Numbers without a citation appear at:
  - line 11: 8 of 78,145 impressions; treatment 442
  - line 59: 2026-11-06
  - line 119: 9 clinics
  - line 123: the distances
  - line 156: #3/#4 and 3.36
  - line 270: 9 in-links
  - line 290: 8 KB

  The 78,145 figure also needs a qualifier: it covers only the top 1,000 GSC rows, and the date range is unknown (research/07).

**M3. The G-1 and G-6 baselines are presented as measured. They are not, and G-6 contradicts the draft itself.**
- Affected scope: G-1 (line 31), G-6 (line 36).
- Style rationale:
  - research/07 states: "There is no rank-tracking baseline for WorkSafe today" and "there is no AI-visibility baseline for WorkSafe."
  - "0 of 9" is an inference from the keyword database plus one Vancouver SERP.
  - The G-6 baseline of 0 conflicts with research/08: Synergy is named in the Surrey and New West AI Overviews and cited as a source in 3 to 4 of them.
  - It also conflicts with the draft's own line 133, which says the page "is cited in 2 AI Overviews".
  - G-6 does not name the AI engine.

**M4. The goals are not stated precisely.**
- Affected scope: Goals (lines 31-36).
- Style rationale:
  - G-1 does not say whether both keywords must rank on an engine, or only one.
  - G-2 "within 60 days" has no start event.
  - G-3 "produce measurable booking intent" is phrasing with no target, and its target is deferred to day 30.
  - G-4 uses a double negative: "0 ... statements without a claim id whose ...".

**M5. Goal IDs and gate IDs collide.**
- Affected scope:
  - Goals: lines 31-36.
  - Gates: lines 52, 57-59 and 147-153.
  - Cross-references: lines 136, 157, 163, 172 and 217.
- Style rationale: G-1 to G-6 (goals) and G1 to G5 (publish gates) differ only by a hyphen. "G2" is the NAP gate; "G-2" is the Right-page goal. Readers and the build owner will confuse them.

**M6. Problem 4 overstates the competitor evidence.**
- Affected scope: line 24.
- Style rationale:
  - "Launch Rehab ... ranks #1 in New Westminster": research/08 shows that the #1 result is Launch's Coquitlam clinic page, not a per-clinic New Westminster page.
  - "Most competitors publish ... an incorrect 'referral after 60 days' rule": research/08 names two competitors (Reform and NewLeaf) plus the AI Overview. It labels "out-of-date" as LIKELY.
  - "Accurate, dated, sourced content is an open position" is labelled ASSUMPTION in research/08 but is stated as fact here.

**M7. Problem 5 makes a causal claim and uses the wrong unit.**
- Affected scope: line 25.
- Style rationale:
  - The draft says the 19 near-identical pages "cause Google to rotate about 5 Synergy URLs per query."
  - In research/07, 5.0 is the 31-day average of distinct URLs across 103 ICBC keyword-engine pairs. That is a count per pair, not per query.
  - The rotation spans two URL families: /icbc-treatments/ (36 of 93 ranking pairs) and the older /icbc-physiotherapy-in-{x}/ (27 of 93).
  - The data shows correlation. Causation is not shown.

**M8. Predictions are stated as facts.**
- Affected scope: D3 (line 104), §3 row `/icbc-treatments/*` (line 136), D6 (line 141).
- Style rationale:
  - "so it does not drop its current rankings" is a guarantee no one can make.
  - "New WorkSafe pages displace them ... by relevance" and "would pull generic 'physio near me' demand onto WorkSafe-only pages" are untested predictions.

**M9. Subjective words are used as decision rationale.**
- Affected scope: lines 156-157, plus lines 24, 25, 27 and 257.
- Style rationale:
  - "strongest existing WorkSafe signal" and "the SERPs are weak" justify the choice of pilot markets. research/08 labels "weak" as LIKELY.
  - Other subjective words: "win", "main risk", "genuinely distinct", "dead CrazyEgg/Contentsquare scripts". research/01 has the concrete fact for the last one: the CrazyEgg script returns 403 on 391 pages.

**M10. "Verified" overstates how the facts were checked, and other confidence labels are dropped.**
- Affected scope: line 170, line 21 and CUJ 1 (line 69).
- Style rationale:
  - "All register rows were verified from search snippets" contradicts the next sentence, which requires staff to open each URL. It also contradicts research/05 §0: the quotes come from snippets and the pages were not opened.
  - Line 21 "no in-body links" is labelled LIKELY in research/02.
  - CUJ 1 says the button "opens ... treatment 442" as fact. research/09 C-24 labels the deep link LIKELY and lists variant treatment ids at Richmond, Langley, South Surrey, New West and Newton.

**M11. "Pending" has two meanings.**
- Affected scope: CUJ 2, §5 (line 168), §6.1 bands 2-4 and 9 (lines 188-195).
- Style rationale:
  - "Pending" means a WorkSafeBC claim status: "pending claim" and "pending vs accepted claims".
  - It also means a sign-off status: "WSBC-49 pending", "WSBC-36 pending", "SYN-07, SYN-08 pending G1".
  - The band 4 cell uses both meanings.
  - SYN-07 is OK_TO_PUBLISH in the register, so "pending" is also wrong for it.

**M12. "Owner" has four meanings.**
- Affected scope: lines 15, 80, 102, 110-125, 137, the §4 table, 221.
- Style rationale: "Owner" refers to:
  - the business owner (scope rule, "Owner decision")
  - the target URL for a keyword cluster ("Owner URL", "designated owner of Surrey city queries")
  - the responsible team (gate table)
  - the content owner (line 221)

**M13. The claim-tagging rules for Synergy statements conflict.**
- Affected scope: §5 (line 172) vs §6.1 band 3 (line 189).
- Style rationale:
  - §5 says Synergy-specific statements carry `data-claim="SYN-01"`.
  - Band 3 tags the billing sentence with SYN-07 and SYN-08 instead. SYN-07 covers reporting and the claim number, not billing.
  - The build's refusal logic depends on these tags.

**M14. §2 rule 1 contradicts the titles specified elsewhere.**
- Affected scope: §2 rule 1 (line 122), D3 (line 104), §6.2 title (line 202).
- Style rationale:
  - Rule 1: "Title, H1 and first paragraph name only the owner cluster."
  - D3 keeps "WorkSafeBC physiotherapy", which is the pillar's cluster, in the coverage guide title.
  - The location title includes "WCB Physiotherapy", also the pillar's cluster.
  - As written, the rule cannot be applied.

**M15. The specified titles mostly will not ship.**
- Affected scope: lines 181 and 202.
- Style rationale:
  - The pillar title is 68 characters, over the 65 limit, so the fallback (55 characters) always applies.
  - The location title template gives 69 to 70 characters for New Westminster, Strawberry Hill, Sullivan Heights and Clayton Corners. Of the names tested, only Vancouver (63) fits.
  - The spec presents the exception as the primary title, and it does not say what happens if a title is still over 65 after shortening.

**M16. The draft does not follow the cited copy standard (design-system §13).**
- Affected scope: lines 181, 183, 187 and 69.
- Style rationale:
  - §13 says: use "19+ locations" exactly. The draft uses "19+ Clinics", "19+ Synergy Rehab clinics" and "19+ clinics", and line 11 says "19 clinics".
  - The CUJ 1 CTA "Book a WCB initial assessment" is 29 characters (limit 28). It also omits the clinic name, which is required on location pages.
  - The trust tile "evening and weekend hours" has no claim id. Clayton Corners has no Saturday or Sunday hours in worksafe-locations.json.

**M17. Numbers and rules conflict with the cited specs.**
- Affected scope: lines 196, 290, 141, 166-169.
- Style rationale:
  - FAQ answers: 40 to 80 words here, 40 to 60 in modern-seo-cluster.
  - Hero image: under 120 KB WebP here, 150 KB AVIF or WebP in design-system §11.
  - INP: "reported, not promised" here, under 200 ms in modern-seo-cluster.
  - GBP links: D6 keeps them on the general pages; modern-seo-cluster says GBP links point to the matching page.
  - Publish gate: §5 gates on publish_rule; design-system §13 requires a VERIFIED claim_id.
  - The draft does not say which document takes precedence.

**M18. "Required" clinic-fact slots are never defined.**
- Affected scope: CUJ 4 (line 87), G3 (line 151).
- Style rationale: CUJ 4 says "every required clinic-fact slot is filled", while G3 accepts "at least 4" of 7 facts. The draft never says which slots are required.

**M19. The uniqueness test cannot be measured and its logic is unclear.**
- Affected scope: line 217.
- Style rationale:
  - After removing bands 2, 4, 5 and 6, the hero still holds the clinic's name, street and phone. The phrase "could describe any other clinic" therefore never applies, or always applies, depending on how it is read.
  - The test has no numeric threshold.

**M20. The timing of Wave 2 is stated three ways.**
- Affected scope: lines 163, 251 and 283.
- Style rationale:
  - Line 163: Wave 2 starts after the day-30 review.
  - Line 251: the "Wave 2/3 decision" is at day 90.
  - Line 283: "30-day pilot review".

**M21. The Alternatives sections restate the chosen design instead of giving reasons.**
- Affected scope: Alternatives A-D (lines 261-283).
- Style rationale:
  - The "Reason for Rejection" in B, C and D describes the selected design, not why the alternative fails.
  - A says "The evidence favours", without naming the evidence.
  - The Pros "Mirrors some competitors" and "Fastest coverage" are vague.
  - "Doorway risk" is not defined.

---

## Nit

- **N1. Undefined terms** (lines 3, 57, 98, 106, 157, 227, 248, 290): NAP, GBP, SERP, GA4, GTM, PHN, BC PIPA, LCP/CLS/INP, Jane, the label "KNOWN", "P2" and "Elephant" are never defined. RTW is used at line 98 and defined only at line 105.
- **N2. Decision numbering skips D5** (D1-D4, then D6).
- **N3. Mixed shorthand for the program**: WorkSafe, Worksafe, WorkSafeBC, WCB and WSBC. Line 11 defines only WCB.
- **N4. Vague phrases:**
  - "search presence" (line 13)
  - "(via local relevance)" (line 113)
  - "the owner table above decides" (line 125)
  - "kept short" (line 206)
  - "within the first screen" and "within one scroll", with no viewport given (line 69)
  - "baseline before launch" (line 251): research/07 asks for at least 2 weeks.
- **N5. Noise or out-of-scope text:**
  - a `rel="noopener"` rule for a case marked "not used" (line 244)
  - "Separate recommendation outside this project" (line 141)
  - "must be fixed site-wide", with no owner (line 257)
  - the subscription end date with no consequence stated (line 59)
  - "Proposed solution in one line" for a multi-clause sentence (line 27)
- **N6. The New Westminster rankings appear in two forms**: "#3, #3, #6" (line 133) and "#3/#4" (line 156). The #4 belongs to the coverage guide.
- **N7. Unreferenced resources**: the Google Search Central guidance has no URL or date (line 300). "Existing availability widget" has no reference (line 305).


---

# goldfish-doorway

# Goldfish review: doorway pages, scaled content and misleading claims

**Document:** `/home/user/synergy-availability/worksafe-seo/spec/design_draft.md` (whole file)
**Lens:** Google spam policies (doorway pages, scaled content abuse). Also: anything that misleads users, especially about WorkSafeBC contract status.
**Verdict: Not ready.** The plan avoids city hubs and has a publish mode that blocks claims, which is the right shape. But the anti-doorway safeguard does not work as written. The uniqueness test in §6.2 is inverted. G3 counts fields instead of measuring distinctness. The build's similarity number hides near-duplication. Separately, several paths tell users that unverified clinics provide WorkSafeBC care, or send them to book there: the pillar title and finder, the nearby block and FAQ on Wave 1 pages, and the instruction to paste preview fragments into WordPress.

## How I checked

- I read every cited file that matters for this lens, plus the build sources the document describes (`pages/src/location.mjs`, `pages/src/pillar.mjs`, `build/build_pages.mjs`) and the current preview build in `pages/dist/`.
- I measured template similarity two ways:
  - **Raw (the build's metric):** 5-word-shingle Jaccard, as in `pages/dist/qa-report.json`. Result: 0.418 to 0.530.
  - **Normalised:** the same measure after replacing clinic name, area label, street, unit, postal code, phone, times and numbers with tokens, and removing the staff placeholder boxes. Script: `/tmp/claude-0/-home-user-synergy-availability/7fb27b37-db08-5b4c-bf1d-e36db1a2ed16/scratchpad/sim2.py`. Result: **0.81 to 1.00.** The median page shares **99%** of its normalised 5-grams with its closest sibling. Cedar Hills, Central City, Clayton Heights, Langley and Sullivan Heights are **identical (1.00)** to a sibling once names are swapped.
  - Today a page has 558 to 622 words with the placeholders stripped. If four staff facts of about 25 words each are added, roughly 100 clinic-only words result. That is about the same amount that varies between ICBC pages (about 150 words, research/02 line 162).
- The claim "treatment 442 at every clinic" holds. `git show origin/data:availability.json` shows `442 WCB Physio Initial Session` at all 19 Jane locations.

## What holds up

- No city hubs and no pages for neighbourhoods without a clinic (§Non-Goals, Alt C). This fits research/06 §7.1.
- In publish mode, the build refuses SYN-01 and SYN-08 on a location page when that clinic's G1 is false (`build_pages.mjs` claim()). It also blocks DO_NOT_PUBLISH claims, and it renders a page only when all of that clinic's gates are true.
- WSBC-26 (non-contracted clinics: the patient pays the gap) appears only as a warning about other clinics. No AggregateRating. `preview.html` carries `noindex`.
- The close-pair distances in §2 rule 2 match `data/worksafe-locations.json`.

## Blockers

1. **The pillar implies WorkSafeBC care at all 19 clinics and sends users to book at unverified ones (§6.1, §4).**
   - The title is "WorkSafeBC Physiotherapy at 19+ Clinics" and the meta description reads "Book a WCB physiotherapy assessment at one of 19+".
   - The lede, as built (`pillar.mjs:76`): "WorkSafeBC asks injured workers to see a contracted physiotherapist… Book a WCB physio assessment online at any of our 19+ locations". The finder heading is "WCB physiotherapy at 19+ locations".
   - Band 8 gives every unpublished clinic a "Book WCB assessment" Jane link.
   - The pillar has no contract gate at all. SYN-08 ("We bill WorkSafeBC", `pillar.mjs:121`) has no clinic attached, so one global sign-off unlocks it.
   - Contract status is UNVERIFIED for all 19 (SYN-01). Cedar Hills and Clayton Corners are on no cached WorkSafeBC physio list (research/05 §6). If either clinic is not contracted, a worker who books there pays and is reimbursed only at WorkSafeBC's rate (WSBC-26).
2. **Wave 1 location pages send WorkSafe patients to unverified clinics (§6.2 bands 6 and 7).**
   - Nearby cards link to the Jane WCB booking of any clinic that has no page (`location.mjs:66`).
   - The FAQ "Our nearest clinics also book WCB physio online…" is tagged SYN-JANE, which is OK_TO_PUBLISH, so it passes publish mode.
   - New Westminster's two nearest clinics are Cedar Hills (5.9 km, HIGH risk) and Central City.
3. **§Step 3.3 says to paste `pages/dist/<page>/fragment.html` into WordPress, but that folder holds the preview build.**
   - Publish mode writes to `pages/publish/` (`build_pages.mjs:18`).
   - All 19 dist fragments say "WorkSafeBC contracted" in the hero pill and "We bill WorkSafeBC directly", including Cedar Hills (`data-claim-status="pending"`, hidden from users).
   - The dashed pending styles exist only in the preview CSS. `worksafe.css` has none, so in WordPress nothing marks these as unverified.
4. **The §6.2 uniqueness test is inverted and has no threshold.**
   - "Remove bands 2, 4, 5 and 6. If what remains could describe any other clinic, the page fails." Those four bands are the only clinic-specific bands. What remains is NAP plus template, so by construction it always describes any other clinic. Either every page fails, or reviewers treat NAP as distinct and every page passes.
   - The only number available (Step 3.4 "unique-text ratio") is raw Jaccard. It reads 0.42 to 0.53 because the clinic name appears in nearly every sentence. Normalised, the pages are 0.81 to 1.00 similar, which is worse than the ICBC set's about 94% shared copy.
   - No owner, record or build check exists for the test.
5. **G3 counts fields; it does not test whether a page is distinct (§4).**
   - Pass condition: any 4 of 7 fields are non-empty (`build_pages.mjs:210-211`). There is no minimum length.
   - Two of the seven never render: `nearby_workplaces`, and `photo_with_consent` (photos come from `photos.json`, which has no consent field). `check_in` renders but is not counted.
   - Parking from Yelp is the same template value on all 19 rows (research/09 A-03).
   - The draft drops research/09 §2.2's requirement for a consented team and a consented photo.
   - Result: a page can pass G3 with about 4 short strings and stay a name-swapped template.
6. **The nearby-clinic data is corrupt for 15 of 19 clinics (Step 1 is marked "done"; §6.2 band 7; §2 rule 2).**
   - Cause: `merge_locations.py` `km_list` matches `0\d ` inside street numbers. For example, "204 Street" yields a "clinic" named "Street, Unit A130, Langley Twp ; 02 Clayton Heights".
   - Five pages render garbled FAQ text. One is Wave 1 Abbotsford. Newton's FAQ puts King George's address next to Sullivan Heights.
   - Unresolved entries silently drop cards, so real near neighbours disappear (Nordel loses Central City at 3.0 km).

## Majors

- **§6.2 "Unique data" overstates uniqueness.** The hours FAQ answer is the same sentence on 16 of 19 pages ("open 7 days… 8:30 PM"). Band 3 is one of three service combinations. Band 7 is navigation.
- **The close-clinic rules are not sound (§2 rule 2).**
  - They set labels only. Nothing decides whether both clinics in a close pair get pages (research/09 A-09, B-05).
  - "Clayton" is in both Clayton clinics' names, so the rule cannot be satisfied. ICBC already alternates the two Clayton pages (research/07 §2.4).
  - Rule 2 handles pairs, but the Surrey clinics form a cluster: Nordel, Cedar Hills, Central City, King George, Newton and Strawberry Hill are all within about 3.5 km of each other.
  - The distances' measurement method is UNKNOWN, and 16 clinics have no coordinates.
  - There are name collisions: WorkSafeBC lists Central City as "King George Hub", and Nordel is filed as "North Delta" in the site taxonomy.
  - Rule 2 requires the street in the title and H1, but the §6.2 formulas do not include it.
- **Surrey ownership contradicts the template.** The pillar owns Surrey queries but has no "Surrey" in its title or H1. All 12 Surrey pages carry ", Surrey" or "Surrey City Centre". This is the ICBC pattern, where "icbc physiotherapy surrey" saw 10 to 11 distinct URLs (research/07 §3.2).
- **The pilot cannot detect the main risk (§4).**
  - Wave 1 is three isolated single-clinic cities.
  - Wave 2 then publishes 14 pages at once, 10 of them in the Surrey cluster.
  - The scale rule checks only rank guardrails. It does not check duplicate canonicals or normalised similarity.
  - Its cannibalisation alarm depends on SE Ranking, whose Data API subscription ends 2026-11-06 (doc Q-8).
- **G1 and SYN-01 do not hold per-clinic evidence.**
  - SYN-01 is one row: "All Synergy Rehab clinics are…". Sign-off is per claim, not per clinic.
  - G1 is a boolean that Marketing flips (CUJ 4) with no vendor number recorded.
- **WCB massage and acupuncture are offered per clinic based only on Jane bookability.** The RMT and acupuncturist WorkSafeBC status is UNKNOWN (WSBC-35 and WSBC-36 notes). SYN-JANE itself says "Bookability is not proof of a WorkSafeBC contract".
- **The justification for the pages is gone (D6, §7, §3).**
  - Research/06 §7.2 justified a page per clinic because each would be a GBP landing page. D6 keeps the GBP links on the general clinic pages, which also contradicts `modern-seo-cluster.md`.
  - All 114 geo terms show no measured volume, so each page must earn its place on content alone.
  - The 5 "More About Worksafe" clinic pages and `/physiotherapy-in-new-west/` stay up, so a second WorkSafe location family remains (research/07 §3.2 warned against this).
  - The schema creates a new clinic `@id` on each WorkSafe URL.
- **The meta-description hours summary misleads for irregular schedules.** Clayton Corners: "Open Mon to Tue 12 PM to 8 PM". Vancouver: "Open Mon 8 AM to 8 PM" (`location.mjs:11,17`).
- **The gates ignore mismatches on WorkSafeBC's own list.** That list ranks #1 for `wcb physio surrey/abbotsford/new westminster`, and it shows New Westminster at unit 202 (the clinic is at #405), Central City as "King George Hub" with another phone, and a different Vancouver phone (SYN-18).
- **"Nearby workplaces served" invites employer-name stuffing and implied employer or EAPP relationships.** WSBC-41 is STAFF_CONFIRM, and Synergy's EAPP listing is only LIKELY.

## Nits

- §6.2 title formula does not match the build ("WCB & WorkSafeBC Physio in <place>"). The fallback drops "Surrey" for Central City and both Clayton clinics, against rule 3.
- "19+" is used where there are exactly 19 clinics. That is fine as brand copy but not as a WorkSafeBC claim (it is not in the register; research/09 P-07).
- No capacity check. Vancouver, Burnaby and Clayton Corners each show 2 WCB physios with openings (research/09 A-08).
- The owner table targets "wcb approved physiotherapy", but there is no rule banning "approved" or "authorized" wording (research/09 C-17).
- Problem 5 states that duplication "causes" the rotation, which research/07 labels a LIKELY interpretation. It also says "rank the wrong clinic's page" where the source says "usually".
- Nordel's phone is the corporate main line, the same number as the pillar's call button.


---

# goldfish-worksafebc-facts

# Goldfish review: WorkSafeBC facts and claims risk
Document: `worksafe-seo/spec/design_draft.md` (whole file). Checked against `data/claims-register.csv` (70 rows), `research/05-worksafebc-policy.md`, research/02, 04, 06, 08 and 09, `data/worksafe-locations.json`, `data/claims-signoff.json`, `spec/design-system.md`, and, as supporting evidence only, `build/build_pages.mjs` and `pages/src/*.mjs`.

## Verdict
**Not ready to build or publish.** I found 2 Blockers, 14 Majors and 5 Nits.

Most claim ids the spec cites are correct:
- WSBC-10, 11, 12, 14, 17, 21, 23, 26, 29, 35, 42 to 46, SYN-07 and SYN-JANE match their register rows.
- The Teleclaim number 1.888.967.5377 is right.

The risk is in what is *not* gated:
- The pillar sells WCB assessments at all 19 clinics. Its only contract check is G1, which applies to location pages.
- The fee and billing statements carry the wrong claim id.
- Several planned sections (RTW, the have-ready checklist, massage and acupuncture, the coverage guide) have no allowed claim row, or use one that does not support them.

## CUJ 2 check (against WSBC-12 and WSBC-29)
- **The wording matches.** "A contracted physiotherapist can do the initial assessment within 60 days of the injury on a pending claim without prior approval" matches WSBC-12 (register line 13, manual quote). "WorkSafeBC pays for that assessment even if the claim is later denied" matches WSBC-29 (line 30, "paid even if the claim is subsequently disallowed"). Both rows are VERIFIED and OK_TO_PUBLISH, and both ids are correct.
- **The answer is incomplete, which makes it misleading.** The question is "can I start now?", but the CUJ answer covers only the first assessment. It leaves out:
  - WSBC-17: WorkSafeBC-funded treatment starts only on acceptance.
  - WSBC-28: the worker may be asked to pay. The register says Synergy's pending-claim policy "must be stated next to this".
  - WSBC-30 (STAFF_CONFIRM): if the claim is denied, treatment given while it was pending is not paid.
  - SYN-PEND (Q-5): Synergy's own policy.
  - WSBC-14: after 60 days, approval comes first; the worker is not refused. Without this, the copy invites the SYN-04 misreading.
- **Other gaps:**
  - WSBC-29's note makes payment depend on Synergy filing the 83D555 initial report within 7 days.
  - Both quotes come from the provider-facing reference manual and were seen only as search snippets.
  - The "official source link" is not specified.
  - §2 gives "pending claim" questions to the coverage guide, but CUJ 2 lands on the pillar.

## Blockers
1. **The pillar has no contract gate** (§6.1 title, meta, bands 1, 3 and 8; Q-1). Every clinic gets a "Book WCB assessment" card, under copy that reads "19+ clinics" and "we handle WorkSafeBC billing".
   - SYN-01 is UNVERIFIED for all 19 clinics.
   - Cedar Hills and Clayton Corners are on no cached WorkSafeBC MSK list.
   - At a non-contracted clinic the worker pays and is reimbursed only $95 (WSBC-26).
   - Q-1 says it "blocks publishing any page", which contradicts launching the pillar with Wave 1.
2. **The fee and billing statements are tagged SYN-01** (§5). Direct billing has its own row, SYN-08, and fees have SYN-09, which requires the "on an accepted claim" qualifier. An unqualified "no fees at this clinic" conflicts with WSBC-28, WSBC-30 and WSBC-25.

## Majors (summary)
- CUJ 2 is incomplete (above).
- CUJ 1 says "bring your claim number", but WSBC-46 says the number comes by mail. It also omits the Lower Mainland Teleclaim number and hours, and the WSBC-43 advice to report online.
- Q-4 lets a staff sign-off stand in for an official source for "no referral" (WSBC-16).
- WSBC-49 (what to have ready when reporting to WorkSafeBC) is misused as a clinic-visit checklist.
- RTW: WSBC-21 is misused for "reports to WorkSafeBC", and the register has no rows for RTW rules.
- Massage and acupuncture: no service-level contract gate, no first-visit booking path, and no concurrent-care row.
- Claims-policy enforcement: OK rows are not URL-checked, conditions in register notes are not enforced, CONFLICT and UNVERIFIED STAFF_CONFIRM rows can be signed, and the title, meta and schema are not covered.
- SYN-01 is one global row but is used as a per-clinic gate.
- Preview `fragment.html` files contain unsigned claims and are labelled "paste into WordPress".
- The coverage guide sits outside the build gate even though it owns the riskiest topics.
- Known-wrong live copy stays up: SYN-04, the 15/6 copy until Wave 2, and `/physiotherapy-in-new-west/`, which was never audited.
- The provider-list link is unverified, and the cached lists show SYN-18 NAP mismatches for the Wave 1 New Westminster clinic.
- design-system.md still gates on status VERIFIED and specifies an undefined VERIFIED pill.
- There is no re-check cadence or expiry for dated facts (the $95 rate; the fee schedule runs only to 2027-03-31).

## Nits
- The visit-count rule's scope versus WSBC-35 and WSBC-36, and a meta description that promises visit and cost answers the page cannot give.
- GEN-01 was added by the spec author from a source nobody opened; the register count has drifted (67 to 70).
- Problem 4 overstates "referral after 60 days" as "incorrect".
- Several AEO FAQ questions have no register row (claim duration, Form 6A).
- No rule against implying WorkSafeBC endorsement.

## What checks out
- §5 keeps visit counts off the pages until WSBC-18 is signed off, and falls back to WSBC-21. This matches research/05 §4.
- The §3 fix for SYN-11 (reframe the "gap" line as a non-contracted-clinic rule, WSBC-26) matches the register.
- The WSBC-35 massage referral rule is correctly attached to the location pages.
- The publish gate is keyed on publish_rule rather than status, as research/09 C-25 recommended.
- The event privacy rule (no claim number or PHN) is correct.

---

# goldfish-technical-seo

# Goldfish review: technical SEO and structured data
Document: `worksafe-seo/spec/design_draft.md` (whole file). Lens: URL design, canonical and indexing, breadcrumbs, internal linking, cannibalization (§2), existing-URL decisions (§3), JSON-LD (§7), title and meta formulas, sitemap, inherited theme defects, and whether G-1 to G-6 can be measured with the tools listed in research/07.

## Verdict
**Not ready to approve.** The architecture is sound: the pillar stays at its existing URL, location pages sit at child URLs, there are no city hubs, and pages are released in gated waves. The problems are in the details:
- **1 Blocker:** the pillar's title, meta description and JSON-LD say "19+ clinics". That is an unverified provider claim, and it skips the claims gate.
- **The design contradicts its own research on cannibalization**, for both the coverage guide and Surrey.
- **The schema plan was written without auditing the schema the site already outputs**, which research/01 required.
- **Several formulas in the doc no longer match what the build produces.**
- **G-1, G-2, G-3, G-5 and G-6 cannot be measured as written** with the tools that exist today.

## What I checked and found correct
- **`@type: ["MedicalClinic","Physiotherapy"]` is valid schema.org.** Both types descend from LocalBusiness > MedicalBusiness, and MedicalClinic is also a MedicalOrganization. `Physiotherapy` is also a member of the MedicalSpecialty enumeration.
- **The properties named in §7 are valid on this type:** `medicalSpecialty`, `availableService` (MedicalClinic domain, MedicalTherapy range), `parentOrganization`, `geo`, `hasMap` and `openingHoursSpecification`.
- **Leaving out AggregateRating and Review is correct.** On a business's own site they count as self-serving reviews.
- **The URL pattern is sound.** `/worksafe-physiotherapy/<slug>/` slugs match the ICBC set and the `dist/` folders. The canonical in `meta.json` is the page's own URL.
- **Preview files cannot be indexed.** `preview.html` carries `noindex` (build_pages.mjs line 164).
- **The close-clinic distances in §2 rule 2 match** the `nearby` data: 1.5, 1.7, 1.8 and 2.4 km.
- **The numbers in the Problem section match research/07 and research/08:** 8 of 78,145 impressions; tag archive #7; ICBC Richmond page #6 and #10; Abbotsford #11; 94% shared text; about 5.0 URLs per query.
- **Every Jane slug in the built fragments exists** in `worksafe-locations.json`.

## Findings, most severe first

### BLOCKER
**B1. The pillar title, meta description and JSON-LD assert WorkSafeBC provider status for "19+ clinics" without passing the claims gate. (§6.1 lines 181–183, G-4 line 34)**
- **What the pillar says:**
  - Title: "WorkSafeBC Physiotherapy (WCB) at 19+ Clinics" (`pages/src/pillar.mjs` line 7).
  - Meta description: "Book a WCB physiotherapy assessment at one of 19+ Synergy Rehab clinics" (line 8).
  - The same strings are copied into the MedicalWebPage `name` and `description`.
- **Why that is unverified:**
  - The underlying fact is SYN-01, which is UNVERIFIED for all 19 clinics (`claims-register.csv`).
  - Cedar Hills and Clayton Corners are HIGH eligibility risk (`worksafe-locations.json`): neither appears on any cached WorkSafeBC list, and Clayton Corners' Jane page shows "No Direct Billing Physiotherapy".
  - SYN-JANE itself says "Bookability is not proof of a WorkSafeBC contract".
- **Why the gate misses it:** the build checks only body HTML through `ctx.claim()`. `write()` (build_pages.mjs lines 179–190) checks title and meta for length and dashes only.
- **Rules it breaks:** G-4 ("0 published WorkSafeBC statements without a claim id") and the research/06 §4.1 compliance flag.
- **Fix:**
  - Compute the number from clinics where G1 is true, or use a title with no count until Q-1 is answered.
  - Add a `claims` array to `meta.json`. Make publish mode run the title, meta description and every JSON-LD string through the same gate.

### MAJOR
**M1. The coverage guide's title keeps the head term. This contradicts §2 rule 1, research/06 §7.2 and research/01 §5.2. (D3 line 104, §2 line 110, Alternative B lines 267–271)**
- **What the design says:** the guide "keeps the phrase WorkSafeBC physiotherapy… so it does not drop its current rankings".
- **What the research says:**
  - research/06 §7.2 says explicitly to "Change its title/H1 away from the head term".
  - research/01 §5.2 rates the guide High risk for `worksafebc physiotherapy`.
- **Why it matters:** the rankings the design wants to keep are for the very queries it assigns elsewhere. Per research/08 F7 and Appendix A:
  - `worksafebc physiotherapy surrey` #10. §2 gives this query to the pillar.
  - `worksafebc physiotherapy new westminster` #4. §2 gives this to the New Westminster page.
  - Burnaby #7, and Langley #9 and #10.
- **The premise of D1 and Alternative B is partly wrong:**
  - The live `worksafebc physiotherapy` SERP (task 264768352) had no local pack. worksafebc.com held 5 of the top 10 positions, plus an AI Overview.
  - research/06 §4.1 says only the "wcb" and "approved" variants show a pack. The "worksafebc" spellings lean informational.
- **Fix:**
  - Record an explicit owner decision (research/09 C-18).
  - If the guide stays separate, give it a title that leads with the coverage questions, and add it to the §2 table as a monitored competitor for head terms and city terms.
  - Include it in rule 4 alternation monitoring. Decide whether G-1 credits it.

**M2. The JSON-LD plan ignores whatever schema the site already outputs and relies on cross-page @id references. (§7 lines 226–229, §10 line 257)**
- **research/01 §0 required an audit first.** It says schema is Not Available for every URL and "needs a structured-data crawl… before any schema decisions are made". The design skips this.
- **Duplicate entities are likely:**
  - The duplicate canonical on 388 pages suggests two SEO emitters, each of which likely outputs its own graph.
  - The build hard-codes `/#organization` and `/#website` (build_pages.mjs lines 108 and 117) and `{url}#webpage`. These are the default IDs of the common WordPress SEO plugins.
  - The likely result is merged or conflicting nodes (MedicalOrganization "Synergy Rehabilitation" against a plugin Organization) and two BreadcrumbList blocks.
- **Cross-page references:**
  - Location pages reference `#organization` and `#website`, which are declared only on the pillar.
  - Google reads each page's markup on its own, so cross-page references are not guaranteed to resolve.
- **The design and the build disagree:**
  - The design specifies Organization with logo and telephone, and WebPage with `dateModified`.
  - The build emits MedicalOrganization without logo or telephone, MedicalWebPage without `dateModified`, and an always-on FAQPage.
- **Fix:**
  - Before launch, view the source of a drafted page and list every `ld+json` block.
  - Then either extend the plugin's graph using its own @ids, or turn the plugin's schema off on WorkSafe URLs.
  - Put a minimal Organization node (name, url, logo, sameAs) on every page, or reuse the plugin's node.
  - Validate the fully rendered page source in Rich Results Test code mode. Draft pages cannot be fetched by the tester.
  - Bring §7 in line with the build.

**M3. Clinic entity IDs are tied to WorkSafe-only URLs, and there is no link to the GBP. (§7 line 227, D6 line 141)**
- **The problem:**
  - The clinic node's `@id` and `url` are the WorkSafe page (build_pages.mjs line 126).
  - D6 keeps each GBP's website link on the general clinic page, or on the homepage for New Westminster.
  - Any future LocalBusiness markup on the general pages would create a second entity for the same physical clinic.
- **What is missing:**
  - There is no `sameAs` to the GBP, although `spec/modern-seo-cluster.md` (Entity signals row) and research/09 B-13 require it.
  - `hasMap` can never be emitted, because `worksafe-locations.json` has no Maps URL or CID field. research/04 says CIDs are known for 3 clinics.
- **Fix:**
  - Use stable site-level IDs such as `https://synergyrehabilitation.ca/#clinic-<slug>`, with `url` set to the GBP website target.
  - Have the WorkSafe page point to that node with `about`.
  - Add `gbp.maps_url` and `gbp.cid` to the data and emit `hasMap` and `sameAs`.
  - Reuse the same IDs in the pillar finder (an ItemList) and later on the general pages.

**M4. Inherited theme defects are noted but not gated. (§10 line 257, Step 5 line 337)**
- **What the design says:** the duplicate canonical (388 pages) and duplicate meta description (82 pages) "must be fixed site-wide". No owner, date or gate is set.
- **Why it matters:**
  - Every new page will inherit both defects.
  - The auto-generated second description takes the first body text. On these fragments that is the breadcrumb, e.g. "Home WorkSafeBC physiotherapy New Westminster…".
  - `h1_multiple` affects 106 pages, and the build counts H1s only inside the fragment.
- **The runbook check is too weak:** it looks for "canonical" but not for exactly one.
- **Fix:**
  - Find the two emitters and turn one off before the pillar launches. Make that a G4 sub-check.
  - After publishing, assert on the rendered HTML: exactly 1 `rel=canonical` (self), 1 meta description, 1 H1, 1 BreadcrumbList, and robots set to index.

**M5. The title and meta formulas in the doc are wrong, out of sync with the build, and produce misleading snippets. (§6.1 line 181, §6.2 lines 202–204)**
- **Pillar title:**
  - The doc's title is 68 characters, so the fallback always fires. The fallback, "WorkSafeBC Physiotherapy at 19+ Clinics | Synergy Rehab", drops "WCB" entirely.
  - `wcb physiotherapy` (210 a month) is the largest term, and research/06 §7.5 says to use both names.
- **Location meta description:** the doc's formula gives 156 to 177 characters. 16 of 19 clinics exceed the build's own 165 limit, and the doc gives no shortening rule.
- **The build ships different formulas.** Titles are "WCB & WorkSafeBC Physio in X" (`location.mjs` lines 7–21).
- **The built hours summary uses only the first group of days:**
  - Vancouver: "Open Mon 8 AM to 8 PM".
  - Clayton Corners: "Open Mon to Tue 12 PM to 8 PM".
  - Cloverdale: "Open Mon to Wed…".
- **Titles do not follow the place-naming rules:**
  - The fallback above 62 characters drops "Surrey" for 5 Surrey clinics.
  - Titles use the display name, not `area_label`: "Central City" against the H1 "Surrey City Centre", "Clayton Corners" against "East Clayton", "Delta" against "North Delta". This breaks §2 rules 2 and 3.
- **Fix:**
  - Replace §6.1 and §6.2 with the formulas the build actually uses, with limits in characters and pixels.
  - Build the hours phrase from all 7 days ("Open 7 days, evenings to 8:30 PM") or leave it out.
  - Use `area_label` the same way in title, H1 and meta. Add QA checks for these.

**M6. The Surrey rules set the 12 Surrey location pages against the pillar. (§2 line 115, rule 3 line 124)**
- **The conflict:**
  - The pillar owns `worksafebc/wcb physio surrey`, yet rule 3 puts "Surrey" in every Surrey page's title, H1 and meta. 7 of the built titles end in ", Surrey".
  - The pillar's own title does not contain "Surrey".
- **The ICBC precedent shows what happens next** (research/07 §3.2): "icbc physiotherapy surrey" used 10 to 11 different Synergy URLs in 31 days, and "icbc massage therapy surrey" rotated through 5 location pages.
- **Fix:**
  - Keep "Surrey" in the H1, address and breadcrumb, but take it out of Surrey location-page titles. Give the pillar a Surrey H2 and an anchor to the Surrey finder group.
  - Track `wcb physio surrey` and `worksafebc physiotherapy surrey` with the pillar as target URL, under the rule 4 alarm.

**M7. §3 leaves URLs that compete in the pilot markets undecided. (lines 129–141)**
- **`/physiotherapy-in-new-west/`:**
  - The row says "Keep unchanged" and also "add one in-body link", which contradict each other.
  - The decision rule has no branch for the old page continuing to outrank the new one. In that case G-2 fails in New Westminster and there is no fix.
  - The claim that it is "cited in 2 AI Overviews" rests on domain-level citations only (research/08 lines 1132 and 1153).
- **`/physiotherapy-abbotsford-chiropractor/`:** this is the Abbotsford GBP landing page, with 38 in-links and "More About Worksafe" and "Worksafe Injury Physiotherapy" sections (research/01 §1.2 and §5.2; research/07 rates it medium risk). It is covered only by the visit-count sentence rule.
- **`/richmond-physiotherapy-2/`:** it ranks #7 for `wcb physio richmond` and duplicates `/richmond-physiotherapy/`, but it is not listed at all.
- **`/icbc-physiotherapy-abbotsford/`:** it ranks #11 for `wcb physio abbotsford` ("25 Visits"). It is frozen by scope and gets no cross-link.
- **The research warned against this:** research/07 §3.2 says not to leave "a second indexable WorkSafe location family".
- **Fix:**
  - Add rows for each of these URLs.
  - Cut the WorkSafe sections on the 5 newer clinic pages to one sentence plus a link.
  - Decide the `-2` duplicate: canonical to the main page, or noindex.
  - Add a G-2 failure branch for day 60.
  - Ask the owner whether a one-line "Injured at work?" pointer is allowed on the ICBC Richmond and Abbotsford pages.

**M8. The nearby-clinic link data is broken for 15 of 19 clinics. (§8 line 239, §6.2 band 7, Step 1 line 313 marked "done")**
- **The bug:** the regex in `build/merge_locations.py` line 54 (`0\d (.+?) About ([\d.]+) km`) swallows address text. That leaves 16 `nearby` entries with `slug: null`.
- **Examples:**
  - Nordel loses Central City (3.0 km).
  - Vancouver and Burnaby lose Delta.
  - Newton loses Sullivan Heights and Strawberry Hill.
- **The effect:** `location.mjs` line 65 drops these entries silently, so most nearby blocks render 2 or 3 cards instead of 4.
- **Fix:**
  - Fix the parser (match against the known clinic names) or compute distances from coordinates.
  - Make the QA report fail on any null slug or on fewer than 4 nearby links.

**M9. The uniqueness gate is subjective while the measured duplication is already high. (§6.2 line 217, Step 3.4)**
- `qa-report.json` shows a maximum 5-word-shingle Jaccard similarity of 0.42 to 0.53 between location pages.
- The design's main stated risk (Problem 5) is near-duplicate templates, yet no threshold blocks publishing.
- **Fix:** set a numeric publish blocker, for example max Jaccard ≤ 0.30 against any sibling once staff facts are filled, alongside the manual band-removal test.

**M10. G-3 cannot be measured. GA4, GTM and GSC access are not among the open questions. (G-3 line 33, §9 lines 248–249, Step 5)**
- research/07 §5 and headline finding 7: GA4 is Not Available. No connector exists, Supermetrics has no license, and it is UNKNOWN whether GA4 is even configured.
- Bookings happen on Jane, a separate domain.
- "Organic sessions" by landing page cannot be obtained.
- The runbook's "GA4 DebugView" and "GSC URL Inspection" checks need access that research/07 §4.5 and research/09 say does not exist.
- **Fix:** add a Q-11 for GA4, GTM and GSC access, with an owner. Make it a launch prerequisite for G-3 and for the day-7 and day-30 indexing checks.

**M11. The G-5 guardrail will fail from normal ranking noise, and most of its baseline does not exist. (G-5 line 35, scale rule line 163)**
- **The band is too tight for this data.** A ±3 position band around one day's baseline sits against these 30-day ranges in `rank-baseline.csv`:
  - `icbc physiotherapy`, Delta: best 1, worst 80.
  - `icbc physio`, New Westminster: best 2, worst 72.
  - `car accident physiotherapy`, Langley: best 3, worst 75.
- **Most of the generic baseline is missing.** Generic `physiotherapy <city>` terms are mostly untracked on the 9 engines. The rows that exist are GSC averages with no engine, or come from the path-scoped project 12940679.
- **The consequence:** Wave 2 is gated on "no G-5 regressions", so it would stall.
- **Fix:** use the 14-day median before launch against the 14-day median after. Count a regression only when the ranking URL changes to a WorkSafe page (research/07 §7E alert rule). Add the 9 generic pairs at least 2 weeks before launch.

**M12. G-1, G-2 and G-6 have baselines that were never measured or keyword sets that do not match. (lines 31, 32, 36, 250)**
- **G-1:**
  - The baseline "0 of 9 (research/07)" was never measured. research/07 says "There is no rank-tracking baseline for WorkSafe today".
  - The 12903890 engines are "map merged", so their "top 10" is not an organic top 10.
  - It is unclear whether one keyword or both must rank on an engine.
- **G-2:** it uses `wcb physio <city>`, but the research/07 §7C set adopted in §9 has `wcb physiotherapy <city>` and `worksafe physio <city>` instead.
- **G-6:**
  - Per-prompt AI tracker results came back null (research/07 §6).
  - The ChatGPT engine exists only in 12903890, and the AI Overview engine only in the path-scoped project.
  - The design names no engine, and `data/ai-visibility-log.csv` (named in `modern-seo-cluster.md`) does not exist.
- **Fix:**
  - Set the baseline from 14 days of tracking before launch.
  - Define positions as organic, with the pack excluded.
  - Add `wcb physio <city>` to the tracking set.
  - Name the engine and the metric for G-6, with a manual monthly log.

**M13. Every rank-based goal and gate G5 depend on an SE Ranking subscription that ends 2026-11-06. (Q-8 line 59, §4 G5, §9)**
- research/07 recommends adding the keywords at least 2 weeks before launch. Whether rank tracking stops when the Data API expires is UNKNOWN.
- If tracking lapses, G-1, G-2, G-5, G-6, rule 4 and publish gate G5 all fail.
- **Fix:** make renewal (or a named replacement tool) an explicit prerequisite. Add the keyword set now so the 14-day baseline exists before launch.

**M14. The acceptance checklist cannot be passed as written. (NFR line 290; `spec/modern-seo-cluster.md`)**
- **The checklist demands three things the design and data cannot yet deliver.** It says every page must pass, before publishing:
  - INP < 200 ms. The design says INP is "reported, not promised", and the origin INP fails, with about 19 to 20% of interactions poor (research/01 §3 row 20).
  - "One primary keyword per URL from keyword-master.csv". All 508 rows have `URL Target = Not Available`.
  - sameAs to the GBP.
- **Fix:** amend the checklist rows, or the design. Write the §2 owner map into the `URL Target` column of `keyword-master.csv`.

### NIT
- **N1. Organization details (§7).** The design's Organization telephone would be the "main line", which matches Nordel's clinic phone (`nap_conflicts`). The name "Synergy Rehabilitation" differs from the GBP brand "Synergy Rehab". Google expects Organization markup on the homepage, not on a service pillar.
- **N2. Schema precision (§7).** Type `availableService` as `PhysicalTherapy` named "Physiotherapy". WorkSafeBC is a payer, not a therapy. Add `lastReviewed` and `reviewedBy` to MedicalWebPage to match the reviewer line, and restore `dateModified`.
- **N3. Pillar FAQPage (§7).** The design calls it optional, but the build always emits it. Decide one way. The JSON-LD text bypasses the visible `data-claim` markers, so the gate must cover it.
- **N4. Sitemap.** The design has no sitemap requirements. Specify that the pillar and published children appear with `lastmod`, that gated drafts stay out, and that `/tag/worksafebc/` drops out once noindexed. GSC sitemap submission needs GSC access.
- **N5. `/tag/worksafebc/` (§3).** It is missing from `site-urls.csv`, so its status and canonical are unknown (research/09 B-09). Use the per-term noindex, not the global tag setting.
- **N6. Rollback (NFR).** "No redirects" turns an indexed location page that is rolled back into a 404. Allow a 301 to the pillar finder.
- **N7. Anchors and sibling mentions (§8, rule 2).** The finder and nearby anchors in the build ("Synergy Rehab <Name>") differ from §8. Sibling names also appear outside the nearby block (the Newton page names King George 4 times), against rule 2.
- **N8. Missing internal links (§8).** `/locations/` (363 in-links) and `/booking-page/` (748) are not in the linking plan. research/01 §5.3 point 2 recommends them.
- **N9. RTW article link.** The pillar links twice to `/return-to-work-after-a-workplace-injury/`, which is not built and needs clinical sign-off. That is a broken link if it launches first. The build should only emit internal links to live URLs.
- **N10. Maps measurement claim (§4).** "Abbotsford… Maps effects can be measured" overstates it. Abbotsford's Local grid has no WorkSafe keyword (`gbp-maps-keyword-positions.csv`), so one must be added.
- **N11. Schema NAP and hours.** These come from the Yelp sheet and conflict with GBP and site values (research/09 C-04 and C-07). G2 sign-off should be against the GBP, and the schema should be rebuilt after sign-off.


---

# goldfish-cro-ux-brand

# Goldfish review: design_draft.md through the conversion, UX, accessibility and brand lens

Reviewer: independent, no prior context, read-only. Lens: conversion, UX, accessibility and brand. I checked the claims in sections 6.1 and 6.2 and the CUJs against the files they cite, the built previews in `pages/dist/` and the Jane data branch (`git show origin/data:availability.json`). I also measured the built previews at 390 x 664 px, which is roughly the visible area of iPhone Safari, using the Playwright copy already in the repo. I changed no files.

## Verdict

**Not ready to approve.** There are 2 Blockers, 9 Majors and 9 Nits.

The location-page booking path is short: one tap from the hero to Jane. The design system itself is strong: colour contrast, 48 px targets, zero JavaScript and token hygiene all hold up.

The problems are in four places:
- **Contract gate.** The G1 contract gate protects location pages only. The pillar and the nearby blocks still offer WCB booking at all 19 clinics, including the two HIGH-risk ones.
- **Nearby-clinic data.** The data behind the nearby blocks is corrupted and already prints garbled text on a Wave 1 page.
- **Phone layout.** The phone layout does not deliver CUJ 1 as written.
- **Third-party overlays.** Things the theme adds on top of the pages are not addressed at all: the global BOOK NOW button, the chat bubble and the GTranslate switcher.

## Answers to the five questions asked

1. **Is the booking path short on a phone?**
   - **Location pages: mostly yes.** Hero, then Book, then Jane, is one tap. Two caveats from the built New Westminster preview:
     - The phone (Call) button sits at or below the fold.
     - The 3-step path starts 3,468 px down the page, not "within one scroll".
   - **Pillar: no.**
     - The finder starts 8,258 px down a 16,086 px page and is 4,219 px tall.
     - Pilot clinics get a longer path (pillar, then location page, then Jane) than unpublished clinics (pillar, then Jane).
     - Phone numbers in finder cards are not tappable as phone links. A stretched-link overlay covers them, so a tap opens Jane instead.
2. **Is "Find your clinic" the right primary CTA on the pillar?** Yes. The pillar has no single booking target, and the Jane root page would expose non-WCB and "No Direct Billing" types. What needs fixing is what sits behind the button (finder position, card design, gating), not the button itself.
3. **Are the Jane deep links correct?**
   - **Pattern and IDs:** correct. Treatment 442 under discipline 3 exists at all 19 clinics, verified in the data branch.
   - **Not proven:** that the link opens the WCB type directly is only LIKELY (research/04 line 200; research/09 C-24).
   - **Variant IDs hide availability:** duplicate "WCB Physio Initial Session" IDs mean the 442 link misses:
     - 29% of WCB initial slots at New Westminster (pilot, CUJ 1)
     - 35% at Newton
     - Richmond's 40-minute variant
   - **Missing open question:** research/09 asked which initial type each clinic's CTA should open. That question was dropped from the Open Questions list.
4. **Is the sticky bar safe?** Not yet.
   - The CSS itself is sound: hidden over the hero in Chrome, safe-area padding, `scroll-padding-bottom`.
   - The doc ignores the chat bubble and GTranslate collision.
   - It ignores that `position: fixed` breaks under a transformed ancestor.
   - It ignores the fallback where the bar is always visible, the pillar bar staying on screen inside the finder, and the footer overlap.
   - There is no launch check for any of these.
5. **Are the trust signals honest?** Not on the pillar.
   - The title "at 19+ Clinics", the "at any of our 19+ locations" lede next to WSBC-10 ("see a contracted physiotherapist"), and the 19 finder booking links all imply a WorkSafeBC contract that SYN-01 leaves UNVERIFIED for every clinic.
   - The location-page "WorkSafeBC contracted" badge is properly gated.
   - WCB massage is presented as bookable, although only a "Subsequent" type exists and RMT contract status is UNKNOWN.

## Findings

### Blockers

**B1. The G1 contract gate does not cover the pillar, the nearby blocks or the local FAQ (sections 6.1 bands 1 and 8, 6.2 bands 6 and 7, Q-1).**
- `data/worksafe-locations.json` sets `contract_2026: "UNVERIFIED"` for all 19 clinics.
- `eligibility_risk` is HIGH for Cedar Hills (line 781; Medimap lists it as private pay only, SYN-16) and for Clayton Corners (line 1906; not on any cached WorkSafeBC list).
- SYN-JANE states that "bookability is not proof of a WorkSafeBC contract".

The doc still ships several statements and links that imply a contract at every clinic:
- the title "WorkSafeBC Physiotherapy at 19+ Clinics" (line 181)
- the meta description "at one of 19+ Synergy Rehab clinics" (line 183)
- a "Book WCB assessment" Jane link on every unpublished finder card (line 194)
- nearby clinics plus a "nearest clinic if this one is full" FAQ answer on every location page (lines 213 to 214)

The build matches the doc:
- `pages/src/pillar.mjs` `finder()` (lines 40 to 53) never checks gates.
- The built New Westminster page sends overflow to Cedar Hills' WCB booking link.
- The built Abbotsford page sends it to Clayton Corners.

**The harm:** WorkSafeBC pays non-contracted clinics nothing directly. The worker pays and is reimbursed at $95, and the difference is theirs (WSBC-26). The pending-claim assessment guarantee (WSBC-29) applies only at contracted clinics.

**Fix:** apply G1 per clinic everywhere a clinic is offered for WCB booking:
- Clinics with G1 false get no Jane WCB link. Either leave them out, or show a card that says "Call to confirm WorkSafeBC billing".
- Derive any WCB-availability count from G1-true clinics.
- Do not publish the pillar until Q-1 is answered for every clinic it lists.
- Make publish mode fail when an ungated clinic gets a 442 link.

**B2. The nearby-clinic data is corrupted and prints garbled copy on a Wave 1 page (Step 1 "done", 6.2 bands 6 and 7).**
- There are 16 corrupted `nearby` entries across 15 of the 19 clinics. They have `slug: null` and names such as `"Street, Unit A130, Langley Twp ; 02 Clayton Heights"` (`worksafe-locations.json` line 2104).
- The cause is the regex `0\d (.+?) About` in `merge_locations.py` `km_list` (lines 52 to 56). It matches digit pairs inside street numbers.
- The built Abbotsford local FAQ (`pages/dist/abbotsford/fragment.html` line 98) reads: "Langley (about 24 km) and Street, Unit A130, Langley Twp ; 02 Clayton Heights (about 25 km)". Newton has the same defect.
- The nearby cards drop the bad entry without warning, so Abbotsford's cards skip Clayton Heights.
- Publish mode checks none of this.

**Fix:**
- Rewrite the parser.
- Fail the build if any nearby slug is null or unknown.
- Add this to the Step 4 QA checks.
- Re-run the merge.

### Majors

**M1. The Jane deep-link caveats are not handled (lines 11, 69, 244 and 333).**
- 442 is present at all 19 clinics.
- That the link opens the WCB type directly is only LIKELY, yet CUJ 1 states it as fact.

Duplicate "WCB Physio Initial Session" IDs hide availability from the 442 link (data branch, slots 2026-11-02 to 11-08):

| Clinic | Variant IDs | What the 442 link misses |
|---|---|---|
| New Westminster (pilot) | 1013 | 1 of 4 WCB physiotherapists; 20 of 70 initial slots |
| Newton | 1019, 1099, 1111 | 3 physiotherapists; 66 of 187 slots |
| Richmond (pilot) | 1081 (40 mins) | 6 slots |
| Langley | 948 | 3 slots |
| South Surrey | 968 | 7 slots |

If the hash route fails, Vancouver, Burnaby, New Westminster and Clayton Corners also offer a "No Direct Billing Physiotherapy" discipline on the same booking page. Step 4 QA checks only the slug.

**Fix:**
- Add Q-11: ops either merges the WCB initial types into one ID per clinic, or names the ID each clinic should use.
- The build reads the current IDs and openings from the data branch, and fails if 442 is missing or has no openings.
- Before launch, test each Wave 1 link by hand: iOS Safari, Android Chrome, and the Instagram and Facebook in-app browsers, logged out.
- Add a microcopy line under the CTA: "Opens Jane. Choose WCB Physio Initial Session."

**M2. CUJ 1 is not met by the 6.2 hero and band order.**
- Built New Westminster page at 390 px: the hero is 1,348 px tall. Book sits at 661 to 729 px and Call (the phone) at 741 to 793 px, measured under a 151 px mock header. With a real header, the phone lands at or below a 664 px fold.
- The 3-step path is inside band 4 and starts 3,468 px down. CUJ 1 says "within one scroll".
- CUJ 1's worker "has not called WorkSafeBC yet", but no report step appears near the CTA. WSBC-13 says a claim must exist.
- There is no requirement for what must appear above the fold.

**Fix:**
- Set a fold budget: at 390 x 664 with the real header, the H1, a lede of 20 words or fewer, Book and Call must all be fully visible. Add this check to `screenshot.mjs`.
- Move the compact steps to band 2, as design-system section 8.3 already does.
- Add one line under the CTAs: "Not reported yet? Report online or call Teleclaim 1.888.967.5377. You can still book now." Make the number a `tel:` link.
- Drop the eyebrow that repeats the clinic name, and use a shorter hero photo crop on phones.

**M3. The pillar finder makes the path long and hides the phone.**
- "Find your clinic" is the right label, but the finder (band 8) starts 8,258 px down and is 4,219 px tall at 390 px. Surrey's 12 cards take about 2,600 px.
- Pilot clinics route through their location page first. That is an extra page on a site loading about 3.8 MB of JavaScript, with 19% of mobile interactions rated poor (INP, research/01 line 258).
- The cards use a stretched link (`.sr-ws-card__link::after`, `worksafe.css` line 324). The phone is printed as plain text under it (`pillar.mjs` line 50), so tapping the number opens Jane instead of the dialer.

**Fix:**
- Move the finder to band 2 or 3, or add five area chips under the hero CTA that jump to each group.
- On phones, use compact rows: name, neighbourhood and street, plus two explicit actions. One is "Book WCB physio" (Jane, G1-true clinics only); the other is a `tel:` link.
- When a WorkSafe page exists, link the clinic name to it. That keeps the section 8 internal link without adding a step before booking.
- Drop the stretched-link pattern on finder cards.

**M4. The pillar's "call button to the main line" is undefined (lines 187 and 198).**
- The only corporate number in the data, (604) 503-1688, is Nordel's clinic phone (research/04 lines 56 and 212; the WorkSafeBC list row in research/05 line 117).
- Phone is the dominant contact path: Newton's GBP gets 645 to 758 calls a month against 14 to 357 website clicks.
- The build dropped the button, so doc and build disagree.

**Fix:** add an open question: does a central line book WCB at any clinic?
- **If yes:** use it, with the `aria-label` "Call Synergy Rehab bookings".
- **If no:** remove the pillar-level call button and give each finder row its own `tel:` link.

**M5. Sticky-bar safety is not specified (6.1 band 12, section 10, Step 5).** The doc never addresses these points:
- **Floating widgets.** The LeadConnector chat bubble and the GTranslate floating switcher load on the site (research/02 lines 220 and 223). Design-system section 9.11 rates the collision LIKELY and says their selectors are UNKNOWN. The bar's call icon sits bottom right, where a chat bubble usually sits.
- **Transformed ancestors.** `position: fixed` fails under any Elementor or ElementsKit ancestor with a transform, filter or will-change (motion effects, off-canvas menu). The site also runs GSAP and Lenis.
- **Hide-over-hero fallback.** Hiding the bar over the hero needs `animation-timeline` and `timeline-scope` (`worksafe.css` line 621). Browsers without them, and users with reduced motion, see the bar over the hero, which puts two primary CTAs in view.
- **Pillar bar inside the finder.** The pillar bar keeps saying "Find your clinic" while the user is inside the finder.
- **Footer overlap.** At page end the bar covers about 72 px of the theme footer. The spacer protects only WorkSafe content.
- **Label.** The location-page label "Book online" names neither WCB nor the clinic.
- **Runbook.** Step 5 has no sticky-bar check.

**Fix:**
- Make the sticky bar a launch gate: test on real iOS and Android devices in the live theme.
- Hide or move the chat bubble and GTranslate switcher on WorkSafe URLs.
- Add view timelines that hide the bar over `#clinics` and the final CTA band.
- Change the label to "Book WCB visit", with the clinic name in a screen-reader-only span.

**M6. The global header "BOOK NOW" competes with the page CTAs.**
- Every WorkSafe page inherits the header BOOK NOW, which links to `/booking-page/` (research/02 lines 97 and 143).
- It is a second primary CTA in the first view.
- It sends workers into the generic booking flow, which offers non-WCB and "No Direct Billing" types.
- The doc does not mention it.

**Fix:**
- On `/worksafe-physiotherapy/*`, use an Elementor display condition to point the header CTA at `#clinics` (pillar) or at the clinic's 442 link (location pages), with a WCB label. Restyling it as a secondary button also works.
- Track its clicks with `placement=header`.

**M7. WCB massage is presented as bookable without a gate (lines 195, 210 and 213).**
- Jane offers only "WCB Massage Subsequent Session" (ID 21). There is no initial type (research/09 C-16).
- WSBC-35 requires a doctor's referral and an accepted claim.
- RMT WorkSafeBC status per clinic is UNKNOWN (research/09 P-05).
- The built FAQ says "WCB massage follow-up visits are bookable online at New Westminster".
- SYN-01 covers the physiotherapy agreement only, so nothing gates this statement.

**Fix:**
- Add a per-clinic RMT claim (STAFF_CONFIRM) and an open question on how a worker books a first WCB massage visit.
- Leave massage out of location pages until that is confirmed.
- Once confirmed, the CTA is "Call to book your first WCB massage visit", never a Jane link to the Subsequent type.

**M8. "19+ clinics" breaks the brand rule (lines 181, 183 and 187).**
- The brand rule is to say "19+ locations" exactly (design-system E1 and section 13). The doc's own QA check (line 333) would flag its title, meta and trust tile.
- "At any of our 19+ locations" reads as WCB booking at more than 19 places. Jane has exactly 19 WCB locations.
- "19+" is not in the claims register (research/09 P-07).

**Fix:**
- Use "19+ locations" as the brand descriptor.
- State WCB availability with the gated count instead.
- Register the "19+" claim.

**M9. The coverage guide has no conversion spec (6.3 line 221, section 2 line 117, CUJ 2).**
- The guide is the WorkSafe page that already ranks in 4 cities and is cited in AI Overviews (D3), so it will carry most WorkSafe traffic at launch.
- Section 6.3 gives it only "link to pillar and finder".
- Section 2 assigns pending-claim queries to the guide, yet CUJ 2 lands that same query on the pillar.

**Fix:**
- Give the guide and the RTW article the sticky "Find your clinic" bar, area chips after the pending-claim answer, the final CTA band, and `page_type=guide` (or `article`) events.
- Reconcile CUJ 2 with the ownership table.

### Nits

- **N1. "Hours today" (line 208) is impossible in a static fragment with no JavaScript.**
  - Baking hours into the meta description (line 204) freezes them in search snippets.
  - Newton's hours conflict between sources: the Yelp sheet says Sat 8AM to 7PM and Sun 8AM to 4PM; GBP says Sat 08:00 to 16:00 and Sun 09:00 to 16:00.
  - Fix: use a static weekly summary, and require G2 sign-off on hours.
- **N2. CTA labels drift.** The same action is labelled:
  - "Book a WCB initial assessment" (29 characters, over the 28-character rule)
  - "Book WCB assessment"
  - "Book WCB physio at Sullivan Heights" (35 characters)
  - "Book online"
  - "WorkSafe page" (vague)

  Fix: pick one family of labels, 28 characters or fewer, and use `<Name> clinic` anchors as section 8 specifies.
- **N3. Measurement gaps.**
  - The hero's in-page "Find your clinic" anchor fires `worksafe_location_select` with `clinic=all`, which inflates that event.
  - Finder clicks on pilot clinics count as `location_select`, not `book_click`, so pilot clinics look worse.
  - GA4 cross-domain linking to janeapp.com is never specified. Bookings cannot be attributed without it, although hard-coding `_gl` remains correct to forbid.
  - The site loads gtag three times (research/02 line 225).
- **N4. Fonts.** Inter is LIKELY not loaded on the live site. The doc's performance budget and section 10 never decide between self-hosting it and Google Fonts. Without it, body text falls back to the system font and breaks the brand rule.
- **N5. Web address.** The doc has no rule to show the address as synergyrehab.ca. Whether that domain redirects cleanly is UNKNOWN; check it before printing it.
- **N6. Text size and tap targets.**
  - Finder addresses and phones, hours and the proof line use 15 px (`--sr-ws-fs-small`). That is below 16 px for content the user needs to act on.
  - Breadcrumb tap targets are 29 px, while the NFR claims 48 px.
- **N7. Anchor offsets.** No `scroll-margin-top` is set on `#clinics`, `#steps` or `#faq`. A sticky theme header could cover the heading after a jump (WCAG 2.4.11).
- **N8. Two honesty gaps in quick answers and tiles.**
  - The pillar quick answer "will I pay anything" must cover pending claims (WSBC-28, SYN-PEND) or wait for Q-5.
  - The "evening and weekend hours" tile needs "at most locations": Clayton Corners is closed on weekends and Vancouver has no Saturday hours.
- **N9. The spec has drifted from the design system and the build:**
  - band order
  - a location-page sticky bar missing from 6.2
  - the pillar's secondary CTA
  - the location hero's "WorkSafeBC contracted" badge (gated by SYN-01) missing from 6.2
  - CUJ 3 promising WorkSafe pages for Surrey clinics in Wave 1
  - awkward H1s such as "WorkSafeBC physiotherapy in King George Blvd, Surrey"

## Checked and found correct

- **Jane URL pattern:** discipline 3 and treatment 442 exist at all 19 Jane slugs. No `_gl` strings, no `nofollow`, same-tab links.
- **No em or en dashes** in the doc or in any built fragment or meta file.
- **Contrast:** the CTA is navy on #1eb831 (5.93:1). Green-500 is never used as small text. Hover goes green. CTAs are uppercase 600. Targets are 48 to 52 px.
- **Location pages** have one primary CTA per band. The hero Call button is an outline (secondary).
- **No ratings or review markup**, so no self-serving AggregateRating.
- **Sticky bar in Chrome:** hidden over the hero (`visibility: hidden`, offset 80 px at scroll 0), with safe-area padding and `scroll-padding-bottom` in place.
- **Location-page "WorkSafeBC contracted" badge and "We bill WorkSafeBC directly" sentence** are gated by SYN-01 and G1 in publish mode.

## Method

I read the design doc in full. I read the relevant parts of design-system.md, `worksafe.css`, `worksafe-locations.json`, `locations-master.csv`, the claims register, research/02, 04, 05, 08 and 09, `merge_locations.py`, and the build sources and outputs. I computed per-ID WCB initial slots from the data branch. I measured band offsets in the built previews with headless Chromium at 390 x 664.


---

# goldfish-privacy-compliance

# Goldfish review: design_draft.md, lens = BC PIPA / health privacy and marketing ethics

Reviewer: independent, read-only, no prior context. All evidence is from local files. Nothing was fetched from the live site.

## Verdict

**Not ready to launch under this lens.** The page-level gating is careful: per-claim tags, a DO_NOT_PUBLISH block, the SYN-01 badge gated by G1, no AggregateRating, and clean Jane links. But it only covers location pages and the new event attributes. Three problems would cause harm on day one:

1. **The pillar sends workers to clinics that may not be contracted.** It is outside the gates. It says, and links, "WCB physio at 19+ clinics" for all 19, including the two HIGH-risk clinics. Wave 1 location pages do the same through their nearby-clinic cards.
2. **Existing trackers will see every WorkSafe visit.** The pages inherit two Meta pixels, three GA4 tags, CallTrackingMetrics, a GoHighLevel chat widget and session-replay tags. The design's PIPA statement covers only the new event attributes.
3. **Known-wrong coverage copy stays live.** The design leaves pages it calls out of scope ("No change" or "Owner decision") or defers to Wave 2. That copy includes 15 sessions / 6 weeks and the 60-day "eligibility" cut-off.

## Blockers

**B1. The pillar and nearby blocks advertise WCB booking at every clinic before any contract is confirmed (§6.1, §4, §6.2 band 7)**
- **Gates apply only to location pages.** The §4 gates (lines 145-153) cover location pages only. The pillar title (line 182) and meta description (line 183) still say "WorkSafeBC Physiotherapy at 19+ Clinics" and "Book a WCB physiotherapy assessment at one of 19+ Synergy Rehab clinics".
- **The finder links straight to Jane.** Band 8 (line 194) links each card to the Jane WCB Initial session when the clinic has no page.
- **The billing promise is ungated.** Band 3 promises "we handle WorkSafeBC billing".
- **No clinic is confirmed.** `data/worksafe-locations.json` sets `contract_2026: UNVERIFIED` for all 19. Cedar Hills and Clayton Corners are `HIGH: not found on cached WorkSafeBC list` (merge_locations.py lines 24-25). §4 line 161 says those two publish "only after Q-1 is answered yes".
- **The build shows the gap.** `pages/dist/pillar/fragment.html` already links `janeapp.com/locations/cedar-hills/...treatment/442` and `clayton-corners-188-st/...442`.
  - In `build_pages.mjs`, line 60 gates SYN-01 and SYN-08 only when a clinic object is passed. The pillar passes none, so SYN-08 on the pillar unblocks as soon as anyone signs it for any clinic.
  - Wave 1 pages carry the same risk: New Westminster's nearest card is Cedar Hills ("Book WCB physio at Cedar Hills") and Abbotsford's includes Clayton Corners (location.mjs lines 63-71).
- **Why it matters:** at a non-contracted clinic the worker pays and is reimbursed only $95, paying any difference (WSBC-26). Copy saying WCB physio is offered at all 19+ would mislead.
- **Fix:**
  - Gate the pillar too. A clinic can appear as a WorkSafe booking option, in the finder or in any nearby block, only if its G1 is true.
  - Other clinics show name, address and phone only (no WCB booking link), or are left out.
  - The build computes N (the number of G1-true clinics) for the title, meta, H1 support text and "WCB physiotherapy at N locations".
  - SYN-08 on the pillar requires G1 for every clinic the page links.

**B2. Sitewide trackers see every WorkSafe page; the PIPA claim in §9 is incomplete (§9 line 248, §10 line 257, NFR line 289)**
- **What loads today:** research/02 lines 223-225 list:
  - GA4 gtag x3
  - Meta pixel x2 (1146132405487862, 993382379926498)
  - CallTrackingMetrics
  - LeadConnector (GoHighLevel) chat
  - CrazyEgg and Contentsquare
  - research/01 line 254 also confirms the Facebook pixel `<img>`.
- **What §9 covers:** it promises no diagnosis, claim number, PHN or free text in events. But the page URL (`/worksafe-physiotherapy/<clinic>/`) and the event names (`worksafe_book_click`) are themselves health and claim-status signals. They go to Meta and Google with identifiers attached.
- **Other channels:**
  - CTM ties a caller's phone number to the pages they browsed, and may record calls.
  - The chat widget invites typed injury details.
  - §10 says only that the pages "must not add to" theme defects.
- **The repo's own rule is broader.** spec/modern-seo-cluster.md line 34 extends the rule to "ad tools". The design drops that.
- **Fix:** add a G6 Privacy gate.
  - GTM blocking triggers stop Meta pixels, ad or remarketing tags, session replay and the chat widget on all WorkSafe URLs (pillar, location pages, guide, RTW article).
  - GA4: Google signals and ad personalization off for these pages; no audiences or Ads/Meta conversion imports from `worksafe_*` events.
  - CTM: no recording or transcription on these numbers, or a spoken notice.
  - Identify who owns the 3 GA4 properties.
  - Update the privacy policy.
  - The privacy officer signs off before Wave 1.

**B3. Known-wrong WorkSafeBC coverage copy stays live (§3 lines 127-141, G-4 line 34)**
- **What the design leaves untouched:**
  - **`/icbc-claims/`:** SYN-03 (15/6) is only "Recommend ... Owner decision". This page has 343 footer in-links.
  - **King George and Delta clinic pages:** the "up to 15" copy is fixed only "when each clinic page launches", which is Wave 2, at least 30 days out (line 163).
  - **SYN-04:** "Approved claims are eligible for treatment within 60 days" is on `/icbc-claims/` (KNOWN) and the homepage (research/02 line 77; research/05 line 176). §3 never mentions it. The register calls it misleading (line 54): it implies no coverage after 60 days.
  - **Homepage "No referral needed" anchor:** rests on SYN-06 and WSBC-16 (unconfirmed).
  - **SYN-14:** the mileage claim (blog, unverified).
  - **The 2023 social graphic** with 15/6.
- **The gap in the goal:** G-4 measures only new pages. The new pillar sends WorkSafe traffic into a site that contradicts it.
- **Fix:**
  - Fix every CONFLICT and DO_NOT_PUBLISH Synergy statement (SYN-02/03/04/06/11/14) in week 1, whatever the wave.
  - Make an explicit exception to the "no change to ICBC pages" non-goal for WorkSafe sentences on mixed pages.
  - Extend G-4 to cover all site URLs.

## Majors

**M1. Cost and pending-claim answers are one-sided (CUJ 2 lines 71-75, §6.1 band 2, Q-5)**
- **CUJ 2:** promises "WorkSafeBC pays for that assessment even if the claim is later denied". It leaves out three things:
  - that is conditional on the clinic filing the initial report within 7 days (WSBC-29 notes);
  - follow-up visits while the claim is pending can be charged (WSBC-28, WSBC-30);
  - Synergy's own policy is unknown (Q-5, SYN-PEND placeholder).
- **Quick answers card:** the "Will I pay anything?" answer (pillar.mjs line 101) is WSBC-23 alone, with no pending caveat.
- **Fix:**
  - Every cost answer carries the accepted / pending / non-claim-area (WSBC-25) conditions in the same block.
  - Make Q-5 a pillar launch blocker.
  - Confirm that no cancellation or no-show fees apply to WCB patients (WSBC-24) before saying "no fees".

**M2. Tag-only enforcement cannot meet G-4 (§5, Step 3)**
- **Untagged Synergy claims:**
  - pillar.mjs line 76: "Book a WCB physio assessment online at any of our 19+ locations"
  - line 206: "Every clinic below books WCB physio assessments online"
  - line 144: "Choose WCB Physio Initial Session so your first visit is set up as a WorkSafeBC claim". This is false: booking does not create a claim.
- **Mis-tagging:** line 28 tags "We explain what is approved..." as SYN-05. That register row (line 55) is about extension requests.
- **Build limits:** `claim()` checks only the id's status, never the sentence. SYN-09 is not in the G1 check (line 60).
- **Fix:**
  - Store approved wording per claim and have the build compare it.
  - Lint for untagged coverage words (WorkSafeBC/WCB with pay, fee, bill, claim, visit, referral, approved).
  - G1-gate every SYN-* claim.
  - Delete the "set up as a claim" tip.

**M3. Massage and acupuncture are promoted with no contract gate (§6.1 band 9, §6.2 band 3, §2)**
- G1 covers the physio agreement only.
- The register says bookability is not proof of a contract (SYN-JANE). Per-clinic RMT contract status is UNKNOWN (WSBC-35), and acupuncturists' status must be confirmed (WSBC-36).
- Jane lists only "WCB Massage Subsequent", which still needs a referral and an accepted claim.
- **Fix:** add per-clinic massage and acupuncture gates. Show those services only where confirmed.

**M4. Jane analytics and cross-domain linking are unguarded (§9 line 249, §8 line 244)**
- §9 suggests switching on Jane's analytics integration, with no limits.
- research/01 line 189 shows footer Jane links carrying `_gl`/`_ga`, so cross-domain linking is likely configured. gtag then decorates clean hrefs at click time, so "no `_gl` strings" in the HTML is not enough.
- **Fix:** no Meta or ad pixels in Jane. If GA4 runs in Jane, send only a generic booking event, with no treatment or practitioner names. Review cross-domain settings. Privacy sign-off required.

**M5. Collector data in a public repo (Step 1 line 313)**
- README line 8 tells you to make the repo public.
- `origin/data:availability.json` holds 14,831 rows of practitioners' full names with their open times, refreshed every 2 minutes.
- `worksafe-seo/` is pushed to the same repo: internal eligibility-risk notes, GBP metrics, and the marketing email repeated hundreds of times.
- No patient fields were found.
- `merge_locations.py` uses the names only to count them.
- **Fix:** make the repo private, or drop or hash practitioner names before publishing the data branch. Move the research to a private location. Confirm with Jane that automated collection is allowed.

**M6. Gaps in consent for people shown on pages (§6.2 band 5, Q-7, Q-9, NFR)**
- **Practitioner cards:**
  - There is no process to withdraw consent or remove cards for departed staff.
  - Registration checks against the College of Health and Care Professionals of BC appear only as an ASSUMPTION in design-system line 539.
  - The "focus" field can read as a claimed specialty.
  - The heading "WCB physiotherapists" suggests a WorkSafeBC credential, but WorkSafeBC contracts clinics, not individual physios.
- **Photos:**
  - The pillar hero alt text is "physiotherapist assessing a patient's shoulder". A recognisable person on a WorkSafe page is implied to be an injured worker.
  - The Drive images were never opened, and some folders share stock images (design-system line 751).
- **Reviewer line:** it also needs the named PT's consent.
- **Fix:**
  - A written consent form that names WorkSafe-page use and gives a way to withdraw.
  - A quarterly roster check against Jane.
  - Staff or consenting models only, never actual patients.
  - Label the band "Physiotherapists who treat WorkSafeBC claims".

**M7. "WCB approved" wording (§2 line 112)**
- The pillar owns "wcb approved physiotherapy". keyword-master rows 8, 10 and 50-53 add more "approved" variants.
- WorkSafeBC contracts providers; it does not approve or endorse them.
- Synergy's Yelp listing already says "WCB and WorkSafeBC Approved" (research/08 lines 411, 592), and Medimap omits WCB (SYN-16). §3 lists neither.
- **Fix:** never use "approved" or "endorsed", and never the WorkSafeBC logo. Say "WorkSafeBC-contracted", and only after G1. Add the third-party listing corrections to §3.

**M8. The "as of" line can overstate verification (§5 lines 170, 173)**
- The build requires only `checked_as_of` and `reviewer` (line 99), plus sign-off on STAFF_CONFIRM rows.
- OK_TO_PUBLISH rows were verified from search snippets, and nothing requires anyone to open them.
- `SOURCES.providers` (shared.mjs line 14) is the URL WSBC-33 says never surfaced.
- **Fix:** record a per-claim `opened_on` date for every claim used, and refuse to publish without one. Replace the providers URL.

**M9. The CUJ 1 booking path comes before reporting (CUJ 1, §6.2 band 1)**
- The hero CTA sits above the report step.
- The location hero lede never says "report first".
- WSBC-13 notes that no source says whether a clinic may assess a worker who has not reported.
- **Fix:** put reporting microcopy (online or 1.888.967.5377; the claim can be pending) beside the CTA. Get an ops answer on what happens when a worker books with no claim.

**M10. RTW content may imply WorkSafeBC programs (§2 line 118, §6.3 line 222)**
- The "return to work program" keyword is assigned to the RTW article.
- WSBC-40 says do not imply Synergy runs the Customized Recovery and RTW Program; Synergy is not on the RTWSS provider list.
- WSBC-39 says there is no stand-alone WorkSafeBC kinesiology benefit.
- design-system line 345 has a location band "Return-to-work services here", and it conflicts with both.
- **Fix:** an explicit content rule stating what Synergy is and is not.

## Nits
- **Q-4 asks staff to "confirm" WSBC-16, which no official source supports.** The register recommends WSBC-10 wording instead. The quick answer still says "Not for physiotherapy."
- **Jane data can go stale.** There is no maximum age on `wcb_data_checked_at`. Massage and acupuncture "bookable" is inferred from 7-day open slots, not from Jane's treatment catalogue.
- **There is no rule for reviews.** The stack has Google review widgets and sliders (research/02 line 224), which copy testimonials onto pages. There is no rule keeping them off WorkSafe templates, and no reply rule (never confirm a reviewer is a patient or has a claim).
- **Committed previews show "WorkSafeBC contracted" for all 19.** That includes Cedar Hills, where only a dashed outline marks it as unconfirmed. Use neutral preview text.

## Checked and OK
- The `ev()` attributes carry only clinic, placement and page_type.
- Jane hrefs carry no parameters.
- JSON-LD has no AggregateRating or Review.
- `availability.json` has no patient fields.
- The Teleclaim numbers match WSBC-44.
- The 60-day rule in CUJ 2 matches WSBC-12.
- The location badge "WorkSafeBC contracted" is correctly G1-gated.

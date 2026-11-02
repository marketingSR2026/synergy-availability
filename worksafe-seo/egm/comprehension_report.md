**What this proposes**

The plan is a WorkSafeBC-only organic search presence for Synergy's 19 clinics. The existing `/worksafe-physiotherapy/` URL is rebuilt in place as a pillar page with a clinic finder. A child page `/worksafe-physiotherapy/<clinic-slug>/` is added for each clinic, but only once that clinic passes five per-clinic gates (G1 contract, G2 NAP sign-off, G3 distinct facts, G4 URL plan, G5 tracking), and the rollout runs in three waves: New Westminster, Richmond and Abbotsford go first. The existing coverage guide keeps its URL and owns claim and coverage questions, and a new return-to-work article is added. Every WorkSafeBC fact on a page carries a claim id from `claims-register.csv`, and it can only go live if its publish rule allows it or staff have signed it off. A Node script builds the pages as static HTML fragments plus JSON-LD from `worksafe-locations.json`, and someone pastes them into Elementor by hand. Success is measured with SE Ranking rank and AI-prompt tracking and with GA4 click events, and ICBC rankings serve as guardrails.

**How the existing system works, per this document**

The site runs WordPress/Elementor. A sitewide "Worksafe" menu links to `/worksafe-physiotherapy/`, which ranks for almost nothing. When WorkSafe searches find Synergy at all, they land on the wrong page (a tag archive, ICBC pages) or on a separate New Westminster landing page. Synergy's pages also give conflicting visit counts. Bookings happen in Jane, an external booking system, and every clinic offers a "WCB Physio Initial Session" there (treatment 442). The ICBC location pages were built from one template and share about 94% of their text, so Google rotates which URL it ranks; that is the precedent to avoid. Per the document, only Step 1.1 is done: `merge_locations.py` has written `worksafe-locations.json` with every gate false except G4. Everything else (sign-off file, source templates, build script, QA, runbook) is written as future work. Rank tracking runs in SE Ranking project 12903890 on 9 regional engines but tracks no WorkSafe keywords, and there is no GA4 access yet. (Per the repo, this description of the current state is wrong; see finding 8.)

---

### 1. Blocker. G3 "Distinct facts" has three conflicting definitions, and the review test as written fails every page
**Scope:** §4 gate table line 151; §6.2 uniqueness test line 217; Step 3.4 line 328; Step 4.2 line 333; spec/design-system.md §8.3 (which §6 line 177 names as the authority for band rhythm)

- **Gate table definition:** G3 passes when at least 4 of 7 clinic facts are filled. That can be checked mechanically.
- **Uniqueness test (line 217):** "remove bands 2, 4, 5 and 6. If what remains could describe any other clinic, the page fails G3." What remains is bands 1, 3, 7 and 8: the hero, the Jane services list, nearby clinics, and sources/CTA. All four are filled from structured fields by the same template, so by construction they could describe any other clinic with the name swapped. Read literally, every page fails. I cannot paraphrase what this test is meant to check.
- **design-system.md §8.3:** it gives a third rule ("if a clinic cannot fill bands 2, 4 and 5 with real facts"). Its band numbering also differs: there, band 4 is the practitioner module and band 5 is first visit.
- **Unique-text ratio:** Steps 3.4 and 4.2 report it, but no formula or pass threshold is given.

A reader cannot tell whether a clinic with 4 filled facts but generic wording passes. G3 is the document's only defence against the doorway-page risk that Problem 5 says is the main danger.

### 2. Major. The pillar has no publish rule, and "pending G1" on the pillar has nothing to refer to
**Scope:** Q-1 line 52; §4 line 145; §5 line 172; §6.1 lines 181-189 (title, meta description, band 1 trust tiles, band 3)

- The gates are defined only for clinic pages ("A clinic page is published only when…"). Yet Q-1 "blocks publishing any page".
- The pillar's title, meta description and "19+ clinics" trust tile all say that 19+ clinics provide WorkSafeBC physiotherapy. That is SYN-01, which is UNVERIFIED and has to be confirmed clinic by clinic.
- Band 3 tags direct billing as "SYN-07, SYN-08 pending G1", while §5 says Synergy-specific statements carry `data-claim="SYN-01"`.
- The pillar belongs to no single clinic, so "pending G1" could mean all 19 G1 true, any one true, or the SYN-01 sign-off.

A reader cannot tell whether the pillar can launch with Wave 1 while Cedar Hills and Clayton Corners are unconfirmed, or which claim id the direct-billing sentences should carry.

### 3. Major. The claims policy covers only HTML elements; titles, meta descriptions and JSON-LD state WorkSafeBC facts with no gating rule, and the "19+" wording conflicts
**Scope:** G-4 line 34; §5 line 167; §6.1 lines 181-183; §6.2 lines 202-204; §7 line 227; Step 3.2 line 326; Step 4.2 line 333

- **Text that cannot carry `data-claim`:** §5 enforces accuracy through a `data-claim` attribute on elements. Titles, meta descriptions and JSON-LD cannot carry one, yet they assert facts: "Book a WCB physiotherapy assessment at Synergy Rehab <Name>", "Bring your WorkSafeBC claim number" (WSBC-13/SYN-07), `availableService` "WorkSafeBC physiotherapy" (SYN-01), and "How claims, visits and costs work" even though visit counts are barred. G-4 counts "published WorkSafeBC statements" without saying whether these count.
- **"19+" wording:** Step 4.2 checks for "19+ locations" wording, which is a brand rule from design-system.md E1. Every title, meta description and tile in §6.1 says "19+ clinics". research/09 P-07 also notes that "19+" is not in the claims register at all.
- **Em-dash rule:** Step 3.2 makes any em dash fatal in publish mode but gives no reason. It is a brand rule stated only in design-system E1.

### 4. Major. Two different start points for Wave 2
**Scope:** §4 scale rule line 163; §9 cadence line 251

§4 says Wave 2 starts once Wave 1 passes the day-30 review. §9 makes day 90 the "goal review and Wave 2/3 decision". G-1 is also judged at day 90. A reader cannot tell whether Wave 2 starts at day 30 or day 90.

### 5. Major. The rank and AI goals depend on tracking the document does not describe and that does not exist yet
**Scope:** G-1 line 31; G-2 line 32; G-5 line 35; G-6 line 36; Q-8 line 59; §9 line 250

- **Engines:** the "9 tracked SE Ranking regional engines" are never named. research/07 lists them: Surrey, Delta, Langley, Vancouver, Burnaby, New Westminster, Richmond, Abbotsford, Cloverdale.
- **Baseline:** G-1's "Baseline: 0 of 9" reads as a measurement. research/07 §1 says the head terms are not tracked anywhere and "there is no rank-tracking baseline for WorkSafe today".
- **Timing:** research/07 §7 says to add the keyword set at least 2 weeks before launch. The document leaves this out.
- **Data API expiry:** Q-8 mentions that the Data API subscription ends 2026-11-06 but not why that matters. research/07 says it is unknown whether rank tracking stops with it, and G-1, G-2, G-5 and G-6 all depend on it.
- **G-6:** it never says which AI engine is measured. research/07 §7 I covers only the ChatGPT engine 155491; AI Overview engines exist only in the path-scoped ICBC project. A reader of D3 and Problem 4 would assume AI Overviews are measured.
- **"121 pairs":** never defined (keyword × engine).

### 6. Major. G-3 assumes GA4 and GTM exist, and the event wiring is undefined
**Scope:** G-3 line 33; §9 lines 248-249

- G-3 says events are "reported weekly from launch". §9 says names will be aligned "once GA4 access exists", and research/07 §5 says it is unknown whether GA4 is configured at all.
- GA4/GTM readiness is not listed as a Wave 1 prerequisite or gate.
- Only the `[data-sr-event]` trigger is named. The document never says which markup attributes carry `clinic_slug`, `placement` and `page_type`, or who builds the GTM variables and tags.
- `worksafe_location_select` has no stated trigger.
- The "per 100 organic sessions" denominator needs GA4 landing-page sessions, which do not exist yet.

### 7. Major. The contract and eligibility premise is never explained
**Scope:** Overview line 11; Q-1 to Q-2 lines 52-53; G1 line 149; Wave 3 line 161

- The Overview says every clinic offers WCB booking in Jane, yet the document treats contract status as unknown for all 19 without saying why. The reason, the new April 1, 2026 agreement under which existing clinics were not carried over automatically (WSBC-01, WSBC-03), is never stated.
- It never says what being "contracted" changes for the worker: direct billing and no fees, versus paying and claiming back (WSBC-11, 23, 24, 26).
- Wave 3 is justified only by pointing at a field name, `eligibility_risk`. The actual reasons (not found on the cached WorkSafeBC lists; Medimap lists Cedar Hills as private-pay only, SYN-16) appear only inside `merge_locations.py`.
- Q-2 does not say why the Salius entity at Delta's unit matters.

### 8. Major. The Detailed Implementation Plan does not describe the repository as it exists
**Scope:** Steps 1.2 to 4, lines 314-333; §6.1/§6.2 title formulas; §7

Only Step 1.1 is marked done, yet the repo already has `build/build_pages.mjs`, `data/claims-signoff.json`, `pages/dist/` for 20 pages and `qa-report.json` (commit 1b0caad). What was built differs from the document:

| Topic | Document says | Repo has |
|---|---|---|
| Source files | `pillar.html`, `location.template.html` with `{{...}}` slots | `pages/src/pillar.mjs`, `location.mjs`, `shared.mjs` |
| Build flags | `--mode` only | also `--markers` and `--link` |
| Publish output | `pages/dist/` | `pages/publish/` |
| Pillar title | §6.1 formula | "WorkSafeBC Physiotherapy (WCB) at 19+ Clinics \| Synergy Rehab" |
| Location title | §6.2 formula | "WCB & WorkSafeBC Physio in Newton, Surrey \| Synergy Rehab" |
| JSON-LD page type | `WebPage` | `MedicalWebPage` + `WebSite` |
| Uniqueness metric | "unique-text ratio", undefined | 5-word-shingle Jaccard |

A new team member cannot tell whether this document is the spec to build against or a stale description, or which one wins when they differ.

### 9. Major. Data sources are undefined, and re-running the merge script would erase manual edits
**Scope:** Step 1.1 line 313; Step 1.3 line 315; CUJ 4 lines 85-87; §6.2 band 7 line 214; Future Improvements line 305

- **Undefined sources:** "client-filled Yelp list", "the collector's public data branch", "the ICBC page data" and "the existing availability widget" are never defined. The merge script shows they are `data/yelp-nap.csv` (a Drive sheet), `availability.json` on the `origin/data` branch written by `collect.js`, and `research/02-icbc-location-pages.csv`.
- **Unstated prerequisite:** the script needs the path to `availability.json` as an argument.
- **Overwrite risk:** `merge_locations.py` writes `staff_facts` as all-null and fixed `publish_gates` on every run. If someone re-runs it to refresh Jane data, it erases the gate and fact edits that CUJ 4 tells Marketing to make by hand.
- **Missing step:** no step says how answers in `staff-questionnaire.csv` get into `staff_facts`.

### 10. Major. Gate G4 starts true but its pass condition is undefined
**Scope:** §4 line 152; Step 1.1 line 313

G4's condition is "This document's §2 and §3 applied to the clinic". The document never says what "applied" means or who checks it, yet the merge script sets G4 to true for all 19 clinics. A gate that starts true does not gate anything.

### 11. Major. The documents this spec points to contradict it, and no precedence is stated
**Scope:** §6 line 177; Additional Resources lines 298-300

- **Band rhythm:** §6 hands band rhythm to design-system.md §4-§9. design-system §8.3 has 11 pillar bands (band 2 jump nav, band 9 FAQ) where this document has 12 (band 2 quick answers, band 9 other services, band 10 FAQ). Its 9 location bands also differ: RTW services, a VERIFIED status pill, compact steps at band 3.
- **Claim rule:** design-system §9 requires every factual slot to map to a claim with `status` VERIFIED. §5 here uses `publish_rule`. They disagree on real rows: WSBC-13 is PARTIAL but OK_TO_PUBLISH; WSBC-30 is VERIFIED but STAFF_CONFIRM.
- **modern-seo-cluster.md:** it says every page "must pass each row before publish", but this document lists it only as a reference. It also requires:
  - GBP links pointing to the matching page (contradicts D6);
  - `sameAs` to GBP (absent from §7);
  - INP under 200 ms (the NFR says INP is not promised);
  - a workplace-injury knowledge hub (deferred here).

### 12. Major. The `/physiotherapy-in-new-west/` decision does not connect to G-2
**Scope:** §3 line 133; G-2 line 32

- The page is never described. research/01 and research/09 call it a standalone landing template, possibly a paid page, never crawled. It sits next to the general page `/physiotherapy-new-westminster/`.
- The day-30 rule covers two outcomes: the new page outranks it, or the two alternate. It does not cover the existing page staying ahead. That is exactly the outcome that fails G-2 in the strongest pilot market, while §3 says to keep that page unchanged.

### 13. Major. Steps between build output and WordPress, and the rollback, are underspecified
**Scope:** §5 line 168; §10 lines 255-257; NFR Rollback line 292

- **"Drafts":** §5 says what is "allowed in drafts" but not whether that means build preview output or WordPress drafts. If preview fragments, which show STAFF TO CONFIRM boxes, go into WordPress drafts, a later re-paste of the publish fragment is needed. The document does not say so.
- **CSS loading:** loading `worksafe.css` only on WorkSafe URLs needs theme or plugin access, and nobody is named for it. The Elementor Full Width/Canvas layout that design-system requires is not mentioned.
- **Rollback:** "set to draft and remove the finder link" ignores four things:
  - the finder is generated into the pillar fragment, so removing a link means a rebuild and re-paste;
  - sibling pages' nearby-clinic blocks link to the page;
  - the general clinic page links to it (§3, §8);
  - `/physiotherapy-in-new-west/` may link to it.

  All of these would then point at a non-public URL.

### 14. Major. The official-URL check cannot be recorded per URL and is not enforced
**Scope:** §5 lines 169-170; Step 1.2 line 314

§5 says every row was verified from search snippets and that, before Wave 1, staff open "each cited official URL and record the check date". The sign-off file has a single global `checked_as_of` and sign-off entries only for STAFF_CONFIRM rows. §5 also allows OK_TO_PUBLISH rows in publish mode with no condition, so it is unclear whether the official-page check blocks anything.

### 15. Nit. ID collisions and gaps
- Goal ids G-1 to G-6 sit next to gate ids G1 to G5. "No G-5 regressions" (line 163) appears in §4 right beside gate G5.
- Decision D5 is missing between D4 and D6.

### 16. Nit. Product names and acronyms that are not defined
- Jane (first used at line 11; the only hint is the janeapp.com URL at line 244).
- SE Ranking and SE Ranking Local.
- ICBC (never expanded, though the scope rule depends on it).
- GBP, Medimap, PHN, BC PIPA, `_gl`, Teleclaim.
- "KNOWN" status values (line 227).
- "Maps average 3.36" (line 156): an SE Ranking Local grid average.
- The pillar's "main line" (band 1): no number exists in the data; research/04 suggests (604) 503-1688, which is also Nordel's number.

### 17. Nit. Numbers in the Overview are uncited
The Overview says "Every number below cites its file", but its own numbers (treatment 442; 8 of 78,145 impressions) carry no file. The GSC figure also drops research/07 §4's caveats: date range unknown, country unknown, top 1,000 rows only.

### 18. Nit. "Hours today" cannot be static
The location hero's "hours today summary" (line 208) needs today's date at view time, but §10 says no new JavaScript.

### 19. Nit. The stated pillar title never ships
The §6.1 pillar title is 68 characters, so the 65-character fallback always applies. 9 of the 19 location titles also exceed 65 and will be shortened.

### 20. Nit. CUJ 3 describes the end state
CUJ 3 has Surrey finder cards linking to each clinic's WorkSafe page. No Surrey clinic is in Wave 1, so for now those cards show Jane links (band 8).

### 21. Nit. Where `area_label` comes from is not stated
It is taken from the ICBC page H1s. Some values matter for Rules 2 and 3: Central City is "Surrey City Centre" and King George is "King George Blvd, Surrey".

### 22. Nit. Smaller contradictions
- The §2 "near me" row lists GBP listings as supporting URLs, but D6 says GBP links stay on the general clinic pages.
- The non-goal "No changes to ICBC pages" conflicts with the `/icbc-claims/` recommendation in §3.
- §2 Rule 4 does not say who checks rankings daily or what "copy narrowed" means.
- G-2's 60 days are counted from an unnamed event.
- G-1 does not say whether both keywords must reach the top 10 on the same engine.

### 23. Nit. Phone-number swapping is not listed
CallTrackingMetrics replaces phone numbers in visible text (design-system E3, research/09 C-05). §10 omits it from the inherited theme behaviours, although it affects tel: QA, G2 NAP and phone-click events.
# 09 · Completeness critic: what blocks clinic selection, keyword mapping and safe WorkSafeBC claims

Prepared 2026-11-02 by the completeness critic (Goldfish: no access to the earlier sessions, only to their files).
Read-only. No external system was called for this review: **0 SE Ranking units used**, no Ahrefs, Semrush, Drive, Canva or WebSearch calls. All analysis was done on the local files listed in section 9, using `Read` and local Python/grep. No patient data was opened.

**Labels.** KNOWN = stated in a project file with a tool source, or computed by me from those files (method given). LIKELY = a project file labels it LIKELY/SUMMARY, or a strong inference. UNKNOWN = no file holds it. ASSUMPTION = my judgement, to be tested. Where I quote a file's own label I keep it.

**Short verdict**

| Decision | Ready? | Main blocker |
|---|---|---|
| (a) Which clinics get WorkSafe location pages | **No** | No clinic has a confirmed WorkSafeBC contract under the April 1, 2026 agreement (SYN-01 UNVERIFIED for all 19). None of the per-clinic "distinct facts" the spec requires (transit, parking, entrance, accessibility, languages, WCB practitioners with consent, check-in) has been collected for any clinic. NAP is unresolved for at least 8 clinics. There is no written selection rubric. |
| (b) Keyword to URL mapping without cannibalization | **No** | The location-page URL pattern is undefined (the spec defines only the pillar). Every row in `keyword-master.csv` has `URL Target = Not Available`. The files disagree on whether the pillar is `/worksafe-physiotherapy/` or the coverage guide (the guide is the only Synergy URL that ranks live). No disposition exists for the 10+ existing URLs that already rank for WorkSafe intent, including `/physiotherapy-in-new-west/` in the pilot market. |
| (c) Publishing WorkSafeBC factual claims safely | **Partly** | 22 claims are OK_TO_PUBLISH as general WorkSafeBC rules, but they are snippet-verified only: no worksafebc.com page was opened. Any sentence that ties a rule to Synergy depends on SYN-01. The visit allocation (10/5 vs 15/6), pending-claim payment policy and service-level status (massage, acupuncture, kinesiology support sessions, EAPP) need staff. The spec's publish gate contradicts the register's own publish rule. Conflicting live copy (15 sessions/6 weeks, the 60-day misstatement, the "gap" wording) has no removal plan. |

---

## 1. Cross-file contradictions

"Better-supported" says which side the evidence favours. It does not settle the fact. "Close now?" names a tool that could settle it in this environment today, or says staff/owner.

### 1.1 Eligibility and entity

| ID | Topic | File A says | File B says | Better-supported | Blocks | Close now? |
|---|---|---|---|---|---|---|
| C-01 | Are all 19 clinics eligible? | 04 §7: "no clinic in the 19 should be excluded on WorkSafe-acceptance grounds". This rests on the WCB Physio types being bookable in Jane (KNOWN). | 05 §1.2 and §6: 2026 contract status is UNKNOWN for all 19, and "only clinics that staff confirm as contracted under the 2026 agreement should get WorkSafeBC location pages". Spec §8.3: pages only for a "verified eligible clinic", with a VERIFIED status pill. 08 F1: same as 05. | 05. Being bookable in Jane shows the clinic intends to treat WCB patients. It does not prove a contract (05 §6, KNOWN quote that incumbents were sent the new agreement "for review and consideration"). | a, c | No. Staff (ops/billing): signed 2026 Physiotherapy Services Agreement and vendor/payee number for each clinic or legal entity. |
| C-02 | Cedar Hills | 04: WCB Physio Initial bookable, 6 WCB physios, 175 WCB initial slots in 7 days (KNOWN). | 05 §6: not found on the cached WorkSafeBC physio list, EAPP only (LIKELY). SYN-16: the Medimap profile at 120-12852 96 Ave lists private insurance and credit card only (LIKELY). | Unresolved | a, c | No. Staff. A WebSearch of worksafebc.com would only return the same stale cached lists (05 §6). |
| C-03 | Delta address entity | 04 §8: Medimap lists "Salius Rehab Inc." at #103-10757 Delsom Cres, Synergy Delta's address (UNKNOWN, "possibly stale"). | 08 (task 264779098, KNOWN): saliusphysiotherapy.com ranks **#1 and #8** for `worksafebc physiotherapy delta` with "Salius Delta" titles. 05 §6: an older EAPP list shows Delta's row with 604.503.9033, which is **King George's** phone. No file connects these. | Unresolved. LIKELY a previous occupant, a related entity or a stale listing. | a, c | Partly. WebSearch (free) with `allowed_domains: saliusphysiotherapy.com` could get Salius's address (LIKELY grade only). Then staff. |
| C-04 | Postal codes | `locations-master.csv` (GBP or site): Abbotsford V2T 5W8, Newton V3S 2E7, Richmond V7A 1N6, Delta V4C 0A5, Central City V3T 2V6 | `yelp-nap.csv` (the client-filled Yelp sheet, KNOWN; 03 §2): Abbotsford **V2T 0G6**, Newton **V3S 2E6**, Richmond **V7A 5J3**, Delta **V4C 0A8**, Central City **V3T 0P8**. For Richmond, Delta and Central City the Yelp value also appears on another site page or on Medimap (04 §8). | Unresolved. For 3 clinics `locations-master` chose the site value (LIKELY, from WebSearch summaries) over the client sheet (KNOWN as a document). | a, b (schema), c | No. Clinic managers confirm, then align GBP, site, Jane and citations. A local merge of `yelp-nap.csv` into `locations-master.csv` can flag the conflicts now. |
| C-05 | Phones | Site/Yelp: Vancouver (604) 416-2600; New Westminster (604) 553-3303; Central City (604) 954-1475; Cloverdale (604) 579-1367 | Vancouver also shows (604) 200-2319 and (604) 373-8092 on other site pages (04), plus **236.885.8280** on the WorkSafeBC list (05). New Westminster also (604) 239-3210 (04), and 604.533.3303 on the WorkSafeBC chiro list, LIKELY a typo (05). Central City also (604) 245-1127 (04), plus 604.653.7411 on an older WorkSafeBC list (05). Cloverdale also (604) 227-6785 (04). Nordel's number is the corporate main line (04). | Yelp `BusinessPhoneNumber` matches the main site value for every clinic (computed: 19 of 19 match the first value in `phone_site`, or `phone_gbp` for Abbotsford, where `phone_site` is Not Available). The extra numbers are unexplained. | a, c | No. Staff. Note: CallTrackingMetrics swaps numbers in visible text (spec §14.6), so what users see may differ from the NAP. |
| C-06 | Unit or name on official list | New Westminster unit #405 (GBP, Yelp, ICBC meta description) | **#202** on the site's own `/locations/` page (01 §1.3, WebSearch summary, LIKELY) and on the WorkSafeBC list snippet (05, 08). The WorkSafeBC list names Central City "Synergy Rehabilitation King George Hub" (05). Newton is filed under Richmond and Sullivan Heights is labelled "Strawberry Hill" on some lists (05 §6). | #405 (KNOWN from GBP) | a, c | No. Staff, and a correction request to WorkSafeBC (SYN-18). A site-side fix needs WordPress access. |
| C-07 | Hours | Newton GBP (KNOWN): Tue and Fri open 07:00, Sat 08:00-16:00, Sun 09:00-16:00 | Newton Yelp sheet: 7:30 every weekday, Sat 8AM-**7PM**, Sun **8AM**-4PM. Richmond: ICBC page summary says Mon-Fri **7:30**-8:30 (02 §2.3, SUMMARY); the Yelp sheet says Mon-Fri **8AM**-8:30PM and Sun "9AM3PM". GBP hours are Not Available for the other 16 clinics. | Unresolved | a (the "hours for shift workers" differentiator), b (schema) | No. GBP bulk export, plus clinic managers. |
| C-08 | Clinic display names | Jane, ICBC and `locations-master` use one set of names | Other names in use: Sullivan (Yelp) / Sullivan Heights (Jane) / "Strawberry Hill" (one WorkSafeBC list). Central City / City Central (URL) / Surrey City Centre (ICBC H1) / King George Hub (WorkSafeBC list). Clayton Corners / East Clayton (ICBC H1). Newton / Amson (legacy URL, Jane slug) / Newton 72nd. Delta / North Delta. Nordel: Surrey (repo) / "Nordel (North Delta)" (site taxonomy). Langley / Langley Township (Yelp) / Yorkson Village (photo folder, `/locations/`). | No canonical name is defined | a, b (title and H1 vocabulary), c (entity consistency) | No. Owner and clinic decision: one display name and one neighbourhood label per clinic. |
| C-09 | Surrey clinic count | 06 §7.2: "11 Surrey clinics" | 08 §1 and F25: "13 Surrey clinics". `locations-master.csv` city = Surrey: **12** (computed). | 12 (KNOWN, computed) | b (Surrey grouping) | Yes, local text fix. |
| C-10 | Location count | Spec §13 brand rule: "19+ locations". Yelp captions: "19+". | Yelp sheet: 19 rehab rows plus Optometry (03 §2). Jane: 21 locations, including mobile `active-rehab` and `clinical-counselling` (04 §3). Some site pages say "17" (02 W15, LIKELY). The Yelp portfolio says "Coquitlam" but there is no Coquitlam clinic (03 §2, §3.6). | 19 rehab clinics (KNOWN) | c | The claim is not in the claims register (see P-07). Staff/brand decision on "19+". |

### 1.2 WorkSafeBC rules and Synergy copy

| ID | Topic | Conflict | Status in register | Blocks | Close now? |
|---|---|---|---|---|---|
| C-11 | Visit allocation | **Synergy copy disagrees with itself:** 10 visits/5 weeks (`/worksafe-physiotherapy/`, homepage, LIKELY), 15/6 (`/icbc-claims/`, KNOWN; 2023 graphic), "up to 15" (King George and Delta pages, SUMMARY), "no single fixed number" (blog, SUMMARY), and "usually around 10 visits over about five weeks" (Yelp portfolio, 03 §3.6; **not in the register**). **WorkSafeBC disagrees with itself:** the February 2026 manual says 10/5, while the agreement text found (Contract 89088), the 2022 billing guide, the flowchart and an invoicing page say 15/6 (05 §4). | WSBC-18 PARTIAL/STAFF_CONFIRM; WSBC-19 CONFLICT; SYN-02, SYN-03, SYN-15 | c | No. Staff check the signed 2026 agreement schedule. Until then, publish no number (05 §4 wording). |
| C-12 | Referral | Synergy: "no referral needed in most cases … a referral may be beneficial" (LIKELY). WorkSafeBC: no referral requirement found for physio (WSBC-16 PARTIAL), but a doctor's referral is **required** for massage (WSBC-35 VERIFIED). 06 §4.4 still calls the coverage facts "conflicting" and cites a summary mentioning "a physician referral and up to six treatments within the first eight weeks". That is the massage rule (05 §7). The spec §9.3 lists "referral rules for massage" as contested, although WSBC-35 is OK_TO_PUBLISH. Competitors and the head-term AI Overview say "referral after 60 days" (08 F8), which 05 contradicts: after 60 days WorkSafeBC must **pre-approve** treatment (WSBC-14). | WSBC-14, -16, -35; SYN-06 | c | Resolved at document level: 05 governs. Update the notes in 06 and the spec. |
| C-13 | 60-day window | Synergy: "Approved claims are eligible for treatment within 60 days" (`/icbc-claims/` KNOWN; WorkSafe page and homepage LIKELY). WorkSafeBC: the 60 days is the no-pre-approval window for the initial assessment, it applies to pending claims too, and treatment later than that needs pre-approval (WSBC-12, -14). | SYN-04 CONFLICT | c (on-site contradiction) | No. Needs WordPress access to fix the live copy. |
| C-14 | Fees | "You pay nothing" / "no out-of-pocket" (SYN-09) vs the blog's "WorkSafeBC pays its established rate and the patient covers the gap" (SYN-11, SUMMARY). WorkSafeBC: no fees on an accepted claim at a contracted clinic (WSBC-23). The gap applies only at non-contracted clinics, which are reimbursed at $95 (WSBC-26). | SYN-09 STAFF_CONFIRM; SYN-11 CONFLICT | c | No. Depends on SYN-01. Fix live copy via WordPress. |
| C-15 | Kinesiology as a differentiator | 06 §4.7: no WCB kinesiology type in Jane, and WorkSafe funding at Synergy is UNKNOWN. 08 F1 and spec band 6 use "on-site kinesiology for support sessions" as a location-page differentiator. 05: KIN/PTSW support sessions sit inside the physio treatment period from April 2026 (WSBC-39 STAFF_CONFIRM). | WSBC-39 | a, c | No. Staff: does Synergy bill KIN support sessions under the 2026 agreement, and at which clinics? |
| C-16 | WCB massage | 04 and 06 §7.3 recommend a WCB massage section on 9 clinic pages. Jane shows only "WCB Massage **Subsequent** Session", with no initial type (04, KNOWN). WorkSafeBC massage needs a doctor's referral and an accepted claim (WSBC-35). RMT WorkSafeBC status per clinic is UNKNOWN (05). | WSBC-35 | b (06 maps 3 massage keywords), c | No. Staff confirm RMT status (massage agreement #81664) and how a worker books the first WCB massage visit. |
| C-17 | "Approved" wording already live | The Yelp Delta listing ranks #10 with "WCB and WorkSafeBC Approved Physiotherapy" (08 F6, KNOWN). The Yelp portfolio title says the same (03 §3.5). 06 §4.1 and 07 §7A: do not say "approved" until verified. **Not in the claims register.** | Missing | c | Add a register row now (local). Staff decide whether to edit Yelp. |

### 1.3 Architecture, rankings and data

| ID | Topic | File A says | File B says | Better-supported | Blocks | Close now? |
|---|---|---|---|---|---|---|
| C-18 | Which URL is the pillar | Spec §8.3: pillar = `/worksafe-physiotherapy/`. 07 §7 marks this an ASSUMPTION. 06 §7.2: reuse `/worksafe-physiotherapy/` as the pillar, keep the guide, and **retitle the guide away from** "WorkSafeBC physiotherapy". | 08 F7: "Grow this guide into the pillar **or merge it in**, keeping its URL equity in mind." Data: the guide ranks live at New West #4, Burnaby #7 (plus an AI Overview citation), Langley #9/#10 and Surrey #10 (08, KNOWN). `/worksafe-physiotherapy/` ranks for one 0-volume term at #64 (01, 07; KNOWN). | Undecided. Retitling the guide could cost the only live WorkSafe rankings (ASSUMPTION). | b | No. Owner decision. |
| C-19 | New Westminster WorkSafe URL | 07 §3.1: the legacy `/physiotherapy-new-westminster/` "will compete with a New Westminster WorkSafe page" (it ranks #47 for a 0-volume term in the database). | 08 live SERPs (KNOWN): `/physiotherapy-in-new-west/` ranks **#3** for `worksafebc physiotherapy new westminster`, **#3** for `wcb physio new westminster` and **#6** for `workplace injury …`, and is an AI Overview source twice. 08's list of wrong-intent URLs leaves it out. 01: it is a stand-alone landing template (LIKELY, possibly a paid-search page) and was never crawled. The New West GBP website is the homepage (04). | 08. Four URLs touch New West WorkSafe intent: the landing page, the legacy page, the guide and the homepage. | b (pilot market) | Partly. WebSearch (`allowed_domains: synergyrehabilitation.ca`, free) for its title and whether it is indexed (LIKELY grade). Staff: is it a Google Ads landing page? |
| C-20 | Ranking baseline | 07 §1: "There is no rank-tracking baseline for WorkSafe today." `keyword-master.csv`: Current Rank is filled for 10 rows, none of them P1. Competitor Rank is filled for 0 rows. | 08 `serp-snapshot.csv` (KNOWN, 2026-11-02): Synergy appears in the organic top 10 of 9 of 25 city SERPs and in the local pack of 3. | Both are true. Head terms are absent in both sources, and the database snapshot is not the same as live city SERPs. The 08 snapshot is a one-day live baseline that was never merged into `rank-baseline.csv` or `keyword-master.csv`. | b | Yes. Local merge of `serp-snapshot.csv`; no external call. |
| C-21 | GBP website targets | `locations-master.csv` `gbp_website_url`: Not Available for Central City and Delta | 08 local-pack links (KNOWN): Central City GBP points to the **homepage** (task 264762175). Delta GBP points to `/physiotherapy-delta-chiropractor/` (tasks 264768220, 264768223). | 08 | a, b | Yes. Local merge. |
| C-22 | Name of the 34-keyword engine | 03 and `historical-rankings.csv`: "Google Canada", with no city | 07 and `rank-baseline.csv`: "Google.ca Surrey BC", from `PROJECT_getSearchEngines` (KNOWN) | 07 (API value; 03 read the PDF label) | b (trend comparisons) | Yes. Relabel 03's CSV locally. `PROJECT_getSearchEngines` was already run by 07. |
| C-23 | Volumes (context terms) | `keyword-master.csv` / 06 (DATA_getKeywordsMetrics): `physiotherapy richmond` 40, `physiotherapy langley` 50, `icbc physiotherapy richmond` no data. 06 §5: generic physio demand for Cedar Hills, Strawberry Hill, Sullivan Heights and Clayton is "no data". `physio new west` 140. | `rank-baseline.csv` / 07 (SE Ranking project volumes): 70, 30 and 10 for the first three. `cedar hills physiotherapy` 40, `strawberry hill physiotherapy` 10, `clayton physiotherapy` 320, `clayton heights physiotherapy` 390 (06 has "physiotherapy clayton heights" at 40), `new west physio` 10. | Different SE Ranking endpoints (DATA vs PROJECT) and different word orders (LIKELY). Context only, but 06 §5 uses generic demand to order the rollout. | a (rollout order) | Yes. `mcp__SERanking__DATA_getKeywordsMetrics` (source ca) on about 12 reversed-order terms, about 12 units at the observed ~1 unit per keyword (06 §2). |
| C-24 | Jane WCB deep link | 04 §7: treatment 442 at all 19 clinics is KNOWN, but "that the link opens the type directly is LIKELY". Variants also exist: Richmond has "WCB Physio Initial Session (40 mins)", and there are extra ids at Langley, South Surrey, New West and Newton. | Spec E12 calls the deep link "KNOWN" and hard-codes `#/discipline/3/treatment/442` for every clinic. | 04 (confidence was raised without new evidence) | a, b (CTA) | Partly. `git show origin/data:availability.json` (local, read-only) lists the type ids per clinic. Front-desk staff, or a browser QA pass, must confirm which initial type to use and that the link opens it. |
| C-25 | Publish gate | Spec §9, §13, §15: every factual slot must map to a claim with **status VERIFIED**. | Register `publish_rule`: some VERIFIED rows are DO_NOT_PUBLISH (WSBC-02, -05, -07, -32) or STAFF_CONFIRM (WSBC-30, -41). Some PARTIAL rows are OK_TO_PUBLISH (WSBC-13, SYN-05). 05 §10 uses WSBC-13 in its publish-ready wording. | The register. The spec gate would let provider-internal facts through and block approved wording. | c | Yes. Local edit: gate on `publish_rule = OK_TO_PUBLISH`. |
| C-26 | What "VERIFIED" means | Spec treats VERIFIED as publishable fact. | 05 §0: KNOWN or VERIFIED means a WebSearch snippet quote; "The page itself could not be opened, so context and page date are still unconfirmed". 05 §10 asks for a 5-minute live check of every quoted line before go-live. | 05 | c | No. Needs `www.worksafebc.com` allowed in network settings, or a person checks each line. |
| C-27 | Location URL owner | 06 §7.2: "WorkSafe location URLs are to be decided by the spec". 08 F3 and F6 also defer to the spec. | Spec §8.3 defines bands for a location page but **no URL pattern, no title/H1/meta formula and no keyword assignment**. | Gap | b | No. Owner or spec author. |
| C-28 | Minor | 01: 44 tracked keywords; 07: 43 distinct. 08 says Synergy's DIR 44 is "level with the highest", but its own table lists fleetwoodsurreyphysio.ca at DIR 46. PROJECT-STATE.md shows "~9,300 API units"; 08 ended with **1,320** (KNOWN). | | | none | Local text fixes. Update PROJECT-STATE.md. |

---

## 2. (a) Gaps that block choosing which clinics get WorkSafe location pages

| ID | Gap | Why it blocks | Evidence | Close now? |
|---|---|---|---|---|
| A-01 | 2026 WorkSafeBC contract per clinic or legal entity, with vendor/payee numbers (SYN-01) | Every "WorkSafeBC-contracted" or "direct billing" line and the spec's VERIFIED pill depend on it. The cached provider lists are 16 to 23 months old and predate the April 2026 agreement. | 05 §1.2, §6; claims register SYN-01 UNVERIFIED | No. Staff (ops/billing). Low-odds tool option: `mcp__Google_Drive__search_files` for "Physiotherapy Services Agreement", "vendor", "payee" or "19D210" (03 §3.5 already found no WorkSafeBC documents). worksafebc.com is blocked (ENOTFOUND). |
| A-02 | No selection rubric | Nothing defines "verified eligible" or "genuinely distinct" in testable terms. The spec says only that a clinic which cannot fill bands 2, 4 and 5 with real facts should not get a page. | Spec §8.3; 06 §7.1; 08 F1 | No. Owner decision. A proposed rubric is in §2.2 (ASSUMPTION). |
| A-03 | The clinic-specific facts required by spec bands 2, 4 and 5 are not collected for any clinic: transit, parking, entrance and floor, accessibility, languages spoken, front-desk and check-in process, nearby industrial areas served | Without them every location page is the ICBC template with a city swapped, which is the doorway pattern 02 §3 and 08 F11 warn against. | The only facts available are GBP attributes for 2 clinics (Abbotsford and Newton: free parking; Newton: wheelchair-accessible) (04 §4). The Yelp "FREE_PARKING" highlight is the same template value on all 19 rows (03 §2), so it is not clinic-verified. | No. Clinic-manager questionnaire (section 7). |
| A-04 | WCB practitioner module | Spec band 4 needs names, registration, focus areas and languages, published with consent | Jane data holds practitioner names (04 header; only counts were reported). There is no roster in Drive (03 §3.4). No registration check against the College of Health and Care Professionals of BC (spec §9.8, LIKELY regulator). | Partly. Local `git show origin/data:availability.json` gives the names, for a staff consent list only. Consent and registration checks are staff work. |
| A-05 | Clinic photos | Spec band 1 and band 5 need a photo unique to the clinic, with consent | Folder-unique file counts (03 §3.3, KNOWN): Delta 5; Cedar Hills, Richmond and Strawberry Hill 9 each. The images were never opened, so consent and content are UNKNOWN. | No. Staff (consent, possibly a reshoot). |
| A-06 | GBP data for 16 of 19 clinics: name, categories, hours, website, CID/Maps URL, coordinates, reviews | Needed for NAP sign-off, the map and directions, sameAs in schema, and choosing a GBP landing page | Only 3 GBPs are connected in SE Ranking Local (04 §1.3). Latitude and longitude are null for 16 clinics. | No. Connecting them is a paid write. Staff: GBP Manager bulk export. Inter-clinic distances are available locally from the ICBC nearby-clinic component (see §2.1). |
| A-07 | Canonical NAP and names | C-04 to C-08 | 04 §8; 03 §2; 05 §6 | No. Staff. A local merge can flag the conflicts. |
| A-08 | Capacity and staffing | Vancouver, Burnaby and Clayton Corners each have 2 WCB physios with openings in the week. Clayton Corners is closed on weekends and opens at 12 PM on Mon, Tue and Thu (Yelp). | 04 §7 (single 7-day Jane window, 2026-11-02 to 11-08); `yelp-nap.csv` | Partly. Re-read the collector's data branch (local git) for more weeks. Owner decides whether a small team still justifies a page. |
| A-09 | Clinics within about 2 km of each other | No rule says whether both clinics in a close pair get pages. ICBC pages already rank the wrong clinic (07 §3.2: 17 of 29 ranking targeted keywords use the wrong page). | Computed from `02-icbc-location-pages.csv` (nearby-clinic component, KNOWN as published; how distance is measured is UNKNOWN): Nordel to Cedar Hills 1.5 km; Cedar Hills to Central City 1.7 km; Clayton Corners to Clayton Heights 1.8 km; King George to Newton 2.4 km | No. Owner decision (see B-05). |
| A-10 | Evidence of demand by clinic | Location pages cannot be justified by geo keyword volume: all 114 geo combinations returned no data or 0 (06 §1.2). Live SERPs exist for 8 city markets only. | 06 §5; 08 §0. Surrey neighbourhoods, Cloverdale and Langley-specific neighbourhoods have no SERP. The `workplace injury physiotherapy burnaby` SERP was never collected (task 264767002). | Partly. `mcp__SERanking__DATA_getSerpTaskAdvancedResults` on task 264767002 (re-poll; cost uncertain, since 08 saw delayed billing). Page-level GSC needs access (B-10). |
| A-11 | Shared Clayton page | `/clayton-physiotherapy-treatment-clinic/` covers "Clayton" for 2 clinics; which one is UNKNOWN | 01 §1.3; 04 §8 | No. WordPress access or staff. |
| A-12 | Newton GBP website clicks fell from 212-357 a month to 100, 14 and 89 (Aug to Oct 2026), and the audit flags a website mismatch | Newton is the second Maps-tracked WorkSafe market. Its GBP lands on `/physiotherapy-amson-chiropractor/`, which carried the Burnaby title at the 2026-09-25 crawl. | 04 §1.6 (KNOWN) | No. Staff check the GBP website field and redirects. |

### 2.1 Readiness matrix per clinic (synthesised from existing files; nothing new collected)

Every row is **HOLD** until A-01 (SYN-01) is confirmed for that clinic. "Unique photos" = files whose title and size appear in no other folder (03 §3.3). "Nearest" = closest Synergy clinic as listed on its ICBC page (`02-icbc-location-pages.csv`). "Live WorkSafe signal" covers only the 25 SERPs collected in 08 plus the SE Ranking Local grids in 04.

| Clinic | WCB physios with openings, 7d (04, KNOWN) | Cached WorkSafeBC physio list (05, LIKELY) | GBP in SE Ranking | Open NAP / name issues | Unique photos | Nearest (km) | Live WorkSafe signal (08, 04) |
|---|---|---|---|---|---|---|---|
| Vancouver | 2 | Found; phone differs (236.885.8280) | No | 4 phone numbers in circulation | 42 | Burnaby 14.0 | Absent in all 3 Vancouver SERPs |
| Burnaby | 2 | Found; matches | No | None flagged; GBP hours unknown | 30 | New West 7.7 | Guide #7 (not local); AI Overview cites Synergy |
| New Westminster | 4 | Found; unit **202** vs #405 | Yes (42283) | Unit 202 vs 405; second phone | 13 | Cedar Hills 5.9 | **Strongest**: #3/#4, #3, #6 via `/physiotherapy-in-new-west/` and the guide; 2 AI Overviews; Maps avg 3.36 |
| Richmond | 4 | Found; matches | No | Postal 1N6 vs 5J3; hours | 9 | Delta 12.0 | Wrong-intent pages only: `/tag/worksafebc/` #7, ICBC page #6/#10, `-2` page #7 |
| Delta | 8 | Found; an older EAPP row carries King George's phone | No | Postal 0A5 vs 0A8; Salius entity at the same address (C-03) | **5** | Nordel 4.2 | Organic #2 plus pack #2/#3 via the existing clinic page |
| Nordel | 8 | Found | No | Phone = corporate line; Surrey vs North Delta | 16 | Cedar Hills **1.5** | None measured |
| Cedar Hills | 6 | **Not found** on the physio list (EAPP LIKELY); Medimap shows private pay only | No | None | 9 | Nordel **1.5** | None measured |
| Strawberry Hill | 7 | Found | No | None | 9 | King George 3.0 | None measured |
| Newton 72 Ave | 10 | Found (filed under Richmond on some lists) | Yes (42289) | Postal 2E7 vs 2E6; GBP vs Yelp hours; GBP points to the "Amson" page | 11 | King George **2.4** | Maps avg 8.64; injury-phrased terms weak |
| Sullivan Heights | 8 | Found; label inconsistent | No | Sullivan vs Sullivan Heights | 40 | Newton 3.6 | None measured |
| King George | 8 | Found | No | None (but its phone sits on Delta's old EAPP row) | 34 | Newton **2.4** | None measured |
| Central City | 5 | Older list: "King George Hub", 604.653.7411 | No | Postal 2V6 vs 0P8; 3 phones; 4 names | 11 | Cedar Hills **1.7** | Surrey pack #2 (GBP points to the homepage); AI Overview names it first |
| Fleetwood | 6 | Found | No | Format only | 15 | Newton 4.2 | None measured |
| Cloverdale | 9 | Found | No | Second phone | 17 | Clayton Heights 3.3 | GSC: "wcb physiotherapy cloverdale", 7 impressions, position 6 (URL unknown) |
| Clayton Corners | 2 | **Not found** on any list | No | Shared Clayton page; no weekend hours | 18 | Clayton Heights **1.8** | None measured |
| Clayton Heights | 7 | Found (2024) | No | Shared Clayton page; second phone on another document | 32 | Clayton Corners **1.8** | None measured |
| South Surrey | 5 | Found | No | Its only general page is chiropractic-titled | 37 | Sullivan Heights 6.7 | None measured |
| Langley | 5 | EAPP and chiro lists; main physio list LIKELY | No | Langley vs Langley Township vs Yorkson Village | 20 | Clayton Corners 3.6 | Guide #9/#10 (not local) |
| Abbotsford | 4 | Found (Fraser Valley) | Yes (44167) | Postal 5W8 vs 0G6 | 26 | Langley 24.0 | Only the ICBC alt page, at #11; no WorkSafe Maps keyword tracked |

Reading (LIKELY): New Westminster is the best pilot on evidence, as 04 and 08 both say, but only once SYN-01 is confirmed for it, unit #405 vs #202 is settled and its URL plan is decided (C-19). Delta and Central City have live pack presence but open entity, NAP and cannibalization questions. Cedar Hills and Clayton Corners carry the most eligibility risk.

### 2.2 Proposed minimum selection gates (ASSUMPTION, for the owner to accept or change)

| Gate | Pass condition | Source of truth |
|---|---|---|
| G1 Contract | Signed 2026 agreement and vendor number confirmed for the clinic's legal entity | Ops/billing (SYN-01) |
| G2 NAP | One name, address, unit, postal code, phone and hours set, signed off by the clinic manager and matching the GBP | Clinic manager plus GBP export |
| G3 Distinct facts | Spec bands 2, 4 and 5 filled with verified clinic-only facts: getting here, WCB practitioners with consent, a first-visit photo with consent | Clinic questionnaire |
| G4 URL plan | What happens to the clinic's existing WorkSafe-ranking URLs is decided, and a rule exists for clinics within about 2 km | Owner (section 3) |
| G5 Measurement | WorkSafe keywords tracked with target URLs before launch | Owner approval (B-11) |

---

## 3. (b) Gaps that block mapping keywords to URLs without cannibalization

| ID | Gap | Evidence | Close now? |
|---|---|---|---|
| B-01 | **No URL pattern for location pages.** Options include new URLs such as `/worksafe-physiotherapy/<slug>/`, sections on the existing clinic pages, or a mix. Nothing decides it. | C-27 | No. Owner or spec author. |
| B-02 | `keyword-master.csv` has `URL Target = Not Available` for all 508 rows. Current Rank is filled for 10 rows, Competitor Rank for 0. | Computed from the CSV | Yes, after B-01: local edit. The ranks can be merged from `serp-snapshot.csv` now. |
| B-03 | Pillar vs coverage guide (C-18) | 06 §7.2 vs 08 F7 | No. Owner. |
| B-04 | No disposition for existing URLs that rank for, or carry, WorkSafe intent (table below) | 01 §5, 07 §3, 08 | No. Owner; WordPress access needed to act. |
| B-05 | **No owner URL for city-level queries in multi-clinic cities.** For `worksafebc physiotherapy surrey` and `wcb physio surrey` across 12 Surrey clinics, it is undecided whether the pillar, one clinic page or no page is the target. 06 rejects a Surrey hub. Today Central City's pack listing (GBP pointing to the homepage) and the guide (#10) win. | 06 §7.2; 08 §2 | No. Owner. |
| B-06 | **GBP website target policy.** Undecided whether each GBP links to the WorkSafe page or the general clinic page (08 F18 defers to the spec). If GBPs point to WorkSafe pages, those pages will pick up generic "physio near me" demand, which conflicts with the scope rule and 07's guardrails (§7E). | 04, 07 §7E, 08 F18 | No. Owner. |
| B-07 | No title, H1 or meta formula for WorkSafe location pages, and no agreed neighbourhood vocabulary per clinic (C-08) | Spec has none; the ICBC formula is in 02 §2.3 | No. Owner, with staff supplying names. |
| B-08 | 7 SERP'd keywords are missing from the keyword master, with no volumes: `workplace injury physiotherapy {vancouver, burnaby, richmond, langley, abbotsford, new westminster, delta}` | Computed: serp-snapshot keywords not in `keyword-master.csv` | Yes. `mcp__SERanking__DATA_getKeywordsMetrics` (source ca, about 7 units). |
| B-09 | URL inventory holes: `/tag/worksafebc/` (ranks #7 in Richmond) is **not in `site-urls.csv`**. `/physiotherapy-in-new-west/`, the `/icbc-physiotherapy-in-*/` family and `/tag/abbotsford/` were never crawled (status, canonical and H1 UNKNOWN). The crawl stopped at the 500-page cap (01 §0). | 01 §6; 08 | Partly. WebSearch with `allowed_domains: synergyrehabilitation.ca` (free, LIKELY grade). A full recrawl is an SE Ranking audit write that needs approval. Ahrefs is plan-blocked. |
| B-10 | No page-level GSC data: which URL earns WorkSafe impressions, for example "wcb physiotherapy cloverdale" | 01 §6; 07 §8 | No. Staff grant GSC access (Supermetrics has no licence; Ahrefs GSC is plan-blocked). |
| B-11 | WorkSafe rank tracking with target URLs is not set up (a write action). The SE Ranking Data API **expires 2026-11-06 21:34** with **1,320 units** left (KNOWN, 07 §0 and 08 §0). | 07 §7 | No. Owner approval and renewal, urgently. |
| B-12 | Template defects that new pages would inherit: double canonical (388 pages) and double meta description (82 pages). Spec §14 does not mention them. | 01 §3 rows 1 and 2 | No. WordPress access. |
| B-13 | No structured-data spec. The cluster checklist needs Organization, then MedicalClinic per location, then Service, with sameAs to the GBP. Maps CIDs are known for 3 clinics only. Existing schema on the site is Not Available. | spec/modern-seo-cluster.md; 01 §0; 04 | No. Spec author, plus the GBP export. |
| B-14 | No internal-link matrix (the checklist requires one), and no decision on whether ICBC pages may point to WorkSafe pages (08 F3 defers it) | spec/modern-seo-cluster.md; 08 F3 | No. Owner. |

### 3.1 Existing URLs needing a keep / redirect / noindex / retarget decision (KNOWN signals; decision UNKNOWN)

| URL | Current WorkSafe signal | Conflicting advice or risk |
|---|---|---|
| `/worksafe-physiotherapy/` | Sitewide nav "Worksafe", 352 in-links; #64 for one 0-volume term | Pillar per the spec and 06; 08 offers the guide as an alternative |
| `/worksafebc-physiotherapy-what-is-covered/` | Ranks live in 4 cities and is an AI Overview source (08) | 06: retitle away from the head term. 08: merge it into the pillar or grow it into the pillar. |
| `/physiotherapy-in-new-west/` | #3, #3, #6 and 2 AI Overview citations (08) | Not in 08's wrong-intent list. A landing template that may be a paid landing page (01, LIKELY). Pilot-market conflict. |
| `/physiotherapy-new-westminster/` | #47 for "wsbc physiotherapy new westminster" (database) | 07: it will compete |
| `/tag/worksafebc/` | #7 for `worksafebc physiotherapy richmond` | Missing from the inventory. 08: noindex or consolidate, left to the spec phase. |
| `/icbc-treatments/richmond/`, `/richmond-physiotherapy-2/` | #6/#10 and #7 in Richmond WorkSafe SERPs | Wrong program and a duplicate legacy page |
| `/icbc-physiotherapy-abbotsford/` | #11 for `wcb physio abbotsford` ("25 Visits", an ICBC figure) | Wrong program; possibly a paid landing page |
| `/physiotherapy-delta-chiropractor/` | Organic #2 and pack #2/#3 in Delta; the Delta GBP landing page | A new Delta WorkSafe URL could split this. 08 F6: "a WorkSafe-specific page or a deeper section, decided in the spec". |
| `/` (homepage) | Central City pack landing in Surrey; occupational-rehab long tail; WorkSafe module | 07: link to the pillar, do not compete |
| `/icbc-claims/` | H1 "ICBC & WorkSafe Claims"; 15/6 copy; nofollow sitewide | Mixed intent plus conflicting claims |
| 5 newer clinic pages with "More About Worksafe" (Abbotsford, Newton/Amson, Cloverdale, Delta, King George) and legacy city pages that say "We Accept ICBC, WCB, MSP" | Medium risk (01 §5.2) | 07 §3.2 warns against leaving a second WorkSafe location family indexable |
| Unknown URL behind "wcb physiotherapy cloverdale" (GSC) | Position 6, 7 impressions | Needs GSC Pages (B-10) |

---

## 4. (c) Gaps that block publishing WorkSafeBC factual claims safely

| ID | Gap | Evidence | Close now? |
|---|---|---|---|
| P-01 | SYN-01: no sentence may say Synergy is contracted, direct-bills or charges no fees until this is confirmed (same as A-01) | Register SYN-01, SYN-08, SYN-09 | No. Staff. |
| P-02 | No worksafebc.com page was opened. All 26 VERIFIED rows rest on WebSearch snippets, and page dates are uncertain (05 §0 date caveat). | 05 §0, §10 | No. Allow `www.worksafebc.com` and `worksafebc.com` in network settings, or a person checks each OK_TO_PUBLISH line. Re-running WebSearch would only return snippets again. |
| P-03 | The visit allocation number (C-11) | WSBC-18 / -19 | No. Staff check the signed agreement schedule. |
| P-04 | Synergy's pending-claim payment policy (charge and refund, or wait for the decision) | WSBC-28, -30, -31; SYN-10; 05 §5 "Staff decision needed" | No. Staff. |
| P-05 | Service-level WorkSafeBC status: RMT (massage agreement #81664), acupuncture (Nordel), KIN/PTSW support sessions, EAPP list membership per clinic. Chiropractic has had individual contracts since Jan 1, 2026, and Jane shows no WCB chiro type. | 05 §7; WSBC-35, -36, -39, -41, -08 | No. Staff. |
| P-06 | "No Direct Billing Physiotherapy" disciplines exist at Vancouver, Burnaby, New Westminster and Clayton Corners. What they mean for WorkSafe (for example, physios at those clinics who do not bill WCB) is UNKNOWN. | 04 §7 | No. Staff. |
| P-07 | **Claims in use but missing from the register:** "19+ locations" (a spec brand rule and a mini-card candidate); Yelp "WCB and WorkSafeBC Approved Physiotherapy"; the Yelp portfolio's "usually around 10 visits over about five weeks", "Ergonomic assessment" and "Custom orthotics" coverage, "Physiotherapists, kinesiologists and RMTs work on your file together" and "Coquitlam" (03 §3.6); 08 F15's "what to bring" list (PHN/CareCard, employer, injury date, case manager), which 08 says was "checked against 05" although 05's only list (WSBC-49) is about reporting to WorkSafeBC and is PARTIAL/STAFF_CONFIRM; 02 W14's other benefits (hospital care, supplies, prescriptions); the "Book online" mini-card (operational, KNOWN in Jane) | 03, 02, 08, spec §9.1 | Yes. Add the rows locally now as UNVERIFIED. Their truth then needs staff. |
| P-08 | **No plan to fix the conflicting live copy.** 15/6 on `/icbc-claims/`, King George and Delta; the 60-day misstatement; the blog's "gap" wording; homepage 10/5; the South Surrey Jane bio "OR1 & OR2"; the Medimap Cedar Hills profile; the Yelp "approved" wording; the WorkSafeBC list entries (SYN-18). New pages would contradict old ones on the same domain, and AI Overviews already quote wrong clinic FAQs (08 F8). | 05 §9; 08 F8 | No. WordPress access plus staff. |
| P-09 | No named reviewer for the "reviewed by a registered physiotherapist, date" line (08 F8), and no credential check | 08 F8; spec §9.8 | No. Staff. |
| P-10 | Official link targets are not live-checked. The task's provider-list URL did not surface; the sitecore variant is UNKNOWN; several URLs carry `?lang=en&direct=` parameters. | 05 §6; claims register URLs | No. Allowlist, or a manual link check. |
| P-11 | No current (post-April 2026) WorkSafeBC provider list was found, and the cached entries disagree with Synergy's NAP (SYN-18). A location page that tells users to check the official list could show them a mismatch. | 05 §6 | No. Staff contact WorkSafeBC (Physiotherapy@worksafebc.com per one summary, LIKELY). |

---

## 5. Places where confidence was raised without new evidence

| Item | Original label | Later label | Where |
|---|---|---|---|
| The Jane deep link opens the WCB initial type directly | LIKELY (04 §7) | KNOWN (spec E12) | C-24 |
| Snippet-quoted WorkSafeBC rules | KNOWN = snippet, page unopened (05 §0) | Treated as publishable "VERIFIED" fact (spec §9, §13) | C-26 |
| "What to bring" checklist | No register row | "checked against 05" (08 F15) | P-07 |
| Eligibility of all 19 clinics | KNOWN only that the WCB type is bookable (04) | "Delta stays eligible" / "no clinic should be excluded" (04 §1.2, §7) | C-01 |
| Site phones and postal codes | LIKELY (WebSearch summaries, 04 §3) | Used as primary values in `locations-master.csv` over the client-supplied Yelp sheet | C-04 |

---

## 6. What can be closed now with a tool (no staff needed)

| # | Action | Tool | Cost / caveat | Closes |
|---|---|---|---|---|
| T1 | Merge `yelp-nap.csv` into `locations-master.csv`, adding a conflict flag per field; add the GBP website for Central City and Delta from 08; add nearest-clinic distances from `02-icbc-location-pages.csv` | Local files (Bash/Python) | Free | C-04 to C-07 (flags only), C-21, A-06 (distances only) |
| T2 | Merge `serp-snapshot.csv` positions into `keyword-master.csv` (Current Rank and Competitor Rank) and `rank-baseline.csv` | Local | Free | C-20, B-02 (rank part) |
| T3 | Relabel the 34-pair engine in `historical-rankings.csv` as Surrey; fix the Surrey count (12) in 06 and 08; update PROJECT-STATE.md units | Local | Free | C-09, C-22, C-28 |
| T4 | Add the missing claims as UNVERIFIED rows; switch the spec gate to `publish_rule` | Local | Free | C-17, C-25, P-07 (registration only) |
| T5 | Per-clinic WCB initial treatment ids, more weeks of capacity, practitioner names (for a consent list only) | `git show origin/data:availability.json` (local, read-only) | Free | C-24 (ids), A-04 (names), A-08 |
| T6 | Volumes for the 7 `workplace injury physiotherapy <city>` terms plus about 12 terms with conflicting or reversed word order | `mcp__SERanking__DATA_getKeywordsMetrics` (source ca) | About 19 units at ~1 per keyword (06 §2). 1,320 left; billing lags; expires 2026-11-06. | B-08, C-23 |
| T7 | Collect the missing Burnaby SERP | `mcp__SERanking__DATA_getSerpTaskAdvancedResults` (task 264767002) | Cost uncertain (08 §0 saw delayed charges of ~100 per advanced task) | A-10 (part) |
| T8 | Titles and indexing of `/tag/worksafebc/` and `/physiotherapy-in-new-west/`; Salius Delta address; currency of the WorkSafeBC provider lists | WebSearch with `allowed_domains` (synergyrehabilitation.ca, saliusphysiotherapy.com, worksafebc.com) | Free; results are LIKELY grade (summaries, US engine) | B-09, C-19 (part), C-03 (part) |
| T9 | Search for a signed agreement, vendor numbers, clinic fact sheets or staff language lists | `mcp__Google_Drive__search_files` (read-only) | Free; low odds (03 found none) | A-01, A-03 (unlikely) |

These **cannot** be closed with any tool in this environment: live worksafebc.com text (ENOTFOUND), live Synergy page text and schema (proxy 403), GSC page-level data and GA4 (no connector; Supermetrics `LICENSE_NOT_FOUND`), GBP data for 16 clinics (not connected), WordPress templates (not connected), Ahrefs (Insufficient plan) and Semrush (`no_api_units`).

---

## 7. Staff confirmations needed (grouped by who answers)

**Ops / billing**
1. For each clinic and legal entity: is the April 1, 2026 Physiotherapy Services Agreement signed, and what is the vendor/payee number? Name any clinic that is not contracted (SYN-01; Cedar Hills and Clayton Corners first).
2. EAPP: which clinics are on the current EAPP list?
3. RMT (massage agreement #81664), acupuncture (Nordel) and KIN/PTSW support sessions: which clinics bill them to WorkSafeBC? How does a worker book the first WCB massage visit, given that Jane offers only a "subsequent" type?
4. Pending-claim policy: charge and refund, or wait for the decision?
5. What do the "No Direct Billing Physiotherapy" disciplines mean at Vancouver, Burnaby, New Westminster and Clayton Corners?
6. Which Jane WCB initial type should each clinic's CTA open (442, or the 40-minute and other variants)?
7. Is "Salius Rehab Inc." related to the Delta address or entity? Why does an older EAPP list carry King George's phone on Delta's row?
8. Ask WorkSafeBC to correct its list entries (Vancouver phone, New West unit 202, Central City name and phone, Newton and Sullivan labels).

**Clinic managers (each of the 19)**
9. Canonical display name and neighbourhood label; street, unit and postal code; main phone; hours (resolve the GBP vs Yelp differences).
10. Getting here: transit, parking, entrance and floor, accessibility. Languages spoken. Check-in steps. Industrial areas or employers nearby.
11. Which physiotherapists treat WCB claims, their consent to a profile card, and their registration numbers.
12. Photo consent, and whether new photos are needed (Delta, Cedar Hills, Richmond, Strawberry Hill).

**Marketing / owner**
13. Approve adding WorkSafe keywords, with target URLs, to SE Ranking project 12903890 **before 2026-11-06**, and decide on renewal (07 §7).
14. Export all 19 profiles from GBP Manager (name, categories, hours, website, CID).
15. Grant read access to GSC (and GA4), and connect WordPress, or allow synergyrehabilitation.ca and worksafebc.com in network settings.
16. Are `/physiotherapy-in-new-west/`, `/icbc-physiotherapy-abbotsford/` and the `/icbc-physiotherapy-in-*/` pages Google Ads landing pages?
17. Architecture decisions: B-01 (location URL pattern), B-03 (pillar vs guide), B-04 (dispositions), B-05 (Surrey city queries), B-06 (GBP targets), A-02 and A-09 (selection rubric and close pairs), B-14 (ICBC to WorkSafe pointers).
18. Brand: is "19+ locations" acceptable when there are 19 rehab clinics? Should the Yelp "Approved" and "Coquitlam" copy be withdrawn?

**Clinical reviewer**
19. A registered physiotherapist signs off each WorkSafe claim and gives the date for the "as of" and reviewer line.

---

## 8. Noted but not blocking for (a), (b) or (c)

- Origin-level INP fails: about 19 to 20% of experiences are poor (01 §3 row 20), and GSC reports INP above 500 ms on 45 URLs (03 §1.4). The checklist requires INP under 200 ms, but WorkSafe pages inherit the theme's 3.8 MB of JavaScript (01, 02). This is a publish gate for the cluster checklist rather than for page selection.
- The visible domain synergyrehab.ca (spec §13) redirect is UNKNOWN (03 §2).
- The probable Clayton Corners booking link that opens South Surrey's page on the ICBC hub (02 §2.5, LIKELY) is an existing defect; spec §14.7 already asks for slug QA.
- The `egm/` folder is empty, so the Goldfish review of the spec has not been run.

---

## 9. Files read (all KNOWN as of 2026-11-02)

- `research/01-site-inventory.md`, `research/02-icbc-worksafe-content.md`, `research/02-icbc-location-pages.csv`, `research/03-drive-reports.md`, `research/04-local-gbp.md`, `research/05-worksafebc-policy.md`, `research/06-keyword-research.md` (+ `06-keyword-source/ser_b2_note.txt`), `research/07-rank-baseline.md` (+ `07-rank-source/targets_12940679.tsv`, `ser_kwstats_12903890_30d.json` structure only), `research/08-competitor-intel.md` (+ `08-competitor-source/pending_tasks.json`, `domain_keywords_worksafe_ca.tsv`, `serp_264779098.json`), `research/icbc-source/README.md`, `research/icbc-source/drive-yelp-portfolio/worksafe/CAPTIONS.txt`.
- `data/claims-register.csv`, `data/locations-master.csv`, `data/yelp-nap.csv`, `data/keyword-master.csv`, `data/rank-baseline.csv`, `data/serp-snapshot.csv`, `data/site-urls.csv`, `data/gbp-maps-keyword-positions.csv`, `data/historical-rankings.csv` (the daily CSV, photo CSV and raw SERP JSONs were checked for structure or by targeted grep, not row by row).
- `spec/design-system.md`, `spec/modern-seo-cluster.md`, `PROJECT-STATE.md`.
- Computations (local Python, scratchpad `critic/nap.py` and inline scripts): NAP field comparison of `locations-master.csv` vs `yelp-nap.csv`; Surrey count; keyword-master vs rank-baseline volume diff; serp-snapshot Synergy rows; keywords missing from the master; nearest-clinic distances parsed from the ICBC nearby-clinic component; claims-register status vs publish_rule cross-tab.

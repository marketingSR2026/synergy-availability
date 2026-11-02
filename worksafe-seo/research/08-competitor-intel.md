# 08 - Competitor intelligence: WorkSafeBC / WCB physiotherapy local search

Specialist: Competitor Intelligence Analyst. Run date: 2026-11-02. Scope: WorkSafeBC / WCB / work-injury intent only (PROJECT-STATE.md scope rule). ICBC appears only where a competitor, or Synergy, mixes the two programs.

Deliverables:
- This file.
- `worksafe-seo/data/serp-snapshot.csv`: 653 rows (keyword, location, rank, url, domain, serp_feature, date, source). It holds organic top 10, local pack, AI Overview sources, People Also Ask, related searches, and 1 "not_collected" row for the single SERP task that never finished.
- `worksafe-seo/research/08-competitor-source/`:
  - Raw SE Ranking SERP JSON: `serp_<task_id>.json`, 25 files.
  - `backlinks_summary_16.json` and `domain_keywords_worksafe_ca.tsv`.
  - `serp-summary.json` (parsed) and `pending_tasks.json`.
  - The scripts that built the CSV: `parse_serps.py` and `ingest.py`.
  - Eight files hold a verbatim subset transcribed from inline tool output, marked with a `_note` field: 264766999, 264767335, 264767638, 264767776, 264768133, 264768136, 264768220, 264779098. Each keeps the top 10, pack, AIO, PAA and selected deeper rows.

Evidence labels: **KNOWN** = a tool returned it (SE Ranking SERP/backlink/keyword data, or a WebSearch result quoting the page). **LIKELY** = strong indirect evidence (for example a WebSearch summary in the tool's own words, or a pattern across several data points). **UNKNOWN** = no tool could supply it. **ASSUMPTION** = my reasoning, to be tested.

Caveat on WebSearch evidence: direct fetch of competitor sites is blocked, so page content comes from WebSearch summaries of each site (the tool's paraphrase plus short quotes). Headings, word counts, schema and full FAQ lists are **not** verified. Nothing here copies competitor wording beyond short evidence quotes, and the recommendations are written fresh.

---

## 0. Tool status, coverage and unit budget

| Tool / endpoint | Status | What it gave | Label |
|---|---|---|---|
| SE Ranking `DATA_getSerpLocations` (CA) | Used, free | Location ids: Surrey 3518, Vancouver 3536, Burnaby 3245, Richmond 3473, Langley 3371, Abbotsford 3209, New Westminster 3413, Delta 3302 | KNOWN |
| SE Ranking `DATA_getSerpResults` (advanced, google.ca, desktop, en) → `DATA_getSerpTaskAdvancedResults` | Used | 26 tasks (24 city + 2 head terms) plus 2 retries. **25 of 26 SERPs collected**; `workplace injury physiotherapy burnaby` (task 264767002) was still "processing" at report time | KNOWN |
| SE Ranking `DATA_getSerpTasks` | Used | Task list and status | KNOWN |
| SE Ranking `DATA_getBacklinksSummary` (mode domain, 16 targets, one batch) | Used | Backlinks, referring domains, Domain InLink Rank, edu/gov refdomains, top pages, top anchors | KNOWN |
| SE Ranking `DATA_getDomainKeywords` (source ca, WorkSafe/WCB/work-injury keyword filter) | Used, 9 domains | Which competitor URLs rank for WorkSafe terms in SE Ranking's Canada database | KNOWN (database snapshot, not live) |
| Ahrefs `serp-overview`, `site-explorer-domain-rating`, `public-domain-rating-free` | **Not Available** | Each returned HTTP 400 "Insufficient plan" (error -32001). Not retried. So no Ahrefs DR, organic keywords, top pages or SERP overview | KNOWN |
| Semrush `competitors_research` | **Not Available** | `no_api_units` (trace_id af625456a55f9e205d67c9739f77574e). More API units are needed: https://www.semrush.com/mcp-access | KNOWN |
| WebSearch (standard, mostly with `allowed_domains` per competitor) | Used, about 30 queries | Summaries of competitor page content, offers, FAQs and booking | LIKELY (summary) / KNOWN where quoted |
| Direct fetch (curl/WebFetch) | Not attempted | Blocked per environment notes | n/a |

**SE Ranking units (budget 1,500): LIKELY OVERSPENT. This needs the project owner's attention.**

- **Balance history:** 6,200 at my first `DATA_getSubscription`, 2,350 mid-run, **1,320 at the end**. That is a drop of **4,880 units**.
- **Why my own checks failed:** immediate before/after checks on single calls showed 0 to −20. But SE Ranking appears to bill **with a delay**, so those checks were not reliable.
- **The pattern fits my own calls (LIKELY):**
  - The −1,600 drop arrived after my one 16-target `DATA_getBacklinksSummary` batch. That is about 100 units per target.
  - The early −210 matched 2 advanced SERP tasks, about 100 each.
  - The −1,880 drop came as roughly 12-20 of my advanced tasks completed.
  - Rough fit: 28 advanced SERP tasks × ~100 + 16 backlink targets × ~100 + 9 domain-keyword calls ≈ 4,900.
- **Conclusion:** most or all of the 4,880-unit drop was LIKELY caused by this agent, **about 3× the 1,500-unit budget**. Exact attribution is UNKNOWN because other agents share the account, but I cannot claim I stayed within budget.
- **What I did when I saw it:** I stopped all SE Ranking calls. The account has **1,320 units left** and the subscription ends 2026-11-06.
- **Lesson for later runs:** advanced SERP retrieval and backlinks summaries cost far more than the tool descriptions suggest. Use standard SERP results, fewer targets, and check the balance a few minutes after each call.

**SERP coverage (KNOWN):**

| Market | `worksafebc physiotherapy <city>` | `wcb physio <city>` | `workplace injury physiotherapy <city>` |
|---|---|---|---|
| Surrey | 264762175 | 264764602 | 264764605 |
| Vancouver | 264766645 | 264766648 | 264766651 |
| Burnaby | 264766996 | 264766999 | **not collected** (264767002) |
| Richmond | 264767332 | 264767335 | 264767338 |
| Langley | 264767635 | 264767638 | 264767641 |
| Abbotsford | 264767773 | 264767776 | 264767779 |
| New Westminster | 264768130 | 264768133 | 264768136 |
| Delta | 264779098 (retry; original 264768217 did not finish) | 264768220 | 264768223 |
| Head terms, Vancouver location | `worksafebc physiotherapy` 264768352; `wcb physiotherapy near me` 264768355 | | |

---

## 1. Bottom line

1. **Synergy is visible in 10 of 25 SERPs, but often with the wrong page (KNOWN).**
   - **Organic top 10 in 9 SERPs; local pack in 3** (Surrey Central City #2; Delta #2 and #3). Named in 3 AI Overviews and cited as a source in 3.
   - **New Westminster is the strongest market:** organic #3/#4 for `worksafebc`, #3 for `wcb physio`, #6 for `workplace injury`. Synergy is named in 2 AIOs at 4.9 stars from 544 reviews.
   - **Delta** is strong in the pack.
   - **Richmond:** Synergy ranks for WorkSafe queries with its **ICBC Richmond page** and a **`/tag/worksafebc/` archive** (`worksafebc physiotherapy richmond` #7 and #10; `wcb physio richmond` #6 and #7).
   - **Abbotsford:** the best Synergy URL is the **ICBC Abbotsford page** ("25 Visits, No Referral"), at #11 for `wcb physio abbotsford`.
   - **No top-10 result** in all 5 Vancouver-location SERPs, all 3 Abbotsford SERPs, Surrey `wcb physio` and `workplace injury`, Burnaby `wcb physio`, or Langley `wcb physio` and `workplace injury`.
   - Synergy has a clinic in each of these markets (13 in Surrey; `data/locations-master.csv`).
2. **The usual winning format is a WorkSafe-specific page with the city in the URL or title (KNOWN).**
   - Surrey: Prana `/wcb-claims/`, All Care `/surrey/wcb-physio-in-surrey/`, Panda `/worksafe-physio-surrey`, Revitalize `/surrey/worksafebc-physiotherapy/`, Seva, Khalsa, Jeeva, Pure Life.
   - Burnaby: Total Therapy `/services/worksafebc-metrotown-burnaby` (#1).
   - Abbotsford: Legend `/worksafebc-physiotherapy-abbotsford/`, Townline Physio `/worksafebc-physiotherapy`.
   - Richmond: Launch Rehab `/richmond/worksafebc-physiotherapy/`.

   Every location page Synergy builds will be judged against pages like these, so each needs real local facts (ASSUMPTION).
3. **Several markets have weak dedicated content (KNOWN SERP composition; "weak" is LIKELY).**
   - Vancouver `worksafebc physiotherapy vancouver`: worksafebc.com takes 7 of 10 positions.
   - Burnaby, Langley and Delta `wcb physio …`: the top 10 is mostly directories (Medimap, Yelp, Facebook "fb-answers" pages, MapQuest).
   - Richmond: results from Richmond Hill, Ontario and Canmore, Alberta leak into the top 10.
   - Abbotsford and Richmond: the **WorkSafeBC office** appears in the local pack.
   - **The WorkSafeBC provider-list pages rank #1 for `wcb physio surrey`, `wcb physio abbotsford` and `wcb physio new westminster`**, so being listed there correctly matters.
4. **Competitors publish out-of-date visit counts and referral rules, and AI Overviews repeat them (KNOWN that they publish them; outdated is LIKELY against `05-worksafebc-policy.md`).**
   - Visit counts: 15 visits/6 weeks (Total Therapy), 15 sessions (Reform, NewLeaf), 16 sessions/6 weeks (Allied, Dynamic Balance), "minimum of 6 weeks" (wcbnewwestminster.ca), "twice a week until full-time work" (Sullivan, Regain), and "25 physio sessions" beside WorkSafeBC (Beyond; that is an ICBC figure).
   - Referral rule: Reform and NewLeaf say a physician referral is needed after 60 days. The head-term AI Overview repeats it and cites Reform, Opal, Regain and Shelbourne. Policy file 05 says the rule after 60 days is **pre-approval**, not referral.
   - Only Coast Therapy (10 sessions/5 weeks) and Launch Rehab (extensions, kinesiology support sessions) look current.

   **The most accurate, dated and sourced page is an open position (ASSUMPTION).**
5. **Launch Rehab has the most complete content system in these SERPs (KNOWN structure, LIKELY quality).** It runs a `/worksafebc-physiotherapy/` hub with spokes (first visit, what's covered, extensions, vs ICBC) and a WorkSafe page per clinic (Coquitlam, New Westminster, Lougheed, Richmond). Its Coquitlam page is #1 for `worksafebc physiotherapy new westminster`, and its Richmond page is #3 for `wcb physio richmond`. Synergy's version must leave out the ICBC comparison (scope rule).
6. **Link authority is not Synergy's gap (KNOWN numbers, LIKELY interpretation).** SE Ranking gives Synergy 293 referring domains and a Domain InLink Rank of 44. That is the most referring domains of any clinic measured and level with the highest DIR. Clinics with weak link profiles hold top spots: All Care (DIR 13) is #2 in Surrey and Complete Physio (DIR 12) is #1 in Vancouver. No competitor's WorkSafe page is among its most-linked pages.
7. **Patterns not to copy (KNOWN that they exist; risk LIKELY):**
   - **Prana's exact-match microsites:** wcbsurrey.ca, wcbnewwestminster.ca, wcbcloverdale.ca and icbcnewwestminster.ca. All four show Prana's name, address or phone in SERP snippets.
   - **A Google listing named "WCB-WestMinster"** at Prana's New West address (420 Columbia St, 4th Floor), shown in a local pack and as an AIO source.
   - **Panda's templated city pages.** Its New Westminster page shows a Burnaby address (4885 Kingsway).
   - **Allied's same article republished** on at least 4 clinic domains.
   - **Neighbourhood-area pages:** Revive Rehab, Prosper, Realign.
   - **Telegram link-spam anchors** pointing at some competitors.
8. **No tool reported structured data for any competitor (Not Available).**

---

## 2. SERP landscape by market (summary)

Full top-10 tables per SERP are in Appendix A. "Pack" = Google local pack (3 listings) as returned by SE Ranking advanced results.

| Market | SERP (task) | Top organic results, clinic domains unless noted (rank) | Local pack | AI Overview | Synergy |
|---|---|---|---|---|---|
| Surrey | worksafebc physiotherapy surrey (264762175) | Prana 1, All Care 2 & 8, Panda 3, Allied/Cloverdale 4, worksafebc.com 5, Revitalize 6, Allied/Fleetwood 7, Allied/Richmond 9 | Surrey Chiro Physio; **Synergy Central City #2**; Lifemark Surrey City Centre | none | organic #10 (/worksafebc-physiotherapy-what-is-covered/), pack #2 |
| Surrey | wcb physio surrey (264764602) | worksafebc.com provider list 1, All Care 2, Pure Life 3, Dynamic Balance 4, Jeeva 5, Panda 6, Allied/Surrey 7, **wcbsurrey.ca 8**, Restore 9, Compassion Centre 10 | none | yes; cites worksafebc.com, Jeeva, Pure Life, wcbsurrey.ca, surreyphysio; names Arka 5.0 (94), Allied Hwy 10 4.8 (349), Allied Fleetwood 4.8 (500), Pure Life 4.8 (658), Jeeva 4.8 (76) | absent |
| Surrey | workplace injury physiotherapy surrey (264764605) | Allied/Surrey 1, Beyond 2 & 9, Seva 3, Prana 4, Prosper 5, Khalsa 6, Apex 7, Allied/Fleetwood 8, All Care 10 | Prana Surrey; Surrey Chiro Physio; painPRO | yes; cites surreyphysio, Beyond, Prana, Seva; names Synergy Central City first | absent |
| Vancouver | worksafebc physiotherapy vancouver (264766645) | Complete Physio 1, Allied/North Van 2, Coast 4; worksafebc.com 3, 5-10 | Van Sports; West 4th; Lifemark Keefer | none | absent |
| Vancouver | wcb physio vancouver (264766648) | Allied/Richmond 1, Therapex (Delta) 2, Main Street 3, Panda (Surrey page) 4, Complete 5, Scona 6, Opal 7, All Care 8, Panda (Burnaby page) 9, Physio District 10 | West End; City Sports (link goes to Jane booking); Westside Hand | yes; cites Opal | absent; Revitalize runs a bottom ad |
| Vancouver | workplace injury physiotherapy vancouver (264766651) | West 4th 1, Level 10 2, Coast 3, Physiolab 4, MSK 5, Mountainview Movement 6, Reform 7, West End 8, Opal 9, Movement Room 10 | Kinematics; City Sports; West End | yes, no sources | absent |
| BC head term | worksafebc physiotherapy, Vancouver location (264768352) | Opal 1, Dynamic Balance 4, Regain 7, Reform 8, Shelbourne (Victoria) 9; worksafebc.com 2, 3, 5, 6, 10 | none | yes; cites worksafebc.com, Shelbourne, Opal, Regain, Reform | absent |
| BC head term | wcb physiotherapy near me, Vancouver location (264768355) | Burrard 1, All Care (Surrey) 2 & 10, Dynamic Balance 3, Pure Life 4, **wcbsurrey.ca 5**, Allied/Fleetwood 6, Brentwood 7, Willow 8, MSS (Edmonton) 9 | West End; Coal Harbour; Sitka | none | absent |
| Burnaby | worksafebc physiotherapy burnaby (264766996) | Total Therapy 1, medimap 3, Launch 4 & 10, Coast 5, Opal 6, Beyond 9; worksafebc.com 2, 8 | none (WorkSafeBC knowledge panel at the side) | yes; names Total Therapy 4.8 (590), Reform 5.0 (156), Launch 4.9 (556); cites Synergy | organic #7 |
| Burnaby | wcb physio burnaby (264766999) | Burnaby Physio Care 1, medimap 2, 7 & 10, EastWest 3, CareCompare 4, Instagram 5, Allied/Surrey 6, Facebook group (Prince George) 8, **wcbcloverdale.ca 9** | Expert Physio; BLVD Wellness; Total Therapy Brentwood (GBP link with utm) | none | absent |
| Richmond | worksafebc physiotherapy richmond (264767332) | Allied/Richmond (ICBC page) 1, Revitalize (Surrey) 2, Surrey Chiro Physio 3, Lifemark/pt Health 4, Lee Physio 5, Allied/Fleetwood 6, One Wellness (Canmore AB) 8, Facebook fb-answers 9 | Richmond Central Physio; **WorkSafeBC office**; pt Health Richmond | none | organic #7 (/tag/worksafebc/) and #10 (/icbc-treatments/richmond/) |
| Richmond | wcb physio richmond (264767335) | Allied/Richmond (ICBC pages) 1 & 4, Lifemark/pt Health 2, Launch Rehab Richmond WorkSafe page 3, medimap 5 & 10, Allied/Cloverdale 8, Facebook post 9 | Richmond Central Physio; West Coast Sports Physio; pt Health Richmond | none | organic #6 (/icbc-treatments/richmond/) and #7 (/richmond-physiotherapy-2/) |
| Richmond | workplace injury physiotherapy richmond (264767338) | Allied/Richmond 1 & 2, Lifemark/pt Health 3 & 7, medimap 4 & 5, Ontario pages 6, 8, 9, Coast 10 | Allied Richmond Blundell; Myodetox; pt Health Richmond | yes; names Allied Blundell 4.9 (572), Richmond Physiotherapist 5.0 (272), Lifemark Oval 4.8 (475) and others | absent |
| Langley | worksafebc physiotherapy langley (264767635) | Realign 1 & 6, Beyond 3 & 7, Physio District 4, ProCare 5; worksafebc.com 2, 8 | none | none | organic #9 and #10 (same URL, the coverage guide) |
| Langley | wcb physio langley (264767638) | Mostly directories: medimap 1, 5, 8; Facebook (pt Health Glover) 2; Revive Rehab 3; ARZ (ICBC page) 4; bcphysio.org 6; bcmedicalaccess 7; Willow Wellness 9 | Beyond Langley; Langley Physio & Massage; Willow Wellness | none | absent |
| Langley | workplace injury physiotherapy langley (264767641) | HealthX (occupational rehab) 1, Stasis Rehab (WorkSafeBC vs ICBC blog, Oct 25 2026) 2, Beyond 3 & 4, Realign 5, NewLeaf 6, Eclipse 7, Plus Physio 8, Opal 9, Reflex 10 | Beyond; Olive; Langley Physio & Massage | yes; names Beyond 4.9 (295), Olive 5.0 (288), Eclipse, ProCare, HealthX | absent |
| Abbotsford | worksafebc physiotherapy abbotsford (264767773) | Beyond 1, 3, 4, 6; NewLeaf 2; worksafebc.com 5, 7; Coast 8; Abbotsford Physio 9; Allied 10 | **WorkSafeBC office**; Abbotsford Sports & Ortho; Abbotsford Physio and Massage | none | absent |
| Abbotsford | wcb physio abbotsford (264767776) | worksafebc.com provider list 1 & 5, Abbotsford Physio 2, Revive Rehab 3, **Legend WorkSafe page 4**, **Townline Physio WorkSafe page 6**, Beyond 7, NewLeaf 8 & 10, Back in Motion 9 | West Coast Physio; Abbotsford Sports & Ortho; Abbotsford Physio and Massage | yes, no sources; names Abbotsford Physio and Massage, Revive, Legend | #11 with **/icbc-physiotherapy-abbotsford/** (outside top 10) |
| Abbotsford | workplace injury physiotherapy abbotsford (264767779) | Beyond 1 & 5, Revive Rehab 2 & 9 (neighbourhood page), Legend 3 & 4, Montrose 6, Reform 7, NewLeaf 8, Allied/White Rock 10 | Abbotsford Sports & Ortho; Get Well; Prestige | none | absent |
| New Westminster | worksafebc physiotherapy new westminster (264768130) | Launch (Coquitlam page) 1 & 6, Allied/North Van 2, New West Wellness 7 & 10, Coast 8, NWSM 9 | Launch Rehab; New West Physio; **"WCB-WestMinster"** | none | organic #3 (/physiotherapy-in-new-west/) and #4 |
| New Westminster | wcb physio new westminster (264768133) | worksafebc.com provider list 1, Prana 2, Lifemark/pt Health 4, NWSM 5, Panda 6, New West Physio 7, Cambie 8, Mountainview 9, Columbia Integrated 10 | none | yes; names NWSM 4.4 (31), Motion/pt Health 4.8 (234), Prana 4.8 (177), **Synergy 4.9 (544)**, Cambie 4.8 (187); sources include "WCB-WestMinster" | organic #3 |
| New Westminster | workplace injury physiotherapy new westminster (264768136) | Prana 1, New West Physio (team page) 2, Cambie 3, Mountainview 4, Retrieve 5, Royal City 7, Facebook post for Prana 8, pt Health 9, Pain Free 10 | Launch Rehab; Assured Health; Royal City Health | yes; lists **Synergy 4.9 (544) first** | organic #6 |
| Delta | worksafebc physiotherapy delta (264779098) | Salius 1 & 8, Facebook fb-answers 2 & 6, EastWest (WorkSafeBC employees only) 3, medimap 4 & 9, South Delta Physio (Jane) 5, Yelp 7 & 10 (Yelp Synergy Delta listing at #10) | Delta Rise; Sunstone; South Delta Physio | none | Synergy domain absent; its Yelp listing is #10 |
| Delta | wcb physio delta (264768220) | Mostly directories: medimap 1, 2, 5; South Delta Physio (Jane) 3; Yelp 4; **wcbcloverdale.ca 6**; Complete Concussions 7; Fresha 8 | Delta Rise; All Care; **Synergy Delta #3** (links to /physiotherapy-delta-chiropractor/) | none | pack #3 |
| Delta | workplace injury physiotherapy delta (264768223) | Forte 1, Nordel Surrey Physio 3, Nordel Physio 4 & 6, medimap 5, Reform 7, NewLeaf 8, Delta Physio 9, Delta Rise 10 | Delta Rise; **Synergy Delta #2**; Sunstone | none | organic #2 (/physiotherapy-delta-chiropractor/), pack #2 |

### 2.1 Cross-market frequency (25 SERPs; organic top 10 + local pack + AI Overview sources)

Networks are grouped:
- **Allied** = alliedphysio.ca, richmondphysio.ca, surreyphysio.ca, fleetwoodsurreyphysio.ca, northvancouverphysio.ca, cloverdalephysio.ca, physiowhiterock.ca, panoramaphysio.ca.
- **Prana** = pranaphysiotherapy.ca, wcbsurrey.ca, wcbnewwestminster.ca, wcbcloverdale.ca. They are grouped because SERP snippets show Prana's name, address or phone on each (F12).

Source: `08-competitor-source/serp-summary.json`.

| Rank | Domain / network | SERPs present (of 25) | Organic top 10 | Local pack | AIO source |
|---|---|---|---|---|---|
| 1 | Allied Physio network | 13 | 13 | 1 | 3 |
| 2 | worksafebc.com (official, not a competitor) | 11 | 10 | 2 | 2 |
| 3 | **synergyrehabilitation.ca** | 10 | 9 | 3 | 3 |
| 4 | Prana (+ EMD microsites) | 9 | 8 | 2 | 4 |
| 5 | medimap.ca (directory) | 8 | 8 | 0 | 1 |
| 6 | beyondphysiotherapy.ca | 8 | 7 | 2 | 2 |
| 7 | Lifemark / pt Health (national) | 7 | 5 | 5 | 3 |
| 8 | coasttherapy.ca | 6 | 6 | 0 | 1 |
| 9 | allcarephysio.ca | 6 | 5 | 1 | 0 |
| 10 | facebook.com (posts and "fb-answers" pages; not a competitor) | 6 | 6 | 0 | 0 |
| 11 | opalphysio.ca | 5 | 5 | 0 | 2 |
| 12 | newleafwellnesscentre.com | 5 | 5 | 0 | 1 |
| 13 | reformpt.ca | 4 | 4 | 0 | 1 |
| 14 | pandaclinic.ca | 4 | 4 | 0 | 0 |
| 15 | launchrehab.ca | 4 | 3 | 2 | 1 |
| 16 | reviverehab.ca, dynamicbalancephysio.ca, newwestpt.ca, westendphysio.com, deltarisephysio.ca, surreychirophysio.ca, abbyphysio.com | 3 each | | | |

### 2.2 SERP features (KNOWN, `summary.SERP_features` across 25 SERPs)

| Feature | SERPs | Note |
|---|---|---|
| People Also Ask | 23 | Question list in F22 |
| Related searches | 21 | Include provider terms (fee schedule, extension report, treatment report, contract) and brand queries ("Synergy Rehab Delta", "Synergy Rehab Richmond") |
| Local pack | 20 | Absent for Surrey `wcb physio`, Burnaby `worksafebc`, Langley `worksafebc`, New West `wcb physio` and the head term |
| Reviews | 15 | Star ratings attached to local listings |
| AI Overview | 11 | 10 of the 11 name local clinics; 6 show star ratings and review counts |
| Images / video / image-in-block | 5 / 2 / 2 | |
| Bottom ads | 1 | `wcb physio vancouver`: Revitalize (wwv.revitalizephysioclinic.ca/wsbc-vancouver/) |
| Knowledge panel (gmb) | 1 | WorkSafeBC, on `worksafebc physiotherapy burnaby` |

---

## 3. Competitor profiles (top 15)

Columns no tool could fill are marked Not Available. "Backlinks" = SE Ranking `DATA_getBacklinksSummary` (mode domain, 2026-11-02): refdomains / backlinks / Domain InLink Rank (DIR, SE Ranking's 0-100 authority score; **not** Ahrefs DR, which is plan-blocked). "DB ranks" = SE Ranking `DATA_getDomainKeywords` (Canada database snapshot), rows in `08-competitor-source/domain_keywords_worksafe_ca.tsv`.

**Structured data for all 15: Not Available.** No tool in this session reports JSON-LD (Ahrefs page content: Insufficient plan; SE Ranking SERP data does not expose schema; fetch blocked). SE Ranking reported no review-star rich result on any organic clinic result in the 25 SERPs (KNOWN only in that narrow sense).

### 3.1 Allied Physiotherapy Health Group (alliedphysio.ca + 7 clinic domains)
| Attribute | Finding | Evidence | Label |
|---|---|---|---|
| Ranking URLs | richmondphysio.ca/service/work-place-injuries/ (Surrey #9, Vancouver WCB #1); richmondphysio.ca ICBC pages (Richmond WorkSafeBC #1, Richmond WCB #1 & #4); surreyphysio.ca/service/work-place-injuries/ (Surrey work injury #1); surreyphysio.ca/contact-us/ (Surrey WCB #7); fleetwoodsurreyphysio.ca/learn-more/direct-billing/ (Surrey #7, near me #6); the "Everything You Need to Know About WorkSafeBC (WSBC) Physiotherapy Treatment" article on cloverdalephysio.ca, northvancouverphysio.ca, surreyphysio.ca and alliedphysio.ca (Surrey #4, New West #2, Burnaby WCB #6, Richmond WCB #8, Abbotsford #10) | Tasks 264762175, 264764605, 264764602, 264766648, 264766999, 264767332, 264767335, 264767338, 264768130, 264767773, 264768355 | KNOWN |
| Page intent / structure | A "Work Place Injuries (WSBC)" service page on each clinic domain, plus one explainer republished across domains | Same title on several domains in SERP data | KNOWN (duplication); structure LIKELY |
| Service coverage | Manual therapy, exercise, electrotherapy (ultrasound, shockwave), ergonomic assessment, work hardening, functional capacity evaluation | WebSearch (allowed_domains Allied network) | LIKELY |
| Local relevance | A separate domain and Google listing for each clinic. The AIO names Allied Hwy 10 4.8 (349), Allied Fleetwood 4.8 (500) and Allied Richmond Blundell 4.9 (572) | Tasks 264764602, 264767338 | KNOWN |
| FAQs / claims | Says WSBC pre-approves 16 sessions in the first 6 weeks if treatment starts within 60 days | WebSearch summary of alliedphysio.ca/workplace-injuries-with-allied-physiotherapy/ | LIKELY; conflicts with 05 §4 |
| Trust signals | "No user fees or out of pocket" on approved claims; "5 star rated" | Snippets, tasks 264767338, 264764602 | KNOWN |
| Practitioner info | Staff pages exist (richmondphysio.ca/staff/…) | Backlinks top-pages list | KNOWN that they exist |
| Booking | A Jane account per clinic (fleetwoodsurreyphysio.janeapp.com) | WebSearch result URL | LIKELY |
| GBP website target | Clinic domain with `?UTM_source=GMB_listing` | Backlinks top pages (richmondphysio.ca, fleetwoodsurreyphysio.ca) | KNOWN |
| Backlinks | alliedphysio.ca 203 / 5,548 / DIR 44; richmondphysio.ca 160 / 1,041 / 34; fleetwoodsurreyphysio.ca 109 / 419 / 46 | backlinks_summary_16.json | KNOWN |
| Helpful original info | Little: generic coverage and modality lists | WebSearch | LIKELY |

### 3.2 Coast Therapy (coasttherapy.ca)
| Attribute | Finding | Evidence | Label |
|---|---|---|---|
| Ranking URLs | /physiotherapy/work-injuries/ in 6 SERPs: Vancouver #4 and #3, Burnaby #5, New West #8, Abbotsford #8, Richmond #10 | Tasks 264766645, 264766651, 264766996, 264768130, 264767773, 264767338 | KNOWN |
| Page intent / structure | One page that is not city-specific; snippet date "Oct 16, 2026"; title "WorkSafeBC Physiotherapy & Return to Work" | SERP snippet (task 264768136, deeper row) | KNOWN |
| Service coverage | Physio, kinesiology, massage, chiro, acupuncture, occupational therapy | WebSearch (allowed_domains coasttherapy.ca) | LIKELY |
| FAQs | Newer FAQ: accepted claim gets a standard block of 10 sessions over 5 weeks, and more needs claim-manager approval. WorkSafeBC decides return to work; the physio advises. No referral needed. Initial assessment within 60 days on a pending or accepted claim. An older Coquitlam page still says up to 7 weeks | WebSearch | LIKELY (current FAQ matches 05) |
| Trust signals | Says it is a "WorkSafeBC Provider Network member" | WebSearch | LIKELY |
| DB ranks | worksafebc physiotherapy #21; worksafebc physiotherapy near me #12; wsbc physiotherapy burnaby / new westminster #13 | domain_keywords_worksafe_ca.tsv | KNOWN |
| Backlinks | 214 / 1,041 / DIR 39 | backlinks_summary_16.json | KNOWN |
| Helpful original info | Clear on who decides return to work; session rules updated | WebSearch | LIKELY |

### 3.3 Prana Physiotherapy (pranaphysiotherapy.ca + wcbsurrey.ca, wcbnewwestminster.ca, wcbcloverdale.ca, icbcnewwestminster.ca)
| Attribute | Finding | Evidence | Label |
|---|---|---|---|
| Ranking URLs | /wcb-claims/ (Surrey #1, Surrey work injury #4); home page (New West work injury #1, New West WCB #2); wcbsurrey.ca (Surrey WCB #8, near me #5); wcbcloverdale.ca (Burnaby WCB #9, Delta WCB #6); a facebook.com/bestclinic.ca post promoting Prana (New West work injury #8) | Tasks 264762175, 264764605, 264764602, 264768136, 264768133, 264768355, 264766999, 264768220 | KNOWN |
| Local pack | "Prana Physiotherapy Surrey" (Surrey work-injury pack #1, phone (604) 260-0183). "WCB-WestMinster" (New West WorkSafeBC pack #3; the AIO source card gives "420 Columbia St 4th Floor", which is Prana's New West address) | Tasks 264764605, 264768130, 264768133 | KNOWN |
| Microsite link | wcbsurrey.ca snippet "103-9093 King George Blvd … (604) 260-0183" matches Prana Surrey. wcbcloverdale.ca and wcbnewwestminster.ca snippets name "Prana Physiotherapy and Rehab". icbcnewwestminster.ca names "Prana Physiotherapy and Rehabilitation center" | Tasks 264764602, 264768220, 264768133, 264768136 | KNOWN text; common owner LIKELY |
| FAQs / claims | No out-of-pocket on approved claims; treatment block "usually about 6 weeks"; wcbnewwestminster.ca says "minimum of 6 weeks"; the WCB document list includes an ICBC claim number | WebSearch (allowed_domains pranaphysiotherapy.ca); task 264768136 | LIKELY; mixes ICBC/WCB and is out of date per 05 |
| Trust signals | "Approved facility for WCB" / "Approved by WCB" | Snippets, tasks 264762175, 264768133 | KNOWN |
| AIO | Named in Surrey and New West AIOs, 4.9 (494) and 4.8 (177); cited as an AIO source in 4 SERPs | Tasks 264764605, 264768136, 264768133 | KNOWN |
| Backlinks | 111 / 301 / DIR 43; top anchors include a Telegram link-spam anchor ("TG @BHS_LINKS…", 20 refdomains) | backlinks_summary_16.json | KNOWN |

### 3.4 Opal Physiotherapy (opalphysio.ca, Langley)
| Attribute | Finding | Evidence | Label |
|---|---|---|---|
| Ranking URLs | /worksafebc-physiotherapy/: **#1 for head term `worksafebc physiotherapy`**, Vancouver WCB #7, Vancouver work injury #9, Burnaby #6; home page Langley work injury #9 | Tasks 264768352, 264766648, 264766651, 264766996, 264767641 | KNOWN |
| FAQs | Steps: report to employer and WorkSafeBC, get a claim number, book. Bring the claim number and BC Care Card. If the claim is denied, the patient may pay. On a pending claim, the first visit may be covered with prior approval | WebSearch (allowed_domains opalphysio.ca) | LIKELY |
| AIO | Cited by the head-term AIO and the Vancouver WCB AIO | Tasks 264768352, 264766648 | KNOWN |
| Backlinks | 151 / 327 / DIR 44; **15 edu and 4 gov referring domains**, the most of any clinic measured | backlinks_summary_16.json | KNOWN |
| DB ranks | worksafebc physiotherapy #26; wcb pain management program #21 | domain_keywords_worksafe_ca.tsv | KNOWN |
| Local relevance | A Langley clinic ranking in Vancouver and Burnaby SERPs, so it ranks on topic rather than location | above | LIKELY |

### 3.5 Beyond Physiotherapy (beyondphysiotherapy.ca)
| Attribute | Finding | Evidence | Label |
|---|---|---|---|
| Ranking URLs | **Abbotsford:** #1, 3, 4 and 6 (`worksafebc`); #7 (`wcb`); #1 and 5 (`workplace injury`).<br>**Surrey work injury:** #2 /health-blog/work-injury-physiotherapy-surrey (dated Mar 15, 2026) and #9.<br>**Langley:** #3 and #7 (`worksafebc`); #3 and #4 (`workplace injury`); pack #1 for Langley WCB and work injury.<br>**Burnaby:** #9 /worksafe-bc | Tasks 264767773, 264767776, 264767779, 264764605, 264767635, 264767638, 264767641, 264766996 | KNOWN |
| Page intent / structure | City location pages, dated city blog guides, active-rehab city pages, and a WorkSafe page built around the "Early Access" program | SERP titles/snippets; WebSearch | KNOWN / LIKELY |
| Offer | "Same-day or next-day WorkSafeBC appointments"; direct billing; Functional Abilities Assessment and return-to-work plan; 6 clinics. The AIO repeats "typically has same-day or next-day appointments" | SERP snippets; AIO in task 264767641; WebSearch | KNOWN |
| Accuracy | Abbotsford active-rehab snippet: "Pre-approved for 25 physio sessions plus massage, chiro & kinesiology. WorkSafeBC." 25 sessions is an ICBC figure (ASSUMPTION based on other ICBC copy) | Task 264767773 snippet | KNOWN text; mix-up LIKELY |
| Trust signals | "4.9★ Rated" title; "registered with the College of Physical Therapists of BC"; "6 award-winning clinics"; AIO 4.9 (295) for Langley | Tasks 264767773, 264767776, 264767641 | KNOWN |
| Booking | Jane, one location per clinic (beyondphysiotherapy.janeapp.com/locations/…) | WebSearch | LIKELY |
| DB ranks | /worksafe-bc: worksafebc physiotherapy #14, worksafebc physio #15, wsbc physiotherapy burnaby #10, wcb surrey #17 | domain_keywords_worksafe_ca.tsv | KNOWN |
| Backlinks | 117 / 1,119 / DIR 27 | backlinks_summary_16.json | KNOWN |

### 3.6 All Care Physio (allcarephysio.ca, Delta/Surrey)
| Attribute | Finding | Evidence | Label |
|---|---|---|---|
| Ranking URLs | /surrey/5-things-worksafe-physiotherapy-in-surrey/ (Surrey #2, work injury #10); /surrey/wcb-physio-in-surrey/ (Surrey #8, Surrey WCB #2, Vancouver WCB #8, near me #2 and #10); Delta WCB pack #2 | Tasks 264762175, 264764605, 264764602, 264766648, 264768355, 264768220 | KNOWN |
| Page intent | Listicle-style articles ("5 things claimants miss", "8 benefits", "7 ways") in a /surrey/ folder | WebSearch (allowed_domains allcarephysio.ca) | LIKELY |
| Content | Pitfalls: delaying treatment, skipping functional tracking, poor contact with the case manager, choosing the wrong clinic, skipping home exercise. Its pages disagree on whether ongoing sessions need approval | WebSearch | LIKELY |
| Trust signals | "Certified WCB physio" and two phone numbers in the snippet | Task 264762175 | KNOWN |
| Backlinks | 57 / 88 / DIR 13, the weakest measured, yet it ranks #2 twice in Surrey | backlinks_summary_16.json | KNOWN |
| DB ranks | wcb surrey #12, wcb approved physiotherapy #17, wcb physiotherapy #45 | domain_keywords_worksafe_ca.tsv | KNOWN |

### 3.7 Lifemark / pt Health (national chain)
| Attribute | Finding | Evidence | Label |
|---|---|---|---|
| Ranking URLs | Richmond clinic-information and coverage-options pages (Richmond WorkSafeBC #4, WCB #2, work injury #3); pthealth.ca workplace-injury-rehabilitation (Richmond #7); New West Royal Tenth (New West WCB #4); pt Health Motion (New West work injury #9) | Tasks 264767332, 264767335, 264767338, 264768133, 264768136 | KNOWN |
| Local pack | 5 SERPs: Surrey City Centre (GBP link with utm_source=gmb), Keefer Place, pt Health Richmond (3 Richmond packs) | Tasks 264762175, 264766645, 264767332, 264767335, 264767338 | KNOWN |
| AIO entity | Motion Physiotherapy – pt Health 4.8 (234) in both New West AIOs; Lifemark Oval 4.8 (475) in Richmond | Tasks 264768133, 264768136, 264767338 | KNOWN |
| WorkSafe detail | Thin. WorkSafeBC appears in the coverage list; no WorkSafe direct-billing statement found for Surrey City Centre | WebSearch (allowed_domains lifemark.ca) | LIKELY |
| Backlinks | Not measured (unit budget) | n/a | Not Available |

### 3.8 Reform Physiotherapy (reformpt.ca, Burnaby)
| Attribute | Finding | Evidence | Label |
|---|---|---|---|
| Ranking URLs | /physiotherapy-for-work-related-injuries/ (dated Nov 21, 2022): head term #8, Vancouver work injury #7, Delta work injury #7, Abbotsford work injury #7 | Tasks 264768352, 264766651, 264768223, 264767779 | KNOWN |
| FAQs | "15 sessions of physiotherapy free" within 60 days; "after 60 days, a doctor's referral is necessary"; first appointment covered while pending; work-hardening style programs | WebSearch (allowed_domains reformpt.ca) | LIKELY; both conflict with 05 |
| AIO | Cited by the head-term AIO, which repeats the "referral after 60 days" claim; listed in the Burnaby AIO at 5.0 (156) | Tasks 264768352, 264766996 | KNOWN |
| Backlinks | 70 / 187 / DIR 23; spam anchor ("JOIN OUR TELEGRAM…") | backlinks_summary_16.json | KNOWN |

### 3.9 Launch Rehab (launchrehab.ca, Burnaby/Coquitlam/Richmond/New West)
| Attribute | Finding | Evidence | Label |
|---|---|---|---|
| Ranking URLs | /coquitlam/worksafebc-physiotherapy/ (New West #1); /worksafebc-physiotherapy/worksafebc-extensions/ (New West #6, Burnaby #10); /new-westminster/worksafebc-physiotherapy/ (Burnaby #4); **/richmond/worksafebc-physiotherapy/ (Richmond WCB #3)** | Tasks 264768130, 264766996, 264767335 | KNOWN |
| Structure | Hub /worksafebc-physiotherapy/ with spokes (claim-and-first-visit, what-worksafebc-covers, extensions, vs-ICBC) and a WorkSafe page for each studio | domain_keywords_worksafe_ca.tsv URLs; SERP URLs; WebSearch | KNOWN URLs |
| Offer | Direct billing at 5 studios; no referral; bring the claim number; a client-care team handles progress reports; pre-approved physio **and kinesiology support sessions**, consistent with the 2026 agreement (05 §2, item 1.7) | WebSearch (allowed_domains launchrehab.ca) | LIKELY |
| Local relevance | Snippets carry address and hours; "steps from 22nd St SkyTrain"; Richmond page: "on Williams Rd. Direct billing, free parking. Physio, RMT, chiro, kinesiology under one roof" | Tasks 264768130, 264768136, 264767335 | KNOWN |
| Local pack | New West pack #1 in 2 SERPs; GBP link carries utm_source=gmb-listing | Tasks 264768130, 264768136 | KNOWN |
| AIO entity | Burnaby AIO: Launch Rehab 4.9 (556) | Task 264766996 | KNOWN |
| DB ranks | worksafebc physiotherapy #20 (vs-ICBC page); wsbc extension report #15; wsbc initial report #20 (provider intent) | domain_keywords_worksafe_ca.tsv | KNOWN |
| Backlinks | 104 / 341 / DIR 41 | backlinks_summary_16.json | KNOWN |

### 3.10 Medimap (medimap.ca, directory)
| Attribute | Finding | Evidence | Label |
|---|---|---|---|
| Ranking URLs | /clinics/worksafebc-physiotherapy/bc/burnaby (Burnaby #3, Burnaby WCB #7); city lists and clinic profiles in 8 SERPs (Burnaby, Richmond, Langley, Delta) | Tasks 264766996, 264766999, 264767335, 264767338, 264767638, 264768220, 264768223, 264779098 | KNOWN |
| Structure | A city × service directory with wait times, reviews and booking; some clinic profiles show the wrong city's address (a Richmond clinic profile shows a Surrey address) | WebSearch; task 264767335 snippet | KNOWN snippet |
| Backlinks | 1,467 / 18,958 / DIR 74 | backlinks_summary_16.json | KNOWN |
| Relevance to Synergy | A listing (citation) channel, not a page competitor | | ASSUMPTION |

### 3.11 NewLeaf Wellness Centre (newleafwellnesscentre.com, Abbotsford)
| Attribute | Finding | Evidence | Label |
|---|---|---|---|
| Ranking URLs | /workplace-injury-physiotherapy (Abbotsford WorkSafeBC #2, Abbotsford WCB #8 and #10, Langley work injury #6, Delta work injury #8); an active-rehab article (Abbotsford work injury #8) | Tasks 264767773, 264767776, 264767641, 264768223, 264767779 | KNOWN |
| Claims | "Recognized member of the WorkSafeBC preferred provider network" (snippet); 15 sessions within 60 days; physician referral after 60 days | SERP snippet; WebSearch (allowed_domains newleafwellnesscentre.com) | KNOWN snippet; session/referral claims LIKELY and conflict with 05 |
| Booking | Asks for the claim number and injury date when booking; 30-minute physio appointments | WebSearch | LIKELY |
| Return to work | Says the physio confirms readiness for modified work and gets the patient's approval before starting a return-to-work plan | WebSearch | LIKELY |
| Backlinks | Not measured | n/a | Not Available |

### 3.12 Panda Clinic (pandaclinic.ca)
| Attribute | Finding | Evidence | Label |
|---|---|---|---|
| Ranking URLs | /worksafe-physio-surrey (Surrey #3, Surrey WCB #6, Vancouver WCB #4); /worksafe-physio-burnaby (Vancouver WCB #9); /worksafe-physio-new-westminster (New West WCB #6) | Tasks 264762175, 264764602, 264766648, 264768133 | KNOWN |
| Template | Snippets share one sentence frame ("We help people in [area] who got hurt at work and have WorkSafeBC or WCB claims…"). The New Westminster page snippet shows "Unit 412 - 4885 Kingsway", a Burnaby address | Tasks 264762175, 264766648, 264768133 | KNOWN text; doorway risk LIKELY |
| Claim-status helper | claim.pandaclinic.ca/providers/wcb: #25 for "wcb claim status" (390/mo), #15 for "worksafe bc claim status" | domain_keywords_worksafe_ca.tsv | KNOWN |
| Pricing | Lists $110 initial / $100 follow-up physio; missed appointments not covered | WebSearch (allowed_domains pandaclinic.ca) | LIKELY |
| Backlinks | 162 / 413 / DIR 26 | backlinks_summary_16.json | KNOWN |

### 3.13 Complete Physio (completephysio.ca, Kitsilano)
| Attribute | Finding | Evidence | Label |
|---|---|---|---|
| Ranking URLs | /worksafebc-physiotherapy-in-kitsilano-complete-physio/ (Vancouver WorkSafeBC #1, Vancouver WCB #5) | Tasks 264766645, 264766648 | KNOWN |
| Content | Separate long guide: how it works, how many sessions, what to do if a claim is denied or delayed. Also a referral explainer | WebSearch (allowed_domains completephysio.ca) | LIKELY |
| Accuracy | Its pages disagree on whether a referral is needed; the guide has a success-rate table ("85% improvement in mobility") with no source | WebSearch | LIKELY |
| Booking | completephysio.janeapp.com, "book online in under 60 seconds" | WebSearch quote | KNOWN (quote) |
| Backlinks | 69 / 93 / DIR 12 (weak links, yet #1) | backlinks_summary_16.json | KNOWN |

### 3.14 Total Therapy (totaltherapy.ca, Burnaby)
| Attribute | Finding | Evidence | Label |
|---|---|---|---|
| Ranking URLs | /services/worksafebc-metrotown-burnaby (Burnaby #1); Brentwood GBP in the Burnaby WCB pack (link `/locations/brentwood?utm_source=google&utm_medium=gbp&utm_campaign=brentwoodgbp`) | Tasks 264766996, 264766999 | KNOWN |
| Structure | Two clinic WorkSafe pages, a help-centre article (/help/worksafebc-wsbc-claims) and team pages (for example /team/sam-moosavi) | WebSearch (allowed_domains totaltherapy.ca) | KNOWN URLs |
| Local relevance | Address, phone, "Expo Line at Metrotown Station", free parking | WebSearch | LIKELY |
| Accuracy | One page says up to 15 visits over 6 weeks (out of date per 05); another states the 60-day pre-approval rule correctly | WebSearch | LIKELY |
| DB ranks | Help article: #6 for "worksafebc burnaby" (90/mo), #1 for "wsbc physiotherapy burnaby" | domain_keywords_worksafe_ca.tsv | KNOWN |
| AIO entity | Total Therapy 4.8 (590), listed first in the Burnaby AIO | Task 264766996 | KNOWN |
| Backlinks | 228 / 441 / DIR 40 | backlinks_summary_16.json | KNOWN |

### 3.15 Dynamic Balance Physiotherapy (dynamicbalancephysio.ca, Clayton/Cloverdale)
| Attribute | Finding | Evidence | Label |
|---|---|---|---|
| Ranking URLs | /worksafe-icbc-physiotherapy-surrey-langley/worksafe-physio-surrey/ (head term #4, Surrey WCB #4); /worksafe-icbc-physiotherapy-surrey-langley/ (near me #3) | Tasks 264768352, 264764602, 264768355 | KNOWN |
| Claims | "16 pre-approved sessions"; on a pending claim "WorkSafeBC covers the first week of visits"; return-to-work coordination with the employer and adjudicator | WebSearch (allowed_domains dynamicbalancephysio.ca) | LIKELY; conflicts with 05 |
| Backlinks | 82 / 174 / DIR 38; top anchor is a keyword list ("Neck pain,Back pain,Shoulder pain,…", 42 refdomains) | backlinks_summary_16.json | KNOWN |

**Also observed (not profiled):**

| Clinic | What stands out | Evidence | Label |
|---|---|---|---|
| West End Physio | Local pack in 3 Vancouver SERPs (pack only). Its FAQ says ICBC/WCB "may require a physician's referral"; pages 4+ years old | Tasks 264766648, 264766651, 264768355; WebSearch | KNOWN / LIKELY |
| Legend Physio, Townline Physio (Abbotsford) | Dedicated "WorkSafeBC Physiotherapy in Abbotsford" pages ranking #4 and #6 for `wcb physio abbotsford`. Legend: "Share your claim number and we'll take it from there" | Task 264767776 | KNOWN |
| Revive Rehab | Neighbourhood area page ("near Mill Lake / Sevenoaks"); "15 options • WCB & ICBC Direct Billing" | Tasks 264767779, 264767776 | KNOWN |
| Retrieve Health Centre | New West WorkSafe page ("part of the WorkSafeBC provider network") and a blog dated Oct 6, 2026 | Tasks 264768133, 264768136 | KNOWN |
| Stasis Rehab | "WorkSafeBC vs ICBC physiotherapy in Langley" blog dated Oct 25, 2026, ranking #2 for Langley work injury | Task 264767641 | KNOWN |
| Restore Rehab | "WCB treatment coverage Surrey" page dated Jul 24, 2026 (#9 Surrey WCB) | Task 264764602 | KNOWN |
| HealthX | Occupational rehab / work conditioning program page, #1 for Langley work injury | Task 264767641 | KNOWN |

**Synergy for comparison (KNOWN, same tools).**
- **Links:** 293 refdomains / 2,549 backlinks / DIR 44; edu 1, gov 0. Most-linked pages: homepage, /physiotherapy-services/, /media-room/, /physiotherapy-abbotsford-chiropractor/.
- **Database vs live rankings:** SE Ranking's Canada database lists only 4 WorkSafe terms for Synergy, all at positions 43-86. Live SERPs show 9 top-10 appearances.
- **New guide:** `/worksafebc-physiotherapy-what-is-covered/` is not yet in the database, so it is LIKELY recent.
- **Wrong-intent ranking URLs:** /icbc-treatments/richmond/, /tag/worksafebc/, /richmond-physiotherapy-2/ and /icbc-physiotherapy-abbotsford/.
- **GBP website links:** Central City's pack listing links to the homepage; Delta's links to /physiotherapy-delta-chiropractor/.
- **Possible WorkSafeBC list entry:** the WorkSafeBC Metro Vancouver provider-list snippet shows "New Westminster 202 - 301 E Columbia Street 604.553.3303". The phone matches Synergy New West's GBP phone in locations-master. The unit number (202) differs from Synergy's #405 (KNOWN snippet; that it refers to Synergy is LIKELY; currency of the list is UNKNOWN per 05).

---

## 4. Findings (5-part format)

Each finding gives: **(1)** what the competitor does; **(2)** evidence; **(3)** why it may help users or discoverability (no causal claims); **(4)** whether it applies to Synergy; **(5)** how Synergy can be more useful.

**F1. City-named WorkSafe landing pages are the standard format.**
1. Surrey has WorkSafe pages from Prana, All Care, Panda, Revitalize, Seva, Khalsa, Jeeva, Pure Life and Restore. Total Therapy has Burnaby/Metrotown pages, Launch Rehab one per studio (including Richmond), and Legend and Townline have Abbotsford pages.
2. SE Ranking tasks 264762175, 264764602, 264764605, 264766996, 264767335, 264767776 (Appendix A). KNOWN.
3. A page that answers "can I get WorkSafeBC physio here, and how" for one place matches the searcher's whole question better than a general clinic page (ASSUMPTION). Synergy's Surrey top-10 result is only the generic guide at #10, and Synergy is absent from Surrey `wcb physio` and `workplace injury`.
4. Yes, but only for clinics whose WorkSafeBC eligibility staff have verified (05 §1). Each page needs facts no other page has.
5. Build each location page around clinic-specific, checkable facts:
   - WCB initial-assessment openings in the next 7 days (Jane snapshot in `locations-master.csv`: 46-228 slots per clinic).
   - Number of WCB-bookable physios.
   - On-site kinesiology for support sessions.
   - Hours, transit, parking and accessibility.
   - Languages spoken (staff to confirm).
   - The clinic phone number that WorkSafeBC lists.

   A page where only the city name changes is not enough.

**F2. Vancouver has no strong clinic-specific WorkSafe result.**
1. For `worksafebc physiotherapy vancouver`, worksafebc.com takes 7 of 10 organic positions. For `wcb physio vancouver`, the top results include Allied Richmond (#1), Therapex Delta (#2) and Panda's Surrey page (#4).
2. Tasks 264766645, 264766648. KNOWN.
3. When provider documents and out-of-city pages fill a city SERP, useful local patient pages are LIKELY scarce (ASSUMPTION that a good one would be shown).
4. Yes. Synergy Vancouver (3609 W 16th Ave) has WCB Physio Initial bookable in Jane (locations-master, KNOWN). Staff must confirm eligibility.
5. Write a Vancouver page that answers the West Side worker's questions: transit to W 16th Ave, parking, early or late hours, the WorkSafeBC Lower Mainland claims line, and what to bring. Name only neighbourhoods the clinic actually serves.

**F3. Synergy ranks for WorkSafe intent with wrong-intent pages in Richmond and Abbotsford.**
1. This finding is about Synergy, benchmarked against Launch Rehab, which ranks a dedicated /richmond/worksafebc-physiotherapy/ page at #3.
   - `worksafebc physiotherapy richmond`: Synergy #7 is /tag/worksafebc/ and #10 is /icbc-treatments/richmond/.
   - `wcb physio richmond`: #6 is the ICBC page and #7 /richmond-physiotherapy-2/.
   - `wcb physio abbotsford`: the best Synergy URL is /icbc-physiotherapy-abbotsford/ ("25 Visits, No Referral", #11).
2. Tasks 264767332, 264767335, 264767776. KNOWN.
3. A worker who clicks an ICBC page or a tag archive lands on the wrong program. That is LIKELY confusing and breaks the WorkSafe-only scope rule.
4. Yes.
5. Give each verified clinic one WorkSafe-specific page. Make the ICBC page and the WorkSafe page clearly separate, and link from the ICBC page to the WorkSafe page only through a neutral "injured at work?" pointer if the spec allows. Decide whether `/tag/worksafebc/` should be noindexed or consolidated (the spec phase decides; ASSUMPTION).

**F4. The WorkSafeBC office and WorkSafeBC provider lists appear in local results.**
1. The WorkSafeBC office is in the Abbotsford and Richmond packs. WorkSafeBC provider-list pages are #1 for `wcb physio surrey`, `wcb physio abbotsford` and `wcb physio new westminster`, and their snippets show clinic names, addresses and phones.
2. Tasks 264767773, 264767332, 264764602, 264767776, 264768133. KNOWN.
3. Google reads part of the query as "where is WorkSafeBC / who is on its list". The official list is LIKELY a trust check users make.
4. Yes.
5. Confirm that Synergy's clinics are listed correctly on WorkSafeBC's current provider list (05: the 2026 list status is UNKNOWN; one snippet suggests New West is listed with unit 202 instead of #405). On each location page, add a short "WorkSafeBC office vs. your physio clinic" explainer: what each does, when to call the claims line, when to book. Link to the official list rather than claiming status the list doesn't show.

**F5. New Westminster is Synergy's strongest market, but the pack goes to Launch Rehab, New West Physio and "WCB-WestMinster".**
1. Launch Rehab ranks #1 with a Coquitlam page and holds pack #1. Synergy ranks #3 and #4 (`worksafebc`), #3 (`wcb`) and #6 (`workplace injury`). Two AIOs name Synergy at 4.9 (544).
2. Tasks 264768130, 264768133, 264768136. KNOWN. SE Ranking Local grid: Synergy New West averages 3.36 for "Worksafe physiotherapy" (gbp-maps-keyword-positions.csv, KNOWN). The SERP snapshot is taken from the city centroid, so it differs from the grid (LIKELY).
3. Organic and AIO visibility suggest Google already links Synergy New West to the topic (LIKELY).
4. Yes. This is the best pilot market.
5. Make New West the pilot WorkSafe location page. Point its GBP website link to that page (today it is the homepage, per 04) and tag it with UTM (see F18).

**F6. Delta rewards Synergy's general location page, but the core WorkSafeBC SERP doesn't.**
1. Synergy ranks #2 organic and #2 pack for work injury, and #3 pack for `wcb physio delta`, where its GBP links to /physiotherapy-delta-chiropractor/. For `worksafebc physiotherapy delta`, the Synergy domain is absent and only its Yelp listing ranks (#10, snippet "WCB and WorkSafeBC Approved Physiotherapy"). That SERP is led by Salius and directory pages.
2. Tasks 264768223, 264768220, 264779098. KNOWN.
3. The WorkSafeBC-term SERP in Delta has little dedicated content (LIKELY).
4. Yes.
5. Give Delta a WorkSafe-specific page or a deeper WorkSafe section on the existing page, decided in the spec to avoid cannibalization. Make the Yelp listing's WorkSafe wording match what staff have verified.

**F7. Synergy's non-local coverage guide ranks in 4 cities.**
1. This finding is about Synergy, as a benchmark. `/worksafebc-physiotherapy-what-is-covered/` ranks #7 Burnaby, #9 and #10 Langley, #10 Surrey and #4 New West, and is cited in the Burnaby AIO.
2. Tasks 264766996, 264767635, 264762175, 264768130. KNOWN.
3. A topical guide can rank across cities when locally specific pages are scarce (LIKELY). Coast Therapy (F15) and Opal (3.4) show the same pattern.
4. Yes.
5. Grow this guide into the pillar or merge it in, keeping its URL equity in mind. Add a clinic finder that lists only verified clinics.

**F8. AI Overviews draw on clinic FAQs, including wrong ones, and list clinics with ratings.**
1. AIOs appear on 11 of 25 SERPs. The head-term AIO says a physician referral is required after 60 days. It cites worksafebc.com, Shelbourne, Opal, Regain and Reform, and Reform's and NewLeaf's FAQs make the same claim. Ten AIOs name local clinics; six show star ratings and review counts. The New West WCB AIO includes "WCB-WestMinster" as a source.
2. Tasks 264768352, 264766996, 264767338, 264768133, 264768136, 264764602, 264767641; WebSearch (reformpt.ca, newleafwellnesscentre.com). The conflict is checked against 05 §3 item 2.4: after 60 days WorkSafeBC must **pre-approve** treatment (KNOWN quote in 05).
3. AI answers repeat what clinic pages say. A clear, accurate, sourced answer is the kind of text an answer engine can quote (ASSUMPTION; there is no evidence Synergy would be cited).
4. Yes.
5. Publish short, dated answers to the top questions, each linking to the official WorkSafeBC page, with a reviewer line ("reviewed by [registered physiotherapist], [date]"):
   - Do I need a referral?
   - Can I start before my claim is accepted?
   - What changes after 60 days?
   - How many visits?
   - What if my claim is denied?

   Use only claims marked OK_TO_PUBLISH in `claims-register.csv`.

**F9. Out-of-date visit counts and coverage rules are common.**
1. Competitors publish:
   - 15 visits/6 weeks (Total Therapy).
   - 15 sessions (Reform, NewLeaf).
   - 16 sessions/6 weeks (Allied, Dynamic Balance).
   - "Minimum of 6 weeks" (wcbnewwestminster.ca).
   - "25 physio sessions" beside WorkSafeBC (Beyond).
   - "Twice a week until full-time work" (Sullivan, Regain).
   - "7 weeks" (an old Coast page).
2. WebSearch summaries for each domain (section 3); SERP snippets (tasks 264768136, 264767773). LIKELY/KNOWN, checked against 05 §4 items 3.1 and 3.6.
3. Out-of-date numbers mislead injured workers about what to expect (ASSUMPTION about user harm). Accuracy is a trust signal users can check.
4. Yes, as a differentiator, but only with confirmed numbers. 05 says the 10-visit/5-week figure still needs staff confirmation against the signed agreement.
5. Add a "What changed on April 1, 2026" box with a last-reviewed date. Until the number is confirmed, describe the visit block without a number (approved wording in 05). Never mix in ICBC figures. Synergy's own ICBC Abbotsford title ("25 Visits") shows why the two programs' pages must stay separate.

**F10. Launch Rehab runs a pillar with worker-journey spokes and a page per studio.**
1. Launch Rehab has a hub with claim-and-first-visit, what-it-covers, extensions and vs-ICBC spokes, plus Coquitlam, New Westminster, Lougheed and Richmond WorkSafe pages.
2. domain_keywords_worksafe_ca.tsv; tasks 264768130 (#1) and 264767335 (#3); WebSearch. KNOWN URLs; content LIKELY.
3. Spokes answer each step's question and link to the clinic pages (ASSUMPTION about benefit).
4. Partly. Synergy's scope rule excludes the ICBC comparison, and spokes that target provider terms (initial report, extension report) bring provider traffic, not patients (06 finding 4).
5. Build worker-journey spokes Launch Rehab lacks, all from the worker's side:
   - "My claim is pending: what can I book?"
   - "It's been more than 60 days."
   - "My employer offered modified duties" (06 finding 5).
   - "My claim was denied: what are my options?" (link to WorkSafeBC review information).

**F11. Panda Clinic runs a claim-status helper and templated city pages.**
1. claim.pandaclinic.ca/providers/wcb targets "wcb claim status" (390/mo, #25). Its city pages share one sentence frame, and the New Westminster page shows a Burnaby address.
2. domain_keywords_worksafe_ca.tsv; snippets in tasks 264762175, 264766648 and 264768133. KNOWN.
3. Claim-status searchers are injured workers early in the journey, and a helper meets them there (ASSUMPTION). Templated pages with an address in another city are LIKELY to be read as doorway pages and mislead users.
4. The helper idea applies; the template pattern does not.
5. Write a plain "Find your claim number or check your claim" explainer that sends users to WorkSafeBC's official online services and phone line. Never ask for or store claim details (no patient data). Every location page must show its own real address.

**F12. Prana uses exact-match microsites and a keyword-named Google listing.**
1. Prana runs:
   - wcbsurrey.ca ("WCB-IN Surrey"; Prana Surrey's address and phone).
   - wcbcloverdale.ca (names "Prana Physiotherapy and Rehab").
   - wcbnewwestminster.ca and a listing named "WCB-WestMinster" at Prana's New West address.
   - icbcnewwestminster.ca.
   - A Facebook page (bestclinic.ca) promoting Prana.

   These rank in 6 SERPs (Surrey WCB #8, near me #5, Burnaby WCB #9, Delta WCB #6, New West pack #3, New West work injury #8).
2. Tasks 264764602, 264768355, 264766999, 264768220, 264768130, 264768133, 264768136. KNOWN data match; common ownership LIKELY.
3. Exact-match names currently win pack and organic slots for those terms (KNOWN that they appear). Google's Business Profile guidelines require the real-world business name (LIKELY guideline conflict and suspension risk).
4. No. Do not copy.
5. Keep every Synergy GBP name to the real brand plus location. Earn the pack with a well-matched landing page, accurate categories and services, and honest reviews. If the user chooses, Synergy may report guideline-violating listings through Google's own channels. Not done here; read-only.

**F13. The Allied network multiplies its domains and republishes one article.**
1. Allied runs 8 domains seen in these SERPs. One WorkSafeBC explainer appears on at least 4 domains. It is the most present network: 13 of 25 SERPs.
2. Tasks 264762175, 264766999, 264767335, 264768130, 264767773; section 2.1. KNOWN.
3. Multiple domains occupy multiple slots (KNOWN here). Duplicate articles add nothing for the user (LIKELY).
4. No. Synergy runs one domain and should keep one canonical pillar.
5. One pillar with one canonical URL. Location pages link to it, never copy it.

**F14. Beyond Physiotherapy sells speed ("same-day or next-day") and the Early Access program.**
1. Beyond advertises same-day or next-day WorkSafeBC appointments, which the Langley AIO repeats. It explains Early Access, offers a Functional Abilities Assessment and return-to-work plan, and has Jane booking at every clinic. It also mixes ICBC session counts into WorkSafe copy.
2. Snippets in tasks 264767773, 264766996, 264767641; WebSearch (beyondphysiotherapy.ca, beyondphysiotherapy.janeapp.com). KNOWN snippets; Early Access details LIKELY.
3. Speed matters to injured workers on a 60-day window (ASSUMPTION), so stating availability may help users choose.
4. Yes. Synergy has measured availability: Jane WCB Physio Initial slots over 7 days, per clinic (locations-master, KNOWN as of 2026-11-02).
5. Instead of a blanket "same-day" claim, show a regularly refreshed "next WCB assessment opening" for each clinic, or link straight to that clinic's WCB Physio Initial treatment in Jane (`jane_wcb_physio_initial_url`). Mention Early Access only for clinics staff confirm are on the EAPP list (05).

**F15. Coast Therapy ranks across 6 cities with one current, non-local page.**
1. /physiotherapy/work-injuries/ is dated Oct 16, 2026, has an FAQ with the 2026 visit block, and explains who decides return to work. It ranks #3-#10 in Vancouver, Burnaby, New West, Abbotsford and Richmond.
2. Tasks listed in 3.2; WebSearch. KNOWN rankings; LIKELY content.
3. A current, comprehensive page may be treated as relevant across a region (LIKELY; no ranking-factor data).
4. Yes, for the pillar.
5. Make Synergy's pillar more useful than Coast's:
   - A clinic finder showing only verified clinics.
   - The worker journey on one screen.
   - A printable "what to bring" checklist: claim number if you have one, PHN/CareCard, employer name, date of injury, and the case manager's name if assigned (the items AIOs list in tasks 264766996, 264768133 and 264767641, checked against 05).
   - Official WorkSafeBC links.
   - A dated change log.

**F16. Complete Physio publishes a "denied or delayed claim" guide, but with unsourced statistics.**
1. Complete Physio has a long guide covering denied or delayed claims and session counts, plus a referral explainer. Its pages contradict each other on referrals, and it uses an unsourced "85% improvement" figure.
2. WebSearch (completephysio.ca); tasks 264766645 (#1), 264766648 (#5). KNOWN rankings; LIKELY content.
3. Workers whose claims are denied or delayed need next steps. This is LIKELY under-served in clinic content.
4. Yes.
5. Add a "claim denied or delayed" section that explains the official review options, links to WorkSafeBC and states what the clinic can and cannot do. Use no outcome statistics unless they come from a citable source.

**F17. Total Therapy pairs clinic WorkSafe pages with a help-centre article and team pages.**
1. Total Therapy has /services/worksafebc-burnaby, /services/worksafebc-metrotown-burnaby, /help/worksafebc-wsbc-claims and team pages, with transit and parking details.
2. Task 264766996 (#1); domain_keywords_worksafe_ca.tsv (help article #6 for "worksafebc burnaby", 90/mo); WebSearch. KNOWN.
3. A help article catches "WorkSafeBC + city" searches (people looking for WorkSafeBC itself), and the clinic page catches the booking intent (ASSUMPTION).
4. Yes.
5. On the Burnaby location page (4695 Canada Way), add a short "nearby WorkSafeBC resources" block (official claims line, WorkSafeBC office locations link) and WCB-bookable practitioner cards (F21).

**F18. Competitors point their Google listing to a location page with UTM tags, or straight to booking.**
1. Examples:
   - Launch Rehab → /new-westminster/?utm_source=gmb-listing.
   - Lifemark → utm_source=gmb.
   - Total Therapy Brentwood → /locations/brentwood?utm_source=google&utm_medium=gbp&utm_campaign=brentwoodgbp.
   - Allied → ?UTM_source=GMB_listing.
   - City Sports + Physio → its Jane booking page (Reserve-with-Google token).
   - Synergy: Central City links to the homepage; Delta links to its location page with no UTM.
2. Pack links in tasks 264768136, 264762175, 264766999, 264766648, 264768220; backlinks top pages; 04-local-gbp.md. KNOWN.
3. Landing on the right clinic page saves the user a step. UTM tags let the clinic measure GBP-driven WorkSafe visits (KNOWN measurement benefit).
4. Yes.
5. Point each verified clinic's GBP website link to its location page (WorkSafe or general, per the spec), consistently and with UTM tags. Consider setting the GBP appointment link to the clinic's Jane WCB booking URL. This is a recommendation for the owner; nothing was changed.

**F19. AI Overviews and packs show ratings and review counts for named clinics.**
1. AIOs list, among others:
   - Total Therapy 4.8 (590), Launch 4.9 (556).
   - Allied Richmond Blundell 4.9 (572).
   - Pure Life 4.8 (658), Allied Fleetwood 4.8 (500).
   - Beyond Langley 4.9 (295).
   - Synergy New West 4.9 (544), Prana 4.9 (494).
2. Tasks 264766996, 264767338, 264764602, 264767641, 264768133, 264768136. KNOWN.
3. Users see ratings before they click, so profile quality is part of the WorkSafe search experience (KNOWN that it is displayed).
4. Yes.
5. Reply to unanswered reviews (04 found 10, 5 and 2 at the three connected GBPs). Keep NAP consistent. Mention WorkSafeBC direct billing accurately in GBP descriptions where eligible; 04 shows Newton's description is ICBC-only.

**F20. Domain links don't separate the leaders; page relevance does.**
1. All Care (DIR 13) is #2 in Surrey twice, and Complete Physio (DIR 12) is #1 in Vancouver. No competitor's WorkSafe page is among its top-linked pages.
2. backlinks_summary_16.json; tasks 264762175, 264764602, 264766645. KNOWN.
3. WorkSafe local SERPs appear to be won on relevance and locality more than links (LIKELY; no controlled evidence).
4. Yes. Synergy (293 refdomains, DIR 44) has enough domain strength.
5. Put effort into page usefulness first. For links, earn genuine ones to the pillar, for example an employer-facing return-to-work resource local business groups might cite (ASSUMPTION). Opal's 15 edu and 4 gov refdomains show health-education links are attainable. Do not buy links (Telegram spam anchors seen on Prana, Reform and medimap).

**F21. Practitioner information is sparse; West 4th and New West Physio stand out.**
1. West 4th lists WSBC-specific booking options (30-minute WSBC assessment and treatment with six physios; WSBC vestibular/CVPT). New West Physio's team page ranks #2 for New West work injury. One AIO names a specific practitioner for WCB experience (New West WCB AIO). Total Therapy and Seva have profiles.
2. WebSearch (west4thphysio.com, totaltherapy.ca, sevawellnessclinic.com); tasks 264768136 (#2) and 264768133 (AIO). KNOWN ranking/AIO; LIKELY content.
3. Workers choosing a clinic may want to know who treats WorkSafe claims and what they can book (ASSUMPTION).
4. Yes. Jane shows 2-10 WCB-bookable physios per Synergy clinic (locations-master, KNOWN counts).
5. Show WCB-bookable practitioner cards on each location page: name, registration, focus areas and languages, published only with staff consent. No patient data.

**F22. People Also Ask wants plain answers about cost, referral and process.**
1. These are the questions Google surfaces. Competitors answer some of them in FAQs.
2. Counts across 25 SERPs (KNOWN):
   - "Can you get free physio in BC?" 13
   - "How to get 5 free physio sessions?" 11 (MSP supplementary, not WorkSafe)
   - "Should you go straight to physio for muscle pain or GP?" 9
   - "How do WorkSafeBC claims work?" 5
   - "Do you need a doctor's referral to see a physiotherapist in BC?" 5
   - "What is WSBC physio?" 2
   - "Is physio free in BC?" 2
   - Once each: "Is there a WorkSafe physiotherapy clinic in Abbotsford?", "Will WCB pay for physiotherapy?", "What to do if injured at work BC?", "What compensation can I get for a workplace injury in BC?", "Can you anonymously report to WorkSafeBC?", "What is the maximum wage rate for WorkSafeBC in 2026?"

   Related searches include "WorkSafeBC physiotherapy near me", "…providers", "…fee schedule", "…extension report", "…treatment report" and "…contract".
3. These show what injured workers want answered (KNOWN that Google surfaces them).
4. Yes, for the WorkSafe-relevant ones. The "80-20 rule" (21 of 25), salary and career questions are off-topic noise. Fee schedule, extension and treatment report, and contract are provider intent, which 06 excludes.
5. Use the WorkSafe questions as pillar FAQ headings, answered in Synergy's own words and checked against `claims-register.csv`. Answer "free physio" in WorkSafe terms only: what WorkSafeBC pays for on an accepted claim. Each location page answers its own "Is there a WorkSafe physiotherapy clinic in [city]?" with verified facts.

**F23. Paid search competition is minimal.**
1. Revitalize runs a bottom-of-page ad for `wcb physio vancouver`. No other ads appeared in the 25 SERPs.
2. Task 264766648 (`bads`). KNOWN.
3. This matches 06 (CPC 0 for most terms).
4. Out of scope (no campaigns).
5. No action. Noted for the owner.

**F24. Directories, official lists and Facebook answer pages take many organic slots.**
1. Medimap appears in 8 SERPs (including a /clinics/worksafebc-physiotherapy/bc/burnaby page). Yelp, CareCompare, ClinicFinder and Facebook "fb-answers" pages fill most of the Langley, Delta and Burnaby `wcb physio` top 10s. WorkSafeBC lists rank in 11 SERPs. Synergy has third-party listings ranking: Yelp Delta "WCB and WorkSafeBC Approved Physiotherapy", ClinicFinder Delta 4.9 (504), CareCompare, Birdeye New West (638 reviews).
2. Tasks 264766999, 264767638, 264768220, 264779098, 264766996 and others. KNOWN.
3. Users comparing clinics land on these pages, so listing accuracy is part of how they discover Synergy (ASSUMPTION).
4. Yes.
5. Check Synergy's Medimap, Yelp, ClinicFinder and CareCompare listings for accurate, staff-verified WorkSafe wording, addresses and hours (04 found NAP conflicts). Make sure third-party listings don't claim "approved" status that staff haven't confirmed for 2026 (05).

**F25. Neighbourhood-area pages and service-area claims for places a clinic isn't in.**
1. Realign says it serves Aldergrove and lists 8 Langley neighbourhoods while sitting in Willowbrook. Prosper Health has "Physiotherapy Near Tynehead / Green Timbers / Bear Creek" pages. Revive Rehab has a "near Mill Lake / Sevenoaks" area page that ranks #9 for Abbotsford work injury.
2. WebSearch (realignchirophysio.ca, prosperhealth.ca); task 264767779. KNOWN (Revive) / LIKELY.
3. Such pages may catch neighbourhood searches, but they are LIKELY to be read as doorway pages.
4. No.
5. Mention only areas with a real link to the clinic, such as transit that reaches it or the neighbourhood it is in. Synergy's 13 Surrey clinics cover real neighbourhoods (Newton, Fleetwood, Cloverdale, Cedar Hills and others). Each page can name its own.

**F26. Structured data: UNKNOWN for every competitor.**
1. Not Available.
2. Ahrefs (Insufficient plan); SE Ranking SERP (no schema field); fetch blocked.
3. n/a.
4. n/a.
5. Synergy should still add valid MedicalClinic/LocalBusiness and FAQPage markup that matches the visible content (the spec phase decides). Verify with a Rich Results test run by a person.

---

## 5. Patterns to avoid (summary)

| Pattern | Who | Evidence | Why avoid |
|---|---|---|---|
| Exact-match microsites and keyword-named Google listings | Prana (wcbsurrey.ca, wcbcloverdale.ca, wcbnewwestminster.ca, "WCB-WestMinster") | F12 | Business-name rule conflict (LIKELY); misleading to users |
| One template with the city swapped, or another city's address on a city page | Panda | F11 | Doorway risk (LIKELY); misleading |
| One article republished across domains | Allied | F13 | Duplicate content; no new value |
| Neighbourhood area pages for places the clinic is not in | Realign, Prosper, Revive | F25 | Doorway risk; misleading |
| ICBC figures in WorkSafe copy, or ICBC pages ranking for WorkSafe intent | Beyond, Prana; Synergy's own Richmond/Abbotsford ICBC pages | F3, F9 | Breaks the WorkSafe-only scope rule; confuses users |
| Unsourced outcome statistics | Complete Physio | F16 | Not verifiable |
| Out-of-date visit counts and "referral after 60 days" claims | Reform, NewLeaf, Total Therapy, Allied, Dynamic Balance, Prana | F8, F9 | Inaccurate per 05 |
| Link-spam anchors | Prana, Reform, medimap (received) | F20 | Not to be pursued |

## 6. Where Synergy can be most useful

| Opportunity | Markets | Basis | Label |
|---|---|---|---|
| Accurate, dated 2026 rules with official links and a reviewer line | All | F8, F9, F22 | ASSUMPTION (opportunity), KNOWN (gap) |
| Real availability per clinic (WCB initial openings from Jane) | All verified clinics | F14, locations-master | KNOWN data |
| One WorkSafe page per verified clinic, replacing ICBC/tag pages that now rank for WorkSafe intent | Richmond, Abbotsford first | F3 | KNOWN problem |
| Pilot location page | New Westminster (strongest), then Delta and Surrey Central City | F5, F6, section 2 | KNOWN rankings |
| Gap markets with weak dedicated content | Vancouver, Richmond, Abbotsford; `wcb physio` in Burnaby, Langley and Delta | F2, F3, F4, F24 | LIKELY |
| Worker-journey spokes (pending claim, after 60 days, modified duties, denied/delayed claim, claim number) | Pillar | F10, F11, F16 | ASSUMPTION |
| GBP website links to location pages, with UTM; Jane WCB link as the appointment URL | All GBPs | F18 | KNOWN competitor practice |
| Practitioner cards for WCB-bookable physios | All | F21 | ASSUMPTION; needs staff consent |
| Listing hygiene (WorkSafeBC list, Medimap, Yelp, ClinicFinder, CareCompare) | All | F4, F24 | KNOWN listings exist |

## 7. Not Available and why

| Item | Why | How to get it |
|---|---|---|
| SERP `workplace injury physiotherapy burnaby` | SE Ranking task 264767002 was still "processing" at report time | Re-poll the same task with `DATA_getSerpTaskAdvancedResults` |
| Full raw JSON for 9 SERPs | The tool returned these inline; verbatim subsets (top 10, pack, AIO, PAA, selected deeper rows) were transcribed | Re-fetch the same task ids; repeat retrievals cost nothing extra per the tool notes |
| Ahrefs DR, organic keywords, top pages, SERP overview | HTTP 400 "Insufficient plan" | Higher Ahrefs API plan |
| Semrush competitor and organic data | `no_api_units` | Add units at https://www.semrush.com/mcp-access |
| Competitor headings, full FAQ lists, word counts, schema | Fetch blocked; Ahrefs page content plan-blocked | Allowlist competitor domains for fetch, or a person runs a crawl / Rich Results test |
| Backlinks for Lifemark, pt Health, NewLeaf, Legend and others | Kept within the unit budget | One more `DATA_getBacklinksSummary` batch |
| Exact SE Ranking units spent by this agent | Shared account with concurrent agents | Per-agent API key or a quiet window |
| Mobile SERPs | The SE Ranking tool accepts desktop only | Different tool or setting |

## 8. Sources

- SE Ranking `DATA_getSerpTaskAdvancedResults` tasks (google.ca desktop, language en, crawled 2026-11-02 06:44-07:07): 264762175, 264764602, 264764605, 264766645, 264766648, 264766651, 264766996, 264766999, 264767332, 264767335, 264767338, 264767635, 264767638, 264767641, 264767773, 264767776, 264767779, 264768130, 264768133, 264768136, 264768220, 264768223, 264768352, 264768355, 264779098. Raw JSON is in `research/08-competitor-source/`.
- SE Ranking `DATA_getBacklinksSummary` (16 targets, mode domain) → `backlinks_summary_16.json`.
- SE Ranking `DATA_getDomainKeywords` (source ca; 9 domains) → `domain_keywords_worksafe_ca.tsv`.
- SE Ranking `DATA_getSerpLocations`, `DATA_getSerpTasks`, `DATA_getSubscription`.
- WebSearch result pages (competitor sites; content summarized by the tool):
  - [pranaphysiotherapy.ca/wcb-claims/](https://pranaphysiotherapy.ca/wcb-claims/)
  - [allcarephysio.ca/surrey/5-things-worksafe-physiotherapy-in-surrey/](https://allcarephysio.ca/surrey/5-things-worksafe-physiotherapy-in-surrey/)
  - [pandaclinic.ca/worksafe-physio-surrey](https://pandaclinic.ca/worksafe-physio-surrey)
  - [claim.pandaclinic.ca/providers/wcb](https://claim.pandaclinic.ca/providers/wcb)
  - [beyondphysiotherapy.ca/worksafe-bc](https://beyondphysiotherapy.ca/worksafe-bc)
  - [revitalizephysioclinic.ca/surrey/worksafebc-physiotherapy/](https://revitalizephysioclinic.ca/surrey/worksafebc-physiotherapy/)
  - [alliedphysio.ca/everything-you-need-to-know-about-worksafebc-wsbc-physiotherapy-treatment/](https://alliedphysio.ca/everything-you-need-to-know-about-worksafebc-wsbc-physiotherapy-treatment/)
  - [alliedphysio.ca/workplace-injuries-with-allied-physiotherapy/](https://alliedphysio.ca/workplace-injuries-with-allied-physiotherapy/)
  - [sullivanphysio.ca/worksafe-bc/](https://sullivanphysio.ca/worksafe-bc/)
  - [coasttherapy.ca/physiotherapy/work-injuries/](https://coasttherapy.ca/physiotherapy/work-injuries/)
  - [prosperhealth.ca/worksafebc-physiotherapy-surrey](https://prosperhealth.ca/worksafebc-physiotherapy-surrey)
  - [sevawellnessclinic.com/services/physiotherapy-surrey/](https://www.sevawellnessclinic.com/services/physiotherapy-surrey/)
  - [launchrehab.ca/worksafebc-physiotherapy/worksafebc-claim-and-first-visit/](https://launchrehab.ca/worksafebc-physiotherapy/worksafebc-claim-and-first-visit/)
  - [opalphysio.ca/worksafebc-physiotherapy/](https://www.opalphysio.ca/worksafebc-physiotherapy/)
  - [totaltherapy.ca/services/worksafebc-metrotown-burnaby](https://www.totaltherapy.ca/services/worksafebc-metrotown-burnaby)
  - [totaltherapy.ca/help/worksafebc-wsbc-claims](https://www.totaltherapy.ca/help/worksafebc-wsbc-claims)
  - [completephysio.ca/worksafebc-physiotherapy-in-vancouver-how-it-works-…](https://completephysio.ca/worksafebc-physiotherapy-in-vancouver-how-it-works-how-many-sessions-you-get-and-what-to-do-if-your-claim-is-denied-or-delayed/)
  - [therapex.ca/wcb-physiotherapy](https://www.therapex.ca/wcb-physiotherapy)
  - [west4thphysio.com/physiotherapy-for-work-injury-in-kitsilano](https://west4thphysio.com/physiotherapy-for-work-injury-in-kitsilano)
  - [reformpt.ca/physiotherapy-for-work-related-injuries/](https://reformpt.ca/physiotherapy-for-work-related-injuries/)
  - [regainhealth.org/worksafebc-physiotherapy/](https://regainhealth.org/worksafebc-physiotherapy/)
  - [medimap.ca/clinics/worksafebc-physiotherapy/bc/burnaby](https://medimap.ca/clinics/worksafebc-physiotherapy/bc/burnaby)
  - [newleafwellnesscentre.com/workplace-injury-physiotherapy](https://newleafwellnesscentre.com/workplace-injury-physiotherapy)
  - [realignchirophysio.ca/worksafebc-claims-faq-…](https://realignchirophysio.ca/worksafebc-claims-faq-your-guide-to-injury-recovery-in-aldergrove-langley/)
  - [westendphysio.com/patient-information/faqs/](https://westendphysio.com/patient-information/faqs/)
  - [lifemark.ca/clinics/surrey/surrey-city-centre/coverage-options](https://www.lifemark.ca/clinics/surrey/surrey-city-centre/coverage-options)
  - [dynamicbalancephysio.ca/worksafe-icbc-physiotherapy-surrey-langley/worksafe-physio-surrey/](https://dynamicbalancephysio.ca/worksafe-icbc-physiotherapy-surrey-langley/worksafe-physio-surrey/)
  - [beyondphysiotherapy.janeapp.com](https://beyondphysiotherapy.janeapp.com/locations/beyond-physiotherapy-abbotsford)
  - [worksafebc.com return-to-work service providers](https://www.worksafebc.com/en/health-care-providers/rehabilitation/return-work-support/service-providers)
- Internal: `research/04-local-gbp.md`, `research/05-worksafebc-policy.md`, `research/06-keyword-research.md`, `data/locations-master.csv`, `data/gbp-maps-keyword-positions.csv`.

No patient data was opened or recorded. No external system was changed.

---

## Appendix A. Top-10 organic, local pack, AI Overview and PAA per SERP (SE Ranking advanced results)

### Surrey

#### `worksafebc physiotherapy surrey` (location: Surrey BC), SE Ranking task 264762175, crawled 2026-11-02 06:44:11

- SERP features: local_pack, people_also_ask
- Local pack: 1. Surrey Chiropractic, Physiotherapy, & Massage Clinic (surreychirophysio.ca); 2. Synergy Rehab Central City (synergyrehabilitation.ca); 3. Lifemark Physiotherapy Surrey City Centre (lifemark.ca)
- AI Overview: none
- People Also Ask: Can you get free physio in BC?; What is the 80-20 rule in physiotherapy?; Should you go straight to physio for muscle pain or GP?; Can you anonymously report to WorkSafeBC?
- Synergy: organic #10; local pack #2

| # | Domain | Ranking URL |
|---|---|---|
| 1 | pranaphysiotherapy.ca | https://pranaphysiotherapy.ca/wcb-claims/ |
| 2 | allcarephysio.ca | https://allcarephysio.ca/surrey/5-things-worksafe-physiotherapy-in-surrey/ |
| 3 | pandaclinic.ca | https://pandaclinic.ca/worksafe-physio-surrey |
| 4 | cloverdalephysio.ca | https://cloverdalephysio.ca/everything-you-need-to-know-about-worksafebc-wsbc-physiotherapy-treatment/ |
| 5 | worksafebc.com | https://www.worksafebc.com/resources/health-care-providers/guides/concussion-vestibular-physiotherapy-provider-list/metro-vancouver?lang=en&direct |
| 6 | revitalizephysioclinic.ca | https://revitalizephysioclinic.ca/surrey/worksafebc-physiotherapy/ |
| 7 | fleetwoodsurreyphysio.ca | https://fleetwoodsurreyphysio.ca/learn-more/direct-billing/ |
| 8 | allcarephysio.ca | https://allcarephysio.ca/surrey/wcb-physio-in-surrey/ |
| 9 | richmondphysio.ca | https://richmondphysio.ca/service/work-place-injuries/ |
| 10 | synergyrehabilitation.ca | https://synergyrehabilitation.ca/worksafebc-physiotherapy-what-is-covered/ |

#### `wcb physio surrey` (location: Surrey BC), SE Ranking task 264764602, crawled 2026-11-02 07:03:24

- SERP features: ai_overview, people_also_ask, related_searches
- Local pack: none returned
- AI Overview: present; sources: worksafebc.com, jeevaphysio.ca, purelifephysiotherapy.ca, wcbsurrey.ca, surreyphysio.ca, google.com
- People Also Ask: How to get 5 free physio sessions?; Can you get free physio in BC?; What is WSBC physio?; What is the 80-20 rule in physiotherapy?
- Synergy: organic not in top 10; local pack not in pack

| # | Domain | Ranking URL |
|---|---|---|
| 1 | worksafebc.com | https://www.worksafebc.com/resources/health-care-providers/guides/physiotherapy-provider-list/metro-vancouver?lang=en&direct |
| 2 | allcarephysio.ca | https://allcarephysio.ca/surrey/wcb-physio-in-surrey/ |
| 3 | purelifephysiotherapy.ca | https://purelifephysiotherapy.ca/our-services/icbc-wcb-physiotherapy-surrey/ |
| 4 | dynamicbalancephysio.ca | https://dynamicbalancephysio.ca/worksafe-icbc-physiotherapy-surrey-langley/worksafe-physio-surrey/ |
| 5 | jeevaphysio.ca | https://www.jeevaphysio.ca/treatments-guildford/physiotherapy/wcb-physiotherapy |
| 6 | pandaclinic.ca | https://pandaclinic.ca/worksafe-physio-surrey |
| 7 | surreyphysio.ca | https://surreyphysio.ca/contact-us/ |
| 8 | wcbsurrey.ca | https://wcbsurrey.ca/ |
| 9 | restorerehabandwellness.ca | https://restorerehabandwellness.ca/wcb-treatment-coverage-surrey/ |
| 10 | thecompassioncentre.ca | https://thecompassioncentre.ca/active-rehab-surrey/ |

#### `workplace injury physiotherapy surrey` (location: Surrey BC), SE Ranking task 264764605, crawled 2026-11-02 06:45:48

- SERP features: ai_overview, local_pack, reviews, people_also_ask, video, images
- Local pack: 1. Prana Physiotherapy Surrey (pranaphysiotherapy.ca); 2. Surrey Chiropractic, Physiotherapy, & Massage Clinic (surreychirophysio.ca); 3. painPRO North Surrey City Centre (painproclinics.com)
- AI Overview: present; sources: surreyphysio.ca, beyondphysiotherapy.ca, pranaphysiotherapy.ca, sevawellnessclinic.com, google.com
- People Also Ask: What to do if injured at work BC?; What is the 80-20 rule in physiotherapy?; Can you get free physio in BC?; What is responsible for 37% of workplace injuries?
- Synergy: organic not in top 10; local pack not in pack

| # | Domain | Ranking URL |
|---|---|---|
| 1 | surreyphysio.ca | https://surreyphysio.ca/service/work-place-injuries/ |
| 2 | beyondphysiotherapy.ca | https://beyondphysiotherapy.ca/health-blog/work-injury-physiotherapy-surrey |
| 3 | sevawellnessclinic.com | https://www.sevawellnessclinic.com/services/worksafebc-physiotherapy-surrey/ |
| 4 | pranaphysiotherapy.ca | https://pranaphysiotherapy.ca/wcb-claims/ |
| 5 | prosperhealth.ca | https://prosperhealth.ca/physiotherapy-surrey |
| 6 | khalsaphysiotherapy.ca | https://khalsaphysiotherapy.ca/wcb-workplace-injuries/ |
| 7 | apexphysiotherapy.ca | https://apexphysiotherapy.ca/physiotherapy-conditions/work-injuries/ |
| 8 | fleetwoodsurreyphysio.ca | https://fleetwoodsurreyphysio.ca/service/physiotherapy/ |
| 9 | beyondphysiotherapy.ca | https://beyondphysiotherapy.ca/health-blog/pain-injuries-physiotherapy-surrey-changing-commute |
| 10 | allcarephysio.ca | https://allcarephysio.ca/surrey/5-things-worksafe-physiotherapy-in-surrey/ |

### Vancouver

#### `worksafebc physiotherapy vancouver` (location: Vancouver BC), SE Ranking task 264766645, crawled 2026-11-02 06:46:39

- SERP features: local_pack, people_also_ask, related_searches, video
- Local pack: 1. Van Sports & Physiotherapy (vansportsphysio.com); 2. West 4th Physiotherapy Clinic (west4thphysio.com); 3. Lifemark Physiotherapy Keefer Place (lifemark.ca)
- AI Overview: none
- People Also Ask: How do WorkSafeBC claims work?; Do you need a doctor's referral to see a physiotherapist in BC?; Is it worth becoming a physiotherapist?; What is the maximum wage rate for WorkSafeBC in 2026?
- Synergy: organic not in top 10; local pack not in pack

| # | Domain | Ranking URL |
|---|---|---|
| 1 | completephysio.ca | https://completephysio.ca/worksafebc-physiotherapy-in-kitsilano-complete-physio/ |
| 2 | northvancouverphysio.ca | https://northvancouverphysio.ca/service/work-place-injuries/ |
| 3 | worksafebc.com | https://www.worksafebc.com/resources/health-care-providers/guides/standard-and-post-surgical-physiotherapy-fee-schedules?lang=en&direct |
| 4 | coasttherapy.ca | https://coasttherapy.ca/physiotherapy/work-injuries/ |
| 5 | worksafebc.com | https://www.worksafebc.com/resources/health-care-providers/guides/eapp-provider-list/vancouver-island-gulf-islands?lang=en |
| 6 | worksafebc.com | https://www.worksafebc.com/resources/health-care-providers/guides/eapp-provider-list/vancouver-island-gulf-islands?lang=en&direct |
| 7 | worksafebc.com | https://www.worksafebc.com/resources/health-care-providers/forms/physiotherapy-requested-report-form-83d332?lang=en&direct |
| 8 | worksafebc.com | https://www.worksafebc.com/en/health-care-providers/provider-types/physiotherapists/home-neurological-hydrotherapy-physiotherapy-services |
| 9 | worksafebc.com | https://www.worksafebc.com/resources/health-care-providers/guides/home-physiotherapy-fee-schedule?lang=en |
| 10 | worksafebc.com | https://www.worksafebc.com/resources/health-care-providers/guides/physiotherapy-provider-list/fraser-valley?lang=en&direct |

#### `wcb physio vancouver` (location: Vancouver BC), SE Ranking task 264766648, crawled 2026-11-02 06:47:21

- SERP features: ai_overview, local_pack, reviews, people_also_ask, related_searches, bads
- Local pack: 1. West End Physiotherapy Clinic (westendphysio.com); 2. City Sports + Physio Clinic (citysportsphysio.janeapp.com); 3. Westside Physiotherapy & Hand Clinic (healthonephysio.ca)
- AI Overview: present; sources: opalphysio.ca, google.com
- People Also Ask: Can you get free physio in BC?; What is the 80-20 rule in physiotherapy?; How to get 5 free physio sessions?; What is the average salary for a physiotherapist in Canada?
- Synergy: organic not in top 10; local pack not in pack

| # | Domain | Ranking URL |
|---|---|---|
| 1 | richmondphysio.ca | https://richmondphysio.ca/service/work-place-injuries/ |
| 2 | therapex.ca | https://www.therapex.ca/wcb-physiotherapy |
| 3 | mainstreetphysio.ca | https://mainstreetphysio.ca/services/icbcwcb-rehabilitation-and-active-rehabilitation/ |
| 4 | pandaclinic.ca | https://pandaclinic.ca/worksafe-physio-surrey |
| 5 | completephysio.ca | https://completephysio.ca/worksafebc-physiotherapy-in-kitsilano-complete-physio/ |
| 6 | sconasportsphysio.ca | https://sconasportsphysio.ca/blog/navigating-the-wcb/ |
| 7 | opalphysio.ca | https://www.opalphysio.ca/worksafebc-physiotherapy/ |
| 8 | allcarephysio.ca | https://allcarephysio.ca/surrey/wcb-physio-in-surrey/ |
| 9 | pandaclinic.ca | https://pandaclinic.ca/worksafe-physio-burnaby |
| 10 | physiodistrict.ca | https://physiodistrict.ca/services/physiotherapy/wcb/ |

#### `workplace injury physiotherapy vancouver` (location: Vancouver BC), SE Ranking task 264766651, crawled 2026-11-02 06:47:43

- SERP features: ai_overview, local_pack, reviews, people_also_ask, related_searches
- Local pack: 1. Kinematics Sports Medicine and Rehab (kinematicsrehab.com); 2. City Sports + Physio Clinic (citysportsphysio.janeapp.com); 3. West End Physiotherapy Clinic (westendphysio.com)
- AI Overview: present, no sources listed
- People Also Ask: What are work-related injuries?; When injured, the most important thing for the employee to do is?; Who is affected by a workplace incident?; Can you get free physio in BC?
- Synergy: organic not in top 10; local pack not in pack

| # | Domain | Ranking URL |
|---|---|---|
| 1 | west4thphysio.com | https://west4thphysio.com/physiotherapy-for-work-injury-in-kitsilano |
| 2 | level10fitness.com | https://www.level10fitness.com/blog/2024/12/9/worksafebc-physio-services-at-level-10-physiotherapy-in-north-vancouver |
| 3 | coasttherapy.ca | https://coasttherapy.ca/physiotherapy/work-injuries/ |
| 4 | thephysiolab.ca | https://www.thephysiolab.ca/physiotherapy-center/ergonomic-assessment-vancouver/ |
| 5 | mskclinics.com | https://mskclinics.com/physiotherapy-center-services/work-injuries/ |
| 6 | mountainviewmovement.com | https://mountainviewmovement.com/worksafe-physiotherapy-vancouver/ |
| 7 | reformpt.ca | https://reformpt.ca/physiotherapy-for-work-related-injuries/ |
| 8 | westendphysio.com | https://westendphysio.com/physiotherapy-center-treatments/ergonomic-training/ |
| 9 | opalphysio.ca | https://www.opalphysio.ca/worksafebc-physiotherapy/ |
| 10 | movementroompr.ca | https://movementroompr.ca/service/return-to-work/ |

#### `worksafebc physiotherapy` (location: Vancouver BC), SE Ranking task 264768352, crawled 2026-11-02 06:48:57

- SERP features: ai_overview, people_also_ask, image_in_block, related_searches, images
- Local pack: none returned
- AI Overview: present; sources: worksafebc.com, shelbournephysio.ca, opalphysio.ca, regainhealth.org, reformpt.ca
- People Also Ask: How do WorkSafeBC claims work?; What is the 80-20 rule in physiotherapy?; Can you get free physio in BC?; What is a physiotherapist's salary in Canada?
- Synergy: organic not in top 10; local pack not in pack

| # | Domain | Ranking URL |
|---|---|---|
| 1 | opalphysio.ca | https://www.opalphysio.ca/worksafebc-physiotherapy/ |
| 2 | worksafebc.com | https://www.worksafebc.com/~/media/D71F86992C8A4851AE11B52A9BE96D7F.ashx?dt=202501300853 |
| 3 | worksafebc.com | https://www.worksafebc.com/resources/health-care-providers/guides/physiotherapy-provider-list/interior-okanagan?lang=en |
| 4 | dynamicbalancephysio.ca | https://dynamicbalancephysio.ca/worksafe-icbc-physiotherapy-surrey-langley/worksafe-physio-surrey/ |
| 5 | worksafebc.com | https://www.worksafebc.com/resources/health-care-providers/guides/home-physiotherapy-fee-schedule?lang=en&direct |
| 6 | worksafebc.com | https://www.worksafebc.com/resources/health-care-providers/forms/physiotherapy-requested-report-form-83d332?lang=en&direct |
| 7 | regainhealth.org | https://regainhealth.org/worksafebc-physiotherapy/ |
| 8 | reformpt.ca | https://reformpt.ca/physiotherapy-for-work-related-injuries/ |
| 9 | shelbournephysio.ca | https://www.shelbournephysio.ca/content/worksafebc-physiotherapy |
| 10 | worksafebc.com | https://www.worksafebc.com/resources/health-care-providers/guides/physiotherapy-provider-list/northern-bc?lang=en&direct |

#### `wcb physiotherapy near me` (location: Vancouver BC), SE Ranking task 264768355, crawled 2026-11-02 06:50:37

- SERP features: local_pack, reviews, people_also_ask, related_searches, images
- Local pack: 1. West End Physiotherapy Clinic (westendphysio.com); 2. Coal Harbour Physiotherapy and Wellness (coalharbourphysio.com); 3. Sitka Physio & Wellness (sitkaphysio.com)
- AI Overview: none
- People Also Ask: Can you get free physio in BC?; What is the 80-20 rule in physiotherapy?; How to get 5 free physio sessions?; Can physiotherapists use Dr. Title in Canada?
- Synergy: organic not in top 10; local pack not in pack

| # | Domain | Ranking URL |
|---|---|---|
| 1 | burrardphysiotherapy.com | https://www.burrardphysiotherapy.com/wcb-treatment/ |
| 2 | allcarephysio.ca | https://allcarephysio.ca/surrey/wcb-physio-in-surrey/ |
| 3 | dynamicbalancephysio.ca | https://dynamicbalancephysio.ca/worksafe-icbc-physiotherapy-surrey-langley/ |
| 4 | purelifephysiotherapy.ca | https://purelifephysiotherapy.ca/our-services/icbc-wcb-physiotherapy-surrey/ |
| 5 | wcbsurrey.ca | https://wcbsurrey.ca/ |
| 6 | fleetwoodsurreyphysio.ca | https://fleetwoodsurreyphysio.ca/learn-more/direct-billing/ |
| 7 | brentwoodphysio.ca | https://www.brentwoodphysio.ca/wcb-authorised-treatments-for-our-patients-at-our-clinic/ |
| 8 | willowwellnessphysio.ca | https://www.willowwellnessphysio.ca/services/wcb-worksafe-physio/ |
| 9 | mssphysio.com | https://www.mssphysio.com/work-injury-physiotherapy-edmonton-wcb/ |
| 10 | allcarephysio.ca | https://allcarephysio.ca/surrey/wcb-physio-in-surrey/ |

### Burnaby

#### `worksafebc physiotherapy burnaby` (location: Burnaby BC), SE Ranking task 264766996, crawled 2026-11-02 06:47:53

- SERP features: ai_overview, people_also_ask, related_searches, gmb, reviews
- Local pack: none returned
- AI Overview: present; sources: totaltherapy.ca, launchrehab.ca, synergyrehabilitation.ca, medimap.ca, coasttherapy.ca
- People Also Ask: How do WorkSafeBC claims work?; What is the 80-20 rule in physiotherapy?; Do you need a doctor's referral to see a physiotherapist in BC?; Should you go straight to physio for muscle pain or GP?
- Synergy: organic #7; local pack not in pack

| # | Domain | Ranking URL |
|---|---|---|
| 1 | totaltherapy.ca | https://www.totaltherapy.ca/services/worksafebc-metrotown-burnaby |
| 2 | worksafebc.com | https://www.worksafebc.com/resources/health-care-providers/guides/standard-and-post-surgical-physiotherapy-fee-schedules?lang=en&direct |
| 3 | medimap.ca | https://medimap.ca/clinics/worksafebc-physiotherapy/bc/burnaby |
| 4 | launchrehab.ca | https://launchrehab.ca/new-westminster/worksafebc-physiotherapy/ |
| 5 | coasttherapy.ca | https://coasttherapy.ca/physiotherapy/work-injuries/ |
| 6 | opalphysio.ca | https://www.opalphysio.ca/worksafebc-physiotherapy/ |
| 7 | synergyrehabilitation.ca | https://synergyrehabilitation.ca/worksafebc-physiotherapy-what-is-covered/ |
| 8 | worksafebc.com | https://www.worksafebc.com/resources/health-care-providers/guides/physiotherapy-provider-list/sea-to-sky-sunshine-coast?lang=en&direct |
| 9 | beyondphysiotherapy.ca | https://beyondphysiotherapy.ca/worksafe-bc |
| 10 | launchrehab.ca | https://launchrehab.ca/worksafebc-physiotherapy/worksafebc-extensions/ |

#### `wcb physio burnaby` (location: Burnaby BC), SE Ranking task 264766999, crawled 2026-11-02 07:03:22

- SERP features: local_pack, reviews, people_also_ask
- Local pack: 1. Expert Physio (expertphysio.ca); 2. BLVD Wellness and Recovery (blvdwellness.ca); 3. Total Therapy | Brentwood Burnaby | Physio Sports Wellness Clinic (totaltherapy.ca)
- AI Overview: none
- People Also Ask: Is physio free in BC?; What is the 80-20 rule in physiotherapy?; How to get 5 free physio sessions?; Should you go straight to physio for muscle pain or GP?
- Synergy: organic not in top 10; local pack not in pack

| # | Domain | Ranking URL |
|---|---|---|
| 1 | burnabyphysiocare.com | https://burnabyphysiocare.com/how-to-pay-for-physiotherapy/ |
| 2 | medimap.ca | https://medimap.ca/clinic/physiotherapists/bc/burnaby/burnaby-physiotherapy-and-hand-therapy-pt-health |
| 3 | eastwestphysiotherapy.com | https://www.eastwestphysiotherapy.com/physiotherapy-in-vancouver-heights-burnaby/ |
| 4 | carecompare.ca | https://carecompare.ca/provider/central-park-physiotherapy-sports-injury-clinic-burnaby |
| 5 | instagram.com | https://www.instagram.com/popular/wcb-physiotherapy-vancouver/ |
| 6 | surreyphysio.ca | https://surreyphysio.ca/everything-you-need-to-know-about-worksafebc-wsbc-physiotherapy-treatment/ |
| 7 | medimap.ca | https://medimap.ca/clinics/worksafebc-physiotherapy/bc/burnaby |
| 8 | facebook.com | https://www.facebook.com/groups/712462703655308/posts/1188985392669701/ |
| 9 | wcbcloverdale.ca | https://wcbcloverdale.ca/ |
| 10 | medimap.ca | https://medimap.ca/clinics/physiotherapists/bc/burnaby |

### Richmond

#### `worksafebc physiotherapy richmond` (location: Richmond BC), SE Ranking task 264767332, crawled 2026-11-02 07:02:54

- SERP features: local_pack, people_also_ask, related_searches
- Local pack: 1. Richmond Central Physiotherapy (rcphysio.com); 2. WorkSafeBC (worksafebc.com); 3. Richmond Physiotherapy - pt Health (pthealth.ca)
- AI Overview: none
- People Also Ask: How do WorkSafeBC claims work?; What is the 80-20 rule in physiotherapy?; Do you need a doctor's referral to see a physiotherapist in BC?; Should you go straight to physio for muscle pain or GP?
- Synergy: organic #7, #10; local pack not in pack

| # | Domain | Ranking URL |
|---|---|---|
| 1 | richmondphysio.ca | https://richmondphysio.ca/icbc-physiotherapy-treatment-in-richmond/ |
| 2 | revitalizephysioclinic.ca | https://revitalizephysioclinic.ca/surrey/worksafebc-physiotherapy/ |
| 3 | surreychirophysio.ca | https://www.surreychirophysio.ca/resources/worksafebc-physiotherapy |
| 4 | lifemark.ca | https://www.lifemark.ca/clinics/richmond/richmond-health-science-centre/clinic-information |
| 5 | leephysio.ca | https://www.leephysio.ca/worksafebc-claims |
| 6 | fleetwoodsurreyphysio.ca | https://fleetwoodsurreyphysio.ca/service/work-place-injuries/ |
| 7 | synergyrehabilitation.ca | https://synergyrehabilitation.ca/tag/worksafebc/ |
| 8 | one-wellness.ca | https://one-wellness.ca/worksafebc |
| 9 | facebook.com | https://www.facebook.com/fb-answers/worksafebc-physiotherapy-providers/ |
| 10 | synergyrehabilitation.ca | https://synergyrehabilitation.ca/icbc-treatments/richmond/ |

#### `wcb physio richmond` (location: Richmond BC), SE Ranking task 264767335, crawled 2026-11-02 07:02:38

- SERP features: local_pack, reviews, people_also_ask, related_searches
- Local pack: 1. Richmond Central Physiotherapy (rcphysio.com); 2. West Coast Sports Physiotherapy Clinic (westcoastsportsphysio.com); 3. Richmond Physiotherapy - pt Health (pthealth.ca)
- AI Overview: none
- People Also Ask: Can you get free physio in BC?; What is the 80-20 rule in physiotherapy?; Is there a walk-in clinic in Richmond?; How to get 5 free physio sessions?
- Synergy: organic #6, #7; local pack not in pack

| # | Domain | Ranking URL |
|---|---|---|
| 1 | richmondphysio.ca | https://richmondphysio.ca/icbc-physiotherapy-treatment-in-richmond/ |
| 2 | lifemark.ca | https://www.lifemark.ca/clinics/richmond/richmond-health-science-centre/clinic-information |
| 3 | launchrehab.ca | https://launchrehab.ca/richmond/worksafebc-physiotherapy/ |
| 4 | richmondphysio.ca | https://richmondphysio.ca/everything-you-need-to-know-about-physiotherapy-and-your-icbc-treatment/ |
| 5 | medimap.ca | https://medimap.ca/clinic/physiotherapists/bc/richmond/richmond-blundell-physiotherapy-and-sports-clinic |
| 6 | synergyrehabilitation.ca | https://synergyrehabilitation.ca/icbc-treatments/richmond/ |
| 7 | synergyrehabilitation.ca | https://synergyrehabilitation.ca/richmond-physiotherapy-2/ |
| 8 | cloverdalephysio.ca | https://cloverdalephysio.ca/everything-you-need-to-know-about-worksafebc-wsbc-physiotherapy-treatment/ |
| 9 | facebook.com | https://www.facebook.com/100057547145279/posts/our-clinic-is-motor-vehicle-accident-mva-and-work-compensation-board-wcb-certifi/1503704758224415/ |
| 10 | medimap.ca | https://medimap.ca/clinics/physiotherapists/bc/richmond |

#### `workplace injury physiotherapy richmond` (location: Richmond BC), SE Ranking task 264767338, crawled 2026-11-02 06:49:41

- SERP features: ai_overview, local_pack, reviews, related_searches
- Local pack: 1. Richmond Blundell Physiotherapy & Sports Injury Clinic (Allied Physio) (richmondphysio.ca); 2. Myo Richmond (myodetox.com); 3. Richmond Physiotherapy - pt Health (pthealth.ca)
- AI Overview: present; sources: richmondphysio.ca, pthealth.ca, painfreehealth.janeapp.com, google.com, physiotherapyrichmond.janeapp.com
- People Also Ask: none
- Synergy: organic not in top 10; local pack not in pack

| # | Domain | Ranking URL |
|---|---|---|
| 1 | richmondphysio.ca | https://richmondphysio.ca/contact-us/ |
| 2 | richmondphysio.ca | https://richmondphysio.ca/service/pre-and-post-surgical-rehabilitation/ |
| 3 | lifemark.ca | https://www.lifemark.ca/clinics/richmond/richmond-health-science-centre/coverage-options?serviceId=&locationId=&brand=1&locale=en&booking_origin=unknown&page=1 |
| 4 | medimap.ca | https://medimap.ca/clinic/physiotherapists/bc/richmond/richmond-steveston-physiotherapy-and-sports-injury-clinic |
| 5 | medimap.ca | https://medimap.ca/clinic/physiotherapists/bc/richmond/cbi-richmond-bc |
| 6 | torontowellnessphysiocenter.ca | https://torontowellnessphysiocenter.ca/programs/work-injuries-wsib/ |
| 7 | pthealth.ca | https://www.pthealth.ca/services/physiotherapy/injuries/workplace-injury-rehabilitation/ |
| 8 | torontowellnessphysiocenter.ca | https://torontowellnessphysiocenter.ca/programs/personal-injury/ |
| 9 | trinitychirohealth.ca | https://www.trinitychirohealth.ca/work-injury-richmond-hill/ |
| 10 | coasttherapy.ca | https://coasttherapy.ca/physiotherapy/work-injuries/ |

### Langley

#### `worksafebc physiotherapy langley` (location: Langley BC), SE Ranking task 264767635, crawled 2026-11-02 06:47:43

- SERP features: people_also_ask, related_searches
- Local pack: none returned
- AI Overview: none
- People Also Ask: Do you need a doctor's referral to see a physiotherapist in BC?; Is WorkSafeBC a government job?; What is the 80-20 rule in physiotherapy?; How to get 5 free physio sessions?
- Synergy: organic #9, #10; local pack not in pack

| # | Domain | Ranking URL |
|---|---|---|
| 1 | realignchirophysio.ca | https://realignchirophysio.ca/services/physiotherapy-in-langley/ |
| 2 | worksafebc.com | https://www.worksafebc.com/resources/health-care-providers/guides/physiotherapy-provider-list/fraser-valley?lang=en&direct |
| 3 | beyondphysiotherapy.ca | https://beyondphysiotherapy.ca/physiotherapy-langley |
| 4 | physiodistrict.ca | https://physiodistrict.ca/services/physiotherapy/wcb/ |
| 5 | procarephysioclinic.ca | https://www.procarephysioclinic.ca/ |
| 6 | realignchirophysio.ca | https://realignchirophysio.ca/worksafebc-claims-faq-your-guide-to-injury-recovery-in-aldergrove-langley/ |
| 7 | beyondphysiotherapy.ca | https://beyondphysiotherapy.ca/worksafe-icbc |
| 8 | worksafebc.com | https://www.worksafebc.com/resources/health-care-providers/guides/physiotherapy-provider-list/interior-okanagan?lang=en&direct |
| 9 | synergyrehabilitation.ca | https://synergyrehabilitation.ca/worksafebc-physiotherapy-what-is-covered/ |
| 10 | synergyrehabilitation.ca | https://synergyrehabilitation.ca/worksafebc-physiotherapy-what-is-covered/ |

#### `wcb physio langley` (location: Langley BC), SE Ranking task 264767638, crawled 2026-11-02 07:02:39

- SERP features: local_pack, reviews, people_also_ask, related_searches
- Local pack: 1. Beyond Physiotherapy (beyondphysiotherapy.ca); 2. Langley Physio & Massage Clinic (langleyphysiotherapy.com); 3. Willow Wellness Physio & Massage Clinic (willowwellnessphysio.ca)
- AI Overview: none
- People Also Ask: What is a physiotherapist in Canada?; What is the 80-20 rule in physiotherapy?; How to get 5 free physio sessions?; Is physio free in BC?
- Synergy: organic not in top 10; local pack not in pack

| # | Domain | Ranking URL |
|---|---|---|
| 1 | medimap.ca | https://medimap.ca/clinics/physiotherapists/bc/langley |
| 2 | facebook.com | https://www.facebook.com/pthealthgloverphysiotherapy/ |
| 3 | reviverehab.ca | https://www.reviverehab.ca/direct-billing-langley |
| 4 | arzmassage.ca | https://arzmassage.ca/icbc-physiotherapy-langley-willoughby-yorkson/ |
| 5 | medimap.ca | https://medimap.ca/clinic/physiotherapists/bc/langley/cbi-sports-injury-centre |
| 6 | bcphysio.org | https://bcphysio.org/clinics/langley-memorial-hospital-physiotherapy-department |
| 7 | bcmedicalaccess.ca | https://bcmedicalaccess.ca/physiotherapy/langley |
| 8 | medimap.ca | https://medimap.ca/clinics/physiotherapists/bc/langley-city |
| 9 | willowwellnessphysio.ca | https://willowwellnessphysio.ca/exercise-programs/ |
| 10 | facebook.com | https://www.facebook.com/fb-answers/mva-physiotherapy-clinics-in-langley/?locale=lv_LV |

#### `workplace injury physiotherapy langley` (location: Langley BC), SE Ranking task 264767641, crawled 2026-11-02 07:04:11

- SERP features: ai_overview, local_pack, reviews, people_also_ask, related_searches
- Local pack: 1. Beyond Physiotherapy (beyondphysiotherapy.ca); 2. Olive Physiotherapy & Sports Injury Clinic (olivephysio.ca); 3. Langley Physio & Massage Clinic (langleyphysiotherapy.com)
- AI Overview: present; sources: eclipsephysiotherapy.ca, beyondphysiotherapy.ca, healthx.ca, painfreehealth.janeapp.com, google.com, procarephysioclinic.ca, stasisrehab.ca, newleafwellnesscentre.com
- People Also Ask: Are physiotherapist doctors in Canada?; Is a chiropractor better than a physiotherapist?; What is the 80-20 rule in physiotherapy?; What is the average salary of a physiotherapist in Canada?
- Synergy: organic not in top 10; local pack not in pack

| # | Domain | Ranking URL |
|---|---|---|
| 1 | healthx.ca | https://www.healthx.ca/rates/occupational-rehabilitation-for-insurers/ |
| 2 | stasisrehab.ca | https://stasisrehab.ca/blog/worksafebc-vs-icbc-physiotherapy-in-langley-which-claim-applies-to-your-injury/ |
| 3 | beyondphysiotherapy.ca | https://beyondphysiotherapy.ca/physiotherapy-langley |
| 4 | beyondphysiotherapy.ca | https://beyondphysiotherapy.ca/active-rehab/langley |
| 5 | realignchirophysio.ca | https://realignchirophysio.ca/worksafebc-claims-faq-your-guide-to-injury-recovery-in-aldergrove-langley/ |
| 6 | newleafwellnesscentre.com | https://newleafwellnesscentre.com/workplace-injury-physiotherapy |
| 7 | eclipsephysiotherapy.ca | https://eclipsephysiotherapy.ca/ |
| 8 | plusphysio.ca | https://plusphysio.ca/ |
| 9 | opalphysio.ca | https://www.opalphysio.ca/ |
| 10 | reflexphysiobc.com | https://reflexphysiobc.com/physiotherapy-langley-bc/ |

### Abbotsford

#### `worksafebc physiotherapy abbotsford` (location: Abbotsford BC), SE Ranking task 264767773, crawled 2026-11-02 06:49:22

- SERP features: local_pack, people_also_ask, related_searches
- Local pack: 1. WorkSafeBC (worksafebc.com); 2. Abbotsford Sports & Orthopedic Physiotherapy (abbyphysio.com); 3. Abbotsford Physio and Massage (abbotsfordphysio.com)
- AI Overview: none
- People Also Ask: Do you need a doctor's referral to see a physiotherapist in BC?; What is the 80-20 rule in physiotherapy?; Should you go straight to physio for muscle pain or GP?; Is it hard to become a physiotherapist?
- Synergy: organic not in top 10; local pack not in pack

| # | Domain | Ranking URL |
|---|---|---|
| 1 | beyondphysiotherapy.ca | https://beyondphysiotherapy.ca/physiotherapy-abbotsford |
| 2 | newleafwellnesscentre.com | https://newleafwellnesscentre.com/workplace-injury-physiotherapy |
| 3 | beyondphysiotherapy.ca | https://beyondphysiotherapy.ca/health-blog/workplace-injury-physiotherapy-abbotsford |
| 4 | beyondphysiotherapy.ca | https://beyondphysiotherapy.ca/icbc/abbotsford |
| 5 | worksafebc.com | https://www.worksafebc.com/resources/health-care-providers/guides/physiotherapy-provider-list/sea-to-sky-sunshine-coast?lang=en&direct |
| 6 | beyondphysiotherapy.ca | https://beyondphysiotherapy.ca/active-rehab/abbotsford |
| 7 | worksafebc.com | https://www.worksafebc.com/resources/health-care-providers/guides/eapp-provider-list/fraser-valley?lang=en |
| 8 | coasttherapy.ca | https://coasttherapy.ca/physiotherapy/work-injuries/ |
| 9 | abbotsfordphysio.com | https://www.abbotsfordphysio.com/services |
| 10 | alliedphysio.ca | https://alliedphysio.ca/everything-you-need-to-know-about-worksafebc-wsbc-physiotherapy-treatment/ |

#### `wcb physio abbotsford` (location: Abbotsford BC), SE Ranking task 264767776, crawled 2026-11-02 07:04:52

- SERP features: ai_overview, local_pack, reviews, people_also_ask, image_in_block, related_searches
- Local pack: 1. West Coast Physiotherapy (westcoastphysiotherapy.ca); 2. Abbotsford Sports & Orthopedic Physiotherapy (abbyphysio.com); 3. Abbotsford Physio and Massage (abbotsfordphysio.com)
- AI Overview: present, no sources listed
- People Also Ask: Is there a WorkSafe physiotherapy clinic in Abbotsford?; How to get 5 free physio sessions?; Can you get free physio in BC?; What is the 80-20 rule in physiotherapy?
- Synergy: organic not in top 10; local pack not in pack

| # | Domain | Ranking URL |
|---|---|---|
| 1 | worksafebc.com | https://www.worksafebc.com/resources/health-care-providers/guides/physiotherapy-provider-list/fraser-valley?lang=en&direct |
| 2 | abbotsfordphysio.com | https://www.abbotsfordphysio.com/ |
| 3 | reviverehab.ca | https://www.reviverehab.ca/locations/abbotsford/clearbrook |
| 4 | legendphysio.ca | https://www.legendphysio.ca/worksafebc-physiotherapy-abbotsford/ |
| 5 | worksafebc.com | https://www.worksafebc.com/resources/health-care-providers/guides/concussion-vestibular-physiotherapy-provider-list/fraser-valley?lang=en&direct |
| 6 | townlinephysio.com | https://www.townlinephysio.com/worksafebc-physiotherapy |
| 7 | beyondphysiotherapy.ca | https://beyondphysiotherapy.ca/physiotherapy-abbotsford |
| 8 | newleafwellnesscentre.com | https://newleafwellnesscentre.com/workplace-injury-physiotherapy |
| 9 | backinmotionhealth.com | https://backinmotionhealth.com/locations/abbotsford/physiotherapy-abbotsford/ |
| 10 | newleafwellnesscentre.com | https://newleafwellnesscentre.com/workplace-injury-physiotherapy |

#### `workplace injury physiotherapy abbotsford` (location: Abbotsford BC), SE Ranking task 264767779, crawled 2026-11-02 07:04:34

- SERP features: local_pack, reviews, people_also_ask, related_searches
- Local pack: 1. Abbotsford Sports & Orthopedic Physiotherapy (abbyphysio.com); 2. Get Well Physiotherapy and Sports Injury Clinic (getwellphysiotherapy.org); 3. Prestige Physiotherapy and Sports Medicine South Fraser Way (prestigephysio.com)
- AI Overview: none
- People Also Ask: Are physiotherapist doctors in Canada?; Is a chiropractor better than a physiotherapist?; What is the 80-20 rule in physiotherapy?; Should you go straight to physio for muscle pain or GP?
- Synergy: organic not in top 10; local pack not in pack

| # | Domain | Ranking URL |
|---|---|---|
| 1 | beyondphysiotherapy.ca | https://beyondphysiotherapy.ca/physiotherapy/abbotsford |
| 2 | reviverehab.ca | https://www.reviverehab.ca/active-rehab-abbotsford |
| 3 | legendphysio.ca | https://www.legendphysio.ca/conditions/hand-wrist-therapy/ |
| 4 | legendphysio.ca | https://www.legendphysio.ca/icbc-abbotsford/ |
| 5 | beyondphysiotherapy.ca | https://beyondphysiotherapy.ca/active-rehab/abbotsford |
| 6 | montrosephysio.com | https://montrosephysio.com/physiotherapy-conditions/work-injuries/ |
| 7 | reformpt.ca | https://reformpt.ca/physiotherapy-for-work-related-injuries/ |
| 8 | newleafwellnesscentre.com | https://newleafwellnesscentre.com/physio-directed-active-rehab-helping-you-live-and-work-better |
| 9 | reviverehab.ca | https://www.reviverehab.ca/locations/abbotsford/clearbrook/areas/physiotherapy-in-abbotsford-near-mill-lake-sevenoaks-revive-rehab |
| 10 | physiowhiterock.ca | https://physiowhiterock.ca/service/work-place-injuries/ |

### New Westminster

#### `worksafebc physiotherapy new westminster` (location: New Westminster BC), SE Ranking task 264768130, crawled 2026-11-02 06:48:25

- SERP features: local_pack, people_also_ask, related_searches
- Local pack: 1. Launch Rehab (launchrehab.ca); 2. New West Physio (newwestpt.ca); 3. WCB-WestMinster (wcbnewwestminster.ca)
- AI Overview: none
- People Also Ask: How do WorkSafeBC claims work?; What is the 80-20 rule in physiotherapy?; Should you go straight to physio for muscle pain or GP?; Can you get free physio in BC?
- Synergy: organic #3, #4; local pack not in pack

| # | Domain | Ranking URL |
|---|---|---|
| 1 | launchrehab.ca | https://launchrehab.ca/coquitlam/worksafebc-physiotherapy/ |
| 2 | northvancouverphysio.ca | https://northvancouverphysio.ca/everything-you-need-to-know-about-worksafebc-wsbc-physiotherapy-treatment/ |
| 3 | synergyrehabilitation.ca | https://synergyrehabilitation.ca/physiotherapy-in-new-west/ |
| 4 | synergyrehabilitation.ca | https://synergyrehabilitation.ca/worksafebc-physiotherapy-what-is-covered/ |
| 5 | worksafebc.com | https://www.worksafebc.com/resources/health-care-providers/guides/physiotherapy-provider-list/metro-vancouver?lang=en?direct |
| 6 | launchrehab.ca | https://launchrehab.ca/worksafebc-physiotherapy/worksafebc-extensions/ |
| 7 | newwestwellness.ca | https://www.newwestwellness.ca/ |
| 8 | coasttherapy.ca | https://coasttherapy.ca/physiotherapy/work-injuries/ |
| 9 | nwsm.ca | https://nwsm.ca/patient-education/frequently-asked-questions |
| 10 | newwestwellness.ca | https://www.newwestwellness.ca/ |

#### `wcb physio new westminster` (location: New Westminster BC), SE Ranking task 264768133, crawled 2026-11-02 07:06:02

- SERP features: ai_overview, people_also_ask, related_searches
- Local pack: none returned
- AI Overview: present; sources: pranaphysiotherapy.ca, synergyrehabilitation.ca, nwsm.ca, google.com, lifemark.ca, pthealth.ca, cambiephysiotherapy.com
- People Also Ask: How to get 5 free physio sessions?; Can you get free physio in BC?; What is the 80-20 rule in physiotherapy?; What is WSBC physio?
- Synergy: organic #3; local pack not in pack

| # | Domain | Ranking URL |
|---|---|---|
| 1 | worksafebc.com | https://www.worksafebc.com/resources/health-care-providers/guides/physiotherapy-provider-list/metro-vancouver?lang=en&direct |
| 2 | pranaphysiotherapy.ca | https://pranaphysiotherapy.ca/ |
| 3 | synergyrehabilitation.ca | https://synergyrehabilitation.ca/physiotherapy-in-new-west/ |
| 4 | lifemark.ca | https://www.lifemark.ca/clinics/new-westminster/new-westminster-royal-tenth |
| 5 | nwsm.ca | https://nwsm.ca/patient-education/frequently-asked-questions |
| 6 | pandaclinic.ca | https://pandaclinic.ca/worksafe-physio-new-westminster |
| 7 | newwestpt.ca | https://www.newwestpt.ca/ |
| 8 | cambiephysiotherapy.com | https://www.cambiephysiotherapy.com/new-westminster-bc/ |
| 9 | mountainviewhealth.ca | https://www.mountainviewhealth.ca/ |
| 10 | columbiaintegratedhealth.com | https://columbiaintegratedhealth.com/physiotherapy/ |

#### `workplace injury physiotherapy new westminster` (location: New Westminster BC), SE Ranking task 264768136, crawled 2026-11-02 06:50:04

- SERP features: ai_overview, local_pack, reviews, people_also_ask, related_searches, images
- Local pack: 1. Launch Rehab (launchrehab.ca); 2. Assured Health Physiotherapy (kenziewellness.com); 3. Royal City Health and Manual Therapy Inc (newwestminsterphysiotherapy.com)
- AI Overview: present; sources: pranaphysiotherapy.ca, newwestpt.ca, retrievehealthcentre.ca, synergyrehabilitation.ca, cambiephysiotherapy.com, pthealth.ca, painfreehealth.ca
- People Also Ask: What compensation can I get for a workplace injury in BC?; What is the 80-20 rule in physiotherapy?; How to get 5 free physio sessions?; Will WCB pay for physiotherapy?
- Synergy: organic #6; local pack not in pack

| # | Domain | Ranking URL |
|---|---|---|
| 1 | pranaphysiotherapy.ca | https://pranaphysiotherapy.ca/ |
| 2 | newwestpt.ca | https://www.newwestpt.ca/team |
| 3 | cambiephysiotherapy.com | https://www.cambiephysiotherapy.com/new-westminster-bc/ |
| 4 | mountainviewhealth.ca | https://www.mountainviewhealth.ca/ |
| 5 | retrievehealthcentre.ca | https://retrievehealthcentre.ca/blog-icbc-worksafebc-physiotherapy-new-westminster/ |
| 6 | synergyrehabilitation.ca | https://synergyrehabilitation.ca/physiotherapy-in-new-west/ |
| 7 | royalcityphysio.com | https://www.royalcityphysio.com/ |
| 8 | facebook.com | https://www.facebook.com/bestclinic.ca/posts/-injured-at-work-in-surrey-or-new-westminster-and-worried-about-going-backwill-m/1771144371687036/ |
| 9 | pthealth.ca | https://www.pthealth.ca/clinic/motion-physiotherapy-pt-health/ |
| 10 | painfreehealth.ca | https://painfreehealth.ca/queensborough-new-westminster/ |

### Delta

#### `worksafebc physiotherapy delta` (location: Delta BC), SE Ranking task 264779098, crawled 2026-11-02 07:06:24

- SERP features: local_pack, people_also_ask, related_searches, images
- Local pack: 1. Delta Rise Physiotherapy & Sports Clinic (deltarisephysio.ca); 2. Sunstone Delta Physiotherapy Clinic (sunstonephysio.ca); 3. South Delta Physiotherapy Clinic (southdeltaphysio.com)
- AI Overview: none
- People Also Ask: Can you get free physio in BC?; What is the 80-20 rule in physiotherapy?; Should you go straight to physio for muscle pain or GP?; What is the average salary for a physiotherapist in Canada?
- Synergy: organic not in top 10; local pack not in pack

| # | Domain | Ranking URL |
|---|---|---|
| 1 | saliusphysiotherapy.com | https://saliusphysiotherapy.com/looking-for-physiotherapy-in-delta-physiotherapy-in-surrey-bc/physiotherapy |
| 2 | facebook.com | https://www.facebook.com/fb-answers/worksafebc-physiotherapy-port-coquitlam/?locale=fr_FR |
| 3 | eastwestphysiotherapy.janeapp.com | https://eastwestphysiotherapy.janeapp.com/locations/worksafebc-richmond-employees-only |
| 4 | medimap.ca | https://medimap.ca/clinic/physiotherapists/bc/delta/south-delta-physiotherapy-clinic |
| 5 | southdeltaphysio.janeapp.com | https://southdeltaphysio.janeapp.com/locations/south-delta-physiotherapy-clinic |
| 6 | facebook.com | https://www.facebook.com/fb-answers/worksafebc-physiotherapy-providers/?locale=hu_HU |
| 7 | yelp.ca | https://www.yelp.ca/search?cflt=physicaltherapy&find_loc=Delta%2C+BC |
| 8 | saliusphysiotherapy.com | https://saliusphysiotherapy.com/icbc |
| 9 | medimap.ca | https://medimap.ca/services/worksafebc-physiotherapy |
| 10 | yelp.ca | https://www.yelp.ca/biz/synergy-rehab-delta-delta-2 |

#### `wcb physio delta` (location: Delta BC), SE Ranking task 264768220, crawled 2026-11-02 07:03:00

- SERP features: local_pack, reviews, people_also_ask
- Local pack: 1. Delta Rise Physiotherapy & Sports Clinic (deltarisephysio.ca); 2. ALL CARE Physio , Chiro, Massage , Sports injuries (allcarephysio.ca); 3. Synergy Rehab Delta (synergyrehabilitation.ca)
- AI Overview: none
- People Also Ask: Can you get free physio in BC?; What is the 80-20 rule in physiotherapy?; How to get 5 free physio sessions?; Should you go straight to physio for muscle pain or GP?
- Synergy: organic not in top 10; local pack #3

| # | Domain | Ranking URL |
|---|---|---|
| 1 | medimap.ca | https://medimap.ca/clinic/massage-therapists/bc/delta/nordel-physiotherapy-and-sports-cl |
| 2 | medimap.ca | https://medimap.ca/clinic/physiotherapists/bc/delta/fountain-wellness |
| 3 | southdeltaphysio.janeapp.com | https://southdeltaphysio.janeapp.com/locations/south-delta-physiotherapy-clinic |
| 4 | yelp.ca | https://www.yelp.ca/search?cflt=physicaltherapy&find_loc=Tsawwassen%2C+Delta%2C+BC |
| 5 | medimap.ca | https://medimap.ca/clinics/physiotherapists/bc/north-delta |
| 6 | wcbcloverdale.ca | https://wcbcloverdale.ca/ |
| 7 | clinics.completeconcussions.com | https://clinics.completeconcussions.com/in/delta-bc-ca |
| 8 | fresha.com | https://www.fresha.com/lvp/delta-rise-physiotherapy-sports-clinic-80-avenue-delta-zn2j3o |
| 9 | mapquest.com | https://www.mapquest.com/ca/british-columbia/kevin-schalk-physiotherapist-359619009 |
| 10 | wellnessliving.com | https://www.wellnessliving.com/explore/locations/physiotherapy/ca-bc-delta/therapexhealthcentre/ |

#### `workplace injury physiotherapy delta` (location: Delta BC), SE Ranking task 264768223, crawled 2026-11-02 06:50:04

- SERP features: local_pack, reviews, related_searches
- Local pack: 1. Delta Rise Physiotherapy & Sports Clinic (deltarisephysio.ca); 2. Synergy Rehab Delta (synergyrehabilitation.ca); 3. Sunstone Delta Physiotherapy Clinic (sunstonephysio.ca)
- AI Overview: none
- People Also Ask: none
- Synergy: organic #2; local pack #2

| # | Domain | Ranking URL |
|---|---|---|
| 1 | fortephysiotherapy.com | https://www.fortephysiotherapy.com/ |
| 2 | synergyrehabilitation.ca | https://synergyrehabilitation.ca/physiotherapy-delta-chiropractor/ |
| 3 | nordelsurreyphysio.ca | https://nordelsurreyphysio.ca/icbc-physiotherapy-treatment-in-nordel-surrey-delta/ |
| 4 | nordelphysioclinic.ca | https://nordelphysioclinic.ca/ |
| 5 | medimap.ca | https://medimap.ca/clinic/physiotherapists/bc/delta/south-delta-physiotherapy-clinic |
| 6 | nordelphysioclinic.ca | https://nordelphysioclinic.ca/services/physiotherapy/ |
| 7 | reformpt.ca | https://reformpt.ca/physiotherapy-for-work-related-injuries/ |
| 8 | newleafwellnesscentre.com | https://newleafwellnesscentre.com/workplace-injury-physiotherapy |
| 9 | deltaphysiotherapy.ca | https://www.deltaphysiotherapy.ca/step-by-step-guide-to-an-effective-physiotherapy-session-at-delta-physiotherapy |
| 10 | deltarisephysio.ca | https://deltarisephysio.ca/contact-us/ |

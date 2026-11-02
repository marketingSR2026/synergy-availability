# 07 · Rank, Search Console and analytics baseline (WorkSafeBC physiotherapy)

Prepared 2026-11-02 for the Synergy Rehabilitation WorkSafeBC local SEO project. This is the "before" picture to measure the WorkSafe pillar and location pages against.

Read-only work. Nothing was created, changed or deleted in SE Ranking, Ahrefs, Semrush, Supermetrics or any other system. No keywords, prompts or competitors were added. No logins were attempted. No patient data was opened or recorded.

**Confidence labels:** **KNOWN** = returned by the tool or source named next to it. **LIKELY** = strongly implied by tool data but not confirmed. **UNKNOWN** = could not be obtained. **ASSUMPTION** = a working assumption that should be checked.

**Companion files**
- `/home/user/synergy-availability/worksafe-seo/data/rank-baseline.csv`: 230 rows. Columns: `keyword, engine/location, position, url, date, source`, plus project, keyword class, map-pack position, target URL and whether it matches, 30-day history (position on 2026-10-03, best, worst, days ranked, distinct URLs, URLs seen), SE Ranking volume, confidence and notes. It holds:
  - all 172 tracked keyword and engine pairs (123 + 49);
  - 11 WorkSafe-type rows from the SE Ranking Canada database;
  - 47 GSC rows (WorkSafe, ICBC, and physio queries with at least 100 impressions).
- `/home/user/synergy-availability/worksafe-seo/research/07-rank-source/`: the raw tool output behind this report (SE Ranking 31-day keyword stats for both projects, the 1,000-row GSC export, and the target-URL map for project 12940679).

---

## 0. Sources and status

| # | Tool / endpoint | What it returned | Status |
|---|---|---|---|
| 1 | SE Ranking `PROJECT_listProjects` | 2 projects. **12903890** `https://synergyrehabilitation.ca/`, `match_mode: subdomain`, 123 keyword and engine pairs. **12940679** `https://synergyrehabilitation.ca/icbc-treatments/`, `match_mode: path`, 49 keywords. Both are checked daily to depth 100. | KNOWN |
| 2 | SE Ranking `PROJECT_getSearchEngines` | 12903890: 9 Google Canada engines (Surrey 34 keywords; Delta, Langley, Vancouver, Burnaby, New Westminster, Richmond and Abbotsford 11 each; Cloverdale 12), business name "Synergy Rehab", map results merged (`merge_map: 2`). 12940679: one engine, Google Canada Vancouver, 49 keywords. | KNOWN |
| 3 | SE Ranking `PROJECT_listKeywords`, `PROJECT_listKeywordGroups` | 12903890: 43 distinct keywords in "General" (20) and "ICBC Treatments" (23); target URL `/icbc-treatments/` on every ICBC keyword. 12940679: groups "General" (10) and "ICBC location pages" (39), with a target URL per keyword. | KNOWN |
| 4 | SE Ranking `PROJECT_getKeywordStats` (2026-11-02, all 10 engines, with landing pages and SERP features; then 2026-10-03 to 2026-11-02 for both projects) | Daily position, map-pack position and landing-URL history for every pair. My hand-copy of the one-day pulls matched the 31-day files on every row (0 mismatches in 172). | KNOWN |
| 5 | SE Ranking `PROJECT_getSummary` | 12903890: today's average position 28, top 5 = 53, top 10 = 71, top 30 = 93, visibility 55.12%, Google index 456, domain trust 44. 12940679: average position 49, top 10 = 21, visibility 0.12%. | KNOWN |
| 6 | SE Ranking `PROJECT_getPositionHistory` | Surrey engine average position 2026-09-11 to 2026-11-02; project 12940679 top-10 count 2026-09-24 to 2026-11-02. | KNOWN |
| 7 | SE Ranking `PROJECT_getGoogleSearchConsole` | 12903890: top 1,000 queries (clicks, impressions, CTR, average position). **No page URLs and no date range are returned.** 12940679: 1 row ("www.synergy", 1 impression). | KNOWN values; date range UNKNOWN |
| 8 | SE Ranking `PROJECT_listCompetitors`, `PROJECT_getAllCompetitorsMetrics` (2026-11-02) | 5 competitors in 12903890 and 20 in 12940679. Top-10 domain visibility for the Surrey engine and for the 12940679 "General" group, which contains `wcb` and `worksafebc`. | KNOWN |
| 9 | SE Ranking `PROJECT_getSeoPotential` (top_n 3) | Modelled traffic if all keywords reached top 3 (Surrey engine 4,514 visits). This is a model, not observed traffic. | KNOWN (model output) |
| 10 | SE Ranking `PROJECT_listLlmEngines`, `PROJECT_getLlmStatistics`, `PROJECT_listPrompts`, `PROJECT_getPromptsRankings` | AI Result Tracker setup and presence scorecards (section 5). The per-prompt rankings came back as 20 unnamed groups with null values. | KNOWN; per-prompt detail Not Available |
| 11 | SE Ranking `DATA_getDomainOverviewByCountry` (ca) | November 2026 snapshot: 3,267 organic keywords, estimated traffic 2,868 a month. | KNOWN |
| 12 | SE Ranking `DATA_getDomainKeywords` (ca; text filters for wcb, worksafe, "work safe", wsbc, "work injur", workplace, "workers comp", occupational, "return to work", "injured at work") | 11 rows (section 2.2). Same result as the earlier site-inventory pull (`research/01-site-inventory.md` §5.1). | KNOWN |
| 13 | SE Ranking `DATA_getAiSearchOverview` (ca, all engines), `DATA_getAiSearchPromptsByTarget` (AI Overview and ChatGPT, WorkSafe text filters) | Brand presence 37, link presence 136, AI opportunity traffic 55. 0 WorkSafe prompts cite the domain on either engine. | KNOWN |
| 14 | SE Ranking `DATA_getSubscription` | Units left: 6,190 before my first DATA call and 5,910 at the end, a drop of **280**, inside the 600-unit budget. The account may be shared with other agents, so the exact share used here is UNKNOWN. The Data API subscription expires **2026-11-06 21:34**. | KNOWN |
| 15 | Ahrefs `management-projects`, `gsc-keywords`, `site-explorer-organic-keywords` | Each returned `HTTP 400 "Insufficient plan"`, tried once each. Ahrefs GSC data (keywords, pages, performance history) is therefore Not Available. | Not Available |
| 16 | Semrush `projects` | `no_api_units`: "The user has an active Semrush subscription, but does not have enough API units to complete this request." Semrush lists https://www.semrush.com/mcp-access for adding units. | Not Available |
| 17 | Supermetrics `get_user_and_team` (get_info) | `LICENSE_NOT_FOUND`: team "Team synergy-rehab" has no subscription that covers Claude. The data tools (`data_source_discovery`, `accounts_discovery`, `data_query`) are not exposed in this session, so it could not be checked whether GSC or GA4 are authenticated. No login link was requested. | Not Available |
| 18 | Earlier project files (read only) | `data/gbp-maps-keyword-positions.csv` (SE Ranking Local map-grid positions, which include WorkSafe terms for 2 clinics), `data/keyword-master.csv` (volumes), `data/locations-master.csv`, `research/01-site-inventory.md` | KNOWN as cited in those files |

---

## 1. Headline findings

1. **No WorkSafe keyword is tracked in a way that could detect a WorkSafe page.** (KNOWN)
   - Project 12903890 (whole site) tracks 0 WorkSafe, WCB or work-injury keywords.
   - Project 12940679 tracks `wcb` (SE Ranking volume 2,400) and `worksafebc` (110,000), but it is path-scoped (`match_mode: path`) to `/icbc-treatments/`. A ranking by `/worksafe-physiotherapy/` would never be counted. Both terms were "not in top 100" on all 31 days.
   - **There is no rank-tracking baseline for WorkSafe today.** It has to start with the keyword set in section 7, which a person needs to approve because adding keywords is a write action.
2. **Synergy has almost no WorkSafe organic visibility.** (KNOWN)
   - In SE Ranking's Canada database, no keyword containing "worksafe" or "wcb" ranks for the domain. The only WorkSafe-type rankings are 11 zero-volume long-tail queries.
   - `/worksafe-physiotherapy/` ranks for one of them: "wsbc physiotherapy burnaby" at #64.
   - In GSC, WorkSafe and WCB queries are 2 of the 1,000 rows: 8 impressions and 1 click, against 78,145 impressions and 5,537 clicks in total.
3. **Cannibalization today is a scatter, not a fight.** (KNOWN)
   - The few WorkSafe-adjacent rankings are split across 5 URLs: `/`, `/worksafe-physiotherapy/`, `/physiotherapy-new-westminster/`, `/occupational-therapy/` and `/physiotherapy-abbotsford-chiropractor/`.
   - There is little equity to protect. The risk is in the future, and the ICBC build shows how it would play out (finding 4).
4. **The ICBC ecosystem shows what to avoid.** (KNOWN, derived from the 31-day SE Ranking landing-page history)
   - In project 12940679, **17 of the 29 targeted keywords that rank use the wrong page.** Examples: "icbc physiotherapy cedar hills" ranks `/icbc-treatments/vancouver/`, and "icbc physiotherapy south surrey" ranks `/icbc-treatments/king-george-surrey/`.
   - In project 12903890, the 103 ICBC keyword and engine pairs averaged **5.0 distinct Synergy URLs in 31 days**, and 80 of the 103 cycled through 3 or more.
   - Google splits ICBC rankings between the new `/icbc-treatments/{slug}/` pages (36 of 93 ranking pairs) and the older `/icbc-physiotherapy-in-{x}/` pages (27 of 93).
5. **ICBC and generic positions to protect.**
   - "icbc physiotherapy" is in the top 7 on all 9 regional engines (#1 in Abbotsford). "icbc physio" is #2 to #8. "car accident physiotherapy" is #2 to #3 everywhere except Abbotsford (#85).
   - The site has only a thin set of generic "physio + city" rankings: "surrey physiotherapy bc" #7, "best physiotherapist surrey" #7, "physiotherapy delta" #11 (ranked by an ICBC page), and the neighbourhood physio terms in 12940679.
   - WorkSafe pages must not take these over (section 7E).
6. **GSC is mostly a brand channel.**
   - Queries containing "synergy" bring 80.6% of clicks (4,461 of 5,537) but only 34.4% of impressions.
   - Large non-brand queries sit just off page one: "massage near me" (5,259 impressions, average position 10.1), "physiotherapy surrey" (1,883 at 12.5) and "icbc physiotherapy" (935 at 13.2, CTR 0.11%).
7. **GA4 is Not Available.** No connector in this session can read it: Supermetrics has no license and Ahrefs reports an insufficient plan. So there is no booking-event or organic landing-page baseline from analytics. This is the largest measurement gap for the project.
8. **No AI visibility tracker is configured for WorkSafe.** The whole-site ChatGPT tracker has 20 prompts (10 general rehab, 10 ICBC) with 22.22% link presence. No WorkSafe prompt cites synergyrehabilitation.ca in SE Ranking's AI Overview or ChatGPT data.

---

## 2. Tracked keywords: current positions and ranking URLs

Positions are Google organic positions on 2026-11-02. "NR" means not in the top 100. "map N" is SE Ranking's map-pack position for the business "Synergy Rehab" in that engine's location; I read `map_position` that way (LIKELY). The full 172-row detail, including every URL seen in 31 days, is in `data/rank-baseline.csv`.

### 2.1 Distribution (KNOWN, `PROJECT_getKeywordStats`)

| Project | Pairs | Top 3 | Top 10 | 11 to 20 | 21 to 100 | NR | Up vs 2026-10-03 | Down | Same |
|---|---|---|---|---|---|---|---|---|---|
| 12903890 whole site (9 engines) | 123 | 36 | 71 | 16 | 25 | 11 | 67 | 33 | 23 |
| 12940679 `/icbc-treatments/` path (Vancouver engine) | 49 | 8 | 21 | 2 | 6 | 20 | 12 | 15 | 22 |

By class:

| Class | 12903890 pairs (top 10 / NR) | 12940679 keywords (top 10 / NR) |
|---|---|---|
| WorkSafe / WCB / work injury | **0 tracked** | 2 (0 / 2) |
| ICBC / motor-vehicle accident | 103 (55 / 10) | 24 (15 / 4) |
| Generic physio (+ city or neighbourhood) | 5 (2 / 1) | 18 (6 / 9) |
| Other services (massage, chiro and so on) | 3 (2 / 0) | 5 (0 / 5) |
| Brand | 12 (12 / 0) | 0 |

**Trend** (KNOWN, `PROJECT_getPositionHistory`):
- Surrey-engine average position went 10 (2026-09-11) → 37 to 48 (2026-09-17 to 09-27) → 15 (2026-11-02). The jump lines up with the "ICBC Treatments" group being created on 2026-09-17, so it is LIKELY a change in which keywords were tracked, not a real drop in rankings.
- Project 12940679 had 1 to 3 keywords in the top 10 through 2026-10-01, then 23 on 2026-10-02, and has held 18 to 27 since. That LIKELY marks when the ICBC location pages were first indexed and ranking, since the earliest landing-URL dates are 2026-10-02.

### 2.2 WorkSafe / WCB / work-injury terms (the target set; KNOWN)

**Tracked in SE Ranking projects**

| Keyword | Project / engine | Position 2026-11-02 | 31-day best | URL | Note |
|---|---|---|---|---|---|
| wcb | 12940679 / Vancouver | NR | NR (0 of 31 days ranked) | none | Path-scoped to `/icbc-treatments/`; non-ICBC URLs are not counted |
| worksafebc | 12940679 / Vancouver | NR | NR (0 of 31 days ranked) | none | Same. Also a navigational term for worksafebc.com, so not a realistic target |

**Untracked rankings found in the SE Ranking Canada database** (`DATA_getDomainKeywords`, source ca, November 2026 snapshot; all have volume 0 and are unchanged from the previous month)

| Keyword | Position | Synergy URL | KD |
|---|---|---|---|
| occupational rehabilitation new west | Local pack #1; organic #21 | `/` | 12 |
| occupational rehabilitation burnaby | 12 and 52 | `/` and `/occupational-therapy/` (two Synergy URLs) | 8 |
| occupational therapy surrey | 20 | `/occupational-therapy/` | 6 |
| occupational rehabilitation new westminster | 28 | `/` | 16 |
| best occupational therapy services in abbotsford | 36 | `/physiotherapy-abbotsford-chiropractor/` | 11 |
| work injury physiotherapy panorama hills | 43 | `/` | 14 |
| wsbc physiotherapy new westminster | 47 | `/physiotherapy-new-westminster/` (legacy city page) | 10 |
| wsbc physiotherapy burnaby | 64 | `/worksafe-physiotherapy/` | 11 |
| workplace injury physio near me | 86 | `/` | 19 |

**GSC** (SE Ranking `PROJECT_getGoogleSearchConsole`; date range not returned)

| Query | Clicks | Impressions | CTR | Avg position |
|---|---|---|---|---|
| wcb physiotherapy cloverdale | 1 | 7 | 14.29% | 6.0 |
| "wcb" "safer workplaces together" | 0 | 1 | 0% | 9.0 |
| occupational therapist | 3 | 65 | 4.62% | 3.05 |
| best occupational therapist near me | 1 | 3 | 33.33% | 7.33 |
| occupational therapist near me | 1 | 2 | 50% | 1.0 |
| occupational therapy langley | 1 | 1 | 100% | 1.0 |

**Map pack (local grid).** This comes from an earlier project file, not from this task's calls. `data/gbp-maps-keyword-positions.csv` (SE Ranking Local, 2026-10-30) already tracks "Worksafe physiotherapy" for 2 clinics:
- New Westminster: average 3.36 when ranked, 25 of 25 grid points in the top 10, #2 at the clinic.
- Newton 72 Ave: average 8.64, 18 of 25 points in the top 10, #3 at the clinic.
- "WCB INJURY" and "Worksafe injury" (Newton) are not in the top 20 at any grid point.

That is the only existing WorkSafe position tracking in the account (KNOWN from that file). See `research/04-local-gbp.md`.

### 2.3 ICBC terms, project 12903890 (whole site, 9 regional engines; KNOWN)

Position on 2026-11-02 by engine location. Every keyword's SE Ranking target URL is `/icbc-treatments/`.

| Keyword | Surrey | Delta | Langley | Vancouver | Burnaby | New West | Richmond | Abbotsford | Cloverdale |
|---|---|---|---|---|---|---|---|---|---|
| icbc treatment | 20 | – | – | – | – | – | – | – | – |
| icbc physiotherapy surrey | 2 | – | – | – | – | – | – | – | 3 (map 1) |
| icbc covered physio | 28 | – | – | – | – | – | – | – | – |
| icbc massage therapy surrey | 5 (map 3) | – | – | – | – | – | – | – | – |
| icbc physio | 2 (map 1) | 3 | 5 | 3 | 5 | 3 | 4 | 8 | 7 (map 1) |
| icbc physiotherapy | 7 | 4 | 6 | 3 | 4 | 7 | 4 | 1 | 5 (map 1) |
| icbc treatment near me | 5 (map 3) | 3 | 13 | 7 | 10 (map 2) | 9 | 13 | 11 | 4 |
| icbc massage | 16 | NR | NR | NR | NR (map 2) | 48 | NR | NR | NR (map 2) |
| icbc chiropractor | 57 | 86 | 16 | 89 | 79 | 65 | 20 | 71 | 17 (map 2) |
| icbc kinesiology | 17 | 21 | 20 | 23 | 77 | 64 | 21 | 62 | 20 |
| icbc claim physiotherapy | 15 | NR | 46 | 11 | 51 | NR (map 3) | 11 | 50 | 52 |
| physio after car accident | 87 | 92 | 2 | NR | 3 | 1 | 4 | 87 | 2 |
| car accident physiotherapy | 2 (map 3) | 2 | 3 | 2 | 2 (map 3) | 2 | 2 | 85 | 2 (map 2) |
| icbc approved physiotherapy | 5 (map 2) | 5 (map 2) | 9 | 7 | 8 (map 3) | 5 | 5 | 7 | 7 (map 2) |
| icbc physiotherapy delta | – | 8 (map 2) | – | – | – | – | – | – | – |
| icbc physiotherapy langley | – | – | 10 | – | – | – | – | – | – |
| icbc physiotherapy vancouver | – | – | – | 4 | – | – | – | – | – |
| icbc physiotherapy burnaby | – | – | – | – | 28 (map 2) | – | – | – | – |
| icbc physiotherapy new westminster | – | – | – | – | – | 7 | – | – | – |
| icbc physiotherapy richmond | – | – | – | – | – | – | 22 | – | – |
| icbc physiotherapy abbotsford | – | – | – | – | – | – | – | 5 | – |
| icbc physiotherapy cloverdale | – | – | – | – | – | – | – | – | 2 (map 1) |

**Which URLs rank for ICBC terms** (93 ranking pairs on 2026-11-02, latest landing URL; KNOWN):

| URL family | Ranking pairs |
|---|---|
| ICBC hub location pages `/icbc-treatments/{slug}/` | 36 |
| Older ICBC city pages `/icbc-physiotherapy-in-{nordel, cedar-hills, clayton-heights, vancouver, richmond}/` | 27 |
| `/recovery-after-a-car-accident-physiotherapy-solutions-in-surrey-bc/` (blog) | 12 |
| ICBC hub `/icbc-treatments/` (the target) | 6 |
| `/motor-vehicle-accident-care/` | 5 |
| `/icbc-physiotherapy-in-bc-what-youre-entitled-to-after-a-car-accident/` (blog) | 3 |
| `/icbc-claims/`, `/physiotherapy-in-richmond/`, `/tag/abbotsford/`, `/cloverdale-physio/` | 1 each |

The target hub ranks in only 6 of 93 pairs. Google mostly picks a location page, often for a different clinic than the query names. Example: "icbc physiotherapy" on the Langley engine ranks `/icbc-physiotherapy-in-vancouver/`.

### 2.4 ICBC location pages and neighbourhood physio terms, project 12940679 (Vancouver engine; KNOWN)

"Match" compares the latest ranking URL with the target URL set in SE Ranking.

| Keyword | Class | Pos 2026-11-02 | Pos 2026-10-03 | Best 30d | Days ranked /31 | Target URL (SE Ranking) | Ranking URL (latest) | Match | Distinct URLs 30d | SE Ranking volume |
|---|---|---|---|---|---|---|---|---|---|---|
| massage | generic other service | NR | NR | NR | 0/31 | `(none set)` | `none` | – | 0 | 301000 |
| chiropractic | generic other service | NR | NR | NR | 0/31 | `(none set)` | `none` | – | 0 | 18100 |
| acupuncture | generic other service | NR | NR | NR | 0/31 | `(none set)` | `none` | – | 0 | 49500 |
| kinesiology | generic other service | NR | NR | NR | 0/31 | `(none set)` | `none` | – | 0 | 40500 |
| massage surrey | generic other service | NR | NR | NR | 0/31 | `(none set)` | `none` | – | 0 | 2400 |
| east clayton physiotherapy | generic physio (+city) | 1 | 2 | 1 | 30/31 | `/icbc-treatments/clayton-corners-surrey/` | `/icbc-treatments/clayton-corners-surrey/` | yes | 1 | 0 |
| strawberry hill physiotherapy | generic physio (+city) | 5 | NR | 3 | 29/31 | `/icbc-treatments/strawberry-hill-surrey/` | `/icbc-treatments/strawberry-hill-surrey/` | yes | 1 | 10 |
| clayton heights physiotherapy | generic physio (+city) | 5 | NR | 5 | 21/31 | `/icbc-treatments/clayton-heights-surrey/` | `/icbc-treatments/clayton-heights-surrey/` | yes | 1 | 390 |
| sullivan heights physiotherapy | generic physio (+city) | 6 | 5 | 4 | 31/31 | `/icbc-treatments/sullivan-heights-surrey/` | `/icbc-treatments/sullivan-heights-surrey/` | yes | 1 | 0 |
| clayton physiotherapy | generic physio (+city) | 7 | NR | 5 | 8/31 | `/icbc-treatments/clayton-heights-surrey/` | `/icbc-treatments/clayton-corners-surrey/` | **no** | 2 | 320 |
| physiotherapy south surrey | generic physio (+city) | 7 | NR | 7 | 4/31 | `/icbc-treatments/south-surrey/` | `/icbc-treatments/south-surrey/` | yes | 1 | 480 |
| fleetwood physiotherapy | generic physio (+city) | 20 | 6 | 5 | 24/31 | `/icbc-treatments/fleetwood-surrey/` | `/icbc-treatments/fleetwood-surrey/` | yes | 1 | 110 |
| cedar hills physiotherapy | generic physio (+city) | 41 | 13 | 13 | 26/31 | `/icbc-treatments/cedar-hills-surrey/` | `/icbc-treatments/cedar-hills-surrey/` | yes | 1 | 40 |
| new west physio | generic physio (+city) | 49 | NR | 17 | 6/31 | `/icbc-treatments/new-westminster/` | `/icbc-treatments/new-westminster/` | yes | 1 | 10 |
| physiotherapy | generic physio (+city) | NR | NR | NR | 0/31 | `(none set)` | `none` | – | 0 | 0 |
| surrey physio | generic physio (+city) | NR | NR | NR | 0/31 | `(none set)` | `none` | – | 0 | 0 |
| physiotherapy vancouver | generic physio (+city) | NR | NR | NR | 0/31 | `/icbc-treatments/vancouver/` | `none` | – | 0 | 3200 |
| physiotherapy burnaby | generic physio (+city) | NR | NR | NR | 0/31 | `/icbc-treatments/burnaby/` | `none` | – | 0 | 0 |
| physiotherapy richmond | generic physio (+city) | NR | NR | NR | 0/31 | `/icbc-treatments/richmond/` | `none` | – | 0 | 70 |
| physiotherapy 88 avenue surrey | generic physio (+city) | NR | NR | NR | 0/31 | `/icbc-treatments/nordel-surrey/` | `none` | – | 0 | 0 |
| physiotherapy surrey city centre | generic physio (+city) | NR | NR | 9 | 2/31 | `/icbc-treatments/central-city-surrey/` | `/icbc-treatments/nordel-surrey/` | – | 2 | 0 |
| physiotherapy fleetwood | generic physio (+city) | NR | 7 | 7 | 19/31 | `/icbc-treatments/fleetwood-surrey/` | `/icbc-treatments/fleetwood-surrey/` | – | 1 | 110 |
| physiotherapy langley | generic physio (+city) | NR | NR | NR | 0/31 | `/icbc-treatments/langley/` | `none` | – | 0 | 30 |
| icbc physiotherapy cedar hills | icbc/mva | 1 | 1 | 1 | 30/31 | `/icbc-treatments/cedar-hills-surrey/` | `/icbc-treatments/vancouver/` | **no** | 3 | 0 |
| icbc physiotherapy strawberry hill | icbc/mva | 1 | 1 | 1 | 30/31 | `/icbc-treatments/strawberry-hill-surrey/` | `/icbc-treatments/strawberry-hill-surrey/` | yes | 2 | 0 |
| icbc physiotherapy cloverdale | icbc/mva | 1 | 2 | 1 | 31/31 | `/icbc-treatments/cloverdale-surrey/` | `/icbc-treatments/cloverdale-surrey/` | yes | 1 | 0 |
| icbc physiotherapy newton | icbc/mva | 2 | 2 | 1 | 31/31 | `/icbc-treatments/newton-surrey/` | `/icbc-treatments/newton-surrey/` | yes | 5 | 0 |
| icbc physiotherapy clayton corners | icbc/mva | 2 | 1 | 1 | 31/31 | `/icbc-treatments/clayton-corners-surrey/` | `/icbc-treatments/richmond/` | **no** | 3 | 0 |
| icbc physiotherapy king george | icbc/mva | 3 | 3 | 2 | 29/31 | `/icbc-treatments/king-george-surrey/` | `/icbc-treatments/king-george-surrey/` | yes | 1 | 0 |
| icbc physiotherapy south surrey | icbc/mva | 3 | 4 | 1 | 31/31 | `/icbc-treatments/south-surrey/` | `/icbc-treatments/king-george-surrey/` | **no** | 3 | 0 |
| icbc physiotherapy clayton heights | icbc/mva | 4 | 2 | 2 | 31/31 | `/icbc-treatments/clayton-heights-surrey/` | `/icbc-treatments/sullivan-heights-surrey/` | **no** | 2 | 0 |
| icbc physiotherapy near me | icbc/mva | 4 | 16 | 4 | 31/31 | `/icbc-treatments/` | `/icbc-treatments/south-surrey/` | **no** | 4 | 50 |
| icbc physiotherapy nordel | icbc/mva | 5 | 2 | 2 | 30/31 | `/icbc-treatments/nordel-surrey/` | `/icbc-treatments/central-city-surrey/` | **no** | 4 | 0 |
| icbc physiotherapy fleetwood | icbc/mva | 5 | 2 | 2 | 31/31 | `/icbc-treatments/fleetwood-surrey/` | `/icbc-treatments/south-surrey/` | **no** | 2 | 0 |
| icbc physiotherapy new westminster | icbc/mva | 6 | 6 | 3 | 29/31 | `/icbc-treatments/new-westminster/` | `/icbc-treatments/king-george-surrey/` | **no** | 4 | 0 |
| icbc physiotherapy delta | icbc/mva | 6 | 3 | 3 | 31/31 | `/icbc-treatments/delta/` | `/icbc-treatments/clayton-corners-surrey/` | **no** | 4 | 0 |
| icbc physiotherapy langley | icbc/mva | 7 | 4 | 3 | 31/31 | `/icbc-treatments/langley/` | `/icbc-treatments/` | **no** | 4 | 0 |
| icbc physiotherapy | icbc/mva | 7 | 32 | 1 | 31/31 | `/icbc-treatments/` | `/icbc-treatments/south-surrey/` | **no** | 3 | 320 |
| icbc physiotherapy surrey central | icbc/mva | 17 | NR | 2 | 29/31 | `/icbc-treatments/central-city-surrey/` | `/icbc-treatments/new-westminster/` | **no** | 3 | 0 |
| icbc physiotherapy vancouver | icbc/mva | 24 | 8 | 6 | 31/31 | `/icbc-treatments/vancouver/` | `/icbc-treatments/nordel-surrey/` | **no** | 4 | 10 |
| icbc physiotherapy burnaby | icbc/mva | 28 | 5 | 5 | 30/31 | `/icbc-treatments/burnaby/` | `/icbc-treatments/` | **no** | 2 | 0 |
| icbc physiotherapy richmond | icbc/mva | 44 | 4 | 3 | 31/31 | `/icbc-treatments/richmond/` | `/icbc-treatments/` | **no** | 3 | 10 |
| icbc acupuncture | icbc/mva | 72 | NR | 58 | 26/31 | `/icbc-treatments/` | `/icbc-treatments/cedar-hills-surrey/` | **no** | 2 | 90 |
| icbc | icbc/mva | NR | NR | NR | 0/31 | `(none set)` | `none` | – | 0 | 201000 |
| icbc physiotherapy sullivan heights | icbc/mva | NR | 1 | 1 | 30/31 | `/icbc-treatments/sullivan-heights-surrey/` | `/icbc-treatments/sullivan-heights-surrey/` | – | 1 | 0 |
| icbc physiotherapy abbotsford | icbc/mva | NR | 9 | 5 | 28/31 | `/icbc-treatments/abbotsford/` | `/icbc-treatments/abbotsford/` | – | 1 | 0 |
| icbc counselling | icbc/mva | NR | NR | NR | 0/31 | `/icbc-treatments/` | `none` | – | 0 | 260 |
| wcb | worksafe | NR | NR | NR | 0/31 | `(none set)` | `none` | – | 0 | 2400 |
| worksafebc | worksafe | NR | NR | NR | 0/31 | `(none set)` | `none` | – | 0 | 110000 |

Notes:
- The engine is located in **Vancouver**, so the Surrey neighbourhood queries are measured from outside Surrey (KNOWN engine location). Their positions are LIKELY not what a searcher in Surrey sees.
- `physiotherapy`, `physiotherapy burnaby` and `surrey physio` show SE Ranking volume 0. That LIKELY means missing data, not zero demand: GSC shows "physiotherapy" with 947 impressions and "surrey physio" with 330.

### 2.5 Generic physiotherapy + city terms, brand and other terms, project 12903890 Surrey engine (KNOWN)

| Keyword | Group | Pos 2026-11-02 | Map pack | Pos 2026-10-03 | Best 30d | Ranking URL (latest) | Distinct URLs 30d |
|---|---|---|---|---|---|---|---|
| synergy rehab | General | 1 | – | 1 | 1 | `/` | 1 |
| synergy rehab south surrey | General | 1 | – | 1 | 1 | `/` | 1 |
| synergy nordel | General | 1 | – | 1 | 1 | `/physiotherapy-delta-chiropractor/` | 5 |
| synergy rehab fleetwood | General | 1 | – | 1 | 1 | `/` | 1 |
| synergy rehab central city | General | 1 | – | 1 | 1 | `/` | 1 |
| synergy rehab delta | General | 1 | – | 1 | 1 | `/physiotherapy-delta-chiropractor/` | 1 |
| synergy rehab near me | General | 1 | 1 | 1 | 1 | `/` | 1 |
| synergy sullivan | General | 1 | – | 1 | 1 | `/extp-location/fleetwood-synergy-rehab/` | 2 |
| synergy rehabilitation & sports clinic | General | 1 | 1 | 1 | 1 | `/extp-location/clayton-heights/` | 4 |
| synergy king george | General | 1 | – | 1 | 1 | `/physiotherapy-cloverdale-chiropractor/` | 5 |
| synergy central city | General | 1 | – | 5 | 1 | `/about/` | 3 |
| synergy cloverdale | General | 2 | – | 1 | 1 | `/extp-location/clayton-corners-surrey/` | 4 |
| surrey physiotherapy bc | General | 7 | 2 | 49 | 7 | `/geriatric-physiotherapy-enhancing-mobility-for-seniors-in-surrey-bc/` | 3 |
| best physiotherapist surrey | General | 7 | 2 | NR | 7 | `/surrey-best-physiotherapy/` | 1 |
| physiotherapy delta | General | 11 | – | NR | 10 | `/icbc-treatments/delta/` | 2 |
| physiotherapists surrey bc | General | 19 | 2 | 7 | 6 | `/the-comprehensive-guide-to-physiotherapy-in-surrey-british-columbia/` | 3 |
| best physiotherapy surrey | General | NR | 1 | NR | 60 | `/surrey-specialized-physiotherapy-services/` | 2 |
| massage surrey | General | 1 | – | NR | 1 | `/massage-therapy/` | 2 |
| massage rmt surrey | General | 2 | – | 2 | 1 | `/massage-therapy/` | 2 |
| registered massage therapist surrey | General | 71 | – | 1 | 1 | `/massage-surrey/` | 2 |

Generic physio + city gaps:
- The whole-site project tracks **no** "physiotherapy {city}" term for Vancouver, Burnaby, Richmond, New Westminster, Langley or Abbotsford, although GSC shows demand. For example, "physiotherapy burnaby" has 425 impressions at average position 10.7, "physiotherapy abbotsford" 378 at 14.0, "langley physio" 805 at 6.4 and "physiotherapy richmond" 316 at 16.8.
- Project 12940679 tracks some of these terms, but only `/icbc-treatments/` URLs count there, and they are all NR.
- So the true generic-physio baseline for most cities is UNKNOWN beyond the GSC averages.

---

## 3. Which Synergy URL ranks for WorkSafe queries (cannibalization)

### 3.1 Today (KNOWN: SE Ranking DATA + GSC; the WorkSafeBC article result comes from `research/01-site-inventory.md` §5.1)

| Synergy URL | WorkSafe-type queries it ranks for | Best position | Role in the new build |
|---|---|---|---|
| `/` (homepage) | occupational rehabilitation new west / burnaby / new westminster, work injury physiotherapy panorama hills, workplace injury physio near me | Local pack #1, organic 12 | The homepage WorkSafe module should link to the pillar, not compete with it |
| `/worksafe-physiotherapy/` | wsbc physiotherapy burnaby | 64 | Natural pillar URL (sitewide nav, 352 in-links per 01-site-inventory). Has almost no ranking equity, so it can be rebuilt in place without risk |
| `/physiotherapy-new-westminster/` (legacy city page) | wsbc physiotherapy new westminster | 47 | Will compete with a New Westminster WorkSafe page. Point it at that page with an internal link, or consolidate |
| `/occupational-therapy/` | occupational therapy surrey; occupational rehabilitation burnaby | 20 | Out of WorkSafe physio scope; low risk |
| `/physiotherapy-abbotsford-chiropractor/` | best occupational therapy services in abbotsford | 36 | Clinic page with a "More About Worksafe" section. Medium risk for "worksafe physio abbotsford" |
| `/worksafebc-physiotherapy-what-is-covered/` (blog) | 0 keywords (01-site-inventory, SE Ranking DATA, url exact) | – | Informational support article; link it to the pillar |
| Unknown page (GSC gives no URL) | wcb physiotherapy cloverdale (avg 6.0, 7 impressions) | 6 | LIKELY a Cloverdale clinic or legacy page; check in GSC → Pages |

**Answer:** no WorkSafe or WCB head term (worksafebc physiotherapy, wcb physiotherapy, worksafe physio and so on) has a ranking Synergy URL in SE Ranking's Canada data (KNOWN). The existing long tail is split across 5 URLs. Nothing in it is worth protecting at the expense of a clean architecture (LIKELY).

### 3.2 Forward risk, from ICBC behaviour (KNOWN data, LIKELY interpretation)

- **Wrong-clinic ranking.** 17 of the 29 targeted ICBC keywords that rank in 12940679 rank a different page from their target, usually another clinic's location page:
  - "icbc physiotherapy clayton corners" ranks `/icbc-treatments/richmond/`;
  - "icbc physiotherapy surrey central" ranks `/icbc-treatments/new-westminster/`;
  - "icbc physiotherapy vancouver" ranks `/icbc-treatments/nordel-surrey/`.

  WorkSafe location pages built from the same template will LIKELY behave the same way unless each page carries clearly unique local signals.
- **URL churn.** ICBC pairs in 12903890 averaged 5.0 distinct URLs in 31 days. The worst cases had 10 to 11: "icbc approved physiotherapy" on New Westminster, "icbc physiotherapy surrey" on Cloverdale, and "icbc physiotherapy" on Surrey.
- **Two parallel families.** The older `/icbc-physiotherapy-in-{x}/` pages still win 27 of 93 ranking ICBC pairs against the newer `/icbc-treatments/{slug}/` pages. The WorkSafe build should not leave a second indexable WorkSafe location family. Today that would mean the legacy city pages with WCB copy and the clinic pages with "More About Worksafe" sections.
- **ICBC pages taking generic terms.** `/icbc-treatments/delta/` ranks for generic "physiotherapy delta" (#11). WorkSafe location pages could take generic "physiotherapy {city}" queries the same way. Keep the titles and H1s WorkSafe-led and track the guardrail terms (7E).

---

## 4. Google Search Console (via SE Ranking; KNOWN values, date range UNKNOWN)

**Scope and caveats**
- The SE Ranking export is the top 1,000 queries for project 12903890. It holds 5,537 clicks and 78,145 impressions.
- 610 rows have at least 1 click and 390 have 0 clicks. The order puts every query with 1 or more clicks first (LIKELY), so 0-click WorkSafe queries beyond row 1,000 may exist but are cut off (UNKNOWN).
- There are **no page URLs and no date range**.
- Country scope is UNKNOWN. A GSC export in Drive for one blog page showed US and UK impressions above Canada (`research/03-drive-reports.md`), so the totals LIKELY include non-Canadian traffic.

**Brand share.** The 123 queries containing "synergy" bring 4,461 clicks (80.6%) and 26,852 impressions (34.4%).

### 4.1 WorkSafe queries
See 2.2: 2 WCB rows (8 impressions, 1 click) and 4 occupational-therapist rows. There is **no measurable WorkSafe search demand captured by the site today** (KNOWN).

### 4.2 High-impression, low-CTR queries
Non-brand queries with at least 200 impressions, CTR under 2% and average position 6 or better. The page already appears near the top but gets few clicks. That is LIKELY because map packs and ads push the organic result down, or because the average blends many locations.

| Query | Clicks | Impressions | CTR | Avg pos |
|---|---|---|---|---|
| physiotherapy near me | 34 | 2,122 | 1.60% | 3.66 |
| massage surrey | 22 | 1,317 | 1.67% | 5.65 |
| chiropractor near me | 10 | 998 | 1.00% | 4.81 |
| physiotherapy | 14 | 947 | 1.48% | 3.04 |
| chiropractor | 3 | 457 | 0.66% | 5.33 |
| rmt burnaby | 1 | 447 | 0.22% | 3.11 |
| icbc physiotherapy surrey | 1 | 327 | 0.31% | 5.91 |
| pelvic floor physiotherapy | 4 | 279 | 1.43% | 2.62 |
| physio | 1 | 252 | 0.40% | 3.37 |
| physiotherapist | 3 | 238 | 1.26% | 2.41 |

Large-impression, low-CTR queries further down:

| Query | Clicks | Impressions | CTR | Avg pos |
|---|---|---|---|---|
| massage near me | 46 | 5,259 | 0.87% | 10.11 |
| massage therapy near me | 14 | 1,934 | 0.72% | 14.93 |
| physiotherapy surrey | 20 | 1,883 | 1.06% | 12.53 |
| chiropractor surrey | 2 | 1,035 | 0.19% | 21.42 |
| icbc physiotherapy | 1 | 935 | 0.11% | 13.19 |
| langley physio | 3 | 805 | 0.37% | 6.37 |
| physiotherapy surrey bc | 1 | 500 | 0.20% | 21.87 |
| cold laser therapy | 2 | 486 | 0.41% | 63.26 |

### 4.3 Near page one (average position 8 to 20, at least 100 impressions, non-brand)

| Query | Clicks | Impressions | CTR | Avg pos |
|---|---|---|---|---|
| massage therapy surrey | 42 | 1,547 | 2.71% | 8.51 |
| massage | 30 | 1,427 | 2.10% | 9.19 |
| massage near me | 46 | 5,259 | 0.87% | 10.11 |
| physiotherapy surrey | 20 | 1,883 | 1.06% | 12.53 |
| icbc physiotherapy | 1 | 935 | 0.11% | 13.19 |
| physio near me | 21 | 666 | 3.15% | 13.50 |
| rmt surrey | 15 | 487 | 3.08% | 11.61 |
| rmt new westminster | 5 | 458 | 1.09% | 13.62 |
| physiotherapy burnaby | 6 | 425 | 1.41% | 10.69 |
| physiotherapy abbotsford | 5 | 378 | 1.32% | 14.02 |
| surrey physio | 3 | 330 | 0.91% | 17.52 |
| kinesiology surrey | 2 | 324 | 0.62% | 10.16 |
| physiotherapy richmond | 5 | 316 | 1.58% | 16.84 |
| physiotherapist surrey | 3 | 266 | 1.13% | 9.45 |
| clayton physiotherapy | 4 | 261 | 1.53% | 13.50 |
| icbc physiotherapy langley | 2 | 259 | 0.77% | 10.85 |
| physiotherapy new westminster | 5 | 235 | 2.13% | 10.26 |
| physiotherapy cloverdale | 3 | 209 | 1.44% | 10.75 |
| icbc treatment plan | 1 | 100 | 1.00% | 9.65 |

These are not WorkSafe targets; the project's scope rule says WorkSafe only. They are listed because WorkSafe location pages must not take them over, and as context on how strong the site is per city.

### 4.4 ICBC queries in GSC
- "icbc physiotherapy": 935 impressions at 13.2, 1 click.
- "icbc physiotherapy surrey": 327 at 5.9, 1 click.
- "icbc physiotherapy langley": 259 at 10.9, 2 clicks.
- "icbc treatment plan": 100 at 9.7, 1 click.
- "icbc physiotherapy treatment plan": 17 at 15.1, 1 click.
- "icbc direct billing surrey": 10 at 5.7, 1 click.
- "acupuncture vancouver icbc": 10 at 36.9, 0 clicks.
- "icbc direct billing langley": 5 at 9.2, 1 click.

Together: 1,663 impressions and 8 clicks across 8 queries.

### 4.5 Requested landing-page data (/worksafe-physiotherapy/, /icbc-treatments/, location pages)
**Not Available.** The SE Ranking endpoint returns queries only, and Ahrefs GSC ("Insufficient plan") and Supermetrics (no license) could not be used. The fix is direct GSC access (Performance → Pages, last 3 months, filtered by URL contains `/worksafe` and `/icbc-treatments/`), or a Supermetrics license that covers Claude.

---

## 5. GA4: organic landing performance and booking events

**Not Available** (UNKNOWN whether GA4 is even configured):
- Supermetrics: `LICENSE_NOT_FOUND` for team "Team synergy-rehab", and the data-query tools are not exposed, so GA4 authentication could not be checked.
- Ahrefs: "Insufficient plan" on every call tried.
- No GA4 MCP connector is attached.
- No GA4 export was found in the Drive research (`research/03-drive-reports.md` lists only GSC exports).

Booking happens on `synergyrehab.janeapp.com`, a separate domain. Unless cross-domain measurement or Jane's own analytics integration is set up, GA4 on synergyrehabilitation.ca LIKELY sees only the outbound click to Jane, not completed bookings. The item to check is **ASSUMPTION / UNKNOWN**: whether a GA4 event exists for outbound Jane booking clicks, by page.

What the GA4 baseline needs (a person must set it up or grant access):
1. Organic sessions and engaged sessions by landing page for `/worksafe-physiotherapy/`, `/worksafebc-physiotherapy-what-is-covered/`, `/icbc-treatments/` and `/icbc-treatments/*`, for the last 90 days.
2. Outbound-click events to `synergyrehab.janeapp.com/locations/<slug>/book` by page and by Jane slug.
3. Phone-click (`tel:`) events by page.

The SE Ranking project competitor list (`PROJECT_getAllCompetitorsMetrics`, Surrey engine) gives `synergyrehab.janeapp.com` a visibility score of 59.62. So Jane pages rank on their own (KNOWN), and some bookings may never touch the main site.

---

## 6. AI visibility tracking (KNOWN unless marked)

| Project | Engine (`PROJECT_listLlmEngines`) | Prompts (`PROJECT_listPrompts`) | Presence (`PROJECT_getLlmStatistics`, 2026-10-03 to 11-02) |
|---|---|---|---|
| 12903890 whole site | ChatGPT (ca), id 155491 | 20: 10 general rehab and physio ("Can you recommend a good place for physical therapy in my area?" …) and 10 ICBC ("Can you recommend a physiotherapy clinic that direct bills ICBC?" …). **0 WorkSafe prompts.** | Link presence 22.22%, mention presence 20%, answers with sources 90%. Change vs prior period 0. |
| 12940679 `/icbc-treatments/` path | Google AI Overview (Vancouver) id 164599; Google AI Mode id 164602; ChatGPT id 164605 | 26 on ChatGPT, all general chiropractic, massage and rehab. **0 WorkSafe, 0 ICBC.** | 0% link and 0% mention on all three. AIO "keywords with AI Overview" n/a; organic overlap 0%. LIKELY low partly because the project is path-scoped. |

- Per-prompt rankings: `PROJECT_getPromptsRankings` returned 20 groups labelled "Group ?" with null values, so per-prompt detail is **Not Available** from this endpoint.
- SE Ranking AI Search database (`DATA_getAiSearchOverview`, ca, all engines, November 2026 snapshot): brand presence 37, link presence 136, AI opportunity traffic 55. Average position n/a.
- `DATA_getAiSearchPromptsByTarget` with WorkSafe text filters (worksafe, WorkSafe, wcb, WCB, "work injur", workplace, occupational) returned **total 0** for AI Overview and for ChatGPT.
- Conclusion: there is no AI-visibility baseline for WorkSafe. The starting point is 0 known citations.

---

## 7. Recommended WorkSafe tracking keyword set (not added to SE Ranking)

Adding keywords is a write action, so a person needs to approve it. Nothing below has been added.

**Where to put it**
- Use project **12903890** (whole site, `match_mode: subdomain`) in a new keyword group, for example "WorkSafe", on the existing 9 regional engines. All 19 clinic cities fall under these engines: Surrey, Delta, Langley, Vancouver, Burnaby, New Westminster, Richmond, Abbotsford, Cloverdale.
- Do **not** add WorkSafe terms to 12940679. It only counts `/icbc-treatments/` URLs.
- Optionally, once the WorkSafe URL structure is final, create a separate path-scoped project for the WorkSafe folder. That gives clean folder-level visibility, the way 12940679 does for ICBC.
- Set each keyword's target URL when it is added. The pillar = `/worksafe-physiotherapy/` (**ASSUMPTION**: it is the natural pillar per `research/01-site-inventory.md`, but the architecture is not final). Location terms target the matching WorkSafe location page. Without target URLs, the wrong-page problem in 3.2 cannot be measured.

**Timing.** Add the set at least 2 weeks before the pages launch to get a pre-launch baseline (ASSUMPTION about how long a usable baseline takes). The SE Ranking Data API subscription expires 2026-11-06 (KNOWN, `DATA_getSubscription`). Whether rank tracking stops with it is UNKNOWN, so confirm renewal first or the baseline series may break.

Volumes below are SE Ranking Canada estimates taken from `data/keyword-master.csv`. They are national figures with mostly flat 12-month trends, so LIKELY bucketed. "n/a" means SE Ranking had no data, which does not mean zero demand.

### A. Core head terms: all 9 engines (6 × 9 = 54 pairs)

| Keyword | Volume (CA) | KD | Why |
|---|---|---|---|
| wcb physiotherapy | 210 | 14 | Largest WorkSafe physio term |
| worksafebc physiotherapy | 140 | 21 | Exact head term; the blog article title also targets it |
| worksafebc physio | 140 | 21 | Common short form |
| wcb physiotherapy near me | 140 | 19 | Local transactional |
| worksafebc physiotherapy near me | 40 | 11 | Local transactional |
| wcb approved physiotherapy | 40 | 18 | "Approved" intent, so the page must cover provider status accurately (see claims register) |

### B. Head-term variants: Surrey and Vancouver engines only (5 × 2 = 10 pairs)
`worksafe bc physio` (140, KD 21) · `wsbc physiotherapy` (140, KD 21) · `worksafebc approved physiotherapist` (10, KD 12) · `worksafe physio` (n/a) · `wcb physio` (n/a)

### C. City terms: matching engine only (28 pairs; only for cities with a verified WorkSafe-eligible clinic and page)

| Engine | Keywords | Volume |
|---|---|---|
| Surrey | worksafebc physiotherapy surrey · wcb physiotherapy surrey · worksafe physio surrey | n/a |
| Delta | worksafebc physiotherapy delta · wcb physiotherapy delta · worksafe physio delta | n/a |
| Langley | worksafebc physiotherapy langley · wcb physiotherapy langley · worksafe physio langley | n/a |
| Vancouver | worksafebc physiotherapy vancouver · wcb physiotherapy vancouver · worksafe physio vancouver | n/a |
| Burnaby | worksafebc physiotherapy burnaby · wcb physiotherapy burnaby · worksafe physio burnaby · **wsbc physiotherapy burnaby** (continuity: today #64 via `/worksafe-physiotherapy/`) | n/a / 0 |
| New Westminster | worksafebc physiotherapy new westminster · wcb physiotherapy new westminster · worksafe physio new westminster · **wsbc physiotherapy new westminster** (continuity: today #47 via the legacy `/physiotherapy-new-westminster/`) | n/a / 0 |
| Richmond | worksafebc physiotherapy richmond · wcb physiotherapy richmond · worksafe physio richmond | n/a |
| Abbotsford | worksafebc physiotherapy abbotsford · wcb physiotherapy abbotsford · worksafe physio abbotsford | n/a |
| Cloverdale | **wcb physiotherapy cloverdale** (GSC: average 6.0, 7 impressions) · worksafebc physiotherapy cloverdale | n/a |

### D. Surrey neighbourhood terms, phase 2: Surrey engine only, and only where a WorkSafe page exists for that clinic (up to 10 pairs)
`worksafebc physiotherapy {newton | fleetwood | south surrey | clayton | cedar hills | strawberry hill | sullivan heights | king george | nordel | surrey central}`.

Volume is n/a for all of them. The engine for project 12940679 sits in Vancouver, so neighbourhood positions are better measured from the Surrey engine. For true map-pack behaviour, use SE Ranking Local grids per clinic.

### E. Guardrails: detect WorkSafe pages taking ICBC or generic rankings
- **Keep as is (already tracked; do not change):**
  - `icbc physiotherapy`, `icbc physio` and `car accident physiotherapy` (all 9 engines);
  - `physiotherapy delta`, `surrey physiotherapy bc`, `best physiotherapist surrey` and `physiotherapists surrey bc` (Surrey).
- **Add (9 pairs; the GSC average position shows demand):**
  - physiotherapy surrey (Surrey; 1,883 impressions, 12.5)
  - physiotherapy burnaby (Burnaby; 425, 10.7)
  - physiotherapy abbotsford (Abbotsford; 378, 14.0)
  - physiotherapy richmond (Richmond; 316, 16.8)
  - physiotherapy new westminster (New Westminster; 235, 10.3)
  - physiotherapy cloverdale (Cloverdale; 209, 10.8)
  - langley physio (Langley; 805, 6.4)
  - physiotherapy langley (Langley; 111, 11.1)
  - physiotherapy vancouver (Vancouver; SE Ranking volume 3,200)
- **Alert rule (suggested):** if a guardrail keyword's ranking URL changes to a WorkSafe page, the WorkSafe page is taking generic or ICBC intent. Retune that page's title and H1.

### F. Informational / support: Surrey and Vancouver engines (10 × 2 = 20 pairs; target = pillar FAQ or `/worksafebc-physiotherapy-what-is-covered/`)

| Keyword | Volume | KD |
|---|---|---|
| does worksafebc cover physiotherapy | n/a | n/a |
| do i need a referral for worksafebc physiotherapy | n/a | n/a |
| can i choose my own physiotherapist worksafebc | n/a | n/a |
| how long does worksafebc cover physiotherapy | n/a | n/a |
| physiotherapy direct billing worksafebc | n/a | n/a |
| worksafebc claim physiotherapy | n/a | n/a |
| gradual return to work | 140 | 18 |
| injured at work bc | 40 | 31 |
| workplace injury bc | 50 | 27 |
| return to work program | 70 | 17 (part employer intent; track, do not build a page for it) |

### G. Optional: WCB massage (Surrey engine; only if WorkSafe pages cover WCB massage, which `data/locations-master.csv` lists as bookable at several clinics)
`wcb massage therapy` (30, KD 12) · `worksafebc massage therapy` (20, KD 13) · `wcb approved massage therapy` (20, KD 14)

### H. Do not track as targets
- `worksafebc` (110,000) and `wcb` (2,400): navigational to worksafebc.com, and "WCB" is also the name of other provinces' boards. They are already in 12940679 and can stay as context.
- `worksafebc form 6`, `form 6a`, `claim number`, `teleclaim`, `claim status`, `worksafe bc claim`: claim-administration tasks on worksafebc.com.
- Out-of-province "wcb" terms (Alberta, Saskatchewan and so on).

**Size:** A + B + C + E + F = 54 + 10 + 28 + 9 + 20 = **121 new pairs**. That rises to about 134 with D and G. The account tracks 172 pairs today (KNOWN). The plan's keyword limit is UNKNOWN; check it before adding.

### I. AI Result Tracker prompts (suggested; for the ChatGPT engine 155491 in project 12903890; not added)
1. Which physiotherapy clinics in Surrey, BC direct bill WorkSafeBC?
2. Do I need a doctor's referral to see a physiotherapist for a WorkSafeBC claim?
3. Can I start physiotherapy before my WorkSafeBC claim is accepted?
4. Recommend a WCB physiotherapy clinic in Burnaby.
5. Where can I get WorkSafeBC physiotherapy in Langley or Abbotsford?
6. What does WorkSafeBC cover for physiotherapy after a work injury?
7. Best physio clinic for a workplace injury in New Westminster.
8. How many physiotherapy sessions does WorkSafeBC cover?
9. WorkSafeBC physiotherapy clinic near me in Richmond or Delta.
10. Physiotherapy for gradual return to work in BC.

Note that the AI Overview and AI Mode engines exist only in the path-scoped project 12940679. For a WorkSafe AIO baseline, an AIO engine would need to be added to the whole-site project. That is a write action.

### J. Local grid (SE Ranking Local)
"Worksafe physiotherapy" is already tracked for New Westminster and Newton (2.2). Suggestion: add "wcb physiotherapy" and "worksafe physiotherapy" to every connected location. Only 3 of the 19 GBPs are connected in SE Ranking Local, per `data/locations-master.csv`; connecting the rest is a write action.

---

## 8. Data gaps (Not Available, and why)

| Item | Why | How to fill it |
|---|---|---|
| WorkSafe rank history before today | No WorkSafe terms tracked in the whole-site project; the 2 terms in 12940679 are path-scoped | Add section 7 to 12903890 (needs approval) |
| GSC date range, page URLs, country filter | The SE Ranking endpoint returns only query, clicks, impressions, CTR and position | Direct GSC access, or a Supermetrics license with AI Chats, or Ahrefs on a plan that includes GSC |
| GSC 0-click queries beyond row 1,000 | Export cap | Direct GSC, filtered to "worksafe", "wcb" and "work" |
| GA4 organic landing pages and booking events | Supermetrics `LICENSE_NOT_FOUND` and no data tools; Ahrefs "Insufficient plan"; no GA4 connector | Grant GA4 access (read-only) or license Supermetrics; confirm Jane outbound-click and cross-domain tracking |
| Ahrefs organic keywords and GSC | "Insufficient plan" (tried once per endpoint) | Ahrefs plan upgrade |
| Semrush position tracking or organic data | `no_api_units` | Semrush API units (https://www.semrush.com/mcp-access) |
| AI tracker per-prompt results | `PROJECT_getPromptsRankings` returned unnamed groups with null values | Read in the SE Ranking UI, or retry later |
| Search volume for city and neighbourhood WorkSafe terms | SE Ranking has no data | Google Keyword Planner (not connected), or rely on GSC after launch |
| SE Ranking units used by this task alone | Shared account; the counter lags | SE Ranking API usage log |

---

## 9. Source log (tool calls, in order)

1. SE Ranking `PROJECT_getSearchEngines` (12903890, 12940679); `PROJECT_getSummary` (both)
2. `PROJECT_listKeywords` (both); `PROJECT_getCheckDates` (both, 2026-10-01 to 11-02); `PROJECT_listKeywordGroups` (both)
3. `PROJECT_getKeywordStats` 2026-11-02 with landing pages: 12940679 (engine 407521, with SERP features); 12903890 per engine (389248 with SERP features, then 404062, 404065, 404068, 404071, 404083, 404092, 404095, 404098)
4. `PROJECT_getGoogleSearchConsole` (12903890: 1,000 rows, saved to `research/07-rank-source/ser_gsc_12903890.json`; 12940679: 1 row); `PROJECT_listLlmEngines` (both)
5. `PROJECT_listCompetitors` (both); `PROJECT_getPositionHistory` (12903890 Surrey avg_pos; 12940679 top10)
6. `PROJECT_getLlmStatistics` (155491, 164599, 164602, 164605); `PROJECT_getPromptsRankings` (155491, twice; null series); `PROJECT_listPrompts` (155491, 164605)
7. `DATA_getSubscription` (6,190 units left); `DATA_getDomainOverviewByCountry` (ca); `DATA_getDomainKeywords` (ca, WorkSafe text filters, ordered by position)
8. Ahrefs `management-projects`, `doc` (gsc-keywords), `gsc-keywords`, `site-explorer-organic-keywords`: Insufficient plan on all three data calls
9. Supermetrics `get_user_and_team` get_info: LICENSE_NOT_FOUND. Semrush `projects`: no_api_units
10. `PROJECT_getSeoPotential` (12903890, top_n 3); `PROJECT_getAllCompetitorsMetrics` (12903890 Surrey; 12940679 General group)
11. `PROJECT_getKeywordStats` 2026-10-03 to 2026-11-02 with landing pages (both projects; saved to `research/07-rank-source/`)
12. `DATA_getAiSearchOverview` (ca); `DATA_getAiSearchPromptsByTarget` (ai-overview, chatgpt; WorkSafe filters)
13. `PROJECT_listProjects` (scope check: match_mode); `DATA_getSubscription` (5,910 units left)
14. Read-only reads of project files: `PROJECT-STATE.md`, `research/01-site-inventory.md`, `research/03-drive-reports.md`, `data/keyword-master.csv`, `data/locations-master.csv`, `data/gbp-maps-keyword-positions.csv`, `data/historical-rankings*.csv`
15. Direct fetch (curl, WebFetch): **not attempted**. Blocked per environment policy; no data was needed from it.

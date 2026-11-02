# 06 - Keyword research: WorkSafeBC physiotherapy (BC)

Specialist: Keyword Research Scientist. Run date: 2026-11-02. Scope: WorkSafeBC / WCB / work-injury intent only (per PROJECT-STATE.md scope rule). Generic physiotherapy and ICBC volumes appear **for context only** and are never page targets.

Deliverables:
- `worksafe-seo/data/keyword-master.csv`: 508 keywords, the 14 required columns, one row per keyword.
- `worksafe-seo/research/06-keyword-source/`: raw SE Ranking results per call (`ser_*.tsv`), the merged dataset (`merged.json`) and the script that built the CSV (`build_keyword_master.py`). Every CSV value can be traced back to these files.

Evidence labels: **KNOWN** = a tool returned the value. **LIKELY** = strong indirect evidence. **UNKNOWN** = no tool could supply it. **ASSUMPTION** = my reasoning, still to be tested.

---

## 1. Key findings

1. **WorkSafe physiotherapy demand is real but small. All of it sits in a few unmodified head terms (KNOWN, SE Ranking CA):**
   - "wcb physiotherapy": 210/mo
   - "worksafebc physiotherapy", "worksafebc physio", "worksafe bc physio", "wsbc physiotherapy": 140/mo each
   - "wcb physiotherapy near me": 140/mo
   - "worksafebc physiotherapy near me": 40/mo
   - "wcb approved physiotherapy": 40/mo
   - "worksafebc approved physiotherapist": 10/mo

   The four 140s are identical and flat for 12 months. They are LIKELY one grouped close-variant estimate, so **do not add them together**.
2. **I measured 114 WorkSafe or work-injury terms with a city or neighbourhood in Synergy's area. None of them shows measurable demand (KNOWN).** 109 returned no data and 5 returned 0. The patterns tested were `wcb physiotherapy <geo>`, `worksafebc physiotherapy <geo>`, `worksafe physiotherapy <geo>`, `wcb physio <geo>`, `worksafe physio <geo>`, `wsbc physiotherapy <geo>`, `work injury physiotherapy <geo>`, `occupational rehabilitation <geo>` and others, across all 20 requested geos.
   - The only geo-level evidence comes from first-party data. GSC shows "wcb physiotherapy cloverdale" with 7 impressions at average position 6.0. SE Ranking Local grids track "Worksafe physiotherapy" in Maps for New Westminster (avg 3.36) and Newton (avg 8.64). Both are KNOWN from earlier specialists.
   - **Conclusion:** location pages cannot be justified by exact-match geo keyword volume. They can be justified by local-pack and near-me intent and by genuinely distinct clinic facts (see section 7).
3. **"WCB" volume is national, not BC-only (KNOWN that the database is Canada-wide; the BC share is UNKNOWN).** SE Ranking returns "wcb physiotherapy edmonton" at 40/mo and "wcb approved physiotherapy edmonton" at 10/mo. Alberta, Saskatchewan, Manitoba and others still use the name "WCB". Part of the 210 for "wcb physiotherapy" is therefore probably out of province (LIKELY). The "worksafebc"/"wsbc" spellings are BC-specific.
4. **Many terms near "worksafebc physiotherapy" are searched by physiotherapists, not patients (KNOWN).** These are 17 report, fee-schedule and contract terms with measurable volume, totalling about 730/mo. Examples: "wsbc initial report" 140, "wsbc extension report" 140, "wsbc discharge report" 110, "wcb initial report" 90, "worksafebc physiotherapy fee schedule" 40. All are excluded. The head term "worksafebc physiotherapy" (SE Ranking intent code I) probably has mixed patient and provider intent (LIKELY).
5. **The largest patient-relevant informational demand is about claims and return to work, not physio (KNOWN volumes):**
   - "worksafebc form 6" 210, "worksafebc form 6a" 170, "worksafebc claim number" 110, "wcb claim number" 90, "worksafebc injury report" 70
   - "gradual return to work" 140, "modified duties" 140, "return to work program" 70, "worksafebc return to work" 50
   - "injured at work bc" 40, "workplace injury bc" 50

   These support one claims/coverage guide and one return-to-work article, not more.
6. **Context benchmark (KNOWN):**
   - "icbc physiotherapy" is 320/mo against 210 for "wcb physiotherapy". ICBC geo terms are also mostly 0 or no data (e.g. "icbc physiotherapy surrey" 0, "icbc physiotherapy vancouver" 10).
   - Generic city demand is far larger: "physiotherapy vancouver" 3,200; "physiotherapy surrey" 1,800; "physiotherapy delta" / "delta physiotherapy" / "physio delta" 590 each; "physiotherapy south surrey" 480.
   - GSC, from an earlier specialist: WorkSafe queries are 8 of 78,145 impressions, while "icbc physiotherapy" alone has 935. The site captures almost none of the WorkSafe demand that exists.
7. **Most WorkSafe physio terms show no paid competition (CPC 0, competition 0).** The exceptions are "worksafebc physiotherapy near me" (CPC 1.17, competition 0.89) and "worksafebc approved physiotherapist" (CPC 1.70, competition 0.44). Organic difficulty is low (SE Ranking KD 11-21). Low paid competition is a separate fact from organic difficulty; see section 6.
8. **Tool coverage was limited.**
   - Ahrefs Keywords Explorer: "Insufficient plan".
   - Semrush: `no_api_units`.
   - Google Keyword Planner: not reachable.
   - Google Trends and autocomplete: not reachable.

   **SE Ranking is the only volume source**, so no cross-tool comparison was possible. Each volume in the CSV is labelled with its tool and its precision caveats.

---

## 2. Tools, endpoints and availability

| Tool / endpoint | Status | What it gave | Evidence |
|---|---|---|---|
| SE Ranking `DATA_getKeywordsMetrics` (source `ca`) | **Used** | Volume, CPC, competition, KD, intent codes, 12-month trend. 5 batches, **463 keywords** | KNOWN |
| SE Ranking `DATA_getSimilarKeywords` (seed "wcb physiotherapy", ca) | Used | 7 variants with SERP features | KNOWN |
| SE Ranking `DATA_getRelatedKeywords` (seed "worksafebc physiotherapy", ca) | Used | 29 related terms with SERP features | KNOWN |
| SE Ranking `DATA_getRelatedKeywords` (seed "wcb physiotherapy near me", ca, limit 50) | Used | 50 generic national physio terms ("physio near me" 96,200, "physiotherapist near me" 60,500, Ottawa clinics). Not BC-relevant, so not added to the CSV | KNOWN |
| SE Ranking `DATA_getKeywordQuestions` (seed "worksafebc", ca, limit 100) | Used | 100 questions. 21 patient/claim-relevant ones kept in the CSV. Employer, HR and regulatory questions dropped (e.g. first-aid attendant rules, salaries, silica limits) | KNOWN |
| SE Ranking `DATA_getLongTailKeywords` (seed "wcb", ca, volume ≥ 10) | Used, unusable | Keywords only (no metrics), dominated by Alberta WCB and "A216 WCB" valve-steel terms. Nothing added | KNOWN |
| Ahrefs `keywords-explorer-overview` (country ca) | **Not Available** | HTTP 400 "Insufficient plan" (error -32001). Not retried | KNOWN |
| Ahrefs `keywords-explorer-search-suggestions` (autocomplete proxy) | **Not Available** | HTTP 400 "Insufficient plan". Matching-terms and related-terms not attempted because the same plan gate applies (LIKELY) | KNOWN |
| Ahrefs `subscription-info-limits-and-usage` | Not Available | "Insufficient plan" | KNOWN |
| Semrush `keyword_research` (discovery step) | **Not Available** | `no_api_units`: active subscription without enough API units. trace_id `82e506b42bc85148abf0b9ca4bd26591`. The user can add units at https://www.semrush.com/mcp-access | KNOWN |
| Google Keyword Planner | **Not Available** | No Google Ads keyword-planning tool in this session. The Supermetrics MCP here exposes only guide, utilities, business context, dashboards, social, campaign-management and creative tools. `data_source_discovery`, `data_query` and `campaign_and_resource_get` (needed to reach a Google Ads source and keyword planning) are not loaded, and ToolSearch did not return them. No direct Google Ads connector | KNOWN |
| Google Trends | **Not Available** | Direct fetch blocked by environment policy, and no MCP tool provides it. SE Ranking 12-month trends are the only seasonality signal | KNOWN |
| Google autocomplete | **Not Available** | Direct fetch blocked. The Ahrefs search-suggestions proxy is plan-blocked | KNOWN |
| WebSearch (3 queries) | Used for SERP context only | Result titles and URLs. US-based engine, **not google.ca**, so treat as LIKELY indicators. No volumes | KNOWN (results) / LIKELY (relevance to google.ca) |
| Earlier specialist files (01, 04, data/gbp-maps-keyword-positions.csv, data/historical-rankings.csv) | Read | GSC query rows, Maps grid ranks, GBP search terms, tracked keywords | KNOWN (as cited there) |

**SE Ranking unit usage.** The account balance fell from 8,660 to 6,200 units during this run (2,460). That figure includes any concurrent use by other agents, because the balance is shared and updates with a lag.
- Metrics calls cost about 1 unit per keyword (observed: 198 keywords cost 200 units).
- Discovery endpoints cost far more per returned row (inferred from balance changes; exact pricing UNKNOWN).

The worst case attributable to this task is therefore 2,460 units, within the 2,500 budget. I stopped calling SE Ranking at that point.

---

## 3. Data-quality caveats (read before using any number)

| Issue | Detail | Effect |
|---|---|---|
| Flat 12-month trends | Most WorkSafe rows have an identical value every month (e.g. "wcb physiotherapy" 210 x 12). | Bucketed or modelled estimates. Treat as order of magnitude (LIKELY). |
| National database | SE Ranking `ca` is Canada-wide. No BC or city-level volume is available. | "wcb ..." volumes include other provinces (KNOWN example: "wcb physiotherapy edmonton" 40). |
| Variant grouping | "worksafebc physiotherapy", "worksafebc physio", "worksafe bc physio" and "wsbc physiotherapy" all show 140 with the same KD (21). | LIKELY one grouped estimate. Do not sum. |
| No data vs 0 | 307 rows came back with no data; 38 came back as 0. | Both mean "below the reporting threshold", **not** zero searches. Neither is evidence of real demand. |
| Database gaps | "physiotherapy burnaby" 0, "physio burnaby" 0, "burnaby physiotherapy" 10. "physiotherapy near me" 0, yet the related endpoint gives "physio near me" 96,200. | SE Ranking CA coverage is patchy for some cities and word orders (LIKELY underestimates). Burnaby generic demand is UNKNOWN, not low. |
| Inconsistent row | "worksafe bc" reports 110,000, but its own 12-month trend is 40,500-47,500. | Both values are kept in the CSV. Excluded anyway (navigational). |
| Volatile rows | "physiotherapy surrey": 220 (Apr-May 2026) to 1,800 (Nov 2026). "injured at work": 20-220, then 590 from Aug 2026. "workers compensation bc": 30 to 1,800. "ergonomic assessment": spike Mar-Jul 2026. | Seasonality is unconfirmed without Google Trends (UNKNOWN). |
| Intent codes | SE Ranking codes (I/N/T/C/L) are kept in the CSV Source column. The CSV Intent column is my business classification (ASSUMPTION, rule-based; see the build script). | |
| CPC currency | The API response does not state a currency. | CPC values are shown as returned. |

---

## 4. Clusters by intent

Volumes are SE Ranking CA monthly (KNOWN unless "ND", meaning no data). KD is SE Ranking organic difficulty, 0-100. P = priority from the CSV (definitions in section 7.4).

### 4.1 Core WorkSafeBC physiotherapy head terms: commercial / local

| Keyword | Vol | KD | CPC / comp | SE intent | SERP features (SE Ranking) | P |
|---|---|---|---|---|---|---|
| wcb physiotherapy | 210 | 14 | 0 / 0 | L,C | local_pack, reviews, people_also_ask, sge, related_searches | 1 |
| worksafebc physiotherapy | 140 | 21 | 0 / 0 | I | Not Available (metrics endpoint) | 1 |
| worksafebc physio | 140 | 21 | 0 / 0 | I | video, people_also_ask, sge, related_searches | 1 |
| worksafe bc physio | 140 | 21 | 0 / 0 | I | Not Available | 1 |
| wsbc physiotherapy | 140 | 21 | 0 / 0 | I | video, people_also_ask, sge, related_searches | 1 |
| wcb approved physiotherapy | 40 | 18 | 0 / 0 | L,C | local_pack, reviews, video, people_also_ask, related_searches | 1 |
| worksafebc approved physiotherapist | 10 | 12 | 1.70 / 0.44 | I,N | sitelinks, video, sge, related_searches | 1 |
| worksafe physiotherapy | 0 | 12 | 0 / 0 | I | people_also_ask, related_searches | 2 (the site's own nav label; tracked in Maps) |
| worksafe physio, wcb physio, worksafebc physiotherapist, wcb physiotherapist, worksafe bc physiotherapy, wcb physical therapy, workers compensation physiotherapy | ND | - | - | - | - | 2-3 |

`sge` is SE Ranking's code for a Google AI Overview. Notes:
- A local pack appears on the "wcb" and "approved" variants (KNOWN, SE Ranking).
- The "worksafebc"/"wsbc" spellings lean informational (video, PAA, AI Overview).
- WebSearch for "worksafebc physiotherapy" returned worksafebc.com information sheets, bcphysio.org clinic listings tagged "Sees worksafe patients", go2HR's "WorkSafeBC contracted physiotherapists" page, BCMJ articles and clinic service pages (southislandphysio.ca, pthealth.ca). That is a mixed informational/commercial SERP (LIKELY; US engine).
- **Compliance flag:** "approved" queries invite the claim "WorkSafeBC-approved". Synergy's WorkSafeBC contract or provider status is **UNKNOWN** (04-local-gbp.md, worksafebc.com blocked). Pages must not say "approved" or "contracted" until the claims register verifies it. Answer the query with verifiable facts: WCB appointment types bookable in Jane are KNOWN.

### 4.2 Near-me / implicit local transactional

| Keyword | Vol | KD | CPC / comp | SERP features | P |
|---|---|---|---|---|---|
| wcb physiotherapy near me | 140 | 19 | 0 / 0 | local_pack, reviews, people_also_ask, related_searches | 1 |
| worksafebc physiotherapy near me | 40 | 11 | **1.17 / 0.89** | local_pack, video, people_also_ask, related_searches | 1 |
| work injury clinic near me | 10 | 12 | 0 / 0 | Not Available | 3 |
| workplace injury physio near me | 0 | 19 | 0 / 0 | Not Available | 3 (site's homepage ranks 86, per 01) |
| wcb physio near me, worksafe physio(therapy) near me, worksafebc physio near me, worksafebc physiotherapist near me, wcb physiotherapist near me, wcb approved physiotherapy near me, wcb clinic near me, wcb massage near me, work injury physio(therapy) near me | ND | - | - | - | 2-3 |

These are won mainly through the **local pack**, meaning GBP plus a matching location page. Context: GBP search terms show **no** WorkSafe/WCB term at the 3 connected profiles for May-Oct 2026 (KNOWN, 04-local-gbp.md). The demand above is national. How much of it Synergy's profiles currently see is UNKNOWN.

### 4.3 Geo-modified WorkSafe terms: measurable vs zero/low

All 20 requested geos were tested. A summary per geo is in section 5. Result:

- **Measurable (>0): none** inside Synergy's area. Outside the area: "wcb physiotherapy edmonton" 40 and "wcb approved physiotherapy edmonton" 10 (excluded).
- **Returned 0:** "wsbc physiotherapy burnaby", "wsbc physiotherapy new westminster", "wsbc physiotherapy new west", "occupational rehabilitation burnaby", "occupational rehabilitation new westminster".
- **No data:** the other 109 WorkSafe/work-injury x geo combinations. This includes every seed the brief named, e.g. "wcb physiotherapy surrey".
- **First-party signals (KNOWN, earlier specialists):** "wcb physiotherapy cloverdale" has GSC 7 impressions and 1 click at average position 6.0 (date range not stated). Site rankings: "wsbc physiotherapy burnaby" #64 (/worksafe-physiotherapy/), "wsbc physiotherapy new westminster" #47 (/physiotherapy-new-westminster/). Maps grid: "Worksafe physiotherapy" ranks at all 25 points for New Westminster (avg 3.36) and Newton (avg 8.64). "Work Injury" ranks at 9/25 points for Newton; "WCB INJURY" and "Worksafe injury" are not in the top 20 there.

### 4.4 Coverage and claim process: patient-facing informational

| Keyword | Vol | KD | Note | P |
|---|---|---|---|---|
| worksafebc form 6 | 210 | 30 | Worker's report of injury. Link to WorkSafeBC; do not host forms | 2 |
| worksafebc form 6a | 170 | 30 | Worker's report (alt). Same treatment | 2 |
| worksafebc claim number | 110 | 40 | "Do I need a claim number to book?" FAQ | 2 |
| wcb claim number | 90 | 22 | Same FAQ (national term) | 2 |
| worksafebc injury report | 70 | 36 | How to report: link to WorkSafeBC Teleclaim / online | 2 |
| workplace injury report | 70 | 44 | Mixed employer/worker intent; CPC 2.45 | 2 |
| worksafebc teleclaim | 20 | 50 | FAQ mention | 2 |
| how long does a wcb claim take | 20 | 22 | FAQ (answer only with WorkSafeBC-sourced facts) | 2 |
| worksafebc claim / worksafe bc claim / wcb claim bc | 20 / 20 / 20 | 19 / 45 / 32 | FAQ | 2 |
| worksafebc claim status | 10 | 32 | FAQ (link to WorkSafeBC online services) | 2 |
| wcb claim | 1,100 | **91** | National, multi-province, very hard | 3 |
| what is worksafebc | 260 | 50 | Glossary line on the pillar | 3 |
| is wcb and worksafebc the same thing | 10 | - | Useful one-line FAQ: explains why both names appear on the page | 3 |
| worksafebc physiotherapy no referral, worksafebc claim physiotherapy, does worksafebc/wcb cover physiotherapy, worksafebc physiotherapy coverage / sessions / cost, worksafebc user fee, worksafebc direct billing (physio), do I need a referral for physio in BC, can I choose my own physiotherapist worksafebc, how long does worksafebc cover physiotherapy, what does worksafebc cover for physiotherapy, do I have to pay for physio with worksafebc | **ND** (every one) | - | These are the real booking-decision questions. No measurable volume, but they are the right H2/H3 questions (AEO) for the coverage guide | 2 |

Coverage facts are conflicting (UNKNOWN). In WebSearch, a WorkSafeBC health-care-benefits page summary mentioned a physician referral and "up to six treatments within the first eight weeks". A 2014 BCMJ WorkSafeBC article said no physician referral is required for physiotherapy. Some clinics say "no referral needed". **Do not write session counts or referral rules from keyword research.** Route them to the claims register for verification against current worksafebc.com pages. That site is blocked here, so verification needs another route.

### 4.5 Return to work: informational

| Keyword | Vol | KD | P |
|---|---|---|---|
| gradual return to work | 140 | 18 | 2 |
| modified duties | 140 | 13 | 2 |
| return to work program | 70 | 17 | 2 |
| worksafebc return to work | 50 | 45 | 2 |
| return to work physiotherapy (+ surrey), worksafebc stay at work | ND | - | 3 |

Demand is measurable but partly employer/HR-intent (ASSUMPTION). A physio-angle article can answer what the worker does and how rehab supports a graduated return. It suits one knowledge-hub URL.

### 4.6 Work-injury education

| Keyword | Vol | KD | CPC | Scope | P |
|---|---|---|---|---|---|
| injured at work | 590 | 44 | 2.31 | National; volatile trend | 3 |
| work injury | 590 | 40 | 2.31 | National | 3 |
| workplace injury | 590 | 40 | 2.31 | National | 3 |
| occupational injury | 70 | 32 | 0 | National | 3 |
| workplace injury bc | 50 | 27 | 1.78 | BC | 2 |
| wcb injury | 50 | 40 | 0 | National, falling (110 to 50) | 3 |
| injured at work bc | 40 | 31 | 0.15 | BC | 2 |
| worksafebc injury | 40 | 27 | 0.64 | BC, rising (20 to 40) | 2 |
| hurt at work | 40 | 35 | 2.97 | National (high CPC: LIKELY legal advertisers) | 3 |
| on the job injury | 30 | 24 | 0 | National | 3 |
| worksafebc injury claim | 20 | 0 | 1.63 | BC | 2 |
| concussion at work | 20 | 34 | 0 | National | 3 |
| lifting injury / slip and fall at work / desk job back pain | 10 each | 36 / 5 / 33 | - | National | 3 |
| back / shoulder / knee / neck / wrist injury at work, construction injury (physiotherapy), warehouse injury, nurse back injury, healthcare worker injury, truck driver back pain, construction worker physiotherapy, injured at work what to do, what to do if injured at work bc, work related back pain, workplace back injury | **ND** | - | - | - | 3 |

The occupation-specific and body-part-at-work combinations the brief asked about have no measurable demand (KNOWN no data). Use them as section copy and FAQ examples, not as URLs.

### 4.7 Other WorkSafe services (pillar sections; never standalone pages)

| Keyword | Vol | KD | CPC / comp | Bookable as WCB type in Jane? (04-local-gbp.md) | P |
|---|---|---|---|---|---|
| wcb massage therapy | 30 | 12 | 0.78 / 0.71 | Yes: "WCB Massage Subsequent Session" at 9 clinics (KNOWN) | 2 |
| worksafebc massage therapy | 20 | 13 | 0.82 / 0.78 | same | 2 |
| wcb approved massage therapy | 20 | 14 | 0.59 / 0.81 | same | 2 |
| wcb massage | 0 | 12 | - | same | 3 |
| worksafebc acupuncture, wcb acupuncture | ND | - | - | Nordel only (KNOWN) | 3 (Nordel page section only) |
| worksafebc kinesiology, wcb kinesiology, wcb/worksafebc active rehab | ND | - | - | No WCB kinesiology type listed (KNOWN from Jane list); WorkSafe funding at Synergy UNKNOWN | 3 |
| wcb chiropractor | 20 | 7 | 0 / 0 | No WCB chiropractic type listed | Exclude until verified |
| worksafebc counselling, worksafebc occupational therapy, worksafebc concussion, worksafebc doctor | 10 / ND / ND / ND | - | - | Not a Synergy WorkSafe service per Jane data | Exclude |

### 4.8 Occupational rehab programs (verify the service before any targeting)

| Keyword | Vol | KD | P |
|---|---|---|---|
| work hardening | 480 | 20 | 3 (flat 480; term used mainly in US practice, so a LIKELY US-skewed or modelled estimate) |
| work hardening program | 90 | 5 | 3 |
| occupational rehabilitation | 40 | 12 | 3 |
| functional capacity evaluation | 40 | 26 | 3 (volatile 40-270) |
| occupational rehab | 20 | 11 | 3 |
| work conditioning | 20 | 6 | 3 |
| work rehabilitation / occupational rehabilitation program | 10 each | 35 / 17 | 3 |
| functional restoration program, OR1 program worksafebc, activity based rehabilitation, FCE surrey/vancouver, occupational rehabilitation surrey/vancouver | ND | - | 3 |

Whether Synergy runs WorkSafeBC Occupational Rehabilitation, work-hardening or FCE programs is **UNKNOWN**. No such appointment type appears in the Jane data. Do not target these until the service is confirmed.

### 4.9 Generic injury and active-rehab terms (context; not WorkSafe-specific)

back pain physiotherapy 590, knee physiotherapy 590, concussion physiotherapy 480, active rehab 320, office ergonomics 320 (CPC 1.55 / 0.61), shoulder pain physiotherapy 260, ankle sprain physiotherapy 210, repetitive strain injury 180 (KD 62), sciatica physiotherapy 140, kinesiology surrey 110 (CPC 1.05 / 0.70), active rehab near me 110, repetitive strain injury treatment 90, ergonomic assessment 50 (CPC 2.46). Returned 0: carpal tunnel physiotherapy, tennis elbow physiotherapy. No data: rsi physiotherapy, repetitive strain injury physiotherapy, rotator cuff injury physiotherapy, musculoskeletal injury physiotherapy.

Use RSI, back-lifting and shoulder-overuse examples as **sections** in the WorkSafe pillar ("Common workplace injuries we treat"). The generic body-part terms belong to Synergy's general service pages, not the WorkSafe cluster (scope rule).

### 4.10 Excluded clusters (in the CSV with an "Exclude" priority and the reason)

- **Provider / B2B (17 terms with volume, ~730/mo):** wsbc initial / extension / discharge report, wcb initial report, (wsbc/worksafebc/wcb) physiotherapy fee schedule, physiotherapy contract, physiotherapy reports.
- **WorkSafeBC navigational:** worksafebc 110,000; worksafe bc 110,000 (trend 40,500-47,500); wcb bc 96,200 (KD 93-95).
- **Employer / legal / account tasks:** worksafebc form 7 (480, the employer's report), form 8, form 11, online services (110), phone number, "how long does worksafebc pay", "can you sue / how to fight worksafebc", worksafebc ergonomics.
- **Legal:** work injury lawyer bc (30, CPC 3.71, competition 0.56).
- **Outside Synergy's area:** wcb physiotherapy edmonton / calgary / winnipeg / coquitlam, worksafebc physiotherapy coquitlam.

---

## 5. Geo demand matrix (per clinic area)

"WorkSafe geo terms" covers the patterns `wcb physiotherapy`, `worksafebc physiotherapy`, `worksafe physiotherapy`, `wcb physio` and `worksafe physio` + geo. All returned **no data** (ND), with the exceptions listed in section 4.3. Generic physio and ICBC columns are context only.

| Geo (clinic) | WorkSafe geo terms | physiotherapy <geo> | <geo> physiotherapy | physio <geo> | other generic | icbc physiotherapy <geo> | First-party WorkSafe signal |
|---|---|---|---|---|---|---|---|
| Vancouver | ND | 3,200 | 210 | 720 | physiotherapy kitsilano 210 (no clinic of that name) | 10 | none found |
| Surrey (city) | ND | 1,800 | 480 | 40 | physiotherapy surrey bc 480 | 0 | - |
| Delta | ND | 590 | 590 | 590 | physiotherapy ladner 480 (Delta clinic is not in Ladner; do not target) | ND | none |
| South Surrey | ND | 480 | ND | 480 | physiotherapy white rock 390 (no clinic) | ND | none |
| Langley | ND | 50 | 480 | 50 | physiotherapy langley bc 480; walnut grove 210 (proximity unverified) | ND | none |
| Richmond | ND | 40 | 10 | 10 | physiotherapy richmond bc 320; steveston 90 (proximity unverified) | ND | none |
| Abbotsford | ND | 150 | 10 | 150 | physiotherapy abbotsford bc 10 | ND | GBP connected; no WorkSafe Maps keyword tracked |
| Fleetwood | ND | 110 | 110 | ND | - | ND | none |
| New Westminster | ND (wsbc ... = 0) | 10 | 10 | 10 | physio new west 140 | 0 | Maps "Worksafe physiotherapy" avg 3.36, 25/25 pts; site #47 for "wsbc physiotherapy new westminster" |
| North Delta | ND | 50 | 50 | ND | - | ND | none |
| Newton | ND | ND | ND | 50 | - | ND | Maps "Worksafe physiotherapy" avg 8.64; "Work Injury" 9/25 pts |
| Clayton (2 clinics) | ND | ND | - | - | physiotherapy clayton heights 40 | ND | none |
| Central City | ND | ND | - | - | physiotherapy surrey central 30 (ASSUMPTION that this maps to Central City) | ND | none |
| Cloverdale | ND | 10 | 10 | ND | - | ND | GSC "wcb physiotherapy cloverdale" 7 impr, avg pos 6.0 |
| Burnaby | ND (wsbc ... = 0) | 0 | 10 | 0 | physiotherapy metrotown 10 | 0 | site #64 for "wsbc physiotherapy burnaby". Generic demand LIKELY under-reported (DB gap) |
| Nordel, King George, Cedar Hills, Strawberry Hill, Sullivan Heights | ND | ND | - | - | physiotherapy guildford 480 (no clinic named Guildford; proximity unverified) | ND | none |

Reading:
- Exact-match WorkSafe + geo demand is below the measurement threshold everywhere (KNOWN). It may still exist in small numbers (GSC shows 7 impressions for Cloverdale).
- Generic demand ranks the areas: Vancouver > Surrey > Delta > South Surrey ≈ Langley > Richmond > Abbotsford > Fleetwood. This is LIKELY a reasonable proxy for where local WorkSafe searches also occur (ASSUMPTION: WorkSafe share of physio searches is similar across areas). Use it only to order a rollout, never as a page target.
- Neighbourhood-level generic demand exists only for Fleetwood (110), Newton (50 "physio newton"), Clayton Heights (40), North Delta (50) and South Surrey (480). The others (Nordel, King George, Cedar Hills, Strawberry Hill, Sullivan Heights, Central City) return no data even for generic physio.

---

## 6. CPC and paid competition (not organic difficulty)

SE Ranking "competition" (0-1) is **advertiser density in Google Ads**. "CPC" is the bid estimate. Both are separate from organic ranking difficulty (KD), which comes from the strength of the pages ranking organically.

| Keyword | CPC | Paid comp. | Organic KD | Reading |
|---|---|---|---|---|
| worksafebc physiotherapy near me | 1.17 | 0.89 | 11 | Advertisers bid on the near-me variant; organic is easy (KD 11) |
| worksafebc approved physiotherapist | 1.70 | 0.44 | 12 | Some paid interest |
| worksafebc massage therapy / wcb approved massage therapy / wcb massage therapy | 0.82 / 0.59 / 0.78 | 0.78 / 0.81 / 0.71 | 13 / 14 / 12 | Paid competition on massage variants |
| wcb physiotherapy, worksafebc physiotherapy, worksafebc physio, wsbc physiotherapy, wcb physiotherapy near me, wcb approved physiotherapy | 0 | 0 | 14-21 | No recorded ad bidding; organic difficulty low |
| icbc physiotherapy (context) | 1.82 | 0.37 | 25 | ICBC is more commercial in ads than WorkSafe |
| physiotherapy surrey / physio surrey (context) | 2.16 | 0.59 | 50 / 18 | Generic city terms carry the real ad competition |
| physiotherapy langley / kitsilano / abbotsford bc (context) | 1.59 / 2.67 / 2.15 | 0.60 / 0.86 / 0.61 | 12 / 22 / 22 | same |
| work injury, injured at work, workplace injury | 2.31 | 0.13 | 40-44 | High CPC, low density: LIKELY legal advertisers |
| hurt at work / work injury lawyer bc | 2.97 / 3.71 | 0.26 / 0.56 | 35 / 19 | Legal-intent advertising; excluded |
| workplace injury report / ergonomic assessment / office ergonomics | 2.45 / 2.46 / 1.55 | 0.12 / 0.31 / 0.61 | 44 / 44 / 37 | Employer / HR advertisers |

Takeaways:
1. CPC 0 on most WorkSafe physio terms means no ad history in SE Ranking's sample (KNOWN). It does **not** mean the organic SERP is empty. Organic KD is 11-21, LIKELY easy relative to generic city terms (KD 35-52).
2. The organic SERP for head terms carries local packs, PAA and AI Overviews (KNOWN features). Winning needs local-pack presence (GBP) plus an informative pillar, not ads.
3. No ad spend is recommended or implied here (read-only task).

---

## 7. Recommendation: dedicated URLs vs sections

### 7.1 Principles applied
- One primary keyword cluster per URL (spec/modern-seo-cluster.md, On-page row).
- A dedicated URL needs either measurable demand for a **distinct** intent or a distinct real-world entity (a clinic with its own GBP).
- Geo strings with no measurable volume do not on their own justify a page. That is how doorway pages happen.
- Generic physio and ICBC terms are context only (scope rule).

### 7.2 Proposed keyword-to-page mapping (ASSUMPTION; final architecture belongs to the spec author)

| Page | Primary cluster (vol) | Secondary terms | Why it justifies a URL | Existing URL to reuse (from 01-site-inventory.md) |
|---|---|---|---|---|
| **WorkSafeBC physiotherapy pillar** | worksafebc physiotherapy (140) / wcb physiotherapy (210) | worksafebc physio, wsbc physiotherapy, worksafe physiotherapy, worksafe bc physio, wcb approved physiotherapy (40), worksafebc approved physiotherapist (10); "is wcb and worksafebc the same thing" as a one-line glossary | Largest measurable WorkSafe demand. A local pack appears, so the pillar must link to every clinic page (clinic finder) | `/worksafe-physiotherapy/` (352 in-links, sitewide nav "Worksafe"). Reuse it rather than creating a new URL |
| **Coverage and claim-process guide** | Patient questions: claim number (110 + 90), form 6 / 6a (210 / 170, link out), injury report (70), teleclaim (20), how long a claim takes (20), claim status (10) | The ND booking questions: referral, cost/user fee, direct billing, session limits, choosing a physio | Distinct informational intent with measurable claim-admin demand. Answers belong in one place so the pillar stays transactional | `/worksafebc-physiotherapy-what-is-covered/` (ranks for 0 keywords today). **Change its title/H1 away from the head term "WorkSafeBC physiotherapy"** to avoid competing with the pillar (01 flags this as High risk) |
| **Return-to-work article** | gradual return to work (140), modified duties (140) | return to work program (70), worksafebc return to work (50), return to work physiotherapy (ND) | ~400/mo of measurable, distinct intent (national, partly employer). Physio angle: graded activity, communication with the employer and WorkSafeBC | None identified. New knowledge-hub URL |
| **Injured-at-work first-steps article** (optional, P2) | workplace injury bc (50), injured at work bc (40), worksafebc injury (40) | worksafebc injury claim (20), injured at work / work injury / workplace injury (590 each, national, KD 40-44) | BC-specific "what do I do now" intent that the pillar can't fully answer | None identified. New URL, or merge into the coverage guide if the content team prefers fewer URLs |
| **Location pages, one per verified eligible clinic** | "WorkSafeBC physiotherapy in <Neighbourhood>, <City>" as title/H1 vocabulary | near-me terms (140 + 40), wcb physio <geo> (ND) | **Not keyword-volume driven** (all geo combos ND). Justified because each is a real clinic and GBP landing page with distinct facts: address, WCB types bookable, team, hours, parking, languages. Build only where content is genuinely distinct (spec rule) | Per 04: clinic general pages and `/icbc-treatments/<city>/` exist. WorkSafe location URLs are to be decided by the spec |
| *Not recommended:* "WorkSafeBC physiotherapy Surrey" city hub | wcb/worksafebc physiotherapy surrey: **ND** | - | No measurable demand. 11 Surrey clinics would make a thin hub duplicating the pillar's clinic finder. Use a "Surrey clinics" group on the pillar instead | - |
| *Not recommended:* neighbourhood or city pages without a clinic (White Rock, Guildford, Ladner, Kitsilano, Walnut Grove, Coquitlam, etc.) | Generic demand only | - | Doorway risk; no WorkSafe demand; scope rule | - |

### 7.3 Sections, not URLs
- **WCB massage therapy** (30 / 20 / 20, paid comp 0.7-0.8): a section on the pillar and on the 9 clinic pages where "WCB Massage Subsequent Session" is bookable (KNOWN).
- **WCB acupuncture:** a section on the Nordel page only (the only clinic with WCB acupuncture types, KNOWN).
- **Common workplace injuries we treat:** back/lifting, shoulder overuse, RSI (180), sprains, slip-and-fall, concussion at work (20). All work-qualified variants are ND. Short subsections with H3 questions on the pillar.
- **Who this is for, by occupation** (construction, warehouse, healthcare, trucking, office): all ND. One sentence each on the pillar or location pages as relevance signals. No pages.
- **Kinesiology / active rehab under WorkSafeBC:** a section only after WorkSafe funding at Synergy is verified (UNKNOWN).
- **Occupational rehab, work hardening (480), FCE (40):** no section until the service is confirmed (UNKNOWN). If confirmed, it would justify its own URL because "work hardening" has measurable demand.

### 7.4 Priority definitions used in the CSV
- **1:** target now on a dedicated URL (pillar or near-me via location pages). Measurable WorkSafe demand.
- **2:** use as a secondary target, section heading or FAQ on a dedicated URL. Measurable but small demand, or ND but needed for clinic/geo relevance.
- **3:** mention, monitor or hold. National/generic or unverified service, or ND neighbourhood combos.
- **Context:** generic physio / ICBC / generic injury. Never a WorkSafe target.
- **Exclude:** provider, employer, navigational, legal, out-of-area or unverified service. Reason given in the row.

Totals: P1 = 9, P2 = 126, P3 = 201, Context = 121, Exclude = 51.
- Most P2 rows are ND city-level WorkSafe combinations kept for clinic-page vocabulary.
- Most P3 rows are ND neighbourhood combinations.

### 7.5 Vocabulary guidance for page copy (from the volume split)
- Use **both** "WorkSafeBC" and "WCB" on the pillar and location pages. "wcb physiotherapy" (210) out-searches every "worksafebc" spelling, even allowing for its national share.
- Use both "physiotherapy" and "physio".
- "WSBC" is a measurable spelling (140; grouped estimate). One natural mention is enough.
- Say "work injury" / "workplace injury" in body copy. The H1 should name WorkSafeBC physiotherapy.

### 7.6 AEO question set (H2/H3 candidates)
These are the questions to write as headings. Measured volume is given where it exists; ND means no data.
1. Is WCB the same as WorkSafeBC? (10)
2. Do I need a WorkSafeBC claim number before I book physio? (claim number 110 / 90)
3. How do I report a workplace injury to WorkSafeBC? (injury report 70; teleclaim 20; forms 6 / 6a 210 / 170)
4. Do I need a doctor's referral for WorkSafeBC physiotherapy? (ND; facts conflict, so verify first)
5. Will I pay anything at a WorkSafeBC physio visit? (ND; verify direct billing and user-fee facts)
6. How long does a WorkSafeBC claim take? (20)
7. What does a gradual return to work look like? (140)
8. What are modified duties? (140)
9. What should I do if I'm injured at work in BC? (40 + 50)
10. Can I see a registered massage therapist under my WorkSafeBC claim? (massage 30 / 20 / 20)

---

## 8. Data gaps and how to close them

| Gap | Why | Fix (for the user; not done here) |
|---|---|---|
| Second volume source for cross-checking | Ahrefs plan lacks Keywords Explorer API; Semrush has no API units | Upgrade the Ahrefs API plan or add Semrush units (https://www.semrush.com/mcp-access), then re-run the P1/P2 rows |
| Google Keyword Planner ranges, BC/city geo-targeting | No Google Ads keyword-planning tool loaded | Connect Google Ads (via Supermetrics with campaign/resource tools enabled, or directly) and pull Keyword Planner for British Columbia and each clinic city. Keyword Planner is the only source here that could give sub-national volumes |
| Google Trends / seasonality | Fetch blocked; no tool | Allow trends.google.com in network settings, or check manually |
| Autocomplete / PAA wording | Fetch blocked; Ahrefs suggestions plan-blocked | A rankings/SERP agent with SE Ranking `DATA_getSerpResults` could capture PAA, but it costs units |
| Real WorkSafe query mix on the site | GSC page-level data not connected (01) | Connect GSC directly; filter queries on wcb, worksafe, wsbc, "work injur" every 30 days after launch |
| BC share of "wcb" volume | National database | Only Keyword Planner geo-targeting can answer it |
| SERP type per keyword | Metrics endpoint returns no SERP features; only discovery rows have them | Owned by the rankings agent |

---

## 9. Sources

- SE Ranking MCP, 2026-11-02, source `ca`:
  - `DATA_getKeywordsMetrics`: 5 calls, 463 keywords
  - `DATA_getSimilarKeywords` (seed "wcb physiotherapy")
  - `DATA_getRelatedKeywords` (seeds "worksafebc physiotherapy" and "wcb physiotherapy near me")
  - `DATA_getKeywordQuestions` (seed "worksafebc")
  - `DATA_getLongTailKeywords` (seed "wcb")
  - `DATA_getSubscription` (unit balance)
  - Raw outputs: `research/06-keyword-source/`.
- Ahrefs MCP `keywords-explorer-overview`, `keywords-explorer-search-suggestions`, `subscription-info-limits-and-usage`: "Insufficient plan" (2026-11-02).
- Semrush MCP `keyword_research`: `no_api_units`, trace_id 82e506b42bc85148abf0b9ca4bd26591 (2026-11-02).
- WebSearch (2026-11-02, US engine): "worksafebc physiotherapy"; "wcb physiotherapy surrey bc"; "worksafebc physiotherapy no referral needed how many sessions". URLs cited in the summaries:
  - https://www.worksafebc.com/en/claims/benefits-services/health-care-benefits
  - https://www.worksafebc.com/en/resources/health-care-providers/guides/physiotherapy-services-agreement-key-clarifications-faq
  - https://bcmj.org/worksafebc/new-physiotherapy-treatment-model
  - https://www.go2hr.ca/explore-all-resources/worksafebc-contracted-physiotherapists
  - https://bcphysio.org/node/10054
  - https://southislandphysio.ca/services/worksafe-physiotherapy/
  - https://www.pthealth.ca/service/work-injuries/
  - https://staging21.bcphysio.org/clinics/beyond-physiotherapy-clinic-south-surrey/
- Project files:
  - `research/01-site-inventory.md` s5.1-5.2 (domain rankings, GSC WorkSafe rows, cannibalization risks)
  - `research/04-local-gbp.md` (Jane WCB appointment types, GBP search terms, Maps grid)
  - `data/gbp-maps-keyword-positions.csv`
  - `data/historical-rankings.csv`
  - `data/locations-master.csv`

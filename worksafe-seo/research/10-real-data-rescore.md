# 10 Real-data rescore

> **Header note (2026-11-03)**
> - **Volume source:** SE Ranking `DATA_getKeywordsMetrics`, `source=ca`, one call with 138 keywords, run on 2026-11-03. Raw rows are in `data/seranking-refresh-2026-11-03.csv`.
> - **All volumes are Canada-wide** (SE Ranking CA database). They are not BC or Metro Vancouver figures, and the BC share is UNKNOWN. "WCB" is also the name used for the boards in AB, SK, MB and other provinces, so "wcb …" terms may carry more out-of-province demand than "worksafebc …" terms.
> - **Keyword Planner: Not Available.** No Google Ads connector is attached to this session, and Supermetrics returned `LICENSE_NOT_FOUND`. I did not try Keyword Planner. No second volume source was available, so every figure below comes from one tool (SE Ranking).
> - **SE Ranking units:** `DATA_getSubscription` showed 1,220 units left before the call. Straight after the call it still showed 1,220, because the counter lags (see 01 and 06). At the final check it showed 1,120, a drop of **100**. The counter may not have caught up yet, so the drop could still grow. At the rate 06 observed (about 1 unit per keyword), the upper estimate is about 138 units, inside the 150-unit budget. I made no other unit-costing calls. The account balance is shared with other agents. The subscription ends 2026-11-06.
> - **Selection rule:** I took every keyword-master row with Priority 1 or 2 whose `URL Target` starts with `/worksafe-physiotherapy/` (pillar, `#area-surrey` and the clinic pages), `/worksafebc-physiotherapy-what-is-covered/` or `/return-to-work-after-a-workplace-injury/`. That gave 135 rows. I added 6 requested question terms: 3 were already in that set, and 3 are not in keyword-master. After de-duplication there were 138 keywords, under the 140 cap, so nothing was cut.

## Demand per page

**How to read this section.** "Measured" means the keyword was sent to SE Ranking. "No data" means SE Ranking returned nothing for that keyword in the CA database, which is different from a volume of 0. Totals are plain sums of monthly volumes. A total does not equal page traffic: no CTR or rank is applied, and some rows are probably one grouped estimate repeated under several spellings (see the last column).

| Owner page | Measured | Volume > 0 | Returned 0 | No data | Total volume (raw sum, CA) | Total with suspected grouped variants counted once |
|---|---|---|---|---|---|---|
| Pillar `/worksafe-physiotherapy/` (incl. `#area-surrey`, finder "near me" and the "other WorkSafeBC care" section) | 65 | 15 | 1 | 49 | **1,200** | 780 |
| Guide `/worksafebc-physiotherapy-what-is-covered/` | 23 | 13 | 0 | 10 | **850** | 830 |
| RTW `/return-to-work-after-a-workplace-injury/` | 4 | 4 | 0 | 0 | **400** | 400 |
| Clinic pages, as a group (`/worksafe-physiotherapy/<city>/`: Burnaby 8, New Westminster 8, Vancouver 7, Abbotsford 5, Delta 5, Langley 5, Richmond 5) | 43 | 0 | 3 | 40 | **0** | 0 |
| Question terms not in keyword-master (proposed owner: pillar FAQ, per 08 F22) | 3 | 1 | 0 | 2 | **20** | 20 |
| **All** | **138** | **33** | **4** | **101** | **2,470** | 2,030 |

Suspected grouped variants (LIKELY one estimate, so counting once is safer):
- Pillar: "worksafebc physiotherapy", "worksafebc physio", "worksafe bc physio" and "wsbc physiotherapy" all return 140, KD 21, intent I and a flat 140 trend. 06 already flagged these as one grouped estimate. Counting the group once removes 420.
- Guide: "worksafebc claim" and "worksafe bc claim" return the same volume (20), the same 12-month trend, CPC 1.42 and competition 0.04. Only their KD differs (19 vs 45). Counting them once removes 20.

### Pillar `/worksafe-physiotherapy/`: 15 keywords with volume > 0, total 1,200 (CA)

**Top 5 by volume:** wcb physiotherapy (210), then a five-way tie at 140 for places 2 to 6: wcb physiotherapy near me, worksafebc physiotherapy, worksafebc physio, worksafe bc physio and wsbc physiotherapy. Four of the 140s are the grouped spellings above. With that group counted once, the top 5 distinct demands are wcb physiotherapy (210), the worksafebc physiotherapy spelling group (140), wcb physiotherapy near me (140), workplace injury bc (50), and a four-way tie at 40.

| Keyword | Volume (CA) | KD | Intent | Priority | URL Target note |
|---|---|---|---|---|---|
| wcb physiotherapy | 210 | 14 | L,C | 1 | |
| wcb physiotherapy near me | 140 | 19 | L,C | 1 | finder, plus nearest clinic page via local relevance |
| worksafebc physiotherapy | 140 | 21 | I | 1 | grouped spelling |
| worksafebc physio | 140 | 21 | I | 1 | grouped spelling |
| worksafe bc physio | 140 | 21 | I | 1 | grouped spelling |
| wsbc physiotherapy | 140 | 21 | I | 1 | grouped spelling |
| workplace injury bc | 50 | 27 | I | 2 | |
| wcb approved physiotherapy | 40 | 18 | L,C | 1 | |
| worksafebc physiotherapy near me | 40 | 11 | L,C | 1 | finder, plus nearest clinic page |
| injured at work bc | 40 | 31 | I | 2 | |
| worksafebc injury | 40 | 27 | I | 2 | |
| wcb massage therapy | 30 | 12 | L,C | 2 | "other WorkSafeBC care" section |
| wcb approved massage therapy | 20 | 14 | L,C | 2 | "other WorkSafeBC care" section |
| worksafebc massage therapy | 20 | 13 | I,N | 2 | "other WorkSafeBC care" section |
| worksafebc approved physiotherapist | 10 | 12 | I,N | 1 | |

Notes:
- 180 of the 1,200 comes from the two "near me" terms, which keyword-master shares between the finder and the nearest clinic page.
- 70 comes from the massage-therapy terms owned by the "other WorkSafeBC care" section.
- "worksafe physiotherapy" returned 0.
- All 10 Surrey terms targeted at `#area-surrey` returned no data.

### Guide `/worksafebc-physiotherapy-what-is-covered/`: 13 keywords with volume > 0, total 850 (CA)

**Top 5 by volume:** worksafebc form 6 (210), worksafebc form 6a (170), worksafebc claim number (110), wcb claim number (90), then a tie at 70 for places 5 and 6: workplace injury report and worksafebc injury report.

| Keyword | Volume (CA) | KD | Intent | Priority |
|---|---|---|---|---|
| worksafebc form 6 | 210 | 30 | I | 2 |
| worksafebc form 6a | 170 | 30 | I | 2 |
| worksafebc claim number | 110 | 40 | I | 2 |
| wcb claim number | 90 | 22 | I | 2 |
| workplace injury report | 70 | 44 | I | 2 |
| worksafebc injury report | 70 | 36 | I,N | 2 |
| how long does a wcb claim take | 20 | 22 | I | 2 |
| wcb claim bc | 20 | 32 | I | 2 |
| worksafe bc claim | 20 | 45 | I,N | 2 |
| worksafebc claim | 20 | 19 | I,N | 2 |
| worksafebc injury claim | 20 | 0 | I | 2 |
| worksafebc teleclaim | 20 | 50 | I | 2 |
| worksafebc claim status | 10 | 32 | I | 2 |

Notes:
- 380 of the 850 (45%) is the two form terms. Searchers may mean "download the form" (navigational to worksafebc.com), so the guide's share of that demand is UNKNOWN.
- "do i need a referral for worksafebc physiotherapy" and the other 9 coverage questions returned no data.

### RTW `/return-to-work-after-a-workplace-injury/`: 4 keywords with volume > 0, total 400 (CA)

**Top 5 by volume (only 4 measured):** gradual return to work (140), modified duties (140), return to work program (70) and worksafebc return to work (50).

| Keyword | Volume (CA) | KD | Intent | Priority |
|---|---|---|---|---|
| gradual return to work | 140 | 18 | I | 2 |
| modified duties | 140 | 13 | I | 2 |
| return to work program | 70 | 17 | I | 2 |
| worksafebc return to work | 50 | 45 | I,N | 2 |

Notes:
- 350 of the 400 is generic return-to-work demand, not WorkSafeBC-specific. It is Canada-wide and includes employer-side searches (LIKELY).

### Clinic pages (group): 0 keywords with volume > 0, total 0 (CA)

- **Top 5 by volume:** none, because no clinic-page keyword has volume above 0.
- Three keywords returned 0: "wsbc physiotherapy burnaby", "wsbc physiotherapy new west" and "wsbc physiotherapy new westminster".
- The other 40 city-modified terms (wcb / worksafebc / worksafe × physio / physiotherapy × city) returned no data.
- This matches 06. Local demand for these pages cannot be shown from SE Ranking keyword volume. It has to come from GSC, GBP or Maps-grid data.

### Question terms not in keyword-master

| Keyword | Volume (CA) | KD | Intent | Note |
|---|---|---|---|---|
| is wcb the same as worksafebc | 20 | 54 | I | Closest keyword-master variant: "is wcb and worksafebc the same thing" = 10 (Priority 3, pillar). This is a different string, so it is not a like-for-like change. |
| can you get free physio in bc | No data | | | 08 F22: appears in People Also Ask on 13 of 25 SERPs |
| what is wsbc physio | No data | | | 08 F22: appears in People Also Ask on 2 of 25 SERPs |

The other 3 requested questions are already in keyword-master under the guide: "how long does a wcb claim take" (20), "worksafebc claim status" (10) and "do i need a referral for worksafebc physiotherapy" (no data).

### Volume changes vs previous (keyword-master Estimated Volume) above 30%

**None.** All 37 keywords that returned data have exactly the volume recorded in keyword-master from the 2026-11-02 SE Ranking pull. No keyword moved between "no data" and a value. The only new value is "is wcb the same as worksafebc" (20), which has no previous value.

For context only (this is not a change vs previous), these keywords moved by more than 30% between the first (2025-12) and latest (2026-11) month of their SE Ranking 12-month trend. 2026-11 is the current month, so treat its value as the tool's estimate.

| Keyword | Owner | 2025-12 | 2026-11 | Change |
|---|---|---|---|---|
| worksafebc injury | Pillar | 20 | 40 | +100% (rose in 2026-10 and 2026-11) |
| worksafebc claim / worksafe bc claim | Guide | 10 | 20 | +100% (oscillates 10/20; tiny base) |
| worksafebc injury report | Guide | 50 | 70 | +40% |
| injured at work bc | Pillar | 70 | 40 | -43% |
| worksafebc teleclaim | Guide | 40 | 20 | -50% |
| workplace injury report | Guide | 110 | 70 | -36% |
| return to work program | RTW | 110 | 70 | -36% |
| wcb approved massage therapy | Pillar | 30 | 20 | -33% |

17 of the 33 keywords with volume above 0 have a completely flat 12-month trend. This is the same pattern 06 flagged: the figures are LIKELY bucketed or modelled estimates, so use them to rank demand, not as exact counts.

## Final alignment after fixes (2026-11-03, `python3 -I build/keyword_alignment.py`)

Source: SE Ranking DATA_getKeywordsMetrics, Canada-wide, 2026-11-03 (`data/seranking-refresh-2026-11-03.csv`). Google Keyword Planner: Not Available (no Google Ads connector; Supermetrics LICENSE_NOT_FOUND). Import ready: `build/merge_keyword_planner.py` with seed list `data/keyword-planner-seed.txt`.

| Page | Owned demand (CA/mo) | Alignment | Notes |
|---|---|---|---|
| Pillar | 1,200 (about 780 if the four 140 spellings are one estimate) | 46/100 | Title, H1, H2 and lede now carry "WorkSafeBC (WCB) physiotherapy". "near me" and "WSBC" stay in body copy only (natural wording) |
| Coverage guide | 850 | 17/100 | Most measured demand is people looking for WorkSafeBC's own forms (Form 6 210, Form 6A 170), which worksafebc.com will keep. The guide now names Form 6, WCB claim number and "WorkSafeBC injury report" in title, meta and headings, but its main intent (what is covered, costs) has no measured volume. Not changed further, to protect the guide's existing rankings |
| Return to work | 400 | 67/100 | H1 now "Gradual return to work and modified duties" |
| Clinic pages | 0 measured | n/a | No geo WorkSafe term has measurable volume; pages are justified by clinic facts and near-me intent |

Scorer: title 30, H1 20, H2/H3 25, first 100 words 15, meta 10 points per keyword, weighted by volume, close-variant matching.

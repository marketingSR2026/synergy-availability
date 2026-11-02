# 03: Drive reports, location source data and asset inventory

Prepared 2026-11-02 by the Drive specialist. Read-only: nothing in Google Drive or any other system was created, changed, shared or deleted. No patient records were opened.

**Confidence labels:** KNOWN = read directly from the cited Drive file or tool output. LIKELY = strong inference from the cited source. UNKNOWN = could not be determined. ASSUMPTION = working assumption, needs confirmation. DERIVED = computed by me from KNOWN extracted values.

**Files produced**
| File | What it holds |
|---|---|
| `research/03-drive-reports.md` | This report |
| `data/historical-rankings.csv` | One row per keyword x search engine x report (172 rows). Required columns `keyword,report_date,position,url,source` first, then extra context columns |
| `data/historical-rankings-daily.csv` | The same data in long daily format (1,204 rows: one per keyword x engine x check date) |
| `data/yelp-nap.csv` | Verbatim NAP and listing fields for the 20 rows in the Yelp location list |
| `data/drive-location-photos.csv` | Metadata for 572 clinic photo files in the 19 per-location Yelp photo folders (images not opened) |
| `research/drive-source/serank-icbc-treatments-2026-09-25-layout.txt`, `research/drive-source/serank-domain-2026-10-09-layout.txt` | Raw layout text extracted from the two SE Ranking PDFs (evidence) |

---

## 0. Method, access log and validation

| Step | Tool / endpoint | Result |
|---|---|---|
| Read both SE Ranking PDFs as text | `mcp__Google_Drive__read_file_content` | Worked, but daily cells came out jumbled. Position, change arrow and a third small number all run together. Not used for numbers. |
| Download both PDFs | `mcp__Google_Drive__download_file_content` (ids 14hwXKTAFs2nwktzV_KiVMsgACB0B5r8J, 19pJ41JcsOq4EnKiN2a18EIvGV5CG1G2j) | Worked. Base64 decoded to 498,890 B (5 pages) and 1,066,938 B (10 pages), matching Drive `fileSize`. Parsed in the scratchpad with `pdfplumber` using font size and colour: 9 pt black = organic position; 7.5 pt green = positions gained; 7.5 pt red = positions lost; 7.5 pt black next to a map-pin-shaped vector icon = secondary indicator (see 1.2.5). |
| Read the Yelp location spreadsheet | `read_file_content` returned only the first tab ("Sales/CS Instructions"). An xlsx export through `download_file_content` failed with "message from the server was too large". `mcp__Google_Drive__get_file_metadata` with `snippetVerbosity=MAX_ALLOWED` returned all tabs as text (445 KB). | All tabs read. The snippet **drops empty cells**, so I mapped fields by pattern (phone regex, URL prefixes, day-of-week hours). I then cross-checked every row against the separate tabs "CS - Basic Listing Info", "CS - Business Hours" and "CS - CTAs": 0 mismatches on name, street 1, postal code, phone or hours for the 19 rehab rows. The Optometry hours and CTA were blank in the listing-tab snippet and were filled from the CS tabs. |
| Drive discovery | `mcp__Google_Drive__search_files` (title, fullText, parentId, modifiedTime and mimeType queries) | See section 3. Metadata only, except for the 3 small SEO files and the brand guideline doc noted below. |

**Validation of the PDF parse (KNOWN):** I recounted the last-day positions from the parsed daily tables. The counts match the PDFs' own summary tiles exactly:
- Report A: 3 keywords in SERPs; Top 3 = 0; Top 10 = 2; Top 30 = 2.
- Report B: 109 in SERPs; Top 3 = 36; Top 10 = 69; Top 30 = 98.

The changes are also internally consistent. Each green or red number equals the difference from the previous day's position, with "not in top 100" counted as 100.

---

## 1. Historical metrics from the two SE Ranking reports

> **Do not compare Report A with Report B directly.** They are different SE Ranking projects:
> - Report A tracks the `/icbc-treatments/` URL. Report B tracks the whole domain.
> - The keyword sets differ: 49 keywords vs 123 keyword-engine pairs.
> - The search engines differ: one Vancouver engine vs nine engines.
> - The AI-prompt sets differ, and they are not listed in either PDF.
>
> The same keyword string can appear in both, but the scope and engine differ. Treat each report as a standalone snapshot.

### 1.1 Report A: `httpssynergyrehabilitation.caicbc-treatments-Project-Report_2026_09_25.pdf`
Drive id 14hwXKTAFs2nwktzV_KiVMsgACB0B5r8J; created 2026-09-25T15:56:26Z; owner marketing@synergy-rehab.ca.

| Metric | Value | Status | Source (page) |
|---|---|---|---|
| Project | "https://synergyrehabilitation.ca/icbc-treatments/ Project Report" | KNOWN | p.1 title |
| Project scope | Rankings LIKELY count only URLs under `/icbc-treatments/`. Based on the project title; the PDF has no setting that confirms it. | LIKELY | p.1 |
| Period | Sep-19 2026 to Sep-25 2026 | KNOWN | p.1 |
| Search engine(s) | 1: Google Canada, Vancouver, British Columbia, Canada | KNOWN | p.2 |
| Keywords tracked | 49 = 10 "General" + 39 "ICBC location pages" | KNOWN (counted) | pp.2-4 |
| Keywords in SERPs (top 100) | 3 (6%) | KNOWN | p.1 |
| Positions up / down | 0 / 0 | KNOWN | p.1 |
| Keywords in Top 3 / Top 10 / Top 30 | 0 / 2 (+2) / 2 (+2) | KNOWN | p.1 |
| Visibility | 0% | KNOWN | p.1 |
| Average position | 95 (green 5 = improved by 5) | KNOWN | p.1 |
| Distribution of top positions (bar chart) | Not Available. The bars are graphics with no text values. | UNKNOWN | p.1 |
| Top keywords that dropped (position / drop) | icbc physiotherapy clayton corners 100 / -93; icbc physiotherapy burnaby 100 / -63; icbc physiotherapy king george 100 / -25 | KNOWN | p.1 |
| AI Overview presence (share of tracked prompts showing an AI Overview, last day) | 85%, down 7 (`arrow_drop_down7`) | KNOWN | p.4 |
| Mention presence (brand mentioned in AI results) | 0% | KNOWN | p.4 |
| Link presence (link to site in AI results) | 0% | KNOWN | p.4 |
| Mention and link presence trend | 0 on every day, Sep-19 to Sep-25, for 3 Vancouver series and "Overall for the project" | KNOWN | pp.4-5 |
| Which AI engines and prompts were tracked | Not Available (not printed in the PDF) | UNKNOWN | n/a |
| Competitors | Not Available. The export has no competitor section. | KNOWN (absence) | whole PDF |
| Ranking URLs | Not Available. The export does not print URLs. | KNOWN (absence) | whole PDF |

**WorkSafe / WCB terms (KNOWN):**
- `wcb` and `worksafebc` were tracked in the "General" group (Google Canada, Vancouver).
- Both were **not in the top 100 on all 7 days**.
- Caveat (LIKELY): the project is scoped to `/icbc-treatments/`, so this only says that no ICBC page ranked for them. It is **not** a baseline for `/worksafe-physiotherapy/` or the domain. A domain-level WorkSafe ranking baseline is UNKNOWN from these files.
- No other workplace-injury terms were tracked.

**Keywords that ranked on any day (KNOWN). The other 41 keywords were not in the top 100 on any day:**
| Keyword | Group | Daily result Sep-19..Sep-25 (change) |
|---|---|---|
| icbc physiotherapy vancouver | ICBC location pages | N/A, N/A, -, -, -, -, **9 (+91)** |
| icbc physiotherapy surrey central | ICBC location pages | N/A, N/A, -, -, -, -, **10 (+90)**. The keyword wraps onto two lines in the PDF ("icbc physiotherapy surrey" / "central"). |
| icbc physiotherapy near me | ICBC location pages | N/A, N/A, -, -, -, -, **38 (+62)** |
| icbc physiotherapy clayton corners | ICBC location pages | N/A, N/A, -, -, -, 7 (+93), - |
| icbc physiotherapy burnaby | ICBC location pages | N/A, N/A, -, -, -, 37 (+63), - |
| icbc physiotherapy king george | ICBC location pages | N/A, N/A, -, -, -, 75 (+25), - |
| icbc physiotherapy new westminster | ICBC location pages | N/A, N/A, -, 18 (+82), 18, -, - |
| icbc physiotherapy cedar hills | ICBC location pages | N/A, N/A, 33, 58 (-25), -, -, - |

"N/A" = not checked that day. All 39 "ICBC location pages" keywords are N/A on Sep-19 and Sep-20, so they were LIKELY added on Sep-21. "-" = not in the top 100.

**Branded vs non-branded:** Report A has no branded keywords. All 49 are non-branded (DERIVED: none contains "synergy"). The PDF itself has no branded/non-branded split.

**Location-specific rankings:** all location keywords were checked from the **Vancouver** engine only, so results for Surrey or Fraser Valley terms do not reflect local searchers (LIKELY). Location-page keywords with no top-100 result on any day: richmond, delta, nordel, 88 avenue surrey, strawberry hill, newton, sullivan heights, surrey city centre, fleetwood (3 variants), cloverdale, east clayton, clayton heights (2), clayton physiotherapy, south surrey (2), langley (2), abbotsford, physiotherapy vancouver, physiotherapy burnaby, physiotherapy richmond, new west physio, cedar hills physiotherapy, strawberry hill physiotherapy, sullivan heights physiotherapy, icbc physiotherapy, icbc counselling, icbc acupuncture.

### 1.2 Report B: `httpssynergyrehabilitation.ca-Project-Report_2026_10_09.pdf`
Drive id 19pJ41JcsOq4EnKiN2a18EIvGV5CG1G2j; created 2026-10-09T15:48:51Z; owner marketing@synergy-rehab.ca.

#### 1.2.1 Summary tiles
| Metric | Value | Status | Source (page) |
|---|---|---|---|
| Project | "https://synergyrehabilitation.ca/ Project Report" (domain) | KNOWN | p.1 |
| Period | Oct-03 2026 to Oct-09 2026 | KNOWN | p.1 |
| Search engines (9) | Google Canada (no city); Google Canada with location set to Delta, Langley, Vancouver, Burnaby, New Westminster, Richmond, Abbotsford, Cloverdale (all "British Columbia, Canada") | KNOWN | pp.2-9 |
| Keyword-engine pairs | 123 = Google Canada 34 (20 General + 14 ICBC Treatments) + 8 city engines x 11 + 1 extra on Cloverdale ("icbc physiotherapy surrey") | KNOWN (counted) | pp.2-9 |
| Keywords in SERPs (top 100) | 109 (89%) | KNOWN | p.1 |
| Positions up / down | 51 (green) / 24 (red) | KNOWN | p.1 |
| Keywords in Top 3 | 36 (+6) | KNOWN | p.1 |
| Keywords in Top 10 | 69 (+21) | KNOWN | p.1 |
| Keywords in Top 30 | 98 (+25) | KNOWN | p.1 |
| Visibility | 13.3%, with "11.8" printed in **red** (a decrease). The unit of the change is not printed; percentage points is LIKELY. | KNOWN (value) / LIKELY (unit) | p.1 |
| Average position | 21, green 20 (improved by 20) | KNOWN | p.1 |
| Distribution of top positions; daily average-position chart | Not Available (graphics only; axis labels 12/36/60) | UNKNOWN | pp.1-2 |
| Mention presence (AI) | 10%, down 5 (`arrow_drop_down5`) | KNOWN | p.9 |
| Link presence (AI) | 0%, down 22 (`arrow_drop_down22`) | KNOWN | p.9 |
| Mention presence trend | 06 Oct 15, 07 Oct 15, 08 Oct 15, 09 Oct 10 (series "Canada" and "Overall for the project"). No points before 06 Oct, so tracking LIKELY started then. | KNOWN | p.9 |
| Link presence trend | 06 Oct 22, 07 Oct 17, 08 Oct 0, 09 Oct 0 | KNOWN | p.10 |
| AI Overview presence tile | Not present in Report B | KNOWN (absence) | p.9 |
| AI engines and prompts tracked | Not Available (not printed) | UNKNOWN | n/a |
| Competitors | Not Available. The export has no competitor section. | KNOWN (absence) | whole PDF |
| Ranking URLs | Not Available (not printed) | KNOWN (absence) | whole PDF |

**Top 5 keywords that dropped (KNOWN: position 100 and drop).** The PDF's search-engine column is an icon only; I matched each engine from the daily tables (LIKELY):
| Keyword | Position | Drop | Engine (matched from the daily table) |
|---|---|---|---|
| icbc approved physiotherapy | 100 | -87 | Richmond (13 on Oct-08, then out of the top 100) |
| icbc approved physiotherapy | 100 | -86 | Burnaby (14, then out) |
| icbc chiropractor | 100 | -80 | Google Canada (20, then out) |
| icbc chiropractor | 100 | -79 | Cloverdale (21, then out) |
| icbc chiropractor | 100 | -77 | Delta (23, then out) |

#### 1.2.2 WorkSafe / WCB / workplace terms
**None tracked (KNOWN).** None of the 123 keyword-engine pairs contains wcb, worksafe, workplace, work injury or workers comp. Neither report gives a historical WorkSafe ranking baseline for the domain or for `/worksafe-physiotherapy/`. That baseline has to come from live tools (Ahrefs, Semrush or SE Ranking data endpoints) or from new tracking set up by the project owner.

#### 1.2.3 Branded vs non-branded (DERIVED)
The report itself does not split branded and non-branded. I classed a keyword as branded if it contains "synergy".

| Segment (Oct-09) | Pairs | In top 100 | Top 3 | Top 10 |
|---|---|---|---|---|
| Branded | 12 (all on Google Canada) | 12 | 12 | 12 |
| Non-branded | 111 | 97 | 24 | 57 |

#### 1.2.4 Google Canada (no location), "General" group: daily detail (KNOWN)
"Pin-icon indicator" is explained in 1.2.5. "-" = not in the top 100.

| Keyword | Branded (derived) | Oct-09 organic | Oct-09 change | Pin-icon indicator Oct-09 | Daily Oct-03..Oct-09 |
|---|---|---|---|---|---|
| synergy rehab | branded | 1 | 0 | 1 | Oct-03:1;Oct-04:1;Oct-05:1;Oct-06:1;Oct-07:1;Oct-08:1;Oct-09:1 |
| massage surrey | non-branded | 1 | 0 | - | Oct-03:-;Oct-04:-;Oct-05:1(+99);Oct-06:1;Oct-07:1;Oct-08:1;Oct-09:1 |
| synergy rehab south surrey | branded | 1 | 0 | - | Oct-03:1;Oct-04:1;Oct-05:1;Oct-06:1;Oct-07:1;Oct-08:1;Oct-09:1 |
| synergy nordel | branded | 1 | 0 | - | Oct-03:1;Oct-04:1;Oct-05:1;Oct-06:1;Oct-07:1;Oct-08:1;Oct-09:1 |
| synergy rehab fleetwood | branded | 1 | 0 | - | Oct-03:1;Oct-04:1;Oct-05:1;Oct-06:1;Oct-07:1;Oct-08:1;Oct-09:1 |
| synergy rehab central city | branded | 1 | 0 | - | Oct-03:1;Oct-04:1;Oct-05:1;Oct-06:1;Oct-07:1;Oct-08:1;Oct-09:1 |
| massage rmt surrey | non-branded | 2 | -1 | - | Oct-03:2;Oct-04:1(+1);Oct-05:2(-1);Oct-06:1(+1);Oct-07:1;Oct-08:1;Oct-09:2(-1) |
| synergy rehab delta | branded | 1 | 0 | - | Oct-03:1;Oct-04:1;Oct-05:1;Oct-06:1;Oct-07:1;Oct-08:1;Oct-09:1 |
| physiotherapists surrey bc | non-branded | 7 | 0 | 2 | Oct-03:7;Oct-04:-;Oct-05:6(+94);Oct-06:6;Oct-07:6;Oct-08:7(-1);Oct-09:7 |
| registered massage therapist surrey | non-branded | 1 | 0 | - | Oct-03:1;Oct-04:1;Oct-05:1;Oct-06:1;Oct-07:1;Oct-08:1;Oct-09:1 |
| synergy rehab near me | branded | 1 | 0 | 1 | Oct-03:1;Oct-04:1;Oct-05:1;Oct-06:1;Oct-07:1;Oct-08:1;Oct-09:1 |
| synergy sullivan | branded | 1 | 0 | - | Oct-03:1;Oct-04:1;Oct-05:1;Oct-06:1;Oct-07:1;Oct-08:1;Oct-09:1 |
| synergy rehabilitation & sports clinic | branded | 1 | 0 | 1 | Oct-03:1;Oct-04:1;Oct-05:1;Oct-06:1;Oct-07:1;Oct-08:1;Oct-09:1 |
| synergy king george | branded | 1 | 0 | - | Oct-03:1;Oct-04:2(-1);Oct-05:1(+1);Oct-06:1;Oct-07:1;Oct-08:1;Oct-09:1 |
| synergy cloverdale | branded | 1 | 0 | - | Oct-03:1;Oct-04:1;Oct-05:1;Oct-06:1;Oct-07:1;Oct-08:1;Oct-09:1 |
| surrey physiotherapy bc | non-branded | not in top 100 | 0 | 3 | Oct-03:49;Oct-04:50(-1);Oct-05:50;Oct-06:-;Oct-07:47(+53);Oct-08:45(+2);Oct-09:- |
| synergy central city | branded | 2 | -1 | - | Oct-03:5;Oct-04:2(+3);Oct-05:2;Oct-06:1(+1);Oct-07:1;Oct-08:1;Oct-09:2(-1) |
| physiotherapy delta | non-branded | 12 | -1 | - | Oct-03:-;Oct-04:11(+89);Oct-05:11;Oct-06:12(-1);Oct-07:12;Oct-08:11(+1);Oct-09:12(-1) |
| best physiotherapy surrey | non-branded | not in top 100 | 0 | - | Oct-03:-;Oct-04:-;Oct-05:-;Oct-06:-;Oct-07:-;Oct-08:-;Oct-09:- |
| best physiotherapist surrey | non-branded | not in top 100 | 0 | - | Oct-03:-;Oct-04:-;Oct-05:-;Oct-06:-;Oct-07:-;Oct-08:-;Oct-09:- |

#### 1.2.5 The small black number next to the map-pin icon
In many cells a third small black number (7.5 pt) appears with a vector icon. The icon's shape is 5.3 x 7.5 pt with a 2.3 pt inner circle, which is the shape of a map pin.

This number is LIKELY Synergy's position in the Google local pack / Maps block. It appears even where organic is "-". For example, "best physiotherapist surrey" has no organic ranking but shows pin values of 2, 2, 1 and 2.

It is LIKELY, not KNOWN: the PDF has no legend for it. It is kept in the `secondary_indicator` columns of the CSVs.

| Search engine | Keyword | Pin-icon number by day (only days where shown) |
|---|---|---|
| GC | synergy rehab | Oct-03:1;Oct-04:1;Oct-05:1;Oct-06:1;Oct-07:1;Oct-08:1;Oct-09:1 |
| GC | physiotherapists surrey bc | Oct-05:1;Oct-07:3;Oct-09:2 |
| GC | synergy rehab near me | Oct-03:1;Oct-04:1;Oct-06:1;Oct-07:1;Oct-08:1;Oct-09:1 |
| GC | synergy rehabilitation & sports clinic | Oct-03:1;Oct-04:1;Oct-05:1;Oct-06:1;Oct-07:1;Oct-08:1;Oct-09:1 |
| GC | surrey physiotherapy bc | Oct-09:3 |
| GC | physiotherapy delta | Oct-05:1 |
| GC | best physiotherapy surrey | Oct-04:2;Oct-05:3 |
| GC | best physiotherapist surrey | Oct-03:2;Oct-04:2;Oct-05:1;Oct-08:2 |
| GC | icbc physiotherapy surrey | Oct-03:3;Oct-04:3;Oct-05:2;Oct-09:1 |
| GC | icbc covered physio | Oct-06:3;Oct-08:2 |
| GC | icbc physio | Oct-03:1;Oct-04:1;Oct-05:1;Oct-07:1;Oct-08:1;Oct-09:1 |
| GC | icbc physiotherapy | Oct-03:1;Oct-04:1;Oct-05:1;Oct-06:1;Oct-07:1;Oct-08:1;Oct-09:1 |
| GC | icbc treatment near me | Oct-03:1;Oct-05:1;Oct-06:1;Oct-07:1;Oct-08:1;Oct-09:3 |
| GC | icbc massage | Oct-03:2;Oct-04:2;Oct-05:2;Oct-06:2;Oct-07:2;Oct-08:2 |
| GC | icbc chiropractor | Oct-03:2;Oct-04:2;Oct-05:1;Oct-06:2;Oct-07:2;Oct-08:2 |
| GC | car accident physiotherapy | Oct-05:2 |
| GC | icbc approved physiotherapy | Oct-05:2;Oct-06:2;Oct-07:3;Oct-09:3 |
| GC Delta | icbc physio | Oct-05:1 |
| GC Delta | icbc massage | Oct-05:3;Oct-07:2 |
| GC Delta | icbc chiropractor | Oct-04:2 |
| GC Delta | icbc approved physiotherapy | Oct-05:1;Oct-07:1;Oct-08:1 |
| GC Delta | icbc physiotherapy delta | Oct-03:2;Oct-04:2;Oct-05:1;Oct-07:3 |
| GC Langley | car accident physiotherapy | Oct-05:2 |
| GC Burnaby | icbc physio | Oct-09:3 |
| GC Burnaby | icbc treatment near me | Oct-08:1 |
| GC Burnaby | icbc massage | Oct-06:2;Oct-07:1;Oct-08:2;Oct-09:3 |
| GC Burnaby | icbc chiropractor | Oct-03:2;Oct-04:2;Oct-07:2 |
| GC Burnaby | icbc claim physiotherapy | Oct-06:2;Oct-08:2 |
| GC Burnaby | physio after car accident | Oct-04:1 |
| GC Burnaby | car accident physiotherapy | Oct-03:2;Oct-04:1;Oct-05:1;Oct-06:2;Oct-07:2;Oct-08:2;Oct-09:2 |
| GC Burnaby | icbc approved physiotherapy | Oct-03:2;Oct-04:1;Oct-05:3;Oct-06:2;Oct-07:2;Oct-08:2;Oct-09:2 |
| GC Burnaby | icbc physiotherapy burnaby | Oct-03:2;Oct-04:2;Oct-06:3;Oct-07:3;Oct-08:2;Oct-09:2 |
| GC Cloverdale | icbc physio | Oct-03:3;Oct-04:1;Oct-05:1;Oct-06:1;Oct-07:2;Oct-08:1 |
| GC Cloverdale | icbc physiotherapy | Oct-03:2;Oct-04:2;Oct-05:1;Oct-06:1;Oct-07:2;Oct-08:2;Oct-09:2 |
| GC Cloverdale | icbc treatment near me | Oct-05:1;Oct-06:3;Oct-07:2 |
| GC Cloverdale | icbc massage | Oct-03:1;Oct-04:1;Oct-05:1;Oct-06:1;Oct-07:3;Oct-08:1;Oct-09:1 |
| GC Cloverdale | icbc chiropractor | Oct-04:2;Oct-05:2 |
| GC Cloverdale | car accident physiotherapy | Oct-03:3;Oct-04:2;Oct-05:1;Oct-06:2;Oct-07:1;Oct-08:2;Oct-09:2 |
| GC Cloverdale | icbc approved physiotherapy | Oct-03:1;Oct-04:1;Oct-05:1;Oct-06:2;Oct-07:1;Oct-08:1;Oct-09:2 |
| GC Cloverdale | icbc physiotherapy cloverdale | Oct-05:2;Oct-06:1;Oct-07:2;Oct-08:2 |
| GC Cloverdale | icbc physiotherapy surrey | Oct-03:2;Oct-04:2;Oct-05:1;Oct-06:1;Oct-07:2;Oct-08:1;Oct-09:1 |

#### 1.2.6 Location-specific rankings, "ICBC Treatments" group (KNOWN, Oct-09 organic position by engine)
"-" = not in the top 100; N/A = not checked on Oct-09; "(not tracked)" = the keyword is not in that engine's list. Daily values for every cell are in `data/historical-rankings-daily.csv`.

| Keyword (Oct-09 organic position) | GC | GC Delta | GC Langley | GC Vancouver | GC Burnaby | GC New Westminster | GC Richmond | GC Abbotsford | GC Cloverdale |
|---|---|---|---|---|---|---|---|---|---|
| icbc treatment | 19 | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) |
| icbc physiotherapy surrey | 5 | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) | 5 |
| icbc covered physio | 21 | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) |
| icbc massage therapy surrey | 7 | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) |
| icbc physio | 12 | 10 | 12 | 11 | 11 | 11 | 11 | 11 | 12 |
| icbc physiotherapy | 13 | 12 | 10 | 11 | 10 | 11 | 11 | 15 | 15 |
| icbc treatment near me | 5 | 9 | 4 | 9 | 8 | 3 | 12 | 10 | 5 |
| icbc massage | 18 | N/A | N/A | 75 | 78 | 74 | N/A | 73 | 21 |
| icbc chiropractor | - | - | 21 | 29 | 27 | 23 | 24 | 21 | - |
| icbc kinesiology | 68 | N/A | 64 | 63 | 63 | - | 62 | 63 | 65 |
| icbc claim physiotherapy | 8 | 8 | 8 | 9 | 8 | 8 | 8 | 7 | 8 |
| physio after car accident | 2 | 3 | 3 | 3 | 2 | 2 | 3 | 5 | 2 |
| car accident physiotherapy | 2 | 2 | 3 | 2 | 2 | 2 | 2 | 3 | 2 |
| icbc approved physiotherapy | - | 13 | 10 | 8 | - | 10 | - | 15 | 10 |
| icbc physiotherapy delta | (not tracked) | 3 | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) |
| icbc physiotherapy langley | (not tracked) | (not tracked) | 4 | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) |
| icbc physiotherapy vancouver | (not tracked) | (not tracked) | (not tracked) | 6 | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) |
| icbc physiotherapy burnaby | (not tracked) | (not tracked) | (not tracked) | (not tracked) | 5 | (not tracked) | (not tracked) | (not tracked) | (not tracked) |
| icbc physiotherapy new westminster | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) | 10 | (not tracked) | (not tracked) | (not tracked) |
| icbc physiotherapy richmond | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) | 3 | (not tracked) | (not tracked) |
| icbc physiotherapy abbotsford | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) | 7 | (not tracked) |
| icbc physiotherapy cloverdale | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) | (not tracked) | 2 |

City-modified keywords on their own city engine, Oct-09 (KNOWN):
- icbc physiotherapy cloverdale **2**
- icbc physiotherapy delta **3**
- icbc physiotherapy richmond **3**
- icbc physiotherapy langley **4**
- icbc physiotherapy burnaby **5**
- icbc physiotherapy surrey (Cloverdale engine) **5**
- icbc physiotherapy vancouver **6**
- icbc physiotherapy abbotsford **7**
- icbc physiotherapy new westminster **10**

Average organic position across each engine's ranked keywords, Oct-09 (DERIVED; each engine's keyword set differs, so do not compare them):
| Engine | Ranked / tracked | Top 10 | Avg position of ranked |
|---|---|---|---|
| Google Canada | 29 / 34 | 22 | 7.4 |
| Delta | 8 / 11 | 6 | 7.5 |
| Cloverdale | 11 / 12 | 7 | 13.4 |
| Langley | 10 / 11 | 7 | 13.9 |
| Richmond | 9 / 11 | 4 | 15.1 |
| New Westminster | 10 / 11 | 6 | 15.4 |
| Vancouver | 11 / 11 | 6 | 20.5 |
| Abbotsford | 11 / 11 | 5 | 20.9 |
| Burnaby | 10 / 11 | 6 | 21.4 |

No city engine exists in Report B for Surrey neighbourhoods other than Cloverdale: Newton, Fleetwood, Guildford, Cedar Hills, Strawberry Hill, Sullivan, Clayton, South Surrey, King George. Local results for those areas are UNKNOWN from these files.

### 1.3 What this means for the WorkSafe project (LIKELY / ASSUMPTION, for the strategist)
1. **No WorkSafe ranking history exists in Drive (KNOWN).** Report A's `wcb` and `worksafebc` rows are scoped to ICBC pages and were never in the top 100. Report B tracks no WorkSafe terms. The pillar and location pages will launch without an in-house baseline. Recommendation for the owner only (I made no changes): add WorkSafe keywords to the SE Ranking domain project, using the same 8 city engines plus Surrey-neighbourhood engines.
2. **The ICBC location-page pattern did get pages ranking (LIKELY, correlation only).** The ICBC location pages were crawled 2026-09-25 (`research/02-icbc-location-pages.csv`). City-modified ICBC terms then sat at positions 2-10 on their own city engines during Oct-03 to Oct-09 (Report B). The Report A snapshot from Vancouver only was close to zero, so engine location matters a lot when measuring local pages.
3. **Branded demand is fully captured (KNOWN, positions 1-2).** The upside for WorkSafe is in non-branded terms.
4. **AI visibility is weak (KNOWN):**
   - Report A: 0% brand mention and 0% link presence, while 85% of the tracked prompts showed an AI Overview.
   - Report B: 10% mention and 0% link presence on Oct-09, both falling.
   - The prompt sets are unknown, so the topics behind these figures are UNKNOWN.

### 1.4 Other SEO exports found in Drive (opened; small; not WorkSafe-specific)
| File | Id | Content (KNOWN) | Relevance |
|---|---|---|---|
| synergyrehabilitation.ca-Performance-on-Search-2026-10-05 (Google Sheet, GSC export) | 1T9koafQBq3nynysIk1awSxC0KJ4KvBIFlajtA62bX00 | Filtered to a **single page**, `https://synergyrehabilitation.ca/pain-under-rig...` (title truncated in the export).<br>Last 28 days: 5 clicks, 3,279 impressions, CTR 0.15%, position 14.82.<br>Previous 28 days: 29 clicks, 7,047 impressions, CTR 0.41%, position 16.35.<br>1,188 query rows, all right-shoulder-pain queries.<br>Countries, last 28 days: US 625 impressions, Canada 385, UK 215. | Not WorkSafe. It shows a blog post losing impressions and earning mostly non-Canadian impressions. |
| synergyrehabilitation.ca-core-web-vitals-Issue-2026-10-02 (Google Sheet, GSC CWV export) | 1H4BZcone-sQgnImb6VbTPhPgICtinYsGNs7XWUWGa_U | Issue: **"INP issue: longer than 500ms (mobile)"**.<br>Example URL `https://synergyrehabilitation.ca/`, group population 45, group INP **823ms**.<br>Affected URLs rose from 11 (2026-07-03) to 45 (2026-09-30). | Relevant to the page-template spec: new WorkSafe pages should not inherit the slow-INP template (ASSUMPTION that they share the theme). |

---

## 2. NAP table: "Synergy Rehab Yelp Location List"
Source: Google Sheet id 1z3KpbC5G8Gk_157f70Af2a31cniK9JtVaXSRXFnbQzc, tab "Client - Listing Information". Drive modifiedTime 2026-09-22T20:10:04Z; shared with the user 2026-09-08. The sheet is a Yelp multi-location onboarding template filled in for Synergy.

Values are verbatim. Phones are kept in the sheet's 11-digit format. Full fields, including categories, URLs with UTMs and booking URLs, are in `data/yelp-nap.csv`.

| # | Business Name | Street 1 | Street 2 | City | Prov | Postal | Phone (BusinessPhoneNumber) | Yelp call-tracking no. (BusinessMeteredPhone) | Booking (Desktop CTA) | Business Hours | Notes col. | Yelp Business ID |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Synergy Rehab Abbotsford | 3720 Townline Rd | Ste 100 | Abbotsford | BC | V2T 0G6 | 16047765700 | 12362323135 | Jane: abbotsford | Mon:8AM-8:30PM, Tue:8AM-8:30PM, Wed:8AM-8:30PM, Thu:8AM-8:30PM, Fri:8AM-8:30PM, Sat:9AM-5PM, Sun:9AM-2PM | Primary/Paid EP & BP location | NAaeMuJ-dPsDeCMB0LCviw |
| 2 | Synergy Rehab Burnaby | 4695 Canada Way | Unit 201 | Burnaby | BC | V5G 1K8 | 16045588873 | 12363126481 | Jane: burnaby | Mon:7:30AM-8:30PM, Tue:7:30AM-8:30PM, Wed:7:30AM-8:30PM, Thu:7:30AM-8:30PM, Fri:7:30AM-8:30PM, Sat:8AM-5PM, Sun:9AM-3PM | (blank) | ysrxb0cBpNZPH__tRHVWbw |
| 3 | Synergy Rehab Langley | 8045 204 St | Unit A130 | Langley Township | BC | V2Y 5K1 | 16043711988 | 12363126372 | Jane: langley | Mon:8AM-8:30PM, Tue:8AM-8:30PM, Wed:8AM-8:30PM, Thu:8AM-8:30PM, Fri:8AM-8:30PM, Sat:9AM-4PM, Sun:8AM-4PM | (blank) | wpeAuh6EaCU6G9PDsgh2lg |
| 4 | Synergy Rehab New Westminster | 301 East Columbia St | Unit 405 | New Westminster | BC | V3L 3W5 | 16045533303 | 12369000219 | Jane: new-westminster | Mon:8AM-8:30PM, Tue:8AM-8:30PM, Wed:8AM-8:30PM, Thu:8AM-8:30PM, Fri:8AM-8:30PM, Sat:9AM-4PM, Sun:8AM-4PM | (blank) | 6bEy9CrHKZWWLUHNbAhDWQ |
| 5 | Synergy Rehab Delta | 10757 Delsom Crescent | Unit 103 | Delta`\t` | BC | V4C 0A8 | 16045168505 | 12368950035 | Jane: delta | Mon:7:30AM-8:30PM, Tue:7:30AM-8:30PM, Wed:7:30AM-8:30PM, Thu:7:30AM-8:30PM, Fri:7:30AM-8:30PM, Sat:8AM-4PM, Sun:8AM-4PM | (blank) | u1pAvZxHcKd-z_p8vrOIRA |
| 6 | Synergy Rehab Richmond | 11688 Steveston Hwy | Unit 8060 | Richmond | BC | V7A 5J3 | 16042845113 | 17787322303 | Jane: richmond | Mon:8AM-8:30PM, Tue:8AM-8:30PM, Wed:8AM-8:30PM, Thu:8AM-8:30PM, Fri:8AM-8:30PM, Sat:9AM-5PM, Sun:9AM3PM | (blank) | g00RldXcbw2_fXcgQxAFCg |
| 7 | Synergy Rehab Newton | 14468 72 Ave | Unit 101 | Surrey | BC | V3S 2E6 | 16045473761 | 12368950224 | Jane: newton-72nd | Mon:7:30AM-8:30PM, Tue:7:30AM-8:30PM, Wed:7:30AM-8:30PM, Thu:7:30AM-8:30PM, Fri:7:30AM-8:30PM, Sat:8AM-7PM, Sun:8AM-4PM | (blank) | kjaflXwGV90Ay3NigQJD6A |
| 8 | Synergy Rehab Strawberry Hill | 12422 72 Ave | Unit 206 | Surrey | BC | V3W 2M5 | 16045470670 | 12368950055 | Jane: strawberry-hill-72nd | Mon:8AM-8:30PM, Tue:8AM-8:30PM, Wed:8AM-8:30PM, Thu:8AM-8:30PM, Fri:8AM-8:30PM, Sat:8AM-4PM, Sun:8AM-4PM | (blank) | s35R1giExpOX__UtPb5qUQ |
| 9 | Synergy Rehab Nordel | 12565 88 Avenue | Unit 116 | Surrey | BC | V3W 3J7 | 16045031688 | 12363126528 | Jane: nordel-88-ave | Mon:7:30AM-8:30PM, Tue:7:30AM-8:30PM, Wed:7:30AM-8:30PM, Thu:7:30AM-8:30PM, Fri:7:30AM-8:30PM, Sat:8AM-5PM, Sun:8AM-4PM | (blank) | uPRCb0hdrY89s4mnCXsd_w |
| 10 | Synergy Rehab Cedar Hills | 12852 96 Ave | Unit 120 | Surrey | BC | V3V 6A8 | 16044980877 | 17787322283 | Jane: cedar-hills | Mon:7:30AM-8:30PM, Tue:7:30AM-8:30PM, Wed:7:30AM-8:30PM, Thu:7:30AM-8:30PM, Fri:7:30AM-8:30PM, Sat:8AM-4PM, Sun:9AM-5PM | (blank) | AuXYybDKObfgQf4PNSZ1TA |
| 11 | Synergy Rehab Central City | 13655 Fraser Hwy | Unit 120 | Surrey | BC | V3T 0P8 | 16049541475 | 12363124575 | Jane: central-city | Mon:7:30AM-8PM, Tue:7:30AM-8PM, Wed:7:30AM-8PM, Thu:7:30AM-8PM, Fri:7:30AM-8PM, Sat:8AM-4PM, Sun:9AM-4PM | (blank) | OwtTeLRBtRJxcfbGPe3cxQ |
| 12 | Synergy Rehab Sullivan | 15325 56th Ave | Unit 106 | Surrey | BC | V3S 0X9 | 16045668773 | 12363126480 | Jane: sullivan-heights-hwy-10 | Mon:7:30AM-8:30PM, Tue:7:30AM-8:30PM, Wed:7:30AM-8:30PM, Thu:7:30AM-8:30PM, Fri:7:30AM-8:30PM, Sat:10AM-6PM, Sun:9AM-5PM | (blank) | eTgU58Jrb5dbrn5YC_dKOg |
| 13 | Synergy Rehab Clayton Corners | 18811 72 Ave | Ste 110 | Surrey | BC | V4N 6W7 | 16044160580 | 12363126538 | Jane: clayton-corners-188-st | Mon:12PM-8PM, Tue:12PM-8PM, Wed:8AM-8PM, Thu:12PM-8PM, Fri:8AM-4PM | (blank) | 18lkGiZk99gJsy6yz_7zfg |
| 14 | Synergy Rehab Clayton Heights | 19161 Fraser Hwy | Unit 105B | Surrey | BC | V3S 8E7 | 16045472860 | 12363126623 | Jane: clayton-heights | Mon:7:30AM-8:30PM, Tue:7:30AM-8:30PM, Wed:7:30AM-8:30PM, Thu:7:30AM-8:30PM, Fri:7:30AM-8:30PM, Sat:8AM-4PM, Sun:9AM-5PM | (blank) | DNhxhtS9QBnaExaBWuJyCg |
| 15 | Synergy Rehab South Surrey | 2388 156 St | Unit 106 | Surrey | BC | V4A 4V4 | 16043855855 | 12363040418 | Jane: south-surrey | Mon:7:30AM-8:30PM, Tue:7:30AM-8:30PM, Wed:7:30AM-8:30PM, Thu:7:30AM-8:30PM, Fri:7:30AM-8:30PM, Sat:9AM-5PM, Sun:9AM-5PM | (blank) | vkIi9qKx8dyWX8hA62DMfw |
| 16 | Synergy Rehab Cloverdale | 5645 177b St | Unit 102 | Surrey | BC | V3S 4H9 | 16045791367 | 17787320961 | Jane: cloverdale-hwy-10 | Mon:7:30AM-8:30PM, Tue:7:30AM-8:30PM, Wed:7:30AM-8:30PM, Thu:7AM-8:30PM, Fri:7:30AM-8:30PM, Sat:8AM-4PM, Sun:8AM-4PM | (blank) | lPvvN5N3XwP3FWoMSvrwKg |
| 17 | Synergy Rehab King George | 8056 King George Blvd | Unit 101 | Surrey | BC | V3W 5B5 | 16045039033 | 17787261956 | Jane: king-george | Mon:7:30AM-8:30PM, Tue:7:30AM-8:30PM, Wed:7:30AM-8:30PM, Thu:7:30AM-8:30PM, Fri:7:30AM-8:30PM, Sat:8AM-4PM, Sun:8AM-3PM | (blank) | aXstgTn6tjOhiYcDYfD9Kg |
| 18 | Synergy Rehab Fleetwood | 8585 160th St | Unit 103 | Surrey | BC | V4N 1G4 | 16045034799 | 12363040137 | Jane: fleetwood | Mon:7AM-8:30PM, Tue:7AM-8:30PM, Wed:7AM-8:30PM, Thu:7AM-8:30PM, Fri:7AM-8:30PM, Sat:8AM-7PM, Sun:8AM-4PM | (blank) | YSwgYGn9grjktOFHvbi_Tg |
| 19 | Synergy Rehab Vancouver | 3609 W 16th Ave | (blank) | Vancouver | BC | V6R 3C3 | 16044162600 | 12363126484 | Jane: vancouver | Mon:8AM-8PM, Tue:8AM-8:30PM, Wed:8AM-8PM, Thu:8AM-8:30PM, Fri:8AM-8PM, Sun:8AM-1PM | (blank) | fw3B4nUSuwxz5sXjGt0Log |
| 20 | Synergy Optometry | 13190 58A Ave | Unit 105 | Surrey | BC | V3X 1N4 | 16045743282 | 12368950272 | non-Jane: onlinebookingv2.downloadwink.com | Mon:9:30AM-6PM, Tue:9:30AM-6PM, Wed:9:30AM-6PM, Thu:9:30AM-6PM, Fri:9:30AM-6PM, Sat:9:30AM-6PM, Sun:12PM-4:30PM | (blank) | S9oVWa73IUtHDHyhKPIpwA |

**Other listing columns (KNOWN, same for all 19 rehab rows unless noted):**
| Field | Value |
|---|---|
| Yelp categories | "Physical Therapy", "Massage Therapy", "Chiropractors". Optometry: "Optometrists". |
| Business URL | `https://synergyrehabilitation.ca/?utm_source=Yelp&utm_medium=CPC&utm_campaign=EALAUNCH&utm_id=Yelp&utm_content=Synergy_Rehab_<Location>`. Every row points at the **homepage**, not a location page. |
| Display URL | `http://synergyrehab.ca/`. This is a different domain from synergyrehabilitation.ca. Whether it redirects is UNKNOWN, because direct fetch is blocked. |
| Menu URL | `https://synergyrehabilitation.ca/services/` |
| Desktop CTA | "Book Now" / "Book Your Appointment Online!" linking to `https://synergyrehab.janeapp.com/locations/<slug>/book/?utm_...`. The slugs match the Jane links found on the site (`data/site-urls.csv`). |
| Mobile CTA | "Call Now" / "Call Our Clinic To Book Today!" to `tel:+<metered number>`, which is the Yelp call-tracking number. |
| Business Highlights | AVAILABLE_BY_APPOINTMENT, LOCALLY_OWNED_OPERATED, 10_YEARS_IN_BUSINESS, FREE_PARKING, CERTIFIED_PROFESSIONALS |
| Specialties | The same template paragraph for every row, with the location name swapped in ("At Synergy Rehab <Location>, our multidisciplinary practice ..."). |
| History | The same sentence for every row: "Our experienced team offers physiotherapy, chiropractic, massage therapy, acupuncture, kinesiology, sports rehab, vestibular therapy, shockwave therapy, counselling, pelvic health, ICBC and WorkSafeBC rehabilitation, and more. With personalized care across 19 locations, ...". This is a brand-level claim. It does **not** verify WorkSafeBC eligibility per location. |
| Closed checkbox | No row shows a closed value in the export. LIKELY none closed, but empty cells are dropped by the export, so this is not fully verifiable. |

**NAP notes and discrepancies**
- **KNOWN:** "BusinessMeteredPhone" is defined in the sheet header as the number "used for Call Tracking". Use it on Yelp only, **never as website or schema NAP**. Use BusinessPhoneNumber (604 numbers) for the site.
- **KNOWN:** The Delta city cell is "Delta" followed by a tab character, shown as `\t` above. It is a data-hygiene issue in the source.
- **KNOWN, verbatim oddities to confirm with clinics:**
  - Richmond Sunday hours are "9AM3PM" (no hyphen).
  - Vancouver lists Sun:8AM-1PM and no Saturday.
  - Clayton Corners has no Saturday or Sunday hours, and is 12PM-8PM on Mon, Tue and Thu.
  - Cloverdale is Thu:7AM-8:30PM while its other weekdays are 7:30AM.
- **KNOWN, address formats differ between Yelp and the live ICBC location pages** (meta descriptions in `research/02-icbc-location-pages.csv`). Examples:
  - Fleetwood: Yelp "8585 160th St" vs site "8585 160 Street"
  - Sullivan: Yelp "15325 56th Ave Unit 106" vs site "106 - 15325 56 Avenue"
  - New Westminster: Yelp "301 East Columbia St Unit 405" vs site "405 - 301 East Columbia Street"
  - Richmond: Yelp "11688 Steveston Hwy Unit 8060" vs site "8060 - 11688 Steveston Highway"

  These are format differences, not conflicting data. Pick one canonical format per location, ideally matching each GBP. The GBP addresses were not available in Drive.
- **KNOWN:** Langley's Yelp city is "Langley Township", and its 2026 photo folder is named "Yorkson Village Langley". Both LIKELY refer to the same clinic at 8045 204 St.
- **KNOWN:** Yelp's Portfolio copy (sections 3.5 and 3.6) claims "19+ locations ... Surrey, Langley, Vancouver, Burnaby, **Coquitlam**, Delta, Abbotsford and more". The location list has **no Coquitlam row**. This is a claims-register item.
- **KNOWN:** Row 20, "Synergy Optometry", is not a rehab clinic. Exclude it from WorkSafe physiotherapy pages. That leaves **19 rehab locations**, which matches the "19 locations" text.
- **Not reproduced on purpose:** the "Client - BOA Access" tab lists staff names and emails for Yelp account access. It is personal contact data, so it was not copied.

---

## 3. Drive asset inventory
All entries come from `mcp__Google_Drive__search_files` or `get_file_metadata` (KNOWN metadata). "Opened" means the content was read.

### 3.1 SEO reports and data
| Title | Id | Type | Modified | Opened? | Note |
|---|---|---|---|---|---|
| httpssynergyrehabilitation.caicbc-treatments-Project-Report_2026_09_25.pdf | 14hwXKTAFs2nwktzV_KiVMsgACB0B5r8J | PDF | 2026-09-25 | Yes | Report A |
| httpssynergyrehabilitation.ca-Project-Report_2026_10_09.pdf | 19pJ41JcsOq4EnKiN2a18EIvGV5CG1G2j | PDF | 2026-10-09 | Yes | Report B |
| synergyrehabilitation.ca-Performance-on-Search-2026-10-05 | 1T9koafQBq3nynysIk1awSxC0KJ4KvBIFlajtA62bX00 | Google Sheet | 2026-10-05 | Yes | GSC export for one page (see 1.4) |
| synergyrehabilitation.ca-core-web-vitals-Issue-2026-10-02 | 1H4BZcone-sQgnImb6VbTPhPgICtinYsGNs7XWUWGa_U | Google Sheet | 2026-10-02 | Yes | GSC INP issue (see 1.4) |
| Synergy Rehab Yelp Location List | 1z3KpbC5G8Gk_157f70Af2a31cniK9JtVaXSRXFnbQzc | Google Sheet | 2026-09-22 | Yes | NAP source (section 2) |
| Synergy Rehab Ad Performance - 2026 | 1mkv4lyw0vq9sRDb1ZybHdMgsHgg13X78RNUreJj7_pM | Google Sheet (owner yelp.com) | 2026-10-01 | No | Yelp ads; out of scope |
| Ads - Monthly Report | 10IR_ofdtsCFRqg7bWWSEbPvWq7qutMNR_aimJfRz6cg | Google Sheet | 2026-06-01 | No | Paid ads |
| Untitled-report-May-2-2026-to-May-31-2026 (2 Sheets + 1 xlsx); Untitled-report-Jun-2-2026-to-Jul-1-2026.xlsx | 1-wYkN_MgZR5D3_MUTtKCk1AtMS0iAR_0nnRERubtwEA; 1InpMb3tJuHU_A_5LVDC-hifvGLpIkXgpYy86JI0MKnk; 1JZDKEjbMY2rqlMhG-QwwgKK6H5mENzuU; 1pZOziFrTqgH2GHuio-ekdVA433daKEmj | Sheet / xlsx | 2026-06 / 2026-07 | No | Content UNKNOWN (LIKELY ad-platform exports) |
| Synergy Data | 1joL7QFT14FnotYQx6TCAZE-aaxtVM5OTgqGwIaxZxCE | Google Sheet (1 KB) | 2026-08-18 | No | Content UNKNOWN |
| Ideas for new locations | 1cl5ZbrjEPYInZtVeW9OC51TCswG2M0KU4cDS8f0dl4w | Google Doc | 2022-09-06 | No | Old planning doc |

No keyword-list, GBP-export, citation-audit or SE Ranking CSV files were found by title search (KNOWN). Searches run: keyword, SEO, ranking, GBP, Google Business, listing, NAP, citation, location.

### 3.2 Brand
| Title | Id | Type | Modified | Note |
|---|---|---|---|---|
| Synergy Brand Guidelines: Marketing Strategy & Design Details | 10AyAkePMpl85YV8jkEN6l3O-ucnr1mlAUAeRm-Hbqk4 | Google Doc | 2024-05-14 | Opened. Summary below. |
| Synergy Rehab Logo.png | 1j22GFCzPCJG3IoPfspIwkIooOP_n4jCw | PNG, 30 KB | 2026-05-04 | Current logo (LIKELY) |
| New White Logo (3) (2).png | 1eillxR0IdkHgR5xxP7tgVPQxBfwgvf1P | PNG, 375 KB | 2026-05-04 | White logo |
| New White Logo.png | 1jLGyooJ9zCIKOu6tA7mUEhdWsgl_dGXz | PNG, 375 KB | 2021-10-14 | Same size as above, so LIKELY the same file |
| New Synergy Logo.zip | 13yYopKpDpHqpAqq2OM_fLVv8Lm2G20C8 | ZIP | 2021-08-04 | Logo pack |
| logo-01.jpg (folder "New Synergy Logo" 1eZW-hyY7qnYVRZChcR5g4j4YbM6AL_mk) | 12QjJlOkfcviK55ouzVywPWBIHDnEJc7B | JPG | 2021-06-07 | |
| logo_color-pride.jpg | 1mwfKS7zvVfWHR12iqYUSP9IYxxSdweF_ | JPG | 2022-07-15 | Pride variant |
| *logo.jpg (Yelp folder) | 1dRditwXXhQny0zzT8TgKR1rqNshmW7wt | JPG, 23 KB | 2026-09-01 | Logo supplied to Yelp |
| Folder "Logo" / folder "logo video" | 1ySOHfxD-wVYOZHomkkrkHHnoxqeF6PNL / 1nKLP2FGiIepXAJGWX18P3tBIouFj4oNa | Folders | 2026-05-26 | Agency (Spark Labs) folders |
| A/B BRANDING VIDEO.mp4 | 1nuBYP3Dkk0P6NL5n_1qod7fed08E8Ewc | MP4, 148 MB | 2022-03-07 | |

Brand guideline content (KNOWN; the doc dates from 2018 to 2024, so it may be partly out of date):
- Colours: "Blue: 27449F", "Green: 39B73E". A second palette in the same doc lists primary blue RGB (48, 101, 181), white, light blue (39, 160, 190) and lighter blue (3, 136, 192). The doc is internally inconsistent, so confirm against the live site CSS (UNKNOWN).
- Font: Alegreya Sans SC, bold 700.
- Slogan: "We've got your back!"
- Logo: white logo in the corner, used sparingly.
- **Compliance flag:** the doc's "business edges" are ICBC-era claims such as "Do not pay anything until your ICBC settlement" and "most affordable options in the province". They are not suitable for WorkSafe pages and conflict with the WORKSAFE-ONLY scope rule. Do not reuse them.

### 3.3 Clinic photos by location (metadata only; no images opened)
Main set: folder **"Synergy Rehab Photos & Logo"** (1rydBSLVxGveZ_EigLs_i9bk7kQLhFq2D). It was created by a Yelp account manager and shared; the subfolders are owned by marketing@synergy-rehab.ca and were populated 2026-08-28 to 2026-09-15. It also contains:
- a "Synergy Optometry Surrey" folder (14b_rbivbY5fZzj0uE5puFvJXzAavJFS8, 88+ PNGs; not rehab)
- a "Portfolio" folder (1GfssDg2cNX2fUW_mneITIG92Efox0wcn)
- AllLocationPhotosLargeFile.zip (1HvLr6iX8WDzHHhkJBFZ_5jgGdlUAJuHb, 69 MB, owner yelp.com)
- 8 loose root JPGs

Per-file list: `data/drive-location-photos.csv`.

| Location folder | Folder id | Files | JPEG | PNG | Unique to this folder (title+size not found in another location folder) | Modified range |
|---|---|---|---|---|---|---|
| Abbotsford | 1z28uWG9bVc6a5m5vtfzDG_pEK02wPt63 | 44 | 27 | 17 | 26 | 2026-08-28..2026-09-09 |
| Burnaby | 1XXgZzOGI9xT0qpx8S3fcbDElP6LmqTWH | 46 | 36 | 10 | 30 | 2026-08-28..2026-09-09 |
| Cedar Hills | 1AheZDViT0AByfZCuWA5vuvZroXvndubB | 15 | 6 | 9 | 9 | 2026-09-09..2026-09-10 |
| Central City | 1ci375_zUxGsumyga2_feUMuRt7zYFyzZ | 19 | 8 | 11 | 11 | 2026-09-09..2026-09-10 |
| Clayton Corners 188 St | 1jzed9kzgZgdMLpiLroQEFrdNQ42gN_sQ | 26 | 8 | 18 | 18 | 2026-09-09..2026-09-10 |
| Clayton Heights | 1XfD9MoV5h5x6KeBbpmMKge33XaWaEFdJ | 32 | 32 | 0 | 32 | 2026-09-10 |
| Cloverdale | 1d1gsqL8-IUrvJf5YADTupWYeJCskOj9O | 25 | 8 | 17 | 17 | 2026-09-09..2026-09-10 |
| Delta | 1NEut1DgcGw7MQn2z8_8m7UsLwsjw8N9Z | 12 | 12 | 0 | 5 | 2026-09-09..2026-09-15 |
| Fleetwood | 1TQh3ypR2-e7p7M53j7Vb5F0AIPlhsDWx | 29 | 29 | 0 | 15 | 2026-08-28..2026-09-10 |
| King George | 1vgAXISMXB6GdngeOTzGd2swuKII72heR | 48 | 29 | 19 | 34 | 2026-08-28..2026-09-11 |
| New Westminster | 1kBx-k1vvz5zSwl3tfVQBPFwdsgh0Qzqy | 27 | 14 | 13 | 13 | 2026-08-28..2026-09-11 |
| Newton 72nd Ave | 1nQzftPhRwmEXNQOMM7Nchz2zB-qHae33 | 25 | 14 | 11 | 11 | 2026-08-28..2026-09-11 |
| Nordel | 1uKiiKNAATWAlY-N_-qEhIBj4epdIv18m | 32 | 19 | 13 | 16 | 2026-08-28..2026-09-11 |
| Richmond | 1aT-j-3bAxiYZNkrmk1ad73OfPOGi0HFN | 16 | 7 | 9 | 9 | 2026-09-09..2026-09-14 |
| South Surrey | 16KtyU61C6VuzMjViTGZ2r5BuU-SpwXlw | 44 | 7 | 37 | 37 | 2026-09-09..2026-09-14 |
| Strawberry Hill | 1OrkTzwihepBKTztyG2xXqkPFIyYYX8oT | 16 | 7 | 9 | 9 | 2026-09-09..2026-09-14 |
| Sullivan | 1poNgnjyuAKGEgbzH5L-m8vlYH43rSaQv | 40 | 40 | 0 | 40 | 2026-09-14 |
| Vancouver | 1ubJEJLcCxH2wR3OWEhLmINgfJ_ss2qGU | 49 | 31 | 18 | 42 | 2026-09-09..2026-09-15 |
| Yorkson Village Langley | 155YUFa8cHPOjL43p2QrvtMm_NSARRWZx | 27 | 7 | 20 | 20 | 2026-09-09..2026-09-14 |
| **Total (19 rehab folders)** | | **572** | | | | |

**Distinctness flag (KNOWN):**
- 19 files appear with the same title and byte size in 2 or more location folders.
- Five shots appear in 17 of the 19 folders, and two more in 16.
- Six shots are shared by Abbotsford, Burnaby, Fleetwood, King George, New Westminster, Newton and Nordel.

LIKELY these are brand-wide stock or team images, not clinic-specific photos. For "genuinely distinct" location pages, use only the files flagged as unique to a folder (empty `also_in_folders_same_title_and_size` column in the CSV). Delta has only 5 unique files and Cedar Hills, Richmond and Strawberry Hill have 9 each, so new photography may be needed there (ASSUMPTION).

**Consent (UNKNOWN):** no image was opened. Whether any photo shows identifiable patients, and whether consent exists, is unknown. Check before publishing.

Legacy agency set: folder **"Images"** (1UoyRoX_dLu-WZSLLVIBL3Q-1Supvc4GV, Spark Labs). Contents were not counted.
| Subfolder | Id | Date |
|---|---|---|
| Clayton Location | 1AlqG9NAOOk5McfHcvTXPpmtMtYUtuHUN | 2022-2023 |
| Cloverdale Location | 139Qvso7umPYAYHQJTAXI1IEp9OCnj5ta | 2022 |
| Fleetwood Location | 11gQuZekhz4rpOSoO9SnbRxv9BOFdyeGy | 2022 |
| Nordel Location | 1EyVAlgpQg5kFdXsYPiv6VU4ryuZcTMz9 | 2022 |
| Burnaby Location | 1pmHWC_u7F_yobl7D1K30wNvW9pyayRD0 | 2022 |
| Abbotsford | 1ky8pkonY_TZzcnoAHzjFb2uohDNi7VuR | 2023 |
| Aug 2025 Fleetwood Images | 1wkcAQ9HbnE0NWoWhgSWNjkDKdE-HQnZS | 2025 |
| August 2025 Sullivan | 1DzjuOBhJCNLIhLvrI3QYjVx4bv2-DQEW | 2025 |
| Workshop Langley | 1NmFbzlcIMHq0k6LEeWJL_jbDbXepMOoR | 2025 |
| Unsorted Images | 1BMmFBBp9u9z13iynL0ffl-sL6Q33DVi6 | 2022 |
| Career pics | 1oJV7IjXsBUifogzdoPtGE1f4gqU7gaA- | 2024 |
| Synergy training content may 2024 | 1ZKf8XtWkJYC5z1mTdzKXOZHXAV9fZKmq | 2024 |
| LP's and Email Content | 1pYKTDjTnmIZoLZwZRYX6E7geR5eTYweq | 2025 |

Event folders (Halloween at Synergy Delta, Synergy Xmas Party 23, Synergy BBQ photos 2024 zip) were found but are not useful for location pages.

### 3.4 Practitioner and staff assets
| Title | Id | Type | Modified | Note |
|---|---|---|---|---|
| All Synergy Staff Images (folder) | 1WEhY07-IK5MlF90XWO1m-whnNcHO5iy2 | Folder | 2026-05-26 (created 2022) | Staff headshots; probably out of date (UNKNOWN) |
| All Synergy Staff Jpeg (folder) | 1aC1KffdBeHzvpdjDs4G73I3j0G8RXxJq | Folder | 2022-01-31 | |
| Physiotherapist headshot (2 copies, a named staff member) | 1ncWFaDktb3ttspbJumT9BY6PG804cB-M, 15qwGt541FR3nj42p1VSPqzih9B-xBChZ | JPEG | 2022-01-24 | Whether this person is still on staff is UNKNOWN |
| Staff.png | 1XOBl7GpSzRKZcSAMRnLa7Dtwr9KJ51gg | PNG | 2020-11-20 | |
| Therapist Onboarding Checklist (Doc + PDF) | 1c0pYLuK_R1dlUyj3NsvzxrFPhi77sa4UvBhthABuwxk; 1BNs3MDcPDPs8ihPuKUeg9GyQhWGp3fku | Doc / PDF | 2026-05-08/09 | Not opened |

**No practitioner roster** (names, credentials, location assignments, WorkSafe-registered providers) was found (KNOWN, title search: practitioner, staff, team, physiotherapist, bio). Per-location practitioner data must come from the Jane App or the site.

### 3.5 WorkSafe / WCB documents and media
| Title | Id | Type | Modified | Note |
|---|---|---|---|---|
| synergy-worksafe-portfolio.zip | 1vQCTOkXBtLAgR5_aCCiOlixjBzl4jMFc | ZIP, 952 KB | 2026-09-14 | Photo pack for the Yelp WorkSafe portfolio (linked from Yelp sheet Portfolio #2). Not opened. |
| Yelp sheet tab "Client - Portfolios - Creative", Portfolio #2 | in 1z3KpbC5G8Gk_157f70Af2a31cniK9JtVaXSRXFnbQzc | Sheet text | 2026-09-22 | Title: "WCB and WorkSafeBC Approved Physiotherapy Near You. No Referral Needed, Direct Billing. 19+ Lower Mainland Clinics". Full WorkSafe body copy (read; claims in 3.6). |
| Synergy WCB Video Official Web Compressed For Video Box.mp4 | 1WYT7nW2X8AjHCHx8lwS0OvmhYFz_cray (2026-04-28) and 1-zopW2iYhD3OLayUORkn2jO3CiFVyoKg (2023-06-12) | MP4, 21,048,086 B each | see id | Same byte size, so LIKELY the same video. Candidate WorkSafe pillar embed (content not viewed). |
| Synergy Injury Video Web Optimized for Video Box.mp4 | 18lAWMUFMuh_3xDOkt2Q0ERg994h5Ngsx (2026) and 17u5C5mvT9oHsfa2fYaPaaaeKD_Dzdv6y (2023) | MP4, 20,760,532 B | | LIKELY the same video |
| Scripts (Doc, Spark Labs) | 1yh37qhJtziSy99hqlBn1GCJHGgFMHFU3uHfo0OGjF5U | Google Doc | 2025-09-16 | Matched fullText "WorkSafeBC". Not opened (LIKELY video scripts). |
| Social caption docs 2020-2023 that mention WorkSafeBC (e.g. "Synergy Rehab - October 2023.docx" 1UOMKz2cNkJVVvv1cGeEnmvqmWikE3TlV, "Synergy Rehab - MARCH 2022.docx" 1jEf485X0GzgI9Mz1_FYsUrfmCHmm7zQ6, "Synergy Rehab - June 2022.docx" 1ZHfOGk0PHguEa8iYlVawZJ6eDUj4jwkb, plus 16 monthly caption docs from 2020-2021) | various | DOCX | 2020-2023 | fullText match only; not opened; probably out of date |
| 06.jpg / 14.png (social graphics matching "WorkSafeBC") | 11lXpnI7undgUFZvd-FBtVNKvicwsHM82 / 1FgT8gbsfz37NUid0MVWldCXGuAfbcVZt | JPG / PNG | 2023 / 2022 | fullText (OCR) match; not opened |

**No official WorkSafeBC documents** were found by title or fullText search (KNOWN, search-limited). This covers vendor or health-care-provider agreements, fee schedules, forms and program letters. Eligibility of each clinic as a WorkSafeBC provider cannot be verified from Drive.

### 3.6 Claims in the Drive WorkSafe copy that need verification (not verified here)
From Yelp sheet Portfolio #2 (KNOWN that the copy says this; truth UNKNOWN):
- "WorkSafeBC pre-approves an initial block of physiotherapy, usually around 10 visits over about five weeks". Must be checked against official WorkSafeBC sources.
- "No referral needed in most cases" / "Some specialized programs do need one".
- "We bill WorkSafeBC directly ... For most people that means nothing to pay up front".
- WorkSafeBC claim covers "Ergonomic assessment" and "Custom orthotics". These are coverage claims and need official confirmation.
- "19+ locations ... Coquitlam". There is no Coquitlam row in the location list (section 2).
- "Physiotherapists, kinesiologists and registered massage therapists work on your file together". Per-location staffing is UNKNOWN.

### 3.7 Skipped: not opened (possible patient, personal or credential data, or irrelevant)
| Title | Id | Reason skipped |
|---|---|---|
| SynergyRehab_Patients_19270703_20260731.xlsx | 1ZK5sXwkKKgXRcTpiAGOniIIAma_RETsN | Patient records |
| OPTOMETRY - PATIENT FILES AUG 2022 - JULY 26.xlsx | 1-NOX7wgdR2m0PbW_hy84hkqrCfdkOd_5 | Patient records |
| leads.csv / leads (1).csv / leads (2).csv | 1wUXP5LOFept8G6DtIulD4iyGMNzAnDya / 1vJZMaNjgI0B0I6BNnpv2R3SdarXjyehs / 1wkiMLI6cuF4pKKvVsg8nZWh_9R0644g9 | Personal contact data (leads) |
| Lead generation - Meta ads; Leads - Recruitment Meta Ads | 16RvDzDdoIrBemKIvVhKU4oJMeLJxH21M0pw5vh2DQ04; 1ZjpMYacjRMPX2U9DSprlAT7s9MD5RsjkrGwrFVabQJQ | Personal contact data (leads) |
| Synergy Rehab Call Tracking - 2026 | 1_aAZUDmwy6wdAHHkwKVyVPZA4bpTx5zBejG0OTMr0tY | May contain caller phone numbers |
| Jane App Setting Reviews (Backup August 26).pdf | 17phjIKogJknYvn57aJujHxNz-8RfDvtH | May contain patient names or review text |
| SYNERGY FILLABLE FORM (Doc + PDF) | 1DFSw8f0gjBozwFa1oqWW6oWUAKy8p6u298Ehntzqoss; 1GmM69Qr11VBbz3jZPsVuinKfJGSOCNpi | Possibly a patient intake form |
| "physio vs patient" folder | 1Rn0YSq7ulPTOKKrt7pbBVrxYx28KfFV7 | Possible patient footage |
| Testimonial videos (testimonial1-4.mp4, Testimonial3.mp4, testimonial2.2/3.2.mp4, one more testimonial video whose title includes a first name (title not reproduced), "Review 2 .mp4"; folder "Testimonials" 17x6r9je9ADcJzH6oQM629_jOZJimJ6Fb) | 1q13G92D8MxXDQ_a_zHN6nIiz67OS_jON, 1gaLWgQZKz2OjVTk6yEaHw021eumRwxa2, 10bbP6Gdu7U1MZoQRf5L7f2VJAtUt6tZK, 1ZWJyrys087H6a67hVQmll0eGzB-FGeBt, 1q0wRErpOUsKlkBGpYRVeyJfwSHIElatd, 1MmjipsHlwtJq2r4o4j6xGV0_PX0Me0Rs, 13dGb570fXnERd9i4VdF-EYXQJWXyOD3s, 1CaTroVmGOXCPEFqsUKWQ7cZ4gYo4qX2q | Identifiable patients; consent status UNKNOWN |
| Marketing - Logins | 1y6phMtQbZqwNQwekVGI6KETeuCJOWZN9gqV-GmDdlZw | Credentials |
| Mileage reports (3), Reimbursement Form .xlsx | 1vRQI3T9ppssKRYnY4JPnEL0_RCkq8sNQ, 12CTi8RCRg2cT0oNfvGP6r9SNHXiu80Lj, 1Kusi4LSNZ3WkXVi7K1_KkGOzaIyDXnyb, 1Zm-0hc7Xjx1pUQb8EPrBlnw5Z1hkz7sI | Staff finance; irrelevant |
| Yelp sheet tab "Client - BOA Access" | inside 1z3KpbC5G8Gk_157f70Af2a31cniK9JtVaXSRXFnbQzc | Staff emails. Seen in the snippet but not copied. |
| Meeting notes (Gemini) 2026-09-08; SETUP.md; weekly-prompt.md; post.md; google-post.md | 15Ll3H2lcOuqU5iFqMbNGdgmYSy5b7URZeWuVwtKRvLg; 1VSpArk2nM96zcEQrXhohA78NoURftvRwXBJaznaOLlA; 1_r4kHmi5hRZCrCem_J7fLkbDmDjthacZTtTVWw669l8; 1nQXS6Vk7wKBtHRBcURKUpb_s9SBYSKSSNMiowY2pC8M; 1eBhH-hCgrVp40uOF4mvQVq4fI6_Ph_ua95OArtkVp0E | Not opened: internal notes and automation; outside this task |

---

## 4. Data gaps
| Gap | Why |
|---|---|
| Ranking URLs per keyword | The SE Ranking PDF export does not print them. The `url` column is "Not Available". |
| Competitor data | Neither PDF has a competitor section |
| AI tracking details (engines, prompts) | Not printed in the PDFs |
| Distribution-of-positions bars and daily average-position values | Graphics only. Summary tiles and daily tables were extracted instead. |
| Domain-level WorkSafe ranking baseline | No WorkSafe keyword is tracked in the domain project, and Report A is scoped to ICBC pages |
| Local results for most Surrey neighbourhoods | Report B has city engines only for Cloverdale plus 7 other cities |
| Meaning of the pin-icon number | LIKELY local-pack position; the PDF has no legend |
| Yelp sheet empty cells (e.g. "Closed" checkbox) | The text export drops empty cells |
| GBP data (addresses, categories, hours) | No GBP export found in Drive |
| Practitioner roster and WorkSafe provider status by clinic | Not found in Drive |
| Photo content and consent | Images not opened, by design |

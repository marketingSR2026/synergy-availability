# 01 · Site inventory: synergyrehabilitation.ca (third-party crawl data)

Prepared 2026-11-02 for the WorkSafeBC physiotherapy local SEO project. Read-only research: nothing was created, changed or deleted in any external system. No patient data was opened or recorded.

## 0. Sources, freshness and confidence

**Confidence labels used throughout**
- **KNOWN**: returned directly by a tool or source cited next to it.
- **LIKELY**: strongly implied by tool data, but not confirmed directly.
- **UNKNOWN**: could not be obtained.
- **ASSUMPTION**: a working assumption, stated so it can be checked.

| Source (tool / endpoint) | What it gave | Freshness | Status |
|---|---|---|---|
| SE Ranking `PROJECT_listAudits` | 2 audits: 384379 (whole site, project 12903890) and 401878 (`/icbc-treatments/` only, project 12940679) | 384379 finished 2026-09-25; 401878 finished 2026-09-18 | KNOWN |
| SE Ranking `PROJECT_getAuditReport` 384379 / 401878 | Health score 69 / 79, issue counts, CrUX (origin-level) CWV histograms | as above | KNOWN |
| SE Ranking `PROJECT_getCrawledPages` 384379 (5 × 100) and 401878 | 500 crawled URLs: title, meta, H1, first H2, heading counts, words, status, canonical, indexability, inlinks/refpages, outlinks, load time | crawl 2026-09-25 | KNOWN. **The crawl hit SE Ranking's 500-page limit** (`total_pages: 500`), so the site has more URLs than were crawled. |
| SE Ranking `PROJECT_getIssuesByUrl` (4 key URLs), `PROJECT_getAuditPagesByIssue` (16 issue codes) | Per-page issues and the URLs affected by each issue | 2026-09-25 | KNOWN |
| SE Ranking `PROJECT_getFoundLinks` 384379 | **All 16,111 internal hyperlinks** (7 pages of 2,500) and **all 14,517 external hyperlinks** (6 pages), with source, target, anchor and nofollow | 2026-09-25 | KNOWN |
| SE Ranking `PROJECT_listKeywords`, `PROJECT_getKeywordStats` (2026-10-26 to 2026-11-02, with landing pages), `PROJECT_getSearchEngines` | 44 tracked keywords on 9 regional Google engines (Surrey, Delta, Langley, Vancouver, Burnaby, New Westminster, Richmond, Abbotsford, Cloverdale), daily positions and landing URLs | through 2026-11-02 | KNOWN |
| SE Ranking `PROJECT_getGoogleSearchConsole` (project 12903890) | Top 1,000 GSC queries: clicks, impressions, CTR, average position. **No page URLs and no date range are returned.** | UNKNOWN date range | KNOWN (values) |
| SE Ranking `DATA_getDomainKeywords` (source=ca), 7 requests | Organic keywords matching worksafe/wcb/work-injury terms, plus all ranking keywords for 3 URLs | current snapshot | KNOWN |
| WebSearch, 16 queries (3 plain `site:`, 13 with `allowed_domains: synergyrehabilitation.ca`) | Indexed URLs, titles and page-text summaries. Plain `site:` queries return Jane pages only (WebSearch is US-only), so domain-restricted queries were used instead. | 2026-11-02 | Results are KNOWN to exist; summaries of page content are LIKELY. |
| Ahrefs `site-audit-projects`, `site-explorer-organic-keywords`, `site-explorer-top-pages` | Nothing: each returned `HTTP 400 "Insufficient plan"` | n/a | Not Available |
| Semrush `organic_research`, `site_audit` | Nothing: each returned `no_api_units` ("not enough API units"; see https://www.semrush.com/mcp-access) | n/a | Not Available |
| Direct fetch (`curl https://synergyrehabilitation.ca/icbc-treatments/`, 1 attempt) | Nothing: `CONNECT tunnel failed, response 403` | n/a | Not Available |

**SE Ranking unit usage.** Account balance was 9,300 units at the start (`DATA_getSubscription`) and 8,690 at the end, a drop of **610**. The counter lags: it still read 9,300 after 4 `DATA_getDomainKeywords` requests. The only calls from this task expected to cost units were the 7 `DATA_getDomainKeywords` requests (6 succeeded, 1 returned HTTP 400); `PROJECT_*` calls are believed to be unit-free (ASSUMPTION). Other project agents may share this account, so how many of the 610 units this task used is **UNKNOWN**. If SE Ranking charges about 100 units per domain-keywords request, this task alone went over its 400-unit budget. No further DATA calls were made after the drop was noticed.

**Schema types.** **Not Available** for every URL. The SE Ranking audit does not report structured data, the Ahrefs site audit (page content) failed with "Insufficient plan", and direct fetch is blocked. This needs a structured-data crawl, such as Ahrefs Site Audit on a higher plan, Screaming Frog, or Google's Rich Results Test run by a person, before any schema decisions are made.

**Companion file:** `/home/user/synergy-availability/worksafe-seo/data/site-urls.csv` (528 rows: the 500 crawled URLs, 9 URLs found only through rank tracking or WebSearch, and the 19 Jane booking URLs). Columns are `url,type,title,h1,status,indexable,source`.

---

## 1. URL inventory, grouped

### 1.0 Counts by type (KNOWN: SE Ranking crawl 384379 plus discovered URLs)

| Type (CSV `type`) | Count | Notes |
|---|---|---|
| `icbc_hub` | 1 | `/icbc-treatments/` |
| `icbc_location` | 19 | `/icbc-treatments/<slug>/` |
| `icbc_location_alt_landing` | 7 | `/icbc-physiotherapy-in-<loc>/` (6) and `/icbc-physiotherapy-abbotsford/`. Only the Vancouver one was crawled; the others were found through SE Ranking rank-tracker landing pages. |
| `icbc_support` | 4 | `/icbc-claims/`, `/icbc-physiotherapy/`, `/car-accident/`, `/icbc-physiotherapy-landing-page/` |
| `icbc_blog` | 6 | ICBC and car-accident articles |
| `worksafe_service` | 1 | `/worksafe-physiotherapy/` |
| `worksafe_blog` | 1 | `/worksafebc-physiotherapy-what-is-covered/` |
| `location_clinic_primary` | 18 | The page the homepage location menu links to for each clinic (19 clinics; Clayton Corners and Clayton Heights share one page) |
| `location_service_legacy` | 66 | Older `<city>-physio/-massage/-chiropractor` style pages |
| `location_landing` | 3 | `/physiotherapy-in-vancouver/`, `/physiotherapy-in-richmond/` (rank tracker), `/physiotherapy-in-new-west/` (WebSearch) |
| `location_neighbourhood` | 8 | e.g. `/newton-surrey-bc/`, `/white-rock-british-columbia/` |
| `location_archive_taxonomy` | 35 | `/extp-location/<loc>/` team-by-location archives (TeamPress plugin, LIKELY) |
| `locations_index` | 1 | `/locations/` |
| `service` | 19 | Core treatment pages |
| `service_duplicate` | 10 | `-2` duplicates of service pages |
| `blog_index` | 14 | `/blog/`, `/category/...`, `/tag/abbotsford/` |
| `blog_post` | 151 | Articles |
| `geo_attraction` | 21 | `/geo-hub/` plus attraction pages (Stanley Park, Science World, and others) |
| `team` | 105 | `/our-team/`, `/member/<name>/`, 2 legacy member redirects |
| `booking` | 1 | `/booking-page/` |
| `booking_external_jane` | 19 | `synergyrehab.janeapp.com/locations/<slug>/book` |
| `utility` / `utility_thank_you` | 10 / 7 | About, contact, careers, privacy, sitemap, media pages, and 7 indexable `-thank-you` pages |

Status across the 500 crawled URLs (KNOWN): 391 × 200, 102 × 302 (all `/member/*` profiles), 3 × 301, 4 × 404.

### 1.1 ICBC hub and ICBC location pages (URL pattern)

**Pattern (KNOWN):** `https://synergyrehabilitation.ca/icbc-treatments/{slug}/`
- For cities outside Surrey, `{slug}` is the city: `abbotsford`, `burnaby`, `delta`, `langley`, `new-westminster`, `richmond`, `vancouver`, and also `south-surrey`.
- For Surrey neighbourhood clinics, `{slug}` is `{neighbourhood}-surrey`: `cedar-hills-surrey`, `central-city-surrey`, `clayton-corners-surrey`, `clayton-heights-surrey`, `cloverdale-surrey`, `fleetwood-surrey`, `king-george-surrey`, `newton-surrey`, `nordel-surrey`, `strawberry-hill-surrey`, `sullivan-heights-surrey`.
- Trailing slash, lowercase, hyphenated. All are crawl depth 3, in the XML sitemap, self-canonical and indexable.

| URL | Title | H1 | Words | Status | Indexable | Canonical | In-links / ref. pages | Out-links int / ext | Load ms |
|---|---|---|---|---|---|---|---|---|---|
| `/icbc-treatments/` (hub) | ICBC Treatment \| Physio, Chiro, RMT & More \| Synergy Rehab | Injured in a crash? Your treatment is already approved. | 4,856 | 200 | yes | self | 378 / 338 | 63 / 64 | 495 |
| `/icbc-treatments/abbotsford/` | ICBC Physiotherapy Abbotsford \| Synergy Rehab | ICBC Physiotherapy in Abbotsford | 2,537 | 200 | yes | self | 2 / 2 | 48 / 52 | 813 |
| `/icbc-treatments/burnaby/` | ICBC Physiotherapy Burnaby \| Synergy Rehab | ICBC Physiotherapy in Burnaby | 2,526 | 200 | yes | self | 7 / 5 | 46 / 52 | 1,202 |
| `/icbc-treatments/cedar-hills-surrey/` | ICBC Physiotherapy Cedar Hills, Surrey \| Synergy Rehab | ICBC Physiotherapy in Cedar Hills, Surrey | 2,571 | 200 | yes | self | 13 / 8 | 46 / 52 | 468 |
| `/icbc-treatments/central-city-surrey/` | ICBC Physiotherapy Surrey City Centre \| Synergy Rehab | ICBC Physiotherapy in Surrey City Centre | 2,591 | 200 | yes | self | 10 / 6 | 46 / 52 | 842 |
| `/icbc-treatments/clayton-corners-surrey/` | ICBC Physiotherapy East Clayton, Surrey \| Synergy Rehab | ICBC Physiotherapy in East Clayton, Surrey | 2,597 | 200 | yes | self | 10 / 6 | 46 / 52 | 845 |
| `/icbc-treatments/clayton-heights-surrey/` | ICBC Physiotherapy Clayton Heights, Surrey \| Synergy Rehab | ICBC Physiotherapy in Clayton Heights, Surrey | 2,577 | 200 | yes | self | 11 / 7 | 46 / 52 | 644 |
| `/icbc-treatments/cloverdale-surrey/` | ICBC Physiotherapy Cloverdale, Surrey \| Synergy Rehab | ICBC Physiotherapy in Cloverdale, Surrey | 2,546 | 200 | yes | self | 13 / 8 | 48 / 52 | 844 |
| `/icbc-treatments/delta/` | ICBC Physiotherapy Delta \| Synergy Rehab | ICBC Physiotherapy in North Delta | 2,554 | 200 | yes | self | 9 / 7 | 48 / 52 | 805 |
| `/icbc-treatments/fleetwood-surrey/` | ICBC Physiotherapy Fleetwood, Surrey \| Synergy Rehab | ICBC Physiotherapy in Fleetwood, Surrey | 2,537 | 200 | yes | self | 9 / 9 | 46 / 52 | 1,126 |
| `/icbc-treatments/king-george-surrey/` | ICBC Physiotherapy King George, Surrey \| Synergy Rehab | ICBC Physiotherapy in King George Blvd, Surrey | 2,604 | 200 | yes | self | 17 / 10 | 48 / 52 | 588 |
| `/icbc-treatments/langley/` | ICBC Physiotherapy Langley \| Synergy Rehab | ICBC Physiotherapy in Langley | 2,528 | 200 | yes | self | 8 / 5 | 46 / 52 | 787 |
| `/icbc-treatments/new-westminster/` | ICBC Physiotherapy New Westminster \| Synergy Rehab | ICBC Physiotherapy in New Westminster | 2,583 | 200 | yes | self | 6 / 4 | 46 / 52 | 1,134 |
| `/icbc-treatments/newton-surrey/` | ICBC Physiotherapy Newton, Surrey \| Synergy Rehab | ICBC Physiotherapy in Newton, Surrey | 2,674 | 200 | yes | self | 12 / 7 | 48 / 52 | 449 |
| `/icbc-treatments/nordel-surrey/` | ICBC Physiotherapy Nordel, Surrey \| Synergy Rehab | ICBC Physiotherapy in Nordel, Surrey | 2,550 | 200 | yes | self | 15 / 9 | 46 / 52 | 506 |
| `/icbc-treatments/richmond/` | ICBC Physiotherapy Richmond \| Synergy Rehab | ICBC Physiotherapy in Richmond | 2,525 | 200 | yes | self | 4 / 3 | 46 / 52 | 1,310 |
| `/icbc-treatments/south-surrey/` | ICBC Physiotherapy South Surrey \| Synergy Rehab | ICBC Physiotherapy in South Surrey | 2,548 | 200 | yes | self | 2 / 2 | 46 / 52 | 434 |
| `/icbc-treatments/strawberry-hill-surrey/` | ICBC Physiotherapy Strawberry Hill, Surrey \| Synergy Rehab | ICBC Physiotherapy in Strawberry Hill, Surrey | 2,559 | 200 | yes | self | 11 / 8 | 46 / 52 | 411 |
| `/icbc-treatments/sullivan-heights-surrey/` | ICBC Physiotherapy Sullivan Heights, Surrey \| Synergy Rehab | ICBC Physiotherapy in Sullivan Heights, Surrey | 2,596 | 200 | yes | self | 9 / 6 | 46 / 52 | 674 |
| `/icbc-treatments/vancouver/` | ICBC Physiotherapy Vancouver \| Synergy Rehab | ICBC Physiotherapy in Vancouver's West Side | 2,659 | 200 | yes | self | 4 / 3 | 46 / 52 | 680 |

Source: SE Ranking `PROJECT_getCrawledPages` 384379 (KNOWN). Meta descriptions follow one template: "ICBC treatment at Synergy Rehab {Clinic}, {street address}. Direct billing, $0 user fees on pre-approved care, no referral needed." (KNOWN; 125 to 150 characters.) Schema: Not Available (see §0).

**Second ICBC URL family, found outside the crawl.** These URLs were Google landing pages for tracked ICBC keywords between 2026-10-23 and 2026-11-02 (SE Ranking `PROJECT_getKeywordStats`, KNOWN). Apart from the Vancouver page, none were in the 500-URL crawl:

| URL | Evidence | Status / indexability |
|---|---|---|
| `/icbc-physiotherapy-in-vancouver/` | Crawled. Title "ICBC Physiotherapy in Vancouver - Synergy Rehab", H1 "ICBC Physiotherapy in Vancouver", 1,472 words, 1 in-link (from `/sitemap/` only), **1 internal out-link** (privacy policy) | 200, indexable (KNOWN) |
| `/icbc-physiotherapy-in-nordel/` | Rank tracker: "icbc approved physiotherapy" and "icbc physio" on 6 engines | Not crawled; LIKELY indexable (it ranks) |
| `/icbc-physiotherapy-in-cedar-hills/` | Rank tracker: "icbc treatment near me", "icbc physio" and "icbc physiotherapy" (Burnaby #4, Richmond #4) | Not crawled; LIKELY indexable |
| `/icbc-physiotherapy-in-clayton-heights/` | Rank tracker: "icbc physiotherapy" (Langley #6), "icbc physio" | Not crawled; LIKELY indexable |
| `/icbc-physiotherapy-in-clayton-corners/` | Rank tracker: "icbc treatment near me" (Abbotsford #11) | Not crawled; LIKELY indexable |
| `/icbc-physiotherapy-in-richmond/` | Rank tracker: "icbc physiotherapy richmond" (Richmond #22). WebSearch title "ICBC Physiotherapy in Richmond - Synergy Rehab". | Not crawled; KNOWN indexed |
| `/icbc-physiotherapy-abbotsford/` | Rank tracker: "icbc physiotherapy abbotsford" (Abbotsford #5) | Not crawled; LIKELY indexable |

LIKELY: these use the stand-alone, navigation-free landing-page template. The crawled Vancouver page has 1 internal out-link, and `/physiotherapy-in-vancouver/` and `/richmond-physiotherapy/` look the same. ASSUMPTION: they were built for paid campaigns and left indexable. Their internal links are UNKNOWN; the crawler never reached them, so they are LIKELY orphans or linked only from the sitemap.

**ICBC support pages and blog posts (KNOWN, crawl 384379):**

| URL | Title | H1 | Words | In-links | Notes |
|---|---|---|---|---|---|
| `/icbc-claims/` | ICBC Insurance Claim Rehabilitation in Metro Vancouver British Columbia Canada | ICBC & WorkSafe Claims | 753 | 343 (**337 of the 339 links found are `nofollow`**) | Covers WorkSafe and ICBC together; first H2 "How Much Does Worksafe Cover?" |
| `/icbc-physiotherapy/` | ICBC Physiotherapy Metro Vancouver British Columbia Canada | ICBC Physiotherapy | 1,491 | 361 (sitewide nav) | Older ICBC service page |
| `/car-accident/` | Car Accident Physiotherapy Metro Vancouver British Columbia Canada | Car Accident Treatment | 927 | 342 (sitewide nav) | First H2 "ICBC Treatements For Car Accidents" (typo on page) |
| `/icbc-physiotherapy-landing-page/` | ICBC Physiotherapy - Synergy Rehab | Recover After Your Car Accident With $0 User Fees | 1,736 | **0 (orphan)** | Indexable and in the sitemap |
| `/icbc-physiotherapy-in-bc-what-youre-entitled-to-after-a-car-accident/` | ICBC Physiotherapy in BC: What You're Entitled To After a Car Accident - Synergy Rehab | (same as title) | 2,445 | 10 | Blog post; links to `/worksafe-physiotherapy/` with anchor "WorkSafeBC claims" |
| `/icbc-canadian-road-accidents/`, `/motor-vehicle-accident-care/`, `/steps-you-should-take-after-youve-been-in-a-car-accident/`, `/recovery-after-a-car-accident-physiotherapy-solutions-in-surrey-bc/`, `/physiotherapy-for-whiplash-injuries-surrey-bc-recovery-strategies/` | see CSV | | 1,026 to 1,461 | 3 to 9 | Older ICBC and MVA blog posts |

### 1.2 WorkSafe pages

| URL | Title | Meta description | H1 | First H2 / heading counts | Words | Status / indexable / canonical | In-links (ref. pages) | Out-links int / ext | Ranking keywords |
|---|---|---|---|---|---|---|---|---|---|
| `/worksafe-physiotherapy/` | WorkSafe Physiotherapy Metro Vancouver British Columbia Canada (62 ch) | "Recover from a workplace injury with WorkSafe physiotherapy at Synergy Rehab, offering personalized rehabilitation, pain management, mobility care, and direct billing." (167 ch). A **second** meta description was auto-generated from body copy (`description_multiple`). | Worksafe Physiotherapy | "WorkSafe Injury Rehabilitation"; 17 H2, 7 H3; 10 images | 1,566 | 200 / yes / self (declared twice: `canonical_multiple`) | 352 (338). 334 are the sitewide nav link with anchor "Worksafe". | 36 / 28. Only non-nav internal out-link is `/contact` ("Contact Us"). | SE Ranking CA: 1 keyword, "wsbc physiotherapy burnaby" at #64, volume 0. Audit: `num_keywords` 1, traffic forecast 0. |
| `/worksafebc-physiotherapy-what-is-covered/` | WorkSafeBC Physiotherapy: What's Covered After a Work Injury in BC - Synergy Rehab (82 ch, `title_long`) | "If WorkSafeBC accepts your claim, your physiotherapy is covered and you pay nothing. You also do not have to wait for that acceptance letter. …" (265 ch, `description_long`) | WorkSafeBC Physiotherapy: What's Covered After a Work Injury in BC | "What WorkSafeBC covers once your claim is accepted"; 17 H2, 13 H3; 12 images | 1,844 | 200 / yes / self (declared twice) | 9 (6): `/blog/` ×3, `/category/physiotherapy/` ×2, `/sitemap/`, `/back-pain-physiotherapy/` ("what WorkSafeBC covers"), previous/next post links | 56 / 45. Links to 4 worksafebc.com pages (report a workplace injury, facts & figures, Early Access to Physiotherapy Program, health care benefits), to `/worksafe-physiotherapy/` ("WorkSafeBC physiotherapy") and to the ICBC entitlement post | SE Ranking CA: **0 keywords** (KNOWN). The `/blog/` listing shows "10Aug" (LIKELY published 10 August 2026). |

Sources: SE Ranking `PROJECT_getCrawledPages`, `PROJECT_getIssuesByUrl` (audit 384379), `PROJECT_getFoundLinks`, `DATA_getDomainKeywords` (url= exact) (KNOWN).

Other pages carrying WorkSafe content (see §5): `/icbc-claims/`; the homepage WorkSafe module (anchors "More About Worksafe", "No referral needed" and "WorkSafeBC→" to `/worksafe-physiotherapy/`); the 5 clinic pages `/physiotherapy-{abbotsford|amson|cloverdale|delta|king-george}-chiropractor/` ("More About Worksafe"; Abbotsford also "Worksafe Injury Physiotherapy"); `/occupational-therapy/`; `/workplace-ergonomics-physiotherapy-tips-for-injury-prevention-in-surrey-bc/`.

### 1.3 Location pages (three generations plus archives)

There are **19 clinics** (KNOWN). The homepage location menu has 19 entries, the ICBC hub links 19 location pages, and the sitewide footer links 19 Jane booking slugs. The site has no `/locations/<slug>/` hierarchy (KNOWN). Clinic-level content is spread across flat, inconsistent slugs.

**Location mapping table.** Addresses are as stated on the site's ICBC page meta descriptions and nearby-clinic anchors (KNOWN as site claims, not verified against Google Business Profiles).

| Clinic | ICBC page | Primary clinic page (homepage menu link) | Other location pages (legacy) | Jane booking slug (ICBC "Book at" CTA → footer `/book`) | Address on site |
|---|---|---|---|---|---|
| Abbotsford | `/icbc-treatments/abbotsford/` | `/physiotherapy-abbotsford-chiropractor/` | `/abbotsford-physio/` (orphan), `/abbotsford-chiropractor/` (orphan), `/abbotsford-massage/` | `abbotsford` | 3720 Townline Road (#100 per WebSearch) |
| Burnaby | `/icbc-treatments/burnaby/` | `/burnaby-physiotherapy-treatment-services/` | `/burnaby-physio/`, `-massage/`, `-chiropractor/`, `-acupuncture/`, `-chiropractic-care/`, `-chiropractic-treatment-services/` (canonical → 404), `/burnaby-best-kinesiology-services/` | `burnaby` | 4695 Canada Way, Unit #201 |
| Cedar Hills (Surrey) | `/icbc-treatments/cedar-hills-surrey/` | `/cedar-hills-surrey-physiotherapy-clinic/` | `/surrey-cedarhills-physio/`, `/cedar-hills-massage/`, `/cedar-hills-physiotherapy-treatment/`, `/cedar-hills-surrey-chiropractic-care/`, `/shockwave-therapy-cedar-hills-surrey-bc/` | `cedar-hills` | #120 12852 96 Avenue |
| Central City (Surrey) | `/icbc-treatments/central-city-surrey/` | `/city-central-surrey-physio/` | `/city-central-surrey-massage/`, `/city-central-surrey-chiropractor/` | `central-city` | #120 13655 Fraser Highway |
| Clayton Corners (Surrey) | `/icbc-treatments/clayton-corners-surrey/` | `/clayton-physiotherapy-treatment-clinic/` (shared) | `/clayton-corners-physio/`, `/clayton-corners-massage/` | `clayton-corners-188-st` | 110 - 18811 72 Avenue |
| Clayton Heights (Surrey) | `/icbc-treatments/clayton-heights-surrey/` | `/clayton-physiotherapy-treatment-clinic/` (shared) | `/clayton-physio/`, `/clayton-massage/`, `/clayton-shockwave-therapy/`, `/clayton-surrey-bc-phyiotherapy-clinic/`, `/clayton-surrey-chiropractic-care-services/` | `clayton-heights` | 19161 Fraser Highway, #105B |
| Cloverdale (Surrey) | `/icbc-treatments/cloverdale-surrey/` | `/physiotherapy-cloverdale-chiropractor/` | `/cloverdale-physio/`, `/cloverdale-massage/`, `/cloverdale-chiropractor/` | `cloverdale-hwy-10` | Unit 102, 5645 177B Street |
| Delta (North Delta) | `/icbc-treatments/delta/` | `/physiotherapy-delta-chiropractor/` | `/delta-physio/`, `/delta-massage/`, `/delta-chiropractor/` | `delta` | 10757 Delsom Crescent, Unit 103 |
| Fleetwood (Surrey) | `/icbc-treatments/fleetwood-surrey/` | `/fleetwood-physiotherapy-treatment-clinic/` | `/surrey-fleetwood-physio/`, `/fleetwood-massage/` | `fleetwood` | 8585 160 Street, Unit 103 |
| King George (Surrey) | `/icbc-treatments/king-george-surrey/` | `/physiotherapy-king-george-chiropractor/` | `/surrey-kinggeorge-physio/`, `/surrey-king-george-chiro/`, `/king-george-massage/`, `/king-george-physiotherapy-clinic/`, `/king-george-surrey-chiropractic-care-services/` | `king-george` | #101 8056 King George Blvd |
| Langley | `/icbc-treatments/langley/` | `/langley-physio/` | `/langley-massage/`, `/langley-chiropractor/` | `langley` | 8045 204 Street, Unit A130 |
| New Westminster | `/icbc-treatments/new-westminster/` | `/physiotherapy-new-westminster/` | `/massage-new-westminster/`, `/physiotherapy-in-new-west/` (WebSearch only) | `new-westminster` | 405 - 301 East Columbia Street. A WebSearch summary says `/locations/` shows #202 (LIKELY inconsistency). |
| Newton 72nd (Surrey; "Amson") | `/icbc-treatments/newton-surrey/` | `/physiotherapy-amson-chiropractor/` | `/amson-physio/`, `/amson-massage/`, `/amson-chiro/`, `/newton-surrey-bc/`, `/south-newton-surrey-bc/`, `/west-newton-north-surrey-bc/` | `newton-72nd` | 14468 72 Avenue, Unit 101 |
| Nordel (Surrey/North Delta) | `/icbc-treatments/nordel-surrey/` | `/surrey-nordel-physio/` | `/surrey-nordel-massage/`, `/surrey-nordel-chiro/` | `nordel-88-ave` | 12565 88 Avenue, Unit 116 |
| Richmond | `/icbc-treatments/richmond/` | `/richmond-physiotherapy/` (landing template, 1 internal out-link) | `/richmond-physiotherapy-2/`, `/richmond-massage/`, `/richmond-chiropractor/`, `/physiotherapy-in-richmond/` (rank tracker only) | `richmond` | 8060 - 11688 Steveston Highway |
| South Surrey | `/icbc-treatments/south-surrey/` | `/south-surrey-chiropractic-care/` (a chiropractic page) | `/south-surrey-physio/`, `/south-surrey-physiotherapy-2/`, `/south-surrey-massage/`, `/south-surrey-massage-therapy-services/`, `/south-surrey-chiropractor/` | `south-surrey` | 2388 156 Street (Unit 106 per WebSearch) |
| Strawberry Hill (Surrey) | `/icbc-treatments/strawberry-hill-surrey/` | `/strawberry-hill-physio/` | `/strawberry-hill-massage/` | `strawberry-hill-72nd` | 12422 72 Avenue, Unit 206 |
| Sullivan Heights (Surrey) | `/icbc-treatments/sullivan-heights-surrey/` | `/surrey-sullivan-physio/` | `/sullivan-back-pain-physio/` | `sullivan-heights-hwy-10` | 106 - 15325 56 Avenue (Hwy 10) |
| Vancouver (West Side) | `/icbc-treatments/vancouver/` | `/vancouver-physio/` | `/vancouver-massage/`, `/vancouver-chiropractor/`, `/physiotherapy-in-vancouver/` (landing) | `vancouver` | 3609 W 16th Ave |

Sources: homepage out-links and ICBC "Book at {Clinic}" CTAs from SE Ranking `PROJECT_getFoundLinks` (internal and external) (KNOWN); addresses from SE Ranking crawl meta descriptions and anchors (KNOWN).

**Location page generations (KNOWN unless marked):**
1. **Newer "clinic pages", 5 of them** (`/physiotherapy-{abbotsford|amson|cloverdale|delta|king-george}-chiropractor/`): 2,910 to 3,444 words. These are the only clinic pages the ICBC location pages link to ("clinic page" and "Synergy Rehab {Clinic} clinic page" anchors). They carry WorkSafe sections. Three of them (Amson/Newton, Cloverdale, King George) **share the homepage title "Physiotherapy Clinic in Burnaby, BC - Synergy Rehab"**, and four share the homepage meta description "Rehabilitation Services in Burnaby, BC …". Delta's H1 is "Best Chiropractor Near You In Delta, BC" on a page titled "Physiotherapy in Delta". In-links: Abbotsford 38; the others 7 to 10.
2. **Legacy city/service pages** (66 `location_service_legacy` plus 13 of the 18 primary clinic pages): 800 to 1,700 words with templated H1s ("Our Therapists Have Your Back", "Did you know?", "Trusted Physio In", "Highly Skilled &"), 85 `h1_duplicate`, mostly 1 to 2 in-links. Copy says "We Accept ICBC, WCB, MSP" (KNOWN for `/richmond-physiotherapy(-2)/` from the SE Ranking description field; LIKELY on the others).
3. **Stand-alone landing template**: `/physiotherapy-in-vancouver/`, `/richmond-physiotherapy/`, the ICBC alt family, and `/icbc-physiotherapy-landing-page/`. Each has 0 to 1 internal out-links, no site navigation, and is indexable.
4. **Neighbourhood pages** (8): `/newton-surrey-bc/`, `/south-newton-surrey-bc/`, `/west-newton-north-surrey-bc/`, `/east-panorama-ridge-surrey-bc/`, `/elgin-surrey-bc-v4p-1l6/`, `/crescent-surrey-bc-v4a-2e8/`, `/alluvia-surrey-bc-v3w-0m9/`, `/white-rock-british-columbia/`. Each is 1,129 to 1,201 words with 4 in-links.
5. **`/extp-location/<loc>/` archives** (35 URLs, including `/page/2/` and 3 that return 404): 372 to 444 words; 26 have no meta description; 10 have 0 in-links; 3 canonicalise to 404s. Slugs: abbotsford, amson-square, burnaby, cedar-hills, central-city, clayton-corners-surrey, clayton-heights, cloverdale, delta-synergy-rehab, fleetwood-synergy-rehab, king-george-synergy-rehab, langley, mobile-kinesiology, new-westminster-synergy-rehab, nordel-synergy-rehab, online, richmond-synergy-rehab, south-surrey, strawberry-hill, sullivan-synergy-rehab, vancouver.
6. **`/locations/`** (index): title "Rehabilitation Clinic Centre Locations in Metro Vancouver British Columbia Canada", H1 "Locations", 1,201 words, 363 in-links. Lists all clinics with NAP, hours and "BOOK NOW". **Internal links go only to the 5 newer clinic pages** (image links), plus `/contact` (nofollow). Meta description flagged missing (`description_missing`).

### 1.4 Service / treatment pages (KNOWN)

Core pages, all linked from the sitewide menu (334 to 365 in-links each): `/services/`, `/physiotherapy-services/`, `/active-rehabilitation/`, `/acupuncture/`, `/chiropractic/`, `/clinical-counselling/`, `/cold-laser-therapy/`, `/custom-orthotics/`, `/intramuscular-stimulation/`, `/kinesiology/`, `/massage-therapy/`, `/pelvic-floor-physiotherapy/`, `/pre-post-natal-physiotherapy/`, `/shockwave-therapy/`, `/sports-rehab/`, `/vestibular-therapy/`. Also on the menu: `/icbc-physiotherapy/`, `/car-accident/`, `/worksafe-physiotherapy/`, `/icbc-treatments/`. Linked from 200 pages: `/back-pain-physiotherapy/` (1,946 words) and `/pelvic-floor-physiotherapy-vancouver/` (2,151 words). Most core service pages are thin: 491 to 589 words, except chiropractic 919, massage 936, sports rehab 1,060, physiotherapy 1,069 and services 1,284. `/occupational-therapy/` has 493 words and only 2 in-links.

Duplicates (`-2`): `/services-2/`, `/clinical-counselling-2/`, `/cold-laser-therapy-2/`, `/custom-orthotics-2/`, `/intramuscular-stimulation-ims-2/`, `/kinesiology-2/`, `/massage-therapy-2/`, `/shockwave-therapy-2/`, `/sports-rehab-2-2/`, `/vestibular-therapy-2/`. These are 532 to 724 words and indexable; most have no H1 (`h1_missing`).

### 1.5 Blog and guides

- `/blog/` (index, 3,088 words, 345 in-links) and categories `/category/{acupunture|advice|chiropractor|physiotherapy|uncategorized}/` (`uncategorized` has 11 pages). "Advice (Demo)" is a leftover theme demo category (KNOWN title "Advice (Demo) Archives"). `/tag/abbotsford/` ranks (rank tracker) but was not crawled.
- 151 blog posts (full list in the CSV, `type=blog_post`). WorkSafe- or work-adjacent posts: `/worksafebc-physiotherapy-what-is-covered/` and `/workplace-ergonomics-physiotherapy-tips-for-injury-prevention-in-surrey-bc/` (1,487 words, 4 in-links).
- **"Surrey Care Guide"**: **no page with that title exists in the crawl or in WebSearch results** (KNOWN for the 500 crawled URLs; UNKNOWN beyond them). WebSearch reports the exact phrase only in the body text of `/physiotherapy-amson-chiropractor/` (Newton clinic page), where it LIKELY appears as a section or anchor label with FAQ-style "straight answers to what Surrey patients search for most". The nearest guide pages are `/the-comprehensive-guide-to-physiotherapy-in-surrey-british-columbia/` (1,537 words, 11 in-links; WebSearch summary says it has unfilled "[Author Name]"-style placeholders, LIKELY) and `/geo-hub/` ("Explore Surrey, BC", 1,065 words, 2 in-links), which leads to 20 attraction pages (`geo_attraction`).
- `/vancouver-activities-rehab-guide/` (1,330 words, 8 in-links).

### 1.6 Booking

- `/booking-page/`: title "Booking Page - Synergy Rehab", H1 "Book Now", 407 words, 200, indexable, self-canonical, 748 in-links (sitewide), 34 internal / 28 external out-links. Contains a location chooser for 19 clinics (KNOWN from SE Ranking description text).
- Jane booking URLs in the sitewide footer (KNOWN, `PROJECT_getFoundLinks` external): `https://synergyrehab.janeapp.com/locations/{slug}/book` with slug in {`abbotsford`, `burnaby`, `cedar-hills`, `central-city`, `clayton-corners-188-st`, `clayton-heights`, `cloverdale-hwy-10`, `delta`, `fleetwood`, `king-george`, `langley`, `new-westminster`, `newton-72nd`, `nordel-88-ave`, `richmond`, `south-surrey`, `strawberry-hill-72nd`, `sullivan-heights-hwy-10`, `vancouver`}. Many footer links carry `_gl` / `_ga` query strings and are `nofollow` on some templates. The ICBC location pages also link to `https://synergyrehab.janeapp.com/locations/{slug}` (no `/book`) with the anchor "Book at {Clinic}". Stray or legacy Jane slugs also appear: `nordel`, `sullivan-heights`, `cloverdale`, `amson-72nd`, `amson-72`, `active-rehab`, `clinical-counselling`.

### 1.7 Other

- Team: `/our-team/` (38,285 words; 165 external out-links) and 102 `/member/<name>/` profiles, **all returning 302** (`redirect_temporary` 102). There are also two legacy URLs, `/sonali-kochhar/` and `/payalpreet-kaur`, which return 301 to `/member/...`. Practitioner pages are public staff profiles, not patient data.
- Utility pages: `/about/`, `/contact/`, `/careers/`, `/privacy-policy/` (no H1), `/sitemap/` (HTML sitemap, 366 internal out-links), `/media-room/`, `/media-and-news/`, `/26490-2/`, `/dr-khan-member/`, `/thank-you/`, and 7 `/{loc}-thank-you/` pages. **All of these are indexable** (KNOWN). The thank-you pages share the H1 "South Surrey Facility".

---

## 2. Key URL detail table

All values come from SE Ranking `PROJECT_getCrawledPages` audit 384379 (crawl 2026-09-25) and are KNOWN unless marked. Schema: Not Available for all (see §0). "In-links" = internal links pointing in / distinct referring pages. "Out" = internal / external out-links.

| URL | Title | Meta description (as reported) | H1 | Words | Status | Indexable | Canonical | Schema | In-links | Out (int/ext) |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` | Physiotherapy Clinic in Burnaby, BC - Synergy Rehab | Rehabilitation Services in Burnaby, BC - At Synergy Rehabilitation, we restore your function with physiotherapy… (154 ch) | physiotherapy clinic in the lower mainland | 1,594 | 200 | yes | self | Not Available | 743 / 341 | 104 / 43 |
| `/icbc-treatments/` | ICBC Treatment \| Physio, Chiro, RMT & More \| Synergy Rehab | ICBC treatment, no referral, $0 fees: physio, chiro, massage, kinesiology, acupuncture, counselling. Direct-billed at 19+ Lower Mainland clinics. (145 ch) | Injured in a crash? Your treatment is already approved. | 4,856 | 200 | yes | self (×2 tags) | Not Available | 378 / 338 | 63 / 64 |
| `/worksafe-physiotherapy/` | WorkSafe Physiotherapy Metro Vancouver British Columbia Canada | Recover from a workplace injury with WorkSafe physiotherapy at Synergy Rehab… (167 ch, plus a 2nd auto description) | Worksafe Physiotherapy | 1,566 | 200 | yes | self (×2) | Not Available | 352 / 338 | 36 / 28 |
| `/worksafebc-physiotherapy-what-is-covered/` | WorkSafeBC Physiotherapy: What's Covered After a Work Injury in BC - Synergy Rehab | If WorkSafeBC accepts your claim, your physiotherapy is covered and you pay nothing… (265 ch) | WorkSafeBC Physiotherapy: What's Covered After a Work Injury in BC | 1,844 | 200 | yes | self (×2) | Not Available | 9 / 6 | 56 / 45 |
| `/icbc-claims/` | ICBC Insurance Claim Rehabilitation in Metro Vancouver British Columbia Canada | Auto text (LIKELY): "ICBC & WorkSafe Claims How Much Does Worksafe Cover? IMPORTANT WORKSAFE INFORMATION TO KNOW Approved claims are eligible for treatment within 60 days…" (303 ch) | ICBC & WorkSafe Claims | 753 | 200 | yes | self | Not Available | 343 / 341 (nofollow sitewide) | 34 / 26 |
| `/icbc-physiotherapy/` | ICBC Physiotherapy Metro Vancouver British Columbia Canada | Recover after a motor vehicle accident with ICBC physiotherapy… (166 ch) | ICBC Physiotherapy | 1,491 | 200 | yes | self | Not Available | 361 / 338 | 39 / 28 |
| `/car-accident/` | Car Accident Physiotherapy Metro Vancouver British Columbia Canada | Recover after a car accident with personalized rehabilitation… (174 ch) | Car Accident Treatment | 927 | 200 | yes | self | Not Available | 342 / 338 | 34 / 27 |
| `/icbc-physiotherapy-landing-page/` | ICBC Physiotherapy - Synergy Rehab | Auto text (LIKELY): "ICBC-Covered Treatment After a Car Accident…" (331 ch) | Recover After Your Car Accident With $0 User Fees | 1,736 | 200 | yes | self | Not Available | **0 / 0** | 35 / 41 |
| `/icbc-physiotherapy-in-vancouver/` | ICBC Physiotherapy in Vancouver - Synergy Rehab | Get ICBC physiotherapy in Vancouver… (163 ch; **identical** to `/physiotherapy-in-vancouver/`) | ICBC Physiotherapy in Vancouver | 1,472 | 200 | yes | self | Not Available | 1 / 1 | 1 / 1 |
| `/physiotherapy-in-vancouver/` | Physiotherapy in Vancouver - Synergy Rehab | (same as above) | Physiotherapy in Vancouver | 1,306 | 200 | yes | self | Not Available | 1 / 1 | 1 / 1 |
| `/icbc-physiotherapy-in-bc-what-youre-entitled-to-after-a-car-accident/` | ICBC Physiotherapy in BC: What You're Entitled To After a Car Accident - Synergy Rehab | ICBC covers up to 25 physio sessions after a car accident in BC — no doctor's referral needed… (150 ch) | (same as title) | 2,445 | 200 | yes | self | Not Available | 10 / 7 | 53 / 42 |
| `/locations/` | Rehabilitation Clinic Centre Locations in Metro Vancouver British Columbia Canada | flagged `description_missing`; SE Ranking shows body text | Locations | 1,201 | 200 | yes | self | Not Available | 363 / 341 | 40 / 52 |
| `/booking-page/` | Booking Page - Synergy Rehab | Auto text (LIKELY): "Book Now Please Choose a location…" | Book Now | 407 | 200 | yes | self | Not Available | 748 / 341 | 34 / 28 |
| `/services/` | Rehabilitation Services Surrey \| Physiotherapy & Chiropractic Treatment | At Synergy Rehab Surrey Nordel Physiotherapy, we provide comprehensive rehabilitation services… (157 ch) | Services | 1,284 | 200 | yes | self | Not Available | 358 / 338 | 48 / 26 |
| `/physiotherapy-services/` | Surrey Physiotherapy Services \| Sports Physiotherapist Vancouver, Richmond, New Westminster | Physiotherapy by our New West Physio… 604-581-7795… (151 ch) | Physiotherapy | 1,069 | 200 | yes | self | Not Available | 361 / 338 | 41 / 41 |
| `/occupational-therapy/` | Occupational Therapy - Synergy Rehab | Unlock your potential with personalized occupational therapy… (145 ch) | Occupational Therapy | 493 | 200 | yes | self | Not Available | 2 / 2 | 36 / 41 |
| `/workplace-ergonomics-physiotherapy-tips-for-injury-prevention-in-surrey-bc/` | Workplace Ergonomics: Physiotherapy Tips for Injury Prevention in Surrey, BC - Synergy Rehab | Auto author-bio text (359 ch) | (same as title) | 1,487 | 200 | yes | self | Not Available | 4 / 3 | 46 / 41 |
| `/physiotherapy-abbotsford-chiropractor/` | Chiropractor Abbotsford BC \| Physiotherapy Abbotsford BC | Trusted chiropractor and physiotherapy clinic in Abbotsford… (150 ch) | Physiotherapy & Chiropractor in Abbotsford | 2,910 | 200 | yes | self | Not Available | 38 / 37 | 75 / 61 |
| `/physiotherapy-amson-chiropractor/` (Newton) | Physiotherapy Clinic in Burnaby, BC - Synergy Rehab (**duplicate of homepage**) | Homepage description (duplicate) | Physiotherapy & Massage Therapy in Newton, Surrey | 3,098 | 200 | yes | self | Not Available | 10 / 8 | 57 / 76 |
| `/physiotherapy-cloverdale-chiropractor/` | Physiotherapy Clinic in Burnaby, BC - Synergy Rehab (**duplicate**) | Homepage description (duplicate) | Physiotherapy & Massage Therapy in Cloverdale Hwy 10 | 3,444 | 200 | yes | self | Not Available | 10 / 9 | 63 / 56 |
| `/physiotherapy-delta-chiropractor/` | Physiotherapy in Delta, BC - Synergy Rehab Delta Physiotherapy | Homepage description (duplicate) | Best Chiropractor Near You In Delta, BC | 3,226 | 200 | yes | self | Not Available | 7 / 6 | 62 / 60 |
| `/physiotherapy-king-george-chiropractor/` | Physiotherapy Clinic in Burnaby, BC - Synergy Rehab (**duplicate**) | Homepage description (duplicate) | Physiotherapy & Massage Therapy in Surrey King George | 3,103 | 200 | yes | self | Not Available | 9 / 8 | 58 / 76 |
| `/blog/` | BLOG - Synergy Rehab | Auto text (LIKELY) | Blogs | 3,088 | 200 | yes | self | Not Available | 345 / 338 | 329 / 26 |
| `/contact/` | Contact Us to Book Appointments and Services Easily | Synergy Rehab offers expert care in physiotherapy, chiropractic, and massage therapy… (149 ch) | Contact us | 433 | 200 | yes | self | Not Available | 379 / 341 | 36 / 26 |

The 19 ICBC location pages are in §1.1. All other URLs are in the CSV.

---

## 3. Technical issues relevant to WorkSafe, ICBC and location pages

Source: SE Ranking `PROJECT_getAuditReport` 384379 (health 69/100; 820 errors, 693 warnings, 4,266 notices), `PROJECT_getAuditPagesByIssue` and `PROJECT_getIssuesByUrl` (KNOWN unless marked). Audit 401878 (ICBC hub only, 2026-09-18) scored 79 with 3 errors (`canonical_multiple`, `extjs345xx`, and `no_inlinks`, the last because it was a single-page crawl).

| # | Issue (code) | Pages | Affects WorkSafe / ICBC / location pages? | Detail |
|---|---|---|---|---|
| 1 | Multiple rel=canonical (`canonical_multiple`) | 388 | **Yes**: ICBC hub, all ICBC location pages, both WorkSafe pages | Same URL declared twice (LIKELY two SEO/theme plugins both output canonical). A template-level issue that new WorkSafe pages will inherit. |
| 2 | Multiple meta descriptions (`description_multiple`) | 82 | **Yes**: ICBC hub, ICBC location pages, `/worksafe-physiotherapy/` | A second description is auto-generated from body copy (e.g. "Home/ICBC Treatments/King George Synergy Rehab King George · ICBC Enhanced Care…"). The template will repeat it on new pages. |
| 3 | Duplicate titles (`title_duplicate`) | 16 | **Yes**: location pages | `/`, `/physiotherapy-amson-chiropractor/`, `/physiotherapy-cloverdale-chiropractor/` and `/physiotherapy-king-george-chiropractor/` share "Physiotherapy Clinic in Burnaby, BC - Synergy Rehab". Also `/our-team/` = `/media-and-news/`, `/custom-orthotics(-2)/`, `/surrey-chiropractic-care(-2)/`, both fibromyalgia posts, `/back-pain-physiotherapy/`, and more. |
| 4 | Duplicate descriptions (`description_duplicate`) | 24 | **Yes** | Clinic pages reuse the homepage description; `/physiotherapy-in-vancouver/` = `/icbc-physiotherapy-in-vancouver/`; `/richmond-physiotherapy/` = `-2`; 7 thank-you pages. |
| 5 | Duplicate H1 (`h1_duplicate`) | 85 | **Yes**: legacy location pages and `/extp-location/` | H1s like "Our Therapists Have Your Back" and "Did you know?" repeat across cities. |
| 6 | Multiple H1 (`h1_multiple`) | 106 | **Yes**: 5 clinic pages, legacy location pages, `/icbc-physiotherapy-in-vancouver/` | |
| 7 | H1 missing (`h1_missing`) | 9 | No | `/privacy-policy/` and 8 `-2` duplicates |
| 8 | Missing meta description (`description_missing`) | 40 | **Yes**: `/locations/` and 26 `/extp-location/` URLs | Also `/sitemap/`, `/media-room/` and 12 category pages |
| 9 | Title too long (`title_long`) | 113 | **Yes**: `/worksafebc-physiotherapy-what-is-covered/` (82 ch) | |
| 10 | Description too long (`description_long`) | 195 | **Yes**: `/worksafe-physiotherapy/` (167), WorkSafeBC blog (265) | |
| 11 | No inbound links (`no_inlinks`) | 13 | **Yes** | `/abbotsford-physio/`, `/abbotsford-chiropractor/`, `/icbc-physiotherapy-landing-page/`, and 10 `/extp-location/` archives. Plus the ICBC alt landing pages the crawler never found (LIKELY orphans). |
| 12 | One inbound link (`less_inlink`) | 91 | **Yes** | Includes `/physiotherapy-in-vancouver/`, `/icbc-physiotherapy-in-vancouver/`, and most legacy city pages. ICBC location pages have 2 to 17. |
| 13 | 4xx pages (`http4xx`) and canonical to 4xx (`canonical4xx`) | 4 and 4 | **Yes** | 404s: `/extp-location/{burnaby,cedar-hills,clayton-heights}-synergy-rehab/` and `/burnaby-chiropractic-burnaby-bc/`. `/burnaby-chiropractic-treatment-services/`, `/extp-location/burnaby/`, `/extp-location/cedar-hills/` and `/extp-location/clayton-heights/` canonicalise to those 404s; the same 4 are flagged `sitemap_non_canonical`. |
| 14 | Redirects (`redirect3xx` 105, `redirect_temporary` 102), links to 3xx (`links3xx` 28) | | Partly | All 102 `/member/*` profiles return 302. Clinic pages and `/extp-location/` archives link to redirecting URLs. |
| 15 | Internal nofollow (`links_nofollow`) | 331 | **Yes** | Sitewide `nofollow` on `/icbc-claims/` (337 of 339 links), `/about/` (336) and `/sitemap/` (322). The page holding the site's WorkSafe session information therefore receives no followed links. |
| 16 | Images without alt (`image_no_alt`) | 292 | **Yes**: ICBC location pages, WorkSafeBC blog | Unsplash hero images, the Facebook pixel `<img>`, and in-content images |
| 17 | Broken external JS (`extjs345xx`) | 391 | Yes (sitewide) | `script.crazyegg.com/pages/scripts/0022/1041.js` returns 403 |
| 18 | External links to 4xx (`extlinks4xx`) / 3xx (`extlinks3xx`) | 31 / 335 | Sitewide | Sitewide 3xx is `http://synergyoptometry.com/` (301) |
| 19 | JS weight / count (`js_big`, `js_many`, `js_not_min`, `js_not_cached`) | 391 / 384 / 391 / 391 | **Yes** | About 3.8 to 3.9 MB of JS and 41 to 44 JS files on the ICBC and WorkSafe pages; about 0.87 to 0.97 MB of CSS and 46 to 51 CSS files |
| 20 | Core Web Vitals (CrUX, origin-level, from audit `chromeux`) | site | **Yes** | **Mobile:** LCP 88% good / 9% NI / 3% poor; CLS 97/2/1; **INP 70/11/19** (result code 2). **Desktop:** LCP 87/9/4; CLS 91/7/2; **INP 73/7/20** (result code 2). LIKELY reading: LCP passes at p75, CLS passes, **INP fails** (about 19 to 20% poor). Lab issues (`lighthouse_lcp`, `loading_speed`, `lighthouse_tti`) were tested and flagged on the homepage only. Per-URL CWV for ICBC and WorkSafe pages: Not Available. |
| 21 | Thin / templated pages | n/a | **Yes** | 35 `/extp-location/` archives at 372 to 444 words with no description; 10 `-2` duplicates at 532 to 724 words; 8 indexable thank-you pages at 714 words (shared H1 "South Surrey Facility"); core service pages at 491 to 589 words. The SE Ranking `duplicate_content` check reported 0. |
| 22 | Schema / structured data | n/a | **Yes** | **Not Available** (§0). Needs a crawl that reports JSON-LD before LocalBusiness/MedicalClinic/FAQ decisions. |
| 23 | Crawl coverage | n/a | **Yes** | The SE Ranking audit stopped at 500 pages, so the alt ICBC landing pages and `/physiotherapy-in-new-west/` are missing. SE Ranking `domain_props.index_google` = 456 (LIKELY a Google index estimate). |

---

## 4. ICBC ecosystem as reconstructed

### 4.1 Hierarchy (KNOWN from SE Ranking found-links unless marked)

```
Sitewide header nav (≈334 pages): "ICBC Treatments" → /icbc-treatments/   (also /icbc-physiotherapy/, /car-accident/, /worksafe-physiotherapy/ "Worksafe")
Sitewide (≈337 pages, nofollow): /icbc-claims/
│
├── /icbc-treatments/  (hub, depth 2, 4,856 words)
│     ├── 19 × /icbc-treatments/{slug}/  (anchor = clinic name, e.g. "King George")
│     ├── 19 × Jane /locations/{slug}/book, icbc.com links, maps
│     └── /worksafe-physiotherapy/ (contextual anchor "WorkSafeBC")
│
├── /icbc-treatments/{slug}/  (depth 3, ~2,525–2,674 words, 7 images)
│     ├── "Nearby clinics": 3–4 nearest sibling ICBC pages, numbered 01–04 with distance + address
│     │     e.g. "01 Newton About 2.4 km · 14468 72 Avenue, Unit 101, Surrey — ICBC treatment at this clinic"
│     │     + a second short anchor ("Newton") for most of the same siblings
│     ├── "Book at {Clinic}" → synergyrehab.janeapp.com/locations/{slug}  (+ "Book online", "Online at Jane", "booking page")
│     ├── clinic page link ("Synergy Rehab {Clinic} clinic page", "clinic page"): ONLY for Abbotsford, Cloverdale,
│     │     Delta, King George, Newton → /physiotherapy-{abbotsford|cloverdale|delta|king-george|amson}-chiropractor/
│     ├── icbc.com (≈80 links across the 20 ICBC pages) and maps.google.com (≈38) external links
│     └── global header/footer (incl. "Worksafe" nav link and 19 Jane footer links)
│
├── Parallel / competing ICBC URLs (not linked from hub):
│     /icbc-physiotherapy/ (nav), /car-accident/ (nav), /icbc-claims/ (nofollow nav),
│     /icbc-physiotherapy-landing-page/ (orphan), /icbc-physiotherapy-in-{vancouver|nordel|cedar-hills|clayton-heights|
│     clayton-corners|richmond}/ and /icbc-physiotherapy-abbotsford/ (landing template; sitemap-only or orphan, LIKELY)
│
└── ICBC blog: /icbc-physiotherapy-in-bc-what-youre-entitled-to-after-a-car-accident/ (+5 older MVA posts)
```

**Inbound links to the 19 ICBC location pages** (KNOWN): 1 from the hub, 1 from `/sitemap/`, 2 to 8 from sibling "nearby" blocks, and **only one from outside the ICBC family** (`/physiotherapy-delta-chiropractor/` → `/icbc-treatments/delta/`, anchor "ICBC treatment at our Delta clinic"). The homepage, `/locations/`, and the legacy and primary clinic pages do not link to their ICBC pages. Weakest: Abbotsford and South Surrey (2 in-links each), Richmond and Vancouver (4 each).

### 4.2 Page sections

Sources: SE Ranking heading counts, first H2, description snippets and anchors (KNOWN), and WebSearch page summaries (LIKELY).

**Hub `/icbc-treatments/`:** 20 H2, 17 H3, 29 H4, 13 images.
- Eyebrow "ICBC Enhanced Care · Lower Mainland, BC".
- H1 "Injured in a crash? Your treatment is already approved."
- First H2 changed between audits: on 2026-09-18 it was "What ICBC treatment does your claim cover?"; on 2026-09-25 it was "ICBC physiotherapy, massage therapy, kinesiology and acupuncture: what your claim covers" (KNOWN).
- Intro: "within your first 12 weeks ICBC pre-approves Physiotherapy, Chiropractic, Massage Therapy, Kinesiology, Acupuncture and Clinical Counselling — no doctor's referral…" (KNOWN).
- Coverage table, LIKELY from WebSearch: Physiotherapy and Chiropractic 25 sessions each; Massage, Kinesiology, Acupuncture and Counselling 12 each; weeks 1 to 12; $0 user fees.
- Then a 19-clinic directory and Jane booking links.

**Location page** (King George as the example: 17 H2, 8 H3, 9 H4):
- Breadcrumb "Home / ICBC Treatments / King George" (KNOWN). ASSUMPTION: no BreadcrumbList schema check was possible.
- Eyebrow "Synergy Rehab King George · ICBC Enhanced Care".
- H1 "ICBC Physiotherapy in {local name}"; the local names are differentiated (e.g. "Vancouver's West Side", "North Delta", "East Clayton", "Surrey City Centre").
- First H2 "ICBC treatment at Synergy Rehab {Clinic}".
- Intro repeats the 12-week pre-approval copy.
- Address- and area-specific copy (e.g. "Synergy Rehab King George, on King George…").
- Per WebSearch (LIKELY): "what to bring" (claim number plus ID), FAQ, "your ICBC claim is not tied to one location", a session table with an "illustrative example" disclaimer, and hours.
- Nearby-clinics block, Google Maps link, "Book at {Clinic}" CTA.
- Distinctness: each page has a unique `content_hash` (KNOWN) and the same structure (KNOWN). How much body copy is unique is UNKNOWN; there was no content access.

### 4.3 Patterns worth copying or avoiding for WorkSafe (interpretation)

- **Keep:** one hub that links every location page; consistent `/hub/{slug}/` URLs; local H1 variants; nearby-clinic cross-links with distances; a clinic-specific Jane CTA; links out to the official authority (icbc.com → worksafebc.com).
- **Avoid:** (a) a second set of indexable landing pages for the same intent (the `/icbc-physiotherapy-in-*` family); (b) location pages that only their siblings link to (clinic pages, `/locations/` and the homepage should link in); (c) the inherited template defects (double canonical, double meta description); (d) nofollowed internal links to key claim pages.

---

## 5. Cannibalization risks: URLs already ranking for worksafe / wcb queries

### 5.1 What ranks today for WorkSafe-type queries (KNOWN)

| Query | URL ranking | Position | Volume (CA) | Source |
|---|---|---|---|---|
| wsbc physiotherapy burnaby | `/worksafe-physiotherapy/` | 64 | 0 | SE Ranking `DATA_getDomainKeywords` (ca) |
| wsbc physiotherapy new westminster | `/physiotherapy-new-westminster/` (legacy city page) | 47 | 0 | same |
| work injury physiotherapy panorama hills | `/` (homepage) | 43 | 0 | same |
| workplace injury physio near me | `/` | 86 | 0 | same |
| occupational rehabilitation new west | `/` | local pack #1; organic 21 | 0 | same |
| occupational rehabilitation burnaby | `/` (12), `/occupational-therapy/` (52) | 12 / 52 | 0 | same |
| occupational rehabilitation new westminster | `/` | 28 | 0 | same |
| occupational therapy surrey | `/occupational-therapy/` | 20 | 0 | same |
| best occupational therapy services in abbotsford | `/physiotherapy-abbotsford-chiropractor/` | 36 | 0 | same |
| wcb physiotherapy cloverdale | page not given by GSC | avg 6.0; 1 click, 7 impressions | n/a | SE Ranking `PROJECT_getGoogleSearchConsole` (date range not stated) |
| "wcb" "safer workplaces together" | page not given | avg 9; 0 clicks, 1 impression | n/a | same |

- **No keyword containing "worksafe" or "wcb" ranks** in SE Ranking's Canada database for the domain. Queries filtered on worksafe, wcb, "work safe", "workers comp", "work injury", workplace, wsbc, compensation, "injured at", "on the job", occupational and "return to work" returned only the rows above (KNOWN).
- `/worksafebc-physiotherapy-what-is-covered/` ranks for **0** keywords (KNOWN).
- WorkSafe queries in the SE Ranking-connected GSC export come to 2 of 1,000 rows and 8 of 78,145 total impressions (KNOWN). For comparison, "icbc physiotherapy" alone has 935 impressions at average position 13.2.
- **No WorkSafe keywords are tracked** in SE Ranking project 12903890. All 44 tracked keywords are brand, ICBC or generic terms (KNOWN, `PROJECT_listKeywords`).
- Conclusion: there is little existing WorkSafe ranking equity to protect. The risk is **future** competition between pages, not present cannibalization (LIKELY).

### 5.2 Pages that already target WorkSafe intent and would compete with a new pillar or location pages (KNOWN unless marked)

| URL | Overlap | Risk |
|---|---|---|
| `/worksafe-physiotherapy/` | Existing WorkSafe service page, sitewide nav ("Worksafe"), 352 in-links | **High**. It is the natural pillar URL. If the pillar is built at a new URL, this page must be redirected, merged or clearly differentiated. |
| `/worksafebc-physiotherapy-what-is-covered/` | Informational coverage guide. Title and H1 target "WorkSafeBC physiotherapy". | **High** for the head term "worksafebc physiotherapy". Keep it as an informational support article linking up to the pillar. |
| `/icbc-claims/` | H1 "ICBC & WorkSafe Claims"; WorkSafe session rules ("within 60 days… 15 sessions are scheduled over 6 weeks…") | Medium. It mixes intents and its numbers conflict with other pages (see below). It is linked sitewide with nofollow. |
| `/physiotherapy-{abbotsford,amson,cloverdale,delta,king-george}-chiropractor/` | "More About Worksafe" sections. WebSearch indicates return-to-work and claim-number copy on the Abbotsford and Newton pages (LIKELY). | Medium. These are the most likely competitors for "{city} worksafe physio" until location-level WorkSafe pages exist. |
| Legacy city pages (e.g. `/richmond-physiotherapy(-2)/`, `/physiotherapy-new-westminster/`, `/surrey-cedarhills-physio/`) | "We Accept ICBC, WCB, MSP" / WCB direct-billing copy (KNOWN for Richmond; LIKELY elsewhere). `/physiotherapy-new-westminster/` already ranks for "wsbc physiotherapy new westminster". | Medium-low |
| `/` homepage | WorkSafe module (3 links to `/worksafe-physiotherapy/`); ranks for work-injury and occupational-rehab long-tail queries | Low-medium |
| `/occupational-therapy/`, `/workplace-ergonomics-physiotherapy-tips-for-injury-prevention-in-surrey-bc/` | Occupational rehab and workplace topics | Low |

**Conflicting WorkSafe claims already on the site.** These need a claims register before new copy is written:
- `/icbc-claims/`: "within 60 days… 15 sessions are scheduled over 6 weeks" (KNOWN).
- Another Synergy WorkSafe page: "10 sessions over 5 weeks, within 60 days" (WebSearch summary, LIKELY `/worksafe-physiotherapy/`).
- A King George page: "initial authorization for up to 15 physiotherapy sessions" (WebSearch, LIKELY).
- The WorkSafeBC blog: "no single fixed number for every claim", and treatment can start before the acceptance letter (WebSearch, LIKELY; the latter is KNOWN from the meta description).

### 5.3 Evidence from the ICBC ecosystem: active cannibalization (KNOWN)

Source: SE Ranking `PROJECT_getKeywordStats` with landing pages, 2026-10-23 to 2026-11-02. Google kept switching which Synergy URL it ranks for the same query:

| Keyword (engine) | Current position | Distinct landing URLs seen in ~10 days |
|---|---|---|
| icbc physiotherapy (Surrey) | 7 | `/icbc-treatments/south-surrey/`, `/icbc-treatments/clayton-heights-surrey/`, `/icbc-physiotherapy-in-clayton-heights/`, `/icbc-physiotherapy-in-cedar-hills/`, `/icbc-physiotherapy-in-vancouver/`, `/icbc-treatments/cloverdale-surrey/` (6) |
| icbc massage therapy surrey (Surrey) | 5 | south-surrey, strawberry-hill-surrey, central-city-surrey, sullivan-heights-surrey, cloverdale-surrey (5 ICBC location pages) |
| icbc covered physio (Surrey) | 28 | `/icbc-treatments/south-surrey/`, `/icbc-physiotherapy-in-vancouver/`, `/icbc-physiotherapy-in-clayton-heights/`, `/icbc-treatments/abbotsford/` |
| icbc treatment (Surrey) | 20 | `/icbc-treatments/` ↔ `/icbc-claims/` |
| icbc physiotherapy richmond (Richmond) | 22 | `/icbc-physiotherapy-in-richmond/`, `/physiotherapy-in-richmond/`. **Not** `/icbc-treatments/richmond/`. |
| icbc physiotherapy burnaby (Burnaby) | 28 | `/icbc-physiotherapy-in-vancouver/`, `/icbc-treatments/`, `/icbc-treatments/burnaby/` |
| icbc physiotherapy cloverdale (Cloverdale) | 2 | `/cloverdale-physio/` (legacy page, not the ICBC page) |
| icbc physiotherapy new westminster (New Westminster) | 7 | `/icbc-treatments/king-george-surrey/` (wrong clinic) |
| icbc physiotherapy delta (Delta) | 8 | `/icbc-treatments/clayton-corners-surrey/`, `/icbc-treatments/king-george-surrey/` (wrong clinics) |
| physiotherapy delta (generic; Surrey) | 11 | `/physiotherapy-delta-chiropractor/` → `/icbc-treatments/delta/` (2026-10-28). **An ICBC page is taking a generic physio query.** |
| physio after car accident / car accident physiotherapy | 2 to 92 | `/recovery-after-a-car-accident-physiotherapy-solutions-in-surrey-bc/` ↔ `/motor-vehicle-accident-care/` (the ICBC hub is not chosen) |

Implications for WorkSafe (LIKELY):
1. Use one URL per intent per clinic, and do not add a second indexable landing-page family.
2. Location pages need unique local signals and links in from the matching clinic page, `/locations/` and the hub.
3. Keep WorkSafe location pages from absorbing generic "physiotherapy {city}" queries; title and H1 should lead with WorkSafeBC.
4. Add WorkSafe keywords to SE Ranking rank tracking before launch to get a baseline. This is a write action, so a person needs to approve it.

---

## 6. Data gaps (Not Available, and why)

| Item | Why it is missing | How to fill it |
|---|---|---|
| Schema / JSON-LD types per URL | SE Ranking audit does not report them; Ahrefs Site Audit returned "Insufficient plan"; direct fetch is blocked (403) | Ahrefs Site Audit on an eligible plan, a Screaming Frog crawl, or a manual Rich Results Test |
| Full URL list beyond 500 | SE Ranking audit page cap | Raise the audit page limit and recrawl (a write action: needs approval and may cost units), or export the WordPress sitemap |
| Status, title and H1 for `/icbc-physiotherapy-in-{nordel,cedar-hills,clayton-heights,clayton-corners,richmond}/`, `/icbc-physiotherapy-abbotsford/`, `/physiotherapy-in-richmond/`, `/physiotherapy-in-new-west/`, `/tag/abbotsford/` | Not in the crawl; fetch blocked | Recrawl or check by hand in a browser |
| Organic traffic per URL (Ahrefs top pages, Semrush) | Ahrefs "Insufficient plan"; Semrush `no_api_units` | Upgrade the plan or units, or use the GSC page report |
| GSC page-level data and date range | The SE Ranking GSC endpoint returns queries only | GSC directly (not connected), or Supermetrics |
| Per-URL Core Web Vitals | Only origin-level CrUX and a homepage lab test are available | PageSpeed Insights per URL |
| Exact body copy, FAQ text, H2 list beyond the first H2 | No content access | Ahrefs page-content endpoint (plan), or the WordPress export |
| Exact SE Ranking units used by this task | The counter lags and the account may be shared | Check the SE Ranking API usage log |

## 7. Source log (tool calls, in order)

1. SE Ranking `PROJECT_listAudits` (search "synergy"), `DATA_getSubscription`
2. `PROJECT_getAuditReport` 384379; `PROJECT_getCrawledPages` 384379 at offsets 0, 100, 200, 300 and 400 (limit 100); `PROJECT_getCrawledPages` 401878
3. `PROJECT_getIssuesByUrl` 384379 for `/worksafe-physiotherapy/`, `/icbc-treatments/`, `/icbc-treatments/king-george-surrey/` and `/worksafebc-physiotherapy-what-is-covered/`
4. `PROJECT_getAuditPagesByIssue` 384379 for codes `title_duplicate`, `no_inlinks`, `canonical4xx`, `sitemap_non_canonical`, `h1_missing`, `description_duplicate`, `h1_duplicate`, `links3xx`, `description_missing`, `extlinks4xx`, `lighthouse_lcp`, `h1_multiple` and `less_inlink`
5. Ahrefs `site-audit-projects`, `site-explorer-organic-keywords` and `site-explorer-top-pages` (all failed: "Insufficient plan"); Ahrefs `doc` (schema lookup only)
6. Semrush `organic_research` and `site_audit` (both failed: `no_api_units`)
7. SE Ranking `PROJECT_listKeywords` 12903890, `PROJECT_getGoogleSearchConsole` 12903890, `PROJECT_getKeywordStats` (engine 389248, and all engines), `PROJECT_getSearchEngines`
8. SE Ranking `DATA_getDomainKeywords` (source ca) ×7: keyword filters (2), `filter_url` (400 error), url = `/worksafe-physiotherapy/`, url = `/icbc-claims/`, a broader keyword filter, url = `/worksafebc-physiotherapy-what-is-covered/`
9. SE Ranking `PROJECT_getFoundLinks` 384379: internal hyperlinks (offsets 0 to 15,000, limit 2,500) and external hyperlinks (offsets 0 to 12,500)
10. `PROJECT_getAuditReport` 401878
11. WebSearch (16 queries: 3 plain `site:` queries and 13 with `allowed_domains=["synergyrehabilitation.ca"]`)
12. `curl` (1 attempt; blocked with 403)

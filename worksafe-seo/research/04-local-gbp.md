# 04 - Location source of truth: GBP, Jane and repo (WorkSafeBC program)

Prepared 2026-11-02 by the local/GBP specialist. Read-only work: nothing was created or changed in SE Ranking, Google, Jane, GitHub or WordPress.
Machine-readable outputs: `worksafe-seo/data/locations-master.csv` (19 rows, one per clinic, 50 columns) and `worksafe-seo/data/gbp-maps-keyword-positions.csv` (52 rows, every Maps keyword tracked in SE Ranking Local).

Status legend: **KNOWN** = read directly from a tool/file in this session. **LIKELY** = from a WebSearch summary (titles/URLs plus a model summary; the page was not fetched) or a consistent indirect signal. **UNKNOWN** = conflicting or missing evidence. **ASSUMPTION** = my inference, flagged as such.
No patient data was opened. Reviewer names and review text were not read or recorded (only aggregate counts and ratings). Jane practitioner names exist in the source files but only counts are reported here.

## 1. Headline findings

1. **All 19 clinics publicly offer WorkSafeBC physiotherapy appointment types in Jane (KNOWN).** The live collector output (`data` branch, `availability.json`, checked 2026-11-02 02:27-06:10 UTC, slots 2026-11-02 to 11-08) lists "WCB Physio Initial Session" and "WCB Physio Subsequent Session" as bookable types at every one of the 19 locations, with 46 to 228 open WCB initial slots per clinic over 7 days. Nine clinics (Burnaby, Cedar Hills, Central City, King George, New Westminster, Nordel, Richmond, Sullivan Heights, Vancouver) also show "WCB Massage Subsequent Session - 30 minutes"; Nordel also shows WCB Acupuncture types.
2. **The Delta flag is a service-level exclusion, not a clinic-level one.** The "not covered by extended health, ICBC or WorkSafe BC" text on the Delta Jane page refers to the *Non-Registered Massage (Bodyworker)* service (LIKELY, 3 WebSearch summaries; the same wording appears on the Sullivan Heights page). Delta has 8 physiotherapists with WCB Physio openings and 77 WCB initial slots in the week (KNOWN). **Delta stays eligible.** The same bodyworker exclusion applies wherever the service exists: Abbotsford, Delta, Fleetwood, Newton (KNOWN, Jane run log). Do not present bodyworker or personal-training sessions as WorkSafe services.
3. **Only 3 of 19 Google Business Profiles are connected in SE Ranking Local** (Abbotsford 44167, Newton 42289, New Westminster 42283; KNOWN, `LOCAL_listLocations` total = 3). GBP name, categories, hours, lat/lng, rating, review count and GBP website target are **Not Available** for the other 16 from any tool in this session. Addresses and phones for those 16 come from the repo plugin file and WebSearch summaries of synergyrehabilitation.ca (LIKELY), several of which conflict.
4. **WorkSafe Maps visibility is tracked at 2 clinics only.** New Westminster ranks for "Worksafe physiotherapy" at all 25 grid points (avg 3.36, top-3 at 17/25, #2 at the clinic). Newton is weaker: "Worksafe physiotherapy" avg 8.64 (top-3 at 1/25, #3 at the clinic), "Work Injury" ranks at only 9/25 points, and "WCB INJURY" and "Worksafe injury" are not in the top 20 anywhere on the grid (KNOWN, check 2026-10-30). Abbotsford tracks no WorkSafe keyword.
5. **No GBP search term with WorkSafe/WCB/work-injury wording appears for any of the 3 connected profiles** (May-Oct 2026, every page of `LOCAL_getGbpKeywords` read). People find these profiles via brand, "physiotherapy <city>", "massage"/"RMT" and "near me" terms. WorkSafe demand therefore has to be captured mainly by website pages and the pillar, not by GBP alone (ASSUMPTION, based on the absence of terms).
6. **GBP landing-page problems on 2 of 3 connected profiles (KNOWN):** New Westminster's GBP website is the **homepage**, not `/physiotherapy-new-westminster/`. Newton's GBP points to `/physiotherapy-amson-chiropractor/` (legacy "Amson" slug; its `<title>` read "Physiotherapy Clinic in Burnaby, BC" in the 2026-09-25 crawl) and its **GBP website clicks fell from 212-357/month (Nov 2025-Jul 2026) to 100 (Aug), 14 (Sep) and 89 (Oct)** while calls held at 645-758/month; SE Ranking's audit (2026-10-23) flags a website mismatch on Google Maps. Cause UNKNOWN; worth checking the GBP website field and redirect before any WorkSafe page goes live.
7. **Citations are thin for Newton and New Westminster:** 7 of 49 directories listed, 0 synced (Google family, Yelp, Waze, WhereTo only; not on Apple Maps, Bing, Facebook). Abbotsford: 23 of 48 listed, 21 synced. NAP mismatches flagged by SE Ranking audits are listed per clinic in section 8.
8. **Jane location IDs are KNOWN for all 19** (collector run log, GitHub Actions run 41366684080, 2026-11-02 00:21 UTC), e.g. Nordel 1, Fleetwood 2, Richmond 3, Cedar Hills 4, New Westminster 5, Sullivan Heights 6, Burnaby 7, King George 9, Clayton Heights 11, Delta 12, Cloverdale 13, Newton 15, Central City 16, South Surrey 17, Abbotsford 18, Langley 20, Strawberry Hill 21, Clayton Corners 22, Vancouver 24.

## 2. Sources and what each one covers


| Source | Tool / endpoint / URL | Covers | Status |
|---|---|---|---|
| SE Ranking Local locations | mcp__SERanking__LOCAL_listLocations, LOCAL_getLocation (44167, 42289, 42283) | GBP NAP, website, categories, hours, service area, attributes, Maps CID URL, connection state | KNOWN (3 of 19 clinics) |
| SE Ranking Local overview | LOCAL_getLocationOverview (44167 & 42289: 2025-11-01..2026-10-31; 42283: 2026-08-01..2026-10-31) | lat/lng, reviews overview, citations overview, latest audit (NAP checks), GBP searches | KNOWN |
| GBP performance | LOCAL_getGbpMetrics (42283, 2025-11-01..2026-10-31) + gbp_metrics block of the overviews | Daily impressions, calls, website clicks, directions | KNOWN (last non-zero day 2026-10-30) |
| GBP search terms | LOCAL_getGbpKeywords (2026-05-01..2026-10-31), all pages until next_page_token = null | Search terms + impressions | KNOWN |
| Maps rank tracking | LOCAL_listRankingKeywords + LOCAL_getRankingPositions (2026-10-26..2026-11-02), joined on key_to_geopoint_id | Keyword x grid-point positions, check date 2026-10-30 | KNOWN |
| Citations | LOCAL_listBusinessListings (42283, 42289), LOCAL_getBusinessListingsOverview via overview | Directory listed/synced status | KNOWN |
| Jane live openings | git show origin/data:availability.json (repo marketingSR2026/synergy-availability, commit f605b48, 2026-11-02T06:18Z) | 14,624 open slots, disciplines, appointment types incl. `also` list (WCB/ICBC types) | KNOWN |
| Jane location IDs + bookable disciplines | gh run view 41366684080 --log (collector log lines "slug (id N): ...") | Jane numeric location id, every bookable discipline per location | KNOWN |
| Repo collector | /home/user/synergy-availability/collect.js | How Jane data is collected (no hard-coded location list; discovers slugs from the Jane home page) | KNOWN |
| Repo snapshot (stale) | /home/user/synergy-availability/data/availability.json (main branch, checked 2026-10-02) | Older v3 rows without `also`; superseded by the data branch | KNOWN (stale) |
| WordPress plugin locations | scratchpad/zip/synergy-next-availability/data/locations.json | 21 Jane locations with address + city; lat/lng null for all | KNOWN |
| Site inventory (earlier specialist) | worksafe-seo/data/site-urls.csv (SE Ranking crawl 2026-09-25) | General location page URLs, titles/H1s, ICBC page URLs | KNOWN (crawl date 2026-09-25) |
| Site NAP for 16 non-connected clinics | WebSearch allowed_domains synergyrehabilitation.ca (locations page and location pages) | Street, postal code, phone | LIKELY (summaries; several conflicts) |
| Delta WorkSafe snippet | WebSearch (3 queries) incl. allowed_domains synergyrehab.janeapp.com | Bodyworker not covered; physio WorkSafe accepted | LIKELY |
| SERP test | DATA_getSerpResults advanced, "Synergy Rehab Fleetwood", Surrey (location 3518), task 264715654 | Returned 100 organic results only: no Maps/local pack/knowledge panel, so it cannot replace GBP data | KNOWN (10 units) |


Blocked or unavailable: direct fetch of synergyrehabilitation.ca, worksafebc.com and Google Maps (environment policy, not retried). WorkSafeBC's own provider directory could not be checked, so clinic-level WorkSafeBC provider/contract status stays **UNKNOWN** even though WCB booking types are KNOWN.

## 3. Master table (summary view of locations-master.csv)

Practitioner counts are the number of distinct practitioners with at least one open slot between 2026-11-02 and 2026-11-08 (KNOWN). Fully booked or absent practitioners are not counted, so these are lower bounds, not staff totals.


| Clinic | Jane slug (id) | Address (GBP if connected, else repo) | Postal | Phone | GBP in SE Ranking | Physio / WCB physio / Kin / RMT / Chiro | WCB initial slots 7d | Rating (reviews) |
|---|---|---|---|---|---|---|---|---|
| Vancouver | vancouver (24) | 3609 W 16th Ave | V6R 3C3 (site, LIKELY) | (604) 416-2600 [conflicts: (604) 200-2319 on other pages; (604) 373-8092 on Delta page] (site, LIKELY) | Not connected | 2 / 2 / 0 / 6 / 1 | 66 | Not Available |
| Burnaby | burnaby (7) | 4695 Canada Way, #201 | V5G 1K8 (site, LIKELY) | (604) 558-8873 (site, LIKELY) | Not connected | 2 / 2 / 1 / 10 / 1 | 73 | Not Available |
| New Westminster | new-westminster (5) | 405 - 301 East Columbia Street | V3L 3W5 | (604) 553-3303 | 42283 | 4 / 4 / 1 / 6 / 2 | 70 | 4.88 (546) |
| Richmond | richmond (3) | 11688 Steveston Highway, #8060 | V7A 1N6 [conflict: V7A 5J3 on another site page] (site, LIKELY) | (604) 284-5113 (site, LIKELY) | Not connected | 4 / 4 / 1 / 6 / 1 | 89 | Not Available |
| Delta | delta (12) | 10757 Delsom Crescent, #103 | V4C 0A5 [Medimap: V4C 0A8] (site, LIKELY) | (604) 516-8505 (site, LIKELY) | Not connected | 8 / 8 / 2 / 8 / 3 | 77 | Not Available |
| Nordel | nordel-88-ave (1) | 12565 88 Avenue, #116 | V3W 3J7 (site, LIKELY) | (604) 503-1688 [same as corporate main line] (site, LIKELY) | Not connected | 8 / 8 / 2 / 9 / 3 | 103 | Not Available |
| Cedar Hills | cedar-hills (4) | #120 12852 96 Avenue | V3V 6A8 (site, LIKELY) | (604) 498-0877 (site, LIKELY) | Not connected | 6 / 6 / 1 / 7 / 3 | 175 | Not Available |
| Strawberry Hill | strawberry-hill-72nd (21) | 12422 72 Ave, 206 | V3W 2M5 (site, LIKELY) | (604) 547-0670 (site, LIKELY) | Not connected | 7 / 7 / 1 / 9 / 2 | 128 | Not Available |
| Newton 72 Ave | newton-72nd (15) | 14468 72 Avenue #101 | V3S 2E7 | (604) 547-3761 | 42289 | 10 / 10 / 4 / 6 / 3 | 190 | 4.83 (634) |
| Sullivan Heights | sullivan-heights-hwy-10 (6) | 15325 56 Avenue, #106 | V3S 0X9 (site, LIKELY) | (604) 566-8773 (site, LIKELY) | Not connected | 8 / 8 / 2 / 7 / 0 | 172 | Not Available |
| King George | king-george (9) | 8056 King George Boulevard, #101 | V3W 5B5 (site, LIKELY) | (604) 503-9033 (site, LIKELY) | Not connected | 8 / 8 / 3 / 7 / 2 | 136 | Not Available |
| Central City | central-city (16) | 13655 Fraser Highway, #120 | V3T 2V6 [conflict: V3T 0P8 on massage page] (site, LIKELY) | (604) 954-1475 [conflict: (604) 245-1127 on chiropractor page] (site, LIKELY) | Not connected | 5 / 5 / 2 / 12 / 4 | 143 | Not Available |
| Fleetwood | fleetwood (2) | 8585 160 Street, #103 | V4N 1G4 (site, LIKELY) | (604) 503-4799 (site, LIKELY) | Not connected | 6 / 6 / 0 / 4 / 2 | 228 | Not Available |
| Cloverdale | cloverdale-hwy-10 (13) | 5645 177B Street, #102 | V3S 4H9 (site, LIKELY) | (604) 579-1367 [conflict: (604) 227-6785 on /cloverdale-physio/] (site, LIKELY) | Not connected | 9 / 9 / 2 / 10 / 3 | 204 | Not Available |
| Clayton Corners | clayton-corners-188-st (22) | 18811 72 Ave, 110 | V4N 6W7 (Jane listing via WebSearch) (site, LIKELY) | (604) 416-0580 (site, LIKELY) | Not connected | 2 / 2 / 0 / 3 / 1 | 46 | Not Available |
| Clayton Heights | clayton-heights (11) | 19161 Fraser Highway, #105B | V3S 8E7 (site, LIKELY) | (604) 547-2860 (site, LIKELY) | Not connected | 7 / 7 / 2 / 2 / 2 | 97 | Not Available |
| South Surrey | south-surrey (17) | 2388 156 St, 106 | V4A 4V4 (site, LIKELY) | (604) 385-5855 (site, LIKELY) | Not connected | 5 / 5 / 1 / 6 / 2 | 143 | Not Available |
| Langley | langley (20) | 8045 204 St, A130 | V2Y 5K1 (site, LIKELY) | (604) 371-1988 (site, LIKELY) | Not connected | 5 / 5 / 1 / 6 / 1 | 76 | Not Available |
| Abbotsford | abbotsford (18) | 3720 Townline Rd #100 | V2T 5W8 | (604) 776-5700 | 44167 | 4 / 4 / 2 / 2 / 1 | 96 | 4.9 (325) |


Jane booking URL for every clinic: `https://synergyrehab.janeapp.com/locations/<jane slug>/book` (KNOWN, repo + collector). Two further Jane locations exist but are not clinics for this program: `active-rehab` (id 8, Kinesiology/Active Rehab only, mobile) and `clinical-counselling` (no bookable services on 2026-11-02; plugin address 7327 137 Street, Surrey). Both should be excluded from WorkSafe location pages.

## 4. GBP detail: the 3 connected profiles (KNOWN, SE Ranking Local)


| Field | New Westminster | Newton 72 Ave | Abbotsford |
|---|---|---|---|
| SE Ranking location id | 42283 | 42289 | 44167 |
| GBP name | Synergy Rehab New Westminster | Synergy Rehab Newton | Synergy Rehab Abbotsford |
| Address | 405 - 301 East Columbia Street, New Westminster V3L 3W5 | 14468 72 Avenue #101, Surrey V3S 2E7 | 3720 Townline Rd #100, Abbotsford V2T 5W8 |
| Phone | (604) 553-3303 | (604) 547-3761 | (604) 776-5700 |
| Lat, lng | 49.22582, -122.89324 | 49.13351, -122.82191 | 49.0695354, -122.3588299 |
| Hours | Mon-Fri 08:00-20:30; Sat 09:00-16:00; Sun 08:00-16:00 | Mon 07:30-20:30; Tue 07:00-20:30; Wed-Thu 07:30-20:30; Fri 07:00-20:30; Sat 08:00-16:00; Sun 09:00-16:00 | Mon-Fri 08:00-20:30; Sat 09:00-17:00; Sun 09:00-14:00 |
| Primary category | Physiotherapist | Physiotherapist | Physiotherapist |
| Secondary categories | Chiropractor; Kinesiologist; Wellness center; Health counselor; Massage therapist; Acupuncture clinic; Occupational therapist | Chiropractor; Acupuncturist; Massage therapist; Sports massage therapist; Physical rehabilitation center | Chiropractor; Acupuncturist; Massage therapist; Acupuncture clinic; Physiotherapy Center; Occupational therapist; Sports massage therapist; Physical rehabilitation center |
| GBP website (landing page) | https://synergyrehabilitation.ca/ | https://synergyrehabilitation.ca/physiotherapy-amson-chiropractor/ | https://synergyrehabilitation.ca/physiotherapy-abbotsford-chiropractor/ |
| Description mentions WCB | yes | no (ICBC only) | yes |
| Maps URL | https://maps.google.com/maps?cid=13663810117809319107 | https://maps.google.com/maps?cid=298216086905119071 | https://maps.google.com/maps?cid=14441931768404812645 |
| Reviews (all sources), avg rating | 546, 4.88 | 634, 4.83 | 325, 4.9 |
| By source | gmb: 544 @ 4.88; yelp: 2 @ 5 | gmb: 634 @ 4.83 | gmb: 325 @ 4.9 |
| Unanswered reviews | 10 | 5 | 2 |
| Citations | 7 of 49 directories listed, 0 synced | 7 of 49 directories listed, 0 synced | 23 of 48 directories listed, 21 synced |


Notes (KNOWN unless marked):
- Service area: Abbotsford lists 16 places (Abbotsford neighbourhoods, Mission, Aldergrove); Newton lists 15 places including Delta, Sunshine Hills, Langley, New Westminster, Guildford, Fleetwood, Cloverdale, South Surrey and Panorama Ridge, which overlap other Synergy clinics; New Westminster has no service area (audit notice). Overlap may blur which clinic Google shows for a given area (ASSUMPTION).
- Attributes: Abbotsford and Newton carry free parking, restroom, social URLs; Newton adds wheelchair-accessible restroom/seating and on-site services. New Westminster returns no attributes.
- Review averages are SE Ranking `reviews_overview.average_rating` (rated reviews only). `rating_distribution` is known to under-count and was not used for totals.
- GBP searches (`LOCAL_getGbpSearches`, last_updated 2026-10-01) report only "direct" searches; "discovery" and "branded" are 0 in every month for all 3, and October equals September exactly at all 3 (Abbotsford 1,431; Newton 3,748; New Westminster 2,300), so October is LIKELY a carry-forward, not a measurement.
- Historic GBP names: search-term strings such as "synergy rehab surrey newton 72 ave physiotherapy | massage therapy | chiropractor | acupuncture | kinesiology" show the profiles previously carried keyword-stuffed names (LIKELY). Current names are clean. Do not add "WorkSafe" to GBP names.

### GBP performance (KNOWN, `getGbpMetrics`, sums of daily values)


| Clinic | Period | Impressions (all) | of which Maps | Calls | Website clicks | Direction requests |
|---|---|---|---|---|---|---|
| Abbotsford | 12 months 2025-11-01..2026-10-31 | 37445 | 11899 | 3448 | 2693 | 3451 |
| Abbotsford | 2026-08-01..2026-10-29 | 11457 | 4128 | 868 | 724 | 952 |
| Newton 72 Ave | 12 months 2025-11-01..2026-10-31 | 85679 | 25484 | 8003 | 2691 | 4956 |
| Newton 72 Ave | 2026-08-01..2026-10-29 | 24247 | 8446 | 2043 | 203 | 1345 |
| New Westminster | 12 months 2025-11-01..2026-10-31 | 49161 | 14399 | 2558 | 3772 | 4203 |
| New Westminster | 2026-08-01..2026-10-29 | 15154 | 3974 | 616 | 973 | 1074 |


Monthly website clicks, Newton (KNOWN): Nov 263, Dec 298, Jan 258, Feb 249, Mar 212, Apr 251, May 338, Jun 262, Jul 357, **Aug 100, Sep 14, Oct 89**. Abbotsford (197-260) and New Westminster (236-354) stayed flat over the same months. 2026-10-31 is all zeros at all 3 clinics (Google reporting lag).

## 5. Maps rank tracking (KNOWN, SE Ranking Local, check date 2026-10-30)

Setup: Abbotsford 8 keywords x 49 grid points (7x7, about 3 km square); Newton 26 keywords x 25 points (5x5, about 4 km); New Westminster 18 keywords x 25 points (5x5, about 4 km). The grid centre equals the GBP lat/lng at all three. Position 0 in the API means "not in the top 20": SE Ranking's own summary averages (4.02 / 14.26 / 10.56) are reproduced exactly when 0 is counted as 20, which I verified arithmetically. "Avg when ranked" below excludes those points.

### WorkSafe / WCB keywords


| Clinic | Keyword | Points ranked (top 20) | Avg pos when ranked | Top-3 points | Top-10 points | Position at clinic |
|---|---|---|---|---|---|---|
| Newton 72 Ave | WCB INJURY | 0/25 | n/a | 0 | 0 | not in top 20 |
| Newton 72 Ave | Work Injury | 9/25 | 11.33 | 1 | 5 | 1 |
| Newton 72 Ave | Worksafe injury | 0/25 | n/a | 0 | 0 | not in top 20 |
| Newton 72 Ave | Worksafe physiotherapy | 25/25 | 8.64 | 1 | 18 | 3 |
| New Westminster | Worksafe physiotherapy | 25/25 | 3.36 | 17 | 25 | 2 |
| Abbotsford | (none tracked) | - | - | - | - | - |


### Comparison keywords at the same clinics


| Clinic | Keyword | Points ranked | Avg pos when ranked | Top-3 | Top-10 | At clinic |
|---|---|---|---|---|---|---|
| Abbotsford | icbc physiotherapy abbotsford | 49/49 | 2.53 | 44 | 48 | 2 |
| Abbotsford | physio near me | 48/49 | 6.15 | 16 | 41 | 3 |
| Abbotsford | physiotherapist abbotsford | 49/49 | 5.69 | 19 | 43 | 1 |
| Abbotsford | physiotherapy abbotsford | 49/49 | 5.14 | 24 | 42 | 2 |
| Newton 72 Ave | ICBC physiotherapy | 23/25 | 9.43 | 4 | 12 | 1 |
| Newton 72 Ave | Physiotherapy | 22/25 | 8.09 | 6 | 15 | 1 |
| Newton 72 Ave | Physiotherapy near me | 23/25 | 8.7 | 5 | 14 | 1 |
| Newton 72 Ave | Physiotherapy Newton | 25/25 | 7 | 6 | 21 | 1 |
| New Westminster | ICBC physiotherapy | 25/25 | 5.52 | 10 | 20 | 2 |
| New Westminster | ICBC physiotherapy New Westminster | 25/25 | 3.16 | 17 | 24 | 1 |
| New Westminster | Physio near me | 19/25 | 8.79 | 6 | 12 | 2 |
| New Westminster | Physiotherapist New Westminster | 24/25 | 5.92 | 4 | 22 | 1 |
| New Westminster | Physiotherapy | 15/25 | 8.33 | 4 | 11 | 2 |
| New Westminster | Physiotherapy near me | 17/25 | 9.29 | 5 | 9 | 2 |
| New Westminster | Physiotherapy New Westminster | 24/25 | 5.5 | 7 | 22 | 1 |


Reading (ASSUMPTION): New Westminster's WorkSafe Maps visibility (avg 3.36) is close to its ICBC visibility (3.16 for "ICBC physiotherapy New Westminster"), so it is a good pilot clinic. Newton ranks well only at the clinic point and loses most of the grid for injury-phrased WorkSafe queries, so it needs the strongest page support. Unbranded "Worksafe physiotherapy" is the only WorkSafe term ranked across the full grid anywhere. The full per-keyword table is in `data/gbp-maps-keyword-positions.csv`.

## 6. GBP search terms (KNOWN, `LOCAL_getGbpKeywords`, 2026-05-01..2026-10-31)

Every page was read for all 3 locations (Newton 5 pages, New Westminster 3, Abbotsford 3). Terms with impressions = 0 are listed by Google but sit below its reporting threshold (LIKELY under 15); `clicks` is 0 for every term (not populated).

- **WorkSafe / WCB / work-injury terms: none at any of the 3 clinics**, not even under the threshold. ICBC appears only below the threshold ("icbc physiotherapy" at New Westminster; "icbc physiotherapy near me" at Abbotsford).
- Top non-brand terms with reported impressions: Newton: physiotherapy surrey 854, massage near me 762, physiotherapy near me 607, physiotherapy 555, massage 514, rmt near me 305, rmt surrey 288. New Westminster: physiotherapy 477, new west physio 409, massage 368, rmt 321, massage near me 299, physio new westminster 213, rmt new westminster 208. Abbotsford: physiotherapy abbotsford 786, physiotherapy 423, massage abbotsford 403, rmt abbotsford 357, chiropractor abbotsford 334, massage therapy abbotsford 231.
- Brand terms dominate ("synergy rehab": Newton 5,863, New Westminster 3,431, Abbotsford 1,326 impressions).
- Competitor-brand searches surface Synergy's profiles: "revive rehab" 174 (Abbotsford), "catalyst kinetics" 132 and "panda clinic" 51 (New Westminster).
- Search-term strings carry other clinics' details (e.g. Strawberry Hill and King George names on the Newton profile, a Delsom Crescent string on New Westminster) at sub-threshold volume, so a few searches for other Synergy clinics resolve to these profiles.
- Practitioner-name searches exist; they were not copied here.

## 7. WorkSafeBC eligibility check per clinic

Evidence ladder used: (a) WCB appointment types bookable in Jane = KNOWN; (b) brand-level site/Jane claims ("no user fees for ICBC + WorkSafeBC accepted", direct billing) = LIKELY; (c) GBP descriptions mentioning WCB (Abbotsford, New Westminster) = KNOWN; (d) WorkSafeBC provider directory = not reachable (UNKNOWN).


| Clinic | WCB types bookable (Jane, 2026-11-02) | WCB physio practitioners / initial slots 7d | Flags |
|---|---|---|---|
| Vancouver | Massage Therapy: WCB Massage Subsequent Session - 30 minutes; Physiotherapy: WCB Physio Initial Session, WCB Physio Subsequent Session | 2 / 66 | Small WCB physio team in Jane (2 physiotherapists with WCB openings 11-02..11-08); avoid capacity/speed claims / Has a "No Direct Billing" discipline: keep WorkSafe booking links on the WCB Physio types, not the no-direct-billing ones |
| Burnaby | Massage Therapy: WCB Massage Subsequent Session - 30 minutes; Physiotherapy: WCB Physio Initial Session, WCB Physio Subsequent Session | 2 / 73 | Small WCB physio team in Jane (2 physiotherapists with WCB openings 11-02..11-08); avoid capacity/speed claims / Has a "No Direct Billing" discipline: keep WorkSafe booking links on the WCB Physio types, not the no-direct-billing ones |
| New Westminster | Massage Therapy: WCB Massage Subsequent Session - 30 minutes; Physiotherapy: WCB Physio Initial Session, WCB Physio Subsequent Session | 4 / 70 | Has a "No Direct Billing" discipline: keep WorkSafe booking links on the WCB Physio types, not the no-direct-billing ones / Personal Training offered: not direct-billable (Jane text, LIKELY); exclude from WorkSafe copy |
| Richmond | Massage Therapy: WCB Massage Subsequent Session - 30 minutes; Physiotherapy: WCB Physio Initial Session, WCB Physio Initial Session (40 mins), WCB Physio Subsequent Session | 4 / 89 | Has a "No Direct Billing" discipline: keep WorkSafe booking links on the WCB Physio types, not the no-direct-billing ones |
| Delta | Physiotherapy: WCB Physio Initial Session, WCB Physio Subsequent Session | 8 / 77 | Search snippet "not covered by extended health, ICBC or WorkSafe BC" refers to the Non-Registered Massage (Bodyworker) service only; Delta physio IS WorkSafe-bookable (WCB Physio Initial/Subsequent in Jane, KNOWN). Delta stays eligible / Bodyworker (non-registered massage) offered: NOT WorkSafe-covered per Jane page text; never list it as a WorkSafe service / Personal Training offered: not direct-billable (Jane text, LIKELY); exclude from WorkSafe copy |
| Nordel | Acupuncture: WCB Acupuncture Initial Session (45 mins), WCB Acupuncture Subsequent Session (30 mins), WCB Acupuncture Subsequent Session (45 mins); Massage Therapy: WCB Massage Subsequent Session - 30 minutes; Physiotherapy: WCB Physio Initial Session, WCB Physio Subsequent Session | 8 / 103 | None found |
| Cedar Hills | Massage Therapy: WCB Massage Subsequent Session - 30 minutes; Physiotherapy: WCB Physio Initial Session, WCB Physio Subsequent Session | 6 / 175 | None found |
| Strawberry Hill | Physiotherapy: WCB Physio Initial Session, WCB Physio Subsequent Session | 7 / 128 | None found |
| Newton 72 Ave | Physiotherapy: WCB Physio Initial Session, WCB Physio Subsequent Session | 10 / 190 | Bodyworker (non-registered massage) offered: NOT WorkSafe-covered per Jane page text; never list it as a WorkSafe service / Personal Training offered: not direct-billable (Jane text, LIKELY); exclude from WorkSafe copy |
| Sullivan Heights | Massage Therapy: WCB Massage Subsequent Session - 30 minutes; Physiotherapy: WCB Physio Initial Session, WCB Physio Subsequent Session | 8 / 172 | None found |
| King George | Massage Therapy: WCB Massage Subsequent Session - 30 minutes; Physiotherapy: WCB Physio Initial Session, WCB Physio Subsequent Session | 8 / 136 | None found |
| Central City | Massage Therapy: WCB Massage Subsequent Session - 30 minutes; Physiotherapy: WCB Physio Initial Session, WCB Physio Subsequent Session | 5 / 143 | None found |
| Fleetwood | Physiotherapy: WCB Physio Initial Session, WCB Physio Subsequent Session | 6 / 228 | Bodyworker (non-registered massage) offered: NOT WorkSafe-covered per Jane page text; never list it as a WorkSafe service |
| Cloverdale | Physiotherapy: WCB Physio Initial Session, WCB Physio Subsequent Session | 9 / 204 | Personal Training offered: not direct-billable (Jane text, LIKELY); exclude from WorkSafe copy |
| Clayton Corners | Physiotherapy: WCB Physio Initial Session, WCB Physio Subsequent Session | 2 / 46 | Small WCB physio team in Jane (2 physiotherapists with WCB openings 11-02..11-08); avoid capacity/speed claims / Has a "No Direct Billing" discipline: keep WorkSafe booking links on the WCB Physio types, not the no-direct-billing ones |
| Clayton Heights | Physiotherapy: WCB Physio Initial Session, WCB Physio Subsequent Session | 7 / 97 | None found |
| South Surrey | Physiotherapy: WCB Physio Initial Session, WCB Physio Subsequent Session | 5 / 143 | None found |
| Langley | Physiotherapy: WCB Physio Initial Session, WCB Physio Subsequent Session | 5 / 76 | None found |
| Abbotsford | Physiotherapy: WCB Physio Initial Session, WCB Physio Subsequent Session | 4 / 96 | Bodyworker (non-registered massage) offered: NOT WorkSafe-covered per Jane page text; never list it as a WorkSafe service |


**Delta verification detail.** WebSearch ("Synergy Rehab Delta not covered by extended health ICBC WorkSafe BC") returned the Delta Jane booking page with a summary that the Non-Registered Massage (Bodyworker) service is not covered by extended health, ICBC or WorkSafe BC, and that personal training is not direct-billable to extended health (LIKELY). A Jane-restricted search found the same wording on the Sullivan Heights page under a "WorkSafeBC Accepted" header, and noted that RMT and physiotherapy are listed as WorkSafe-accepted (LIKELY). The live Jane data then shows WCB Physio Initial/Subsequent at Delta with 8 physiotherapists and 77 initial slots in 7 days (KNOWN). Conclusion: no clinic in the 19 should be excluded on WorkSafe-acceptance grounds; exclude only specific services (bodyworker, personal training, any "No Direct Billing" discipline) from WorkSafe copy and CTAs.

Other cautions (KNOWN): Vancouver, Burnaby and Clayton Corners each have 2 physiotherapists with WCB openings in the week, so avoid "same-week" or capacity claims there without checking. "No Direct Billing Physiotherapy" exists at Burnaby, New Westminster, Vancouver and Clayton Corners, and "No Direct Billing Massage Therapy" at Richmond. WorkSafe CTAs can deep-link to the WCB Physio Initial type: "WCB Physio Initial Session" is Jane treatment id **442** under Physiotherapy discipline **3** at all 19 locations (KNOWN, data branch), giving `https://synergyrehab.janeapp.com/locations/<slug>/book#/discipline/3/treatment/442` (URL pattern KNOWN from collect.js `booking_url`; that the link opens the type directly is LIKELY because the collector only keeps types the public page offers). Variants also exist (e.g. "WCB Physio Initial Session (40 mins)" at Richmond; extra ids at Langley, South Surrey, New Westminster, Newton).

## 8. Discrepancies register


| Clinic | Address repo plugin | Site postal (LIKELY) | Site phone (LIKELY) | GBP website / site location page | SE Ranking NAP audit | Other discrepancies |
|---|---|---|---|---|---|---|
| Vancouver | 3609 W 16th Ave | V6R 3C3 | (604) 416-2600 [conflicts: (604) 200-2319 on other pages; (604) 373-8092 on Delta page] | GBP Not Available / https://synergyrehabilitation.ca/vancouver-physio/ (also /physiotherapy-in-vancouver/ landing) | Not Available | Phone conflicts across 3 site pages (LIKELY). Smallest physio team in Jane openings (2 physiotherapists, KNOWN). Jane also lists a "No Direct Billing Physiotherapy" discipline here (KNOWN, run log). |
| Burnaby | 4695 Canada Way, #201 | V5G 1K8 | (604) 558-8873 | GBP Not Available / https://synergyrehabilitation.ca/burnaby-physiotherapy-treatment-services/ | Not Available | Site homepage <title> appears as "Physiotherapy Clinic in Burnaby, BC" in WebSearch titles, and several non-Burnaby location pages (Newton/amson, Cloverdale, King George) reuse that Burnaby title (KNOWN from crawl 2026-09-25). |
| New Westminster | 301 E Columbia Street, #405 | V3L 3W5 | (604) 553-3303 [one site page gives (604) 239-3210] | https://synergyrehabilitation.ca/ / https://synergyrehabilitation.ca/physiotherapy-new-westminster/ (also /physiotherapy-in-new-west/) | Audit 2026-10-30 (id 202894, score 31%): postal address errors on yelp, waze, where_to, google_maps; website error on yelp; 42 directories not listed (incl. Apple Maps, Bing, Facebook); no service area set | GBP website points to the HOMEPAGE, not the New Westminster location page (KNOWN). Address format differs: GBP "405 - 301 East Columbia Street" vs repo "301 E Columbia Street, #405" (KNOWN); SE audit flags postal-address mismatch on Google Maps, Yelp, Waze, WhereTo. Second phone (604) 239-3210 on one site page (LIKELY). No GBP service area set; 0 GBP attributes; 5 negative reviews without reply (audit). |
| Richmond | 11688 Steveston Highway, #8060 | V7A 1N6 [conflict: V7A 5J3 on another site page] | (604) 284-5113 | GBP Not Available / https://synergyrehabilitation.ca/richmond-physiotherapy/ (also /richmond-physiotherapy-2/ (duplicate legacy) and /physiotherapy-in-richmond/) | Not Available | Postal code conflict V7A 1N6 vs V7A 5J3 across site pages (LIKELY). Duplicate general pages /richmond-physiotherapy/ and /richmond-physiotherapy-2/ (KNOWN, crawl). |
| Delta | 10757 Delsom Crescent, #103 | V4C 0A5 [Medimap: V4C 0A8] | (604) 516-8505 | GBP Not Available / https://synergyrehabilitation.ca/physiotherapy-delta-chiropractor/ | Not Available | WORKSAFE FLAG RESOLVED TO SERVICE LEVEL: the "not covered by extended health, ICBC or WorkSafe BC" text on the Delta Jane page refers to the Non-Registered Massage (Bodyworker) service, not the clinic (LIKELY, WebSearch x3). Postal V4C 0A5 (site) vs V4C 0A8 (Medimap). Medimap also lists "Salius Rehab Inc." at #103-10757 Delsom Cres (UNKNOWN, possibly stale). Site labels it "North Delta" (ICBC H1) while repo city = "Delta". Sun Life directory lists only chiro/massage services here (LIKELY stale). |
| Nordel | 12565 88 Avenue, #116 | V3W 3J7 | (604) 503-1688 [same as corporate main line] | GBP Not Available / https://synergyrehabilitation.ca/surrey-nordel-physio/ | Not Available | Clinic phone equals the corporate main line +1-604-503-1688 (LIKELY). City ambiguity: repo/ICBC = Surrey, site taxonomy "Nordel (North Delta)" (KNOWN, crawl). |
| Cedar Hills | #120 12852 96 Avenue | V3V 6A8 | (604) 498-0877 | GBP Not Available / https://synergyrehabilitation.ca/cedar-hills-surrey-physiotherapy-clinic/ | Not Available | None found beyond missing GBP data. |
| Strawberry Hill | 12422 72 Ave, 206 | V3W 2M5 | (604) 547-0670 | GBP Not Available / https://synergyrehabilitation.ca/strawberry-hill-physio/ | Not Available | Newton GBP search terms include "synergy rehab strawberry hill ..." strings (0 reported impressions), i.e. some Strawberry Hill searches surface the Newton profile (KNOWN, low volume). |
| Newton 72 Ave | 14468 72 Avenue, #101 | V3S 2E7 | (604) 547-3761 (Jane listing via WebSearch, matches GBP) | https://synergyrehabilitation.ca/physiotherapy-amson-chiropractor/ / https://synergyrehabilitation.ca/physiotherapy-amson-chiropractor/ (legacy "Amson" naming; /newton-surrey-bc/ neighbourhood page also exists) | Audit 2026-10-23 (id 191572, score 32%); 41 directories not listed (incl. facebook, foursquare, here, bing, apple_maps, tomtom, yellow_pages_canada); name errors: hotfrog; postal_address errors: hotfrog, where_to; website errors: hotfrog, waze, where_to, google_maps | GBP website clicks collapsed: 212-357/month Nov 2025-Jul 2026 -> 100 (Aug), 14 (Sep), 89 (Oct 2026) while calls stayed 645-758/month (KNOWN, getGbpMetrics). Audit 2026-10-23 flags website errors on google_maps, waze, where_to, hotfrog (KNOWN); cause UNKNOWN. GBP landing page /physiotherapy-amson-chiropractor/ had <title> "Physiotherapy Clinic in Burnaby, BC" with Newton H1 at crawl 2026-09-25 (KNOWN). Legacy "Amson 72nd" Jane slug still indexed (LIKELY). GBP description mentions ICBC but not WCB/WorkSafe (KNOWN). GBP service area lists 15 places incl. Delta, Langley, New Westminster, Fleetwood, Cloverdale, South Surrey that overlap other Synergy clinics (KNOWN). Search-term strings show postal variants V3S 2E6 / V3S 0B6 (UNKNOWN significance). |
| Sullivan Heights | 15325 56 Avenue, #106 | V3S 0X9 | (604) 566-8773 | GBP Not Available / https://synergyrehabilitation.ca/surrey-sullivan-physio/ | Not Available | Jane page header "WorkSafeBC Accepted" and bodyworker-not-covered note (LIKELY, WebSearch). Jane also lists an "Orthopaedic Surgeon" discipline and no Chiropractor here (KNOWN, run log). Repo main-branch data/availability.json (2026-10-02) still shows a "Kinesiology/Active Rehab (Mobile)" discipline that current collect.js skips, i.e. the main-branch file is stale (KNOWN). |
| King George | 8056 King George Boulevard, #101 | V3W 5B5 | (604) 503-9033 | GBP Not Available / https://synergyrehabilitation.ca/physiotherapy-king-george-chiropractor/ | Not Available | General page <title> "Physiotherapy Clinic in Burnaby, BC" on a King George page (KNOWN, crawl 2026-09-25). WebSearch summary says the King George postal code also appears on a Clayton Corners listing (UNKNOWN; verify). |
| Central City | 13655 Fraser Highway, #120 | V3T 2V6 [conflict: V3T 0P8 on massage page] | (604) 954-1475 [conflict: (604) 245-1127 on chiropractor page] | GBP Not Available / https://synergyrehabilitation.ca/city-central-surrey-physio/ (naming varies: "City Central" (URL) vs "Central City" (Jane) vs "Surrey City Centre" (ICBC H1)) | Not Available | Postal code and phone conflicts across site pages (LIKELY). Name variants City Central / Central City / Surrey City Centre (KNOWN). |
| Fleetwood | 8585 160 Street, #103 | V4N 1G4 | (604) 503-4799 | GBP Not Available / https://synergyrehabilitation.ca/fleetwood-physiotherapy-treatment-clinic/ | Not Available | Kinesiology/Active Rehab discipline is bookable (run log) but had no openings 2026-11-02..08 (KNOWN). Jane also offers Non-Registered Massage (Bodyworker) here (KNOWN, run log). |
| Cloverdale | 5645 177B Street, #102 | V3S 4H9 | (604) 579-1367 [conflict: (604) 227-6785 on /cloverdale-physio/] | GBP Not Available / https://synergyrehabilitation.ca/physiotherapy-cloverdale-chiropractor/ (also legacy /cloverdale-physio/) | Not Available | Phone conflict (LIKELY). General page <title> "Physiotherapy Clinic in Burnaby, BC" (KNOWN, crawl 2026-09-25). ICBC meta description gives only "Unit 102" with no street (KNOWN). |
| Clayton Corners | 18811 72 Ave, 110 | V4N 6W7 (Jane listing via WebSearch) | (604) 416-0580 | GBP Not Available / Not Available (one shared /clayton-physiotherapy-treatment-clinic/ page; which Clayton clinic it covers is UNKNOWN) (legacy /clayton-corners-physio/) | Not Available | Site pages mix Clayton Corners (18811 72 Ave) and Clayton Heights (19161 Fraser Hwy) under "Clayton" (LIKELY). Legacy Jane slug "clayton-corners" still indexed (LIKELY). ICBC H1 calls it "East Clayton". Narrowest Jane service mix: no Kinesiology/Active Rehab discipline at all; Jane lists "No Direct Billing Physiotherapy" (KNOWN, run log). |
| Clayton Heights | 19161 Fraser Highway, #105B | V3S 8E7 | (604) 547-2860 | GBP Not Available / Not Available (shared /clayton-physiotherapy-treatment-clinic/; UNKNOWN which clinic) | Not Available | /clayton-heights-thank-you/ H1 reads "South Surrey Facility" (KNOWN, crawl). /extp-location/clayton-heights-synergy-rehab/ returns 404 (KNOWN, crawl). |
| South Surrey | 2388 156 St, 106 | V4A 4V4 | (604) 385-5855 | GBP Not Available / https://synergyrehabilitation.ca/south-surrey-chiropractic-care/ (general page is chiropractic-titled) | Not Available | Only general location page found is chiropractic-titled ("South Surrey Chiropractic Care") (KNOWN, crawl). |
| Langley | 8045 204 St, A130 | V2Y 5K1 | (604) 371-1988 | GBP Not Available / https://synergyrehabilitation.ca/langley-physio/ | Not Available | Site locations page labels it "Yorkson Village" (LIKELY); repo city "Langley Township" vs GBP-style "Langley" UNKNOWN. |
| Abbotsford | 3720 Townline Rd, #100 | V2T 5W8 | Not Available (not returned by WebSearch); GBP (604) 776-5700 | https://synergyrehabilitation.ca/physiotherapy-abbotsford-chiropractor/ / https://synergyrehabilitation.ca/physiotherapy-abbotsford-chiropractor/ (also /icbc-physiotherapy-abbotsford/ alt landing) | Audit 2026-10-30 (id 202909, score 55%); 25 directories not listed (incl. facebook, yelp, foursquare, apple_maps); name errors: here, tomtom; postal_address errors: here, tomtom; website errors: here | No WorkSafe/WCB keyword in Maps rank tracking (KNOWN). Audit 2026-10-30: name + postal-address errors on HERE and TomTom, website error on HERE; not listed on Yelp, Facebook, Apple Maps (KNOWN). GBP search-term strings show postal variant V2T 0G6 (UNKNOWN significance). GBP attribute "Appointment required" = false while Newton = true (KNOWN). |


Cross-cutting discrepancies:
- `lat`/`lng` are null for all 21 entries in the plugin `locations.json` (KNOWN). Only the 3 connected GBPs give coordinates.
- The main-branch `data/availability.json` (2026-10-02, v3 format, no `also` field) is stale and hides WCB types; the live file is on the `data` branch (KNOWN). Anyone auditing WorkSafe availability from the main branch would wrongly conclude no WCB types exist.
- `collect.js` lists `wcb|worksafe` in `PREFER_AVOID`, so the plain session is chosen as each slot's main type and WCB types appear only in `also` (KNOWN). Any WorkSafe widget must read `also`.
- Legacy Jane slugs still indexed by search engines: `amson-72nd` (now newton-72nd) and `clayton-corners` (now clayton-corners-188-st); numeric `/locations/<id>/book` URLs are also indexed (LIKELY).
- Several general location pages reuse the `<title>` "Physiotherapy Clinic in Burnaby, BC" (Newton/amson, Cloverdale, King George), and the homepage shows the same title in search results (KNOWN for the crawled pages, LIKELY for the homepage).

## 9. Data gaps and how to close them


| Gap | Why Not Available | How to close (owner action, not done here) |
|---|---|---|
| GBP name, categories, hours, lat/lng, rating, review count, GBP website target for 16 clinics | Only 3 GBPs are connected in SE Ranking Local; Google Maps fetch blocked; advanced SERP for a brand query returned no local pack | Export all 19 profiles from Google Business Profile Manager (bulk CSV), or connect the remaining 16 in SE Ranking Local (paid package; subscription ends 2026-11-06) |
| WorkSafeBC provider/contract status per clinic | worksafebc.com blocked | Ops confirmation, or allowlist worksafebc.com and check the provider directory |
| Authoritative phone/postal for clinics with conflicts (Vancouver, Richmond, Central City, Cloverdale, Delta, New Westminster) | Site fetch blocked; WebSearch summaries conflict | Clinic managers confirm; then align GBP, site, Jane and citations |
| Cause of Newton website-click drop | GBP edit history not exposed by SE Ranking; site fetch blocked | Check the GBP website field, UTM, and whether /physiotherapy-amson-chiropractor/ redirects or errors since Aug 2026 |
| WorkSafe Maps positions at 17 clinics | Not tracked | Add "worksafe physiotherapy <city>" / "wcb physio <city>" to rank tracking once GBPs are connected (a change, so not done here) |


## 10. Unit and call log

- SE Ranking API units: 10 used of the 300 budget (`DATA_getSubscription` units_left 8,690 before the SERP test, 8,680 after). All `LOCAL_*` calls are 0-credit per the tool description.
- SE Ranking Local calls: listLocations x1, getLocation x3, getLocationOverview x3, getGbpMetrics x1, listRankingKeywords x3, getRankingPositions x4, getGbpKeywords x11 pages, listBusinessListings x2. DATA: getSubscription x2, getSerpLocations x1, getSerpResults x1 (timed out client-side; task completed), getSerpTasks x1, getSerpTaskAdvancedResults x5.
- WebSearch: 8 queries. GitHub (read-only): `gh run list`, `gh run view --log`, `git fetch origin data`.
- Raw tool outputs kept in `/tmp/claude-0/-home-user-synergy-availability/7fb27b37-db08-5b4c-bf1d-e36db1a2ed16/scratchpad/gbp/` (ov-*, kw-*, pos-*, met-42283, notes-42283, jane-current, jane-runlog, availability-data-branch, serp-fleetwood).

## 11. Source URLs

- GBP Maps: https://maps.google.com/maps?cid=14441931768404812645 (Abbotsford), https://maps.google.com/maps?cid=298216086905119071 (Newton), https://maps.google.com/maps?cid=13663810117809319107 (New Westminster), all from LOCAL_getLocation.
- Jane: https://synergyrehab.janeapp.com/locations/delta/book, https://synergyrehab.janeapp.com/locations/6/book, https://synergyrehab.janeapp.com/locations/3/book, https://synergyrehab.janeapp.com/locations/amson-72nd/book, https://synergyrehab.janeapp.com/locations/clayton-corners-188-st, https://synergyrehab.janeapp.com/ (WebSearch results).
- Site: https://synergyrehabilitation.ca/locations/, https://synergyrehabilitation.ca/physiotherapy-delta-chiropractor/, https://synergyrehabilitation.ca/icbc-treatments/delta/, https://synergyrehabilitation.ca/worksafe-physiotherapy/, https://synergyrehabilitation.ca/worksafebc-physiotherapy-what-is-covered/, https://synergyrehabilitation.ca/cloverdale-physio/, https://synergyrehabilitation.ca/city-central-surrey-chiropractor/, https://synergyrehabilitation.ca/physiotherapy-in-new-west/ (WebSearch results).
- Third-party: Sun Life Lumino provider directory entry for Synergy Rehabilitation Inc. at 10757 Delsom Cres (URL omitted because it contains a practitioner's name), https://medimap.ca/clinics/physiotherapists/bc/north-delta, https://legacy.medimap.ca/clinics/chiropractors/bc/north-delta/synergy-rehabilitation-delta-chiropractic (WebSearch results).
- Repo: https://github.com/marketingSR2026/synergy-availability (branch `data`, commit f605b48; Actions run 41366684080).

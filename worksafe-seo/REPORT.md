# WorkSafeBC SEO program: executive report

Synergy Rehabilitation, 2026-11-02. Scope: WorkSafe only.

## 1. Bottom line

*   **Opportunity is real and narrow.** WorkSafeBC physio demand sits in a few head terms: `wcb physiotherapy` 210/mo, `worksafebc physiotherapy` 140/mo, `wcb physiotherapy near me` 140/mo (SE Ranking, Canada-wide; BC share unknown). All 114 city and neighbourhood WorkSafe terms tested show no measurable volume. Location pages are justified by real clinic facts and near-me intent, not by geo keywords.
*   **Synergy starts from almost zero.** No WorkSafe or WCB keyword ranks for the domain in SE Ranking's Canada data. WCB queries are 8 of 78,145 Search Console impressions. Where Synergy does show for WorkSafe searches (Richmond, Abbotsford), it is with ICBC pages or a tag archive.
*   **The open position is accuracy.** WorkSafeBC replaced its physiotherapy contract on April 1, 2026. Most competitors, and Synergy's own pages, still publish old visit counts or a wrong "referral after 60 days" rule, and AI Overviews repeat them.
*   **The blocker is not SEO.** No clinic's 2026 WorkSafeBC contract is confirmed in any source we can reach. Nothing can publish until ops confirms it per clinic. The build enforces this.

## 2. What was done

| Area | Result | Where |
|---|---|---|
| Phase 0 | Screenshot #1 tool (claude-seo) already installed and loaded. Google's Elephant-Goldfish Model installed and verified (`egm@egm` 0.1.0) | `PROJECT-STATE.md` |
| Research | 9 specialist agents plus a completeness critic: site inventory, ICBC reverse-engineering, Drive reports, GBP/local, WorkSafeBC 2026 rules, keywords, rank baseline, competitors, design system | `research/01` to `09` |
| Architecture (Elephant) | Pillar + gated location pages + coverage guide + return-to-work article; keyword ownership; existing-URL decisions | `spec/design_draft.md` |
| Goldfish review | 14 fresh reviewers, EGM stages 5 to 9 plus 5 domain lenses: 32 Blockers (14 distinct), all resolved | `egm/goldfish_review_report.md` |
| Build | Claim-tagged templates, gated build, 12 automated tests, previews for pillar and all 19 clinics | `pages/`, `build/` |
| Data | Keyword map (508 rows, URL targets), 19-location matrix, claims register (70+ rows), clinic sign-off sheet | `data/` |

Tools that worked: SE Ranking (projects, keyword, SERP, local, audits), Google Drive, WebSearch. Not available: Ahrefs (plan), Semrush (no API units), Google Keyword Planner and Trends (no connector), Search Console page level and GA4 (no access), WordPress (not connected), and direct access to synergyrehabilitation.ca, worksafebc.com and threads.com (network policy). Nothing was invented to fill these gaps.

## 3. Key findings

**Site and ICBC lessons**
*   The 19 ICBC location pages are about 94% identical. Google rotates about 5 Synergy URLs per ICBC query, and 17 of 29 clinic keywords rank the wrong clinic's page. The WorkSafe pages are built to avoid this: clinic-only facts are required and similarity is measured.
*   Theme defects every new page inherits: two canonical tags (388 pages), two meta descriptions (82), about 3.8 MB of JavaScript, failing mobile INP.
*   The site states four different WorkSafe visit rules. These must be removed in week 1.

**WorkSafeBC 2026 rules (from search snippets; staff must open and confirm)**
*   New Physiotherapy Services Agreement from April 1, 2026.
*   Initial assessment on a pending claim within 60 days, without prior approval; paid even if the claim is later denied.
*   After 60 days, WorkSafeBC must approve treatment first. This is not a referral rule.
*   Accepted claim: no fees for claim-related care.

**Competitors**
*   They win with a WorkSafe page per city or clinic (Launch Rehab, Total Therapy, Prana, All Care).
*   Several markets have weak results: Vancouver is mostly worksafebc.com, and Burnaby, Langley and Delta are directory-heavy.
*   Link authority is not Synergy's gap (293 referring domains, the most among the clinics measured).
*   Patterns we do not copy: exact-match microsites, keyword-stuffed listing names, templated city pages with the wrong address.

**Local**
*   Only 3 of 19 GBPs are connected in SE Ranking.
*   New Westminster already holds a strong WorkSafe map position (average 3.36).
*   New Westminster and Central City GBPs point to the homepage instead of a clinic page.

## 4. Expected impact (scenarios, not promises)

| Scenario | What happens | Signal by day 90 |
|---|---|---|
| Conservative | Pages index; the pillar reaches page 1 for one head term on some engines; clinic pages replace ICBC and tag pages for WorkSafe queries in Richmond and Abbotsford | Right URL ranks (goal G-2); first WorkSafe clicks in Search Console |
| Expected | Pillar top 10 for `wcb physiotherapy` and `worksafebc physiotherapy` on at least 5 of 9 tracked engines; Wave 1 pages top 10 for their own city queries; Synergy cited in some WorkSafe AI answers | Goals G-1, G-2 and G-6 met; WCB initial bookings at pilot clinics up compared with the prior 8 weeks |
| Stop | Pages index but none ranks top 20 for its city query and WCB bookings do not move | Pilot stop rule: fold facts into the pillar finder; no more location pages |

Total measured head-term demand is about 1,050 searches a month across Canada, so most business value comes from converting local and near-me searches into correct, bookable clinic visits, not from volume alone.

## 5. Ten highest-impact next actions

| Priority | Action | Evidence | Expected impact | Effort | Risk | Owner | Status | Success metric |
|---|---|---|---|---|---|---|---|---|
| 1 | Confirm the April 2026 WorkSafeBC agreement per clinic (legal entity, vendor number); Wave 1 first | SYN-01 unverified for all 19; Cedar Hills and Clayton Corners not on cached lists | Unblocks every page | Low | High if skipped (misleading claims) | Ops / billing | Open | G1 true for New Westminster, Richmond, Abbotsford |
| 2 | Week-1 cleanup of wrong WorkSafe wording sitewide | 4 conflicting visit rules on Synergy pages (SYN-02, 03, 04, 11) | Stops misinformation that AI answers repeat | Low | Low | Marketing | Open | 0 CONFLICT phrases on the live site |
| 3 | Make the collector repo private or remove practitioner names; confirm Jane's permission | Public `data` branch lists full names with open times | Removes a staff-privacy (PIPA) exposure | Low | High if left | Owner | Open | Repo private or names removed |
| 4 | Decide SE Ranking renewal and add the WorkSafe keyword group with target URLs | Data API ends 2026-11-06; no WorkSafe tracking today | Gives the 14-day baseline before launch | Low | Medium (lost baseline) | Marketing | Open | Baseline recorded |
| 5 | GTM privacy gate G6 on WorkSafe URLs | Meta pixels, session replay and chat run sitewide | Required to publish; protects workers' privacy | Medium | Low | Marketing + privacy officer | Open | GTM preview clean |
| 6 | Clinical reviewer opens each cited worksafebc.com page and records checks | All claims are snippet-verified only | Required to publish; accuracy edge | Medium | Low | Registered physiotherapist | Open | Every claim used has a check date |
| 7 | Wave 1 clinic managers fill the sign-off sheet (getting here, parking, access, check-in, languages, consented team or photo) | G3 empty for all clinics; similarity 0.48 to 0.54 on placeholders | Makes pages distinct and useful | Medium | Low | Clinic managers | Open | G3 true; similarity at most 0.40 |
| 8 | Fix the theme's duplicate canonical and meta tags | 388 and 82 pages affected | Clean signals for new pages | Medium | Low | Web developer | Open | One of each on a draft page |
| 9 | Publish the guide, then Wave 1 pages, then the pillar (RUNBOOK order) | Competitor format; wrong-intent pages rank in Richmond and Abbotsford | First WorkSafe rankings and bookings | Medium | Medium | Marketing | Ready after 1 to 8 | Goal G-2 by day 60 |
| 10 | Point New Westminster and Central City GBP website links to their clinic pages; ask WorkSafeBC to correct provider-list entries (New West unit 202, Vancouver phone, Central City name) | GBPs point to the homepage; provider lists rank #1 for `wcb physio <city>` | Better local and provider-list consistency | Low | Low | Marketing + ops | Open | Listings match the site |

## 6. Deliverables index

1.  Executive report: this file.
2.  Keyword master dataset: `data/keyword-master.csv` (508 rows, URL targets set; volumes from SE Ranking only, Not Available where no tool gave data).
3.  19-location matrix: `data/location-matrix.csv`.
4.  Competitor intelligence: `research/08-competitor-intel.md`, `data/serp-snapshot.csv`.
5.  Site architecture: `spec/design_draft.md` sections 1 to 3 and 8.
6.  Page designs and content: `pages/src/`, previews in `pages/dist/` and `previews/` (pillar and Wave 1 at 390 px and 1280 px).
7.  Technical SEO: `research/01-site-inventory.md`, spec section 7 and 10, RUNBOOK section 0.
8.  Analytics plan: spec section 9, RUNBOOK sections 0 and 4.
9.  EGM review: `egm/`.
10. Next actions: section 5 above.

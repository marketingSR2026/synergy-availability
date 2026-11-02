# WorkSafeBC Physiotherapy Search Program: Architecture and Page Specification

*   **Author:** Elephant (Claude Code orchestrator) for Synergy Rehabilitation marketing
*   **Status:** Revised after Goldfish review (see `egm/goldfish_review_report.md`); awaiting owner approval
*   **Date:** 2026-11-02

--------------------------------------------------------------------------------

## Overview

Synergy Rehabilitation runs 19 physiotherapy clinics from Vancouver to Abbotsford. Every clinic offers a bookable "WCB Physio Initial Session" in Jane (treatment id 442, checked 2026-11-02). Search visibility for WorkSafeBC (WCB) physiotherapy is close to zero: no WorkSafe or WCB keyword ranks for the domain in SE Ranking's Canada data, and WCB queries are 8 impressions out of 78,145 in Search Console.

This document specifies a WorkSafe-only search presence: one pillar page, one location page per verified eligible clinic, two supporting articles, the data file and build script that generate the pages, the publish gates, and the measurement plan.

Scope rule from the owner: **WorkSafe only.** No ICBC, private-pay or extended-health content, offers or CTAs on these pages. ICBC pages are a structural reference only.

Evidence lives in `worksafe-seo/research/01` to `09` and `worksafe-seo/data/`. Every number below cites its file.

## The Problem

1. **No WorkSafe page earns search traffic.** `/worksafe-physiotherapy/` ranks only #64 for one zero-volume term (research/07). It has no in-body links to any clinic (research/02).
2. **Wrong pages rank for WorkSafe intent.** In Richmond, `/tag/worksafebc/` (#7) and `/icbc-treatments/richmond/` (#6, #10) rank for WorkSafe searches. In Abbotsford, an ICBC landing page with "25 Visits" copy ranks #11 for `wcb physio abbotsford` (research/08).
3. **Synergy publishes conflicting WorkSafeBC facts.** The site says 10 sessions over 5 weeks, 15 over 6 weeks, "up to 15" and "no fixed number" on different pages (research/02, data/claims-register.csv SYN-02, SYN-03, SYN-15). One blog line says the patient covers any gap, which applies to non-contracted clinics only (SYN-11).
4. **Competitors win with a WorkSafe page per city or clinic.** Launch Rehab runs a hub plus one WorkSafe page per clinic and ranks #1 in New Westminster and #3 in Richmond. Most competitors publish out-of-date visit counts and an incorrect "referral after 60 days" rule (research/08 bottom line 4). Accurate, dated, sourced content is an open position.
5. **The ICBC precedent shows the main risk.** 19 near-identical ICBC location pages (about 94% shared text) cause Google to rotate about 5 Synergy URLs per query, and 17 of 29 ICBC clinic keywords rank the wrong clinic's page (research/07). Copying that template for WorkSafe would repeat the problem.

Proposed solution in one line: rebuild the existing WorkSafe page as the single WorkSafeBC pillar and clinic finder, add one genuinely distinct WorkSafe page per clinic only after that clinic passes five publish gates, and keep every WorkSafeBC fact traceable to a dated official source.

## Goals

*   **G-1 Visibility:** Synergy WorkSafe URLs (pillar or location pages) appear in the organic top 10 for `worksafebc physiotherapy` and `wcb physiotherapy` on at least 5 of the 9 tracked SE Ranking regional engines within 90 days of the pilot launch. Baseline: 0 of 9 (research/07).
*   **G-2 Right page:** in every pilot market, the WorkSafe page for that clinic, not an ICBC page or tag archive, is Synergy's best-ranking URL for `worksafebc physiotherapy <city>` and `wcb physio <city>` within 60 days.
*   **G-3 Conversion:** WorkSafe pages produce measurable booking intent: `worksafe_book_click` and `worksafe_phone_click` events per 100 organic sessions are reported weekly from launch. A target is set at day 30 once a baseline exists.
*   **G-4 Accuracy:** 0 published WorkSafeBC statements without a claim id whose publish rule is OK_TO_PUBLISH or staff-signed STAFF_CONFIRM. 0 visit-count statements until WSBC-18 is staff-confirmed.
*   **G-5 No collateral damage:** ICBC head terms (`icbc physiotherapy`, `icbc physio`, `car accident physiotherapy`) and generic `physiotherapy <city>` terms stay within 3 positions of their 2026-11-02 baseline (data/rank-baseline.csv) on the same engines.
*   **G-6 AI answers:** at least 3 of 10 tracked WorkSafe prompts name or cite Synergy by day 90. Baseline: 0 (research/07).

## Non-Goals

*   No ICBC, private-pay or extended-health content on WorkSafe pages (scope rule).
*   No city hub pages (for example "WorkSafeBC physiotherapy Surrey") and no pages for neighbourhoods without a clinic. All 114 tested geo WorkSafe terms had no measurable volume (research/06 §4.3).
*   No occupation pages or injury-type pages. These become sections (research/06 §7.3).
*   No changes to ICBC pages, ICBC rankings tracking, or GBP business names.
*   No changes to GBP website targets in this project (see Technical Plan §3, decision D6).
*   No paid tools, ads, link buying or review incentives.
*   No live WordPress deployment from this environment. WordPress is not connected; this project delivers build-ready files and a deployment runbook.

## Open Questions

These need staff answers. Each blocks only the items named.

*   **Q-1 Contract (blocks publishing any page, gate G1):** For each clinic, is the April 1, 2026 WorkSafeBC Physiotherapy Services Agreement signed, and under which vendor number? Cedar Hills and Clayton Corners first (data/worksafe-locations.json `eligibility_risk`).
*   **Q-2 Delta entity (blocks the Delta page):** Is "Salius Rehab Inc." (listed by Medimap at Delta's unit) related to Synergy Delta?
*   **Q-3 Visit counts (blocks any visit-count sentence):** Confirm WSBC-18 (first treatment period up to 10 visits or 5 calendar weeks) against the current reference manual.
*   **Q-4 Referral wording (blocks the referral FAQ):** Confirm WSBC-16 (no doctor's referral needed for WorkSafeBC physiotherapy).
*   **Q-5 Pending-claim policy (blocks the pending-claim FAQ's Synergy sentence):** Does Synergy charge and refund, or wait for the decision, when a claim is pending?
*   **Q-6 NAP (gate G2):** Each clinic manager signs off name, address, unit, postal code, phone and hours. Known conflicts: data/worksafe-locations.json `nap_conflicts`.
*   **Q-7 Clinic facts (gate G3):** Getting here, parking, accessibility, languages, WCB physiotherapists who consent to a profile card, one consented clinic photo.
*   **Q-8 Tracking (gate G5):** Approve adding the WorkSafe keyword set and AI prompts to SE Ranking project 12903890. The SE Ranking Data API subscription ends 2026-11-06.
*   **Q-9 Clinical sign-off:** Name of the registered physiotherapist who reviews WorkSafeBC claims for the "Reviewed by" line.
*   **Q-11 Analytics access (blocks G-3 and day-7/30 checks):** Read access to Search Console (page level) and GA4/GTM, and who pulls weekly Jane counts of "WCB Physio Initial Session" bookings per clinic (aggregate counts only).
*   **Q-12 Collector and public repo (privacy, outside this build):** The availability collector reads Jane booking pages and the public repo's `data` branch lists practitioners' full names with their open times. Confirm Jane's written permission and make the repo private or remove names.
*   **Q-13 Booking type per clinic:** Several clinics show more than one "WCB Physio Initial Session" type in Jane (New Westminster 442 and 1013, Newton 442, 1019, 1099, 1111, Langley 442 and 948, South Surrey 442 and 968). Which id should each clinic's button open? Default 442 is set in `clinic-signoff.csv`.
*   **Q-10 Paid landing pages:** Are `/physiotherapy-in-new-west/` and `/icbc-physiotherapy-abbotsford/` Google Ads landing pages? Affects whether they may be noindexed later.

## Critical User Journeys (CUJs)

### CUJ 1: Injured worker searches from a phone near a clinic

*   **Given**: A warehouse worker in New Westminster hurt their back yesterday, has told their employer and has not reported to WorkSafeBC yet. They search `wcb physio near me` on a phone.
*   **When**: They open Synergy's New Westminster WorkSafe page (published only after the clinic passes G1 to G6).
*   **Then**: In the first screen (390x664) they see the clinic name, area, "Book a WCB assessment" (Jane WCB Physio Initial Session for that clinic) and "Call". Directly under the buttons: "Not reported yet? Report it to WorkSafeBC online or call Teleclaim at 1.888.967.5377" (WSBC-43, WSBC-44). The lede says the claim can still be pending (WSBC-11). The `worksafe_book_click` event fires with `clinic_slug=new-westminster`, `placement=hero`, and no health data.

### CUJ 2: Worker with a pending claim asks whether they can start now

*   **Given**: A care aide in Abbotsford reported an injury 10 days ago. The claim is pending.
*   **When**: They land on the pillar's claim-stage card or FAQ.
*   **Then**: They read, each with its source and the as-of line: the initial assessment can happen on a pending claim within 60 days without prior approval, and WorkSafeBC pays for it even if the claim is later denied (WSBC-12, WSBC-29); funded treatment visits start once the claim is accepted (WSBC-17); until then a clinic may ask them to pay and they can ask for a refund if the claim is accepted (WSBC-28); how Synergy handles that period (SYN-PEND, pending Q-5); and that starting more than 60 days after the injury needs WorkSafeBC approval first (WSBC-14). The Abbotsford clinic appears in the finder only if its contract is confirmed (G1).

### CUJ 3: Worker in a city with many clinics picks the closest one

*   **Given**: A worker searches `worksafebc physiotherapy surrey`.
*   **When**: They land on the pillar (the designated owner of Surrey city queries).
*   **Then**: The clinic finder shows a "Surrey: 12 clinics" group in west to east order with neighbourhood labels, street addresses and links to each clinic's WorkSafe page. No Surrey hub page exists.

### CUJ 4: Staff publish a new clinic page safely

*   **Given**: Ops confirms the 2026 contract for Langley and the Langley manager returns the clinic questionnaire.
*   **When**: Marketing sets Langley's gates to true in `data/worksafe-locations.json` and runs the build in publish mode.
*   **Then**: The build produces the Langley page only if all five gates are true, every claim tag on the page resolves to an allowed claim id, and every required clinic-fact slot is filled. Otherwise it stops with a list of what is missing.

## Technical Plan (Architecture)

### 1. Site architecture and URL map

```text
synergyrehabilitation.ca
 ├─ /worksafe-physiotherapy/                         PILLAR (existing URL, rebuilt) + clinic finder
 │    ├─ /worksafe-physiotherapy/<clinic-slug>/       LOCATION PAGE x up to 19 (new, gated)
 ├─ /worksafebc-physiotherapy-what-is-covered/        COVERAGE GUIDE (existing URL, facts refreshed)
 ├─ /return-to-work-after-a-workplace-injury/         RTW ARTICLE (new)
 └─ official links out: worksafebc.com claim, Teleclaim, provider lists
```

*   **D1 Pillar = `/worksafe-physiotherapy/`.** It already carries the sitewide "Worksafe" menu link (352 in-links, research/01). `wcb physiotherapy` (210/mo Canada-wide, partly out of province) shows a local pack (research/06); `worksafebc physiotherapy` (140/mo) showed no local pack in the 2026-11-02 Vancouver SERP (research/08). Either way the searcher is choosing where to go, so the owner page carries the clinic finder near the top. Rebuild in place; same URL; no redirect.
*   **D2 Location URL pattern = `/worksafe-physiotherapy/<clinic-slug>/`.** Slugs mirror the ICBC set (`/icbc-treatments/<clinic-slug>/`), for example `new-westminster`, `richmond`, `abbotsford`, `newton-surrey`. A child URL makes the breadcrumb, the pillar link and the clinic relationship explicit. Full slug list: `data/worksafe-locations.json` `page_slug`.
*   **D3 Coverage guide stays separate and keeps its URL.** It ranks live in 4 cities and is an AI Overview source (research/08). It owns claim and coverage questions (claim number, forms, costs, pending claims, extensions). Facts are replaced with the claims-register versions; the title keeps the phrase "WorkSafeBC physiotherapy" and adds "what is covered", so it does not drop its current rankings. The pillar summarises and links to it; it links back to the pillar and the clinic finder.
*   **D4 Return-to-work article is new.** `gradual return to work` (140/mo) and `modified duties` (140/mo) are measurable, distinct intent (research/06 §7.2). It links to the pillar and the finder.
*   The optional "injured at work in BC" article (P2 in research/06) is deferred. Its intent is covered by the pillar's step band and the coverage guide.

### 2. Keyword ownership and cannibalization rules

| Keyword cluster (research/06, data/keyword-master.csv) | Owner URL | Supporting URLs |
|---|---|---|
| worksafebc physiotherapy, wcb physiotherapy, worksafe physio, wsbc physiotherapy, wcb approved physiotherapy | Pillar | All location pages link to the pillar with the anchor "WorkSafeBC physiotherapy" |
| worksafebc / wcb physiotherapy near me | Location pages (via local relevance) and pillar finder | GBP listings |
| worksafebc / wcb physio `<city>` where the city has one clinic | That clinic's location page | Pillar finder card |
| worksafebc / wcb physio `surrey` and other multi-clinic cities | Pillar (Surrey group in the finder) | None. No Surrey hub |
| `<neighbourhood>` + WorkSafe terms | That clinic's location page | Nearby-clinic cards on sibling pages |
| claim number, form 6, injury report, teleclaim, user fees, extensions, pending claim | Coverage guide | Pillar FAQ gives a 1 to 2 sentence answer and links to the guide |
| gradual return to work, modified duties, return to work program | RTW article | Pillar RTW band links to it |
| WCB massage, WCB acupuncture | Sections on the pillar and on the clinic pages where Jane shows them bookable (9 clinics massage, Nordel acupuncture) | None |

Rules:
1. **One primary cluster per URL.** Title, H1 and first paragraph name only the owner cluster.
2. **Close clinics (under 2.5 km: Nordel and Cedar Hills 1.5 km, Cedar Hills and Central City 1.7 km, Clayton Corners and Clayton Heights 1.8 km, King George and Newton 2.4 km):** each page's title and H1 use its own area label and street. The page names the close sibling only inside the nearby-clinics block, with the distance. No page uses a sibling's neighbourhood name in its title, H1 or meta description.
3. **City words in multi-clinic cities:** Surrey location pages say "Surrey" after the neighbourhood (for example "Newton, Surrey") and never use "Surrey" alone as the H1 place.
4. **Monitoring:** if SE Ranking shows two Synergy WorkSafe URLs alternating for the same query on the same engine on 5 or more of 14 days, the owner table above decides which page gets a stronger internal link and which gets its copy narrowed.

### 3. Existing URL decisions

| URL | Decision at launch | Review |
|---|---|---|
| `/worksafe-physiotherapy/` | Rebuild as pillar (D1) | Day 7 technical, day 30 rankings |
| `/worksafebc-physiotherapy-what-is-covered/` | Keep URL; replace facts with claims-register versions; add links to pillar and finder (D3) | Day 30 |
| `/physiotherapy-in-new-west/` | **Keep unchanged.** It ranks #3, #3, #6 for WorkSafe terms and is cited in 2 AI Overviews (research/08). Add one in-body link to the New Westminster WorkSafe page if the page is not an ads landing page (Q-10) | Day 30: if the new page outranks it for WorkSafe terms, keep both; if both alternate, narrow this page's WorkSafe copy |
| `/physiotherapy-new-westminster/` and other general clinic pages, including the 5 newer clinic pages with "More About Worksafe" sections (Abbotsford, Newton/Amson, Cloverdale, Delta, King George) | Cut each WorkSafe section to one sentence plus a link to that clinic's WorkSafe page, in the same wave as that page. This is gate G4: one WorkSafe owner page per clinic | With each clinic page |
| Week-1 site cleanup (all URLs, independent of waves) | Remove every Synergy statement registered as CONFLICT or DO_NOT_PUBLISH: SYN-02, SYN-03, SYN-04, SYN-06, SYN-11, SYN-14 (visit counts, "eligible within 60 days", patient pays the gap, mileage). Narrow exception to the ICBC no-change rule: only WorkSafe sentences on mixed pages change | Before the pillar launches |
| `/tag/worksafebc/` | Set `noindex, follow` after the Richmond page is live and indexed | Day 14 after Richmond launch |
| `/icbc-treatments/*`, `/icbc-physiotherapy-*` | **No change** (scope rule, G-5). New WorkSafe pages displace them for WorkSafe queries by relevance | Watch G-5 guardrails |
| `/icbc-claims/` | Remove the WorkSafe sentences SYN-03 and SYN-04 in the week-1 cleanup and link to the pillar; ICBC copy unchanged | Week 1 |
| Homepage WorkSafe module | Replace the "10 sessions" sentence (SYN-02) with a link to the pillar | With pillar launch |
| WorkSafe blog post with "patient covers the gap" (SYN-11) | Correct the sentence: that rule applies to non-contracted providers (WSBC-26) | With pillar launch |

*   **D6 GBP website links stay on the general clinic pages.** Pointing GBP to WorkSafe pages would pull generic "physio near me" demand onto WorkSafe-only pages and conflict with the scope rule. The general clinic pages link to their WorkSafe page. Separate recommendation outside this project: New Westminster and Central City GBPs point to the homepage and should point to their clinic pages.

### 4. Clinic selection: publish gates and waves

Gates are computed by the build from `data/clinic-signoff.csv` (human-owned, one row per clinic) and `data/review.json` (site level). Nobody sets a gate to true by hand; filling the evidence fields makes it true.

| Gate | Pass condition (all fields need a name and an ISO date where shown) | Owner |
|---|---|---|
| G1 Contract | `contract_2026_confirmed=yes`, legal entity, vendor number, confirmed by, confirmed on; and the clinic's entry on WorkSafeBC's current provider list matches the page NAP, or a correction was filed (`worksafebc_list_matches` = yes or correction_filed) | Ops / billing |
| G2 NAP | Manager signed off name, address, unit, postal code, phone and hours (`nap_signed_by`, `nap_signed_on`) | Clinic manager |
| G3 Clinic facts | getting_here, accessibility, check_in and parking each at least 8 words; languages filled; a consented team card or a consented clinic photo; at least 120 words of clinic-only facts in total. Plus a measured check: 5-word-shingle similarity to any other location page in the same publish run at most 0.40 | Clinic manager |
| G4 URL plan | Other pages' WorkSafe sections for this clinic cut to one sentence plus a link (`url_plan_done_on`) | Marketing |
| G5 Tracking | WorkSafe keywords for this clinic tracked with the target URL (`tracking_added_on`) | Marketing |
| G6 Privacy (site) | GTM excludes Meta pixels, ad and remarketing tags, session replay and chat on WorkSafe URLs; Google signals off (`review.json`) | Marketing + privacy officer |

**The pillar has its own gate:** G6 confirmed, a clinical reviewer named, every claim on it verified, and at least one clinic with G1. Every WCB mention of a clinic anywhere (finder, nearby cards, local FAQ, service lists) reads that clinic's G1. Unconfirmed clinics are not listed in publish mode. The pillar title and meta carry no clinic count.

**Services:** WCB massage and WCB acupuncture appear for a clinic only after ops confirms the clinic bills WorkSafeBC for that service (`wcb_massage_confirmed_*`, `wcb_acupuncture_confirmed_*`). Jane bookability alone is not enough.

**Wave 1 (pilot): New Westminster, Richmond, Abbotsford.**
*   New Westminster: strongest existing WorkSafe signal (organic #3/#4, Maps average 3.36), so the pilot tests whether a dedicated page adds to it. Owner decision before launch: which page owns WorkSafe intent there (Q-10 affects `/physiotherapy-in-new-west/`).
*   Richmond and Abbotsford: Synergy ranks there only with wrong-intent pages (tag archive, ICBC pages) and the SERPs are weak (research/08). They test goal G-2.

**Wave 1b (close-pair test): Newton and King George** (2.4 km apart), after Wave 1 passes its day-30 review.
**Wave 2:** remaining clinics in batches of 2 to 3 with a 30-day check each. **Wave 3:** Cedar Hills and Clayton Corners (highest eligibility risk).

**Pilot hypothesis and stop rule:** if by day 90 the Wave 1 pages are indexed but none ranks in the top 20 for its own `worksafebc/wcb physio <city>` query and Jane WCB initial bookings at those clinics show no rise against the 8 weeks before launch, stop adding location pages and fold their facts into the pillar finder.

### 5. WorkSafeBC claims policy

This section overrides the claim rules in `spec/design-system.md`.

*   Every WorkSafeBC or Synergy fact on a page carries `data-claim="<claim_id>"` and comes from `data/claims-register.csv` (or `claims-additions.csv`).
*   **Publishable** means: publish_rule is OK_TO_PUBLISH or STAFF_CONFIRM, and a staff member opened the official URL and recorded `checked_by`, `checked_on` (ISO date, not older than 180 days) and `quote_matches=yes`, and `expires_on` (if set) has not passed. DO_NOT_PUBLISH rows never publish. All rows were first verified from search snippets only, so none is publishable yet.
*   Contract and billing statements about a clinic (SYN-01 contract pill, SYN-08 "we bill WorkSafeBC on accepted claims") need that clinic's G1 plus the row check. Fee statements use WSBC-23 and, if Synergy wording is used, SYN-09.
*   **No visit counts** until WSBC-18 is confirmed. Use WSBC-21 instead.
*   **No "approved" wording.** WorkSafeBC contracts providers; it does not approve them. The build rejects "WorkSafeBC-approved" and similar.
*   The as-of line is computed: "Facts checked against worksafebc.com between <earliest> and <latest check date>. Reviewed by <name, credential>."
*   Re-check all rows quarterly and whenever WorkSafeBC publishes a physiotherapy bulletin.

### 6. Page templates

Design tokens, components and band rhythm: `spec/design-system.md` §4 to §9 and `pages/assets/worksafe.css` (all classes prefixed `sr-ws-`).

#### 6.1 Pillar `/worksafe-physiotherapy/`

*   **Title:** `WorkSafeBC & WCB Physiotherapy in BC | Synergy Rehab` (52 characters; no clinic count).
*   **H1:** `WorkSafeBC physiotherapy for work injuries`
*   **Meta description:** `Hurt at work in BC? See how WorkSafeBC (WCB) physiotherapy works at each claim stage, what you may pay, and book an assessment at a Synergy Rehab clinic.`

| # | Band | Content and claim ids |
|---|---|---|
| 1 | Hero | Breadcrumb, H1, lede (WSBC-11), "Find your clinic" primary (anchor to band 3), "How it works" secondary, area chips that jump to finder groups |
| 2 | Steps | 1 Report to employer and WorkSafeBC (WSBC-42, 43, 44). 2 Book a WCB Physio Initial Session (WSBC-10). 3 Bring your claim number (WSBC-46); contracted physios bill WorkSafeBC for the assessment (WSBC-11) |
| 3 | Clinic finder | G1 clinics only, grouped by area; Surrey group headed "WorkSafeBC physiotherapy in Surrey". Card links to the clinic's WorkSafe page if published, otherwise to its Jane WCB booking link |
| 4 | Claim stages card | Accepted (WSBC-23), pending (WSBC-12, 29, 17, 28), after 60 days (WSBC-14); first-visit checklist; link to WorkSafeBC's own reporting page |
| 5 | Conditions | Common work injuries; physiotherapy scope; no outcome promises |
| 6 | First visit | What happens at the assessment |
| 7 | Return to work | Four phases; WSBC-21; link to the RTW article only when it is live |
| 8 | Other WorkSafeBC care | Rendered only if some clinic has confirmed WCB massage or acupuncture (WSBC-35, WSBC-36) |
| 9 | FAQ | 9 questions; cost answer covers accepted, pending (SYN-PEND) and non-claim areas (WSBC-25) |
| 10 | Sources | Official WorkSafeBC links and the computed as-of line |
| 11 | Final CTA | "Find your clinic"; phone sticky bar "Find your clinic". No pillar phone button (there is no central WCB line; see Q-13 note in RUNBOOK) |

#### 6.2 Location page `/worksafe-physiotherapy/<clinic-slug>/`

*   **Title:** `WCB & WorkSafeBC Physio in <Name> | Synergy Rehab` (48 to 59 characters).
*   **H1:** `WorkSafeBC physiotherapy in <area_label>` (for example "in Newton, Surrey", "in North Delta").
*   **Meta description:** `Hurt at work? Book a WCB physio assessment at Synergy Rehab <Name>, <street>. <hours summary>.` plus "Your claim can be pending." when it fits in 155 characters. The hours summary covers all 7 days and the latest closing time.

| # | Band | Clinic-only content (source) | Shared content |
|---|---|---|---|
| 1 | Hero | Name, area, street, phone, hours summary, contract pill (G1), Jane WCB link for the clinic's confirmed type id | Lede, report-first line (WSBC-43, 44) |
| 2 | Find us | Address, phone, getting here, accessibility (sign-off sheet), full hours table, directions link | None |
| 3 | WCB care here | Physio assessment and treatment; massage or acupuncture only if confirmed | Rule line per service |
| 4 | First visit here | Check-in steps (sign-off sheet), consented clinic photo | 3 booking steps, link to pillar claim stages |
| 5 | Team | Consented profile cards (name, credential checked on the CHCPBC register, languages). Left out until consent | None |
| 6 | Local FAQ | Parking, languages, confirmed services, nearest contracted clinics | Link to the pillar FAQ |
| 7 | Nearby | Up to 4 nearest clinics with G1, distance from the ICBC location data | Link to all locations |
| 8 | Sources and CTA | As-of line, final CTA, phone sticky bar | None |

Review test (manual, alongside the measured G3): read only bands 2, 4, 5 and 6 with the clinic name and address hidden. If they could describe another clinic, the page fails.

#### 6.3 Coverage guide (refresh) and RTW article

*   Coverage guide: replace the facts with tagged claims; H2s as the measured claim questions; link to pillar and finder. Content draft delivered as a separate file for the content owner.
*   RTW article: physiotherapy view of graded return, modified duties and what to tell your physio about your job. WorkSafeBC's own return-to-work programs (Customized Recovery and Return-to-Work Program, Return to Work Support Services) are separate WorkSafeBC services that Synergy does not claim to deliver (WSBC-40). No timeline promises. Clinical sign-off required.
*   Both articles go through the same build, claim tags, verification and gates as the pillar, and carry the pillar's "Find your clinic" CTA and sticky bar.

### 7. Structured data (JSON-LD, one block per page)

*   **All pages:** `WebPage` (name, url, inLanguage en-CA, dateModified, isPartOf the site), `BreadcrumbList`. `Organization` is referenced by `@id` `https://synergyrehabilitation.ca/#organization` and declared once on the pillar with name, url, logo and telephone.
*   **Location pages:** one clinic entity, `@type` `["MedicalClinic", "Physiotherapy"]`, `@id` `https://synergyrehabilitation.ca/#clinic-<jane-slug>` (stable site-level id that any other page can reuse), `url` = the general clinic page (the GBP target) where known; the WorkSafe page's `MedicalWebPage` is `about` that entity; name `Synergy Rehab <Name>`, address, telephone, `openingHoursSpecification` from hours, `geo` only where coordinates are KNOWN (New Westminster, Newton, Abbotsford), `hasMap` only where the GBP maps URL is KNOWN, `parentOrganization` by `@id`, `medicalSpecialty` `Physiotherapy`, and `availableService` with a `MedicalTherapy` named "WorkSafeBC physiotherapy".
*   **Not used:** `AggregateRating` and `Review` (self-serving), `FAQPage` on location pages. `FAQPage` on the pillar is optional and never relied on for display.
*   Before launch: view the source of a drafted page and list every existing ld+json block from the SEO plugins; extend the plugin's `@id`s or disable plugin schema on WorkSafe URLs so entities are not declared twice.
*   Validation: Schema.org validator and Google Rich Results Test before publish.

### 8. Internal linking

| From | To | Anchor pattern |
|---|---|---|
| Sitewide menu "Worksafe" | Pillar | existing |
| Pillar finder | Every published location page | `<Name> clinic` |
| Pillar FAQ and steps | Coverage guide, RTW article | descriptive question text |
| Location page breadcrumb and band 4 | Pillar | `WorkSafeBC physiotherapy` |
| Location page nearby block | Up to 4 nearest published location pages | `<Name>, <distance> km` |
| General clinic page (existing) | Its WorkSafe page | `WorkSafeBC physiotherapy at <Name>` |
| Coverage guide, RTW article | Pillar, finder anchor | descriptive |
| WorkSafe pages | ICBC pages | **none** (scope rule) |

Jane links: plain `https://synergyrehab.janeapp.com/locations/<jane-slug>/book#/discipline/3/treatment/442`, no `_gl` strings, no `nofollow`, `rel="noopener"` only when opening a new tab (not used).

### 9. Measurement

*   **Events (GA4 via GTM click trigger on `[data-sr-event]`):** `worksafe_book_click`, `worksafe_phone_click`, `worksafe_directions_click`, `worksafe_location_select`. Parameters: `clinic_slug`, `placement` (hero, card, finder, sticky, final, faq), `page_type` (pillar, location, guide, article). No diagnosis, claim number, PHN or free text is ever sent (BC PIPA). Names will be aligned with the existing GA4 taxonomy once GA4 access exists.
*   **Bookings:** a click to Jane is not a booking. Confirmed bookings are measured only if Jane's own analytics integration is configured; otherwise the KPI is click-through.
*   **Primary measures:** Search Console page-level clicks and impressions for WorkSafe URLs and WorkSafe queries (Q-11), and weekly Jane counts of "WCB Physio Initial Session" bookings per clinic, comparing pilot clinics with the 8 weeks before launch (aggregate counts only, no patient detail).
*   **Guardrails (G-5):** compare the 14-day median position before launch with the 14-day median after; count a regression only when the ranking URL for an ICBC or generic term switches to a WorkSafe page.
*   **SE Ranking (secondary, after Q-8 approval and renewal decision):** the keyword set from research/07 §7 (about 121 pairs) in project 12903890 under a "WorkSafe" group with target URLs; ICBC and generic guardrail terms unchanged; 10 WorkSafe AI prompts.
*   **Baseline:** 14 days of tracking before launch (goal G-1's 0 of 9 is not yet measured).
*   **Cadence:** baseline before launch; day 7 technical and events; day 30 indexing, first rankings, cannibalization check; day 60 trends and conversion; day 90 goal review and Wave 2/3 decision.

### 10. WordPress delivery

*   Each page is delivered as one HTML fragment wrapped in `<div class="sr-ws-page">` for an Elementor HTML widget (or Gutenberg Custom HTML), one JSON-LD block, and the shared stylesheet `worksafe.css` enqueued only on WorkSafe URLs.
*   No new JavaScript. FAQ uses `details`/`summary`; map is a directions link; sticky bar is CSS only.
*   Known theme defects the pages inherit and that must be fixed site-wide (research/01): duplicate `rel=canonical` on 388 pages, a second meta description on 82 pages, about 3.8 MB of JavaScript per page and dead CrazyEgg/Contentsquare scripts. The pages must not add to these.

## Alternatives Considered

### Alternative A: WorkSafe sections on the existing general clinic pages instead of new URLs

*   **Pros**: No new URLs; no cannibalization between a clinic's general page and its WorkSafe page; GBP landing pages gain WorkSafe relevance.
*   **Cons**: General clinic pages are three generations of templates with conflicting titles (research/01); WorkSafe content would sit beside ICBC and private-pay content, which breaks the scope rule; competitors win with WorkSafe-specific pages (research/08 bottom line 2).
*   **Reason for Rejection**: The evidence favours a dedicated WorkSafe page per clinic, and the scope rule rules out mixed pages.

### Alternative B: Coverage guide becomes the pillar

*   **Pros**: It already ranks in 4 cities and is an AI Overview source.
*   **Cons**: It has 9 in-links and no menu link; its intent is informational; the head terms show a local pack, which needs a clinic finder.
*   **Reason for Rejection**: Kept as the coverage owner instead (D3), so its rankings are preserved and the transactional head terms go to the menu-linked pillar.

### Alternative C: City hubs (Surrey, Langley, etc.)

*   **Pros**: Mirrors some competitors.
*   **Cons**: No measurable geo demand (research/06); a Surrey hub would duplicate the pillar finder; doorway risk.
*   **Reason for Rejection**: Pillar finder owns multi-clinic city queries.

### Alternative D: Publish all 19 location pages at once from the ICBC template

*   **Pros**: Fastest coverage.
*   **Cons**: Contract status is unverified for all 19; clinic-only facts do not exist yet; the ICBC precedent shows URL rotation across near-identical pages.
*   **Reason for Rejection**: Gated waves with a 30-day pilot review.

### Alternative E: WordPress-native rendering (JetEngine listings or a plugin shortcode) instead of reviewed static fragments

*   **Pros**: Clinic data edited once in WordPress; gates checked at render time; no paste step.
*   **Cons**: Needs WordPress access this project does not have; moves claim checks into PHP; more build work before the pilot proves value.
*   **Decision**: Pilot (pillar, 3 pages, 2 articles) ships as reviewed static fragments from the gated build. Decide native rendering before Wave 2, when the page count makes paste-and-drift costly.

--------------------------------------------------------------------------------

## Risks and Mitigations

| Risk | Trigger / detection | Mitigation | Owner | Time to act |
|---|---|---|---|---|
| A clinic's contract lapses or is not renewed after its page is live | Ops notice; quarterly G1 re-check | Set the page to draft, remove from finder (rebuild pillar) | Ops + marketing | 1 business day |
| WorkSafeBC changes rules or rates | New physiotherapy bulletin; `expires_on` (2027-03-31) or 180-day check age | Re-verify rows; rebuild fails until re-checked | Clinical reviewer | 2 weeks |
| Rank tracking stops (SE Ranking Data API ends 2026-11-06) | Renewal decision missing | Primary measures are Search Console and Jane counts; renew or replace SE Ranking before launch | Marketing | Before launch |
| WordPress copy drifts from the build after paste | Manual edits | Edit only in the repo and re-paste; live-page audit once network access exists | Marketing | Each release |
| New pages split rankings with existing pages | Alternating URLs on 5 of 14 days (§2 rule 5) | Owner table decides; narrow copy or strengthen links | Marketing | 2 weeks |
| Ad or session-replay tags fire on WorkSafe pages | GTM preview on each WorkSafe URL | G6 gate; publish blocked | Marketing + privacy officer | Before launch |
| Theme defects (double canonical, double meta, heavy JS, poor INP) hurt the new pages | Rendered-HTML check after drafting | Disable one SEO emitter before launch; INP reported, not promised | Web developer | Before launch |
| Collector and public repo expose practitioner names; Jane terms | Repo visibility; Jane terms | Make repo private or remove names; confirm Jane permission (Q-12) | Owner | Immediately |

--------------------------------------------------------------------------------

## Non-Functional Requirements

*   **Security and privacy:** No patient data on pages, in URLs, in events or in build files. Practitioner names appear only with written staff consent (with a withdrawal path and a quarterly roster check). Photos only with consent. Reviews are linked, not copied. G6 keeps ad pixels, remarketing, session replay and chat off WorkSafe URLs, because a visit to these pages can suggest a work injury.
*   **Performance:** Each page adds 0 JavaScript files and one stylesheet of about 8 KB min+gzip. Hero image under 120 KB WebP with width and height set. Targets: LCP under 2.5 s, CLS under 0.1 on mobile lab tests of the fragment; INP depends on the theme's JavaScript and is reported, not promised.
*   **Accessibility:** WCAG 2.2 AA per design-system §10: brand green is never used for small text; CTA labels are navy on green; 48 px tap targets; visible focus rings.
*   **Rollout and rollback:** Pages are drafted in WordPress, previewed, then published per wave. Rollback for a location page: set to draft and remove the finder link; no redirects are created in this project. Pillar rollback: restore the previous WordPress revision.

--------------------------------------------------------------------------------

### Additional Resources

*   research/01 to 09, data/claims-register.csv, data/keyword-master.csv, data/worksafe-locations.json
*   spec/design-system.md, spec/modern-seo-cluster.md, pages/assets/worksafe.css
*   Google Search Central guidance on doorway pages and scaled content

### Future Improvements

*   **Work hardening / functional capacity pages:** `work hardening` has 480/mo but the service is unverified at Synergy (research/06 §7.3).
*   **Live WCB availability on location pages:** the existing availability widget could show WCB openings once it can filter by treatment type and its data source is approved.

--------------------------------------------------------------------------------

## Detailed Implementation Plan

Current state (commit on `claude/nice-dijkstra-9zwtkw`) plus remaining work. Paths are under `worksafe-seo/`.

### Step 1: Data (done)

1.  `build/merge_locations.py <availability.json>` writes `data/worksafe-locations.json` (machine data only). It fails if any nearby clinic name does not resolve.
2.  `data/clinic-signoff.csv`: human-owned, one row per clinic. Columns: wave, contract fields (G1), NAP sign-off (G2), url_plan_done_on (G4), tracking_added_on (G5), wcb_initial_treatment_id (default 442), clinic facts (getting_here, parking, accessibility, check_in, languages, team_json), photo URLs and consent, service confirmations, notes.
3.  `data/claims-register.csv` gains `checked_by`, `checked_on`, `quote_matches`, `expires_on`. `data/claims-additions.csv` holds rows added while drafting the articles.
4.  `data/review.json`: reviewer, live pages (pillar, guide, rtw), pillar photos and consent, G6.

### Step 2: Templates (done)

ES modules in `pages/src/`: `shared.mjs` (helpers, sources, hours summary), `pillar.mjs` (`pillarMeta`, `pillarFaq(ctx)`, `pillar(ctx)`), `location.mjs` (`locationMeta(x)`, `locationFaq(x, ctx)`, `location(x, ctx)`), `guide.mjs` and `rtw.mjs` (`meta`, `render(ctx)`). The ctx API: `claim`, `contractClaim`, `service`, `serviceClaim`, `slot`, `photo`, `pillarPhoto`, `team`, `asof`, `link`, `listInFinder`, `nearbyWcb`, `clinicCard`, `clinicAnchor`, `finderCompact`, `bookUrl`. The code is authoritative for titles and H1s; §6 mirrors it.

### Step 3: Build (done)

1.  `node build/build_pages.mjs --mode preview` writes `pages/dist/<page>/preview.html`, `meta.json`, `schema.json` and `qa-report.json`. Preview output is never pasted.
2.  `node build/build_pages.mjs --mode publish` writes `pages/publish/<page>/fragment.html` (paste source), `schema.json`, `meta.json`, `preview.html`, only for pages whose gates and claims pass; exit code 1 lists every blocker.
3.  Lints: em/en dashes, ICBC mentions, "approved" wording, title (62) and meta (160) length, one H1, "19+ locations", unknown Jane slugs, leftover placeholders; warnings for visit counts and untagged coverage wording.
4.  Tests: `node --test build/test/build_pages.test.mjs` (12 cases on temporary fixtures).

### Step 4: Previews and QA (done for pillar and Wave 1)

`node build/screenshot.mjs [dir] <page>...` captures 390x664 and 1280x900 screenshots into `previews/` and reports horizontal overflow, small tap targets and whether Book and Call are inside the first screen.

### Step 5: Rollout (staff)

1.  Week 1: site cleanup (§3), G6 in GTM, theme canonical/meta fix, Q-11 access, SE Ranking decision and 14-day baseline.
2.  Staff fill `clinic-signoff.csv` for Wave 1 and record claim checks in the register.
3.  Publish the coverage guide refresh, then set `live_pages.rtw` and publish the RTW article.
4.  Run publish mode; paste Wave 1 location pages; then rebuild and paste the pillar so the finder links to them.
5.  Post-publish checks from `RUNBOOK.md`; day-7, 30, 60, 90 reviews.

# WorkSafeBC Physiotherapy Search Program: Architecture and Page Specification

*   **Author:** Elephant (Claude Code orchestrator) for Synergy Rehabilitation marketing
*   **Status:** In Review
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
*   **Q-10 Paid landing pages:** Are `/physiotherapy-in-new-west/` and `/icbc-physiotherapy-abbotsford/` Google Ads landing pages? Affects whether they may be noindexed later.

## Critical User Journeys (CUJs)

### CUJ 1: Injured worker searches from a phone near a clinic

*   **Given**: A warehouse worker in New Westminster hurt their back yesterday, has reported it to their employer and has not called WorkSafeBC yet. They search `wcb physio near me` on a phone.
*   **When**: They tap Synergy's New Westminster WorkSafe page in organic results or reach it from the pillar.
*   **Then**: Within the first screen they see the clinic name, area, phone and a "Book a WCB initial assessment" button that opens Jane's WCB Physio Initial Session at New Westminster (treatment 442). Within one scroll they see the 3-step path (report to WorkSafeBC, book, bring your claim number) with Teleclaim 1.888.967.5377 (WSBC-44). The `worksafe_book_click` event fires with `clinic_slug=new-westminster`, `placement=hero`.

### CUJ 2: Worker with a pending claim asks whether they can start now

*   **Given**: A care aide in Abbotsford reported an injury 10 days ago. The claim is pending.
*   **When**: They search `can i see a physio before my worksafebc claim is accepted` and land on the pillar FAQ.
*   **Then**: The answer states that a contracted physiotherapist can do the initial assessment within 60 days of the injury on a pending claim without prior approval, and WorkSafeBC pays for that assessment even if the claim is later denied (WSBC-12, WSBC-29), with the official source link and the "as of" date. The page links to the Abbotsford WorkSafe page in the clinic finder.

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

*   **D1 Pillar = `/worksafe-physiotherapy/`.** It already carries the sitewide "Worksafe" menu link (352 in-links, research/01). The head terms `worksafebc physiotherapy` (140/mo) and `wcb physiotherapy` (210/mo) show a local pack (research/06), so the page that owns them must help the searcher pick a clinic. Rebuild in place; same URL; no redirect.
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
| `/physiotherapy-new-westminster/` and other general clinic pages | Keep. Replace any WorkSafe visit-count or fee sentence with one sentence plus a link to that clinic's WorkSafe page | When each clinic page launches |
| `/tag/worksafebc/` | Set `noindex, follow` after the Richmond page is live and indexed | Day 14 after Richmond launch |
| `/icbc-treatments/*`, `/icbc-physiotherapy-*` | **No change** (scope rule, G-5). New WorkSafe pages displace them for WorkSafe queries by relevance | Watch G-5 guardrails |
| `/icbc-claims/` | Recommend: remove the WorkSafe visit-count sentence (SYN-03) and link to the pillar. Owner approval needed because it is a mixed ICBC page | Owner decision |
| Homepage WorkSafe module | Replace the "10 sessions" sentence (SYN-02) with a link to the pillar | With pillar launch |
| WorkSafe blog post with "patient covers the gap" (SYN-11) | Correct the sentence: that rule applies to non-contracted providers (WSBC-26) | With pillar launch |

*   **D6 GBP website links stay on the general clinic pages.** Pointing GBP to WorkSafe pages would pull generic "physio near me" demand onto WorkSafe-only pages and conflict with the scope rule. The general clinic pages link to their WorkSafe page. Separate recommendation outside this project: New Westminster and Central City GBPs point to the homepage and should point to their clinic pages.

### 4. Clinic selection: publish gates and waves

A clinic page is published only when all five gates are true in `data/worksafe-locations.json`:

| Gate | Pass condition | Owner |
|---|---|---|
| G1 Contract | Signed April 1, 2026 agreement and vendor number confirmed for the clinic (SYN-01, Q-1) | Ops / billing |
| G2 NAP | Manager signs off name, address, unit, postal code, phone and hours (Q-6) | Clinic manager |
| G3 Distinct facts | At least 4 of these filled with verified clinic-only facts: getting here, parking, accessibility, languages, WCB team with consent, consented clinic photo, nearby workplaces served (Q-7) | Clinic manager |
| G4 URL plan | This document's §2 and §3 applied to the clinic | Marketing |
| G5 Tracking | WorkSafe keywords for this clinic tracked in SE Ranking with the target URL (Q-8) | Marketing |

**Wave 1 (pilot): New Westminster, Richmond, Abbotsford.**
*   New Westminster: strongest existing WorkSafe signal (organic #3/#4, Maps average 3.36), so the pilot tests whether a dedicated page adds to it.
*   Richmond and Abbotsford: Synergy currently ranks there only with wrong-intent pages (tag archive, ICBC pages), and the SERPs are weak (research/08). These test the "right page" goal G-2.
*   Abbotsford and New Westminster have GBP data connected in SE Ranking Local, so Maps effects can be measured.

**Wave 2:** Vancouver, Burnaby, Langley, Delta (after Q-2), Central City, Cloverdale, King George, Newton, Fleetwood, Sullivan Heights, Strawberry Hill, South Surrey, Clayton Heights, Nordel.
**Wave 3 (highest eligibility risk):** Cedar Hills, Clayton Corners. Publish only after Q-1 is answered yes.

Scale rule: Wave 2 starts only after the Wave 1 pages pass the day 30 review (indexed, no G-5 regressions, no cannibalization alarm under §2 rule 4).

### 5. WorkSafeBC claims policy

*   Every WorkSafeBC fact in page copy carries `data-claim="<claim_id>"` on its element, using ids from `data/claims-register.csv`.
*   Allowed in drafts: `OK_TO_PUBLISH` rows, and `STAFF_CONFIRM` rows marked as pending sign-off. Never: `DO_NOT_PUBLISH` rows.
*   Allowed in publish mode: `OK_TO_PUBLISH` rows, and `STAFF_CONFIRM` rows listed in `data/claims-signoff.json` with reviewer name and date.
*   All register rows were verified from search snippets, not from opened worksafebc.com pages (research/05). Before Wave 1 launch, a staff member opens each cited official URL and records the check date in `claims-signoff.json`.
*   **No visit counts** on any page until WSBC-18 is signed off. Use WSBC-21 ("your physiotherapist can ask WorkSafeBC for more treatment; WorkSafeBC decides") instead.
*   **Synergy-specific statements** (direct billing at this clinic, no fees at this clinic) depend on SYN-01 for that clinic. Their elements carry `data-claim="SYN-01"`; the build refuses publish mode if G1 is false.
*   Every page shows "Facts checked against WorkSafeBC sources as of <date>. Reviewed by <name, PT>." The build fills the date and name from `claims-signoff.json`.

### 6. Page templates

Design tokens, components and band rhythm: `spec/design-system.md` §4 to §9 and `pages/assets/worksafe.css` (all classes prefixed `sr-ws-`).

#### 6.1 Pillar `/worksafe-physiotherapy/`

*   **Title:** `WorkSafeBC Physiotherapy at 19+ Clinics | WCB Physio | Synergy Rehab` (title length checked in the build; fallback without "| WCB Physio" if over 65 characters).
*   **H1:** `WorkSafeBC physiotherapy for work injuries`
*   **Meta description:** `Hurt at work in BC? Book a WCB physiotherapy assessment at one of 19+ Synergy Rehab clinics from Vancouver to Abbotsford. How claims, visits and costs work.`

| # | Band | Content and claim ids |
|---|---|---|
| 1 | Hero | Breadcrumb, H1, one-sentence answer (WSBC-10), "Find your clinic" primary button (anchor to band 8), call button to the main line, trust tiles (19+ clinics, evening and weekend hours, WCB online booking) |
| 2 | Quick answers | 4 to 5 short answers to the measured questions: WCB vs WorkSafeBC, do I need a claim number, can I start before acceptance, will I pay anything, referral (each tagged) |
| 3 | Steps | 1 Report to employer and WorkSafeBC (WSBC-42, 43, 44, 45, 46). 2 Book at your nearest clinic. 3 Bring your claim number; we handle WorkSafeBC billing (SYN-07, SYN-08 pending G1) |
| 4 | Eligibility card | Who this is for: BC workers with a reported workplace injury; pending vs accepted claims (WSBC-11, 12, 14, 17, 29); have-ready checklist (WSBC-49 pending) |
| 5 | Conditions | Common work injuries we assess and treat: lifting and back strain, shoulder overuse, repetitive strain, sprains, slip-and-fall injuries, neck strain. Clinical wording within physiotherapy scope; no outcome promises |
| 6 | First visit | What happens at the initial assessment and what to bring |
| 7 | Return to work | Graded activity, goals tied to job demands, reports to WorkSafeBC (WSBC-21); link to RTW article |
| 8 | Clinic finder | All 19 clinics grouped: Vancouver and Burnaby, New Westminster, Richmond and Delta, Surrey (12), Langley and Abbotsford. Each card: name, area label, street, phone, "WorkSafe page" link if published, else "Book WCB assessment" Jane link |
| 9 | Other WorkSafeBC services | WCB massage (WSBC-35; clinics where Jane shows it), WCB acupuncture at Nordel (WSBC-36 pending) |
| 10 | FAQ | 8 to 10 questions from research/06 §7.6 and research/08 People Also Ask; each answer 40 to 80 words, tagged |
| 11 | Sources | Official WorkSafeBC links, "as of" line, reviewer line |
| 12 | Final CTA band | "Find your clinic" + call; sticky bar on phones |

#### 6.2 Location page `/worksafe-physiotherapy/<clinic-slug>/`

*   **Title:** `WorkSafeBC Physio <Name> | WCB Physiotherapy | Synergy Rehab`, shortened by the build to 65 characters or fewer by dropping "| WCB Physiotherapy".
*   **H1:** `WorkSafeBC physiotherapy in <area_label>` (for example "in Newton, Surrey", "in North Delta").
*   **Meta description:** `Injured at work? Book a WCB physiotherapy assessment at Synergy Rehab <Name>, <street>. Open <weekday hours summary>. Bring your WorkSafeBC claim number.`

| # | Band | Unique data (source) | Shared content (kept short; links to pillar) |
|---|---|---|---|
| 1 | Hero | Name, area label, street, phone, hours today summary, WCB initial Jane link (worksafe-locations.json) | One-sentence answer |
| 2 | Clinic card and getting here | Address, phone, full hours, directions link, staff facts: getting here, parking, accessibility | None |
| 3 | WCB services at this clinic | WCB physio initial and follow-up (all clinics), WCB massage if bookable, WCB acupuncture if bookable (Jane data, dated) | Massage referral rule (WSBC-35) |
| 4 | Your first visit here | Staff facts: check-in, languages, consented photo | 3 compact steps with link to the pillar for detail |
| 5 | WCB team | Staff-consented practitioner cards (name, credential, languages). Omitted until consent exists | None |
| 6 | Local FAQ (3 to 5) | Questions answerable only for this clinic: weekend and evening hours (from hours data), WCB massage here (Jane), parking, languages, nearest clinic if this one is full | One link to the pillar FAQ |
| 7 | Nearby clinics | Distance-sorted 4 nearest (from the ICBC location data) with links to their WorkSafe pages if published | None |
| 8 | Sources and CTA | "As of" and reviewer line; final CTA band | None |

Uniqueness test, enforced in review: remove bands 2, 4, 5 and 6. If what remains could describe any other clinic, the page fails G3 and is not published; the clinic stays as a finder card on the pillar.

#### 6.3 Coverage guide (refresh) and RTW article

*   Coverage guide: replace the facts with tagged claims; H2s as the measured claim questions; link to pillar and finder. Content draft delivered as a separate file for the content owner.
*   RTW article: physiotherapy view of graded return, modified duties and communication with employer and WorkSafeBC. No promises about timelines. Clinical sign-off required.

### 7. Structured data (JSON-LD, one block per page)

*   **All pages:** `WebPage` (name, url, inLanguage en-CA, dateModified, isPartOf the site), `BreadcrumbList`. `Organization` is referenced by `@id` `https://synergyrehabilitation.ca/#organization` and declared once on the pillar with name, url, logo and telephone.
*   **Location pages:** one clinic entity, `@type` `["MedicalClinic", "Physiotherapy"]`, `@id` `<page url>#clinic`, name `Synergy Rehab <Name>`, address, telephone, `openingHoursSpecification` from hours, `geo` only where coordinates are KNOWN (New Westminster, Newton, Abbotsford), `hasMap` only where the GBP maps URL is KNOWN, `parentOrganization` by `@id`, `medicalSpecialty` `Physiotherapy`, and `availableService` with a `MedicalTherapy` named "WorkSafeBC physiotherapy".
*   **Not used:** `AggregateRating` and `Review` (self-serving), `FAQPage` on location pages. `FAQPage` on the pillar is optional and never relied on for display.
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
*   **SE Ranking (after Q-8 approval):** the keyword set from research/07 §7 (about 121 pairs) in project 12903890 under a "WorkSafe" group with target URLs; ICBC and generic guardrail terms unchanged; 10 WorkSafe AI prompts.
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

--------------------------------------------------------------------------------

## Non-Functional Requirements

*   **Security and privacy:** No patient data on pages, in URLs, in events or in build files. Practitioner names appear only with written staff consent. Photos only with consent. Reviews are linked, not copied.
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

### Step 1: Data

1.  `build/merge_locations.py` writes `data/worksafe-locations.json` (done 2026-11-02): 19 clinics with NAP from the client-filled Yelp list, Jane slug and WCB types from the collector's public data branch, nearby clinics from the ICBC page data, GBP fields where known, `nap_conflicts`, `eligibility_risk`, empty `staff_facts`, and five `publish_gates` (G4 true, others false).
2.  Add `data/claims-signoff.json`: `{ "checked_as_of": null, "reviewer": null, "signed": { "<claim_id>": {"by": "", "date": ""} } }`.
3.  Add `data/staff-questionnaire.csv`: one row per clinic with the Q-6 and Q-7 fields, for clinic managers to fill.

### Step 2: Content source files

1.  `pages/src/pillar.html`: hand-written pillar body using design-system components, with `data-claim` on every WorkSafeBC fact and `{{finder}}` placeholder.
2.  `pages/src/location.template.html`: location body with `{{...}}` slots for every field in §6.2 and conditional blocks for massage, acupuncture, team and staff facts.
3.  `pages/src/coverage-guide.html` and `pages/src/return-to-work.html`: article bodies.

### Step 3: Build script `build/build_pages.mjs` (Node 22, no dependencies)

1.  Reads `worksafe-locations.json`, `claims-register.csv`, `claims-signoff.json` and the source files.
2.  Modes: `--mode preview` renders every page, shows pending claims and empty staff slots as visible "STAFF TO CONFIRM" boxes; `--mode publish` renders only clinics with all gates true and fails on any `DO_NOT_PUBLISH` claim, any unsigned `STAFF_CONFIRM` claim, any empty required slot or any em dash.
3.  Writes for each page: `pages/dist/<page>/fragment.html` (paste into WordPress), `pages/dist/<page>/schema.json`, `pages/dist/<page>/meta.json` (title, meta description, canonical, H1), and `pages/dist/<page>/preview.html` (standalone preview with the stylesheet and a mock header).
4.  Writes `pages/dist/qa-report.json`: per page title length, meta length, H1, word count, claim ids used and their status, links (internal, Jane), unique-text ratio versus the other location pages.

### Step 4: Previews and QA

1.  `build/screenshot.mjs` (Playwright, pre-installed Chromium) captures each preview at 390 px and 1280 px into `previews/`.
2.  QA checks: no horizontal scroll at 320/390/768/1280; every Jane link matches the clinic's `jane.slug`; every `tel:` matches the clinic phone; JSON-LD parses; no em dashes; "19+ locations" wording; unique-text ratio of location pages reported.

### Step 5: Hand-off package

1.  `worksafe-seo/RUNBOOK.md`: WordPress steps (create pages as drafts, paste fragment, add JSON-LD, set title/meta in the SEO plugin, enqueue CSS on WorkSafe pages, GTM triggers), existing-URL changes from §3, and the post-publish checks (live URL 200, canonical, rendered meta, schema validation, events firing in GA4 DebugView, sitemap inclusion, GSC URL Inspection).
2.  `worksafe-seo/REPORT.md`: executive summary, deliverables list, 10 next actions.

# 05 - WorkSafeBC physiotherapy rules (2026) and Synergy's contract status

Researcher: WorkSafeBC Policy Researcher. Research date: 2026-11-02.
Machine-readable output: `worksafe-seo/data/claims-register.csv` (67 claims: 26 VERIFIED, 31 PARTIAL, 7 CONFLICT, 3 UNVERIFIED; 22 OK_TO_PUBLISH, 25 STAFF_CONFIRM, 20 DO_NOT_PUBLISH).
Scope rule: WorkSafeBC only. ICBC is mentioned only where Synergy copy mixes the two.

## 0. How to read this file

| Label | Meaning in this file |
|---|---|
| KNOWN | The WebSearch result put the official page's own words in quotation marks (a snippet quote). The page itself could not be opened, so context and page date are still unconfirmed |
| LIKELY | A WebSearch summary in the tool's own words, with no quote from the official page |
| UNKNOWN | No source found |
| ASSUMPTION | My inference, labelled as such |

Claims-register status: **VERIFIED** = KNOWN quote, no conflicting official source. **PARTIAL** = LIKELY, or KNOWN but with a caveat (version or scope unclear). **CONFLICT** = contradicted by an official source, or official sources disagree. **UNVERIFIED** = no official source found.

### Method and limits
- **Direct fetch blocked.** `WebFetch https://www.worksafebc.com/en/health-care-providers/provider-types/physiotherapists/musculoskeletal-physiotherapy-services` returned `getaddrinfo ENOTFOUND www.worksafebc.com` (host not in the session's allowed network domains). I did not retry. Fix: add `www.worksafebc.com` and `worksafebc.com` to the environment's allowed domains, then re-run section 9.
- **Tool used:** WebSearch only. About 50 queries in total: about 42 with `allowed_domains: ["worksafebc.com"]` (most in `extended` mode), plus 8 normal searches for news, bcphysio.org, synergyrehabilitation.ca, synergyrehab.janeapp.com and medimap.ca. No SE Ranking units used. No external system changed.
- **Date caveat:** WebSearch shows the age of each cached page, and some ages don't match the page content (for example, the benefits page shows "~738 days" but lists an April 1, 2026 rate). For dates I relied on dates printed in the documents themselves (bulletin date, form revision R26/04, manual "February 2026").
- **No patient data** was opened or recorded.

---

## 1. Bottom line (for the page builders)

1. **The contract changed on April 1, 2026 (KNOWN).** WorkSafeBC launched a new **Physiotherapy Services Agreement** (the reference manual calls it the *Physiotherapy Services Memorandum of Agreement* and schedules), with a new fee schedule, a February 2026 reference manual and new report forms. The previous contract **expired March 14, 2026**. Services up to March 31, 2026 fall under the old terms.
2. **Synergy's 2026 contract status is UNKNOWN.** Synergy Rehab clinics appear on WorkSafeBC's physiotherapy and EAPP provider lists (LIKELY). But every indexed copy of those lists is roughly 16 to 23 months old, which is **before** the April 2026 agreement. WorkSafeBC sent incumbents the new agreement "for review and consideration" (KNOWN), so being contracted in 2025 does not prove being contracted now. **Staff must confirm the signed 2026 agreement, and the WorkSafeBC vendor/payee number, for each of the 19 clinics before any page says "WorkSafeBC-contracted".** (Claim SYN-01.)
3. **Visit numbers changed (KNOWN, but WorkSafeBC's own site is inconsistent).** The February 2026 manual says the treatment period is **up to 10 visits or 5 calendar weeks, whichever comes first**. Physio treatment visits and kinesiology/PT support worker sessions count together. Older WorkSafeBC documents still say **15 visits / 6 weeks**. Synergy publishes **both** numbers. The 15/6 copy must come down. The 10/5 copy needs rewording, plus staff confirmation against the signed agreement.
4. **Direct access is real, but it's tied to a 60-day window and a claim (KNOWN).** On a **pending or accepted** claim, a contracted physio can do the initial assessment without WorkSafeBC pre-approval if it's within **60 days of the injury** (or of claim-related surgery). WorkSafeBC pays for that assessment even if the claim is later denied. After 60 days, WorkSafeBC must pre-approve treatment. Coverage doesn't simply end. Synergy's "eligible within 60 days" line misstates this.
5. **No top-ups on accepted claims (KNOWN).** "Once we accept your claim, your health care provider should bill us … You should not have to pay any fees." The agreement bars contractors from charging injured workers "any fees or other charges of any nature" except as the agreement permits. The quote may come from the expired contract text, so it is PARTIAL. Before acceptance, the clinic may charge the worker for treatment visits and refund them if the claim is accepted.

---

## 2. Q1: What changed in WorkSafeBC's MSK physiotherapy contracting in 2026?

| # | Fact | Label | Source (URL) | Date | Exact wording (snippet) |
|---|---|---|---|---|---|
| 1.1 | New agreement launched April 1, 2026, with an agreement, fee schedule and reference manual posted | KNOWN | [Bulletin 2026-28](https://www.worksafebc.com/resources/health-care-providers/bulletins/2026-28-new-physiotherapy-services-agreement-resources-now-available?lang=en&direct=) | 2026-03-26 | "The WorkSafeBC website has been updated, and the following documents related to the April 1, 2026 services agreement launch are now available." |
| 1.2 | Incumbent clinics received the new agreement to review | KNOWN | Bulletin 2026-28 (same URL) | 2026-03-26 | "All current physiotherapy providers have now received their copy of the new Physiotherapy Services Agreement for review and consideration." |
| 1.3 | Transition: old contract expired March 14, 2026; services on or before March 31, 2026 fall under the old contract | KNOWN | [Physiotherapy Services Agreement](https://www.worksafebc.com/en/resources/health-care-providers/guides/physiotherapy-services-agreement) (published 2026-03-23 per search metadata) | 2026-03-23 | "…any Services provided on or before March 31, 2026 will be subject to and governed by the terms of the applicable physiotherapy services contract that expired March 14, 2026." |
| 1.4 | Agreement name: "Physiotherapy Services Agreement"; the manual calls it the "Physiotherapy Services Memorandum of Agreement" and schedules, effective April 1, 2026 | LIKELY | [Reference Manual](https://www.worksafebc.com/resources/health-care-providers/guides/physiotherapy-services-reference-manual?lang=en&direct=) | Feb 2026 | (summary) |
| 1.5 | New contract number | **Not Available** | The agreement document that surfaced shows **Contract 89088**, with a blank effective date and a term ending March 14, 2026, so it looks like the expired template (LIKELY) | | |
| 1.6 | New forms: 83D555 (R26/04) Initial Report; 83D665 (R26/04) combined Treatment Report replaces Extension Request (83D219) and Discharge reports; old templates retired after April 1, 2026 | KNOWN | Bulletin 2026-28; [83D665](https://www.worksafebc.com/resources/health-care-providers/forms/physiotherapy-treatment-report-83d665?lang=en&direct=); [83D555](https://www.worksafebc.com/resources/health-care-providers/forms/physiotherapy-treatment-postsurgical-initial-report-form-83d555?lang=en&direct=) | 2026-03-26 / R26/04 | "Please transition to these versions before April 1, 2026, after which old templates should no longer be used" |
| 1.7 | Kinesiologist (KIN) and PT support worker (PTSW) **support sessions** are now part of the treatment period. Each is at least 45 minutes, with at least 30 minutes one-on-one. The PT stays responsible and must document the need | KNOWN (quotes) | Reference Manual | Feb 2026 | "these will count towards the injured worker's allocated treatment visits within the Treatment Period"; "Each Support Session must be at least 45 minutes, with 30 minutes spent 1:1." |
| 1.8 | Fee schedule for April 1, 2026 to March 31, 2027 (CPI after that): initial assessment $196; treatment visit (19102) $95; KIN session (19107) $70; PTSW session (19108) $65; complex fee (19109) $115, max 4 per claim | LIKELY (garbled table in summary) | [Physiotherapy Fee Schedule](https://www.worksafebc.com/resources/health-care-providers/guides/standard-and-post-surgical-physiotherapy-fee-schedules?lang=en&direct=) | published 2026-03-31 (metadata) | "Invoiced when an Injured Worker receives in clinic treatment for a visit in the Physiotherapy Treatment Period or an Extension." |
| 1.9 | Bulletin 2026-29 "Key clarifications and answers to FAQs": Complex Fee only for PT-delivered visits; Clinical Administrative Fee once per claim | LIKELY (normal-search snippet) | [Bulletin 2026-29](https://www.worksafebc.com/en/resources/health-care-providers/bulletins/2026-29-key-clarifications-and-answers-to-faqs-regarding-the-new-physiotherapy-services-agreement?lang=en&direct); [Key Clarifications FAQ](https://www.worksafebc.com/en/resources/health-care-providers/guides/physiotherapy-services-agreement-key-clarifications-faq?lang=en&direct) (2026-03-23) | 2026-03-30 | "The Complex Fee can only be invoiced for treatment visits provided directly by a Physical Therapist. It cannot be provided by a KIN or PTSW." |
| 1.10 | New clinics apply with Vendor Application Form 19D210 (R26/04, physio + EAPP), sent by email to procurement@worksafebc.com, one form per legal entity | KNOWN | [Become a provider](https://www.worksafebc.com/en/health-care-providers/provider-types/physiotherapists/musculoskeletal-physiotherapy-services/become-provider); [19D210](https://worksafebc.com/en/resources/health-care-providers/forms/vendor-application-form-physiotherapy-services-eapp-19d210?direct=&lang=en) | R26/04 | "It is WorkSafeBC's intention to award contracts to clinics that meet the application requirements." |
| 1.11 | Did incumbents have to re-apply, and is there a grace period? | **UNKNOWN** | No source found. The 2022 contract let current holders skip a new application ([PABC 2022](https://bcphysio.org/news-and-publications/pabc-news/new-worksafebc-contract), LIKELY, outdated) | | |
| 1.12 | Industry: PABC negotiated changes and expects further changes in the next agreement | LIKELY | [bcphysio.org notice](https://bcphysio.org/advocacy/important-update-on-worksafe-service-agreement-discussions-notice-of-webinar/) | undated | "after several months of negotiations, PABC and WorkSafe are addressing important changes to the Physiotherapy Service Agreement" |
| 1.13 | News coverage of the 2026 change | **Not Available** | Normal WebSearch found no news articles, only WorkSafeBC and PABC pages | | |

Related 2026 change (not physio, but it affects Synergy's multidisciplinary copy): the **chiropractic** agreement moved to individual chiropractor contracts on **January 1, 2026**. All chiropractors must apply, including those under the old agreement (LIKELY, [Chiropractors page](https://www.worksafebc.com/en/health-care-providers/provider-types/chiropractors)). An older "Becoming a provider" page still says no contract is needed (outdated).

## 3. Q2: Direct access, pending claims and the 60-day window

| # | Fact | Label | Source | Exact wording |
|---|---|---|---|---|
| 2.1 | Workers go straight to a contracted physio and say the injury is work-related | KNOWN | [Health care benefits](https://www.worksafebc.com/en/claims/benefits-services/health-care-benefits) | "If you need physiotherapy, you should visit one of the service providers who have a contract with us in your region. Be sure to explain that your injury is work-related." |
| 2.2 | Initial assessment possible before claim acceptance; the clinic bills WorkSafeBC | KNOWN | Health care benefits | "By choosing one of our contracted physiotherapists, you can get an initial assessment even before we accept your claim. They will bill us directly for this assessment." |
| 2.3 | 60-day window for the initial assessment without pre-approval, on a pending or accepted claim | KNOWN | [MSK provider page](https://www.worksafebc.com/en/health-care-providers/provider-types/physiotherapists/musculoskeletal-physiotherapy-services); Reference Manual (Feb 2026) | "You can perform an initial assessment within 60 days of the injury for any worker who has an accepted or pending claim with us." / Manual: "…allowed on a pending or accepted claim without prior approval from the claim owner provided the assessment occurs within 60 days of the date of injury or the date of claim-related surgery." |
| 2.4 | After 60 days, pre-approval is required (coverage doesn't end) | KNOWN | Reference Manual | "If the injured worker starts treatment more than 60 calendar days after the date of injury, pre-approval is required before providing services." |
| 2.5 | Treatment period (funded visits after the assessment) needs an accepted claim | KNOWN (agreement version uncertain) | Physiotherapy Services Agreement | "the Physiotherapy Treatment Period cannot commence before the Injured Worker's claim is accepted by WorkSafeBC." |
| 2.6 | Treatment period may start without prior approval within 30 days of the initial assessment or 60 days of the injury | LIKELY | Reference Manual | (summary) |
| 2.7 | A doctor's referral is required for physio | **No such requirement found** (LIKELY not required) | The benefits page states a referral is required for **massage** and not required for chiropractic, acupuncture and naturopathy (summary). For physio it only says "visit … a contract[ed provider]" | No explicit "no referral" quote for physio was found. Publish the 2.1 wording, not an absolute claim |
| 2.8 | Does the worker need a claim before the first visit? | LIKELY yes, at least a pending claim | 2.3 wording "worker who has an accepted or pending claim" | ASSUMPTION: "pending" means the injury has already been reported to WorkSafeBC |

## 4. Q3: How many visits are pre-authorized, and how do extensions work?

| # | Fact | Label | Source | Exact wording |
|---|---|---|---|---|
| 3.1 | **2026 treatment period: up to 10 combined visits (PT + KIN/PTSW) or 5 calendar weeks, whichever comes first, unless the officer directs fewer** | KNOWN quote, PARTIAL overall | Reference Manual (Feb 2026) | "Includes up to 10 visits (PT Treatment and/or PTSW/KIN Support Sessions) or five calendar weeks of treatments, whichever is reached earlier, unless a WorkSafeBC officer directs fewer treatments are indicated." Table: "Treatment Period 10 visits 5 weeks" |
| 3.2 | Standard extension: up to 8 visits or 4 weeks. Extended extension: up to 16 visits or 8 weeks for certain listed injuries | KNOWN quote | Reference Manual | "Standard Extension: 8 visits, 4 weeks; Extended Extension: 16 visits, 8 weeks." |
| 3.3 | An extension needs WorkSafeBC approval **before** it starts. WorkSafeBC decides | KNOWN | Reference Manual; Agreement | "WorkSafeBC officer approval is required, prior to starting an extension." / "WorkSafeBC has the right in its sole discretion to approve or decline a request for an Extension." |
| 3.4 | Extension request timing: at least 7 days before the period ends, no earlier than the third calendar week, on the 83D665 Treatment Report | LIKELY | Reference Manual; Agreement; Bulletin 2026-28 | "…at least seven days before the Physiotherapy Treatment Period or the then current Extension ends, but no earlier than the third calendar week." (agreement wording, version uncertain) |
| 3.5 | One visit per day per claim; no KIN/PTSW session on the same day as a PT treatment visit | KNOWN | Reference Manual | "A KIN/PTSW session cannot be billed on the same day as a PT Treatment Visit for the same claim." |
| 3.6 | **Conflicting official figure: 15 visits / 6 weeks** | CONFLICT | [Agreement (Contract 89088)](https://www.worksafebc.com/resources/health-care-providers/guides/physiotherapy-services-agreement?lang=en&direct=); [2022 billing guide](https://www.worksafebc.com/~/media/2DE6FD3941FC414FAC020AB0849EDDFE.ashx?dt=202212071004); [flowchart](https://www.worksafebc.com/resources/health-care-providers/guides/physiotherapy-services-flowchart?lang=en&direct=); [invoicing page](https://www.worksafebc.com/en/resources/health-care-providers/guides/invoicing-infographic-hcs?lang=en&direct) | "The Contractor shall provide up to 15 visits or six calendar weeks of treatments…"; "A treatment period consists of 15 visits or 6 weeks of treatment, whichever occurs first." |

**Reading (ASSUMPTION):** 10/5 is the April 2026 rule. 15/6 comes from the contract that expired March 14, 2026, and from guides WorkSafeBC has not yet updated. One search summary said the invoicing page had been indexed about 4 weeks ago with 15/6, so WorkSafeBC's site is still inconsistent. Until staff confirm against the signed 2026 agreement (Schedule A, the services schedule), use "up to 10 visits or 5 weeks, whichever comes first" only after sign-off, or leave the number out ("WorkSafeBC approves a set block of visits; your physio can request more").

## 5. Q4 and Q5: Direct billing, user fees, and denied claims

| # | Fact | Label | Source | Exact wording |
|---|---|---|---|---|
| 4.1 | Accepted claim: the provider bills WorkSafeBC and the worker pays no fees | KNOWN | Health care benefits | "Once we accept your claim, your health care provider should bill us for any services related to your claim. You should not have to pay any fees." |
| 4.2 | Contractors may not charge workers extra | KNOWN quote, PARTIAL (version) | Agreement | "The Contractor shall not charge directly or indirectly any fees or other charges of any nature for Services provided under this Agreement to the Injured Worker or to any other individual, business or other entity, except as expressly permitted in this Agreement." |
| 4.3 | No charge to the worker for basic clinic or non-durable supplies; hydrotherapy fees include pool admission | LIKELY | Reference Manual | (summary) |
| 4.4 | Non-claim body areas can be charged to the worker | KNOWN for massage only | [Massage billing guide](https://www.worksafebc.com/resources/health-care-providers/guides/how-to-guide-for-massage-therapists?lang=en&direct=) | "the injured worker is responsible for the payment for treatment for nonclaim related areas." |
| 4.5 | Non-contracted physio: the worker pays and is reimbursed **$95/visit (from April 1, 2026)**; the worker pays the difference | KNOWN | Health care benefits | "If you choose a physiotherapist who is not contracted with us, you will have to pay for your visit. You can then seek reimbursement from us. Please keep in mind that we will reimburse you at established rates and you will be responsible for any difference." / "Physiotherapy \| $95 per visit (effective April 1, 2026)" |
| 5.1 | Before acceptance, the worker may be asked to pay and can ask for a refund if the claim is accepted | KNOWN | Health care benefits | "If you get medical treatments (e.g., physiotherapy) related to your claim before it's accepted, you may be asked to pay the provider directly. If your claim is later accepted, you can contact your treatment provider to request reimbursement." |
| 5.2 | **Denied claim: WorkSafeBC still pays for the initial assessment** | KNOWN | Reference Manual | "If the claim is pending at the time of the Initial Assessment, you can bill the Initial Assessment fee code, which will be paid even if the claim is subsequently disallowed." |
| 5.3 | Denied claim: WorkSafeBC does not pay for treatment given while pending. The clinic chooses whether to collect from the worker or wait | KNOWN | Reference Manual | "it's up to you how payment is collected (i.e., directly from the injured worker or waiting until a claim decision is made before continuing to treat)"; "if the claim is subsequently disallowed, we will not pay for treatment provided during this pending time." |
| 5.4 | Accepted within 60 days of the assessment: the clinic refunds the worker in full and bills WorkSafeBC. Otherwise WorkSafeBC reimburses the worker. 90-day invoicing window | LIKELY | Reference Manual; Agreement | (summary) |
| 5.5 | EAPP denied/suspended claim: assessment covered; more treatment is the employer's responsibility | KNOWN | [EAPP employer page](https://www.worksafebc.com/en/claims/return-to-work/employers-return-to-work-information/early-access-to-physiotherapy) | "…the initial assessment will be covered by WorkSafeBC but any additional treatments will be the responsibility of the employer." |

**Staff decision needed:** Synergy's policy for treatment visits while a claim is pending (charge privately and refund, or wait for the decision). The official rule allows either. The page must state which one Synergy uses.

## 6. Q6: Finding a contracted provider, and Synergy on WorkSafeBC lists

- WorkSafeBC publishes **regional lists** of "musculoskeletal physiotherapy providers who are contracted with WorkSafeBC" (KNOWN). The list header reads "WorkSafeBC Authorized Physiotherapy Providers List". Regions found: Metro Vancouver, Fraser Valley, Northern BC, Eastern BC, Vancouver Island & Gulf Islands, plus Interior/Okanagan for EAPP. Separate lists exist for EAPP, concussion/vestibular (CVPT), chiropractic, hand therapy and RTWSS (KNOWN titles).
  - Metro Vancouver: https://www.worksafebc.com/resources/health-care-providers/guides/physiotherapy-provider-list/metro-vancouver?lang=en&direct=
  - Fraser Valley: https://www.worksafebc.com/resources/health-care-providers/guides/physiotherapy-provider-list/fraser-valley?lang=en&direct=
  - EAPP Metro Vancouver: https://www.worksafebc.com/resources/health-care-providers/guides/eapp-provider-list/metro-vancouver?lang=en&direct=
- The task's target URL `…/musculoskeletal-physiotherapy-services/contracted-musculoskeletal-physiotherapy-provider-lists` **did not surface** in any search. A variant `https://www.worksafebc.com/sitecore/content/home/health-care-providers/provider-types/physiotherapists/contracted-physiotherapy-provider-lists` did (UNKNOWN whether it is live).
- **List currency:** the indexed copies are about 16 to 23 months old (one ashx copy has `dt=202412170553`, i.e. 2024-12-17), so they **predate the April 2026 agreement**. No 2026-dated physio list was found. One summary mentioned an EAPP document dated May 6, 2026 (LIKELY, unconfirmed).

### Synergy clinics on cached WorkSafeBC lists (all LIKELY; snippet rows quoted by WebSearch summaries)

| Clinic | Synergy address (repo/GBP) | WorkSafeBC list row found | List(s) | Matches Synergy NAP? | 2026 contract |
|---|---|---|---|---|---|
| Vancouver | 3609 W 16th Ave | "Synergy Rehabilitation 3609 W 16th Avenue 236.885.8280" | Metro Van physio | **Phone differs** (site (604) 416-2600) | UNKNOWN |
| Burnaby | #201 4695 Canada Way | "Synergy Rehab 201 - 4695 Canada Way 604.558.8873" | Physio, chiro | Yes | UNKNOWN |
| New Westminster | #405 301 E Columbia St (GBP) | "Synergy Rehab 202 - 301 E Columbia Street 604.553.3303" | Physio (chiro list shows 604.533.3303, likely a typo) | **Unit differs** (202 vs 405) | UNKNOWN |
| Richmond | #8060 11688 Steveston Hwy | "Synergy Rehab 8060 - 11688 Steveston Highway 604.284.5113" | Physio | Yes | UNKNOWN |
| Delta | #103 10757 Delsom Cres | "Synergy Rehab 103 - 10757 Delsom Crescent 604.516.8505" | Physio, EAPP (older EAPP shows 604.503.9033) | Yes (current list) | UNKNOWN |
| Nordel | #116 12565 88 Ave | "Synergy Rehab 116 - 12565 88 Avenue 604.503.1688" | Physio, EAPP | Yes | UNKNOWN |
| Cedar Hills | #120 12852 96 Ave | **Not found** on the physio list. One summary lists Cedar Hills on EAPP | EAPP (LIKELY) | n/a | UNKNOWN |
| Strawberry Hill | #206 12422 72 Ave | "Synergy Rehab 206 - 12422 72 Avenue 604.547.0670" | Physio, EAPP | Yes | UNKNOWN |
| Newton 72 Ave (Amson) | #101 14468 72 Ave | "Synergy Rehab 101 - 14468 72 Avenue 604.547.3761" | Physio, EAPP; some lists file it under Richmond (error) | Yes | UNKNOWN |
| Sullivan Heights | #106 15325 56 Ave | Synergy Rehab 106 - 15325 56 Ave, 604.566.8773 | Physio/EAPP, labelled "Strawberry Hill" in one list and "Sullivan" in another | Yes (label inconsistent) | UNKNOWN |
| King George | #101 8056 King George Blvd | "Synergy Rehab 101 - 8056 King George Boulevard 604.503.9033" | Physio, EAPP | Yes | UNKNOWN |
| Central City | #120 13655 Fraser Hwy | "Synergy Rehabilitation King George Hub 120 – 13655 Fraser Highway 604.653.7411" (older Metro Van doc); newer list said to show 604.954.1475. A later address-specific search found no match | Older Metro Van list | **Name and phone differ** | UNKNOWN |
| Fleetwood | #103 8585 160 St | "Synergy Rehab Fleetwood 103 – 8585 160 Street 604.503.4799" | Physio/EAPP | Yes | UNKNOWN |
| Cloverdale | #102 5645 177B St | "Synergy Rehab Cloverdale 102 – 5645 177B Street 604.579.1367" | Physio/EAPP | Yes | UNKNOWN |
| Clayton Corners | #110 18811 72 Ave | **Not found** on any list | none | n/a | UNKNOWN (ASSUMPTION: newer clinic, added after the cached lists) |
| Clayton Heights | #105B 19161 Fraser Hwy | "Synergy Rehab 105B - 19161 Fraser Highway 604.547.2860" | Physio (2024) | Yes (another doc shows a second phone) | UNKNOWN |
| South Surrey | #106 2388 156 St | Synergy Rehab 106 - 2388 156 St, 604.385.5855 | Physio/EAPP | Yes | UNKNOWN |
| Langley | A130 8045 204 St | "Synergy A130 - 8045 204 Street 604.371.1988" | EAPP, chiro; main physio list LIKELY | Yes | UNKNOWN |
| Abbotsford | #100 3720 Townline Rd | "Synergy Rehab 100 - 3720 Townline Road 604.776.5700" | Fraser Valley physio, EAPP FV | Yes | UNKNOWN |

Not Synergy Rehab (ASSUMPTION): "Synergy Health Clinic, 2233 Kingsway, 604.564.2080" appears under Vancouver. Don't cite it as a Synergy listing.
Synergy is not on the Return to Work Support Services provider list (LIKELY: that list showed Back in Motion and CBI, no Synergy).

**Implication for location pages (ASSUMPTION):** only clinics that staff confirm as contracted under the 2026 agreement should get WorkSafeBC location pages. Clayton Corners and Cedar Hills need extra confirmation. The Jane "WCB Physio Initial Session" type at all 19 clinics (research/04, KNOWN) shows operational intent, not contract status.

## 7. Q7: Other WorkSafeBC services that matter to a multidisciplinary clinic

| Service | Official rule found | Label | Source | Synergy relevance |
|---|---|---|---|---|
| Massage therapy | Doctor's referral **required** and accepted claim; "initial assessment and up to six treatments within the first eight weeks from the date of injury without pre-approval"; extension request by end of the sixth week; one treatment per day | KNOWN | [Massage therapists](https://www.worksafebc.com/en/health-care-providers/provider-types/massage-therapists) | 9 clinics show "WCB Massage Subsequent Session" in Jane (KNOWN, research/04). RMT WorkSafeBC status UNKNOWN. Never say "no referral" for WorkSafe massage |
| Acupuncture | Accepted claim; "clinically indicated for the accepted injury and there is a focus on active rehabilitation and return to work"; no prior approval; up to 8 visits in 8 weeks, then Board Officer approval; one initial visit per claim | KNOWN (first part) / LIKELY (8/8) | [Acupuncturists](https://www.worksafebc.com/en/health-care-providers/provider-types/acupuncturists); [Acupuncture fee schedule Feb 1, 2026](https://www.worksafebc.com/resources/health-care-providers/guides/acupuncture-fee-schedule?lang=en&direct=) | Nordel offers WCB Acupuncture types (KNOWN) |
| Chiropractic | No referral (LIKELY); **individual contracts since Jan 1, 2026** (LIKELY) | LIKELY | [Chiropractors](https://www.worksafebc.com/en/health-care-providers/provider-types/chiropractors) | No WCB chiro type in Jane (KNOWN). Do not advertise WorkSafe chiro |
| Kinesiology | No stand-alone worker-booked benefit found. KIN **support sessions inside the physio treatment period** from April 1, 2026 (KNOWN quotes). Kinesiologists also staff CRRTW and RTWSS programs | KNOWN / LIKELY | Reference Manual; [RTWSS](https://www.worksafebc.com/en/health-care-providers/rehabilitation/return-work-support) | Mention only as "your physio may include kinesiology sessions in your WorkSafeBC plan", after staff confirm Synergy uses them |
| Occupational rehab | OR1, OR2 and ASTD consolidated into the **Customized Recovery and Return-to-Work Program** from **Nov 1, 2024**; OR1 remains only in rural/remote communities | LIKELY | [Announcement Oct 2024](https://www.worksafebc.com/en/about-us/news-events/announcements/2024/October/new-customized-recovery-rtw-program-launches-nov-1) | Synergy bios still say "OR1 & OR2" (outdated). Don't imply Synergy runs these programs |
| Return to Work Support Services | Workplace-based (job site visits, RTW planning, job demands analysis) by a PT, OT or kinesiologist; approved provider list | LIKELY | RTWSS page and [providers](https://www.worksafebc.com/en/health-care-providers/rehabilitation/return-work-support/service-providers) | Synergy not listed (LIKELY) |
| EAPP | Employer-arranged with a pre-approved EAPP clinic. Worker criteria: an employee, a recent soft-tissue injury from a specific incident, reported within 72 hours, claim established | KNOWN | EAPP employer page | Synergy appears on EAPP lists (LIKELY). Possible employer section, after staff confirm |
| Reimbursement if the provider doesn't bill WorkSafeBC (chiro/massage/acupuncture) | $72 per visit from Jan 1, 2026 | LIKELY | Health care benefits | Not needed on Synergy pages |
| Concurrent care | One therapy type at a time / no concurrent treatment for the same injury | LIKELY | [Your Claim: Helpful Information](https://worksafebc.com/en/resources/about-us/guides/your-claim-helpful-information?direct=&lang=en) | Staff confirm before cross-selling massage or acupuncture alongside physio on one claim |

## 8. Q8: Steps after a workplace injury (verified wording and numbers)

| Step | Official wording | Label | Source |
|---|---|---|---|
| 1. Safety and first aid; tell your employer | "let your employer know about your injury as soon as it is safe to do so" | KNOWN | [How workers report](https://www.worksafebc.com/en/claims/report-workplace-injury-illness/how-workers-report-workplace-injury-illness) |
| 2. Tell the health provider it is work-related | "If you receive medical attention, tell whoever treats you that the injury happened at work." | KNOWN | same |
| 3. Report to WorkSafeBC online | "You can report your injury online 24 hours a day, 7 days a week." Recommended for a physical injury from a single incident | KNOWN | same |
| 3b. Or by phone (Teleclaim) | "Claims Call Centre / Teleclaim Phone: 604.231.8888 Toll-free: 1.888.967.5377"; hours "Monday - Friday 8:00 a.m. - 6:00 p.m." | KNOWN | [CM096 info sheet](https://www.worksafebc.com/resources/claims/information-sheet/making-worksafebc-claim?lang=en&direct=); [Contact us](https://contactus.online.worksafebc.com/) |
| Deadline | "You do have up to one year from the date you were injured to report it to us." | KNOWN | How workers report |
| Claim number | "an 8-digit number that you'll get by mail once we receive your injury report" | KNOWN | same |
| Employer duty | Report within 72 hours if the worker missed time or needed care beyond first aid | LIKELY | [How employers report](https://www.worksafebc.com/en/claims/report-workplace-injury-illness/how-employers-report-workplace-injury-illness) |
| Paper Form 6 | Retired; report online or by phone | LIKELY | [Form 6 page](https://www.worksafebc.com/en/resources/claims/forms/application-for-compensation-and-report-of-injury-or-occupational-disease-form-6) |
| Worker's notice to employer | Form 6A, current revision R26/07 | KNOWN (title) | [Form 6A](https://www.worksafebc.com/en/resources/claims/forms/workers-report-of-injury-or-occupational-disease-to-employer-form-6a?lang=en&direct=) |

The task's number 1-888-967-5377 is correct (KNOWN). Use WorkSafeBC's own dotted format: 1.888.967.5377 and 604.231.8888.

## 9. Synergy statements that conflict with current official rules

Full list: SYN-01 to SYN-18 in the claims register. Synergy-side text comes from research/02 (SE Ranking crawl + WebSearch) and this session's WebSearch of synergyrehabilitation.ca, synergyrehab.janeapp.com and medimap.ca.

| Claim | Where | Problem | Action |
|---|---|---|---|
| "15 sessions are scheduled over 6 weeks" / "up to 15 upfront physio sessions" | /icbc-claims/ (KNOWN), 2023 graphic (KNOWN), King George and Delta location pages (LIKELY) | **CONFLICT**: pre-April-2026 figure | Remove |
| "10 sessions are scheduled over 5 weeks" / "pre-authorized allowance of 10" | /worksafe-physiotherapy/, homepage (LIKELY) | PARTIAL: right number, wrong framing (it's a cap: "up to … whichever comes first"; the officer may direct fewer; KIN/PTSW sessions count; accepted claims only) | Rewrite after staff confirm |
| "there is no single fixed number published for every claim" | WorkSafe blog (SUMMARY) | Contradicts the site's own 10/5 copy; the manual does publish an allocation | Harmonize |
| "Approved claims are eligible for treatment within 60 days of your injury" | /icbc-claims/ (KNOWN), /worksafe-physiotherapy/, homepage (LIKELY) | **CONFLICT**: 60 days is the no-pre-approval window, and it includes pending claims. After 60 days WorkSafeBC pre-approves; coverage does not end | Rewrite |
| WorkSafeBC pays only "its established rate", patient covers the gap | WorkSafe blog (SUMMARY) | **CONFLICT** in context: applies to non-contracted providers only. Contradicts "no user fees" | Remove or reframe |
| "No user fees for ICBC + WorkSafeBC accepted" / "you pay nothing" | Jane main and South Surrey pages (LIKELY), blog meta (KNOWN) | PARTIAL: true for claim-related care on an accepted claim at a contracted clinic. Not true for pending-claim treatment, non-claim areas or non-covered services | Qualify; depends on SYN-01 |
| "You also do not have to wait for that acceptance letter." | Blog meta (KNOWN) | PARTIAL: true for the initial assessment only | Add the pending-claim payment policy |
| "WorkSafeBC (OR1 & OR2)" in a physio bio | Jane South Surrey (LIKELY) | **CONFLICT**: programs consolidated Nov 1, 2024 | Edit to past tense |
| "No doctor's referral needed in most cases" | /worksafe-physiotherapy/ (LIKELY), Yelp (KNOWN) | PARTIAL: no official contrary text, but no explicit official "no referral" either. Must never extend to massage | Use the official wording (WSBC-10) |
| Mileage for claim trips over 20 km one way | Blog (SUMMARY) | UNVERIFIED | Leave out until verified |
| Medimap "Synergy Rehabilitation Inc." (Cedar Hills) lists only private insurance and credit card | medimap.ca (LIKELY) | Listing gap vs Jane WCB types | Fix the citation after SYN-01 |

## 10. Publish-ready wording (only from OK_TO_PUBLISH claims)

Put an "as of" line on every page ("WorkSafeBC rules checked November 2026; source: worksafebc.com"), and link the official pages. Before go-live, someone with access must spend about 5 minutes checking each quoted line against the live page, because this session could not open worksafebc.com.

- "If you need physiotherapy after a work injury, WorkSafeBC asks you to visit a physiotherapist who has a contract with WorkSafeBC and to tell them your injury is work-related." (WSBC-10)
- "At a WorkSafeBC-contracted clinic you can have your initial assessment even before your claim is accepted, as long as you have reported the injury and it's within 60 days of the injury. The clinic bills WorkSafeBC for that assessment, and WorkSafeBC pays for it even if your claim is later denied." (WSBC-11, -12, -13, -29). Use "Synergy Rehab" in place of "a contracted clinic" only after SYN-01.
- "More than 60 days since your injury? You can still be treated, but WorkSafeBC has to approve it first." (WSBC-14)
- "Once your claim is accepted, the clinic bills WorkSafeBC for your claim-related treatment and you shouldn't have to pay any fees." (WSBC-23)
- "Before your claim is accepted, you may be asked to pay for treatment visits. If the claim is accepted, you can ask for that money back." (WSBC-28). Add Synergy's own policy after staff decide.
- "If you need more treatment, your physiotherapist can ask WorkSafeBC. WorkSafeBC decides." (WSBC-21)
- "WorkSafeBC massage therapy needs a doctor's referral and an accepted claim." (WSBC-35)
- Steps: tell your employer → see a health care provider and say it happened at work → report online 24/7 at worksafebc.com or call Teleclaim 604.231.8888 / 1.888.967.5377 (Mon to Fri, 8 a.m. to 6 p.m.) → you'll get an 8-digit claim number by mail → you have up to one year to report, but report right away. (WSBC-42 to -46)

## 11. Data gaps and how to close them

| Gap | Why | Fix |
|---|---|---|
| Synergy's signed 2026 agreement and vendor numbers per clinic | Not public | Ask Synergy ops/billing (top priority) |
| Live text of the four target official pages | worksafebc.com fetch blocked (ENOTFOUND) | Allow-list `www.worksafebc.com`, then re-fetch |
| Post-April-2026 provider lists | Not in the search index | Same fix; or phone WorkSafeBC Health Care Programs (Physiotherapy@worksafebc.com per one summary, LIKELY) |
| The new agreement's visit-allocation clause | Only the expired 89088 text surfaced | Staff check the signed agreement's schedule |
| Bulletin 2026-29 and Key Clarifications FAQ full text | Snippets only | Same fix |
| Whether incumbents had to re-apply | No source | Staff, or bulletin 2026-28 full text |
| RMT/acupuncturist/chiropractor WorkSafeBC status at Synergy | Not public in results | Staff |
| Mileage/travel rule | Not searched in depth | Search the WorkSafeBC travel expenses page |

## 12. Sources (all retrieved 2026-11-02 via WebSearch)
WorkSafeBC: bulletin 2026-28; bulletin 2026-29; Physiotherapy Services Agreement; Key Clarifications FAQ; Physiotherapy Services Reference Manual; Physiotherapy Fee Schedule; MSK physiotherapy services (contracted); Become a provider; Vendor Application Form 19D210; forms 83D555 and 83D665; health care benefits; physiotherapy provider lists (Metro Vancouver, Fraser Valley, Northern BC); EAPP list and EAPP employer page; Billing WorkSafeBC for Physiotherapy Treatment (2022) and invoicing page; physiotherapy services flowchart; chiropractors; massage therapists and massage billing guide; acupuncturists and acupuncture fee schedule; CRRTW announcement; RTWSS and RTWSS providers; How workers report; How employers report; CM096; Contact us; Form 6; Form 6A; Your Claim: Helpful Information (URLs in the tables above and in the claims register).
Other: bcphysio.org (two pages); synergyrehabilitation.ca (/worksafe-physiotherapy/, /worksafebc-physiotherapy-what-is-covered/, /icbc-claims/, homepage); synergyrehab.janeapp.com (main, South Surrey); medimap.ca Synergy Rehabilitation Inc. Earlier project evidence: research/02-icbc-worksafe-content.md, research/04-local-gbp.md, data/locations-master.csv.

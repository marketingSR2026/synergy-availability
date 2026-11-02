# 02 — Content and design teardown: the existing ICBC pages and the WorkSafe page

Prepared 2026-11-02 by the content/design reverse-engineering specialist.
Scope rule (PROJECT-STATE.md, user, 2026-11-02): **the new pages are WORKSAFE ONLY.** The ICBC pages below are studied only as a reference for design and structure. Nothing ICBC-specific (offers, allowances, CTAs) should be carried over.

## Confidence labels
| Label | Meaning |
|---|---|
| **KNOWN** | Returned verbatim by a tool (SE Ranking crawl or audit, a Drive file, a pixel sample) |
| **LIKELY** | Inferred from tool data, or quoted inside a WebSearch summary (a third-party paraphrase that may contain verbatim fragments) |
| **SUMMARY** | Text taken from a WebSearch AI summary. **Not** verified page text, so do not quote it as Synergy copy |
| **UNKNOWN** | Could not be obtained. The reason is given |
| **ASSUMPTION** | The analyst's judgement, not evidence |

## 0. Source access log

| Source | Tool / endpoint | Result |
|---|---|---|
| Direct fetch synergyrehabilitation.ca | `curl` (1 attempt) | **Blocked**: `CONNECT tunnel failed, response 403` |
| Ahrefs Site Audit (full HTML/text) | `mcp__Ahrefs__site-audit-projects` | **Failed**: HTTP 400 `Insufficient plan`. No project list and no page content |
| Ahrefs crawled pages | `mcp__Ahrefs__site-explorer-crawled-pages` | **Failed**: HTTP 400 `Insufficient plan` |
| SE Ranking audit list | `PROJECT_listAudits` | OK. Audit **401878** (single page /icbc-treatments/, crawled 2026-09-18, score 79) and audit **384379** (whole site, 500 pages, crawled 2026-09-25, score 69) |
| SE Ranking crawled pages | `PROJECT_getCrawledPages` audit 384379, limit 500 | OK. Title, H1, first H2, meta description, word count, heading counts and links for every ICBC/WorkSafe URL |
| SE Ranking page issues | `PROJECT_getIssuesByUrl` (401878: /icbc-treatments/; 384379: /worksafe-physiotherapy/, /icbc-treatments/king-george-surrey/, /worksafebc-physiotherapy-what-is-covered/, /icbc-claims/) | OK. Page data, including a second, auto-generated "description" that reproduces the **opening body text verbatim** |
| SE Ranking found links | `PROJECT_getFoundLinks` audit 401878 (all 217 links of the ICBC hub); audit 384379 internal hyperlinks with anchor text (16,111 rows, exported to the session scratchpad `se/all_links.json` by a sibling agent; read-only reuse) | OK. Anchors, Jane deep links, JS/CSS stack, image alts |
| SE Ranking SERP (verbatim Google snippets) | `DATA_getSerpResults` → tasks 264691531/34/37 (`site:` queries, CA/en, standard) | All 3 completed (see §6 addendum); 264691534 not usable (Google ignored `site:`). Cost: 3 standard SERP queries |
| WebSearch (allowed_domains synergyrehabilitation.ca) | 11 queries | OK. Gives **summaries only** (labelled SUMMARY) |
| Google Drive | `search_files`, `get_file_metadata`, `download_file_content`, `read_file_content` | Two Yelp portfolio zips (ICBC + WorkSafe) downloaded and inspected. **No HTML/CSS/JS page source exists in Drive** |

SE Ranking units (`DATA_getSubscription`): 9,300 at the start and 8,690 at the end of this task. Parallel specialist agents share the balance, so the drop cannot all be attributed here. This task's only data-unit calls were the 3 standard SERP queries; everything else was project/audit reads.

---

## 1. The existing /worksafe-physiotherapy/ page

### 1.1 Page facts (KNOWN: SE Ranking audit 384379, crawled 2026-09-25 19:01)
| Field | Value |
|---|---|
| URL | https://synergyrehabilitation.ca/worksafe-physiotherapy/ (HTTP 200, indexable, in sitemap) |
| Title (62 chars) | `WorkSafe Physiotherapy Metro Vancouver British Columbia Canada` |
| Meta description (167 chars, flagged too long) | `Recover from a workplace injury with WorkSafe physiotherapy at Synergy Rehab, offering personalized rehabilitation, pain management, mobility care, and direct billing.` |
| H1 | `Worksafe Physiotherapy` (lower-case "s", which doesn't match "WorkSafe" in the title or H2) |
| First H2 | `WorkSafe Injury Rehabilitation` |
| Heading counts | H1 1 · H2 17 · H3 7 · H4 0 |
| Words | 1,566 (shell included) |
| Images | 10 (crawl) / 8 (page-issue view) |
| Links | 134 total; 36 internal outlinks; 28 external |
| Inlinks | 352, almost all from the global nav (anchor `Worksafe`, 334×) |
| Canonical | self, but **two canonical tags** (error `canonical_multiple`) |
| Meta description | **two description tags** (warning `description_multiple`) |
| Robots | index, follow, max-snippet:-1 |
| Page weight | JS 3.89 MB (42 files), CSS 0.97 MB (51 files), HTML 193 KB, html_ratio 6% |
| Organic keywords (SE Ranking `num_keywords`) | 1 · traffic_forecast 0 |

### 1.2 Headings
| Level | Heading | Status / source |
|---|---|---|
| H1 | Worksafe Physiotherapy | KNOWN (SE Ranking) |
| H2 #1 | WorkSafe Injury Rehabilitation | KNOWN (SE Ranking) |
| H2/H3 | Why Choose Worksafe Physiotherapy Rehabilitation | LIKELY (quoted as a heading in a WebSearch summary) |
| H2/H3 | How To Get Worksafe Physiotherapy With Synergy Rehab | LIKELY (quoted as a heading in a WebSearch summary) |
| — | FAQ block (coverage, referral, conditions) | LIKELY (a WebSearch summary refers to "Its FAQ") |
| Other 14+ H2s and 7 H3s | **UNKNOWN**: no tool returned the full heading list (no Ahrefs plan, fetch blocked). Some H2s are probably theme/footer widgets (ASSUMPTION: the same theme gives /icbc-claims/ 14 H2s on 753 words) |

### 1.3 Verbatim body text captured
KNOWN. This is SE Ranking's auto-extracted second description, i.e. the first ~350 characters of rendered body text:
> "Worksafe Physiotherapy WorkSafe Injury Rehabilitation At Synergy Rehab, recovering from a workplace injury encompasses more than just physical healing — it's about regaining your professional and personal life balance. If you've experienced an injury on the job, our compassionate therapists are ready to support you through your rehabilitation journey, backed…"

All other page text is **SUMMARY only** (WebSearch). See the claims table below.

### 1.4 Every WorkSafeBC factual claim found (on this page and elsewhere on the site)
"Quoted" fragments are the strings that WebSearch summaries placed in quotation marks or presented as page wording. Treat them as LIKELY verbatim. Everything else is SUMMARY.

| # | Topic | What /worksafe-physiotherapy/ says | Label | Other Synergy sources that conflict or agree |
|---|---|---|---|---|
| W1 | Sessions | "pre-authorized allowance of **10** physiotherapy sessions"; "**10 sessions are scheduled over 5 weeks**" | LIKELY (WebSearch ×4, consistent) | Homepage: 10 sessions / 5 weeks, "additional sessions on request" (SUMMARY). **/icbc-claims/ (KNOWN verbatim): "15 sessions are scheduled over 6 weeks"**. 2023 social graphic, Drive file `06.jpg` (KNOWN, OCR snippet): "15 sessions are scheduled over 6 weeks". King George and Delta general location pages: "initial authorization for up to 15 physiotherapy sessions" / "up to 15 upfront physio sessions" (SUMMARY). Blog /worksafebc-physiotherapy-what-is-covered/: "there is no single fixed number published for every claim" (SUMMARY). **Four different numbers on one site** |
| W2 | 60-day window | "Approved claims are eligible for treatment within **60 days** of your injury or accident" | LIKELY. The same sentence is KNOWN verbatim on /icbc-claims/ | Homepage repeats it (SUMMARY) |
| W3 | Extensions | "Additional sessions may be requested as part of your treatment plan" | LIKELY. KNOWN verbatim on /icbc-claims/ | No page describes how extensions are approved (SUMMARY) |
| W4 | Approval | Speaks of "approved claims" / "approved treatments" only | LIKELY | Blog: treatment continues "while the physiotherapist reports it is helping"; WorkSafeBC funds care "reasonably necessary for the accepted injury" (SUMMARY) |
| W5 | Referral | "you do not need a doctor's referral to start Worksafe Physiotherapy for most cases … depending on the claim details or specialized needs, a referral may be beneficial" | LIKELY | Yelp WorkSafe caption (KNOWN): "No doctor's referral needed in most cases". Blog: physio is direct-access in BC, but **massage therapy needs a physician referral** (SUMMARY) |
| W6 | Getting started | "The initial step is to report your workplace injury directly to WorkSafeBC, which will then provide you with a vital claim number"; bring the claim number to the first appointment | LIKELY | Yelp WorkSafe graphic (KNOWN): "Tell your employer, then report the injury to WorkSafeBC. They open a claim and give you a number." |
| W7 | Direct billing | "we bill WorkSafeBC directly" | LIKELY | Meta description (KNOWN) says "direct billing". Yelp (KNOWN): "we bill WorkSafeBC directly" |
| W8 | User fees | "no out-of-pocket expenses for approved treatments" | LIKELY | Blog meta description (KNOWN): "If WorkSafeBC accepts your claim, your physiotherapy is covered and you pay nothing." The same blog also mentions WorkSafeBC paying only "its established rate", so the patient covers any gap (SUMMARY, context unclear). **Contradiction to resolve** |
| W9 | Pending claims | **Not addressed on this page** (no summary mentions it) | LIKELY absent | Blog (KNOWN meta description): "You also do not have to wait for that acceptance letter." Blog (SUMMARY): initial assessment allowed before acceptance if the clinic holds a WorkSafeBC contract; if the claim is denied, the patient may be asked to pay; reimbursement possible if it is later accepted |
| W10 | Eligibility / conditions | **KNOWN verbatim (Google snippet, SE Ranking SERP task 264691531): "Worksafe Physiotherapy at Synergy Rehab covers a wide range of workplace injuries, including repetitive strain injuries, back and neck pain due to lifting or ..."**; the rest of the list ("…joint injuries, and post-surgical rehabilitation"; "workplace-related concerns, such as repetitive strain injuries, soft tissue damage, and other specific conditions") is LIKELY | KNOWN (first part) / LIKELY | — |
| W11 | Benefits list | pain relief, improved range of movement, strength and endurance, joint pain relief, better daily function, injury-prevention strategies | SUMMARY | — |
| W12 | Return to work | Physios "build return-to-work plans around job demands and coordinate with the case manager" | SUMMARY (source page ambiguous) | Yelp graphic (KNOWN): "Direct billing, plus the progress and return to work reports WorkSafeBC asks for." |
| W13 | Employer duties / EAPP | Employer must report within 72 hours; some employers use an "Early Access to Physiotherapy Program" | SUMMARY (WebSearch could not tell which page; probably the blog) | — |
| W14 | Other WorkSafeBC benefits | Covers physio, hospital care, medical supplies, rehab, prescriptions; mileage for claim trips over 20 km one way | SUMMARY (blog, not this page) | — |
| W15 | Clinics | "19+ locations" | KNOWN on Yelp captions; LIKELY site-wide | Hub/location pages (KNOWN anchor): "See all 19 clinics". WebSearch also found pages that say 17 |

**Conclusion (ASSUMPTION based on W1–W9):** session counts, the 60-day window and user-fee wording are mutually inconsistent across at least five Synergy URLs plus 2023 social graphics. None of the WorkSafe claims cite worksafebc.com. Every claim should go through the claims register and be checked against official WorkSafeBC sources before any reuse.

### 1.5 CTAs and links on /worksafe-physiotherapy/ (KNOWN: SE Ranking 384379 internal hyperlinks)
| Anchor | Target | Note |
|---|---|---|
| BOOK NOW / Book Online | /booking-page/ | Header/global CTAs, not page-specific |
| Give Us A Call | /locations/ | Phone CTA routes to a list, not a number |
| (empty anchor) | /locations/ | `links_no_anchor` notice |
| ICBC and WCB Claims | /icbc-claims/ | **nofollow** internal link (also on other pages) |
| Contact Us | /contact (no trailing slash) | **nofollow**; the canonical URL is /contact/ |
| About | /about/ | nofollow duplicate of the nav link |
| Global nav (Home, About Us, Our Team, Services + 16 service links, Car Accident, Locations, ICBC, ICBC Treatments, Careers, Blogs, Media room, Contact Us) | various | Same nav on every page |

- **In-body contextual links: none found** in the internal-link export. The page links to no location page, no service page in body copy, and no WorkSafe blog post. LIKELY. The export covers internal links only.
- External links (28): **UNKNOWN** in detail. The only one surfaced is `http://synergyoptometry.com/` (301) in the footer. Whether the page links to worksafebc.com or to Jane booking pages could not be verified.
- Inbound contextual anchors to the page (KNOWN, site-wide export): `More About Worksafe` 6×, `Worksafe Treatment`, `Worksafe Injury Physiotherapy`, `WorkSafeBC`, `WorkSafeBC claims`, `WorkSafeBC physiotherapy`, `WorkSafeBC→`, `No referral needed`, each 1×.

### 1.6 Other WorkSafe content on the site (inventory)
| URL | Title / H1 (KNOWN, SE Ranking) | Words | Relevance |
|---|---|---|---|
| /worksafebc-physiotherapy-what-is-covered/ | Title "WorkSafeBC Physiotherapy: What's Covered After a Work Injury in BC - Synergy Rehab" (82 chars). H1 same. First H2 "What WorkSafeBC covers once your claim is accepted". H2 17 / H3 13 | 1,844 | Newest and most accurate WorkSafe copy (pending claims, per-visit fees). Its CTA anchor is KNOWN: "Book a WorkSafeBC physiotherapy assessment online" → /booking-page/. Links to /worksafe-physiotherapy/ with the anchor "WorkSafeBC physiotherapy". Only 9 inlinks |
| /icbc-claims/ | H1 "ICBC & WorkSafe Claims", first H2 "How Much Does Worksafe Cover?" | 753 | Holds the conflicting **15 sessions / 6 weeks** block (KNOWN verbatim). 343 nofollow inlinks from the footer |
| Homepage and general location pages (e.g. /physiotherapy-delta-chiropractor/, /physiotherapy-king-george-chiropractor/, /physiotherapy-amson-chiropractor/, /physiotherapy-abbotsford-chiropractor/) | — | — | Carry WorkSafe snippets with 10- or 15-session claims (SUMMARY) |

### 1.7 Verdict on the WorkSafe page (ASSUMPTION)
It is a generic service page from about 2023 (title pattern "… Metro Vancouver British Columbia Canada", the same as /icbc-physiotherapy/ and /icbc-claims/). The copy is mostly benefits, the session claims are wrong or inconsistent, and there are no location links, no booking deep links, no pending-claim guidance, no schema evidence and almost no organic visibility (1 keyword). The ICBC hub replaced the equivalent ICBC page. The WorkSafe page has had no such upgrade.

---

## 2. ICBC hub (/icbc-treatments/) and location-page template

### 2.1 Hub facts (KNOWN: SE Ranking 401878 @ 2026-09-18 and 384379 @ 2026-09-25)
| Field | 2026-09-18 (audit 401878) | 2026-09-25 (audit 384379) |
|---|---|---|
| Title | `ICBC Treatment \| Physio, Chiro, RMT & More \| Synergy Rehab` (58) | same |
| Meta description (145) | `ICBC treatment, no referral, $0 fees: physio, chiro, massage, kinesiology, acupuncture, counselling. Direct-billed at 19+ Lower Mainland clinics.` | same |
| H1 | `Injured in a crash? Your treatment is already approved.` | same |
| First H2 | `What ICBC treatment does your claim cover?` | `ICBC physiotherapy, massage therapy, kinesiology and acupuncture: what your claim covers` (rewritten in that week for keywords) |
| Headings | H2 20 · H3 17 · H4 29 | H3 17 · H4 29 |
| Words | 4,734 | 4,856 |
| Inlinks | **0 (error `no_inlinks`, orphan)** | 378 (now in global nav as "ICBC Treatments") |
| Links to the 19 location pages | none | 19 (anchors = clinic names) |
| Images | 13 | 17 |
| JS / CSS | 3.08 MB / 0.89 MB | — |

Opening body text, KNOWN verbatim (SE Ranking auto-description):
> "ICBC Enhanced Care · Lower Mainland, BC Injured in a crash? Your treatment is already approved. Your ICBC treatment is covered from day one: within your first 12 weeks ICBC pre-approves Physiotherapy, Chiropractic, Massage Therapy, Kinesiology, Acupuncture and Clinical Counselling — no doctor's referral needed. Synergy Rehab direct-bills ICBC and…"

### 2.2 Hub section order (reconstructed)
| # | Section | Evidence | Label |
|---|---|---|---|
| 1 | Global header (Elementor Pro nav, ElementsKit off-canvas/search, BOOK NOW) | CSS/JS list (401878 found links) | KNOWN |
| 2 | **Hero**: eyebrow `ICBC Enhanced Care · Lower Mainland, BC` → H1 → lede (above) → CTA(s). Full-bleed Unsplash crash photo, alt "Car crash damage — ICBC treatment is pre-approved for injuries like these" | auto-description + image alts | KNOWN text; CTA placement LIKELY |
| 3 | CTA buttons: `Book an ICBC Assessment`, `Start your pre-approved care`, `Find your nearest clinic` (all → /booking-page/) | anchors | KNOWN anchors; position UNKNOWN |
| 4 | "What your claim covers": per-discipline allowances (Physio 25, Chiro 25, Massage/Kin/Acu/Counselling 12 each, "separate allowances") | WebSearch | SUMMARY |
| 5 | Treatment detail blocks with clinic photos (alts: "Physiotherapist providing ICBC treatment for a neck injury after a car accident", "Percussion therapy during ICBC treatment for back pain after a crash", "Manual therapy to the neck and shoulder as part of ICBC treatment", "Hip and hamstring assessment at the start of ICBC treatment") plus cross-links "active rehabilitation", "Cold laser", "Shockwave", "vestibular therapy" | image alts and anchors | KNOWN |
| 6 | Second crash image, alt "Two cars with crushed front ends after a collision — the kind of crash ICBC treatment covers" | alt | KNOWN |
| 7 | **Location directory**: 19 clinic links to /icbc-treatments/<slug>/ in **geographic order** (Vancouver → Burnaby → New West → Richmond → Delta → Nordel → Cedar Hills → Strawberry Hill → Newton → Sullivan Heights → King George → Central City → Fleetwood → Cloverdale → Clayton Corners → Clayton Heights → South Surrey → Langley → Abbotsford), each with a Jane `/locations/<slug>/book` deep link and a Jane `/locations/<slug>` profile link | anchors + Jane links | KNOWN (order from link order in crawl) |
| 8 | Official-source links: icbc.com/claims/enhanced-care/care-and-recovery-benefits, icbc.com/claims/injury/accessing-treatment-during-your-first-12-weeks-of-recovery, icbc.com/claims, www.icbc.com | external links | KNOWN |
| 9 | Cross-sell to WorkSafe: anchor `WorkSafeBC` → /worksafe-physiotherapy/ | anchor | KNOWN |
| 10 | Text CTA `synergyrehabilitation.ca/booking-page` (URL printed as the anchor) | anchor | KNOWN |
| 11 | Google reviews (widget-google-reviews + wp-google-places-review-slider scripts), team (TeamPress) | JS/CSS | LIKELY, because the scripts are site-wide and may not render on this page |
| 12 | Global footer: social links, Synergy Optometry logo, Maple Leaf svg, Sitemap, nofollow "ICBC and WCB Claims" | links | KNOWN |

FAQ section on the hub: **UNKNOWN**. WebSearch found none ("did not find a dedicated FAQ section on the hub page itself", SUMMARY). With 29 H4s, an accordion or FAQ is possible (ASSUMPTION).
Glossary: **UNKNOWN.** Jet Tricks (Tippy.js tooltips) loads on the hub, but it also loads on /worksafe-physiotherapy/, so it cannot be tied to a glossary.

### 2.3 Location page template (/icbc-treatments/<slug>/), 19 pages
Per-page data is in `02-icbc-location-pages.csv` (KNOWN, SE Ranking 384379).

**Structural fingerprint (KNOWN):** every page has H1 1 · H2 17 · H3 8 · H4 9 (Newton has 10) · 10 images · 52 external links · 46–48 internal outlinks · 2,525–2,674 words · HTML 283.5–285.8 KB. These are near-identical shells, and only about 150 words (~6%) vary between pages.

**Copy formulas (KNOWN):**
| Element | Formula | Example (King George) |
|---|---|---|
| Title | `ICBC Physiotherapy {Area}[, Surrey] \| Synergy Rehab` | ICBC Physiotherapy King George, Surrey \| Synergy Rehab |
| H1 | `ICBC Physiotherapy in {neighbourhood phrasing}` | ICBC Physiotherapy in King George Blvd, Surrey |
| First H2 | `ICBC treatment at Synergy Rehab {Clinic}` | ICBC treatment at Synergy Rehab King George |
| Meta description | `ICBC treatment at Synergy Rehab {Clinic}, {street address}. Direct billing, $0 user fees on pre-approved care, no referral needed.` | …#101 8056 King George Blvd… |
| Breadcrumb + eyebrow | `Home/ICBC Treatments/{Clinic}` then `Synergy Rehab {Clinic} · ICBC Enhanced Care` | KNOWN (auto-description) |
| Lede | "Injured in a crash? Within your first 12 weeks ICBC pre-approves Physiotherapy, Chiropractic, Massage Therapy, Kinesiology, Acupuncture and Clinical Counselling — no doctor's referral needed. Synergy Rehab {Clinic}, on {street}…" | KNOWN (auto-description) |

The H1 neighbourhood phrasing is varied by hand: "in North Delta" (slug delta), "in Surrey City Centre" (slug central-city-surrey), "in East Clayton, Surrey" (slug clayton-corners-surrey), "in Vancouver's West Side" (slug vancouver), "in King George Blvd, Surrey" (KNOWN).

**Reconstructed section order:**
| # | Section | Evidence | Label |
|---|---|---|---|
| 1 | Breadcrumb | auto-description | KNOWN |
| 2 | Hero: eyebrow, H1, lede, CTA; Unsplash crash photo (photo-1745845979138, **missing alt**, warning `image_no_alt`) | auto-description + issues | KNOWN |
| 3 | H2 "ICBC treatment at Synergy Rehab {Clinic}": info card with labels "Treatment / Phone / Hours" and a "Call (604) …" CTA, "You can book online or …" (KNOWN Google snippets, SERP task 264691537); address, phone, hours (e.g. Richmond "Mon–Fri 7:30 AM–8:30 PM, Sat 9–5, Sun 9–3"; Vancouver only says "open six days a week"; Clayton Heights and Langley "seven days a week") and building context (New West: "Columbia Medical Building in Sapperton") | WebSearch | SUMMARY; per-page detail differs |
| 4 | Allowances block: "Physiotherapy (25), Chiropractic (25), Massage Therapy (12), Kinesiology (12), Acupuncture (12) and Clinical Counselling (12)", "separate allowances" | WebSearch | SUMMARY |
| 5 | Timeline: Day 0 (claim number, "no adjuster call required") → Weeks 1–12 pre-approved, "$0 user fees, direct-billed" → After week 12 (treatment plan submitted before the window ends). Vancouver carries the footnote "illustrative example … for accidents from May 1, 2021 onward" | WebSearch | SUMMARY (component LIKELY) |
| 6 | What to bring: claim number, accident date, Personal Health Number | WebSearch | SUMMARY |
| 7 | First visit: crash history, movement and strength exam, treatment the same visit, "wear clothing you can move in" | WebSearch | SUMMARY |
| 8 | Neighbourhoods and roads served (Vancouver: Dunbar, Kitsilano, UBC, W 16th Ave, SW Marine Dr; South Surrey: White Rock, Ocean Park; Strawberry Hill: Newton, North Delta; Abbotsford general page: Townline Hill, Clearbrook…) | WebSearch | SUMMARY |
| 9 | Services cross-links (anchors "active rehabilitation", "vestibular therapy") and link to the general location page (anchors "Synergy Rehab {Clinic} clinic page" / "clinic page", seen on only 5 of 19 pages: Abbotsford, Cloverdale, Delta, King George, Newton) | link export | KNOWN |
| 10 | **Nearby clinics** component: 4 cards ordered by distance, format `0N {Clinic} About {x} km · {address} — ICBC treatment at this clinic`, plus `See all 19 clinics` → hub | link export | KNOWN |
| 11 | Back-link `ICBC treatments at Synergy Rehab` → hub; `Worksafe` → /worksafe-physiotherapy/ (nav) | link export | KNOWN |
| 12 | FAQ: WebSearch says FAQ-style content sits "on the individual clinic pages" | WebSearch | SUMMARY |
| 13 | Footer (global) plus a 19-clinic Jane booking list with **hard-coded `_gl=` Google linker parameters and `rel=nofollow`** (warning `extlinks_nofollow`, KNOWN) | issues | KNOWN |

**Map:** **UNKNOWN.** No Google Maps URL or iframe appears in the hub's 217 found links (KNOWN for the hub). For location pages, external links were not exported. The 52 external links per page are mostly Jane links (ASSUMPTION).
**Schema / JSON-LD:** **Not Available** as source. SE Ranking does not expose structured data, and the Ahrefs page content needed for it is blocked by the plan. Indirect evidence: Google shows a named breadcrumb "› ICBC Treatments" for all 10 location results (SERP task 264691537), which suggests BreadcrumbList markup (LIKELY). LocalBusiness/MedicalClinic/FAQPage markup is **UNKNOWN**. A WordPress export or allowlisted fetch is needed to confirm.

### 2.4 What differs per location (KNOWN unless stated)
| Variable | Varies? | Source |
|---|---|---|
| Title / H1 / H2 / meta description (area, clinic name, address) | Yes, by formula | SE Ranking |
| Neighbourhood phrasing in H1 | Yes, hand-written | SE Ranking |
| Address, unit, phone, hours | Yes | SE Ranking meta + WebSearch |
| Nearby-clinic cards (4, with distances) | Yes, computed | link export (full table in CSV) |
| Neighbourhoods/roads/landmarks paragraph | Yes | SUMMARY |
| Link to the general location page | Only 5/19 | link export |
| Allowance table, timeline, what-to-bring, first-visit copy, FAQ | **No** (shared) | SUMMARY + structural fingerprint |
| Hero image (Unsplash stock crash photo) | **No**, same photo-1745845979138 | issues (King George) |
| Word count delta | ±150 words | SE Ranking |

**QA defects seen on location pages (SUMMARY, so verify before relying on them):** the Newton page has one bullet saying "15 pre-approved physiotherapy sessions" against 25 elsewhere; the South Surrey page has a stray line saying a referral **is** required; hours are incomplete on the Vancouver, Clayton Heights, Langley and Fleetwood pages.

### 2.5 Jane deep links (KNOWN: hub found links, audit 401878)
Pattern `https://synergyrehab.janeapp.com/locations/<slug>/book`. Slugs: vancouver, burnaby, new-westminster, richmond, delta, nordel-88-ave, cedar-hills, strawberry-hill-72nd, central-city, king-george, newton-72nd, sullivan-heights-hwy-10, fleetwood, cloverdale-hwy-10, clayton-heights, clayton-corners-188-st, south-surrey, langley, abbotsford.
- **LIKELY bug:** among the hub's followed `/book` links, `south-surrey/book` appears **twice** and `clayton-corners-188-st/book` **not at all**, so the Clayton Corners "Book" button probably opens South Surrey's booking page. Clayton Corners appears only in the nofollow `_gl` list and as a profile link. Verify in WordPress.
- A second set of the same 19 links carries **stale `_gl=1*…` GA linker strings and `nofollow`**, copied from a browser session (KNOWN). This corrupts attribution and should not be copied.

### 2.6 Build and interactive stack (KNOWN: hub CSS/JS list, audit 401878)
| Layer | Evidence |
|---|---|
| Theme / builder | Hello Elementor theme + **Elementor + Elementor Pro** (popup, motion-fx, sticky, form, nav-menu); page CSS `/wp-content/uploads/elementor/css/post-{26180,32761,32878,42348,49423}.css` (one of these is the page, the rest are header/footer/kit; ASSUMPTION: 49423 = hub) |
| Add-ons | ElementsKit Lite (header, off-canvas, search), JetEngine, Jet Tricks (Tippy tooltips, tsParticles), TeamPress (team grid/modal), TablePress, Agile Store Locator CSS, GTranslate (floating switcher) |
| Custom motion | **GSAP 3.12.5 + ScrollTrigger** (cdnjs) and **Lenis 1.1.20** smooth scroll (jsDelivr). The hub was hand-built with custom HTML/JS animation, not stock widgets (LIKELY) |
| Fonts | Montserrat (local Elementor GF), **Spline Sans Mono 400–600** (custom, on hub and location pages; LIKELY used for numerals/eyebrows), Source Sans Pro (plugin) |
| Lead capture | LeadConnector (GoHighLevel) chat widget loader |
| Reviews | Widget Google Reviews 6.9.11, WP Google Places Review Slider |
| Analytics | GA4 gtag ×3, Meta pixel ×2 (ids 1146132405487862, 993382379926498), Ahrefs analytics, CallTrackingMetrics (`tctm.co`), CrazyEgg (**403**), Contentsquare (**404 on the hub**), WP Statistics |
| Weight | 44 JS files / 3.08 MB on the hub; location pages 3.84 MB JS. Notices `js_big`, `js_many`, `css_big` (ekit-widget-common 157 KB) |

### 2.7 Visual system (KNOWN: Drive Yelp portfolio PNGs, pixel-sampled)
| Token | Hex | Use |
|---|---|---|
| Brand blue | `#1c44a9` | header band, step-number tiles |
| Blue shade | `#1b5496` | decorative circle |
| Action green | `#1eb831` | CTA buttons, "That's it." accent |
| Bright green (on dark) | `#3fdc5c` | headline accent on photo |
| Navy text | `#16233d` | step titles |
| Deep navy overlay | `#081127` | photo gradient |
| Body grey | `#4d5b73` | body copy |
| Divider | `#e3e9f4` | rule above footer |

Typography in the graphics looks like Poppins (headings) and Inter (body). This is an ASSUMPTION from visual inspection, and the website itself loads Montserrat and Spline Sans Mono.
Patterns: uppercase letter-spaced eyebrow ("AFTER A WORKPLACE INJURY"), two-tone headline ("Three steps. **That's it.**"), numbered rounded-square step tiles, a green pill badge ("WORKSAFEBC CLAIMS WELCOME"), a dot-separated proof line ("No referral needed · WorkSafeBC direct billing · 19+ Lower Mainland clinics"), CTA "MESSAGE US TO START".

---

## 3. What to reuse and what not to copy (WorkSafe-only build)

### Reuse (structure and design only, with WorkSafe content)
| Pattern | Why | Evidence |
|---|---|---|
| Hub → 19 location pages → nearby-clinic cards → back to hub | Closed internal-link loop. The hub went from 0 to 378 inlinks in a week | KNOWN |
| Distance-sorted "Nearby clinics" cards (`0N · About x km · address`) | Genuinely location-specific and useful | KNOWN |
| Per-location Jane `/locations/<slug>/book` deep links | One click to the right booking calendar | KNOWN |
| Eyebrow → question H1 → plain-English lede → CTA hero | Clear intent match | KNOWN |
| Formulaic but readable title/H1/meta with the real street address | Strong local relevance. Keep each meta under 160 characters | KNOWN |
| Hand-written neighbourhood phrasing in H1 (e.g. "North Delta", "Surrey City Centre") | Avoids identical H1s | KNOWN |
| Outbound links to official sources (icbc.com pages there → worksafebc.com claim/health-care pages here) | Trust and E-E-A-T | KNOWN |
| Timeline component (Day 0 → covered period → after) | Converts a policy into a visual | SUMMARY |
| What-to-bring and first-visit blocks | Practical and reduces no-shows | SUMMARY |
| Real clinic photography with descriptive, intent-bearing alts (2026/08–09 shoots) | Better than stock | KNOWN |
| The 3-step graphic ("Report it and get your claim number → Book at your closest clinic → We handle WorkSafeBC from there") | Already exists for WorkSafe; adapt it as an on-page component once its claims are verified | KNOWN |
| Blog-to-pillar links (the WorkSafe blog already links to /worksafe-physiotherapy/) | Topical cluster | KNOWN |

### Do NOT copy (weaknesses)
| Weakness | Evidence | Fix for the WorkSafe build |
|---|---|---|
| ~94% shared copy across 19 location pages (only ±150 words vary; same stock hero) | KNOWN fingerprint | Location pages only for **verified eligible** clinics, each with unique WorkSafe-relevant facts (hours fit for shift workers, accessibility, transit/industrial-area access, clinicians, WorkSafe-specific services), or fold thin ones into the hub. This is the doorway-page risk |
| Unsplash car-crash hero, missing alt on location pages | KNOWN | Real clinic photos, descriptive alts |
| Duplicate canonical + duplicate meta description tags (site-wide) | KNOWN `canonical_multiple`, `description_multiple` | Ensure one SEO plugin outputs the head tags |
| Hard-coded `_gl=` GA linker params + nofollow on Jane links | KNOWN | Clean Jane URLs; add UTMs only if needed |
| Probable Clayton Corners → South Surrey booking mix-up | LIKELY | Generate links from one data table and QA every slug |
| Hub orphaned at launch (0 inlinks on 2026-09-18) | KNOWN | Link the pillar from nav, the old page and the blog **at publish** |
| Inconsistent session claims (10/5 wk vs 15/6 wk vs "up to 15" vs "no fixed number") and referral contradictions | KNOWN + SUMMARY | Single source of truth (claims register); dated "as of" line; cite worksafebc.com |
| Heavy JS (3–3.9 MB, 40+ files, 403/404 third-party scripts) | KNOWN | Keep GSAP/Lenis off WorkSafe pages unless needed; remove dead CrazyEgg/Contentsquare tags |
| "Contact" nofollow + no-slash URL, "Give Us A Call" → /locations/ | KNOWN | Use a real tel: link per clinic |
| Generic 2023 page pattern ("… Metro Vancouver British Columbia Canada", benefits filler, "compassionate therapists…") on the current WorkSafe page | KNOWN title/opening | Rewrite around WorkSafe tasks: claim number, pending claim, first visit, reports, return to work |
| Copying ICBC allowance and $0 messaging style into WorkSafe | Scope rule | WorkSafe has a different funding model; the ICBC numbers must never appear |

---

## 4. Source files (task item 4)
**No HTML, CSS or JS files of the ICBC pages were found** (Drive searches by MIME type, title and full text; Ahrefs page content blocked by plan; fetch blocked; WordPress not connected). The only design artefacts were the two Yelp portfolio zips. They are copied unmodified, with SHA-256 hashes, into `research/icbc-source/drive-yelp-portfolio/`, and `research/icbc-source/README.md` explains what they are.
Page-builder structure is reconstructed from the SE Ranking asset list (§2.6) instead: Hello Elementor + Elementor Pro sections, ElementsKit header, Jet plugins, plus custom GSAP/ScrollTrigger/Lenis code and a Spline Sans Mono font import in a custom HTML block (LIKELY). CSS class names are **UNKNOWN** without the HTML.

Irrelevant Drive hits, recorded so nobody re-checks them: `post.md` (an Achilles tendonitis blog draft); `httpssynergyrehabilitation.caicbc-treatments-Project-Report_2026_09_25.pdf` (SE Ranking rank report: ICBC location keywords at positions 25–100, out of scope here); `Marketing - Logins` (not opened, credentials).

## 5. Open items and how to close them
| Gap | Why it stayed open | How to close it |
|---|---|---|
| Full heading list and verbatim body of /worksafe-physiotherapy/ | Fetch blocked; Ahrefs plan | Allowlist synergyrehabilitation.ca, or connect WordPress, then re-run |
| Schema/JSON-LD, map embeds, FAQ markup, CSS classes | Same | Same |
| External links (worksafebc.com? Jane?) on the WorkSafe page | Export covered internal links only | `PROJECT_getFoundLinks` audit 384379, external links only, paged (costs nothing in units, but it is a large crawl) |
| Clayton Corners booking link | Inferred from link counts | Check the hub in WordPress |

## 6. Verbatim SERP snippets (SE Ranking `DATA_getSerpResults`, CA/en)
Tasks 264691531 (`site:synergyrehabilitation.ca/worksafe-physiotherapy/`), 264691534 (`site:synergyrehabilitation.ca worksafe`) and 264691537 (`site:synergyrehabilitation.ca/icbc-treatments/`) were created at 2026-11-02 05:53 UTC. All three completed. See the addendum below.

### Addendum: SERP results received
| Task | Query | Result (KNOWN, verbatim from Google via SE Ranking, crawled 2026-11-02 06:00 UTC) |
|---|---|---|
| 264691531 | `site:synergyrehabilitation.ca/worksafe-physiotherapy/` | 1 result. Google-displayed title: **"Worksafe Physiotherapy"** (Google rewrote the 62-char meta title down to the H1). Snippet: "Worksafe Physiotherapy at Synergy Rehab covers a wide range of workplace injuries, including repetitive strain injuries, back and neck pain due to lifting or ..." No SERP features |
| 264691534 | `site:synergyrehabilitation.ca worksafe` | Completed 06:03 UTC but **not usable**: Google ignored the `site:` operator for this query and returned 65 off-site results (worksafebc.com, Indeed, Facebook…). No Synergy snippets in it |
| 264691537 | `site:synergyrehabilitation.ca/icbc-treatments/` | Completed 06:03 UTC, 10 results, all location pages (the hub itself is not in the top 10). Verbatim snippets: New Westminster and Cedar Hills show the meta description; **South Surrey** "2388 156 Street. Physiotherapy, Chiropractic, Massage Therapy, Kinesiology, Acupuncture and Clinical Counselling. Call (604) 385-5855. You can book online or ..."; **Newton** (dated "Oct 2, 2026") "14468 72 Avenue. Physiotherapy, Chiropractic, … — no doctor's referral needed. ..."; **Sullivan Heights** "…— no doctor's referral needed. Call (604) 566 ..."; **Clayton Heights** "…Call (604) 547-2860 … call (604) 547-2860. ..."; **Strawberry Hill** "Physiotherapy, Chiropractic, Massage Therapy, Kinesiology, Acupuncture. Call (604) 547-0670. Open 7 days a week Treatment. Phone (604) 547-0670 Hours Open 7 ..."; **Clayton Corners** (dated "Oct 2, 2026"). Google shows the breadcrumb "synergyrehabilitation.ca › ICBC Treatments" on every result. King George's displayed title is the H1, not the meta title |

**What the SERP adds (LIKELY):** (a) each location page has a "Call (604) xxx-xxxx" CTA, repeated (Clayton Heights shows it twice), plus a label/value info card ("Treatment … Phone … Hours"), and the copy offers "book online or" call; (b) the breadcrumb trail named "ICBC Treatments" points to **BreadcrumbList structured data** (Google normally shows named crumbs only with markup or a clear trail; this is not proof of JSON-LD); (c) the Newton and Clayton Corners pages carry an Oct 2, 2026 date, so they were edited after the 2026-09-25 crawl and the crawl data may be slightly stale.


## Sources
- SE Ranking: PROJECT_listAudits; PROJECT_getCrawledPages (audit 384379); PROJECT_getIssuesByUrl (401878 hub; 384379 worksafe, king-george, worksafebc blog, icbc-claims); PROJECT_getFoundLinks (401878 full; 384379 internal-hyperlink export); DATA_getSubscription; DATA_getSerpResults/getSerpTasks.
- Google Drive: synergy-icbc-yelp-portfolio.zip (1leEEDSnn4nPUxMpovkL8okVGkY_mHoUY), synergy-worksafe-portfolio.zip (1vQCTOkXBtLAgR5_aCCiOlixjBzl4jMFc), 06.jpg (11lXpnI7undgUFZvd-FBtVNKvicwsHM82, search snippet only).
- WebSearch (allowed_domains synergyrehabilitation.ca), result URLs: https://synergyrehabilitation.ca/worksafe-physiotherapy/ · https://synergyrehabilitation.ca/worksafebc-physiotherapy-what-is-covered/ · https://synergyrehabilitation.ca/icbc-claims/ · https://synergyrehabilitation.ca/ · https://synergyrehabilitation.ca/icbc-treatments/vancouver/ · /south-surrey/ · /richmond/ · /new-westminster/ · /strawberry-hill-surrey/ · /langley/ · /clayton-heights-surrey/ · /fleetwood-surrey/ · https://synergyrehabilitation.ca/physiotherapy-king-george-chiropractor/ · https://synergyrehabilitation.ca/physiotherapy-delta-chiropractor/ · https://synergyrehabilitation.ca/physiotherapy-amson-chiropractor/ · https://synergyrehabilitation.ca/physiotherapy-abbotsford-chiropractor/ · https://synergyrehabilitation.ca/icbc-physiotherapy-in-bc-what-youre-entitled-to-after-a-car-accident/
- Ahrefs: site-audit-projects and site-explorer-crawled-pages both returned "Insufficient plan".

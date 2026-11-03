# WorkSafe pages: staff runbook

Plain steps for marketing, ops and clinic managers. Nothing here needs code beyond running two commands.

## 0. Week 1 (before any page goes live)

| # | Task | Who | Done when |
|---|---|---|---|
| 1 | Remove wrong WorkSafeBC wording sitewide: any "15 sessions over 6 weeks", "10 sessions over 5 weeks", "eligible within 60 days", "patient pays the gap", mileage lines, "WorkSafeBC approved". Pages: `/icbc-claims/` (WorkSafe sentences only), homepage WorkSafe module, WorkSafe blog post, King George, Delta, Abbotsford, Newton (Amson), Cloverdale clinic pages, `/worksafe-physiotherapy/` (old copy). Replace with one sentence and a link to `/worksafe-physiotherapy/` | Marketing | No register CONFLICT or DO_NOT_PUBLISH wording left (SYN-02, 03, 04, 06, 11, 14) |
| 2 | Privacy gate G6 in Google Tag Manager: add a blocking trigger so Meta pixels, Google Ads remarketing, CrazyEgg, Contentsquare and the chat widget do not fire on `/worksafe-physiotherapy/*`, `/worksafebc-physiotherapy-what-is-covered/` and `/return-to-work-after-a-workplace-injury/`. Turn Google signals off for these pages. Check with GTM preview | Marketing + privacy officer | Fill `privacy_gate_G6` in `data/review.json` |
| 3 | Theme fix: each page must have exactly one `rel=canonical` and one meta description. Disable the second SEO emitter (two plugins are writing them on 388 pages) | Web developer | View source on a draft shows one of each |
| 4 | Header "BOOK NOW" on WorkSafe URLs: Elementor display condition sends it to `#clinics` on the pillar and to the clinic's WCB booking link on location pages | Web developer | Click test |
| 5 | Access: Search Console (page level), GA4 and GTM read access for whoever reports; weekly Jane count of "WCB Physio Initial Session" bookings per clinic (counts only) | Owner | Q-11 answered |
| 6 | SE Ranking: decide renewal (Data API ends 2026-11-06); add the WorkSafe keyword group with target URLs (list in `research/07-rank-baseline.md` section 7) and 10 WorkSafe AI prompts; record 14 days of baseline | Marketing | `tracking_added_on` filled per clinic |
| 7 | Privacy, outside this project: the availability collector repo is public and its `data` branch lists practitioners' full names with open times. Make the repo private or drop names; confirm Jane's permission for the collector | Owner | Q-12 answered |

## 1. Sign-offs (fill the sheets, never edit gates by hand)

*   **Ops / billing:** in `data/clinic-signoff.csv`, for each Wave 1 clinic: `contract_2026_confirmed=yes`, `legal_entity`, `vendor_number`, `contract_confirmed_by`, `contract_confirmed_on` (YYYY-MM-DD), `worksafebc_list_matches` (yes, or correction_filed after asking WorkSafeBC to fix its provider list). Confirm WCB massage and acupuncture per clinic (`wcb_massage_confirmed_by/on`, `wcb_acupuncture_confirmed_by/on`) only if the clinic bills WorkSafeBC for them. Set `wcb_initial_treatment_id` if a clinic should use a type other than 442.
*   **Clinic manager:** `nap_signed_by/on` after checking name, address, unit, postal code, phone and hours against the Google Business Profile. Write `getting_here`, `parking`, `accessibility`, `check_in` (at least 8 words each, real details), `languages`. Team cards (`team_json`) only with each physiotherapist's written consent and a CHCPBC register check. Photos: upload to WordPress, put the URLs in `photo_hero_url` / `photo_inside_url`, and the consent owner in `photo_consent_by`.
*   **Clinical reviewer (registered physiotherapist):** open each official worksafebc.com page cited in `data/claims-register.csv` for the claims used on the pages, compare the wording, and fill `checked_by`, `checked_on`, `quote_matches=yes`. For STAFF_CONFIRM rows, edit the plain-language wording if needed before marking it. Put your name and credential in `data/review.json` `reviewer`.
*   **Marketing:** `url_plan_done_on` once that clinic's other WorkSafe sections are trimmed to one sentence plus a link; `tracking_added_on` once its keywords are tracked.

## 2. Build

From the `worksafe-seo/` folder:

```sh
node build/build_pages.mjs --mode preview     # look at pages/dist/<page>/preview.html; never paste from dist
node --test build/test/build_pages.test.mjs   # 12 checks must pass
node build/build_pages.mjs --mode publish     # writes pages/publish/<page>/fragment.html for pages that pass
node build/screenshot.mjs pages/publish pillar new-westminster richmond abbotsford
```

If publish prints `SKIP`, the line says exactly which gate, claim or check is missing.

## 3. Publish in WordPress (order matters)

1.  Coverage guide first (`/worksafebc-physiotherapy-what-is-covered/`, same URL), then the return-to-work article. After the article is live, set `live_pages.rtw` to true in `data/review.json` and rebuild, so the pillar links to it.
2.  Location pages: create each page as a child of `/worksafe-physiotherapy/` with the slug from `meta.json`. Full-width template. Add one Elementor HTML widget and paste `pages/publish/<page>/fragment.html`. Paste `schema.json` into a JSON-LD script block (or the SEO plugin's custom schema field). Set the SEO title, meta description and canonical from `meta.json`. Enqueue `pages/assets/worksafe.css` only on WorkSafe URLs.
3.  Rebuild in publish mode and re-paste the pillar, so its finder links to the new pages.
4.  Re-paste sibling pages whose nearby block changed.
5.  Add `/tag/worksafebc/` noindex 14 days after the Richmond page is indexed.

## 4. After publishing (same day)

*   Each URL returns 200, has one canonical (self) and one meta description, and is in the XML sitemap. View source and confirm `<meta name="robots">` allows indexing: turn off the noindex set while the page was a draft (`pages/DRAFT-README.md` step 5) before you click Publish, then check that URL Inspection reports "Indexing allowed".
*   Schema validates in the Rich Results Test and Schema.org validator; no duplicate clinic entities from the SEO plugin.
*   Every Book link opens the right clinic and the WCB Physio Initial Session in Jane. Every Call link dials the clinic.
*   GA4 DebugView shows `worksafe_book_click`, `worksafe_phone_click`, `worksafe_directions_click`, `worksafe_location_select` with `clinic_slug`, `placement`, `page_type` only. No ad pixel fires (GTM preview).
*   Phone check on real iOS Safari and Android Chrome: sticky bar hidden over the hero, visible after it, not covering the chat or translate buttons.
*   Search Console: URL Inspection, request indexing.

## 5. Reviews

*   Day 7: indexing, events, broken links.
*   Day 30: rankings for each clinic's own queries, which Synergy URL ranks (cannibalization rule), Jane WCB initial bookings vs the 8 weeks before. Decide Wave 1b (Newton, King George).
*   Day 60 and 90: trends and the pilot stop rule in `spec/design_draft.md` section 4.
*   Quarterly and on any WorkSafeBC physiotherapy bulletin: re-check claims; the build refuses claims checked more than 180 days ago.

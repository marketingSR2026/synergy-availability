# Goldfish review: resolution report (egm-resolve)

*   **Target:** `spec/design_draft.md` (v1, 2026-11-02)
*   **Protocol:** EGM review stages 5 to 9, uninterrupted mode. Stages ran in order; reviewers within a stage ran in parallel as fresh subagents that read the installed plugin's persona files (`egm@egm` 0.1.0) and standards.
*   **Reviewers:** zoom-out, comprehension, design critic, structural, style (stage 7), plus five domain Goldfish (doorway/scaled content, WorkSafeBC facts, technical SEO, CRO/UX/brand, privacy/compliance); intermediate zoom-out; implementation readiness, codebase details, style (stage 9).
*   **Raw reports:** `zoom_out_report.md`, `comprehension_report.md`, `critic_report.md`, `intermediate_zoom_out_report.md`, `implementation_readiness_report.md`. Every finding is in `all_findings.json`.
*   **Volume:** 32 Blocker, 183 Major and 98 Nit findings from 14 reviewers. After de-duplication the Blockers collapse into 14 issues (R1 to R14). All 14 are resolved in code, data or the spec. Majors are triaged below.

## Blockers (all resolved)

| ID | Issue (raised by) | Decision | Where it is fixed | Verified by |
|---|---|---|---|---|
| R1 | Pillar bypassed the per-clinic contract gate: "19+ clinics" title, WCB booking links for all 19, including high-risk Cedar Hills and Clayton Corners (zoom-out, design, doorway, facts, tech SEO, CRO, privacy: 7 reviewers) | PROPOSE FIX. Every WCB mention of a clinic (pillar finder, nearby cards, local FAQ, compact finder, massage lists) reads the clinic's G1 status. Unconfirmed clinics are not listed in publish mode. Pillar title and meta carry no count. Pillar billing wording uses WorkSafeBC's general rule (WSBC-11) | `pages/src/pillar.mjs`, `pages/src/location.mjs`, `build/build_pages.mjs` (`listInFinder`, `nearbyWcb`, `clinicCard`) | Tests 2 and 3 |
| R2 | Nearby-clinic data corrupt for 15 of 19 clinics (regex matched street numbers) (doorway, CRO, codebase, tech SEO) | PROPOSE FIX. Parser splits entries on " ; " and anchors each match; merge exits if any nearby name does not resolve to a clinic | `build/merge_locations.py` | Merge run 2026-11-02: 19/19 clinics, 76/76 nearby entries resolved |
| R3 | Human input stored in a regenerated file; sign-off spread over three stores (zoom-out, codebase) | PROPOSE FIX. Machine data stays in `worksafe-locations.json`. Human-owned facts and gates live only in `data/clinic-signoff.csv`, which merge never writes. Claim checks live in the register (`checked_by`, `checked_on`, `quote_matches`, `expires_on`). `claims-signoff.json` and `photos.json` removed. Site-level items in `data/review.json` | data files, build join | Test 6 |
| R4 | Preview fragments with placeholders could be pasted into WordPress (doorway, facts, codebase, style) | PROPOSE FIX. Preview mode writes `preview.html` only. Only `--mode publish` writes `fragment.html`, into `pages/publish/`. Publish output is linted for placeholders | `build/build_pages.mjs` | Test 11 |
| R5 | G3 had three conflicting definitions and counted fields that never render (comprehension, doorway, codebase) | PROPOSE FIX. One definition: getting_here, accessibility, check_in and parking each at least 8 words; languages filled; a consented team card or consented clinic photo; at least 120 words of clinic-only facts in total. Plus a measured publish blocker: 5-word-shingle similarity to any other location page in the run at most 0.40. `nearby_workplaces` dropped (doorway and EAPP-implication risk) | `clinicGates()`, similarity check | Tests 9 and 12 (fixture pages score under 0.40) |
| R6 | No Risks and Mitigations section (design, structural) | PROPOSE FIX. Added to the spec with triggers, owners and time to mitigate | spec | n/a |
| R7 | D1 rationale claimed both head terms show a local pack (style) | PROPOSE FIX. Corrected: `wcb physiotherapy` shows a pack (research/06); `worksafebc physiotherapy` showed none in the Vancouver SERP (research/08). D1 stands on the menu link and finder role | spec §1 | n/a |
| R8 | Wrong claim ids for direct billing and fees; SYN-01 signed once for all clinics (facts, doorway) | PROPOSE FIX. Direct billing is SYN-08 and needs the clinic's G1. Fees use WSBC-23/24 and SYN-09. Contract evidence is per clinic (legal entity, vendor number, who confirmed, ISO date, provider-list match) | `contractClaim()`, `clinic-signoff.csv` | Test 6 |
| R9 | WorkSafe pages inherit ad pixels, session replay and chat; a page view itself suggests a work injury (privacy) | PROPOSE FIX. New site-level gate G6: GTM excludes Meta pixels, ad and remarketing tags, session replay and chat on WorkSafe URLs; Google signals off. No page publishes without it | `review.json`, build | Test 8 |
| R10 | Known-wrong WorkSafeBC copy stays live elsewhere on the site (privacy, facts) | PROPOSE FIX. Week-1 site cleanup, independent of waves: remove SYN-02, 03, 04, 06, 11, 14 wording everywhere. Narrow exception to the ICBC no-change rule for WorkSafe sentences on mixed pages only | spec §3, RUNBOOK | Staff checklist |
| R11 | No test plan; the build is the only enforcement (implementation readiness) | PROPOSE FIX. `build/test/build_pages.test.mjs` (node:test, temp fixtures, real data untouched): 12 cases | build/test | 12/12 pass |
| R12 | Implementation plan described files that do not match the code (implementation readiness, codebase, style) | PROPOSE FIX. Plan rewritten as current state plus remaining work | spec | n/a |
| R13 | No rollout order; pillar linked a not-yet-live article (implementation readiness) | PROPOSE FIX. Links to the guide and RTW article render only when `review.json` marks them live. Rollout order added | spec, build `link()` | Preview: RTW links absent while `rtw: false` |
| R14 | Sign-off accepted empty strings (codebase) | PROPOSE FIX. Gates and claim checks require non-empty names and ISO dates; claim checks expire after 180 days or at `expires_on` | build | Tests 6 and 7 |

## Majors: triage

| Theme | Decision | Notes |
|---|---|---|
| Massage and acupuncture promoted from Jane bookability alone (doorway, facts, CRO, privacy) | ACCEPT | Shown only when ops confirms the clinic bills WorkSafeBC for that service (`wcb_massage_confirmed_*`, `wcb_acupuncture_confirmed_*`). Test 10 |
| Per-claim verification for OK rows too (facts, privacy) | ACCEPT | Every claim used needs `checked_by`, `checked_on`, `quote_matches=yes`. Rate rows expire 2027-03-31 |
| Referral wording overstated (facts) | ACCEPT | FAQ now leads with WSBC-10 wording; the "no referral" sentence stays tagged WSBC-16 (pending) |
| Cost answers one-sided (privacy, facts) | ACCEPT | "Will I pay" answer covers accepted, pending (with Synergy policy SYN-PEND) and non-claim body areas (WSBC-25) |
| WSBC-49 checklist reproduced WorkSafeBC's reporting list (facts) | ACCEPT | Replaced with a first-visit checklist plus a link to WorkSafeBC's own reporting page |
| Hero too tall on phones; finder too far down (CRO) | ACCEPT | Shorter ledes, report-first line under the CTAs, finder moved to band 3, area chips in the hero. Fold check added to `build/screenshot.mjs`: Book and Call visible at 390x664 on the pillar and all 3 Wave 1 pages |
| Pillar needs a Surrey signal; Surrey location titles compete (doorway, tech SEO) | ACCEPT | Finder heading "WorkSafeBC physiotherapy in Surrey"; ", Surrey" removed from location titles (kept in H1 and address) |
| Meta hours summary misleading (doorway) | ACCEPT | `hoursSummary()` covers all 7 days and the latest close |
| Hours and massage FAQs repeated on every page (doorway) | ACCEPT | Local FAQ is now parking, languages, confirmed services and nearest contracted clinics |
| Entity @id strategy (tech SEO) | ACCEPT | Clinic node `@id` is `https://synergyrehabilitation.ca/#clinic-<jane-slug>` with `url` set to the general clinic page; the WorkSafe page is `about` it |
| "approved" wording (privacy) | ACCEPT | Banned by lint ("WorkSafeBC contracts providers") |
| Inter adds a new font (zoom-out 2, CRO) | ACCEPT | Body font now follows the theme's Elementor text font with Montserrat fallback; no new font request |
| Close-pair pilot missing (doorway) | ACCEPT | Wave 1b: Newton and King George (2.4 km apart) after Wave 1's day-30 review |
| Primary measures too heavy (zoom-out 2, tech SEO) | ACCEPT | Primary: Search Console page-level data and Jane counts of "WCB Physio Initial Session" bookings per clinic per week (aggregate counts only). SE Ranking is secondary; baseline is a 14-day median |
| Header "BOOK NOW" competes and sends workers to the general booking page (CRO) | ACCEPT | RUNBOOK: Elementor display condition points it to `#clinics` or the clinic's WCB link on WorkSafe URLs |
| Theme double canonical and double meta description (tech SEO) | ACCEPT | Pre-launch check in RUNBOOK; publish blocked by staff checklist until one emitter is disabled |
| Collector reads Jane booking pages; repo is public and its data branch lists practitioner names and schedules (zoom-out 2, privacy) | ESCALATE | Outside this project's code, but a real PIPA and Jane terms issue. Reported to the owner as the top action. Page content no longer depends on the collector at publish time: services need ops confirmation |
| Replace static fragments with WordPress-native rendering (zoom-out, zoom-out 2) | DEFER | Pilot keeps reviewed static fragments (4 to 6 pages). Decide JetEngine/shortcode rendering before Wave 2, using pilot results. Recorded in Alternatives |
| Drop the scoped stylesheet for Elementor widgets (zoom-out 2) | CONTEST | The notch cards, steps and finder are not available as kit widgets, and the stylesheet is about 8 KB gzipped, scoped, with no JS. Kept |
| Narrow the document to the pilot only (zoom-out 2) | PARTIAL | Wave 2 and 3 rules stay as gated criteria, not commitments; scale decision moves to the day-90 review |
| Live-page audit after paste (zoom-out 2) | DEFER | Needs network access to the live site (blocked here). Listed as a next action |

## Remaining risks accepted for now

*   Every WorkSafeBC fact was verified from search-result text, not by opening worksafebc.com (network blocked in this environment). Nothing can publish until a staff member opens each page and records the check.
*   Similarity is reported on the preview build at 0.48 to 0.54 because clinic facts are empty placeholders. The 0.40 limit blocks publishing until real facts are filled; the test fixture shows it is achievable with about 150 words of clinic facts.

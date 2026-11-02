# WorkSafeBC SEO Program: Project State

Last updated: 2026-11-02 (session 1)

## Goal
Build the most useful, trustworthy and measurable WorkSafeBC physiotherapy search presence across Synergy's verified, eligible clinics, without doorway pages and without hurting ICBC or generic physiotherapy rankings.

## Scope rule (user, 2026-11-02): WORKSAFE ONLY
- Every page, keyword target, CTA, FAQ and schema item is about WorkSafeBC / WCB workplace-injury care only.
- No ICBC, private-pay or extended-health content, offers or CTAs on these pages. ICBC pages are an internal design and structure reference only.
- Keyword map targets WorkSafe / WCB / work-injury intent only. Generic physiotherapy and ICBC volumes are context, never page targets.
- Cross-links go only to WorkSafe pages, WorkSafe-relevant service pages and official WorkSafeBC resources.

## Environment (verified 2026-11-02)
- Screenshot #1 tool: claude-seo (AgriciDaniel/claude-seo). Already installed as plugin `claude-seo@synced` v2.4.0. Verified loaded.
- Elephant-Goldfish Model: `claude plugin marketplace add google/elephant-goldfish-model` + `claude plugin install egm@egm` run 2026-11-02. Verified: `egm@egm` v0.1.0 enabled. Skills load as `/egm:*` in the NEXT session. This session runs the EGM review protocol by reading the installed plugin's own reviewer persona files into fresh subagents.
- JEV: implemented as the `synergy-decision-making` skill (decision-engine.md, compliance.md, brand-system.md). No separate programmatic JEV runtime found.
- Network policy: direct fetch (curl and WebFetch) to synergyrehabilitation.ca, worksafebc.com, threads.com is DENIED in this cloud environment. Workaround: SE Ranking, Ahrefs, Semrush MCP crawls and WebSearch summaries. Fix: add these hosts under Allowed domains in the environment network settings.
- Connected: SE Ranking (2 projects, ~9,300 API units, subscription ends 2026-11-06), Ahrefs, Semrush, Google Drive, Canva, Supermetrics, Gmail, Calendar.
- Not connected: WordPress (connect_incomplete), Google Keyword Planner (no direct tool), GSC/GA4 direct (check via Supermetrics/Ahrefs).

## Folder map
- research/  raw evidence from each specialist agent
- data/      keyword master dataset, location matrix, claims register
- spec/      Elephant design spec (architecture, templates, content rules)
- egm/       Goldfish review reports
- pages/     WordPress-ready page builds
- previews/  mobile + desktop screenshots

## Status (2026-11-02, end of session 1)
- [x] Phase 0 install + capability inventory (claude-seo present; EGM installed)
- [x] Research: 9 specialists + completeness critic (research/01-09)
- [x] Spec drafted (spec/design_draft.md)
- [x] EGM Goldfish review stages 5-9 + 5 domain lenses; 14 distinct blockers resolved (egm/goldfish_review_report.md)
- [x] Gated build, templates, 12 tests, previews (pillar + 19 clinics)
- [x] Keyword map URL targets, 19-location matrix, RUNBOOK, REPORT
- [ ] Coverage guide + RTW article modules (pages/src/guide.mjs, rtw.mjs): drafting
- [ ] Staff sign-offs (clinic-signoff.csv, claim checks, review.json) -> publish mode
- [ ] WordPress paste + post-publish checks (no WordPress access in this environment)

## How to resume
1. Read REPORT.md section 5 (next actions) and RUNBOOK.md.
2. `node build/build_pages.mjs --mode preview` then `node --test build/test/build_pages.test.mjs`.
3. If machine data needs refreshing: `git show origin/data:availability.json > /tmp/a.json && python3 -I build/merge_locations.py /tmp/a.json` (never touches clinic-signoff.csv), then `python3 -I build/map_keywords.py` and `python3 -I build/location_matrix.py`.
4. EGM skills are available as /egm:egm-review etc. in new sessions.

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

## Status
- [x] Phase 0 install + capability inventory
- [ ] Phase 2-6 research (running)
- [ ] Phase 7 architecture spec
- [ ] EGM review
- [ ] Build pillar + pilot pages
- [ ] QA + previews

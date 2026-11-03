# Handoff: add the WorkSafe pages to WordPress as drafts using my Chrome

Paste the prompt below into Claude Code running on your computer (Claude Desktop, or `claude` in a terminal) with the Claude in Chrome extension connected and signed in to WordPress admin for synergyrehabilitation.ca.

---

**Prompt**

Use my Chrome (Claude in Chrome) to add WordPress DRAFT pages for synergyrehabilitation.ca. Never publish.

Setup:
1. `git clone https://github.com/marketingSR2026/synergy-availability && cd synergy-availability && git checkout claude/nice-dijkstra-9zwtkw`
2. `cd worksafe-seo && node build/build_pages.mjs --mode draft` (writes `pages/draft/<page>/fragment.html`, `meta.json`).
3. Read `pages/DRAFT-README.md` and follow it exactly.

Pages, in this order (stop after the first one and show me the WordPress preview before doing the rest):
1. `pillar` as a NEW draft page titled "WorkSafeBC physiotherapy (draft 2026)". Do not open or edit the live `/worksafe-physiotherapy/` page.
2. `guide` as a NEW draft page. Do not edit the live `/worksafebc-physiotherapy-what-is-covered/` page.
3. `rtw` as a new draft page.
4. `new-westminster`, `richmond`, `abbotsford` as new draft pages.

For each page in WordPress admin (wp-admin > Pages > Add New, Elementor editor):
- Title from `meta.json` `h1`. Leave the slug as WordPress suggests for drafts; do not take a live URL.
- Add one Elementor HTML widget and paste the whole `fragment.html` (it starts with the yellow "DRAFT. Do not publish" banner; keep it).
- Add the contents of `pages/assets/worksafe.css` to that page's Custom CSS only.
- In the SEO plugin, set the title and description from `meta.json` and set noindex.
- Click **Save Draft** (or Elementor "Save as Draft"). Never click Publish, Update on a live page, or Schedule.
- Record the draft's edit URL and preview URL in `pages/draft/wordpress-drafts.md`.

Safety rules:
- If you only see Publish/Update and cannot find Save Draft, stop and ask me.
- Do not change menus, settings, plugins, the theme, Google Tag Manager or any existing page.
- Do not trigger delete or trash actions.
- If WordPress asks to log in or shows a permission prompt, stop and ask me.

Done when: the 7 drafts exist with status Draft, each shows the draft banner in preview, and `wordpress-drafts.md` lists their links.

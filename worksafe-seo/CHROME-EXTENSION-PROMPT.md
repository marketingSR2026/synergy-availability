# One prompt for Claude in Chrome: install the WorkSafe pages as WordPress drafts

Before you paste it: open Chrome, sign in to https://synergyrehabilitation.ca/wp-admin as an Administrator, and keep that tab open.

```text
You are installing Synergy Rehabilitation's new WorkSafeBC pages into WordPress at synergyrehabilitation.ca as DRAFTS, then checking them and auditing the site's technical setup. Work in my Chrome, where I am signed in to wp-admin.

ABSOLUTE RULES
1. Never publish, schedule, or set any page to Public. Every page you create must have status "draft". If a screen only offers Publish or Update on a live page, stop and ask me.
2. Never edit, update or trash an existing published page, menu, widget, theme, plugin, Elementor template, setting, Google Tag Manager container, or Google Business Profile. Phase 4 is read-only. Phase 5 is a list for me; do not do it.
3. Never click "Edit with Elementor" on the new drafts: Elementor would replace their content. Use the WordPress block editor only.
4. Do not trigger delete, trash or bulk actions, and avoid anything that opens a browser confirm dialog.
5. If a step fails twice, or a login or permission prompt appears, stop and tell me what happened.
6. Keep a running log. At the end, give me the final report described in Phase 6.

SOURCE FILES (public, read them with fetch or by opening the URL)
Manifest: https://raw.githubusercontent.com/marketingSR2026/synergy-availability/refs/heads/claude/nice-dijkstra-9zwtkw/worksafe-seo/pages/draft/manifest.json
Each manifest entry has: id, kind, priority, wp_title, draft_slug, parent, replaces_live_url, final_path, seo_title, seo_description, wp_content_url (one Custom HTML block holding the page's CSS, the page itself and its JSON-LD schema), schema_url, meta_url.
Install only priority 1 to 6 (pillar, guide, rtw, new-westminster, richmond, abbotsford). Do not install the other 16 clinic pages unless I ask.

PHASE 0: CHECKS (read-only)
a. Open https://synergyrehabilitation.ca/wp-admin/post-new.php?post_type=page and confirm the block editor loads. If the Classic Editor or only Elementor is available, tell me and continue only if the REST API call in Phase 1 works.
b. Note which SEO plugin is active (Yoast, Rank Math, All in One SEO, SEOPress or other) from the editor sidebar or Plugins page (look only, change nothing).
c. Note whether a live page exists at /worksafe-physiotherapy/ (it should) and /worksafebc-physiotherapy-what-is-covered/ (it should). Do not open their editors.

PHASE 1: CREATE THE DRAFTS
Stay on the wp-admin "Add New Page" tab. Do not type anything into the editor. Run this script in the page with the javascript tool. First run it as is (DRY_RUN true, ONLY pillar) and show me the result. Then set DRY_RUN false and run it for pillar only. After Phase 2 and 3 pass for the pillar, run it again with ONLY set to ['guide','rtw','new-westminster','richmond','abbotsford'].

(async () => {
  const MANIFEST = 'https://raw.githubusercontent.com/marketingSR2026/synergy-availability/refs/heads/claude/nice-dijkstra-9zwtkw/worksafe-seo/pages/draft/manifest.json';
  const ONLY = ['pillar'];
  const DRY_RUN = true;
  let nonce = window.wpApiSettings && window.wpApiSettings.nonce;
  if (!nonce) nonce = (await (await fetch('/wp-admin/admin-ajax.php?action=rest-nonce', { credentials: 'same-origin' })).text()).trim();
  const api = async (path, opts = {}) => {
    const r = await fetch('/wp-json/wp/v2/' + path, { credentials: 'same-origin', ...opts, headers: { 'X-WP-Nonce': nonce, 'Content-Type': 'application/json' } });
    const j = await r.json();
    if (!r.ok) throw new Error(path + ' ' + r.status + ' ' + JSON.stringify(j).slice(0, 300));
    return j;
  };
  const manifest = await (await fetch(MANIFEST)).json();
  const live = (await api('pages?slug=worksafe-physiotherapy&status=publish&_fields=id,link'))[0];
  const out = [];
  for (const p of manifest.filter((x) => ONLY.includes(x.id))) {
    const parent = p.kind === 'location' && live ? live.id : 0;
    const existing = await api('pages?slug=' + p.draft_slug + '&status=draft,pending,private,publish&context=edit&_fields=id,status,parent,link');
    const dup = existing.find((e) => e.parent === parent);
    if (dup) { out.push({ id: p.id, skipped: 'already exists', wp_id: dup.id, status: dup.status }); continue; }
    const content = await (await fetch(p.wp_content_url)).text();
    const body = { title: p.wp_title, slug: p.draft_slug, status: 'draft', parent, content, template: 'elementor_header_footer' };
    if (DRY_RUN) { out.push({ id: p.id, would_create: p.wp_title, slug: p.draft_slug, parent, bytes: content.length }); continue; }
    let page;
    try { page = await api('pages', { method: 'POST', body: JSON.stringify(body) }); }
    catch (e) { if (/template/i.test(e.message)) { delete body.template; page = await api('pages', { method: 'POST', body: JSON.stringify(body) }); } else throw e; }
    if (page.status !== 'draft') throw new Error('STOP: page ' + page.id + ' status is ' + page.status);
    const saved = await api('pages/' + page.id + '?context=edit&_fields=content');
    out.push({ id: p.id, wp_id: page.id, status: page.status, template: body.template || 'default',
      kept_style: saved.content.raw.includes('<style>'), kept_schema: saved.content.raw.includes('application/ld+json'),
      edit: '/wp-admin/post.php?post=' + page.id + '&action=edit', seo_title: p.seo_title, seo_description: p.seo_description });
  }
  console.log('[WS-INSTALL]', JSON.stringify(out));
  return out;
})();

If kept_style or kept_schema is false, WordPress stripped code (missing unfiltered_html). Stop and tell me.

PHASE 2: SEO PLUGIN FIELDS (each new draft)
Open each draft's edit link (block editor). In the SEO plugin panel:
- SEO title = seo_title from the manifest. Meta description = seo_description.
- Robots: set noindex and nofollow while it is a draft.
- Leave canonical empty (it will be set to final_path when the page goes live).
- If the plugin adds its own schema type for the page, set it to "None" or "WebPage" only if that option exists in the page panel; otherwise leave it and report it.
- Page Attributes: confirm Template is "Elementor Full Width" (or the theme's full-width option) and, for clinic pages, Parent is the live "WorkSafeBC physiotherapy" page.
- Click Save draft. Never Publish.

PHASE 3: VERIFY EACH DRAFT
Open the draft's Preview. Then run this in the preview tab and record the result:

(() => { const q = (s) => [...document.querySelectorAll(s)];
  const page = document.querySelector('.sr-ws-page');
  return { banner: !!document.querySelector('.sr-ws-draft-banner'), h1: q('h1').map((h) => h.textContent.trim()),
    css_loaded: !!page && getComputedStyle(page).getPropertyValue('--sr-ws-blue-700').trim() === '#1c44a9',
    canonical_tags: q('link[rel=canonical]').length, meta_descriptions: q('meta[name=description]').length,
    robots: q('meta[name=robots]').map((m) => m.content), jsonld_blocks: q('script[type="application/ld+json"]').length,
    our_schema: q('script[type="application/ld+json"]').some((s) => s.textContent.includes('MedicalWebPage')),
    jane_locations: [...new Set(q('a[href*="janeapp.com/locations/"]').map((a) => a.href.split('/locations/')[1].split('/')[0]))],
    jane_wcb_type_442: q('a[href*="janeapp.com/locations/"]').every((a) => !a.href.includes('/treatment/') || a.href.includes('/treatment/442')),
    tel_links: [...new Set(q('a[href^="tel:"]').map((a) => a.getAttribute('href')))],
    horizontal_scroll: document.documentElement.scrollWidth > window.innerWidth,
    dashes: /[\u2014\u2013]/.test(page ? page.textContent : ''), icbc_mentions: /icbc/i.test(page ? page.textContent : '') }; })();

Pass rules:
- banner true, css_loaded true, our_schema true, horizontal_scroll false, dashes false, icbc_mentions false.
- Exactly one H1. If there are two (the theme title plus the page H1), report it; do not change theme settings.
- canonical_tags and meta_descriptions should each be 1. The site is known to output 2 of each; report the numbers.
- jsonld_blocks: report how many there are, and which come from the SEO plugin.
- Clinic pages: jane_locations must contain the clinic's own Jane slug (new-westminster, richmond, abbotsford). tel_links must include that clinic's phone.
- Click the main "Book a WCB assessment" button once on each clinic draft and confirm Jane opens the WCB Physio Initial Session for that clinic. Do not book anything; close the tab.
- Also look at the preview on a narrow window (about 390 px wide, or Chrome's device toolbar if you can) and confirm the Book and Call buttons are visible without scrolling.

Schema check (each of the 6 pages):
- Open the page's schema_url, copy the JSON, and paste it into https://validator.schema.org (Code snippet), then into https://search.google.com/test/rich-results (Code tab).
- Record errors and warnings. Expect info notes only; FAQ rich results are not shown for most sites.

PHASE 4: SITE TECHNICAL AUDIT (read-only, live site)
On https://synergyrehabilitation.ca/worksafe-physiotherapy/ and https://synergyrehabilitation.ca/ (view the source or run JS):
1. Count rel=canonical tags and meta description tags, and name which plugin outputs each (look for HTML comments like "This site is optimized with...").
2. List third-party scripts that load: Google Tag Manager ID, GA4 IDs, Meta pixel IDs, CrazyEgg, Contentsquare, LeadConnector chat, CallTrackingMetrics, GTranslate.
3. Note where the header "BOOK NOW" button links.
4. Check https://synergyrehabilitation.ca/tag/worksafebc/ for a robots meta tag (index or noindex).
5. In wp-admin Pages and Posts, search (read-only) for: "15 sessions", "10 sessions", "within 60 days", "user fee", "WorkSafeBC approved", "WCB approved", "mileage". List each page title, URL and the exact sentence.
6. Check https://synergyrehabilitation.ca/sitemap_index.xml (or /wp-sitemap.xml) and note which sitemap would include new pages.

PHASE 5: CHANGES I MUST APPROVE (do not do them, just list them with exact steps)
- Remove the wrong WorkSafe sentences found in Phase 4.5. Replace each with: "See how WorkSafeBC physiotherapy works: /worksafe-physiotherapy/".
- Disable one of the two SEO plugins' canonical and meta description output so each page has one.
- In Google Tag Manager: add an exception trigger so Meta pixels, ad remarketing, CrazyEgg, Contentsquare and the chat widget do not fire on /worksafe-physiotherapy/*, /worksafebc-physiotherapy-what-is-covered/ and /return-to-work-after-a-workplace-injury/. Prepare it only after I approve, and never publish the container without me.
- Header "BOOK NOW" on WorkSafe pages: point it to #clinics on the pillar and to the clinic's WCB booking link on clinic pages.
- Noindex /tag/worksafebc/ 14 days after the Richmond page goes live.

PHASE 6: FINAL REPORT (in chat)
1. A table with one row per draft: page id, WordPress ID, title, status (must be Draft), edit link, preview link, SEO fields set (yes/no), Phase 3 results (pass/fail with the failing item), schema errors.
2. The Phase 4 findings.
3. The Phase 5 list, ready for my approval.
4. Anything you could not do and why.

Remember: nothing goes live. These drafts are waiting for staff sign-off (clinic contracts, clinic facts, photos, and a physiotherapist's review of the WorkSafeBC facts). The yellow DRAFT banner stays on every page.
```

## Why it is built this way

- Pages are created by the WordPress REST API from inside your signed-in wp-admin tab, so the 125 KB pages are not typed by hand and the status is forced to `draft`.
- Each `wp-content.html` holds the scoped CSS, the page and its JSON-LD in one Custom HTML block, so schema and styling travel with the page.
- Clinic pages are created as children of the live `/worksafe-physiotherapy/` page, so their final URLs are already right; drafts are not public.
- The live pillar and coverage guide are not touched. Their new versions are separate drafts ending in "(2026 draft)".
- Source: `worksafe-seo/pages/draft/manifest.json` and `pages/draft/<page>/wp-content.html`, rebuilt by `node build/build_pages.mjs --mode draft`.

# Add the WorkSafe pages to WordPress as drafts (do not publish)

Use `pages/draft/<page>/`. Every fragment starts with a yellow "DRAFT. Do not publish" banner and shows dashed boxes where staff facts or sign-offs are missing, so a draft can never pass for a finished page.

Rebuild: `node build/build_pages.mjs --mode draft` (from `worksafe-seo/`).

## Steps (each page)

1. WordPress > Pages > Add New. Title: the `h1` in `meta.json`.
2. Page attributes: for clinic pages, set Parent to "WorkSafeBC physiotherapy". Slug: the last part of `path` in `meta.json`.
3. Elementor > full-width template > add one **HTML** widget > paste all of `fragment.html`.
4. Add `pages/assets/worksafe.css` to this page only (Elementor > Page settings > Custom CSS, or the theme's per-page CSS).
5. SEO plugin: paste title and meta description from `meta.json`; set **noindex** while it is a draft.
6. Click **Save Draft**. Never click Publish. Use Preview to check on a phone.

## Order

| Page | Folder | Existing URL? |
|---|---|---|
| WorkSafeBC physiotherapy (main page) | `pillar` | Yes, `/worksafe-physiotherapy/` is live with old copy. Do not paste over the live page. Create a new draft page (or a WordPress revision draft) and leave the live page as is |
| What WorkSafeBC covers (guide) | `guide` | Yes, `/worksafebc-physiotherapy-what-is-covered/` is live. Same rule: new draft, live page untouched |
| Return to work article | `rtw` | No, new draft |
| Clinic pages, Wave 1 | `new-westminster`, `richmond`, `abbotsford` | No, new drafts |
| Other clinic pages | the other 16 folders | No. Optional drafts for review only |

## Before anything goes live

Not now. Publishing needs `node build/build_pages.mjs --mode publish` to pass, which requires the contract, NAP, clinic facts, privacy gate and claim checks in `RUNBOOK.md`. Publish-mode fragments have no draft banner and no dashed boxes.

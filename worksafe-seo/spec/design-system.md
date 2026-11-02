# Synergy WorkSafeBC Design System

Version 1.0, 2026-11-02. Author role: UX/UI Design Director (WorkSafeBC SEO project).
Status: draft for EGM review. Scope: the WorkSafeBC pillar page and the location pages for verified eligible clinics. WorkSafe only (no ICBC, private pay or extended health UI).

| Deliverable | Path |
|---|---|
| This spec | `worksafe-seo/spec/design-system.md` |
| Production stylesheet (scoped, no JS) | `worksafe-seo/pages/assets/worksafe.css` |
| Component demo (placeholder copy, for reviewers) | `worksafe-seo/previews/design-system/component-demo.html` + `component-demo-390.png`, `component-demo-1280.png`, `sticky-bar-390-scrolled.png` |

Status labels used throughout: **KNOWN** (verified with a tool or a file), **LIKELY** (strong inference), **UNKNOWN** (could not be checked), **ASSUMPTION** (a design decision or a placeholder value that someone must confirm).

---

## 1. Evidence log

| # | Item | Finding | Status | Source |
|---|---|---|---|---|
| E1 | Brand rules | Primary #1c44a9 (~60%), accent #1eb831 (~30%), neutrals white and #f5f7fa (~10%). Hover goes green. One geometric sans family (Poppins or Montserrat headings, Inter or Open Sans body). Headings 600 to 700, body 400, CTAs uppercase 600. No serif or script. No pure black text. WCAG AA. Mobile first, one primary CTA per view, 16px+ body, big tap targets. Say "19+ locations", show synergyrehab.ca, no em dashes, never modify the logo | KNOWN | Task brief; `synergy-decision-making/references/brand-system.md` (installed skill) |
| E2 | Live widget CSS | Tokens, radii, spacing and conventions extracted (section 2) | KNOWN | Local file `scratchpad/zip/synergy-next-availability/assets/css/availability.css`, `templates/compact.php`, `templates/full.php` |
| E3 | Live site stack | Hello Elementor + Elementor Pro; Montserrat self-hosted by Elementor; Spline Sans Mono and Source Sans Pro also loaded; GSAP 3.12.5 + ScrollTrigger + Lenis; 44 JS files / 3.08 MB on the ICBC hub; LeadConnector chat; GTranslate floating switcher; CallTrackingMetrics (`tctm.co`) | KNOWN (from SE Ranking audit 401878 asset list, recorded by the earlier specialist) | `research/02-icbc-worksafe-content.md` section 2.6 |
| E4 | Existing brand graphics | Pixel-sampled from Drive Yelp portfolio PNGs: blue #1c44a9, green #1eb831, navy text #16233d, body grey #4d5b73, divider #e3e9f4. Patterns: uppercase letter-spaced eyebrow, two-tone headline ("Three steps. That's it."), numbered rounded-square step tiles, green pill badge, dot-separated proof line | KNOWN | `research/02-icbc-worksafe-content.md` section 2.7 |
| E5 | Drive brand guideline doc (2018 to 2024) | Lists "Blue 27449F", "Green 39B73E" and Alegreya Sans SC. Conflicts with E1. **E1 wins** (mandatory). Its ICBC-era claims must not be reused | KNOWN | Drive doc `10AyAkePMpl85YV8jkEN6l3O-ucnr1mlAUAeRm-Hbqk4` via `research/03-drive-reports.md` section 3.2; re-found today with `mcp__Google_Drive__search_files` |
| E6 | Official logo files in Drive | 7 logo files found, no SVG (section 13.1) | KNOWN | `mcp__Google_Drive__search_files` (title contains 'logo', image/zip/svg mime types; second query for svg and 'brand') |
| E7 | Logo PNG geometry | `Synergy Rehab Logo.png` is 975 x 410 px, 8-bit RGBA (transparent), aspect 2.378:1, PNG tEXt "Creation Time 2023:02:01 12:26:09" | KNOWN | `mcp__Google_Drive__download_file_content` (id `1j22GFCzPCJG3IoPfspIwkIooOP_n4jCw`), IHDR decoded locally. The image itself was not rendered or viewed, so its colours are UNKNOWN |
| E8 | Canva brand kit | One kit: "Synergy RehabHR's team", id `kAGOa-MPisQ`, thumbnail 200 x 83 px (aspect 2.41, close to the logo PNG, so the thumbnail is LIKELY the logo). Colours, fonts and logo files inside the kit: **Not Available** (`list-brand-kits` returns only id, name and thumbnail; `get-assets` needs asset ids from a design; downloading the thumbnail failed with proxy 403 on media.canva.com) | KNOWN / Not Available | `mcp__Canva__list-brand-kits` |
| E9 | Logo URL on the live site | **Not Available.** WebSearch returned no wp-content/uploads logo URL; direct fetch of synergyrehabilitation.ca is blocked in this environment | KNOWN (absence) | `WebSearch` "synergyrehabilitation.ca logo wp-content uploads" |
| E10 | bee_ui.ux Threads profile | **Blocked.** `WebFetch https://www.threads.com/@bee_ui.ux` failed with `getaddrinfo ENOTFOUND` (host outside the session's allowed domains). One attempt, not retried. Fix: allow threads.com in the environment network settings | KNOWN | `WebFetch` |
| E11 | UI references | 5 uploaded screenshots read: `7d4c9f4a` (claude-seo card UI, 2576 x 1190), `5c96378d`, `9f6952a7`, `e5ab4e55`, `9b0e8473` (bee_ui.ux wireframes as Threads app screenshots, 1190 x 2576) | KNOWN | `Read` tool on `/root/.claude/uploads/.../*.png` |
| E12 | Jane booking deep link | All 19 clinics: `https://synergyrehab.janeapp.com/locations/<slug>/book#/discipline/3/treatment/442` for WCB physio initial | KNOWN | `data/locations-master.csv` column `jane_wcb_physio_initial_url` (19 of 19 identical pattern) |
| E13 | Claims register | 67 claims: 26 VERIFIED, 31 PARTIAL, 7 CONFLICT, 3 UNVERIFIED | KNOWN | `data/claims-register.csv` |
| E14 | Location data gaps | GBP address, phone, hours, lat/lng are Not Available for most clinics (GBP connected for 3 of 19); site phone present for 18 of 19, some with conflicts | KNOWN | `data/locations-master.csv` |
| E15 | Contrast ratios | Computed with the WCAG 2.x relative luminance formula | KNOWN (computed) | Script `scratchpad/ds/contrast.py` |
| E16 | Render test | CSS rendered in headless Chrome for Testing 153.0.8010.12 at 390 x 844 and 1280 wide. No horizontal overflow at either width. Sticky bar computed style at scrollY 0: `visibility:hidden`, translateY 80px; at scrollY 2600: visible, no transform | KNOWN | Chrome DevTools Protocol script `scratchpad/ds/cdp/shot.mjs`; screenshots in `previews/design-system/` |
| E17 | Token hygiene | 161 class tokens in selectors, 0 without the `sr-ws-` prefix. All 17 hex values sit in the primitive layer. 0 em or en dashes. 0 pure black values. Size 59.0 KB raw, 48.4 KB minified, 7.9 KB minified + gzip | KNOWN | Local lint script; `ui-ux-pro-max/design-system/scripts/validate-tokens.cjs` |

---

## 2. What the live site already does (availability widget)

The `[synergy_availability]` widget is the only Synergy front-end code available locally. The WorkSafe system reuses its colour values and accessibility habits so the two sit together on one page.

| Aspect | Widget value (KNOWN, `availability.css`) | Carried into `worksafe.css` |
|---|---|---|
| Naming | BEM: block `.synav`, elements `.synav__title`, modifiers `.synav--compact`, state class `.is-stale`, JS hooks on `data-*` attributes, ARIA state `[aria-pressed]` | Same BEM grammar with prefix `sr-ws-`: `.sr-ws-hero__panel`, `.sr-ws-btn--primary`. No JS hooks needed |
| Tokens scope | Custom properties on the block (`.synav{--b:...}`), not `:root` | Tokens on `.sr-ws-page`, not `:root` |
| Colours | `--b #1c44a9`, `--g #1eb831`, `--gd #13791f`, `--gh #0f6419`, `--bg #f5f7fa`, `--tx #1f2a44`, `--mu #4a5675`, `--bd #d9e0ee`, stale text #8a4b00 | All kept as primitives (`blue-700`, `green-500`, `green-700`, `green-800`, `gray-50`, `navy-800`, `slate-600`, `slate-300`, `amber-800`) |
| Radii | 10px controls (selects, chips, buttons, summary), 12px cards and messages | `radius-sm` 10px kept for controls; cards move to 14 / 20 / 28px for the bee_ui softer look |
| Spacing | 4, 8, 12, 16, 20px; container padding 16px | 4px base scale (section 6) |
| Tap targets | `min-height:48px` on selects, chips, buttons, summary; 44px "more" link | 48px minimum, 52px primary CTA |
| Shadows | None (flat, 1px borders) | Light navy-tinted shadows for cards and floating mini-cards only |
| Type | `font-family:inherit`; title 1.375rem/700; labels .875rem/600; day label .75rem/600 uppercase; button .875rem/600 uppercase .05em | Own family stack; 14px floor for any text; CTAs 16px uppercase 600 .04em |
| Breakpoints | 600px, 1024px; max-width 960px | 600, 900, 1200px; max content width 1200px |
| Focus | `outline:3px solid #1c44a9; outline-offset:2px` | Same, but white on blue surfaces |
| Hover | Border to green, text to `--gd` | Same rule everywhere ("hover goes green") |
| Motion | `prefers-reduced-motion` disables transitions | Same, plus scroll-driven sticky bar is switched off |
| Button | White on #13791f (5.55:1), hover #0f6419 (7.35:1): passes AA | WorkSafe primary uses the true brand green #1eb831 with a navy label (5.93:1) and hovers to #13791f with white (5.55:1) |

Two accessibility findings in the live widget (KNOWN, computed; log for a later widget release, not blocking):
1. Select and summary borders `#d9e0ee` on white are **1.33:1**, below the WCAG 1.4.11 3:1 minimum for control boundaries. Use #77849f (3.76:1).
2. `.synav__day` is 12px (`.75rem`). Raise to 14px.

---

## 3. Design principles

1. **Task first.** An injured worker wants to know: can I go, what do I bring, where, when. Every band answers one of those and offers at most one primary action.
2. **Two colours, used with intent.** Blue builds structure and trust; green means "act". Green is never decoration on text.
3. **Calm, clinical, modern.** Soft rounded geometry from the bee_ui.ux references, no black, no heavy shadows, no motion for its own sake.
4. **Distinct by data, not by decoration.** Location pages differ because of real clinic facts (address, hours, team, transit, photos), placed in components built to hold them. Decorative variety is not distinctness.
5. **Zero JavaScript.** Every component works with HTML and CSS only. Faster pages and nothing to break inside Elementor.
6. **Scoped and safe.** Nothing in `worksafe.css` can restyle the theme, the header, the footer or other plugins.

---

## 4. Colour

### 4.1 Primitive palette

| Token | Hex | Role | Share | Source | Status |
|---|---|---|---|---|---|
| `--sr-ws-blue-700` | #1c44a9 | **Brand primary.** Headings, bands, hero panel, step tiles, links | ~60% | E1, E2, E4 | KNOWN |
| `--sr-ws-blue-800` | #15337f | Pressed state of blue surfaces only (and hero image placeholder) | state | Derived shade of brand blue | ASSUMPTION |
| `--sr-ws-blue-50` | #eaf0fb | Tint: callouts, icon wells, FAQ indicator, pills | within the 10% | Derived tint | ASSUMPTION |
| `--sr-ws-green-500` | #1eb831 | **Brand accent.** CTA fill, eyebrow dots, check marks, icon badges on blue, hover borders | ~30% | E1, E2, E4 | KNOWN |
| `--sr-ws-green-700` | #13791f | AA-safe green for text, hover fills, accent words on light | state | Live widget `--gd` | KNOWN |
| `--sr-ws-green-800` | #0f6419 | Pressed CTA | state | Live widget `--gh` | KNOWN |
| `--sr-ws-green-50` | #e9f8eb | Tint: success pills, mini-card icon wells | within the 10% | Derived tint | ASSUMPTION |
| `--sr-ws-navy-900` | #16233d | Ink: strongest text, CTA label on green, knob circle | text | Brand graphics navy (E4) | KNOWN |
| `--sr-ws-navy-800` | #1f2a44 | Body text | text | Live widget `--tx` | KNOWN |
| `--sr-ws-slate-600` | #4a5675 | Muted text | text | Live widget `--mu` | KNOWN |
| `--sr-ws-slate-500` | #77849f | Control boundaries (chips, location selector) | border | New, chosen for 3:1 | ASSUMPTION |
| `--sr-ws-slate-300` | #d9e0ee | Decorative hairlines, card outlines | border | Live widget `--bd` | KNOWN |
| `--sr-ws-slate-200` | #e3e9f4 | Dividers, disabled fill | border | Brand graphics divider (E4) | KNOWN |
| `--sr-ws-gray-50` | #f5f7fa | **Brand neutral** soft band and surfaces | ~10% | E1 | KNOWN |
| `--sr-ws-white` | #ffffff | **Brand neutral** | ~10% | E1 | KNOWN |
| `--sr-ws-blue-100-on-blue` | #dbe4f7 | Muted text on blue bands | text | Derived tint | ASSUMPTION |
| `--sr-ws-amber-800` | #8a4b00 | Warning text only (for example a stale "as of" date) | rare | Live widget `.is-stale` | KNOWN |

Tints and shades of the two brand hues are allowed only for states, surfaces and text legibility. No third hue is introduced. Amber exists only for a warning message and never as decoration.

**60/30/10 in practice.** Count by visual weight of colour, not by area of white space. Blue: hero panel, every other band, headings, links, step tiles. Green: every CTA, eyebrow dots, ticks, icon badges on blue bands, hover feedback. Neutrals: white and #f5f7fa bands and cards.

### 4.2 Semantic tokens by surface context

Semantic tokens switch automatically with the surface. Any element inside `.sr-ws-band--blue`, `.sr-ws-hero__panel`, `.sr-ws-card--blue` or `.sr-ws-split__body` gets the blue set; cards, FAQ rows, the selector and the sticky bar always reset to the light set.

| Semantic token | Light context | Blue context |
|---|---|---|
| `--sr-ws-c-heading` | blue-700 | white |
| `--sr-ws-c-text` | navy-800 | white |
| `--sr-ws-c-muted` | slate-600 | blue-100-on-blue |
| `--sr-ws-c-eyebrow` (eyebrows, labels, TIP) | green-700 | white (green dot stays) |
| `--sr-ws-c-accent-text` (`.sr-ws-accent`) | green-700 | green-500, **large text only** |
| `--sr-ws-c-link` / hover | blue-700 / green-700 | white / white + green underline |
| `--sr-ws-c-focus` | blue-700 | white |
| `--sr-ws-c-icon` | blue-700 | green-500 |
| `--sr-ws-c-rule` | slate-300 | white at 24% |
| Band-level: `--sr-ws-notch-bg`, `--sr-ws-badge-bg/fg`, `--sr-ws-step-bg/fg` | band colour; blue badge, white icon; blue tile, white numeral | blue; green badge, navy icon; white tile, blue numeral |

### 4.3 Contrast matrix (computed, WCAG 2.x)

Thresholds: normal text 4.5:1, large text (24px+, or 18.66px+ bold) 3:1, non-text UI 3:1.

| Foreground | Background | Ratio | Normal | Large | Non-text | Decision |
|---|---|---|---|---|---|---|
| navy-900 #16233d | white | 15.65 | pass | pass | pass | Ink text |
| navy-900 | #f5f7fa | 14.58 | pass | pass | pass | |
| navy-800 #1f2a44 | white | 14.26 | pass | pass | pass | Body text |
| navy-800 | #f5f7fa | 13.28 | pass | pass | pass | |
| navy-800 | blue-50 #eaf0fb | 12.46 | pass | pass | pass | Callout text |
| slate-600 #4a5675 | white | 7.29 | pass | pass | pass | Muted text |
| slate-600 | #f5f7fa | 6.80 | pass | pass | pass | |
| slate-600 | blue-50 | 6.38 | pass | pass | pass | |
| slate-600 | green-50 #e9f8eb | 6.63 | pass | pass | pass | |
| blue-700 #1c44a9 | white | 8.57 | pass | pass | pass | Headings, links |
| blue-700 | #f5f7fa | 7.99 | pass | pass | pass | |
| blue-700 | blue-50 | 7.49 | pass | pass | pass | Blue pills, FAQ "+" |
| blue-700 | green-50 | 7.80 | pass | pass | pass | |
| white | blue-700 | 8.57 | pass | pass | pass | Text on blue bands |
| blue-100-on-blue #dbe4f7 | blue-700 | 6.72 | pass | pass | pass | Muted text on blue |
| white | white 12% over blue (#375ab3) | 6.41 | pass | pass | pass | `.sr-ws-pill--on-blue` |
| blue-100-on-blue | white 12% over blue | 5.02 | pass | pass | pass | |
| white | white 8% over blue (#2e53b0) | 7.05 | pass | pass | pass | `.sr-ws-note` on blue |
| **green-500 #1eb831** | **white** | **2.64** | fail | fail | fail | **Never text on light. Decorative fills only** |
| green-500 | #f5f7fa | 2.46 | fail | fail | fail | Same |
| green-500 | blue-700 | 3.25 | fail | pass | pass | Accent words 24px+ on blue; icons on blue |
| **white** | **green-500** | **2.64** | fail | fail | n/a | **Forbidden: white label on brand green** |
| navy-900 | green-500 | 5.93 | pass | pass | pass | **Primary CTA label** |
| navy-800 | green-500 | 5.40 | pass | pass | pass | |
| green-700 #13791f | white | 5.55 | pass | pass | pass | Green text, eyebrows, hover text |
| green-700 | #f5f7fa | 5.17 | pass | pass | pass | |
| green-700 | green-50 | 5.05 | pass | pass | pass | Green pills |
| green-700 | blue-50 | 4.85 | pass | pass | pass | Label inside callout |
| white | green-700 | 5.55 | pass | pass | pass | CTA hover |
| white | green-800 #0f6419 | 7.35 | pass | pass | pass | CTA pressed |
| white | blue-800 #15337f | 11.59 | pass | pass | pass | |
| green-500 | blue-800 | 4.39 | fail | pass | pass | Large or non-text only |
| green-500 | navy-900 | 5.93 | pass | pass | pass | Arrow in knob circle |
| amber-800 #8a4b00 | white | 6.80 | pass | pass | pass | Warning text |
| slate-500 #77849f | white | 3.76 | n/a | n/a | pass | Control boundary |
| slate-500 | #f5f7fa | 3.50 | n/a | n/a | pass | |
| slate-300 #d9e0ee | white | 1.33 | n/a | n/a | fail | Decorative hairline only |
| white 24% over blue (#5271be) | blue-700 | 1.82 | n/a | n/a | fail | Decorative rule only |
| blue-700 | green-500 (adjacent fills) | 3.25 | n/a | n/a | pass | Green CTA on blue band is distinguishable |

Pure black (#000) is never used. Its 21:1 is listed in the script only as a reference.

### 4.4 Colour rules

- Primary CTA: green-500 fill, navy-900 label. Hover: green-700 fill, white label. Pressed: green-800.
- Never white text on #1eb831. Never #1eb831 text on white or #f5f7fa.
- On blue bands, green text only at 24px+ (headline accent such as "That's it."). Small labels on blue are white.
- Hover on blue surfaces: text stays white, a green underline or green border shows the hover (green text there would fail contrast).
- Focus ring: blue on light, white on blue. Never green (2.64:1 on white fails 3:1).
- Status is never shown by colour alone: pills carry words, the current location chip carries `aria-current="page"` and a fill.
- Shadows use navy (`rgb(22 35 61 / alpha)`), never black.

---

## 5. Typography

### 5.1 Families and loading

| Role | Family | Weights | Why | Status |
|---|---|---|---|---|
| Headings, eyebrows, buttons, labels | **Montserrat** | 600, 700 | Allowed by brand; the live site already self-hosts it through Elementor, so it costs no extra request | KNOWN (E3) that it is loaded site-wide |
| Body | **Inter** | 400, 600 | Allowed by brand; matches the look of the existing brand graphics | Inter on the live site: LIKELY not loaded (E3 lists Montserrat, Spline Sans Mono, Source Sans Pro). The brand graphics look like Poppins + Inter (ASSUMPTION from E4) |
| Fallback | `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` | | Page renders fine if fonts fail | |

Loading rules: preferred path is to self-host Inter 400 and 600 as woff2 (Elementor Custom Fonts) with `font-display: swap`. The only allowed external dependency is the optional Google Fonts link in the CSS header (`family=Inter:wght@400;600&family=Montserrat:wght@600;700&display=swap`, with a `preconnect` to fonts.gstatic.com). Do not load Spline Sans Mono or any monospace on WorkSafe pages (one family rule). Use `font-variant-numeric: tabular-nums` for numbers instead.

Metric-matched fallback faces (`size-adjust`, `ascent-override`) would reduce layout shift during swap. Their values must be generated from the actual font files (for example with Capsize or Fontaine). Values: Not Available yet, so none are shipped.

### 5.2 Type scale

Fluid between 390px and 1280px viewports with `clamp()`; rem based so user zoom and font settings work.

| Token | Mobile | Desktop | Weight | Line height | Family | Use |
|---|---|---|---|---|---|---|
| `--sr-ws-fs-h1` | 30px | 48px | 700 | 1.15 | Montserrat | One per page |
| `--sr-ws-fs-h2` | 24px | 36px | 700 | 1.25 | Montserrat | One per band |
| `--sr-ws-fs-h3` | 20px | 24px | 600 | 1.25 | Montserrat | Card titles, clinic name |
| `--sr-ws-fs-h4` | 18px | 20px | 600 | 1.3 | Montserrat | Step titles, small card titles |
| `--sr-ws-fs-lede` | 18px | 20px | 400 | 1.55 | Inter | Hero and section intros |
| `--sr-ws-fs-body` | 16px | 17px | 400 | 1.6 | Inter | All running text |
| `--sr-ws-fs-ui` | 16px | 16px | 600 | 1.2 | Montserrat | Buttons (uppercase, +0.04em), FAQ questions (sentence case) |
| `--sr-ws-fs-small` | 15px | 15px | 400 | 1.5 | Inter | Meta, proof line, hours |
| `--sr-ws-fs-label` | 14px | 14px | 600 | 1.3 | Montserrat | Eyebrows, pills, `dt` labels (uppercase, +0.08em). **Floor: no text below 14px** |

Rules: body never below 16px. Line length max 68ch. Headings use `text-wrap: balance`, ledes `text-wrap: pretty`. Write CTA and eyebrow text in sentence case in the HTML and let CSS uppercase it (screen readers and GTranslate get normal words). No serif, script, italic display or monospace faces.

---

## 6. Space, layout and grid

| Token | Value | Token | Value |
|---|---|---|---|
| `--sr-ws-space-1` | 4px | `--sr-ws-space-7` | 32px |
| `--sr-ws-space-2` | 8px | `--sr-ws-space-8` | 40px |
| `--sr-ws-space-3` | 12px | `--sr-ws-space-9` | 48px |
| `--sr-ws-space-4` | 16px | `--sr-ws-space-10` | 64px |
| `--sr-ws-space-5` | 20px | `--sr-ws-space-11` | 80px |
| `--sr-ws-space-6` | 24px | `--sr-ws-space-12` | 96px |

| Layout token | Mobile (<600) | Tablet (600 to 1199) | Wide (1200+) |
|---|---|---|---|
| `--sr-ws-gutter` (side padding) | 16px | 24px | 32px |
| `--sr-ws-card-pad` | 20px | 24px | 28px |
| `--sr-ws-grid-gap` | 16px | 20px | 24px |
| `--sr-ws-section-y` (band padding) | 48px | fluid | 96px |
| `--sr-ws-container` | 1200px max content width | | |
| `--sr-ws-measure` | 68ch max text width | | |

Breakpoints: 600px (2 columns), 900px (desktop layout, sticky bar hidden), 1200px (wide spacing). Grids: `.sr-ws-grid--2/--3/--4` go 1 → 2 → 3 or 4 columns; `.sr-ws-grid--m2` keeps 2 columns on phones for short tiles. No horizontal page scroll at 320px or wider (verified at 390px and 1280px, E16).

Bands are full bleed. Use the Elementor "Full Width" (or Canvas) page layout so `.sr-ws-page` spans the viewport. In a boxed template the bands still work but look boxed.

---

## 7. Radius, elevation, borders, motion

| Radius token | Value | Use |
|---|---|---|
| `--sr-ws-radius-xs` | 6px | Rare small elements |
| `--sr-ws-radius-sm` | 10px | Controls (matches live widget) |
| `--sr-ws-radius-md` | 14px | FAQ rows, boxes, callouts, tip row, map |
| `--sr-ws-radius-lg` | 20px | Cards, media, notch tabs |
| `--sr-ws-radius-xl` | 28px | Hero panel |
| `--sr-ws-radius-pill` | 999px | Buttons, chips, pills, sticky call button |

| Shadow token | Value | Use |
|---|---|---|
| `--sr-ws-shadow-1` | 0 1px 2px navy/6%, 0 1px 3px navy/10% | Primary CTA rest, open FAQ, person footer pill |
| `--sr-ws-shadow-2` | 0 2px 4px navy/4%, 0 8px 24px navy/8% | Elevated cards (eligibility, location), CTA hover |
| `--sr-ws-shadow-3` | 0 4px 8px navy/6%, 0 16px 40px navy/16% | Floating mini-cards, interactive card hover |
| `--sr-ws-shadow-bar` | 0 -4px 16px navy/10% | Sticky booking bar |

Borders: 1px slate-300 for decorative outlines; 1px slate-500 where the boundary identifies a control; 2px for button outlines.

| Motion token | Value | Use |
|---|---|---|
| `--sr-ws-dur-1` | 120ms | Press feedback |
| `--sr-ws-dur-2` | 200ms | Hover colour, border, shadow |
| `--sr-ws-dur-3` | 320ms | Accordion open (where supported) |
| `--sr-ws-ease` | cubic-bezier(.2,.7,.2,1) | Default |
| `--sr-ws-ease-in-out` | cubic-bezier(.4,0,.2,1) | Accordion |

Allowed motion: colour, border, shadow, transforms of 3px or less, the sticky bar slide-in, the optional accordion height animation. Not allowed: parallax, smooth-scroll libraries (Lenis), scroll-jacking, autoplay, video backgrounds, carousels, particle effects. With `prefers-reduced-motion: reduce` all transitions drop to near zero and the sticky bar is static.

---

## 8. Composition language: bee_ui.ux and claude-seo translated to Synergy

### 8.1 What the references show (KNOWN, read from the uploads)

| Image | Content |
|---|---|
| `7d4c9f4a` | claude-seo card: soft white card on a dotted background; "4 OF 9" eyebrow; square avatar; serif title; tinted "WHAT IT CAN DO" callout; "How to set it up" numbered list; code box with a header row and a dark "Copy" pill; "TIP" row; pill buttons ("GitHub repo ↗" left, "Next: ... →" right) |
| `5c96378d` | Desktop wireframe: top bar with joined pill nav; very large rounded dark hero with an inset notch card in the top-right corner, a floating mini-card on the bottom-right corner and a pill with a circle knob in a bottom-left notch; next a dark band with a centred pill heading and 2-up cards with small notch squares in their corners plus a narrow side card |
| `9f6952a7` | Light band with title and three tiles (one image, two dark cards with a square thumb and a circle in the corner, each with a pill strip attached below); dark band with a small floating card, a centred image and "+" hotspots; light band with an image + dark text split card |
| `e5ab4e55` | Continuation: dark band, image + text split card on light, then a dark 4-column footer (logo block + 3 link columns), bottom line, and a big full-width light pill |
| `9b0e8473` | Mobile column: dark top with a stacked rounded hero card (corner icons, text lines, two chat-bubble chips), a row of 3 thumb tiles, pagination dots, text lines and chips; then a light section with a pill heading, text and a large image card |

### 8.2 Translation table

| # | Reference pattern | Synergy version | Class |
|---|---|---|---|
| 1 | Large rounded hero frame (5c96378d) | Blue #1c44a9 hero panel, 28px radius, inside a white band | `.sr-ws-hero__panel` |
| 2 | Inset notch card, hero top-right (5c96378d) | Notch tab cut into the panel corner, painted page white, holding one VERIFIED trust pill | `.sr-ws-notch__tab.sr-ws-hero__badge` |
| 3 | Floating mini-cards on hero corners (5c96378d) | White trust mini-cards on the clinic photo corners (desktop); the same items become 3 tiles under the photo on phones (pattern from 9b0e8473) | `.sr-ws-hero__floats`, `.sr-ws-minicard--tl/--br/--bl` |
| 4 | Pill with a circle knob (5c96378d) | Primary booking CTA with a navy knob holding a green arrow | `.sr-ws-btn--primary.sr-ws-btn--knob` |
| 5 | Joined pill nav (5c96378d) | "On this page" jump nav on the pillar | `.sr-ws-jumpnav` |
| 6 | Alternating light and dark bands (all) | White or #f5f7fa bands alternate with #1c44a9 bands. Black and grey are never used | `.sr-ws-band--white`, `--soft`, `--blue` |
| 7 | 2-up cards with notch corners (5c96378d) | Condition cards and practitioner cards with an icon badge in a notch tab | `.sr-ws-notch` + `.sr-ws-icon-badge` |
| 8 | Card with a pill strip attached below (9f6952a7) | Practitioner card with a "Book with {name}" pill footer | `.sr-ws-person__foot` |
| 9 | Dark band with a floating small card (9f6952a7, e5ab4e55) | Blue band with a split card or a mini-card. The "+" hotspots are not used (hover-only reveals fail on touch and for keyboard users) | `.sr-ws-split`, `.sr-ws-minicard` |
| 10 | Image + text split card (9f6952a7, e5ab4e55) | First-visit and return-to-work split: real clinic photo + blue text card | `.sr-ws-split` |
| 11 | 4-column footer + big bottom pill (e5ab4e55) | Pre-footer blue CTA band: green big pill (desktop) + 4 link columns. The theme footer stays as it is | `.sr-ws-bigpill`, `.sr-ws-linkcols` |
| 12 | Mobile stacked hero card with bubbles (9b0e8473) | Mobile hero panel; the bubbles become the dot-separated proof line | `.sr-ws-proof` |
| 13 | 3 thumb tiles (9b0e8473) | 3 trust tiles under the hero photo on phones | `.sr-ws-hero__floats` (mobile) |
| 14 | Chips (9b0e8473) | Location and condition chips (real links) | `.sr-ws-chips`, `.sr-ws-chip` |
| a | Soft card on dotted background (7d4c9f4a) | Eligibility card on a #f5f7fa dotted band | `.sr-ws-band--dotted` + `.sr-ws-elig` |
| b | "4 OF 9" eyebrow | Eyebrow ("Before you book", "Step 2 of 3") | `.sr-ws-eyebrow` |
| c | Square avatar | Icon well (never the logo) | `.sr-ws-icon-well` |
| d | Tinted callout with small-caps label | Blue-50 callout with a green label | `.sr-ws-callout`, `.sr-ws-label` |
| e | Numbered setup list | Numbered "How to start" list | `.sr-ws-numlist` |
| f | Code box with header row and Copy pill | "Have these ready" box with a header row and a pill. No Copy button (needs JS, no user need) | `.sr-ws-box` |
| g | TIP row | Tip row | `.sr-ws-tip` |
| h | Pill buttons left and right | Secondary external link left, primary next step right | `.sr-ws-actions` |

Deliberately not copied: the black and grey palette, the serif display face of the claude-seo card, carousels and pagination dots, hover hotspots, 3D mockup presentation and textured photo backdrops.

### 8.3 Band rhythm

Rules: never two blue bands next to each other; between blue bands alternate white and #f5f7fa; each band has one H2 and at most one primary button.

**Pillar** (`/worksafe-physiotherapy/`):

| # | Band | Surface | Primary action in view |
|---|---|---|---|
| 1 | Hero (crumbs, H1, lede, Book + Call, proof, photo, trust tiles) | white band, blue panel | Book (or "Find your clinic" if the pillar sends people to the finder first) |
| 2 | Jump nav + short intro | white | none |
| 3 | Step timeline (how WorkSafeBC physio works) | blue | none (text link to band 8) |
| 4 | Eligibility card | soft, dotted | "Next: find your clinic" |
| 5 | Condition cards | white | none |
| 6 | First visit split | soft | none |
| 7 | Return to work phases + employer note | blue | none |
| 8 | Clinic finder (location cards grouped by area) | white | each card is a link; no extra button |
| 9 | FAQ | soft | none |
| 10 | Related links + sources + "as of" line | white | none |
| 11 | CTA band: big pill (desktop only) + link columns | blue | big pill on desktop; sticky bar on phones |
| | Sticky bar (phones, after the hero) | white bar | "Find your clinic" (anchor to band 8) + call |

**Location page** (verified eligible clinic):

| # | Band | Surface | Unique data it must carry |
|---|---|---|---|
| 1 | Hero | white band, blue panel | Neighbourhood H1, clinic photo unique to this folder, clinic phone, VERIFIED status pill |
| 2 | Location card + map + "Getting here" | soft | Address, phone, hours, transit, parking, entrance, accessibility |
| 3 | Compact steps (3 steps, link to pillar for detail) | blue | Clinic-specific booking path only |
| 4 | Practitioner module | white | WCB physiotherapists at this clinic, languages, focus |
| 5 | First visit at this clinic (split) | soft | Real photo of this clinic, front desk process, what floor, check-in |
| 6 | Return-to-work services here (only if the clinic has them) | blue | For example kinesiology on site (check `kinesiology_practitioners_with_openings`) |
| 7 | Local FAQ (3 to 5 questions about this clinic only) | white | Parking, evening hours, languages, nearby employers or industrial areas served |
| 8 | Nearby clinics selector + related links | soft | Distance-sorted nearby clinics |
| 9 | CTA band | blue | |
| | Sticky bar (phones) | | Book at this clinic + call this clinic |

Doorway-page guard built into the system: the pillar owns all shared WorkSafeBC explanations (full steps, eligibility card, condition cards, general FAQ). Location pages link back to them instead of repeating them, and every band on a location page has a slot for clinic-specific data. If a clinic cannot fill bands 2, 4 and 5 with real facts, it should not get a page (fold it into the pillar finder).

---

## 9. Component inventory

All markup below is the contract between this stylesheet and the page builds. Text in `{braces}` is a content slot. Every factual slot must map to a `claim_id` with status VERIFIED in `data/claims-register.csv` or to a KNOWN field in `data/locations-master.csv`.

### 9.0 Page wrapper and bands

```html
<div class="sr-ws-page">
  <section class="sr-ws-band sr-ws-band--blue" aria-labelledby="sr-ws-steps-h">
    <div class="sr-ws-container">
      <div class="sr-ws-head">
        <p class="sr-ws-eyebrow">How it works</p>
        <h2 class="sr-ws-h2" id="sr-ws-steps-h">Three steps. <span class="sr-ws-accent">That's it.</span></h2>
        <p class="sr-ws-lede">{one sentence}</p>
      </div>
      ...
    </div>
  </section>
  ...
  <div class="sr-ws-sticky-spacer"></div>
</div>
```
Modifiers: `--white`, `--soft`, `--blue`, `--dotted`, `--tight`, `--flush-top`, `--flush-bottom`. `.sr-ws-head--center` centres a band heading.

### 9.1 Hero with booking CTA and phone CTA

Purpose: answer "can I get WorkSafeBC physio here" and offer booking in one tap. Used on: pillar and location pages.

```html
<section class="sr-ws-band sr-ws-band--white sr-ws-hero" aria-labelledby="sr-ws-h1">
  <div class="sr-ws-container">
    <nav class="sr-ws-crumbs" aria-label="Breadcrumb"><ol>
      <li><a href="/">Home</a></li>
      <li><a href="/worksafe-physiotherapy/">WorkSafeBC physiotherapy</a></li>
      <li><span aria-current="page">{Clinic}</span></li></ol></nav>
    <div class="sr-ws-hero__panel sr-ws-notch">
      <div class="sr-ws-notch__tab sr-ws-hero__badge"><span class="sr-ws-pill">{VERIFIED badge, 28 chars max}</span></div>
      <div class="sr-ws-hero__content">
        <p class="sr-ws-eyebrow">After a workplace injury</p>
        <h1 class="sr-ws-h1" id="sr-ws-h1">WorkSafeBC physiotherapy in <span class="sr-ws-accent">{Neighbourhood}</span></h1>
        <p class="sr-ws-lede">{one plain sentence}</p>
        <div class="sr-ws-hero__ctas">
          <a class="sr-ws-btn sr-ws-btn--primary sr-ws-btn--knob"
             href="https://synergyrehab.janeapp.com/locations/{slug}/book#/discipline/3/treatment/442">Book a WorkSafe visit<span class="sr-ws-btn__knob" aria-hidden="true">&#8594;</span></a>
          <a class="sr-ws-btn sr-ws-btn--secondary" href="tel:+1{digits}"><svg class="sr-ws-icon" viewBox="0 0 24 24" aria-hidden="true">{phone path}</svg>Call {(604) 000-0000}</a>
        </div>
        <ul class="sr-ws-proof" role="list"><li>{claim}</li><li>{claim}</li><li>19+ locations</li></ul>
      </div>
      <figure class="sr-ws-hero__media">
        <img class="sr-ws-hero__img" src="{clinic-photo}.webp" width="800" height="1000" alt="{what the photo shows}" fetchpriority="high">
        <ul class="sr-ws-hero__floats" role="list">
          <li class="sr-ws-minicard sr-ws-minicard--tl"><span class="sr-ws-minicard__icon">{svg}</span><span><span class="sr-ws-minicard__value">{value}</span><span class="sr-ws-minicard__label">{label}</span></span></li>
          <li class="sr-ws-minicard sr-ws-minicard--br">...</li>
          <li class="sr-ws-minicard sr-ws-minicard--bl sr-ws-only-sm">...</li>
        </ul>
      </figure>
    </div>
  </div>
</section>
```
- Phones: panel stacks; CTAs full width (Book 52px tall, Call 52px); 3 trust tiles sit under the photo. 900px+: two columns, mini-cards float over the photo corners (show 2 on desktop; the third is phone only).
- The secondary CTA is visually subordinate (outline). That keeps one primary CTA in view.
- Mini-card candidates: "Book online" (KNOWN: WCB physio initial is bookable online at all 19, E12), "19+ locations" (brand rule), clinic hours (Not Available until verified).
- Hero image: real clinic photo unique to this clinic's Drive folder (see `data/drive-location-photos.csv`), never stock, never a patient without written consent. No video, no slider.

### 9.2 Step timeline

```html
<ol class="sr-ws-steps sr-ws-steps--h" role="list" style="--sr-ws-steps:3">
  <li class="sr-ws-step">
    <span class="sr-ws-pill sr-ws-pill--on-blue sr-ws-step__when">{Day 0}</span>
    <h3 class="sr-ws-step__title">{Report the injury}</h3>
    <p class="sr-ws-step__body">{one or two sentences}</p>
  </li>
</ol>
```
Vertical with a connector line on phones; horizontal from 900px with `--h` (set `--sr-ws-steps` to 3 or 4). Numbers come from a CSS counter in rounded-square tiles (brand graphic pattern, E4). On light bands use `.sr-ws-pill--blue` for the "when" pill. Timing words ("Day 0", "within 24 hours") only if VERIFIED.

### 9.3 Eligibility card

```html
<section class="sr-ws-band sr-ws-band--soft sr-ws-band--dotted"><div class="sr-ws-container">
  <article class="sr-ws-card sr-ws-elig">
    <div class="sr-ws-elig__head"><span class="sr-ws-icon-well">{svg}</span>
      <div><p class="sr-ws-eyebrow">Before you book</p><h2 class="sr-ws-h2">Is this for you?</h2><p>{one line}</p></div></div>
    <div class="sr-ws-callout"><span class="sr-ws-label">Who this is for</span><p>{VERIFIED eligibility statement}</p></div>
    <h3 class="sr-ws-h4">How to start</h3>
    <ol class="sr-ws-numlist" role="list"><li>{step}</li><li>{step}</li><li>{step}</li></ol>
    <div class="sr-ws-box"><p class="sr-ws-box__head">Have these ready <span class="sr-ws-pill sr-ws-pill--blue">Checklist</span></p>
      <div class="sr-ws-box__body"><ul class="sr-ws-checklist" role="list"><li>{claim number, if you have one}</li><li>{item}</li></ul></div></div>
    <p class="sr-ws-tip"><span class="sr-ws-tip__label">Tip</span><span>{tip}</span></p>
    <div class="sr-ws-actions">
      <a class="sr-ws-btn sr-ws-btn--secondary sr-ws-btn--sm" href="https://www.worksafebc.com/{official page}">WorkSafeBC: report an injury &#8599;</a>
      <a class="sr-ws-btn sr-ws-btn--primary sr-ws-btn--sm" href="#clinics">Next: find your clinic &#8594;</a>
    </div>
    <p class="sr-ws-asof">Checked against worksafebc.com on {YYYY-MM-DD}.</p>
  </article></div></section>
```
Pillar only. Location pages show one callout linking to it. Contested items (session counts, referral rules for massage, claim-pending payment) stay out until their claim status is VERIFIED (the register currently holds 7 CONFLICT rows).

### 9.4 Condition cards

```html
<ul class="sr-ws-grid sr-ws-grid--3 sr-ws-list-reset" role="list">
  <li class="sr-ws-card sr-ws-card--soft sr-ws-notch sr-ws-condition sr-ws-card--interactive">
    <span class="sr-ws-notch__tab"><span class="sr-ws-icon-badge">{svg aria-hidden}</span></span>
    <h3 class="sr-ws-h3 sr-ws-card__title"><a class="sr-ws-card__link" href="{relevant page}">{Back injuries from lifting}</a></h3>
    <p class="sr-ws-card__text">{specific, plain description}</p>
  </li>
</ul>
```
On a white band use `.sr-ws-card--soft` cards; on a soft band use default white cards. Notch cards never get a border (the notch would cut it). `.sr-ws-card--interactive` plus one `.sr-ws-card__link` makes the whole card clickable with a single link (no nested links). Without a target page, omit `--interactive` and the link.

### 9.5 First-visit expectations (split card)

```html
<div class="sr-ws-split">
  <figure class="sr-ws-split__media"><img src="{clinic interior}.webp" width="800" height="600" alt="{what it shows}" loading="lazy" decoding="async"></figure>
  <div class="sr-ws-split__body">
    <p class="sr-ws-eyebrow">Your first visit</p><h2 class="sr-ws-h2">What to expect</h2>
    <ul class="sr-ws-checklist" role="list"><li>{item}</li></ul>
    <p class="sr-ws-split__foot">{Bring: items}</p>
  </div>
</div>
```
`.sr-ws-split--reverse` puts the photo on the right; `.sr-ws-split__body--light` gives a white text card for use on blue bands.

### 9.6 Return to work

```html
<ol class="sr-ws-phases" role="list">
  <li class="sr-ws-card sr-ws-phase"><span class="sr-ws-pill sr-ws-pill--blue">Phase 1</span>
    <h3 class="sr-ws-h3 sr-ws-card__title">{Assess}</h3><p class="sr-ws-card__text">{text}</p></li>
</ol>
<div class="sr-ws-note"><p>{note for employers and case managers}</p></div>
```
White cards on a blue band; 1, 2 then 4 columns. Write "Phase 1" in the markup (not CSS) so GTranslate translates it. Only list services the clinic really offers.

### 9.7 Location card + map

```html
<div class="sr-ws-location-wrap">
  <article class="sr-ws-card sr-ws-card--elevated sr-ws-location">
    <div class="sr-ws-location__head"><h3 class="sr-ws-h3 sr-ws-location__name">{Synergy Rehab Langley}</h3><span class="sr-ws-pill">{VERIFIED status}</span></div>
    <address class="sr-ws-location__addr">{street}<br>{city}, BC {postal}</address>
    <dl class="sr-ws-location__meta">
      <div><dt>Phone</dt><dd><a class="sr-ws-location__phone" href="tel:+1{digits}">{(604) 000-0000}</a></dd></div>
      <div><dt>Hours</dt><dd><table class="sr-ws-hours"><caption class="sr-ws-sr-only">Opening hours</caption><tbody>
        <tr><th scope="row">Mon to Fri</th><td>{hours}</td></tr></tbody></table></dd></div>
      <div><dt>Getting here</dt><dd>{transit, parking, entrance, accessibility}</dd></div>
    </dl>
    <div class="sr-ws-location__actions">
      <a class="sr-ws-btn sr-ws-btn--primary" href="{jane_wcb_physio_initial_url}">Book WCB physio at {Langley}</a>
      <a class="sr-ws-link sr-ws-link--ext" href="{gbp_maps_url}">Get directions</a>
    </div>
  </article>
  <details class="sr-ws-map"><summary>Show map</summary>
    <div class="sr-ws-map__frame"><iframe src="{Google Maps embed URL}" title="Map of {clinic}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
  </details>
</div>
```
- The map is a no-JS facade: the iframe sits in a closed `<details>`. Whether Chrome and Safari defer loading a `loading="lazy"` iframe inside a closed `<details>` is UNKNOWN: test in DevTools (Network tab). If it loads anyway, swap in a 10-line click-to-load script; that is the only JS this system would ever allow.
- "Get directions" is always present, so the map is never the only way to reach the address.
- Data: `address_*`, `phone_*`, `hours_gbp`, `gbp_maps_url` in `data/locations-master.csv`. GBP fields are Not Available for most clinics and some site phones conflict (E14): fill only verified values.
- Pillar finder variant: `.sr-ws-loccard` inside `.sr-ws-grid--3` (name, area, "WorkSafe physio at {clinic} →").

### 9.8 Practitioner module

```html
<ul class="sr-ws-team" role="list">
  <li class="sr-ws-person">
    <article class="sr-ws-card sr-ws-notch">
      <span class="sr-ws-notch__tab"><span class="sr-ws-icon-badge">{svg}</span></span>
      <div class="sr-ws-person__top sr-ws-notch__clear">
        <img class="sr-ws-person__photo" src="{headshot}.webp" width="80" height="80" alt="" loading="lazy">
        <div><h3 class="sr-ws-h3 sr-ws-person__name">{Name}</h3><p class="sr-ws-person__role">Registered Physiotherapist</p></div>
      </div>
      <p class="sr-ws-person__text">{WorkSafe-relevant focus}</p>
      <ul class="sr-ws-chips" role="list"><li><span class="sr-ws-pill sr-ws-pill--blue">{Language}</span></li></ul>
    </article>
    <a class="sr-ws-person__foot" href="{Jane practitioner link}">Book with {First name}</a>
  </li>
</ul>
```
No headshot: use `<span class="sr-ws-person__mono" aria-hidden="true">{initials}</span>`. Photo alt is empty because the name is right beside it. Credentials must be checked against the provincial regulator's public register (LIKELY the College of Health and Care Professionals of BC since the 2024 amalgamation; confirm) before publishing (ASSUMPTION: content-team step). The Jane per-practitioner deep link pattern is UNKNOWN (plugin README "Not yet verified"); link to the clinic WCB booking URL until it is confirmed. Place this module on white or soft bands.

### 9.9 FAQ accordion

```html
<div class="sr-ws-faq">
  <details class="sr-ws-faq__item">
    <summary class="sr-ws-faq__q">{Do I need a doctor's referral?}</summary>
    <div class="sr-ws-faq__a"><p>{VERIFIED answer}</p></div>
  </details>
</div>
```
Native `<details>`/`<summary>`; no JS; works with find-in-page. Keep plain text in `<summary>` (headings inside a summary lose their role in some screen readers). Do not add the `name` attribute (exclusive accordion) because people often compare answers. Where `interpolate-size` is supported, opening animates; elsewhere it opens instantly. The visible Q&A must match any FAQ markup word for word.

### 9.10 Related links

```html
<ul class="sr-ws-related sr-ws-related--3" role="list">
  <li><a class="sr-ws-related__link" href="/worksafe-physiotherapy/"><span>WorkSafeBC physiotherapy<span class="sr-ws-related__meta">All clinics</span></span></a></li>
  <li><a class="sr-ws-related__link sr-ws-related__link--ext" href="https://www.worksafebc.com/{page}"><span>{Official page title}<span class="sr-ws-related__meta">worksafebc.com</span></span></a></li>
</ul>
```
Internal arrow → ; external ↗ with the domain written in the meta line. Links go only to WorkSafe pages, WorkSafe-relevant service pages and official WorkSafeBC pages (scope rule). Same tab by default. The 4-column variant `.sr-ws-linkcols` sits in the CTA band.

### 9.11 Sticky mobile booking bar

```html
<div class="sr-ws-sticky" role="region" aria-label="Book or call {clinic}">
  <a class="sr-ws-btn sr-ws-btn--primary" href="{jane_wcb_physio_initial_url}">Book online</a>
  <a class="sr-ws-btn sr-ws-btn--secondary sr-ws-sticky__call" href="tel:+1{digits}" aria-label="Call {Synergy Rehab Langley}">{phone svg aria-hidden}</a>
</div>
<div class="sr-ws-sticky-spacer"></div>  <!-- last child of .sr-ws-page -->
```
- Shown below 900px only; respects the iPhone home bar (`env(safe-area-inset-bottom)`).
- One primary CTA per view: in browsers with scroll-driven animations the bar stays hidden (and unfocusable) while the hero is on screen and slides in once the hero scrolls away (verified in Chrome, E16). Other browsers show it all the time (acceptable fallback; Safari support UNKNOWN). On phones, hide the end-of-page big pill with `.sr-ws-hide-below-desktop` so the bar stays the only primary CTA.
- `html:has(.sr-ws-sticky){scroll-padding-bottom}` keeps focused elements clear of the bar (WCAG 2.4.11).
- Pillar version: "Find your clinic" linking to `#clinics` instead of a booking URL.
- Collision risk (LIKELY): the LeadConnector chat bubble and the GTranslate floating switcher (E3) also sit at the bottom of the screen. Hide or move them on these pages (their selectors are UNKNOWN until the WordPress DOM can be inspected).

### 9.12 Location selector

```html
<details class="sr-ws-locsel">
  <summary><span>Choose a different clinic<span class="sr-ws-locsel__current">Now viewing: {Langley}</span></span></summary>
  <div class="sr-ws-locsel__panel">
    <div class="sr-ws-locsel__group"><p class="sr-ws-locsel__area">{Surrey}</p>
      <ul class="sr-ws-chips" role="list"><li><a class="sr-ws-chip" href="/{worksafe location url}/">{Cloverdale}</a></li></ul></div>
    <div class="sr-ws-locsel__group"><p class="sr-ws-locsel__area">{Langley}</p>
      <ul class="sr-ws-chips" role="list"><li><a class="sr-ws-chip" aria-current="page" href="#">{Langley}</a></li></ul></div>
  </div>
</details>
```
Real `<a>` links (crawlable, no JS, no `<select>` that needs script to navigate). Groups by area. A clinic without its own WorkSafe page appears as `<span class="sr-ws-chip sr-ws-chip--static">` (not a link) or links to the pillar finder. On the pillar, the same groups render open as `.sr-ws-loccard` grids.

### 9.13 Supporting components

| Component | Class | Notes |
|---|---|---|
| Buttons | `.sr-ws-btn` + `--primary`, `--secondary`, `--knob`, `--sm`, `--block` | States in 9.14 |
| Text link | `.sr-ws-link` + `--arrow`, `--ext` | Arrow glyphs use CSS alt text (`content:"→" / ""`) so screen readers skip them |
| Pills (static) | `.sr-ws-pill` + `--blue`, `--on-blue`, `--solid` | Not links. 14px, uppercase |
| Chips (links) | `.sr-ws-chips`, `.sr-ws-chip`, `--static` | 48px tall |
| Jump nav | `.sr-ws-jumpnav` | Wraps on phones, joined pill from 600px |
| Card | `.sr-ws-card` + `--outline`, `--soft`, `--elevated`, `--blue`, `--interactive` | `__title`, `__text`, `__foot`, `__link` |
| Notch | `.sr-ws-notch` + `.sr-ws-notch__tab`, `.sr-ws-notch__clear` | Tab colour = band colour; no border on notch cards |
| Mini-card | `.sr-ws-minicard` | Icon, value, label |
| Breadcrumb | `.sr-ws-crumbs` | 14px, 29px+ touch height |
| Proof line | `.sr-ws-proof` | Green dot separators (brand pattern) |
| Callout, box, tip, note | `.sr-ws-callout`, `.sr-ws-box`, `.sr-ws-tip`, `.sr-ws-note` | |
| As-of line and sources | `.sr-ws-asof`, `.sr-ws-sources` | Required wherever WorkSafeBC facts appear |
| Big pill | `.sr-ws-bigpill` | End CTA band |
| Utilities | `.sr-ws-sr-only`, `.sr-ws-list-reset`, `.sr-ws-only-sm`, `.sr-ws-hide-sm`, `.sr-ws-hide-below-desktop`, `.sr-ws-center`, `.sr-ws-mt-0`, `.sr-ws-mb-0` | |

### 9.14 Interactive states

| Element | Default | Hover | Focus-visible | Active | Disabled |
|---|---|---|---|---|---|
| Primary button | green-500 fill, navy label, shadow-1 | green-700 fill, white label, shadow-2 | 3px ring (blue on light, white on blue), 2px offset | green-800, moves down 1px | slate-200 fill, slate-600 label, `aria-disabled="true"` |
| Secondary button | transparent, 2px blue border, blue label (white on blue) | border green-500, label green-700 (white on blue) | ring | moves down 1px | as primary |
| Text link | blue, underline hidden | green-700 + green underline (white + green underline on blue) | ring | | |
| Chip | white, slate-500 border, blue label | green border, green-700 label | ring | | current: blue fill, white label (white fill on blue band) |
| Interactive card | flat | shadow-3, lift 2px, title green-700, green inner ring (not on notch cards) | ring around the whole card | | |
| FAQ row | white, hairline, blue-50 "+" | border green, question green-700, green circle | ring on the summary | | open: blue circle, white "−", shadow-1 |
| Person footer pill | white, blue label, blue-50 arrow | green inner ring, green label, green arrow circle | ring | | |
| Big pill | green-500, navy label, navy knob | green-700, white label, knob moves 3px | ring | green-800 | |

---

## 10. Accessibility rules (WCAG 2.2 AA)

1. Colour pairs only from the matrix in 4.3. Green-500 never carries small text; on blue it carries 24px+ text only.
2. Visible focus everywhere: 3px ring, blue on light, white on blue, never removed (`:focus:not(:focus-visible)` only hides it for mouse clicks).
3. Focus not obscured (2.4.11): the sticky bar is hidden while the hero is on screen and `scroll-padding-bottom` keeps focused items above it.
4. Targets: 48px minimum for every interactive element (2.5.8 asks for 24px), 52px for primary CTAs, 8px+ between targets.
5. Structure: one H1; one H2 per band; H3 in cards; no skipped levels. The theme provides `<header>`, `<main>`, `<footer>` (UNKNOWN until verified in WordPress: confirm WorkSafe content sits inside `<main>`).
6. Lists: add `role="list"` to every `ul`/`ol` that has `list-style:none` (Safari and VoiceOver drop list semantics otherwise).
7. Links say where they go. Repeated "Book" links include the clinic name (visible or `.sr-ws-sr-only`). External links name the destination domain. No `target="_blank"` by default.
8. Phone: visible number in local format, `tel:` in E.164. Icon-only call buttons have an `aria-label` that names the clinic (no number, so call-tracking swaps cannot make it stale).
9. Images: clinic photos have descriptive alt text; decorative SVG icons have `aria-hidden="true"`; no text inside images; no identifiable patients without written consent.
10. Accordion: native `<details>`; plain text in `<summary>`; content stays searchable.
11. Map: iframe has a `title`; a text "Get directions" link always exists.
12. Motion: honour `prefers-reduced-motion`; no autoplay, parallax or carousels.
13. Windows High Contrast (`forced-colors`): borders are restored on buttons, cards and step tiles; notch fillets are switched off.
14. Reflow and zoom: works at 320px wide and 200% zoom without horizontal scroll; rem-based type; no fixed heights on text containers (1.4.10, 1.4.12).
15. Language: `lang="en-CA"` on the document (theme). Words live in markup, not in CSS `content`, so GTranslate can translate them (only numbers and arrows come from CSS).
16. Plain language: short sentences, aim for grade 6 to 8 reading level (ASSUMPTION target).

---

## 11. Performance rules

| Rule | Budget or setting | Status |
|---|---|---|
| JavaScript added by WorkSafe pages | **0 KB.** Every component is HTML + CSS | KNOWN (design) |
| Do not load GSAP, ScrollTrigger, Lenis, tsParticles, Tippy on WorkSafe pages | The ICBC hub loads 44 JS files / 3.08 MB and location pages 3.84 MB JS (E3) | KNOWN baseline |
| Remove dead third-party tags (CrazyEgg 403, Contentsquare 404) | | KNOWN issue (E3) |
| Stylesheet | 59.0 KB raw, 48.4 KB minified, **7.9 KB minified + gzip** (E17). Enqueue only on WorkSafe templates; minify in production | KNOWN |
| Fonts | 2 families, 4 weights max (Montserrat 600/700 already on site; Inter 400/600), woff2, `font-display: swap`, system fallback stack. Preload only the hero heading font if self-hosted | Design rule |
| No video backgrounds, no sliders, no autoplay | | Design rule |
| Hero image | AVIF or WebP, `srcset`/`sizes`, explicit `width`/`height`, `fetchpriority="high"`, never lazy. Target 150 KB or less at 800px wide | ASSUMPTION budget |
| Other images | `loading="lazy"`, `decoding="async"`, explicit dimensions | Design rule |
| Map | Never in the first viewport; `<details>` facade; verify deferred loading | UNKNOWN (test) |
| Core Web Vitals (p75, mobile) | LCP 2.5 s or less, CLS 0.1 or less, INP 200 ms or less | Targets |
| Do not use `content-visibility:auto` on bands | Causes scrollbar jumps on long pages | Design rule |

---

## 12. Logo usage

### 12.1 Asset inventory (read-only checks, nothing changed)

| File | Drive id | Size | Modified | Notes | Status |
|---|---|---|---|---|---|
| Synergy Rehab Logo.png | `1j22GFCzPCJG3IoPfspIwkIooOP_n4jCw` | 30,481 B; 975 x 410 px RGBA | 2026-05-04 (PNG says created 2023-02-01) | Current full-colour logo, owned by the Synergy marketing account | KNOWN file facts; "current master" LIKELY |
| New White Logo (3) (2).png | `1eillxR0IdkHgR5xxP7tgVPQxBfwgvf1P` | 375,556 B | 2026-05-04 | White version for blue bands | KNOWN file; contents not viewed |
| New White Logo.png | `1jLGyooJ9zCIKOu6tA7mUEhdWsgl_dGXz` | 375,556 B | 2021-10-14 | Same byte size as above, so LIKELY the same file (Spark Labs folder) | LIKELY duplicate |
| New Synergy Logo.zip | `13yYopKpDpHqpAqq2OM_fLVv8Lm2G20C8` | 815,621 B | 2021-08-04 | Agency logo pack. May contain vector masters | Contents UNKNOWN (not opened) |
| logo-01.jpg | `12QjJlOkfcviK55ouzVywPWBIHDnEJc7B` | 1,442,181 B | 2021-06-07 | Large JPG, no transparency | KNOWN file |
| logo_color-pride.jpg | `1mwfKS7zvVfWHR12iqYUSP9IYxxSdweF_` | 85,599 B | 2022-07-15 | Pride variant, seasonal only | KNOWN file |
| *logo.jpg (Yelp folder) | `1dRditwXXhQny0zzT8TgKR1rqNshmW7wt` | 23,470 B | 2026-09-01 | Copy owned by Yelp. Not a master | KNOWN file |
| SVG logo | none found | | | Drive search with `mimeType = 'image/svg+xml'` returned nothing | KNOWN (absence) |
| Canva brand kit | `kAGOa-MPisQ` "Synergy RehabHR's team" | thumbnail 200 x 83 | | Logo LIKELY in the kit; contents Not Available | E8 |
| Live site logo URL | | | | Not Available (E9) | |

### 12.2 Rules

1. Use only an official file. Never redraw, retype, recolour, outline, add shadows or effects, rotate, stretch, crop, animate or put the logo in a new container shape.
2. Never fake a white logo with CSS (for example `filter: brightness(0) invert(1)`). Use the official white file on #1c44a9.
3. Full-colour file on white or #f5f7fa; white file on #1c44a9 or on photos with a solid blue overlay. Never on busy photos.
4. The theme header already shows the logo. WorkSafe templates do not add a second logo in the hero, notch tabs, mini-cards, eyebrows or the icon well.
5. Clear space: at least 25% of the logo height on every side; minimum display width 120px. Both are ASSUMPTION values until the agency logo pack (or the Canva kit) gives the official rule.
6. Format: request the SVG master (ask the agency or open `New Synergy Logo.zip`). Until then use the 975 x 410 PNG with `width`/`height` attributes (aspect 2.378:1; sharp at 2x up to about 480px wide).
7. Markup: `<img src="{official file}" width="{w}" height="{h}" alt="Synergy Rehabilitation">` linking to the home page; use `alt=""` only if the same name is written right next to it.
8. The pride variant is for sanctioned seasonal campaigns only, never on WorkSafe pages. The Yelp copy is never a source file.
9. Before launch, open the PNG and white PNG side by side to confirm they are the same lockup (not done here: files were not rendered).

---

## 13. Copy rules for UI text

- Use "19+ locations" exactly. (Jane's own page says "19 convenient locations": do not copy that wording.)
- Show the web address as **synergyrehab.ca** in visible text. Hrefs point to the canonical `https://synergyrehabilitation.ca/...` URL (whether synergyrehab.ca redirects cleanly is UNKNOWN).
- No em dashes, and avoid en dashes: use commas, colons, periods or "to".
- CTA labels: verb first, 28 characters or fewer, sentence case in HTML (CSS uppercases), include the clinic on location pages ("Book WCB physio at Langley"). Longer labels wrap to two lines on a 390px phone.
- WorkSafe only: no ICBC, private pay or extended health wording, badges or CTAs.
- Every factual pill, mini-card, proof item, step, eligibility line and FAQ answer maps to a VERIFIED `claim_id` (`data/claims-register.csv`), and the page shows the "as of" date.
- No speed or capacity claims (for example "same-day appointments") unless verified for that clinic; `worksafe_flags` already warns about small WCB teams at some clinics.

---

## 14. WordPress / Elementor implementation notes

1. Enqueue `pages/assets/worksafe.css` only on WorkSafe pages, with a version string (for example `?ver=1.0.0`).
2. Wrap all WorkSafe content in `<div class="sr-ws-page">` using a full-width page layout. Build with the Elementor HTML widget or Gutenberg Custom HTML blocks from the snippets in section 9.
3. Specificity: components use `.sr-ws-page .sr-ws-x` (0,2,0). That beats Hello Elementor's reset (`button`, `[type=button]:hover` defaults) and Elementor kit rules such as `.elementor-kit-N h2` (0,1,1). LIKELY sufficient; verify once WordPress is connected (UNKNOWN until then).
4. Tokens are on `.sr-ws-page`, so Elementor global colours (`--e-global-color-*`) are untouched.
5. Sticky bar z-index is 900. Check it against the Elementor sticky header, LeadConnector chat and GTranslate switcher.
6. CallTrackingMetrics (E3) may swap phone numbers in visible text. Keep numbers as plain text inside `tel:` links so it can, and keep the clinic name (not the number) in `aria-label`.
7. Build Jane links from `data/locations-master.csv` `jane_wcb_physio_initial_url`. No `_gl=` linker strings, no `nofollow`. QA every slug (the ICBC hub has a LIKELY Clayton Corners to South Surrey mix-up).
8. The availability widget (`.synav`) can sit inside a WorkSafe page; it keeps its own tokens and the shared colour values match.

---

## 15. QA checklist before publishing

- [ ] Screens at 320, 390, 768, 1280 and 1440px: no horizontal scroll, no overlap of notch tabs and titles.
- [ ] Keyboard walk: every link and summary reachable, ring visible, nothing hidden behind the sticky bar.
- [ ] VoiceOver (iOS Safari) and NVDA (Chrome): lists announced as lists, FAQ and selector announced as expandable, arrows not read.
- [ ] axe or Lighthouse accessibility: no contrast or name errors.
- [ ] `forced-colors` (Windows High Contrast) and `prefers-reduced-motion` checks.
- [ ] Sticky bar: hidden over the hero and visible after it in Chrome Android; always visible (acceptable) where scroll-driven animations are unsupported; no clash with chat or translate widgets.
- [ ] Map: confirm in DevTools that the iframe does not load until "Show map" is opened.
- [ ] PageSpeed Insights mobile: LCP, CLS, INP within budget; 0 new JS files.
- [ ] Every claim on the page traced to a VERIFIED `claim_id`; "as of" date present; no em dashes; "19+ locations"; synergyrehab.ca shown as text.
- [ ] Logo: official file, unmodified, one instance (theme header).
- [ ] Photos: unique to the clinic folder, consent confirmed, descriptive alt text.

---

## 16. Open items and data gaps

| Gap | Why | How to close |
|---|---|---|
| SVG logo master and official clear-space rule | No SVG in Drive; agency zip not opened; Canva kit contents not readable with available tools | Open `New Synergy Logo.zip` or export from the Canva kit; update 12.2 rules 5 and 6 |
| Logo colours not visually confirmed | PNG downloaded as base64 but not rendered | Open both PNGs before launch |
| Live site logo URL | Fetch blocked; WebSearch found none | Allow synergyrehabilitation.ca in network settings or connect WordPress |
| bee_ui.ux profile | threads.com blocked | Allow threads.com; the 4 uploaded screenshots were used instead |
| Inter availability on the live site | Font list came from an audit asset list, not the DOM | Inspect the live page or WordPress; decide self-host vs Google Fonts |
| Theme conflicts and landmarks | WordPress not connected | Test the demo markup inside a draft WordPress page |
| Safari support for the sticky bar reveal | Not testable here (Chrome only) | Test on iOS; fallback is "always visible" |
| Lazy map inside closed `<details>` | Browser behaviour UNKNOWN | DevTools Network test; add the click-to-load fallback if needed |
| Clinic hours, addresses, coordinates | GBP connected for 3 of 19; site phones conflict for some clinics | Verify from GBP or the clinic before filling location cards |
| Unique clinic photography and consent | Several Drive folders share stock images; consent not recorded | Use folder-unique files; reshoot thin folders (Delta has 5 unique files); confirm consent |
| Jane per-practitioner deep links | Pattern not verified | Confirm in Jane; until then link to the clinic WCB booking URL |
| Metric-matched fallback font values | Need the actual font files | Generate with Capsize or Fontaine |

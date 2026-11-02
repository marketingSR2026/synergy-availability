# Modern SEO Cluster: page acceptance checklist

Source: user-supplied framework (2026-11-02). SEO + AEO + GEO + AIO + SXO work together.
Every WorkSafe pillar and location page must pass each row before publish. Each row maps to a concrete page element, not a slogan.

| Layer | Sub-item | How the WorkSafe pages meet it | Verified by |
|---|---|---|---|
| SEO | Technical SEO | Indexable, self-canonical, in sitemap, content in initial HTML, CWV budget (LCP < 2.5s, INP < 200ms, CLS < 0.1) | Lighthouse, SE Ranking audit, GSC URL Inspection |
| SEO | On-page SEO | One primary keyword per URL from keyword-master.csv, unique title/meta/H1, descriptive internal anchors | keyword map, duplicate title check |
| SEO | Topical authority | Pillar + location pages + workplace-injury knowledge hub linked as a cluster | internal link matrix |
| SEO | Entity & semantic SEO | Organization -> MedicalClinic (per location) -> Service -> place relationships in JSON-LD and visible text | Schema validator |
| SEO | Off-page SEO | GBP website links point to the matching page, citations consistent, legitimate local partners only | citation audit |
| AEO | Featured snippets | 40 to 60 word direct answer under each question heading, steps as ordered lists | SERP check |
| AEO | Question-based content | H2/H3 written as the real questions from keyword research and People Also Ask | question list in keyword-master.csv |
| AEO | Voice search | Short conversational answers, clinic name + city + phone in plain text | read-aloud test |
| AEO | FAQ optimization | Visible FAQ accordion (details/summary). FAQPage markup optional; Google shows FAQ rich results only for some authoritative sites, so never rely on it | Rich Results Test |
| AEO | AI Overview optimization | Dated, sourced WorkSafeBC facts with official links; no unsupported claims | claims-register.csv |
| GEO | AI citations | Citable passages: one fact per paragraph, clinic + service + city named explicitly | AI answer test log |
| GEO | LLM visibility | Same facts, same terms on site, GBP and listings | consistency check |
| GEO | Brand mentions | Local partner, employer-education and community mentions (earned, never paid links) | outreach log |
| GEO | Entity signals | sameAs to GBP / official profiles, consistent NAP, verified practitioner credentials | NAP matrix |
| GEO | AI recommendations | Clear "who this clinic is for" and differentiators per location | page review |
| AIO | AI search visibility | Track a fixed WorkSafe prompt set in SE Ranking AI tracking / manual tests | baseline + day 30/60/90 |
| AIO | AI content optimization | Plain language, headings as questions, tables for coverage facts | content review |
| AIO | AI Overview | Monitor which page is cited for "worksafebc physiotherapy <city>" | SERP snapshot |
| AIO | AI Mode optimization | Comparison-ready facts (hours, parking, languages, services) per clinic | location matrix |
| AIO | AI search analytics | Log query, date, cited URL, accuracy | data/ai-visibility-log.csv |
| SXO | Search intent | Page type matches SERP type (local service page vs info guide) per keyword cluster | competitor SERP analysis |
| SXO | UX & page experience | Mobile-first, 16px+ body, 48px tap targets, WCAG AA contrast | Playwright previews |
| SXO | CRO | One primary CTA per view (Book at this clinic), phone CTA, sticky mobile bar, correct Jane deep link | link QA + GA4 events |
| SXO | Content experience | Scannable steps, cards, timeline, no walls of text | design review |
| SXO | Engagement & retention | Next-step links (what to expect, return-to-work, related clinic), return-visit reminder via existing Jane flow | GA4 engagement |

Privacy rule across all layers: no diagnosis, claim number, PHN or other health data in URLs, GA4 events or ad tools (BC PIPA).

# icbc-source/ — what is (and is not) in this folder

Collected 2026-11-02 by the content/design reverse-engineering specialist (research/02).

## No HTML, CSS or JS source of the ICBC pages was found
- Google Drive searches (`mcp__Google_Drive__search_files`) for `mimeType = text/html | text/css | application/javascript`, titles containing `.html`, `elementor`, `page copy`, `location page`, and fullText `icbc-treatments`, `Enhanced Care`, `worksafe-physiotherapy`, `janeapp` returned no page source files.
- Ahrefs Site Audit page content (`site-audit-projects`, `site-audit-page-content`) returned `Insufficient plan` (HTTP 400). No raw/rendered HTML was obtainable.
- Direct fetch of synergyrehabilitation.ca is blocked by the environment proxy (`curl: (56) CONNECT tunnel failed, response 403`, one attempt).
- WordPress is not connected (see PROJECT-STATE.md), so the Elementor JSON/templates could not be exported.

## What IS here (originals, unmodified)
`drive-yelp-portfolio/` holds the only ICBC/WorkSafe design artefacts found in Drive. They are Yelp portfolio graphics, not web pages, but they show the 2026 brand/visual system used for the ICBC and WorkSafe campaigns.

| File | Drive source | SHA-256 |
|---|---|---|
| synergy-icbc-yelp-portfolio.zip | Drive id 1leEEDSnn4nPUxMpovkL8okVGkY_mHoUY (modified 2026-09-14) | fa71339ee0fa591618d8e5c8e170a2fc749bcf4c07e08a9858cf59d45d198921 |
| synergy-worksafe-portfolio.zip | Drive id 1vQCTOkXBtLAgR5_aCCiOlixjBzl4jMFc (modified 2026-09-14) | 2d668435dc4b558af94dfd51863ef9eff59839e39fbeba4193c5f80b9c119d44 |
| icbc/01-cover-been-in-a-car-accident.png | extracted from ICBC zip | ffa4cd24aee10211c585b933339bbec1c9a5b0d33486969da5479645c93fa932 |
| icbc/02-icbc-three-steps.png | extracted from ICBC zip | 6df861c94f1a44961768a0eab9a91b744bd622213d8972581ab8a0700ed2121c |
| icbc/CAPTIONS.txt | extracted from ICBC zip | b5e4255831cd1d3f396c9ecdf63eb93d8c176e61aff646d46eca1fd0d2d03b7b |
| worksafe/01-cover-hurt-on-the-job.png | extracted from WorkSafe zip | 21a1d4913ced8b965eab9bf8df934cce04ff1006bd891d1d048d7c9a29c52505 |
| worksafe/02-worksafe-three-steps.png | extracted from WorkSafe zip | 64c2c621ec412a204ef65f319755cc16e2b2264f9deccf271738c7044cd33611 |
| worksafe/CAPTIONS.txt | extracted from WorkSafe zip | af57556d2bb87baf113a9359500795bc4a0ec7928eefd6f999c27118688e1dd9 |

The WorkSafe graphics contain WorkSafeBC claims (no referral "in most cases", direct billing, progress and return-to-work reports). Those claims are unverified marketing copy: check them against the claims register before reuse.

To obtain real page source later: allowlist synergyrehabilitation.ca in the environment network settings, or connect WordPress and export the Elementor templates for the /icbc-treatments/ pages.

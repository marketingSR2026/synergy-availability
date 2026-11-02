// Capture previews at phone and desktop widths. Usage: node build/screenshot.mjs <page-id>... (default: pillar + wave 1)
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = process.argv.slice(2).length ? process.argv.slice(2) : ['pillar', 'new-westminster', 'richmond', 'abbotsford'];
const out = path.join(ROOT, 'previews'); fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const results = [];
for (const id of pages) {
  for (const [w, h, tag] of [[390, 844, 'mobile'], [1280, 900, 'desktop']]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: tag === 'mobile' ? 2 : 1 });
    const page = await ctx.newPage();
    await page.goto('file://' + path.join(ROOT, 'pages/dist', id, 'preview.html'), { waitUntil: 'networkidle' }).catch(() => {});
    await page.waitForTimeout(400);
    const m = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > window.innerWidth, scrollW: document.documentElement.scrollWidth,
      smallTargets: [...document.querySelectorAll('.sr-ws-page a, .sr-ws-page summary')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 24; }).length }));
    await page.screenshot({ path: path.join(out, `${id}-${tag}.png`), fullPage: true });
    await page.screenshot({ path: path.join(out, `${id}-${tag}-fold.png`) });
    results.push({ id, tag, ...m });
    await ctx.close();
  }
}
await browser.close();
console.log(JSON.stringify(results));

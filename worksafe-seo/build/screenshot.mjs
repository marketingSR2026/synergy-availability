// Capture previews at phone and desktop widths and check the hero fold.
// Usage: node build/screenshot.mjs [dir] <page-id>...   (dir defaults to pages/dist; pages default: pillar + wave 1)
// Fold check: at 390x664 (about an iPhone viewport with browser bars) under a 56 px theme header, Book and Call must be visible.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const { chromium } = createRequire(import.meta.url)('playwright');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let args = process.argv.slice(2);
const src = args[0] && fs.existsSync(path.resolve(args[0])) ? path.resolve(args.shift()) : path.join(ROOT, 'pages/dist');
const pages = args.length ? args : ['pillar', 'new-westminster', 'richmond', 'abbotsford'];
const out = path.join(ROOT, 'previews'); fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const results = [];
for (const id of pages) {
  for (const [w, h, tag] of [[390, 664, 'mobile'], [1280, 900, 'desktop']]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: tag === 'mobile' ? 2 : 1 });
    const page = await ctx.newPage();
    await page.goto('file://' + path.join(src, id, 'preview.html'), { waitUntil: 'networkidle' }).catch(() => {});
    await page.addStyleTag({ content: '.pv-banner{display:none}' });
    await page.waitForTimeout(400);
    const m = await page.evaluate(() => {
      const r = (e) => (e ? Math.round(e.getBoundingClientRect().bottom) : null);
      const book = r(document.querySelector('.sr-ws-hero .sr-ws-btn--primary'));
      const call = r(document.querySelector('.sr-ws-hero .sr-ws-btn--secondary'));
      return { overflow: document.documentElement.scrollWidth > window.innerWidth, bookBottom: book, secondaryBottom: call, foldOk: book <= window.innerHeight && call <= window.innerHeight,
        smallTargets: [...document.querySelectorAll('.sr-ws-page a, .sr-ws-page summary')].filter((e) => { const b = e.getBoundingClientRect(); const inline = getComputedStyle(e).display === 'inline'; return !inline && b.width > 0 && b.height > 0 && b.height < 24; }).length };
    });
    await page.screenshot({ path: path.join(out, `${id}-${tag}.png`), fullPage: true });
    await page.screenshot({ path: path.join(out, `${id}-${tag}-fold.png`) });
    results.push({ id, tag, ...m });
    await ctx.close();
  }
}
await browser.close();
for (const r of results) console.log(JSON.stringify(r));

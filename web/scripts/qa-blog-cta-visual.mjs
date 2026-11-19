/**
 * Screenshots — CTA centering + batch5 pilot leads.
 * QA_BASE_URL=http://localhost:3016 npx tsx scripts/qa-blog-cta-visual.mjs
 */
import { chromium, devices } from "playwright";
import { mkdirSync } from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3016";
const OUT = path.resolve("..", "migration-audit", "qa-blog-cta-centering");

const PAGES = [
  { name: "batch5-digital-age", slug: "/%d7%a0%d7%99%d7%94%d7%95%d7%9c-%d7%a2%d7%a1%d7%a7-%d7%91%d7%a2%d7%99%d7%93%d7%9f-%d7%94%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99/" },
  { name: "batch4-regression", slug: "/%d7%a4%d7%a8%d7%a1%d7%95%d7%9d-%d7%91%d7%92%d7%95%d7%92%d7%9c-7-%d7%90%d7%a1%d7%98%d7%a8%d7%98%d7%92%d7%99%d7%95%d7%aa/" },
  { name: "batch5-en", slug: "/en/managing-business-digital-age/" },
];

mkdirSync(OUT, { recursive: true });

async function main() {
  const browser = await chromium.launch();
  for (const p of PAGES) {
    for (const [mode, opts] of [
      ["desktop", { viewport: { width: 1280, height: 900 } }],
      ["mobile", devices["Pixel 5"]],
    ]) {
      const ctx = await browser.newContext(opts);
      const page = await ctx.newPage();
      await page.addInitScript(() => {
        sessionStorage.setItem("adwrks_popup_session_suppressed", "1");
        localStorage.setItem("adwrks_popup_dismissed_until", String(Date.now() + 86400000));
      });
      await page.goto(`${BASE}${p.slug}`, { waitUntil: "load", timeout: 60000 });
      await page.waitForSelector(".adwrks-article-lead, .article-body-html", { timeout: 20000 });
      await page.waitForTimeout(800);
      await page.locator(".adwrks-article-lead, .article-top-meta").first().scrollIntoViewIfNeeded().catch(() => {});
      await page.screenshot({
        path: path.join(OUT, `${p.name}-lead-${mode}.png`),
        fullPage: false,
      });
      const cta = page.locator(".article-inline-cta-block, .elementor-widget-button:has([data-open-contextual-popup])").first();
      if ((await cta.count()) > 0) {
        await cta.scrollIntoViewIfNeeded();
        const box = await cta.boundingBox();
        if (box) {
          await page.screenshot({
            path: path.join(OUT, `${p.name}-cta-${mode}.png`),
            clip: box,
          });
        }
      }
      await ctx.close();
    }
  }
  await browser.close();
  console.log("OUT", OUT);
}

main();
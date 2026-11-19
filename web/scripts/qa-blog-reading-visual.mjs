/**
 * Screenshots — reading UX (after). Before = production pre-PR reference.
 * QA_BASE_URL=http://localhost:3004 npx tsx scripts/qa-blog-reading-visual.mjs
 */
import { chromium, devices } from "playwright";
import { mkdirSync } from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3004";
const OUT = path.resolve("..", "migration-audit", "qa-blog-reading-ux");

const PAGES = [
  { slug: "/%d7%a4%d7%a8%d7%a1%d7%95%d7%9d-%d7%91%d7%92%d7%95%d7%92%d7%9c-7-%d7%90%d7%a1%d7%98%d7%a8%d7%98%d7%92%d7%99%d7%95%d7%aa/", name: "batch4-google-ads" },
  { slug: "/%d7%97%d7%91%d7%a8%d7%94-%d7%9c%d7%a9%d7%99%d7%95%d7%95%d7%a7-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99/", name: "batch4-agency" },
  { slug: "/%d7%a7%d7%99%d7%93%d7%95%d7%9d-%d7%90%d7%aa%d7%a8%d7%99%d7%9d-%d7%91%d7%a8%d7%95%d7%a1%d7%99%d7%aa/", name: "legacy-ru-seo" },
  { slug: "/en/google-shopping-guide/", name: "en-shopping" },
];

mkdirSync(OUT, { recursive: true });

async function main() {
  const browser = await chromium.launch();
  for (const p of PAGES) {
    for (const [mode, opts] of [
      ["desktop", {}],
      ["mobile", devices["Pixel 5"]],
    ]) {
      const ctx = await browser.newContext(opts);
      const page = await ctx.newPage();
      await page.addInitScript(() => {
        sessionStorage.setItem("adwrks_popup_session_suppressed", "1");
        localStorage.setItem("adwrks_popup_dismissed_until", String(Date.now() + 86400000));
      });
      await page.goto(`${BASE}${p.slug}`, { waitUntil: "networkidle" });
      await page.locator(".adwrks-article-lead, .article-top-meta").first().scrollIntoViewIfNeeded();
      await page.screenshot({
        path: path.join(OUT, `${p.name}-${mode}-after.png`),
        fullPage: false,
      });
      await ctx.close();
    }
  }
  await browser.close();
}

main();
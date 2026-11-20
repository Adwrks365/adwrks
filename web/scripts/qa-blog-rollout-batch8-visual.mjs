/**
 * Playwright — batch8 articles (desktop + mobile).
 * QA_BASE_URL=http://localhost:3000 npx tsx scripts/qa-blog-rollout-batch8-visual.mjs
 */
import { chromium, devices } from "playwright";
import { mkdirSync } from "node:fs";
import path from "node:path";

const BASE = (process.env.QA_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const OUT = path.resolve("..", "migration-audit", "qa-blog-rollout-batch8");

const PAGES = [
  { slug: "/%d7%94%d7%97%d7%99%d7%a4%d7%95%d7%a9%d7%99%d7%9d-%d7%94%d7%9b%d7%99-%d7%a4%d7%95%d7%a4%d7%95%d7%9c%d7%a8%d7%99%d7%99%d7%9d-%d7%91%d7%92%d7%95%d7%92%d7%9c-%d7%94%d7%99%d7%95%d7%9d-%d7%91%d7%99%d7%a9/", name: "batch8-trends-he" },
  { slug: "/google-business-profile/", name: "batch8-gbp-he" },
  { slug: "/en/popular-google-searches-israel/", name: "batch8-trends-en" },
  { slug: "/en/power-of-reviews/", name: "batch8-reviews-en" },
  { slug: "/en/digital-advertising-office/", name: "batch8-office-en" },
];

mkdirSync(OUT, { recursive: true });

async function assertArticle(page, name) {
  const lead = page.locator(".adwrks-article-lead");
  if ((await lead.count()) < 1) throw new Error(`missing lead on ${name}`);
  const faq = page.locator(".adwrks-article-faq-block details.adwrks-faq-item");
  if ((await faq.count()) < 3) throw new Error(`faq count on ${name}`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflow > 8) throw new Error(`horizontal scroll ${overflow}px on ${name}`);
}

async function main() {
  const browser = await chromium.launch();
  let failed = 0;
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
      try {
        await page.goto(`${BASE}${p.slug}`, { waitUntil: "domcontentloaded", timeout: 90000 });
        await page.locator(".article-body-html, .adwrks-article-lead").first().waitFor({ timeout: 60000 });
        await assertArticle(page, `${p.name}-${mode}`);
        await page.locator(".adwrks-article-lead").first().scrollIntoViewIfNeeded().catch(() => {});
        await page.screenshot({ path: path.join(OUT, `${p.name}-${mode}.png`), fullPage: false });
        console.log("OK", p.name, mode);
      } catch (e) {
        console.error("FAIL", p.name, mode, e.message);
        failed++;
      }
      await ctx.close();
    }
  }
  await browser.close();
  console.log(failed ? "VISUAL_FAILED" : "VISUAL_PASSED", "out", OUT);
  process.exit(failed ? 1 : 0);
}

main();
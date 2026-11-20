/**
 * Playwright — batch6/7 sample (desktop + mobile).
 * QA_BASE_URL=http://localhost:3004 npx tsx scripts/qa-blog-rollout-visual.mjs
 */
import { chromium, devices } from "playwright";
import { mkdirSync } from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3004";
const OUT = path.resolve("..", "migration-audit", "qa-blog-rollout-batch67");

const PAGES = [
  { slug: "/%d7%a4%d7%a8%d7%a1%d7%95%d7%9d-%d7%9c%d7%a2%d7%a1%d7%a7%d7%99%d7%9d/", name: "batch6-advertising-he" },
  { slug: "/%d7%9b%d7%95%d7%97%d7%9d-%d7%a9%d7%9c-%d7%91%d7%99%d7%a7%d7%95%d7%a8%d7%95%d7%aa-%d7%95%d7%94%d7%9e%d7%9c%d7%a6%d7%95%d7%aa/", name: "batch6-reviews-he" },
  { slug: "/en/business-advertising/", name: "batch7-business-en" },
  { slug: "/en/paid-vs-organic-seo/", name: "batch7-paid-organic-en" },
];

mkdirSync(OUT, { recursive: true });

async function assertLead(page, name) {
  const lead = page.locator(".adwrks-article-lead-2026, .adwrks-article-lead");
  if ((await lead.count()) < 1) throw new Error(`missing lead on ${name}`);
  const faq = page.locator(".adwrks-article-faq-block details.adwrks-faq-item");
  const n = await faq.count();
  if (n < 3) throw new Error(`faq count ${n} on ${name}`);
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
        await page.goto(`${BASE}${p.slug}`, { waitUntil: "domcontentloaded", timeout: 60000 });
        await page.locator(".article-body, .adwrks-article-lead").first().waitFor({ timeout: 20000 });
        await assertLead(page, `${p.name}-${mode}`);
        await page.locator(".adwrks-article-lead").first().scrollIntoViewIfNeeded().catch(() => {});
        await page.screenshot({
          path: path.join(OUT, `${p.name}-${mode}.png`),
          fullPage: false,
        });
        console.log("OK", p.name, mode);
      } catch (e) {
        console.error("FAIL", p.name, mode, e.message);
        failed++;
      }
      await ctx.close();
    }
  }
  await browser.close();
  process.exit(failed ? 1 : 0);
}

main();
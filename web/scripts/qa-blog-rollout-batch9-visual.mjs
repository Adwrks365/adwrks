/**
 * Playwright — batch9 articles (desktop + mobile).
 * QA_BASE_URL=http://localhost:3000 npx tsx scripts/qa-blog-rollout-batch9-visual.mjs
 */
import { chromium, devices } from "playwright";
import { mkdirSync } from "node:fs";
import path from "node:path";

const BASE = (process.env.QA_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const OUT = path.resolve("..", "migration-audit", "qa-blog-rollout-batch9");

const ALL_PAGES = [
  { slug: "/%d7%a6%d7%9e%d7%99%d7%97%d7%94-%d7%a2%d7%a1%d7%a7%d7%99%d7%aa-%d7%91%d7%90%d7%9e%d7%a6%d7%a2%d7%95%d7%aa-%d7%a7%d7%99%d7%93%d7%95%d7%9d-%d7%91%d7%90%d7%99%d7%a0%d7%98%d7%a8%d7%a0%d7%98/", name: "batch9-growth-he" },
  { slug: "/en/google-business-profile/", name: "batch9-gbp-en" },
  { slug: "/en/google-business-promotion-guide/", name: "batch9-promo-en" },
  { slug: "/en/business-growth-through-seo/", name: "batch9-growth-en" },
  { slug: "/en/digital-marketing-agency-maximize/", name: "batch9-agency-en" },
];

const only = process.env.QA_VISUAL_ONLY?.split(",").map((s) => s.trim()).filter(Boolean);
const PAGES = only?.length
  ? ALL_PAGES.filter((p) => only.includes(p.name))
  : ALL_PAGES;

mkdirSync(OUT, { recursive: true });

async function assertArticle(page, name) {
  const lead = page.locator('aside.adwrks-article-lead[data-adwrks-content="adwrks-article-lead-2026"]');
  await lead.first().waitFor({ state: "visible", timeout: 60000 });
  const leadText = (await lead.first().innerText()).trim();
  if (leadText.length < 40) throw new Error(`lead too short on ${name}`);
  if (!(await lead.first().isVisible())) throw new Error(`lead not visible on ${name}`);
  const box = await lead.first().boundingBox();
  if (!box || box.height < 8 || box.width < 8) throw new Error(`lead has no layout box on ${name}`);
  const faq = page.locator(".adwrks-article-faq-block details.adwrks-faq-item");
  if ((await faq.count()) < 3) throw new Error(`faq count on ${name}`);
  const first = faq.first();
  await first.scrollIntoViewIfNeeded();
  await first.locator("summary").click();
  await page.waitForTimeout(200);
  const open = await first.evaluate((el) => el.hasAttribute("open"));
  if (!open) throw new Error(`faq toggle on ${name}`);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
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
        await page.goto(`${BASE}${p.slug}`, { waitUntil: "networkidle", timeout: 90000 });
        await page
          .locator('aside.adwrks-article-lead[data-adwrks-content="adwrks-article-lead-2026"]')
          .first()
          .waitFor({ state: "visible", timeout: 60000 });
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
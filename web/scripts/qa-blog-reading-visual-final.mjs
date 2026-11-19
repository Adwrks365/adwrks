/**
 * Final visual QA — lead, FAQ, CTA for Batch4 + regressions.
 * QA_BASE_URL=http://localhost:3015 npx tsx scripts/qa-blog-reading-visual-final.mjs
 */
import { chromium, devices } from "playwright";
import { mkdirSync } from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3015";
const OUT = path.resolve("..", "migration-audit", "qa-blog-reading-ux", "final-552bff9");

const PAGES = [
  {
    name: "batch4-google-7",
    slug: "/%d7%a4%d7%a8%d7%a1%d7%95%d7%9d-%d7%91%d7%92%d7%95%d7%92%d7%9c-7-%d7%90%d7%a1%d7%98%d7%a8%d7%98%d7%92%d7%99%d7%95%d7%aa/",
  },
  {
    name: "batch4-agency-co",
    slug: "/%d7%97%d7%91%d7%a8%d7%94-%d7%9c%d7%a9%d7%99%d7%95%d7%95%d7%a7-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99/",
  },
  {
    name: "batch4-choose-agency",
    slug: "/%d7%9b%d7%9a-%d7%91%d7%95%d7%97%d7%a8%d7%99%d7%9d-%d7%97%d7%91%d7%a8%d7%94-%d7%9c%d7%a9%d7%99%d7%95%d7%95%d7%a7-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99/",
  },
  {
    name: "batch4-seo-beginners",
    slug: "/%d7%a7%d7%99%d7%93%d7%95%d7%9d-%d7%90%d7%aa%d7%a8%d7%99%d7%9d-%d7%9e%d7%93%d7%a8%d7%99%d7%9a-%d7%9c%d7%9e%d7%aa%d7%97%d7%99%d7%9c%d7%99%d7%9d/",
  },
  {
    name: "batch4-digital-consultant",
    slug: "/%d7%99%d7%95%d7%a2%d7%a5-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c-%d7%94%d7%95%d7%90-%d7%94%d7%a9%d7%95%d7%aa%d7%a3-%d7%a9%d7%9c%d7%9a-%d7%9c%d7%94%d7%a6%d7%9c%d7%97%d7%94/",
  },
  {
    name: "legacy-ru-seo",
    slug: "/%d7%a7%d7%99%d7%93%d7%95%d7%9d-%d7%90%d7%aa%d7%a8%d7%99%d7%9d-%d7%91%d7%a8%d7%95%d7%a1%d7%99%d7%aa/",
  },
  { name: "en-shopping", slug: "/en/google-shopping-guide/" },
];

const REGIONS = [
  { id: "lead", selector: ".adwrks-article-lead" },
  { id: "body-mid", selector: ".article-body-html h2:nth-of-type(3)" },
  { id: "faq", selector: ".adwrks-article-faq-block" },
  { id: "cta", selector: ".article-cta-block, .adwrks-article-cta" },
];

mkdirSync(OUT, { recursive: true });


async function main() {
  const browser = await chromium.launch();
  for (const p of PAGES) {
    for (const [mode, opts] of [
      ["desktop", { viewport: { width: 1280, height: 900 } }],
      ["mobile", { ...devices["Pixel 5"] }],
    ]) {
      const ctx = await browser.newContext(opts);
      const page = await ctx.newPage();
      await page.addInitScript(() => {
        sessionStorage.setItem("adwrks_popup_session_suppressed", "1");
        localStorage.setItem("adwrks_popup_dismissed_until", String(Date.now() + 86400000));
      });
      const url = `${BASE}${p.slug}`;
      await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });

      for (const reg of REGIONS) {
        const loc = page.locator(reg.selector).first();
        if ((await loc.count()) === 0) continue;
        await loc.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);
        const box = await loc.boundingBox();
        if (box) {
          await page.screenshot({
            path: path.join(OUT, `${p.name}-${reg.id}-${mode}.png`),
            clip: {
              x: Math.max(0, box.x - 24),
              y: Math.max(0, box.y - 40),
              width: Math.min(opts.viewport?.width ?? 393, box.width + 48),
              height: Math.min(720, box.height + 80),
            },
          });
        } else {
          await page.screenshot({
            path: path.join(OUT, `${p.name}-${reg.id}-${mode}.png`),
            fullPage: false,
          });
        }
      }

      const lead = page.locator(".adwrks-article-lead");
      const faqItems = page.locator(".adwrks-faq-item");
      const summaryH2 = page.locator(".article-body-html h2", {
        hasText: /^(סיכום|לסיכום)/,
      });
      console.log(
        JSON.stringify({
          page: p.name,
          mode,
          lead: await lead.count(),
          faqItems: await faqItems.count(),
          summaryH2: await summaryH2.count(),
          hasFaqBlock: (await page.locator(".adwrks-article-faq-block").count()) > 0,
        }),
      );

      await ctx.close();
    }
  }
  await browser.close();
  console.log("OUT", OUT);
}

main();
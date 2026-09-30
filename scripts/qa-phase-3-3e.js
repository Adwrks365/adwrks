#!/usr/bin/env node
/** Phase 3.3E article template + entity QA */
const fs = require("fs");
const path = require("path");

const BASE = process.argv.includes("--base")
  ? process.argv[process.argv.indexOf("--base") + 1]
  : "http://localhost:3000";

const OUT_DIR = path.join(__dirname, "..", "migration-audit", "visual-qa-phase-3-3e");
const REPORT = path.join(__dirname, "..", "migration-audit", "qa-phase-3-3e.json");

const ARTICLES = [
  {
    name: "pagespeed-2026",
    url: "/%d7%a9%d7%99%d7%a4%d7%95%d7%a8-%d7%9e%d7%94%d7%99%d7%a8%d7%95%d7%aa-%d7%90%d7%aa%d7%a8-2026-pagespeed/",
  },
  {
    name: "seo-2026-ai",
    url: "/seo-2026-ai-answers/",
  },
  {
    name: "pagespeed-tool",
    url: "/%d7%91%d7%93%d7%99%d7%a7%d7%aa-%d7%9e%d7%94%d7%99%d7%a8%d7%95%d7%aa-%d7%90%d7%aa%d7%a8/",
  },
  {
    name: "roi-calculator",
    url: "/%d7%9e%d7%97%d7%a9%d7%91%d7%95%d7%9f-roi-%d7%9e%d7%a2%d7%95%d7%93%d7%9b%d7%9f-2026/",
  },
];

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  const steps = [];

  function log(step, pass, detail = "") {
    steps.push({ step, pass, detail });
  }

  for (const width of [390, 1440]) {
    for (const article of ARTICLES) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, locale: "he-IL" });
      const page = await ctx.newPage();
      await page.goto(`${BASE}${article.url}`, { waitUntil: "networkidle", timeout: 90000 });
      await page.screenshot({
        path: path.join(OUT_DIR, `${article.name}-${width}.png`),
        fullPage: true,
      });

      const h1Count = await page.locator("h1").count();
      log(`${width}px ${article.name} single H1`, h1Count === 1, `count=${h1Count}`);

      const bodyText = await page.locator("article.article-page").innerText().catch(() => "");
      log(
        `${width}px ${article.name} no raw entities`,
        !/&quot;|&#8211;|&amp;quot;|&nbsp;/.test(bodyText),
        bodyText.match(/&quot;|&#8211;|&amp;quot;/)?.[0] || "ok",
      );

      const tocInline = await page.locator(".article-toc-inline").count();
      log(`${width}px ${article.name} TOC in article`, tocInline === 1, "");

      const tocOpen = await page.locator(".article-toc-disclosure[open]").count();
      log(`${width}px ${article.name} TOC closed default`, tocOpen === 0, "");

      if (width === 1440) {
        const sidebarRating = await page.locator(".article-aside .article-rating").count();
        log(`${width}px ${article.name} no sidebar rating`, sidebarRating === 0, "");

        const fbProof = await page.locator(".article-fb-proof").count();
        log(`${width}px ${article.name} facebook proof`, fbProof === 1, "");

        const sidebarRelated = await page.locator(".article-aside .article-related-list").count();
        log(`${width}px ${article.name} sidebar related`, sidebarRelated === 1, "");

        const sidebarForm = await page.locator(".article-sidebar-contact").count();
        log(`${width}px ${article.name} sidebar contact`, sidebarForm === 1, "");

        const endRating = await page.locator(".article-end-section .article-rating").count();
        log(`${width}px ${article.name} end rating`, endRating === 1, "");
      }

      await ctx.close();
    }
  }

  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}${ARTICLES[0].url}`, { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(300);
  log("scroll-top visible after scroll", (await page.locator(".floating-util-btn-top").count()) === 1, "");
  await page.locator(".floating-util-btn-top").click();
  await page.waitForTimeout(400);
  const y = await page.evaluate(() => window.scrollY);
  log("scroll-top returns near top", y < 60, `y=${y}`);
  await ctx.close();

  await browser.close();

  const report = {
    timestamp: new Date().toISOString(),
    base: BASE,
    steps,
    passed: steps.filter((s) => s.pass).length,
    failed: steps.filter((s) => !s.pass).length,
  };
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ passed: report.passed, failed: report.failed }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

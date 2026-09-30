#!/usr/bin/env node
/**
 * Real browser visual QA — captures screenshots at required breakpoints.
 * Usage: node scripts/visual-qa.js [--base http://localhost:3000]
 */
const fs = require("fs");
const path = require("path");

const BASE = process.argv.includes("--base")
  ? process.argv[process.argv.indexOf("--base") + 1]
  : "http://localhost:3000";

const OUT = path.join(__dirname, "..", "migration-audit", "visual-qa");
const WIDTHS = [360, 390, 430, 768, 1440, 1920];

const PAGES = [
  { name: "homepage", path: "/" },
  { name: "seo", path: "/seo/" },
  { name: "digital-marketing", path: "/digital-marketing/" },
  { name: "contact-us", path: "/contact-us/" },
  { name: "article-seo-2026", path: "/seo-2026-ai-answers/" },
  { name: "article-pagespeed", path: "/%d7%a9%d7%99%d7%a4%d7%95%d7%a8-%d7%9e%d7%94%d7%99%d7%a8%d7%95%d7%aa-%d7%90%d7%aa%d7%a8-2026-pagespeed/" },
  { name: "article-ppc", path: "/%d7%9b%d7%9e%d7%94-%d7%a2%d7%95%d7%9c%d7%94-%d7%a4%d7%a8%d7%a1%d7%95%d7%9d-%d7%91%d7%92%d7%95%d7%92%d7%9c/" },
  { name: "article-long-seo", path: "/%d7%a2%d7%aa%d7%99%d7%93-%d7%94-seo-%d7%9b%d7%9a-%d7%99%d7%99%d7%a8%d7%90%d7%94-%d7%94%d7%a7%d7%99%d7%93%d7%95%d7%9d-%d7%94%d7%90%d7%95%d7%a8%d7%92%d7%a0%d7%99-%d7%91-2025-%d7%95%d7%9e%d7%a2%d7%91/" },
  { name: "article-no-featured", path: "/%d7%9b%d7%95%d7%97%d7%9d-%d7%a9%d7%9c-%d7%91%d7%99%d7%a7%d7%95%d7%88%d7%95%d7%aa-%d7%95%d7%94%d7%9e%d7%9c%d7%a6%d7%95%d7%aa/" },
  { name: "category-google", path: "/digital-marketing/google/" },
  { name: "google-ads", path: "/google-ads/" },
];

async function main() {
  const { chromium } = await import("playwright");
  fs.mkdirSync(OUT, { recursive: true });

  const report = {
    base: BASE,
    timestamp: new Date().toISOString(),
    breakpoints: WIDTHS,
    pages: [],
    issues: [],
  };

  const browser = await chromium.launch({ headless: true });

  for (const pageDef of PAGES) {
    const pageReport = { name: pageDef.name, path: pageDef.path, shots: [], checks: {} };

    for (const width of WIDTHS) {
      const context = await browser.newContext({
        viewport: { width, height: width <= 430 ? 800 : 900 },
        locale: "he-IL",
      });
      const page = await context.newPage();
      const url = `${BASE}${pageDef.path}`;

      try {
        const resp = await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
        await page.waitForTimeout(500);

        const overflow = await page.evaluate(() => {
          const doc = document.documentElement;
          return doc.scrollWidth > doc.clientWidth + 1;
        });

        const brokenImages = await page.evaluate(() => {
          return [...document.querySelectorAll("img")]
            .filter((img) => !img.complete || img.naturalWidth === 0)
            .map((img) => ({ src: img.currentSrc || img.src, alt: img.alt }));
        });

        const file = `${pageDef.name}-${width}.png`;
        const filePath = path.join(OUT, file);
        await page.screenshot({ path: filePath, fullPage: width <= 768 });

        pageReport.shots.push({ width, file: `migration-audit/visual-qa/${file}` });

        if (overflow) {
          report.issues.push({ page: pageDef.name, width, type: "horizontal-overflow" });
        }
        if (brokenImages.length) {
          report.issues.push({
            page: pageDef.name,
            width,
            type: "broken-images",
            images: brokenImages.slice(0, 5),
          });
        }
        if (resp && resp.status() !== 200) {
          report.issues.push({ page: pageDef.name, width, type: "http", status: resp.status() });
        }
      } catch (err) {
        report.issues.push({ page: pageDef.name, width, type: "error", message: err.message });
      }

      await context.close();
    }

    report.pages.push(pageReport);
  }

  // Mobile menu test at 360
  {
    const context = await browser.newContext({ viewport: { width: 360, height: 800 }, locale: "he-IL" });
    const page = await context.newPage();
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "פתח תפריט" }).click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT, "mobile-menu-360.png"), fullPage: false });
    report.pages.push({
      name: "mobile-menu",
      path: "/",
      shots: [{ width: 360, file: "migration-audit/visual-qa/mobile-menu-360.png" }],
    });
    await context.close();
  }

  await browser.close();

  fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ pages: report.pages.length, issues: report.issues.length, out: OUT }, null, 2));
  if (report.issues.length) console.log("Issues:", JSON.stringify(report.issues, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

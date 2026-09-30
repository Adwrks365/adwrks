#!/usr/bin/env node
/** Phase 3.3 visual QA */
const fs = require("fs");
const path = require("path");

const BASE = process.argv.includes("--base")
  ? process.argv[process.argv.indexOf("--base") + 1]
  : "http://localhost:3000";

const OUT = path.join(__dirname, "..", "migration-audit", "visual-qa-phase-3-3");
const WIDTHS = [390, 1440];

const PAGES = [
  { name: "homepage", path: "/" },
  { name: "services-main", path: "/%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99-%d7%a9%d7%99%d7%95%d7%95%d7%a7-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99/" },
  { name: "seo", path: "/seo/" },
  { name: "google-ads", path: "/google-ads/" },
  { name: "website-building", path: "/website-building/" },
  { name: "social-media", path: "/social-media-management/" },
  { name: "hosting", path: "/hosting-plans/" },
  { name: "about", path: "/about-us/" },
  { name: "contact", path: "/contact-us/" },
  { name: "blog", path: "/blog/" },
  { name: "category", path: "/digital-marketing/" },
  { name: "article-featured", path: "/seo-2026-ai-answers/" },
  { name: "article-long", path: "/%d7%a2%d7%aa%d7%99%d7%93-%d7%94-seo-%d7%9b%d7%9a-%d7%99%d7%99%d7%a8%d7%90%d7%94-%d7%94%d7%a7%d7%99%d7%93%d7%95%d7%9d-%d7%94%d7%90%d7%95%d7%90%d7%92%d7%a0%d7%99-%d7%91-2025-%d7%95%d7%9e%d7%a2%d7%91/" },
];

async function main() {
  const { chromium } = await import("playwright");
  fs.mkdirSync(OUT, { recursive: true });

  const report = { base: BASE, timestamp: new Date().toISOString(), pages: [], issues: [], inspected: [] };
  const browser = await chromium.launch({ headless: true });

  for (const pageDef of PAGES) {
    const pageReport = { name: pageDef.name, shots: [], checks: {} };
    for (const width of WIDTHS) {
      const ctx = await browser.newContext({ viewport: { width, height: width <= 430 ? 844 : 900 }, locale: "he-IL" });
      const page = await ctx.newPage();
      const errors = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
      });
      await page.goto(`${BASE}${pageDef.path}`, { waitUntil: "networkidle", timeout: 90000 });

      const shot = `${pageDef.name}-${width}.png`;
      await page.screenshot({ path: path.join(OUT, shot), fullPage: true });
      pageReport.shots.push(shot);

      if (pageDef.name === "homepage") {
        pageReport.checks.testimonialCarousel = await page.locator(".carousel-testimonials").count() > 0;
        pageReport.checks.portfolioCarousel = await page.locator(".carousel-portfolio").count() > 0;
        if (!pageReport.checks.testimonialCarousel) report.issues.push({ page: pageDef.name, issue: "missing testimonial carousel" });
        if (!pageReport.checks.portfolioCarousel) report.issues.push({ page: pageDef.name, issue: "missing portfolio carousel" });
      }

      if (pageDef.name === "article-featured") {
        pageReport.checks.articleTemplate = await page.locator(".article-template-prose").count() > 0;
      }

      if (errors.length) report.issues.push({ page: pageDef.name, width, consoleErrors: errors.slice(0, 3) });

      await ctx.close();
    }
    report.pages.push(pageReport);
    report.inspected.push(pageDef.name);
  }

  await browser.close();
  fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ pages: report.pages.length, issues: report.issues.length }, null, 2));
}

main().catch((e) => { console.error(e); process.exit(1); });

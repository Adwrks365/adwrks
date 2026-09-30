#!/usr/bin/env node
/**
 * Phase 3.2B visual QA — structural repair verification.
 */
const fs = require("fs");
const path = require("path");

const BASE = process.argv.includes("--base")
  ? process.argv[process.argv.indexOf("--base") + 1]
  : "http://localhost:3000";

const OUT = path.join(__dirname, "..", "migration-audit", "visual-qa-phase-3-2b");
const WIDTHS = [390, 1440];

const PAGES = [
  { name: "homepage", path: "/" },
  { name: "blog-landing", path: "/blog/" },
  { name: "about-us", path: "/about-us/" },
  { name: "contact-us", path: "/contact-us/" },
  { name: "services-main", path: "/%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99-%d7%a9%d7%99%d7%95%d7%95%d7%a7-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99/" },
  { name: "seo", path: "/seo/" },
  { name: "google-ads", path: "/google-ads/" },
  { name: "website-building", path: "/website-building/" },
  { name: "social-media-management", path: "/social-media-management/" },
  { name: "hosting-plans", path: "/hosting-plans/" },
];

const EXPECTATIONS = {
  "blog-landing": ["חדשות ומידע מקצועי"],
  "website-building": ["למי שירות בניית אתרים", "מה כולל תהליך", "למה לבנות את האתר"],
};

async function main() {
  const { chromium } = await import("playwright");
  fs.mkdirSync(OUT, { recursive: true });

  const report = {
    base: BASE,
    timestamp: new Date().toISOString(),
    breakpoints: WIDTHS,
    pages: [],
    issues: [],
    inspected: [],
  };

  const browser = await chromium.launch({ headless: true });

  for (const pageDef of PAGES) {
    const pageReport = { name: pageDef.name, path: pageDef.path, shots: [], checks: {} };

    for (const width of WIDTHS) {
      const context = await browser.newContext({
        viewport: { width, height: width <= 430 ? 844 : 900 },
        locale: "he-IL",
      });
      const page = await context.newPage();
      const url = `${BASE}${pageDef.path}`;

      await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });

      const shotName = `${pageDef.name}-${width}.png`;
      await page.screenshot({ path: path.join(OUT, shotName), fullPage: true });
      pageReport.shots.push(shotName);

      const bodyText = await page.locator("body").innerText();
      const expectations = EXPECTATIONS[pageDef.name] ?? [];
      for (const exp of expectations) {
        pageReport.checks[exp] = bodyText.includes(exp);
        if (!bodyText.includes(exp)) {
          report.issues.push({ page: pageDef.name, width, type: "missing-text", text: exp });
        }
      }

      const emptySections = await page.evaluate(() => {
        const found = [];
        for (const section of document.querySelectorAll(".verified-service-page .section, .verified-service-page section")) {
          const h = section.querySelector("h2,h3");
          const heading = h?.textContent?.trim() ?? "";
          const text = (section.textContent || "").replace(heading, "").trim();
          const height = section.getBoundingClientRect().height;
          if (heading && text.length < 30 && height > 180) {
            found.push({ heading, height: Math.round(height) });
          }
        }
        return found;
      });

      if (emptySections.length) {
        report.issues.push({ page: pageDef.name, width, type: "empty-sections", items: emptySections });
      }

      await context.close();
    }

    report.pages.push(pageReport);
    report.inspected.push(pageDef.name);
  }

  await browser.close();

  fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2), "utf8");
  console.log(JSON.stringify({ pages: report.pages.length, issues: report.issues.length }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * Detect suspicious empty sections on rendered pages.
 * Usage: node scripts/audit-empty-sections.js [--base http://localhost:3000]
 */
const fs = require("fs");
const path = require("path");

const BASE = process.argv.includes("--base")
  ? process.argv[process.argv.indexOf("--base") + 1]
  : "http://localhost:3000";

const PAGES = [
  "/",
  "/blog/",
  "/about-us/",
  "/contact-us/",
  "/seo/",
  "/google-ads/",
  "/website-building/",
  "/social-media-management/",
  "/hosting-plans/",
  "/שירותי-שיווק-דיגיטלי/",
];

async function main() {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  const findings = [];

  for (const pagePath of PAGES) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${BASE}${pagePath}`, { waitUntil: "networkidle", timeout: 90000 });

    const issues = await page.evaluate(() => {
      const out = [];
      const sections = document.querySelectorAll(".section, section");

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        const heading = section.querySelector("h1,h2,h3,h4");
        const headingText = heading?.textContent?.trim() ?? "";
        const bodyText = (section.textContent || "").replace(headingText, "").trim();
        const imgs = [...section.querySelectorAll("img")];
        const brokenImgs = imgs.filter((img) => !img.complete || img.naturalWidth === 0);
        const emptyImgShell = imgs.length === 0 && section.querySelector(".service-media-card, .page-hero-media");

        if (headingText && bodyText.length < 40 && rect.height > 200) {
          out.push({ type: "heading-without-body", heading: headingText, height: Math.round(rect.height) });
        }
        if (rect.height > 500 && bodyText.length < 60) {
          out.push({ type: "giant-whitespace", heading: headingText, height: Math.round(rect.height) });
        }
        if (brokenImgs.length) {
          out.push({ type: "broken-images", count: brokenImgs.length, heading: headingText });
        }
        if (emptyImgShell) {
          out.push({ type: "empty-image-container", heading: headingText });
        }
      }

      const bodyText = document.body.innerText;
      const dupes = [];
      const paragraphs = bodyText.split("\n").map((l) => l.trim()).filter((l) => l.length > 40);
      const seen = new Map();
      for (const p of paragraphs) {
        seen.set(p, (seen.get(p) || 0) + 1);
      }
      for (const [text, count] of seen) {
        if (count > 1) dupes.push({ text: text.slice(0, 80), count });
      }
      if (dupes.length) out.push({ type: "duplicate-paragraphs", items: dupes.slice(0, 5) });

      return out;
    });

    if (issues.length) findings.push({ page: pagePath, issues });
    await page.close();
  }

  await browser.close();

  const report = {
    timestamp: new Date().toISOString(),
    base: BASE,
    pagesScanned: PAGES.length,
    pagesWithIssues: findings.length,
    findings,
  };

  const outPath = path.join(__dirname, "..", "migration-audit", "empty-section-audit.json");
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");
  console.log(JSON.stringify({ pagesWithIssues: findings.length, findings: findings.map((f) => f.page) }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

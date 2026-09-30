#!/usr/bin/env node
/**
 * Phase 3.2 visual QA — improved checks + screenshots at 390px and 1440px.
 */
const fs = require("fs");
const path = require("path");

const BASE = process.argv.includes("--base")
  ? process.argv[process.argv.indexOf("--base") + 1]
  : "http://localhost:3000";

const OUT = path.join(__dirname, "..", "migration-audit", "visual-qa-phase-3-2");
const WIDTHS = [390, 1440];

const PAGES = [
  { name: "homepage", path: "/" },
  { name: "about-us", path: "/about-us/" },
  { name: "contact-us", path: "/contact-us/" },
  { name: "services-main", path: "/%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99-%d7%a9%d7%99%d7%95%d7%95%d7%a7-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99/" },
  { name: "seo", path: "/seo/" },
  { name: "digital-marketing", path: "/digital-marketing/" },
  { name: "blog-listing", path: "/digital-marketing/" },
  { name: "category-google", path: "/digital-marketing/google/" },
  { name: "article-seo-2026", path: "/seo-2026-ai-answers/" },
  { name: "article-pagespeed", path: "/%d7%a9%d7%99%d7%a4%d7%95%d7%a8-%d7%9e%d7%94%d7%99%d7%a8%d7%95%d7%aa-%d7%90%d7%aa%d7%a8-2026-pagespeed/" },
  { name: "article-ppc", path: "/%d7%9b%d7%9e%d7%94-%d7%a2%d7%95%d7%9c%d7%94-%d7%a4%d7%a8%d7%a1%d7%95%d7%9d-%d7%91%d7%92%d7%95%d7%92%d7%9c/" },
  { name: "article-long-seo", path: "/%d7%a2%d7%aa%d7%99%d7%93-%d7%94-seo-%d7%9b%d7%9a-%d7%99%d7%99%d7%a8%d7%90%d7%94-%d7%94%d7%a7%d7%99%d7%93%d7%95%d7%9d-%d7%94%d7%90%d7%95%d7%88%d7%92%d7%a0%d7%99-%d7%91-2025-%d7%95%d7%9e%d7%a2%d7%91/" },
  { name: "article-reviews", path: "/%d7%9b%d7%95%d7%97%d7%9d-%d7%a9%d7%9c-%d7%91%d7%99%d7%a7%d7%95%d7%88%d7%95%d7%aa-%d7%95%d7%94%d7%9e%d7%9c%d7%a6%d7%95%d7%aa/" },
  { name: "google-ads", path: "/google-ads/" },
];

const PAGE_EXPECTATIONS = {
  "about-us": ["Adwrks 365", "סוכנות", "מיכאל וינר"],
  "contact-us": ["יצירת קשר", "טופס"],
  seo: ["קידום", "SEO"],
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
    consoleErrors: [],
    networkFailures: [],
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
      const consoleErrors = [];
      const networkFailures = [];

      page.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push(msg.text());
      });
      page.on("requestfailed", (req) => {
        networkFailures.push({ url: req.url(), failure: req.failure()?.errorText });
      });

      const url = `${BASE}${pageDef.path}`;

      try {
        const resp = await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
        const httpStatus = resp?.status() ?? 0;
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(600);

        const checks = await page.evaluate((payload) => {
          const expectations = payload?.expectations || [];
          const httpStatus = payload?.httpStatus || 0;
          const bodyText = document.body.innerText || "";
          const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;

          const brokenImages = [...document.querySelectorAll("img")]
            .filter((img) => {
              const rect = img.getBoundingClientRect();
              const visible = rect.width > 20 && rect.height > 20;
              return visible && (!img.complete || img.naturalWidth === 0);
            })
            .map((img) => img.currentSrc || img.src);

          const emptyImageContainers = [...document.querySelectorAll(".elementor-widget-image, .page-hero-media, .about-media-card")]
            .filter((el) => {
              const rect = el.getBoundingClientRect();
              const img = el.querySelector("img");
              return rect.height > 120 && (!img || img.naturalWidth === 0);
            }).length;

          const rawShortcodes = (bodyText.match(/\[[\w\-]+[^\]]*\]/g) || []).filter(
            (s) => !s.includes("application/ld+json"),
          );

          const h1 = document.querySelector("h1")?.textContent?.trim() || null;

          const giantWhitespace = [...document.querySelectorAll("section, .elementor-section")]
            .filter((el) => {
              const rect = el.getBoundingClientRect();
              const text = (el.textContent || "").trim();
              return rect.height > 400 && text.length < 30;
            }).length;

          const contentMismatch =
            expectations.length > 0 &&
            expectations.some((phrase) => !bodyText.includes(phrase));

          return {
            status: httpStatus,
            overflow,
            brokenImages,
            emptyImageContainers,
            rawShortcodes,
            h1,
            giantWhitespace,
            contentMismatch,
            hasH1: Boolean(h1),
          };
        }, { expectations: PAGE_EXPECTATIONS[pageDef.name] || [], httpStatus });

        pageReport.checks[width] = checks;

        const file = `${pageDef.name}-${width}.png`;
        await page.screenshot({ path: path.join(OUT, file), fullPage: true });
        pageReport.shots.push({ width, file: `migration-audit/visual-qa-phase-3-2/${file}` });

        if (checks.overflow) report.issues.push({ page: pageDef.name, width, type: "horizontal-overflow" });
        if (checks.brokenImages.length)
          report.issues.push({ page: pageDef.name, width, type: "broken-images", detail: checks.brokenImages });
        if (checks.rawShortcodes.length)
          report.issues.push({ page: pageDef.name, width, type: "raw-shortcodes", detail: checks.rawShortcodes });
        if (checks.emptyImageContainers)
          report.issues.push({ page: pageDef.name, width, type: "empty-image-containers", count: checks.emptyImageContainers });
        if (checks.giantWhitespace)
          report.issues.push({ page: pageDef.name, width, type: "giant-whitespace", count: checks.giantWhitespace });
        if (checks.contentMismatch)
          report.issues.push({ page: pageDef.name, width, type: "content-mismatch" });
        if (!checks.hasH1) report.issues.push({ page: pageDef.name, width, type: "missing-h1" });

        if (consoleErrors.length) {
          report.consoleErrors.push({ page: pageDef.name, width, errors: consoleErrors.slice(0, 5) });
        }
        if (networkFailures.length) {
          report.networkFailures.push({ page: pageDef.name, width, failures: networkFailures.slice(0, 8) });
        }
      } catch (err) {
        report.issues.push({ page: pageDef.name, width, type: "page-error", detail: String(err.message || err) });
      } finally {
        await context.close();
      }
    }

    report.pages.push(pageReport);
    report.inspected.push(pageDef.name);
  }

  await browser.close();

  report.summary = {
    pagesInspected: report.inspected.length,
    totalIssues: report.issues.length,
    issueTypes: [...new Set(report.issues.map((i) => i.type))],
  };

  fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2), "utf8");
  console.log(JSON.stringify(report.summary, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

/**
 * Phase 5H.4B production QA — website-building deploy verification.
 * Run: node scripts/qa-phase-5h4b-production.mjs
 */
import fs from "node:fs";
import { chromium } from "playwright";

const base = "https://adwrks.co.il";
const seo = JSON.parse(fs.readFileSync("src/data/content/seo.json", "utf8"));
const wbSeo = seo.find((e) => e.url.includes("website-building"));
const projectsSrc = fs.readFileSync("src/lib/portfolio/projects.ts", "utf8");

const faqSchema = wbSeo?.jsonLd
  ?.flatMap((j) => j["@graph"] || [j])
  .find((g) => g["@type"] === "FAQPage");

const [wbRes, homeRes, sitemapRes, seoRes, googleAdsRes] = await Promise.all([
  fetch(`${base}/website-building/`),
  fetch(`${base}/`),
  fetch(`${base}/sitemap.xml`),
  fetch(`${base}/seo/`),
  fetch(`${base}/google-ads/`),
]);

const wbHtml = await wbRes.text();
const homeHtml = await homeRes.text();
const sitemap = await sitemapRes.text();
const seoHtml = await seoRes.text();
const googleAdsHtml = await googleAdsRes.text();

const browser = await chromium.launch();
const page = await browser.newPage();

const wbChecks = {};
for (const [label, width] of [
  ["desktop", 1440],
  ["mobile", 390],
]) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(`${base}/website-building/`, { waitUntil: "domcontentloaded", timeout: 120_000 });
  await page.waitForSelector(".wb-page", { timeout: 60_000 });
  wbChecks[label] = await page.evaluate(() => ({
    h1: document.querySelector("h1")?.textContent?.trim() ?? null,
    h1Count: document.querySelectorAll("h1").length,
    faqCount: document.querySelectorAll(".wb-faq-item").length,
    portfolioNote: document.querySelector(".portfolio-showcase-rich-note")?.textContent?.trim() ?? null,
    portfolioCards: document.querySelectorAll(
      ".portfolio-showcase-card:not(.portfolio-showcase-card--placeholder)",
    ).length,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    hasProcess: Boolean(document.querySelector(".wb-section-process")),
    hasMidCta: Boolean(document.querySelector(".wb-mid-cta-section")),
  }));
}

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`${base}/`, { waitUntil: "domcontentloaded", timeout: 120_000 });
const homeChecks = await page.evaluate(() => ({
  h1: document.querySelector("h1")?.textContent?.trim() ?? null,
  agencyBadge: document.body.textContent?.includes("סוכנות שיווק דיגיטלי") ?? false,
  compactPortfolio: Boolean(document.querySelector(".portfolio-showcase--compact")),
  portfolioCards: document.querySelectorAll(".portfolio-showcase-card").length,
  wbPage: Boolean(document.querySelector(".wb-page")),
}));

await browser.close();

const report = {
  deployed: wbHtml.includes("wb-page"),
  productionUrl: `${base}/website-building/`,
  websiteBuilding: {
    h1: wbChecks.desktop.h1,
    h1Count: wbChecks.desktop.h1Count,
    portfolioTotal: (projectsSrc.match(/^\s+id:/gm) || []).length,
    faqVisible: wbChecks.desktop.faqCount,
    faqSchemaCount: faqSchema?.mainEntity?.length ?? 0,
    desktop: wbChecks.desktop,
    mobile: wbChecks.mobile,
  },
  globalPositioning: {
    homepageH1: homeChecks.h1,
    homepageAgencyBadge: homeChecks.agencyBadge,
    homepagePortfolioCount: homeChecks.portfolioCards,
    homepageCompactPortfolio: homeChecks.compactPortfolio,
    homepageHasWbPage: homeChecks.wbPage,
    headerHasWbClasses: wbHtml.includes("site-header") && !homeHtml.includes("wb-hero"),
    footerHasWbClasses: !homeHtml.includes("wb-final-cta"),
    otherServicePagesUnchanged: {
      seoUsesVerified: seoHtml.includes("verified-service-page") || seoHtml.includes("structured-page service-page"),
      googleAdsUsesVerified: googleAdsHtml.includes("verified-service-page") || googleAdsHtml.includes("structured-page service-page"),
      wbUsesDedicated: wbHtml.includes("wb-page") && !wbHtml.includes("verified-service-page"),
    },
  },
  seo: {
    title: wbSeo?.title ?? null,
    metaDescription: wbSeo?.metaDescription ?? null,
    canonical: wbHtml.match(/rel="canonical" href="([^"]+)"/)?.[1] ?? null,
    robotsMeta: wbHtml.match(/name="robots" content="([^"]+)"/)?.[1] ?? null,
    noindex: /noindex/i.test(wbHtml.match(/name="robots" content="([^"]+)"/)?.[1] ?? ""),
    sitemapCount: (sitemap.match(/<loc>/g) || []).length,
  },
};

report.pass =
  report.deployed &&
  report.websiteBuilding.h1 === "בניית אתרים לעסקים" &&
  report.websiteBuilding.h1Count === 1 &&
  report.websiteBuilding.faqVisible === 6 &&
  report.websiteBuilding.faqSchemaCount === 6 &&
  report.websiteBuilding.portfolioTotal === 22 &&
  report.globalPositioning.homepageH1 === "סוכנות שיווק דיגיטלי" &&
  report.globalPositioning.homepageCompactPortfolio &&
  !report.globalPositioning.homepageHasWbPage &&
  report.globalPositioning.homepagePortfolioCount === 8 &&
  !report.seo.noindex &&
  report.seo.sitemapCount === 74 &&
  report.seo.canonical === "https://adwrks.co.il/website-building/" &&
  !report.websiteBuilding.desktop.overflow &&
  !report.websiteBuilding.mobile.overflow;

console.log(JSON.stringify(report, null, 2));
process.exit(report.pass ? 0 : 1);

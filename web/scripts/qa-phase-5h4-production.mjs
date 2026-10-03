/**
 * Phase 5H.4 production QA — all service pages + global positioning.
 */
import fs from "node:fs";
import { chromium } from "playwright";

const base = process.argv[2] ?? "https://adwrks.co.il";
const seo = JSON.parse(fs.readFileSync("src/data/content/seo.json", "utf8"));
const projectsSrc = fs.readFileSync("src/lib/portfolio/projects.ts", "utf8");

const routes = [
  { path: "/", key: "home" },
  { path: "/שירותי-שיווק-דיגיטלי/", key: "hub", marker: "sp-page--hub" },
  { path: "/seo/", key: "seo", marker: "sp-page--seo", faq: 6 },
  { path: "/google-ads/", key: "gads", marker: "sp-page--google-ads", faq: 6 },
  { path: "/social-media-management/", key: "social", marker: "sp-page--social", faq: 6 },
  { path: "/hosting-plans/", key: "hosting", marker: "sp-page--hosting", h1: "אחסון ותחזוקת אתרים" },
  { path: "/website-building/", key: "wb", marker: "wb-page", faq: 6 },
];

function getSeo(path) {
  const normalized = path === "/" ? "https://adwrks.co.il/" : `https://adwrks.co.il${path}`;
  return seo.find((e) => e.url === normalized || decodeURIComponent(e.url) === normalized);
}

const browser = await chromium.launch();
const page = await browser.newPage();
const report = { base, pages: {}, global: {}, seo: {}, pass: true };

for (const route of routes) {
  await page.setViewportSize({ width: 1440, height: 900 });
  const res = await page.goto(`${base}${route.path}`, { waitUntil: "domcontentloaded", timeout: 120_000 });
  const html = await page.content();
  const seoRec = getSeo(route.path);
  const faqSchema = seoRec?.jsonLd?.find((j) => j["@type"] === "FAQPage");

  report.pages[route.key] = {
    status: res?.status(),
    h1: await page.locator("h1").first().textContent(),
    h1Count: await page.locator("h1").count(),
    marker: route.marker ? html.includes(route.marker) : null,
    faqVisible: route.faq ? await page.locator(".sp-faq-item, .wb-faq-item").count() : null,
    faqSchema: faqSchema?.mainEntity?.length ?? null,
    overflow: await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1),
  };

  if (route.h1 && report.pages[route.key].h1 !== route.h1) report.pass = false;
  if (route.marker && !html.includes(route.marker)) report.pass = false;
  if (route.faq && report.pages[route.key].faqVisible !== route.faq) report.pass = false;
  if (route.faq && report.pages[route.key].faqSchema !== route.faq) report.pass = false;
  if (report.pages[route.key].overflow) report.pass = false;
}

await page.setViewportSize({ width: 390, height: 900 });
for (const route of routes.filter((r) => r.key !== "home" && r.key !== "hub")) {
  await page.goto(`${base}${route.path}`, { waitUntil: "domcontentloaded", timeout: 120_000 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  report.pages[route.key].mobileOverflow = overflow;
  if (overflow) report.pass = false;
}

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
report.global.homeH1 = await page.locator("h1").first().textContent();
report.global.homePortfolio = await page.locator(".portfolio-showcase--compact .portfolio-showcase-card").count();
report.global.homeAgency = (await page.content()).includes("סוכנות שיווק דיגיטלי");

await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
const navHtml = await page.content();
report.global.navLabel = navHtml.includes(">בניית אתרים<") || navHtml.includes("בניית אתרים</");
report.global.navOldLabel = navHtml.includes("בניית אתרים (וורדפרס)") || navHtml.includes("בניית אתרים [וורדפרס]");

const sitemap = await fetch(`${base}/sitemap.xml`).then((r) => r.text());
report.seo.sitemapCount = (sitemap.match(/<loc>/g) || []).length;
report.seo.portfolioTotal = (projectsSrc.match(/^\s+id:/gm) || []).length;
report.seo.homeFeatured = (projectsSrc.match(/featured: true/g) || []).length;

const gadsSeo = getSeo("/google-ads/");
const gadsFaq = gadsSeo?.jsonLd?.find((j) => j["@type"] === "FAQPage");
report.seo.gadsFaqHasHomepageQuestion = gadsFaq?.mainEntity?.some((q) =>
  q.name.includes("אילו שירותי שיווק דיגיטלי"),
);

if (report.global.homeH1 !== "סוכנות שיווק דיגיטלי") report.pass = false;
if (report.global.homePortfolio !== 8) report.pass = false;
if (report.global.navOldLabel) report.pass = false;
if (report.seo.sitemapCount !== 74) report.pass = false;
if (report.seo.gadsFaqHasHomepageQuestion) report.pass = false;

await browser.close();
console.log(JSON.stringify(report, null, 2));
process.exit(report.pass ? 0 : 1);

/**
 * Phase 5H.2 production QA — homepage portfolio.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "..", "migration-audit", "phase-5h2-production-qa");
const base = "https://adwrks.co.il";

fs.mkdirSync(outDir, { recursive: true });

const homeRes = await fetch(`${base}/`);
const homeHtml = await homeRes.text();

const sitemapRes = await fetch(`${base}/sitemap.xml`);
const sitemapText = await sitemapRes.text();
const sitemapCount = (sitemapText.match(/<loc>/g) ?? []).length;

const robotsRes = await fetch(`${base}/robots.txt`);
const robotsText = await robotsRes.text();

const report = {
  portfolioShowcaseLive: homeHtml.includes("portfolio-showcase"),
  h1Present: homeHtml.includes("סוכנות שיווק דיגיטלי"),
  noindex: /noindex/i.test(homeHtml),
  canonical: (homeHtml.match(/rel="canonical" href="([^"]+)"/) ?? [])[1] ?? null,
  featuredCardCount: (homeHtml.match(/portfolio-showcase-card/g) ?? []).length,
  insytixImage: homeHtml.includes("/images/portfolio/insytix.webp"),
  ramatganImage: homeHtml.includes("/images/portfolio/ramatgancranes.webp"),
  portfolioPriority: /portfolio-showcase[\s\S]{0,500}priority/i.test(homeHtml),
  portfolioLazy: homeHtml.includes('loading="lazy"'),
  betkalLabel: homeHtml.includes("בטקל פרו"),
  sitemapUrls: sitemapCount,
  robotsAllowRoot: robotsText.includes("Allow: /"),
};

const imageChecks = [
  "/images/portfolio/insytix.webp",
  "/images/portfolio/ramatgancranes.webp",
  "/images/portfolio/menofeyhasdai.webp",
  "/images/portfolio/michel-drive.webp",
  "/images/portfolio/project-eng.webp",
  "/images/portfolio/amiya-movings.webp",
  "/images/portfolio/em-biuvit.webp",
  "/wp-content/uploads/bali_burger.png",
];
report.imagesOk = {};
for (const p of imageChecks) {
  const r = await fetch(`${base}${p}`, { method: "HEAD" });
  report.imagesOk[p] = r.status;
}

const browser = await chromium.launch();
const page = await browser.newPage();
const viewports = [
  { name: "390px", width: 390, height: 844 },
  { name: "768px", width: 768, height: 1024 },
  { name: "1440px", width: 1440, height: 900 },
];
report.visual = {};

for (const vp of viewports) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto(`${base}/#portfolio`, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForTimeout(1500);
  await page.waitForSelector("#portfolio .portfolio-showcase", { timeout: 30_000 });
  const overflow = await page.evaluate(() => ({
    docWidth: document.documentElement.scrollWidth,
    viewWidth: window.innerWidth,
    overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
  }));
  const shotPath = path.join(outDir, `prod-portfolio-${vp.name}.png`);
  await page.locator("#portfolio").screenshot({ path: shotPath });
  report.visual[vp.name] = { ...overflow, screenshot: shotPath.replace(/\\/g, "/") };
}

await browser.close();

report.pass =
  report.portfolioShowcaseLive &&
  report.h1Present &&
  !report.noindex &&
  report.featuredCardCount === 8 &&
  report.sitemapUrls === 74 &&
  report.robotsAllowRoot &&
  Object.values(report.imagesOk).every((s) => s === 200);

fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
process.exit(report.pass ? 0 : 1);

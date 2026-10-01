/**
 * Phase 5H.3B final polish screenshots + hero height metrics.
 * Run: node scripts/capture-phase-5h3b-final-qa.mjs [baseUrl]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, "..");
const outDir = path.join(webRoot, "..", "migration-audit", "phase-5h3b-qa");

const baseUrl = process.argv[2] ?? "http://127.0.0.1:4321";
const captures = [
  { label: "390", width: 390, height: 844 },
  { label: "1440", width: 1440, height: 900 },
];

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
const metrics = {};

for (const vp of captures) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded", timeout: 120_000 });
  await page.waitForSelector(".home-hero-v2", { timeout: 30_000 });
  await page.waitForTimeout(800);

  const heroBox = await page.locator(".home-hero-v2").boundingBox();
  const previewBox = await page.locator(".hero-work-preview--mobile-only, .home-hero-v2-previews").first().boundingBox();
  metrics[vp.label] = {
    heroHeightPx: heroBox ? Math.round(heroBox.height) : null,
    previewHeightPx: previewBox ? Math.round(previewBox.height) : null,
  };

  await page.screenshot({
    path: path.join(outDir, `homepage-full-${vp.label}-final.png`),
    fullPage: true,
  });
  await page.locator(".home-hero-v2").screenshot({
    path: path.join(outDir, `homepage-hero-${vp.label}-final.png`),
  });
  console.log(`saved ${vp.label} final screenshots`);
}

const recommendations = await page.locator("#recommendations").count();
metrics.recommendationsAnchor = recommendations === 1;

const h1Count = await page.locator("h1").count();
const h1Text = await page.locator("h1").first().innerText();
metrics.h1 = { count: h1Count, text: h1Text.trim() };

const sitemapRes = await fetch(`${baseUrl}/sitemap.xml`);
const sitemapText = await sitemapRes.text();
metrics.sitemapUrls = (sitemapText.match(/<loc>/g) ?? []).length;

const robotsRes = await fetch(`${baseUrl}/robots.txt`);
metrics.robots = (await robotsRes.text()).slice(0, 200);

const reportPath = path.join(outDir, "final-polish-metrics.json");
fs.writeFileSync(reportPath, JSON.stringify(metrics, null, 2));
console.log(JSON.stringify(metrics, null, 2));

await browser.close();

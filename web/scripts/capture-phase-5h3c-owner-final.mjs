/**
 * Phase 5H.3C owner-final screenshots + hero metrics.
 * Run: node scripts/capture-phase-5h3c-owner-final.mjs [baseUrl]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, "..");
const outDir = path.join(webRoot, "..", "migration-audit", "phase-5h3c-qa");

const baseUrl = process.argv[2] ?? "http://127.0.0.1:4321";
const viewports = [
  { label: "390", width: 390, height: 844 },
  { label: "1440", width: 1440, height: 900 },
];

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
const metrics = {};

for (const vp of viewports) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded", timeout: 120_000 });
  await page.waitForSelector(".home-hero-v2", { timeout: 30_000 });
  await page.waitForTimeout(800);

  const heroBox = await page.locator(".home-hero-v2").boundingBox();
  const heroImages = await page.locator(".home-hero-v2 img").count();
  metrics[vp.label] = {
    heroHeightPx: heroBox ? Math.round(heroBox.height) : null,
    heroImages,
  };

  await page.screenshot({
    path: path.join(outDir, `homepage-full-${vp.label}-owner-final.png`),
    fullPage: true,
  });
  await page.locator(".home-hero-v2").screenshot({
    path: path.join(outDir, `homepage-hero-${vp.label}-owner-final.png`),
  });
  console.log(`saved ${vp.label} owner-final screenshots`);
}

const marqueeAnim = await page.evaluate(() => {
  const track = document.querySelector(".platform-marquee-track");
  if (!track) return null;
  const style = getComputedStyle(track);
  return {
    animationName: style.animationName,
    animationDuration: style.animationDuration,
  };
});

metrics.marquee = marqueeAnim;
metrics.recommendations = (await page.locator("#recommendations").count()) === 1;
metrics.h1Count = await page.locator("h1").count();
metrics.h1Text = (await page.locator("h1").first().innerText()).trim();

const sitemapRes = await fetch(`${baseUrl}/sitemap.xml`);
const sitemapText = await sitemapRes.text();
metrics.sitemapUrls = (sitemapText.match(/<loc>/g) ?? []).length;

const reportPath = path.join(outDir, "owner-final-metrics.json");
fs.writeFileSync(reportPath, JSON.stringify(metrics, null, 2));
console.log(JSON.stringify(metrics, null, 2));

await browser.close();

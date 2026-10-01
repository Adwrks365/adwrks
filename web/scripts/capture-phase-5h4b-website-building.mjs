/**
 * Phase 5H.4B website-building visual QA screenshots.
 * Run: node scripts/capture-phase-5h4b-website-building.mjs [baseUrl]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "..", "migration-audit", "phase-5h4b-qa");
const baseUrl = process.argv[2] ?? "http://127.0.0.1:4321";

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

for (const vp of [
  { label: "390", width: 390, height: 2000 },
  { label: "430", width: 430, height: 2000 },
  { label: "768", width: 768, height: 2400 },
  { label: "1440", width: 1440, height: 2800 },
]) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto(`${baseUrl}/website-building/`, { waitUntil: "domcontentloaded", timeout: 120_000 });
  await page.waitForSelector(".wb-page", { timeout: 30_000 });
  await page.waitForTimeout(500);

  await page.screenshot({
    path: path.join(outDir, `website-building-full-${vp.label}.png`),
    fullPage: true,
  });

  if (vp.label === "390" || vp.label === "1440") {
    const hero = page.locator(".wb-hero");
    await hero.scrollIntoViewIfNeeded();
    await hero.screenshot({
      path: path.join(outDir, `website-building-hero-${vp.label}.png`),
      timeout: 60_000,
    });
    const portfolio = page.locator("#portfolio");
    await portfolio.scrollIntoViewIfNeeded();
    await portfolio.screenshot({
      path: path.join(outDir, `website-building-portfolio-${vp.label}.png`),
      timeout: 60_000,
    });
  }
}

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`${baseUrl}/website-building/`, { waitUntil: "domcontentloaded", timeout: 120_000 });
await page.waitForSelector(".wb-page", { timeout: 30_000 });

for (const [selector, filename] of [
  [".wb-section-process", "website-building-process-1440.png"],
  [".wb-mid-cta-section", "website-building-mid-cta-1440.png"],
  [".wb-final-cta-section", "website-building-final-cta-1440.png"],
]) {
  const target = page.locator(selector);
  await target.scrollIntoViewIfNeeded();
  await target.screenshot({ path: path.join(outDir, filename), timeout: 60_000 });
}

const metrics = await page.evaluate(() => ({
  h1: document.querySelector("h1")?.textContent?.trim() ?? null,
  h1Count: document.querySelectorAll("h1").length,
  faqCount: document.querySelectorAll(".wb-faq-item").length,
  guideLinks: [...document.querySelectorAll(".wb-guide-card")].map((a) => a.getAttribute("href")),
  relatedServices: [...document.querySelectorAll(".wb-related-service-link")].map((a) => a.getAttribute("href")),
  portfolioCards: document.querySelectorAll(".portfolio-showcase-card:not(.portfolio-showcase-card--placeholder)").length,
  portfolioPlaceholders: document.querySelectorAll(".portfolio-showcase-card--placeholder").length,
  overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  images: document.querySelectorAll("img").length,
  lazyImages: document.querySelectorAll('img[loading="lazy"]').length,
  priorityImages: document.querySelectorAll('img[fetchpriority="high"]').length,
}));

fs.writeFileSync(path.join(outDir, "metrics.json"), JSON.stringify(metrics, null, 2));
console.log(JSON.stringify(metrics, null, 2));

await browser.close();

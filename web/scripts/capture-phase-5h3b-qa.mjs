/**
 * Phase 5H.3B homepage visual QA screenshots.
 * Run: node scripts/capture-phase-5h3b-qa.mjs [baseUrl]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, "..");
const outDir = path.join(webRoot, "..", "migration-audit", "phase-5h3b-qa");

const baseUrl = process.argv[2] ?? "http://127.0.0.1:4321";
const viewports = [
  { name: "390", width: 390, height: 844 },
  { name: "430", width: 430, height: 932 },
  { name: "768", width: 768, height: 1024 },
  { name: "1440", width: 1440, height: 900 },
];

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

for (const vp of viewports) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded", timeout: 120_000 });
  await page.waitForSelector(".home-hero-v2", { timeout: 30_000 });
  await page.waitForTimeout(800);

  const fullPath = path.join(outDir, `homepage-full-${vp.name}.png`);
  await page.screenshot({ path: fullPath, fullPage: true });
  console.log(`saved ${fullPath}`);

  if (vp.name === "390" || vp.name === "1440") {
    const hero = page.locator(".home-hero-v2");
    const heroPath = path.join(outDir, `homepage-hero-${vp.name}.png`);
    await hero.screenshot({ path: heroPath });
    console.log(`saved ${heroPath}`);
  }
}

await browser.close();

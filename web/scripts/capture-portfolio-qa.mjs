/**
 * Capture homepage portfolio section at review viewports.
 * Run: node scripts/capture-portfolio-qa.mjs [baseUrl]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, "..");
const outDir = path.join(webRoot, "..", "migration-audit", "phase-5h2-portfolio-qa");

const baseUrl = process.argv[2] ?? "http://127.0.0.1:4321";
const viewports = [
  { name: "390px", width: 390, height: 844 },
  { name: "430px", width: 430, height: 932 },
  { name: "768px", width: 768, height: 1024 },
  { name: "1440px", width: 1440, height: 900 },
];

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

for (const vp of viewports) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto(`${baseUrl}/#portfolio`, { waitUntil: "networkidle", timeout: 120_000 });
  await page.waitForSelector("#portfolio .portfolio-showcase", { timeout: 30_000 });
  const section = page.locator("#portfolio");
  const file = path.join(outDir, `portfolio-${vp.name}.png`);
  await section.screenshot({ path: file });
  console.log(`saved ${file}`);
}

await browser.close();

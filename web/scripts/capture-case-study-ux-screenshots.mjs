/**
 * Capture case-study section screenshots (requires: npx playwright install chromium once).
 * Usage: node web/scripts/capture-case-study-ux-screenshots.mjs [baseUrl]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "..", "migration-audit", "case-study-ux-2026-10-31");
const base = process.argv[2] ?? "https://adwrks.co.il";

const shots = [
  { name: "seo-desktop-1440", path: "/seo/", width: 1440, height: 900 },
  { name: "seo-mobile-390", path: "/seo/", width: 390, height: 844 },
  { name: "google-ads-desktop", path: "/google-ads/", width: 1440, height: 900 },
  { name: "social-mobile-390", path: "/social-media-management/", width: 390, height: 844 },
];

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("Playwright not installed. Run: cd web && npm install -D playwright && npx playwright install chromium");
  process.exit(2);
}

fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
for (const s of shots) {
  const page = await browser.newPage({ viewport: { width: s.width, height: s.height } });
  await page.goto(`${base}${s.path}`, { waitUntil: "networkidle", timeout: 120_000 });
  const section = page.locator(".sp-section-case-studies");
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const file = path.join(outDir, `${s.name}.png`);
  await section.screenshot({ path: file });
  console.log("wrote", file);
  await page.close();
}
await browser.close();
console.log(JSON.stringify({ ok: true, outDir, base }, null, 2));

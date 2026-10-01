/**
 * Phase 5H.4 service pages screenshot QA.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "..", "migration-audit", "phase-5h4-service-pages-final");
const baseUrl = process.argv[2] ?? "http://127.0.0.1:4323";

fs.mkdirSync(outDir, { recursive: true });

const routes = [
  { slug: "service-hub", path: "/שירותי-שיווק-דיגיטלי/" },
  { slug: "seo", path: "/seo/" },
  { slug: "google-ads", path: "/google-ads/" },
  { slug: "social-media", path: "/social-media-management/" },
  { slug: "hosting-plans", path: "/hosting-plans/" },
];

const browser = await chromium.launch();
const page = await browser.newPage();

for (const vp of [390, 1440]) {
  await page.setViewportSize({ width: vp, height: 2400 });
  for (const route of routes) {
    await page.goto(`${baseUrl}${route.path}`, { waitUntil: "domcontentloaded", timeout: 120_000 });
    await page.waitForSelector(".sp-page", { timeout: 30_000 });
    await page.screenshot({
      path: path.join(outDir, `${route.slug}-full-${vp}.png`),
      fullPage: true,
    });
  }
}

await browser.close();
console.log("screenshots saved to", outDir);

/**
 * Phase 5H.4D hero visual polish screenshot QA.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "..", "migration-audit", "phase-5h4d-qa");
const baseUrl = process.argv[2] ?? "http://127.0.0.1:4323";

fs.mkdirSync(outDir, { recursive: true });

const routes = [
  { slug: "google-ads", path: "/google-ads/" },
  { slug: "hosting-plans", path: "/hosting-plans/" },
  { slug: "seo", path: "/seo/" },
  { slug: "social-media", path: "/social-media-management/" },
  { slug: "service-hub", path: "/שירותי-שיווק-דיגיטלי/" },
];

const browser = await chromium.launch();
const page = await browser.newPage();

for (const vp of [390, 1440]) {
  await page.setViewportSize({ width: vp, height: vp === 390 ? 900 : 720 });
  for (const route of routes) {
    await page.goto(`${baseUrl}${route.path}`, { waitUntil: "domcontentloaded", timeout: 120_000 });
    await page.waitForSelector(".sp-hero", { timeout: 30_000 });
    await page.locator(".sp-hero").screenshot({
      path: path.join(outDir, `${route.slug}-hero-${vp}.png`),
    });
  }
}

await browser.close();
console.log("hero screenshots saved to", outDir);

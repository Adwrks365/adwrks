/**
 * Desktop + mobile screenshots for location UX QA.
 * npx tsx scripts/capture-location-content-ux.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { chromium, devices } from "playwright";

const BASE = process.env.QA_BASE || "http://127.0.0.1:3000";
const OUT = path.resolve("..", "migration-audit", "location-content-ux-screenshots");

const SAMPLES = [
  "/סוכנות-שיווק-דיגיטלי-ברמת-גן/",
  "/סוכנות-שיווק-דיגיטלי-בתל-אביב/",
  "/סוכנות-שיווק-דיגיטלי-בדרום/",
  "/en/digital-marketing-ramat-gan/",
  "/אזורי-פעילות/",
];

async function shot(page, url, name) {
  await page.goto(`${BASE}${encodeURI(url)}`, { waitUntil: "networkidle", timeout: 120000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log("wrote", file);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const desktop = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await desktop.addInitScript(() => sessionStorage.setItem("adwrks_popup_session_suppressed", "1"));
  const mobileCtx = await browser.newContext(devices["Pixel 5"]);
  const mobile = await mobileCtx.newPage();
  await mobile.addInitScript(() => sessionStorage.setItem("adwrks_popup_session_suppressed", "1"));

  for (const url of SAMPLES) {
    const slug = url.replace(/^\//, "").replace(/\//g, "_").slice(0, 40);
    await shot(desktop, url, `${slug}-desktop`);
    await shot(mobile, url, `${slug}-mobile`);
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
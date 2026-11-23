/**
 * Mobile result-card screenshots for PR #21.
 * Usage:
 *   SITE_CHECK_BASE=https://adwrks-git-feat-site-check-tool-page-adwrks.vercel.app node scripts/capture-site-check-mobile-ui.mjs
 *   SITE_CHECK_BASE=http://localhost:3000 node scripts/capture-site-check-mobile-ui.mjs
 */
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = (process.env.SITE_CHECK_BASE ?? "http://localhost:3000").replace(/\/$/, "");
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "migration-audit/site-check-preview");
mkdirSync(OUT, { recursive: true });

const { chromium, devices } = await import("playwright");
const iphone = devices["iPhone 13"];

async function captureScan(page, url, fileName) {
  await page.goto(`${BASE}/%D7%91%D7%93%D7%99%D7%A7%D7%AA-%D7%90%D7%AA%D7%A8/`, { waitUntil: "networkidle", timeout: 120_000 });
  await page.getByLabel("כתובת האתר").fill(url);
  await page.getByRole("button", { name: "בדקו את האתר שלי" }).click();
  await page.locator(".site-check-topic-grid").first().waitFor({ timeout: 120_000 });
  const topics = page.locator(".site-check-topic-grid").first();
  await topics.scrollIntoViewIfNeeded();
  await page.screenshot({ path: join(OUT, fileName), fullPage: false });
}

const browser = await chromium.launch();
const context = await browser.newContext({ ...iphone });
const page = await context.newPage();
await captureScan(page, "adwrks.co.il", "pr21-ui-adwrks-mobile.png");
await captureScan(page, `${BASE}/site-check-sample/`, "pr21-ui-fixture-mobile.png");
await browser.close();
console.log(JSON.stringify({ base: BASE, out: OUT }, null, 2));
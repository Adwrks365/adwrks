import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "migration-audit/site-check-preview");
const BASE = process.env.SITE_CHECK_BASE ?? "http://localhost:3000";
const PAGE = process.env.SITE_CHECK_PAGE ?? "/%D7%91%D7%93%D7%99%D7%A7%D7%AA-%D7%90%D7%AA%D7%A8/";
const GOOD = process.env.SITE_CHECK_GOOD ?? "adwrks.co.il";
const FINDING = process.env.SITE_CHECK_FINDING ?? `${BASE.replace(/\/$/, "")}/site-check-sample/`;

mkdirSync(OUT, { recursive: true });

const { chromium } = await import("playwright");
const browser = await chromium.launch();

async function runScan(page, url) {
  await page.goto(`${BASE}${PAGE}`, { waitUntil: "networkidle" });
  await page.getByLabel("כתובת האתר").fill(url);
  await page.getByRole("button", { name: "בדקו את האתר שלי" }).click();
  await page
    .locator(".site-check-report-body, .site-check-alert")
    .first()
    .waitFor({ timeout: 120_000 });
  await page.locator("#site-check-results").scrollIntoViewIfNeeded();
}

for (const [name, url, viewport] of [
  ["pr21-good-desktop", GOOD, { width: 1280, height: 900 }],
  ["pr21-finding-desktop", FINDING, { width: 1280, height: 900 }],
  ["pr21-good-mobile", GOOD, { width: 390, height: 844 }],
  ["pr21-finding-mobile", FINDING, { width: 390, height: 844 }],
]) {
  const page = await browser.newPage({ viewport });
  await runScan(page, url);
  const path = join(OUT, `${name}.png`);
  await page.screenshot({ path, fullPage: false });
  console.log("saved", path);
}

await browser.close();
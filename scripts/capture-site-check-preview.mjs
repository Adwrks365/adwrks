import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "migration-audit/site-check-preview");
const BASE = process.env.SITE_CHECK_BASE ?? "http://localhost:3000";
const PATH = "/%D7%91%D7%93%D7%99%D7%A7%D7%AA-%D7%90%D7%AA%D7%A8/";
const SCAN_URL = process.env.SITE_CHECK_SAMPLE ?? "https://example.com";

mkdirSync(OUT, { recursive: true });

const { chromium } = await import("playwright");
const browser = await chromium.launch();

async function shot(page, name) {
  await page.screenshot({ path: join(OUT, name), fullPage: false });
  console.log("saved", name);
}

const desktop = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await desktop.goto(`${BASE}${PATH}`, { waitUntil: "networkidle" });
await shot(desktop, "site-check-v3-desktop-before.png");

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(`${BASE}${PATH}`, { waitUntil: "networkidle" });
await shot(mobile, "site-check-v3-mobile-before.png");

const fillAndRun = async (page) => {
  await page.getByLabel("כתובת האתר").fill(SCAN_URL);
  await page.getByRole("button", { name: "בדקו את האתר שלי" }).click();
  await page.getByText("תוצאות הבדיקה", { timeout: 120_000 }).waitFor();
  await page.locator("#site-check-results").scrollIntoViewIfNeeded();
};

await fillAndRun(desktop);
await shot(desktop, "site-check-v3-desktop-after.png");

await fillAndRun(mobile);
await shot(mobile, "site-check-v3-mobile-after.png");

await browser.close();
console.log("done", OUT);
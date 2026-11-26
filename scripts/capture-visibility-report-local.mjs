/** Local UI capture when SEARCH_VISIBILITY_PROVIDER=mock (not live). */
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "migration-audit/site-check-preview");
mkdirSync(OUT, { recursive: true });
const BASE = process.env.SITE_CHECK_BASE ?? "http://localhost:3000";

const { chromium, devices } = await import("playwright");
const browser = await chromium.launch();
const context = await browser.newContext({ ...devices["iPhone 13"] });
const page = await context.newPage();

await page.goto(`${BASE}/%D7%91%D7%93%D7%99%D7%A7%D7%AA-%D7%90%D7%AA%D7%A8/`, { waitUntil: "networkidle" });
await page.getByLabel("כתובת האתר").fill("adwrks.co.il");
await page.getByRole("button", { name: "בדקו את האתר שלי" }).click();
await page.locator(".site-check-report-body, .site-check-visibility-card, .site-check-alert").first().waitFor({
  timeout: 120_000,
});

const vis = page.locator(".site-check-visibility-card");
if (await vis.isVisible().catch(() => false)) {
  await vis.scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "בדקו את הנראות בגוגל" }).click();
  await page.locator(".site-check-visibility-results").waitFor({ timeout: 60_000 });
  await page.screenshot({
    path: join(OUT, "pr21-visibility-report-local-mock-mobile.png"),
    fullPage: false,
  });
} else {
  await page.screenshot({
    path: join(OUT, "pr21-visibility-off-local-mobile.png"),
    fullPage: false,
  });
}

await browser.close();
/**
 * Mobile UI check: PageSpeed with score vs without score (mocked API).
 * Usage: SITE_CHECK_BASE=http://localhost:3008 node scripts/qa-site-check-speed-ui-mobile.mjs
 */
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "migration-audit/site-check-preview");
mkdirSync(OUT, { recursive: true });
const BASE = process.env.SITE_CHECK_BASE ?? "http://localhost:3008";

const { chromium, devices } = await import("playwright");
const browser = await chromium.launch();

async function runOnce(pagespeedMock, outFile) {
  const context = await browser.newContext({ ...devices["iPhone 13"] });
  const page = await context.newPage();

  await page.route("**/api/pagespeed/**", async (route) => {
    if (route.request().method() !== "POST") {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(pagespeedMock),
    });
  });

  await page.goto(`${BASE}/%D7%91%D7%93%D7%99%D7%A7%D7%AA-%D7%90%D7%AA%D7%A8/`, { waitUntil: "networkidle" });
  await page.getByLabel("כתובת האתר").fill("adwrks.co.il");
  await page.getByRole("button", { name: "בדקו את האתר שלי" }).click();
  await page.locator(".site-check-now-answer, .site-check-outcome-clear").first().waitFor({ timeout: 120_000 });

  const speedBtn = page.locator(".site-check-speed-btn").first();
  await speedBtn.scrollIntoViewIfNeeded();
  await speedBtn.click();
  await page
    .locator(".site-check-speed-result, .site-check-speed-fallback, .site-check-alert")
    .first()
    .waitFor({ timeout: 30_000 });

  await page.screenshot({ path: join(OUT, outFile), fullPage: false });
  const hasRetry = await page.getByRole("button", { name: "נסו שוב" }).isVisible().catch(() => false);
  const hasTip = await page.locator(".site-check-speed-tip").isVisible().catch(() => false);
  await context.close();
  return { hasRetry, hasTip };
}

const withScore = await runOnce(
  {
    ok: true,
    url: "https://adwrks.co.il/",
    finalUrl: "https://adwrks.co.il/",
    scores: { performance: 72 },
  },
  "pr21-speed-with-score-mobile.png",
);

const withoutScore = await runOnce(
  {
    ok: true,
    url: "https://adwrks.co.il/",
    finalUrl: "https://adwrks.co.il/",
    scores: { performance: null },
    performanceScoreMissing: true,
  },
  "pr21-speed-no-score-mobile.png",
);

await browser.close();
console.log(JSON.stringify({ withScore, withoutScore }, null, 2));
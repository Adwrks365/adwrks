/**
 * Mobile screenshot — ShopGarden store report (PR #21 closure).
 * Usage:
 *   SITE_CHECK_BASE=http://localhost:3000 node scripts/capture-shopgarden-pr21-closure.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = (process.env.SITE_CHECK_BASE ?? "http://localhost:3000").replace(/\/$/, "");
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "migration-audit/site-check-preview");
mkdirSync(OUT, { recursive: true });

const { chromium, devices } = await import("playwright");
const iphone = devices["iPhone 13"];

const browser = await chromium.launch();
const context = await browser.newContext({ ...iphone, locale: "he-IL" });
const page = await context.newPage();

const report = { base: BASE, steps: [] };

await page.goto(`${BASE}/%D7%91%D7%93%D7%99%D7%A7%D7%AA-%D7%90%D7%AA%D7%A8/`, {
  waitUntil: "networkidle",
  timeout: 120_000,
});
await page.getByLabel("כתובת האתר").fill("https://www.shopgarden.co.il/");
await page.getByRole("button", { name: "בדקו את האתר שלי" }).click();
await page.locator(".site-check-now-answer").first().waitFor({ timeout: 180_000 });

const pageTypes = await page.locator(".site-check-page-types").first().textContent();
const headline = await page.locator(".site-check-finding-headline").first().textContent();
const insightDetail = await page.locator(".site-check-insight-detail").first().textContent();
report.steps.push({ pageTypes, headline, insightDetail: insightDetail?.slice(0, 400) });

await page.locator(".site-check-offer--in-report").first().scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await page.locator(".site-check-report-body").screenshot({
  path: join(OUT, "pr21-closure-shopgarden-mobile-now.png"),
});

const details = page.locator(".site-check-tech-details");
await details.scrollIntoViewIfNeeded();
await details.click();
await page.waitForTimeout(500);
const storeInsight = page.locator(".site-check-business-insights li").first();
await storeInsight.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await storeInsight.screenshot({ path: join(OUT, "pr21-closure-shopgarden-store-insight-mobile.png") });
await page.screenshot({ path: join(OUT, "pr21-closure-shopgarden-mobile-details.png"), fullPage: true });

writeFileSync(join(OUT, "pr21-closure-shopgarden-meta.json"), JSON.stringify(report, null, 2), "utf8");
console.log(JSON.stringify(report, null, 2));
await browser.close();
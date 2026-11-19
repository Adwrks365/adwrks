/**
 * Visual + interaction QA for Batch3 FAQ (Playwright).
 * npx next start -p 3003 && npx tsx scripts/qa-batch3-faq-visual.mjs
 */
import { chromium, devices } from "playwright";
import { mkdirSync } from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3003";
const OUT = path.resolve("..", "migration-audit", "qa-pr7-faq");

const BATCH3 = [
  "/%d7%a4%d7%a8%d7%a1%d7%95%d7%9d-%d7%91%d7%92%d7%95%d7%92%d7%9c-%d7%90%d7%93%d7%a1-10-%d7%a9%d7%9c%d7%91%d7%99%d7%9d-%d7%a4%d7%a9%d7%95%d7%98%d7%99%d7%9d/",
  "/%d7%9b%d7%9e%d7%94-%d7%a2%d7%95%d7%9c%d7%94-%d7%a4%d7%a8%d7%a1%d7%95%d7%9d-%d7%91%d7%92%d7%95%d7%92%d7%9c/",
  "/%d7%9b%d7%9e%d7%94-%d7%a2%d7%95%d7%9c%d7%94-%d7%9c%d7%91%d7%a0%d7%95%d7%aa-%d7%90%d7%aa%d7%a8-%d7%90%d7%99%d7%a0%d7%98%d7%a8%d7%a0%d7%98-%d7%91%d7%95%d7%95%d7%a8%d7%93%d7%a4%d7%a8%d7%a1/",
  "/%d7%a4%d7%a8%d7%a1%d7%95%d7%9d-%d7%91%d7%92%d7%95%d7%92%d7%9c-%d7%9e%d7%a4%d7%95%d7%aa/",
  "/%d7%9e%d7%94-%d7%94%d7%94%d7%91%d7%93%d7%9c-%d7%91%d7%99%d7%9f-sem-%d7%9c-ppc/",
];

const HERO = BATCH3[0];
let failed = 0;

mkdirSync(OUT, { recursive: true });

async function dismissContextualPopup(page) {
  const backdrop = page.locator(".contextual-popup-backdrop");
  if (await backdrop.count()) {
    await backdrop.first().click({ timeout: 3000 }).catch(() => {});
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(300);
  }
}

async function scrollToFaq(page) {
  await dismissContextualPopup(page);
  await page.locator(".adwrks-faq-accordion").first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
}

async function runChecks(page, label) {
  const items = page.locator("details.adwrks-faq-item");
  const count = await items.count();
  if (count < 2) {
    console.error("FAIL faq items", label, count);
    failed++;
    return;
  }
  const firstOpen = await items.nth(0).evaluate((el) => el.open);
  if (firstOpen) {
    console.error("FAIL default open", label);
    failed++;
  }
  await items.nth(0).locator("summary").evaluate((el) => el.click());
  if (!(await items.nth(0).evaluate((el) => el.open))) {
    console.error("FAIL click open", label);
    failed++;
  }
  await items.nth(1).locator("summary").evaluate((el) => el.click());
  if (await items.nth(0).evaluate((el) => el.open)) {
    console.error("FAIL exclusive close", label);
    failed++;
  }
  await items.nth(0).locator("summary").focus();
  await page.keyboard.press(" ");
  if (!(await items.nth(0).evaluate((el) => el.open))) {
    console.error("FAIL keyboard toggle", label);
    failed++;
  }
  console.log("OK interaction", label);
}

async function main() {
  const desktop = await chromium.launch();
  const dPage = await desktop.newPage({ viewport: { width: 1280, height: 900 } });
  await dPage.goto(`${BASE}${HERO}`, { waitUntil: "networkidle" });
  await dismissContextualPopup(dPage);
  await scrollToFaq(dPage);
  await dPage.screenshot({ path: path.join(OUT, "batch3-google-ads-10-steps-faq-closed-desktop.png") });
  await dPage.locator("details.adwrks-faq-item summary").first().click({ force: true });
  await dPage.waitForTimeout(200);
  await dPage.screenshot({ path: path.join(OUT, "batch3-google-ads-10-steps-faq-open-desktop.png") });
  await runChecks(dPage, "desktop");

  const iPhone = devices["iPhone 13"];
  const mPage = await desktop.newPage({ ...iPhone });
  await mPage.goto(`${BASE}${HERO}`, { waitUntil: "networkidle" });
  await dismissContextualPopup(mPage);
  await scrollToFaq(mPage);
  await mPage.screenshot({ path: path.join(OUT, "batch3-google-ads-10-steps-faq-closed-mobile.png") });
  await mPage.locator("details.adwrks-faq-item summary").first().click({ force: true });
  await mPage.waitForTimeout(200);
  await mPage.screenshot({ path: path.join(OUT, "batch3-google-ads-10-steps-faq-open-mobile.png") });
  await runChecks(mPage, "mobile");

  for (const p of BATCH3.slice(1)) {
    await dPage.goto(`${BASE}${p}`, { waitUntil: "domcontentloaded" });
    const lead = await dPage.locator(".adwrks-article-lead").count();
    const faq = await dPage.locator(".adwrks-faq-accordion").count();
    if (lead !== 1 || faq !== 1) {
      console.error("FAIL render", p, { lead, faq });
      failed++;
    } else {
      console.log("OK page", p.slice(0, 36));
    }
  }

  await desktop.close();
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
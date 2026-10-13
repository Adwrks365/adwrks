import { chromium } from "playwright";

const base = process.env.BASE_URL || "http://localhost:3005";
const url = `${base}/%D7%9E%D7%97%D7%A9%D7%91%D7%95%D7%9F-roi-%D7%9E%D7%A2%D7%95%D7%93%D7%9B%D7%9F-2026/`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(url, { waitUntil: "networkidle" });

const roiBox = page.locator(".roi-calculator-root");
const pricingBox = page.locator(".pricing-calculator-root");

const roiIndex = await roiBox.evaluate((el) => {
  const all = [...document.querySelectorAll(".roi-calculator-root, .pricing-calculator-root")];
  return all.indexOf(el);
});
const pricingIndex = await pricingBox.evaluate((el) => {
  const all = [...document.querySelectorAll(".roi-calculator-root, .pricing-calculator-root")];
  return all.indexOf(el);
});

const checks = {
  hasRoiCalculator: (await roiBox.count()) > 0,
  hasPricingCalculator: (await pricingBox.count()) > 0,
  roiBeforePricing: roiIndex >= 0 && pricingIndex >= 0 && roiIndex < pricingIndex,
  noSticklightIframe: (await page.locator('iframe[src*="sticklight"]').count()) === 0,
  noNotFound: !(await page.locator("text=Not Found").count()),
  hasRoiHeading: (await page.locator('h2:has-text("מחשבון ROI")').count()) > 0,
  hasPricingSectionHeading:
    (await page.locator('h2:has-text("הערכת עלויות ניהול")').count()) > 0,
  hasMonthlySection: (await page.locator(".pcalc-section-title:has-text('שירותים חודשיים')").count()) > 0,
  roiMetricVisible: (await page.locator(".rcalc-metric--highlight dd").count()) > 0,
  hasCtaAfter: (await page.locator('text=רוצים לדעת כמה תרוויחו').count()) > 0,
};

await page.locator(".pcalc-card").first().click();
const monthlyTotal = await page.locator(".pcalc-total-value--monthly").textContent();

console.log(JSON.stringify({ ...checks, monthlyTotalAfterSelect: monthlyTotal?.trim(), roiIndex, pricingIndex }, null, 2));
await browser.close();
process.exit(Object.values(checks).every(Boolean) ? 0 : 1);

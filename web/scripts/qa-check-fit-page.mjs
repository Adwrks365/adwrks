import { chromium } from "playwright";

const base = process.env.BASE_URL || "http://localhost:3005";
const checkFitUrl = `${base}/check-fit/`;
const roiUrl = `${base}/%D7%9E%D7%97%D7%A9%D7%91%D7%95%D7%9F-roi-%D7%9E%D7%A2%D7%95%D7%93%D7%9B%D7%9F-2026/`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

await page.goto(checkFitUrl, { waitUntil: "networkidle" });

const heroChecks = {
  hasHero: (await page.locator(".check-fit-hero").count()) > 0,
  hasStartBtn: (await page.locator(".check-fit-main-btn").count()) > 0,
  noDeadOnclick: (await page.locator('[onclick="startQuiz()"]').count()) === 0,
};

await page.locator(".check-fit-main-btn").click();
await page.locator(".check-fit-option").first().click();
await page.locator(".check-fit-option", { hasText: "דרופשיפינג" }).click();

const filterChecks = {
  filteredTitle: await page.locator(".check-fit-result-title").textContent(),
  noWhatsapp: (await page.locator(".check-fit-whatsapp-btn").count()) === 0,
};

await page.goto(checkFitUrl, { waitUntil: "networkidle" });
await page.locator(".check-fit-main-btn").click();
await page.locator(".check-fit-option").first().click();
await page.locator(".check-fit-option", { hasText: "B2B" }).click();
await page.locator(".check-fit-option", { hasText: "7000₪+" }).click();
await page.locator(".check-fit-option", { hasText: "כן" }).click();

const greenChecks = {
  greenTitle: await page.locator(".check-fit-result-title").textContent(),
  hasWhatsapp: (await page.locator(".check-fit-whatsapp-btn").count()) > 0,
  whatsappHref: await page.locator(".check-fit-whatsapp-btn").getAttribute("href"),
};

await page.goto(roiUrl, { waitUntil: "networkidle" });
const ctaHref = await page.locator('a[href*="/check-fit/"]').first().getAttribute("href");

const report = {
  heroChecks,
  filterChecks,
  greenChecks,
  roiCtaHref: ctaHref,
  pass:
    heroChecks.hasHero &&
    heroChecks.hasStartBtn &&
    heroChecks.noDeadOnclick &&
    filterChecks.filteredTitle?.includes("פחות מתאים") &&
    filterChecks.noWhatsapp &&
    greenChecks.greenTitle?.includes("התאמה מצוינת") &&
    greenChecks.hasWhatsapp &&
    greenChecks.whatsappHref?.includes("wa.me") &&
    ctaHref?.includes("/check-fit/"),
};

console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(report.pass ? 0 : 1);

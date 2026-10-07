/**
 * Hero image correction production verification.
 */
import { chromium } from "playwright";

const base = "https://adwrks.co.il";
const browser = await chromium.launch();
const page = await browser.newPage();
const report = {};

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`${base}/`, { waitUntil: "networkidle", timeout: 120_000 });
await page.waitForSelector(".home-hero-v2", { timeout: 30_000 });

report.desktop = await page.evaluate(() => {
  const visual = document.querySelector(".home-hero-v2-visual");
  const img = document.querySelector(".home-hero-v2 img");
  const heroHtml = document.querySelector(".home-hero-v2")?.innerHTML ?? "";
  const rect = img?.getBoundingClientRect();
  return {
    visualDisplay: visual ? getComputedStyle(visual).display : null,
    heroImageSrc: img?.currentSrc || img?.src || null,
    heroImageSize: rect ? { w: Math.round(rect.width), h: Math.round(rect.height) } : null,
    hasPortfolioInHero: /insytix|מנופי|browser-card|hero-work-preview|portfolio-showcase/i.test(heroHtml),
    marketingHeroImage: heroHtml.includes("adwrks-marketing-solutions"),
  };
});

await page.setViewportSize({ width: 390, height: 844 });
await page.reload({ waitUntil: "networkidle" });
report.mobile = await page.evaluate(() => {
  const visual = document.querySelector(".home-hero-v2-visual");
  const img = document.querySelector(".home-hero-v2 img");
  return {
    visualDisplay: visual ? getComputedStyle(visual).display : null,
    heroHeight: Math.round(document.querySelector(".home-hero-v2")?.getBoundingClientRect().height ?? 0),
    heroImagesVisible: [...document.querySelectorAll(".home-hero-v2 img")].filter(
      (el) => getComputedStyle(el.closest(".home-hero-v2-visual") ?? el).display !== "none",
    ).length,
    imgInDom: Boolean(img),
  };
});

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
await page.locator(".home-hero-v2 .btn-primary").first().click();
await page.waitForTimeout(400);
report.ctaPopupOpens = await page.evaluate(
  () =>
    Boolean(
      document.querySelector(
        '[role="dialog"], .popup-overlay, .contact-popup, .modal-open, [data-state="open"], .popup-panel',
      ),
    ),
);
await page.keyboard.press("Escape");
await page.locator('.home-hero-v2 a[href="#portfolio"]').click();
await page.waitForTimeout(300);
report.ctaPortfolioHash = await page.evaluate(() => location.hash === "#portfolio");

console.log(JSON.stringify(report, null, 2));
await browser.close();

const ok =
  report.desktop.visualDisplay === "block" &&
  report.desktop.marketingHeroImage &&
  !report.desktop.hasPortfolioInHero &&
  report.mobile.visualDisplay === "none" &&
  report.mobile.heroImagesVisible === 0 &&
  report.ctaPopupOpens &&
  report.ctaPortfolioHash;

process.exit(ok ? 0 : 1);

#!/usr/bin/env node
/**
 * Phase 5F QA — minimized lead CTA after popup dismiss.
 * Usage: node scripts/qa-phase-5f-popup-cta.mjs --base http://localhost:3010
 */
import fs from "fs";
import path from "path";

const base = process.argv.includes("--base")
  ? process.argv[process.argv.indexOf("--base") + 1]
  : "http://localhost:3010";

const outDir = path.join(process.cwd(), "migration-audit", "phase-5f-qa");
const widths = [390, 430, 768, 1440, 1920];

async function clearPopupState(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    localStorage.removeItem("adwrks_popup_dismissed_until");
    localStorage.removeItem("adwrks_popup_submitted_until");
    sessionStorage.clear();
  });
}

async function forceOpenPopup(page) {
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(500);
}

async function main() {
  const { chromium } = await import("playwright");
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const report = { base, tests: [], collisions: [] };

  const page = await browser.newPage();

  // TEST 1 — service page dismiss + CTA reopen
  await clearPopupState(page, `${base}/google-ads/`);
  await page.waitForLoadState("load");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForSelector(".contextual-popup-dialog", { timeout: 45000 });
  await page.click(".contextual-popup-close");
  await page.waitForSelector(".popup-minimized-cta", { timeout: 5000 });
  const ctaVisible1 = await page.isVisible(".popup-minimized-cta");
  await page.click(".popup-minimized-cta");
  await page.waitForSelector(".contextual-popup-dialog", { timeout: 5000 });
  const popupReopened = await page.isVisible(".contextual-popup-dialog");
  await page.click(".contextual-popup-close");
  const ctaBack = await page.isVisible(".popup-minimized-cta");
  report.tests.push({
    name: "TEST1_service_dismiss_cta_reopen",
    ctaVisible1,
    popupReopened,
    ctaBack,
    pass: ctaVisible1 && popupReopened && ctaBack,
  });

  // TEST 2 — cross-page context
  await clearPopupState(page, `${base}/seo-2026-ai-answers/`);
  await page.waitForLoadState("load");
  await forceOpenPopup(page);
  await page.waitForSelector(".contextual-popup-dialog", { timeout: 55000 });
  const articleHeadline = await page.locator(".contextual-popup-title").textContent();
  await page.click(".contextual-popup-close");
  await page.waitForSelector(".popup-minimized-cta");
  await page.goto(`${base}/google-ads/`, { waitUntil: "networkidle" });
  const ctaOnService = await page.isVisible(".popup-minimized-cta");
  await page.click(".popup-minimized-cta");
  await page.waitForSelector(".contextual-popup-dialog");
  const serviceHeadline = await page.locator(".contextual-popup-title").textContent();
  report.tests.push({
    name: "TEST2_cross_page_context",
    articleHeadline: articleHeadline?.trim(),
    serviceHeadline: serviceHeadline?.trim(),
    ctaOnService,
    contextChanged: articleHeadline?.trim() !== serviceHeadline?.trim(),
    pass: ctaOnService && articleHeadline?.trim() !== serviceHeadline?.trim(),
  });

  // TEST 4 — dismiss reload no auto popup
  await clearPopupState(page, `${base}/seo/`);
  await page.waitForLoadState("load");
  await forceOpenPopup(page);
  await page.waitForSelector(".contextual-popup-dialog", { timeout: 45000 });
  await page.click(".contextual-popup-close");
  await page.waitForSelector(".popup-minimized-cta");
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(41000);
  const autoAfterReload = await page.isVisible(".contextual-popup-dialog");
  const ctaAfterReload = await page.isVisible(".popup-minimized-cta");
  report.tests.push({
    name: "TEST4_dismiss_reload",
    autoAfterReload,
    ctaAfterReload,
    pass: !autoAfterReload && ctaAfterReload,
  });

  // Floating control collision check
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${base}/google-ads/`, { waitUntil: "load", timeout: 60000 });
    await page.evaluate(() => {
      localStorage.setItem("adwrks_popup_dismissed_until", String(Date.now() + 86400000));
    });
    await page.reload({ waitUntil: "load", timeout: 60000 });
    await page.waitForSelector(".popup-minimized-cta");
    const collision = await page.evaluate(() => {
      const cta = document.querySelector(".popup-minimized-cta");
      const selectors = [
        ".floating-contact-rail",
        ".floating-left-rail",
        ".floating-action",
        ".floating-util-btn",
      ];
      const ctaRect = cta.getBoundingClientRect();
      const overlaps = [];
      for (const sel of selectors) {
        for (const el of document.querySelectorAll(sel)) {
          const r = el.getBoundingClientRect();
          const hit =
            ctaRect.left < r.right &&
            ctaRect.right > r.left &&
            ctaRect.top < r.bottom &&
            ctaRect.bottom > r.top;
          if (hit) overlaps.push(sel);
        }
      }
      return {
        cta: { top: ctaRect.top, bottom: ctaRect.bottom, left: ctaRect.left, right: ctaRect.right },
        overlaps,
      };
    });
    await page.screenshot({ path: path.join(outDir, `collision-${width}.png`) });
    report.collisions.push({ width, ...collision, pass: collision.overlaps.length === 0 });
  }

  await browser.close();
  const outFile = path.join(outDir, "report.json");
  fs.writeFileSync(outFile, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * Phase 5F final QA — form submission (real prod API proxy) + keyboard/a11y + full flow.
 * Usage: node scripts/qa-phase-5f-final.mjs --base http://localhost:3011
 */
import fs from "fs";
import path from "path";

const base = process.argv.includes("--base")
  ? process.argv[process.argv.indexOf("--base") + 1]
  : "http://localhost:3011";

const prodApi = "https://adwrks.co.il/api/contact/";
const outDir = path.join(process.cwd(), "migration-audit", "phase-5f-qa");
const stamp = Date.now();

async function clearPopupState(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    localStorage.removeItem("adwrks_popup_dismissed_until");
    localStorage.removeItem("adwrks_popup_submitted_until");
    sessionStorage.clear();
  });
}

async function openPopupViaScroll(page) {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(600);
}

async function main() {
  const { chromium } = await import("playwright");
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const report = { base, prodApi, tests: [], a11y: [], formSubmission: null };

  const page = await browser.newPage();

  // Proxy local /api/contact/ to production for REAL email delivery during local UI test
  await page.route("**/api/contact/", async (route) => {
    if (route.request().method() !== "POST") {
      await route.continue();
      return;
    }
    const body = route.request().postData() || "{}";
    const res = await fetch(prodApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: `${base}/google-ads/`,
      },
      body,
    });
    const text = await res.text();
    await route.fulfill({
      status: res.status,
      contentType: "application/json",
      body: text,
    });
  });

  // --- FORM SUBMISSION TEST ---
  await clearPopupState(page, `${base}/google-ads/`);
  await page.waitForLoadState("load");
  await openPopupViaScroll(page);
  await page.waitForSelector(".contextual-popup-dialog", { timeout: 45000 });

  const [submitResponse] = await Promise.all([
    page.waitForResponse(
      (r) => r.url().includes("/api/contact/") && r.request().method() === "POST",
      { timeout: 30000 },
    ),
    (async () => {
      await page.fill('.contextual-popup-form input[name="name"]', "Phase 5F QA Test");
      await page.fill('.contextual-popup-form input[name="phone"]', "0500000000");
      await page.fill('.contextual-popup-form input[name="email"]', `qa+5f-${stamp}@adwrks.co.il`);
      await page.check('.contextual-popup-form input[name="privacyConsent"]');
      await page.click(".contextual-popup-submit");
    })(),
  ]);

  const submitJson = await submitResponse.json();
  await page.waitForTimeout(800);
  const popupClosed = !(await page.isVisible(".contextual-popup-dialog"));
  const ctaHiddenAfterSubmit = !(await page.isVisible(".popup-minimized-cta"));
  const submittedCooldown = await page.evaluate(() => {
    const raw = localStorage.getItem("adwrks_popup_submitted_until");
    return raw ? Number(raw) > Date.now() : false;
  });

  report.formSubmission = {
    apiStatus: submitResponse.status(),
    apiOk: submitJson.ok === true,
    popupClosed,
    ctaHiddenAfterSubmit,
    submittedCooldown,
    pass:
      submitResponse.status() === 200 &&
      submitJson.ok === true &&
      popupClosed &&
      ctaHiddenAfterSubmit &&
      submittedCooldown,
  };

  // --- KEYBOARD / A11Y TEST ---
  await clearPopupState(page, `${base}/google-ads/`);
  await page.waitForLoadState("load");
  await openPopupViaScroll(page);
  await page.waitForSelector(".contextual-popup-dialog", { timeout: 45000 });

  const dialogA11y = await page.evaluate(() => {
    const dialog = document.querySelector(".contextual-popup-dialog");
    const close = document.querySelector(".contextual-popup-close");
    return {
      role: dialog?.getAttribute("role") || null,
      ariaModal: dialog?.getAttribute("aria-modal") || null,
      labelledBy: dialog?.getAttribute("aria-labelledby") || null,
      describedBy: dialog?.getAttribute("aria-describedby") || null,
      closeLabel: close?.getAttribute("aria-label") || null,
      titleText: document.querySelector(".contextual-popup-title")?.textContent?.trim() || null,
    };
  });

  const focusOnOpen = await page.evaluate(() => {
    const close = document.querySelector(".contextual-popup-close");
    return document.activeElement === close;
  });

  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  const closedByEscape = !(await page.isVisible(".contextual-popup-dialog"));
  const ctaAfterEscape = await page.isVisible(".popup-minimized-cta");

  await page.click(".popup-minimized-cta");
  await page.waitForSelector(".contextual-popup-dialog");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  const focusMoved = await page.evaluate(() => {
    const active = document.activeElement;
    return active?.tagName === "INPUT" || active?.tagName === "BUTTON";
  });

  report.a11y.push({
    name: "dialog_semantics",
    ...dialogA11y,
    pass:
      dialogA11y.role === "dialog" &&
      dialogA11y.ariaModal === "true" &&
      Boolean(dialogA11y.labelledBy) &&
      Boolean(dialogA11y.describedBy) &&
      dialogA11y.closeLabel === "סגירה",
  });
  report.a11y.push({
    name: "focus_and_escape",
    focusOnOpen,
    closedByEscape,
    ctaAfterEscape,
    focusMoved,
    pass: focusOnOpen && closedByEscape && ctaAfterEscape && focusMoved,
  });

  // Minimized CTA a11y
  await page.click(".contextual-popup-close");
  await page.waitForSelector(".popup-minimized-cta");
  const ctaA11y = await page.evaluate(() => {
    const cta = document.querySelector(".popup-minimized-cta");
    return {
      tag: cta?.tagName,
      ariaLabel: cta?.getAttribute("aria-label") || null,
      text: cta?.textContent?.includes("בואו נדבר") || false,
    };
  });
  report.a11y.push({
    name: "minimized_cta",
    ...ctaA11y,
    pass: ctaA11y.tag === "BUTTON" && Boolean(ctaA11y.ariaLabel) && ctaA11y.text,
  });

  // Re-run core flow tests (abbreviated)
  await clearPopupState(page, `${base}/google-ads/`);
  await page.waitForLoadState("load");
  await openPopupViaScroll(page);
  await page.waitForSelector(".contextual-popup-dialog", { timeout: 45000 });
  await page.click(".contextual-popup-close");
  await page.waitForSelector(".popup-minimized-cta");
  report.tests.push({
    name: "dismiss_shows_cta",
    pass: await page.isVisible(".popup-minimized-cta"),
  });

  await browser.close();

  const allPass =
    report.formSubmission.pass &&
    report.a11y.every((t) => t.pass) &&
    report.tests.every((t) => t.pass);

  report.allPass = allPass;
  const outFile = path.join(outDir, "final-report.json");
  fs.writeFileSync(outFile, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  process.exit(allPass ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

#!/usr/bin/env node
/** Phase 3.3B regression + UI QA */
const fs = require("fs");
const path = require("path");

const BASE = process.argv.includes("--base")
  ? process.argv[process.argv.indexOf("--base") + 1]
  : "http://localhost:3000";

const OUT = path.join(__dirname, "..", "migration-audit", "qa-phase-3-3b.json");

async function main() {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  const steps = [];

  function log(step, pass, detail) {
    steps.push({ step, pass, detail });
  }

  for (const width of [390, 1440]) {
    const ctx = await browser.newContext({ viewport: { width, height: 800 }, locale: "he-IL" });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });

    const leftArrow = page.locator(".carousel-btn-left svg path").first();
    const rightArrow = page.locator(".carousel-btn-right svg path").first();
    const leftD = await leftArrow.getAttribute("d");
    const rightD = await rightArrow.getAttribute("d");
    log(`${width}px carousel left arrow points left`, leftD?.includes("M15 18") ?? false, leftD ?? "");
    log(`${width}px carousel right arrow points right`, rightD?.includes("M9 18") ?? false, rightD ?? "");

    const followText = await page.locator(".site-footer-social").innerText();
    log(`${width}px footer follow excludes WhatsApp`, !/whatsapp/i.test(followText), followText);

    log(`${width}px floating contact rail`, (await page.locator(".floating-contact-rail").count()) > 0, "");
    log(`${width}px scroll to top`, (await page.locator(".floating-util-btn-top").count()) > 0, "");
    log(`${width}px accessibility`, (await page.locator(".floating-util-btn-a11y").count()) > 0, "");
    log(`${width}px left util group`, (await page.locator(".floating-util-group").count()) > 0, "");

    const navTexts = await page.locator(".site-nav-link, .site-nav-link-dropdown").allTextContents();
    const hasContactLast = navTexts.join("|").includes("יצירת קשר");
    log(`${width}px contact in nav`, hasContactLast, navTexts.join(", "));

    await ctx.close();
  }

  // Header order desktop
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 800 }, locale: "he-IL" });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  const navOrder = await page.locator("nav[aria-label='תפריט ראשי'] > *").evaluateAll((els) =>
    els.map((el) => el.textContent?.trim().slice(0, 20) ?? ""),
  );
  log("nav order includes services+blog dropdowns", navOrder.length >= 5, navOrder.join(" | "));

  await page.locator(".site-nav-link-dropdown").first().hover();
  log("services dropdown opens", await page.locator(".site-nav-dropdown.is-open").first().isVisible(), "");
  await page.locator('.site-nav-dropdown-item[href*="/google-ads/"]').first().click();
  await page.waitForURL("**/google-ads/**");
  log("dropdown closes after nav", (await page.locator(".site-nav-dropdown.is-open").count()) === 0, page.url());

  await ctx.close();
  await browser.close();

  const report = {
    timestamp: new Date().toISOString(),
    base: BASE,
    steps,
    passed: steps.filter((s) => s.pass).length,
    failed: steps.filter((s) => !s.pass).length,
  };
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ passed: report.passed, failed: report.failed }, null, 2));
}

main().catch((e) => { console.error(e); process.exit(1); });

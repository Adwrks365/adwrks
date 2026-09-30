#!/usr/bin/env node
/**
 * Header dropdown + blog navigation interaction test.
 */
const fs = require("fs");
const path = require("path");

const BASE = process.argv.includes("--base")
  ? process.argv[process.argv.indexOf("--base") + 1]
  : "http://localhost:3000";

const OUT = path.join(__dirname, "..", "migration-audit", "interaction-test-report.json");

async function runViewport(browser, width, label) {
  const context = await browser.newContext({ viewport: { width, height: 800 }, locale: "he-IL" });
  const page = await context.newPage();
  const steps = [];

  function log(step, pass, detail) {
    steps.push({ step, pass, detail, viewport: label });
  }

  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  log("homepage loads", true, await page.title());

  if (width >= 1024) {
    const servicesGroup = page.locator(".site-nav-group").first();
    await servicesGroup.hover();
    const dropdownVisible = await page.locator(".site-nav-dropdown.is-open").first().isVisible();
    log("services dropdown opens on hover", dropdownVisible, String(dropdownVisible));

    await page.locator('.site-nav-dropdown a[href="/seo/"]').first().click();
    await page.waitForURL("**/seo/**");
    log("navigate to service", page.url().includes("/seo/"), page.url());

    const dropdownClosed = !(await page.locator(".site-nav-dropdown.is-open").count());
    log("dropdown closed after navigation", dropdownClosed, String(dropdownClosed));

    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(300);
    const closedAfterScroll = !(await page.locator(".site-nav-dropdown.is-open").count());
    log("dropdown remains closed after scroll", closedAfterScroll, String(closedAfterScroll));

    await page.goto(`${BASE}/`);
    await servicesGroup.hover();
    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);
    const closedOnEscape = !(await page.locator(".site-nav-dropdown.is-open").count());
    log("dropdown closes on Escape", closedOnEscape, String(closedOnEscape));

    await page.locator('a.site-nav-link[href="/blog/"]').click();
    await page.waitForURL("**/blog/**");
    log("blog link goes to /blog/", page.url().includes("/blog/"), page.url());
  } else {
    await page.locator('button[aria-controls="mobile-nav"]').click();
    const navVisible = await page.locator("#mobile-nav").isVisible();
    log("mobile menu opens", navVisible, String(navVisible));

    const blogToggle = page.locator('#mobile-nav button').filter({ hasText: "מידע מקצועי" });
    await blogToggle.click();
    await page.locator('#mobile-nav a[href="/blog/"]').first().click();
    await page.waitForURL("**/blog/**");
    log("mobile blog navigation", page.url().includes("/blog/"), page.url());

    const menuClosed = !(await page.locator("#mobile-nav").isVisible());
    log("mobile menu closed after nav", menuClosed, String(menuClosed));
  }

  await context.close();
  return steps;
}

async function main() {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });

  const desktop = await runViewport(browser, 1440, "desktop");
  const mobile = await runViewport(browser, 390, "mobile");

  await browser.close();

  const all = [...desktop, ...mobile];
  const report = {
    timestamp: new Date().toISOString(),
    base: BASE,
    steps: all,
    passed: all.filter((s) => s.pass).length,
    failed: all.filter((s) => !s.pass).length,
  };

  fs.writeFileSync(OUT, JSON.stringify(report, null, 2), "utf8");
  console.log(JSON.stringify({ passed: report.passed, failed: report.failed }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

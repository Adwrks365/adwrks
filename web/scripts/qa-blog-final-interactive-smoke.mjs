/**
 * Interactive smoke — tools + content checks (Preview or local).
 * QA_BASE_URL=https://adwrks-git-feat-...vercel.app npx tsx scripts/qa-blog-final-interactive-smoke.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, devices } from "playwright";

const BASE = (process.env.QA_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const root = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(root, "../../migration-audit/qa-blog-final-interactive-smoke");
fs.mkdirSync(OUT, { recursive: true });

const PAGES = [
  {
    name: "pagespeed-he",
    path: "/%d7%91%d7%93%d7%99%d7%a7%d7%aa-%d7%9e%d7%94%d7%99%d7%a8%d7%95%d7%aa-%d7%90%d7%aa%d7%a8/",
    tool: "pagespeed",
  },
  {
    name: "pagespeed-en",
    path: "/en/website-speed-test/",
    tool: "pagespeed",
  },
  { name: "roi-he", path: "/%d7%9e%d7%97%d7%a9%d7%91%d7%95%d7%9f-roi-%d7%9e%d7%a2%d7%95%d7%93%d7%9b%d7%9f-2026/", tool: "roi" },
  { name: "roi-en", path: "/en/roi-calculator-2026/", tool: "roi" },
  {
    name: "pricing-he",
    path: encodeURI("/כמה-עולה-לבנות-אתר-מחירון-מחשבון/"),
    tool: "pricing",
  },
  { name: "pricing-en", path: "/en/website-building-pricing/", tool: "pricing" },
  { name: "batch9-agency", path: "/en/digital-marketing-agency-maximize/", tool: "content" },
  { name: "batch9-promo", path: "/en/google-business-promotion-guide/", tool: "content" },
];

async function assertNoPageOverflow(page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (overflow > 8) throw new Error(`page horizontal scroll ${overflow}px`);
}

async function assertLeadCtaOverflow(page) {
  const lead = page.locator('aside.adwrks-article-lead[data-adwrks-content="adwrks-article-lead-2026"]');
  await lead.first().waitFor({ state: "visible", timeout: 45000 });
  const cta = page.locator(
    ".article-cta-band a, .article-end-wrapper a.elementor-button, [data-open-contextual-popup='true']",
  );
  if ((await cta.count()) < 1) throw new Error("CTA not found");
  await assertNoPageOverflow(page);
}

async function assertCommonArticle(page) {
  const lead = page.locator('aside.adwrks-article-lead[data-adwrks-content="adwrks-article-lead-2026"]');
  await lead.first().waitFor({ state: "visible", timeout: 45000 });
  const faq = page.locator(".adwrks-article-faq-block details.adwrks-faq-item");
  if ((await faq.count()) >= 1) {
    const first = faq.first();
    await first.locator("summary").click({ force: true });
    await page.waitForTimeout(200);
    const open = await first.evaluate((el) => el.hasAttribute("open"));
    if (!open) throw new Error("FAQ toggle failed");
  }
  const cta = page.locator(
    ".article-cta-band a, .article-end-wrapper a.elementor-button, [data-open-contextual-popup='true']",
  );
  if ((await cta.count()) < 1) throw new Error("CTA not found");
  await assertNoPageOverflow(page);
}

async function testPagespeed(page, name) {
  const rootEl = page.locator(".pagespeed-insights-root, [data-adwrks-pagespeed-insights]");
  await rootEl.first().waitFor({ state: "visible", timeout: 30000 });
  const input = page.locator("#psi-url, .psi-input").first();
  await input.fill("https://example.com");
  await page.locator(".psi-submit, button[type='submit']").first().click();
  await page.locator(".psi-loading").first().waitFor({ state: "visible", timeout: 15000 }).catch(() => {});
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    if ((await page.locator(".psi-results").count()) > 0) {
      return "API returned results";
    }
    if ((await page.locator(".psi-error").count()) > 0) {
      const errText = (await page.locator(".psi-error").first().innerText()).slice(0, 120);
      return `documented unavailable/error: ${errText}`;
    }
    await page.waitForTimeout(400);
  }
  throw new Error("PageSpeed: timed out without API result or documented error");
}

function parseMoneyText(text) {
  const digits = text.replace(/[^\d.]/g, "");
  return digits ? Number.parseFloat(digits) : NaN;
}

async function testRoi(page) {
  const rootEl = page.locator(".roi-calculator-root");
  await rootEl.first().waitFor({ state: "visible", timeout: 30000 });
  const inputs = page.locator(".rcalc-input");
  await inputs.nth(0).fill("8000");
  await inputs.nth(1).fill("120");
  await inputs.nth(2).fill("6");
  await inputs.nth(3).fill("1500");
  await page.waitForTimeout(400);
  const revenue = page.locator(".rcalc-metrics dd").nth(2);
  const baseRevenue = parseMoneyText(await revenue.innerText());
  if (!Number.isFinite(baseRevenue) || baseRevenue <= 0) {
    throw new Error("ROI revenue metric missing or zero");
  }
  await inputs.nth(3).fill("4500");
  await page.waitForTimeout(500);
  const nextRevenue = parseMoneyText(await revenue.innerText());
  if (!Number.isFinite(nextRevenue) || nextRevenue <= 0) {
    throw new Error("ROI revenue metric empty after input change");
  }
  if (Math.abs(nextRevenue - baseRevenue) < 1) {
    throw new Error("ROI revenue unchanged after meaningful order-value change");
  }
  return `ROI revenue ${baseRevenue} → ${nextRevenue}`;
}

async function testPricing(page) {
  const calc = page.locator(".pricing-calculator-root");
  const tables = page.locator(".elementor-widget-price-table");
  if ((await calc.count()) > 0) {
    await calc.first().waitFor({ state: "visible", timeout: 30000 });
    const monthlyCards = page.locator(".pcalc-grid--monthly .pcalc-card");
    await monthlyCards.nth(0).click();
    const monthlyTotal = page.locator(".pcalc-total-value--monthly");
    await monthlyTotal.waitFor({ state: "visible", timeout: 15000 });
    const oneServiceTotal = parseMoneyText(await monthlyTotal.innerText());
    if (!Number.isFinite(oneServiceTotal) || oneServiceTotal < 100) {
      throw new Error("pricing monthly total invalid after first selection");
    }
    await monthlyCards.nth(1).click();
    await page.waitForTimeout(400);
    const twoServiceTotal = parseMoneyText(await monthlyTotal.innerText());
    if (!Number.isFinite(twoServiceTotal) || twoServiceTotal < oneServiceTotal + 50) {
      throw new Error("pricing total did not increase when selecting second priced service");
    }
    await assertNoPageOverflow(page);
    return `pricing monthly total ${oneServiceTotal} → ${twoServiceTotal}`;
  }
  if ((await tables.count()) > 0) {
    await tables.first().waitFor({ state: "visible", timeout: 15000 });
    await assertNoPageOverflow(page);
    return "Elementor price tables visible (no embed slot on this post)";
  }
  throw new Error("no pricing UI found");
}

async function testContentBatch9(page, name) {
  const summaries = await page.locator("h2, h3").filter({ hasText: /^Summary$/i }).count();
  const inSummary = await page.locator("h2, h3").filter({ hasText: /^In summary$/i }).count();
  if (summaries > 0 && inSummary > 0) throw new Error("duplicate Summary + In summary");
  if (inSummary < 1 && summaries < 1) throw new Error("no closing summary heading");
  return summaries === 0 ? "single In summary" : "legacy Summary only";
}

async function runPage(browser, spec, mode, opts) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    sessionStorage.setItem("adwrks_popup_session_suppressed", "1");
    localStorage.setItem("adwrks_popup_dismissed_until", String(Date.now() + 86400000));
  });
  const shots = path.join(OUT, `${spec.name}-${mode}.png`);
  let note = "";
  try {
    await page.goto(`${BASE}${spec.path}`, { waitUntil: "domcontentloaded", timeout: 90000 });
    if (spec.tool === "content") await assertLeadCtaOverflow(page);
    else await assertCommonArticle(page);
    if (spec.tool === "pagespeed") note = await testPagespeed(page, spec.name);
    else if (spec.tool === "roi") note = await testRoi(page);
    else if (spec.tool === "pricing") note = await testPricing(page);
    else if (spec.tool === "content") note = await testContentBatch9(page, spec.name);
    await page.screenshot({ path: shots, fullPage: false });
    console.log("OK", spec.name, mode, note);
    return { ok: true, note };
  } catch (e) {
    await page.screenshot({ path: shots.replace(".png", "-fail.png"), fullPage: false }).catch(() => {});
    console.error("FAIL", spec.name, mode, e.message);
    return { ok: false, error: e.message };
  } finally {
    await ctx.close();
  }
}

const report = { base: BASE, at: new Date().toISOString(), results: [] };
let failed = 0;
const browser = await chromium.launch();
for (const spec of PAGES) {
  for (const [mode, opts] of [
    ["desktop", {}],
    ["mobile", devices["Pixel 5"]],
  ]) {
    const r = await runPage(browser, spec, mode, opts);
    report.results.push({ ...spec, mode, ...r });
    if (!r.ok) failed++;
  }
}
await browser.close();
fs.writeFileSync(path.join(OUT, "summary.json"), JSON.stringify(report, null, 2));
console.log("Interactive failed", failed);
process.exit(failed ? 1 : 0);
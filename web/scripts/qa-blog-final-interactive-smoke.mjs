/**
 * Interactive smoke — tools + FAQ (separate). FAQ never blocks tool checks.
 * QA_BASE_URL=https://adwrks.co.il npx tsx scripts/qa-blog-final-interactive-smoke.mjs
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

async function waitLeadAndCta(page) {
  const lead = page.locator('aside.adwrks-article-lead[data-adwrks-content="adwrks-article-lead-2026"]');
  await lead.first().waitFor({ state: "visible", timeout: 45000 });
  const cta = page.locator(
    ".article-cta-band a, .article-end-wrapper a.elementor-button, [data-open-contextual-popup='true']",
  );
  if ((await cta.count()) < 1) throw new Error("CTA not found");
}

/** FAQ checked separately — normal Playwright click, no force. */
async function testFaqInteraction(page) {
  const faq = page.locator(".adwrks-article-faq-block details.adwrks-faq-item");
  if ((await faq.count()) < 1) {
    return { ok: true, note: "no FAQ block" };
  }
  const first = faq.first();
  const summary = first.locator("summary");
  await summary.scrollIntoViewIfNeeded();
  await summary.waitFor({ state: "visible", timeout: 15000 });
  await summary.click();
  await page.waitForTimeout(300);
  const open = await first.evaluate((el) => el.hasAttribute("open"));
  if (!open) {
    return { ok: false, error: "FAQ toggle failed after click" };
  }
  return { ok: true, note: "FAQ opened" };
}

async function testPagespeed(page) {
  const rootEl = page.locator(".pagespeed-insights-root, [data-adwrks-pagespeed-insights]");
  await rootEl.first().waitFor({ state: "visible", timeout: 30000 });
  const input = page.locator("#psi-url, .psi-input").first();
  await input.fill("https://example.com");
  await page.locator(".psi-submit, button[type='submit']").first().click();
  await page.locator(".psi-loading").first().waitFor({ state: "visible", timeout: 15000 }).catch(() => {});
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    if ((await page.locator(".psi-results").count()) > 0) {
      return { ok: true, note: "API returned results", apiStatus: "results" };
    }
    if ((await page.locator(".psi-error").count()) > 0) {
      const errText = (await page.locator(".psi-error").first().innerText()).slice(0, 120);
      return {
        ok: true,
        note: `documented unavailable/error: ${errText}`,
        apiStatus: "unavailable",
      };
    }
    await page.waitForTimeout(400);
  }
  return { ok: false, error: "PageSpeed: timed out without API result or documented error", apiStatus: "timeout" };
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
  return { ok: true, note: `ROI revenue ${baseRevenue} → ${nextRevenue}` };
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
    return { ok: true, note: `pricing monthly total ${oneServiceTotal} → ${twoServiceTotal}` };
  }
  if ((await tables.count()) > 0) {
    await tables.first().waitFor({ state: "visible", timeout: 15000 });
    await assertNoPageOverflow(page);
    return { ok: true, note: "Elementor price tables visible (no embed slot on this post)" };
  }
  throw new Error("no pricing UI found");
}

async function testContentBatch9(page) {
  const summaries = await page.locator("h2, h3").filter({ hasText: /^Summary$/i }).count();
  const inSummary = await page.locator("h2, h3").filter({ hasText: /^In summary$/i }).count();
  if (summaries > 0 && inSummary > 0) throw new Error("duplicate Summary + In summary");
  if (inSummary < 1 && summaries < 1) throw new Error("no closing summary heading");
  return { ok: true, note: summaries === 0 ? "single In summary" : "legacy Summary only" };
}

async function runToolTest(page, spec) {
  if (spec.tool === "pagespeed") return await testPagespeed(page);
  if (spec.tool === "roi") {
    try {
      return await testRoi(page);
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }
  if (spec.tool === "pricing") {
    try {
      return await testPricing(page);
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }
  if (spec.tool === "content") {
    try {
      await assertNoPageOverflow(page);
      return await testContentBatch9(page);
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }
  return { ok: true, note: "n/a" };
}

async function runPage(browser, spec, mode, opts) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    sessionStorage.setItem("adwrks_popup_session_suppressed", "1");
    localStorage.setItem("adwrks_popup_dismissed_until", String(Date.now() + 86400000));
  });
  const shots = path.join(OUT, `${spec.name}-${mode}.png`);
  const entry = {
    name: spec.name,
    path: spec.path,
    tool: spec.tool,
    mode,
    toolFunctionality: { ok: false },
    faqInteraction: { ok: true, note: "skipped" },
    pagespeedApi: null,
  };
  try {
    await page.goto(`${BASE}${spec.path}`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await waitLeadAndCta(page);

    entry.toolFunctionality = await runToolTest(page, spec);
    if (spec.tool === "pagespeed" && entry.toolFunctionality.apiStatus) {
      entry.pagespeedApi = entry.toolFunctionality.apiStatus;
    }

    entry.faqInteraction = await testFaqInteraction(page);

    if (spec.tool !== "pricing") {
      await assertNoPageOverflow(page).catch((e) => {
        if (!entry.toolFunctionality.overflowNote) {
          entry.toolFunctionality.overflowNote = e.message;
        }
      });
    }

    const toolTag = entry.toolFunctionality.ok ? "OK" : "FAIL";
    const faqTag = entry.faqInteraction.ok ? "OK" : "FAIL";
    console.log(
      toolTag,
      "tool",
      spec.name,
      mode,
      entry.toolFunctionality.note ?? entry.toolFunctionality.error,
    );
    console.log(
      faqTag,
      "faq",
      spec.name,
      mode,
      entry.faqInteraction.note ?? entry.faqInteraction.error,
    );
    await page.screenshot({ path: shots, fullPage: false });
    entry.ok = entry.toolFunctionality.ok && entry.faqInteraction.ok;
    return entry;
  } catch (e) {
    await page.screenshot({ path: shots.replace(".png", "-fail.png"), fullPage: false }).catch(() => {});
    entry.toolFunctionality = { ok: false, error: e.message };
    entry.ok = false;
    console.error("FAIL", "page", spec.name, mode, e.message);
    return entry;
  } finally {
    await ctx.close();
  }
}

const report = { base: BASE, at: new Date().toISOString(), results: [] };
let toolFailed = 0;
let faqFailed = 0;
const browser = await chromium.launch();
for (const spec of PAGES) {
  for (const [mode, opts] of [
    ["desktop", {}],
    ["mobile", devices["Pixel 5"]],
  ]) {
    const r = await runPage(browser, spec, mode, opts);
    report.results.push(r);
    if (!r.toolFunctionality?.ok) toolFailed++;
    if (r.faqInteraction && !r.faqInteraction.ok) faqFailed++;
  }
}
await browser.close();

report.summary = {
  runs: report.results.length,
  toolFailed,
  faqFailed,
  pagespeedApi: report.results
    .filter((r) => r.tool === "pagespeed")
    .map((r) => ({
      name: r.name,
      mode: r.mode,
      api: r.pagespeedApi,
      ok: r.toolFunctionality?.ok,
    })),
};

fs.writeFileSync(path.join(OUT, "summary.json"), JSON.stringify(report, null, 2));
console.log("Summary", report.summary);
process.exit(toolFailed + faqFailed > 0 ? 1 : 0);
/**
 * PR #10 final visual + layout QA (before=prod, after=local).
 * AFTER_BASE=http://localhost:3017 BEFORE_BASE=https://adwrks.co.il npx tsx scripts/qa-blog-pr10-visual-final.mjs
 */
import { chromium, devices } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const AFTER = (process.env.AFTER_BASE ?? "http://localhost:3017").replace(/\/$/, "");
const BEFORE = (process.env.BEFORE_BASE ?? "https://adwrks.co.il").replace(/\/$/, "");
const OUT = path.resolve("..", "migration-audit", "qa-blog-pr10-final");
mkdirSync(OUT, { recursive: true });

/** 16 article URLs across batch5, batch4, legacy, EN */
const ARTICLES = [
  { id: "b5-digital-age", slug: "/%d7%a0%d7%99%d7%94%d7%95%d7%9c-%d7%a2%d7%a1%d7%a7-%d7%91%d7%a2%d7%99%d7%93%d7%9f-%d7%94%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99/", group: "batch5" },
  { id: "b5-consultant", slug: "/%d7%99%d7%95%d7%a2%d7%a5-%d7%a9%d7%99%d7%95%d7%95%d7%a7-%d7%91%d7%90%d7%99%d7%a0%d7%98%d7%a8%d7%a0%d7%98/", group: "batch5" },
  { id: "b5-hosting", slug: "/%d7%90%d7%97%d7%a1%d7%95%d7%9f-%d7%90%d7%aa%d7%a8%d7%99%d7%9d-%d7%9e%d7%a0%d7%95%d7%94%d7%9c/", group: "batch5" },
  { id: "b5-office", slug: "/%d7%94%d7%97%d7%a9%d7%99%d7%91%d7%95%d7%aa-%d7%a9%d7%9c-%d7%9e%d7%a9%d7%a8%d7%93-%d7%a4%d7%a8%d7%a1%d7%95%d7%9d-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99/", group: "batch5" },
  { id: "b4-google-7", slug: "/%d7%a4%d7%a8%d7%a1%d7%95%d7%9d-%d7%91%d7%92%d7%95%d7%92%d7%9c-7-%d7%90%d7%a1%d7%98%d7%a8%d7%98%d7%92%d7%99%d7%95%d7%aa/", group: "batch4" },
  { id: "b4-agency", slug: "/%d7%97%d7%91%d7%a8%d7%94-%d7%9c%d7%a9%d7%99%d7%95%d7%95%d7%a7-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99/", group: "batch4" },
  { id: "legacy-ru", slug: "/%d7%a7%d7%99%d7%93%d7%95%d7%9d-%d7%90%d7%aa%d7%a8%d7%99%d7%9d-%d7%91%d7%a8%d7%95%d7%a1%d7%99%d7%aa/", group: "legacy" },
  { id: "legacy-marketing", slug: "/%d7%a9%d7%99%d7%95%d7%95%d7%a7-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99-%d7%9c%d7%a2%d7%a1%d7%a7%d7%99%d7%9d/", group: "legacy" },
  { id: "legacy-wp-cost", slug: "/%D7%9B%D7%9E%D7%94-%D7%A2%D7%95%D7%9C%D7%94-%D7%9C%D7%91%D7%A0%D7%95%D7%AA-%D7%90%D7%AA%D7%A8-%D7%90%D7%99%D7%A0%D7%98%D7%A8%D7%A0%D7%98-%D7%91%D7%95%D7%95%D7%A8%D7%93%D7%A4%D7%A8%D7%A1/", group: "legacy" },
  { id: "en-digital-age", slug: "/en/managing-business-digital-age/", group: "en" },
  { id: "en-shopping", slug: "/en/google-shopping-guide/", group: "en" },
  { id: "en-seo-future", slug: "/en/future-of-seo-2025/", group: "en" },
];

const NON_ARTICLE = [
  { id: "home", slug: "/" },
  { id: "service-seo", slug: "/%d7%a7%d7%99%d7%93%d7%95%d7%9d-%d7%90%d7%aa%d7%a8%d7%99%d7%9d-%d7%91%d7%92%d7%95%d7%92%d7%9c/" },
  { id: "service-google-ads", slug: "/google-ads/" },
];

async function measureCta(page) {
  return page.evaluate(() => {
    const body = document.querySelector(".article-body-html");
    if (!body) return { ok: false, reason: "no-body" };
    const bodyRect = body.getBoundingClientRect();
    const cta =
      body.querySelector(".article-inline-cta-block .elementor-button") ||
      body.querySelector('.elementor-button[data-open-contextual-popup="true"]') ||
      body.querySelector(".article-inline-cta-block");
    if (!cta) return { ok: true, reason: "no-in-body-cta", bodyWidth: bodyRect.width };
    const priceTable = cta.closest(".elementor-widget-price-table");
    const inlineBlock = cta.closest(".article-inline-cta-block");
    const ref = priceTable || inlineBlock || body;
    const refRect = ref.getBoundingClientRect();
    const refMid = refRect.left + refRect.width / 2;
    const r = cta.getBoundingClientRect();
    const btnMid = r.left + r.width / 2;
    const delta = Math.abs(btnMid - refMid);
    const tolerance = Math.max(40, refRect.width * 0.12);
    const marginTop =
      cta instanceof HTMLElement
        ? parseFloat(getComputedStyle(cta.closest(".article-inline-cta-block") || cta).marginTop)
        : 0;
    const inline = cta.closest(".article-inline-cta-block");
    return {
      ok: delta <= tolerance,
      delta,
      tolerance,
      bodyWidth: bodyRect.width,
      marginTop,
      hasInlineWrap: Boolean(inline),
      lead: Boolean(body.querySelector(".adwrks-article-lead")),
      faqItems: body.querySelectorAll(".adwrks-faq-item").length,
      textLinksLeft:
        body.querySelectorAll(".elementor-widget-text-editor a:not(.elementor-button)").length,
    };
  });
}

async function shotCta(page, file) {
  const loc = page.locator(
    ".article-inline-cta-block, .article-body-html .elementor-widget-button:has([data-open-contextual-popup])",
  ).first();
  if ((await loc.count()) === 0) return false;
  await loc.scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(400);
  const box = await loc.boundingBox();
  if (!box) return false;
  const pad = 24;
  await page.screenshot({
    path: file,
    clip: {
      x: Math.max(0, box.x - pad),
      y: Math.max(0, box.y - pad * 2),
      width: Math.min(900, box.width + pad * 2),
      height: Math.min(320, box.height + pad * 4),
    },
  });
  return true;
}

async function runArticle(browser, base, label, article, mode, opts) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    sessionStorage.setItem("adwrks_popup_session_suppressed", "1");
    localStorage.setItem("adwrks_popup_dismissed_until", String(Date.now() + 86400000));
  });
  const url = `${base}${article.slug}`;
  try {
    await page.goto(url, { waitUntil: "load", timeout: 60000 });
    await page.waitForSelector(".article-body-html, main", { timeout: 25000 });
    await page.waitForTimeout(600);
    const metrics = await measureCta(page);
    const shotPath = path.join(OUT, `${label}-${article.id}-cta-${mode}.png`);
    await shotCta(page, shotPath);
    return { url, label, article: article.id, mode, metrics, shot: true };
  } catch (e) {
    return { url, label, article: article.id, mode, error: String(e) };
  } finally {
    await ctx.close();
  }
}

async function runSmoke(browser, base, label, item, mode, opts) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  try {
    await page.goto(`${base}${item.slug}`, { waitUntil: "load", timeout: 60000 });
    const h1 = await page.locator("h1").first().textContent();
    const hasHomeCta = (await page.locator(".home-cta").count()) > 0;
    const hasServiceHero = (await page.locator(".service-hero, [class*='service']").count()) > 0;
    await page.screenshot({
      path: path.join(OUT, `${label}-${item.id}-${mode}.png`),
      fullPage: false,
    });
    return { id: item.id, label, mode, h1: h1?.trim().slice(0, 40), hasHomeCta, hasServiceHero };
  } finally {
    await ctx.close();
  }
}

const results = [];
const browser = await chromium.launch();

for (const article of ARTICLES) {
  for (const [mode, opts] of [
    ["desktop", { viewport: { width: 1280, height: 900 } }],
    ["mobile", devices["Pixel 5"]],
  ]) {
    results.push(await runArticle(browser, AFTER, "after", article, mode, opts));
    if (mode === "desktop") {
      results.push(await runArticle(browser, BEFORE, "before", article, mode, opts));
    }
  }
}

for (const item of NON_ARTICLE) {
  for (const [mode, opts] of [
    ["desktop", { viewport: { width: 1280, height: 900 } }],
    ["mobile", devices["Pixel 5"]],
  ]) {
    results.push(await runSmoke(browser, AFTER, "after", item, mode, opts));
  }
}

await browser.close();

const articleChecks = results.filter((r) => r.metrics && r.label === "after");
const fails = articleChecks.filter(
  (r) => r.metrics?.reason !== "no-in-body-cta" && r.metrics?.ok === false,
);
const errors = results.filter((r) => r.error);

writeFileSync(path.join(OUT, "results.json"), JSON.stringify({ results, fails, errors }, null, 2));

console.log("ARTICLES_TESTED", ARTICLES.length);
console.log("RUNS", results.length);
console.log("CTA_CENTER_FAILS", fails.length);
if (fails.length) console.log(fails);
if (errors.length) console.log("ERRORS", errors);
console.log("OUT", OUT);

process.exit(fails.length || errors.length ? 1 : 0);
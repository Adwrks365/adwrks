/**
 * Batch6 (HE) + Batch7 (EN) — full visual QA: 10 articles × desktop + mobile.
 * Plus location regression: Carmiel keeps location hero; service/blog must not.
 *
 * QA_BASE_URL=http://localhost:3000 npx tsx scripts/qa-blog-rollout-batch67-full.mjs
 */
import { chromium, devices } from "playwright";
import { mkdirSync } from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const OUT = path.resolve("..", "migration-audit", "qa-blog-rollout-batch67-full");

const ARTICLES = [
  { slug: "/פרסום-לעסקים/", name: "b6-advertising-he" },
  { slug: "/כוחם-של-ביקורות-והמלצות/", name: "b6-reviews-he" },
  { slug: "/מהי-סוכנות-דיגיטלית/", name: "b6-digital-agency-he" },
  { slug: "/סוכנות-לשיווק-דיגיטלי/", name: "b6-agency-he" },
  { slug: "/מדריך-קידום-העסק-בגוגל/", name: "b6-google-guide-he" },
  { slug: "/en/business-advertising/", name: "b7-business-en" },
  { slug: "/en/what-is-internet-marketing/", name: "b7-internet-mkt-en" },
  { slug: "/en/paid-vs-organic-seo/", name: "b7-paid-organic-en" },
  { slug: "/en/remarketing-guide/", name: "b7-remarketing-en" },
  { slug: "/en/choosing-digital-marketing-agency/", name: "b7-choose-agency-en" },
];

const LOCATION_CHECKS = [
  { slug: "/סוכנות-פרסום-שיווק-בכרמיאל/", expectLocationHero: true, label: "karmiel-he" },
  { slug: "/seo/", expectLocationHero: false, label: "seo-he" },
];

mkdirSync(OUT, { recursive: true });

async function suppressPopup(page) {
  await page.addInitScript(() => {
    sessionStorage.setItem("adwrks_popup_session_suppressed", "1");
    localStorage.setItem("adwrks_popup_dismissed_until", String(Date.now() + 86400000));
  });
}

function parseJsonLdScripts(scripts) {
  const graphs = [];
  for (const raw of scripts) {
    try {
      const j = JSON.parse(raw);
      if (j["@graph"]) graphs.push(...j["@graph"]);
      else graphs.push(j);
    } catch {
      /* skip */
    }
  }
  return graphs;
}

async function assertArticle(page, name, locale) {
  const heroLoc = page.locator(".sp-hero--location");
  if ((await heroLoc.count()) > 0) {
    throw new Error("article must not use sp-hero--location");
  }

  const lead = page.locator(".adwrks-article-lead-2026, .adwrks-article-lead");
  if ((await lead.count()) < 1) throw new Error("missing lead");

  const body = page.locator(".article-body-html");
  await body.first().waitFor({ timeout: 45000 });

  const faq = page.locator(".adwrks-article-faq-block details.adwrks-faq-item");
  const n = await faq.count();
  if (n < 3) throw new Error(`faq count ${n}`);

  const cta =
    (await page.locator(
      ".article-inline-cta-block, .article-cta-band .article-cta-button, .article-body-html a[data-open-contextual-popup]",
    ).count()) > 0;
  if (!cta) throw new Error("missing CTA (inline block or contextual popup link)");

  const updated = page.locator("time[datetime*='2026-11-20']");
  if ((await updated.count()) < 1) throw new Error("missing visible 2026-11-20 updated date");

  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  const graph = parseJsonLdScripts(scripts);
  const articleNode = graph.find((n) =>
    ["BlogPosting", "Article", "NewsArticle"].includes(n?.["@type"]),
  );
  if (!articleNode?.dateModified?.includes("2026-11-20")) {
    throw new Error(`JSON-LD dateModified ${articleNode?.dateModified ?? "missing"}`);
  }

  const summaryPattern =
    locale === "he" ? /סיכום|לסיכום|סיכום:/ : /Summary|In conclusion|Conclusion/i;
  const headingText = await page
    .locator(".article-body-html h2, .article-body-html h3, .article-body-html h4")
    .allTextContents();
  if (!headingText.some((t) => summaryPattern.test(t.trim()))) {
    throw new Error("missing summary heading in body");
  }
}

async function assertLocation(page, expectLocationHero, label) {
  const hero = page.locator(".sp-hero").first();
  await hero.waitFor({ timeout: 20000 });
  const cls = (await hero.getAttribute("class")) ?? "";
  const hasLoc = cls.includes("sp-hero--location");
  if (expectLocationHero && !hasLoc) throw new Error(`${label}: expected location hero`);
  if (!expectLocationHero && hasLoc) throw new Error(`${label}: must not have location hero`);
}

async function main() {
  const browser = await chromium.launch();
  let failed = 0;
  let passed = 0;

  for (const loc of LOCATION_CHECKS) {
    const page = await browser.newPage();
    await suppressPopup(page);
    try {
      await page.goto(`${BASE}${encodeURI(loc.slug)}`, { waitUntil: "domcontentloaded", timeout: 60000 });
      await assertLocation(page, loc.expectLocationHero, loc.label);
      console.log("OK location", loc.label);
      passed++;
    } catch (e) {
      console.error("FAIL location", loc.label, e.message);
      failed++;
    }
    await page.close();
  }

  for (const p of ARTICLES) {
    const locale = p.slug.startsWith("/en/") ? "en" : "he";
    for (const [mode, opts] of [
      ["desktop", {}],
      ["mobile", devices["Pixel 5"]],
    ]) {
      const ctx = await browser.newContext(opts);
      const page = await ctx.newPage();
      await suppressPopup(page);
      try {
        await page.goto(`${BASE}${encodeURI(p.slug)}`, { waitUntil: "domcontentloaded", timeout: 60000 });
        await assertArticle(page, p.name, locale);
        await page.locator(".adwrks-article-lead").first().scrollIntoViewIfNeeded().catch(() => {});
        await page.screenshot({ path: path.join(OUT, `${p.name}-${mode}.png`) });
        console.log("OK", p.name, mode);
        passed++;
      } catch (e) {
        console.error("FAIL", p.name, mode, e.message);
        failed++;
      }
      await ctx.close();
    }
  }

  await browser.close();
  console.log(`\nSummary: ${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
}

main();
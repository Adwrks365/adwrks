/**
 * Phase 5I.5 — Blog + Article audit (read-only, no votes/forms)
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../../migration-audit/phase-5i5-audit");
const BASE = "https://adwrks.co.il";

const ARTICLES = [
  { key: "seo", path: "/seo-2026-ai-answers/", label: "SEO" },
  { key: "gads", path: "/%d7%9e%d7%97%d7%a9%d7%91%d7%95%d7%9f-roi-%d7%9e%d7%a2%d7%95%d7%93%d7%9b%d7%9f-2026/", label: "Google Ads" },
  { key: "social", path: "/%d7%90%d7%a1%d7%98%d7%98%d7%92%d7%99%d7%95%d7%aa-%d7%a9%d7%99%d7%95%d7%95%d7%a7-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99-2025/", label: "Social" },
  { key: "wb", path: "/%d7%91%d7%93%d7%99%d7%a7%d7%aa-%d7%9e%d7%94%d7%99%d7%a8%d7%95%d7%aa-%d7%90%d7%aa%d7%a8/", label: "Website Building" },
  { key: "long", path: "/%d7%a9%d7%99%d7%a4%d7%95%d7%a8-%d7%9e%d7%94%d7%99%d7%a8%d7%95%d7%aa-%d7%90%d7%aa%d7%d7%aa%d7%a8-2026-pagespeed/", label: "Long-form" },
];

async function pageAudit(page) {
  return page.evaluate(() => {
    const h1 = document.querySelector("h1")?.textContent?.trim() ?? null;
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null;
    const robots = document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? null;
    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => {
      try {
        return JSON.parse(s.textContent || "{}");
      } catch {
        return { parseError: true };
      }
    });
    const types = ld.flatMap((block) => {
      const graph = block["@graph"] || (block["@type"] ? [block] : []);
      return graph.map((n) => n["@type"]).filter(Boolean);
    });
    const hasAggregateRating = JSON.stringify(ld).includes("AggregateRating");
    const overflow = document.documentElement.scrollWidth > window.innerWidth + 2;
    const brokenImgs = [...document.querySelectorAll("img")].filter((img) => !img.complete || img.naturalWidth === 0).length;
    const anchors = [...document.querySelectorAll("a[href^='http']")];
    const sharedMultiImg = anchors.filter((a) => a.querySelectorAll("img").length > 1).length;
    return {
      h1,
      title: document.title,
      canonical,
      robots,
      schemaTypes: [...new Set(types.flat())],
      hasAggregateRating,
      overflow,
      brokenImgs,
      sharedMultiImgAnchors: sharedMultiImg,
    };
  });
}

async function articleDetailAudit(page) {
  return page.evaluate(() => {
    const getText = (sel) => document.querySelector(sel)?.textContent?.trim() ?? null;
    const adjacent = document.querySelector(".article-adjacent-nav");
    const prev = adjacent?.querySelector(".article-adjacent-prev");
    const next = adjacent?.querySelector(".article-adjacent-next");
    return {
      hasToc: !!document.querySelector(".article-toc-inline, .article-toc-disclosure"),
      hasSidebar: !!document.querySelector(".article-aside"),
      hasRating: !!document.querySelector(".article-rating"),
      ratingSummary: getText(".article-rating-summary"),
      hasAuthorCard: !!document.querySelector(".article-author-card"),
      relatedCount: document.querySelectorAll(".related-article-card").length,
      inlineCtaCount: document.querySelectorAll(".article-inline-cta-block").length,
      sidebarForm: !!document.querySelector(".article-sidebar-contact-form, form[data-form-id='article-sidebar'], .contact-form"),
      prevLabel: prev?.textContent?.trim() ?? null,
      nextLabel: next?.textContent?.trim() ?? null,
      prevHasRightArrow: prev?.textContent?.includes("→") ?? false,
      nextHasLeftArrow: next?.textContent?.includes("←") ?? false,
      endCta: getText(".article-cta-band"),
      socialShare: document.querySelectorAll(".article-share a, .article-social a").length,
      clientComponentsHint: document.querySelectorAll("[data-reactroot], [data-nextjs-scroll-focus-boundary]").length,
    };
  });
}

async function captureRegion(page, selector, file) {
  const el = page.locator(selector).first();
  if ((await el.count()) === 0) return false;
  await el.screenshot({ path: path.join(OUT_DIR, file) });
  return true;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const report = { base: BASE, blog: {}, articles: {}, sitemap: null, screenshots: [] };

  // Sitemap
  const sm = await fetch(`${BASE}/sitemap.xml`);
  const smText = await sm.text();
  report.sitemap = { urlCount: (smText.match(/<loc>/g) || []).length, hasBlog: smText.includes("/blog/") };

  // Blog archive
  for (const vp of [
    { w: 1440, h: 900, tag: "1440" },
    { w: 390, h: 844, tag: "390" },
  ]) {
    const page = await browser.newPage({ locale: "he-IL" });
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await page.goto(`${BASE}/blog/`, { waitUntil: "networkidle" });
    if (vp.tag === "1440") {
      report.blog.page1 = {
        ...(await pageAudit(page)),
        cardCount: await page.locator(".article-card").count(),
        pagination: await page.locator(".pagination-nav").count(),
        pageNumbers: await page.locator(".pagination-pages .pagination-btn, .pagination-pages a").allTextContents(),
      };
    }
    const full = `blog-${vp.tag}-full.png`;
    await page.screenshot({ path: path.join(OUT_DIR, full), fullPage: true });
    report.screenshots.push(full);
    if (vp.tag === "1440") {
      for (const [sel, name] of [
        [".blog-page-section, .blog-page", "blog-1440-hero-cards.png"],
        [".article-grid", "blog-1440-cards.png"],
      ]) {
        if (await captureRegion(page, sel, name)) report.screenshots.push(name);
      }
    }
    await page.close();
  }

  // Blog page 2 pagination
  const p2 = await browser.newPage({ locale: "he-IL" });
  await p2.setViewportSize({ width: 1440, height: 900 });
  const p2res = await p2.goto(`${BASE}/blog/page/2/`, { waitUntil: "networkidle" });
  report.blog.page2 = { status: p2res?.status(), ...(await pageAudit(p2)), cardCount: await p2.locator(".article-card").count() };
  await p2.close();

  // Articles
  for (const art of ARTICLES) {
    report.articles[art.key] = { label: art.label, path: art.path, viewports: {} };
    for (const vp of [
      { w: 1440, h: 900, tag: "1440" },
      { w: 390, h: 844, tag: "390" },
      { w: 430, h: 932, tag: "430" },
    ]) {
      const page = await browser.newPage({ locale: "he-IL" });
      await page.setViewportSize({ width: vp.w, height: vp.h });
      const res = await page.goto(`${BASE}${art.path}`, { waitUntil: "networkidle" });
      const audit = { status: res?.status(), ...(await pageAudit(page)), ...(await articleDetailAudit(page)) };
      report.articles[art.key].viewports[vp.tag] = audit;
      if (vp.tag === "1440") {
        report.articles[art.key].schemaTypes = audit.schemaTypes;
        report.articles[art.key].hasAggregateRating = audit.hasAggregateRating;
        const full = `article-${art.key}-1440-full.png`;
        await page.screenshot({ path: path.join(OUT_DIR, full), fullPage: true });
        report.screenshots.push(full);
        for (const [sel, name] of [
          [".page-hero, .article-page header", `article-${art.key}-1440-hero.png`],
          [".article-layout", `article-${art.key}-1440-body-sidebar.png`],
          [".article-end-section, .article-end-wrapper", `article-${art.key}-1440-end.png`],
        ]) {
          if (await captureRegion(page, sel, name)) report.screenshots.push(name);
        }
      }
      if (vp.tag === "390") {
        const full = `article-${art.key}-390-full.png`;
        await page.screenshot({ path: path.join(OUT_DIR, full), fullPage: true });
        report.screenshots.push(full);
      }
      await page.close();
    }
  }

  await browser.close();
  await writeFile(path.join(OUT_DIR, "audit-data.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

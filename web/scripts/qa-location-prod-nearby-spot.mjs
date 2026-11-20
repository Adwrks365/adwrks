/**
 * Location nearby regression spot (7 focus cities, HE+EN, desktop+mobile).
 *
 * Usage:
 *   npx tsx scripts/qa-location-prod-nearby-spot.mjs
 *   QA_BASE=https://adwrks.co.il npx tsx scripts/qa-location-prod-nearby-spot.mjs
 *   QA_BASE=http://localhost:3000 npx tsx scripts/qa-location-prod-nearby-spot.mjs
 */
import { chromium, devices } from "playwright";
import { NEARBY_BY_PAGE } from "../src/lib/pages/locations/location-nearby-2026.ts";
import { LOCATION_SEO_META_HE, LOCATION_SEO_META_EN } from "../src/lib/pages/locations/location-seo-meta-2026.ts";
import { LOCATION_ROUTES } from "../src/lib/pages/locations/paths.ts";

const BASE = (process.env.QA_BASE ?? "https://adwrks.co.il").replace(/\/$/, "");
const FOCUS = [
  "afula",
  "karmiel",
  "haifa",
  "akko",
  "ramat-gan",
  "jerusalem",
  "herzliya",
];

function routeOf(id) {
  return LOCATION_ROUTES.find((r) => r.id === id);
}

async function assertNearby(page, id, locale) {
  const cfg = NEARBY_BY_PAGE[id];
  const title = locale === "he" ? cfg.titleHe : cfg.titleEn;
  const intro = locale === "he" ? cfg.introHe : cfg.introEn;
  const h2 = page.locator("h2").filter({ hasText: title }).first();
  if ((await h2.count()) === 0) {
    return { ok: false, reason: `missing h2 ${title.slice(0, 40)}` };
  }
  const section = h2.locator("xpath=ancestor::section[1]");
  const body = (await section.textContent()) ?? "";
  if (!body.includes(intro)) {
    return { ok: false, reason: "intro not in section" };
  }
  for (const nid of cfg.ids) {
    const r = routeOf(nid);
    if (!r) continue;
    const href = locale === "he" ? r.he : r.en;
    const slug = decodeURIComponent(href.replace(/\/$/, "").slice(1));
    const link = section.locator(`a[href*="${slug.split("/")[0]}"]`);
    if ((await link.count()) === 0) {
      return { ok: false, reason: `missing card link ${nid}` };
    }
  }
  return { ok: true };
}

async function assertSeo(page, id, locale) {
  const metaTable = locale === "he" ? LOCATION_SEO_META_HE : LOCATION_SEO_META_EN;
  const patch = metaTable[id];
  if (!patch) return { ok: true };
  const seoTitle = await page.title();
  if (seoTitle !== patch.seoTitle) {
    return { ok: false, reason: `title ${seoTitle?.slice(0, 50)}` };
  }
  const desc = await page.locator('meta[name="description"]').getAttribute("content");
  if (desc !== patch.seoDescription) {
    return { ok: false, reason: "meta description changed" };
  }
  const canon = await page.locator('link[rel="canonical"]').getAttribute("href");
  if (!canon?.startsWith(BASE)) return { ok: false, reason: "canonical" };
  if ((await page.locator('link[hreflang="he-IL"]').count()) < 1) return { ok: false, reason: "hreflang he" };
  if ((await page.locator('link[hreflang="en"]').count()) < 1) return { ok: false, reason: "hreflang en" };
  return { ok: true };
}

async function assertNoHorizontalScroll(page) {
  const overflow = await page.evaluate(() => {
    const el = document.documentElement;
    return el.scrollWidth - el.clientWidth;
  });
  if (overflow > 8) return { ok: false, reason: `horizontal overflow ${overflow}px` };
  return { ok: true };
}

async function main() {
  const browser = await chromium.launch();
  let failed = 0;

  for (const id of FOCUS) {
    const route = routeOf(id);
    if (!route) continue;
    for (const locale of ["he", "en"]) {
      const path = locale === "he" ? route.he : route.en;
      for (const [mode, opts] of [
        ["desktop", null],
        ["mobile", devices["iPhone 13"]],
      ]) {
        const ctx = await browser.newContext(opts ?? {});
        const page = await ctx.newPage();
        await page.addInitScript(() => {
          sessionStorage.setItem("adwrks_popup_session_suppressed", "1");
        });
        await page.goto(`${BASE}${encodeURI(path)}`, { waitUntil: "networkidle", timeout: 120000 });
        for (const fn of [
          () => assertNearby(page, id, locale),
          () => assertSeo(page, id, locale),
          () => assertNoHorizontalScroll(page),
        ]) {
          const r = await fn();
          if (r.ok) console.log("OK", id, locale, mode, fn.name);
          else {
            console.error("FAIL", id, locale, mode, r.reason);
            failed++;
          }
        }
        await ctx.close();
      }
    }
  }

  await browser.close();
  console.log(failed ? "SPOT_FAILED" : "SPOT_PASSED", failed);
  process.exit(failed ? 1 : 0);
}

main();
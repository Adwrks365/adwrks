/**
 * Visual/layout QA — all 25 location pages HE+EN (desktop + mobile).
 * Checks horizontal overflow, key selectors; screenshots for representative sample.
 * QA_BASE=http://127.0.0.1:3000 npx tsx scripts/qa-location-visual-all-2026.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { chromium, devices } from "playwright";
import { LOCATION_ROUTES } from "../src/lib/pages/locations/paths.ts";

const BASE = (process.env.QA_BASE || "http://127.0.0.1:3000").replace(/\/$/, "");
const OUT = path.resolve("..", "migration-audit", "location-content-ux-screenshots");
const SHOT_IDS = new Set(["hub", "ramat-gan", "tel-aviv", "south", "netanya", "jerusalem"]);

async function checkLayout(page) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    const overflowX = doc.scrollWidth > doc.clientWidth + 8;
    const audience = document.querySelector(".sp-page--location .sp-audience-list");
    const form = document.querySelector(".sp-section-contact .sp-contact-form-wrap");
    const rtl = document.documentElement.getAttribute("dir") === "rtl";
    return {
      overflowX,
      hasAudience: !!audience,
      hasForm: !!form,
      rtl,
      audienceCount: audience?.querySelectorAll("li").length ?? 0,
    };
  });
  return overflow;
}

async function run(browser, pathUrl, label, mobile) {
  const ctx = mobile ? await browser.newContext(devices["Pixel 5"]) : await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.addInitScript(() => sessionStorage.setItem("adwrks_popup_session_suppressed", "1"));
  await page.goto(`${BASE}${encodeURI(pathUrl)}`, { waitUntil: "domcontentloaded", timeout: 120000 });
  if (label.split(" ")[0] !== "hub") {
    await page.waitForSelector(".sp-page--location .sp-audience-list li", { timeout: 30_000 }).catch(() => null);
  }
  const layout = await checkLayout(page);
  const id = label.split(" ")[0];
  if (SHOT_IDS.has(id)) {
    fs.mkdirSync(OUT, { recursive: true });
    const safe = pathUrl.replace(/^\//, "").replace(/\//g, "_").slice(0, 45);
    await page.screenshot({
      path: path.join(OUT, `${safe}-${mobile ? "mobile" : "desktop"}.png`),
      fullPage: true,
    });
  }
  await ctx.close();
  return layout;
}

async function main() {
  let failed = 0;
  const browser = await chromium.launch();

  for (const route of LOCATION_ROUTES) {
    for (const locale of ["he", "en"]) {
      const pathUrl = locale === "he" ? route.he : route.en;
      for (const mobile of [false, true]) {
        const layout = await run(browser, pathUrl, `${route.id} ${locale}`, mobile);
        if (!mobile && layout.overflowX) {
          console.error("FAIL overflow", route.id, locale, "desktop");
          failed++;
        }
        if (!layout.hasAudience && route.id !== "hub") {
          console.error("FAIL missing audience", route.id);
          failed++;
        }
        if (layout.audienceCount < 5 && route.id !== "hub") {
          console.error("FAIL audience items", route.id, layout.audienceCount);
          failed++;
        }
        const enRtlOk = locale === "en" ? !layout.rtl : layout.rtl;
        if (!enRtlOk) {
          console.error("FAIL dir", route.id, locale);
          failed++;
        }
        console.log("OK visual", route.id, locale, mobile ? "mobile" : "desktop");
      }
    }
  }

  // Regression: service page must NOT get location-only audience columns
  const svc = await browser.newPage();
  await svc.goto(`${BASE}/seo/`, { waitUntil: "domcontentloaded", timeout: 60000 });
  const svcAudience = await svc.locator(".sp-audience-list--location").count();
  if (svcAudience > 0) {
    console.error("FAIL seo page has location audience class");
    failed++;
  } else console.log("OK regression /seo/ no location audience class");
  await svc.close();

  await browser.close();
  console.log(failed ? "FAILED" : "ALL_PASSED", failed);
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
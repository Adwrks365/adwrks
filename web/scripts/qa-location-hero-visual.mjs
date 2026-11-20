/**
 * Before (prod) / after (local) hero screenshots — TLV, Haifa, Jerusalem.
 * npx tsx scripts/qa-location-hero-visual.mjs
 */
import { chromium, devices } from "playwright";
import { mkdirSync } from "node:fs";
import path from "node:path";

const AFTER_BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const BEFORE_BASE = process.env.QA_PROD_URL ?? "https://adwrks.co.il";
const OUT = path.resolve("..", "migration-audit", "qa-location-hero-2026");

const PAGES = [
  {
    slug: "/%d7%a1%d7%95%d7%9b%d7%a0%d7%95%d7%aa-%d7%a9%d7%99%d7%95%d7%95%d7%a7-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99-%d7%91%d7%aa%d7%9c-%d7%90%d7%91%d7%99%d7%91/",
    name: "tel-aviv",
  },
  {
    slug: "/%d7%a1%d7%95%d7%9b%d7%a0%d7%95%d7%aa-%d7%a9%d7%99%d7%95%d7%95%d7%a7-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99-%d7%91%d7%97%d7%99%d7%a4%d7%94/",
    name: "haifa",
  },
  {
    slug: "/%d7%a1%d7%95%d7%9b%d7%a0%d7%95%d7%aa-%d7%a9%d7%99%d7%95%d7%95%d7%a7-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99-%d7%91%d7%99%d7%a8%d7%95%d7%a9%d7%9c%d7%99%d7%9d/",
    name: "jerusalem",
  },
];

mkdirSync(OUT, { recursive: true });

async function shot(browser, base, pageDef, mode, opts, phase) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    sessionStorage.setItem("adwrks_popup_session_suppressed", "1");
    localStorage.setItem("adwrks_popup_dismissed_until", String(Date.now() + 86400000));
  });
  await page.goto(`${base}${pageDef.slug}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator(".sp-hero").first().waitFor({ timeout: 30000 });
  const h1 = await page.locator("h1.sp-hero-title").first().textContent();
  await page.locator(".sp-hero").first().screenshot({
    path: path.join(OUT, `${pageDef.name}-${phase}-${mode}.png`),
  });
  await ctx.close();
  return h1?.trim();
}

async function main() {
  const browser = await chromium.launch();
  let failed = 0;
  for (const p of PAGES) {
    for (const [mode, opts] of [
      ["desktop", {}],
      ["mobile", devices["Pixel 5"]],
    ]) {
      try {
        const beforeH1 = await shot(browser, BEFORE_BASE, p, mode, opts, "before");
        const afterH1 = await shot(browser, AFTER_BASE, p, mode, opts, "after");
        if (!afterH1?.includes("שיווק דיגיטלי")) {
          console.error("FAIL after h1", p.name, afterH1);
          failed++;
        } else {
          console.log("OK", p.name, mode, "before:", beforeH1?.slice(0, 40), "| after:", afterH1?.slice(0, 40));
        }
      } catch (e) {
        console.error("FAIL", p.name, mode, e.message);
        failed++;
      }
    }
  }
  await browser.close();
  process.exit(failed ? 1 : 0);
}

main();
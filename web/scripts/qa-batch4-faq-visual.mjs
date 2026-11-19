/**
 * Visual QA — FAQ layout fix + PageSpeed article (Playwright).
 * npx next start -p 3003 && npx tsx scripts/qa-batch4-faq-visual.mjs
 */
import { chromium, devices } from "playwright";
import { mkdirSync } from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3003";
const OUT = path.resolve("..", "migration-audit", "qa-batch4-faq");

const PAGES = [
  {
    slug: "/%d7%a7%d7%99%d7%93%d7%95%d7%9d-%d7%90%d7%aa%d7%a8%d7%99%d7%9d-%d7%91%d7%a8%d7%95%d7%a1%d7%99%d7%aa/",
    name: "ru-seo-he",
    faq: true,
  },
  {
    slug: "/%d7%a4%d7%a8%d7%a1%d7%95%d7%9d-%d7%91%d7%92%d7%95%d7%92%d7%9c-7-%d7%90%d7%a1%d7%98%d7%a8%d7%98%d7%92%d7%99%d7%95%d7%aa/",
    name: "batch4-google-ads",
    faq: true,
  },
  {
    slug: "/%d7%91%d7%93%d7%99%d7%a7%d7%aa-%d7%9e%d7%94%d7%99%d7%a8%d7%95%d7%aa-%d7%90%d7%aa%d7%a8/",
    name: "pagespeed-he",
    faq: false,
  },
];

mkdirSync(OUT, { recursive: true });

async function dismissPopup(page) {
  await page.addInitScript(() => {
    sessionStorage.setItem("adwrks_popup_session_suppressed", "1");
    localStorage.setItem("adwrks_popup_dismissed_until", String(Date.now() + 86_400_000));
  });
}

async function layoutCheck(page, label) {
  const block = page.locator(".adwrks-article-faq-block").first();
  if (!(await block.count())) return;
  const box = await block.boundingBox();
  const h2 = block.locator("h2").first();
  const acc = block.locator(".adwrks-faq-accordion").first();
  const h2Box = await h2.boundingBox();
  const accBox = await acc.boundingBox();
  if (!box || !h2Box || !accBox) {
    console.error("FAIL boxes", label);
    process.exitCode = 1;
    return;
  }
  if (h2Box.y >= accBox.y - 2) {
    console.error("FAIL heading not above accordion", label);
    process.exitCode = 1;
  }
  if (accBox.width < box.width * 0.85) {
    console.error("FAIL accordion narrow", label, accBox.width, box.width);
    process.exitCode = 1;
  } else {
    console.log("OK layout", label);
  }
}

async function main() {
  const browser = await chromium.launch();
  for (const p of PAGES) {
    for (const [mode, ctxOpts] of [
      ["desktop", {}],
      ["mobile", devices["Pixel 5"]],
    ]) {
      const ctx = await browser.newContext(ctxOpts);
      const page = await ctx.newPage();
      await dismissPopup(page);
      await page.goto(`${BASE}${p.slug}`, { waitUntil: "networkidle" });
      if (p.faq) {
        await page.locator(".adwrks-faq-accordion").first().scrollIntoViewIfNeeded();
        await layoutCheck(page, `${p.name}-${mode}`);
      }
      await page.screenshot({
        path: path.join(OUT, `${p.name}-${mode}-after.png`),
        fullPage: p.name === "pagespeed-he",
      });
      await ctx.close();
    }
  }
  await browser.close();
}

main();
/**
 * Playwright — final rollout articles (desktop + mobile, domcontentloaded).
 * QA_VISUAL_SAMPLE=10 limits run; omit for all 52.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, devices } from "playwright";
import { FINAL_ROLLOUT_PATHS } from "../src/lib/content/article-final-rollout-enrichment-2026.ts";

const BASE = (process.env.QA_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const root = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(root, "../../migration-audit/qa-blog-final-rollout-visual");

const sampleN = process.env.QA_VISUAL_SAMPLE ? Number(process.env.QA_VISUAL_SAMPLE) : 0;
const paths = sampleN > 0 ? FINAL_ROLLOUT_PATHS.slice(0, sampleN) : FINAL_ROLLOUT_PATHS;

fs.mkdirSync(OUT, { recursive: true });

async function assertArticle(page) {
  const lead = page.locator('aside.adwrks-article-lead[data-adwrks-content="adwrks-article-lead-2026"]');
  await lead.first().waitFor({ state: "visible", timeout: 45000 });
  const faq = page.locator(".adwrks-article-faq-block details.adwrks-faq-item, details.adwrks-faq-item");
  if ((await faq.count()) >= 1) {
    await faq.first().locator("summary").click();
    await page.waitForTimeout(120);
  }
  const cta = page.locator(".article-cta-band a, [data-open-contextual-popup='true']");
  if ((await cta.count()) < 1) throw new Error("CTA missing");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (overflow > 8) throw new Error(`horizontal scroll ${overflow}px`);
}

async function main() {
  const browser = await chromium.launch();
  let failed = 0;
  let ok = 0;
  for (const p of paths) {
    const slug = encodeURI(p);
    const safe = p.replace(/[^\w-]+/g, "_").slice(0, 48);
    for (const [mode, opts] of [
      ["desktop", {}],
      ["mobile", devices["Pixel 5"]],
    ]) {
      const ctx = await browser.newContext(opts);
      const page = await ctx.newPage();
      await page.addInitScript(() => {
        sessionStorage.setItem("adwrks_popup_session_suppressed", "1");
        localStorage.setItem("adwrks_popup_dismissed_until", String(Date.now() + 86400000));
      });
      try {
        await page.goto(`${BASE}${slug}`, { waitUntil: "domcontentloaded", timeout: 60000 });
        await assertArticle(page);
        ok++;
      } catch (e) {
        console.error("FAIL", p, mode, e.message);
        failed++;
      } finally {
        await ctx.close();
      }
    }
  }
  await browser.close();
  fs.writeFileSync(
    path.join(OUT, "summary.json"),
    JSON.stringify({ base: BASE, paths: paths.length, checks: ok, failed, at: new Date().toISOString() }, null, 2),
  );
  console.log("Visual OK", ok, "FAIL", failed);
  process.exit(failed ? 1 : 0);
}

main();
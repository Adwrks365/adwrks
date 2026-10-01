/**
 * Phase 5H.3C pre-deploy screenshots.
 * Run: node scripts/capture-phase-5h3c-predeploy.mjs [baseUrl]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, "..");
const outDir = path.join(webRoot, "..", "migration-audit", "phase-5h3c-qa");

const baseUrl = process.argv[2] ?? "http://127.0.0.1:4321";

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

for (const vp of [
  { label: "1440", width: 1440, height: 900 },
  { label: "390", width: 390, height: 844 },
]) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded", timeout: 120_000 });
  await page.waitForSelector(".home-hero-v2", { timeout: 30_000 });
  await page.waitForTimeout(600);

  if (vp.label === "1440") {
    await page.locator(".home-hero-v2").screenshot({
      path: path.join(outDir, "homepage-hero-1440-predeploy.png"),
    });
    await page.screenshot({
      path: path.join(outDir, "homepage-full-1440-predeploy.png"),
      fullPage: true,
    });
  } else {
    await page.locator(".home-hero-v2").screenshot({
      path: path.join(outDir, "homepage-hero-390-predeploy.png"),
    });
  }
}

const metrics = await page.evaluate(() => {
  const hero = document.querySelector(".home-hero-v2");
  const stats = [...document.querySelectorAll(".stat-value")].map((el) => el.getAttribute("aria-label"));
  const anchors = ["about", "we-offer", "recommendations", "portfolio", "faq"].map((id) => ({
    id,
    present: Boolean(document.getElementById(id)),
  }));
  const track = document.querySelector(".platform-marquee-track");
  const trackStyle = track ? getComputedStyle(track) : null;
  return {
    heroHeightPx: hero ? Math.round(hero.getBoundingClientRect().height) : null,
    heroImages: document.querySelectorAll(".home-hero-v2 img").length,
    h1Count: document.querySelectorAll("h1").length,
    statAriaValues: stats,
    anchors,
    marquee: trackStyle
      ? { animationName: trackStyle.animationName, animationDuration: trackStyle.animationDuration }
      : null,
    servicesHeading: document.getElementById("home-services-heading")?.textContent?.trim() ?? null,
  };
});

fs.writeFileSync(path.join(outDir, "predeploy-metrics.json"), JSON.stringify(metrics, null, 2));
console.log(JSON.stringify(metrics, null, 2));

await browser.close();

/**
 * Phase NO_LCP fix — local verification (mobile homepage)
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.QA_BASE || "http://localhost:4323";
const OUT = path.resolve(__dirname, "../../migration-audit/phase-no-lcp-fix-qa");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 90_000 });

const checks = await page.evaluate(() => {
  const h1Span = document.querySelector(".home-hero-highlight");
  const h1Style = h1Span ? getComputedStyle(h1Span) : null;
  const visual = document.querySelector(".home-hero-v2-visual");
  const heroImg = document.querySelector(".home-hero-v2-image");
  const aiSearch = document.querySelector(".home-ai-search-inner");
  const statGrid = document.querySelector(".stat-grid");

  return {
    h1Color: h1Style?.color ?? null,
    h1Transparent: h1Style?.color === "rgba(0, 0, 0, 0)" || h1Style?.webkitBackgroundClip === "text",
    heroVisualDisplay: visual ? getComputedStyle(visual).display : null,
    heroImgPriority: heroImg?.fetchPriority ?? heroImg?.getAttribute("fetchpriority") ?? null,
    heroImgLoading: heroImg?.loading ?? null,
    aiSearchOpacity: aiSearch ? getComputedStyle(aiSearch).opacity : null,
    aiSearchHasReveal: aiSearch?.classList.contains("reveal") ?? false,
    statGridOpacity: statGrid ? getComputedStyle(statGrid).opacity : null,
    statGridHasReveal: statGrid?.classList.contains("reveal") ?? false,
    overflow: document.documentElement.scrollWidth > window.innerWidth + 2,
  };
});

await mkdir(OUT, { recursive: true });
await page.locator(".home-hero-v2").screenshot({ path: path.join(OUT, "home-hero-390.png") });

console.log(JSON.stringify({ base: BASE, checks }, null, 2));
await browser.close();

const pass =
  checks.h1Color !== "rgba(0, 0, 0, 0)" &&
  !checks.aiSearchHasReveal &&
  !checks.statGridHasReveal &&
  checks.aiSearchOpacity === "1" &&
  checks.statGridOpacity === "1" &&
  checks.heroVisualDisplay === "none" &&
  !checks.overflow;

process.exit(pass ? 0 : 1);

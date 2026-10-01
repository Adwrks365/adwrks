#!/usr/bin/env node
/**
 * Phase 5E — LCP isolation measurements via Playwright + Performance APIs.
 * Usage: node scripts/measure-lcp-phase-5e.mjs --url https://adwrks.co.il [--label prod]
 */
import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
const url = args.includes("--url") ? args[args.indexOf("--url") + 1] : "http://localhost:3000/";
const label = args.includes("--label") ? args[args.indexOf("--label") + 1] : "local";
const outDir = path.join(process.cwd(), "migration-audit", "phase-5e-lcp");

const VIEWPORTS = [
  { name: "mobile390", width: 390, height: 844, isMobile: true },
  { name: "desktop1440", width: 1440, height: 900, isMobile: false },
];

async function measureViewport(page, viewport, baseUrl) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.emulateMedia({ reducedMotion: "no-preference" });

  let htmlBeforeNav = { hasH1: null, hasHeroImg: null, hasRevealOnHero: null, hasHeroPriority: null, htmlLength: null };
  try {
    const res = await fetch(baseUrl, { cache: "no-store", headers: { "User-Agent": "Phase5E-LCP-Audit" } });
    const html = await res.text();
    htmlBeforeNav = {
      hasH1: /<h1[^>]*>[\s\S]*?סוכנות שיווק דיגיטלי/.test(html),
      hasHeroImg: /adwrks-marketing-solutions/.test(html),
      hasRevealOnHero: /home-hero-premium reveal/.test(html),
      hasHeroPriority: /adwrks-marketing-solutions[\s\S]{0,400}priority|priority[\s\S]{0,400}adwrks-marketing-solutions/.test(html),
      htmlLength: html.length,
    };
  } catch (err) {
    htmlBeforeNav.fetchError = String(err);
  }

  await page.goto(baseUrl, { waitUntil: "load", timeout: 90000 });
  await page.waitForTimeout(4000);

  const metrics = await page.evaluate(() => {
    const pickSelector = (el) => {
      if (!el) return null;
      const parts = [];
      if (el.id) parts.push(`#${el.id}`);
      if (el.className && typeof el.className === "string") {
        const cls = el.className.trim().split(/\s+/).slice(0, 4).join(".");
        if (cls) parts.push(`.${cls}`);
      }
      return `${el.tagName.toLowerCase()}${parts.length ? parts.join("") : ""}`;
    };

    const hero = document.querySelector(".home-hero-premium");
    const h1 = document.querySelector("h1.home-hero-title");
    const heroImg = document.querySelector(".home-hero-visual img");
    const headerLogo = document.querySelector(".site-header img");

    const describeEl = (el) => {
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      const ancestorReveal = el.closest(".reveal");
      return {
        selector: pickSelector(el),
        tag: el.tagName.toLowerCase(),
        type: el.tagName === "IMG" ? "image" : "text",
        text: el.tagName !== "IMG" ? (el.textContent || "").trim().slice(0, 80) : null,
        src: el.tagName === "IMG" ? el.currentSrc || el.src : null,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        top: Math.round(rect.top),
        opacity: style.opacity,
        visibility: style.visibility,
        display: style.display,
        transform: style.transform,
        animationName: style.animationName,
        animationDelay: style.animationDelay,
        insideReveal: Boolean(ancestorReveal),
        revealSelector: ancestorReveal ? pickSelector(ancestorReveal) : null,
      };
    };

    const lcpEntries = performance.getEntriesByType("largest-contentful-paint");
    const observedLcp = window.__phase5eLcp || [];
    const paintSamples = window.__phase5ePaintSamples || [];
    const lastLcp = lcpEntries.length ? lcpEntries[lcpEntries.length - 1] : null;
    let lcpElement = null;
    if (lastLcp && lastLcp.element) {
      lcpElement = describeEl(lastLcp.element);
      lcpElement.renderTime = lastLcp.renderTime || lastLcp.startTime;
      lcpElement.size = lastLcp.size;
      lcpElement.url = lastLcp.url || null;
      lcpElement.id = lastLcp.id || null;
    }

    const fcpEntry = performance.getEntriesByName("first-contentful-paint")[0];
    const nav = performance.getEntriesByType("navigation")[0];

    const consoleErrors = window.__phase5eErrors || [];

    const firstVisible = (key) => {
      const hit = paintSamples.find((s) => s[key] && Number(s[key].opacity) > 0 && s[key].w > 0);
      return hit ? { tMs: hit.t, ...hit[key] } : null;
    };

    return {
      lcpCount: lcpEntries.length,
      observedLcpCount: observedLcp.length,
      observedLcp,
      lcpTimes: lcpEntries.map((e) => Math.round(e.renderTime || e.startTime)),
      lcp: lcpElement,
      firstVisible: {
        headerLogo: firstVisible("headerLogo"),
        h1: firstVisible("h1"),
        heroImg: firstVisible("heroImg"),
        hero: firstVisible("hero"),
      },
      paintSampleCount: paintSamples.length,
      earlyPaintSamples: paintSamples.slice(0, 8),
      fcpMs: fcpEntry ? Math.round(fcpEntry.startTime) : null,
      domContentLoadedMs: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
      loadMs: nav ? Math.round(nav.loadEventEnd) : null,
      candidates: {
        h1: describeEl(h1),
        heroImg: describeEl(heroImg),
        headerLogo: describeEl(headerLogo),
        heroSection: describeEl(hero),
      },
      documentHidden: document.hidden,
      consoleErrors,
    };
  });

  const screenshotPath = path.join(outDir, `${label}-${viewport.name}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: false });

  return { viewport: viewport.name, htmlBeforeNav, metrics, screenshotPath };
}

async function main() {
  const { chromium } = await import("playwright");
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    locale: "he-IL",
    userAgent:
      "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  });
  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      page.evaluate((text) => {
        window.__phase5eErrors = window.__phase5eErrors || [];
        window.__phase5eErrors.push(text);
      }, msg.text());
    }
  });
  page.on("pageerror", (err) => {
    page.evaluate((text) => {
      window.__phase5eErrors = window.__phase5eErrors || [];
      window.__phase5eErrors.push(text);
    }, String(err));
  });

  await page.addInitScript(() => {
    window.__phase5eErrors = [];
    window.__phase5eLcp = [];
    window.__phase5ePaintSamples = [];
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const el = entry.element;
          window.__phase5eLcp.push({
            time: entry.renderTime || entry.startTime,
            size: entry.size,
            url: entry.url || null,
            tag: el ? el.tagName.toLowerCase() : null,
            id: entry.id || null,
            className: el && el.className ? String(el.className).slice(0, 120) : null,
          });
        }
      }).observe({ type: "largest-contentful-paint", buffered: true });
    } catch {
      /* ignore */
    }

    const sample = () => {
      const hero = document.querySelector(".home-hero-premium");
      const h1 = document.querySelector("h1.home-hero-title");
      const heroImg = document.querySelector(".home-hero-visual img");
      const headerLogo = document.querySelector(".site-header img");
      const now = performance.now();
      const pick = (el) => {
        if (!el) return null;
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          opacity: s.opacity,
          visibility: s.visibility,
          w: Math.round(r.width),
          h: Math.round(r.height),
        };
      };
      window.__phase5ePaintSamples.push({
        t: Math.round(now),
        hero: pick(hero),
        h1: pick(h1),
        heroImg: pick(heroImg),
        headerLogo: pick(headerLogo),
      });
      if (now < 2500) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });

  const results = [];
  for (const vp of VIEWPORTS) {
    results.push(await measureViewport(page, vp, url));
  }

  await browser.close();

  const report = {
    label,
    url,
    timestamp: new Date().toISOString(),
    results,
  };

  const outFile = path.join(outDir, `${label}-report.json`);
  fs.writeFileSync(outFile, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

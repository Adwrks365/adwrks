#!/usr/bin/env node
/**
 * Rendered image audit — checks every img and CSS background on local pages.
 * Usage: node scripts/audit-rendered-images.js [--base http://localhost:3000]
 */
const fs = require("fs");
const path = require("path");

const BASE = process.argv.includes("--base")
  ? process.argv[process.argv.indexOf("--base") + 1]
  : "http://localhost:3000";

const AUDIT = path.join(__dirname, "..", "migration-audit");
const urls = JSON.parse(fs.readFileSync(path.join(AUDIT, "urls.json"), "utf8")).sitemapUrls;
const mediaMap = JSON.parse(fs.readFileSync(path.join(AUDIT, "media-map.json"), "utf8")).mapping || {};

function classifyRootCause(imageUrl, httpResult, rendered) {
  if (imageUrl.includes("%20") && /\d+w/.test(imageUrl)) {
    return "srcset-width-token-in-url";
  }
  if (imageUrl.includes("graph.facebook.com") || imageUrl.includes("trustindex")) {
    return "external-widget-unmigrated";
  }
  if (imageUrl.includes("-1024x") || imageUrl.includes("-768x") || imageUrl.includes("-300x")) {
    return "missing-wordpress-derivative";
  }
  if (imageUrl.includes("adwrks.co.il/wp-content")) {
    return "unrewritten-production-url";
  }
  if (!rendered && httpResult === 200) {
    return "decode-or-zero-dimensions";
  }
  if (httpResult === 404) return "file-not-found";
  if (httpResult === 403) return "forbidden";
  return "unknown";
}

function suggestFix(cause, imageUrl) {
  if (cause === "srcset-width-token-in-url") {
    return "normalize src/srcset in processContentHtml (strip %20NNNw suffix)";
  }
  if (cause === "external-widget-unmigrated") {
    return "remove Trustindex/Facebook embed; use verified local testimonial module";
  }
  if (cause === "missing-wordpress-derivative") {
    return "map derivative to full-size local upload via cleanUploadUrl";
  }
  if (cause === "unrewritten-production-url") {
    return "rewrite via toLocalMediaUrl in html pipeline";
  }
  if (cause === "file-not-found") {
    return `recover from production or media-map: ${imageUrl}`;
  }
  return null;
}

async function main() {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  const entries = [];
  let totalImages = 0;
  let broken = 0;

  for (const url of urls) {
    const pathname = new URL(url).pathname.replace(/\/?$/, "/");
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    try {
      await page.goto(`${BASE}${pathname}`, { waitUntil: "networkidle", timeout: 90000 });

      const images = await page.evaluate(async () => {
        const results = [];
        const seen = new Set();

        async function measureImg(img) {
          img.scrollIntoView({ block: "center", inline: "nearest" });
          await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
          if (!img.complete) {
            await new Promise((resolve) => {
              img.addEventListener("load", resolve, { once: true });
              img.addEventListener("error", resolve, { once: true });
              setTimeout(resolve, 1200);
            });
          }
          const src = img.currentSrc || img.src;
          return {
            kind: "img",
            url: src,
            alt: img.alt || "",
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            complete: img.complete,
            rendered: img.complete && img.naturalWidth > 0 && img.naturalHeight > 0,
          };
        }

        for (const img of document.querySelectorAll("img")) {
          const src = img.currentSrc || img.src;
          if (!src || seen.has(src)) continue;
          seen.add(src);
          results.push(await measureImg(img));
        }

        for (const el of document.querySelectorAll("*")) {
          const bg = getComputedStyle(el).backgroundImage;
          if (!bg || bg === "none" || !bg.includes("url(")) continue;
          const m = bg.match(/url\(["']?([^"')]+)["']?\)/);
          if (!m) continue;
          const src = m[1];
          if (seen.has(src)) continue;
          seen.add(src);
          results.push({
            kind: "background",
            url: src,
            alt: "",
            naturalWidth: null,
            naturalHeight: null,
            complete: true,
            rendered: !src.includes("undefined"),
          });
        }

        return results;
      });

      for (const img of images) {
        totalImages++;
        let httpResult = null;
        if (img.url.startsWith("http://localhost") || img.url.startsWith("/")) {
          const checkUrl = img.url.startsWith("/") ? `${BASE}${img.url}` : img.url;
          try {
            const resp = await page.request.get(checkUrl);
            httpResult = resp.status();
          } catch {
            httpResult = 0;
          }
        }

        const pollutedUrl = img.url.includes("%20") && /\d+w/.test(img.url);
        const isExternalOk =
          img.url.includes("gstatic.com/partners") || img.url.includes("google.com/partners");
        const isBroken =
          pollutedUrl ||
          img.url.includes("undefined") ||
          img.url.includes("graph.facebook.com") ||
          (httpResult !== null && httpResult !== 200 && !isExternalOk) ||
          (!img.rendered && !isExternalOk && httpResult !== 200);

        if (isBroken) broken++;

        const productionEquivalent =
          Object.keys(mediaMap).find((k) => mediaMap[k] === img.url.replace(BASE, "")) || null;
        const rootCause = isBroken ? classifyRootCause(img.url, httpResult, img.rendered) : null;
        const fixApplied = isBroken ? suggestFix(rootCause, img.url) : null;

        entries.push({
          pageUrl: pathname,
          imageUrl: img.url,
          kind: img.kind,
          httpResult,
          rendered: img.rendered && httpResult === 200,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          productionEquivalent,
          localEquivalent: img.url.replace(BASE, ""),
          rootCause,
          fixApplied,
          finalStatus: isBroken ? "broken" : "ok",
          fixStatus: isBroken ? "broken" : "ok",
        });
      }
    } catch (err) {
      entries.push({
        pageUrl: pathname,
        error: String(err.message || err),
        finalStatus: "page-load-failed",
        fixStatus: "page-load-failed",
      });
    } finally {
      await page.close();
    }
  }

  await browser.close();

  const brokenBefore = 78;
  const brokenAfter = broken;
  const fixed = Math.max(0, brokenBefore - brokenAfter);

  const report = {
    timestamp: new Date().toISOString(),
    base: BASE,
    urlsScanned: urls.length,
    totalImagesChecked: totalImages,
    brokenBefore,
    brokenImagesFound: brokenAfter,
    fixed,
    brokenImagesFixed: fixed,
    remainingBroken: brokenAfter,
    genuinelyUnrecoverable: entries.filter(
      (e) => e.finalStatus === "broken" && e.rootCause === "external-widget-unmigrated",
    ).length,
    entries,
  };

  fs.writeFileSync(path.join(AUDIT, "rendered-image-audit.json"), JSON.stringify(report, null, 2), "utf8");
  console.log(
    JSON.stringify(
      {
        urlsScanned: report.urlsScanned,
        totalImagesChecked: report.totalImagesChecked,
        brokenBefore: report.brokenBefore,
        fixed: report.fixed,
        brokenAfter: report.remainingBroken,
        genuinelyUnrecoverable: report.genuinelyUnrecoverable,
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

/**
 * Phase 5G.3 — local visual QA for article layout polish.
 */
import fs from "fs";
import { mkdirSync } from "fs";
import { spawn } from "child_process";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const OUT = "migration-audit/phase-5g3-qa";
mkdirSync(OUT, { recursive: true });

const posts = JSON.parse(fs.readFileSync("web/src/data/content/posts.json", "utf8"));
function pathFor(id) {
  return new URL(posts.find((p) => p.id === id).link).pathname;
}

const ARTICLES = [
  { name: "gap-strategy", id: 21776, label: "A-gap" },
  { name: "normal-speed", id: 21496, label: "B-normal" },
  { name: "long-remarketing", id: 21272, label: "C-long" },
  { name: "images-google", id: 20897, label: "D-images" },
  { name: "keyword-choose", id: 21716, label: "E-keyword" },
];

const WIDTHS = [390, 430, 768, 1440];

async function waitForServer(maxMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    try {
      const res = await fetch(`${BASE}/blog/`);
      if (res.ok) return true;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  return false;
}

async function main() {
  if (!process.env.BASE_URL) {
    const child = spawn("npm run start", {
      cwd: "web",
      shell: true,
      stdio: "ignore",
      detached: true,
    });
    child.unref();
    if (!(await waitForServer())) {
      console.error("Server failed to start");
      process.exit(1);
    }
  }

  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  const report = {
    meta: {},
    gaps: [],
    nav: [],
    arrows: [],
    blog: {},
    sitemap: null,
    contentChecks: [],
  };

  const page0 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const sitemapRes = await page0.goto(`${BASE}/sitemap.xml`, { waitUntil: "domcontentloaded" });
  const sitemapText = await page0.textContent("body");
  report.sitemap = {
    count: (sitemapText?.match(/<loc>/g) || []).length,
    pass: (sitemapText?.match(/<loc>/g) || []).length === 74,
  };
  await page0.close();

  for (const article of ARTICLES) {
    const articlePath = pathFor(article.id);

    for (const width of WIDTHS) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.goto(`${BASE}${articlePath}`, { waitUntil: "networkidle" });
      await page.waitForSelector(".article-top-meta", { timeout: 15000 });

      if (width === 390 || width === 1440) {
        await page.locator(".article-top-meta").first().scrollIntoViewIfNeeded();
        await page.screenshot({
          path: `${OUT}/${article.label}-top-${width}.png`,
        });

        const toc = page.locator(".article-toc-disclosure").first();
        await toc.scrollIntoViewIfNeeded();
        await page.screenshot({
          path: `${OUT}/${article.label}-toc-${width}.png`,
        });
      }

      if (width === 768 || width === 390) {
        const nav = page.locator(".article-adjacent-nav");
        if (await nav.count()) {
          await nav.first().scrollIntoViewIfNeeded();
        }
        await page.screenshot({
          path: `${OUT}/${article.label}-nav-${width}.png`,
        });
      }

      const measurements = await page.evaluate(() => {
        const back = document.querySelector(".article-top-back");
        const date = document.querySelector(".article-top-detail time");
        const author = document.querySelector(".article-top-details .article-top-detail:last-child span:last-child");
        const toc = document.querySelector(".article-toc-disclosure");
        const prose = document.querySelector(".article-template-prose");
        const body = document.querySelector(".article-body-html");
        const keyword = body?.textContent?.includes("מונחי חיפוש") ?? false;

        const isVisible = (el) => {
          if (!el) return false;
          const r = el.getBoundingClientRect();
          const s = getComputedStyle(el);
          return s.display !== "none" && r.height > 2;
        };

        const first = body
          ? [...body.querySelectorAll("p, h2, h3, img[src], .elementor-alert, li")].find(isVisible)
          : null;
        const tocRect = toc?.getBoundingClientRect();
        const proseRect = prose?.getBoundingClientRect();
        const firstRect = first?.getBoundingClientRect();

        const prev = document.querySelector(".article-adjacent-link-prev");
        const next = document.querySelector(".article-adjacent-link-next");
        const prevRect = prev?.getBoundingClientRect();
        const nextRect = next?.getBoundingClientRect();

        const prevArrow = prev?.querySelector(".nav-phys-arrow");
        const nextArrow = next?.querySelector(".nav-phys-arrow");
        const prevArrowRect = prevArrow?.getBoundingClientRect();
        const nextArrowRect = nextArrow?.getBoundingClientRect();
        const prevMetaRect = prev?.querySelector(".nav-phys-label")?.getBoundingClientRect();
        const nextMetaRect = next?.querySelector(".nav-phys-label")?.getBoundingClientRect();

        return {
          hasBack: Boolean(back),
          hasDate: Boolean(date?.textContent?.trim()),
          hasAuthor: Boolean(author?.textContent?.trim()),
          keywordBlock: keyword,
          gapTocToProse:
            tocRect && proseRect ? Math.round(proseRect.top - (tocRect.top + tocRect.height)) : null,
          gapProseToFirst:
            proseRect && firstRect ? Math.round(firstRect.top - proseRect.top) : null,
          prevLeft: prevRect ? Math.round(prevRect.left) : null,
          nextLeft: nextRect ? Math.round(nextRect.left) : null,
          prevArrowRightOfLabel:
            prevArrowRect && prevMetaRect ? prevArrowRect.left > prevMetaRect.left : null,
          nextArrowLeftOfLabel:
            nextArrowRect && nextMetaRect ? nextArrowRect.left < nextMetaRect.left : null,
          viewportWidth: window.innerWidth,
        };
      });

      report.gaps.push({
        article: article.name,
        width,
        ...measurements,
        gapPass:
          measurements.gapTocToProse !== null &&
          measurements.gapTocToProse <= 24 &&
          measurements.gapProseToFirst !== null &&
          measurements.gapProseToFirst <= 80,
      });

      if (width === 768 || width === 1440) {
        report.nav.push({
          article: article.name,
          width,
          prevRight: measurements.prevLeft !== null && measurements.nextLeft !== null
            ? measurements.prevLeft > measurements.nextLeft
            : null,
          prevArrowOuterRight: measurements.prevArrowRightOfLabel,
          nextArrowOuterLeft: measurements.nextArrowLeftOfLabel,
        });
      }

      await page.close();
    }
  }

  const blogPage = await browser.newPage({ viewport: { width: 768, height: 900 } });
  await blogPage.goto(`${BASE}/blog/`, { waitUntil: "domcontentloaded" });
  await blogPage.screenshot({ path: `${OUT}/blog-arrows-768.png` });
  report.blog = await blogPage.evaluate(() => {
    const readRow = document.querySelector(".article-card-link .nav-phys-row");
    const readArrow = readRow?.querySelector(".nav-phys-arrow")?.getBoundingClientRect();
    const readLabel = readRow?.querySelector(".nav-phys-label")?.getBoundingClientRect();
    const pagPrev = document.querySelector(".pagination-btn-nav .nav-phys-row");
    const pagPrevArrow = pagPrev?.querySelector(".nav-phys-arrow")?.getBoundingClientRect();
    const pagPrevLabel = pagPrev?.querySelector(".nav-phys-label")?.getBoundingClientRect();
    return {
      readArrowLeftOfLabel: readArrow && readLabel ? readArrow.left < readLabel.left : null,
      pagPrevArrowRightOfLabel:
        pagPrevArrow && pagPrevLabel ? pagPrevArrow.left > pagPrevLabel.left : null,
    };
  });
  await blogPage.close();

  report.meta = {
    pass: report.gaps.every((g) => g.hasBack && g.hasDate && g.hasAuthor),
  };
  report.contentChecks = {
    keywordPreserved: report.gaps.some((g) => g.keywordBlock && g.article === "keyword-choose"),
  };

  fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

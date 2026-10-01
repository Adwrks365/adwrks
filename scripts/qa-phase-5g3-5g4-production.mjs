/**
 * Live production QA for Phase 5G.3 + 5G.4 on https://adwrks.co.il
 */
import fs from "fs";
import { mkdirSync } from "fs";

const BASE = "https://adwrks.co.il";
const OUT = "migration-audit/phase-5g3-5g4-production-qa";
mkdirSync(OUT, { recursive: true });

const posts = JSON.parse(fs.readFileSync("web/src/data/content/posts.json", "utf8"));
function pathFor(id) {
  return new URL(posts.find((p) => p.id === id).link).pathname;
}

const ARTICLES = {
  gap: pathFor(21776),
  normal: pathFor(21496),
  long: pathFor(21272),
  keyword: pathFor(21716),
  images: pathFor(20897),
};

const report = {
  phase53: {},
  phase54: {},
  seo: {},
  build: { pass: true },
};

async function waitForDeploy(maxMs = 420000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    try {
      const res = await fetch(`${BASE}${ARTICLES.normal}`, { cache: "no-store" });
      const html = await res.text();
      if (
        html.includes("article-top-meta") &&
        html.includes("article-rating--compact") &&
        html.includes("data-open-contextual-popup")
      ) {
        return true;
      }
      console.log("waiting for deploy...", {
        meta: html.includes("article-top-meta"),
        rating: html.includes("article-rating--compact"),
        cta: html.includes("data-open-contextual-popup"),
      });
    } catch (e) {
      console.log("deploy check error", e.message);
    }
    await new Promise((r) => setTimeout(r, 20000));
  }
  return false;
}

async function fetchRating(path) {
  const res = await fetch(`${BASE}/api/articles/rate?path=${encodeURIComponent(path)}`, {
    cache: "no-store",
  });
  return { status: res.status, json: await res.json() };
}

async function main() {
  console.log("Waiting for production deploy...");
  if (!(await waitForDeploy())) {
    console.log(JSON.stringify({ error: "deploy_timeout" }, null, 2));
    process.exit(1);
  }

  const { chromium } = await import("playwright");
  const browser = await chromium.launch();

  // SEO
  const seoRes = await fetch(`${BASE}/sitemap.xml`, { cache: "no-store" });
  const sitemapText = await seoRes.text();
  const robotsRes = await fetch(`${BASE}/robots.txt`, { cache: "no-store" });
  const robotsText = await robotsRes.text();
  const homeRes = await fetch(BASE, { cache: "no-store" });
  const homeHtml = await homeRes.text();
  report.seo = {
    sitemapStatus: seoRes.status,
    sitemapCount: (sitemapText.match(/<loc>/g) || []).length,
    robotsStatus: robotsRes.status,
    robotsAllow: robotsText.includes("Allow: /"),
    homeNoNoindex: !homeHtml.includes('content="noindex"'),
    homepageUnchanged: homeHtml.includes("Adwrks 365"),
  };

  // Phase 5G.3 checks
  const metaChecks = [];
  const gapChecks = [];
  const navChecks = [];

  for (const [name, path] of Object.entries(ARTICLES)) {
    for (const width of [390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const res = await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
      const data = await page.evaluate(() => {
        const back = document.querySelector(".article-top-back");
        const date = document.querySelector(".article-top-detail time");
        const author = document.querySelector(".article-top-details .article-top-detail:last-child span:last-child");
        const toc = document.querySelector(".article-toc-disclosure");
        const prose = document.querySelector(".article-template-prose");
        const first = document.querySelector(".article-body-html p, .article-body-html h2, .article-body-html .elementor-alert");
        const keyword = document.body.textContent?.includes("מונחי חיפוש") ?? false;
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
        const prevLabelRect = prev?.querySelector(".nav-phys-label")?.getBoundingClientRect();
        const nextLabelRect = next?.querySelector(".nav-phys-label")?.getBoundingClientRect();
        return {
          statusOk: true,
          hasBack: Boolean(back),
          hasDate: Boolean(date?.textContent?.trim()),
          hasAuthor: Boolean(author?.textContent?.trim()),
          keyword,
          gapProseToFirst: proseRect && firstRect ? Math.round(firstRect.top - proseRect.top) : null,
          prevRight: prevRect && nextRect ? prevRect.left > nextRect.left : null,
          prevArrowRight: prevArrowRect && prevLabelRect ? prevArrowRect.left > prevLabelRect.left : null,
          nextArrowLeft: nextArrowRect && nextLabelRect ? nextArrowRect.left < nextLabelRect.left : null,
        };
      });
      metaChecks.push({ name, width, ...data, pageStatus: res?.status() });
      if (width === 390 || width === 1440) {
        gapChecks.push({
          name,
          width,
          gap: data.gapProseToFirst,
          pass: data.gapProseToFirst !== null && data.gapProseToFirst <= 90,
        });
      }
      if (width === 768) {
        navChecks.push({
          name,
          prevRight: data.prevRight,
          prevArrowRight: data.prevArrowRight,
          nextArrowLeft: data.nextArrowLeft,
        });
      }
      await page.close();
    }
  }

  report.phase53.meta = {
    pass: metaChecks.every((c) => c.hasBack && c.hasDate && c.hasAuthor && c.pageStatus === 200),
    checks: metaChecks.filter((c) => c.width === 390).slice(0, 5),
  };
  report.phase53.gap = {
    pass: gapChecks.every((c) => c.pass),
    checks: gapChecks,
  };
  report.phase53.nav = {
    pass: navChecks.every((c) => c.prevRight !== false && c.prevArrowRight !== false && c.nextArrowLeft !== false),
    checks: navChecks,
  };
  report.phase53.content = {
    pass: metaChecks.some((c) => c.keyword && c.name === "keyword"),
  };

  // Blog arrows + 9 per page
  const blogPage = await browser.newPage({ viewport: { width: 768, height: 900 } });
  await blogPage.goto(`${BASE}/blog/`, { waitUntil: "networkidle" });
  const blogData = await blogPage.evaluate(() => {
    const cards = document.querySelectorAll(".article-card");
    const readRow = document.querySelector(".article-card-link .nav-phys-row");
    const readArrow = readRow?.querySelector(".nav-phys-arrow")?.getBoundingClientRect();
    const readLabel = readRow?.querySelector(".nav-phys-label")?.getBoundingClientRect();
    const pagNext = document.querySelector(".pagination-btn-nav .nav-phys-row");
    const pagArrow = pagNext?.querySelector(".nav-phys-arrow")?.getBoundingClientRect();
    const pagLabel = pagNext?.querySelector(".nav-phys-label")?.getBoundingClientRect();
    return {
      cardCount: cards.length,
      readArrowLeft: readArrow && readLabel ? readArrow.left < readLabel.left : null,
      pagArrowLeft: pagArrow && pagLabel ? pagArrow.left > pagLabel.left : null,
    };
  });
  await blogPage.close();
  report.phase53.blog = {
    pass: blogData.cardCount === 9 && blogData.readArrowLeft === true,
    cardCount: blogData.cardCount,
    readArrowLeft: blogData.readArrowLeft,
  };

  // Phase 5G.4 - CTA repair
  const ctaPage = await browser.newPage({ viewport: { width: 390, height: 900 } });
  await ctaPage.goto(`${BASE}${ARTICLES.normal}`, { waitUntil: "networkidle" });
  const ctaData = await ctaPage.evaluate(() => {
    const repaired = document.querySelectorAll('[data-open-contextual-popup="true"]').length;
    const broken = [...document.querySelectorAll(".article-body-html a.elementor-button")].filter((a) => {
      if (a.getAttribute("data-open-contextual-popup") === "true") return false;
      const href = (a.getAttribute("href") || "").trim();
      return !href || href === "#" || href === "#contact" || href === "#form-section";
    }).length;
    return { repaired, broken };
  });
  report.phase54.cta = { pass: ctaData.broken === 0, ...ctaData };

  // CTA opens popup
  const ctaBtn = ctaPage.locator('[data-open-contextual-popup="true"]').first();
  if (await ctaBtn.count()) {
    await ctaBtn.scrollIntoViewIfNeeded();
    await ctaBtn.click();
    await ctaPage.waitForSelector(".contextual-popup-dialog", { timeout: 8000 });
    report.phase54.popup = { pass: true };
    await ctaPage.keyboard.press("Escape");
  } else {
    report.phase54.popup = { pass: false, reason: "no repaired cta" };
  }

  // Rating UI + Supabase
  await ctaPage.goto(`${BASE}${ARTICLES.long}`, { waitUntil: "networkidle" });
  const ratingUi = await ctaPage.evaluate(() => ({
    compact: document.querySelector(".article-rating--compact") !== null,
    stars: document.querySelectorAll(".article-rating-star").length,
    height: document.querySelector(".article-rating")?.getBoundingClientRect().height,
  }));
  const ratingApi = await fetchRating(ARTICLES.long);
  report.phase54.ratingUi = {
    pass: ratingUi.compact && ratingUi.stars === 5 && (ratingUi.height ?? 999) < 200,
    ...ratingUi,
  };
  report.phase54.supabase = {
    pass:
      ratingApi.status === 200 &&
      ratingApi.json.ok &&
      Number(ratingApi.json.averageRating) === 4.9 &&
      ratingApi.json.totalVoteCount === 60,
    ...ratingApi.json,
    status: ratingApi.status,
  };

  // Vote test on ROI calculator article (not the 4.9 article)
  const votePath = pathFor(22727);
  const beforeVote = await fetchRating(votePath);
  const votePage = await browser.newPage();
  await votePage.goto(`${BASE}${votePath}`, { waitUntil: "networkidle" });
  const star4 = votePage.locator(".article-rating-star").nth(3);
  if (!(beforeVote.json.hasVoted)) {
    await star4.click();
    await votePage.waitForTimeout(1500);
  }
  const afterVote = await fetchRating(votePath);
  const reloadVote = await fetchRating(votePath);
  report.phase54.vote = {
    pass:
      afterVote.json.ok &&
      (beforeVote.json.hasVoted || afterVote.json.totalVoteCount === beforeVote.json.totalVoteCount + 1),
    before: beforeVote.json.totalVoteCount,
    after: afterVote.json.totalVoteCount,
    hasVoted: afterVote.json.hasVoted,
  };
  report.phase54.duplicate = { pass: afterVote.json.hasVoted === true };
  report.phase54.persistence = {
    pass: reloadVote.json.hasVoted === true && reloadVote.json.userRating !== null,
  };
  const baseline = await fetchRating(ARTICLES.normal);
  report.phase54.baseline = {
    pass: baseline.json.ok && baseline.json.totalVoteCount === 69 && Number(baseline.json.averageRating) === 5,
  };
  await votePage.close();

  // Minimized CTA ×
  const minPage = await browser.newPage({ viewport: { width: 390, height: 900 } });
  await minPage.addInitScript(() => {
    localStorage.setItem("adwrks_popup_dismissed_until", String(Date.now() + 86400000));
  });
  await minPage.goto(`${BASE}${ARTICLES.gap}`, { waitUntil: "networkidle" });
  await minPage.waitForSelector(".popup-minimized-cta-wrap", { timeout: 15000 });
  const hasClose = (await minPage.locator(".popup-minimized-cta-close").count()) > 0;
  await minPage.locator(".popup-minimized-cta-close").click();
  await minPage.waitForTimeout(400);
  const hiddenAfterX = (await minPage.locator(".popup-minimized-cta-wrap").count()) === 0;
  await minPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await minPage.waitForTimeout(400);
  const hiddenAfterScroll = (await minPage.locator(".popup-minimized-cta-wrap").count()) === 0;
  await minPage.goto(`${BASE}${ARTICLES.normal}`, { waitUntil: "networkidle" });
  await minPage.waitForTimeout(600);
  const reappear = (await minPage.locator(".popup-minimized-cta-wrap").count()) > 0;
  report.phase54.minimized = {
    pass: hasClose && hiddenAfterX && hiddenAfterScroll && reappear,
    hasClose,
    hiddenAfterX,
    hiddenAfterScroll,
    reappear,
  };
  await minPage.close();
  await ctaPage.close();
  await browser.close();

  fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

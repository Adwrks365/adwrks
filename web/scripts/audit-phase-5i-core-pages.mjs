/**
 * Phase 5I read-only audit — production page capture + metadata extraction.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "..", "migration-audit", "phase-5i-qa");
const base = process.argv[2] ?? "https://adwrks.co.il";

fs.mkdirSync(outDir, { recursive: true });

const seo = JSON.parse(fs.readFileSync(path.join(root, "src/data/content/seo.json"), "utf8"));
const urls = JSON.parse(fs.readFileSync(path.join(root, "src/data/content/urls.json"), "utf8"));
const posts = JSON.parse(fs.readFileSync(path.join(root, "src/data/content/posts.json"), "utf8"));

function getSeo(routePath) {
  const normalized = routePath === "/" ? "https://adwrks.co.il/" : `https://adwrks.co.il${routePath}`;
  return seo.find((e) => e.url === normalized || decodeURIComponent(e.url) === normalized);
}

const routes = [
  { key: "about", path: "/about-us/", slug: "about-us" },
  { key: "contact", path: "/contact-us/", slug: "contact-us", note: "Nav uses /contact-us/ not /contact/" },
  { key: "pricing", path: "/%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F-%D7%A9%D7%99%D7%95%D7%95%D7%A7-%D7%93%D7%99%D7%92%D7%99%D7%98%D7%9C%D7%99/", slug: "pricing" },
  { key: "blog", path: "/blog/", slug: "blog" },
];

const sampleArticles = [
  { key: "seo", path: "/%D7%9E%d7%94%d7%95-aeo-%d7%94%d7%90%d7%9d-%d7%99%d7%97%d7%9c%d7%99%d7%a3-%d7%90%d7%aa-seo/" },
  { key: "gads", path: "/%D7%9B%d7%9e%d7%94-%d7%95%d7%91%d7%90%d7%99%d7%9e%d7%aa%d7%99-%d7%9c%d7%91%d7%99%d7%95%d7%aa-%d7%90%d7%aa%d7%a8/" },
  { key: "wb", path: "/%D7%9B%d7%9e%d7%94-%d7%91%d7%95%d7%9c%d7%94-%d7%9c%d7%91%d7%99%d7%95%d7%95%d7%aa-%d7%90%d7%aa%d7%88%d7%99%d7%9f-%d7%91%d7%95%d7%95%d7%93%d7%a4%d7%a8%d7%a1/" },
  { key: "social", path: "/%D7%A9%D7%99%D7%95%D7%95%D7%A7-%D7%91%D7%A4%D7%99%D7%99%D7%A1%D7%91%D7%95%D7%A7-%D7%95%D7%90%D7%99%D7%A0%D7%A1%D7%98%D7%92%D7%A8%D7%9D/" },
  { key: "general", path: "/google-shopping-guide/" },
];

const report = { base, generatedAt: new Date().toISOString(), pages: {}, articles: {}, globals: {}, blog: {} };

const browser = await chromium.launch();
const page = await browser.newPage();

async function auditPage(key, routePath, slug) {
  const res = await page.goto(`${base}${routePath}`, { waitUntil: "domcontentloaded", timeout: 120000 });
  const seoRec = getSeo(decodeURIComponent(routePath.endsWith("/") ? routePath : `${routePath}/`));
  const data = await page.evaluate(() => {
    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => {
      try {
        return JSON.parse(s.textContent || "");
      } catch {
        return null;
      }
    }).filter(Boolean);
    const imgs = [...document.images].slice(0, 30).map((img) => ({
      src: img.currentSrc || img.src,
      alt: img.alt,
      w: img.naturalWidth,
      h: img.naturalHeight,
      loading: img.loading,
      priority: img.fetchPriority,
    }));
    return {
      h1: document.querySelector("h1")?.textContent?.trim() || null,
      h1Count: document.querySelectorAll("h1").length,
      title: document.title,
      metaDescription: document.querySelector('meta[name="description"]')?.getAttribute("content") || null,
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") || null,
      robots: document.querySelector('meta[name="robots"]')?.getAttribute("content") || null,
      ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute("content") || null,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      classes: document.body.className,
      pageClass: document.querySelector("article, .blog-page, .content-page-shell, .structured-page")?.className || null,
      hasForm: !!document.querySelector("form.contact-form"),
      hasIframe: [...document.querySelectorAll("iframe")].map((f) => ({ src: f.src, title: f.title })),
      clientComponents: document.querySelectorAll("[data-nextjs-scroll-focus-boundary]").length,
      images: imgs,
      internalLinks: [...document.querySelectorAll('a[href^="/"], a[href*="adwrks.co.il"]')].length,
      jsonLdTypes: ld.flatMap((j) => {
        if (j["@graph"]) return j["@graph"].map((n) => n["@type"]);
        return [j["@type"]].filter(Boolean);
      }),
    };
  });

  for (const vp of [390, 1440]) {
    await page.setViewportSize({ width: vp, height: vp === 390 ? 1200 : 900 });
    await page.goto(`${base}${routePath}`, { waitUntil: "domcontentloaded", timeout: 120000 });
    await page.screenshot({ path: path.join(outDir, `${slug}-${vp}.png`), fullPage: vp === 1440 });
  }

  report.pages[key] = {
    url: `${base}${routePath}`,
    status: res?.status(),
    inSitemap: urls.sitemapUrls.some((u) => u.includes(slug === "pricing" ? "מחירון" : slug.replace("-", "")) || decodeURIComponent(u).includes(decodeURIComponent(routePath))),
    seoFile: seoRec
      ? {
          title: seoRec.title,
          metaDescription: seoRec.metaDescription?.slice(0, 120),
          canonical: seoRec.canonical,
          robots: seoRec.robots,
          jsonLdTypes: (seoRec.jsonLd || []).flatMap((j) =>
            j["@graph"] ? j["@graph"].map((n) => n["@type"]) : [j["@type"]],
          ),
        }
      : null,
    live: data,
  };
}

for (const r of routes) {
  await auditPage(r.key, r.path, r.slug);
}

// Blog specifics
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`${base}/blog/`, { waitUntil: "domcontentloaded" });
report.blog = await page.evaluate(() => ({
  postCards: document.querySelectorAll(".article-card").length,
  categories: [...document.querySelectorAll(".blog-category-filter, .blog-filter, [class*='category']")].length,
  pagination: !!document.querySelector(".pagination, nav[aria-label*='עימוד']"),
  filters: [...document.querySelectorAll("a, button")].filter((el) => el.textContent?.includes("SEO") || el.textContent?.includes("Google")).slice(0, 8).map((el) => el.textContent?.trim()),
}));
report.blog.totalPosts = posts.length;

// Article samples
for (const a of sampleArticles) {
  await page.goto(`${base}${a.path}`, { waitUntil: "domcontentloaded", timeout: 120000 });
  const seoRec = getSeo(decodeURIComponent(a.path));
  const data = await page.evaluate(() => ({
    h1: document.querySelector("h1")?.textContent?.trim(),
    h1Count: document.querySelectorAll("h1").length,
    hasToc: !!document.querySelector(".article-toc, .article-toc-inline"),
    hasRating: !!document.querySelector(".article-rating"),
    hasSidebar: !!document.querySelector(".article-aside"),
    hasAdjacent: !!document.querySelector(".article-adjacent"),
    hasRelated: document.querySelectorAll(".related-article, .article-related").length,
    author: document.querySelector(".article-top-author, .article-author")?.textContent?.trim(),
    date: document.querySelector(".article-top-detail time")?.textContent?.trim(),
    featuredImage: !!document.querySelector(".page-hero-image, .article-hero-image"),
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    jsonLdTypes: [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap((s) => {
      try {
        const j = JSON.parse(s.textContent || "");
        if (j["@graph"]) return j["@graph"].map((n) => n["@type"]);
        return [j["@type"]];
      } catch {
        return [];
      }
    }),
    h2Count: document.querySelectorAll("h2").length,
    h3Count: document.querySelectorAll("h3").length,
  }));
  await page.setViewportSize({ width: 390, height: 1200 });
  await page.goto(`${base}${a.path}`, { waitUntil: "domcontentloaded" });
  await page.screenshot({ path: path.join(outDir, `article-${a.key}-390.png`), fullPage: true });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}${a.path}`, { waitUntil: "domcontentloaded" });
  await page.screenshot({ path: path.join(outDir, `article-${a.key}-1440.png`), fullPage: true });
  report.articles[a.key] = { path: a.path, seo: seoRec?.title, live: data };
}

// /contact/ redirect check
const contactRedirect = await page.goto(`${base}/contact/`, { waitUntil: "domcontentloaded" }).catch(() => null);
report.globals.contactPath = { requested: "/contact/", finalUrl: page.url(), status: contactRedirect?.status() };

// check-fit legacy
await page.goto(`${base}/check-fit/`, { waitUntil: "domcontentloaded" });
report.globals.checkFit = {
  pageClass: await page.evaluate(() => document.querySelector("article")?.className),
  h1: await page.locator("h1").first().textContent(),
};

await browser.close();

const outJson = path.join(outDir, "audit-data.json");
fs.writeFileSync(outJson, JSON.stringify(report, null, 2));
console.log("audit saved", outJson);

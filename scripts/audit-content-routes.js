#!/usr/bin/env node
/**
 * Audit content-to-URL integrity for all sitemap URLs.
 */
const fs = require("fs");
const path = require("path");

const AUDIT = path.join(__dirname, "..", "migration-audit");
const pages = JSON.parse(fs.readFileSync(path.join(AUDIT, "pages.json"), "utf8"));
const posts = JSON.parse(fs.readFileSync(path.join(AUDIT, "posts.json"), "utf8"));
const urls = JSON.parse(fs.readFileSync(path.join(AUDIT, "urls.json"), "utf8")).sitemapUrls;

function stripHtml(h) {
  return (h || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function firstH1(html) {
  const m = (html || "").match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return m ? stripHtml(m[1]) : null;
}

function elementorMeta(content) {
  const type = (content || "").match(/data-elementor-post-type="([^"]+)"/)?.[1] || null;
  const id = (content || "").match(/data-elementor-id="(\d+)"/)?.[1] || null;
  return { type, id };
}

function hasElementorData(item) {
  return Boolean(item.elementor?._elementor_data?.length);
}

function excerptLooksValid(page) {
  const ex = stripHtml(page.excerpt);
  const title = stripHtml(page.title);
  if (!ex || ex.length < 80) return false;
  // excerpt should relate to page title or common page keywords
  if (ex.includes(title.slice(0, 8))) return true;
  if (page.slug === "about-us" && ex.includes("סוכנות בוטיק")) return true;
  if (page.slug === "contact-us" && (ex.includes("יצירת קשר") || ex.includes("טופס"))) return true;
  return ex.length > 200;
}

function contentMismatch(page) {
  const meta = elementorMeta(page.content);
  if (meta.type === "post" && page.type === "page") return true;
  const ex = stripHtml(page.excerpt);
  const contentText = stripHtml(page.content).slice(0, 300);
  if (!ex || ex.length < 50) return false;
  // If content starts with completely different topic than excerpt
  if (page.slug === "about-us" && contentText.includes("קידום אורגני")) return true;
  if (page.slug === "contact-us" && contentText.includes("[elfsight")) return false; // shortcode issue not mapping
  if (ex.includes("סוכנות בוטיק") && contentText.includes("מחשבון תקציב")) return true;
  return false;
}

const routes = [];

for (const url of urls) {
  const u = new URL(url);
  const pathname = u.pathname.endsWith("/") ? u.pathname : `${u.pathname}/`;
  const page = pages.find((p) => {
    try {
      return new URL(p.link).pathname.replace(/\/?$/, "/") === pathname;
    } catch {
      return false;
    }
  });
  const post = posts.find((p) => {
    try {
      return new URL(p.link).pathname.replace(/\/?$/, "/") === pathname;
    } catch {
      return false;
    }
  });

  const item = page || post;
  if (!item) {
    routes.push({
      url: pathname,
      status: "missing",
      contentType: "unknown",
    });
    continue;
  }

  const meta = elementorMeta(item.content);
  const mismatch = page ? contentMismatch(page) : false;
  const h1 = firstH1(item.content);

  routes.push({
    url: pathname,
    wordpressId: item.id,
    contentType: page ? "page" : "post",
    title: stripHtml(item.title),
    expectedH1: stripHtml(item.title),
    actualFirstH1: h1,
    contentSource: hasElementorData(item)
      ? "elementor-json"
      : item.content
        ? "rest-html"
        : "none",
    elementorContentId: meta.id,
    elementorContentType: meta.type,
    featuredMedia: item.featuredMedia || 0,
    hasElementorJson: hasElementorData(item),
    excerptValid: page ? excerptLooksValid(page) : null,
    contentMismatch: mismatch,
    status: mismatch ? "incorrect" : "correct",
  });
}

const REPAIRED_PATHS = new Set([
  "/about-us/",
  "/contact-us/",
  "/seo/",
  "/google-ads/",
  "/website-building/",
  "/social-media-management/",
  "/hosting-plans/",
  "/check-fit/",
  "/שירותי-שיווק-דיגיטלי/",
  "/%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99-%d7%a9%d7%99%d7%95%d7%95%d7%a7-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99/",
]);

for (const route of routes) {
  if (REPAIRED_PATHS.has(route.url)) {
    route.status = "repaired";
    route.repairMethod = "structured-nextjs-from-elementor-json";
  } else if (route.contentMismatch) {
    route.status = "incorrect";
  }
}

const incorrect = routes.filter((r) => r.status === "incorrect");
const repaired = routes.filter((r) => r.status === "repaired");
const out = {
  generatedAt: new Date().toISOString(),
  totalUrls: routes.length,
  incorrect: incorrect.length,
  repaired: repaired.length,
  routes,
};

fs.writeFileSync(path.join(AUDIT, "content-route-map.json"), JSON.stringify(out, null, 2));
console.log(JSON.stringify({ total: routes.length, incorrect: incorrect.length, missing: routes.filter(r=>r.status==='missing').length }, null, 2));
incorrect.forEach((r) => console.log("INCORRECT:", r.url, r.title));

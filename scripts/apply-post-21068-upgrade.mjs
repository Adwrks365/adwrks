import fs from "node:fs";
import path from "node:path";

const TITLE_HE = "שיווק דיגיטלי לעסקים: המדריך המלא ל-2026";
const META_HE =
  "שיווק דיגיטלי לעסקים ב-2026: ערוצים, אסטרטגיה, KPI ו-ROI. מדריך מלא מ-Adwrks 365 — Google Ads, SEO, רשתות חברתיות ועוד. קראו עכשיו >>";
const EXCERPT_HE =
  "שיווק דיגיטלי לעסקים ב-2026: איך בונים אסטרטגיה מאוזנת מ-SEO, Google Ads, רשתות חברתיות ומדידה — ומתי כדאי ליווי מסוכנות. המדריך המלא.";

const TITLE_EN = "Digital Marketing for Business: The Complete 2026 Guide";
const META_EN =
  "Digital marketing for business in 2026: channels, strategy, KPIs and ROI. A complete guide from Adwrks 365 — SEO, Google Ads, social and more.";
const EXCERPT_EN =
  "How to build a balanced digital marketing strategy for your business in 2026 — SEO, paid search, social, measurement, and when agency support pays off.";

const POST_URL_HE =
  "https://adwrks.co.il/%d7%a9%d7%99%d7%95%d7%95%d7%a7-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99-%d7%9c%d7%a2%d7%a1%d7%a7%d7%99%d7%9d/";
const POST_URL_EN = "https://adwrks.co.il/en/digital-marketing-for-business/";

const MODIFIED = "2026-10-08T12:00:00";
const CATEGORIES = [1, 232];

const bodyHe = fs.readFileSync(
  path.join("web/src/data/content/patches/post-21068-body.html"),
  "utf8",
);

function stripTags(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function patchPosts(file, locale) {
  const posts = JSON.parse(fs.readFileSync(file, "utf8"));
  const post = posts.find((p) => p.id === 21068);
  if (!post) throw new Error(`post 21068 missing in ${file}`);

  if (locale === "he") {
    post.title = TITLE_HE;
    post.content = bodyHe.trim();
    post.excerpt = `<p>${EXCERPT_HE}</p>`;
    post.modified = MODIFIED;
    post.categories = CATEGORIES;
  } else {
    post.title = TITLE_EN;
    post.excerpt = `<p>${EXCERPT_EN}</p>`;
    post.modified = MODIFIED;
    post.categories = CATEGORIES;
    post.content = `<article class="article-en"><h1>${TITLE_EN}</h1>${bodyHe
      .replace(/href="\/([^"]+)"/g, (_, p) => {
        if (p.startsWith("en/")) return `href="/${p}"`;
        if (p === "seo/") return 'href="/en/seo/"';
        if (p === "google-ads/") return 'href="/en/google-ads/"';
        if (p === "social-media-management/") return 'href="/en/social-media-management/"';
        if (p === "hosting-plans/") return 'href="/en/hosting-plans/"';
        if (p === "website-building/") return 'href="/en/website-building/"';
        if (p === "google-business-profile/") return 'href="/en/google-business-profile/"';
        if (p === "contact-us/") return 'href="/en/contact-us/"';
        if (p === "שירותי-שיווק-דיגיטלי/") return 'href="/en/digital-marketing-services/"';
        if (p === "מחירון-שיווק-דיגיטלי/") return 'href="/en/digital-marketing-pricing/"';
        if (p === "קידום-אתרים-בגוגל/") return 'href="/en/google-seo/"';
        if (p === "פרסום-בגוגל-7-אסטרטגיות/") return 'href="/en/google-ads-7-strategies/"';
        if (p === "שיווק-בפייסבוק-ואינסטגרם/") return 'href="/en/facebook-instagram-marketing/"';
        if (p === "אסטרטגיות-שיווק-דיגיטלי-2025/") return 'href="/en/digital-marketing-strategies-2025/"';
        if (p === "כך-בוחרים-חברה-לשיווק-דיגיטלי/") return 'href="/en/choosing-digital-marketing-agency/"';
        if (p === "מחשבון-roi-מעודכן-2026/") return 'href="/en/roi-calculator-2026/"';
        return `href="/${p}"`;
      })
      .trim()}</article>`;
  }

  fs.writeFileSync(file, JSON.stringify(posts));
  console.log("patched", file);
}

function patchSeo(file, url, title, meta, locale) {
  const seo = JSON.parse(fs.readFileSync(file, "utf8"));
  let entry = seo.find((s) => s.url === url || s.url === url.replace("https://adwrks.co.il", ""));
  if (!entry) {
    entry = seo.find((s) => s.url?.includes("digital-marketing-for-business") || s.url?.includes("%d7%a9%d7%99%d7%95%d7%95%d7%a7"));
  }
  if (!entry) throw new Error(`seo entry not found for ${url} in ${file}`);

  entry.title = `${title} ⋆ Adwrks 365`;
  entry.metaDescription = meta;
  entry.ogTitle = entry.title;
  entry.ogDescription = meta;
  if (!entry.ogImage && locale === "he") {
    entry.ogImage = "https://adwrks.co.il/wp-content/uploads/digital-marketing-1-1.webp";
  }

  const webpage = entry.jsonLd?.[0]?.["@graph"]?.find((n) => n["@type"] === "CollectionPage" || n["@type"] === "WebPage" || n["@type"]?.includes?.("WebPage"));
  const article = entry.jsonLd?.[0]?.["@graph"]?.find((n) => n["@type"] === "Article" || n["@type"] === "BlogPosting");
  for (const node of [webpage, article]) {
    if (!node) continue;
    node.name = entry.title;
    node.headline = title;
    if (node.description !== undefined) node.description = meta;
  }

  fs.writeFileSync(file, JSON.stringify(seo));
  console.log("patched seo", file, entry.url);
}

patchPosts("web/src/data/content/posts.json", "he");
patchPosts("web/src/data/content-en/posts.json", "en");
patchSeo("web/src/data/content/seo.json", POST_URL_HE, TITLE_HE, META_HE, "he");
patchSeo("web/src/data/content-en/seo.json", POST_URL_EN, TITLE_EN, META_EN, "en");

console.log("body chars HE:", bodyHe.length);
console.log("excerpt plain:", stripTags(EXCERPT_HE).slice(0, 160));

/**
 * Keep in sync with web/src/lib/content/en-schema-localize.ts (used by sync + audits).
 */

export const ORG_DESCRIPTION_EN =
  "Digital marketing agency since 2018 — Google Ads, SEO, social media, websites, and hosting for businesses in Israel.";

export const SCHEMA_SKIP_STRING_KEYS = new Set([
  "streetAddress",
  "addressLocality",
  "addressRegion",
  "addressCountry",
  "email",
  "telephone",
  "url",
  "contentUrl",
  "sameAs",
  "target",
  "@id",
  "openingHours",
  "datePublished",
  "dateModified",
  "width",
  "height",
  "position",
  "availability",
  "query-input",
]);

export function hasHebrew(text) {
  return /[\u0590-\u05FF]/.test(text || "");
}

export function schemaDisplayTitle(seoTitle) {
  return (seoTitle || "")
    .replace(/\s*[|⋆]\s*Adwrks 365.*$/i, "")
    .replace(/\s*⋆\s*Adwrks 365.*$/i, "")
    .trim();
}

export function buildEnKeywords(schemaTitle, articleSection) {
  const fromCats = (articleSection || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const words = schemaTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && w !== "adwrks");
  const unique = [...new Set([...fromCats, ...words.slice(0, 8)])];
  return unique.length ? unique.join(", ") : schemaTitle;
}

const PAGE_LIKE = new Set([
  "WebPage",
  "Service",
  "Article",
  "BlogPosting",
  "CollectionPage",
  "NewsArticle",
]);
const ORG_LIKE = new Set(["Organization", "ProfessionalService", "LocalBusiness"]);

function nodeTypes(node) {
  const type = node["@type"];
  if (Array.isArray(type)) return type.map(String);
  return type ? [String(type)] : [];
}

function shouldSkipString(key, value) {
  if (SCHEMA_SKIP_STRING_KEYS.has(key)) return true;
  if (key === "name" && value.trim() === "Adwrks 365") return true;
  if (value.startsWith("http://") || value.startsWith("https://")) return true;
  if (/^[\d:+,-\s]+$/.test(value)) return true;
  return false;
}

function replacementFor(types, key, ctx) {
  const pageLike = types.some((t) => PAGE_LIKE.has(t));
  const orgLike = types.some((t) => ORG_LIKE.has(t));
  const isListItem = types.includes("ListItem");

  if (key === "serviceType") return "Digital marketing";
  if (key === "articleSection") return ctx.articleSection || "Digital marketing";
  if (key === "keywords") return ctx.keywords || ctx.schemaTitle;
  if (key === "text") return ctx.pageDescription;
  if (key === "description" && orgLike) return ORG_DESCRIPTION_EN;
  if (pageLike || isListItem) {
    if (key === "description" || key === "abstract") return ctx.pageDescription || ctx.schemaTitle;
    if (key === "name" || key === "headline" || key === "caption") return ctx.schemaTitle;
  }
  if (orgLike && key === "description") return ORG_DESCRIPTION_EN;
  return ctx.pageDescription || ctx.schemaTitle;
}

function isFaqNode(node) {
  return node && typeof node === "object" && node["@type"] === "FAQPage";
}

export function stripFaqFromJsonLd(nodes) {
  if (!Array.isArray(nodes)) return [];
  return nodes
    .map((block) => {
      if (!block || typeof block !== "object") return block;
      if (block["@type"] === "FAQPage") return null;
      if (!Array.isArray(block["@graph"])) return block;
      const graph = block["@graph"].filter((node) => !isFaqNode(node));
      return { ...block, "@graph": graph };
    })
    .filter(Boolean);
}

function walk(node, ctx, parentTypes = []) {
  if (Array.isArray(node)) {
    return node.map((item) => walk(item, ctx, parentTypes));
  }
  if (!node || typeof node !== "object") return node;

  const record = { ...node };
  const types = nodeTypes(record);
  const activeTypes = types.length ? types : parentTypes;

  if (record.inLanguage === "he-IL") {
    record.inLanguage = "en-US";
  }

  for (const [key, value] of Object.entries(record)) {
    if (key === "@graph" || key === "itemListElement" || key === "mainEntity") {
      record[key] = walk(value, ctx, activeTypes);
      continue;
    }
    if (key.startsWith("@") && key !== "@type") continue;
    if (typeof value === "string" && hasHebrew(value) && !shouldSkipString(key, value)) {
      record[key] = replacementFor(activeTypes, key, ctx);
      continue;
    }
    if (value && typeof value === "object") {
      record[key] = walk(value, ctx, activeTypes);
    }
  }

  return record;
}

export function localizeEnJsonLd(nodes, ctx) {
  if (!Array.isArray(nodes)) return [];
  return nodes.map((node) => walk(node, ctx));
}

export function buildSchemaContext({ pageTitle, pageDescription, articleSection }) {
  const schemaTitle = schemaDisplayTitle(pageTitle);
  return {
    schemaTitle,
    pageDescription: pageDescription || schemaTitle,
    articleSection,
    keywords: buildEnKeywords(schemaTitle, articleSection),
  };
}

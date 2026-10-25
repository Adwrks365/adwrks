/**
 * Shared EN JSON-LD text localization (sync script + audits).
 */

export const ORG_DESCRIPTION_EN =
  "Digital marketing agency since 2018 — Google Ads, SEO, social media, websites, and hosting for businesses in Israel.";

export function hasHebrew(text) {
  return /[\u0590-\u05FF]/.test(text || "");
}

export function schemaDisplayTitle(seoTitle) {
  return (seoTitle || "")
    .replace(/\s*[|⋆]\s*Adwrks 365.*$/i, "")
    .replace(/\s*⋆\s*Adwrks 365.*$/i, "")
    .trim();
}

const LOCALIZABLE = new Set(["name", "description", "headline", "abstract", "caption", "text"]);
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

function replacementFor(types, key, ctx) {
  const pageLike = types.some((t) => PAGE_LIKE.has(t));
  const orgLike = types.some((t) => ORG_LIKE.has(t));
  const isListItem = types.includes("ListItem");

  if (key === "description" && orgLike) return ORG_DESCRIPTION_EN;
  if (pageLike || isListItem) {
    if (key === "description" || key === "abstract") return ctx.pageDescription || ctx.schemaTitle;
    if (key === "name" || key === "headline") return ctx.schemaTitle;
    if (key === "caption") return ctx.schemaTitle;
  }
  if (orgLike && key === "description") return ORG_DESCRIPTION_EN;
  return ctx.schemaTitle;
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
    if (typeof value === "string" && LOCALIZABLE.has(key) && hasHebrew(value)) {
      record[key] = replacementFor(activeTypes, key, ctx);
      continue;
    }
    if (value && typeof value === "object") {
      record[key] = walk(value, ctx, activeTypes);
    }
  }

  return record;
}

export function localizeEnJsonLd(nodes, { pageTitle, pageDescription }) {
  const schemaTitle = schemaDisplayTitle(pageTitle);
  const ctx = {
    schemaTitle,
    pageDescription: pageDescription || schemaTitle,
  };
  if (!Array.isArray(nodes)) return [];
  return nodes.map((node) => walk(node, ctx));
}

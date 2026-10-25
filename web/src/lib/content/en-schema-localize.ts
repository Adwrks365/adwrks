import type { PageSeoLabels } from "@/lib/content/page-seo-labels";
import { hasHebrew } from "@/lib/content/seo-clamp";

export const ORG_DESCRIPTION_EN =
  "Digital marketing agency since 2018 — Google Ads, SEO, social media, websites, and hosting for businesses in Israel.";

/** Fields left unchanged (addresses, identifiers, URLs, contact). */
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

export type EnSchemaContext = PageSeoLabels & {
  articleSection?: string;
  keywords?: string;
};

const PAGE_LIKE_SCHEMA = new Set([
  "WebPage",
  "Service",
  "Article",
  "BlogPosting",
  "CollectionPage",
  "NewsArticle",
]);
const ORG_LIKE_SCHEMA = new Set(["Organization", "ProfessionalService", "LocalBusiness"]);

export function buildEnKeywords(schemaTitle: string, articleSection?: string): string {
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

export function buildEnSchemaContext(
  labels: PageSeoLabels,
  categoryTitles?: string[],
): EnSchemaContext {
  const articleSection = categoryTitles?.length ? categoryTitles.join(", ") : undefined;
  return {
    ...labels,
    articleSection,
    keywords: buildEnKeywords(labels.schemaTitle, articleSection),
  };
}

function nodeTypes(node: Record<string, unknown>): string[] {
  const type = node["@type"];
  if (Array.isArray(type)) return type.map(String);
  return type ? [String(type)] : [];
}

function shouldSkipString(key: string, value: string): boolean {
  if (SCHEMA_SKIP_STRING_KEYS.has(key)) return true;
  if (key === "name" && value.trim() === "Adwrks 365") return true;
  if (value.startsWith("http://") || value.startsWith("https://")) return true;
  if (/^[\d:+,-\s]+$/.test(value)) return true;
  return false;
}

function schemaReplacement(types: string[], key: string, ctx: EnSchemaContext): string {
  const pageLike = types.some((t) => PAGE_LIKE_SCHEMA.has(t));
  const orgLike = types.some((t) => ORG_LIKE_SCHEMA.has(t));
  const isListItem = types.includes("ListItem");

  if (key === "serviceType") return "Digital marketing";
  if (key === "articleSection") return ctx.articleSection || "Digital marketing";
  if (key === "keywords") return ctx.keywords || ctx.schemaTitle;
  if (key === "text") return ctx.description ?? ctx.schemaTitle;
  if (key === "description" && orgLike) return ORG_DESCRIPTION_EN;
  if (pageLike || isListItem) {
    if (key === "description" || key === "abstract") {
      return ctx.description ?? ctx.schemaTitle;
    }
    if (key === "name" || key === "headline" || key === "caption") {
      return ctx.schemaTitle;
    }
  }
  if (orgLike && key === "description") return ORG_DESCRIPTION_EN;
  return ctx.description ?? ctx.schemaTitle;
}

function isFaqNode(node: Record<string, unknown>): boolean {
  return node["@type"] === "FAQPage";
}

export function stripFaqFromJsonLd(nodes: unknown[]): unknown[] {
  return nodes
    .map((block) => {
      if (!block || typeof block !== "object") return block;
      const record = block as Record<string, unknown>;
      if (record["@type"] === "FAQPage") return null;
      if (!Array.isArray(record["@graph"])) return block;
      const graph = (record["@graph"] as unknown[]).filter((node) => {
        if (!node || typeof node !== "object") return true;
        return !isFaqNode(node as Record<string, unknown>);
      });
      return { ...record, "@graph": graph };
    })
    .filter((block): block is unknown => block != null);
}

function localizeEnSchemaNode(
  node: unknown,
  ctx: EnSchemaContext,
  parentTypes: string[] = [],
): unknown {
  if (Array.isArray(node)) {
    return node.map((item) => localizeEnSchemaNode(item, ctx, parentTypes));
  }
  if (!node || typeof node !== "object") return node;

  const record = { ...(node as Record<string, unknown>) };
  const types = nodeTypes(record);
  const activeTypes = types.length ? types : parentTypes;

  if (record.inLanguage === "he-IL") {
    record.inLanguage = "en-US";
  }

  for (const [key, value] of Object.entries(record)) {
    if (key === "@graph" || key === "itemListElement" || key === "mainEntity") {
      record[key] = localizeEnSchemaNode(value, ctx, activeTypes);
      continue;
    }
    if (key.startsWith("@") && key !== "@type") continue;
    if (typeof value === "string" && hasHebrew(value) && !shouldSkipString(key, value)) {
      record[key] = schemaReplacement(activeTypes, key, ctx);
      continue;
    }
    if (value && typeof value === "object") {
      record[key] = localizeEnSchemaNode(value, ctx, activeTypes);
    }
  }

  return record;
}

export function localizeEnSchemaCopy(nodes: unknown[], ctx: EnSchemaContext): unknown[] {
  return nodes.map((node) => localizeEnSchemaNode(node, ctx));
}

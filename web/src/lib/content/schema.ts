import { resolveAlternatePaths } from "@/lib/i18n/alternates";
import { inLanguageTag } from "@/i18n/locale";
import type { Locale } from "@/i18n/routing";
import type { EnSchemaContext } from "@/lib/content/en-schema-localize";
import {
  localizeEnSchemaCopy,
  stripFaqFromJsonLd,
} from "@/lib/content/en-schema-localize";
import { getEnComposerFaqSchema } from "@/lib/content/en-composer-faq-schema";
import { absoluteUrl, normalizePath } from "./paths";

const SCHEMA_TYPES_WITH_LANGUAGE = new Set([
  "Article",
  "WebPage",
  "Organization",
  "LocalBusiness",
  "BlogPosting",
  "Service",
]);

function injectInLanguage(node: unknown, locale: Locale): unknown {
  if (Array.isArray(node)) {
    return node.map((item) => injectInLanguage(item, locale));
  }
  if (!node || typeof node !== "object") return node;

  const record = { ...(node as Record<string, unknown>) };
  const type = record["@type"];
  const types = Array.isArray(type) ? type : type ? [type] : [];

  if (types.some((t) => SCHEMA_TYPES_WITH_LANGUAGE.has(String(t)))) {
    record.inLanguage = inLanguageTag(locale);
  }

  for (const [key, value] of Object.entries(record)) {
    if (key === "@graph" || key === "itemListElement") {
      record[key] = injectInLanguage(value, locale);
    }
  }

  return record;
}

export function localizeJsonLd(nodes: unknown[], locale: Locale): unknown[] {
  return nodes.map((node) => injectInLanguage(node, locale));
}

function isBreadcrumbListNode(node: unknown): boolean {
  if (!node || typeof node !== "object") return false;
  return (node as Record<string, unknown>)["@type"] === "BreadcrumbList";
}

function hasBreadcrumbItems(node: unknown): boolean {
  if (!node || typeof node !== "object") return false;
  const items = (node as Record<string, unknown>).itemListElement;
  return Array.isArray(items) && items.length > 0;
}

const PAGE_TYPES_WITH_BREADCRUMB_REF = new Set([
  "WebPage",
  "BlogPosting",
  "Article",
  "CollectionPage",
]);

function nodeTypes(node: Record<string, unknown>): string[] {
  const type = node["@type"];
  if (Array.isArray(type)) return type.map(String);
  return type ? [String(type)] : [];
}

const STRIPPED_ARTICLE_SCHEMA_TYPES = new Set(["CreativeWorkSeason", "AggregateRating"]);

function shouldStripSchemaNode(node: Record<string, unknown>): boolean {
  return nodeTypes(node).some((t) => STRIPPED_ARTICLE_SCHEMA_TYPES.has(t));
}

/** Rank Math graphs often reference #breadcrumb without a valid BreadcrumbList node. */
function sanitizeSeoGraphBlock(block: unknown): unknown {
  if (!block || typeof block !== "object") return block;
  const record = block as Record<string, unknown>;
  if (!Array.isArray(record["@graph"])) return block;

  const graph = (record["@graph"] as unknown[]).flatMap((node) => {
    if (!node || typeof node !== "object") return [node];
    if (isBreadcrumbListNode(node)) return [];
    const raw = node as Record<string, unknown>;
    if (shouldStripSchemaNode(raw)) return [];
    const next = { ...raw };
    if (nodeTypes(next).some((t) => PAGE_TYPES_WITH_BREADCRUMB_REF.has(t))) {
      delete next.breadcrumb;
    }
    return [next];
  });

  return { ...record, "@graph": graph };
}

/** Drop standalone Rank Math rating blocks and strip them from @graph (SEO + body HTML). */
function filterJsonLdBlocks(blocks: unknown[]): unknown[] {
  return blocks
    .map((block) => sanitizeSeoGraphBlock(block))
    .filter((block) => {
      if (!block || typeof block !== "object") return true;
      return !shouldStripSchemaNode(block as Record<string, unknown>);
    });
}

export function buildBreadcrumbSchema(options: {
  locale: Locale;
  path: string;
  title: string;
  isBlogPost?: boolean;
}): Record<string, unknown> {
  const { locale, path, title, isBlogPost } = options;
  const homeLabel = locale === "he" ? "דף הבית" : "Home";
  const blogLabel = locale === "he" ? "בלוג" : "Blog";
  const homePath = locale === "en" ? "/en/" : "/";
  const blogPath = locale === "en" ? "/en/blog/" : "/blog/";
  const pageUrl = absoluteUrl(normalizePath(path));

  const items: Record<string, unknown>[] = [
    {
      "@type": "ListItem",
      position: 1,
      name: homeLabel,
      item: absoluteUrl(homePath),
    },
  ];

  if (isBlogPost) {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: blogLabel,
      item: absoluteUrl(blogPath),
    });
    items.push({
      "@type": "ListItem",
      position: 3,
      name: title,
      item: absoluteUrl(normalizePath(path)),
    });
  } else if (normalizePath(path) !== homePath) {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: title,
      item: absoluteUrl(normalizePath(path)),
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    inLanguage: inLanguageTag(locale),
    itemListElement: items,
  };
}

function graphHasValidBreadcrumb(nodes: unknown[]): boolean {
  for (const block of nodes) {
    if (!block || typeof block !== "object") continue;
    const graph = (block as Record<string, unknown>)["@graph"];
    if (Array.isArray(graph)) {
      for (const node of graph) {
        if (isBreadcrumbListNode(node) && hasBreadcrumbItems(node)) return true;
      }
    }
    if (isBreadcrumbListNode(block) && hasBreadcrumbItems(block)) return true;
  }
  return false;
}

export function mergePageJsonLd(options: {
  locale: Locale;
  path: string;
  title: string;
  seoLabels?: EnSchemaContext;
  seoNodes?: unknown[];
  htmlNodes?: unknown[];
  isBlogPost?: boolean;
}): unknown[] {
  const labels: EnSchemaContext = options.seoLabels ?? {
    title: options.title,
    schemaTitle: options.title,
    description: undefined,
  };
  const breadcrumbTitle = labels.schemaTitle;

  let seoNodes = options.seoNodes ?? [];
  if (options.locale === "en") {
    seoNodes = stripFaqFromJsonLd(seoNodes);
  }

  let localizedSeo = localizeJsonLd(seoNodes, options.locale);
  let localizedHtml = localizeJsonLd(options.htmlNodes ?? [], options.locale);

  if (options.locale === "en") {
    localizedSeo = localizeEnSchemaCopy(localizedSeo, labels);
    localizedHtml = localizeEnSchemaCopy(localizedHtml, labels);
  }

  const homePath = options.locale === "en" ? "/en/" : "/";
  const needsBreadcrumb = normalizePath(options.path) !== homePath;

  let merged = filterJsonLdBlocks([...localizedSeo, ...localizedHtml]);

  if (options.locale === "en") {
    const composerFaq = getEnComposerFaqSchema(options.path);
    if (composerFaq) merged = [...merged, composerFaq];
  }

  if (!needsBreadcrumb || graphHasValidBreadcrumb(merged)) {
    return merged;
  }

  const breadcrumb = buildBreadcrumbSchema({
    locale: options.locale,
    path: options.path,
    title: breadcrumbTitle,
    isBlogPost: options.isBlogPost,
  });

  return [...merged, breadcrumb];
}

/** Resolve hreflang pair for sitemap alternates */
export function sitemapLanguageAlternates(path: string): Record<string, string> | undefined {
  const pairs = resolveAlternatePaths(path);
  if (!pairs) return undefined;
  return {
    "he-IL": absoluteUrl(pairs.he),
    en: absoluteUrl(pairs.en),
    "x-default": absoluteUrl(pairs.he),
  };
}

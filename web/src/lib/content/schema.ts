import { resolveAlternatePaths } from "@/lib/i18n/alternates";
import { inLanguageTag } from "@/i18n/locale";
import type { Locale } from "@/i18n/routing";
import type { EnSchemaContext } from "@/lib/content/en-schema-localize";
import {
  localizeEnSchemaCopy,
  stripFaqFromJsonLd,
} from "@/lib/content/en-schema-localize";
import { getEnComposerFaqSchema } from "@/lib/content/en-composer-faq-schema";
import { ORGANIZATION_ID, ORGANIZATION_SAME_AS, organizationEntityFields } from "@/lib/schema";
import { SITE } from "@/lib/site";
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function asArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  return value == null ? [] : [value];
}

const ORGANIZATION_TYPES = new Set(["Organization", "ProfessionalService", "LocalBusiness"]);

function isAgencyNode(node: Record<string, unknown>): boolean {
  return nodeTypes(node).some((t) => ORGANIZATION_TYPES.has(t)) && node.name === SITE.name;
}

function mergeSameAs(...lists: unknown[]): string[] {
  const byKey = new Map<string, string>();
  for (const list of lists) {
    for (const url of asArray(list)) {
      if (typeof url !== "string") continue;
      const key = url.replace(/\/+$/, "").toLowerCase();
      if (!byKey.has(key)) byKey.set(key, url);
    }
  }
  return [...byKey.values()];
}

/** schema.org expects an ISO 3166-1 alpha-2 code; migrated graphs store the country name. */
const COUNTRY_CODES: Readonly<Record<string, string>> = { ישראל: "IL", Israel: "IL" };

function withCountryCode(address: unknown): unknown {
  if (!isRecord(address) || typeof address.addressCountry !== "string") return address;
  const code = COUNTRY_CODES[address.addressCountry.trim()];
  return code ? { ...address, addressCountry: code } : address;
}

function enrichOrganizationNode(
  node: Record<string, unknown>,
  extras: Record<string, unknown>[],
  locale: Locale,
): Record<string, unknown> {
  const next = { ...node };
  if (next.address != null) next.address = withCountryCode(next.address);
  for (const extra of extras) {
    if (next.logo == null && extra.logo != null) next.logo = extra.logo;
    if (Array.isArray(extra.knowsAbout)) {
      next.knowsAbout = [...new Set([...asArray(next.knowsAbout), ...extra.knowsAbout])];
    }
    if (
      typeof extra.description === "string" &&
      extra.description !== next.description &&
      next.disambiguatingDescription == null
    ) {
      next.disambiguatingDescription = extra.description;
    }
  }
  next.sameAs = mergeSameAs(
    ORGANIZATION_SAME_AS,
    next.sameAs,
    ...extras.map((extra) => extra.sameAs),
  );
  return { ...next, ...organizationEntityFields(locale) };
}

/**
 * Migrated pages carry extra anonymous agency blocks next to the Rank Math graph.
 * Fold them into the single `#organization` entity so each page describes one agency.
 */
function consolidateOrganization(blocks: unknown[], locale: Locale): unknown[] {
  const standalone: Record<string, unknown>[] = [];
  const rest = blocks.filter((block) => {
    if (!isRecord(block) || Array.isArray(block["@graph"]) || !isAgencyNode(block)) return true;
    if (block["@id"] != null && block["@id"] !== ORGANIZATION_ID) return true;
    standalone.push(block);
    return false;
  });

  let hasGraphOrganization = false;
  const merged = rest.map((block) => {
    if (!isRecord(block) || !Array.isArray(block["@graph"])) return block;
    return {
      ...block,
      "@graph": block["@graph"].map((node) => {
        if (!isRecord(node) || node["@id"] !== ORGANIZATION_ID) return node;
        hasGraphOrganization = true;
        return enrichOrganizationNode(node, standalone, locale);
      }),
    };
  });

  if (hasGraphOrganization || standalone.length === 0) return merged;
  const [primary, ...others] = standalone;
  return [...merged, enrichOrganizationNode({ ...primary, "@id": ORGANIZATION_ID }, others, locale)];
}

const AUTHOR_ARCHIVE_PREFIX = `${SITE.domain}/author/`;

function isAuthorArchiveRef(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return [value["@id"], value.url].some(
    (ref) => typeof ref === "string" && ref.startsWith(AUTHOR_ARCHIVE_PREFIX),
  );
}

function isAuthorArchivePerson(value: unknown): boolean {
  return isRecord(value) && nodeTypes(value).includes("Person") && isAuthorArchiveRef(value);
}

/**
 * Articles are written by the agency team, and the WordPress author archive was not migrated.
 * Credit the `#organization` entity instead of a person whose URL is a 404.
 */
function attributeAuthorsToOrganization(blocks: unknown[]): unknown[] {
  const visit = (node: unknown): unknown => {
    if (Array.isArray(node)) return node.filter((item) => !isAuthorArchivePerson(item)).map(visit);
    if (!isRecord(node)) return node;
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(node)) {
      out[key] =
        key === "author" && asArray(value).some(isAuthorArchiveRef)
          ? { "@id": ORGANIZATION_ID }
          : visit(value);
    }
    return out;
  };
  return blocks.filter((block) => !isAuthorArchivePerson(block)).map(visit);
}

const PAGE_SCOPED_FRAGMENT = /^(webpage|breadcrumb|richSnippet|primaryimage|schema-\d+)$/;

const PAGE_URL_TYPES = new Set([
  "WebPage",
  "AboutPage",
  "ContactPage",
  "CollectionPage",
  "Article",
  "BlogPosting",
  "NewsArticle",
]);

function sitePathKey(url: string): string | null {
  if (!url.startsWith(SITE.domain)) return null;
  try {
    return normalizePath(new URL(url).pathname);
  } catch {
    return null;
  }
}

/** Migrated English graphs reuse the Hebrew page `@id`/`url`; point page-level nodes at the English URL. */
function retargetEnglishPageUrls(blocks: unknown[], path: string): unknown[] {
  const pair = resolveAlternatePaths(path);
  if (!pair || pair.he === pair.en) return blocks;
  const heKey = normalizePath(pair.he);
  const enUrl = absoluteUrl(pair.en);

  const rewrite = (value: string, key: string, types: string[]): string => {
    if (key !== "@id" && key !== "url") return value;
    const hashIndex = value.indexOf("#");
    const base = hashIndex === -1 ? value : value.slice(0, hashIndex);
    if (sitePathKey(base) !== heKey) return value;
    if (hashIndex !== -1) {
      const fragment = value.slice(hashIndex + 1);
      return PAGE_SCOPED_FRAGMENT.test(fragment) ? `${enUrl}#${fragment}` : value;
    }
    return key === "url" && types.some((t) => PAGE_URL_TYPES.has(t)) ? enUrl : value;
  };

  const visit = (node: unknown): unknown => {
    if (Array.isArray(node)) return node.map(visit);
    if (!isRecord(node)) return node;
    const types = nodeTypes(node);
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(node)) {
      out[key] = typeof value === "string" ? rewrite(value, key, types) : visit(value);
    }
    return out;
  };

  return blocks.map(visit);
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
    merged = retargetEnglishPageUrls(merged, options.path);
    const composerFaq = getEnComposerFaqSchema(options.path);
    if (composerFaq) merged = [...merged, composerFaq];
  }

  merged = consolidateOrganization(merged, options.locale);
  merged = attributeAuthorsToOrganization(merged);

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

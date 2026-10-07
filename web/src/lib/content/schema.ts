import { alternatePaths } from "@/i18n/routes";
import { inLanguageTag } from "@/i18n/locale";
import type { Locale } from "@/i18n/routing";
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
    inLanguage: inLanguageTag(locale),
    itemListElement: items,
  };
}

export function mergePageJsonLd(options: {
  locale: Locale;
  path: string;
  title: string;
  seoNodes?: unknown[];
  htmlNodes?: unknown[];
  isBlogPost?: boolean;
}): unknown[] {
  const localizedSeo = localizeJsonLd(options.seoNodes ?? [], options.locale);
  const localizedHtml = localizeJsonLd(options.htmlNodes ?? [], options.locale);
  const breadcrumb = buildBreadcrumbSchema({
    locale: options.locale,
    path: options.path,
    title: options.title,
    isBlogPost: options.isBlogPost,
  });

  const hasBreadcrumb = [...localizedSeo, ...localizedHtml].some((node) => {
    if (!node || typeof node !== "object") return false;
    return (node as Record<string, unknown>)["@type"] === "BreadcrumbList";
  });

  return hasBreadcrumb
    ? [...localizedSeo, ...localizedHtml]
    : [...localizedSeo, ...localizedHtml, breadcrumb];
}

/** Resolve hreflang pair for sitemap alternates */
export function sitemapLanguageAlternates(path: string): Record<string, string> | undefined {
  const pairs = alternatePaths(path);
  if (!pairs) return undefined;
  return {
    "he-IL": absoluteUrl(pairs.he),
    en: absoluteUrl(pairs.en),
    "x-default": absoluteUrl(pairs.he),
  };
}

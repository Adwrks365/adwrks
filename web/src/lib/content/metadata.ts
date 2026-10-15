import type { Metadata } from "next";
import { resolveAlternatePaths } from "@/lib/i18n/alternates";
import { localeFromPath, ogLocaleTag } from "@/i18n/locale";
import type { Locale } from "@/i18n/routing";
import { shouldAllowIndexing } from "@/lib/indexing";
import { getSiteConfig } from "@/lib/site";
import { getSeoByPath } from "./loader";
import { absoluteUrl, normalizePath } from "./paths";

function parseRobots(robots?: string | null): Metadata["robots"] {
  if (!robots) return { index: true, follow: true };
  const index = !robots.includes("noindex");
  const follow = !robots.includes("nofollow");
  return {
    index,
    follow,
    googleBot: {
      index,
      follow,
      "max-snippet": robots.includes("max-snippet:-1") ? -1 : undefined,
      "max-image-preview": robots.includes("max-image-preview:large") ? "large" : undefined,
      "max-video-preview": robots.includes("max-video-preview:-1") ? -1 : undefined,
    },
  };
}

function mergeRobots(
  pageRobots: Metadata["robots"],
  staging: Metadata["robots"],
): Metadata["robots"] {
  if (!staging) return pageRobots;
  return staging;
}

function productionCanonical(raw: string | null | undefined, pathKey: string): string {
  const fallback = absoluteUrl(pathKey);
  if (!raw) return fallback;
  try {
    const url = new URL(raw, getSiteConfig(localeFromPath(pathKey)).domain);
    const host = url.hostname.toLowerCase();
    if (host === "adwrks.co.il") return normalizePath(url.pathname) === normalizePath(pathKey) ? url.href : fallback;
    return fallback;
  } catch {
    return fallback;
  }
}

function present(value?: string | null): string | undefined {
  const text = value?.trim();
  return text ? text : undefined;
}

function hasHebrew(text: string): boolean {
  return /[\u0590-\u05FF]/.test(text);
}

function englishCategoryTitle(categoryTitle: string): string {
  const long = `${categoryTitle} Guides & Articles | Adwrks 365`;
  return long.length <= 60 ? long : clampSeoTitle(`${categoryTitle} | Adwrks 365`);
}

/** Target ~45–60 chars for titles; avoid cutting mid-word when possible. */
export function clampSeoTitle(title: string, max = 60): string {
  const t = title.trim();
  if (t.length <= max) return t;
  const slice = t.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  if (lastSpace > 32) return `${slice.slice(0, lastSpace).trim()}…`;
  return `${slice.trim()}…`;
}

/** Target ~120–155 chars for meta descriptions. */
export function clampSeoDescription(description: string, max = 155): string {
  const t = description.trim();
  if (t.length <= max) return t;
  const slice = t.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  if (lastSpace > 100) return `${slice.slice(0, lastSpace).trim()}…`;
  return `${slice.trim()}…`;
}

function hreflangAlternates(pathKey: string): Metadata["alternates"] {
  const pairs = resolveAlternatePaths(pathKey);
  const canonical = absoluteUrl(pathKey);
  if (!pairs) {
    return { canonical };
  }
  return {
    canonical,
    languages: {
      "he-IL": absoluteUrl(pairs.he),
      en: absoluteUrl(pairs.en),
      "x-default": absoluteUrl(pairs.he),
    },
  };
}

/** Homepage LCP hero — preload in `<head>` via metadata icons.other */
export function withHomeHeroLcpPreload(metadata: Metadata, heroLcpSrc: string): Metadata {
  return {
    ...metadata,
    icons: {
      other: [
        {
          rel: "preload",
          url: heroLcpSrc,
          type: "image/webp",
          fetchPriority: "high",
        },
      ],
    },
  };
}

export function buildPageMetadata(
  pathKey: string,
  fallbackTitle?: string,
  locale: Locale = localeFromPath(pathKey),
  fallbackDescription?: string,
): Metadata {
  const site = getSiteConfig(locale);
  const seo = getSeoByPath(pathKey, locale);
  const canonical = productionCanonical(seo?.canonical, pathKey);

  let rawTitle = seo?.title || fallbackTitle || site.name;
  if (
    locale === "en" &&
    fallbackTitle &&
    !hasHebrew(fallbackTitle) &&
    seo?.title &&
    hasHebrew(seo.title)
  ) {
    rawTitle = fallbackTitle;
  }
  if (locale === "en" && fallbackTitle && !hasHebrew(fallbackTitle) && rawTitle.length < 30) {
    const seoTitleLooksHebrew = !seo?.title || hasHebrew(seo.title);
    if (seoTitleLooksHebrew || rawTitle === fallbackTitle) {
      rawTitle = englishCategoryTitle(fallbackTitle.replace(/\s*⋆.*$/, "").trim());
    }
  }

  const title = clampSeoTitle(rawTitle);

  let description = present(seo?.metaDescription) ?? present(fallbackDescription);
  if (
    locale === "en" &&
    description &&
    hasHebrew(description) &&
    present(fallbackDescription) &&
    !hasHebrew(fallbackDescription!)
  ) {
    description = present(fallbackDescription);
  }
  const descriptionClamped = description ? clampSeoDescription(description) : undefined;
  const ogDescription = seo
    ? present(seo.ogDescription) || descriptionClamped
    : descriptionClamped;
  const ogImage = seo ? present(seo.ogImage) : site.ogDefaultImage;
  const isHome = pathKey === "/" || pathKey === "/en/";
  const ogType = isHome ? "website" : "article";
  const ogLocale = ogLocaleTag(locale);

  return {
    title,
    description: descriptionClamped ?? null,
    alternates: hreflangAlternates(pathKey),
    robots: mergeRobots(parseRobots(seo?.robots), stagingRobots()),
    openGraph: {
      title: seo?.ogTitle || title,
      url: canonical,
      siteName: site.name,
      locale: ogLocale,
      alternateLocale: locale === "he" ? ["en_US"] : ["he_IL"],
      description: ogDescription ? clampSeoDescription(ogDescription) : "",
      type: ogType,
      images: ogImage ? [{ url: ogImage.startsWith("http") ? ogImage : `${site.domain}${ogImage}`, alt: title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.ogTitle || title,
      description: ogDescription ?? null,
      images: ogImage ? [ogImage.startsWith("http") ? ogImage : `${site.domain}${ogImage}`] : [],
    },
  };
}

export function isProductionCanonical(): boolean {
  return true;
}

export function stagingRobots(): Metadata["robots"] {
  if (shouldAllowIndexing()) return undefined;
  return { index: false, follow: false };
}

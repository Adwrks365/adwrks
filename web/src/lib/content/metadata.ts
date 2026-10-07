import type { Metadata } from "next";
import { alternatePaths } from "@/i18n/routes";
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

function hreflangAlternates(pathKey: string): Metadata["alternates"] {
  const pairs = alternatePaths(pathKey);
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

export function buildPageMetadata(
  pathKey: string,
  fallbackTitle?: string,
  locale: Locale = localeFromPath(pathKey),
): Metadata {
  const site = getSiteConfig(locale);
  const seo = getSeoByPath(pathKey, locale);
  const canonical = productionCanonical(seo?.canonical, pathKey);
  const title = seo?.title || fallbackTitle || site.name;
  const description = seo ? present(seo.metaDescription) : undefined;
  const ogDescription = seo ? present(seo.ogDescription) || description : undefined;
  const ogImage = seo ? present(seo.ogImage) : site.ogDefaultImage;
  const isHome = pathKey === "/" || pathKey === "/en/";
  const ogType = isHome ? "website" : "article";
  const ogLocale = ogLocaleTag(locale);

  return {
    title,
    description: description ?? null,
    alternates: hreflangAlternates(pathKey),
    robots: mergeRobots(parseRobots(seo?.robots), stagingRobots()),
    openGraph: {
      title: seo?.ogTitle || title,
      url: canonical,
      siteName: site.name,
      locale: ogLocale,
      alternateLocale: locale === "he" ? ["en_US"] : ["he_IL"],
      description: ogDescription ?? "",
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

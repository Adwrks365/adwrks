import type { Metadata } from "next";
import { isIndexableProduction } from "@/lib/indexing";
import { SITE } from "@/lib/site";
import { getSeoByPath } from "./loader";
import { absoluteUrl } from "./paths";

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

/** Keep canonicals on the production host. Never emit localhost, www, or preview hosts. */
function productionCanonical(raw: string | null | undefined, pathKey: string): string {
  const fallback = absoluteUrl(pathKey);
  if (!raw) return fallback;
  try {
    const url = new URL(raw, SITE.domain);
    const host = url.hostname.toLowerCase();
    if (host === "adwrks.co.il") return url.href;
    return fallback;
  } catch {
    return fallback;
  }
}

function present(value?: string | null): string | undefined {
  const text = value?.trim();
  return text ? text : undefined;
}

export function buildPageMetadata(pathKey: string, fallbackTitle?: string): Metadata {
  const seo = getSeoByPath(pathKey);
  const canonical = productionCanonical(seo?.canonical, pathKey);
  const title = seo?.title || fallbackTitle || SITE.name;
  const description = seo ? present(seo.metaDescription) : undefined;
  const ogDescription = seo ? present(seo.ogDescription) || description : undefined;
  const ogImage = seo ? present(seo.ogImage) : undefined;
  // Rank Math emits og:type=article on every indexable URL except the homepage.
  const ogType = pathKey === "/" ? "website" : "article";

  return {
    title,
    description: description ?? null,
    alternates: { canonical },
    robots: mergeRobots(parseRobots(seo?.robots), stagingRobots()),
    openGraph: {
      title: seo?.ogTitle || title,
      url: canonical,
      siteName: SITE.name,
      locale: SITE.locale,
      description: ogDescription ?? "",
      type: ogType,
      images: ogImage ? [{ url: ogImage, alt: title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.ogTitle || title,
      description: ogDescription ?? null,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export function isProductionCanonical(): boolean {
  return true;
}

export function stagingRobots(): Metadata["robots"] {
  if (isIndexableProduction()) return undefined;
  return { index: false, follow: false };
}

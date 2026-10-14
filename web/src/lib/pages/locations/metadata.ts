import type { Metadata } from "next";
import { ogLocaleTag } from "@/i18n/locale";
import type { Locale } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/content/paths";
import { clampSeoDescription, clampSeoTitle, stagingRobots } from "@/lib/content/metadata";
import { resolveAlternatePaths } from "@/lib/i18n/alternates";
import { getSiteConfig } from "@/lib/site";

export function buildAreaMetadata(
  path: string,
  title: string,
  description: string,
  locale: Locale,
): Metadata {
  const site = getSiteConfig(locale);
  const pairs = resolveAlternatePaths(path);
  const canonical = absoluteUrl(path);
  const seoTitle = clampSeoTitle(title);
  const seoDescription = clampSeoDescription(description);
  const ogImage = site.ogDefaultImage.startsWith("http")
    ? site.ogDefaultImage
    : `${site.domain}${site.ogDefaultImage}`;

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: pairs
      ? {
          canonical,
          languages: {
            "he-IL": absoluteUrl(pairs.he),
            en: absoluteUrl(pairs.en),
            "x-default": absoluteUrl(pairs.he),
          },
        }
      : { canonical },
    robots: stagingRobots() ?? {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: seoTitle,
      url: canonical,
      siteName: site.name,
      locale: ogLocaleTag(locale),
      alternateLocale: locale === "he" ? ["en_US"] : ["he_IL"],
      description: seoDescription,
      type: "website",
      images: [{ url: ogImage, alt: seoTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [ogImage],
    },
  };
}

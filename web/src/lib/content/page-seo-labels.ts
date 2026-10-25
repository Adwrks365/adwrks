import { getEnSeoOverride } from "@/lib/i18n/en-seo-overrides";
import type { Locale } from "@/i18n/routing";
import { localeFromPath } from "@/i18n/locale";
import { getSiteConfig } from "@/lib/site";
import { clampSeoDescription, clampSeoTitle, hasHebrew } from "@/lib/content/seo-clamp";
import { getSeoByPath } from "./loader";

function present(value?: string | null): string | undefined {
  const text = value?.trim();
  return text ? text : undefined;
}

function englishCategoryTitle(categoryTitle: string): string {
  const long = `${categoryTitle} Guides & Articles | Adwrks 365`;
  return long.length <= 60 ? long : clampSeoTitle(`${categoryTitle} | Adwrks 365`);
}

/** Short label for breadcrumbs and JSON-LD (no brand suffix). */
export function schemaDisplayTitle(seoTitle: string): string {
  return seoTitle
    .replace(/\s*[|⋆]\s*Adwrks 365.*$/i, "")
    .replace(/\s*⋆\s*Adwrks 365.*$/i, "")
    .trim();
}

export type PageSeoLabels = {
  title: string;
  description?: string;
  schemaTitle: string;
};

/** Same title/description resolution as `buildPageMetadata` (for JSON-LD and breadcrumbs). */
export function resolvePageSeoLabels(
  pathKey: string,
  locale: Locale = localeFromPath(pathKey),
  fallbackTitle?: string,
  fallbackDescription?: string,
): PageSeoLabels {
  const site = getSiteConfig(locale);
  const seo = getSeoByPath(pathKey, locale);
  const enOverride = locale === "en" ? getEnSeoOverride(pathKey) : undefined;

  let rawTitle = enOverride?.title || seo?.title || fallbackTitle || site.name;
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

  let description =
    present(enOverride?.description) ?? present(seo?.metaDescription) ?? present(fallbackDescription);
  if (
    locale === "en" &&
    description &&
    hasHebrew(description) &&
    present(fallbackDescription) &&
    !hasHebrew(fallbackDescription!)
  ) {
    description = present(fallbackDescription);
  }

  return {
    title,
    description: description ? clampSeoDescription(description) : undefined,
    schemaTitle: schemaDisplayTitle(title),
  };
}

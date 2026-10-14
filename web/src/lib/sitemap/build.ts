import type { MetadataRoute } from "next";
import type { Locale } from "@/i18n/routing";
import { getSitemapUrls } from "@/lib/content/loader";
import { sitemapLanguageAlternates } from "@/lib/content/schema";
import { locationSitemapPaths } from "@/lib/pages/locations/registry";
import { SITE } from "@/lib/site";

function buildSitemapEntries(locale: Locale): MetadataRoute.Sitemap {
  const seen = new Set<string>();
  const paths = [...getSitemapUrls(locale), ...locationSitemapPaths(locale)].filter((path) => {
    if (seen.has(path)) return false;
    seen.add(path);
    return true;
  });

  return paths.map((path) => ({
    url: `${SITE.domain}${path === "/" ? "/" : path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "/" || path === "/en/" ? 1 : 0.7,
    alternates: {
      languages: sitemapLanguageAlternates(path),
    },
  }));
}

export function generateHeSitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries("he");
}

export function generateEnSitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries("en");
}

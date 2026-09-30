import type { MetadataRoute } from "next";
import { getSitemapUrls } from "@/lib/content/loader";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return getSitemapUrls().map((path) => ({
    url: `${SITE.domain}${path === "/" ? "/" : path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
}

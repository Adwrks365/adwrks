import type { MetadataRoute } from "next";
import { isPreviewOrNonProductionDeployment } from "@/lib/indexing";
import { SITE } from "@/lib/site";

/**
 * Build-time robots.txt.
 * Production Vercel deployments always allow crawling — no runtime Host header dependency.
 * Non-production hosts (e.g. *.vercel.app) use middleware X-Robots-Tag instead.
 */
export default function robots(): MetadataRoute.Robots {
  if (isPreviewOrNonProductionDeployment()) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.domain}/sitemap.xml`,
  };
}

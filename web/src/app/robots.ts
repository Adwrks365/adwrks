import type { MetadataRoute } from "next";
import { isIndexableProduction } from "@/lib/indexing";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexableProduction()) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.domain}/sitemap.xml`,
  };
}

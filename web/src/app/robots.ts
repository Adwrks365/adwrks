import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

const isProductionDeploy =
  process.env.NODE_ENV === "production" && process.env.VERCEL_ENV === "production";

export default function robots(): MetadataRoute.Robots {
  if (!isProductionDeploy) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.domain}/sitemap.xml`,
  };
}

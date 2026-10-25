import { ABOUT_FAQ, ABOUT_PATH } from "@/lib/pages/about-content.en";
import { PRICING_FAQ, PRICING_PATH } from "@/lib/pages/pricing-content.en";
import { GOOGLE_ADS_FAQ, GOOGLE_ADS_PATH } from "@/lib/pages/services/google-ads-content.en";
import { SEO_FAQ, SEO_PATH } from "@/lib/pages/services/seo-content.en";
import { SOCIAL_FAQ, SOCIAL_PATH } from "@/lib/pages/services/social-media-content.en";
import {
  WEBSITE_BUILDING_FAQ,
  WEBSITE_BUILDING_PATH,
} from "@/lib/pages/services/website-building-content.en";
import { normalizePath } from "./paths";

type FaqItem = { q: string; a: string };

const COMPOSER_FAQ: Record<string, readonly FaqItem[]> = {
  [ABOUT_PATH]: ABOUT_FAQ,
  [PRICING_PATH]: PRICING_FAQ,
  [GOOGLE_ADS_PATH]: GOOGLE_ADS_FAQ,
  [SEO_PATH]: SEO_FAQ,
  [SOCIAL_PATH]: SOCIAL_FAQ,
  [WEBSITE_BUILDING_PATH]: WEBSITE_BUILDING_FAQ,
};

function isFaqNode(node: Record<string, unknown>): boolean {
  return node["@type"] === "FAQPage";
}

function graphWithoutFaq(block: unknown): unknown {
  if (!block || typeof block !== "object") return block;
  const record = block as Record<string, unknown>;
  if (record["@type"] === "FAQPage") return null;
  if (!Array.isArray(record["@graph"])) return block;
  const graph = (record["@graph"] as unknown[]).filter((node) => {
    if (!node || typeof node !== "object") return true;
    return !isFaqNode(node as Record<string, unknown>);
  });
  return { ...record, "@graph": graph };
}

/** Remove migrated Hebrew FAQ blocks on EN composer pages (replaced with English FAQ). */
export function stripFaqFromJsonLd(nodes: unknown[]): unknown[] {
  return nodes
    .map((block) => graphWithoutFaq(block))
    .filter((block): block is unknown => block != null);
}

function faqPageSchema(items: readonly FaqItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function getEnComposerFaqSchema(pathKey: string): Record<string, unknown> | undefined {
  const key = normalizePath(pathKey);
  const items = COMPOSER_FAQ[key];
  if (!items?.length) return undefined;
  return faqPageSchema(items);
}

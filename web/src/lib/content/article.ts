import { PRICING_CALCULATOR_EMBED_SLOT } from "@/lib/calculators/pricing-calculator-data";
import { ROI_CALCULATOR_EMBED_SLOT } from "@/lib/calculators/roi-calculator-data";
import { consolidateDuplicateFaqSections } from "@/lib/content/article-content-blocks";
import { applyArticleBatch2Enrichment2026 } from "@/lib/content/article-batch2-enrichment-2026";
import { applyArticleBatch3Enrichment2026 } from "@/lib/content/article-batch3-enrichment-2026";
import { applyArticleBatch4Enrichment2026 } from "@/lib/content/article-batch4-enrichment-2026";
import { applyArticleBatch4StructurePolish } from "@/lib/content/article-batch4-structure-polish";
import { applyArticleBatch5Pilot2026 } from "@/lib/content/article-batch5-pilot-2026";
import { applyArticleBatch5StructurePolish } from "@/lib/content/article-batch5-structure-polish";
import { applyArticleBatch6Enrichment2026 } from "@/lib/content/article-batch6-enrichment-2026";
import { applyArticleBatch6StructurePolish } from "@/lib/content/article-batch6-structure-polish";
import { applyArticleBatch7Enrichment2026 } from "@/lib/content/article-batch7-enrichment-2026";
import { applyArticleBatch7StructurePolish } from "@/lib/content/article-batch7-structure-polish";
import { applyArticleBatch8Enrichment2026 } from "@/lib/content/article-batch8-enrichment-2026";
import { applyArticleBatch8StructurePolish } from "@/lib/content/article-batch8-structure-polish";
import { applyArticleBatch9Enrichment2026 } from "@/lib/content/article-batch9-enrichment-2026";
import { applyArticleBatch9StructurePolish } from "@/lib/content/article-batch9-structure-polish";
import { applyArticleFinalRolloutEnrichment2026 } from "@/lib/content/article-final-rollout-enrichment-2026";
import { applyArticleFinalRolloutStructurePolish } from "@/lib/content/article-final-rollout-structure-polish";
import { applyArticleReadingPolishShared } from "@/lib/content/article-reading-polish-shared";
import { applyArticleFaqAccordionPresentation } from "@/lib/content/article-faq-accordion";
import { applyPilot2026BodyPolish } from "@/lib/content/article-pilot-2026-body-polish";
import { applyArticlePilotEnrichment2026 } from "@/lib/content/article-pilot-enrichment-2026";
import { polishContentInternalLinks } from "@/lib/content/content-internal-links-polish";
import { polishGoogleSeoArticleHtml } from "@/lib/content/post-19428-polish";
import { polishWordPressCostArticleHtml } from "@/lib/content/post-19792-polish";
import { polishGoogleMapsArticleHtml } from "@/lib/content/post-20155-polish";
import { injectPageSpeedCrossLinks } from "@/lib/content/post-21496-polish-content";
import { polishPageSpeedArticleHtml, trimPageSpeedArticleSpacers } from "@/lib/content/post-21496-polish";
import { polishRussianDigitalArticleHtml } from "@/lib/content/post-20350-polish";
import { PAGESPEED_INSIGHTS_EMBED_SLOT } from "@/lib/pagespeed/pagespeed-insights-data";
import { decodeHtmlEntities } from "./paths";
import { getAllPosts, getCategories, getPostsForCategory } from "./loader";
import { repairArticleCtaLinks, wrapRepairedArticleCtaBlocks } from "./article-ctas";
import {
  stripEmptyElementorSections,
  stripEmptyImageWidgets,
  stripLeadingRedundantElementorSections,
  stripElementorFormWidgets,
  stripLegacyArticleContactBlocks,
} from "./legacy-blocks";
import type { Locale } from "@/i18n/routing";
import type { ContentItem } from "./types";

export type ArticleHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type ArticleAuthor = {
  name: string;
  role?: string;
  bio: string;
  avatarUrl?: string;
};

/** Verified author presentation — no invented biography. */
export const ARTICLE_AUTHOR: ArticleAuthor = {
  name: "צוות ADWRKS 365",
  role: "מומחי שיווק דיגיטלי",
  bio: "Adwrks 365 מלווה עסקים וחברות מאז 2018 בבניית נוכחות דיגיטלית, קידום אתרים וניהול קמפיינים. הצוות עוסק בקידום אתרים, פרסום ממומן, ניהול רשתות חברתיות, בניית אתרים ואסטרטגיה דיגיטלית, ועובד עם פלטפורמות כמו Google ו-Meta.",
  avatarUrl: "/wp-content/uploads/cropped-logo-black-trans-140x47.webp",
};

const ARTICLE_AUTHOR_EN: ArticleAuthor = {
  name: "ADWRKS 365 Team",
  role: "Digital marketing specialists",
  bio: "Since 2018, Adwrks 365 has helped businesses build digital presence, run SEO, and manage paid campaigns. The team covers organic search, paid advertising, social media, website building, and digital strategy — working with platforms like Google and Meta.",
  avatarUrl: "/wp-content/uploads/cropped-logo-black-trans-140x47.webp",
};

export function getArticleAuthor(locale: Locale = "he"): ArticleAuthor {
  return locale === "en" ? ARTICLE_AUTHOR_EN : ARTICLE_AUTHOR;
}

function slugifyHeading(text: string): string {
  const base = text
    .replace(/<[^>]+>/g, "")
    .trim()
    .slice(0, 80)
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
  return base || "section";
}

function findBalancedDivClose(html: string, openIndex: number): number {
  let depth = 1;
  let i = openIndex + 4;

  while (i < html.length && depth > 0) {
    const nextOpen = html.indexOf("<div", i);
    const nextClose = html.indexOf("</div>", i);
    if (nextClose === -1) return -1;

    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      i = nextOpen + 4;
    } else {
      depth--;
      i = nextClose + 6;
      if (depth === 0) return i;
    }
  }

  return -1;
}

/** Remove legacy Elementor sidebar columns (inner col-33) from article HTML. */
export function stripEmbeddedArticleSidebar(html: string): string {
  let result = html;
  const marker = "elementor-inner-column elementor-col-33";
  let safety = 0;

  while (result.includes(marker) && safety < 50) {
    safety++;
    const idx = result.indexOf(marker);
    const colStart = result.lastIndexOf("<div", idx);
    if (colStart === -1) break;
    const colEnd = findBalancedDivClose(result, colStart);
    if (colEnd === -1) break;
    result = result.slice(0, colStart) + result.slice(colEnd);
  }

  return result
    .replace(/<div[^>]*class="[^"]*trustindex[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<img[^>]+graph\.facebook\.com[^>]*>/gi, "")
    .replace(/<iframe[^>]+trustindex[^>]*>[\s\S]*?<\/iframe>/gi, "");
}

/** Extract H2/H3 headings for table of contents. */
export function extractArticleHeadings(html: string): ArticleHeading[] {
  const headings: ArticleHeading[] = [];
  const seen = new Map<string, number>();
  const re = /<(h[23])[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;

  while ((match = re.exec(html)) !== null) {
    const level = match[1].toLowerCase() === "h2" ? 2 : 3;
    const text = decodeHtmlEntities(match[2].replace(/<[^>]+>/g, "").trim());
    if (!text || text.length < 2) continue;

    let id = slugifyHeading(text);
    const count = seen.get(id) ?? 0;
    if (count > 0) id = `${id}-${count + 1}`;
    seen.set(slugifyHeading(text), count + 1);

    headings.push({ id, text, level });
  }

  return headings;
}

/** Inject stable anchor IDs into article H2/H3 for TOC navigation. */
export function injectHeadingAnchors(html: string, headings: ArticleHeading[]): string {
  let idx = 0;
  return html.replace(/<(h[23])([^>]*)>([\s\S]*?)<\/\1>/gi, (full, tag, attrs, inner) => {
    const heading = headings[idx];
    idx++;
    if (!heading) return full;
    if (/\bid\s*=/.test(attrs)) {
      return `<${tag}${attrs}>${inner}</${tag}>`;
    }
    return `<${tag}${attrs} id="${heading.id}">${inner}</${tag}>`;
  });
}

/** Downgrade embedded H1 tags so the page hero remains the sole H1. */
export function downgradeEmbeddedH1(html: string): string {
  return html
    .replace(/<h1(\s[^>]*)?>/gi, "<h2$1>")
    .replace(/<\/h1>/gi, "</h2>");
}

/** Remove legacy Elementor PageSpeed widget (client-side API key) and inject React embed at top. */
export function injectPageSpeedInsightsEmbed(html: string): string {
  if (!html.includes("elementor-21496")) {
    return html;
  }

  let result = html.replace(
    /<div class="elementor-element elementor-element-ee126d3[\s\S]*?<\/script>\s*<\/div>/i,
    "",
  );

  result = result.replace(
    /<div class="elementor-element[^>]*>[\s\S]*?id="audit-form"[\s\S]*?<\/script>\s*<\/div>/i,
    "",
  );

  if (!result.includes("data-adwrks-pagespeed-insights")) {
    result = result.replace(
      /(<div data-elementor-type="wp-post"[^>]*>)/i,
      `$1${PAGESPEED_INSIGHTS_EMBED_SLOT}`,
    );
  }

  result = result.replace(
    /<h2 class="elementor-heading-title elementor-size-default">כלי בדיקת מהירות אתרים<\/h2>\s*/i,
    "",
  );

  return result;
}

/** Replace orphan lead copy (form removed) with a contextual popup CTA on the speed-test article. */
function replaceSpeedArticleOrphanLeadPrompt(html: string, locale: Locale): string {
  if (!html.includes("elementor-21496") || !html.includes("elementor-element-00cc55a")) {
    return html;
  }

  const ctaLabel =
    locale === "en"
      ? "Leave your details for a free consultation"
      : "השאירו פרטים לייעוץ חינם";
  const ctaBlock = `<div class="article-inline-cta-block article-inline-cta-block--speed-lead"><div class="elementor-element elementor-widget elementor-widget-button elementor-align-center"><a class="elementor-button elementor-button-link elementor-size-md" href="#" data-open-contextual-popup="true" role="button"><span class="elementor-button-content-wrapper"><span class="elementor-button-text">${ctaLabel}</span></span></a></div></div>`;

  return html.replace(
    /<div class="elementor-element elementor-element-00cc55a[\s\S]*?<\/div>\s*<div class="elementor-element elementor-element-b13fc5e[\s\S]*?<\/div>\s*<\/div>/i,
    ctaBlock,
  );
}

/** Replace broken Sticklight calculator iframes with native React embed slots. */
export function replaceBrokenCalculatorEmbeds(html: string): string {
  return html
    .replace(
      /<div style="background:\s*linear-gradient\(135deg,\s*#0a0f1a[\s\S]*?id="roi-calculator-iframe"[\s\S]*?<\/div>/i,
      ROI_CALCULATOR_EMBED_SLOT,
    )
    .replace(
      /<div[^>]*>[\s\S]*?sticklight\.app[\s\S]*?<\/div>/gi,
      (match) => {
        if (!match.includes("iframe")) return match;
        if (/pricing-calculator/i.test(match)) return PRICING_CALCULATOR_EMBED_SLOT;
        if (/roi-calculator-iframe/i.test(match)) return ROI_CALCULATOR_EMBED_SLOT;
        return PRICING_CALCULATOR_EMBED_SLOT;
      },
    );
}

/** Legacy Elementor HTML widgets shipped a full mini-document calculator — swap for the React embed. */
export function replaceLegacyInlinePricingCalculator(html: string): string {
  if (!html.includes("siteCostCalculator") && !html.includes("calculator-container")) {
    return html;
  }
  const widgetShell =
    '<div class="elementor-element elementor-widget elementor-widget-html article-pricing-calculator-embed">';
  return html.replace(
    /<div class="elementor-element[^"]*\belementor-widget-html\b[^"]*"[^>]*>[\s\S]*?(?:siteCostCalculator|calculator-container)[\s\S]*?<\/div>/gi,
    `${widgetShell}${PRICING_CALCULATOR_EMBED_SLOT}</div>`,
  );
}

export type PrepareArticleBodyHtmlOptions = {
  /** When true, skips batch8 enrichment/structure (for before/after audits). */
  skipBatch8?: boolean;
  /** When true, skips batch9 enrichment/structure (for before/after audits). */
  skipBatch9?: boolean;
  /** When true, skips final rollout enrichment/structure (for before/after audits). */
  skipFinalRollout?: boolean;
};

export function prepareArticleBodyHtml(
  rawHtml: string,
  locale: Locale = "he",
  pagePath?: string,
  options?: PrepareArticleBodyHtmlOptions,
): {
  html: string;
  headings: ArticleHeading[];
} {
  let html = stripEmbeddedArticleSidebar(rawHtml);
  html = injectPageSpeedInsightsEmbed(html);
  html = stripElementorFormWidgets(html);
  html = replaceSpeedArticleOrphanLeadPrompt(html, locale);
  html = stripLegacyArticleContactBlocks(html);
  html = replaceBrokenCalculatorEmbeds(html);
  html = replaceLegacyInlinePricingCalculator(html);
  html = stripEmptyImageWidgets(html);
  html = stripEmptyElementorSections(html);
  html = stripLeadingRedundantElementorSections(html);
  html = stripEmptyImageWidgets(html);
  html = repairArticleCtaLinks(html);
  html = wrapRepairedArticleCtaBlocks(html);
  html = html.replace(
    /<div class="elementor-widget-container">\s*<h1[^>]*>[\s\S]*?<\/h1>\s*<\/div>/i,
    "",
  );
  html = downgradeEmbeddedH1(html);
  html = polishPageSpeedArticleHtml(html);
  html = trimPageSpeedArticleSpacers(html);
  html = injectPageSpeedCrossLinks(html);
  html = polishWordPressCostArticleHtml(html);
  html = polishGoogleSeoArticleHtml(html);
  html = polishRussianDigitalArticleHtml(html);
  html = polishContentInternalLinks(html);
  if (pagePath) {
    html = applyArticlePilotEnrichment2026(html, pagePath, locale);
    html = applyArticleBatch2Enrichment2026(html, pagePath, locale);
    html = applyArticleBatch3Enrichment2026(html, pagePath, locale);
    html = applyArticleBatch4Enrichment2026(html, pagePath, locale);
    html = applyArticleBatch4StructurePolish(html, pagePath, locale);
    html = applyArticleBatch5Pilot2026(html, pagePath, locale);
    html = applyArticleBatch5StructurePolish(html, pagePath, locale);
    html = applyArticleBatch6Enrichment2026(html, pagePath, locale);
    html = applyArticleBatch6StructurePolish(html, pagePath, locale);
    html = applyArticleBatch7Enrichment2026(html, pagePath, locale);
    html = applyArticleBatch7StructurePolish(html, pagePath, locale);
    if (!options?.skipBatch8) {
      html = applyArticleBatch8Enrichment2026(html, pagePath, locale);
      html = applyArticleBatch8StructurePolish(html, pagePath, locale);
    }
    if (!options?.skipBatch9) {
      html = applyArticleBatch9Enrichment2026(html, pagePath, locale);
      html = applyArticleBatch9StructurePolish(html, pagePath, locale);
    }
    if (!options?.skipFinalRollout) {
      html = applyArticleFinalRolloutEnrichment2026(html, pagePath, locale);
      html = applyArticleFinalRolloutStructurePolish(html, pagePath, locale);
    }
    html = applyArticleReadingPolishShared(html, pagePath, locale);
    html = applyPilot2026BodyPolish(html, pagePath, locale);
    html = consolidateDuplicateFaqSections(html, locale);
    html = applyArticleFaqAccordionPresentation(html, locale);
    html = polishGoogleMapsArticleHtml(html);
  }

  const headings = extractArticleHeadings(html);
  html = injectHeadingAnchors(html, headings);
  return { html, headings };
}

/** Count embedded H1 tags in raw post HTML (before migration cleanup). */
export function countEmbeddedH1(html: string): number {
  const cleaned = stripEmbeddedArticleSidebar(html);
  return (cleaned.match(/<h1[\s>]/gi) || []).length;
}

export function getCategoryLabel(content: ContentItem, locale: Locale = "he"): string | undefined {
  const id = content.categoryIds?.[0];
  if (!id) return undefined;
  return getCategories(locale).get(id)?.title;
}

export function getRelatedArticles(content: ContentItem, limit = 4, locale: Locale = "he"): ContentItem[] {
  const categoryId = content.categoryIds?.[0];
  let posts: ContentItem[];

  if (categoryId) {
    posts = getPostsForCategory(categoryId, locale).filter((p) => p.path !== content.path);
    if (posts.length < limit) {
      const recent = getAllPosts(locale).filter((p) => p.path !== content.path);
      const seen = new Set(posts.map((p) => p.path));
      for (const post of recent) {
        if (posts.length >= limit) break;
        if (!seen.has(post.path)) {
          posts.push(post);
          seen.add(post.path);
        }
      }
    }
  } else {
    posts = getAllPosts(locale).filter((p) => p.path !== content.path);
  }

  return posts.slice(0, limit);
}

export type AdjacentArticles = {
  previous: ContentItem | null;
  next: ContentItem | null;
};

/** Previous = older article; next = newer article (matches blog date order). */
export function getAdjacentArticles(content: ContentItem, locale: Locale = "he"): AdjacentArticles {
  const posts = getAllPosts(locale);
  const index = posts.findIndex((post) => post.path === content.path);
  if (index === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: posts[index + 1] ?? null,
    next: posts[index - 1] ?? null,
  };
}

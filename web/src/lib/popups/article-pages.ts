import { decodeHtmlEntities } from "@/lib/content/paths";
import { applyArticlePopupOverrides } from "@/lib/popups/article-popup-overrides";
import { getPopupMessaging } from "@/lib/popups/messaging";
import type { PopupConfig, PopupContextKey } from "@/lib/popups/types";
import { normalizePath } from "@/lib/content/paths";
import type { ContentItem } from "@/lib/content/types";

const WEBSITE_SPEED_TEST_PATHS = new Set([
  "/בדיקת-מהירות-אתר/",
  "/en/website-speed-test/",
]);

/** Category ID → popup context (from categories.json). */
const CATEGORY_CONTEXT: Record<number, PopupContextKey> = {
  227: "google-ads", // גוגל
  229: "google-ads", // קידום ממומן
  412: "seo", // קידום אורגני
  226: "website", // בניית אתרים
  228: "meta-ads", // פייסבוק
  230: "digital-marketing", // פרסום באינטרנט
  231: "digital-marketing", // שיווק באינטרנט
  232: "digital-marketing", // סוכנות דיגיטל
  1: "digital-marketing", // שיווק דיגיטלי
};

/** When a post has many categories, prefer the most specific service context (not WP list order). */
const CATEGORY_CONTEXT_PRIORITY: PopupContextKey[] = [
  "google-maps",
  "google-ads",
  "meta-ads",
  "seo",
  "hosting",
  "digital-marketing",
  "website",
];

function resolveContextFromCategories(categoryIds?: number[]): PopupContextKey | null {
  if (!categoryIds?.length) return null;
  const contexts = new Set(
    categoryIds
      .map((id) => CATEGORY_CONTEXT[id])
      .filter((key): key is PopupContextKey => Boolean(key)),
  );
  for (const key of CATEGORY_CONTEXT_PRIORITY) {
    if (contexts.has(key)) return key;
  }
  return null;
}

function normalizeText(value: string): string {
  return decodeHtmlEntities(value).toLowerCase();
}

/** Conservative title/path keyword mapping — only when signal is clear. */
function inferContextFromText(title: string, path: string): PopupContextKey | null {
  const text = normalizeText(`${title} ${path}`);

  if (
    text.includes("google-business-profile") ||
    text.includes("גוגל-מפות") ||
    text.includes("גוגל מפות") ||
    text.includes("google maps")
  ) {
    return "google-maps";
  }

  if (
    text.includes("google-ads") ||
    text.includes("גוגל אדס") ||
    text.includes("פרסום בגוגל") ||
    text.includes("פרסום ממומן") ||
    text.includes("ppc") ||
    text.includes("sem")
  ) {
    return "google-ads";
  }

  if (
    text.includes("פייסבוק") ||
    text.includes("אינסטגרם") ||
    text.includes("facebook") ||
    text.includes("instagram") ||
    text.includes("meta ads")
  ) {
    return "meta-ads";
  }

  if (
    text.includes("קידום אורגני") ||
    text.includes("קידום אתרים") ||
    text.includes("/seo") ||
    text.includes(" seo") ||
    text.includes("aeo") ||
    text.includes("aio")
  ) {
    return "seo";
  }

  if (
    text.includes("בניית אתר") ||
    text.includes("דף נחיתה") ||
    text.includes("וורדפרס") ||
    text.includes("website") ||
    text.includes("landing")
  ) {
    return "website";
  }

  if (
    text.includes("פרסום דיגיטלי") ||
    text.includes("שיווק דיגיטלי") ||
    text.includes("שיווק באינטרנט") ||
    text.includes("פרסום באינטרנט") ||
    text.includes("סוכנות דיגיטל") ||
    text.includes("digital marketing") ||
    text.includes("digital advertising")
  ) {
    return "digital-marketing";
  }

  if (text.includes("אחסון") || text.includes("hosting") || text.includes("תחזוק")) {
    return "hosting";
  }

  return null;
}

export function resolveArticlePopupContextKey(content: ContentItem): PopupContextKey {
  const pagePath = normalizePath(content.path ?? "");
  if (WEBSITE_SPEED_TEST_PATHS.has(pagePath)) {
    return "website-speed";
  }

  const fromText = inferContextFromText(content.title, content.path);
  const fromCategory = resolveContextFromCategories(content.categoryIds);
  return fromText ?? fromCategory ?? "general";
}

export function resolveArticlePopupConfig(
  content: ContentItem,
  locale: import("@/i18n/routing").Locale = "he",
): PopupConfig {
  const pagePath = normalizePath(content.path ?? "");
  if (WEBSITE_SPEED_TEST_PATHS.has(pagePath)) {
    const messaging = getPopupMessaging("website-speed", locale);
    const slugPart = pagePath.replace(/\//g, "-").replace(/^-|-$/g, "") || "speed-test";
    return applyArticlePopupOverrides(
      {
        ...messaging,
        popupId: `article-website-speed-${slugPart}`,
        audience: "article",
        pageTitle: decodeHtmlEntities(content.title),
        pagePath,
        locale,
      },
      locale,
    );
  }

  const context = resolveArticlePopupContextKey(content);

  const messaging = getPopupMessaging(context, locale);
  const slugPart = content.path.replace(/\//g, "-").replace(/^-|-$/g, "") || "article";

  return applyArticlePopupOverrides(
    {
      ...messaging,
      popupId: `article-${context}-${slugPart}`,
      audience: "article",
      pageTitle: decodeHtmlEntities(content.title),
      pagePath: content.path,
      locale,
    },
    locale,
  );
}

import { decodeHtmlEntities } from "@/lib/content/paths";
import { getPopupMessaging } from "@/lib/popups/messaging";
import type { PopupConfig, PopupContextKey } from "@/lib/popups/types";
import type { ContentItem } from "@/lib/content/types";

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

  if (text.includes("אחסון") || text.includes("hosting") || text.includes("תחזוק")) {
    return "hosting";
  }

  return null;
}

export function resolveArticlePopupConfig(
  content: ContentItem,
  locale: import("@/i18n/routing").Locale = "he",
): PopupConfig {
  const categoryId = content.categoryIds?.[0];
  const fromCategory = categoryId ? CATEGORY_CONTEXT[categoryId] : null;
  const fromText = inferContextFromText(content.title, content.path);
  const context = fromText ?? fromCategory ?? "general";

  const messaging = getPopupMessaging(context, locale);
  const slugPart = content.path.replace(/\//g, "-").replace(/^-|-$/g, "") || "article";

  return {
    ...messaging,
    popupId: `article-${context}-${slugPart}`,
    audience: "article",
    pageTitle: decodeHtmlEntities(content.title),
    pagePath: content.path,
    locale,
  };
}

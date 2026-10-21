import type { Locale } from "@/i18n/routing";
import { getPopupMessaging } from "@/lib/popups/messaging";
import { resolveArticlePopupContextKey } from "@/lib/popups/article-pages";
import type { ContentItem } from "./types";

/** Bottom-of-article CTA copy aligned with popup context for this post. */
export function resolveArticleEndCta(
  content: ContentItem,
  locale: Locale = "he",
): { text: string; button: string } {
  const context = resolveArticlePopupContextKey(content);
  const messaging = getPopupMessaging(context, locale);
  return {
    text: messaging.headline,
    button: locale === "en" ? "Talk to us" : "דברו איתנו",
  };
}

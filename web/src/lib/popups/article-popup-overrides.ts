import type { Locale } from "@/i18n/routing";
import { normalizePath } from "@/lib/content/paths";
import type { PopupConfig } from "@/lib/popups/types";

type ArticlePopupCopyOverride = Partial<
  Pick<PopupConfig, "headline" | "description" | "ctaLabel" | "contextLabel">
>;

/** Per-article popup copy (Hebrew paths). Context resolution stays unchanged. */
const HEBREW_ARTICLE_POPUP_OVERRIDES: Record<string, ArticlePopupCopyOverride> = {
  "/פרסום-דיגיטלי-בשפה-הרוסית/": {
    contextLabel: "פרסום ברוסית",
    headline: "רוצים להגיע ללקוחות דוברי רוסית?",
    description:
      "נבנה עבורכם אסטרטגיית פרסום מותאמת לקהל דוברי רוסית בישראל, עם מסרים מדויקים וקמפיינים שמתאימים לעסק שלכם.",
    ctaLabel: "בואו נדבר על הפרסום שלכם",
  },
  "/בניית-אתרים-ברוסית/": {
    contextLabel: "בניית אתרים ברוסית",
    headline: "רוצים אתר או דף נחיתה לקהל דובר רוסית?",
    description:
      "נבחן יחד איך אתר דו-לשוני או ברוסית יכול לתמוך בקמפיינים ולהביא פניות מהמגזר הרוסי בישראל — בלי ניסוחים גנריים.",
    ctaLabel: "בקשת ייעוץ לבניית אתר",
  },
  "/קידום-אתרים-ברוסית/": {
    contextLabel: "קידום אתרים ברוסית",
    headline: "רוצים לקדם את האתר בגוגל לקהל דובר רוסית?",
    description:
      "נבדוק את מצב ה-SEO שלכם (עברית ורוסית) ונציע תוכנית קידום מותאמת למגזר הרוסי — מדידה, תוכן וטכני.",
    ctaLabel: "בקשת ייעוץ SEO",
  },
};

export function applyArticlePopupOverrides(
  config: PopupConfig,
  locale: Locale = "he",
): PopupConfig {
  if (locale !== "he") return config;

  const pathKey = normalizePath(config.pagePath);
  const override = HEBREW_ARTICLE_POPUP_OVERRIDES[pathKey];
  if (!override) return config;

  return {
    ...config,
    ...override,
    popupId: `${config.popupId}--tailored`,
  };
}
import type { Locale } from "@/i18n/routing";
import { normalizePath } from "@/lib/content/paths";
import {
  buildArticleFaqBlock,
  buildArticleLeadBlock,
  htmlHasArticleLead,
  injectArticleFaq,
  injectArticleLead,
} from "@/lib/content/article-content-blocks";
import { htmlHasArticleFaq } from "@/lib/content/article-faq-detect";

type BatchConfig = {
  postMarker: string;
  lead: (locale: Locale) => string;
  faq?: (locale: Locale) => string;
};

const BATCH4_HE: Record<string, BatchConfig> = {
  "/פרסום-בגוגל-7-אסטרטגיות/": {
    postMarker: "elementor-20897",
    lead: () =>
      buildArticleLeadBlock("he", [
        "שבע אסטרטגיות פרסום בגוגל לצמיחה: מבנה קמפיינים, מילות מפתח, דפי נחיתה ומדידה — מדריך מעשי לעסקים שרוצים להרחיב תוצאות ממומנות.",
        "מתאים למי שכבר מפרסם או מתכנן להתחיל; לליווי מקצועי ראו <a href=\"/google-ads/\">פרסום בגוגל</a> ולמאמר <a href=\"/פרסום-בגוגל-אדס-10-שלבים-פשוטים/\">10 שלבים להקמת קמפיין</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "האם חייבים להפעיל את כל שבע האסטרטגיות יחד?",
          answer:
            "לא. בוחרים 2–3 כיוונים שמתאימים ליעד ולתקציב (למשל חיפוש + רימרקטינג), ומוסיפים ערוצים כשיש מדידה ותוצאות.",
        },
        {
          question: "מה כדאי למדוד לפני שמגדילים תקציב?",
          answer:
            "המרות או לידים איכותיים, עלות להמרה ואחוז המרה מדף הנחיתה — לא רק קליקים.",
        },
        {
          question: "מתי כדאי לעבור לניהול חיצוני?",
          answer:
            "כשהתקציב צומח, יש כמה סוגי קמפיינים במקביל וצריך אופטימיזציה שוטפת — ואין זמן פנימי לבדיקות שבועיות.",
        },
      ]),
  },
  "/חברה-לשיווק-דיגיטלי/": {
    postMarker: "elementor-20803",
    lead: () =>
      buildArticleLeadBlock("he", [
        "מאמר זה מסביר מה חברה לשיווק דיגיטלי מספקת בפועל: תהליך עבודה, שירותים ותיאום בין ערוצים — לעסקים ששוקלים שותף חיצוני.",
        "אין הבטחת תוצאות; ראו גם <a href=\"/סוכנות-שיווק-דיגיטלית/\">סוכנות שיווק דיגיטלי</a> ו<a href=\"/שירותי-שיווק-דיגיטלי/\">שירותי שיווק דיגיטלי</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "מה ההבדל בין «חברה לשיווק» לסוכנות דיגיטלית?",
          answer:
            "לעיתים אין הבדל בשם בלבד. חשוב לבדוק אילו שירותים כלולים, מי מנהל חשבונות ואיך נראים דוחות ותקשורת.",
        },
        {
          question: "איך יודעים אם החברה מתאימה לעסק שלי?",
          answer:
            "בפגישת היכרות: יעדים, תקציב משוער, ניסיון בתחום שלכם ודוגמאות עבודה — לא הבטחות דירוג או מספרי ROI מומצאים.",
        },
      ]),
  },
  "/כך-בוחרים-חברה-לשיווק-דיגיטלי/": {
    postMarker: "elementor-21716",
    lead: () =>
      buildArticleLeadBlock("he", [
        "מדריך בחירה לחברת שיווק דיגיטלי: שאלות לשאול, סימני אזהרה ומה לצפות מההתקשרות — כדי לקבל החלטה מבוססת.",
        "מתאים לעסקים שמשווים הצעות; קישור ל<a href=\"/חברה-לשיווק-דיגיטלי/\">חברה לשיווק דיגיטלי</a> ול<a href=\"/seo/\">קידום אתרים</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "כמה הצעות מחיר כדאי לבקש?",
          answer:
            "לרוב 2–3 הצעות מפורטות מאותו בריף (יעדים, תקציב, ערוצים) נותנות תמונה טובה — בלי להתחייב ל«הכי זול».",
        },
        {
          question: "מה חובה להופיע בהצעה?",
          answer:
            "היקף שירות, מה כלול ומה לא, אחריות מדידה, תדירות דוחות ואיך משתנים התנאים כשמגדילים תקציב.",
        },
      ]),
  },
  "/קידום-אתרים-מדריך-למתחילים/": {
    postMarker: "elementor-21115",
    lead: () =>
      buildArticleLeadBlock("he", [
        "מדריך קידום אתרים למתחילים בשישה שלבים: מחקר, אופטימיזציה טכנית, תוכן, קישורים ומדידה — בסיס לצמיחה אורגנית ב-2026.",
        "למחירים ראו <a href=\"/מחיר-קידום-אתרים/\">מחירון קידום</a>; לשירות: <a href=\"/seo/\">SEO מקצועי</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "כמה זמן לוקח לראות תוצאות SEO?",
          answer:
            "בדרך כלל שבועות עד חודשים, לפי תחרות, מצב האתר ועקביות. אין לוח זמנים קבוע לכולם.",
        },
        {
          question: "האם אפשר לקדם אתר בלי בלוג?",
          answer:
            "כן במקרים מסוימים, אבל תוכן איכותי ועמודי שירות חזקים בדרך כלל מקלים על דירוג לשאילתות רלוונטיות.",
        },
      ]),
  },
  "/יועץ-דיגיטל-הוא-השותף-שלך-להצלחה/": {
    postMarker: "elementor-20092",
    lead: () =>
      buildArticleLeadBlock("he", [
        "מה עושה יועץ דיגיטלי בפועל, מתי שכירת יועץ או סוכנות מצדיקה את עצמה, ואיך לחבר בין אסטרטגיה לביצוע.",
        "מתאים לעסקים שבונים צוות חיצוני; קישורים ל<a href=\"/יועץ-שיווק-באינטרנט/\">יועץ שיווק באינטרנט</a> ול<a href=\"/google-ads/\">פרסום ממומן</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "יועץ דיגיטלי מול סוכנות מלאה — מה עדיף?",
          answer:
            "יועץ מתאים לכיוון ותוכנית עבודה; סוכנות כוללת בדרך כלל ביצוע שוטף (פרסום, SEO, תוכן). התשובה תלויה בגודל תקציב וביכולת פנימית.",
        },
        {
          question: "מה לבקש בפגישה ראשונה עם יועץ?",
          answer:
            "סקירת מצב נוכחי, יעדים, תקציב משוער, ערוצים מומלצים ותוכנית מדידה — בלי התחייבות מיידית.",
        },
      ]),
  },
};

function applyMap(
  html: string,
  path: string,
  locale: Locale,
  map: Record<string, BatchConfig>,
): string {
  const pilot = map[normalizePath(path)];
  if (!pilot) return html;

  let next = html;
  if (!htmlHasArticleLead(html)) {
    next = injectArticleLead(next, pilot.lead(locale));
  }
  if (pilot.faq && !htmlHasArticleFaq(html)) {
    next = injectArticleFaq(next, pilot.faq(locale), pilot.postMarker);
  }
  return next;
}

/** Batch 4 — 5 HE articles (Google Ads, agency, SEO beginner, consultant). */
export function applyArticleBatch4Enrichment2026(html: string, path: string, locale: Locale): string {
  if (locale === "he") return applyMap(html, path, locale, BATCH4_HE);
  return html;
}
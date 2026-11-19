import type { Locale } from "@/i18n/routing";
import { normalizePath } from "@/lib/content/paths";
import {
  buildArticleFaqBlock,
  buildArticleLeadBlock,
  htmlHasArticleFaq,
  htmlHasArticleLead,
  injectArticleFaq,
  injectArticleLead,
} from "@/lib/content/article-content-blocks";

type PilotConfig = {
  postMarker: string;
  lead?: (locale: Locale) => string;
  faq?: (locale: Locale) => string;
  /** Skip FAQ when the migrated article already has a useful FAQ block. */
  skipFaqIfPresent?: boolean;
};

const PILOTS: Record<string, PilotConfig> = {
  "/אסטרטגיות-שיווק-דיגיטלי-2025/": {
    postMarker: "elementor-21776",
    skipFaqIfPresent: true,
    lead: () =>
      buildArticleLeadBlock("he", [
        "המדריך מסכם עקרונות לתכנון שיווק דיגיטלי — תקציב, ערוצים, מדידה ותוכן — עם דוגמאות מעשיות לעסקים בישראל.",
        "הכותרת מתייחסת ל-2025, אך רוב המסגרת רלוונטית גם ב-2026: הדגש עובר ל-AI בחיפוש, מדידה ב-GA4, פרסום ממוקד ואיכות נכסים דיגיטליים. אין כאן הבטחות תוצאה; רק מה לבדוק ולתעדף.",
      ]),
  },
  "/עתיד-ה-seo-כך-ייראה-הקידום-האורגני-ב-2025-ומעב/": {
    postMarker: "elementor-21817",
    skipFaqIfPresent: true,
    lead: () =>
      buildArticleLeadBlock("he", [
        "מאמר זה נכתב במבט לעתיד ה-SEO סביב 2025; ב-2026 רואים בשטח יותר חשיפות AI, דגש על E-E-A-T ומהירות, ופחות קיצורי דרך.",
        "תוכן המאמר מסביר כיוונים ארוכי טווח. לעדכון מעשי על AI Overviews וכתיבה לסקירות AI, ראו גם את המאמר <a href=\"/seo-2026-ai-answers/\">SEO 2026 וסקירות AI בגוגל</a>.",
      ]),
  },
  "/seo-2026-ai-answers/": {
    postMarker: "elementor-22368",
    lead: () =>
      buildArticleLeadBlock("he", [
        "Google מציג יותר תשובות מסוכנות AI (AI Overviews) בראש התוצאות. המאמר מסביר מה זה משנה בפרקטיקה של קידום אתרים, כתיבה ומבנה דפים.",
        "תמצאו הסבר על AEO, איכות תוכן, נתונים מובנים וטעויות נפוצות — בלי להבטיח הופעה בכל שאילתה.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "האם AI Overviews מחליף את SEO?",
          answer:
            "לא. זה משנה אילו תוצאות מקבלות קליקים, אבל אתרים עם תוכן מדויק, מהיר ומהימן עדיין צריכים קידום אורגני, טכני ומדידה.",
        },
        {
          question: "מה אפשר לעשות בלי הבטחת מקום ב-AI?",
          answer:
            "לענות בבירור על שאלות נפוצות, לשמור על מבנה כותרות תקין, לעדכן עובדות והמחאות, ולמדוד תנועה ולידים ב-GA4 ו-Search Console.",
        },
        {
          question: "מתי כדאי לפנות לסוכנות?",
          answer:
            "כשחסרה שכבת תוכן, הטכני או המדידה, או כשיש ירידה בביצועים ואין זמן פנימי לבחון גורמים אחד-אחד.",
        },
      ]),
  },
  "/מחיר-קידום-אתרים/": {
    postMarker: "elementor-21161",
    lead: () =>
      buildArticleLeadBlock("he", [
        "מדריך להבנת מה משפיע על מחיר קידום אתרים: היקף תחרות, מצב האתר, תוכן, קישורים ושילוב עם פרסום ממומן.",
        "אין כאן מחירון מחייב — רק גורמים שבוחנים סוכנויות ומה כדאי לבקש בייעוץ.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "למה שני הצעות מחיר לקידום יכולות להיות שונות מאוד?",
          answer:
            "כי היקף העבודה שונה: מספר מילות מפתח, שפות, תחומים תחרותיים, כתיבת תוכן, קישורים, דוחות, ולעיתים גם פרסום ממומן משולב.",
        },
        {
          question: "כמה זמן לוקח לראות תוצאות?",
          answer:
            "לרוב סימנים ראשונים תוך חודשים — תלוי בתחרות, גיל האתר והיסטוריית הענישות. אין לוח זמנים אחיד לכל ענף.",
        },
        {
          question: "האם מחיר נמוך אומר קידום איכותי?",
          answer:
            "לא בהכרח. חשוב לבדוק מה כלול: אסטרטגיה, טכני, תוכן, שקיפות בדוחות ואיך נמדדת הצלחה.",
        },
      ]),
  },
  "/שיווק-בפייסבוק-ואינסטגרם/": {
    postMarker: "elementor-21578",
    skipFaqIfPresent: true,
    lead: () =>
      buildArticleLeadBlock("he", [
        "שיווק ב-Meta (פייסבוק ואינסטגרם) מתאים לעסקים שרוצים להגיע לקהל לפי עניין, מיקום וגיל — במיוחד ל-branding ולידים.",
        "המאמר עודכן תחת הכותרת המקורית (2025); ב-2026 הדגש הוא על קריאייטיב, מדידה, זהות עסק ב-Meta ושילוב עם אתר ונתונים — בלי ודאות תוצאה.",
      ]),
  },
};

export function applyArticlePilotEnrichment2026(html: string, path: string, locale: Locale): string {
  if (locale !== "he") return html;
  const key = normalizePath(path);
  const pilot = PILOTS[key];
  if (!pilot) return html;

  let next = html;
  if (pilot.lead && !htmlHasArticleLead(html)) {
    next = injectArticleLead(next, pilot.lead(locale));
  }
  if (pilot.faq && !(pilot.skipFaqIfPresent && htmlHasArticleFaq(html))) {
    next = injectArticleFaq(next, pilot.faq(locale), pilot.postMarker);
  }
  return next;
}

export const PILOT_ARTICLE_PATHS = Object.keys(PILOTS);
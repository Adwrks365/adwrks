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

const BATCH3_HE: Record<string, BatchConfig> = {
  "/פרסום-בגוגל-אדס-10-שלבים-פשוטים/": {
    postMarker: "elementor-20919",
    lead: () =>
      buildArticleLeadBlock("he", [
        "מדריך מעשי להקמת קמפיין ב-Google Ads: מחשבון Google, יעדים, מבנה קמפיין, מילות מפתח, מודעות ומדידה.",
        "מתאים לעסקים שמתחילים בפרסום ממומן — ללא הבטחת תוצאה; לעומק בשירות <a href=\"/google-ads/\">פרסום בגוגל</a> שלנו.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "כמה תקציב יומי מינימלי כדאי להתחיל איתו?",
          answer:
            "תלוי בתחום ויעד, אבל לרוב מתחילים בטווח שנותן מספיק קליקים לבדיקה (לעיתים כמה עשרות שקלים ביום) ומגדילים אחרי מדידה — לא מתחייבים למספר אחד לכל עסק.",
        },
        {
          question: "האם חובה לבנות דף נחיתה נפרד לכל קמפיין?",
          answer:
            "לא תמיד, אבל דף שמתאים להודעה במודעה בדרך כלל משפר המרות. לפחות ודאו שהדף מהיר, ברור ומכיל קריאה לפעולה אחת בולטת.",
        },
        {
          question: "מתי כדאי לעבור לניהול מקצועי?",
          answer:
            "כשהתקציב צומח, יש כמה קמפיינים במקביל, אושאתם רואים בזבוז בקליקים בלי המרות — וצריך אופטימיזציה שוטפת ודוחות ברורים.",
        },
      ]),
  },
  "/כמה-עולה-פרסום-בגוגל/": {
    postMarker: "elementor-21638",
    lead: () =>
      buildArticleLeadBlock("he", [
        "סיכום גורמים שקובעים תקציב פרסום בגוגל: תחרות, סוג קמפיין, גיאוגרפיה ואיכות דף הנחיתה — בלי מחירון מחייב.",
        "ב-2026 עדיין אין «מחיר אחיד» לקליק; קודם מגדירים יעד עסקי ומדידה, ואז מתאימים תקציב. קשור: <a href=\"/פרסום-בגוגל-אדס-10-שלבים-פשוטים/\">10 שלבים להתחלה בגוגל אדס</a> ו<a href=\"/google-ads/\">פרסום בגוגל</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "למה אין מחיר קבוע לפרסום בגוגל?",
          answer:
            "המחיר נקבע במכרז בזמן אמת לפי תחרות על מילות מפתח, מיקום, סוג מודעה ואיכות דף הנחיתה. לכן אותה מילה יכולה לעלות שונה בין תחומים ואזורים.",
        },
        {
          question: "איך בוחרים תקציב יומי הגיוני?",
          answer:
            "מגדירים יעד (לידים/מכירות), מעריכים שווי המרה ומתחילים בתקציב שמאפשר נפח בדיקה; אחרי שבועות עם מדידה מתאימים לפי ביצועים — בלי להבטיח ROI.",
        },
        {
          question: "מה משפיע על עלות הקליק (CPC)?",
          answer:
            "תחרות, רלוונטיות המודעות, ציון איכות, מבנה קמפיין והתאמה בין מודעה לדף. שיפור באיכות ובהתאמה יכול להוריד עלות לקליק בלי להוריד נפח בהכרח.",
        },
      ]),
  },
  "/כמה-עולה-לבנות-אתר-אינטרנט-בוורדפרס/": {
    postMarker: "elementor-19792",
    lead: () =>
      buildArticleLeadBlock("he", [
        "מחירון רוחבי לבניית אתר וורדפרס ותחזוקה: דומיין, אחסון, עיצוב, תוכן, תוספים ואחזקה — הטווחים במאמר אינם הצעת מחיר מחייבת.",
        "הכותרת מציינת 2026; גורמי מחיר כוללים גם נגישות, אבטחה ומהירות. לשירות: <a href=\"/website-building/\">בניית אתרים</a> ו<a href=\"/hosting-plans/\">אחסון אתרים</a>.",
      ]),
  },
  "/פרסום-בגוגל-מפות/": {
    postMarker: "elementor-20155",
    lead: () =>
      buildArticleLeadBlock("he", [
        "פרסום ונראות בגוגל מפות ובפרופיל העסק: אופטימיזציה בחינם, ביקורות ופרסום ממומן כשצריך טווח רחב יותר.",
        "רלוונטי לעסקים מקומיים; משלב נכון עם <a href=\"/google-ads/\">Google Ads</a> ועם ניהול פרופיל העסק.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "האם חייבים לשלם כדי להופיע בגוגל מפות?",
          answer:
            "לא. אפשר להתחיל מאופטימיזציה של פרופיל העסק (Google Business Profile), קטגוריות, שעות, תמונות וביקורות. פרסום ממומן מוסיף חשיפה מעבר לנוכחות האורגנית.",
        },
        {
          question: "מה ההבדל בין «מפות» לבין קמפיין חיפוש רגיל?",
          answer:
            "מפות וקמפיינים מקומיים מיועדים לכוונת «לידים או ביקור קרוב»; חיפוש כללי מכוון יותר לשאילתות רחבות. לעיתים משלבים את שניהם לפי אזור שירות.",
        },
      ]),
  },
  "/מה-ההבדל-בין-sem-ל-ppc/": {
    postMarker: "elementor-20529",
    lead: () =>
      buildArticleLeadBlock("he", [
        "הסבר קצר על SEM מול PPC: למה לפעמים מתבלבלים, מה כל מונח כולל בפועל ואיך זה משפיע על תקציב ומדידה.",
        "מאמר עזר לפני בחירת ערוצים — קישורים ל<a href=\"/google-ads/\">פרסום ממומן</a> ול<a href=\"/seo/\">קידום אורגני</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "האם PPC ו-SEM אותו הדבר?",
          answer:
            "לא בדיוק. PPC מתאר תשלום לפי קליק או חשיפה; SEM לעיתים משמש כמטריית-על לכל שיווק במנועי חיפוש — כולל ממומן ולעיתים גם SEO. בהקשר רבים SEM = paid search.",
        },
        {
          question: "מה עדיף לעסק קטן — SEO או PPC?",
          answer:
            "תלוי ביעד ובזמן. PPC נותן חשיפה מהירה כשיש תקציב ומדידה; SEO בונה נכס ארוך טווח. לעיתים מתחילים בממוקד ומחזקים אורגני במקביל.",
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

/** Batch 3 — 5 HE commercial-intent articles (no PR #4/#5 pilots). */
export function applyArticleBatch3Enrichment2026(html: string, path: string, locale: Locale): string {
  if (locale === "he") return applyMap(html, path, locale, BATCH3_HE);
  return html;
}
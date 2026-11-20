import type { Locale } from "@/i18n/routing";
import { normalizePath } from "@/lib/content/paths";
import {
  buildArticleFaqBlock,
  buildArticleLeadBlock,
  upsertArticleFaq,
  upsertArticleLead,
} from "@/lib/content/article-content-blocks";

type BatchConfig = {
  postMarker: string;
  lead: (locale: Locale) => string;
  faq: (locale: Locale) => string;
};

const BATCH5_HE: Record<string, BatchConfig> = {
  "/ניהול-עסק-בעידן-הדיגיטלי/": {
    postMarker: "elementor-20051",
    lead: () =>
      buildArticleLeadBlock("he", [
        "ניהול עסק ב-2026 דורש שילוב בין תפעול, שירות לקוחות ונוכחות דיגיטלית: אתר אמין, ערוצי פנייה ברורים, מדידה ב-GA4 ולפחות ערוץ אחד שמייצר לידים באופן עקבי.",
        "במאמר: אוטומציה בסיסית, סושיאל, ניהול מוניטין ברשת ובחירת כלים בלי לפרוש יותר מדי. להמשך: <a href=\"/שירותי-שיווק-דיגיטלי/\">שירותי שיווק דיגיטלי</a> · <a href=\"/seo/\">קידום אתרים</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "מה הצעד הראשון לעסק קטן שאין לו זמן לדיגיטל?",
          answer:
            "להגדיר נקודת פנייה אחת (טופס/ווטסאפ), לוודא שהאתר טוען מהר ומדידה עובדת, ואז לבחור ערוץ אחד — בדרך כלל חיפוש או מדיה — לפי איפה הלקוחות מחפשים.",
        },
        {
          question: "האם חייבים נוכחות בכל הרשתות?",
          answer:
            "לא. עדיף ערוץ אחד שמנוהל היטב על פני הרבה ערוצים עם תוכן דליל.",
        },
        {
          question: "איך יודעים אם ההשקעה הדיגיטלית מצדיקה את עצמה?",
          answer:
            "למדוד לידים או מכירות מיוחסות, לא רק חשיפות. להשוות עלות לרכישה לקוח מול ערך עסקה ממוצע.",
        },
        {
          question: "מתי כדאי לשלב ייעוץ חיצוני?",
          answer:
            "כשגדלים היקף הפרסום, יש כמה ערוצים במקביל ואין מי פנימי שמסנכרן נתונים ותוכן.",
        },
      ]),
  },
  "/יועץ-שיווק-באינטרנט/": {
    postMarker: "elementor-20081",
    lead: () =>
      buildArticleLeadBlock("he", [
        "יועץ שיווק באינטרנט אמור לעזור להגדיר יעדים, לבחור ערוצים ולהקים תהליך מדידה — לפני שמגדילים תקציב פרסום או מוציאים תוכן ללא כיוון.",
        "המאמר מתאים לבעלי עסקים שמחפשים ליווי נקודתי או מתמשך. קשור: <a href=\"/יועץ-אינטרנט/\">יועץ אינטרנט</a> · <a href=\"/חברה-לשיווק-דיגיטלי/\">חברה לשיווק דיגיטלי</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "מה ההבדל בין יועץ שיווק לסוכנות מלאה?",
          answer:
            "יועץ לרוב מוביל אסטרטגיה ופיקוח; סוכנות מבצעת גם פרסום, תוכן ועיצוב. חלק מהיועצים עובדים בתוך מודל היברידי.",
        },
        {
          question: "כמה שעות ייעוץ בחודש מספיקות לעסק קטן?",
          answer:
            "תלוי ביעדים. לעיתים מספיקות 2–4 שעות לסקירת ביצועים והחלטות תקציב, אם הביצוע בפנים או אצל ספק אחד.",
        },
        {
          question: "מה לבקש בפגישת היכרות?",
          answer:
            "ניסיון בתחום שלכם, אילו ערוצים מומלצים, איך ייראו הדוחות, ומה לא כלול בהצעה.",
        },
        {
          question: "האם יועץ צריך לנהל את חשבונות הפרסום בפועל?",
          answer:
            "לא בהכרח. חלק מנהלים חשבונות; אחרים רק בוחנים נתונים ומתאמים עם צוות הפעלה.",
        },
      ]),
  },
  "/יועץ-אינטרנט/": {
    postMarker: "elementor-20029",
    lead: () =>
      buildArticleLeadBlock("he", [
        "יועץ אינטרנט עוזר לתרגם מטרות עסקיות לנוכחות דיגיטלית: אתר, חיפוש, פרסום וכלים שמייצרים פניות — עם דגש על סדר עדיפויות ולא על «עוד ערוץ».",
        "מתאים כשיש אתר אבל אין תוצאות, או כשמתכננים הרחבה דיגיטלית. ראו גם <a href=\"/יועץ-שיווק-באינטרנט/\">יועץ שיווק באינטרנט</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "מתי עדיף יועץ אינטרנט על פני בניית אתר חדש?",
          answer:
            "כשהאתר הבסיסי תקין אבל חסר תנועה, מדידה או המרה — לרוב הבעיה בערוצים ולא בפלטפורמה.",
        },
        {
          question: "האם יועץ אינטרנט עוסק גם בטכני?",
          answer:
            "לעיתים בבדיקת מהירות, מבנה וסיסמאות בסיסיות; לעומק טכני בדרך כלל מפנים למפתח או לספק אחסון.",
        },
        {
          question: "מהו תוצר טיפוסי אחרי חודש עבודה?",
          answer:
            "מסמך יעדים, רשימת משימות לפי עדיפות, ולעיתים תוכנית פרסום או תוכן ראשונית עם KPI.",
        },
        {
          question: "איך נמדד הצלחת הייעוץ?",
          answer:
            "על פי KPI שהוגדרו מראש: לידים, עלות לליד, תנועה איכותית או שיפור המרה — לא לפי מספר פוסטים.",
        },
      ]),
  },
  "/אחסון-אתרים-מנוהל/": {
    postMarker: "elementor-19933",
    lead: () =>
      buildArticleLeadBlock("he", [
        "אחסון אתרים מנוהל אמור לכלול לא רק שרת: עדכוני אבטחה, גיבויים, ניטור זמינות ותמיכה כשהאתר נופל — קריטי לעסק שמסתמך על האתר ללידים.",
        "במדריך: מה להשוות בהצעות, מתי לשדרג מתוכנית בסיסית ומה קשור ל-<a href=\"/hosting-plans/\">תוכניות אחסון</a> ו-<a href=\"/אחסון-ותחזוקת-אתרים-המדריך/\">תחזוקת אתרים</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "מה ההבדל בין אחסון רגיל לאחסון מנוהל?",
          answer:
            "מנוהל כולל בדרך כלל עדכונים, גיבוי, ניטור ותמיכה פרואקטיבית; בחבילה בסיסית רוב הפעולות על המשתמש.",
        },
        {
          question: "כמה פעמים צריך גיבוי?",
          answer:
            "לפחות יומי לאתר עסקי; לפני עדכוני תבנית או תוסף — גיבוי נקודתי נוסף.",
        },
        {
          question: "מתי כדאי לעבור לאחסון מהיר יותר?",
          answer:
            "כשזמני טעינה משפיעים על המרות או כשיש תנועה גבוהה; קודם לבדוק תמונות ומטמון.",
        },
        {
          question: "האם אחסון משפיע על SEO?",
          answer:
            "ישירות קלות — בעיקר דרך מהירות, זמינות ואבטחה (HTTPS). שרת איטי או לא יציב פוגע בחוויה ובסריקה.",
        },
      ]),
  },
  "/החשיבות-של-משרד-פרסום-דיגיטלי/": {
    postMarker: "elementor-19281",
    lead: () =>
      buildArticleLeadBlock("he", [
        "משרד פרסום דיגיטלי מרכז יכולות מדיה ממומנת, יצירתיות ולעיתים אסטרטגיה — חשוב כשצריך ניהול קמפיינים בשטח ולא רק ייעוץ נקודתי.",
        "המאמר מסביר למה השקעה בפרסום מקצועי רלוונטית ב-2026. המשך: <a href=\"/משרד-פרסום-דיגיטלי/\">משרד פרסום דיגיטלי</a> · <a href=\"/google-ads/\">Google Ads</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "מתי משרד פרסום עדיף על יועץ עצמאי?",
          answer:
            "כשיש תקציב פרסום משמעותי, צורך בקריאייטיב וניהול מספר ערוצים במקביל.",
        },
        {
          question: "מה חשוב לבדוק בדוחות מהמשרד?",
          answer:
            "עלות להמרה, איכות לידים, שינויי תקציב והסברים על ביצועים — לא רק חשיפות.",
        },
        {
          question: "האם משרד פרסום מטפל גם באתר?",
          answer:
            "תלוי בהסכם. חלקם מפנים לבניית אתר; אחרים דורשים דפי נחיתה מתואמים לקמפיין.",
        },
        {
          question: "איך מוודאים שהתקציב לא מתבזבז?",
          answer:
            "הגדרת המרות, חוקי סינון, בדיקות שבועיות וגבול על הקצאה לערוצים שלא ממירים.",
        },
      ]),
  },
};

const BATCH5_EN: Record<string, BatchConfig> = {
  "/en/managing-business-digital-age/": {
    postMarker: "elementor-20051",
    lead: () =>
      buildArticleLeadBlock("en", [
        "Running a business in 2026 means combining operations with digital channels that actually convert: a reliable site, clear contact paths, GA4 measurement, and at least one repeatable lead source.",
        "This article covers tools, social presence, and when to get external help — without promising fixed growth rates. See also <a href=\"/en/digital-marketing/\">digital marketing</a> and <a href=\"/en/seo/\">SEO</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "What should a small business fix first digitally?",
          answer:
            "One working contact path, fast site load, and tracking. Then pick one growth channel based on where customers search.",
        },
        {
          question: "Do you need every social network?",
          answer:
            "No. One well-run channel beats many inactive profiles.",
        },
        {
          question: "When is outsourced marketing worth it?",
          answer:
            "When ad spend, content, and reporting outgrow what the owner can manage weekly.",
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
  next = upsertArticleLead(next, pilot.lead(locale));
  next = upsertArticleFaq(next, pilot.faq(locale), pilot.postMarker);
  return next;
}

/** Batch5 pilot — full reading UX on five HE articles (+ EN pair for digital age). */
export function applyArticleBatch5Pilot2026(html: string, path: string, locale: Locale): string {
  if (locale === "he") return applyMap(html, path, locale, BATCH5_HE);
  if (locale === "en") return applyMap(html, path, locale, BATCH5_EN);
  return html;
}
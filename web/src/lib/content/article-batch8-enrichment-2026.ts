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

const BATCH8: Record<string, BatchConfig> = {
  "/החיפושים-הכי-פופולריים-בגוגל-היום-ביש/": {
    postMarker: "elementor-10983",
    lead: () =>
      buildArticleLeadBlock("he", [
        "מגמות חיפוש בגוגל עוזרות לזהות נושאים שמעניינים אנשים — אבל רשימות «חמות» משתנות מדי יום, ולעיתים אינן רלוונטיות לעסק שלכם.",
        "המאמר מסביר איך לבדוק מגמות ב-<a href=\"https://trends.google.com/trending?geo=IL\" rel=\"noopener noreferrer nofollow\" target=\"_blank\">Google Trends</a> ובדוחות Year in Search, להבדיל בין טרנד זמני לבין ביקוש מתמשך, ולתרגם תובנות לתוכן ול<a href=\"/seo/\">קידום אתרים</a> — בלי להסתמך על טבלאות לא מאומתות.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "איפה רואים חיפושים פופולריים בישראל באופן רשמי?",
          answer:
            "ב־Google Trends (אזור ישראל) ובפרסומי Year in Search של גוגל. אלה מקורות לצפייה במגמות, לא הבטחה לנפח או לדירוג.",
        },
        {
          question: "מה ההבדל בין טרנד יומי לבין מילת מפתח עסקית?",
          answer:
            "טרנד חדשותי או תרבותי עשוי לעבור מהר. עסק צריך לשלב גם ביטויים שמביעים כוונת רכישה או חיפוש שירות, שאותם בודקים ב־Search Console וכלי מחקר מילות מפתח.",
        },
        {
          question: "האם כדאי לכתוב על כל נושא חם בגוגל?",
          answer:
            "רק אם הוא קשור לתחום שלכם ולקהל היעד. תוכן שלא תואם לעסק מייצר תנועה חלשה ופוגע באמון.",
        },
        {
          question: "איך משתמשים במגמות בלי להמציא נתונים?",
          answer:
            "משווים טווחי תאריכים ב־Trends, בודקים שאילתות אמיתיות מהאתר, ומתעדים מקור. לא מציגים מספרי חיפוש שאינם מגובים במקור.",
        },
      ]),
  },
  "/en/popular-google-searches-israel/": {
    postMarker: "elementor-10983",
    lead: () =>
      buildArticleLeadBlock("en", [
        "Google search trends help you see what people care about — but daily «hot» lists change fast and are often unrelated to your offer.",
        "This article explains how to use <a href=\"https://trends.google.com/trending?geo=IL\" rel=\"noopener noreferrer nofollow\" target=\"_blank\">Google Trends</a> and published Year in Search reports, separate short spikes from steady demand, and turn insights into content and <a href=\"/en/seo/\">SEO</a> — without treating unverified tables as facts.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "Where can I see popular searches in Israel officially?",
          answer:
            "Google Trends (Israel region) and Google’s Year in Search publications. Use them to explore patterns, not as guaranteed search volumes or rankings.",
        },
        {
          question: "What is the difference between a daily trend and a business keyword?",
          answer:
            "News or culture spikes fade quickly. Businesses should also track service and purchase-intent queries via Search Console and proper keyword research.",
        },
        {
          question: "Should we write about every trending topic?",
          answer:
            "Only when it fits your niche and audience. Off-topic trend-chasing weakens trust and conversions.",
        },
        {
          question: "How do we use trends without inventing statistics?",
          answer:
            "Compare date ranges in Trends, validate with your own Search Console data, and cite the source. Do not publish search volumes you cannot verify.",
        },
      ]),
  },
  "/google-business-profile/": {
    postMarker: "elementor-14288",
    lead: () =>
      buildArticleLeadBlock("he", [
        "פרופיל העסק ב־Google (לשעבר Google לעסק שלי) הוא הנכס המרכזי לנראות בחיפוש ובמפות: פרטים, קטגוריה, תמונות, פוסטים וביקורות.",
        "המדריך עובר על הקמה, אימות, עדכון שוטף ואופטימיזציה לפי הנחיות גוגל — עם קישורים ל<a href=\"/מדריך-קידום-העסק-בגוגל/\">קידום העסק בגוגל</a> ול<a href=\"/seo/\">SEO</a>, בלי הבטחת מיקום ראשון.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "האם פרופיל העסק בגוגל עדיין חינמי?",
          answer:
            "כן — יצירה ועריכה בסיסית של פרופיל העסק אינה דורשת תשלום לגוגל. פרסום ממומן במפות או בחיפוש הוא ערוץ נפרד (Google Ads).",
        },
        {
          question: "איך מאמתים את הפרופיל?",
          answer:
            "בדרך כלל באמצעות טלפון, אימייל, דואר או סרטון — לפי מה שגוגל מציעה לעסק שלכם. עדיף להשלים אימות מוקדם כדי לשלוט בפרטים.",
        },
        {
          question: "האם ביקורות מזויפות או תמריצים בכסף מותרים?",
          answer:
            "לא. מבקשים ביקורות אמיתיות מלקוחות מרוצים; מגיבים במקצועיות לביקורות שליליות ולא קונים דירוגים.",
        },
        {
          question: "מה משפר נראות מקומית בפועל?",
          answer:
            "עקביות שם וכתובת, קטגוריה נכונה, שעות מעודכנות, תמונות איכותיות, תשובות לשאלות וביקורות עדכניות — יחד עם אתר ותוכן שתומכים באותם ביטויים.",
        },
        {
          question: "האם אפשר להבטיח מקום ראשון במפות?",
          answer:
            "לא. דירוג מקומי תלוי במיקום, תחרות, איכות הפרופיל והאתר. אפשר לשפר הדרגתית, לא להבטיח תוצאה.",
        },
      ]),
  },
  "/en/power-of-reviews/": {
    postMarker: "The power of reviews",
    lead: () =>
      buildArticleLeadBlock("en", [
        "Customer reviews shape trust before anyone calls or buys: on Google Maps, social platforms, and your website.",
        "This article covers ethical ways to earn real feedback, respond to criticism, and use social proof in marketing — with links to <a href=\"/en/google-business-profile/\">Google Business Profile</a> and <a href=\"/en/seo/\">SEO</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "Is it allowed to ask customers for a Google review?",
          answer:
            "Yes, when you do not pay for reviews or write them yourself. Ask after a successful service and make leaving feedback easy.",
        },
        {
          question: "What should we do with a negative review?",
          answer:
            "Reply politely, acknowledge the issue, and move resolution to a private channel when appropriate. Ignoring it usually hurts trust more.",
        },
        {
          question: "How many reviews are «enough»?",
          answer:
            "There is no magic number. Fresh, relevant reviews that match your competitive set matter more than a one-time burst of old ratings.",
        },
        {
          question: "Should reviews appear on our website too?",
          answer:
            "Yes — short, genuine quotes or an embedded Google widget. Do not fabricate testimonials.",
        },
      ]),
  },
  "/en/digital-advertising-office/": {
    postMarker: "elementor-10369",
    lead: () =>
      buildArticleLeadBlock("en", [
        "A digital advertising office (agency) plans and runs paid and organic channels — search, social, display, and measurement — against clear business goals.",
        "This guide explains what to expect from a partner, how channels differ, and what to ask before signing — with paths to <a href=\"/en/digital-marketing-services/\">digital marketing services</a> and <a href=\"/en/google-ads/\">Google Ads</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "What is the difference between a digital ad agency and a full-service marketing agency?",
          answer:
            "Labels overlap. Focus on included services (ads, SEO, content, creative), who owns ad accounts, and how reporting works.",
        },
        {
          question: "How do we choose an advertising partner?",
          answer:
            "Start with one measurable goal, compare proposals on the same brief, check relevant case studies, and confirm you keep access to analytics and ad accounts.",
        },
        {
          question: "Do we need every channel at once?",
          answer:
            "Usually not. One or two channels done well beats thin presence everywhere.",
        },
        {
          question: "When does outsourcing make sense?",
          answer:
            "When campaign complexity, creative volume, or reporting exceeds what the owner can run weekly with quality.",
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
  const row = map[normalizePath(path)];
  if (!row) return html;
  let next = html;
  next = upsertArticleLead(next, row.lead(locale));
  next = upsertArticleFaq(next, row.faq(locale), row.postMarker);
  return next;
}

/** Batch8 — HE popular searches + GBP; EN popular searches, reviews, digital ad office. */
export function applyArticleBatch8Enrichment2026(html: string, path: string, locale: Locale): string {
  return applyMap(html, path, locale, BATCH8);
}

export const BATCH8_PATHS = Object.keys(BATCH8);
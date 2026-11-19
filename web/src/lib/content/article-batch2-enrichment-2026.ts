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

const BATCH2_EN: Record<string, BatchConfig> = {
  "/en/digital-marketing-strategies-2025/": {
    postMarker: "elementor-21776",
    lead: () =>
      buildArticleLeadBlock("en", [
        "This guide explains how to plan digital marketing: budgets, channels, measurement, and content for businesses that want predictable growth.",
        "The headline references 2025, but the playbook still holds in 2026 — with stronger focus on GA4, AI-assisted workflows, and assets that work for organic and paid search. No guaranteed results; a checklist for prioritization.",
      ]),
  },
  "/en/future-of-seo-2025/": {
    postMarker: "elementor-21817",
    lead: () =>
      buildArticleLeadBlock("en", [
        "Written as a forward-looking SEO piece around 2025, this article still maps long-term trends. In 2026 we see more AI surfaces (including AI Overviews), E-E-A-T, site speed, and fewer shortcuts.",
        "For practical steps on AI in search, see <a href=\"/en/seo-2026-ai-answers/\">SEO 2026 and Google AI Overviews</a>.",
      ]),
  },
  "/en/facebook-instagram-marketing/": {
    postMarker: "elementor-21578",
    lead: () =>
      buildArticleLeadBlock("en", [
        "Meta marketing (Facebook and Instagram) helps businesses reach audiences by interest, location, and demographics — useful for branding and lead gen.",
        "The original title says 2025; in 2026 focus on creative testing, Events/CAPI measurement, Business Manager setup, and tying ads to your site — without promising fixed ROI.",
      ]),
  },
  "/en/seo-2026-ai-answers/": {
    postMarker: "elementor-22368",
    lead: () =>
      buildArticleLeadBlock("en", [
        "Google shows more AI Overviews at the top of results. This article covers what that means for SEO, content structure, and on-page clarity.",
        "You will find AEO basics, content quality, structured data, and common mistakes — without promising placement in every query.",
      ]),
  },
  "/en/google-shopping-guide/": {
    postMarker: "elementor-17923",
    lead: () =>
      buildArticleLeadBlock("en", [
        "A practical Google Shopping guide for e-commerce: Merchant Center, product feeds, and how Shopping ads fit your mix.",
        "The title says 2025; in 2026 focus on feed quality, shipping/return policy clarity, and GA4 conversion tracking before scaling <a href=\"/en/google-ads/\">Google Ads</a> spend.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "Do I need paid Shopping ads to show product listings?",
          answer:
            "Not always. A correct Merchant Center setup and feed can unlock free listings; paid campaigns add reach once data quality and measurement are in place.",
        },
        {
          question: "What should I fix first in my product feed?",
          answer:
            "Title, price, availability, link, and image must match the site. Resolve Merchant Center disapprovals before increasing budget.",
        },
      ]),
  },
  "/en/seo-pricing-guide/": {
    postMarker: "elementor-21161",
    lead: () =>
      buildArticleLeadBlock("en", [
        "A practical overview of what drives SEO pricing: competition, site health, content, links, and whether paid search is bundled in.",
        "This is not a binding price list — use it to compare agency proposals and ask the right questions on a call.",
      ]),
  },
};

const BATCH2_HE: Record<string, BatchConfig> = {
  "/google-shopping-guide/": {
    postMarker: "elementor-17923",
    lead: () =>
      buildArticleLeadBlock("he", [
        "מדריך לגוגל שופינג (Merchant Center, פידים ומודעות Shopping) לחנויות ואתרי מכירות בישראל.",
        "הכותרת מציינת 2025; ב-2026 חשוב לעדכן פיד, מדיניות משלוחים ומלאי, ולשלב Performance Max / רשימות חינמיות. לפרסום ממומן: <a href=\"/google-ads/\">Google Ads</a> — בלי להמציא נתוני ביצועים.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "האם חובה לפרסם בגוגל שופינג כדי להופיע ברשימות?",
          answer:
            "לא תמיד. אפשר להתחיל מהגדרת Merchant Center ופיד תקין לרשימות חינמיות; פרסום ממומן מוסיף חשיפה כשהתשתית והמדידה מוכנות.",
        },
        {
          question: "מה הדבר הראשון לבדוק בפיד המוצרים?",
          answer:
            "שם מוצר, מחיר, זמינות, קישור ותמונה עקביים עם האתר; תיקון שגיאות ב-Merchant Center לפני הגדלת תקציב.",
        },
        {
          question: "מתי כדאי לפנות לסוכנות?",
          answer:
            "כשיש הרבה SKU, שגיאות פיד חוזרות, או צורך לשלב Shopping עם Google Ads ואנליטיקה — ואין זמן פנימי לטפל בזה שוטף.",
        },
      ]),
  },
  "/משרד-פרסום-דיגיטלי/": {
    postMarker: "elementor-10369",
    lead: () =>
      buildArticleLeadBlock("he", [
        "מאמר זה מסביר מה משרד פרסום דיגיטלי עושה בפועל: אסטרטגיה, מדיה ממומנת, תוכן, מדידה ותיאום בין ערוצים.",
        "מתאים לעסקים שמחפשים שותף חיצוני — עם דגש על שקיפות, יעדים מדידים ושירותי שיווק מקצועיים, בלי הבטחת תוצאה.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "מה ההבדל בין משרד פרסום לסוכנות שיווק דיגיטלי?",
          answer:
            "לעיתים אין הפרדה ברורה. חשוב לבדוק אילו שירותים כלולים (פרסום, SEO, סושיאל, אתרים), מי מנהל את החשבון ואיך מדווחים.",
        },
        {
          question: "איך בוחרים משרד פרסום?",
          answer:
            "מתחילים מיעד עסקי אחד, בודקים ניסיון בתחום, תהליך עבודה, דוגמאות והמלצות — ומבקשים הסבר איך נמדדת הצלחה.",
        },
      ]),
  },
  "/סוכנות-שיווק-דיגיטלית/": {
    postMarker: "elementor-18480",
    lead: () =>
      buildArticleLeadBlock("he", [
        "המאמר עוזר להבין מתי סוכנות שיווק דיגיטלי מתאימה, מה לצפות מתהליך העבודה ואיך לחבר בין ערוצים.",
        "הדגש ב-2026: מדידה ב-GA4, תוכן איכותי ושילוב פרסום ואורגני — לא «קסם» אחד שמבטיח דירוג.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "מתי כדאי להעסיק סוכנות במקום צוות פנימי?",
          answer:
            "כשחסרות יכולות (מדיה, SEO, תוכן, פיתוח) או כשצריך זינוק מהיר עם ניהול תקציב מקצועי — ויש תקציב שמצדיק שותף חיצוני.",
        },
        {
          question: "מה לבקש בפגישת היכרות?",
          answer:
            "סקירת מצב נוכחי, יעדים, תקציב משוער, אילו ערוצים מומלצים ואיך נראים דוחות חודשיים — בלי התחייבות למקום ראשון בגוגל.",
        },
      ]),
  },
  "/אחסון-ותחזוקת-אתרים-למה-זה-חשוב/": {
    postMarker: "elementor-19548",
    lead: () =>
      buildArticleLeadBlock("he", [
        "אחסון ותחזוקה שוטפת משפיעים על אבטחה, מהירות ויציבות האתר — ובסוף גם על SEO וחוויית משתמש.",
        "המאמר מסביר מה כולל שירות מנוהל ולמה זה רלוונטי גם ב-2026 כשאתרים רצים על ערימות מודרניות ועדכוני אבטחה תכופים.",
      ]),
  },
  "/שיווק-דיגיטלי-לעסקים/": {
    postMarker: "שיווק דיגיטלי לעסקים",
    lead: () =>
      buildArticleLeadBlock("he", [
        "מדריך רוחבי לשיווק דיגיטלי לעסקים: ערוצים, תקציב, מדידה ותוכן — מותאם למי שמתחיל או מארגן מחדש את הפעילות.",
        "הכותרת מציינת 2026; במאמר תמצאו קישורים לשירותים ולמאמרים מעמיקים בנושאים ספציפיים.",
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

/** Batch 2 — EN pilot pairs + 5 additional HE articles (PR #4 HE pilots unchanged). */
export function applyArticleBatch2Enrichment2026(html: string, path: string, locale: Locale): string {
  if (locale === "en") return applyMap(html, path, locale, BATCH2_EN);
  if (locale === "he") return applyMap(html, path, locale, BATCH2_HE);
  return html;
}
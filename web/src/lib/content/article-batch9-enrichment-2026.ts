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

const BATCH9: Record<string, BatchConfig> = {
  "/צמיחה-עסקית-באמצעות-קידום-באינטרנט/": {
    postMarker: "elementor-19100",
    lead: () =>
      buildArticleLeadBlock("he", [
        "צמיחה עסקית בקידום דיגיטלי נבנית מערוצים שמתאימים לשלב העסק, לתקציב ולמדידה — לא מהבטחת תוצאה מיידית.",
        "המאמר מסביר איך לשלב <a href=\"/seo/\">SEO</a>, <a href=\"/google-ads/\">Google Ads</a>, רשתות חברתיות ובניית אתר, ואיך לבחור סדר עדיפויות לעסק קטן או בינוני.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "מה ההבדל בין קידום אורגני לבין Google Ads לצמיחה?",
          answer:
            "SEO בונה נוכחות ארוכת טווח ואמון בחיפוש; Google Ads מאפשר בדיקה מהירה של הצעה ומילות מפתח. לרוב משלבים לפי יעד ותקציב — בלי להחליף אחד בשני.",
        },
        {
          question: "איך יודעים איזה ערוץ להתחיל ממנו?",
          answer:
            "מתחילים מיעד עסקי אחד (פניות, מכירות, מודעות), בודקים לאן הלקוחות מחפשים אתכם היום, ומגדירים KPI מדיד. עסק מקומי לרוב צריך גם פרופיל עסקי ואתר תקין.",
        },
        {
          question: "כמה זמן לוקח לראות צמיחה מקידום?",
          answer:
            "פרסום ממומן יכול להניב תנועה תוך ימים; SEO ותוכן לרוב חודשים. חשוב להגדיר ציפיות ריאליות ולמדוד לאורך זמן, לא אחרי שבוע.",
        },
        {
          question: "האם חייבים סוכנות כדי לצמוח אונליין?",
          answer:
            "לא תמיד. עסקים קטנים יכולים להתחיל בעצמם בערוץ אחד. סוכנות מתאימה כשחסר זמן, ידע או תיאום בין ערוצים — ראו <a href=\"/שירותי-שיווק-דיגיטלי/\">שירותי שיווק דיגיטלי</a>.",
        },
      ]),
  },
  "/en/google-business-profile/": {
    postMarker: "elementor-14288",
    lead: () =>
      buildArticleLeadBlock("en", [
        "Google Business Profile (formerly Google My Business) is where customers find your hours, location, photos, and reviews in Search and Maps.",
        "This guide covers setup, verification, ongoing updates, and optimization aligned with <a href=\"https://support.google.com/business/\" rel=\"noopener noreferrer nofollow\" target=\"_blank\">Google’s Business Profile help</a> — plus links to <a href=\"/en/google-business-promotion-guide/\">promoting your business on Google</a> and <a href=\"/en/seo/\">SEO</a>, without promising a #1 map ranking.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "Is Google Business Profile still free?",
          answer:
            "Creating and editing core profile fields does not require paying Google. Paid placement in Search or Maps is a separate channel (Google Ads).",
        },
        {
          question: "How do you verify a profile?",
          answer:
            "Google typically offers phone, email, postcard, or video options depending on the business. Complete verification early so you control name, address, and hours.",
        },
        {
          question: "Are incentivized or fake reviews allowed?",
          answer:
            "No. Ask real customers after a completed service; respond professionally to criticism. Do not buy ratings.",
        },
        {
          question: "What actually improves local visibility?",
          answer:
            "Consistent NAP (name, address, phone), accurate category and hours, quality photos, timely review responses, and website content that supports the same topics.",
        },
        {
          question: "Can anyone guarantee first place in Maps?",
          answer:
            "No. Local rankings depend on location, competition, profile quality, and your site. You can improve steadily, not guarantee an outcome.",
        },
      ]),
  },
  "/en/google-business-promotion-guide/": {
    postMarker: "elementor-19121",
    lead: () =>
      buildArticleLeadBlock("en", [
        "Promoting a business on Google usually blends three layers: Business Profile and Maps, organic search (SEO), and paid search when you need faster coverage.",
        "This guide helps you pick a first channel, set simple conversion tracking, and avoid spending on tactics that do not match your stage — with links to <a href=\"/en/google-business-profile/\">Google Business Profile</a> and <a href=\"/en/google-ads/\">Google Ads</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "What should we do first — SEO or Google Ads?",
          answer:
            "For a new business: fix profile and a solid site, then choose ads for speed or SEO for long-term presence. Many run one paid campaign while building content.",
        },
        {
          question: "Do we need a blog to rank on Google?",
          answer:
            "Not always, but quality service pages and sound technical SEO matter. A blog helps when people search questions in your niche.",
        },
        {
          question: "How long until SEO shows movement?",
          answer:
            "Often months, not days. Competition, domain history, and content quality all play a role.",
        },
        {
          question: "How do we know the business shows correctly on Maps?",
          answer:
            "Search your area and category, check hours and photos, and keep name/address/phone consistent everywhere — see <a href=\"/en/google-business-profile/\">Google Business Profile</a>.",
        },
      ]),
  },
  "/en/business-growth-through-seo/": {
    postMarker: "elementor-19100",
    lead: () =>
      buildArticleLeadBlock("en", [
        "Business growth through SEO is a long game: useful content, a sound site, and measurement tied to leads — not just more traffic.",
        "This article explains how organic search, <a href=\"/en/seo/\">SEO</a>, and other digital channels support sustainable growth for small and mid-sized businesses, without promising quick wins.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "Is SEO enough for growth on its own?",
          answer:
            "Rarely. SEO brings qualified visits; you still need clear offers, conversion paths, and sometimes paid or social support for awareness.",
        },
        {
          question: "What is the difference between traffic and real growth?",
          answer:
            "Growth means measurable business outcomes — inquiries, sales, or retention. Track form fills, calls, and revenue signals in analytics, not pageviews alone.",
        },
        {
          question: "When does paid search complement SEO?",
          answer:
            "When you test new offers, cover competitive terms, or need leads while content matures. <a href=\"/en/google-ads/\">Google Ads</a> and SEO should share keyword insights.",
        },
        {
          question: "How should a small business prioritize channels?",
          answer:
            "One clear goal, one primary channel done well, then expand. A usable website and accurate Business Profile are baseline before scaling spend.",
        },
      ]),
  },
  "/en/digital-marketing-agency-maximize/": {
    postMarker: "elementor-18480",
    lead: () =>
      buildArticleLeadBlock("en", [
        "Getting more value from a digital marketing agency starts with goals, access to data, and honest reporting — not handing over logins and hoping.",
        "This article covers what to verify before you sign, how to align on KPIs, and what transparency around ad accounts and analytics should look like, with context from <a href=\"/en/digital-marketing-services/\">digital marketing services</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "What should we ask before hiring an agency?",
          answer:
            "Who owns ad and analytics accounts, which channels are included, how reporting works, and how success is defined on a 90-day horizon — without rank guarantees.",
        },
        {
          question: "When is outsourcing better than hiring in-house?",
          answer:
            "When you need several skills (ads, SEO, creative) at once and lack weekly capacity to run them with quality.",
        },
        {
          question: "How do we avoid overpaying for low-value work?",
          answer:
            "Tie fees to agreed deliverables and metrics you can verify. Request raw exports from Google Ads and GA4, not only slide decks.",
        },
        {
          question: "Should the agency keep our Google Ads account?",
          answer:
            "You should retain admin access to your properties. Agencies manage campaigns; the business keeps ownership of accounts and data.",
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

/** Batch9 — growth HE; EN GBP, promotion, growth, agency maximize. */
export function applyArticleBatch9Enrichment2026(html: string, path: string, locale: Locale): string {
  return applyMap(html, path, locale, BATCH9);
}

export const BATCH9_PATHS = Object.keys(BATCH9);
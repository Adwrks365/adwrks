import type { Locale } from "@/i18n/routing";
import {
  stripElementorContentBlockByH2,
  stripH2HeadingWidgets,
} from "@/lib/content/article-structure-polish";
import { stripInlineCtaBlocks } from "@/lib/content/article-ctas";
import {
  replaceSingleParagraphStartingWith,
  stripBalancedDivFrom,
  stripDivByClassName,
  stripElementorWidgetByDataId,
  stripSingleParagraphStartingWith,
} from "@/lib/content/article-html-sanitize";

const MARKER_POPULAR = "elementor-10983";
const MARKER_GBP = "elementor-14288";
const MARKER_OFFICE = "elementor-10369";
const TRENDS_SHORTCODE_WIDGET_ID = "e4edc2f";
const GBP_KEYWORD_WIDGET_IDS = ["e255658", "445d663"];

function stripFakeTrendsWidget(html: string): string {
  let next = stripElementorWidgetByDataId(html, TRENDS_SHORTCODE_WIDGET_ID);
  if (next.includes('id="google-trends-widget"')) {
    const wIdx = next.indexOf('id="google-trends-widget"');
    const start = next.lastIndexOf("<div", wIdx);
    if (start !== -1) next = stripBalancedDivFrom(next, start);
  }
  next = next.replace(/<table id="trend-table">[\s\S]*?<\/table>/gi, "");
  next = next.replace(/<div class="cta-box">[\s\S]*?<\/div>/gi, "");
  next = next.replace(/<style>[\s\S]*?#trend-table[\s\S]*?<\/style>/gi, "");
  return next;
}

function rewritePopularSearchesBody(html: string, locale: Locale): string {
  const heBlock = `<div class="elementor-element elementor-widget elementor-widget-text-editor"><p><strong>עדכון 2026:</strong> לא מוצגות כאן רשימות חיפוש «בזמן אמת» עם נפחים שלא ניתן לאמת. לצפייה במגמות בישראל השתמשו ב-<a href="https://trends.google.com/trending?geo=IL" rel="noopener noreferrer nofollow" target="_blank">Google Trends</a> ובסיכומי <a href="https://about.google/stories/year-in-search/" rel="noopener noreferrer nofollow" target="_blank">Year in Search</a>. לעסק, המטרה היא לזהות נושאים רלוונטיים לתחום, להשוות לשאילתות ב-Search Console, ולבנות תוכן ודפי שירות שמשרתים כוונת לקוח — לא לרדוף אחרי כל כותרת חדשותית.</p></div>`;
  const enBlock = `<div class="elementor-element elementor-widget elementor-widget-text-editor"><p><strong>2026 update:</strong> This page no longer shows unverified «live» search tables or volume badges. Use <a href="https://trends.google.com/trending?geo=IL" rel="noopener noreferrer nofollow" target="_blank">Google Trends</a> (Israel) and published <a href="https://about.google/stories/year-in-search/" rel="noopener noreferrer nofollow" target="_blank">Year in Search</a> reports. For your business, focus on topics tied to your offer, validate with Search Console, and build service pages and content that match customer intent — not every news spike.</p></div>`;

  let next = html;
  next = next.replace(
    /בעמוד זה תוכלו לעקוב בלייב אחר החיפושים[\s\S]*?ברגע זה\./i,
    locale === "he"
      ? "המאמר מסביר איך לקרוא מגמות חיפוש בצורה מקצועית וליישם אותן בשיווק דיגיטלי — בלי להסתמך על רשימות לא מאומתות."
      : "This article explains how to read search trends professionally and apply them in digital marketing — without relying on unverified lists.",
  );
  next = next.replace(
    /On this page you can follow live[\s\S]*?at the moment\./i,
    "This article explains how to use search trends for business decisions — without treating unverified lists as facts.",
  );

  if (locale === "en") {
    next = next.replace(/direction:rtl/gi, "direction:ltr");
    next = next.replace(/<section class="trends-content"[^>]*style="[^"]*direction:rtl[^"]*"/i, (m) =>
      m.replace(/direction:rtl/i, "direction:ltr"),
    );
  }

  const anchor =
    locale === "he"
      ? /<h2[^>]*>איך חיפושים פופולריים בגוגל יכולים לשרת עסקים\?<\/h2>/i
      : /<h2[^>]*>How can popular Google searches serve businesses\?<\/h2>/i;
  if (anchor.test(next)) {
    next = next.replace(anchor, (m) => `${locale === "he" ? heBlock : enBlock}${m}`);
  } else if (next.includes(MARKER_POPULAR)) {
    next = next.replace(
      /(<div data-elementor-type="wp-post"[^>]*>)/i,
      `$1${locale === "he" ? heBlock : enBlock}`,
    );
  }

  return next;
}

function ensurePopularClosing(html: string, locale: Locale): string {
  if (/לסיכום|In summary/i.test(html)) return html;
  const block =
    locale === "he"
      ? '<h2 class="elementor-heading-title elementor-size-default">לסיכום</h2><p>מגמות בגוגל הן כלי מחקר — לא תחליף לאסטרטגיית תוכן ולמילות מפתח שמייצרות לידים. שלבו נתונים ממקורות רשמיים, מדידה מהאתר, ועבודה שוטפת על SEO ופרסום ממוקד.</p>'
      : '<h2 class="elementor-heading-title elementor-size-default">In summary</h2><p>Trends are a research tool — not a substitute for a content strategy and keywords that drive leads. Combine official sources, site measurement, and steady SEO and paid campaigns.</p>';
  const marker = '<section class="adwrks-article-faq-block"';
  const idx = html.indexOf(marker);
  if (idx === -1) return `${html}${block}`;
  return `${html.slice(0, idx)}${block}${html.slice(idx)}`;
}

export function polishPopularGoogleSearchesArticleHtml(html: string, locale: Locale): string {
  if (!html.includes(MARKER_POPULAR) && !html.includes("trend-table")) return html;
  let next = stripFakeTrendsWidget(html);
  next = rewritePopularSearchesBody(next, locale);
  if (html.includes("adwrks-article-lead-2026")) {
    next = ensurePopularClosing(next, locale);
  }
  return next;
}

const GBP_ORGANIC_REPLACEMENT =
  "<p>פרופיל עסק מעודכן משפר סיכוי להופיע בחיפוש ובמפות, אך אין הבטחת מיקום. לעיתים משלבים גם פרסום ממומן לכיסוי מהיר.</p>";

function stripGbpSalesBlocks(html: string): string {
  let next = stripDivByClassName(html, "adwrks-sprint2-gbp-service-bridge");
  next = replaceSingleParagraphStartingWith(
    next,
    "פרופיל עסק מקודם אורגנית",
    GBP_ORGANIC_REPLACEMENT,
  );
  for (const widgetId of GBP_KEYWORD_WIDGET_IDS) {
    next = stripElementorWidgetByDataId(next, widgetId);
  }
  next = stripH2HeadingWidgets(next, (t) => /^שאלות ותשובות$/i.test(t.trim()));
  next = stripElementorContentBlockByH2(next, (t) =>
    /ניהול פרופיל העסק ב\s*-\s*Google עם Adwrks/i.test(t),
  );
  return next;
}

function ensureGbpClosing(html: string): string {
  if (/לסיכום/i.test(html)) return html;
  const block =
    '<h2 class="elementor-heading-title elementor-size-default">לסיכום</h2><p>פרופיל עסק מלא ומאומת, ביקורות אמיתיות ותוכן עקבי באתר תומכים בנראות מקומית. לשיפור מתמשך — מדידה, עדכונים שוטפים ושילוב עם SEO ופרסום כשזה מתאים ליעדים.</p>';
  const marker = '<section class="adwrks-article-faq-block"';
  const idx = html.indexOf(marker);
  if (idx === -1) return `${html}${block}`;
  return `${html.slice(0, idx)}${block}${html.slice(idx)}`;
}

export function polishGoogleBusinessProfileArticleHtml(html: string): string {
  if (!html.includes(MARKER_GBP)) return html;
  let next = stripGbpSalesBlocks(html);
  next = stripInlineCtaBlocks(next);
  if (html.includes("adwrks-article-lead-2026")) {
    next = ensureGbpClosing(next);
  }
  return next;
}

const REVIEWS_WHY_BLOCK = `<h2 class="elementor-heading-title elementor-size-default">Why reviews matter</h2>
<p>Shoppers usually read feedback before they call, book, or buy. A steady flow of genuine reviews — plus professional responses — builds more trust than perfect stars with almost no volume. We avoid citing exact percentages here because studies and years differ; focus on ethical collection on Google, relevant directories, and your site.</p>`;

function normalizeReviewsHeadings(html: string): string {
  return html
    .replace(/<h3>\s*<\/h3>/gi, "")
    .replace(
      /<h3>The power of reviews and recommendations and their impact on your business!<\/h3>/i,
      '<h2 class="elementor-heading-title elementor-size-default">The power of reviews and recommendations</h2>',
    )
    .replace(/<h4><strong>Have you ever hesitated[\s\S]*?<\/h4>/i, "");
}

function repairReviewsStatsSection(html: string): string {
  let next = stripSingleParagraphStartingWith(html, "Get a sneak peek at the stats");
  const statsRe = /<p><strong>\s*Some more statistics[\s\S]*?<\/p>/gi;
  next = next.replace(statsRe, "");
  if (!/Why reviews matter/i.test(next)) {
    const impactH2 =
      '<h2 class="elementor-heading-title elementor-size-default">The impact of online reviews on sales and revenue</h2>';
    const impactRe =
      /<h4[^>]*>\s*<strong>\s*The impact of online reviews on sales and revenue\s*<\/strong>[\s\S]*?<\/h4>/i;
    if (impactRe.test(next)) {
      next = next.replace(impactRe, `${REVIEWS_WHY_BLOCK}${impactH2}`);
    }
  }
  return next;
}

function ensureReviewsClosing(html: string): string {
  if (/In summary|To summarize/i.test(html)) return html;
  const block =
    '<h2 class="elementor-heading-title elementor-size-default">In summary</h2><p>Ethical review collection, timely responses, and visible social proof support both paid and organic growth. Keep Google Business Profile accurate and align website copy with what customers actually say.</p>';
  const marker = '<section class="adwrks-article-faq-block"';
  const idx = html.indexOf(marker);
  if (idx === -1) return `${html}${block}`;
  return `${html.slice(0, idx)}${block}${html.slice(idx)}`;
}

export function polishEnPowerOfReviewsArticleHtml(html: string): string {
  if (!/power of reviews/i.test(html)) return html;
  let next = normalizeReviewsHeadings(html);
  next = repairReviewsStatsSection(next);
  next = next.replace(/<ins class="adsbygoogle"[\s\S]*?<\/ins>\s*/gi, "");
  if (html.includes("adwrks-article-lead-2026")) {
    next = ensureReviewsClosing(next);
  }
  return next;
}

const OFFICE_PITCH_REPLACEMENT =
  "<p>When choosing a digital advertising office, compare channels, reporting, and who owns ad accounts. Adwrks 365 supports integrated digital marketing — strategy, Google Ads, SEO, and content — with measurable goals rather than vague promises.</p>";

export function polishEnDigitalAdvertisingOfficeArticleHtml(html: string): string {
  if (!html.includes(MARKER_OFFICE)) return html;
  let next = html;
  next = stripElementorContentBlockByH2(next, (t) => /why choose adwrks|free advertising package/i.test(t));
  next = stripInlineCtaBlocks(next);
  next = stripSingleParagraphStartingWith(
    next,
    "The marketing actions can of course be done independently",
  );
  next = replaceSingleParagraphStartingWith(
    next,
    "With us you can enjoy advertising packages",
    OFFICE_PITCH_REPLACEMENT,
  );
  next = next.replace(/<ins class="adsbygoogle"[\s\S]*?<\/ins>\s*/gi, "");
  if (html.includes("adwrks-article-lead-2026") && !/In summary/i.test(next)) {
    const block =
      '<h2 class="elementor-heading-title elementor-size-default">In summary</h2><p>Online marketing works when goals, budget, and measurement are clear. Start with one or two channels, verify results after 90 days, then scale what performs.</p>';
    const marker = '<section class="adwrks-article-faq-block"';
    const idx = next.indexOf(marker);
    next = idx === -1 ? `${next}${block}` : `${next.slice(0, idx)}${block}${next.slice(idx)}`;
  }
  return next;
}

/** Documented removal labels for batch8 audit scripts. */
export const BATCH8_REMOVED_MARKERS: Record<string, string[]> = {
  popular: ["elementor shortcode widget e4edc2f (fake trends)", "trend-table", "cta-box"],
  gbp: ["adwrks-sprint2-gbp-service-bridge", "organic guarantee paragraph", "keyword H2 block"],
  reviews: ["broken stats paragraphs", "empty h3/h4 intro"],
  office: ["agency pitch paragraphs", "adsbygoogle"],
};
import type { Locale } from "@/i18n/routing";
import { stripInlineCtaBlocks } from "@/lib/content/article-ctas";
import {
  replaceSingleParagraphStartingWith,
  stripDivByClassName,
  stripElementorWidgetByDataId,
  stripSingleParagraphStartingWith,
} from "@/lib/content/article-html-sanitize";
import {
  stripElementorContentBlockByH2,
  stripElementorContentBlockByH3,
  stripH2HeadingWidgets,
} from "@/lib/content/article-structure-polish";
import { polishGoogleBusinessProfileArticleHtml } from "@/lib/content/post-batch8-content-polish";

const MARKER_GROWTH = "elementor-19100";
const MARKER_GBP_EN = "elementor-14288";
const MARKER_PROMO_EN = "elementor-19121";
const MARKER_AGENCY_EN = "elementor-18480";

const GBP_KEYWORD_WIDGET_IDS = ["e255658", "445d663"];

function stripEnGbpSalesBlocks(html: string): string {
  let next = stripDivByClassName(html, "adwrks-sprint2-gbp-service-bridge");
  next = replaceSingleParagraphStartingWith(
    next,
    "A business profile promoted organically",
    "<p>An updated Business Profile can improve visibility in Search and Maps; there is no ranking guarantee. Paid search is a separate lever when you need faster reach.</p>",
  );
  next = replaceSingleParagraphStartingWith(
    next,
    "פרופיל עסק מקודם אורגנית",
    "<p>An updated Business Profile can improve visibility in Search and Maps; there is no ranking guarantee. Paid search is a separate lever when you need faster reach.</p>",
  );
  for (const widgetId of GBP_KEYWORD_WIDGET_IDS) {
    next = stripElementorWidgetByDataId(next, widgetId);
  }
  next = stripH2HeadingWidgets(next, (t) => /^questions?\s*(?:and\s*answers|&\s*answers)$/i.test(t.trim()));
  next = stripElementorContentBlockByH2(next, (t) =>
    /managing.*google business.*adwrks|with adwrks\s*365/i.test(t),
  );
  next = stripElementorContentBlockByH2(next, (t) =>
    /we are here for any question|דרכים ליצירת קשר/i.test(t),
  );
  return next;
}

function ensureEnGbpClosing(html: string): string {
  if (/in summary|to summarize/i.test(html)) return html;
  const block =
    '<h2 class="elementor-heading-title elementor-size-default">In summary</h2><p>A complete, verified profile, genuine reviews, and consistent site content support local visibility. Combine measurement, regular updates, and SEO or ads when it fits your goals.</p>';
  const marker = '<section class="adwrks-article-faq-block"';
  const idx = html.indexOf(marker);
  if (idx === -1) return `${html}${block}`;
  return `${html.slice(0, idx)}${block}${html.slice(idx)}`;
}

export function polishEnGoogleBusinessProfileArticleHtml(html: string): string {
  if (!html.includes(MARKER_GBP_EN)) return html;
  let next = stripEnGbpSalesBlocks(html);
  next = stripInlineCtaBlocks(next);
  if (html.includes("adwrks-article-lead-2026")) {
    next = ensureEnGbpClosing(next);
  }
  return next;
}

function stripGrowthPitchBlocks(html: string, locale: Locale): string {
  let next = stripInlineCtaBlocks(html);
  const agencyRe =
    locale === "he"
      ? /עבודה עם Adwrks|לסיוע מקצועי.*Adwrks/i
      : /work with Adwrks|professional help from Adwrks|with Adwrks\s*365/i;
  next = stripElementorContentBlockByH2(next, (t) => agencyRe.test(t));
  next = next.replace(/<ins class="adsbygoogle"[\s\S]*?<\/ins>\s*/gi, "");
  next = stripSingleParagraphStartingWith(
    next,
    locale === "he" ? "צמיחה מובטחת" : "guaranteed growth",
  );
  return next;
}

function ensureGrowthClosing(html: string, locale: Locale): string {
  const hasClosing =
    locale === "he"
      ? /לסיכום/i.test(html) || /<h3[^>]*>[\s\S]*?סיכום/i.test(html)
      : /in summary|to summarize/i.test(html) || /<h3[^>]*>[\s\S]*?summary/i.test(html);
  if (hasClosing) return html;
  const block =
    locale === "he"
      ? '<h2 class="elementor-heading-title elementor-size-default">לסיכום</h2><p>צמיחה דיגיטלית מגיעה משילוב נכון של ערוצים, תקציב מדוד ותוכן שמשרת לקוחות — לא ממילה אחת בגוגל. בוחרים ערוץ לפי יעד, מודדים, ומשפרים בהדרגה.</p>'
      : '<h2 class="elementor-heading-title elementor-size-default">In summary</h2><p>Digital growth comes from the right mix of channels, measured budget, and content that serves customers — not a single magic keyword. Pick a channel by goal, measure, and iterate.</p>';
  const marker = '<section class="adwrks-article-faq-block"';
  const idx = html.indexOf(marker);
  if (idx === -1) return `${html}${block}`;
  return `${html.slice(0, idx)}${block}${html.slice(idx)}`;
}

export function polishBusinessGrowthArticleHtml(html: string, locale: Locale): string {
  if (!html.includes(MARKER_GROWTH)) return html;
  let next = stripGrowthPitchBlocks(html, locale);
  if (html.includes("adwrks-article-lead-2026")) {
    next = ensureGrowthClosing(next, locale);
  }
  return next;
}

const PROMO_PITCH_REPLACEMENT =
  "<p>Clear goals, the right Google surface (Profile, SEO, or Ads), and simple conversion tracking beat scattering budget across channels you cannot measure.</p>";

export function polishEnPromotionGuideArticleHtml(html: string): string {
  if (!html.includes(MARKER_PROMO_EN)) return html;
  let next = html;
  next = stripInlineCtaBlocks(next);
  next = stripElementorContentBlockByH2(next, (t) =>
    /maximize your online presence with a digital marketing agency/i.test(t),
  );
  next = replaceSingleParagraphStartingWith(
    next,
    "Maximize your online presence with a digital marketing agency",
    PROMO_PITCH_REPLACEMENT,
  );
  next = next.replace(/<ins class="adsbygoogle"[\s\S]*?<\/ins>\s*/gi, "");
  next = stripElementorContentBlockByH2(next, (t) => /^summary$/i.test(t));
  if (next.includes("adwrks-article-lead-2026") && !/in summary/i.test(next)) {
    const block =
      '<h2 class="elementor-heading-title elementor-size-default">In summary</h2><p>Start with accurate Business Profile and site basics, then add SEO or Ads based on urgency and budget. Review Search Console and leads monthly — adjust instead of chasing unverified trends.</p>';
    const marker = '<section class="adwrks-article-faq-block"';
    const idx = next.indexOf(marker);
    next = idx === -1 ? `${next}${block}` : `${next.slice(0, idx)}${block}${next.slice(idx)}`;
  }
  return next;
}

const AGENCY_PITCH_REPLACEMENT =
  "<p>Before signing with a digital marketing agency, compare services, reporting, and account ownership. Adwrks 365 supports integrated strategy, Google Ads, SEO, and content with measurable goals — not vague rank promises.</p>";

export function polishEnDigitalMarketingAgencyMaximizeArticleHtml(html: string): string {
  if (!html.includes(MARKER_AGENCY_EN)) return html;
  let next = html;
  next = stripElementorContentBlockByH2(next, (t) =>
    /need seo services|effective online advertising/i.test(t),
  );
  next = stripInlineCtaBlocks(next);
  next = replaceSingleParagraphStartingWith(
    next,
    "With us you can enjoy",
    AGENCY_PITCH_REPLACEMENT,
  );
  next = next.replace(/<ins class="adsbygoogle"[\s\S]*?<\/ins>\s*/gi, "");
  next = stripElementorContentBlockByH3(next, (t) => /^summary$/i.test(t));
  if (next.includes("adwrks-article-lead-2026") && !/in summary/i.test(next)) {
    const block =
      '<h2 class="elementor-heading-title elementor-size-default">In summary</h2><p>Agency value shows up in clear KPIs, shared data access, and steady iteration. Define success upfront, keep your accounts, and review results on a fixed cadence.</p>';
    const marker = '<section class="adwrks-article-faq-block"';
    const idx = next.indexOf(marker);
    next = idx === -1 ? `${next}${block}` : `${next.slice(0, idx)}${block}${next.slice(idx)}`;
  }
  return next;
}

/** Re-export HE GBP polish path used when batch9 runs on shared tooling — EN uses dedicated function above. */
export function polishHeGoogleBusinessProfileFromBatch9(html: string): string {
  return polishGoogleBusinessProfileArticleHtml(html);
}

export const BATCH9_REMOVED_MARKERS: Record<string, string[]> = {
  "growth-he": ["inline CTA blocks", "Adwrks-only H2 pitch"],
  "growth-en": ["inline CTA blocks", "Adwrks-only H2 pitch", "adsense"],
  "gbp-en": ["keyword widgets", "Q&A duplicate H2", "agency manage block"],
  "promo-en": ["agency H2 pitch", "adsense", "inline CTA"],
  "agency-en": ["footer SEO/ad pitch section", "adsense", "inline CTA"],
};
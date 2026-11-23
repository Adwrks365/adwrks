import type { AnalyzablePage } from "./findings";
import { isCommerceSystemPage, isSystemOrPolicyPage } from "./content-url";
import type { SiteCheckLocale, SiteCheckTopicSummary, SiteCheckTopicTone } from "./types";

function isImportantForSeo(page: AnalyzablePage): boolean {
  if (page.role === "home" || page.isEntry) return !isCommerceSystemPage(page.url, page.label);
  if (isSystemOrPolicyPage(page.url, page.label)) return false;
  if (isCommerceSystemPage(page.url, page.label)) return false;
  return true;
}

function seoSubtitle(
  locale: SiteCheckLocale,
  pages: AnalyzablePage[],
  partialScan: boolean,
): { detail: string; tone: SiteCheckTopicTone } {
  const readable = pages.filter((page) => page.readable && isImportantForSeo(page));
  if (readable.length === 0) {
    return locale === "en"
      ? { detail: "Could not read enough HTML to check titles and meta.", tone: "skipped" }
      : { detail: "לא ניתן לקרוא מספיק תוכן לבדיקת כותרות ומטא.", tone: "skipped" };
  }

  const titles = readable.map((page) => page.parsed.title.trim().toLowerCase()).filter(Boolean);
  const titleSet = new Set(titles);
  const dupTitles = titles.length > titleSet.size;

  const descs = readable
    .map((page) => page.parsed.metaDescription.trim().toLowerCase())
    .filter(Boolean);
  const descSet = new Set(descs);
  const dupDesc = descs.length >= 2 && descSet.size < descs.length;

  const missingTitle = readable.some((page) => !page.parsed.title.trim());
  const missingDesc = readable.some((page) => !page.parsed.metaDescription.trim());
  const missingH1 = readable.some((page) => page.parsed.h1.length === 0);

  if (partialScan) {
    if (locale === "en") {
      return {
        detail: "Some planned pages did not finish loading — SEO signals are partial.",
        tone: "neutral",
      };
    }
    return {
      detail: "חלק מהעמודים לא נטענו — בדיקת כותרות ומטא חלקית.",
      tone: "neutral",
    };
  }

  if (dupTitles) {
    return locale === "en"
      ? { detail: "Duplicate page titles on important pages.", tone: "warn" }
      : { detail: "נמצאו כותרות עמוד כפולות בעמודים חשובים.", tone: "warn" };
  }
  if (dupDesc) {
    return locale === "en"
      ? { detail: "Duplicate meta descriptions on important pages.", tone: "warn" }
      : { detail: "נמצאו תיאורי מטא כפולים בעמודים חשובים.", tone: "warn" };
  }
  if (missingH1) {
    return locale === "en"
      ? { detail: "Missing main heading (H1) on an important page.", tone: "warn" }
      : { detail: "חסרה כותרת ראשית (H1) בעמוד חשוב.", tone: "warn" };
  }
  if (missingTitle) {
    return locale === "en"
      ? { detail: "Missing page title on an important page.", tone: "warn" }
      : { detail: "חסרה כותרת עמוד בעמוד חשוב.", tone: "warn" };
  }
  if (missingDesc) {
    return locale === "en"
      ? { detail: "Missing meta description on an important page.", tone: "warn" }
      : { detail: "חסר תיאור מטא בעמוד חשוב.", tone: "warn" };
  }

  return locale === "en"
    ? { detail: "Unique page titles and meta looked consistent.", tone: "ok" }
    : { detail: "נמצאו כותרות עמוד ייחודיות ותיאורי מטא עקביים.", tone: "ok" };
}

function linksSubtitle(
  locale: SiteCheckLocale,
  linkProbesRun: number,
  brokenLinksVerified: number,
  partialScan: boolean,
): { detail: string; tone: SiteCheckTopicTone } {
  if (linkProbesRun === 0) {
    return locale === "en"
      ? {
          detail: partialScan
            ? "Link checks did not run — scan ended early."
            : "No internal links were probed on the pages we read.",
          tone: "skipped",
        }
      : {
          detail: partialScan
            ? "בדיקת קישורים לא הסתיימה — הסריקה נעצרה מוקדם."
            : "לא נבדקו קישורים פנימיים בעמודים שנקראו.",
          tone: "skipped",
        };
  }

  const probeLine =
    locale === "en"
      ? `${linkProbesRun} probed`
      : `${linkProbesRun} נבדקו`;

  if (brokenLinksVerified > 0) {
    const broken =
      locale === "en"
        ? brokenLinksVerified === 1
          ? "1 broken link verified"
          : `${brokenLinksVerified} broken links verified`
        : brokenLinksVerified === 1
          ? "אומת קישור שבור אחד"
          : `אומתו ${brokenLinksVerified} קישורים שבורים`;
    return { detail: `${probeLine} · ${broken}`, tone: "warn" };
  }

  const ok =
    locale === "en" ? "no broken link verified" : "לא אומת קישור שבור";
  return { detail: `${probeLine} · ${ok}`, tone: "ok" };
}

function imagesSubtitle(
  locale: SiteCheckLocale,
  imageProbesRun: number,
  brokenImagesCount: number,
  partialScan: boolean,
): { detail: string; tone: SiteCheckTopicTone } {
  if (imageProbesRun === 0) {
    return locale === "en"
      ? {
          detail: partialScan
            ? "Hero image checks did not run — scan ended early."
            : "No leading images were found to check.",
          tone: "skipped",
        }
      : {
          detail: partialScan
            ? "בדיקת תמונות לא הסתיימה — הסריקה נעצרה מוקדם."
            : "לא נמצאו תמונות מרכזיות לבדיקה.",
          tone: "skipped",
        };
  }

  const countLine =
    locale === "en"
      ? imageProbesRun === 1
        ? "1 checked"
        : `${imageProbesRun} checked`
      : imageProbesRun === 1
        ? "אחת נבדקה"
        : `${imageProbesRun} נבדקו`;

  if (brokenImagesCount > 0) {
    const broken =
      locale === "en"
        ? brokenImagesCount === 1
          ? "1 failed to load"
          : `${brokenImagesCount} failed to load`
        : brokenImagesCount === 1
          ? "אחת לא נטענה"
          : `${brokenImagesCount} לא נטענו`;
    return { detail: `${countLine} · ${broken}`, tone: "warn" };
  }

  const ok =
    locale === "en"
      ? imageProbesRun === 1
        ? "loaded OK"
        : imageProbesRun === 2
          ? "both loaded OK"
          : "all loaded OK"
      : imageProbesRun === 1
        ? "נטענה בהצלחה"
        : imageProbesRun === 2
          ? "שתיהן נטענו"
          : "כולן נטענו";
  return { detail: `${countLine} · ${ok}`, tone: "ok" };
}

export function buildTopicSummaries(input: {
  locale: SiteCheckLocale;
  contentScanned: number;
  partialScan: boolean;
  analyzable: AnalyzablePage[];
  linkProbesRun: number;
  imageProbesRun: number;
  brokenLinksVerified: number;
  brokenImagesCount: number;
}): SiteCheckTopicSummary[] {
  const { locale, contentScanned, partialScan, analyzable } = input;
  const pagesLabel =
    locale === "en"
      ? contentScanned === 1
        ? "1 page checked"
        : `${contentScanned} pages checked`
      : contentScanned === 1
        ? "עמוד אחד נבדק"
        : `${contentScanned} עמודים נבדקו`;

  const seo = seoSubtitle(locale, analyzable, partialScan);
  const links = linksSubtitle(locale, input.linkProbesRun, input.brokenLinksVerified, partialScan);
  const images = imagesSubtitle(
    locale,
    input.imageProbesRun,
    input.brokenImagesCount,
    partialScan,
  );

  return [
    { id: "seo", detail: `${pagesLabel} · ${seo.detail}`, tone: seo.tone },
    { id: "links", detail: links.detail, tone: links.tone },
    { id: "images", detail: images.detail, tone: images.tone },
  ];
}
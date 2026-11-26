import type { LinkProbeResult } from "./probe-link";
import type { ImageProbeStats, SiteCheckLocale, SiteCheckTopicTone } from "./types";

export function tallyImageProbeResult(result: LinkProbeResult): keyof Pick<ImageProbeStats, "loadedOk" | "broken" | "unverified"> {
  if (result === "ok") return "loadedOk";
  if (result === "broken") return "broken";
  return "unverified";
}

export function imagesTopicLine(
  locale: SiteCheckLocale,
  stats: ImageProbeStats,
  partialScan: boolean,
): { detail: string; tone: SiteCheckTopicTone } {
  const { imagesProbed, pagesWithImages, loadedOk, broken, unverified } = stats;

  if (imagesProbed === 0) {
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

  const scopeHe =
    imagesProbed === 1
      ? pagesWithImages === 1
        ? "תמונה אחת נבדקה מעמוד אחד"
        : `תמונה אחת נבדקה מ־${pagesWithImages} עמודים`
      : pagesWithImages === 1
        ? `${imagesProbed} תמונות נבדקו מעמוד אחד`
        : `${imagesProbed} תמונות נבדקו מ־${pagesWithImages} עמודים`;

  const scopeEn =
    imagesProbed === 1
      ? pagesWithImages === 1
        ? "1 image checked from 1 page"
        : `1 image checked from ${pagesWithImages} pages`
      : pagesWithImages === 1
        ? `${imagesProbed} images checked from 1 page`
        : `${imagesProbed} images checked from ${pagesWithImages} pages`;

  const parts: string[] = [];

  if (locale === "en") {
    if (loadedOk > 0) {
      parts.push(
        loadedOk === 1 ? "1 loaded successfully" : `${loadedOk} loaded successfully`,
      );
    }
    if (broken > 0) {
      parts.push(broken === 1 ? "1 failed to load (404/410)" : `${broken} failed to load`);
    }
    if (unverified > 0) {
      parts.push(
        unverified === 1 ? "1 could not be verified" : `${unverified} could not be verified`,
      );
    }
    const detail = `${scopeEn} · ${parts.join(", ")}`;
    const tone: SiteCheckTopicTone =
      broken > 0 ? "warn" : unverified > 0 ? "neutral" : "ok";
    return { detail, tone };
  }

  if (loadedOk > 0) {
    parts.push(
      loadedOk === 1 ? "תמונה אחת נטענה בהצלחה" : `${loadedOk} נטענו בהצלחה`,
    );
  }
  if (broken > 0) {
    parts.push(broken === 1 ? "תמונה אחת לא נטענה" : `${broken} לא נטענו`);
  }
  if (unverified > 0) {
    parts.push(unverified === 1 ? "תמונה אחת לא אומתה" : `${unverified} לא אומתו`);
  }

  const detail = `${scopeHe} · ${parts.join(", ")}`;
  const tone: SiteCheckTopicTone = broken > 0 ? "warn" : unverified > 0 ? "neutral" : "ok";
  return { detail, tone };
}
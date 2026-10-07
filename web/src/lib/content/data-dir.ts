import path from "path";
import type { Locale } from "@/i18n/routing";

/** Content JSON shipped with the Next.js app. Not the migration-audit archive. */
export const CONTENT_DATA_DIR = path.join(process.cwd(), "src", "data", "content");

export const CONTENT_EN_DATA_DIR = path.join(process.cwd(), "src", "data", "content-en");

export function contentDataDirForLocale(locale: Locale): string {
  return locale === "en" ? CONTENT_EN_DATA_DIR : CONTENT_DATA_DIR;
}

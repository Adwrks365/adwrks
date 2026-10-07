import type { Locale } from "@/i18n/routing";
import * as he from "./data";
import * as en from "./data.en";

export function getHomepageData(locale: Locale) {
  return locale === "en" ? en : he;
}

export type { HomepageCounter } from "./data";

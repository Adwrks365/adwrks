import type { Locale } from "@/i18n/routing";
import * as en from "./check-fit-data.en";
import * as he from "./check-fit-data";

export function getCheckFitContent(locale: Locale) {
  return locale === "en" ? en : he;
}

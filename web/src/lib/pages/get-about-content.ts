import type { Locale } from "@/i18n/routing";
import * as en from "./about-content.en";
import * as he from "./about-content";

export function getAboutPageContent(locale: Locale) {
  return locale === "en" ? en : he;
}

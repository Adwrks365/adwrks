import type { Locale } from "@/i18n/routing";
import * as en from "./contact-content.en";
import * as he from "./contact-content";

export function getContactPageContent(locale: Locale) {
  return locale === "en" ? en : he;
}

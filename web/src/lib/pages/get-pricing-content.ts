import type { Locale } from "@/i18n/routing";
import * as en from "./pricing-content.en";
import * as he from "./pricing-content";

export function getPricingPageContent(locale: Locale) {
  return locale === "en" ? en : he;
}

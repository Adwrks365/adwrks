import type { Locale } from "@/i18n/routing";
import * as googleAdsEn from "./google-ads-content.en";
import * as googleAdsHe from "./google-ads-content";
import * as hostingEn from "./hosting-content.en";
import * as hostingHe from "./hosting-content";
import * as hubEn from "./hub-content.en";
import * as hubHe from "./hub-content";
import * as seoEn from "./seo-content.en";
import * as seoHe from "./seo-content";
import * as socialEn from "./social-media-content.en";
import * as socialHe from "./social-media-content";
import * as wbEn from "./website-building-content.en";
import * as wbHe from "./website-building-content";

export function getSeoPageContent(locale: Locale) {
  return locale === "en" ? seoEn : seoHe;
}

export function getGoogleAdsPageContent(locale: Locale) {
  return locale === "en" ? googleAdsEn : googleAdsHe;
}

export function getSocialMediaPageContent(locale: Locale) {
  return locale === "en" ? socialEn : socialHe;
}

export function getHostingPageContent(locale: Locale) {
  return locale === "en" ? hostingEn : hostingHe;
}

export function getWebsiteBuildingPageContent(locale: Locale) {
  return locale === "en" ? wbEn : wbHe;
}

export function getServiceHubContent(locale: Locale) {
  return locale === "en" ? hubEn : hubHe;
}

import type { Locale } from "@/i18n/routing";
import {
  MONTHLY_SERVICES,
  ONETIME_SERVICES,
  PRICING_CALCULATOR_CONTACT,
  PRICING_CALCULATOR_WHATSAPP,
  type PricingService,
} from "./pricing-calculator-data";
import {
  MONTHLY_SERVICES_EN,
  ONETIME_SERVICES_EN,
  PRICING_CALCULATOR_CONTACT_EN,
  PRICING_CALCULATOR_LABELS_EN,
  PRICING_CALCULATOR_WHATSAPP_EN,
} from "./pricing-calculator-data.en";

export type PricingCalculatorLabels = {
  popular: string;
  fromPrefix: string;
  monthlySection: string;
  onetimeSection: string;
  resultsTitle: string;
  resultsEmpty: string;
  monthlyTotal: string;
  monthlySuffix: string;
  onetimeTotal: string;
  whatsapp: string;
  contact: string;
  disclaimer: string;
};

export type PricingCalculatorData = {
  monthlyServices: readonly PricingService[];
  onetimeServices: readonly PricingService[];
  allServices: readonly PricingService[];
  whatsappUrl: string;
  contactPath: string;
  labels: PricingCalculatorLabels;
  dir: "ltr" | "rtl";
  numberLocale: string;
};

const LABELS_HE: PricingCalculatorLabels = {
  popular: "פופולרי",
  fromPrefix: "החל מ-",
  monthlySection: "שירותים חודשיים",
  onetimeSection: "בניית אתרים ודפי נחיתה",
  resultsTitle: "סיכום הערכת מחיר",
  resultsEmpty: "בחרו שירותים לקבלת הערכת מחיר",
  monthlyTotal: "חודשי:",
  monthlySuffix: " / חודש",
  onetimeTotal: "חד פעמי:",
  whatsapp: "שלחו בוואטסאפ",
  contact: "לקבלת הצעת מחיר",
  disclaimer: '* המחירים הם מחירי התחלה בש"ח לפני מע"מ',
};

export function getPricingCalculatorData(locale: Locale = "he"): PricingCalculatorData {
  if (locale === "en") {
    const all = [...MONTHLY_SERVICES_EN, ...ONETIME_SERVICES_EN];
    return {
      monthlyServices: MONTHLY_SERVICES_EN,
      onetimeServices: ONETIME_SERVICES_EN,
      allServices: all,
      whatsappUrl: PRICING_CALCULATOR_WHATSAPP_EN,
      contactPath: PRICING_CALCULATOR_CONTACT_EN,
      labels: PRICING_CALCULATOR_LABELS_EN,
      dir: "ltr",
      numberLocale: "en-US",
    };
  }

  return {
    monthlyServices: MONTHLY_SERVICES,
    onetimeServices: ONETIME_SERVICES,
    allServices: [...MONTHLY_SERVICES, ...ONETIME_SERVICES],
    whatsappUrl: PRICING_CALCULATOR_WHATSAPP,
    contactPath: PRICING_CALCULATOR_CONTACT,
    labels: LABELS_HE,
    dir: "rtl",
    numberLocale: "he-IL",
  };
}

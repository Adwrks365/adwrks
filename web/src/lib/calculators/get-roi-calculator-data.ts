import type { Locale } from "@/i18n/routing";
import { ROI_CALCULATOR_LABELS_HE } from "./roi-calculator-data";
import { ROI_CALCULATOR_LABELS_EN } from "./roi-calculator-data.en";

export type RoiCalculatorData = {
  labels: typeof ROI_CALCULATOR_LABELS_HE;
  dir: "rtl" | "ltr";
  numberLocale: string;
};

export function getRoiCalculatorData(locale: Locale = "he"): RoiCalculatorData {
  if (locale === "en") {
    return {
      labels: ROI_CALCULATOR_LABELS_EN,
      dir: "ltr",
      numberLocale: "en-US",
    };
  }
  return {
    labels: ROI_CALCULATOR_LABELS_HE,
    dir: "rtl",
    numberLocale: "he-IL",
  };
}

export type RoiCalculationInput = {
  adSpend: number;
  cpl: number;
  conversionRate: number;
  orderValue: number;
};

export type RoiCalculationResult = {
  leads: number;
  customers: number;
  revenue: number;
  profit: number;
  roiPercent: number;
};

export function calculateRoi(input: RoiCalculationInput): RoiCalculationResult | null {
  const { adSpend, cpl, conversionRate, orderValue } = input;
  if (adSpend <= 0 || cpl <= 0 || conversionRate <= 0 || orderValue <= 0) {
    return null;
  }

  const leads = adSpend / cpl;
  const customers = leads * (conversionRate / 100);
  const revenue = customers * orderValue;
  const profit = revenue - adSpend;
  const roiPercent = (profit / adSpend) * 100;

  return { leads, customers, revenue, profit, roiPercent };
}

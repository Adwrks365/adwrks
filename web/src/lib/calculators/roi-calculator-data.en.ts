import type { RoiCalculatorLabels, RoiIndustryPreset, RoiBusinessType, RoiPlatform } from "./roi-calculator-data";

export const ROI_INDUSTRY_PRESETS_EN: Record<
  RoiBusinessType,
  Record<RoiPlatform, RoiIndustryPreset>
> = {
  store: {
    google: { cpl: 45, roiMin: 200, roiMax: 350 },
    meta: { cpl: 35, roiMin: 180, roiMax: 300 },
  },
  professional: {
    google: { cpl: 55, roiMin: 250, roiMax: 450 },
    meta: { cpl: 45, roiMin: 200, roiMax: 350 },
  },
  b2b: {
    google: { cpl: 80, roiMin: 300, roiMax: 500 },
    meta: { cpl: 65, roiMin: 250, roiMax: 400 },
  },
};

export const ROI_CALCULATOR_LABELS_EN: RoiCalculatorLabels = {
  title: "Return on investment (ROI)",
  intro:
    "Pick channel and business type for benchmark CPL from the article, then adjust conversion and order value.",
  platform: "Advertising platform",
  platformGoogle: "Google Ads",
  platformMeta: "Meta (Facebook / Instagram)",
  businessType: "Business type",
  businessStore: "Store / eCommerce",
  businessProfessional: "Professional services",
  businessB2b: "B2B",
  presetHint: "Average CPL from the article table — editable",
  adSpend: "Ad budget (₪)",
  adSpendHint: "Monthly media spend",
  cpl: "Cost per lead CPL (₪)",
  cplHint: "Average lead cost on the selected channel",
  conversionRate: "Conversion rate (%)",
  conversionHint: "Share of leads that become paying customers",
  orderValue: "Average order value (₪)",
  orderValueHint: "Typical revenue per customer",
  resultsTitle: "Estimated results",
  leads: "Estimated leads",
  customers: "Customers",
  revenue: "Revenue",
  profit: "Net profit (before extra costs)",
  roi: "ROI",
  roas: "ROAS",
  benchmarkBelow: "Below typical range for this channel and industry",
  benchmarkWithin: "Within typical ROI range for this channel",
  benchmarkAbove: "Above benchmark — strong performance",
  benchmarkRange: "Article benchmark: {min}–{max}%",
  formulaNote: "ROI: (Revenue − cost) ÷ cost × 100 · ROAS: Revenue ÷ budget",
  disclaimer:
    "Estimate only — excludes fees, shipping, management, or LTV. Contact us for a tailored plan.",
};

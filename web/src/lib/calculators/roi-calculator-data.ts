/** Placeholder inserted where legacy Sticklight ROI iframe lived. */
export const ROI_CALCULATOR_EMBED_SLOT =
  '<div class="adwrks-roi-calculator-embed" data-adwrks-roi-calculator></div>';

export type RoiPlatform = "google" | "meta";
export type RoiBusinessType = "store" | "professional" | "b2b";

export type RoiIndustryPreset = {
  cpl: number;
  roiMin: number;
  roiMax: number;
};

export type RoiCalculatorLabels = {
  title: string;
  intro: string;
  platform: string;
  platformGoogle: string;
  platformMeta: string;
  businessType: string;
  businessStore: string;
  businessProfessional: string;
  businessB2b: string;
  presetHint: string;
  adSpend: string;
  adSpendHint: string;
  cpl: string;
  cplHint: string;
  conversionRate: string;
  conversionHint: string;
  orderValue: string;
  orderValueHint: string;
  resultsTitle: string;
  leads: string;
  customers: string;
  revenue: string;
  profit: string;
  roi: string;
  roas: string;
  benchmarkBelow: string;
  benchmarkWithin: string;
  benchmarkAbove: string;
  benchmarkRange: string;
  formulaNote: string;
  disclaimer: string;
};

/** CPL + typical ROI band — aligned with article industry table (post 22727). */
export const ROI_INDUSTRY_PRESETS_HE: Record<
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

export const ROI_CALCULATOR_LABELS_HE: RoiCalculatorLabels = {
  title: "חישוב החזר השקעה (ROI)",
  intro:
    "בחרו ערוץ וסוג עסק לקבלת CPL ממוצע מהמאמר, ואז התאימו המרה ושווי עסקה לנתונים שלכם.",
  platform: "פלטפורמת פרסום",
  platformGoogle: "Google Ads",
  platformMeta: "Meta (Facebook / Instagram)",
  businessType: "סוג עסק",
  businessStore: "חנות / eCommerce",
  businessProfessional: "עסק מקצועי / שירותים",
  businessB2b: "B2B",
  presetHint: "CPL ממוצע לפי הטבלה במאמר — ניתן לעריכה",
  adSpend: "תקציב פרסום (₪)",
  adSpendHint: "סכום ההשקעה החודשי בקמפיין",
  cpl: "עלות לליד CPL (₪)",
  cplHint: "כמה עולה ליד אחד בממוצע בערוץ שנבחר",
  conversionRate: "אחוז המרה (%)",
  conversionHint: "מתוך הלידים — כמה הפכו ללקוחות",
  orderValue: "שווי עסקה ממוצע (₪)",
  orderValueHint: "הכנסה ממוצעת מלקוח",
  resultsTitle: "תוצאות משוערות",
  leads: "לידים משוערים",
  customers: "לקוחות",
  revenue: "הכנסות",
  profit: "רווח נקי (לפני עלויות נלוות)",
  roi: "ROI",
  roas: "ROAS",
  benchmarkBelow: "מתחת לטווח הממוצע לערוץ ולתעשייה שנבחרו",
  benchmarkWithin: "בטווח ROI טיפוסי לערוץ זה",
  benchmarkAbove: "מעל הממוצע — ביצועים חזקים",
  benchmarkRange: "טווח ממוצע במאמר: {min}–{max}%",
  formulaNote: "ROI: (הכנסות − עלויות) ÷ עלויות × 100 · ROAS: הכנסות ÷ תקציב",
  disclaimer:
    "הערכה בלבד — לא כולל עמלות, משלוחים, עלויות ניהול או LTV. לתכנון מדויק צרו קשר.",
};

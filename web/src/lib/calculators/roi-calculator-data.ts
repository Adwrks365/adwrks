/** Placeholder inserted where legacy Sticklight ROI iframe lived. */
export const ROI_CALCULATOR_EMBED_SLOT =
  '<div class="adwrks-roi-calculator-embed" data-adwrks-roi-calculator></div>';

export type RoiCalculatorLabels = {
  title: string;
  intro: string;
  adSpend: string;
  adSpendHint: string;
  cpl: string;
  cplHint: string;
  conversionRate: string;
  conversionHint: string;
  orderValue: string;
  orderValueHint: string;
  calculate: string;
  resultsTitle: string;
  leads: string;
  customers: string;
  revenue: string;
  profit: string;
  roi: string;
  formulaNote: string;
  disclaimer: string;
};

export const ROI_CALCULATOR_LABELS_HE: RoiCalculatorLabels = {
  title: "חישוב החזר השקעה (ROI)",
  intro: "הזינו תקציב פרסום, עלות לליד, אחוז המרה ושווי עסקה — לפי הנוסחה במאמר.",
  adSpend: "תקציב פרסום (₪)",
  adSpendHint: "סכום ההשקעה החודשי בקמפיין",
  cpl: "עלות לליד CPL (₪)",
  cplHint: "כמה עולה ליד אחד בממוצע",
  conversionRate: "אחוז המרה (%)",
  conversionHint: "מתוך הלידים — כמה הפכו ללקוחות",
  orderValue: "שווי עסקה ממוצע (₪)",
  orderValueHint: "הכנסה ממוצעת מלקוח",
  calculate: "חשב ROI",
  resultsTitle: "תוצאות משוערות",
  leads: "לידים משוערים",
  customers: "לקוחות",
  revenue: "הכנסות",
  profit: "רווח נקי (לפני עלויות נלוות)",
  roi: "ROI",
  formulaNote: "(הכנסות − עלויות) ÷ עלויות × 100",
  disclaimer: "הערכה בלבד — לא כולל עמלות, משלוחים או עלויות ניהול. לתכנון מדויק צרו קשר.",
};

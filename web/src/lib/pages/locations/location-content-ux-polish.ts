/** Phrase polish for visible location copy (not SEO title/meta, not H1). */

const HE_RULES: [RegExp, string][] = [
  [/Search לכוונה(?: גבוהה)?/g, "פרסום בחיפוש בגוגל למי שכבר מחפש את השירות"],
  [/Meta לvisual|Meta ל-visual/gi, "פרסום ב-Meta עם תמונות וסרטונים"],
  [/Meta ל-awareness|Meta לקהלים ויזואליים/gi, "פרסום ב-Meta לחשיפה ממוקדת"],
  [/Meta לסקייל/gi, "פרסום ב-Meta להרחבת קהל"],
  [/remarketing/gi, "פרסום חוזר לגולשים שכבר הכירו אתכם"],
  [/\btracking\b/gi, "מעקב אחרי פניות"],
  [/\bCPC\b/g, "עלות לקליק בגוגל"],
  [/CPC גבוה/g, "עלות גבוהה לקליק בגוגל"],
  [/\bscale\b/gi, "להרחיב את מה שעובד"],
  [/\bbuzz\b/gi, "חשיפה בלבד"],
  [/ריטיינר עמום/g, "תשלום חודשי בלי דוחות ברורים"],
  [/ROI ליד גוש דן/g, "תוצאות מדידות בגוש הדן"],
  [/נבדוק tracking, דף ומודעות/g, "נבדוק יחד את מדידת הפניות, את דף הנחיתה ואת המודעות"],
  [/נחדד מסר ו-tracking/g, "נחדד מסר, דף נחיתה ומדידת פניות"],
  [/מדידת ROI/g, "מדידת תוצאות השיווק"],
  [/מודדים ROI/g, "בודקים מה השיווק מחזיר"],
  [/עם ROI/g, "עם מדידה ברורה"],
  [/ו-ROI/g, "ומדידת תוצאות"],
  [/\bROI\b/g, "תשואה על השיווק"],
  [/לידים, ROI|לידים ו-ROI/g, "פניות איכותיות ותוצאות מדידות"],
  [/חברה לפרסום/g, "חברה לשיווק דיגיטלי"],
  [/משרדי שירות וייעוץ(?! —)/g, "משרדי עורכי דין, רואי חשבון ויועצים"],
  [/השאירו פרטים\.?$/g, "ספרו לנו בקצרה על העסק — נחזור אליכם עם כיוון ראשוני."],
  [/ספרו על העסק\.?$/g, "ספרו לנו על העסק והשירותים שאתם מציעים."],
  [/ספרו על התחרות והיעד/g, "ספרו על העסק, על סוג הלקוחות שאתם מחפשים ועל המטרות בשיווק"],
  [/נציע ערוצים/g, "נעזור לבחור ערוצי פרסום מתאימים"],
  [/יותר לידים, פחות חשיפה/g, "יותר פניות רלוונטיות, פחות בזבוז על חשיפה"],
  [/פחות קליקים מגוש דן — יותר לידים מקומיים/g, "פחות בזבוז על גולשים מחוץ לאזור — יותר פניות מקומיות"],
  [/נכוון מודעות ו-SEO לקהל הנכון/g, "נכוון את המודעות ואת הקידום בגוגל לקהל שמתאים לכם באמת"],
  [/נפריד קהלים ונמדוד ROI לפי עיר/g, "נפריד בין קהלים שונים ונמדוד תוצאות לפי כל עיר"],
  [/נפריד קהלים ונמדיד תוצאות/g, "נפריד בין קהלים שונים ונמדוד תוצאות"],
  [/תוכנית מרחוק עם ROI ברור/g, "תוכנית מרחוק עם יעדים ומדידה ברורים"],
  [/nurturing/gi, "טיפוח לאורך זמן"],
  [/product-market fit/gi, "התאמה בין המוצר לקהל"],
  [/MVP קמפיין/g, "קמפיין התחלתי למבחן"],
  [/Meta ל-brand/gi, "Meta לחיזוק המותג"],
  [/PPC ו-SEO בתחרות יקרה, עם מסר חד ו-ROI/g, "פרסום ממומן וקידום אורגני בתחרות גבוהה, עם מסר ברור ומדידה"],
  [/Ads בעונה, SEO מקומי, Meta לvisual/g, "מודעות מותאמות לעונה, קידום מקומי בגוגל ופרסום ויזואלי ב-Meta"],
  [/Meta לעונות, Search לכוונה/g, "פרסום עונתי ב-Meta וחיפוש בגוגל ללקוחות עם כוונה"],
  [/קפות ואירוח/g, "בתי קפה ומקומות אירוח"],
];

const EN_RULES: [RegExp, string][] = [
  [/CPC is high/gi, "Paid clicks are costly"],
  [/\bCPC\b/g, "cost per click"],
  [/\bPPC\b/g, "paid search"],
  [/\btracking\b/gi, "lead and conversion measurement"],
  [/\bscale\b/gi, "grow what works"],
  [/\bbuzz\b/gi, "visibility only"],
  [/\bremarketing\b/gi, "follow-up ads to past visitors"],
  [/vanity metrics/gi, "vanity metrics alone"],
  [/measurable ROI/gi, "clear, measurable results"],
  [/improve ROI/gi, "improve return on marketing spend"],
  [/Weak conversion tracking/gi, "No reliable lead measurement"],
  [/review channels, budget, and ROI/gi, "review channels, budget, and expected results"],
  [/budget, tracking, and ROI/gi, "budget, measurement, and realistic goals"],
  [/Leave your details/gi, "Tell us briefly about your business and we will follow up"],
  [/Tell us about the competition/gi, "Tell us about your business, ideal customers, and goals"],
];

export function polishLocationText(text: string, locale: "he" | "en"): string {
  let out = text;
  const rules = locale === "he" ? HE_RULES : EN_RULES;
  for (const [re, rep] of rules) {
    out = out.replace(re, rep);
  }
  return out;
}

type FaqItem = { q: string; a: string };
type Block = { title: string; text: string };
type Step = { title: string; text: string };

function polishStringArray(items: string[], locale: "he" | "en"): string[] {
  return items.map((item) => polishLocationText(item, locale));
}

function polishFaq(items: FaqItem[], locale: "he" | "en"): void {
  for (const item of items) {
    item.q = polishLocationText(item.q, locale);
    item.a = polishLocationText(item.a, locale);
  }
}

function polishBlocks(items: Block[], locale: "he" | "en"): void {
  for (const block of items) {
    block.title = polishLocationText(block.title, locale);
    block.text = polishLocationText(block.text, locale);
  }
}

function polishSteps(items: Step[], locale: "he" | "en"): void {
  for (const step of items) {
    step.title = polishLocationText(step.title, locale);
    step.text = polishLocationText(step.text, locale);
  }
}

export function polishStringFields<T extends Record<string, unknown>>(
  row: T,
  locale: "he" | "en",
  skipKeys: ReadonlySet<string>,
): void {
  for (const [key, val] of Object.entries(row)) {
    if (skipKeys.has(key)) continue;
    if (typeof val === "string") {
      (row as Record<string, string>)[key] = polishLocationText(val, locale);
      continue;
    }
    if (!Array.isArray(val)) continue;

    if (key === "faq") {
      polishFaq(val as FaqItem[], locale);
    } else if (key === "serviceBlocks") {
      polishBlocks(val as Block[], locale);
    } else if (key === "workSteps") {
      polishSteps(val as Step[], locale);
    } else {
      (row as Record<string, unknown>)[key] = polishStringArray(val as string[], locale);
    }
  }
}
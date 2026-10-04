export const CONTACT_HERO = {
  eyebrow: "יצירת קשר",
  lead: "ספרו לנו מה המטרה — נבחן את הפנייה, נדבר ונבין יחד את הכיוון המתאים לעסק.",
  primaryCta: "ספרו לנו על העסק",
} as const;

export const CONTACT_CONVERSION = {
  title: "בואו נדבר על העסק שלכם",
  formIntro: "יש לך שאלה / זקוק לייעוץ? אנו מצפים לשמוע ממך!",
  submitLabel: "שליחת פנייה",
  directPrompt: "מעדיפים לדבר ישירות?",
} as const;

export const CONTACT_PLANNER = {
  kicker: "מה המטרה?",
  title: "עוזר לנו להבין מה אתם מחפשים",
  step1Label: "מה המטרה העיקרית שלכם?",
  step2Label: "מה כבר קיים היום?",
  step2Optional: "אופציונלי",
  goals: [
    "לקבל יותר לידים",
    "להגדיל מכירות",
    "לשפר נוכחות בגוגל",
    "לקדם אתר קיים",
    "לבנות אתר חדש",
    "לחזק את הרשתות החברתיות",
    "לא בטוחים — נשמח לייעוץ",
  ],
  existing: [
    "אתר פעיל",
    "Google Ads",
    "SEO",
    "Facebook / Instagram",
    "עדיין לא התחלנו",
    "אחר",
  ],
  summaryPrefix: "הקשר מהתכנון:",
} as const;

export const CONTACT_PROCESS = {
  title: "מה קורה אחרי שמשאירים פרטים?",
  steps: [
    { title: "שולחים פרטים", text: "ממלאים את הטופס או יוצרים קשר ישיר." },
    { title: "עוברים על הפנייה", text: "בוחנים את מה שסיפרתם ואת הצורך העסקי." },
    { title: "מדברים ומבינים", text: "שיחה קצרה להבנת המטרות וההקשר." },
    { title: "מתאימים כיוון", text: "מציעים את השילוב והשירותים המתאימים." },
  ],
} as const;

/** Verified quotes reused from homepage testimonials — inlined to keep client bundles free of server-only media helpers. */
export const CONTACT_TESTIMONIALS = {
  title: "מה אומרים הלקוחות שלנו",
  items: [
    {
      name: "אלעד שבתאי",
      title: "קמרי את שבתאי שילוביצקי ושות' - משרד עורכי דין",
      content:
        "מאוד מומלצים! חברה רצינית ששואפת לשלמות. עשו עבודה איכותית הניבה תוצאות באופן מיידי.",
      image: "/wp-content/uploads/19388777_10211736809509377_8947026352501099299_o-150x150.webp",
    },
    {
      name: "Danny Ben Atar",
      title: "דני מחשבים",
      content:
        "הקידום היחידי שעובד!!!\nחבר'ה אלופים ומקצוענים בראשם סרגיי\nבמחיר נוח ויחס מעולה ואיכפתי וקשוב\nפשוט אלופים🏆🏆🏆🙏",
      image: "/wp-content/uploads/204687284_4055670721208389_2009856386006580434_n-150x150.webp",
    },
    {
      name: "אמיר אמסלם",
      title: "אמיר חשמל ודיאגנוסטיקה לרכב",
      content:
        "אני ממליץ עליהם כי קודם כל הם בני אדם לפני הכל ושיווק ופרסום שלהם העלה את המודעות אצל הרבה אנשים לגבי העסק שלי מי עסק שלי ואיזה שירותים אני נותן . ממליץ בחום נותנים תמורה מעבר לתשלום שהם גובים .",
      image: "/wp-content/uploads/23334247_1577479552307221_1915736016569884908_o-150x150.webp",
    },
  ],
} as const;

export const CONTACT_TRUST = {
  since: "מאז 2018",
  googleBadge: "/wp-content/uploads/Partner-CMYK-.webp",
  partnersImage: "/wp-content/uploads/google-meta-partners-e1769685292174.webp",
} as const;

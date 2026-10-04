export const CONTACT_HERO = {
  eyebrow: "יצירת קשר",
  lead:
    "ספרו לנו מה העסק צריך — נבחן את הפנייה, נדבר ונבין את המטרה, ונוכל להתאים את הכיוון והשירותים הרלוונטיים.",
  points: [
    "ספרו לנו מה העסק צריך",
    "נבחן את הפנייה ונחזור אליכם",
    "נדבר ונבין את המטרה והכיוון",
  ],
} as const;

export const CONTACT_FORM = {
  title: "בואו נדבר",
  intro: "יש לך שאלה / זקוק לייעוץ? אנו מצפים לשמוע ממך!",
  submitLabel: "שליחת פנייה",
} as const;

export const CONTACT_PROCESS = {
  title: "מה קורה אחרי שמשאירים פרטים?",
  steps: [
    { title: "שולחים פרטים", text: "ממלאים את הטופס או יוצרים קשר ישיר." },
    { title: "עוברים על הפנייה", text: "אנחנו בוחנים את מה שסיפרתם ואת הצורך העסקי." },
    { title: "מדברים ומבינים", text: "שיחה קצרה להבנת המטרות, האתגרים וההקשר." },
    { title: "מתאימים כיוון", text: "מציעים את השילוב והשירותים המתאימים לעסק." },
  ],
} as const;

export const CONTACT_SERVICES = {
  title: "לא בטוחים איזה שירות מתאים?",
  intro: "ספרו לנו מה המטרה — Google Ads, SEO, סושיאל, אתרים, אחסון או שילוב — ונוכל להבין יחד מה הכיוון.",
  items: [
    { label: "Google Ads", href: "/google-ads/" },
    { label: "SEO", href: "/seo/" },
    { label: "סושיאל", href: "/social-media-management/" },
    { label: "בניית אתרים", href: "/website-building/" },
    { label: "אחסון ותחזוקה", href: "/hosting-plans/" },
  ],
} as const;

export const CONTACT_TRUST = {
  since: "מאז 2018",
  googleBadge: "/wp-content/uploads/Partner-CMYK-.webp",
  partnersImage: "/wp-content/uploads/google-meta-partners-e1769685292174.webp",
} as const;

export const CONTACT_CLOSING = {
  title: "לא בטוחים איזה שירות מתאים?",
  body: "ספרו לנו מה המטרה ונוכל להבין יחד מה הכיוון המתאים — בלי התחייבות.",
} as const;

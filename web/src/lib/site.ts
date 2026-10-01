/** Local migrated asset path under /public/wp-content/uploads. */
export function asset(path: string): string {
  return `/wp-content/uploads/${path.replace(/^\/+/, "")}`;
}

/** Central verified business data from migration audit / production site. */
export const SITE = {
  name: "Adwrks 365",
  legalName: "Adwrks 365",
  tagline: "סוכנות שיווק דיגיטלי",
  description:
    "סוכנות שיווק דיגיטלי - בניית אתרים, שיווק, קידום ופרסום באינטרנט",
  domain: "https://adwrks.co.il",
  locale: "he-IL",
  language: "he",
  dir: "rtl" as const,
  email: "info@adwrks.co.il",
  phone: "0795599449",
  phoneDisplay: "079-5599449",
  phoneTel: "tel:0795599449",
  address: {
    street: "מתכת 34",
    locality: "כרמיאל",
    region: "מחוז צפון",
    country: "ישראל",
    countryCode: "IL",
  },
  openingHours: [
    { day: "Sunday", hours: "09:00-17:00" },
    { day: "Monday", hours: "09:00-17:00" },
    { day: "Tuesday", hours: "09:00-17:00" },
    { day: "Wednesday", hours: "09:00-17:00" },
    { day: "Thursday", hours: "09:00-17:00" },
  ],
  social: {
    facebook: "https://www.facebook.com/adwrks365",
    instagram: "https://www.instagram.com/adwrks_365/",
    youtube: "https://www.youtube.com/channel/UCdJu6SGezKpWfL4lNnTbMsA",
  },
  whatsapp: "https://wa.me/972512402213",
  googleReviewsUrl: "https://g.page/r/CddogUmVq6U-EAE/review",
  facebookPageUrl: "https://www.facebook.com/927847237389026?ref=embed_page",
  googlePartnerUrl: "https://www.google.com/partners/agency?id=5451982519",
  /** Original square Google Partner card from the migrated media library. */
  googlePartnerBadge: asset("Partner-CMYK-.webp"),
  mapsUrl: "https://maps.app.goo.gl/8cHPmfAMpifZpQZi6",
  wazeUrl:
    "https://ul.waze.com/ul?place=ChIJaQLTBusxHBUR12iBSZWrpT4&ll=32.91810250%2C35.31301640&navigate=yes",
  navigateUrl:
    "https://www.google.com/maps/search/?api=1&query=Adwrks+365+%D7%A1%D7%95%D7%9B%D7%A0%D7%95%D7%AA+%D7%A9%D7%99%D7%95%D7%95%D7%A7+%D7%93%D7%99%D7%92%D7%99%D7%98%D7%9C%D7%99&query_place_id=ChIJaQLTBusxHBUR12iBSZWrpT4",
  logo: asset("cropped-logo-black-trans-140x47.webp"),
  logoFull: asset("logo-black-trans.png"),
  favicon32: asset("cropped-adwrks-white-32x32.webp"),
  favicon192: asset("cropped-adwrks-white-192x192.webp"),
  appleIcon: asset("cropped-adwrks-white-180x180.webp"),
  ogDefaultImage: asset("digital-marketing-agency.webp"),
  foundedNote: "מאז 2018",
} as const;

export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

/** Primary navigation mirrored from live production header (verified Phase 3.2B). */
export const PRIMARY_NAV: NavItem[] = [
  { label: "דף הבית", href: "/" },
  {
    label: "שירותים",
    href: "/שירותי-שיווק-דיגיטלי/",
    children: [
      { label: "פרסום ממומן בגוגל (Google Ads)", href: "/google-ads/" },
      { label: "קידום אתרים אורגני (SEO)", href: "/seo/" },
      { label: "ניהול רשתות חברתיות", href: "/social-media-management/" },
      { label: "בניית אתרים", href: "/website-building/" },
      { label: "אחסון אתרים", href: "/hosting-plans/" },
      { label: "מחירון שיווק דיגיטלי", href: "/מחירון-שיווק-דיגיטלי/" },
    ],
  },
  { label: "מי אנחנו", href: "/about-us/" },
  {
    label: "מידע מקצועי",
    href: "/blog/",
    children: [
      { label: "שיווק דיגיטלי", href: "/digital-marketing/" },
      { label: "קידום ממומן", href: "/digital-marketing/ads/" },
      { label: "בניית אתרים", href: "/digital-marketing/websites/" },
      { label: "קידום אורגני", href: "/digital-marketing/seo/" },
    ],
  },
  { label: "יצירת קשר", href: "/contact-us/" },
];

export const FOOTER_LEGAL_LINKS = [
  { label: "הצהרת נגישות", href: "/accessibility-statement/" },
  { label: "מדיניות פרטיות", href: "/privacy-policy/" },
  { label: "תקנון", href: "/terms-of-use/" },
] as const;

export const FOOTER_SERVICE_LINKS = PRIMARY_NAV.find((n) => n.children)?.children ?? [];

/** Social profiles for "עקבו אחרינו" — contact channels excluded. */
export const FOLLOW_SOCIAL = [
  { label: "Facebook", href: SITE.social.facebook },
  { label: "Instagram", href: SITE.social.instagram },
  { label: "YouTube", href: SITE.social.youtube },
] as const;

/** Top-level footer navigation (parent destinations). */
export const FOOTER_NAV_LINKS = PRIMARY_NAV.map(({ label, href }) => ({ label, href }));

/** Footer brand column — owner-supplied copy, split for readable line length. */
export const FOOTER_BRAND = {
  heading: "Adwrks 365 – סוכנות שיווק דיגיטלי 360°",
  paragraphs: [
    "מאז 2018, אנו מלווים עסקים וחברות בכל רחבי הארץ להצלחה דיגיטלית ומקסום רווחיות.",
    "אנו מספקים פתרונות מקיפים הכוללים בניית אתרים, קידום אורגני (SEO), ניהול קמפיינים ממומנים (PPC) וניהול מדיה חברתית.",
    "אצלנו תיהנו משירות אישי ומקצועי בגובה העיניים, מחירים הוגנים ומומחיות ייחודית בשיווק למגזר הרוסי כערך מוסף לצמיחת העסק שלכם.",
  ],
} as const;

export const FOOTER_LOCATION_LINKS = [
  { label: "Google Maps", href: SITE.mapsUrl },
  { label: "Waze", href: SITE.wazeUrl },
  { label: "ניווט", href: SITE.navigateUrl },
] as const;

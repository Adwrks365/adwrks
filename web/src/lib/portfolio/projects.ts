import type { PortfolioProject, PortfolioShowcaseVariant } from "./types";

/**
 * Featured flags and sortOrder are a PROPOSAL for homepage — adjust here only.
 * Components read from this dataset; nothing is hard-coded in UI.
 */

/** Legacy portfolio screenshots — original wp-content paths preserved (1200×1679). */
function legacyUpload(filename: string): string {
  return `/wp-content/uploads/${filename}`;
}

const LEGACY_SCREENSHOT = { screenshotWidth: 1200, screenshotHeight: 1679 } as const;

const LEGACY_PROJECTS: PortfolioProject[] = [
  {
    id: "legacy-3-1",
    title: "עמיאם",
    screenshot: legacyUpload("3-1.png"),
    screenshotAlt: "אתר עמיאם — הלבשה ומוצרי הגנה — עיצוב Adwrks 365",
    ...LEGACY_SCREENSHOT,
    featured: false,
    legacy: true,
    sortOrder: 20,
  },
  {
    id: "legacy-omanut",
    title: "אומנות בדק הבית",
    screenshot: legacyUpload("omanut.png"),
    screenshotAlt: "אתר אומנות בדק הבית — עיצוב Adwrks 365",
    ...LEGACY_SCREENSHOT,
    featured: false,
    legacy: true,
    sortOrder: 21,
  },
  {
    id: "legacy-2",
    title: "נגה אלומיניום",
    screenshot: legacyUpload("2.png"),
    screenshotAlt: "אתר נגה אלומיניום — עיצוב Adwrks 365",
    ...LEGACY_SCREENSHOT,
    featured: false,
    legacy: true,
    sortOrder: 22,
  },
  {
    id: "legacy-5",
    title: "בדק בית",
    screenshot: legacyUpload("5.png"),
    screenshotAlt: "דוגמת אתר בדק בית — עיצוב Adwrks 365",
    ...LEGACY_SCREENSHOT,
    featured: false,
    legacy: true,
    sortOrder: 23,
    showCaption: false,
    needsConfirmation: true,
  },
  {
    id: "legacy-aharon-plumber",
    title: "אהרון האינסטלטור",
    screenshot: legacyUpload("aharon-plumber.png"),
    screenshotAlt: "אתר אהרון האינסטלטור — עיצוב Adwrks 365",
    ...LEGACY_SCREENSHOT,
    featured: false,
    legacy: true,
    sortOrder: 8,
    tags: ["local-business"],
  },
  {
    id: "legacy-1-1",
    title: "NIO-BAR",
    screenshot: legacyUpload("1-1.png"),
    screenshotAlt: "אתר NIO-BAR — עיצוב Adwrks 365",
    ...LEGACY_SCREENSHOT,
    featured: false,
    legacy: true,
    sortOrder: 24,
  },
  {
    id: "legacy-bali-burger",
    title: "באלי בורגר",
    screenshot: legacyUpload("bali_burger.png"),
    screenshotAlt: "אתר באלי בורגר — עיצוב Adwrks 365",
    ...LEGACY_SCREENSHOT,
    featured: true,
    legacy: true,
    sortOrder: 7,
    tags: ["local-business"],
  },
  {
    id: "legacy-6",
    title: "עדיף – שמאות ובדק בית",
    screenshot: legacyUpload("6.png"),
    screenshotAlt: "אתר עדיף שמאות ובדק בית — עיצוב Adwrks 365",
    ...LEGACY_SCREENSHOT,
    featured: false,
    legacy: true,
    sortOrder: 25,
  },
  {
    id: "legacy-dudizehavi-ins",
    title: "דודי זהבי",
    screenshot: legacyUpload("dudizehavi-ins.png"),
    screenshotAlt: "אתר דודי זהבי — ייעוץ פיננסי וביטוח — עיצוב Adwrks 365",
    ...LEGACY_SCREENSHOT,
    featured: false,
    legacy: true,
    sortOrder: 26,
  },
  {
    id: "legacy-7",
    title: "דומינו יזמות נדל\"ן",
    screenshot: legacyUpload("7.png"),
    screenshotAlt: "אתר דומינו יזמות נדל\"ן — עיצוב Adwrks 365",
    ...LEGACY_SCREENSHOT,
    featured: false,
    legacy: true,
    sortOrder: 27,
  },
  {
    id: "legacy-4-1",
    title: "א. חניה רואי חשבון",
    screenshot: legacyUpload("4-1.png"),
    screenshotAlt: "אתר א. חניה רואי חשבון — עיצוב Adwrks 365",
    ...LEGACY_SCREENSHOT,
    featured: false,
    legacy: true,
    sortOrder: 28,
  },
  {
    id: "legacy-amit-bageva",
    title: "עמית בגבעה",
    screenshot: legacyUpload("amit-bageva.png"),
    screenshotAlt: "אתר עמית בגבעה — פרויקט נדל\"ן — עיצוב Adwrks 365",
    ...LEGACY_SCREENSHOT,
    featured: false,
    legacy: true,
    sortOrder: 29,
  },
  {
    id: "legacy-betkal-pro",
    title: "בטקל פרו",
    screenshot: legacyUpload("betkal-pro.png"),
    screenshotAlt: "אתר בטקל פרו — איטום מקצועי — עיצוב Adwrks 365",
    ...LEGACY_SCREENSHOT,
    featured: false,
    legacy: true,
    sortOrder: 30,
  },
  {
    id: "legacy-amir-madari",
    title: "אמיר מדארי",
    screenshot: legacyUpload("amir-madari.png"),
    screenshotAlt: "אתר אמיר מדארי — שיפוצים — עיצוב Adwrks 365",
    ...LEGACY_SCREENSHOT,
    featured: false,
    legacy: true,
    sortOrder: 31,
  },
];

const NEW_PROJECTS: PortfolioProject[] = [
  {
    id: "xn-hebrew-domain",
    title: "זיו המנעולן",
    screenshot: "/images/portfolio/xn-hebrew-domain.webp",
    screenshotAlt: "אתר זיו המנעולן — עיצוב Adwrks 365",
    screenshotWidth: 960,
    screenshotHeight: 4626,
    featured: false,
    legacy: false,
    sortOrder: 15,
    tags: ["local-business"],
  },
  {
    id: "ramatgancranes",
    title: "מנופי רמת גן",
    screenshot: "/images/portfolio/ramatgancranes.webp",
    screenshotAlt: "אתר מנופי רמת גן — עיצוב Adwrks 365",
    screenshotWidth: 960,
    screenshotHeight: 4577,
    featured: true,
    legacy: false,
    sortOrder: 2,
    tags: ["professional-services"],
  },
  {
    id: "insytix",
    title: "Insytix",
    captionSubtitle: "ממשק דיגיטלי",
    screenshot: "/images/portfolio/insytix.webp",
    screenshotAlt: "Insytix — ממשק דיגיטלי — עיצוב Adwrks 365",
    screenshotWidth: 960,
    screenshotHeight: 2658,
    featured: true,
    legacy: false,
    sortOrder: 1,
    tags: ["web-system"],
  },
  {
    id: "michel-drive",
    title: "מישל דנינו – מורה נהיגה",
    screenshot: "/images/portfolio/michel-drive.webp",
    screenshotAlt: "אתר מישל דנינו מורה נהיגה — עיצוב Adwrks 365",
    screenshotWidth: 960,
    screenshotHeight: 4192,
    featured: true,
    legacy: false,
    sortOrder: 4,
    tags: ["local-business"],
  },
  {
    id: "project-eng",
    title: "פרויקט הנדסה",
    screenshot: "/images/portfolio/project-eng.webp",
    screenshotAlt: "אתר פרויקט הנדסה — עיצוב Adwrks 365",
    screenshotWidth: 960,
    screenshotHeight: 5235,
    featured: true,
    legacy: false,
    sortOrder: 5,
    tags: ["professional-services"],
  },
  {
    id: "menofeyhasdai",
    title: "חסדאי מנופי הרמה",
    screenshot: "/images/portfolio/menofeyhasdai.webp",
    screenshotAlt: "אתר חסדאי מנופי הרמה — עיצוב Adwrks 365",
    screenshotWidth: 960,
    screenshotHeight: 2772,
    featured: true,
    legacy: false,
    sortOrder: 3,
    tags: ["professional-services"],
  },
  {
    id: "amiya-movings",
    title: "אמייה הובלות",
    screenshot: "/images/portfolio/amiya-movings.webp",
    screenshotAlt: "אתר אמייה הובלות — עיצוב Adwrks 365",
    screenshotWidth: 960,
    screenshotHeight: 3844,
    featured: true,
    legacy: false,
    sortOrder: 6,
    tags: ["local-business"],
  },
  {
    id: "em-biuvit",
    title: "א.מ. ביובית",
    screenshot: "/images/portfolio/em-biuvit.webp",
    screenshotAlt: "אתר א.מ. ביובית — עיצוב Adwrks 365",
    screenshotWidth: 960,
    screenshotHeight: 3880,
    featured: true,
    legacy: false,
    sortOrder: 9,
    tags: ["local-business"],
  },
];

/** Single source of truth — 14 legacy + 8 new = 22 projects. */
export const PORTFOLIO_PROJECTS: readonly PortfolioProject[] = [
  ...NEW_PROJECTS,
  ...LEGACY_PROJECTS,
].sort((a, b) => a.sortOrder - b.sortOrder);

export function getFeaturedPortfolioProjects(): PortfolioProject[] {
  return PORTFOLIO_PROJECTS.filter((p) => p.featured).sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
}

export function getPortfolioProjectsForVariant(
  variant: PortfolioShowcaseVariant,
): PortfolioProject[] {
  switch (variant) {
    case "compact":
      return getFeaturedPortfolioProjects();
    case "rich":
      return [...PORTFOLIO_PROJECTS].sort((a, b) => a.sortOrder - b.sortOrder);
    case "inline":
      return getFeaturedPortfolioProjects().slice(0, 3);
    default:
      return getFeaturedPortfolioProjects();
  }
}

/** @deprecated Use PORTFOLIO_PROJECTS — preserved for legacy references. */
export const LEGACY_HOMEPAGE_PORTFOLIO_URLS = [
  legacyUpload("3-1.png"),
  legacyUpload("omanut.png"),
  legacyUpload("2.png"),
  legacyUpload("5.png"),
  legacyUpload("aharon-plumber.png"),
  legacyUpload("1-1.png"),
  legacyUpload("bali_burger.png"),
  legacyUpload("6.png"),
  legacyUpload("dudizehavi-ins.png"),
  legacyUpload("7.png"),
  legacyUpload("4-1.png"),
  legacyUpload("amit-bageva.png"),
  legacyUpload("betkal-pro.png"),
  legacyUpload("amir-madari.png"),
] as const;

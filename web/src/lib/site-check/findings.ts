import {
  isCommerceSystemPage,
  isProductLikePage,
  isSystemOrPolicyPage,
} from "./content-url";
import { hasVisitorContactPath, looksLikeContactNav } from "./contact-signals";
import type { SiteKind } from "./site-kind";
import type { ParsedPage, SiteCheckFinding, SiteCheckLocale } from "./types";

export type IssueType =
  | "broken-link"
  | "noindex-service"
  | "noindex"
  | "missing-title"
  | "duplicate-title"
  | "missing-h1"
  | "phone-not-tappable"
  | "no-contact-path"
  | "nav-missing-contact"
  | "missing-description"
  | "duplicate-description"
  | "broken-image"
  | "product-no-purchase";

export type RankedIssue = {
  type: IssueType;
  pageUrl: string;
  pageLabel: string;
  count?: number;
  otherLabel?: string;
  exampleUrl?: string;
};

const PRIORITY: IssueType[] = [
  "broken-link",
  "broken-image",
  "product-no-purchase",
  "noindex-service",
  "noindex",
  "missing-title",
  "duplicate-title",
  "duplicate-description",
  "missing-h1",
  "phone-not-tappable",
  "no-contact-path",
  "nav-missing-contact",
  "missing-description",
];

export type AnalyzablePage = {
  url: string;
  label: string;
  role: "home" | "inner";
  parsed: ParsedPage;
  headerRobots: string;
  truncated: boolean;
  readable: boolean;
  isEntry?: boolean;
  intent?: { contact: boolean; service: boolean; pricing: boolean };
  /** Set for commerce sites after content-based classification. */
  commerceKind?: "product" | "category";
};

function isImportantPage(page: AnalyzablePage): boolean {
  if (page.role === "home" || page.isEntry) return true;
  const intent = page.intent;
  return Boolean(intent?.contact || intent?.service || intent?.pricing);
}

function isFindingTarget(page: AnalyzablePage): boolean {
  if (page.role === "home" || page.isEntry) return !isCommerceSystemPage(page.url, page.label);
  if (isSystemOrPolicyPage(page.url, page.label)) return false;
  if (isCommerceSystemPage(page.url, page.label)) return false;
  return isImportantPage(page);
}

function hasNoindex(page: AnalyzablePage): boolean {
  return /noindex/i.test(`${page.parsed.robots} ${page.headerRobots}`);
}

function hasContactPath(page: AnalyzablePage): boolean {
  return hasVisitorContactPath(page.parsed);
}

export function rankIssues(
  pages: AnalyzablePage[],
  context?: {
    brokenLinks?: readonly { url: string; label: string; fromLabel: string }[];
    brokenImages?: readonly { url: string; pageUrl: string; pageLabel: string }[];
    locale?: SiteCheckLocale;
    siteKind?: SiteKind;
  },
): RankedIssue[] {
  const siteKind = context?.siteKind ?? "general";
  const usable = pages.filter((page) => page.readable);
  const issues: RankedIssue[] = [];
  const homeFirst = [...usable].sort((a, b) => Number(b.role === "home") - Number(a.role === "home"));
  const innerFirst = [...usable].sort((a, b) => Number(b.role === "inner") - Number(a.role === "inner"));
  const noindexOrder = [...pages].sort((a, b) => Number(b.role === "home") - Number(a.role === "home"));

  const broken = context?.brokenLinks ?? [];
  const brokenImages = context?.brokenImages ?? [];
  if (broken.length > 0) {
    issues.push({
      type: "broken-link",
      pageUrl: broken[0]!.url,
      pageLabel: broken[0]!.label,
      count: broken.length,
      exampleUrl: broken[0]!.url,
      otherLabel: broken[0]!.fromLabel,
    });
  }

  if (brokenImages.length > 0) {
    issues.push({
      type: "broken-image",
      pageUrl: brokenImages[0]!.pageUrl,
      pageLabel: brokenImages[0]!.pageLabel,
      count: brokenImages.length,
      exampleUrl: brokenImages[0]!.url,
    });
  }

  if (siteKind === "store") {
    const productPages = usable.filter((page) => isProductLikePage(page.url, page.label));
    const withoutPurchase = productPages.filter((page) => !page.parsed.hasPurchaseCta);
    if (withoutPurchase.length > 0) {
      issues.push({
        type: "product-no-purchase",
        pageUrl: withoutPurchase[0]!.url,
        pageLabel: withoutPurchase[0]!.label,
        count: withoutPurchase.length,
      });
    }
  }

  const serviceNoindex = usable.filter(
    (page) =>
      isFindingTarget(page) &&
      !isCommerceSystemPage(page.url, page.label) &&
      (page.intent?.service || page.intent?.pricing || page.role === "home") &&
      hasNoindex(page),
  );
  if (serviceNoindex.length > 0) {
    issues.push({
      type: "noindex-service",
      pageUrl: serviceNoindex[0]!.url,
      pageLabel: serviceNoindex[0]!.label,
      count: serviceNoindex.length,
    });
  } else {
    const noindex = noindexOrder.find((page) => hasNoindex(page) && isFindingTarget(page));
    if (noindex) issues.push({ type: "noindex", pageUrl: noindex.url, pageLabel: noindex.label });
  }

  const missingTitle = homeFirst.find((page) => !page.parsed.title);
  if (missingTitle) {
    issues.push({ type: "missing-title", pageUrl: missingTitle.url, pageLabel: missingTitle.label });
  }

  const importantTitled = usable.filter((page) => page.parsed.title && isFindingTarget(page));
  const titleGroups = new Map<string, AnalyzablePage[]>();
  for (const page of importantTitled) {
    const key = page.parsed.title.trim().toLowerCase();
    const group = titleGroups.get(key) ?? [];
    group.push(page);
    titleGroups.set(key, group);
  }
  const duplicateGroup = [...titleGroups.values()].find((group) => group.length >= 2);
  if (duplicateGroup) {
    const subject = duplicateGroup.find((page) => page.role === "inner") ?? duplicateGroup[0]!;
    issues.push({
      type: "duplicate-title",
      pageUrl: subject.url,
      pageLabel: subject.label,
      count: duplicateGroup.length,
      otherLabel: duplicateGroup[1]?.label,
    });
  }

  const importantDescribed = usable.filter(
    (page) => page.parsed.metaDescription.trim() && isFindingTarget(page),
  );
  const descGroups = new Map<string, AnalyzablePage[]>();
  for (const page of importantDescribed) {
    const key = page.parsed.metaDescription.trim().toLowerCase();
    const group = descGroups.get(key) ?? [];
    group.push(page);
    descGroups.set(key, group);
  }
  const dupDesc = [...descGroups.values()].find((group) => group.length >= 2);
  if (dupDesc) {
    const subject = dupDesc.find((page) => page.role === "inner") ?? dupDesc[0]!;
    issues.push({
      type: "duplicate-description",
      pageUrl: subject.url,
      pageLabel: subject.label,
      count: dupDesc.length,
      otherLabel: dupDesc[1]?.label,
    });
  }

  const missingH1 = homeFirst.find((page) => page.parsed.h1.length === 0 && isFindingTarget(page));
  if (missingH1) issues.push({ type: "missing-h1", pageUrl: missingH1.url, pageLabel: missingH1.label });

  const phone = innerFirst.find(
    (page) =>
      isFindingTarget(page) &&
      page.parsed.contactPhones.length > 0 &&
      page.parsed.telHrefs.length === 0,
  );
  if (phone) issues.push({ type: "phone-not-tappable", pageUrl: phone.url, pageLabel: phone.label });

  const fullyRead = usable.filter((page) => !page.truncated);
  const seesPhone = fullyRead.some(
    (page) => page.parsed.contactPhones.length > 0 || page.parsed.telHrefs.length > 0,
  );
  const entryPage = usable.find((page) => page.isEntry) ?? usable.find((page) => page.role === "home");
  if (
    siteKind === "landing" &&
    entryPage &&
    hasContactPath(entryPage)
  ) {
    /* single-page / LP with CTA or form — not a finding */
  } else if (
    fullyRead.length > 0 &&
    fullyRead.length === usable.length &&
    !seesPhone &&
    fullyRead.every((page) => !hasContactPath(page))
  ) {
    const home = fullyRead.find((page) => page.role === "home") ?? fullyRead[0];
    issues.push({ type: "no-contact-path", pageUrl: home.url, pageLabel: home.label });
  }

  const navPage =
    homeFirst.find((page) => page.role === "home" && page.parsed.navLinks.length >= 2) ??
    homeFirst.find((page) => page.isEntry && page.parsed.navLinks.length >= 2);
  if (
    siteKind !== "landing" &&
    siteKind !== "store" &&
    navPage &&
    navPage.parsed.navLinks.length >= 2 &&
    !issues.some((issue) => issue.type === "no-contact-path") &&
    !navPage.parsed.navLinks.some((link) => looksLikeContactNav(`${link.href} ${link.text}`))
  ) {
    issues.push({ type: "nav-missing-contact", pageUrl: navPage.url, pageLabel: navPage.label });
  }

  const missingDescription = homeFirst.find(
    (page) => isFindingTarget(page) && !page.parsed.metaDescription.trim(),
  );
  if (missingDescription) {
    issues.push({
      type: "missing-description",
      pageUrl: missingDescription.url,
      pageLabel: missingDescription.label,
    });
  }

  return PRIORITY.flatMap((type) => issues.filter((issue) => issue.type === type)).slice(0, 3);
}

const COPY = {
  he: {
    "broken-link": {
      observation: (count: number, example: string) =>
        count > 1
          ? `מצאנו ${count} קישורים שבורים לעמודי שירות או פעולות מרכזיות. לדוגמה: ${example}`
          : `קישור שבור לעמוד שירות או פעולה מרכזית: ${example}`,
      step: "תקנו את הקישור או עדכנו אותו לעמוד הקיים, ובדקו במובייל שהכפתור מוביל ליעד הנכון.",
      why: "מבקר שלא מגיע לעמוד שירות עלול לוותר לפני שיצר קשר.",
    },
    "noindex-service": {
      observation: (count: number) =>
        count > 1
          ? `ל־${count} עמודי שירות או תמחור יש סימון noindex — הם עלולים לא להופיע בחיפוש.`
          : "עמוד שירות או תמחור מסומן ב-noindex.",
      step: "הסירו noindex מעמודי שירות ותמחור שאתם רוצים לקדם, וודאו שיש להם קישור פנימי מדף הבית.",
      why: "עמוד שמציע שירות אבל חסום לאינדוקס קשה למצוא אותו בגוגל.",
    },
    noindex: {
      observation: "העמוד מסומן ב-noindex.",
      step: "בדקו אם העמוד צריך להופיע בגוגל — אם כן, הסירו noindex או את תג החסימה במערכת הניהול.",
      why: "עמוד שמסומן כך יכול שלא להופיע בגוגל, גם כשהוא חשוב לשירות.",
    },
    "missing-title": {
      observation: "לא מצאנו כותרת עמוד (title).",
      step: "הוסיפו כותרת עמוד ייחודית שמתארת את השירות או המוצר, ב־50–60 תווים בערך.",
      why: "בלי כותרת, קשה לגולש ולגוגל להבין במה העמוד עוסק.",
    },
    "duplicate-title": {
      observation: (count: number, other?: string) =>
        count > 2
          ? `ל־${count} עמודים חשובים יש אותה כותרת. לדוגמה: «${other ?? ""}».`
          : other
            ? `כותרת העמוד זהה לכותרת של «${other}».`
            : "לכמה עמודים חשובים יש אותה כותרת.",
      step: "תנו לכל עמוד שירות כותרת שונה שמזכירה בדיוק את מה שמוצע שם.",
      why: "כששני עמודים נראים אותו דבר בתוצאות, קשה יותר להגיע לשירות הנכון.",
    },
    "duplicate-description": {
      observation: (count: number) =>
        count > 2
          ? `ל־${count} עמודים חשובים יש אותו תיאור מטא (description).`
          : "לשני עמודים חשובים יש אותו תיאור מטא (description).",
      step: "כתבו תיאור מטא נפרד לכל עמוד חשוב — משפט אחד שמסביר למה ללחוץ עליו בתוצאות החיפוש.",
      why: "כשתיאור המטא זהה, גוגל עלול להציג אותו קטע בכמה עמודים שונים.",
    },
    "broken-image": {
      observation: (count: number, example: string) =>
        count > 1
          ? `מצאנו ${count} תמונות מרכזיות שלא נטענו (404/410). לדוגמה: ${example}`
          : `תמונה מרכזית לא נטענה (404/410): ${example}`,
      step: "העלו מחדש את התמונה או עדכנו את הקישור אליה, ודחסו אותה לגודל סביר למובייל.",
      why: "תמונה שבורה בעמוד חשוב פוגעת ברושם הראשוני ובאמינות העמוד.",
    },
    "missing-h1": {
      observation: "לא מצאנו כותרת ראשית (H1) ב-HTML של העמוד.",
      step: "הוסיפו כותרת ראשית אחת ברורה בראש העמוד — מה אתם מציעים במשפט קצר.",
      why: "בלי כותרת ראשית, מי שנכנס לעמוד עלול לא להבין מיד מה מציעים כאן.",
    },
    "phone-not-tappable": {
      observation: "זיהינו מספר טלפון שאינו לחיץ.",
      step: "הפכו את המספר לקישור tel: באזור הגלוי, במיוחד בעמוד הבית וביצירת קשר.",
      why: "במובייל זה מוסיף שלב למי שרוצה להתקשר.",
    },
    "no-contact-path": {
      observation: "בעמודים שנבדקו לא מצאנו קישור חיוג, וואטסאפ או טופס.",
      step: "הוסיפו למעלה בעמוד כפתור «התקשרו» או «השאירו פרטים» שמוביל לטופס או לוואטסאפ.",
      why: "לקוח שכבר נמצא באתר לא רואה דרך ברורה להתקשר או להשאיר פרטים.",
    },
    "nav-missing-contact": {
      observation: "בניווט הראשי לא מצאנו קישור ליצירת קשר.",
      step: "הוסיפו «יצירת קשר» או «חזרו אליי» לתפריט העליון, גלוי גם במובייל.",
      why: "מי שמחפש איך לפנות אליכם צריך למצוא את זה מחוץ לתפריט.",
    },
    "missing-description": {
      observation: "לא מצאנו תיאור מטא.",
      step: "כתבו תיאור מטא קצר שמסכם את העמוד ומעודד לחיצה — במיוחד בדף הבית ובשירותים.",
      why: "בגוגל עלול להופיע קטע אקראי מהעמוד במקום משפט שמתאר את השירות.",
    },
    "product-no-purchase": {
      observation: (count: number) =>
        count > 1
          ? `ב־${count} עמודי מוצר לא מצאנו כפתור רכישה או הוספה לסל ברור.`
          : "בעמוד מוצר לא מצאנו כפתור רכישה או הוספה לסל ברור.",
      step: "הציגו כפתור «הוסף לסל» או «לרכישה» גלוי מעל הקיפול במובייל.",
      why: "קונים שמגיעים לעמוד מוצר עלולים לא להבין איך להמשיך לרכישה.",
    },
    whyLabel: "למה זה חשוב",
  },
  en: {
    "broken-link": {
      observation: (count: number, example: string) =>
        count > 1
          ? `We found ${count} broken links to service pages or key actions. Example: ${example}`
          : `Broken link to a service page or key action: ${example}`,
      step: "Fix or replace the link, then tap the button on a phone to confirm it opens the right page.",
      why: "A visitor who can't reach a service page may give up before contacting you.",
    },
    "noindex-service": {
      observation: (count: number) =>
        count > 1
          ? `${count} service or pricing pages are marked noindex — they may not appear in search.`
          : "A service or pricing page is marked noindex.",
      step: "Remove noindex from service and pricing pages you want in Google, and link to them from the homepage.",
      why: "A page that sells a service but blocks indexing is harder to find on Google.",
    },
    noindex: {
      observation: "This page is marked noindex.",
      step: "If the page should rank, remove noindex in your CMS or SEO plugin and republish.",
      why: "A page marked this way can stay out of Google, even when it matters for the service.",
    },
    "missing-title": {
      observation: "We didn't find a page title.",
      step: "Add a unique title tag that names the service or product — roughly 50–60 characters.",
      why: "Without a title, visitors and Google have less to go on about what the page offers.",
    },
    "duplicate-title": {
      observation: (count: number, other?: string) =>
        count > 2
          ? `${count} important pages share the same title. For example: «${other ?? ""}».`
          : other
            ? `The page title is the same as «${other}».`
            : "Several important pages share the same title.",
      step: "Give each service page its own title that says exactly what is offered there.",
      why: "When two pages look the same in search, it's harder to reach the right service.",
    },
    "duplicate-description": {
      observation: (count: number) =>
        count > 2
          ? `${count} important pages share the same meta description.`
          : "Two important pages share the same meta description.",
      step: "Write a separate meta description per important page — one line on why to click.",
      why: "When meta descriptions match, Google may show the same snippet for different pages.",
    },
    "broken-image": {
      observation: (count: number, example: string) =>
        count > 1
          ? `${count} hero images failed to load (404/410). Example: ${example}`
          : `A hero image failed to load (404/410): ${example}`,
      step: "Re-upload the image or fix the URL, and compress it for mobile.",
      why: "A broken image on an important page hurts first impressions and trust.",
    },
    "missing-h1": {
      observation: "We didn't find a main heading (H1) in the page HTML.",
      step: "Add one clear H1 at the top of the page stating what you offer in plain language.",
      why: "Without a main heading, someone landing on the page may not see the offer right away.",
    },
    "phone-not-tappable": {
      observation: "We found a phone number that isn't a tap-to-call link.",
      step: "Wrap the number in a tel: link on the homepage and contact page.",
      why: "On a phone, that adds a step for someone who wants to call.",
    },
    "no-contact-path": {
      observation: "On the pages we checked, we didn't find a call link, WhatsApp link, or form.",
      step: "Add a visible «Call us» or «Leave details» button that opens a form or WhatsApp.",
      why: "A visitor who is already on the site doesn't see a clear way to call or leave details.",
    },
    "nav-missing-contact": {
      observation: "The main navigation doesn't include a contact link.",
      step: "Add «Contact» to the main menu, including the mobile menu.",
      why: "Someone looking for how to reach you has to find it outside the menu.",
    },
    "missing-description": {
      observation: "We didn't find a meta description.",
      step: "Add a short meta description on the homepage and key service pages.",
      why: "Google may show a random snippet instead of a sentence that describes the service.",
    },
    "product-no-purchase": {
      observation: (count: number) =>
        count > 1
          ? `On ${count} product pages we didn't find a clear buy or add-to-cart action.`
          : "On a product page we didn't find a clear buy or add-to-cart action.",
      step: "Show an «Add to cart» or «Buy» button above the fold on mobile.",
      why: "Shoppers who land on a product page may not see how to continue to purchase.",
    },
    whyLabel: "Why it matters",
  },
} as const;

export function presentFindings(issues: RankedIssue[], locale: SiteCheckLocale): SiteCheckFinding[] {
  const copy = COPY[locale];
  return issues.map((issue) => {
    if (issue.type === "duplicate-title") {
      const block = copy["duplicate-title"];
      return {
        pageLabel: issue.pageLabel,
        pageUrl: issue.pageUrl,
        observation: block.observation(issue.count ?? 2, issue.otherLabel),
        recommendedStep: block.step,
        why: block.why,
      };
    }
    if (issue.type === "broken-link") {
      const block = copy["broken-link"];
      return {
        pageLabel: issue.pageLabel,
        pageUrl: issue.pageUrl,
        observation: block.observation(issue.count ?? 1, issue.exampleUrl ?? issue.pageUrl),
        recommendedStep: block.step,
        why: block.why,
      };
    }
    if (issue.type === "broken-image") {
      const block = copy["broken-image"];
      return {
        pageLabel: issue.pageLabel,
        pageUrl: issue.pageUrl,
        observation: block.observation(issue.count ?? 1, issue.exampleUrl ?? issue.pageUrl),
        recommendedStep: block.step,
        why: block.why,
      };
    }
    if (issue.type === "duplicate-description") {
      const block = copy["duplicate-description"];
      return {
        pageLabel: issue.pageLabel,
        pageUrl: issue.pageUrl,
        observation: block.observation(issue.count ?? 2),
        recommendedStep: block.step,
        why: block.why,
      };
    }
    if (issue.type === "noindex-service") {
      const block = copy["noindex-service"];
      return {
        pageLabel: issue.pageLabel,
        pageUrl: issue.pageUrl,
        observation: block.observation(issue.count ?? 1),
        recommendedStep: block.step,
        why: block.why,
      };
    }
    if (issue.type === "product-no-purchase") {
      const block = copy["product-no-purchase"];
      return {
        pageLabel: issue.pageLabel,
        pageUrl: issue.pageUrl,
        observation: block.observation(issue.count ?? 1),
        recommendedStep: block.step,
        why: block.why,
      };
    }
    const entry = copy[issue.type];
    return {
      pageLabel: issue.pageLabel,
      pageUrl: issue.pageUrl,
      observation: entry.observation,
      recommendedStep: entry.step,
      why: entry.why,
    };
  });
}

export function whyLabel(locale: SiteCheckLocale): string {
  return COPY[locale].whyLabel;
}

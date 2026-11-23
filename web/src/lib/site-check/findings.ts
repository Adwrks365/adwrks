import { hasVisitorContactPath, looksLikeContactNav } from "./contact-signals";
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
  | "missing-description";

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
  "noindex-service",
  "noindex",
  "missing-title",
  "duplicate-title",
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
};

function isImportantPage(page: AnalyzablePage): boolean {
  if (page.role === "home" || page.isEntry) return true;
  const intent = page.intent;
  return Boolean(intent?.contact || intent?.service || intent?.pricing);
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
    locale?: SiteCheckLocale;
  },
): RankedIssue[] {
  const usable = pages.filter((page) => page.readable);
  const issues: RankedIssue[] = [];
  const homeFirst = [...usable].sort((a, b) => Number(b.role === "home") - Number(a.role === "home"));
  const innerFirst = [...usable].sort((a, b) => Number(b.role === "inner") - Number(a.role === "inner"));
  const noindexOrder = [...pages].sort((a, b) => Number(b.role === "home") - Number(a.role === "home"));

  const broken = context?.brokenLinks ?? [];
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

  const serviceNoindex = usable.filter(
    (page) => isImportantPage(page) && (page.intent?.service || page.intent?.pricing) && hasNoindex(page),
  );
  if (serviceNoindex.length > 0) {
    issues.push({
      type: "noindex-service",
      pageUrl: serviceNoindex[0]!.url,
      pageLabel: serviceNoindex[0]!.label,
      count: serviceNoindex.length,
    });
  } else {
    const noindex = noindexOrder.find(
      (page) => hasNoindex(page) && (page.role === "home" || isImportantPage(page)),
    );
    if (noindex) issues.push({ type: "noindex", pageUrl: noindex.url, pageLabel: noindex.label });
  }

  const missingTitle = homeFirst.find((page) => !page.parsed.title);
  if (missingTitle) {
    issues.push({ type: "missing-title", pageUrl: missingTitle.url, pageLabel: missingTitle.label });
  }

  const importantTitled = usable.filter((page) => page.parsed.title && isImportantPage(page));
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

  const missingH1 = homeFirst.find(
    (page) => page.parsed.h1.length === 0 && (page.role === "home" || isImportantPage(page)),
  );
  if (missingH1) issues.push({ type: "missing-h1", pageUrl: missingH1.url, pageLabel: missingH1.label });

  const phone = innerFirst.find(
    (page) => page.parsed.contactPhones.length > 0 && page.parsed.telHrefs.length === 0,
  );
  if (phone) issues.push({ type: "phone-not-tappable", pageUrl: phone.url, pageLabel: phone.label });

  const fullyRead = usable.filter((page) => !page.truncated);
  const seesPhone = fullyRead.some(
    (page) => page.parsed.contactPhones.length > 0 || page.parsed.telHrefs.length > 0,
  );
  if (
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
    navPage &&
    !issues.some((issue) => issue.type === "no-contact-path") &&
    !navPage.parsed.navLinks.some((link) => looksLikeContactNav(`${link.href} ${link.text}`))
  ) {
    issues.push({ type: "nav-missing-contact", pageUrl: navPage.url, pageLabel: navPage.label });
  }

  const missingDescription = homeFirst.find((page) => !page.parsed.metaDescription.trim());
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
      why: "מבקר שלא מגיע לעמוד שירות עלול לוותר לפני שיצר קשר.",
    },
    "noindex-service": {
      observation: (count: number) =>
        count > 1
          ? `ל־${count} עמודי שירות או תמחור יש סימון noindex — הם עלולים לא להופיע בחיפוש.`
          : "עמוד שירות או תמחור מסומן ב-noindex.",
      why: "עמוד שמציע שירות אבל חסום לאינדוקס קשה למצוא אותו בגוגל.",
    },
    noindex: {
      observation: "העמוד מסומן ב-noindex.",
      why: "עמוד שמסומן כך יכול שלא להופיע בגוגל, גם כשהוא חשוב לשירות.",
    },
    "missing-title": {
      observation: "לא מצאנו כותרת עמוד (title).",
      why: "בלי כותרת, קשה לגולש ולגוגל להבין במה העמוד עוסק.",
    },
    "duplicate-title": {
      observation: (count: number, other?: string) =>
        count > 2
          ? `ל־${count} עמודים חשובים יש אותה כותרת. לדוגמה: «${other ?? ""}».`
          : other
            ? `כותרת העמוד זהה לכותרת של «${other}».`
            : "לכמה עמודים חשובים יש אותה כותרת.",
      why: "כששני עמודים נראים אותו דבר בתוצאות, קשה יותר להגיע לשירות הנכון.",
    },
    "missing-h1": {
      observation: "לא מצאנו כותרת ראשית (H1) ב-HTML של העמוד.",
      why: "בלי כותרת ראשית, מי שנכנס לעמוד עלול לא להבין מיד מה מציעים כאן.",
    },
    "phone-not-tappable": {
      observation: "זיהינו מספר טלפון שאינו לחיץ.",
      why: "במובייל זה מוסיף שלב למי שרוצה להתקשר.",
    },
    "no-contact-path": {
      observation: "בעמודים שנבדקו לא מצאנו קישור חיוג, וואטסאפ או טופס.",
      why: "לקוח שכבר נמצא באתר לא רואה דרך ברורה להתקשר או להשאיר פרטים.",
    },
    "nav-missing-contact": {
      observation: "בניווט הראשי לא מצאנו קישור ליצירת קשר.",
      why: "מי שמחפש איך לפנות אליכם צריך למצוא את זה מחוץ לתפריט.",
    },
    "missing-description": {
      observation: "לא מצאנו תיאור מטא.",
      why: "בגוגל עלול להופיע קטע אקראי מהעמוד במקום משפט שמתאר את השירות.",
    },
    whyLabel: "למה זה חשוב",
  },
  en: {
    "broken-link": {
      observation: (count: number, example: string) =>
        count > 1
          ? `We found ${count} broken links to service pages or key actions. Example: ${example}`
          : `Broken link to a service page or key action: ${example}`,
      why: "A visitor who can't reach a service page may give up before contacting you.",
    },
    "noindex-service": {
      observation: (count: number) =>
        count > 1
          ? `${count} service or pricing pages are marked noindex — they may not appear in search.`
          : "A service or pricing page is marked noindex.",
      why: "A page that sells a service but blocks indexing is harder to find on Google.",
    },
    noindex: {
      observation: "This page is marked noindex.",
      why: "A page marked this way can stay out of Google, even when it matters for the service.",
    },
    "missing-title": {
      observation: "We didn't find a page title.",
      why: "Without a title, visitors and Google have less to go on about what the page offers.",
    },
    "duplicate-title": {
      observation: (count: number, other?: string) =>
        count > 2
          ? `${count} important pages share the same title. For example: «${other ?? ""}».`
          : other
            ? `The page title is the same as «${other}».`
            : "Several important pages share the same title.",
      why: "When two pages look the same in search, it's harder to reach the right service.",
    },
    "missing-h1": {
      observation: "We didn't find a main heading (H1) in the page HTML.",
      why: "Without a main heading, someone landing on the page may not see the offer right away.",
    },
    "phone-not-tappable": {
      observation: "We found a phone number that isn't a tap-to-call link.",
      why: "On a phone, that adds a step for someone who wants to call.",
    },
    "no-contact-path": {
      observation: "On the pages we checked, we didn't find a call link, WhatsApp link, or form.",
      why: "A visitor who is already on the site doesn't see a clear way to call or leave details.",
    },
    "nav-missing-contact": {
      observation: "The main navigation doesn't include a contact link.",
      why: "Someone looking for how to reach you has to find it outside the menu.",
    },
    "missing-description": {
      observation: "We didn't find a meta description.",
      why: "Google may show a random snippet instead of a sentence that describes the service.",
    },
    whyLabel: "Why it matters",
  },
} as const;

export function presentFindings(issues: RankedIssue[], locale: SiteCheckLocale): SiteCheckFinding[] {
  const copy = COPY[locale];
  return issues.map((issue) => {
    if (issue.type === "duplicate-title") {
      return {
        pageLabel: issue.pageLabel,
        pageUrl: issue.pageUrl,
        observation: copy["duplicate-title"].observation(issue.count ?? 2, issue.otherLabel),
        why: copy["duplicate-title"].why,
      };
    }
    if (issue.type === "broken-link") {
      return {
        pageLabel: issue.pageLabel,
        pageUrl: issue.pageUrl,
        observation: copy["broken-link"].observation(issue.count ?? 1, issue.exampleUrl ?? issue.pageUrl),
        why: copy["broken-link"].why,
      };
    }
    if (issue.type === "noindex-service") {
      return {
        pageLabel: issue.pageLabel,
        pageUrl: issue.pageUrl,
        observation: copy["noindex-service"].observation(issue.count ?? 1),
        why: copy["noindex-service"].why,
      };
    }
    const entry = copy[issue.type];
    return {
      pageLabel: issue.pageLabel,
      pageUrl: issue.pageUrl,
      observation: entry.observation,
      why: entry.why,
    };
  });
}

export function whyLabel(locale: SiteCheckLocale): string {
  return COPY[locale].whyLabel;
}

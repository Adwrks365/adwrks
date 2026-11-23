export type SiteCheckLocale = "he" | "en";

export type ParsedLink = {
  href: string;
  text: string;
  inNav: boolean;
};

export type ParsedPage = {
  title: string;
  metaDescription: string;
  robots: string;
  h1: string[];
  navLinks: ParsedLink[];
  links: ParsedLink[];
  hasForm: boolean;
  telHrefs: string[];
  hasWhatsapp: boolean;
  plainPhones: string[];
  visibleTextLength: number;
};

export type ScanPageStatus = "ok" | "failed" | "thin";

export type ScannedPage = {
  url: string;
  label: string;
  role: "home" | "inner";
  status: ScanPageStatus;
};

export type SiteCheckFinding = {
  pageLabel: string;
  pageUrl: string;
  observation: string;
  why: string;
};

export type SiteCheckReport = {
  ok: true;
  inputUrl: string;
  scopeLine: string;
  pages: ScannedPage[];
  partialNote: string | null;
  findings: SiteCheckFinding[];
  clearNote: string | null;
  limitNote: string;
  /** Exact text stored with the lead. Matches the lines shown on screen. */
  leadNote: string;
};

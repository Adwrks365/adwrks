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
  hasPurchaseCta: boolean;
  telHrefs: string[];
  hasWhatsapp: boolean;
  /** Plain-text phones shown in a contact context (not demo widgets). */
  contactPhones: string[];
  /** Leading content images (not icons/trackers). */
  heroImages: string[];
  visibleTextLength: number;
};

export type PositiveObservation = {
  text: string;
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

export type SiteCheckTopicId = "seo" | "links" | "images";
export type SiteCheckTopicTone = "ok" | "warn" | "neutral" | "skipped";

export type ImageProbeStats = {
  imagesProbed: number;
  pagesWithImages: number;
  loadedOk: number;
  broken: number;
  unverified: number;
};

export type SiteCheckTopicSummary = {
  id: SiteCheckTopicId;
  detail: string;
  tone: SiteCheckTopicTone;
};

export type SiteCheckSummaryMetrics = {
  contentScanned: number;
  contentPlanned: number;
  findingsCount: number;
  brokenLinksVerified: number;
};

export type SiteCheckReport = {
  ok: true;
  inputUrl: string;
  /** Readable host/path label (IDN decoded). */
  inputLabel: string;
  homeUrl: string;
  scopeLine: string;
  /** Short list of checks run (technical details). */
  checksLine: string;
  topicSummaries: SiteCheckTopicSummary[];
  imageProbeStats: ImageProbeStats;
  metrics: SiteCheckSummaryMetrics;
  partialScan: boolean;
  partialHeadline: string | null;
  pagesPlanned: number;
  pagesScanned: number;
  durationMs: number;
  pages: ScannedPage[];
  partialNote: string | null;
  findings: SiteCheckFinding[];
  /** Shown when no priority findings — headline for the clear state. */
  clearTitle: string | null;
  positiveObservations: PositiveObservation[];
  clearNote: string | null;
  limitNote: string;
  /** Exact text stored with the lead. Matches the lines shown on screen. */
  leadNote: string;
};

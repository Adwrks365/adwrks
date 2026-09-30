import { SITE } from "@/lib/site";

export type LeadAttribution = {
  pageTitle: string;
  pagePath: string;
  submittedUrl?: string;
  canonicalUrl: string;
  environmentLabel: string;
};

const MAX_TITLE = 300;
const MAX_PATH = 500;
const MAX_URL = 2000;

function clamp(value: string, max: number): string {
  return value.trim().slice(0, max);
}

function stripControlChars(value: string): string {
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
}

function normalizePath(raw?: string): string {
  if (!raw) return "/";
  let path = stripControlChars(raw);
  if (!path.startsWith("/")) path = `/${path}`;
  if (!path.endsWith("/")) path = `${path}/`;
  path = path.replace(/\/{2,}/g, "/");
  return clamp(path, MAX_PATH);
}

function normalizeTitle(raw?: string, fallback = "עמוד לא ידוע"): string {
  const cleaned = stripControlChars(raw || "")
    .replace(/\s*[|⋆\-–—]\s*Adwrks.*$/i, "")
    .trim();
  return clamp(cleaned || fallback, MAX_TITLE);
}

function normalizeSubmittedUrl(raw?: string): string | undefined {
  if (!raw) return undefined;
  const trimmed = clamp(raw, MAX_URL);
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return undefined;
    return parsed.toString();
  } catch {
    return undefined;
  }
}

function environmentLabel(submittedUrl?: string): string {
  if (!submittedUrl) return "לא ידוע";
  try {
    const host = new URL(submittedUrl).hostname.toLowerCase();
    if (host.endsWith(".vercel.app")) return "Vercel Preview";
    if (host === "adwrks.co.il" || host === "www.adwrks.co.il") return "Production";
    if (host === "localhost" || host === "127.0.0.1") return "Local development";
    return host;
  } catch {
    return "לא ידוע";
  }
}

export function buildLeadAttribution(input: {
  pageTitle?: string;
  pagePath?: string;
  pageUrl?: string;
  referer?: string;
}): LeadAttribution {
  const submittedUrl = normalizeSubmittedUrl(input.pageUrl) ?? normalizeSubmittedUrl(input.referer);
  const pagePath = normalizePath(input.pagePath ?? (submittedUrl ? safePathFromUrl(submittedUrl) : "/"));
  const pageTitle = normalizeTitle(input.pageTitle);
  const canonicalUrl = `${SITE.domain}${pagePath === "/" ? "/" : pagePath}`;

  return {
    pageTitle,
    pagePath,
    submittedUrl,
    canonicalUrl,
    environmentLabel: environmentLabel(submittedUrl),
  };
}

function safePathFromUrl(url: string): string {
  try {
    return new URL(url).pathname || "/";
  } catch {
    return "/";
  }
}

export function sanitizeSubjectPart(value: string, max = 48): string {
  return stripControlChars(value)
    .replace(/[|\r\n\t<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

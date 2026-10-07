import { normalizePath } from "@/lib/content/paths";
import { ROUTE_PAIRS } from "./routes";
import type { Locale } from "./routing";

const heToEn = new Map(ROUTE_PAIRS.map((p) => [p.he, p.en]));
const enToHe = new Map(ROUTE_PAIRS.map((p) => [p.en, p.he]));

function targetPath(href: string, locale: Locale): string | null {
  const normalized = normalizePath(href);
  if (locale === "en") {
    if (normalized.startsWith("/en/") || normalized === "/en/") return normalized;
    return heToEn.get(normalized) ?? null;
  }
  if (normalized.startsWith("/en/")) {
    return enToHe.get(normalized) ?? null;
  }
  return normalized;
}

function rewriteHref(href: string, locale: Locale): string | null {
  const trimmed = href.trim();
  if (!trimmed) return null;

  if (/^https?:\/\/(www\.)?adwrks\.co\.il/i.test(trimmed)) {
    try {
      const pathname = new URL(trimmed).pathname;
      const rewritten = targetPath(pathname, locale);
      if (!rewritten || rewritten === normalizePath(pathname)) return null;
      return rewritten;
    } catch {
      return null;
    }
  }

  if (trimmed.startsWith("/")) {
    const rewritten = targetPath(trimmed, locale);
    if (!rewritten || rewritten === normalizePath(trimmed)) return null;
    return rewritten;
  }

  return null;
}

/** Rewrite internal href attributes in HTML to the target locale. */
export function rewriteInternalLinks(html: string, locale: Locale): string {
  return html.replace(/href=(["'])([^"'#?]+)\1/gi, (match, quote, href) => {
    if (href.startsWith("//") || href.startsWith("/wp-content/")) return match;
    if (href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) {
      return match;
    }
    const rewritten = rewriteHref(href, locale);
    if (!rewritten) return match;
    return `href=${quote}${rewritten}${quote}`;
  });
}

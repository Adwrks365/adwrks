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

/** Rewrite internal href attributes in HTML to the target locale. */
export function rewriteInternalLinks(html: string, locale: Locale): string {
  return html.replace(/href=(["'])(\/[^"'#?]*)\1/gi, (match, quote, href) => {
    if (href.startsWith("//") || href.startsWith("/wp-content/")) return match;
    const rewritten = targetPath(href, locale);
    if (!rewritten || rewritten === normalizePath(href)) return match;
    return `href=${quote}${rewritten}${quote}`;
  });
}

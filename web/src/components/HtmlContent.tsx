import { rewriteInternalLinks } from "@/i18n/rewrite-links";
import type { Locale } from "@/i18n/routing";
import { normalizeEnContentDirection, processContentHtml, stripJsonLdFromHtml } from "@/lib/content/html";

type HtmlContentProps = {
  html: string;
  className?: string;
  locale?: Locale;
};

/** Renders migrated WordPress HTML content (trusted audit source). */
export function HtmlContent({ html, className = "", locale = "he" }: HtmlContentProps) {
  const stripped = stripJsonLdFromHtml(html);
  let localized = rewriteInternalLinks(stripped, locale);
  if (locale === "en") {
    localized = normalizeEnContentDirection(localized);
  }
  const processed = processContentHtml(localized);
  if (!processed) return null;

  const dirClass = locale === "en" ? " content-html--en" : "";

  return (
    <div
      className={`content-html${dirClass} ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: processed }}
    />
  );
}

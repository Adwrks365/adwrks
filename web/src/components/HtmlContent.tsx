import { rewriteInternalLinks } from "@/i18n/rewrite-links";
import type { Locale } from "@/i18n/routing";
import { processContentHtml, stripJsonLdFromHtml } from "@/lib/content/html";

type HtmlContentProps = {
  html: string;
  className?: string;
  locale?: Locale;
};

/** Renders migrated WordPress HTML content (trusted audit source). */
export function HtmlContent({ html, className = "", locale = "he" }: HtmlContentProps) {
  const stripped = stripJsonLdFromHtml(html);
  const localized = rewriteInternalLinks(stripped, locale);
  const processed = processContentHtml(localized);
  if (!processed) return null;

  return (
    <div
      className={`content-html ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: processed }}
    />
  );
}

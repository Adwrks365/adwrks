import { processContentHtml, stripJsonLdFromHtml } from "@/lib/content/html";

type HtmlContentProps = {
  html: string;
  className?: string;
};

/** Renders migrated WordPress HTML content (trusted audit source). */
export function HtmlContent({ html, className = "" }: HtmlContentProps) {
  const processed = processContentHtml(stripJsonLdFromHtml(html));
  if (!processed) return null;

  return (
    <div
      className={`content-html ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: processed }}
    />
  );
}

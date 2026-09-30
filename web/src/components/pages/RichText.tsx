import { processContentHtml } from "@/lib/content/html";

type RichTextProps = {
  html: string;
  className?: string;
};

export function RichText({ html, className = "" }: RichTextProps) {
  const processed = processContentHtml(html);
  if (!processed) return null;
  return (
    <div
      className={`rich-text prose-content ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: processed }}
    />
  );
}

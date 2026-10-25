import { rewriteInternalLinks } from "@/i18n/rewrite-links";
import { hasHebrew } from "@/lib/content/seo-clamp";

const PLACEHOLDER_EN: Record<string, string> = {
  שם: "Name",
  "שם מלא": "Full name",
  אימייל: "Email",
  "דוא\"ל": "Email",
  הודעה: "Message",
  טלפון: "Phone",
  "טופס חדש": "Contact form",
  "שליחת טופס": "Submit",
};

const ATTRS_TO_SANITIZE = ["title", "placeholder", "aria-label", "name", "alt"] as const;

function translateAttrValue(value: string): string | null {
  const trimmed = value.trim();
  if (!hasHebrew(trimmed)) return null;
  if (PLACEHOLDER_EN[trimmed]) return PLACEHOLDER_EN[trimmed];
  if (/^https?:\/\//i.test(trimmed)) return null;
  return "";
}

/** Remove or translate Hebrew in attributes; drop inline scripts (runtime strips them anyway). */
export function sanitizeEnArticleHtml(html: string): string {
  if (!html) return "";

  let out = rewriteInternalLinks(html, "en");

  out = out.replace(/<script(?![^>]*type\s*=\s*["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>/gi, "");

  for (const attr of ATTRS_TO_SANITIZE) {
    const re = new RegExp(`\\s${attr}=(["'])([^"']*)\\1`, "gi");
    out = out.replace(re, (match, quote: string, value: string) => {
      const next = translateAttrValue(value);
      if (next === null) return match;
      if (next === "") return "";
      return ` ${attr}=${quote}${next}${quote}`;
    });
  }

  return out;
}

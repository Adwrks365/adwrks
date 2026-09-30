import { decodeHtmlEntities } from "./paths";

/** Plain-text excerpt from WordPress HTML, with entities decoded. */
export function formatExcerpt(html: string, max = 160): string {
  if (!html) return "";

  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\[[\w\-]+(?:[^\]]*)?\]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  text = decodeHtmlEntities(text).replace(/\u00a0/g, " ");

  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

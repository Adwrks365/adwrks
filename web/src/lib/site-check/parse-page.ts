import { isPlaceholderPhone, phoneLooksLikeContact } from "./contact-signals";
import type { ParsedLink, ParsedPage } from "./types";

function decodeHtml(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#0*39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => fromCode(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num: string) => fromCode(Number.parseInt(num, 10)));
}

function fromCode(code: number): string {
  if (!Number.isFinite(code) || code <= 0 || code > 0x10ffff) return "";
  try {
    return String.fromCodePoint(code);
  } catch {
    return "";
  }
}

function stripNoise(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ");
}

function visibleText(html: string): string {
  return decodeHtml(stripNoise(html).replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function attr(tag: string, name: string): string {
  const match = tag.match(new RegExp(`${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'=<>]+))`, "i"));
  return decodeHtml((match?.[1] ?? match?.[2] ?? match?.[3] ?? "").trim());
}

function metaContent(html: string, key: "name" | "property", value: string): string {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    const id = attr(tag, key).toLowerCase();
    if (id === value) return attr(tag, "content");
  }
  return "";
}

function collectAnchors(html: string, baseUrl: string, inNav: boolean): ParsedLink[] {
  const links: ParsedLink[] = [];
  const re = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html))) {
    const href = resolveHttpUrl(attr(match[1] ?? "", "href"), baseUrl);
    if (!href) continue;
    const text = decodeHtml((match[2] ?? "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
    links.push({ href, text, inNav });
  }
  return links;
}

export function resolveHttpUrl(raw: string, baseUrl: string): string | null {
  const href = raw.trim();
  if (!href || href.startsWith("#") || /^(mailto:|tel:|javascript:|sms:|whatsapp:)/i.test(href)) {
    return null;
  }
  try {
    const url = new URL(href, baseUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    url.hash = "";
    url.search = "";
    return url.toString();
  } catch {
    return null;
  }
}

const PHONE_RE = /(?:\+972[\s().-]*|0)(?:\d[\s().-]*){8,10}/g;

export function phonesInText(text: string): string[] {
  const found = new Set<string>();
  for (const match of text.matchAll(PHONE_RE)) {
    const local = normalizeLocalPhone(match[0]);
    if (!local || isPlaceholderPhone(local)) continue;
    found.add(local);
  }
  return [...found];
}

function normalizeLocalPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  const local = digits.startsWith("972") ? `0${digits.slice(3)}` : digits;
  if (local.length < 9 || local.length > 10 || !local.startsWith("0")) return null;
  const second = local.charCodeAt(1);
  if (second < 50 || second > 57) return null;
  return local;
}

export function contactPhonesInText(text: string): string[] {
  const found = new Set<string>();
  for (const match of text.matchAll(PHONE_RE)) {
    const local = normalizeLocalPhone(match[0]);
    if (!local || isPlaceholderPhone(local)) continue;
    if (match.index === undefined) continue;
    if (!phoneLooksLikeContact(text, match.index, match[0])) continue;
    found.add(local);
  }
  return [...found];
}

export function parsePageHtml(html: string, baseUrl: string): ParsedPage {
  const clean = stripNoise(html);
  const titleMatch = clean.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const title = decodeHtml(titleMatch?.[1] ?? "").replace(/\s+/g, " ").trim();
  const robots = [metaContent(clean, "name", "robots"), metaContent(clean, "name", "googlebot")]
    .filter(Boolean)
    .join(", ");
  const h1: string[] = [];
  const h1Re = /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi;
  let h1Match: RegExpExecArray | null;
  while ((h1Match = h1Re.exec(clean))) {
    const text = decodeHtml((h1Match[1] ?? "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
    if (text) h1.push(text);
  }

  const navHtml = [...clean.matchAll(/<(nav|header)\b[^>]*>[\s\S]*?<\/\1>/gi)].map((m) => m[0]).join("\n");
  const bodyWithoutNav = navHtml ? clean.replace(/<(nav|header)\b[^>]*>[\s\S]*?<\/\1>/gi, " ") : clean;
  const navLinks = collectAnchors(navHtml, baseUrl, true);
  const bodyLinks = collectAnchors(bodyWithoutNav, baseUrl, false);

  const telHrefs: string[] = [];
  const hrefRe = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  let hrefMatch: RegExpExecArray | null;
  while ((hrefMatch = hrefRe.exec(clean))) {
    const value = decodeHtml((hrefMatch[1] ?? hrefMatch[2] ?? "").trim());
    if (/^tel:/i.test(value)) telHrefs.push(value);
  }

  const hasWhatsapp = /(?:wa\.me|api\.whatsapp\.com|web\.whatsapp\.com|whatsapp:)/i.test(clean);
  const text = visibleText(clean);

  return {
    title,
    metaDescription: metaContent(clean, "name", "description"),
    robots,
    h1,
    navLinks,
    links: [...navLinks, ...bodyLinks],
    hasForm: /<form\b/i.test(clean),
    telHrefs,
    hasWhatsapp,
    contactPhones: contactPhonesInText(text),
    visibleTextLength: text.length,
  };
}

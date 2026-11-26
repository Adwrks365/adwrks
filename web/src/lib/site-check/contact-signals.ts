import type { ParsedPage } from "./types";

const CONTACT_CTX =
  /(?:phone|tel|call|mobile|fax|whatsapp|contact|יצירת[\s-]*קשר|התקשר|חייג|טלפון|מס['׳]?\s*טלפון)/i;

const CONVERSION_CTX =
  /(?:sign[\s-]*up|register|free[\s-]*trial|book[\s-]*demo|get[\s-]*started|request[\s-]*demo|start[\s-]*free|הרשמה|הירשמו|ניסיון|דמו|התחל|צור[\s-]*חשבון|קבע[\s-]*פגישה)/i;

/** Demo dashboard numbers and obvious placeholders — not contact phones. */
export function isPlaceholderPhone(local: string): boolean {
  const digits = local.replace(/\D/g, "");
  if (digits.length < 9) return true;
  if (/1234567|7654321|5550123|0000000|1111111|9876543/.test(digits)) return true;
  if (/(\d)\1{5,}/.test(digits)) return true;
  return false;
}

export function phoneLooksLikeContact(visibleText: string, matchIndex: number, raw: string): boolean {
  const start = Math.max(0, matchIndex - 100);
  const end = Math.min(visibleText.length, matchIndex + raw.length + 100);
  return CONTACT_CTX.test(visibleText.slice(start, end));
}

export function hasVisitorContactPath(page: ParsedPage): boolean {
  if (page.telHrefs.length > 0 || page.hasWhatsapp || page.hasForm) return true;
  if (page.contactPhones.length > 0) return true;
  return page.links.some((link) => CONVERSION_CTX.test(`${link.text} ${link.href}`));
}

export function looksLikeContactNav(value: string): boolean {
  return /contact|יצירת[\s-]*קשר|צור[\s-]*קשר|צרו[\s-]*קשר|הצעת[\s-]*מחיר|pricing|demo|trial|הרשמה/i.test(value);
}
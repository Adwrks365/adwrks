const SKIP_PATH = /\/(wp-admin|wp-login\.php|wp-json|xmlrpc\.php|feed|cart|checkout|tag|author|cdn-cgi)(\/|$)/i;
const SKIP_EXT = /\.(pdf|jpe?g|png|gif|webp|svg|zip|mp4|mp3|css|js|xml)\/?$/i;

function hostKey(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, "");
}

export function samePage(a: string, b: string): boolean {
  try {
    const left = new URL(a);
    const right = new URL(b);
    if (hostKey(left.hostname) !== hostKey(right.hostname)) return false;
    const path = (value: string) => value.replace(/\/+$/, "") || "/";
    return path(left.pathname) === path(right.pathname);
  } catch {
    return false;
  }
}

function isContact(blob: string): boolean {
  return /contact|יצירת[\s-]*קשר|צור[\s-]*קשר|צרו[\s-]*קשר|השאירו|get-in-touch/i.test(blob);
}

function isService(blob: string): boolean {
  return /service|שירות|בניית|בנייה|מוצר|product|solution|פתרון|\bseo\b/i.test(blob);
}

export function selectInnerPages(
  homeUrl: string,
  links: readonly { href: string; text: string; inNav: boolean }[],
  preferredUrl: string | null,
  limit = 3,
): string[] {
  let home: URL;
  try {
    home = new URL(homeUrl);
  } catch {
    return [];
  }
  const homeHost = hostKey(home.hostname);
  const seen = new Set<string>();
  const candidates: { href: string; score: number; contact: boolean; service: boolean }[] = [];

  for (const link of links) {
    let url: URL;
    try {
      url = new URL(link.href);
    } catch {
      continue;
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") continue;
    if (hostKey(url.hostname) !== homeHost) continue;
    if (samePage(url.toString(), homeUrl)) continue;
    if (SKIP_PATH.test(url.pathname) || SKIP_EXT.test(url.pathname)) continue;
    const href = url.toString();
    if (seen.has(href)) continue;
    seen.add(href);
    const blob = `${url.pathname} ${link.text}`;
    const depth = url.pathname.split("/").filter(Boolean).length;
    let score = link.inNav ? 5 : 1;
    const contact = isContact(blob);
    const service = isService(blob);
    if (contact) score += 8;
    if (service) score += 6;
    if (depth === 1) score += 2;
    if (depth >= 4) score -= 2;
    if (/\/(blog|category|tag|news|מאמרים)(\/|$)/i.test(url.pathname)) score -= 4;
    candidates.push({ href, score, contact, service });
  }

  const picked: string[] = [];
  const take = (href: string) => {
    if (picked.length >= limit || picked.some((item) => samePage(item, href))) return;
    picked.push(href);
  };

  if (preferredUrl && !samePage(preferredUrl, homeUrl)) {
    try {
      const preferred = new URL(preferredUrl);
      if (hostKey(preferred.hostname) === homeHost) take(preferred.toString());
    } catch {
      /* Ignore a preferred URL we cannot parse. */
    }
  }

  const ranked = [...candidates].sort((a, b) => b.score - a.score);
  const contact = ranked.find((item) => item.contact);
  if (contact) take(contact.href);
  for (const item of ranked.filter((entry) => entry.service)) take(item.href);
  for (const item of ranked) take(item.href);
  return picked;
}

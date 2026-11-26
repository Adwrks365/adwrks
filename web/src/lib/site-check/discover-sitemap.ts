import { canonicalScanUrl } from "./url-canonical";

const MAX_URLS = 80;

function sameHost(origin: string, candidate: string): boolean {
  try {
    return new URL(candidate).origin === new URL(origin).origin;
  } catch {
    return false;
  }
}

function extractLocs(xml: string): string[] {
  const urls: string[] = [];
  const re = /<loc>\s*([^<\s]+)\s*<\/loc>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(xml))) {
    const href = match[1]?.trim();
    if (href) urls.push(href);
    if (urls.length >= MAX_URLS) break;
  }
  return urls;
}

export async function discoverSitemapUrls(origin: string): Promise<string[]> {
  const candidates = [`${origin}sitemap.xml`, `${origin}sitemap_index.xml`];
  for (const href of candidates) {
    try {
      const response = await fetch(href, {
        method: "GET",
        cache: "no-store",
        signal: AbortSignal.timeout(4_000),
        headers: { Accept: "application/xml,text/xml" },
      });
      if (!response.ok) continue;
      const text = await response.text();
      const locs = extractLocs(text);
      const out: string[] = [];
      const seen = new Set<string>();
      for (const loc of locs) {
        const canonical = canonicalScanUrl(loc);
        if (!canonical || !sameHost(origin, canonical)) continue;
        if (seen.has(canonical)) continue;
        seen.add(canonical);
        out.push(canonical);
      }
      if (out.length > 0) return out;
    } catch {
      continue;
    }
  }
  return [];
}
export function canonicalScanUrl(raw: string): string | null {
  try {
    const url = new URL(raw);
    url.hash = "";
    url.search = "";
    url.pathname = url.pathname.replace(/\/+$/, "") || "/";
    return url.toString();
  } catch {
    return null;
  }
}

export function siteOrigin(raw: string): string | null {
  try {
    const url = new URL(raw);
    return new URL("/", url.origin).toString();
  } catch {
    return null;
  }
}
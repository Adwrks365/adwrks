import index from "@/generated/routable-path-index.json";

const ROUTABLE_PATHS = new Set(index.paths as string[]);

/** Paths that 301 in next.config — allow through middleware. */
const REDIRECT_ALLOWLIST = new Set([
  "/plans/",
  "/contact/",
  "/en/",
]);

export function normalizeRequestPathname(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  try {
    const decoded = decodeURI(pathname);
    if (decoded === "/en") return "/en/";
    if (!decoded.endsWith("/")) return `${decoded}/`;
    return decoded;
  } catch {
    return pathname.endsWith("/") ? pathname : `${pathname}/`;
  }
}

/**
 * next-intl rewrites default-locale URLs to an internal `/he/...` prefix.
 * The routable index stores public paths (`/blog/`, not `/he/blog/`).
 */
export function toPublicPathname(pathname: string): string {
  const normalized = normalizeRequestPathname(pathname);
  if (normalized === "/he/") return "/";
  if (normalized.startsWith("/he/")) {
    const rest = normalized.slice("/he".length);
    return normalizeRequestPathname(rest.startsWith("/") ? rest : `/${rest}`);
  }
  return normalized;
}

export function isRoutablePathname(pathname: string): boolean {
  const normalized = toPublicPathname(pathname);
  if (REDIRECT_ALLOWLIST.has(normalized)) return true;
  if (normalized === "/en/") return true;
  return ROUTABLE_PATHS.has(normalized);
}

export function routablePathCount(): number {
  return ROUTABLE_PATHS.size;
}

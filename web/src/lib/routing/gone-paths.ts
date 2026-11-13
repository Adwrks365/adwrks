import { normalizeRequestPathname, toPublicPathname } from "@/lib/routing/routable-path-index";

/** Permanently removed legacy WordPress thank-you URLs (no replacement). */
export const GONE_PATHS = new Set(["/thank-you-page/", "/en/thank-you-page/"]);

export function isGonePathname(pathname: string): boolean {
  const publicPath = toPublicPathname(pathname);
  return GONE_PATHS.has(normalizeRequestPathname(publicPath));
}

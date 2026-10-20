import index from "@/generated/routable-path-index.json";
import { normalizeRequestPathname } from "@/lib/routing/routable-path-index";

const ROUTABLE = new Set(index.paths as string[]);

const HEBREW = /[\u0590-\u05FF]/;

/** Known WordPress URLs that are not in the routable index. */
const EXPLICIT_REDIRECTS: Record<string, string> = {
  "/website-design/": "/website-building/",
  "/קידום-אורגני/": "/seo/",
  "/seo-2026-איך-להופיע-בתשובות-של-ה-ai/": "/seo-2026-ai-answers/",
  "/edri-ohanona-law-office/": "/website-building/",
};

function enPathForRootSegment(path: string): string {
  const rest = path.startsWith("/") ? path.slice(1) : path;
  return normalizeRequestPathname(`/en/${rest}`);
}

/**
 * Returns a public pathname to 301/308 to, or null if no legacy rule applies.
 */
export function resolveLegacyRedirect(pathname: string): string | null {
  const path = normalizeRequestPathname(pathname);

  const explicit = EXPLICIT_REDIRECTS[path];
  if (explicit) return explicit;

  if (path.startsWith("/tag/")) {
    return "/blog/";
  }

  if (path === "/feed/") {
    return "/blog/";
  }

  if (/\/feed\/$/.test(path)) {
    const parent = normalizeRequestPathname(path.replace(/\/feed\/$/, "/"));
    if (ROUTABLE.has(parent)) return parent;
    return "/blog/";
  }

  if (path.startsWith("/en/") && path.length > "/en/".length) {
    const hePath = normalizeRequestPathname(path.slice("/en".length));
    if (HEBREW.test(hePath) && ROUTABLE.has(hePath)) {
      return hePath;
    }
  }

  if (!path.startsWith("/en/") && path !== "/" && !ROUTABLE.has(path) && !HEBREW.test(path)) {
    const enPath = enPathForRootSegment(path);
    if (ROUTABLE.has(enPath)) return enPath;
  }

  return null;
}

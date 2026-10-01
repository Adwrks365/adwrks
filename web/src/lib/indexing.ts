/** Production apex and www hostnames — indexable when served from a production deployment. */
export const PRODUCTION_HOSTNAMES = ["adwrks.co.il", "www.adwrks.co.il"] as const;

function normalizeHostname(host: string | null | undefined): string {
  if (!host) return "";
  return host.split(":")[0]?.trim().toLowerCase() ?? "";
}

/** Vercel Preview and local dev — never indexable. */
export function isPreviewOrNonProductionDeployment(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  if (process.env.VERCEL_ENV === "preview") return true;
  if (process.env.VERCEL_ENV === "development") return true;
  return false;
}

/** True when the request Host is the live production domain (not *.vercel.app). */
export function isProductionHostname(host: string | null | undefined): boolean {
  const normalized = normalizeHostname(host);
  return (PRODUCTION_HOSTNAMES as readonly string[]).includes(normalized);
}

/**
 * Indexing and analytics activate on the real production domain from a production deployment.
 * Uses request Host when available; falls back to Vercel production deployment signal at build time.
 */
export function shouldAllowIndexing(host?: string | null): boolean {
  if (isPreviewOrNonProductionDeployment()) return false;

  if (host) {
    return isProductionHostname(host);
  }

  // Production Vercel build without request context (SSG) — indexable once deployed.
  return process.env.VERCEL_ENV === "production";
}

/** @deprecated Use shouldAllowIndexing(host) — kept for call sites migrating to async host checks. */
export function isIndexableProduction(): boolean {
  return shouldAllowIndexing();
}

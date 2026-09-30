/**
 * Keep every Vercel hostname noindex until the production URL is the real domain.
 * Canonicals stay on https://adwrks.co.il either way.
 */
export function isIndexableProduction(): boolean {
  return (
    process.env.NODE_ENV === "production" &&
    process.env.VERCEL_ENV === "production" &&
    process.env.VERCEL_PROJECT_PRODUCTION_URL === "adwrks.co.il"
  );
}

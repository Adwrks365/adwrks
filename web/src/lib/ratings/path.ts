import { pathForLocale } from "@/i18n/routes";
import { normalizePath } from "@/lib/content/paths";

/** Supabase rating baselines use Hebrew `article_path` — map EN URLs to the same key. */
export function resolveArticleRatingPath(input: string): string {
  const normalized = normalizePath(input);
  if (!normalized || normalized === "/") return normalized;
  return pathForLocale(normalized, "he");
}

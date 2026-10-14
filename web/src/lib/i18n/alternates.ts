import { alternatePaths } from "@/i18n/routes";
import { normalizePath } from "@/lib/content/paths";
import { locationAlternatePaths } from "@/lib/pages/locations/paths";

/** Route pairs from content, plus location pages that are not in the generated map. */
export function resolveAlternatePaths(path: string): { he: string; en: string } | null {
  const key = normalizePath(path);
  return locationAlternatePaths(key) ?? alternatePaths(key);
}

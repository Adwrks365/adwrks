import type { Locale } from "@/i18n/routing";
import { normalizePath } from "@/lib/content/paths";
import { stripElementorContentBlockByH2 } from "@/lib/content/article-structure-polish";

/** Cross-article reading polish (pilot paths only — not global 110). */

export function applyArticleReadingPolishShared(
  html: string,
  path: string,
  locale: Locale,
): string {
  const key = normalizePath(path);

  if (locale === "en" && key === "/en/google-shopping-guide/") {
    return stripElementorContentBlockByH2(
      html,
      (t) =>
        /search terms that people search/i.test(t) ||
        /^summary:/i.test(t) ||
        (/sell/i.test(t) && /adwrks/i.test(t) && /shopping/i.test(t)),
    );
  }

  return html;
}
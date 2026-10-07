import Link from "next/link";
import { PhysicalNavRow } from "@/components/ui/PhysicalNavRow";
import type { Locale } from "@/i18n/routing";
import type { ContentItem } from "@/lib/content/types";
import { getArticleUi } from "@/lib/i18n/article-ui";
import { siteDir } from "@/i18n/locale";

type ArticleAdjacentNavProps = {
  previous: ContentItem | null;
  next: ContentItem | null;
  locale?: Locale;
};

export function ArticleAdjacentNav({ previous, next, locale = "he" }: ArticleAdjacentNavProps) {
  const ui = getArticleUi(locale);
  const textDir = siteDir(locale);

  if (!previous && !next) return null;

  return (
    <nav className="article-adjacent-nav" aria-label={ui.adjacentNav}>
      {previous ? (
        <Link href={previous.path} className="article-adjacent-link article-adjacent-link-prev">
          <span className="article-adjacent-meta">
            {locale === "en" ? (
              <PhysicalNavRow label={ui.prevArticle} arrow="left" arrowPosition="start" textDir="ltr" />
            ) : (
              <PhysicalNavRow label={ui.prevArticle} arrow="right" arrowPosition="end" textDir="rtl" />
            )}
          </span>
          <span className="article-adjacent-title" dir={textDir}>
            {previous.title}
          </span>
        </Link>
      ) : (
        <span className="article-adjacent-spacer" aria-hidden="true" />
      )}

      {next ? (
        <Link href={next.path} className="article-adjacent-link article-adjacent-link-next">
          <span className="article-adjacent-meta">
            {locale === "en" ? (
              <PhysicalNavRow label={ui.nextArticle} arrow="right" arrowPosition="end" textDir="ltr" />
            ) : (
              <PhysicalNavRow label={ui.nextArticle} arrow="left" arrowPosition="start" textDir="rtl" />
            )}
          </span>
          <span className="article-adjacent-title" dir={textDir}>
            {next.title}
          </span>
        </Link>
      ) : (
        <span className="article-adjacent-spacer" aria-hidden="true" />
      )}
    </nav>
  );
}

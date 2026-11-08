import Link from "next/link";
import { LineIcon } from "@/components/ui/LineIcon";
import type { Locale } from "@/i18n/routing";
import { numberFormatLocale } from "@/i18n/locale";
import type { ArticleAuthor } from "@/lib/content/article";
import { getArticleUi } from "@/lib/i18n/article-ui";

type ArticleTopMetaProps = {
  breadcrumbTitle: string;
  date?: string;
  modified?: string;
  author?: ArticleAuthor | null;
  locale?: Locale;
};

function formatDate(date: string | undefined, locale: Locale): string {
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat(numberFormatLocale(locale), {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return "";
  }
}

function isDifferentCalendarDay(a?: string, b?: string): boolean {
  if (!a || !b) return false;
  return a.slice(0, 10) !== b.slice(0, 10);
}

export function ArticleTopMeta({
  breadcrumbTitle,
  date,
  modified,
  author,
  locale = "he",
}: ArticleTopMetaProps) {
  const ui = getArticleUi(locale);
  const showUpdated = isDifferentCalendarDay(date, modified);
  const displayIso = showUpdated && modified ? modified : date ?? modified;
  const formattedDate = formatDate(displayIso, locale);
  const authorName = author?.name?.trim();

  return (
    <header className="article-top-meta">
      <nav className="article-breadcrumbs" aria-label={ui.breadcrumbNavLabel}>
        <ol className="article-breadcrumbs-list">
          <li className="article-breadcrumbs-item">
            <Link href={ui.homeHref} className="article-breadcrumbs-link">
              {ui.breadcrumbHome}
            </Link>
          </li>
          <li className="article-breadcrumbs-item" aria-hidden="true">
            <span className="article-breadcrumbs-sep">›</span>
          </li>
          <li className="article-breadcrumbs-item">
            <Link href={ui.blogHref} className="article-breadcrumbs-link">
              {ui.breadcrumbBlog}
            </Link>
          </li>
          <li className="article-breadcrumbs-item" aria-hidden="true">
            <span className="article-breadcrumbs-sep">›</span>
          </li>
          <li className="article-breadcrumbs-item article-breadcrumbs-item--current">
            <span className="article-breadcrumbs-current" aria-current="page">
              {breadcrumbTitle}
            </span>
          </li>
        </ol>
      </nav>

      {(formattedDate || authorName) && (
        <div className="article-top-details">
          {formattedDate && displayIso && (
            <span className="article-top-detail">
              <LineIcon name="calendar" />
              <time dateTime={displayIso}>
                {showUpdated ? `${ui.dateUpdated} ${formattedDate}` : formattedDate}
              </time>
            </span>
          )}
          {authorName && (
            <span className="article-top-detail">
              <LineIcon name="user" />
              <span>{authorName}</span>
            </span>
          )}
        </div>
      )}
    </header>
  );
}

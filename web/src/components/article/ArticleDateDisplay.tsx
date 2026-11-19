import { LineIcon } from "@/components/ui/LineIcon";
import type { Locale } from "@/i18n/routing";
import { numberFormatLocale } from "@/i18n/locale";
import {
  resolveArticleDates,
  type ResolvedArticleDates,
} from "@/lib/content/article-dates";
import type { ContentItem } from "@/lib/content/types";
import { getArticleUi } from "@/lib/i18n/article-ui";

function formatDisplayDate(iso: string | undefined, locale: Locale): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat(numberFormatLocale(locale), {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jerusalem",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export function formatArticleDateForLocale(iso: string | undefined, locale: Locale): string {
  return formatDisplayDate(iso, locale);
}

type ArticleDateDisplayProps = {
  item: Pick<ContentItem, "id" | "date" | "modified" | "type">;
  locale?: Locale;
  variant?: "article-top" | "card" | "related" | "related-list";
  /** Pre-resolved dates (optional — avoids duplicate work). */
  dates?: ResolvedArticleDates;
};

export function ArticleDateDisplay({
  item,
  locale = "he",
  variant = "article-top",
  dates: datesProp,
}: ArticleDateDisplayProps) {
  const ui = getArticleUi(locale);
  const dates = datesProp ?? resolveArticleDates(item);
  const published = formatDisplayDate(dates.datePublished, locale);
  const updated = formatDisplayDate(dates.dateModified, locale);

  if (!published && !updated) return null;

  const dateClass =
    variant === "card"
      ? "article-card-date"
      : variant === "related"
        ? "related-article-card-date"
        : variant === "related-list"
          ? "article-related-date"
          : undefined;

  const updatedClass =
    variant === "card"
      ? "article-card-date article-card-date--updated"
      : variant === "related"
        ? "related-article-card-date related-article-card-date--updated"
        : variant === "related-list"
          ? "article-related-date article-related-date--updated"
          : "article-top-detail article-top-detail--updated";

  if (variant === "article-top") {
    return (
      <>
        {published && dates.datePublished && (
          <span className="article-top-detail">
            <LineIcon name="calendar" />
            <time dateTime={dates.datePublished}>
              {ui.datePublished} {published}
            </time>
          </span>
        )}
        {dates.showUpdated && updated && dates.dateModified && (
          <span className={updatedClass}>
            <LineIcon name="calendar" />
            <time dateTime={dates.dateModified}>
              {ui.dateUpdated} {updated}
            </time>
          </span>
        )}
      </>
    );
  }

  return (
    <span className="article-date-inline">
      {published && dates.datePublished && (
        <time dateTime={dates.datePublished} className={dateClass}>
          {published}
        </time>
      )}
      {dates.showUpdated && updated && dates.dateModified && (
        <time dateTime={dates.dateModified} className={updatedClass}>
          {ui.dateUpdated} {updated}
        </time>
      )}
    </span>
  );
}
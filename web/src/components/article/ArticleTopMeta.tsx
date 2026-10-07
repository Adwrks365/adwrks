import Link from "next/link";
import { LineIcon } from "@/components/ui/LineIcon";
import type { Locale } from "@/i18n/routing";
import { numberFormatLocale } from "@/i18n/locale";
import type { ArticleAuthor } from "@/lib/content/article";
import { getArticleUi } from "@/lib/i18n/article-ui";

type ArticleTopMetaProps = {
  date?: string;
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

export function ArticleTopMeta({ date, author, locale = "he" }: ArticleTopMetaProps) {
  const ui = getArticleUi(locale);
  const formattedDate = formatDate(date, locale);
  const authorName = author?.name?.trim();
  const backIcon = locale === "en" ? "arrow-left" : "arrow-right";

  return (
    <header className="article-top-meta">
      <Link href={ui.blogHref} className="article-top-back">
        <LineIcon name={backIcon} className="article-top-back-icon" />
        <span>{ui.backToBlog}</span>
      </Link>

      {(formattedDate || authorName) && (
        <div className="article-top-details">
          {formattedDate && (
            <span className="article-top-detail">
              <LineIcon name="calendar" />
              <time dateTime={date}>{formattedDate}</time>
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

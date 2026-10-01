import Link from "next/link";
import { LineIcon } from "@/components/ui/LineIcon";
import type { ArticleAuthor } from "@/lib/content/article";

type ArticleTopMetaProps = {
  date?: string;
  author?: ArticleAuthor | null;
};

function formatDate(date?: string): string {
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat("he-IL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return "";
  }
}

export function ArticleTopMeta({ date, author }: ArticleTopMetaProps) {
  const formattedDate = formatDate(date);
  const authorName = author?.name?.trim();

  return (
    <header className="article-top-meta">
      <Link href="/blog/" className="article-top-back">
        <LineIcon name="arrow-right" className="article-top-back-icon" />
        <span>חזרה לכל המאמרים</span>
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

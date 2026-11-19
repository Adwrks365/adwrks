import Link from "next/link";
import type { Locale } from "@/i18n/routing";
import type { ArticleAuthor } from "@/lib/content/article";
import type { ContentItem } from "@/lib/content/types";
import { getArticleUi } from "@/lib/i18n/article-ui";
import { ArticleDateDisplay } from "@/components/article/ArticleDateDisplay";
import { LineIcon } from "@/components/ui/LineIcon";

type ArticleTopMetaProps = {
  breadcrumbTitle: string;
  content: Pick<ContentItem, "id" | "date" | "modified" | "type">;
  author?: ArticleAuthor | null;
  locale?: Locale;
};

export function ArticleTopMeta({
  breadcrumbTitle,
  content,
  author,
  locale = "he",
}: ArticleTopMetaProps) {
  const ui = getArticleUi(locale);
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

      {(content.date || content.modified || authorName) && (
        <div className="article-top-details">
          <ArticleDateDisplay item={content} locale={locale} variant="article-top" />
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
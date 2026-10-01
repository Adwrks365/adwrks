import Link from "next/link";
import type { ContentItem } from "@/lib/content/types";

type ArticleAdjacentNavProps = {
  previous: ContentItem | null;
  next: ContentItem | null;
};

export function ArticleAdjacentNav({ previous, next }: ArticleAdjacentNavProps) {
  if (!previous && !next) return null;

  return (
    <nav className="article-adjacent-nav" aria-label="ניווט בין מאמרים">
      {next ? (
        <Link href={next.path} className="article-adjacent-link article-adjacent-link-next">
          <span className="article-adjacent-meta">
            <span className="article-adjacent-arrow" aria-hidden="true">
              ←
            </span>
            <span className="article-adjacent-label">המאמר הבא</span>
          </span>
          <span className="article-adjacent-title">{next.title}</span>
        </Link>
      ) : (
        <span className="article-adjacent-spacer" aria-hidden="true" />
      )}

      {previous ? (
        <Link href={previous.path} className="article-adjacent-link article-adjacent-link-prev">
          <span className="article-adjacent-meta">
            <span className="article-adjacent-label">המאמר הקודם</span>
            <span className="article-adjacent-arrow" aria-hidden="true">
              →
            </span>
          </span>
          <span className="article-adjacent-title">{previous.title}</span>
        </Link>
      ) : (
        <span className="article-adjacent-spacer" aria-hidden="true" />
      )}
    </nav>
  );
}

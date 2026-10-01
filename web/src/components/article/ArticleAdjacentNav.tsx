import Link from "next/link";
import { PhysicalNavRow } from "@/components/ui/PhysicalNavRow";
import type { ContentItem } from "@/lib/content/types";

type ArticleAdjacentNavProps = {
  previous: ContentItem | null;
  next: ContentItem | null;
};

export function ArticleAdjacentNav({ previous, next }: ArticleAdjacentNavProps) {
  if (!previous && !next) return null;

  return (
    <nav className="article-adjacent-nav" aria-label="ניווט בין מאמרים">
      {previous ? (
        <Link href={previous.path} className="article-adjacent-link article-adjacent-link-prev">
          <span className="article-adjacent-meta">
            <PhysicalNavRow label="המאמר הקודם" arrow="right" arrowPosition="end" />
          </span>
          <span className="article-adjacent-title" dir="rtl">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span className="article-adjacent-spacer" aria-hidden="true" />
      )}

      {next ? (
        <Link href={next.path} className="article-adjacent-link article-adjacent-link-next">
          <span className="article-adjacent-meta">
            <PhysicalNavRow label="המאמר הבא" arrow="left" arrowPosition="start" />
          </span>
          <span className="article-adjacent-title" dir="rtl">
            {next.title}
          </span>
        </Link>
      ) : (
        <span className="article-adjacent-spacer" aria-hidden="true" />
      )}
    </nav>
  );
}

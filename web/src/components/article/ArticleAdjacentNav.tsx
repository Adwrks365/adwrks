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
      {next ? (
        <Link href={next.path} className="article-adjacent-link article-adjacent-link-next">
          <span className="article-adjacent-meta">
            <PhysicalNavRow label="המאמר הבא" arrow="left" />
          </span>
          <span className="article-adjacent-title">{next.title}</span>
        </Link>
      ) : (
        <span className="article-adjacent-spacer" aria-hidden="true" />
      )}

      {previous ? (
        <Link href={previous.path} className="article-adjacent-link article-adjacent-link-prev">
          <span className="article-adjacent-meta">
            <PhysicalNavRow label="המאמר הקודם" arrow="right" />
          </span>
          <span className="article-adjacent-title">{previous.title}</span>
        </Link>
      ) : (
        <span className="article-adjacent-spacer" aria-hidden="true" />
      )}
    </nav>
  );
}

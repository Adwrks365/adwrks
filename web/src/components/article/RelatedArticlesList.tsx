import Image from "next/image";
import Link from "next/link";
import { formatExcerpt } from "@/lib/content/excerpt";
import type { ContentItem } from "@/lib/content/types";

type RelatedArticlesListProps = {
  posts: ContentItem[];
  compact?: boolean;
  showExcerpt?: boolean;
  ctaLabel?: string;
};

function formatDate(date?: string): string {
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat("he-IL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return "";
  }
}

export function RelatedArticlesList({
  posts,
  compact = false,
  showExcerpt = true,
  ctaLabel = "למאמר המלא",
}: RelatedArticlesListProps) {
  if (posts.length === 0) return null;

  return (
    <ul className={`article-related-list ${compact ? "article-related-list--compact" : ""}`.trim()}>
      {posts.map((post) => (
        <li key={post.path} className="article-related-item">
          {post.featuredImageUrl && (
            <Link href={post.path} className="article-related-thumb">
              <Image
                src={post.featuredImageUrl}
                alt=""
                width={compact ? 72 : 120}
                height={compact ? 54 : 72}
                loading="lazy"
                sizes={compact ? "72px" : "120px"}
              />
            </Link>
          )}
          <div className="article-related-body">
            {post.date && (
              <time dateTime={post.date} className="article-related-date">
                {formatDate(post.date)}
              </time>
            )}
            <Link href={post.path} className="article-related-title">
              {post.title}
            </Link>
            {showExcerpt && post.excerpt && (
              <p className="article-related-excerpt">{formatExcerpt(post.excerpt, compact ? 100 : 140)}</p>
            )}
            <Link href={post.path} className="article-related-cta">
              {ctaLabel}
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}

import Image from "next/image";
import Link from "next/link";
import { formatExcerpt } from "@/lib/content/excerpt";
import type { ContentItem } from "@/lib/content/types";

type RelatedArticleCardsProps = {
  posts: ContentItem[];
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

export function RelatedArticleCards({ posts }: RelatedArticleCardsProps) {
  if (posts.length === 0) return null;

  return (
    <div className="related-article-cards">
      {posts.slice(0, 3).map((post) => (
        <article key={post.path} className="related-article-card">
          {post.featuredImageUrl ? (
            <Link href={post.path} className="related-article-card-media">
              <Image
                src={post.featuredImageUrl}
                alt={post.featuredImageAlt || post.title}
                width={400}
                height={220}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 33vw"
                className="related-article-card-image"
              />
            </Link>
          ) : (
            <Link href={post.path} className="related-article-card-placeholder" aria-hidden="true">
              <span>מאמר</span>
            </Link>
          )}
          <div className="related-article-card-body">
            {post.date && (
              <time dateTime={post.date} className="related-article-card-date">
                {formatDate(post.date)}
              </time>
            )}
            <h3 className="related-article-card-title">
              <Link href={post.path}>{post.title}</Link>
            </h3>
            {post.excerpt && (
              <p className="related-article-card-excerpt">{formatExcerpt(post.excerpt, 140)}</p>
            )}
            <Link href={post.path} className="related-article-card-link">
              למאמר המלא
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

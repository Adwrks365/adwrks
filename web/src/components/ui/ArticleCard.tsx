import Image from "next/image";
import Link from "next/link";
import { PhysicalNavRow } from "@/components/ui/PhysicalNavRow";
import { formatExcerpt } from "@/lib/content/excerpt";
import type { ContentItem } from "@/lib/content/types";

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

type ArticleCardProps = {
  post: ContentItem;
};

export function ArticleCard({ post }: ArticleCardProps) {
  const hasImage = Boolean(post.featuredImageUrl);
  const excerpt = post.excerpt ? formatExcerpt(post.excerpt, 150) : "";

  return (
    <article className={`article-card ${hasImage ? "" : "article-card--no-image"}`.trim()}>
      {hasImage ? (
        <Link href={post.path} className="article-card-media block overflow-hidden">
          <Image
            src={post.featuredImageUrl!}
            alt={post.featuredImageAlt || post.title}
            width={480}
            height={280}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="article-card-image"
          />
        </Link>
      ) : (
        <Link href={post.path} className="article-card-placeholder" aria-hidden="true">
          <span className="article-card-placeholder-label">מאמר</span>
        </Link>
      )}
      <div className="article-card-body">
        {post.date && (
          <time dateTime={post.date} className="article-card-date">
            {formatDate(post.date)}
          </time>
        )}
        <h2 className="article-card-title">
          <Link href={post.path}>{post.title}</Link>
        </h2>
        {excerpt && <p className="article-card-excerpt">{excerpt}</p>}
        <Link href={post.path} className="article-card-link">
          <PhysicalNavRow label="קרא עוד" arrow="left" arrowPosition="start" />
        </Link>
      </div>
    </article>
  );
}

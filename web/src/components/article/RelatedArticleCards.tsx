import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/routing";
import { ArticleDateDisplay } from "@/components/article/ArticleDateDisplay";
import { formatExcerpt } from "@/lib/content/excerpt";
import { getArticleUi } from "@/lib/i18n/article-ui";
import type { ContentItem } from "@/lib/content/types";

type RelatedArticleCardsProps = {
  posts: ContentItem[];
  locale?: Locale;
};

export function RelatedArticleCards({ posts, locale = "he" }: RelatedArticleCardsProps) {
  const ui = getArticleUi(locale);
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
              <span>{ui.articleTag}</span>
            </Link>
          )}
          <div className="related-article-card-body">
            {(post.date || post.modified) && (
              <ArticleDateDisplay item={post} locale={locale} variant="related" />
            )}
            <h3 className="related-article-card-title">
              <Link href={post.path}>{post.title}</Link>
            </h3>
            {post.excerpt && (
              <p className="related-article-card-excerpt">{formatExcerpt(post.excerpt, 140)}</p>
            )}
            <Link href={post.path} className="related-article-card-link">
              {ui.readFull}
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
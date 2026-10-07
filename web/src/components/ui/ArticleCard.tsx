import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/routing";
import { numberFormatLocale } from "@/i18n/locale";
import { PhysicalNavRow } from "@/components/ui/PhysicalNavRow";
import { formatExcerpt } from "@/lib/content/excerpt";
import { getArticleUi } from "@/lib/i18n/article-ui";
import type { ContentItem } from "@/lib/content/types";

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

type ArticleCardProps = {
  post: ContentItem;
  locale?: Locale;
};

export function ArticleCard({ post, locale = "he" }: ArticleCardProps) {
  const ui = getArticleUi(locale);
  const hasImage = Boolean(post.featuredImageUrl);
  const excerpt = post.excerpt ? formatExcerpt(post.excerpt, 150) : "";
  const readMoreLabel = locale === "en" ? "Read more" : "קרא עוד";

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
          <span className="article-card-placeholder-label">{ui.articleTag}</span>
        </Link>
      )}
      <div className="article-card-body">
        {post.date && (
          <time dateTime={post.date} className="article-card-date">
            {formatDate(post.date, locale)}
          </time>
        )}
        <h2 className="article-card-title">
          <Link href={post.path}>{post.title}</Link>
        </h2>
        {excerpt && <p className="article-card-excerpt">{excerpt}</p>}
        <Link href={post.path} className="article-card-link">
          {locale === "en" ? (
            <PhysicalNavRow label={readMoreLabel} arrow="right" arrowPosition="end" textDir="ltr" />
          ) : (
            <PhysicalNavRow label={readMoreLabel} arrow="left" arrowPosition="start" textDir="rtl" />
          )}
        </Link>
      </div>
    </article>
  );
}

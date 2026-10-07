import Link from "next/link";
import { ArticleAdjacentNav } from "@/components/article/ArticleAdjacentNav";
import { ArticleAuthorCard } from "@/components/article/ArticleAuthorCard";
import { ArticleRating } from "@/components/article/ArticleRating";
import { RelatedArticleCards } from "@/components/article/RelatedArticleCards";
import type { Locale } from "@/i18n/routing";
import type { AdjacentArticles, ArticleAuthor } from "@/lib/content/article";
import { getArticleUi } from "@/lib/i18n/article-ui";
import type { ContentItem } from "@/lib/content/types";

type ArticleEndSectionProps = {
  related: ContentItem[];
  author: ArticleAuthor;
  postPath: string;
  adjacent: AdjacentArticles;
  locale?: Locale;
};

export function ArticleEndSection({
  related,
  author,
  postPath,
  adjacent,
  locale = "he",
}: ArticleEndSectionProps) {
  const ui = getArticleUi(locale);

  return (
    <div className="article-end-wrapper">
      <div className="article-end-shell">
        <section className="article-end-section" aria-label={ui.endSection}>
          <ArticleRating postPath={postPath} locale={locale} />
          <ArticleAdjacentNav previous={adjacent.previous} next={adjacent.next} locale={locale} />
          <ArticleAuthorCard author={author} locale={locale} />

          <div className="article-end-related-rich">
            <h2 className="article-end-heading">{ui.relatedHeading}</h2>
            <RelatedArticleCards posts={related} locale={locale} />
          </div>
        </section>

        <div className="article-cta-band article-end-module">
          <p className="article-cta-text">{ui.ctaText}</p>
          <Link href={ui.contactHref} className="article-cta-button">
            {ui.ctaButton}
          </Link>
        </div>
      </div>
    </div>
  );
}

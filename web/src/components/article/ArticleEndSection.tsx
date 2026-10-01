import Link from "next/link";
import { ArticleAdjacentNav } from "@/components/article/ArticleAdjacentNav";
import { ArticleAuthorCard } from "@/components/article/ArticleAuthorCard";
import { ArticleRating } from "@/components/article/ArticleRating";
import { RelatedArticleCards } from "@/components/article/RelatedArticleCards";
import type { AdjacentArticles, ArticleAuthor } from "@/lib/content/article";
import type { ContentItem } from "@/lib/content/types";

type ArticleEndSectionProps = {
  related: ContentItem[];
  author: ArticleAuthor;
  postPath: string;
  adjacent: AdjacentArticles;
};

export function ArticleEndSection({
  related,
  author,
  postPath,
  adjacent,
}: ArticleEndSectionProps) {
  return (
    <div className="article-end-wrapper">
      <div className="article-end-shell">
        <section className="article-end-section" aria-label="סיום המאמר">
          <ArticleRating postPath={postPath} />
          <ArticleAdjacentNav previous={adjacent.previous} next={adjacent.next} />
          <ArticleAuthorCard author={author} />

          <div className="article-end-related-rich">
            <h2 className="article-end-heading">מאמרים שעשויים לעניין אתכם</h2>
            <RelatedArticleCards posts={related} />
          </div>
        </section>

        <div className="article-cta-band article-end-module">
          <p className="article-cta-text">רוצים ליישם את מה שלמדתם במאמר?</p>
          <Link href="/contact-us/" className="article-cta-button">
            דברו איתנו
          </Link>
        </div>
      </div>
    </div>
  );
}

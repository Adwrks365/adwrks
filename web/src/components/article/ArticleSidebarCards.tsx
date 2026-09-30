import { ArticleFacebookSocialProof } from "@/components/article/ArticleFacebookSocialProof";
import { ArticleSidebarContactForm } from "@/components/article/ArticleSidebarContactForm";
import { RelatedArticlesList } from "@/components/article/RelatedArticlesList";
import type { ContentItem } from "@/lib/content/types";

type ArticleSidebarCardsProps = {
  related: ContentItem[];
  pageTitle: string;
  pagePath: string;
};

export function ArticleSidebarCards({ related, pageTitle, pagePath }: ArticleSidebarCardsProps) {
  return (
    <div className="article-sidebar-stack">
      <ArticleFacebookSocialProof />

      <div className="article-sidebar-card">
        <h2 className="article-sidebar-title">מאמרים נוספים</h2>
        <RelatedArticlesList
          posts={related.slice(0, 3)}
          compact
          showExcerpt
          ctaLabel="קראו את המאמר"
        />
      </div>

      <ArticleSidebarContactForm pageTitle={pageTitle} pagePath={pagePath} />
    </div>
  );
}

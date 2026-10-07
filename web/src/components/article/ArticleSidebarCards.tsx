import { ArticleFacebookSocialProof } from "@/components/article/ArticleFacebookSocialProof";
import { ArticleSidebarContactForm } from "@/components/article/ArticleSidebarContactForm";
import { RelatedArticlesList } from "@/components/article/RelatedArticlesList";
import type { Locale } from "@/i18n/routing";
import { getArticleUi } from "@/lib/i18n/article-ui";
import type { ContentItem } from "@/lib/content/types";

type ArticleSidebarCardsProps = {
  related: ContentItem[];
  pageTitle: string;
  pagePath: string;
  locale?: Locale;
};

export function ArticleSidebarCards({
  related,
  pageTitle,
  pagePath,
  locale = "he",
}: ArticleSidebarCardsProps) {
  const ui = getArticleUi(locale);

  return (
    <div className="article-sidebar-stack">
      <ArticleFacebookSocialProof locale={locale} />

      <div className="article-sidebar-card">
        <h2 className="article-sidebar-title">{ui.moreArticles}</h2>
        <RelatedArticlesList
          posts={related.slice(0, 3)}
          compact
          showExcerpt
          ctaLabel={ui.readArticle}
          locale={locale}
        />
      </div>

      <ArticleSidebarContactForm pageTitle={pageTitle} pagePath={pagePath} locale={locale} />
    </div>
  );
}

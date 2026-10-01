import { ContextualPopupRegistrar } from "@/components/popups/ContextualPopupRegistrar";
import { HtmlContent } from "@/components/HtmlContent";
import { PageHero } from "@/components/ui/PageHero";
import { ArticleMeta } from "@/components/ui/ArticleMeta";
import { Container } from "@/components/ui/Container";
import { ArticleToc } from "@/components/article/ArticleToc";
import { ArticleSidebarCards } from "@/components/article/ArticleSidebarCards";
import { ArticleEndSection } from "@/components/article/ArticleEndSection";
import {
  ARTICLE_AUTHOR,
  getAdjacentArticles,
  getCategoryLabel,
  getRelatedArticles,
  prepareArticleBodyHtml,
} from "@/lib/content/article";
import { processContentHtml } from "@/lib/content/html";
import { resolveArticlePopupConfig } from "@/lib/popups/article-pages";
import type { ContentItem } from "@/lib/content/types";

type ArticleTemplateProps = {
  content: ContentItem;
};

export function ArticleTemplate({ content }: ArticleTemplateProps) {
  const { html: bodyHtml, headings } = prepareArticleBodyHtml(content.content);
  const processedHtml = processContentHtml(bodyHtml);
  const category = getCategoryLabel(content);
  const related = getRelatedArticles(content, 4);
  const adjacent = getAdjacentArticles(content);
  const showHeroImage = Boolean(content.featuredImageUrl);
  const popupConfig = resolveArticlePopupConfig(content);

  return (
    <article className="content-page-shell article-page">
      <PageHero
        variant="article"
        title={content.title}
        eyebrow={category}
        image={showHeroImage ? content.featuredImageUrl : undefined}
        imageAlt={content.featuredImageAlt || content.title}
        compact
        meta={
          <ArticleMeta
            date={content.date}
            label={category ? undefined : "מאמר"}
          />
        }
      />

      <Container className="article-template-body">
        <div className="article-layout">
          <div className="article-main">
            <ArticleToc headings={headings} className="article-toc-inline" />

            <div className="article-template-prose">
              <HtmlContent html={processedHtml} className="article-body-html" />
            </div>
          </div>

          <aside className="article-aside" aria-label="מידע נלווה למאמר">
            <ArticleSidebarCards
              related={related}
              pageTitle={content.title}
              pagePath={content.path}
            />
          </aside>
        </div>

        <ArticleEndSection
          related={related}
          author={ARTICLE_AUTHOR}
          postPath={content.path}
          adjacent={adjacent}
        />
      </Container>

      <ContextualPopupRegistrar config={popupConfig} />
    </article>
  );
}

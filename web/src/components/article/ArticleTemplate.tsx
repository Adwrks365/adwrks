import { ContextualPopupRegistrar } from "@/components/popups/ContextualPopupRegistrar";
import { ArticleHtmlWithEmbeds } from "@/components/article/ArticleHtmlWithEmbeds";
import { rewriteInternalLinks } from "@/i18n/rewrite-links";
import { processContentHtml, stripJsonLdFromHtml } from "@/lib/content/html";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { ArticleBodyInteractions } from "@/components/article/ArticleBodyInteractions";
import { ArticleTopMeta } from "@/components/article/ArticleTopMeta";
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
import { resolveArticlePopupConfig } from "@/lib/popups/article-pages";
import type { ContentItem } from "@/lib/content/types";

type ArticleTemplateProps = {
  content: ContentItem;
  locale?: import("@/i18n/routing").Locale;
};

export function ArticleTemplate({ content, locale = "he" }: ArticleTemplateProps) {
  const { html: bodyHtml, headings } = prepareArticleBodyHtml(content.content);
  const localizedHtml = rewriteInternalLinks(bodyHtml, locale);
  const processedHtml = processContentHtml(stripJsonLdFromHtml(localizedHtml));
  const category = getCategoryLabel(content, locale);
  const related = getRelatedArticles(content, 4, locale);
  const adjacent = getAdjacentArticles(content, locale);
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
      />

      <Container className="article-template-body">
        <div className="article-layout">
          <div className="article-main">
            <ArticleTopMeta date={content.date} author={ARTICLE_AUTHOR} locale={locale} />
            <ArticleToc headings={headings} className="article-toc-inline" locale={locale} />

            <div className="article-template-prose">
              <ArticleBodyInteractions>
                <ArticleHtmlWithEmbeds html={processedHtml} className="article-body-html" />
              </ArticleBodyInteractions>
            </div>
          </div>

          <aside className="article-aside" aria-label={locale === "en" ? "Article sidebar" : "מידע נלווה למאמר"}>
            <ArticleSidebarCards
              related={related}
              pageTitle={content.title}
              pagePath={content.path}
              locale={locale}
            />
          </aside>
        </div>

        <ArticleEndSection
          related={related}
          author={ARTICLE_AUTHOR}
          postPath={content.path}
          adjacent={adjacent}
          locale={locale}
        />
      </Container>

      <ContextualPopupRegistrar config={popupConfig} />
    </article>
  );
}

import { ArticleCard } from "@/components/ui/ArticleCard";
import { BlogCategoryFilters } from "@/components/blog/BlogCategoryFilters";
import { PageHero } from "@/components/ui/PageHero";
import { Pagination } from "@/components/ui/Pagination";
import { Section } from "@/components/ui/Section";
import type { Locale } from "@/i18n/routing";
import type { ContentItem } from "@/lib/content/types";
import { POSTS_PER_PAGE } from "@/lib/content/loader";

type BlogPageProps = {
  posts: ContentItem[];
  page: number;
  introHtml: string;
  locale?: Locale;
};

export function BlogPage({ posts, page, introHtml, locale = "he" }: BlogPageProps) {
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const start = (page - 1) * POSTS_PER_PAGE;
  const pagePosts = posts.slice(start, start + POSTS_PER_PAGE);
  const blogPath = locale === "en" ? "/en/blog/" : "/blog/";

  return (
    <div className="content-page-shell blog-page">
      <PageHero
        variant="centered"
        eyebrow={locale === "en" ? "Our blog" : "הבלוג שלנו"}
        title={locale === "en" ? "News & professional insights" : "חדשות ומידע מקצועי"}
        subtitle={
          locale === "en"
            ? "News, updates, and expert content from our team."
            : "כאן בבלוג שלנו, תמצאו חדשות, עדכונים, ומידע מקצועי שנוצר על ידי צוות המומחים שלנו."
        }
        compact
      />

      <Section tone="muted" className="blog-page-section">
        <BlogCategoryFilters activePath={blogPath} locale={locale} />

        <p className="blog-post-count">
          {posts.length} {locale === "en" ? "articles" : "מאמרים"}
        </p>

        {introHtml && (
          <div
            className="rich-text prose-content mx-auto mb-8 max-w-3xl text-center"
            dangerouslySetInnerHTML={{ __html: introHtml }}
          />
        )}

        <div className="article-grid">
          {pagePosts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          getHref={(p) => (p === 1 ? blogPath : `${blogPath}page/${p}/`)}
          locale={locale}
        />
      </Section>
    </div>
  );
}

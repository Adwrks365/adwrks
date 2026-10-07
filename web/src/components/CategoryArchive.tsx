import { ArticleCard } from "@/components/ui/ArticleCard";
import { BlogCategoryFilters } from "@/components/blog/BlogCategoryFilters";
import { PageHero } from "@/components/ui/PageHero";
import { Pagination } from "@/components/ui/Pagination";
import { Section } from "@/components/ui/Section";
import type { Locale } from "@/i18n/routing";
import { formatExcerpt } from "@/lib/content/excerpt";
import type { CategoryItem, ContentItem } from "@/lib/content/types";
import { POSTS_PER_PAGE } from "@/lib/content/loader";

type CategoryArchiveProps = {
  category: CategoryItem;
  posts: ContentItem[];
  page: number;
  locale?: Locale;
};

export function CategoryArchive({ category, posts, page, locale = "he" }: CategoryArchiveProps) {
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const start = (page - 1) * POSTS_PER_PAGE;
  const pagePosts = posts.slice(start, start + POSTS_PER_PAGE);

  const subtitle = category.description
    ? formatExcerpt(category.description, 200)
    : undefined;

  return (
    <div className="content-page-shell archive-page">
      <PageHero
        variant="centered"
        eyebrow={locale === "en" ? "Category" : "קטגוריה"}
        title={category.title}
        subtitle={subtitle}
        compact
      />

      <Section tone="muted" className="blog-page-section">
        <BlogCategoryFilters activePath={category.path} locale={locale} />
        <p className="blog-post-count">
          {posts.length} {locale === "en" ? "articles in category" : "מאמרים בקטגוריה"}
        </p>
        <div className="article-grid">
          {pagePosts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          getHref={(p) => (p === 1 ? category.path : `${category.path}page/${p}/`)}
          locale={locale}
        />
      </Section>
    </div>
  );
}

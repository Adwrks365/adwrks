import { ArticleCard } from "@/components/ui/ArticleCard";
import { BlogCategoryFilters } from "@/components/blog/BlogCategoryFilters";
import { PageHero } from "@/components/ui/PageHero";
import { Pagination } from "@/components/ui/Pagination";
import { Section } from "@/components/ui/Section";
import type { ContentItem } from "@/lib/content/types";
import { POSTS_PER_PAGE } from "@/lib/content/loader";

type BlogPageProps = {
  posts: ContentItem[];
  page: number;
  introHtml: string;
};

export function BlogPage({ posts, page, introHtml }: BlogPageProps) {
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const start = (page - 1) * POSTS_PER_PAGE;
  const pagePosts = posts.slice(start, start + POSTS_PER_PAGE);

  return (
    <div className="content-page-shell blog-page">
      <PageHero
        variant="centered"
        eyebrow="הבלוג שלנו"
        title="חדשות ומידע מקצועי"
        subtitle="כאן בבלוג שלנו, תמצאו חדשות, עדכונים, ומידע מקצועי שנוצר על ידי צוות המומחים שלנו."
        compact
      />

      <Section tone="muted" className="blog-page-section">
        <BlogCategoryFilters />

        <p className="blog-post-count">
          {posts.length} מאמרים
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
          getHref={(p) => (p === 1 ? "/blog/" : `/blog/page/${p}/`)}
          ariaLabel="עימוד בלוג"
        />
      </Section>
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryArchive } from "@/components/CategoryArchive";
import { ContentPage } from "@/components/ContentPage";
import { BlogPage } from "@/components/pages/BlogPage";
import { HomePage } from "@/components/home/HomePage";
import { JsonLd } from "@/components/JsonLd";
import { extractJsonLdFromHtml } from "@/lib/content/html";
import {
  getAllPosts,
  getAllStaticParams,
  getCategories,
  getPostsForCategory,
  getSeoByPath,
  POSTS_PER_PAGE,
  resolveRoute,
} from "@/lib/content/loader";
import { buildPageMetadata } from "@/lib/content/metadata";
import { pathFromSlugSegments } from "@/lib/content/paths";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateStaticParams() {
  return getAllStaticParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pathKey = pathFromSlugSegments(slug);
  const resolved = resolveRoute(pathKey);

  if (resolved.blogArchive) {
    const pagePath =
      resolved.blogArchive.page === 1 ? "/blog/" : `/blog/page/${resolved.blogArchive.page}/`;
    return buildPageMetadata(
      pagePath,
      `בלוג${resolved.blogArchive.page > 1 ? ` – עמוד ${resolved.blogArchive.page}` : ""}`,
    );
  }

  if (resolved.categoryArchive) {
    const { category, page } = resolved.categoryArchive;
    const pagePath = page === 1 ? category.path : `${category.path}page/${page}/`;
    return buildPageMetadata(pagePath, `${category.title}${page > 1 ? ` – עמוד ${page}` : ""}`);
  }

  if (resolved.content) {
    return buildPageMetadata(pathKey, resolved.content.title);
  }

  return buildPageMetadata(pathKey);
}

export default async function CatchAllPage({ params }: PageProps) {
  const { slug } = await params;
  const pathKey = pathFromSlugSegments(slug);
  const resolved = resolveRoute(pathKey);

  if (resolved.blogArchive) {
    const posts = getAllPosts();
    const { page } = resolved.blogArchive;
    const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
    if (page < 1 || page > totalPages) notFound();

    const pagePath = page === 1 ? "/blog/" : `/blog/page/${page}/`;
    const seo = getSeoByPath(pagePath);
    const jsonLd = seo?.jsonLd ?? [];

    return (
      <>
        {jsonLd.length > 0 && <JsonLd data={jsonLd} />}
        <BlogPage posts={posts} page={page} introHtml="" />
      </>
    );
  }

  if (resolved.categoryArchive) {
    const { category, posts, page } = resolved.categoryArchive;
    const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
    if (page < 1 || page > totalPages) notFound();

    const seo = getSeoByPath(page === 1 ? category.path : `${category.path}page/${page}/`);
    const jsonLd = seo?.jsonLd ?? [];

    return (
      <>
        {jsonLd.length > 0 && <JsonLd data={jsonLd} />}
        <CategoryArchive category={category} posts={posts} page={page} />
      </>
    );
  }

  if (pathKey === "/") {
    const seo = getSeoByPath("/");
    const jsonLd = seo?.jsonLd ?? [];
    return (
      <>
        {jsonLd.length > 0 && <JsonLd data={jsonLd} />}
        <HomePage />
      </>
    );
  }

  const content = resolved.content;
  if (!content) notFound();

  if (content.type === "category") {
    const category = getCategories().get(content.id);
    if (!category) notFound();
    const posts = getPostsForCategory(content.id);
    const seo = getSeoByPath(pathKey);
    const jsonLd = seo?.jsonLd ?? [];

    return (
      <>
        {jsonLd.length > 0 && <JsonLd data={jsonLd} />}
        <CategoryArchive category={category} posts={posts} page={1} />
      </>
    );
  }

  const seo = getSeoByPath(pathKey);
  const htmlJsonLd =
    pathKey === "/מחירון-שיווק-דיגיטלי/" || pathKey === "/about-us/"
      ? []
      : extractJsonLdFromHtml(content.content);
  const jsonLd = [...(seo?.jsonLd ?? []), ...htmlJsonLd];

  return (
    <>
      {jsonLd.length > 0 && <JsonLd data={jsonLd} />}
      <ContentPage content={content} />
    </>
  );
}

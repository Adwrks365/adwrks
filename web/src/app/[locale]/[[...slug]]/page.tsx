import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { CategoryArchive } from "@/components/CategoryArchive";
import { ContentPage } from "@/components/ContentPage";
import { BlogPage } from "@/components/pages/BlogPage";
import { HomePage } from "@/components/home/HomePage";
import { JsonLd } from "@/components/JsonLd";
import { pathKeyFromLocaleSegments } from "@/i18n/locale";
import { routing, type Locale } from "@/i18n/routing";
import { extractJsonLdFromHtml } from "@/lib/content/html";
import {
  getAllPosts,
  getAllLocaleStaticParams,
  getCategories,
  getPostsForCategory,
  getSeoByPath,
  POSTS_PER_PAGE,
  resolveRoute,
} from "@/lib/content/loader";
import { buildPageMetadata } from "@/lib/content/metadata";
import { mergePageJsonLd } from "@/lib/content/schema";
import { isHomePath } from "@/lib/i18n/composer-path";

type PageProps = {
  params: Promise<{ locale: string; slug?: string[] }>;
};

export function generateStaticParams() {
  return getAllLocaleStaticParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const validLocale = locale as Locale;
  const pathKey = pathKeyFromLocaleSegments(validLocale, slug);
  const resolved = resolveRoute(pathKey, validLocale);
  const blogPath = validLocale === "en" ? "/en/blog/" : "/blog/";

  if (resolved.blogArchive) {
    const pagePath =
      resolved.blogArchive.page === 1
        ? blogPath
        : `${blogPath}page/${resolved.blogArchive.page}/`;
    const suffix =
      validLocale === "en"
        ? resolved.blogArchive.page > 1
          ? ` – Page ${resolved.blogArchive.page}`
          : ""
        : resolved.blogArchive.page > 1
          ? ` – עמוד ${resolved.blogArchive.page}`
          : "";
    return buildPageMetadata(
      pagePath,
      `${validLocale === "en" ? "Blog" : "בלוג"}${suffix}`,
      validLocale,
    );
  }

  if (resolved.categoryArchive) {
    const { category, page } = resolved.categoryArchive;
    const pagePath = page === 1 ? category.path : `${category.path}page/${page}/`;
    const suffix =
      page > 1 ? (validLocale === "en" ? ` – Page ${page}` : ` – עמוד ${page}`) : "";
    return buildPageMetadata(pagePath, `${category.title}${suffix}`, validLocale);
  }

  if (resolved.content) {
    return buildPageMetadata(pathKey, resolved.content.title, validLocale);
  }

  return buildPageMetadata(pathKey, undefined, validLocale);
}

export default async function CatchAllPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!routing.locales.includes(locale as Locale)) notFound();

  const validLocale = locale as Locale;
  setRequestLocale(validLocale);

  const pathKey = pathKeyFromLocaleSegments(validLocale, slug);
  const resolved = resolveRoute(pathKey, validLocale);
  const blogPath = validLocale === "en" ? "/en/blog/" : "/blog/";

  if (resolved.blogArchive) {
    const posts = getAllPosts(validLocale);
    const { page } = resolved.blogArchive;
    const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
    if (page < 1 || page > totalPages) notFound();

    const pagePath = page === 1 ? blogPath : `${blogPath}page/${page}/`;
    const seo = getSeoByPath(pagePath, validLocale);
    const jsonLd = mergePageJsonLd({
      locale: validLocale,
      path: pagePath,
      title: validLocale === "en" ? "Blog" : "בלוג",
      seoNodes: seo?.jsonLd ?? [],
    });

    return (
      <>
        {jsonLd.length > 0 && <JsonLd data={jsonLd} />}
        <BlogPage posts={posts} page={page} introHtml="" locale={validLocale} />
      </>
    );
  }

  if (resolved.categoryArchive) {
    const { category, posts, page } = resolved.categoryArchive;
    const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
    if (page < 1 || page > totalPages) notFound();

    const archivePath = page === 1 ? category.path : `${category.path}page/${page}/`;
    const seo = getSeoByPath(archivePath, validLocale);
    const jsonLd = mergePageJsonLd({
      locale: validLocale,
      path: archivePath,
      title: category.title,
      seoNodes: seo?.jsonLd ?? [],
    });

    return (
      <>
        {jsonLd.length > 0 && <JsonLd data={jsonLd} />}
        <CategoryArchive category={category} posts={posts} page={page} locale={validLocale} />
      </>
    );
  }

  if (isHomePath(pathKey)) {
    const homePath = validLocale === "en" ? "/en/" : "/";
    const seo = getSeoByPath(homePath, validLocale);
    const jsonLd = mergePageJsonLd({
      locale: validLocale,
      path: homePath,
      title: validLocale === "en" ? "Home" : "דף הבית",
      seoNodes: seo?.jsonLd ?? [],
    });
    return (
      <>
        {jsonLd.length > 0 && <JsonLd data={jsonLd} />}
        <HomePage locale={validLocale} />
      </>
    );
  }

  const content = resolved.content;
  if (!content) notFound();

  if (content.type === "category") {
    const category = getCategories(validLocale).get(content.id);
    if (!category) notFound();
    const posts = getPostsForCategory(category.id, validLocale);
    const seo = getSeoByPath(pathKey, validLocale);
    const jsonLd = mergePageJsonLd({
      locale: validLocale,
      path: pathKey,
      title: category.title,
      seoNodes: seo?.jsonLd ?? [],
    });

    return (
      <>
        {jsonLd.length > 0 && <JsonLd data={jsonLd} />}
        <CategoryArchive category={category} posts={posts} page={1} locale={validLocale} />
      </>
    );
  }

  const seo = getSeoByPath(pathKey, validLocale);
  const htmlJsonLd =
    pathKey === "/מחירון-שיווק-דיגיטלי/" ||
    pathKey === "/en/digital-marketing-pricing/" ||
    pathKey === "/about-us/" ||
    pathKey === "/en/about-us/"
      ? []
      : extractJsonLdFromHtml(content.content);
  const jsonLd = mergePageJsonLd({
    locale: validLocale,
    path: pathKey,
    title: content.title,
    seoNodes: seo?.jsonLd ?? [],
    htmlNodes: htmlJsonLd,
    isBlogPost: content.type === "post",
  });

  return (
    <>
      {jsonLd.length > 0 && <JsonLd data={jsonLd} />}
      <ContentPage content={content} locale={validLocale} />
    </>
  );
}

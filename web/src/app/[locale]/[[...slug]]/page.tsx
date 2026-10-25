import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { CategoryArchive } from "@/components/CategoryArchive";
import { ContentPage } from "@/components/ContentPage";
import { BlogPage } from "@/components/pages/BlogPage";
import { HomePage } from "@/components/home/HomePage";
import { JsonLd } from "@/components/JsonLd";
import { LocationLandingPage } from "@/components/locations/LocationLandingPage";
import { LocationsHubPage } from "@/components/locations/LocationsHubPage";
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
import { buildPageMetadata, withHomeHeroLcpPreload } from "@/lib/content/metadata";
import { getHomepageData } from "@/lib/homepage";
import { buildEnSchemaContext } from "@/lib/content/en-schema-localize";
import { resolvePageSeoLabels } from "@/lib/content/page-seo-labels";
import { mergePageJsonLd } from "@/lib/content/schema";
import { isHomePath } from "@/lib/i18n/composer-path";
import { skipHtmlJsonLdExtraction } from "@/lib/i18n/composer-html-jsonld";
import { buildAreaMetadata } from "@/lib/pages/locations/metadata";
import { getHubView, getLocationView, locationStaticParams } from "@/lib/pages/locations/registry";
import { buildHubJsonLd, buildLocationJsonLd } from "@/lib/pages/locations/schema";

type PageProps = {
  params: Promise<{ locale: string; slug?: string[] }>;
};

function enSchemaContext(
  pathKey: string,
  locale: Locale,
  fallbackTitle?: string,
  fallbackDescription?: string,
  categoryTitles?: string[],
) {
  const labels = resolvePageSeoLabels(pathKey, locale, fallbackTitle, fallbackDescription);
  return locale === "en" ? buildEnSchemaContext(labels, categoryTitles) : labels;
}

/** ISR: revalidate content shell hourly without full SSR on every request */
export const revalidate = 3600;

export function generateStaticParams() {
  const base = getAllLocaleStaticParams();
  const seen = new Set(base.map((entry) => `${entry.locale}:${(entry.slug ?? []).join("/")}`));
  const extra = locationStaticParams().filter(
    (entry) => !seen.has(`${entry.locale}:${entry.slug.join("/")}`),
  );
  return [...base, ...extra];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const validLocale = locale as Locale;
  const pathKey = pathKeyFromLocaleSegments(validLocale, slug);

  if (isHomePath(pathKey)) {
    const homePath = validLocale === "en" ? "/en/" : "/";
    const hp = getHomepageData(validLocale);
    return withHomeHeroLcpPreload(
      buildPageMetadata(homePath, undefined, validLocale),
      hp.HOMEPAGE_IMAGES.heroPhotoLcp,
    );
  }

  const locationView = getLocationView(pathKey, validLocale);
  if (locationView) {
    return buildAreaMetadata(
      locationView.path,
      locationView.copy.seoTitle,
      locationView.copy.seoDescription,
      validLocale,
    );
  }
  const hubView = getHubView(pathKey, validLocale);
  if (hubView) {
    return buildAreaMetadata(hubView.path, hubView.copy.seoTitle, hubView.copy.seoDescription, validLocale);
  }

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
    const blogDesc =
      validLocale === "en"
        ? "Expert articles on digital marketing, SEO, Google Ads, and growth — written by the Adwrks 365 team."
        : "מאמרים מקצועיים על שיווק דיגיטלי, SEO, Google Ads וצמיחה — מעטפת Adwrks 365.";
    return buildPageMetadata(
      pagePath,
      `${validLocale === "en" ? "Blog" : "בלוג"}${suffix}`,
      validLocale,
      blogDesc,
    );
  }

  if (resolved.categoryArchive) {
    const { category, page } = resolved.categoryArchive;
    const pagePath = page === 1 ? category.path : `${category.path}page/${page}/`;
    const suffix =
      page > 1 ? (validLocale === "en" ? ` – Page ${page}` : ` – עמוד ${page}`) : "";
    return buildPageMetadata(
      pagePath,
      `${category.title}${suffix}`,
      validLocale,
      category.description,
    );
  }

  if (resolved.content) {
    const metaDesc =
      resolved.content.excerpt?.trim() ||
      (resolved.content.type === "category" ? resolved.content.content : undefined);
    return buildPageMetadata(pathKey, resolved.content.title, validLocale, metaDesc);
  }

  return buildPageMetadata(pathKey, undefined, validLocale);
}

export default async function CatchAllPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!routing.locales.includes(locale as Locale)) notFound();

  const validLocale = locale as Locale;
  setRequestLocale(validLocale);

  const pathKey = pathKeyFromLocaleSegments(validLocale, slug);
  const locationView = getLocationView(pathKey, validLocale);
  if (locationView) {
    return (
      <>
        <JsonLd data={buildLocationJsonLd(locationView, validLocale)} />
        <LocationLandingPage view={locationView} locale={validLocale} />
      </>
    );
  }
  const hubView = getHubView(pathKey, validLocale);
  if (hubView) {
    return (
      <>
        <JsonLd data={buildHubJsonLd(hubView, validLocale)} />
        <LocationsHubPage view={hubView} locale={validLocale} />
      </>
    );
  }

  const resolved = resolveRoute(pathKey, validLocale);
  const blogPath = validLocale === "en" ? "/en/blog/" : "/blog/";

  if (resolved.blogArchive) {
    const posts = getAllPosts(validLocale);
    const { page } = resolved.blogArchive;
    const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
    if (page < 1 || page > totalPages) notFound();

    const pagePath = page === 1 ? blogPath : `${blogPath}page/${page}/`;
    const seo = getSeoByPath(pagePath, validLocale);
    const seoLabels = enSchemaContext(
      pagePath,
      validLocale,
      validLocale === "en" ? "Blog" : "בלוג",
    );
    const jsonLd = mergePageJsonLd({
      locale: validLocale,
      path: pagePath,
      title: seoLabels.schemaTitle,
      seoLabels,
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
    const seoLabels = enSchemaContext(
      archivePath,
      validLocale,
      category.title,
      category.description,
      [category.title],
    );
    const jsonLd = mergePageJsonLd({
      locale: validLocale,
      path: archivePath,
      title: seoLabels.schemaTitle,
      seoLabels,
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
    const seoLabels = enSchemaContext(
      homePath,
      validLocale,
      validLocale === "en" ? "Home" : "דף הבית",
    );
    const jsonLd = mergePageJsonLd({
      locale: validLocale,
      path: homePath,
      title: seoLabels.schemaTitle,
      seoLabels,
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
    const seoLabels = enSchemaContext(
      pathKey,
      validLocale,
      category.title,
      category.description,
      [category.title],
    );
    const jsonLd = mergePageJsonLd({
      locale: validLocale,
      path: pathKey,
      title: seoLabels.schemaTitle,
      seoLabels,
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
  const htmlJsonLd = skipHtmlJsonLdExtraction(pathKey, validLocale)
    ? []
    : extractJsonLdFromHtml(content.content);
  const metaDesc = content.excerpt?.trim();
  const categoryTitles =
    content.categoryIds
      ?.map((id) => getCategories(validLocale).get(id)?.title)
      .filter((t): t is string => Boolean(t)) ?? [];
  const seoLabels = enSchemaContext(
    pathKey,
    validLocale,
    content.title,
    metaDesc,
    categoryTitles,
  );
  const jsonLd = mergePageJsonLd({
    locale: validLocale,
    path: pathKey,
    title: seoLabels.schemaTitle,
    seoLabels,
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

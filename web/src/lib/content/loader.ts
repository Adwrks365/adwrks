import fs from "fs";
import path from "path";
import type { Locale } from "@/i18n/routing";
import type { CategoryItem, ContentItem, SeoRecord } from "./types";
import { getFeaturedImageAlt, getFeaturedImageUrl } from "@/lib/media";
import {
  decodeHtmlEntities,
  normalizePath,
  parsePaginationPath,
  pathFromLink,
  slugSegmentsFromPath,
} from "./paths";
import { contentDataDirForLocale, CONTENT_DATA_DIR, CONTENT_EN_DATA_DIR } from "./data-dir";

type WpPage = {
  id: number;
  slug: string;
  link: string;
  title: string;
  content: string;
  excerpt: string;
  date?: string;
  modified?: string;
  featuredMedia?: number;
  categories?: number[];
  tags?: number[];
};

type WpCategory = {
  id: number;
  slug: string;
  link: string;
  title: string;
  description: string;
  count: number;
  parent: number;
};

type LocaleCache = {
  routes: Map<string, ContentItem>;
  categories: Map<number, CategoryItem>;
  seoByPath: Map<string, SeoRecord>;
  sitemapUrls: string[];
};

const cache = new Map<Locale, LocaleCache>();

function readJson<T>(locale: Locale, filename: string): T {
  const dir = contentDataDirForLocale(locale);
  const filePath = path.join(dir, filename);
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function getCache(locale: Locale): LocaleCache {
  const existing = cache.get(locale);
  if (existing) return existing;

  const dataDir = contentDataDirForLocale(locale);
  if (!fs.existsSync(dataDir)) {
    throw new Error(`Missing content directory for locale "${locale}": ${dataDir}`);
  }

  const categoriesRaw = readJson<WpCategory[]>(locale, "categories.json");
  const categories = new Map(
    categoriesRaw.map((c) => [
      c.id,
      {
        id: c.id,
        slug: c.slug,
        path: pathFromLink(c.link),
        title: decodeHtmlEntities(c.title),
        description: c.description,
        count: c.count,
        parent: c.parent,
      },
    ]),
  );

  const routes = new Map<string, ContentItem>();
  const pages = readJson<WpPage[]>(locale, "pages.json");
  const posts = readJson<WpPage[]>(locale, "posts.json");

  function withFeaturedMedia(item: ContentItem, mediaId?: number): ContentItem {
    return {
      ...item,
      featuredMedia: mediaId,
      featuredImageUrl: getFeaturedImageUrl(mediaId),
      featuredImageAlt: getFeaturedImageAlt(mediaId),
    };
  }

  for (const page of pages) {
    const routePath = pathFromLink(page.link);
    routes.set(
      routePath,
      withFeaturedMedia(
        {
          type: "page",
          id: page.id,
          slug: page.slug,
          path: routePath,
          title: decodeHtmlEntities(page.title),
          content: page.content || "",
          excerpt: page.excerpt || "",
          date: page.date,
          modified: page.modified,
        },
        page.featuredMedia,
      ),
    );
  }

  for (const post of posts) {
    const routePath = pathFromLink(post.link);
    routes.set(
      routePath,
      withFeaturedMedia(
        {
          type: "post",
          id: post.id,
          slug: post.slug,
          path: routePath,
          title: decodeHtmlEntities(post.title),
          content: post.content || "",
          excerpt: post.excerpt || "",
          date: post.date,
          modified: post.modified,
          categoryIds: post.categories,
          tagIds: post.tags,
        },
        post.featuredMedia,
      ),
    );
  }

  for (const cat of categories.values()) {
    routes.set(cat.path, {
      type: "category",
      id: cat.id,
      slug: cat.slug,
      path: cat.path,
      title: cat.title,
      content: cat.description,
      excerpt: cat.description,
    });
  }

  const seoRaw = readJson<SeoRecord[]>(locale, "seo.json");
  const seoByPath = new Map<string, SeoRecord>();
  for (const record of seoRaw) {
    seoByPath.set(normalizePath(record.url), record);
  }

  const urls = readJson<{ sitemapUrls: string[] }>(locale, "urls.json");
  const sitemapUrls = urls.sitemapUrls.map((u) => normalizePath(u));

  const localeCache: LocaleCache = { routes, categories, seoByPath, sitemapUrls };
  cache.set(locale, localeCache);
  return localeCache;
}

export function getCategories(locale: Locale = "he"): Map<number, CategoryItem> {
  return getCache(locale).categories;
}

export function getRoutes(locale: Locale = "he"): Map<string, ContentItem> {
  return getCache(locale).routes;
}

export function getContentByPath(pathKey: string, locale: Locale = "he"): ContentItem | null {
  return getRoutes(locale).get(normalizePath(pathKey)) ?? null;
}

export function getPostsForCategory(categoryId: number, locale: Locale = "he"): ContentItem[] {
  return [...getRoutes(locale).values()].filter(
    (r) => r.type === "post" && r.categoryIds?.includes(categoryId),
  );
}

export function getAllPosts(locale: Locale = "he"): ContentItem[] {
  return [...getRoutes(locale).values()]
    .filter((r) => r.type === "post")
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

export function getSeoByPath(pathKey: string, locale: Locale = "he"): SeoRecord | undefined {
  return getCache(locale).seoByPath.get(normalizePath(pathKey));
}

export function getSitemapUrls(locale: Locale = "he"): string[] {
  return getCache(locale).sitemapUrls;
}

export function resolveRoute(
  pathKey: string,
  locale: Locale = "he",
): {
  content: ContentItem | null;
  pagination: { basePath: string; page: number } | null;
  categoryArchive: { category: CategoryItem; posts: ContentItem[]; page: number } | null;
  blogArchive: { page: number } | null;
} {
  const normalized = normalizePath(pathKey);
  const blogPath = locale === "en" ? "/en/blog/" : "/blog/";

  if (normalized === blogPath) {
    return {
      content: getContentByPath(blogPath, locale),
      pagination: null,
      categoryArchive: null,
      blogArchive: { page: 1 },
    };
  }

  const pagination = parsePaginationPath(normalized);
  if (pagination?.basePath === blogPath) {
    return {
      content: getContentByPath(blogPath, locale),
      pagination,
      categoryArchive: null,
      blogArchive: { page: pagination.page },
    };
  }

  const direct = getContentByPath(normalized, locale);
  if (direct) {
    return { content: direct, pagination: null, categoryArchive: null, blogArchive: null };
  }

  if (pagination) {
    const cat = [...getCategories(locale).values()].find((c) => c.path === pagination.basePath);
    if (cat) {
      const posts = getPostsForCategory(cat.id, locale);
      return {
        content: null,
        pagination,
        categoryArchive: { category: cat, posts, page: pagination.page },
        blogArchive: null,
      };
    }
  }

  return { content: null, pagination: null, categoryArchive: null, blogArchive: null };
}

export const POSTS_PER_PAGE = 9;

export function getAllStaticParams(locale: Locale): { slug?: string[] }[] {
  const params: { slug?: string[] }[] = [{}];
  const homePath = locale === "en" ? "/en/" : "/";

  for (const routePath of getRoutes(locale).keys()) {
    if (routePath === homePath) continue;
    const segments = slugSegmentsFromPath(routePath);
    if (locale === "en") {
      if (segments[0] === "en") {
        params.push({ slug: segments.slice(1) });
      }
    } else if (!routePath.startsWith("/en/")) {
      params.push({ slug: segments });
    }
  }

  for (const cat of getCategories(locale).values()) {
    const posts = getPostsForCategory(cat.id, locale);
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
    for (let page = 2; page <= totalPages; page++) {
      const baseSegments = slugSegmentsFromPath(cat.path);
      const slug =
        locale === "en" && baseSegments[0] === "en"
          ? [...baseSegments.slice(1), "page", String(page)]
          : [...baseSegments, "page", String(page)];
      params.push({ slug });
    }
  }

  const allPosts = getAllPosts(locale);
  const blogPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const blogBase = locale === "en" ? ["blog"] : ["blog"];
  for (let page = 2; page <= blogPages; page++) {
    params.push({ slug: [...blogBase, "page", String(page)] });
  }

  return params;
}

export function getAllLocaleStaticParams(): { locale: Locale; slug?: string[] }[] {
  const locales: Locale[] = ["he", "en"];
  return locales.flatMap((locale) =>
    getAllStaticParams(locale).map((p) => ({ locale, ...p })),
  );
}

/** Legacy export for scripts referencing Hebrew data dir */
export { CONTENT_DATA_DIR, CONTENT_EN_DATA_DIR };

import fs from "fs";
import path from "path";
import type { CategoryItem, ContentItem, SeoRecord } from "./types";
import { getFeaturedImageAlt, getFeaturedImageUrl } from "@/lib/media";
import {
  decodeHtmlEntities,
  normalizePath,
  parsePaginationPath,
  pathFromLink,
  slugSegmentsFromPath,
} from "./paths";

const AUDIT_DIR = path.join(process.cwd(), "..", "migration-audit");

function readJson<T>(filename: string): T {
  const filePath = path.join(AUDIT_DIR, filename);
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

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

let _routes: Map<string, ContentItem> | null = null;
let _categories: Map<number, CategoryItem> | null = null;
let _seoByPath: Map<string, SeoRecord> | null = null;
let _sitemapUrls: string[] | null = null;

export function getCategories(): Map<number, CategoryItem> {
  if (_categories) return _categories;
  const raw = readJson<WpCategory[]>("categories.json");
  _categories = new Map(
    raw.map((c) => [
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
  return _categories;
}

function buildRoutes(): Map<string, ContentItem> {
  const routes = new Map<string, ContentItem>();
  const pages = readJson<WpPage[]>("pages.json");
  const posts = readJson<WpPage[]>("posts.json");

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

  for (const cat of getCategories().values()) {
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

  return routes;
}

export function getRoutes(): Map<string, ContentItem> {
  if (!_routes) _routes = buildRoutes();
  return _routes;
}

export function getContentByPath(pathKey: string): ContentItem | null {
  return getRoutes().get(normalizePath(pathKey)) ?? null;
}

export function getPostsForCategory(categoryId: number): ContentItem[] {
  return [...getRoutes().values()].filter(
    (r) => r.type === "post" && r.categoryIds?.includes(categoryId),
  );
}

export function getAllPosts(): ContentItem[] {
  return [...getRoutes().values()]
    .filter((r) => r.type === "post")
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

export function getSeoByPath(pathKey: string): SeoRecord | undefined {
  if (!_seoByPath) {
    const seo = readJson<SeoRecord[]>("seo.json");
    _seoByPath = new Map();
    for (const record of seo) {
      _seoByPath.set(normalizePath(record.url), record);
    }
  }
  return _seoByPath.get(normalizePath(pathKey));
}

export function getSitemapUrls(): string[] {
  if (!_sitemapUrls) {
    const urls = readJson<{ sitemapUrls: string[] }>("urls.json");
    _sitemapUrls = urls.sitemapUrls.map((u) => normalizePath(u));
  }
  return _sitemapUrls;
}

export function resolveRoute(pathKey: string): {
  content: ContentItem | null;
  pagination: { basePath: string; page: number } | null;
  categoryArchive: { category: CategoryItem; posts: ContentItem[]; page: number } | null;
  blogArchive: { page: number } | null;
} {
  const normalized = normalizePath(pathKey);

  if (normalized === "/blog/") {
    return {
      content: getContentByPath("/blog/"),
      pagination: null,
      categoryArchive: null,
      blogArchive: { page: 1 },
    };
  }

  const pagination = parsePaginationPath(normalized);
  if (pagination?.basePath === "/blog/") {
    return {
      content: getContentByPath("/blog/"),
      pagination,
      categoryArchive: null,
      blogArchive: { page: pagination.page },
    };
  }

  const direct = getContentByPath(normalized);
  if (direct) {
    return { content: direct, pagination: null, categoryArchive: null, blogArchive: null };
  }

  if (pagination) {
    const cat = [...getCategories().values()].find((c) => c.path === pagination.basePath);
    if (cat) {
      const posts = getPostsForCategory(cat.id);
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

export const POSTS_PER_PAGE = 10;

/** All static route params for optional catch-all [[...slug]]. */
export function getAllStaticParams(): { slug?: string[] }[] {
  const params: { slug?: string[] }[] = [{}];

  for (const routePath of getRoutes().keys()) {
    if (routePath === "/") continue;
    params.push({ slug: slugSegmentsFromPath(routePath) });
  }

  for (const cat of getCategories().values()) {
    const posts = getPostsForCategory(cat.id);
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
    for (let page = 2; page <= totalPages; page++) {
      params.push({
        slug: [...slugSegmentsFromPath(cat.path), "page", String(page)],
      });
    }
  }

  const allPosts = getAllPosts();
  const blogPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  for (let page = 2; page <= blogPages; page++) {
    params.push({ slug: ["blog", "page", String(page)] });
  }

  return params;
}

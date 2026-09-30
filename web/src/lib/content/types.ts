export type ContentType = "page" | "post" | "category" | "category-page";

export type ContentItem = {
  type: ContentType;
  id: number;
  slug: string;
  path: string;
  title: string;
  content: string;
  excerpt: string;
  date?: string;
  modified?: string;
  featuredMedia?: number;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  categoryIds?: number[];
  tagIds?: number[];
};

export type SeoRecord = {
  url: string;
  httpStatus?: number;
  title?: string | null;
  metaDescription?: string | null;
  robots?: string | null;
  canonical?: string | null;
  h1?: string[];
  h2?: string[];
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  jsonLd?: unknown[];
  internalLinks?: string[];
  images?: { src: string; alt: string }[];
};

export type CategoryItem = {
  id: number;
  slug: string;
  path: string;
  title: string;
  description: string;
  count: number;
  parent: number;
};

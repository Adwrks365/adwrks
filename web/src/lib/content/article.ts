import { decodeHtmlEntities } from "./paths";
import { getAllPosts, getCategories, getPostsForCategory } from "./loader";
import type { ContentItem } from "./types";

export type ArticleHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type ArticleAuthor = {
  name: string;
  role?: string;
  bio: string;
  avatarUrl?: string;
};

/** Verified author presentation — no invented biography. */
export const ARTICLE_AUTHOR: ArticleAuthor = {
  name: "Adwrks 365",
  role: "מומחי שיווק דיגיטלי",
  bio: "Adwrks 365 מלווה עסקים וחברות מאז 2018 בבניית נוכחות דיגיטלית, קידום אתרים וניהול קמפיינים. הצוות עוסק בקידום אתרים, פרסום ממומן, ניהול רשתות חברתיות, בניית אתרים ואסטרטגיה דיגיטלית, ועובד עם פלטפורמות כמו Google ו-Meta.",
  avatarUrl: "/wp-content/uploads/cropped-logo-black-trans-140x47.webp",
};

function slugifyHeading(text: string): string {
  const base = text
    .replace(/<[^>]+>/g, "")
    .trim()
    .slice(0, 80)
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
  return base || "section";
}

function findBalancedDivClose(html: string, openIndex: number): number {
  let depth = 1;
  let i = openIndex + 4;

  while (i < html.length && depth > 0) {
    const nextOpen = html.indexOf("<div", i);
    const nextClose = html.indexOf("</div>", i);
    if (nextClose === -1) return -1;

    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      i = nextOpen + 4;
    } else {
      depth--;
      i = nextClose + 6;
      if (depth === 0) return i;
    }
  }

  return -1;
}

/** Remove legacy Elementor sidebar columns (inner col-33) from article HTML. */
export function stripEmbeddedArticleSidebar(html: string): string {
  let result = html;
  const marker = "elementor-inner-column elementor-col-33";
  let safety = 0;

  while (result.includes(marker) && safety < 50) {
    safety++;
    const idx = result.indexOf(marker);
    const colStart = result.lastIndexOf("<div", idx);
    if (colStart === -1) break;
    const colEnd = findBalancedDivClose(result, colStart);
    if (colEnd === -1) break;
    result = result.slice(0, colStart) + result.slice(colEnd);
  }

  return result
    .replace(/<div[^>]*class="[^"]*trustindex[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<img[^>]+graph\.facebook\.com[^>]*>/gi, "")
    .replace(/<iframe[^>]+trustindex[^>]*>[\s\S]*?<\/iframe>/gi, "");
}

/** Extract H2/H3 headings for table of contents. */
export function extractArticleHeadings(html: string): ArticleHeading[] {
  const headings: ArticleHeading[] = [];
  const seen = new Map<string, number>();
  const re = /<(h[23])[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;

  while ((match = re.exec(html)) !== null) {
    const level = match[1].toLowerCase() === "h2" ? 2 : 3;
    const text = decodeHtmlEntities(match[2].replace(/<[^>]+>/g, "").trim());
    if (!text || text.length < 2) continue;

    let id = slugifyHeading(text);
    const count = seen.get(id) ?? 0;
    if (count > 0) id = `${id}-${count + 1}`;
    seen.set(slugifyHeading(text), count + 1);

    headings.push({ id, text, level });
  }

  return headings;
}

/** Inject stable anchor IDs into article H2/H3 for TOC navigation. */
export function injectHeadingAnchors(html: string, headings: ArticleHeading[]): string {
  let idx = 0;
  return html.replace(/<(h[23])([^>]*)>([\s\S]*?)<\/\1>/gi, (full, tag, attrs, inner) => {
    const heading = headings[idx];
    idx++;
    if (!heading) return full;
    if (/\bid\s*=/.test(attrs)) {
      return `<${tag}${attrs}>${inner}</${tag}>`;
    }
    return `<${tag}${attrs} id="${heading.id}">${inner}</${tag}>`;
  });
}

/** Downgrade embedded H1 tags so the page hero remains the sole H1. */
export function downgradeEmbeddedH1(html: string): string {
  return html
    .replace(/<h1(\s[^>]*)?>/gi, "<h2$1>")
    .replace(/<\/h1>/gi, "</h2>");
}

export function prepareArticleBodyHtml(rawHtml: string): {
  html: string;
  headings: ArticleHeading[];
} {
  let html = stripEmbeddedArticleSidebar(rawHtml);
  html = html.replace(
    /<div class="elementor-widget-container">\s*<h1[^>]*>[\s\S]*?<\/h1>\s*<\/div>/i,
    "",
  );
  html = downgradeEmbeddedH1(html);

  const headings = extractArticleHeadings(html);
  html = injectHeadingAnchors(html, headings);
  return { html, headings };
}

/** Count embedded H1 tags in raw post HTML (before migration cleanup). */
export function countEmbeddedH1(html: string): number {
  const cleaned = stripEmbeddedArticleSidebar(html);
  return (cleaned.match(/<h1[\s>]/gi) || []).length;
}

export function getCategoryLabel(content: ContentItem): string | undefined {
  const id = content.categoryIds?.[0];
  if (!id) return undefined;
  return getCategories().get(id)?.title;
}

export function getRelatedArticles(content: ContentItem, limit = 4): ContentItem[] {
  const categoryId = content.categoryIds?.[0];
  let posts: ContentItem[];

  if (categoryId) {
    posts = getPostsForCategory(categoryId).filter((p) => p.path !== content.path);
    if (posts.length < limit) {
      const recent = getAllPosts().filter((p) => p.path !== content.path);
      const seen = new Set(posts.map((p) => p.path));
      for (const post of recent) {
        if (posts.length >= limit) break;
        if (!seen.has(post.path)) {
          posts.push(post);
          seen.add(post.path);
        }
      }
    }
  } else {
    posts = getAllPosts().filter((p) => p.path !== content.path);
  }

  return posts.slice(0, limit);
}

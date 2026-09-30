import { SITE } from "@/lib/site";

function decodePathSegments(path: string): string {
  return path
    .split("/")
    .map((segment) => {
      if (!segment) return segment;
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    })
    .join("/");
}

/** Normalize a WordPress URL or path to a canonical route key with trailing slash. */
export function normalizePath(input: string): string {
  if (!input || input === "/") return "/";

  let path = input;
  if (path.startsWith("http")) {
    try {
      path = new URL(path).pathname;
    } catch {
      return "/";
    }
  }

  if (!path.startsWith("/")) path = `/${path}`;
  path = decodePathSegments(path);
  if (!path.endsWith("/")) path = `${path}/`;

  return path;
}

export function pathFromLink(link: string): string {
  return normalizePath(link);
}

export function slugSegmentsFromPath(path: string): string[] {
  const normalized = normalizePath(path);
  if (normalized === "/") return [];
  return normalized.slice(1, -1).split("/");
}

export function pathFromSlugSegments(segments: string[] | undefined): string {
  if (!segments || segments.length === 0) return "/";
  return normalizePath(`/${segments.join("/")}`);
}

export function absoluteUrl(path: string): string {
  return `${SITE.domain}${normalizePath(path)}`;
}

/** Detect category pagination: /digital-marketing/page/2/ */
export function parsePaginationPath(path: string): {
  basePath: string;
  page: number;
} | null {
  const normalized = normalizePath(path);
  const match = normalized.match(/^(.+\/)page\/(\d+)\/$/);
  if (!match) return null;
  return { basePath: match[1], page: parseInt(match[2], 10) };
}

const NAMED_HTML_ENTITIES: Readonly<Record<string, string>> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#039;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
};

function decodeHtmlEntitiesOnce(text: string): string {
  let result = text
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      const code = parseInt(hex, 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : _;
    })
    .replace(/&#(\d+);/g, (_, num) => {
      const code = Number(num);
      return Number.isFinite(code) ? String.fromCodePoint(code) : _;
    });

  for (const [entity, char] of Object.entries(NAMED_HTML_ENTITIES)) {
    if (result.includes(entity)) {
      result = result.split(entity).join(char);
    }
  }

  return result;
}

/** Decode WordPress HTML entities, including safely normalized double-encoding. */
export function decodeHtmlEntities(text: string, maxPasses = 4): string {
  let result = text;
  for (let pass = 0; pass < maxPasses; pass++) {
    const next = decodeHtmlEntitiesOnce(result);
    if (next === result) break;
    result = next;
  }
  return result.replace(/\u00a0/g, " ");
}

/** Decode entities in HTML text nodes only — preserves tag/attribute structure. */
export function decodeHtmlTextNodes(html: string): string {
  return html
    .split(/(<[^>]+>)/g)
    .map((part) => (part.startsWith("<") ? part : decodeHtmlEntities(part)))
    .join("");
}

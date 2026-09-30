import fs from "fs";
import path from "path";
import { normalizePath } from "./paths";

export type ElementorBlock =
  | { type: "heading"; level: string; text: string }
  | { type: "text"; html: string; text: string }
  | { type: "list"; items: string[] }
  | { type: "image"; url: string; alt: string }
  | { type: "button"; text: string; url: string }
  | { type: "faq"; items: { q: string; a: string }[] };

export type ExtractedPage = {
  wordpressId: number;
  slug: string;
  path: string;
  title: string;
  blocks: ElementorBlock[];
};

export type PageSection = {
  label?: string;
  title?: string;
  paragraphs: string[];
  htmlParagraphs: string[];
  images: { url: string; alt: string }[];
  lists: string[][];
  faq: { q: string; a: string }[];
  buttons: { text: string; url: string }[];
};

const EXTRACTED_DIR = path.join(process.cwd(), "src", "lib", "pages", "extracted");

let _index: Record<string, string> | null = null;

function loadIndex(): Record<string, string> {
  if (_index) return _index;
  const indexPath = path.join(EXTRACTED_DIR, "index.json");
  _index = JSON.parse(fs.readFileSync(indexPath, "utf8")) as Record<string, string>;
  return _index;
}

function pathLookupKeys(pathKey: string): string[] {
  const normalized = normalizePath(pathKey);
  const keys = new Set<string>([normalized]);
  const encoded = normalized
    .split("/")
    .map((segment) => (segment ? encodeURIComponent(segment) : segment))
    .join("/");
  keys.add(encoded.endsWith("/") ? encoded : `${encoded}/`);
  return [...keys];
}

export function getExtractedPage(pathKey: string): ExtractedPage | null {
  const index = loadIndex();
  let filename: string | undefined;
  for (const key of pathLookupKeys(pathKey)) {
    if (index[key]) {
      filename = index[key];
      break;
    }
  }
  if (!filename) return null;
  const filePath = path.join(EXTRACTED_DIR, filename);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as ExtractedPage;
}

export function isShortcodeText(text: string): boolean {
  return /^\[[\w\-]+[^\]]*\]$/.test(text.trim());
}

export function getHeroFromBlocks(blocks: ElementorBlock[]): {
  title: string;
  subtitle?: string;
  intro?: string;
  introHtml?: string;
  image?: { url: string; alt: string };
  buttons: { text: string; url: string }[];
} {
  const h1 = blocks.find((b) => b.type === "heading" && b.level === "h1");
  const title = h1?.type === "heading" ? h1.text : "";
  const afterH1 = blocks.slice(blocks.indexOf(h1!) + 1);

  let subtitle: string | undefined;
  let intro: string | undefined;
  let introHtml: string | undefined;
  const buttons: { text: string; url: string }[] = [];
  let image: { url: string; alt: string } | undefined;

  for (const block of afterH1) {
    if (block.type === "heading" && (block.level === "h2" || block.level === "h3") && !subtitle) {
      subtitle = block.text;
      continue;
    }
    if (block.type === "text" && !intro) {
      intro = block.text;
      introHtml = block.html;
      continue;
    }
    if (block.type === "button") {
      buttons.push({ text: block.text, url: block.url });
      continue;
    }
    if (block.type === "image" && !image) {
      image = { url: block.url, alt: block.alt };
      continue;
    }
    if (block.type === "heading" && block.level === "h6") break;
    if (block.type === "heading" && block.level === "h2" && subtitle) break;
  }

  return { title, subtitle, intro, introHtml, image, buttons };
}

export function groupBlocksIntoSections(blocks: ElementorBlock[]): PageSection[] {
  const sections: PageSection[] = [];
  let current: PageSection | null = null;
  let seenH1 = false;

  function pushCurrent() {
    if (!current) return;
    const hasContent =
      current.title ||
      current.paragraphs.length ||
      current.htmlParagraphs.length ||
      current.images.length ||
      current.lists.length ||
      current.faq.length ||
      current.buttons.length;
    if (hasContent) sections.push(current);
    current = null;
  }

  for (const block of blocks) {
    if (block.type === "heading") {
      if (block.level === "h1") {
        seenH1 = true;
        continue;
      }
      if (!seenH1) continue;
      if (isShortcodeText(block.text)) continue;

      if (block.level === "h6") {
        pushCurrent();
        current = {
          paragraphs: [],
          htmlParagraphs: [],
          images: [],
          lists: [],
          faq: [],
          buttons: [],
          label: block.text,
        };
        continue;
      }

      if (block.level === "h2" || block.level === "h3") {
        if (current?.title) pushCurrent();
        if (!current) {
          current = {
            paragraphs: [],
            htmlParagraphs: [],
            images: [],
            lists: [],
            faq: [],
            buttons: [],
          };
        }
        current.title = block.text;
        continue;
      }

      if (!current) {
        current = {
          paragraphs: [],
          htmlParagraphs: [],
          images: [],
          lists: [],
          faq: [],
          buttons: [],
        };
      }
      current.paragraphs.push(block.text);
      continue;
    }

    if (!seenH1) continue;
    if (!current) {
      current = {
        paragraphs: [],
        htmlParagraphs: [],
        images: [],
        lists: [],
        faq: [],
        buttons: [],
      };
    }

    switch (block.type) {
      case "text":
        current.htmlParagraphs.push(block.html);
        current.paragraphs.push(block.text);
        break;
      case "list":
        current.lists.push(block.items);
        break;
      case "image":
        current.images.push({ url: block.url, alt: block.alt });
        break;
      case "button":
        current.buttons.push({ text: block.text, url: block.url });
        break;
      case "faq":
        current.faq.push(...block.items);
        break;
    }
  }

  pushCurrent();
  return sections;
}

/** Service and marketing landing pages rebuilt with structured layout. */
export const STRUCTURED_SERVICE_PATHS = new Set([
  "/seo/",
  "/google-ads/",
  "/website-building/",
  "/social-media-management/",
  "/hosting-plans/",
  "/check-fit/",
  "/שירותי-שיווק-דיגיטלי/",
]);

export const STRUCTURED_PAGE_PATHS = new Set([
  "/about-us/",
  "/contact-us/",
  ...STRUCTURED_SERVICE_PATHS,
]);

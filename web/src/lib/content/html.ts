import fs from "fs";
import path from "path";
import { decodeHtmlTextNodes } from "@/lib/content/paths";
import { rewriteContentMediaUrls, toLocalMediaUrl } from "@/lib/media/urls";

/** Remove WordPress shortcodes that should never appear in rendered UI. */
export function stripShortcodes(html: string): string {
  return html.replace(/\[[\w\-]+(?:[^\]]*)?\]/g, "");
}

/** Strip srcset width tokens and normalize upload paths. */
function cleanUploadUrl(raw: string): string {
  if (!raw || raw.startsWith("data:")) return raw;

  let url = decodeURIComponent(raw.trim())
    .replace(/\s+\d+w$/i, "")
    .replace(/%20\d+w$/i, "")
    .split("?")[0];

  if (url.startsWith("/wp-content/uploads/") || url.includes("/wp-content/uploads/")) {
    const local = url.startsWith("http")
      ? toLocalMediaUrl(url)
      : toLocalMediaUrl(`https://adwrks.co.il${url}`);
    url = local;
  }

  if (url.startsWith("/wp-content/uploads/")) {
    const filePath = path.join(process.cwd(), "public", url);
    if (!fs.existsSync(filePath)) {
      const base = path.basename(url);
      const fullMatch = base.match(/^(.+?)-(\d+)x(\d+)\.([a-z0-9]+)$/i);
      if (fullMatch) {
        const candidate = `/wp-content/uploads/${fullMatch[1]}.${fullMatch[4]}`;
        if (fs.existsSync(path.join(process.cwd(), "public", candidate))) {
          return candidate;
        }
      }
    }
  }

  return url;
}

function cleanSrcsetValue(srcset: string): string {
  const parts = srcset
    .split(",")
    .map((part) => {
      const trimmed = part.trim().replace(/%20(\d+w)$/i, " $1");
      const withWidth = trimmed.match(/^(\S+)\s+(\d+w)$/i);
      if (withWidth) {
        const url = cleanUploadUrl(withWidth[1]);
        return `${url} ${withWidth[2]}`;
      }
      const urlOnly = trimmed.match(/^(\S+)/);
      return urlOnly ? cleanUploadUrl(urlOnly[1]) : "";
    })
    .filter(Boolean);

  const deduped = [...new Set(parts.map((p) => p.split(/\s+/)[0]))];
  return deduped.length ? deduped.map((u) => `${u} 800w`).join(", ") : "";
}

/** Process WordPress/Elementor HTML for safe server rendering. */
export function processContentHtml(html: string): string {
  if (!html) return "";

  let processed = stripShortcodes(rewriteContentMediaUrls(html))
    .replace(/meta-parners\.png/gi, "google-meta-partners-e1769685292174.webp")
    .replace(/\t/g, "")
    .replace(/<script(?![^>]*type\s*=\s*["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/\sdata-lazyloaded="1"/gi, "")
    .replace(/src="data:image\/svg\+xml[^"]*"/gi, "")
    .replace(/data-src="/gi, 'src="')
    .replace(/<noscript>[\s\S]*?<\/noscript>/gi, "")
    .replace(/<img[^>]+graph\.facebook\.com[^>]*>/gi, "")
    .replace(/<iframe[^>]+trustindex[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<link[^>]+trustindex[^>]*>/gi, "");

  processed = processed.replace(/\ssrc="([^"]+)"/gi, (_m, src: string) => {
    const cleaned = cleanUploadUrl(src);
    return cleaned ? ` src="${cleaned}"` : "";
  });

  processed = processed.replace(/srcset="([^"]+)"/gi, (_match, srcset: string) => {
    const cleaned = cleanSrcsetValue(srcset);
    return cleaned ? `srcset="${cleaned}"` : "";
  });

  processed = processed.replace(
    /<img([^>]*?)srcset="([^"]+)"([^>]*?)>/gi,
    (match, before, srcset, after) => {
      if (/src=/.test(before + after)) return match;
      const first = srcset.split(",")[0]?.trim().split(/\s+/)[0];
      if (!first) return match;
      const cleaned = cleanUploadUrl(first);
      return `<img${before}src="${cleaned}" srcset="${srcset}"${after}>`;
    },
  );

  processed = processed.replace(/<img([^>]*?)\ssrc=""\s*([^>]*)>/gi, "");

  processed = decodeHtmlTextNodes(processed);

  return processed.trim();
}

export function extractJsonLdFromHtml(html: string): unknown[] {
  const blocks: unknown[] = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    try {
      blocks.push(JSON.parse(match[1].trim()));
    } catch {
      /* skip invalid */
    }
  }
  return blocks;
}

export function stripJsonLdFromHtml(html: string): string {
  return html.replace(/<script[^>]+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, "");
}

/** Strip legacy RTL inline styles from translated English HTML bodies. */
export function normalizeEnContentDirection(html: string): string {
  return html
    .replace(/text-align\s*:\s*right/gi, "text-align: start")
    .replace(/direction\s*:\s*rtl/gi, "direction: ltr")
    .replace(/float\s*:\s*right/gi, "float: left");
}

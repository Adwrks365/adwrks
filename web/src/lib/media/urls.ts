import fs from "fs";
import path from "path";

const UPLOAD_PREFIX = "/wp-content/uploads/";

/** Broken production typo → verified local equivalent (Meta/Google partners badge). */
const MEDIA_ALIASES: Record<string, string> = {
  "/wp-content/uploads/meta-parners.png": "/wp-content/uploads/google-meta-partners-e1769685292174.webp",
};

let _map: Record<string, string> | null = null;

function loadMap(): Record<string, string> {
  if (_map) return _map;
  const mapPath = path.join(process.cwd(), "..", "migration-audit", "media-map.json");
  if (fs.existsSync(mapPath)) {
    const data = JSON.parse(fs.readFileSync(mapPath, "utf8")) as { mapping?: Record<string, string> };
    _map = data.mapping ?? {};
  } else {
    _map = {};
  }
  return _map;
}

/** Convert production WordPress upload URL to local public path. */
export function toLocalMediaUrl(url: string): string {
  if (!url) return url;
  const normalized = url.split("?")[0].replace("https://www.adwrks.co.il", "https://adwrks.co.il");
  if (!normalized.includes("/wp-content/uploads/")) return url;

  const map = loadMap();
  if (map[normalized]) return map[normalized];

  try {
    const u = new URL(normalized);
    const pathname = u.pathname;
    return MEDIA_ALIASES[pathname] ?? pathname;
  } catch {
    return url;
  }
}

/** Rewrite all upload URLs in HTML content to local paths. */
export function rewriteContentMediaUrls(html: string): string {
  if (!html) return html;
  return html.replace(
    /https?:\/\/(?:www\.)?adwrks\.co\.il(\/wp-content\/uploads\/[^"'\\s<>]+)/gi,
    (_, uploadPath: string) => toLocalMediaUrl(`https://adwrks.co.il${uploadPath.split("?")[0]}`),
  );
}

export function mediaUrlFromPath(filename: string): string {
  return `${UPLOAD_PREFIX}${filename.replace(/^\/+/, "")}`;
}

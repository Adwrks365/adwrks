import fs from "fs";
import path from "path";
import { toLocalMediaUrl } from "./urls";

type MediaRecord = {
  id: number;
  sourceUrl: string;
  altText?: string;
  mimeType?: string;
};

let _byId: Map<number, MediaRecord> | null = null;

function loadMediaIndex(): Map<number, MediaRecord> {
  if (_byId) return _byId;
  const filePath = path.join(process.cwd(), "..", "migration-audit", "media.json");
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as MediaRecord[];
  _byId = new Map(raw.map((m) => [m.id, m]));
  return _byId;
}

export function getMediaById(id: number): MediaRecord | undefined {
  if (!id) return undefined;
  return loadMediaIndex().get(id);
}

export function getFeaturedImageUrl(mediaId?: number): string | undefined {
  if (!mediaId) return undefined;
  const media = getMediaById(mediaId);
  if (!media?.sourceUrl) return undefined;
  return toLocalMediaUrl(media.sourceUrl);
}

export function getFeaturedImageAlt(mediaId?: number): string {
  if (!mediaId) return "";
  return getMediaById(mediaId)?.altText ?? "";
}

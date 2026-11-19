import revisionsData from "@/data/content/article-content-revisions.json";
import type { ContentItem } from "@/lib/content/types";

const ISRAEL_TZ = "Asia/Jerusalem";

type RevisionEntry = {
  postId: number;
  dateModified: string;
  source?: string;
  note?: string;
};

const REVISIONS_BY_POST_ID = new Map<number, string>(
  (revisionsData.revisions as RevisionEntry[]).map((r) => [r.postId, r.dateModified]),
);

export type ResolvedArticleDates = {
  datePublished: string | undefined;
  dateModified: string | undefined;
  showUpdated: boolean;
  schemaDatePublished: string | undefined;
  schemaDateModified: string | undefined;
};

function calendarDayKey(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ISRAEL_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/** True when modified is on a later calendar day than published (Asia/Jerusalem). */
export function isArticleUpdated(published?: string, modified?: string): boolean {
  const pub = calendarDayKey(published);
  const mod = calendarDayKey(modified);
  if (!pub || !mod) return false;
  return pub !== mod;
}

function israelUtcOffsetFor(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: ISRAEL_TZ,
    timeZoneName: "shortOffset",
  }).formatToParts(date);
  const tz = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT+2";
  const m = tz.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/i);
  if (!m) return "+02:00";
  const sign = m[1];
  const hours = m[2].padStart(2, "0");
  const mins = (m[3] ?? "00").padStart(2, "0");
  return `${sign}${hours}:${mins}`;
}

/** ISO 8601 with Israel offset for schema.org (matches migrated Rank Math style). */
export function toSchemaIsoIsrael(isoLocal?: string): string | undefined {
  if (!isoLocal?.trim()) return undefined;
  if (/[+-]\d{2}:\d{2}$/.test(isoLocal) || isoLocal.endsWith("Z")) return isoLocal;
  const normalized = isoLocal.replace(/\.\d{3,}$/, "");
  const withTime = normalized.includes("T") ? normalized : `${normalized}T12:00:00`;
  const d = new Date(withTime);
  if (Number.isNaN(d.getTime())) return isoLocal;
  const offset = israelUtcOffsetFor(d);
  const base = withTime.length === 10 ? `${withTime}T12:00:00` : withTime;
  return `${base}${offset}`;
}

function pickLatestModified(stored?: string, revision?: string): string | undefined {
  if (!revision) return stored;
  if (!stored) return revision;
  const a = new Date(stored).getTime();
  const b = new Date(revision).getTime();
  if (Number.isNaN(a)) return revision;
  if (Number.isNaN(b)) return stored;
  return b >= a ? revision : stored;
}

export function resolveArticleDates(
  item: Pick<ContentItem, "id" | "date" | "modified" | "type">,
): ResolvedArticleDates {
  if (item.type !== "post") {
    return {
      datePublished: item.date,
      dateModified: item.modified,
      showUpdated: false,
      schemaDatePublished: toSchemaIsoIsrael(item.date),
      schemaDateModified: toSchemaIsoIsrael(item.modified ?? item.date),
    };
  }

  const datePublished = item.date;
  const revision = REVISIONS_BY_POST_ID.get(item.id);
  const dateModified = pickLatestModified(item.modified, revision);
  const showUpdated = isArticleUpdated(datePublished, dateModified);

  return {
    datePublished,
    dateModified,
    showUpdated,
    schemaDatePublished: toSchemaIsoIsrael(datePublished),
    schemaDateModified: toSchemaIsoIsrael(dateModified ?? datePublished),
  };
}

/** Merge controlled revision dates into post items after loader read. */
export function withResolvedArticleDates(item: ContentItem): ContentItem {
  if (item.type !== "post") return item;
  const dates = resolveArticleDates(item);
  return {
    ...item,
    modified: dates.dateModified ?? item.modified,
  };
}
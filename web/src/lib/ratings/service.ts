import { getContentId } from "@/i18n/routes";
import { getContentByPath } from "@/lib/content/loader";
import { normalizePath } from "@/lib/content/paths";
import { getRatingsConfig } from "@/lib/ratings/config";
import { resolveArticleRatingPath } from "@/lib/ratings/path";
import { supabaseFetch } from "@/lib/ratings/supabase";

export type ArticleRatingAggregate = {
  averageRating: number | null;
  totalVoteCount: number;
};

export type SubmitRatingResult = {
  accepted: boolean;
  averageRating: number | null;
  totalVoteCount: number;
};

export type ArticleRatingContext = {
  canonicalPath: string;
  aggregate: ArticleRatingAggregate;
};

type AggregateRow = {
  article_path: string;
  average_rating: number | string | null;
  total_vote_count: number;
};

type VoteRow = {
  rating: number;
};

type RpcRow = {
  inserted: boolean;
  total_vote_count: number;
  average_rating: number | string | null;
};

function parseAverage(value: number | string | null): number | null {
  if (value === null || value === undefined) return null;
  const num = typeof value === "number" ? value : Number.parseFloat(value);
  return Number.isFinite(num) ? num : null;
}

/** PostgREST eq filter value — quote-wrap paths/text so UTF-8 slugs match reliably. */
function encodePostgrestQuoted(value: string): string {
  const escaped = value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return encodeURIComponent(`"${escaped}"`);
}

function encodePostgrestPlain(value: string): string {
  return encodeURIComponent(value);
}

function rowToAggregate(row: AggregateRow): ArticleRatingAggregate {
  return {
    averageRating: parseAverage(row.average_rating),
    totalVoteCount: row.total_vote_count,
  };
}

function parseWordpressIdFromContentId(contentId?: string): number | null {
  if (!contentId?.startsWith("post-")) return null;
  const id = Number.parseInt(contentId.slice(5), 10);
  return Number.isFinite(id) ? id : null;
}

function wordpressIdForArticlePath(inputPath: string, resolvedHePath: string): number | null {
  return (
    parseWordpressIdFromContentId(getContentId(inputPath, "he")) ??
    parseWordpressIdFromContentId(getContentId(resolvedHePath, "he")) ??
    parseWordpressIdFromContentId(getContentId(inputPath, "en")) ??
    parseWordpressIdFromContentId(getContentId(resolvedHePath, "en"))
  );
}

const EMPTY_AGGREGATE: ArticleRatingAggregate = {
  averageRating: null,
  totalVoteCount: 0,
};

function findPublishedArticleForRating(
  inputPath: string,
): { canonicalPath: string; wordpressId: number } | null {
  const normalized = normalizePath(inputPath);
  const canonicalPath = resolveArticleRatingPath(inputPath);
  const candidates = [canonicalPath, normalized].filter(
    (p, i, arr) => p && p !== "/" && arr.indexOf(p) === i,
  );

  for (const path of candidates) {
    const he = getContentByPath(path, "he");
    if (he?.id) {
      return { canonicalPath: resolveArticleRatingPath(he.path), wordpressId: he.id };
    }
    const en = getContentByPath(path, "en");
    if (en?.id) {
      return { canonicalPath: resolveArticleRatingPath(en.path), wordpressId: en.id };
    }
  }

  return null;
}

/** Register migrated posts that were never imported into rating baselines (no historical votes). */
async function ensureArticleRatingBaseline(
  canonicalPath: string,
  wordpressId: number,
): Promise<void> {
  const byId = await fetchAggregateRow(`wordpress_id=eq.${wordpressId}`);
  if (byId) return;

  const quoted = await fetchAggregateRow(`article_path=eq.${encodePostgrestQuoted(canonicalPath)}`);
  if (quoted) return;

  const plain = await fetchAggregateRow(`article_path=eq.${encodePostgrestPlain(canonicalPath)}`);
  if (plain) return;

  const response = await supabaseFetch("article_rating_baselines", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      wordpress_id: wordpressId,
      article_path: canonicalPath,
      historical_vote_count: 0,
      historical_rating_sum: 0,
      historical_average: 1,
      source_plugin: "next-site",
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.warn("[article-rating] baseline upsert skipped", {
      wordpressId,
      canonicalPath,
      status: response.status,
      body: body.slice(0, 200),
    });
  }
}

async function fetchAggregateRow(query: string): Promise<AggregateRow | null> {
  const response = await supabaseFetch(
    `article_rating_aggregates?${query}&select=article_path,average_rating,total_vote_count&limit=1`,
  );

  if (!response.ok) {
    throw new Error(`aggregate_fetch_failed:${response.status}`);
  }

  const rows = (await response.json()) as AggregateRow[];
  return rows[0] ?? null;
}

export function normalizeArticlePath(input: string): string {
  return resolveArticleRatingPath(input);
}

/** Resolve Supabase canonical article_path + aggregate, with path and wordpress_id fallbacks. */
export async function resolveArticleRatingContext(
  inputPath: string,
): Promise<ArticleRatingContext | null> {
  const resolvedHePath = resolveArticleRatingPath(inputPath);
  const pathCandidates = [resolvedHePath, normalizePath(inputPath)].filter(
    (path, index, arr) => path && path !== "/" && arr.indexOf(path) === index,
  );

  for (const path of pathCandidates) {
    const quoted = await fetchAggregateRow(`article_path=eq.${encodePostgrestQuoted(path)}`);
    if (quoted) {
      return { canonicalPath: quoted.article_path, aggregate: rowToAggregate(quoted) };
    }

    const plain = await fetchAggregateRow(`article_path=eq.${encodePostgrestPlain(path)}`);
    if (plain) {
      return { canonicalPath: plain.article_path, aggregate: rowToAggregate(plain) };
    }
  }

  const wordpressId = wordpressIdForArticlePath(inputPath, resolvedHePath);
  if (wordpressId !== null) {
    const byId = await fetchAggregateRow(`wordpress_id=eq.${wordpressId}`);
    if (byId) {
      return { canonicalPath: byId.article_path, aggregate: rowToAggregate(byId) };
    }
  }

  const published = findPublishedArticleForRating(inputPath);
  if (!published) {
    return null;
  }

  await ensureArticleRatingBaseline(published.canonicalPath, published.wordpressId);

  const retryQuoted = await fetchAggregateRow(
    `article_path=eq.${encodePostgrestQuoted(published.canonicalPath)}`,
  );
  if (retryQuoted) {
    return { canonicalPath: retryQuoted.article_path, aggregate: rowToAggregate(retryQuoted) };
  }

  const retryPlain = await fetchAggregateRow(
    `article_path=eq.${encodePostgrestPlain(published.canonicalPath)}`,
  );
  if (retryPlain) {
    return { canonicalPath: retryPlain.article_path, aggregate: rowToAggregate(retryPlain) };
  }

  return { canonicalPath: published.canonicalPath, aggregate: EMPTY_AGGREGATE };
}

export async function fetchArticleRatingAggregate(
  articlePath: string,
): Promise<ArticleRatingAggregate | null> {
  const context = await resolveArticleRatingContext(articlePath);
  return context?.aggregate ?? null;
}

export async function fetchVisitorArticleRating(
  articlePath: string,
  voterHash: string,
): Promise<number | null> {
  const context = await resolveArticleRatingContext(articlePath);
  if (!context) return null;

  const encodedPath = encodePostgrestQuoted(context.canonicalPath);
  const encodedHash = encodePostgrestQuoted(voterHash);

  const response = await supabaseFetch(
    `article_rating_votes?article_path=eq.${encodedPath}&voter_hash=eq.${encodedHash}&select=rating&limit=1`,
  );

  if (!response.ok) {
    throw new Error(`vote_lookup_failed:${response.status}`);
  }

  const rows = (await response.json()) as VoteRow[];
  return rows[0]?.rating ?? null;
}

export async function submitArticleRating(
  articlePath: string,
  rating: number,
  voterHash: string,
): Promise<SubmitRatingResult> {
  const context = await resolveArticleRatingContext(articlePath);
  if (!context) {
    throw new Error("article_not_found");
  }

  const response = await supabaseFetch("rpc/submit_article_rating_vote", {
    method: "POST",
    body: JSON.stringify({
      p_article_path: context.canonicalPath,
      p_rating: rating,
      p_voter_hash: voterHash,
    }),
  });

  if (!response.ok) {
    throw new Error(`vote_submit_failed:${response.status}`);
  }

  const rows = (await response.json()) as RpcRow[];
  const row = rows[0];

  if (!row) {
    throw new Error("vote_submit_empty");
  }

  return {
    accepted: Boolean(row.inserted),
    averageRating: parseAverage(row.average_rating),
    totalVoteCount: row.total_vote_count,
  };
}

/** Server-side sanity check without exposing secrets. */
export function assertRatingsServerConfig(): boolean {
  return getRatingsConfig() !== null;
}

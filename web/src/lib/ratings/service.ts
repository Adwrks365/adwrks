import { normalizePath } from "@/lib/content/paths";
import { getRatingsConfig } from "@/lib/ratings/config";
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

type AggregateRow = {
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

export function normalizeArticlePath(input: string): string {
  return normalizePath(input);
}

export async function fetchArticleRatingAggregate(
  articlePath: string,
): Promise<ArticleRatingAggregate | null> {
  const path = normalizeArticlePath(articlePath);
  const encodedPath = encodeURIComponent(path);

  const response = await supabaseFetch(
    `article_rating_aggregates?article_path=eq.${encodedPath}&select=average_rating,total_vote_count&limit=1`,
  );

  if (!response.ok) {
    throw new Error("aggregate_fetch_failed");
  }

  const rows = (await response.json()) as AggregateRow[];
  if (!rows.length) return null;

  return {
    averageRating: parseAverage(rows[0].average_rating),
    totalVoteCount: rows[0].total_vote_count,
  };
}

export async function fetchVisitorArticleRating(
  articlePath: string,
  voterHash: string,
): Promise<number | null> {
  const path = normalizeArticlePath(articlePath);
  const encodedPath = encodeURIComponent(path);
  const encodedHash = encodeURIComponent(voterHash);

  const response = await supabaseFetch(
    `article_rating_votes?article_path=eq.${encodedPath}&voter_hash=eq.${encodedHash}&select=rating&limit=1`,
  );

  if (!response.ok) {
    throw new Error("vote_lookup_failed");
  }

  const rows = (await response.json()) as VoteRow[];
  return rows[0]?.rating ?? null;
}

export async function submitArticleRating(
  articlePath: string,
  rating: number,
  voterHash: string,
): Promise<SubmitRatingResult> {
  const path = normalizeArticlePath(articlePath);

  const response = await supabaseFetch("rpc/submit_article_rating_vote", {
    method: "POST",
    body: JSON.stringify({
      p_article_path: path,
      p_rating: rating,
      p_voter_hash: voterHash,
    }),
  });

  if (!response.ok) {
    throw new Error("vote_submit_failed");
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

-- Phase 5G.2A/5G.2B — Article star ratings schema (PROPOSED — DO NOT EXECUTE UNTIL MANUAL REVIEW)
-- Generated: 2026-10-01
-- Source artifact: migration-audit/article-rating-migration.json
--
-- Access model: Next.js server routes only (Supabase service role).
-- No anon/authenticated direct table access. No service-role key in browser.

BEGIN;

-- ---------------------------------------------------------------------------
-- Immutable WordPress baseline imported once from Rate My Post production data
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.article_rating_baselines (
  wordpress_id            integer PRIMARY KEY,
  article_path            text NOT NULL UNIQUE,
  historical_vote_count   integer NOT NULL CHECK (historical_vote_count >= 0),
  historical_rating_sum   integer NOT NULL CHECK (historical_rating_sum >= 0),
  historical_average      numeric(3, 2) NOT NULL CHECK (historical_average >= 1 AND historical_average <= 5),
  source_plugin           text NOT NULL DEFAULT 'rate-my-post',
  imported_at             timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT article_rating_baselines_sum_sane
    CHECK (historical_vote_count = 0 OR historical_rating_sum >= historical_vote_count)
);

COMMENT ON TABLE public.article_rating_baselines IS
  'Frozen WordPress Rate My Post aggregates. Never updated after import.';

COMMENT ON COLUMN public.article_rating_baselines.historical_rating_sum IS
  'Integer sum derived from production average * voteCount at migration time. Individual historical star votes were not exported.';

-- ---------------------------------------------------------------------------
-- New site votes (1–5 stars) submitted after Next.js launch
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.article_rating_votes (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_path  text NOT NULL REFERENCES public.article_rating_baselines (article_path) ON DELETE RESTRICT,
  rating        smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  voter_hash    text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT article_rating_votes_unique_voter UNIQUE (article_path, voter_hash)
);

CREATE INDEX IF NOT EXISTS article_rating_votes_article_path_idx
  ON public.article_rating_votes (article_path);

COMMENT ON TABLE public.article_rating_votes IS
  'Individual post-migration star votes. Aggregated with baselines for public totals.';

-- ---------------------------------------------------------------------------
-- Combined aggregate view (historical + new)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.article_rating_aggregates AS
SELECT
  b.wordpress_id,
  b.article_path,
  b.historical_vote_count,
  b.historical_rating_sum,
  b.historical_average,
  COUNT(v.id)::integer AS new_vote_count,
  COALESCE(SUM(v.rating), 0)::integer AS new_rating_sum,
  (b.historical_vote_count + COUNT(v.id))::integer AS total_vote_count,
  (b.historical_rating_sum + COALESCE(SUM(v.rating), 0))::integer AS total_rating_sum,
  CASE
    WHEN (b.historical_vote_count + COUNT(v.id)) = 0 THEN NULL
    ELSE ROUND(
      (b.historical_rating_sum + COALESCE(SUM(v.rating), 0))::numeric
      / (b.historical_vote_count + COUNT(v.id)),
      1
    )
  END AS average_rating
FROM public.article_rating_baselines b
LEFT JOIN public.article_rating_votes v ON v.article_path = b.article_path
GROUP BY
  b.wordpress_id,
  b.article_path,
  b.historical_vote_count,
  b.historical_rating_sum,
  b.historical_average;

COMMENT ON VIEW public.article_rating_aggregates IS
  'Combined historical WordPress + new Supabase star ratings.';

-- ---------------------------------------------------------------------------
-- RLS — deny direct public access; server uses service role via API routes
-- ---------------------------------------------------------------------------
ALTER TABLE public.article_rating_baselines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_rating_votes ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.article_rating_baselines FROM anon, authenticated;
REVOKE ALL ON TABLE public.article_rating_votes FROM anon, authenticated;
REVOKE ALL ON TABLE public.article_rating_baselines FROM PUBLIC;
REVOKE ALL ON TABLE public.article_rating_votes FROM PUBLIC;

-- service_role bypasses RLS in Supabase and is used only on the server.

-- ---------------------------------------------------------------------------
-- Server-side vote insert helper (optional; API may use plain INSERT instead)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.submit_article_rating_vote(
  p_article_path text,
  p_rating smallint,
  p_voter_hash text
)
RETURNS TABLE (
  inserted boolean,
  total_vote_count integer,
  average_rating numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_inserted boolean := false;
BEGIN
  IF p_rating < 1 OR p_rating > 5 THEN
    RAISE EXCEPTION 'rating must be between 1 and 5';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.article_rating_baselines b WHERE b.article_path = p_article_path
  ) THEN
    RAISE EXCEPTION 'unknown article path';
  END IF;

  INSERT INTO public.article_rating_votes (article_path, rating, voter_hash)
  VALUES (p_article_path, p_rating, p_voter_hash)
  ON CONFLICT (article_path, voter_hash) DO NOTHING
  RETURNING true INTO v_inserted;

  RETURN QUERY
  SELECT
    COALESCE(v_inserted, false),
    a.total_vote_count,
    a.average_rating
  FROM public.article_rating_aggregates a
  WHERE a.article_path = p_article_path;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_article_rating_vote(text, smallint, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_article_rating_vote(text, smallint, text) TO service_role;

COMMIT;

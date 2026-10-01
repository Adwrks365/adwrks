/**
 * Optional live Supabase smoke test — runs only when env vars are present.
 */
const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
const key = process.env.SUPABASE_SECRET_KEY;
const voterSecret = process.env.ARTICLE_RATING_VOTER_SECRET;

if (!url || !key || !voterSecret) {
  console.log(JSON.stringify({ skipped: true }));
  process.exit(0);
}

async function fetchJson(path, options = {}) {
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  return { ok: response.ok, status: response.status, body: text ? JSON.parse(text) : null };
}

const baseline = await fetchJson(
  "article_rating_baselines?select=wordpress_id&limit=1",
);
const aggregateFive = await fetchJson(
  "article_rating_aggregates?article_path=eq.%2F%D7%91%D7%93%D7%99%D7%A7%D7%AA-%D7%9E%D7%94%D7%99%D7%A8%D7%95%D7%AA-%D7%90%D7%AA%D7%A8%2F&select=average_rating,total_vote_count",
);
const aggregateLow = await fetchJson(
  "article_rating_aggregates?article_path=eq.%2F%D7%94%D7%97%D7%99%D7%A4%D7%95%D7%A9%D7%99%D7%9D-%D7%94%D7%9B%D7%99-%D7%A4%D7%95%D7%A4%D7%95%D7%9C%D7%A8%D7%99%D7%99%D7%9D-%D7%91%D7%92%D7%95%D7%92%D7%9C-%D7%94%D7%99%D7%95%D7%9D-%D7%91%D7%99%D7%A9%2F&select=average_rating,total_vote_count",
);

console.log(
  JSON.stringify(
    {
      baselineOk: baseline.ok,
      aggregateFive: aggregateFive.body?.[0] ?? null,
      aggregateLow: aggregateLow.body?.[0] ?? null,
    },
    null,
    2,
  ),
);

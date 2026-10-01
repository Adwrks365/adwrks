# Supabase Data API exposure fix (if production returns 502)

Production deploy is live, but `/api/articles/rate` may return **502** if the rating tables/view are not exposed to the PostgREST Data API.

This is **not** a schema change and does **not** re-import historical data.

## Symptoms

- Star module renders on articles
- API returns `{ ok: false, message: "לא ניתן לטעון את הדירוג כרגע." }` with HTTP **502**
- Vercel logs show codes like `aggregate_fetch_failed:404`

## Fix in Supabase Dashboard

1. Open the **dedicated adwrks.co.il ratings** Supabase project (not other projects).
2. Go to **Project Settings → Data API** (or **API**).
3. Ensure **Data API** is enabled.
4. Because auto-expose new tables is disabled, manually expose:
   - `public.article_rating_baselines`
   - `public.article_rating_votes`
   - `public.article_rating_aggregates` (view)
5. In **SQL Editor**, run:

```sql
NOTIFY pgrst, 'reload schema';
```

6. Verify in SQL Editor (unchanged data):

```sql
SELECT COUNT(*) FROM public.article_rating_baselines;
SELECT COUNT(*) FROM public.article_rating_votes;
```

## Verify from production

```text
GET https://adwrks.co.il/api/articles/rate?path=/בדיקת-מהירות-אתר/
```

Expected:

```json
{
  "ok": true,
  "averageRating": 5,
  "totalVoteCount": 69,
  "hasVoted": false,
  "userRating": null
}
```

## Vercel env checklist (Production)

- `SUPABASE_URL` = `https://<project-ref>.supabase.co` (same project where 54 baselines exist)
- `SUPABASE_SECRET_KEY` = server secret key for that project
- `ARTICLE_RATING_VOTER_SECRET` = HMAC secret (any random 32+ byte value)

No `NEXT_PUBLIC_` rating secrets.

# PHASE 5G.2C — Implementation Report (pre-deploy)

**Date:** 2026-10-01  
**Status:** Local implementation complete — awaiting approval before commit/deploy

---

## Summary

```
SUPABASE CONNECTION: PASS (server code) / LIVE API: BLOCKED locally (no .env.local)
HISTORICAL BASELINES: 54 (verified in Supabase by user)
HISTORICAL VOTES: 2430 (verified in Supabase by user)
NEW VOTE TEST: BLOCKED locally — requires .env.local or Vercel preview
DUPLICATE PROTECTION: IMPLEMENTED (HMAC cookie + DB unique constraint)
STAR UI: PASS (layout/accessibility)
RTL STAR ORDER: PASS (dir=ltr, 1→5 left-to-right)
RATING PERSISTENCE: BLOCKED locally (no Supabase env)
SECRETS SERVER-ONLY: PASS (0 matches in client chunks)

ARROW FIX:
- הבא ← : PASS
- קרא עוד ← : PASS
- הקודם → : PASS
- המאמר הבא ← : PASS
- המאמר הקודם → : PASS

BLANK GAP: PASS (0/54 redundant leading sections)
POPUP/CTA: PASS (no changes)
FORMS: PASS (no changes)
SITEMAP: 74
ROBOTS: PASS (unchanged)
BUILD: PASS
LINT: PASS
```

---

## Architecture

| Layer | Implementation |
|-------|----------------|
| Server config | `web/src/lib/ratings/config.ts` |
| Supabase REST | `web/src/lib/ratings/supabase.ts` (no SDK dependency) |
| Voter cookie + HMAC | `web/src/lib/ratings/voter.ts` |
| Service | `web/src/lib/ratings/service.ts` |
| GET/POST API | `web/src/app/api/articles/rate/route.ts` |
| UI | `web/src/components/article/ArticleRating.tsx` |
| GA4 | `article_rating_submit` via `web/src/lib/analytics/article-rating-events.ts` |

Env vars (server-only):
- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`
- `ARTICLE_RATING_VOTER_SECRET`

Without env, API returns **503** safely (verified locally).

---

## Screenshots

`migration-audit/phase-5g2c-screenshots/`
- `article-390.png`, `article-430.png`, `article-768.png`, `article-1440.png`
- `blog-390.png`, `blog-430.png`, `blog-768.png`, `blog-1440.png`

---

## Local live test (optional before deploy)

Create `web/.env.local` with the three server vars (do not commit), then:

```bash
node scripts/phase-5g2c-supabase-live-test.mjs
# Start dev server and test GET/POST /api/articles/rate
```

After one controlled POST, verify in Supabase:
```sql
SELECT COUNT(*) FROM article_rating_votes;
SELECT * FROM article_rating_aggregates WHERE article_path = '/your-test-path/';
```

---

## Files changed (implementation)

- `web/src/app/api/articles/rate/route.ts` (new)
- `web/src/lib/ratings/config.ts` (new)
- `web/src/lib/ratings/supabase.ts` (new)
- `web/src/lib/ratings/voter.ts` (new)
- `web/src/lib/ratings/service.ts` (new)
- `web/src/lib/analytics/article-rating-events.ts` (new)
- `web/src/components/ui/PhysicalNavRow.tsx` (new)
- `web/src/components/article/ArticleRating.tsx` (star rating replaces yes/no)
- `web/src/components/ui/Pagination.tsx`
- `web/src/components/ui/ArticleCard.tsx`
- `web/src/components/article/ArticleAdjacentNav.tsx`
- `web/src/lib/content/legacy-blocks.ts`
- `web/src/lib/content/article.ts`
- `web/src/app/globals.css`
- `web/.env.example`

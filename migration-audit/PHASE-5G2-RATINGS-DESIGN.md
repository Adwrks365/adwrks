# PHASE 5G.2A — Restore Article Star Ratings — Supabase Design

**Date:** 2026-10-01  
**Mode:** DESIGN + MIGRATION PREPARATION ONLY  
**No Supabase connection, no SQL execution, no production code changes, no deployment**

---

## Final summary

```
HISTORICAL ARTICLES:
54 / 54

HISTORICAL VOTES:
2,430 / 2,430

AVAILABLE HISTORICAL FIELDS:
File-level: generatedAt, plugin, source, note, postsChecked, withVotes, withoutVotes, articles[]
Per-article: productionUrl, localRoute, wordpressId, source, plugin, recovered, average, voteCount, widgetPostId, productionSchema{type,ratingValue,ratingCount,bestRating}, httpStatus

NOT AVAILABLE:
Individual historical votes, star distribution (1–5 counts), raw rating sum from WordPress DB

EXACT HISTORICAL RATING SUM AVAILABLE:
NO (true per-vote sum) / YES (derived integer sum = round(average × voteCount) for all 54 rows)

PROPOSED DATABASE TABLES:
article_rating_baselines, article_rating_votes, article_rating_aggregates (view)

NEW VOTE MODEL:
Individual rows in article_rating_votes (1–5 integer), aggregated via view with frozen baselines

DUPLICATE PROTECTION:
httpOnly visitor cookie UUID + server HMAC → voter_hash; UNIQUE (article_path, voter_hash); localStorage UX guard

RLS MODEL:
RLS enabled on all tables; direct anon/authenticated access revoked; server API uses service role only

CURRENT YES/NO COMPONENT TO REMOVE (later phase):
ArticleRating.tsx, ArticleEndSection import, article-helpful-* CSS, adwrks-article-user-vote:* localStorage

AGGREGATE RATING SCHEMA RECOMMENDATION:
Do not add AggregateRating in 5G.2 — first-party self-rated articles are generally not eligible for Google review/rating rich results

SQL SCHEMA GENERATED:
YES — migration-audit/phase-5g2/article-ratings-schema.sql

HISTORICAL IMPORT SQL GENERATED:
YES — migration-audit/phase-5g2/article-ratings-historical-import.sql

IMPORT ROWS:
54 / 54

IMPORT HISTORICAL VOTES:
2,430 / 2,430

IMPORT HISTORICAL RATING SUM (derived):
12,131

PRODUCTION CODE CHANGES:
NONE

DEPLOYMENT:
NONE
```

---

## 1. Historical data inspection

**Source file:** `migration-audit/article-rating-migration.json`  
**Extracted from:** Live production HTML — WordPress **Rate My Post** widget (read-only scrape, 2026-09-30)

### File-level fields

| Field | Value |
|-------|-------|
| `generatedAt` | `2026-09-30T13:10:09.677Z` |
| `plugin` | `rate-my-post` |
| `source` | Live production HTML widget text + `data-post-id` |
| `note` | WP emitted `CreativeWorkSeason` JSON-LD; not migrated to Next.js |
| `postsChecked` | **54** |
| `withVotes` | **54** |
| `withoutVotes` | **0** |

### Per-article fields (every row has all of these)

| Field | Type | Description |
|-------|------|-------------|
| `productionUrl` | string | Original live URL |
| `localRoute` | string | Next.js pathname, e.g. `/בדיקת-מהירות-אתר/` |
| `wordpressId` | integer | WP post ID — stable primary key |
| `source` | string | `"live production HTML, Rate My Post widget (read-only)"` |
| `plugin` | string | `"rate-my-post"` |
| `recovered` | boolean | Always `true` in artifact |
| `average` | string | Displayed average on 1–5 scale, e.g. `"5"`, `"4.9"`, `"3.4"` |
| `voteCount` | integer | Total historical votes |
| `widgetPostId` | string | Rate My Post DOM `data-post-id` (matches `wordpressId`) |
| `productionSchema` | object | `{ type, ratingValue, ratingCount, bestRating }` |
| `httpStatus` | integer | Always `200` in artifact |

### Fields **not** present in the artifact

| Field | Available? |
|-------|--------------|
| Individual historical votes | **NO** |
| Star distribution (1★–5★ counts) | **NO** |
| Exact integer `rating_sum` from WordPress DB | **NO** |
| Per-vote timestamps | **NO** |
| Voter identifiers | **NO** |

### Verified totals

| Metric | Expected | Actual |
|--------|----------|--------|
| Articles | 54 | **54** |
| Total votes | 2,430 | **2,430** |

### Non-5.0 averages (only 3 articles)

| Article | `wordpressId` | Average | Votes |
|---------|---------------|---------|-------|
| `/החיפושים-הכי-פופולריים-בגוגל-היום-ביש/` | 10983 | 3.4 | 5 |
| `/רימרקטינג-מה-זה-איך-ולמה/` | 21272 | 4.9 | 60 |
| `/מהו-שיווק-באינטרנט/` | 21051 | 4.9 | 50 |

All other 51 articles: average `"5"`.

---

## 2. Migration mathematics

### What we can compute safely

Because individual votes were **not exported**, the only recoverable aggregate is:

```
historical_rating_sum = round(parseFloat(average) × voteCount)
```

Validation on all 54 rows:

- Every derived sum is an **exact integer** (no fractional remainder)
- Total derived sum: **12,131** star-points across **2,430** votes
- Reconstructed average: `12131 / 2430 = 4.991…` → displays as **~5.0** globally

### Precision limitation (documented)

| Question | Answer |
|----------|--------|
| Can we recover the **true** integer sum of individual star values? | **NO** — only the **rounded displayed average** was captured |
| Can derived sums reproduce the displayed averages? | **YES** for all 54 rows at 1-decimal precision |
| Risk | If WP stored e.g. `4.87` but displayed `4.9`, the true sum is unknowable; we preserve the **displayed** average exactly in `historical_average` |

### Combined totals after new votes

```
total_vote_count  = historical_vote_count + COUNT(new votes)
total_rating_sum  = historical_rating_sum + SUM(new vote stars)
average_rating    = ROUND(total_rating_sum / total_vote_count, 1)
```

**Do not fabricate** individual historical votes to match distributions.

---

## 3. Supabase schema design

### Tables

#### `article_rating_baselines` (immutable historical import)

| Column | Type | Purpose |
|--------|------|---------|
| `wordpress_id` | `integer PK` | Stable WP identifier |
| `article_path` | `text UNIQUE` | Runtime key, e.g. `/בדיקת-מהירות-אתר/` |
| `historical_vote_count` | `integer` | Frozen WP vote count |
| `historical_rating_sum` | `integer` | Derived sum at import |
| `historical_average` | `numeric(3,2)` | Preserved displayed WP average |
| `source_plugin` | `text` | `'rate-my-post'` |
| `imported_at` | `timestamptz` | Import timestamp |

**Never updated after import.** Clearly separates historical WordPress data from new site activity.

#### `article_rating_votes` (new votes only)

| Column | Type | Purpose |
|--------|------|---------|
| `id` | `uuid PK` | Vote row |
| `article_path` | `text FK → baselines` | Article reference |
| `rating` | `smallint CHECK 1–5` | Star value |
| `voter_hash` | `text` | Pseudonymous dedupe key |
| `created_at` | `timestamptz` | Submission time |

**UNIQUE** `(article_path, voter_hash)` prevents duplicate votes.

#### `article_rating_aggregates` (view — not stored)

Computes live:

- `historical_*` from baselines
- `new_vote_count`, `new_rating_sum` from votes
- `total_vote_count`, `total_rating_sum`, `average_rating`

**No redundant stored totals** — avoids lost-update races; PostgreSQL aggregates concurrently from immutable baseline + append-only votes.

### Why baselines + votes (not a single mutable totals row)

| Approach | Verdict |
|----------|---------|
| Single table with incrementing totals | Race conditions; blurs historical vs new |
| **Baselines + vote rows + view** | **Preferred** — auditable, append-only new votes, clear historical boundary, safe concurrency |

---

## 4. New vote storage flow

```
USER clicks star (1–5)
  → Client: optimistic UI + localStorage guard
  → POST /api/articles/rate { articlePath, rating }
  → Server:
       - Validate path against known articles
       - Validate rating ∈ {1,2,3,4,5}
       - Compute voter_hash = HMAC-SHA256(ARTICLE_RATING_VOTER_SECRET, cookieUuid)
       - INSERT into article_rating_votes ON CONFLICT DO NOTHING
       - SELECT from article_rating_aggregates
  → Response: { inserted, totalVoteCount, averageRating, userRating? }
  → Client: update display "דירוג X מתוך 5 · N דירוגים"
```

- **No service-role key in browser**
- **No lost updates** — inserts are atomic; aggregates computed from source rows
- **Concurrent votes** — PostgreSQL handles parallel INSERTs; view reflects all rows

---

## 5. Duplicate vote protection

| Layer | Mechanism |
|-------|-----------|
| Server | `UNIQUE (article_path, voter_hash)` — duplicate INSERT ignored |
| Cookie | httpOnly `adwrks_vid` UUID (first visit, 1-year) — not PII |
| Hash | `voter_hash = HMAC(secret, adwrks_vid)` — server-only secret, never store raw IP |
| Client UX | `localStorage` key `adwrks-article-star-vote:{path}` — instant "already voted" feedback |

### Privacy / NAT notes

- **Do not store raw IP addresses**
- Shared IP/NAT: cookie distinguishes browsers; same browser can still only vote once per article
- Determined abuser can clear cookies — acceptable for casual duplicate prevention without login

---

## 6. Security / RLS

Supabase project settings (as provided):

- Data API enabled
- Auto-expose new tables: **disabled**
- Auto RLS: **enabled**
- Region: Central EU (Frankfurt)

### Policy design

| Role | `article_rating_baselines` | `article_rating_votes` | Access path |
|------|---------------------------|------------------------|-------------|
| `anon` / `authenticated` | **No direct access** | **No direct access** | — |
| `service_role` | Full (server only) | Full (server only) | Next.js API routes |
| Public read | Via **Next.js GET API** only | — | Server queries view, returns aggregates |

All rating reads and writes go through **Next.js server routes** using `SUPABASE_SERVICE_ROLE_KEY`. No Supabase client in browser for ratings.

Historical baselines cannot be edited by visitors. Votes cannot be deleted or enumerated by the public.

---

## 7. Current yes/no system — removal inventory (later phase)

**Do not remove in 5G.2A.**

| Item | Location |
|------|----------|
| Component | `web/src/components/article/ArticleRating.tsx` |
| Integration | `web/src/components/article/ArticleEndSection.tsx` |
| localStorage key | `adwrks-article-user-vote:{postPath}` values `"yes"` / `"no"` |
| CSS (active) | `.article-helpful-vote`, `.article-helpful-note`, `.article-helpful-actions`, `.article-helpful-btn`, `.article-helpful-count*` in `globals.css` |
| CSS (dormant star styles — **reuse**) | `.article-rating`, `.article-rating-star`, `.article-rating-stars`, etc. in `globals.css` |

---

## 8. UI design proposal

Replace yes/no block in `ArticleEndSection` with star rating module.

### Layout (RTL)

```
┌─────────────────────────────────────────┐
│  דרגו את המאמר                          │
│  [★] [★] [★] [★] [☆]   ← 5 star buttons│
│  דירוג 4.8 מתוך 5 · 73 דירוגים          │
└─────────────────────────────────────────┘
```

### States

| State | Display |
|-------|---------|
| Before vote | Stars interactive (empty/filled preview on hover) + aggregate line |
| Submitting | Disabled stars, subtle opacity |
| After vote | "תודה על הדירוג!" + updated aggregate line |
| Already voted (return visit) | Stars show user's selection (read-only) + current aggregate |

### Accessibility

- `role="group"` + `aria-label="דרגו את המאמר"`
- Each star: `<button aria-label="דירוג 4 מתוך 5">`
- Keyboard: arrow keys or Tab + Enter
- `aria-live="polite"` on aggregate text after vote

### Design constraints

- Reuse existing `.article-end-module` card shell
- Extend dormant `.article-rating-*` CSS (already in `globals.css`)
- No external rating library unless needed
- Fixed min-height on aggregate line → **no layout shift**
- Mobile: 44px min touch targets on stars

---

## 9. SEO / structured data

### AggregateRating recommendation

**Do not add AggregateRating schema in Phase 5G.2.**

| Factor | Assessment |
|--------|------------|
| Google review snippet guidelines | Self-serving first-party ratings on your own articles are **generally not eligible** for review/rating rich results |
| WordPress history | Rate My Post used `CreativeWorkSeason` + AggregateRating — **not** migrated intentionally |
| Current Next.js | No AggregateRating on articles today |
| Risk | Adding schema for manipulable on-site stars could be ignored or seen as spam |

**Recommendation:** Display stars in UI only. Revisit schema only if Google guidelines and an independent review mechanism change. **No schema changes in 5G.2A.**

---

## 10. Generated SQL files

| File | Purpose |
|------|---------|
| `migration-audit/phase-5g2/article-ratings-schema.sql` | Tables, view, RLS, vote function |
| `migration-audit/phase-5g2/article-ratings-historical-import.sql` | 54-row baseline INSERT |

**Neither file has been executed.**

Import validation queries (included as comments):

```sql
SELECT COUNT(*) FROM public.article_rating_baselines;              -- expect 54
SELECT SUM(historical_vote_count) FROM public.article_rating_baselines; -- expect 2430
SELECT SUM(historical_rating_sum) FROM public.article_rating_baselines; -- expect 12131
```

Generator script: `scripts/generate-phase-5g2-sql.mjs`

---

## 11. Supabase / Vercel connection requirements (future phase)

**Do not paste secrets into chat.** Add these in the Vercel project dashboard when implementing 5G.2B:

### Public / safe (may be exposed to browser if ever needed — prefer server-only for this feature)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |

> For the recommended API-only architecture, **no Supabase publishable key is required in the browser** for ratings.

### Server-only secrets (Vercel encrypted env — never `NEXT_PUBLIC_`)

| Variable | Purpose |
|----------|---------|
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side DB access for rating read/write API routes |
| `ARTICLE_RATING_VOTER_SECRET` | HMAC secret for `voter_hash` generation (generate a random 32+ byte value) |

### Optional (if using Supabase SSR client on server)

| Variable | Purpose |
|----------|---------|
| `SUPABASE_URL` | Same as public URL, server-side alias (optional duplicate) |

**Never expose `SUPABASE_SERVICE_ROLE_KEY` or `ARTICLE_RATING_VOTER_SECRET` to the client.**

---

## 12. SEO safety (this phase)

No changes to sitemap, robots, middleware, URLs, canonicals, metadata, Article schema, article content, homepage, or popup system.

Sitemap remains **74 URLs**.

---

## 13. Planned implementation phases (after approval)

| Phase | Scope |
|-------|-------|
| **5G.2B** | Execute SQL on Supabase, wire API routes, replace yes/no UI with stars |
| **5G.2C** | Production verification, remove yes/no code |
| **Layout fix (separate)** | RTL arrow physical positioning (pagination, article cards, adjacent nav) — see note below |

---

## Appendix — RTL arrow correction (separate from 5G.2A)

The appended RTL arrow requirements (physical screen position via flex, not bidi text order) are **not part of 5G.2A**. They affect:

- `web/src/components/ui/Pagination.tsx`
- `web/src/components/ui/ArticleCard.tsx` (`קרא עוד`)
- `web/src/components/article/ArticleAdjacentNav.tsx`

**5G.2A makes no changes to these files.** Arrow layout fixes should be implemented and screenshot-verified at 390px + 1440px before deploy as a separate approved task.

Current `ArticleCard` already uses a separate `<span>←</span>` element before text — may still need flex `row-reverse` / explicit positioning to guarantee physical placement in RTL.

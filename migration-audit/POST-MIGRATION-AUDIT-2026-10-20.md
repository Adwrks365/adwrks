# Post-Migration Audit — adwrks.co.il

**Date:** 2026-10-20  
**Stack:** Next.js 16 App Router (SSG + ISR `revalidate=3600`), not client-only SPA  
**Production base:** https://adwrks.co.il  
**Git baseline:** `60cc067` (legacy redirects) + pending deploy for JSON-LD schema filter  

---

## Executive summary

| Area | Status | Notes |
|------|--------|--------|
| P0 HTTP / middleware | **Pass** | 268/268 routable URLs → final **200**; 0× 5xx; 0× 404 |
| P0 Legacy redirects | **Pass** | 4 URLs start with **308** (single hop) → 200 |
| P1 Raw HTML / prerender | **Pass** | title, description, canonical, JSON-LD present on crawled pages |
| P1 Article JSON-LD | **Fix shipped (deploy pending)** | Strip `CreativeWorkSeason` / `AggregateRating`; UI rating unchanged |
| P1 Pricing internal links | **Pass** | Live `/מחירון-שיווק-דיגיטלי/` — 33 internal links, 0 failures |
| P1 Legal/thank-you H1 | **Watch** | 5 pages: no `<h1>` in raw HTML (likely `<h2>`-only layout) |
| P1 SEO duplicates | **Watch** | See `seo-uniqueness-report.json` (29 duplicate title groups) |

---

## 1. P0 — HTTP & server stability

**Script:** `web/scripts/post-migration-verify.mjs`  
**Output:** `migration-audit/post-migration-verify-2026-10-20.json`  
**Run:** 2026-10-20, User-Agent Googlebot, 268 paths from `routable-path-index.json`

| Metric | Result |
|--------|--------|
| Total URLs | 268 |
| Final HTTP 200 | 268 |
| Server errors (5xx) | 0 |
| Not found (404) | 0 |
| Redirect chains (>1 hop) | 0 |
| First response 308 (then 200) | 4 |

**308 entry points (expected):**

- `/contact/` → `/contact-us/`
- `/plans/` → `/hosting-plans/`
- `/en/how-to-choose-digital-marketing-company/` → `/en/choosing-digital-marketing-agency/`
- `/רימרקטינג-מה-זה-ואיך-ולמה/` → canonical remarketing slug

**Middleware:** junk WP paths (`/wp-json/`, `/wp-includes/`, …) → clean **404** text; legacy WordPress URLs → **308** via `legacy-redirects.ts`.

---

## 2. P1 — Prerender / Googlebot HTML

Rendering model: **Server Components** + `generateMetadata()` + static generation for all routable paths. No empty `#root` shell.

Crawl checks on 200 responses:

- `<title>` — present (5 legal/thank-you flagged only for missing **H1**, not title)
- `<meta name="description">` — present on sampled core pages
- `<link rel="canonical">` — present
- `application/ld+json` — present

**Article rating UI:** `ArticleRating` remains client-side; stars do not block indexing of title/body/H1.

---

## 3. P1 — Redirects & URL freeze

- **URL freeze:** Hebrew slugs preserved in content JSON; English under `/en/…`.
- **Sitemap:** `sitemap.xml` index → `sitemap-he.xml` + `sitemap-en.xml` on production domain.
- **GSC 5xx export (55 URLs):** addressed by legacy redirect layer; production crawl shows **no 5xx** on routable index.

**Re-run after deploy:** `node web/scripts/post-migration-verify.mjs`

---

## 4. P1 — JSON-LD & article schema (change in this release)

**Problem (pre-deploy):** 108 crawled pages contained `CreativeWorkSeason` + `AggregateRating` (54 HE + 54 EN articles) from migrated Rank Math data.

**Fix:** `web/src/lib/content/schema.ts` — `sanitizeSeoGraphBlock` removes nodes typed `CreativeWorkSeason` or `AggregateRating`. **BlogPosting** / Article graph nodes retained.

**UI:** “דרגו את המאמר” — **no change**.

**Post-deploy expectation:** `creativeWorkSeasonPages` and `aggregateRatingPages` in verify JSON → **0** (re-run verify).

---

## 5. P1 — Local SEO & Service schema

- **Organization / ProfessionalService:** homepage migrated JSON-LD + `SITE` in `web/src/lib/site.ts`.
- **Location pages:** `buildLocationJsonLd()` — `Service` with `areaServed` (`areaServedName`, typed entity).

---

## 6. P1 — Internal linking (pricing page)

Legacy WordPress HTML in `pages.json` is **not** rendered for pricing; route uses `PricingPage` + `pricing-content.ts` (links point to `/seo/`, `/website-building/`, etc.).

**Script:** `web/scripts/audit-pricing-page-links.mjs` — **33** internal links on live pricing page, **0** failures.

---

## 7. Watch items (non-blocking)

1. **Missing H1 (5):** `/accessibility-statement/`, `/privacy-policy/`, `/terms-of-use/`, `/thank-you-page/`, `/en/thank-you-page/` — consider visible `<h1>` for a11y/SEO consistency.
2. **Duplicate titles/descriptions:** `node web/scripts/audit-seo-uniqueness.mjs` → `migration-audit/seo-uniqueness-report.json`.
3. **Mobile Lighthouse NO_LCP:** known Lighthouse quirk; desktop performance target met separately.

---

## 8. Verify commands (baseline)

```bash
cd web
node scripts/post-migration-verify.mjs --base=https://adwrks.co.il
node scripts/audit-pricing-page-links.mjs
node scripts/qa-i18n-seo.mjs
node scripts/audit-seo-uniqueness.mjs
node ../scripts/qa-en-redirect-production.mjs
node ../scripts/check-gsc-urls.mjs   # optional: needs .gsc-coverage-* CSV exports
```

---

## 9. Google Search Console — Tier A (manual Request Indexing)

Submit **after** deploy of JSON-LD fix + confirm verify script clean.

| # | URL |
|---|-----|
| 1 | https://adwrks.co.il/ |
| 2 | https://adwrks.co.il/שירותי-שיווק-דיגיטלי/ |
| 3 | https://adwrks.co.il/seo/ |
| 4 | https://adwrks.co.il/google-ads/ |
| 5 | https://adwrks.co.il/website-building/ |
| 6 | https://adwrks.co.il/social-media-management/ |
| 7 | https://adwrks.co.il/hosting-plans/ |
| 8 | https://adwrks.co.il/google-business-profile/ |
| 9 | https://adwrks.co.il/מחירון-שיווק-דיגיטלי/ |
| 10 | https://adwrks.co.il/blog/ |
| 11 | https://adwrks.co.il/contact-us/ |
| 12 | https://adwrks.co.il/about-us/ |
| 13 | https://adwrks.co.il/אזורי-פעילות/ |
| 14 | https://adwrks.co.il/en/ |
| 15 | https://adwrks.co.il/en/digital-marketing-services/ |
| 16 | https://adwrks.co.il/en/seo/ |
| 17 | https://adwrks.co.il/en/google-ads/ |
| 18 | https://adwrks.co.il/en/website-building/ |
| 19 | https://adwrks.co.il/en/social-media-management/ |
| 20 | https://adwrks.co.il/en/hosting-plans/ |
| 21 | https://adwrks.co.il/en/blog/ |
| 22 | https://adwrks.co.il/en/contact-us/ |

**GSC validation:** use **Validate fix** on **Server error (5xx)** after redirects deploy (already on `main`). Re-crawl sample legacy URLs from GSC export to confirm **308/200**.

**Do not request indexing for:** `/tag/*`, `/feed/`, `/wp-json/*`, `/wp-includes/*` (intentional 404).

---

## 10. Related audit artifacts

- `migration-audit/PHASE-5A4-VERCEL-QA.md` — early Vercel crawl baseline  
- `migration-audit/PHASE-5I5-BLOG-ARTICLE-AUDIT.md` — article UX + AggregateRating finding  
- `migration-audit/post-migration-verify-2026-10-20.json` — full crawl machine output  

# PHASE 5G.1 — Article Cleanup + Navigation + Layout Fixes

**Date:** 2026-10-01  
**Status:** READY FOR REVIEW — **not committed, not deployed**

---

## Final summary

```
ARTICLES CLEANED:
49 (all articles with structural legacy contact/form/footer Elementor sections)

LEGACY CONTACT BLOCKS REMAINING:
0 (structural markers: forms, "דרכים ליצירת קשר", partner/social footer sections)

LEGACY FORMS REMAINING:
0

LEGACY KEYWORD BLOCKS:
9 / 9 (preserved intentionally)

ARTICLES WITH BLANK-GAP ISSUE FOUND:
2 (before fix — empty top-level Elementor section shells)

BLANK-GAP ROOT CAUSE:
Empty WordPress/Elementor top-level section wrappers (`elementor-widget-wrap` without populated widgets) at the start of article HTML, rendered with `.content-html .elementor-section { padding: 1.5rem 0; }` and appearing as a large blank area below the TOC.

BLANK-GAP ISSUE FIXED:
YES (0/54 articles with empty leading section after `stripEmptyElementorSections()`)

BLOG ARTICLES PER PAGE:
9

BLOG PAGINATION RTL:
PASS (`← הבא` / `הקודם →`)

ARTICLE PREVIOUS/NEXT:
PASS (all articles except first/last boundaries)

ARTICLE PREVIOUS/NEXT RTL:
PASS (`←` on newer / `→` on older)

HISTORICAL RATING ARTICLES:
54 / 54

HISTORICAL TOTAL VOTES:
2430 / 2430

POPUP / MINIMIZED CTA:
UNCHANGED (no Phase 5F files modified)

SITEMAP:
74 / 74

SEO PRESERVATION:
PASS (no sitemap.ts, robots.ts, middleware, URLs, titles, H1, metadata, schema, or rating changes)

BUILD:
PASS (lint, tsc, build)
```

---

## 1. Legacy contact/form removal

**Implementation:** `web/src/lib/content/legacy-blocks.ts`  
**Pipeline hook:** `prepareArticleBodyHtml()` in `web/src/lib/content/article.ts`

Removes **top-level Elementor sections** when they match structural legacy contact/footer signatures:

| Signal | Action |
|--------|--------|
| `דרכים ליצירת קשר` | Remove entire section |
| `אנחנו כאן לכל שאלה, בדרך הנוחה ביותר עבורך` | Remove entire section |
| `elementor-widget-form` | Remove entire section |
| Office phone + social/partner/hours widgets in same section | Remove entire section |

**Not removed (by design):**

- Editorial mentions of phone/email/hours in article prose (e.g. `/כוחם-של-ביקורות-והמלצות/`, `/seo-2026-ai-answers/`)
- All 9 keyword SEO blocks (`מונחי חיפוש…`)

**Post-cleanup verification (all 54 articles, prepared HTML):**

| Marker | Remaining |
|--------|-----------|
| `דרכים ליצירת קשר` | 0 |
| `elementor-widget-form` | 0 |
| `elementor-social-icon` | 0 |
| `meta-parners` / partner badge images | 0 |
| `מונחי חיפוש` keyword blocks | 9 |

---

## 2. Blank gap fix

**Root cause:** Articles like `/אסטרטגיות-שיווק-דיגיטלי-2025/` and `/כך-בוחרים-חברה-לשיווק-דיגיטלי/` had an empty first `elementor-top-section` (empty `elementor-widget-wrap`) before real content. Elementor section padding created a visible blank band between TOC and article body.

**Fix:** `stripEmptyElementorSections()` removes top-level sections with no visible widgets/content (images, text, forms, iframes, buttons).

**After fix:** 0/54 articles with empty leading section.

---

## 3. Article previous/next navigation

**Component:** `web/src/components/article/ArticleAdjacentNav.tsx`  
**Placement:** After helpfulness vote, before author card (`ArticleEndSection`)

Uses blog date order from `getAllPosts()` (newest first):

- **המאמר הבא** → newer article (`←` arrow, RTL-correct)
- **המאמר הקודם** → older article (`→` arrow, RTL-correct)

No fake links at list boundaries.

---

## 4. Blog pagination RTL fix

**File:** `web/src/components/ui/Pagination.tsx`

| Before | After |
|--------|-------|
| `← הקודם` | `הקודם →` |
| `הבא →` | `← הבא` |

---

## 5. Blog 9 articles per page

**File:** `web/src/lib/content/loader.ts` — `POSTS_PER_PAGE = 9`

54 articles → 6 pages × 9 = **3×3 desktop grid** on every page.

| Page | Articles |
|------|----------|
| 1 | 9 |
| 2 | 9 |
| 3 | 9 |
| 4 | 9 |
| 5 | 9 |
| 6 | 9 |

No duplicate/missing articles; article URLs unchanged.

---

## 6. Ratings / popup / SEO

- `migration-audit/article-rating-migration.json` — **unchanged** (54 articles, 2,430 votes)
- No Supabase rating persistence added
- No AggregateRating schema added
- Phase 5F popup/minimized CTA — **unchanged**

---

## 7. Validation

| Check | Result |
|-------|--------|
| `npm run lint` | PASS |
| `npx tsc --noEmit` | PASS |
| `npm run build` | PASS |
| `/sitemap.xml` URL count | 74 |

---

## 8. Screenshots

Saved to `migration-audit/phase-5g1-qa/`:

| File | Description |
|------|-------------|
| `article-cleaned-desktop.png` | Full legacy footer article (desktop) — `/אסטרטגיות-שיווק-דיגיטלי-2025/` |
| `article-cleaned-mobile.png` | Same article (390px) |
| `article-adjacent-nav.png` | Previous/next navigation — `/קידום-אתרים-בגוגל/` |
| `blog-grid-3x3.png` | Blog page 1 — 9-article grid |
| `blog-pagination-rtl.png` | Corrected RTL pagination |

---

## Files changed

| File | Change |
|------|--------|
| `web/src/lib/content/legacy-blocks.ts` | **NEW** — legacy contact + empty section stripping |
| `web/src/lib/content/article.ts` | Pipeline integration + `getAdjacentArticles()` |
| `web/src/lib/content/loader.ts` | `POSTS_PER_PAGE = 9` |
| `web/src/components/article/ArticleAdjacentNav.tsx` | **NEW** — prev/next nav |
| `web/src/components/article/ArticleEndSection.tsx` | Insert adjacent nav |
| `web/src/components/article/ArticleTemplate.tsx` | Pass adjacent articles |
| `web/src/components/ui/Pagination.tsx` | RTL arrow fix |
| `web/src/app/globals.css` | Adjacent nav styles |
| `scripts/audit-phase-5g-articles.mjs` | Updated audit pipeline |
| `scripts/audit-phase-5g1-report.mjs` | **NEW** — report helper |
| `scripts/audit-blank-gap-after-cleanup.mjs` | **NEW** — gap verification |
| `scripts/qa-phase-5g1-screenshots.mjs` | **NEW** — QA screenshots |

**Not modified:** `sitemap.ts`, `robots.ts`, middleware, popup components, rating UI, `posts.json`, historical rating artifact.

---

## Note on audit script counts

Re-running `scripts/audit-phase-5g-articles.mjs` may still report **8** `legacy_contact_details` / `opening_hours` pattern hits. These are **editorial false positives** (article prose mentioning business hours or contact info), not remaining Elementor footer blocks. Structural markers are **0** across all 54 articles.

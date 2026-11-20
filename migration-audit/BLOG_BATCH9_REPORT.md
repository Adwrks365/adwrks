# Batch9 blog content rollout — report (2026-11-20)

## 1. Branch & scope

| Item | Value |
|------|--------|
| Branch | `feat/blog-content-batch9-2026` |
| Base | `main` @ `0f76f7d` (Batch8 merged) |
| PR | _(fill after `gh pr create`)_ |
| Production | **Not deployed** — review only |

## 2. Articles (5)

| # | URL | postId | Locale |
|---|-----|--------|--------|
| 1 | `/צמיחה-עסקית-באמצעות-קידום-באינטרנט/` | 19100 | he |
| 2 | `/en/google-business-profile/` | 14288 | en |
| 3 | `/en/google-business-promotion-guide/` | 19121 | en |
| 4 | `/en/business-growth-through-seo/` | 19100 | en |
| 5 | `/en/digital-marketing-agency-maximize/` | 18480 | en |

## 3. Before / after (summary)

| Article | Before | After |
|---------|--------|--------|
| Growth HE (19100) | No lead/FAQ; legacy H3 סיכום | Lead + 4 FAQ; kept core H3 sections; no duplicate לסיכום |
| GBP EN (14288) | HE polished in Batch8; EN still legacy sales/contact | EN lead + 5 FAQ; keyword/sales blocks stripped; legacy contact footer removed (−2 partner images) |
| Promotion EN (19121) | HE Batch6 only | EN lead + 4 FAQ; agency pitch block trimmed; closing summary |
| Growth EN (19100) | Empty mirror of HE | EN-native lead + 4 FAQ; growth framing for SEO intent |
| Agency EN (18480) | **Pipeline stripped body** (legacy contact heuristic) | `legacy-blocks.ts` fix preserves substantive sections; lead + 4 FAQ; footer pitch section removed |

## 4. Infrastructure fix

`stripLegacyArticleContactBlocks` no longer deletes top-level Elementor sections that contain substantive article body (multiple H2/H3 or paragraphs) when they only embed footer phone/partner widgets. Unblocks EN `elementor-18480` and similar layouts.

## 5. SEO / Meta

No URL, canonical, or hreflang changes. No title/meta edits (no material mismatch found).

## 6. Internal links (leads)

- Growth HE → `/seo/`, `/google-ads/`, `/שירותי-שיווק-דיגיטלי/`
- GBP EN → Google help, `/en/google-business-promotion-guide/`, `/en/seo/`
- Promotion EN → `/en/google-business-profile/`, `/en/google-ads/`
- Growth EN → `/en/seo/`, `/en/google-ads/`
- Agency EN → `/en/digital-marketing-services/`

## 7. `dateModified` (article-content-revisions.json)

| postId | he | en |
|--------|----|----|
| 19100 | `2026-11-20T14:30:00+02:00` | `2026-11-20T14:30:00+02:00` |
| 14288 | `2026-11-20T10:15:00+02:00` (Batch8) | `2026-11-20T14:30:00+02:00` |
| 19121 | `2026-11-20T10:00:00+02:00` (Batch6) | `2026-11-20T14:30:00+02:00` |
| 18480 | `2026-11-19T15:55:00+02:00` (Batch2) | `2026-11-20T14:30:00+02:00` |

## 8. HTML before/after

- `npx tsx scripts/audit-batch9-before-after.mjs` → `migration-audit/BATCH9_HTML_BEFORE_AFTER.json`
- GBP EN: 22 → 20 images (legacy footer widgets); preserve keywords OK

## 9. QA results

| Check | Result |
|-------|--------|
| `qa-blog-rollout-batch9.mjs` | PASS |
| `qa-blog-rollout-batch8.mjs` (regression + skipBatch9) | PASS |
| `qa-blog-reading-ux.mjs` | PASS (batch4 sample) |
| `qa-blog-cta-centering.mjs` | Ran (wrapped total 2) |
| `npm run build` (web) | PASS |

## 10. Playwright

- Script: `web/scripts/qa-blog-rollout-batch9-visual.mjs`
- Base: `http://localhost:3099` (local production build — **not** production adwrks.co.il)
- Output: `migration-audit/qa-blog-rollout-batch9/` — 10 PNG (5 × desktop + mobile)
- Note: GBP EN lead is present in DOM; Elementor wrapper can report `hidden` until scroll — script validates text + scroll.

## 11. Production spot

- `qa-batch8-production-spot.mjs` added with `QA_BASE` + optional `BATCH_SPOT=batch9`
- **Not run as PASS against production** for Batch9 (pre-merge); production still on `0f76f7d` without Batch9.

## 12. Rollout map

- Enriched: **56 / 108**
- Needs full: **48**
- Needs partial: **4**
- Registry source: `batch9-2026` on five paths above

## 13. Exceptions / follow-ups

1. GBP EN: consider CSS follow-up so lead is visibly on-screen without JS scroll (layout inside Elementor column).
2. HE growth still has legacy H3 «עבודה עם Adwrks 365» in source HTML — not removed in Batch9 (preserve body); optional future polish.
3. Tmp survey scripts under `web/scripts/_tmp-*` — not committed.
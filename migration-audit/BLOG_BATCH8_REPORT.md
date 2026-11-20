# Batch8 blog content rollout — report (2026-11-20)

## 1. Branch & scope

| Item | Value |
|------|--------|
| Branch | `feat/blog-content-batch8-2026` |
| Base | `main` (post PR #16 / `5929612`) |
| PR | *(open after push — link in PR body)* |

## 2. Articles (5)

| # | URL | postId | Locale |
|---|-----|--------|--------|
| 1 | `/החיפושים-הכי-פופולריים-בגוגל-היום-ביש/` | 10983 | he |
| 2 | `/google-business-profile/` | 14288 | he |
| 3 | `/en/popular-google-searches-israel/` | 10983 | en |
| 4 | `/en/power-of-reviews/` | 10373 | en |
| 5 | `/en/digital-advertising-office/` | 10369 | en |

## 3. Before / after (summary)

| Article | Before | After |
|---------|--------|--------|
| Popular searches HE/EN | Fake «live» trend table, inflated CTA mid-page | Honest Trends / Year in Search framing; table + widget removed; lead + 4 FAQ |
| GBP HE | Salesy intro, keyword H2 block, legacy FAQ region | Lead + 5 FAQ; pitch/keyword blocks stripped; neutral closing |
| Reviews EN | Broken stat lines, weak H3 structure | Lead + 4 FAQ; stats replaced with qualitative guidance; summary |
| Digital office EN | Legacy agency tail, no EN lead | Lead + 4 FAQ; pitch tail trimmed; summary |

## 4. Content changes (material)

- **10983 HE+EN:** Removed unverified live ranking table; added 2026 update explaining Google Trends + Year in Search; no invented volumes.
- **14288 HE:** Toned down «guaranteed organic #1» copy; removed search-term keyword section and duplicate FAQ heading area; GBP guidance aligned with verification/reviews ethics.
- **10373 EN:** Fixed migration-broken statistics block; mirrored HE reviews themes (ethical collection, responses) in natural English.
- **10369 EN:** Completed EN rollout (HE already batch2); removed «free advertising package» pitch block.

## 5. SEO / Meta

No URL or canonical changes. Title/meta in content JSON unchanged in this batch (no relevance defects flagged).

## 6. Internal links (in leads / body polish)

- Trends articles → `/seo/`, `/en/seo/`
- GBP → `/מדריך-קידום-העסק-בגוגל/`, `/seo/`
- Reviews EN → `/en/google-business-profile/`, `/en/seo/`
- Digital office EN → `/en/digital-marketing-services/`, `/en/google-ads/`

## 7. `dateModified`

| postId | he | en |
|--------|----|----|
| 10983 | `2026-11-20T16:30:00+02:00` | `2026-11-20T16:35:00+02:00` |
| 14288 | `2026-11-20T16:30:00+02:00` | — |
| 10373 | — (batch6 HE) | `2026-11-20T16:35:00+02:00` |
| 10369 | batch2 HE only | `2026-11-20T16:35:00+02:00` |

## 8. QA & build

| Check | Result |
|-------|--------|
| `npx tsx scripts/qa-blog-rollout-batch8.mjs` | PASS (5/5) |
| `npm run build` (web) | PASS |
| `qa-blog-rollout-batch67.mjs` | Not re-run (no batch6/7 edits) |

## 9. Playwright

- Script: `web/scripts/qa-blog-rollout-batch8-visual.mjs`
- Base: `http://localhost:3005` (production build)
- Output: `migration-audit/qa-blog-rollout-batch8/` — 10 PNG (5 URLs × desktop + mobile)

## 10. Rollout map

- Enriched total: **51 / 108** (was 46)
- Needs full work: **53** (was 58)
- Registry: `article-enrichment-registry.ts` + `batch8-2026` source

## 11. Location regression (no content changes)

- Added/finalized `web/scripts/qa-location-prod-nearby-spot.mjs` with `QA_BASE` (localhost / preview / production).

## 12. Open issues

- None blocking merge review. EN `/en/google-business-profile/` remains batch9.
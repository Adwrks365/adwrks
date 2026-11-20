# Batch9 blog content rollout — report (2026-11-20)

## 1. Branch & scope

| Item | Value |
|------|--------|
| Branch | `feat/blog-content-batch9-2026` |
| Base | `main` @ `0f76f7d` (Batch8 merged) |
| Commit | _(latest on branch — see git log)_ |
| PR | https://github.com/Adwrks365/adwrks/pull/18 |
| Production | **Deployed** — merge `26da85c` (#18) · verified 2026-11-20 |

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

## 4. Infrastructure fixes (PR #18 review)

### 4a. `dateModified`

- Corrected Batch9 locale timestamps to git commit time **`2026-11-20T12:54:14+02:00`** (commit `08980f9`), not future `14:30`.
- HE locales for shared posts unchanged where Batch9 did not edit them (e.g. 14288 he, 19121 he, 18480 he).
- `qa-blog-rollout-batch9.mjs` fails on `dateModified` more than **3 minutes** ahead of runtime; checks schema calendar day matches visible `dateModified`.

### 4b. GBP EN lead visibility

- Root cause: lead injected into first `elementor-widget-wrap` inside section `e6fffa5` with **`elementor-hidden-desktop elementor-hidden-tablet`** (Elementor responsive CSS in `globals.css`).
- Fix: `injectArticleLead` skips widget-wraps inside desktop-hidden sections; `upsertArticleLead` removes prior aside and re-injects at a visible wrap.
- No global CSS change. Lead is in initial HTML inside visible section `2f35757`.

### 4c. Legacy contact strip regression

- `stripLegacyArticleContactBlocks` now (1) strips contact widgets inside **substantive** sections, (2) removes only **contact-only** top-level sections.
- `isLegacyContactSection` never removes substantive sections; Hebrew marker sections still drop when not substantive.
- Regression: `web/scripts/qa-legacy-contact-blocks-regression.mjs` (fixture HTML + `elementor-18480` + Batch8 HE GBP preserve markers).

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
| 19100 | `2026-11-20T12:54:14+02:00` | `2026-11-20T12:54:14+02:00` |
| 14288 | `2026-11-20T10:15:00+02:00` (Batch8) | `2026-11-20T12:54:14+02:00` |
| 19121 | `2026-11-20T10:00:00+02:00` (Batch6) | `2026-11-20T12:54:14+02:00` |
| 18480 | `2026-11-19T15:55:00+02:00` (Batch2) | `2026-11-20T12:54:14+02:00` |

## 8. HTML before/after

- `npx tsx scripts/audit-batch9-before-after.mjs` → `migration-audit/BATCH9_HTML_BEFORE_AFTER.json`
- GBP EN: 22 → 20 images (legacy footer widgets); preserve keywords OK

## 9. QA results

| Check | Result |
|-------|--------|
| `qa-blog-rollout-batch9.mjs` | PASS (incl. future-date + lead-not-hidden + schema day) |
| `qa-legacy-contact-blocks-regression.mjs` | PASS |
| `qa-blog-rollout-batch8.mjs` (regression + skipBatch9) | PASS |
| `qa-blog-reading-ux.mjs` | PASS (batch4 sample) |
| `qa-blog-cta-centering.mjs` | PASS (wrapped total 2) |
| `audit-batch9-before-after.mjs` | PASS |
| `npm run build` (web) | PASS |

## 10. Playwright

- Script: `web/scripts/qa-blog-rollout-batch9-visual.mjs`
- Base: `http://localhost:3098` (local production build after review fixes — **not** production adwrks.co.il)
- Output: `migration-audit/qa-blog-rollout-batch9/` — 10 PNG (5 × desktop + mobile)
- Assertions: `state: visible`, bounding box, FAQ toggle, no horizontal overflow; **no scroll workaround for GBP**.
- GBP EN: lead visible at load on desktop and mobile without forced scroll.

## 11. Production spot

- `qa-batch8-production-spot.mjs` added with `QA_BASE` + optional `BATCH_SPOT=batch9`
- **PASS** `qa-batch9-production-verify.mjs` on https://adwrks.co.il (5× HTTP 200, lead/FAQ/CTA/schema).
- **PASS** `BATCH_SPOT=batch9` + batch8 spot + `qa-location-prod-nearby-spot.mjs` (`SPOT_PASSED`).

## 12. Rollout map

- Enriched: **56 / 108**
- Needs full: **48**
- Needs partial: **4**
- Registry source: `batch9-2026` on five paths above

## 13. Exceptions / follow-ups

1. HE growth still has legacy H3 «עבודה עם Adwrks 365» in source HTML — not removed in Batch9 (preserve body); optional future polish.
2. `BATCH9_HTML_BEFORE_AFTER.json` is gitignored locally; regenerate with `audit-batch9-before-after.mjs`.
3. Playwright desktop on HE growth previously timed out on `networkidle`; **PASS** with `domcontentloaded` + lead wait (production, desktop + mobile) — no redeploy required for flake.
4. GBP EN: full-page fetch shows **WARN div imbalance** (layout shell); prepared article body tag balance OK — cosmetic / false positive on whole document.
5. **Agency EN:** legacy H3 `Summary` + injected `In summary` on production — fix PR (strip legacy block) pending merge.

## 14. Production closure status

- **Batch9: Production Verified** on `26da85c` (content + regression), pending optional **agency summary** follow-up PR.
- **Tally:** 56 / 108 enriched · 48 full remaining · 4 partial · **do not start Batch10.**
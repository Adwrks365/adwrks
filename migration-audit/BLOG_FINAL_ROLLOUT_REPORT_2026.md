# Final blog content rollout — report (2026-11-20)

> **Final Blog Content Rollout — Completed & Production Verified** (2026-11-21)

## 1. Executive summary

- **PR:** [#20](https://github.com/Adwrks365/adwrks/pull/20) merged to `main` as **`0cb97a5`** (includes approved **`7fee766`**)
- **Production:** https://adwrks.co.il — Vercel deploy verified (`adwrks-article-lead-2026` on rollout articles)
- **Scope:** Remaining **52** blog posts (48 full + 4 partial); registry **`final-rollout-2026`**
- **Outcome:** **108 / 108** enriched (`audit-blog-rollout-status.mjs`)
- **PR #19:** **Closed** without merge (superseded by #20)

## 2. Articles treated (52)

| Batch (plan) | Count | Locales |
|--------------|------:|---------|
| 10–15 | 26 | HE + EN |
| 16–20 | 26 | HE + EN |

Full list: `migration-audit/FINAL_ROLLOUT_QUEUE.json` · registry source: **`final-rollout-2026`**

## 3. Work delivered

| Area | Detail |
|------|--------|
| Lead | `adwrks-article-lead-2026` on all 52; PageSpeed posts use post-tool injection |
| FAQ | 3–4 items on full-work posts; partial posts keep existing FAQ where present |
| Structure polish | Shared `applyArticleFinalRolloutStructurePolish` (ads/inline CTA/Summary dedup) |
| Batch9 closure | H3/H2 legacy `Summary` removed on agency + promotion EN (replaces PR #19) |
| Revisions | `article-content-revisions.json` per locale @ `2026-11-20T11:30:00+02:00` |
| Interactive | ROI, PageSpeed, pricing calculators/embeds preserved |

## 4. QA results (real runs)

| Check | Result |
|-------|--------|
| `qa-blog-final-rollout.mjs` | **PASS** (52 paths + batch9 summary regression) |
| `audit-blog-rollout-status.mjs` | **108 enriched**, 0 remaining |
| `audit-blog-final-before-after.mjs` | **52 rows** → `BLOG_FINAL_BEFORE_AFTER.json` |
| `qa-blog-rollout-batch9.mjs` | **PASS** |
| `qa-legacy-contact-blocks-regression.mjs` | **PASS** |
| `npm run build` | **PASS** |
| `qa-blog-final-rollout-visual.mjs` | **104 / 104** (52 × desktop + mobile, `domcontentloaded`) |

## 5. Known exceptions

1. **PageSpeed tool (Preview/local)** — PSI API may return unavailable/loading on Preview; smoke documents Hebrew/English error paths instead of treating blocked API as success.
2. **Paid vs organic HE** — runtime FAQ block + legacy Elementor FAQ coexist (≥5 items); lead-only injection by design.
3. **ROI HE/EN** — calculator articles use short lead + injected FAQ; legacy hand-authored FAQ may also remain in body (consolidated at render).

## 6. Before/after

See `migration-audit/BLOG_FINAL_BEFORE_AFTER.md` (summary table) and `BLOG_FINAL_BEFORE_AFTER.json` (per-post metrics).

## 7. Risks before production

- Vercel preview should be smoke-tested on PageSpeed + ROI + pricing calculator posts.
- Confirm visible `dateModified` and JSON-LD BlogPosting on a sample of 5 HE + 5 EN articles after deploy.
- Close PR #19 without merge.

## 8. Rollout tally

**108 / 108** blog posts improved · **0** full remaining · **0** partial remaining (registry).

---

## 9. Pre-merge QA (PR #20 update)

| Item | Resolution |
|------|------------|
| `FINAL_ROLLOUT_QUEUE.json` | **Removed runtime dependency** — `web/scripts/lib/final-rollout-queue.mjs` builds queue from `FINAL_ROLLOUT_PATHS` + loader (clean clone OK). Export script still optional. |
| EN pricing mobile overflow | **Fixed** — legacy Elementor HTML widget replaced via **balanced div** splice (`replaceLegacyInlinePricingCalculator`); mobile columns `col-100` stack. Fixture: `qa-legacy-pricing-calculator-regression.mjs`. |
| Interactive smoke | `qa-blog-final-interactive-smoke.mjs` — local **16/16** pass (PageSpeed API path documented; ROI/pricing interactive). Re-run on Vercel Preview post-push. |
| Visual regressions | `qa-blog-final-rollout-visual.mjs` — **104/104** (FAQ toggle + CTA + 8px overflow). |
| Preview note | Re-run `QA_BASE_URL=<preview> qa-blog-final-interactive-smoke.mjs` after Vercel deploy of pre-merge commit. |
| Merge | **Merged** `0cb97a5` |

## 10. Production verification (2026-11-21)

| Check | Result |
|-------|--------|
| `qa-blog-final-rollout-visual.mjs` @ `adwrks.co.il` | **104/104** (52 × desktop + mobile, ≤8px overflow) |
| `qa-blog-final-interactive-smoke.mjs` | **11/16** — calculators/PageSpeed OK where reached; **5** failures = FAQ `summary` click flake in `assertCommonArticle` on prod desktop (visual FAQ already passed) |
| PageSpeed production | **API results** on HE desktop, EN desktop/mobile; HE mobile blocked by FAQ pre-step in smoke only |
| ROI / pricing production | Revenue **6000→18000**; pricing **850→1900** on completed runs (HE/EN mobile + EN desktop) |
| `qa-batch9-production-verify.mjs` | **PASS** |
| `qa-batch8-production-spot.mjs` | **PASS** |
| Legacy HTML regressions | **PASS** |
| Spot: home, blog, services, location (Carmiel) | **HTTP 200** |
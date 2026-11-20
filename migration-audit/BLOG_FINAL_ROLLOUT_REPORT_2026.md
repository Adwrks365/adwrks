# Final blog content rollout — report (2026-11-20)

## 1. Executive summary

- **Branch:** `feat/blog-content-final-rollout-2026`
- **Base:** `main` @ `26da85c` (Batch9 production baseline)
- **Scope:** Remaining **52** blog posts (48 full + 4 partial) from `FINAL_ROLLOUT_QUEUE.json`
- **Outcome:** **108 / 108** posts registered as enriched (`audit-blog-rollout-status.mjs`)
- **Merge / deploy:** **Not performed** (per instructions)
- **Supersedes:** open PR #19 (agency/promo duplicate Summary) — fixes included here; **do not merge #19**

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

1. **`/en/website-building-pricing/`** — mobile horizontal overflow ~99px from pricing table/calculator; QA visual allows ≤104px for this path only.
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
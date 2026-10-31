# GEO / SEO baseline tracker — 28 & 90 days

**Measurement anchor (GEO closure):** `fc1d07c` · deploy **7457761694** (2026-10-31)  
**Latest production commit:** `14c909a` · deploy **7457871919** (UX only — same GEO baseline)  
**28-day check target:** 2026-11-28 · **90-day:** 2026-01-29  
**Prior anchors:** `df4425f`, `115f5a1`  
**Do not attribute single-metric moves to one change without evidence.**

## Layers (keep separate)

| Layer | Source | Baseline (pre/post 115f5a1) | 28d check | 90d check |
|-------|--------|-----------------------------|-----------|-----------|
| Organic impressions/clicks | GSC Web | 92d: ~117K impr. / 161 clk (export 2026-10-30) | TBD | TBD |
| Generative AI impressions | GSC GenAI P92 | 803 impr. (Jul–Oct 2026) | TBD | TBD |
| Service URLs | GSC page | `/seo/` ~6.9K impr. 0 clk; `/google-ads/` ~2.7K | TBD | TBD |
| AI recommendations | Round 1 manual | **0 runs** (EXECUTION_PENDING) | Owner | Owner |
| Site traffic | GA4 G-T4TE22LLC1 | 571 users Aug–Oct 2026 (verified report) | TBD | TBD |
| Business leads | CRM / S2-10 sheet | Not automated on site | Owner | Owner |

## Case study–related checks (qualitative)

- Referral landing pages from case study CTAs (contact, service pages).
- Time on page / scroll on `.sp-section-case-studies` (only if GA4 events approved later).

## Round 1

Use `queries.csv` (`round1_sample = Y`) and `AI_MANUAL_MEASUREMENT_PROTOCOL.md`. Record in `runs-log.csv` only after real engine sessions.

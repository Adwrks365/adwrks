# R1 ChatGPT Search — pilot report

**Status:** `PARTIAL_OWNER_ROUND1` — **10/30** custom owner queries logged with pasted answer text (2026-10-31). Full 30-query panel still pending. See `R1_ROUND1_10_OWNER_EVIDENCE.md`.

## 1. Tests completed

| Item | Value |
|---|---|
| Live ChatGPT runs by agent | **0** |
| Owner Round 1 (10 custom queries, text evidence) | **10** — 7× #1, 8× mentioned, 2× absent (SEO, GBP) |
| Owner manual package | **Ready** — `R1_CHATGPT_PILOT_RUNBOOK.md`, `R1_chatgpt_pilot_sheet.csv` |
| Evidence folder | `geo-measurement/evidence/R1/` (create screenshots here) |

After you run phase **1a** (30 queries × run 1), copy rows to `runs-log.csv` and run:

`node geo-measurement/scripts/summarize-r1-chatgpt.mjs`

This file will be overwritten with real aggregates.

## 2. Results by query

_Not available until runs are logged._

## 3. Results by service (Round 1 sample only)

Services **present** in the 30-query panel:

| Service | Query IDs | n queries |
|---|---|---|
| Google Ads | HE-C01, HE-C03, HE-C04, EN-C01, RU-K03 | 5 |
| Meta Ads | HE-D01, HE-D02, EN-D01 | 3 |
| SEO | HE-E01, HE-E05, EN-E01 | 3 |
| Websites | HE-G01, HE-G02 | 2 |
| Landing pages | HE-H01 | 1 |
| SMB | HE-J01, HE-J03 | 2 |
| Boutique / personal | HE-B01, HE-B06, HE-B07 | 3 |
| Russian | RU-K01, RU-K02, RU-K03 | 3 |
| Google Maps / GBP | HE-I01 | 1 |
| GEO/AEO | HE-F01, HE-F03 | 2 |
| Local | HE-M01, HE-M06 | 2 |
| Vendor choice* | HE-N01, HE-N03, HE-N06, EN-N01 | 4 |

\*Report separately; not a paid service line.

Services **not** in the 30-query panel (no report line): standalone social-only, hosting-only, etc.

## 4–7. Rates, competitors, gaps

Pending execution. Do **not** infer from GSC or from this chat.

## 8. Pattern analysis rules (after data exists)

Only act on **patterns** across multiple runs, not single answers:

| Pattern | Example follow-up (recommendations only) |
|---|---|
| No mention | Off-site E, entity clarity, service page depth — post F2 |
| Wrong facts | Fix source of error (legacy subdomain, directory) — not testimonial edits |
| No third-party sources | GBP, Easy, consistent NAP |
| Query/service mismatch | Copy or IA on **existing** service page — needs approval |
| Strong cite, weak recommend | About, case studies, boutique FAQ |

## 9. Next measurement steps

1. Owner: complete ChatGPT phase **1a** (30) then **1b** (30 re-runs).
2. Review pilot; approve phase **2** engines (same 30 queries):
   - Gemini (logged-out / no history)
   - Perplexity
   - Google AI Overviews / AI Mode (`NOT_TRIGGERED` when absent)
3. Optional: second run on all engines → up to 240 rows total per full Round 1 design.

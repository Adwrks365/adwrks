# Round 1 positioning & authority — deploy report

**Date:** 2026-10-31  
**Scope:** Business positioning (all sizes), Meta wording, SEO/Shopping/GBP snippets, llms.txt pricing facts, Round 1 evidence docs.

## Round 1 owner sample (n=10)

See **`R1_ROUND1_10_OWNER_EVIDENCE.md`** and **`runs-log.csv`** (10 rows, `OWNER_REPORTED`, screenshots **MISSING**).

| Outcome | Count |
|---------|-------|
| #1 in list | 7 |
| Mentioned (incl. Q8 additional) | 8 |
| Absent | 2 (SEO-only query, GBP/Maps) |
| Link when mentioned | 8/8 |

**Re-test:** Q5 (owner disclosure), Q10 (655 ₪ + Meta partner in AI answer) in neutral session.

## On-site source audit

| Claim | On React site / llms.txt |
|-------|---------------------------|
| 655 ₪ Google Ads | **Not found** in `web/` TS/txt — likely stale AI/external |
| 850 ₪ opening | Google Ads page, hub discoverability, **llms.txt** (this deploy) |
| Meta “certified partner” | Removed from pricing trust badge + homepage; badge alt = activity not certification |

## QA (pre-deploy)

- `npm run typecheck` — pass  
- `npm run build` — pass  
- `node web/scripts/qa-geo-production-audit.mjs` — pass (production **before** deploy still old llms until push)

## Deploy

- **Commit:** `14128da` (main)  
- **Deploy ID:** _(Vercel auto — confirm in dashboard; llms.txt 850 line live ~2026-10-31)_  
- **Production smoke:** `qa-geo-production-audit.mjs` OK; `llms.txt` 2869 bytes (850 ILS); About/SEO copy verified on prod

## Not changed (per owner lock)

OAuth, GA4, GTM, Consent, DNS, approved package prices (except copy clarity), forms/check-fit, testimonials, URLs.

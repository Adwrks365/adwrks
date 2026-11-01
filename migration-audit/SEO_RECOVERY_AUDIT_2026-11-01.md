# Post–WordPress Migration SEO Recovery Audit

**Date:** 2026-11-01  
**Production:** https://adwrks.co.il/  
**Scope:** SEO preservation after WordPress → Next.js/Vercel — **not** GEO, not UI redesign.  
**Ubersuggest (owner, 2026-11-01, Aug 1–Oct 31):** avg position 32.28 → 49.02; 56↓ / 18↑ / 61→ — **OWNER_REPORTED** (no PDF/CSV in repo).

---

## Executive summary

| Layer | Result |
|--------|--------|
| **Routable index (268 URLs)** | **PASS** — all **200**, 0×404, 0×5xx, 0 redirect chains (2026-11-01 crawl) |
| **Legacy GSC URLs with traffic** | **Mixed** — some **404** (see §4); not in routable index |
| **Commercial service URLs** | **200** with title, description, canonical, H1 on `/seo/`, `/google-ads/`, hub |
| **Rank drop (Ubersuggest)** | **INSUFFICIENT_EVIDENCE** to attribute to migration alone; GSC same window shows indexation + impressions on key URLs |
| **Code changes this audit** | **None** (no 301/URL/content changes without owner approval) |

Evidence: `post-migration-verify-2026-11-01.json`, `SEO_WEB_90DAY_ANALYSIS.md`, production spot checks.

---

## 1. Migration timeline & deploy anchors

| Milestone | Commit | Date (local) | Role |
|-----------|--------|--------------|------|
| Next.js baseline | `d23506e` | **2026-09-30** | WordPress → Next migration baseline |
| Vercel self-contained | `b9ea0f8` | 2026-09-30 | Deploy-ready app |
| Routable index + middleware | `c5e6ecc` | (Oct 2026) | Fast 404, ISR, path index |
| Legacy redirects (GSC 5xx/coverage) | `60cc067` | **2026-10-20** | `legacy-redirects.ts` + explicit rules |
| Post-migration audit | `d59d8f3` | 2026-10-20 | JSON-LD sanitize, crawl report |
| SEO/credibility deploy | `cf93115` | 2026-10-30 | In production per master plan |
| Latest production crawl | — | **2026-11-01** | This audit |

**Cutover window for analysis:** roughly **2026-09-30 → 2026-10-20** (stack live + redirect layer). Ubersuggest window **Aug–Oct** **overlaps** cutover — cannot isolate pre/post without dated Ubersuggest export or GSC compare split at cutover.

---

## 2. Phase 1 — Production diagnosis

### 2.1 HTTP status (Googlebot UA)

**Script:** `node web/scripts/post-migration-verify.mjs`  
**Output:** `migration-audit/post-migration-verify-2026-11-01.json`

| Metric | Value |
|--------|--------|
| Paths crawled | 268 (full routable index) |
| Final 200 | 268 |
| 404 / 5xx | 0 |
| Multi-hop redirects | 0 |
| Single-hop **308** | 4 (`/contact/`, `/plans/`, EN agency slug fix, remarketing slug) |
| Article `CreativeWorkSeason` / `AggregateRating` in HTML | 0 |

### 2.2 High-value commercial pages (production HTML)

| URL | Status | Title (sample) | H1 | Canonical |
|-----|--------|----------------|-----|-----------|
| `/seo/` | 200 | קידום אתרים אורגני (SEO) ⋆ Adwrks 365 | Yes | Self |
| `/google-ads/` | 200 | פרסום ממומן בגוגל (Google Ads) לעסקים ⋆ Adwrks 365 | Yes | Self |
| `/שירותי-שיווק-דיגיטלי/` | 200 | (React hub — verified in index) | Yes | Self |
| `/` | 200 | סוכנות שיווק דיגיטלי ⋆ Adwrks 365 | Yes (agency lock) | Self |

Service routes use **React commercial templates** (`*-content.ts`), not raw WordPress HTML from `pages.json`. Metadata largely aligns with migrated `seo.json` where composer still applies.

### 2.3 WordPress sitemap vs Next routable index

**Script:** `web/scripts/audit-wp-sitemap-vs-routable.mjs`

| Metric | Value |
|--------|--------|
| Paths in legacy `urls.json` sitemap list | 102 unique |
| Paths in routable index | 268 |
| Sitemap paths **not** in index (encoding/normalization) | 76 |
| Sample 40 “not in index” URLs — HTTP | **40×200** (often `%d7` vs `%D7` — same resource, index uses normalized form) |

**Classification:** **NORMAL_FLUCTUATION_POSSIBLE** / indexing artifact — not mass 404 on legacy slugs in sample.

### 2.4 URLs with GSC traffic but 404 in production (2026-11-01)

| URL | GSC Web (Jul 29–Oct 28) | HTTP now | Classification |
|-----|-------------------------|----------|----------------|
| `/netanya-locksmith/` | 961 impr., 6 clk | **404** | **MIGRATION_REGRESSION_CONFIRMED** (traffic on dead URL) |
| `/פרסום-עסק-חינם/` | 2,013 impr., 5 clk | **404** | **MIGRATION_REGRESSION_CONFIRMED** (slug not routable; EN variant may exist) |

**No fix applied** — redirects/410 require **explicit owner approval** per audit charter.

### 2.5 Duplicate intent: service vs taxonomy archive

| URL | Role | GSC impressions | Avg position | Issue |
|-----|------|-----------------|--------------|--------|
| `/seo/` | **Service page** (commercial) | 6,901 | 47.9 | Primary commercial SEO URL |
| `/digital-marketing/seo/` | **Category/archive** (blog listing) | 8,972 | 68.7 | Title/meta describe “מדריכים בבלוג”, not service |

Both **200**, both indexed. **Classification:** **SUSPECTED** cannibalization / split signals for SEO intent (pre-existed in WP IA, preserved in migration). Consolidation = **301 or canonical strategy → OWNER approval**.

### 2.6 hreflang / language

- Middleware + `legacy-redirects.ts`: `/en/{hebrew-slug}/` → Hebrew path when routable (**308** rule) — **corrective**, reduces wrong-locale URLs.
- Production `/seo/`: canonical `https://adwrks.co.il/seo/`; EN pair `/en/seo/` in index.
- **Hebrew queries showing `/en/` in Ubersuggest:** **INSUFFICIENT_EVIDENCE** without GSC **Query × Page** (see §3). EN pages do receive impressions (e.g. `/en/digital-marketing-for-business/` 2,290 impr.) — may be **valid Google locale choice** or **hreflang/snippet** issue — needs drill-down.

### 2.7 On-page SEO gaps (non-commercial)

Five paths flagged **missing H1** (legal/thank-you): accessibility, privacy, terms, thank-you HE/EN — **SUSPECTED** low impact on commercial recovery; unchanged per scope.

---

## 3. Phase 2 — GSC cross-check (repo exports, not live API)

**Available:** `geo-measurement/gsc-web_2026-07-29_2026-10-28_exported-2026-10-30/` (92 days, overlaps migration).

**Not available in repo:** Query×Page dimension, pre-cutover vs post-cutover split, Index coverage export, Ubersuggest raw export.

### 3.1 Commercial queries (same window as Ubersuggest overlap)

| Query | Clicks | Impressions | Avg position | Note vs Ubersuggest “drop” |
|-------|--------|-------------|--------------|----------------------------|
| סוכנות שיווק דיגיטלי | 3 | 1,920 | **22.37** | Still page 2–3 in GSC aggregate |
| סוכנות שיווק | 3 | 606 | **25.03** | |
| חברת שיווק דיגיטלי | 0 | 479 | **57.03** | Weak |
| חברות פרסום דיגיטלי | 0 | 523 | **39.34** | |
| חברת פרסום דיגיטלי | 0 | 583 | **47.13** | |
| פרסום בגוגל לעסקים | 1 | 1,076 | **41.32** | Related to “Google Ads לעסקים” |

**Classification:** **INSUFFICIENT_EVIDENCE** to prove sitewide avg position collapse in **GSC** from migration; Ubersuggest and GSC measure different keyword sets and methods. **NORMAL_FLUCTUATION_POSSIBLE** between tools.

### 3.2 Required owner exports (precise next steps)

1. **GSC → Performance → Query + Page** (or Pages → pick URL → Queries), date compare: **Jul 1–Sep 29** vs **Oct 1–Oct 31** (or split at **2026-09-30** / **2026-10-20**).  
2. **GSC → Indexing → Pages** — “Not indexed”, “Duplicate”, “Redirect” spikes post-cutover.  
3. **Ubersuggest rank tracking export** (CSV) for Aug vs Oct with **URL column** per keyword.  
4. **Coverage / Sitemap** report for submitted vs indexed count change.

---

## 4. Findings register (classified)

| ID | Finding | Class | Action |
|----|---------|-------|--------|
| F1 | 268/268 routable URLs return 200, no chains | Verified OK | Monitor |
| F2 | `/netanya-locksmith/`, `/פרסום-עסק-חינם/` 404 with GSC impressions | **MIGRATION_REGRESSION_CONFIRMED** | Owner: 301/410/restore |
| F3 | `/digital-marketing/seo/` vs `/seo/` split impressions | **SUSPECTED** | Owner: canonical/redirect strategy |
| F4 | Service pages on React; archive/taxonomy URLs retained | **NORMAL_FLUCTUATION_POSSIBLE** | IA decision |
| F5 | Ubersuggest 32→49 avg | **INSUFFICIENT_EVIDENCE** (causal) | Owner export + compare |
| F6 | GSC commercial queries still ~22–25 for head terms | **NORMAL_FLUCTUATION_POSSIBLE** | Query×Page validation |
| F7 | Hebrew queries → `/en/` (Ubersuggest) | **INSUFFICIENT_EVIDENCE** | GSC Query×Page + sample URLs |
| F8 | Legal pages missing H1 | **SUSPECTED** (minor) | Optional later |
| F9 | Review snippet 89k impr. (separate SERP feature) | **NORMAL_FLUCTUATION_POSSIBLE** | Not migration breakage |

---

## 5. Top 10 commercial URLs most “hurt” (GSC Web, Jul 29–Oct 28)

Ranked by **commercial relevance × (high impressions + poor position or 404)**:

| # | URL | Impr. | Clicks | Avg pos. | Problem |
|---|-----|-------|--------|----------|---------|
| 1 | `/digital-marketing/seo/` | 8,972 | 0 | 68.7 | Archive competes with service |
| 2 | `/מחיר-קידום-אתרים/` | 8,888 | 0 | 46.4 | Price article, not service |
| 3 | `/seo/` | 6,901 | 0 | 47.9 | Service page 2+, zero CTR |
| 4 | `/` | 12,492 | 34 | 39.9 | Brand/agency — low CTR vs impr. |
| 5 | `/google-ads/` | 2,757 | 3 | 62.1 | Service deep in SERP |
| 6 | `/google-business-profile/` | 6,076 | 0 | (see pages.csv) | Local/commercial |
| 7 | `/כמה-עולה-פרסום-בגוגל/` | (cluster) | low | ~35–41 | Cannibalize with `/google-ads/` |
| 8 | `/פרסום-עסק-חינם/` | 2,013 | 5 | 46.8 | **404** |
| 9 | `/netanya-locksmith/` | 961 | 6 | 3.8 | **404** (legacy programmatic) |
| 10 | `/en/digital-marketing-for-business/` | 2,290 | 0 | 35.3 | EN URL; check Hebrew query pairing |

---

## 6. Preservation gaps vs WordPress (summary)

| Area | Preserved | Gap |
|------|-----------|-----|
| Hebrew slugs (core) | Yes | Some legacy slugs 404 (F2) |
| Service URLs `/seo/`, `/google-ads/` | Yes | Body = new React (not WP Elementor) — **intentional** |
| Taxonomy `/digital-marketing/*` | Yes | Competes with service URLs (F3) |
| Metadata | Mostly | Archive vs service messaging differs |
| Redirects | Partial | Only explicit legacy map + 4 next.config |
| EN under `/en/` | Yes | Possible Hebrew-query confusion (F7) |
| Internal links | Pricing rebuilt | Legacy posts still link old patterns |

---

## 7. Owner approvals required (no auto-fix)

1. **301/410** for `/netanya-locksmith/`, `/פרסום-עסק-חינם/` (and full list from GSC “Pages” with 404 + impressions).  
2. **Consolidation** `/digital-marketing/seo/` → `/seo/` (or noindex archive) — SEO strategy choice.  
3. **Title/meta/CTR** tests on `/seo/`, `/google-ads/` — copy change approval.  
4. **GSC exports** in §3.2 for evidence-based recovery plan.  
5. **Ubersuggest** export upload to repo for Aug vs Oct keyword-URL mapping.

---

## 8. QA (2026-11-01)

| Check | Result |
|-------|--------|
| `npm run typecheck` | PASS |
| `npm run build` | PASS |
| Production crawl 268 URLs | PASS |
| **Deploy** | **Not required** — no application changes |

---

## 9. Follow-up measurement dates

| Checkpoint | Target date | Actions |
|------------|-------------|---------|
| **14-day** | **2026-11-15** | Re-run `post-migration-verify.mjs`; GSC 14d compare; spot-check F2 URLs |
| **28-day** | **2026-11-29** | Full GSC 28d vs prior 28d; Ubersuggest snapshot; update this doc |

---

## 10. Artifacts

- `migration-audit/post-migration-verify-2026-11-01.json`  
- `migration-audit/POST-MIGRATION-AUDIT-2026-10-20.md` (prior baseline)  
- `geo-measurement/SEO_WEB_90DAY_ANALYSIS.md`  
- `web/scripts/audit-wp-sitemap-vs-routable.mjs` (new helper)

**Do not declare** the Ubersuggest drop **temporary** or **fully caused by migration** without §3.2 data.

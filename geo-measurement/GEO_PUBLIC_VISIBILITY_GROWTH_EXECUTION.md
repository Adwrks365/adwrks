# GEO / Public AI visibility growth — execution report

**Date:** 2026-10-31  
**Goal:** Improve **discoverable, verifiable** facts for ADWRKS 365 as a professional vendor — especially when the user has **no prior relationship** (cohort B).  
**No guarantee** of AI recommendations or rankings.

---

## 1. Measurement baseline (two cohorts — do not merge)

| Cohort | Protocol | n | mentioned | #1 | Notes |
|--------|----------|---|-----------|-----|-------|
| **A** — Personalization possible | Owner ChatGPT, 10 custom queries | 10 | 8/10 | 7/10 | Not public visibility; Q5 owner disclosure |
| **B** — Unpersonalized | Temporary Chat, Q1–2–3–10 | 4 | **0/4** | 0/4 | OWNER_REPORTED; no screenshots yet |

**Same 4 questions:** A **3/4** vs B **0/4** — documented as a **finding requiring repeat runs**, **not** proof that personalization alone caused the gap.

**Docs:** `R1_MEASUREMENT_COHORTS.md`, `R1_ROUND1_10_OWNER_EVIDENCE.md`, `runs-log.csv` (14 rows).

**Next measurement:** Extend B to Q4–9 Unpersonalized; add Gemini/Perplexity when authorized (`NOT_RUN` until then).

---

## 2. Public query map

`GEO_PUBLIC_QUERY_VISIBILITY_MAP.md` — commercial intents × R1-A/B × GSC × E1–E6 gaps.

---

## 3. On-site changes (this deploy)

| Area | Change |
|------|--------|
| **SEO** | `SEO_DISCOVERABILITY` block (case studies חסדאי / אקספרס, GBP link, pricing); FAQ on case studies; audience line for orgs; related service → Maps |
| **Google Ads** | `GOOGLE_ADS_DISCOVERABILITY` (Shopping scope, 850 vs stale 655 note) |
| **Schema** | `ORGANIZATION_SAME_AS` includes verified `SITE.googlePartnerUrl` |
| **llms.txt** | SEO case note, Maps HE URL, Shopping guide link |
| **FAQ schema** | `seo.json` synced (8 SEO FAQs) via `sync-sprint1-service-faq.mjs` |

**Not changed:** Homepage H1, GA4/GTM/consent, DNS, URLs, forms/check-fit, testimonials, approved package prices, OAuth, UI redesign pass.

**Skipped (already correct from 2026-10-31 positioning pass):** About/Hub/Homepage all-sizes copy, Meta-as-certification wording on pricing/home.

---

## 4. External authority (E1–E6)

| ID | Status | Action |
|----|--------|--------|
| E1 GBP | **OWNER** | Audit categories, services, description, photos, reviews vs site NAP |
| E2 Google Partner | **OWNER** | Align public profile URL/text with adwrks.co.il; site links ✓ |
| E3 LinkedIn | **OWNER** | Provide verified company URL before `sameAs` add |
| E4 Directories | **OWNER** | Trustindex 32→34; B144/Dapei Zahav decision |
| E5 sameAs | **PARTIAL (site)** | Partner URL added in code this pass |
| E6 Mentions / PR | **NOT_RUN** | Legitimate guest content only with owner outreach |

Public profiles **exist** (FB, IG, YT, Maps) — see `GEO_AEO_PROJECT_CLOSURE.md`.

---

## 5. Stale public facts (655 ₪, Meta Partner)

| Claim | On-site React / llms (2026-10-31) | Action |
|-------|-----------------------------------|--------|
| 655 ₪ Google Ads | **Not in** `web/` TS/txt | Clarified in Google Ads discoverability + llms 850; **external** directories/WP legacy may still cite 655 — owner fix when found |
| Meta “certified partner” | Wording = Meta Ads activity, not certification | check-fit wizard unchanged (forms lock) |

---

## 6. Conversion path (audit — no UX redesign)

| Step | Status |
|------|--------|
| Service pages → scope, price starting points, FAQ | ✓ |
| Case studies on SEO / Google Ads | ✓ |
| Contact / phone on service CTAs | ✓ (unchanged) |
| WhatsApp/tel GA4 events | **NOT_VERIFIED** — spec in `GA4_MAIN_PROPERTY_DIAGNOSTIC.md` §14 |

---

## 7. QA

| Check | Result |
|-------|--------|
| `npm run typecheck` | PASS |
| `npm run build` | PASS |
| FAQ sync | PASS (seo 8) |
| Pre-deploy `qa-geo-production-audit.mjs` | Run after deploy |

---

## 8. Deploy record

- **Commit SHA:** `e1db36d` (includes cohort docs + prior `14128da` positioning)  
- **Deployment ID:** _(Vercel auto — confirm in dashboard)_  
- **Production smoke:** `/seo/` discoverability + case FAQ; `/google-ads/` Shopping/850 block; `llms.txt` Maps + SEO case note; org `sameAs` + Partner URL after deploy

---

## 9. Success metrics (track separately)

### Public visibility (cohort B first)

- Unpersonalized mention rate by query cluster  
- Link to adwrks.co.il when mentioned  
- List position when listed  

### External authority

- GBP completeness score (owner rubric)  
- Consistent NAP across E2 listings  
- New **verified** professional mentions (count + URL)

### Business (existing baselines)

- GSC Web / GenAI impressions (`GEO_BASELINE_28_90_TRACKER.md`)  
- GA4 `G-T4TE22LLC1` — 571 users Aug–Oct 2026 (historical owner export)  
- Leads — owner CRM  

**28d / 90d:** same definitions, no causal claims from single deploy.

---

## 10. OWNER_ACTIONS (short)

1. Save screenshots for R1-A and R1-B → `geo-measurement/evidence/R1/`.  
2. Run R1-B for queries **4–9** (Unpersonalized, same wording).  
3. **E1** GBP: services for SEO, Shopping (by quote), GBP management; description all-sizes + languages.  
4. **E2** Partner directory + **Trustindex** address fix.  
5. Search owned/off-site listings for **655** and unverified **Meta Partner** — correct only where we control copy.  
6. Optional **E6**: one expert article pitch (SEO or GBP) on a legitimate industry site — no paid fake reviews.

---

## 11. Follow-up content (only if measurement justifies)

- Dedicated GBP proof block on Maps **legacy** page — only if owner supplies verifiable local client outcomes.  
- E-commerce case study for Shopping — only with authorized metrics.  
- Do **not** mass-generate generic AI articles.

**Target state:** ADWRKS 365 is a **verifiable** professional source for crawlers and directories — not “#1 in the owner’s ChatGPT session.”

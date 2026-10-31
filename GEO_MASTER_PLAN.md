# ADWRKS 365 — GEO / AEO / SEO Master Plan

Single source of truth for improving how search engines and AI assistants understand, cite, and recommend Adwrks 365.

- Last updated: 2026-10-31
- Production: https://adwrks.co.il/ (Next.js 16 on Vercel, `web/`)
- Deploy policy: **no production deploy without separate explicit approval.**
- Positioning lock: digital marketing agency; homepage H1 stays `סוכנות שיווק דיגיטלי`; Website Building is one service (see `.cursor/rules/adwrks-agency-positioning-lock.mdc`).
- Principle: no invented reviews, results, clients, awards, certifications, or press. Recommendations should come from real information, experience, service, reviews, and proof.

Status legend: `DONE (local)` (implemented, not deployed) · `DEPLOYED` (in production, not yet checked) · `VERIFIED IN PRODUCTION` · `IN PROGRESS` · `READY` (safe, not started) · `NEEDS APPROVAL` · `NEEDS OWNER INPUT` · `NOT VERIFIED` · `BLOCKED`

Companion documents:
- `GEO_CONTENT_DRAFTS.md` — claim audit and content drafts for B–E (not applied).
- `geo-measurement/GEO_GOOGLE_BASELINE.md` — Search Console "Generative AI" baseline (2026-09-30 → 2026-10-27), all 52 pages classified.
- `geo-measurement/AI_MANUAL_MEASUREMENT_PROTOCOL.md` — manual AI-engine measurement, Round 1 sample of **30** queries.
- `geo-measurement/queries.csv`, `geo-measurement/runs-log.csv`; GSC exports: Generative AI P0/P92; **Web** `gsc-web_2026-07-29_2026-10-28_exported-2026-10-30/` (SHA256 `558e439f…ebec94`).
- **Integrated analysis (2026-10-30, docs only):** `SEO_WEB_90DAY_ANALYSIS.md`, `GA4_AI_REFERRAL_ANALYSIS.md`, `SEO_GEO_OPPORTUNITY_MATRIX.md`, `GA4_MAIN_PROPERTY_DIAGNOSTIC.md`.
- **Growth phase (2026-10-31, plan + drafts only):** `geo-measurement/GEO_GROWTH_ROADMAP_90_DAYS.md` — business growth engine; baseline docs are **not** re-opened for repeated micro-analysis.
- **Growth Sprint 1 (2026-10-31):** `geo-measurement/GEO_GROWTH_SPRINT_1.md` v2 — **Production** commit `62b9d60` (StartingOffer, P-01, FAQ sync, posts GO #1–7/#9).
- **GEO/AEO final execution (2026-10-31):** `geo-measurement/GEO_AEO_FINAL_EXECUTION_REPORT_2026-10-31.md` · owner checklist `OWNER_ACTIONS_GEO_FINAL.md` · prod audit `web/scripts/qa-geo-production-audit.mjs`.
- **GEO/AEO project closure (2026-10-31):** `geo-measurement/GEO_AEO_PROJECT_CLOSURE.md` — infrastructure **READY TO CLOSE**; Round 1 + GA4 collect + GBP = owner.

---

## 0.2 GEO/AEO final execution status (2026-10-31)

| Workstream | Status |
|---|---|
| Production technical audit (robots, sitemap, canonical, hreflang, index, llms) | **COMPLETE** — `qa-geo-production-audit.mjs` PASS |
| llms.txt service-areas link | **COMPLETE** (local until deploy) |
| Commercial service copy (Sprint 2/3 gap pass) | **NOT_RUN** — no proven on-page gap |
| Entity sameAs expansion (LinkedIn, Partner URL in schema) | **NOT_RUN** — owner URL verification (E3/E5) |
| Comparative FAQ / extra proof blocks | **NOT_RUN** — no approved copy this pass |
| External E1–E6 (GBP, directories, guest posts) | **NOT_RUN / OWNER** — see `SPRINT2_EXTERNAL_ACTIONS.md` |
| Round 1 AI (30 queries × engines) | **NOT_RUN** — 0 authorized neutral sessions |
| GA4 collect / Realtime / CTA events | **NOT_VERIFIED** — diagnostic only; no tag changes |
| 28 / 90 day follow-up exports | **NOT_RUN** — calendar owner actions in `GEO_BASELINE_28_90_TRACKER.md` |

---

## 0.3 GEO/AEO project closure (2026-10-31)

| Workstream | Status |
|---|---|
| On-site technical SEO/GEO + service commercial baseline | **COMPLETE** / **VERIFIED IN PRODUCTION** |
| Round 1 AI (30 × engines) | **NOT_RUN** — `runs-log.csv` empty |
| External E1–E6 (login / outreach) | **NOT_RUN / OWNER** — public FB/IG/Partner URL **VERIFIED (exists)** |
| Entity / JSON-LD | **VERIFIED** — no change this closure |
| GA4 collect / Realtime / CTA events | **NOT_VERIFIED** / spec in `GA4_MAIN_PROPERTY_DIAGNOSTIC.md` §14 |
| Closure document | **COMPLETE** — `GEO_AEO_PROJECT_CLOSURE.md` |
| **Program phase** | **Infrastructure ready to close** → **growth = owner measurement + authority** |

---

## 0. Status report (2026-10-30, verification + P92 GSC analysis)

**Production commit (verified):** `cf93115872da86ae1359751ee4400f21efd3deac` — includes **`f2c7b6b`** (B0) + **`cf93115`** (credibility). GitHub deployment **`7435844931`**, live `data-dpl-id` **`dpl_96yaV8hFqSx9CqMqvvBsX99ii31B`**. Local `main` = `origin/main` = `cf93115`. **No further deploy** unless explicitly approved.

**Local repo:** only docs/measurement/scripts untracked or modified (`GEO_MASTER_PLAN.md`, `geo-measurement/`, `scripts/qa-phase-5g3…`); **no** uncommitted `web/` app changes on `main`.

**GSC Generative AI:** P0 (28d, 286 impr.) and **P92** (2026-07-28 → 2026-10-27, **803** impr.) documented separately in `geo-measurement/GEO_GOOGLE_BASELINE.md` §1 and §11 — overlapping slice 2026-09-30 → 2026-10-27 = **286** in both charts (verified).

**GSC Web (text search):** 2026-07-29 → 2026-10-28 — **117,672** impressions, **161** clicks (~**0.137%** CTR); 312 pages / 1,001 queries in export (not full query universe). Review snippet appearance **89,077** impr. (separate row). Full write-up: `geo-measurement/SEO_WEB_90DAY_ANALYSIS.md`.

**GA4:** Historical reports **`G-T4TE22LLC1`** **VERIFIED (owner)** — 571 users, 4,187 events, 01.08–29.10.2026; ChatGPT **4** first-user users / **16** sessions (≠). **Realtime/`collect` PASS** still **NOT_VERIFIED**. Stream → `https://adwrks.co.il` (Admin). Catalog **`G-Z0DMMQVTQN`** → **NOT_APPLICABLE**. §1.4d–§1.4f · `GA4_AI_REFERRAL_ANALYSIS.md`.

**Background task (2026-10-30):** `geo-diff-data.mjs` completed (expected diffs in `posts.json` / `seo.json` only); `next start -p 3110` reached Ready; process exit `4294967295` = stop/timeout — **not** an application build failure. No local server re-run in this phase.

## 0.1 Status report (2026-10-30, after B0 + credibility deploy)

**Working well (no change needed):** prerendered HTML, canonical / hreflang / sitemaps / robots, one organization entity with founders and `sameAs`, organization authorship, `llms.txt`, FAQ markup on service pages, Google Partner status (verified on Google's partner page). In Google AI features the site was linked 286 times in 28 days from 52 pages — mostly guides and tools (§F5).

**Done:**
- Packages A + A.1 — VERIFIED IN PRODUCTION (`ead5093`).
- **B0 (D16 + D17) + GEO credibility batch — VERIFIED IN PRODUCTION** (`cf93115`, includes `f2c7b6b`). See §5.1.
- GSC baseline, measurement protocol, round-1 sample, claim audit, NAP check, content drafts — documents only.

**Open, can be done locally without new facts (each still needs approval before implementation):** B2 (`/en/contact-us/` H1), B3 skip link, remove "⭐⭐⭐⭐⭐" from **stored** homepage `Service` JSON-LD description (meta/og/twitter already clean — B7 partial), case-study content (C3), About + contract terms (B4).

**Recently shipped in production (2026-10-30):** D-8 GBP/Maps review copy (4 posts HE+EN), B4b ROI 200–400% removed from pricing, ROI calculator disclaimer (HE+EN posts), Hebrew homepage meta/og/twitter without stars, testimonial label "מתוך ביקורת לקוח", D-10 SEO **2,000 ₪**, **500K+ counter removed** (3-column stats).

**Needs owner facts first:** terms (B4 full FAQ), account ownership and who manages it day to day (B1), **`6+` / "ליווי מומחים" meaning** (inherited from WordPress; unchanged in this deploy), Meta partner proof, case-study numbers (C3), street spelling and postal code (O1 / D18), YouTube channel (O4).

**Needs separate approval:** every further content change set in B–D; any metadata / schema data change; any external service with cost.

**Off-site (owner, no code):** GBP audit, Trustindex address fix and founder-review removal, B144 / Dapei Zahav listing decision, real review requests, expert mentions (Package E).

**How success is measured:** three layers (see §11) —
1. **Exposure:** GSC Web + Generative AI, AI sample (Round 1 / 97q panel).
2. **Engagement:** service-page visits, referrals (GA4 when exported).
3. **Outcome:** quality leads and new clients (owner CRM + `lead_submit` when verified).

**Phase shift (2026-10-31):** technical SEO/GEO baseline is **done enough to plan growth**; next work = commercial pages, proof, authority, measurement — **`GEO_GROWTH_ROADMAP_90_DAYS.md`**. Round 1 runs **in parallel**; site improvements **not blocked** on 240 runs.

No causal claims from single windows (§F5, §4.3). No guaranteed rankings or lead counts.

---

## 1. Verified current state

Evidence key: **LIVE** = checked against `https://adwrks.co.il` on 2026-10-30; **LOCAL** = checked against a local production build (`next build` + `next start`); **CODE** = read from source only.

### 1.1 Already working (no change needed)

| Area | Status | Evidence |
|---|---|---|
| Rendering | Prerendered HTML (SSG + ISR `revalidate = 3600`); content, headings, FAQ answers, testimonials and links are in server HTML | LIVE headers `X-Nextjs-Prerender: 1`; `web/src/app/[locale]/[[...slug]]/page.tsx` |
| Homepage H1 | `סוכנות שיווק דיגיטלי` (HE), `Digital Marketing Agency` (EN) | LIVE + LOCAL |
| `lang` / `dir` | `he` + `rtl`, `en` + `ltr` | LIVE |
| Canonical | Self-referencing on all 22 checked pages | LOCAL smoke |
| hreflang | `he-IL`, `en`, `x-default` (to Hebrew) in HTML and HTTP `Link` header, reciprocal | LIVE + LOCAL |
| robots.txt | `User-Agent: * / Allow: /` + sitemap; no AI crawler blocked | LIVE |
| Sitemaps | `/sitemap.xml` index + `/sitemap-he.xml` + `/sitemap-en.xml` return 200 | LOCAL; LIVE index 200 |
| Entity type | `["ProfessionalService","Organization"]` with stable `@id` `https://adwrks.co.il/#organization`. `ProfessionalService` is already a `LocalBusiness` subtype — no extra type needed | LIVE |
| NAP in schema | Name `Adwrks 365`, phone `079-5599449`, `info@adwrks.co.il`, address Karmiel, opening hours Sun–Thu 09:00–17:00 | LIVE |
| FAQPage (HE) | Home, About, Google Ads, SEO, Social, Website Building, Pricing, location pages; questions are visible on page | LOCAL |
| FAQPage (EN) | About, Pricing, Google Ads, SEO, Social, Website Building, location pages | LOCAL |
| Founders in visible content | Michael Viner and Sergey Leonov on `/about-us/` and `/en/about-us/` | CODE `about-content*.ts` |
| Service pages | Google Ads, SEO, Social, Website Building, Hosting, Service Hub, Pricing, Check-fit, 24 location pages, blog (54 posts per locale) | LOCAL |
| Off-site listings | Verified Easy listing (`easy.co.il/en/page/26942021`, "Verified", Matehet Street 34 Karmiel); `woe.co.il` directory; a local business index | Web search 2026-10-30 |
| Legacy redirects / 404 | 308 redirects for legacy WP URLs, fast 404 for unknown and junk paths | LOCAL smoke |

### 1.2 Verified defects (to fix)

Status as of 2026-10-30 after deploy `cf93115`: **closed** = D1–D8, D10, D13, D15, **D16, D17** (VERIFIED IN PRODUCTION). **Open** = D9, D11, D12, D14, D18. **Partial** = B7 (meta/og/twitter on Hebrew homepage: no stars; stored `Service` node in `seo.json` graph still contains stars in `description` — cosmetic / validator only).

| ID | Defect | Evidence | Plan |
|---|---|---|---|
| D1 | `/llms.txt` returned 404 (middleware fast-404) | LIVE + LOCAL | CLOSED — VERIFIED IN PRODUCTION (A7, 200) |
| D2 | English founder / author `Person.name` replaced by page title | LIVE + LOCAL | CLOSED — VERIFIED IN PRODUCTION (A4, A.1-R, A.1-S) |
| D3 | Hebrew homepage founder only `"סרגיי"` | LIVE | CLOSED — VERIFIED IN PRODUCTION (both founders) |
| D4 | Anonymous duplicate organization block on Home / About | LIVE + LOCAL | CLOSED — VERIFIED IN PRODUCTION (A2, one entity per page) |
| D5 | `sameAs` only Facebook | LIVE | CLOSED — VERIFIED IN PRODUCTION (4 profiles) |
| D6 | EN page nodes reused Hebrew `@id` / `url` | LOCAL | CLOSED — VERIFIED IN PRODUCTION (A5) |
| D7 | Karmiel page anonymous `ProfessionalService` | LOCAL | CLOSED — VERIFIED IN PRODUCTION (A6) |
| D8 | Dead `organizationSchema()` | CODE | CLOSED — VERIFIED IN PRODUCTION (A1, single source) |
| D9 | `/en/contact-us/` H1 is Hebrew (`צרו קשר עם Adwrks 365 סוכנות שיווק דיגיטלי`); source in `web/src/lib/pages/extracted/contact-us.json` / `web/src/data/content-en/pages.json` (confirm which renders before editing) | LOCAL | OPEN — Package B (B2) |
| D10 | EN homepage without `FAQPage` | LOCAL | CLOSED — VERIFIED IN PRODUCTION (A8) |
| D11 | No skip link | LIVE + LOCAL | OPEN — Package B (B3) |
| D12 | Pre-existing lint failures: 6 errors, 4 warnings (`CookieConsentBanner`, `SiteHeader`, `RoiCalculator`, `PageSpeedInsightsTool`, `openai-pixel`, others) | LOCAL `npm run lint` | OPEN — separate cleanup, not GEO |
| D13 | Article author `Person` → `/author/adwrks/` (404) on 108 author properties | LIVE + LOCAL sweep | CLOSED — VERIFIED IN PRODUCTION (A.1-R / A.1-L) |
| D14 | `/שיווק-דיגיטלי-לעסקים/` repeats its `#webpage` `@id` inside the stored graph (typed reference). Valid JSON-LD, identical in production | LOCAL sweep + LIVE | OPEN — low; clean up with the next content pass on that post |
| D16 | **Exact cause:** EN Rank Math wrappers carried root-level `inLanguage` without `@type` → Schema.org `INVALID_ITEMTYPE` on EN graph pages | Production HTML + stored data | **CLOSED — VERIFIED IN PRODUCTION (B0, `f2c7b6b`).** Render-time `stripMisplacedInLanguage()` + generator fix; production `/` and `/en/about-us/` root keys `@context`, `@graph` only (`rootInLanguage: false`) |
| D17 | Misplaced `inLanguage` on non-CreativeWork types (Organization, Service, BreadcrumbList, location Service) | Validator + CODE | **CLOSED — VERIFIED IN PRODUCTION (B0).** Removed at render; `inLanguage` remains on WebPage / WebSite / Article types |
| D18 | Rich Results Test (Organization / LocalBusiness): optional `postalCode` missing | Google Rich Results Test 2026-10-30 | OPEN — NEEDS OWNER INPUT, non-blocking. Candidate **2195106** (Google Maps listing data for Matehet 34, via a third-party mirror). Conflict: Trustindex lists "Matehet St **32**, Karmiel **2165448**". Do not add until the owner confirms the official address and postal code (O1) |
| D15 | (CLOSED) Stored `web/src/data/content-en/seo.json` contained page titles as `Person.name` in all 56 EN person nodes. Root cause in `web/scripts/lib/en-schema-localize.mjs` (used by `web/scripts/sync-en-seo-metadata.mjs`): `walk()` replaces every Hebrew string it cannot classify. `Person` is neither page-like nor org-like, so `replacementFor()` falls through to `return ctx.pageDescription \|\| ctx.schemaTitle`; the `author` reference has no `@type`, inherits `BlogPosting`, and gets `schemaTitle`. Every future sync rewrites the bug into the data. Package A only neutralizes it at render time | CODE | VERIFIED IN PRODUCTION — Package A.1-S root fix + data cleanup + build guard |

### 1.3 Inconsistencies that need an owner decision (not fixed in code)

| ID | Item | Where |
|---|---|---|
| O1 | Street spelling: `מתכת 34` (site config), `רח' מתכת 34`, `המתכת 34` (migrated schema), `Matehet Street 34` (Easy), `Matechet Street 34, Industrial Zone` (en.adwrks.co.il). Which is the official form? | Site + directories |
| O2 | DECIDED 2026-10-30: do not reactivate or connect; English lives only under `/en/` (see E3). Legacy English site `en.adwrks.co.il`: **DNS returns NXDOMAIN** (Google 8.8.8.8 and Cloudflare 1.1.1.1, 2026-10-30), so it is not served. Its pages are **still in the web search index** with conflicting claims: "5+ years", "Trusted by over 500 business owners", "Certified Google partner", "No contracts", PayPal plans $299/$499/$699, "expand our operations to the United States", "Matechet Street 34, Industrial Zone". AI engines can keep citing these cached pages. Redirect map proposed in section 2, Package E | DNS + web search |
| O3 | RESOLVED 2026-10-30: `185+` = current **active** clients across services (not cumulative since 2018). "500" is unverified and must not be used or copied. "מאות לקוחות" (local index) is an external listing — align when E2 runs | Owner |
| O4 | Two YouTube URLs: `youtube.com/channel/UCdJu6SGezKpWfL4lNnTbMsA` (site config) and `youtube.com/@adwrks3656` (migrated About schema). Both titled "Adwrks 365"; could not confirm they are the same channel | Profile check |
| O5 | LinkedIn: no company profile URL in site data; `linkedin.com/company/adwrks-365` could not be verified (bot wall) | — |
| O6 | Contract terms ("no commitment" applies to the first consultation on site; en subdomain says no contracts for Ads management). Owner listed the terms on 2026-10-30 (§1.4) — to be verified against the current contract before any FAQ; account ownership still open | Site + en subdomain + owner |

### 1.4 Owner clarifications (2026-10-30, binding)

**Authorship**

- All articles are written by the Adwrks 365 team. No fictitious personal author profiles.
- Display name: Hebrew `צוות ADWRKS 365`, English `ADWRKS 365 Team` (casing confirmed by owner 2026-10-30; applies to the author label only — the entity name in schema stays `Adwrks 365`).
- Structured data: `author` is the `Organization`, referenced by `@id` `https://adwrks.co.il/#organization` (the existing entity). No `Person` author node.
- The sync process must stop writing article titles as author names (D15 root fix).
- `/author/adwrks/` 404 gets a planned fix that fits the site structure (no artificial author page).

**Client count**

- `185+` is the current number of **active** clients across services. Never present it as cumulative since 2018.
- Approved wording: HE `185+ לקוחות פעילים במגוון שירותי הדיגיטל שלנו`; EN `185+ active clients across our digital services.`
- `500 clients` / `500 business owners` (old EN subdomain) is unverified: do not use or copy anywhere.
- Fix consistency pointwise only; keep counter design, position and structure.

Where the count appears today (sweep of code, stored content, schema and live HTML):

| Location | Before | After (VERIFIED IN PRODUCTION 2026-10-30) |
|---|---|---|
| `web/src/lib/homepage/data.ts` `HOMEPAGE_COUNTERS[2].label` (homepage counter) | `לקוחות מרוצים` | `לקוחות פעילים` (number `185+`, design and position unchanged) |
| `web/src/lib/homepage/data.en.ts` `HOMEPAGE_COUNTERS[2].label` | `Happy clients` | `Active clients` |
| `web/public/llms.txt` | no count | `185+ active clients across our digital services (current active clients, not a cumulative total).` |
| JSON-LD (all pages) | no count | No change |
| Stored articles / pages (`posts.json`, `pages.json`) | no numeric client claim (matches for "185" are HTML attributes; "לקוחות מרוצים" appears only as generic prose) | No change |
| Legacy `pages.json` Google Ads Elementor counter | `לקוחות מרוצים` with value `0` | Not rendered (service page is composed); no change |

The full sentence does not fit a two-word counter label. It goes into `llms.txt` now, and into About / FAQ copy only when that copy is next edited with approval.

**Business facts (owner, 2026-10-30, second batch) — usable in copy**

- Active since 2018. Approved wording: **"פעילים משנת 2018"** (replaces "8+ שנות מוניטין" / "מעל ל-8 שנים").
- Personal service across marketing and digital disciplines.
- 185+ = current active clients across all services, not cumulative.
- Articles are written by the ADWRKS 365 team.
- Services: Google and social advertising, SEO, AEO/GEO, website building, Google Maps, hosting, and the other services shown on the site.
- "500 clients" (cumulative) must not be used without verification.

**Terms to verify against the current contract and price list before publishing (PENDING):** no long-term commitment; 14 days' notice; monthly credit-card payment; no setup or cancellation fees; prices exclude VAT and ad budget.

**SEO starting price (owner 2026-10-30):** organic SEO management starts at **2,000 ₪/month** (before VAT). Uniform fix map: `GEO_CONTENT_DRAFTS.md` §12. **VERIFIED IN PRODUCTION** on Hebrew pricing + calculator (`cf93115`).

**Ad account ownership (owner 2026-10-30):** varies by client and agreement. Approved site wording (HE): *"ניהול הקמפיינים מתבצע בחשבון פרסום של הלקוח או במסגרת חשבון המנוהל על ידי הסוכנות, בהתאם להסדר ההתקשרות."* Do **not** state that all accounts belong to the client or to ADWRKS. Before publish: confirm against contracts (access, data, handover). A public review reply describes one arrangement only — not a global policy.

**Google Ads activity screenshot (Oct 1–30, 2026, internal):** owner provided account metrics (~90K ₪ spend, ~2.55M impressions, ~116K clicks, ~1.44 ₪ CPC). **Not approved for publication.** Arithmetic check: spend ÷ clicks ≈ 0.78 ₪ CPC vs UI 1.44 ₪ — reconcile in Google Ads export before any use. Do not present as conversions, ROI, or all-client / all-platform totals. See `GEO_CONTENT_DRAFTS.md` §13–§14.

**Counter `500K+` (owner 2026-10-30):** **removed locally** (homepage HE+EN; grid 3×1). Do not reintroduce without a verified definition.

### 1.4a Claim audit (2026-10-30) — recommendations only, no visible content changed

Full table with sources and draft wording: `GEO_CONTENT_DRAFTS.md` §1.

| Claim | Finding | Recommendation |
|---|---|---|
| `500K+ ניהול תקציבים` (homepage counter HE + EN) | Inherited from the WordPress Elementor counter (baseline commit `d23506e`); no unit, period or source | Clarify with owner data, or replace with a verifiable fact |
| "לפי נתוני Google … ROI של 200%-400%" (pricing HE + EN) | Not what Google publishes: Google's US economic-impact model assumes $2 profit per $1 on Google Ads ($8 with search) | Remove; or quote Google exactly with link |
| ROI calculator article "ממוצעי תעשייה" table (CPL ₪35–₪80, ROI 180%–500%) | No source | Label as illustrative or remove the ROI column |
| 8 testimonials | 7 match public reviews on the business's Trustindex profile (Facebook / Google / Trustindex), with dates; 1 (Itzik Abramov) not found publicly | Keep; owner confirms platform; optional source label |
| "350%" with label "תוצאה בולטת" | The client's own review text, not agency-measured data | Relabel "מתוך ביקורת לקוח" |
| Google Partner | VERIFIED on Google's partner page | Keep; can cite the program requirements |
| Meta Business Partner; "שותפים מוסמכים של Facebook & Google" | Not publicly verifiable | Owner proof, else adjust wording |
| "⭐⭐⭐⭐⭐" in metadata | 7 HE meta descriptions, 6 og descriptions, 2 titles; public ratings differ (Google Maps data 4.6 / 8, Trustindex 4.9 / 24) | Remove (B7) |
| "מעל ל-8 שנים" / "8+" | Replaced by owner wording | "פעילים משנת 2018" |
| SEO starting price | **Resolved:** 2,000 ₪/month approved. Pricing page + calculator still **2,500** (live) | Align composers + calculator (D-10); article already from 2,000 |
| GBP and Maps guides (HE + EN): "Google doesn't allow reviews in Israel" | Outdated since July 2024; the site's own reviews article is already correct | Replace that section (D-8) |

### 1.4b Risks found

- `npm run generate-i18n` (`web/scripts/generate-i18n-data.mjs`) output **differs from committed EN data** (categories, posts, urls, seo) — pre-existing drift, not caused by B0. Running it would overwrite curated EN content. Do not run it as part of any GEO change; edit EN records directly, and review the drift separately.

### 1.4c Site testimonials and reviews — `REVIEWED — NO CHANGE REQUIRED` (owner 2026-10-30)

**Binding for all GEO work:**

- All testimonials shown on adwrks.co.il are **real** (Google, Facebook, and other sources). **No re-verification** in this project.
- **Do not change:** testimonial text, reviewer names, photos, star displays in review UI, homepage carousel, written home recommendations, Facebook review links, or article testimonial blocks.
- **350% in a Google review:** authentic client wording; **leave unchanged**. It is the client's statement, not an ADWRKS performance metric.
- **Michael Viner:** co-founder; separate real-estate business receives marketing services from ADWRKS; his Google review is real and **not** shown in the on-site testimonial set. **No** site disclosure, **no** GBP/review actions, **no** treating the review as fabricated. Document only; do not use for independent reputation scoring in Package F.
- **Do not reopen** testimonial edits without a **new finding** or **explicit owner request**. Off-site listing hygiene (Trustindex address, etc.) remains Package **E** and is **not** a reason to change on-site testimonials.

**Status:** `REVIEWED — NO CHANGE REQUIRED`

### 1.4d GA4 properties — main site vs catalog (owner 2026-10-30)

**Binding for SEO / GEO / GA4 cross-checks:**

| Property | Measurement ID | Scope | Use in ADWRKS main measurement |
|---|---|---|---|
| **Main agency site** (`adwrks.co.il`, Next.js) | **`G-T4TE22LLC1`** | Hard-coded in `web/src/lib/analytics.ts` → `GoogleTags.tsx` | **Target property** — all GA4 metrics for Package F4 / §7.3.1 must come from here |
| **Catalog Adwrks (legacy)** | **`G-Z0DMMQVTQN`** | Former `catalog.adwrks.co.il` business index (moved; subdomain inactive) | **`NOT_APPLICABLE`** — do not merge into main-site GEO/SEO reports |

- **Prior GA4 screenshots** (522 users, directory titles): **Catalog `G-Z0DMMQVTQN`** → **`NOT_APPLICABLE`**. **Main property historical data** (571 users, etc.) → **`VERIFIED (owner report)`** — `GA4_AI_REFERRAL_ANALYSIS.md` §2.
- **Main-site GA4 (90d Aug–Oct 2026):** 571 active users, 550 new, 4,187 events, 24.5s engagement; ChatGPT **4** active users (first user source) / **16** sessions — **do not conflate** with users or Round 1 recommendations.
- **Production tag check:** client load **VERIFIED**; **Realtime / DebugView / live `collect` NOT_VERIFIED** — §1.4e. Stream URL → `https://adwrks.co.il` (Admin, owner). **No code change.**
- **GSC** for `adwrks.co.il` remains valid and independent of catalog GA4.
- **No action:** do not delete GA properties, change tags, DNS, or site code (this clarification is documentation only).

### 1.4e GA4 event ingestion verification (2026-10-30 — read-only)

| Layer | Status |
|---|---|
| Tag `G-T4TE22LLC1` on production | **VERIFIED (client)** — `GoogleTags.tsx`, defer ~2.5s |
| `g/collect` + HTTP 204 | **NOT_VERIFIED** — automated HAR/listeners empty; owner DevTools required |
| GA4 historical reports (property totals, source/medium) | **VERIFIED (owner)** — 01.08–29.10.2026, `G-T4TE22LLC1` |
| GA4 Realtime / DebugView / live `collect` | **NOT_VERIFIED** — **not PASS** until owner confirms |
| `page_view` dataLayer | **VERIFIED** — **duplicate** on homepage (config + manual push) |
| Consent banner vs GA4 | **VERIFIED** — **no gating**; OpenAI pixel only gated on decline |
| Stream URL | Owner updates Admin → **`https://adwrks.co.il`** (ID unchanged) |
| Planned CTA events (WhatsApp/tel vs `lead_submit`) | **Plan only** — §14 `GA4_MAIN_PROPERTY_DIAGNOSTIC.md` |

**Script (local, no deploy):** `geo-measurement/scripts/verify-ga4-collect.mjs` → `ga4-collect-verify-output.json`.

**GEO Round 1:** continues in parallel; not blocked on GA4 Realtime PASS.

### 1.4f GA4 historical baseline (owner 2026-10-30)

Property **www.adwrks.co.il - GA4** · **`G-T4TE22LLC1`** · **2026-08-01 → 2026-10-29**:

| Metric | Value | Notes |
|---|---|---|
| Active users | 571 | Not sessions |
| New users | 550 | |
| Event count | 4,187 | |
| Avg engagement time | 24.5s | |
| ChatGPT first-user active users | 4 | Acquisition / first user dimension |
| ChatGPT sessions | 16 | Session source/medium — **≠ 4 users** |
| Page Not Found views | 40 | URL breakdown pending — §2.4 `GA4_AI_REFERRAL_ANALYSIS.md` |

**404 plan:** GA4 path export + cross GSC legacy URLs; no redirects without approval.

### 1.5 Not verified yet

- Google Business Profile categories, hours, review count and review text (requires owner access).
- B144 and Dapei Zahav listings (search synthesis mentioned B144 without a source URL; ADWRKS not found on Dapei Zahav Karmiel category pages).
- **GA4 on `G-T4TE22LLC1`:** Property totals + ChatGPT volume **VERIFIED (owner)** §1.4f; ChatGPT **landing paths**, **lead_submit by source**, **404 URLs**, **Realtime** — **NOT_VERIFIED**. GSC Web 92d done; GenAI §F5.
- Core Web Vitals field data (CrUX).
- Meta Partner status and badge terms of use (Google Partner: VERIFIED 2026-10-30 on google.com/partners/agency?id=5451982519).
- Campaign result figures (Shopping +108% traffic / +28% revenue; Facebook 127 leads at 9.28 ₪; WhatsApp 150 leads at 21.26 ₪) — not found in the repo.

---

## 2. Work packages

### Package A — Technical entity and crawler fixes (deployed in `ead5093`, VERIFIED IN PRODUCTION 2026-10-30)

| Task | Files | Status |
|---|---|---|
| A1 Single organization source: founders, founding year, languages, official profiles | `web/src/lib/site.ts`, `web/src/lib/schema.ts` (replaces dead `organizationSchema()`) | VERIFIED IN PRODUCTION |
| A2 Merge anonymous organization blocks into `#organization`, keep `knowsAbout`, `sameAs`, `logo`, extra description (as `disambiguatingDescription`) | `web/src/lib/content/schema.ts` | VERIFIED IN PRODUCTION |
| A3 Full founders (`Person`), `foundingDate`, `knowsLanguage`, `sameAs` on the organization node | `web/src/lib/schema.ts`, `web/src/lib/content/schema.ts` | VERIFIED IN PRODUCTION |
| A4 English `Person` / `author` names: real names or team label, never page titles | `web/src/lib/content/en-schema-localize.ts` | VERIFIED IN PRODUCTION. Authors now handled by A.1-R (organization author); label is `ADWRKS 365 Team` |
| A5 English page-scoped `@id` / `url` (`#webpage`, `#breadcrumb`, `#richSnippet`, `#primaryimage`, `#schema-*`) point to the English URL; `#organization` / `#website` / `#place` / `#logo` untouched | `web/src/lib/content/schema.ts` | VERIFIED IN PRODUCTION |
| A6 Karmiel provider references `#organization` | `web/src/lib/pages/locations/schema.ts` | VERIFIED IN PRODUCTION |
| A7 Serve `/llms.txt` (exact path only; `/en/llms.txt`, `/LLMS.txt`, `/foo.txt` still 404) and expand with verified links | `web/src/middleware.ts`, `web/public/llms.txt` | VERIFIED IN PRODUCTION |
| A8 English homepage `FAQPage` from the 6 visible questions | `web/src/lib/content/en-composer-faq-schema.ts` | VERIFIED IN PRODUCTION |
| A9 Deploy to production + Rich Results Test / Schema validator on production | commit `ead5093` | VERIFIED IN PRODUCTION (2026-10-30, see section 5) |

Out of scope for A (unchanged): robots policy, canonical/hreflang, redirects, metadata, forms, WhatsApp, tracking, visible copy, design, stored data files.

`sameAs` now lists Facebook, Instagram, YouTube (site config channel) and the Google Maps place link. `youtube.com/@adwrks3656` is kept on pages where the migrated data already declared it (O4 decides which channel is canonical). Street address left as `מתכת 34` pending O1.

### Package A.1 — Authorship, author URL, client count (deployed with A in `ead5093`, VERIFIED IN PRODUCTION 2026-10-30)

| Task | Files | Status |
|---|---|---|
| A.1-R Both locales: every `author` that references the author archive becomes `{ "@id": "https://adwrks.co.il/#organization" }`; archive `Person` nodes are dropped. 108 `author` properties (106 `BlogPosting`, 2 `Article` on Terms of Use) across HE + EN | `web/src/lib/content/schema.ts` (`attributeAuthorsToOrganization`), `web/src/lib/content/en-schema-localize.ts` (team label for unknown person names) | VERIFIED IN PRODUCTION |
| A.1-V Author card label `צוות ADWRKS 365` / `ADWRKS 365 Team` | `web/src/lib/content/article.ts` | VERIFIED IN PRODUCTION |
| A.1-L `/author/adwrks/` → 308 `/about-us/` via the middleware legacy table (`EXPLICIT_REDIRECTS`), the same mechanism and status as other old WordPress URLs. Checked before implementation: path was fast-404, not in the routable index, target `/about-us/` is 200, no loop; `next.config.ts` / `REDIRECT_ALLOWLIST` / routable index untouched. `/author/adwrks/feed/` already → `/blog/`; `/en/author/adwrks/` and `/author/` stay 404 (never referenced). Search Console coverage exports contain no `/author/` URL | `web/src/lib/routing/legacy-redirects.ts` | VERIFIED IN PRODUCTION |
| A.1-C Organization `address.addressCountry` → ISO `IL` on every page (merged graph + Karmiel location provider via existing `SITE.address.countryCode`) | `web/src/lib/content/schema.ts`, `web/src/lib/pages/locations/schema.ts` | VERIFIED IN PRODUCTION |
| A.1-S Sync root fix (D15) + one-time data cleanup, details below | `web/scripts/lib/en-schema-localize.mjs`, `web/scripts/sync-en-seo-metadata.mjs`, `web/scripts/audit-en-multilingual-seo.mjs`, `web/src/data/content/seo.json`, `web/src/data/content-en/seo.json` | VERIFIED IN PRODUCTION |
| A.1-K Client counter label + `llms.txt` line (section 1.4) | `web/src/lib/homepage/data.ts`, `web/src/lib/homepage/data.en.ts`, `web/public/llms.txt` | VERIFIED IN PRODUCTION |

**A.1-S — what was changed**

1. `web/scripts/lib/en-schema-localize.mjs`: `localizeEnJsonLd()` first runs `attributeAuthorsToOrganization()` (same rule as render time). `walk()` treats `author` values as `Person` and maps `Person.name` through a fixed dictionary (`מיכאל וינר` → `Michael Viner`, `סרגיי לאונוב` / `סרגיי` → `Sergey Leonov`, team names → `ADWRKS 365 Team`); person names never fall back to page text.
2. The generic fallback in `replacementFor()` was **kept** for other types. Measured on the Hebrew source, it legitimately translates `ImageObject.caption` (101), `VideoObject` name/description, `AboutPage` / `ContactPage` names and FAQ / `CreativeWorkSeason` nodes that are stripped later; making it fail would break `npm run generate-i18n`. The bug was specific to `Person` / `author`, which no longer reach it.
3. Guard `findAuthorSchemaIssues()`: the sync exits non-zero, and the prebuild audit (`audit-en-multilingual-seo.mjs`, runs on every `npm run build`) fails, if any `Person.name` equals the page title / description or any node references `/author/`. The audit also checks the Hebrew `seo.json`. Verified it caught all 111 existing issues before the cleanup.
4. One-time cleanup (not committed as a script) applied the same rules to both `seo.json` files and set the agency block's `founder` to both founders. Semantic diff vs the originals: 56 records per locale changed, **0 non-JSON-LD fields changed**; removed only archive `Person` nodes (incl. Gravatar image), author names and the single-founder entry; added only `author` → `#organization` and the two founders.
5. Idempotence: the fixed sync on the cleaned EN data reports `0 changes` / no diff. Chain check: running the fixed localization on the **original** Hebrew source (what `generate-i18n` does) yields only `#organization` authors and `Sergey Leonov`, 0 issues.
6. The `.ts` and `.mjs` dictionaries carry "keep in sync" notes. The Package A render-time guard stays as a safety net.

### 2.0 Content map for B–F (verified 2026-10-30, read from source; live pages are rendered by the composers in `web/src/lib/**`, not the legacy WordPress bodies in `pages.json`)

**Business facts — verified vs needs confirmation**

| Fact | Where it appears | Status |
|---|---|---|
| Founded 2018; founders Michael Viner, Sergey Leonov | `web/src/lib/site.ts`, About, schema | VERIFIED (owner) |
| 185+ **active** clients across services | Homepage counter, `llms.txt` | VERIFIED (owner) |
| Services: Google Ads, SEO + AI, social / Meta, Google Maps / GBP, website building, hosting | Service pages, pricing | VERIFIED (site) |
| Languages Hebrew / Russian / English | Homepage, `site.ts` | VERIFIED (site) |
| Karmiel address, remote service across Israel, no physical meetings | `site.ts`, About (`about-content.ts` 10–11), location pages | VERIFIED (site) — street spelling O1 open |
| Starting prices before VAT, ad spend not included (Google Ads from ₪850/mo, social from ₪1,050, GBP from ₪400, SEO + AI from ₪2,500, landing page from ₪1,200, one-page site from ₪1,800, corporate ≤5 pages from ₪3,000; hosting ₪69 / ₪250 / from ₪490) | `web/src/lib/pages/pricing-content.ts` (+ `.en.ts`), `hosting-content.ts` | VERIFIED (site; HE = EN) — owner to confirm they are current |
| `8+` counter: HE label `שנות מוניטין`, EN label `Years of experience`; About says `מעל ל-8 שנים` / `more than 8 years`; About story starts in 2017 (video company before the agency) | `homepage/data.ts` 33, `data.en.ts` 30, `about-content*.ts` 115–122 | NEEDS CONFIRMATION — "more than 8 years" is only true if counted from 2017 or from before Nov 2018 |
| `500K+` counter labelled `ניהול תקציבים` / `Budget managed` (no currency, no period) | `homepage/data.ts` 34, `data.en.ts` 31 | NEEDS CONFIRMATION — unit, currency, cumulative or yearly; easy to misread next to the old "500 business owners" claim |
| "ROI של 200%-400% … לפי נתוני Google" | `pricing-content.ts` 194–195 (+ EN) | NEEDS SOURCE — no citation; remove or cite |
| "⭐⭐⭐⭐⭐" in the homepage meta description | `web/src/data/content/seo.json` (homepage record) | NEEDS DECISION — implies a rating without a visible source |
| Google Partner (`google.com/partners/agency?id=5451982519`, returns 200; content is client-rendered and was not confirmed), Meta Business Partner, "Certified Facebook & Google partners" (`homepage/data.ts` 324) | `site.ts` 46–50, About 88–89 | NEEDS CONFIRMATION — current status and badge terms |
| Named testimonials: 5 on homepage, 3 result quotes incl. "350%" (Tal Shina), reused on Contact | `homepage/data.ts` 165–219, `contact-content.ts` | NEEDS CONFIRMATION — real, permissioned, source (Google review / message) |
| Case studies with numbers | none on site; candidates (Shopping +108% / +28%, Facebook 127 leads at ₪9.28, WhatsApp 150 leads at ₪21.26) not found in repo | PENDING_VERIFICATION |
| Engagement terms: minimum period, notice, setup fee, payment, who owns the ad accounts, who manages the account day to day, reporting cadence, response time | **not stated anywhere**; only "ייעוץ ראשוני ללא התחייבות" and "דוחות חודשיים", "נחזור אליכם תוך שעות" | NEEDS OWNER INPUT (O6) |

**Existing coverage of the target topics**

| Topic | Existing asset | Gap |
|---|---|---|
| Boutique / personal service | About H1 `Adwrks 365 – סוכנות שיווק דיגיטלי בוטיק`; homepage section `סוכנות בוטיק לאסטרטגיה וצמיחה דיגיטלית`; Hub `ליווי אישי ושקיפות מאז 2018`; footer | Claims exist but are generic. Nothing says **what** is different: who handles the account, direct access to founders, reporting, account ownership. Answer engines need concrete, checkable statements |
| Years, services, 185+ | Homepage counters, About, `llms.txt` | Counter label mismatch (HE vs EN), "more than 8 years" wording, `500K+` ambiguity |
| Pricing and terms | Pricing page: clear starting prices, VAT, ad spend excluded, calculator, 5 FAQs | No engagement terms; unsourced ROI range |
| About | Story, founders, partners, how we work, who it is for, 4 FAQs | Missing the concrete operating facts above; founders' roles not stated |
| Service pages | Google Ads, SEO, Social each with 6 FAQs; Hub with **no FAQ** | No proof per service (no case study); Hub has no FAQ |
| Case studies | none | Needs verified data |
| "How to choose an agency" cluster | 9 overlapping posts: `/כך-בוחרים-חברה-לשיווק-דיגיטלי/` (3,605 words, 2026-05), `/סוכנות-לשיווק-דיגיטלי/`, `/סוכנות-שיווק-דיגיטלי/`, `/סוכנות-שיווק-דיגיטלית/`, `/מהי-סוכנות-דיגיטלית/`, `/חברה-לשיווק-דיגיטלי/`, `/משרד-פרסום-דיגיטלי/`, `/החשיבות-של-משרד-פרסום-דיגיטלי/`, `/שיווק-דיגיטלי-לעסקים/` | 8 of 9 open with generic scene-setting ("בעידן הדיגיטלי…"), not a direct answer; 6 last updated 2023–2024, 578–1,715 words; no boutique-vs-large comparison anywhere |
| Google Ads cost | `/כמה-עולה-פרסום-בגוגל/` (4,732 words) + pricing page | Opens with "פרסום בגוגל 2025: …"; must match the pricing page figures |
| SEO vs PPC, AEO / GEO | `/קידום-ממומן-מול-קידום-אורגני/`, `/מהו-aeo-האם-יחליף-את-seo/`, `/seo-2026-ai-answers/` | No direct answer in the first sentence; no GEO definition |
| North / Karmiel | Karmiel location page (real HQ, composer `locations/copy-he.ts`) + 23 other templated city pages; Haifa etc. | City pages share a template; only Karmiel has a real local fact (office). No new location pages |
| Freshness | 27 of 54 posts not modified since before 2025-05 | Update only those in the GEO clusters |
| Data hygiene (not rendered) | `pages.json` `/about-us/` body holds the PPC-vs-SEO article; legacy service bodies hold old % metrics | Not rendered today; leave, but never wire them back without review |

### Package B — On-site factual clarity (existing pages only)

| Task | Pages / files | Status |
|---|---|---|
| **B0** Fix D16 (and optionally D17). Minimal fix: (1) in `sanitizeSeoGraphBlock()` in `web/src/lib/content/schema.ts`, drop `inLanguage` from a block that has `@graph` and no `@type` (render-time, fixes all 103 pages with no data change); (2) in `web/scripts/generate-i18n-data.mjs` 360–365 add `inLanguage` only to blocks that have a `@type`, so the next `generate-i18n` does not reintroduce it. Optional D17 in the same change: remove `Organization`, `LocalBusiness`, `Service` from `SCHEMA_TYPES_WITH_LANGUAGE` and delete those keys at render; remove `inLanguage` from `buildBreadcrumbSchema()` and from `breadcrumb()` + the `Service` node in `web/src/lib/pages/locations/schema.ts`. Stored `seo.json` left untouched (optional later data-only cleanup of the 200 wrapper keys). **As implemented:** `stripMisplacedInLanguage()` in `web/src/lib/content/schema.ts`, run in `mergePageJsonLd` after author attribution — removes `inLanguage` from untyped `@graph` wrappers and from nodes whose types are all in `TYPES_WITHOUT_LANGUAGE` (Organization, LocalBusiness, ProfessionalService, Service, BreadcrumbList); `inLanguage` dropped from `buildBreadcrumbSchema()`; in `locations/schema.ts` dropped from `breadcrumb()` and the `Service` node (kept on WebPage, FAQPage, CollectionPage); generator writes `inLanguage` only to typed blocks outside that set | `web/src/lib/content/schema.ts` (+27 / −2), `web/src/lib/pages/locations/schema.ts` (−2), `web/scripts/generate-i18n-data.mjs` (+12 / −1); no data files | **DONE (local)** — tests in §6 log. Not committed, not deployed. External validator re-run after an approved deploy |
| B1 About: a short factual "how we work with you" block — who manages the account, direct access to the founders, reporting cadence, account ownership, languages, remote service across Israel, `185+ לקוחות פעילים במגוון שירותי הדיגיטל שלנו`. Founders' roles. Reuse existing section layout. Draft: `GEO_CONTENT_DRAFTS.md` §3 (incl. `authorityNote` → "פעילים משנת 2018" and verified Google Partner facts) | `web/src/lib/pages/about-content.ts`, `about-content.en.ts` | DRAFT READY — NEEDS OWNER INPUT (who manages, account ownership, report contents) + APPROVAL |
| B2 `/en/contact-us/` Hebrew H1 (D9) | `web/src/lib/pages/extracted/contact-us.json` or `web/src/data/content-en/pages.json` (confirm) | READY — NEEDS APPROVAL |
| B3 Skip link (D11) | layout component | READY — NEEDS APPROVAL |
| B4 Pricing: add real engagement terms (FAQ items in the existing FAQ block): minimum period, notice, setup, payment, ad spend paid directly to Google / Meta, account ownership. Draft: `GEO_CONTENT_DRAFTS.md` §6 (terms marked PENDING) | `web/src/lib/pages/pricing-content.ts`, `.en.ts` | DRAFT READY — PENDING contract check + account-ownership answer |
| B4b Pricing: remove the "לפי נתוני Google … ROI 200%-400%" sentence (HE + EN) | `pricing-content.ts` 195, `pricing-content.en.ts` 180 | READY — NEEDS APPROVAL (no new facts needed) |
| B5 Homepage counters: `8+ שנות מוניטין` → `2018 · פעילים משנת` (HE + EN); `500K+` clarify or replace; `6+` label. Text only, same design. Draft: `GEO_CONTENT_DRAFTS.md` §4.1 | `web/src/lib/homepage/data.ts`, `data.en.ts` | Years: READY — NEEDS APPROVAL. `500K+`, `6+`: NEEDS OWNER INPUT |
| B5b Testimonial label: "תוצאה בולטת" → "מתוך ביקורת לקוח" (350% quote); "שותפים מוסמכים של Facebook & Google" → "Google Partner" unless Meta proof is given | `homepage/data.ts` (+ EN 243) | READY — NEEDS APPROVAL |
| B6 Service Hub: 4–5 FAQ items that the owner can answer factually (can I take one service only, how services combine, who coordinates, terms) using the FAQ component already used on other service pages; balanced across services (positioning lock). Draft: `GEO_CONTENT_DRAFTS.md` §7 | `web/src/lib/pages/services/hub-content.ts`, `.en.ts` | DRAFT READY — NEEDS OWNER INPUT (after B4) |
| B7 Remove "⭐⭐⭐⭐⭐" from Hebrew metadata: `metaDescription` of 7 pages (`/`, Karmiel, Service Hub, `/google-ads/`, `/seo/`, `/social-media-management/`, `/website-building/`), `ogDescription` of 6, title of 2 (`/כוחם-של-ביקורות-והמלצות/`, Karmiel). EN has none. Draft homepage text: `GEO_CONTENT_DRAFTS.md` §4.3 | `web/src/data/content/seo.json` | READY — NEEDS APPROVAL (metadata) |
| B8 Street spelling and postal code (O1, D18; candidate 2195106, conflicting Trustindex 32 / 2165448) | `site.ts` | NEEDS OWNER INPUT — non-blocking |

### Package C — Proof and authority on site

| Task | Pages / files | Status |
|---|---|---|
| C1 Case-study format: background, challenge, goal, actions, measured period, metrics with baseline, conversion definition, attribution limits, client quote with permission (or anonymized), link to the service. Intake template with required fields (data source, period, conversion definition, publication permission): `GEO_CONTENT_DRAFTS.md` §10 | Template | DONE (document) |
| C2 Placement: as a proof section on the relevant **existing** service page (Google Ads, SEO, Social). A separate case-studies page only if there are at least 3 verified cases and the owner approves | `google-ads-content.ts`, `seo-content.ts`, `social-media-content.ts` | NEEDS OWNER INPUT |
| C3 Candidate cases (Shopping, Facebook leads, WhatsApp leads) | — | PENDING_VERIFICATION: source export, dates, baseline, permission |
| C4 Testimonial provenance: 7 of 8 matched to public reviews with dates (Trustindex profile aggregating Facebook / Google / Trustindex; see `GEO_CONTENT_DRAFTS.md` §1 row 4). Owner confirms platform per review and the 8th (Itzik Abramov). Where it is a Google review, link to it. **No `AggregateRating` / `Review` markup for our own organization** (Google treats it as self-serving) | `homepage/data.ts`, `contact-content.ts` | NEEDS OWNER INPUT |
| C5 Partner status: Google Partner VERIFIED (2026-10-30); Meta Business Partner needs owner proof; keep badges only within program terms; adjust "Certified Facebook & Google partners" wording if needed | `site.ts`, `homepage/data.ts` 324, About | NEEDS OWNER INPUT |
| C6 Portfolio details (industry, service, challenge, solution) | `/website-building/` only (positioning lock) | NEEDS OWNER INPUT — low priority for GEO |
| C7 Author attribution | — | VERIFIED IN PRODUCTION (A.1) |

### Package D — Update existing content (no new pages)

Rule: no new URL when an existing page answers the question. Updates keep URL, title tag and H1 unless approved.

| Priority | Customer question | Existing asset (keep URL) | Change |
|---|---|---|---|
| D-1 | How to choose a digital marketing agency; boutique vs large agency | `/כך-בוחרים-חברה-לשיווק-דיגיטלי/` + `/en/choosing-digital-marketing-agency/` | Becomes the main answer: 2–3 sentence direct answer first; selection criteria; questions to ask before signing; red flags; an honest boutique-vs-large section (both sides' real trade-offs, no attack on competitors); link to About and pricing |
| D-2 | How much does Google Ads cost in Israel | `/כמה-עולה-פרסום-בגוגל/` (+ EN) | Direct answer first, separating ad spend from management fee; figures identical to the pricing page; remove the "2025" opener |
| D-3 | SEO vs paid vs both | `/קידום-ממומן-מול-קידום-אורגני/` (+ EN) | Direct answer first; link to both service pages |
| D-4 | SEO vs AEO vs GEO | `/מהו-aeo-האם-יחליף-את-seo/`, `/seo-2026-ai-answers/` (+ EN) | Direct answers; GEO definition; decide which one is primary and cross-link (no merge yet) |
| D-5 | Marketing for businesses in the north / Karmiel | Karmiel location page (composer `web/src/lib/pages/locations/copy-he.ts` / `copy-en.ts`) | Add only real local facts (office in Karmiel, remote model, who serves the area). No new city pages |
| D-6 | Overlapping "agency" posts (8 besides D-1) | listed in 2.0 | Phase 2 only, with Search Console data per URL: keep, refresh, or merge into D-1 with a 301 (redirect change → separate approval, routable index + `next.config.ts` / legacy table) |
| D-7 | Choosing a Facebook / Instagram agency | `/פרסום-ממומן-בפייסבוק/`, `/שיווק-בפייסבוק-ואינסטגרם/` | Direct answer; refresh "2025" |
| D-8 | Can businesses in Israel get Google reviews (factual fix) | `/google-business-profile/` (28 AI impressions), `/פרסום-בגוגל-מפות/` (2), `/en/google-business-profile/`, `/en/google-maps-advertising/` | Replace only the outdated "Google doesn't allow reviews in Israel" section (block lifted July 2024). Draft HE + EN: `GEO_CONTENT_DRAFTS.md` §5.1. Edit EN records directly (see §1.4b) |
| D-9 | ROI benchmarks | `/מחשבון-roi-מעודכן-2026/` (17) | Label the "ממוצעי תעשייה" table as illustrative or remove the ROI column; calculator unchanged |
| D-10 | SEO starting price **2,000 ₪** (approved) | `/מחירון-שיווק-דיגיטלי/`, `/en/digital-marketing-pricing/`, `pricing-calculator-data*.ts` | Change **2,500 → 2,000** on pricing cards + calculator (4 files). Article `/מחיר-קידום-אתרים/` (14 AI impressions): optional cross-link only — tiers already from 2,000. Map: `GEO_CONTENT_DRAFTS.md` §12 |
| D-11 | Russian-language advertising | `/פרסום-דיגיטלי-בשפה-הרוסית/` (24) | Add one verified paragraph (service in HE / RU / EN). Draft: `GEO_CONTENT_DRAFTS.md` §9 |

D-1 drafts (direct answer, fair boutique-vs-large table that does not portray large agencies as worse across the board, questions to ask before signing, short disclosure): `GEO_CONTENT_DRAFTS.md` §8.

Website Building content stays page-local (positioning lock).

### Package E — Off-site authority (no code)

Deliverable: `OFFSITE_AUTHORITY_PLAN.md` (next step).

| Task | Status |
|---|---|
| E1 Google Business Profile audit: categories, hours, description, services, photos, review responses | NEEDS OWNER INPUT |
| E2 Directory consistency — checked 2026-10-30 (full table `GEO_CONTENT_DRAFTS.md` §11): site, Google Maps data, Waze, Easy = מתכת / Matehet **34**, 079-5599449, Sun–Thu 9–17 (consistent). **Trustindex = Matehet St 32, 2165448 (inconsistent)**. Dapei Zahav: not found in Karmiel categories. B144: not verified | Trustindex fix: NEEDS OWNER (after O1). B144 / Dapei Zahav: owner decides whether to claim a free listing |
| E3 `en.adwrks.co.il`: owner decision 2026-10-30 — do not reactivate, restore or connect it. Dependency check done (no dependency). 301 map kept as a conditional proposal only | NEEDS OWNER INPUT (Search Console / backlink data) |
| E4 Review program: ask real clients for honest, specific reviews; no scripts, no incentives, no keyword stuffing | NEEDS OWNER INPUT |
| E5 Professional PR: original articles, anonymized aggregated campaign insights with transparent methodology, interviews, industry collaborations, client mentions with consent | READY (plan) |
| E6 LinkedIn company page and founder profiles (if they exist or are created) | NEEDS OWNER INPUT |
| E7 Choose one canonical YouTube channel (O4) and keep `sameAs` to that one | NEEDS OWNER INPUT |
| E8 Google Partner directory listing and Meta partner listing: confirm they show current name, site and city (C5) | NEEDS OWNER INPUT |
| E9 Real expert contributions under the founders' names in Israeli marketing / business media, podcasts, local business forums, university or chamber talks — disclosed authorship, no paid placements presented as independent | NEEDS OWNER INPUT |
| E10 Independent review platforms (Google first; others only where real clients already are). Reply to every review. Found 2026-10-30: (1) review by co-founder Michael Viner (2025-08-28) on Trustindex → remove at source (conflict of interest); (2) the reply to a negative review (2025-08-24) discloses billing and account terms and says "מאות לקוחות מרוצים" → future replies short and factual, "185+ לקוחות פעילים", no billing details, terms belong in the pricing FAQ (B4) | NEEDS OWNER INPUT |

Why this package matters most for "recommendation": answer engines recommend businesses that **independent** sources describe consistently. The site can explain; only third parties can corroborate. Order: GBP and directories (consistency) → reviews (real volume and recency) → expert mentions (authority).

Not allowed: buying reviews, fake mentions, paid fake articles, link networks, self-written "independent" recommendations, review incentives.

**E3 — `en.adwrks.co.il`**

Binding architecture (owner, 2026-10-30): one domain. Hebrew at `https://adwrks.co.il/`, English at `https://adwrks.co.il/en/`. All English pages, articles, services and internal paths stay under `/en/`. The legacy subdomain is not to be reactivated, restored or connected to the new site.

Dependency check (2026-10-30):

| Question | Finding |
|---|---|
| 1. Does the new site link or redirect to `en.adwrks.co.il`? | No. 0 references in `web/src`, `web/public`, `web/next.config.ts`, and in production HTML of 283 paths |
| 2. Canonical / hreflang / sitemap / schema pointing to it? | No. 0 in canonical, hreflang, JSON-LD (283 paths), `sitemap.xml`, `sitemap-he.xml`, `sitemap-en.xml`, `robots.txt`, `llms.txt` |
| 3. Does it run separately or share infrastructure? | It does not run at all: DNS NXDOMAIN (Google and Cloudflare resolvers). The main domain uses `mynames.co.il` nameservers with apex and `www` on Vercel; no `en` record exists, so nothing is shared with the new site |
| 4. Old pages still indexed / receiving traffic or links? | At least 6 pages still appear in the web search index (`/`, `/about-us/`, `/pricing/`, `/product-category/plans/`, `/faq/`, `/privacy-policy/`). Traffic and backlinks cannot be measured without Search Console (if the subdomain was ever verified) or a backlink tool — NOT VERIFIED |

Conclusion: no dependency, so the new site's architecture stays untouched. Because the host is dead, a 301 would require recreating the `en` DNS record and serving it — which conflicts with the decision not to reconnect it. Recommendation: do nothing on DNS; the pages will drop out of indexes. Reconsider the 301 map below only if Search Console or a backlink check shows real traffic or valuable links to the old URLs. If the subdomain property exists in Search Console, request removal of outdated content there (owner action, no DNS change).

Conditional 301 map (proposal only, not executed). State on 2026-10-30: the hostname does not resolve (NXDOMAIN), so there is no live status, canonical or link graph to crawl. The Wayback CDX API was offline. URLs below come from the web search index, which still serves the old pages and their claims. Rows marked *inferred* are standard WordPress / WooCommerce paths not seen in the index; include them as a safety net.

| Old URL (`https://en.adwrks.co.il`) | Seen in index | Target (`https://adwrks.co.il`) | Note |
|---|---|---|---|
| `/` | yes | `/en/` | |
| `/about-us/` | yes | `/en/about-us/` | |
| `/pricing/` | yes | `/en/digital-marketing-pricing/` | Old $ plans replaced by current ₪ pricing |
| `/product-category/plans/` | yes | `/en/digital-marketing-pricing/` | |
| `/product/*` (Starter / Growth / Premium plan) | inferred | `/en/digital-marketing-pricing/` | |
| `/faq/` | yes | `/en/google-ads/` | Old FAQ was about Google Ads management; target has a visible FAQ |
| `/privacy-policy/` | yes | `/en/privacy-policy/` | |
| `/contact/`, `/contact-us/` | inferred | `/en/contact-us/` | |
| `/cart/`, `/checkout/`, `/my-account/` | inferred | `/en/digital-marketing-pricing/` | |
| any other path | — | `/en/` | Catch-all, last rule |

Implementation options (each requires explicit approval; option 2 is the current recommendation):

1. Only if justified by traffic / link data: add a DNS record `en` → Vercel at the registrar (`mynames.co.il`), add `en.adwrks.co.il` to the Vercel project, and add host-conditioned (`has: [{ type: "host", value: "en.adwrks.co.il" }]`) permanent redirects in `web/next.config.ts` before the existing ones. Engines then see an explicit 301 to the current pages instead of a dead host. A Vercel domain-level redirect alone is not enough: it keeps the path (`/pricing/` would land on a Hebrew route or a 404).
2. Do nothing: the pages drop out of indexes over time, but cached claims ("500 business owners", "United States", $ plans) can linger in AI answers longer.
3. In addition to 1 or 2: if the subdomain was ever verified in Search Console, request removal of outdated content there.

### Package F — AI visibility measurement

Tools (repo root, documentation only, no app code): `geo-measurement/queries.csv` (query library), `geo-measurement/runs-log.csv` (one row per answer). Both UTF-8 with BOM so Hebrew opens correctly in Excel / Google Sheets.

| Task | Status |
|---|---|
| F1 Query library: 46 non-branded queries — 37 Hebrew in 6 groups (boutique agency 6, personal service 6, Google Ads 7, SEO 6, digital marketing in Israel 6, north 6) + 6 English + 3 Russian | DONE (local file) |
| F2 Methodology (below) and recording sheet | DONE (local file) |
| F3 Baseline round 1 — **before** any B / C / D content change. Manual only (owner decision: no paid APIs). Sample of 15 Hebrew non-branded queries (`round1_sample = Y` in `queries.csv`: boutique, personal service, Google Ads, SEO, north, plus HE-I01) × ChatGPT, Gemini, Perplexity, Google AI Overviews / AI Mode (recorded only when the feature appears) × 2 runs = up to 120 answers. Protocol: `geo-measurement/AI_MANUAL_MEASUREMENT_PROTOCOL.md`. No results simulated | READY — to be run by a person; nothing recorded yet |
| F4 GA4 cross-check: AI referral sessions and leads (session source `chatgpt.com`, `perplexity.ai`, `gemini.google.com`, `copilot.microsoft.com`, `claude.ai`; Google AI features are not separable in GA4 — they count as `google / organic`), landing pages vs the GSC page list, same 28-day windows — no tracking change needed | READY — plan in `GEO_GOOGLE_BASELINE.md` §10; needs someone with GA4 access |
| F5 Search Console "Generative AI" baseline (P0) | DONE — `geo-measurement/GEO_GOOGLE_BASELINE.md`; original CSVs preserved |
| F6 Search Console Web report: queries for `/` and the top guides (brand vs non-brand), same P0 window | NEEDS OWNER (export) |

**F5 summary — P0 = 2026-09-30 → 2026-10-27, before A / A.1**

- 286 impressions (links shown in AI Overviews / AI Mode, aggregated by property); mean 10.2 / day, peak 22 on 2026-10-27; weekly 68 / 62 / 69 / 87.
- Israel 273 (95.5%); desktop 231, mobile 54, tablet 1.
- 52 pages; the page table sums to 292 because it is aggregated by page (several adwrks.co.il links in one answer).
- By group: guides 101, tools 72, homepage / identity 46, selection & comparison 34, English 19, service-area 11, **commercial service pages + pricing 9 (3%)**.
- Top pages: homepage 40, speed test 33, GBP guide 28, Russian-language ads 24, popular searches 22, ROI calculator 17, internet consultant 16, SEO price 14.
- Two of the most-linked pages contain outdated or inconsistent facts (GBP review section; SEO price tiers) → fixes D-8, D-10.
- Exposure (this report) and being recommended (F3) are separate goals; the report has no queries, clicks or AI-Overview / AI-Mode split, and no unlinked mentions. Content is not changed only to raise impressions.

**Measurement access options (each needs explicit approval because it uses an external service)**

| Engine | Authorized route | Caveat |
|---|---|---|
| ChatGPT | Manual runs in the ChatGPT app (logged-out or Temporary Chat, memory off, search on); or the OpenAI API with the web-search tool | API answers are not identical to the consumer app; record which was used |
| Google AI Overviews / AI Mode | Manual only (no official API). Incognito, Google.co.il, location Israel | Appearance varies by query and session; Search Console does not report AI Overviews separately |
| Gemini | Manual in the Gemini app; or Gemini API with Google Search grounding | Same caveat as ChatGPT API |
| Perplexity | Manual; or the Perplexity Sonar API (returns cited URLs) | Good for citation tracking |
| Claude (optional) | Manual; or Anthropic API with web search | — |
| Bing / Copilot (optional) | Bing Webmaster Tools — check whether an AI / Copilot citation report is available for the property | Availability to be checked, not assumed |

Decided: manual measurement (no cost, closest to what users see). Round 1 = the 15-query sample (up to 120 answers); the full 46-query set quarterly. APIs only if the owner later approves accounts and cost.

**Protocol (same every round)**

1. Fresh session: logged out or temporary chat, no memory, no custom instructions, no prior brand mention in the conversation.
2. Query typed exactly as in `queries.csv`; no follow-up in the scored run.
3. Record engine, mode (web search on / off, model if shown), date, time, location (Israel), interface language.
4. Two runs per query per engine on different days in the same week; AI answers vary, so a single run is not evidence.
5. Save a screenshot or share link per answer (file name = `run_id`).
6. Score with the definitions below; a second person spot-checks 10%.
7. Rounds: baseline before content changes, then every 6–8 weeks, same queries and protocol. Changes to the query set are versioned.

**Definitions (per answer)**

| Field | Yes when |
|---|---|
| Mention | The answer names ADWRKS 365 / Adwrks in any way |
| Recommendation | ADWRKS is presented as an option the user should consider (in a list of suggested agencies or as a suggested provider). Record list position and list length |
| Citation | A source shown by the engine is an `adwrks.co.il` page (record URL); separately record citations of third-party pages **about** ADWRKS (Easy, GBP, directories, articles) |
| Link | The answer contains a clickable link to `adwrks.co.il` |
| Accuracy | Facts stated about ADWRKS are correct (flag "500 clients", US expansion, $ plans, wrong address, wrong services) |

**Metrics (only from recorded answers, always with sample size)**

- Mention rate, recommendation rate, own-site citation rate, third-party citation rate, link rate — per engine, per query group, per language.
- Average list position when recommended.
- Share of voice: ADWRKS mentions ÷ all agency mentions in the same answers (competitors recorded as named, no judgement).
- Accuracy rate of mentions.
- Round-over-round change with the same protocol. No statement of "probability that ChatGPT recommends ADWRKS" beyond these sample rates.

### Package G — UX, performance, accessibility

| Task | Status |
|---|---|
| G1 Lighthouse before/after for Package A (homepage mobile + desktop, local build) | DONE — no regression |
| G2 Skip link (B2) | NEEDS APPROVAL |
| G3 Pre-existing lint errors (D12) | READY (separate change) |

---

## 3. Priority order

Done: Package A + A.1 (VERIFIED IN PRODUCTION 2026-10-30). B0 DONE (local).

Revised 2026-10-30 from the GSC baseline (§F5): Google's AI features already link mostly to guides and tools, and two of the most-linked pages carry outdated or inconsistent facts. So the first content work is **accuracy on pages that are already exposed**, not new exposure. Commercial pages get little AI exposure (3%); for the "recommended" goal the main levers are off-site corroboration (E) and verifiable proof (B1 / B4 / C), measured by F3, not by impressions.

| Order | Work | Why (data) | Needs |
|---|---|---|---|
| 1 | F3 round 1 (manual, 15 queries) + F6 Web query export | The "recommended" goal has no baseline yet; must run before content changes go live | A person, ~1–2 days; GSC export |
| 2 | Deploy B0 | 0 validator errors; structured data only; no visible change | Separate deploy approval |
| 3 | Accuracy fixes on exposed pages: D-8 GBP / Maps review section (28 + 2 impressions, HE + EN), **D-10 SEO 2,500→2,000** on pricing + calculator, D-9 ROI table label (17), B4b ROI line, B7 stars, B5b labels | Wrong or inconsistent facts reach AI answers (GBP guide; pricing vs article); D-10 direction set | Approval per change set |
| 4 | Owner fact sheet (terms vs contract, account ownership / management, `500K+`, `6+`, Meta proof, O1 / D18, testimonial platforms) | Unblocks B1, B4, B5, B6 | Owner answers |
| 5 | E: Trustindex address fix + founder-review removal, GBP audit, real review requests, B144 / Dapei Zahav decision | Largest expected effect on being recommended; independent and consistent sources | Owner time and access |
| 6 | B1 About block, B4 terms FAQ, B5 counters, D-1 comparison article | Clear, checkable answers to "which agency / boutique / personal service" questions (F3 groups) | Facts from step 4 |
| 7 | C3 case studies on service pages (intake template §10 of drafts); B6 Hub FAQ; D-11 Russian paragraph; D-2 … D-7 | Proof and coverage | Verified data |
| 8 | Re-measure: GSC P1 (2026-11-04 → 12-01, export ≥ 12-04) and P2; F3 round 2 6–8 weeks after step 6 is live; then D-6 consolidation decision | Evidence-based next steps | — |
| — | B2, B3, D12, D14, G | Independent hygiene; can ride along with any approved change | Approval |

Timing rule: log the date of every deploy in §6. A deploy inside a 28-day window is noted with that window; comparisons are reported as changes, not as effects of a specific change.

Critical correctness issues are not delayed by this order.

**Owner decisions and information needed (consolidated)**

1. Measurement: who runs F3 round 1 and when; GSC Web export for F6; GA4 access for F4; whether an `en.adwrks.co.il` GSC property exists. (Decided: manual, no paid APIs.)
2. Engagement terms: confirm the 5 PENDING terms against the contract; add contract-checked details on **access, data and handover** to the approved account-ownership sentence (ownership model principle already set). Who manages day to day; report contents.
3. `500K+`: choose remove / replace with verified fact / replace with verified activity metric (§14.2) — **do not guess**. `6+`: people or disciplines?
4. Approve "פעילים משנת 2018" in counter and About (decided wording) — implementation approval only.
5. Approve removing "ROI 200%-400% לפי נתוני Google" and labelling the ROI-calculator table.
6. Approve removing "⭐⭐⭐⭐⭐" from 7 meta descriptions, 6 og descriptions, 2 titles.
7. Testimonials: platform of each review; Itzik Abramov source; approve label "מתוך ביקורת לקוח".
8. Meta Business Partner proof (Google Partner verified).
9. **Google Ads aggregate numbers:** export + scope definition before any public "activity" block; reconcile CPC vs spend (§13).
10. Case-study candidates: data export, period, baseline, conversion definition, permission or anonymization.
11. O1 street spelling and number (34 vs Trustindex 32); D18 postal code (candidate 2195106); O4 YouTube channel; O5 LinkedIn.
12. Off-site: remove the founder review on Trustindex; fix its address; B144 / Dapei Zahav listing.
13. Approvals: B0 deploy; D-10 pricing alignment; then each B / C / D change set; **no publishing Oct Ads screenshot without explicit approval**.

---

## 4. Tests and success criteria

### 4.1 Per-change gate (every package)

1. `npm run typecheck` passes.
2. `npm run lint` — no new errors beyond the D12 baseline.
3. `npm run build` passes.
4. Local smoke (`22` pages + raw routes): same status codes, canonical, hreflang, H1, forms, WhatsApp and phone links as baseline.
5. JSON-LD parses, one `#organization` entity per page, no duplicate `@id`, no page-title used as a person name.
6. Routing unchanged: unknown paths 404, legacy redirects 308, static assets 200, `robots.txt` / sitemaps unchanged.
7. No change to forms, WhatsApp, phone, GTM/GA4, conversions.
8. Lighthouse not materially worse than baseline.
9. No deploy without approval.

### 4.2 After every deploy (requires approval)

- Same 283-path production snapshot diff as for A / A.1 (only intended differences).
- Rich Results Test + Schema.org validator on `/`, `/en/`, `/about-us/`, `/en/about-us/`, one article per locale, Karmiel page. Target after B0: 0 errors on HE and EN.
- `llms.txt` 200, `robots.txt` / sitemaps unchanged, forms / WhatsApp / phone unchanged.
- Search Console: no new structured-data errors after recrawl.

### 4.3 Outcome metrics (project success)

| Metric | Source | Target direction |
|---|---|---|
| Recommendation rate and mention rate, per query group and engine | Package F rounds | Up vs baseline, same protocol and sample |
| Own-site and third-party citation rate | Package F | Up |
| Accuracy of statements about ADWRKS (no "500 clients", no US / $ claims) | Package F | 100% of mentions accurate |
| Generative AI impressions: total, per page, per content group, commercial pages separately (P0 = 286 / 52 pages / commercial 9) | Search Console Generative AI report, 28-day windows | Tracked, not a target in itself; content is not changed only to raise it |
| Non-brand impressions / clicks for D-cluster pages | Search Console | Up vs same period before |
| AI referral sessions and leads (chatgpt.com, perplexity.ai, gemini, copilot) | GA4 | Up; leads tracked with existing conversions |
| Independent, accurate mentions (directories, media, partner listings) with consistent NAP | Package E log | Up |
| Real Google reviews: count, recency, owner reply rate | GBP | Up, 100% replied |
| Schema validator errors | Validator | 0 |

AI answers change between runs and model versions; conclusions are drawn from round-over-round trends with the sample size stated, not from single answers. Expected horizon for off-site effects: months, not weeks.

No claim of "probability that ChatGPT recommends Adwrks" — only measured sample rates with sample size.

---

## 5. Deploy readiness — Packages A + A.1 (2026-10-30)

**Deploy mechanism.** Vercel Git integration on `github.com/Adwrks365/adwrks`: every push to `main` creates a Production deployment automatically (`vercel[bot]` deployments; production = `ad6e5c6` = `origin/main` = local `HEAD`). `main` has no branch protection and there are no Preview deployments yet. **A push to `main` is a production deploy.**

**Files in the deploy commit (17, all under `web/`):**

Package A (8): `public/llms.txt`, `src/middleware.ts`, `src/lib/site.ts`, `src/lib/schema.ts`, `src/lib/content/schema.ts`, `src/lib/content/en-schema-localize.ts`, `src/lib/content/en-composer-faq-schema.ts`, `src/lib/pages/locations/schema.ts`.

Package A.1 adds (9): `src/lib/content/article.ts`, `src/lib/homepage/data.ts`, `src/lib/homepage/data.en.ts`, `src/lib/routing/legacy-redirects.ts`, `src/data/content/seo.json`, `src/data/content-en/seo.json`, `scripts/lib/en-schema-localize.mjs`, `scripts/sync-en-seo-metadata.mjs`, `scripts/audit-en-multilingual-seo.mjs` (the three scripts run at build / sync time only; the audit is part of `prebuild`).

Visible changes in production: homepage counter label (HE/EN), article author card label (HE/EN), `/author/adwrks/` now 308 → `/about-us/`. Everything else is structured data and `llms.txt`.

**Unrelated changes in the working tree (must not be in the deploy commit):**

- Modified, pre-existing (2026-10-25): `scripts/qa-phase-5g3-5g4-production.mjs` (QA script, root `scripts/`, not part of the app).
- Untracked: ~35 root `scripts/*.mjs` (audit/capture/diagnose), 8 `web/scripts/*.mjs` (audit/check/crawl/probe), `migration-audit/*` docs and `ubersuggest-audit*/`, `.gsc-coverage-1/`, `.gsc-coverage-2/`.
- `GEO_MASTER_PLAN.md` (docs, root): safe to commit separately; outside `web/`, no runtime effect.
- None of these are imported by the app; they only reach production if staged. Stage the 17 files by explicit path (no `git add -A` / `git add .`).

**Rollback.**

1. Vercel Instant Rollback: promote the previous Production deployment (`ad6e5c6`, current production) from the Vercel dashboard → seconds, no rebuild. Previous production deployments exist (`a23cc6c`, `7af2338`, … on 2026-10-25).
2. `git revert <commit>` + push → automatic redeploy of the reverted state. The `seo.json` cleanup is inside the same commit, so a revert restores the data too.
3. No DNS change. The only routing change is one legacy redirect entry, removed by either rollback path.

**Gate results (2026-10-30, after A.1, rebuilt from current source):** typecheck PASS; lint 6 errors / 4 warnings = D12 baseline, changed TS files clean; prebuild EN SEO audit (now with author guard) PASS; build PASS; full before/after snapshot of 283 paths (see log).

**Verdict:** GO — approved by owner 2026-10-30 10:18.

**Deployed 2026-10-30.** Commit `ead50933fb390ddf2ca71f9920e41cbe63a3b6a6` (`ead5093`) on `main` (previous production `ad6e5c6`), exactly 17 files. Vercel deployment `9ZRwv9UMu55Rn8HfM9ZQ7eC5ZenA` — status "Deployment has completed". No Vercel settings, environment variables, DNS or external services changed. The unrelated `scripts/qa-phase-5g3-5g4-production.mjs` and untracked files were left out. `GEO_MASTER_PLAN.md` is not in the deploy commit.

Rollback target if needed: Vercel Instant Rollback to the `ad6e5c6` deployment, or `git revert ead5093`.

**Production verification (2026-10-30, after deploy, vs production snapshot taken just before the push):**

| Check | Result |
|---|---|
| 283 paths: status, redirect target, title, canonical, hreflang, robots, H1, form count, WhatsApp links, phone links | PASS — identical except intended `/author/adwrks/` 404 → 308 `/about-us/` and `/llms.txt` 404 → 200 |
| Page text length on all HTML pages (no unintended visible change) | PASS — 0 pages changed by > 20 characters |
| Homepage HE / EN counter | PASS — `185+` `לקוחות פעילים` / `Active clients` |
| Author card HE / EN | PASS — `צוות ADWRKS 365` / `ADWRKS 365 Team` |
| Organization schema | PASS — one entity per page, founders (HE/EN), `foundingDate`, `knowsLanguage`, 4 `sameAs`, `addressCountry: IL` on 184 entity nodes, 0 JSON-LD parse errors |
| Article schema | PASS — 108 `author` → `#organization`, 0 `/author/` references, no page title as a person name |
| `/llms.txt` | PASS — 200, includes active-client line |
| `/author/adwrks/` | PASS — 308 → `/about-us/` (200) |
| `robots.txt`, `sitemap.xml`, `sitemap-he.xml`, `sitemap-en.xml` | PASS — 200, byte-identical to before |
| Forms (no real lead) | PASS — honeypot 200 without sending; missing consent 400 |
| Key links (HE/EN home, about, contact, Google Ads, SEO, website building, blogs, EN pricing) | PASS — all 200 |
| Google Rich Results Test (`/en/choosing-digital-marketing-agency/`) | PASS — 4 valid items: Article, Breadcrumbs, Local business, Organization. Organization shows founders, `sameAs`, `foundingDate`, `IL`. Only non-critical issue: optional `postalCode` (D18) |
| Schema.org validator (`/`, `/en/`, `/about-us/`, `/en/about-us/`, Karmiel, one article per locale) | PASS for this deploy — HE pages 0 errors; EN pages 1 pre-existing error each (D16, same before deploy); `inLanguage` warnings pre-existing (D17) |
| References to `en.adwrks.co.il` in production HTML, canonical, hreflang, JSON-LD, sitemaps, robots, `llms.txt`, and in `web/src`, `web/public`, `next.config.ts` | PASS — 0 |

---

## 5.1 Deploy — B0 + GEO credibility (2026-10-30)

**Approval:** owner approved shared deploy of B0 + credibility batch after pre-push gates (2026-10-30).

**Commits on `main` (above `ead5093`):**

| SHA | Scope |
|---|---|
| `f2c7b6b5b44782958a82d958f81cfb2b0dd086fd` | B0 — `schema.ts`, `locations/schema.ts`, `generate-i18n-data.mjs` (3 files) |
| `cf93115872da86ae1359751ee4400f21efd3deac` | Credibility + D-10 — pricing/calculator (HE+EN), homepage counters/CSS, 4 posts HE+EN, `seo.json` meta stars, testimonial label (11 files) |

**Production tip:** `cf93115` (includes B0 via history). Previous production rollback target: **`ead5093`** (Instant Rollback in Vercel or `git revert` both commits + push).

**Vercel / GitHub deployment**

| Field | Value |
|---|---|
| GitHub deployment ID | `7435844931` |
| GitHub deployment status | `success` — "Deployment has completed" (2026-10-30T10:16:30Z) |
| Vercel deployment URL (preview host) | `https://adwrks-jzgc3xxmi-adwrks.vercel.app` |
| HTML `data-dpl-id` (live site) | `dpl_96yaV8hFqSx9CqMqvvBsX99ii31B` |
| DNS / env / Vercel settings | unchanged (per policy) |

**Pre-push gates (reconfirmed before push):** `main` = only `f2c7b6b` + `cf93115` above `ead5093`; typecheck PASS; build PASS; lint 6 errors / 4 warnings (D12 baseline); counter layout 390 / 768 / desktop PASS (3 equal columns, no clip); `generate-i18n` not run.

**Counter `6+` ("ליווי מומחים" / EN "Expert disciplines"):** value **6** unchanged from WordPress / `ead5093`; **no repo source** defines what the six disciplines are. Not introduced by this deploy — flagged for owner definition (rename, footnote, or replace with verifiable metric).

**Production verification (2026-10-30, cache-bypass `Cache-Control: no-cache` where noted):**

| Check | Result |
|---|---|
| Homepage HE / EN | PASS — 200; H1 agency positioning intact |
| Stat counters (3) | PASS — `8+`, `185+`, `6+`; **no `500K+`** |
| Hebrew pricing + SEO calculator | PASS — **2,000 ₪** starting SEO |
| GBP / Maps review copy (posts) | PASS — deployed content in HTML (spot-checked) |
| Meta / og / twitter description (HE home) | PASS — **no ⭐** in meta tags |
| JSON-LD homepage `Service.description` | **PARTIAL** — stars still in stored graph text (B7 remainder); no rich-result impact observed |
| B0 JSON-LD structure | PASS — root graph wrappers without `inLanguage` on `/` and `/en/about-us/` |
| Canonical + hreflang | PASS — self-canonical; `he-IL` / `en` / `x-default` in HTML |
| `robots.txt`, `sitemap.xml` (+ he/en) | PASS — 200; sitemap `lastmod` 2026-10-30T10:16:20Z |
| Forms / WhatsApp / phone | PASS — present on home/contact (spot-check); **contact API** quick POST returned **500** with minimal JSON (not a full honeypot replay — treat as pre-existing / env; re-test if leads fail) |
| Routable path crawl | PASS — `post-migration-verify.mjs`: **268/268** OK (200 or expected 308); 0×404/5xx; vs `post-migration-verify-2026-10-20-post-deploy.json`: 0 diffs on status/title/canonical/H1/ldJsonCount |
| GA4 / Insytix | PASS — no analytics code changes in deploy commits; `G-T4TE22LLC1` still in `web/src/lib/analytics.ts`; Insytix meta on homepage HTML |
| Schema.org / Rich Results external validators | **NOT RUN** — Google CAPTCHA / rate limit (same as pre-deploy) |
| Rollback | not required |

**Unrelated to deploy (still open):** D9 EN contact H1, D11 skip link, D12 lint, D14 duplicate `@id`, D18 postal code, O1 address, O4 YouTube, Meta partner proof, full B4 contract FAQ, entity `sameAs` expansion, case studies, real GEO measurement (F3), off-site (E).

**Next (owner direction):** About page + contract terms, case studies with approved numbers, live GEO measurement rounds.

---

## 7. Service-wide GEO program (2026-10-30 — plan only)

### 7.1 Query library (Package F1)

| Item | Value |
|---|---|
| Total queries | **97** in `geo-measurement/queries.csv` |
| Generator | `geo-measurement/scripts/build-query-library.mjs --write` |
| Groups A–N | A general · B boutique · C Google Ads · D Meta · E SEO · F AEO/GEO · G websites · H landing · I GBP · J SMB · K Russian · L complementary · M local · N vendor choice |
| By language | Hebrew (77), English (12), Russian (8) — counts from current CSV |
| Round 1 panel | **30** IDs — see `F_AI_MEASUREMENT_PLAN_2026-10-30.md` |

**Note:** `HE-B08` (no long-term commitment) requires **contract-verified FAQ (B4)** before using answers in public copy; still valid as an **measurement** query.

**Next.js websites:** offered in hosting / modern-stack context (`hosting-content*.ts`, service visuals) — query `HE-G05` / `EN-G02` are fair if framed as project-dependent, not every site.

### 7.2 AI measurement status (Round 1)

| Platform | Status |
|---|---|
| ChatGPT Search | **PILOT READY** — `R1_CHATGPT_PILOT_RUNBOOK.md` + sheet; **0 agent runs**; owner phase 1a/1b |
| Gemini | **BLOCKED** until ChatGPT pilot sign-off |
| Perplexity | **BLOCKED** until ChatGPT pilot sign-off |
| Google AI Overviews / AI Mode | **BLOCKED** (`NOT_TRIGGERED` when absent) |
| `runs-log.csv` | **0 data rows** — intentionally empty (no fabricated results) |

**Artifacts:** `R1_CHATGPT_PILOT_REPORT.md` (pending), `evidence/R1/`, `scripts/summarize-r1-chatgpt.mjs`.

Target after full Round 1: up to **240** scored runs; report rates with explicit **n** only.

### 7.3 GSC Generative AI — use existing analysis only

| Window | Property impressions | Page-table sum | URLs |
|---|---|---|---|
| P0 | 286 (2026-09-30 → 2026-10-27) | 292 | 52 |
| P92 | 803 (2026-07-28 → 2026-10-27) | 822 | 66 |

**Overlap slice verified:** 286 impressions in both charts for 2026-09-30 → 2026-10-27. **Do not add totals.** Full write-up: `GEO_GOOGLE_BASELINE.md` §1 + §11.

**Exposure vs recommendation:** GSC = linked URLs (mostly guides/tools). Low impressions on `/google-ads/`, `/seo/` in P92 is **not** automatically a ranking defect — measure **recommendations** via Package F.

### 7.3.1 GSC Web + GA4 cross-check (2026-10-30 — analysis only)

| Channel | Verified signal | Do not conflate with |
|---|---|---|
| GSC Web 92d | 117,672 impr., 161 clicks; commercial head terms ~page 2 (e.g. סוכנות שיווק דיגיטלי **1,920** impr., pos **~22**) | GA4 users; GenAI impressions |
| GSC GenAI P92 | 803 impr., guides + RU + GBP lead | Web CTR; ChatGPT referrals |
| GA4 (`G-T4TE22LLC1`) | Historical **VERIFIED** (571 users, 16 ChatGPT sessions, 4 first-user); **Realtime/`collect` NOT_VERIFIED** | GenAI impr.; Round 1 |
| GA4 catalog (`G-Z0DMMQVTQN`) | Old screenshots (522 users) | **`NOT_APPLICABLE`** (§1.4d) |
| Round 1 (30q) | **0** runs in `runs-log.csv` | Any traffic metric |

**Priority matrix (no site changes yet):** `geo-measurement/SEO_GEO_OPPORTUNITY_MATRIX.md` — **P0 infra (GSC):** `/netanya-locksmith/` and `/פרסום-עסק-חינם/` (**404** on Next while GSC still shows impressions).

**Next data from owner:** GA4 Exploration from **`G-T4TE22LLC1` only** (§6 in `GA4_AI_REFERRAL_ANALYSIS.md`); GSC query→page for eight commercial queries.

### 7.4 Service gap priority (for Round 1 + content plan)

Inferred **professional exposure** (GSC P92) vs **commercial pages** — priority to improve *recommendation* fit after F baseline:

| Priority | Service | GSC signal (P92) | Planned lever (drafts only) |
|---|---|---|---|
| P1 | About + terms | `/about-us/` 7 impr. | B1 process, B4 contract FAQ (verified) |
| P1 | Google Ads | `/google-ads/` 6 | Service page depth, case study (C3), F queries C* |
| P1 | SEO | `/seo/` 4; price article 47 | Align long-form price copy to 2,000 ₪; E* queries |
| P2 | Meta / Social | `/social-media-management/` 1 | D* queries; service page + EN |
| P2 | Websites / landing | guides rank high; service via `/website-building/` (check sitemap) | Internal links from top guides — **no rewrite** of winners |
| P2 | GBP / Maps | guide 85 impr.; Maps service pages | I* queries; keep factual GBP copy |
| P2 | Local | Karmiel 20 impr. | M* queries; location pages |
| P3 | AEO/GEO narrative | `/seo-2026-ai-answers/` 22 | F* queries; avoid overclaim |
| P3 | Russian market | RU content + K* queries | E2 listings, `/פרסום-דיגיטלי-בשפה-הרוסית/` (69 impr.) |

### 7.5 Content improvement plan (existing pages only — **no implementation**)

**After Round 1 results**, apply changes in this order (each needs approval + deploy):

1. **About (`/about-us/`, `/en/about-us/`)** — how we work, team authorship, boutique positioning, languages, 2018 / 185+ (approved facts).
2. **Terms FAQ (new section or pricing hub)** — management fee scope, cancellation, account ownership (owner-verified contract), reporting — **no publish until B4 signed off**.
3. **Service pages** — Google Ads, SEO, Social, Website Building, Maps, Pricing: add **process + transparency** blocks, not new claims; link to approved case studies when exist.
4. **Comparison articles** — vendor choice (N*) alignment; fair boutique vs large agency (positioning lock).
5. **EN + RU surfaces** — parity on pricing (2,000 SEO), contact, core services (manual EN data only).
6. **Top GSC guides** — **leave body**; at most refresh dated examples + internal links (see `TOP_PAGES_CREDIBILITY_REVIEW.md`).

### 7.6 Case study framework (C3 — template only)

Each published case requires: client permission · measurement period · conversion definition · baseline · actions taken · **outcome metrics** (leads/sales/ROAS) separated from **activity metrics** (spend/clicks/impressions) · data source · author = team.

**Do not** use the Oct 2026 Ads screenshot or 350% review as case studies.

### 7.7 Off-site credibility (Package E — owner-led, no purchased reviews)

| Asset | Action |
|---|---|
| Google Business Profile | Audit categories, hours, photos, review replies (owner access) |
| Easy / directories | NAP match O1 decision |
| Trustindex | Address conflict vs site — **does not** trigger on-site testimonial changes |
| B144 / Dapei Zahav | Listing decision |
| Social profiles | Consistency with `sameAs` |
| New real reviews | Encourage satisfied clients per platform rules — **not** in code |

**Out of scope:** editing on-site testimonials (§1.4c).

### 7.8 Possible future changes (not executed)

- B7 JSON-LD `Service.description` stars cleanup (data + deploy approval)
- D9 EN contact H1, D11 skip link, D12 lint, D18 postal code
- Define or replace **6+** counter
- Meta Partner wording after proof
- HE-B08 public FAQ when contract text approved
- P1 GSC window export after 2026-11-04 (post-deploy clean window)

---

## 11. Growth phase 2026 (2026-10-31 — plan only)

**Goal:** meaningful growth in **organic + AI visibility** that drives **quality inquiries** — not another pass over the same baseline tables.

**Primary doc:** `geo-measurement/GEO_GROWTH_ROADMAP_90_DAYS.md`  
**Sprint 1:** `geo-measurement/GEO_GROWTH_SPRINT_1.md` v2 — **Production** `62b9d60`.  
**Sprint 2 (implemented 2026-10-31):** `GEO_GROWTH_SPRINT_2.md` v2 + §18–§19 — service copy, hub FAQ, posts, About, **case studies** (`cases.ts`), Hub discoverability, 28/90 tracker; **PDF cross-check complete** (exports local-only in `case-study-sources/`, not in Git).

### 11.1 Pricing transparency lock (2026-10-31 — owner-approved rules)

All Sprint 1 and future service copy must follow:

- **«החל מ-»** for every starting price; **+ מע"מ** / before VAT as on pricing hub.
- **Paid media:** management fee **excludes** ad spend (Google / Meta).
- **Starting tier ≠ unlimited / advanced package** — state scope (e.g. Ads basic = one vertical; WB 1,800 = One Page only; Shopping **not** in Ads entry price).
- **SEO from 2,000 ₪/month** — canonical; fix calculator **display label** if still 2,500 (`pricing-calculator-data*.ts` P-01 in Sprint doc).
- No invented caps, no results guarantees; **185+** = company-wide active clients, not per-service.
- **Meta Ads on `/social-media-management/`:** strengthen paid block; **do not change H1** without search/positioning review.
- **Testimonials:** REVIEWED — NO CHANGE (§1.4c).

Pricing source of truth in code: `web/src/lib/pages/pricing-content.ts` (+ EN). Consistency table: Sprint 1 §2.

| Deliverable | Location in roadmap |
|---|---|
| Top 10 growth gaps | § Executive summary table |
| Opportunities by service (all lines of business) | §1.1–1.11 |
| First 5 site improvements | §9 |
| 3 case studies to prepare first | §4 |
| External authority map | §5 |
| Lead + AI source measurement | §6–§7 |
| 30 / 60 / 90 day milestones | §8 |
| Owner start checklist | §10 |

**Constraints (unchanged):** positioning lock · testimonials §1.4c · no deploy/commit without approval · 97 queries = measurement panel, not keyword research substitute · GA4 historical baseline **locked** (571 users property-level); do not re-analyze ChatGPT 4/16 in every report.

**Priority order (growth):** (1) commercial service pages + B4 About/terms, (2) case studies + guide→service CTAs, (3) Round 1 + off-site E, (4) optional tracking (`cta_click`) after approval, (5) legacy 404 policy.

**90-day execution:** tasks T01–T22 in roadmap §8 — each with owner, dependency, approval flag.

---

## 6. Execution log

| Date | Item | Result |
|---|---|---|
| 2026-10-30 | Baseline: typecheck | PASS |
| 2026-10-30 | Baseline: lint | FAIL (pre-existing, 6 errors / 4 warnings, D12) |
| 2026-10-30 | Baseline: build | PASS |
| 2026-10-30 | Baseline: local smoke (22 pages, 21 raw routes) | Captured; D1, D2, D4, D6, D7, D9 confirmed |
| 2026-10-30 | Baseline: Lighthouse `/` (local) | Mobile: perf 87, a11y 94, BP 100, SEO 61, LCP 3.7 s, CLS 0, TBT 80 ms. Desktop: perf 100, a11y 94, BP 100, SEO 61, LCP 0.8 s |
| 2026-10-30 | Package A implemented (8 files, +238 / −27) | No deploy |
| 2026-10-30 | After: typecheck | PASS |
| 2026-10-30 | After: lint | Same 6 errors / 4 warnings as baseline; changed files clean |
| 2026-10-30 | After: build (incl. prebuild EN SEO audit "All checks passed") | PASS |
| 2026-10-30 | After: smoke diff vs baseline | Only non-schema diff: `/llms.txt` 404 → 200. Status, canonical, hreflang, H1, title, forms, WhatsApp, phone, redirects, 404s, static assets, robots, sitemaps unchanged |
| 2026-10-30 | After: full sweep of 268 routable paths | 264 × 200, 4 × 308 (configured redirects); 0 JSON-LD parse errors; 0 page-title person names; 0 duplicate/anonymous organization nodes; 0 EN page nodes on Hebrew URLs; 1 pre-existing duplicate `@id` (D14) |
| 2026-10-30 | After: forms (no real lead) | `/api/contact/` honeypot → 200 without sending; missing consent → 400; form fields, WhatsApp and phone present on `/`, `/contact-us/`, `/en/contact-us/` |
| 2026-10-30 | After: Lighthouse `/` (local) | Mobile: perf 89, a11y 94, BP 100, SEO 61, LCP 3.7 s, TBT 60 ms. Desktop unchanged. SEO 61 locally is the expected `X-Robots-Tag: noindex` on non-production hosts |
| 2026-10-30 | Readiness: JSON-LD preservation, production (before) vs local Package A build (after), all 268 paths, every leaf value | 0 status mismatches; 0 parse errors; full agency entities per page: 4 pages with 2 in production → 0 locally; 354 EN Hebrew page URLs retargeted (intended); 80 values kept under another key/type (e.g. description → `disambiguatingDescription`, merged `@type`); 4 duplicate street variants dropped; 1 broken founder name replaced. Only value no longer present: `addressCountry: "IL"` from the removed duplicate block (main entity keeps `ישראל`) → optional A.1-C. Duplicate `@id`: 1, pre-existing D14 |
| 2026-10-30 | Readiness: `/author/adwrks/` | 404 LIVE and LOCAL; referenced as author `@id`/`url` by 110 pages (HE + EN), no visible links |
| 2026-10-30 | Readiness: `en.adwrks.co.il` | NXDOMAIN; still in search index with conflicting claims; 301 map proposed (E3) |
| 2026-10-30 | Readiness: lint / typecheck | 6 errors / 4 warnings (baseline, unchanged); typecheck PASS; changed files lint-clean |
| 2026-10-30 | Readiness: deploy / rollback | Vercel Git integration on `main`; 8 files; Instant Rollback + `git revert` available |
| 2026-10-30 | A.1 baseline: local snapshot of 283 paths (268 routable + redirects, 404s, static files) on the Package A build; current sync run on a copy of EN `seo.json` | Snapshot saved; sync = 0 changes (no pre-existing drift) |
| 2026-10-30 | A.1 implemented (owner approval 2026-10-30: R, V, L, C, S, client count; no deploy) | 17 files total incl. Package A |
| 2026-10-30 | A.1 after: typecheck / lint / prebuild audit / build | PASS / 6 errors + 4 warnings (baseline) / PASS with new author guard / PASS |
| 2026-10-30 | A.1 after: snapshot diff, 283 paths | Status / location / title / canonical / hreflang / robots / H1 / forms / WhatsApp / phone identical except `/author/adwrks/` 404 → 308 `/about-us/` (target 200). Visible text: only counter label (HE/EN) and author card (HE/EN); no other page text length change. JSON-LD: removed only archive author nodes, Gravatar images, `addressCountry: ישראל`; added only `author` → `#organization` (108) and `addressCountry: IL` (184). 0 parse errors, 0 `/author/` refs, 0 pages with >1 agency entity; Person names only the two founders (HE/EN); 1 duplicate `@id` = pre-existing D14 |
| 2026-10-30 | Deploy gates (pre-push) | typecheck PASS; lint 6 errors / 4 warnings (baseline); prebuild audit PASS; build PASS; 17 files staged by path |
| 2026-10-30 | Deploy | Commit `ead5093` pushed to `main` (from `ad6e5c6`); Vercel deployment `9ZRwv9UMu55Rn8HfM9ZQ7eC5ZenA` completed |
| 2026-10-30 | Production verification | All checks PASS (section 5); no rollback needed. New pre-existing findings logged: D16, D17, D18 |
| 2026-10-30 | `en.adwrks.co.il` dependency check | No dependency; host NXDOMAIN; no change made (E3) |
| 2026-10-30 | D16 / D17 root cause | 200 / 200 EN `@graph` wrappers carry `inLanguage` from `generate-i18n-data.mjs` (HE 0 / 200); confirmed in production HTML. Validator re-run blocked by Google rate limit (302 to `/sorry`); error type from the post-deploy run. Fix proposed (B0), not applied |
| 2026-10-30 | B–F content map + measurement setup | Plan sections 2.0, B–F rewritten; `geo-measurement/queries.csv` (46 queries) and `runs-log.csv` created. No app code changed, no deploy |
| 2026-10-30 | A.1 after: sync idempotence + chain | Fixed sync on cleaned data: 0 changes. Fixed localization on original Hebrew source: authors only `#organization`, founder `Sergey Leonov`, 0 issues |
| 2026-10-30 | B0 approval (local only) | Owner approved B0 locally, after baseline checks; no deploy |
| 2026-10-30 | B0 pre-check | Only structural difference HE vs EN wrappers = `inLanguage`; no other defect in the graph |
| 2026-10-30 | B0 implemented | 3 files (`content/schema.ts`, `locations/schema.ts`, `generate-i18n-data.mjs`), no data files. Not committed |
| 2026-10-30 | B0 tests | typecheck PASS; lint 6 errors / 4 warnings (baseline D12, unchanged); build PASS (incl. prebuild EN SEO audit); `routable-path-index.json` timestamp restored |
| 2026-10-30 | B0 snapshot diff, 283 paths (local before vs after) | Non-schema fields (status, location, title, canonical, hreflang, robots, H1, forms, WhatsApp, phone): 0 diffs. Visible text: 0 diffs. JSON-LD removed only `inLanguage`: 262 BreadcrumbList, 114 organization, 103 root wrappers, 48 location Service, 2 homepage Service (`/`, `/en/`); nothing added. 0 parse errors, 0 untyped objects, 0 `/author/` refs, 0 pages with >1 agency entity; founders 4 names × 91; author → `#organization` 108; `addressCountry` IL 184; duplicate `@id` 1 = pre-existing D14 |
| 2026-10-30 | B0 external validation | Schema.org validator blocked by Google rate limit / CAPTCHA (not bypassed). Re-run on production after an approved deploy |
| 2026-10-30 | `generate-i18n` check | Output differs from committed EN data (pre-existing drift); test run reverted with `git checkout`; risk logged (§1.4b) |
| 2026-10-30 | GSC Generative AI export preserved | `geo-measurement/gsc-generative-ai_2026-09-30_2026-10-27_exported-2026-10-30/` (zip SHA-256 `1ED7DBA1…3D3353` + 5 CSVs, unchanged) |
| 2026-10-30 | GSC baseline + measurement protocol | `GEO_GOOGLE_BASELINE.md` (52 pages classified; 292 vs 286 explained), `AI_MANUAL_MEASUREMENT_PROTOCOL.md`; `queries.csv` round-1 sample (15); `runs-log.csv` columns extended |
| 2026-10-30 | Claim audit, NAP check, drafts | `GEO_CONTENT_DRAFTS.md`; no site content changed |
| 2026-10-30 | Owner clarifications (SEO 2,000 ₪, account ownership, Ads screenshot, 500K+) | Master plan §1.4 + drafts §12–§14 updated; **no production changes** |
| 2026-10-30 | Credibility + SEO price (local, owner approval) | D-10: SEO **2,000** in pricing + calculator (4 files). **500K+ counter removed** (3 counters; `stat-grid` → 3 columns). D-8: GBP/Maps review alert (4 posts). B4b: ROI 200–400% removed from pricing copy. ROI calculator disclaimer (HE+EN posts). Stars removed from Hebrew `seo.json` metadata (+ breadcrumb name fix). Testimonial label → "מתוך ביקורת לקוח". **B0 unchanged in scope** (same 3 schema files). Not committed, not deployed |
| 2026-10-30 | Local tests (credibility batch) | typecheck PASS; lint 6/4 baseline; build PASS; snap 283 paths vs post-B0: expected diffs only (counters, ROI posts, review titles/meta); JSON-LD 0 parse errors |
| 2026-10-30 | Git commits (local only, no push) | `f2c7b6b` GEO B0 (3 schema files); `cf93115` GEO credibility (11 files). Production still `ead5093` |
| 2026-10-30 | Pre-push + deploy B0 + credibility | Owner-approved; push `ead5093..cf93115` to `main`; GitHub deployment `7435844931` success |
| 2026-10-30 | Production verification (§5.1) | PASS except partial B7 (stars in JSON-LD `Service` description), validators not run, contact API spot-check 500; no rollback |
| 2026-10-30 | Production crawl | `migration-audit/post-migration-verify-2026-10-30-cf93115.json` — 268 routable paths OK |
| 2026-10-30 | Production re-verification (read-only) | Commit `cf93115` confirmed; B0+credibility checks — see §0; Schema.org **NOT_TESTED**; forms/layout **NOT_TESTED** this pass |
| 2026-10-30 | GSC P92 export ingested | Zip preserved SHA-256 `6C9427AB…`; `GEO_GOOGLE_BASELINE.md` §11; `gsc-92day-computed-summary.json`; `TOP_PAGES_CREDIBILITY_REVIEW.md`; `F_AI_MEASUREMENT_PLAN_2026-10-30.md` |
| 2026-10-30 | geo-diff / local server task | Diff OK; port 3110 Ready then process stopped — documented §0 |
| 2026-10-30 | Testimonials policy | Owner: **REVIEWED — NO CHANGE REQUIRED** — §1.4c; 350% review; Michael Viner context |
| 2026-10-30 | Query library expansion | **97** queries (groups A–N); Round 1 **30**; `build-query-library.mjs`; F protocol updated; **Round 1 not run** |
| 2026-10-30 | GEO program plan | §7 service gaps, content order, case study template, off-site E — planning only |
| 2026-10-30 | R1 ChatGPT pilot package | Runbook + 30-row sheet + report template + summarizer; **0 live ChatGPT runs** (no agent access) |
| 2026-10-30 | GSC Web 92d + GA4 screenshot integration | Export dir + zip SHA `558e439f…`; `analyze-gsc-web-export.mjs`; `SEO_WEB_90DAY_ANALYSIS.md`, `GA4_AI_REFERRAL_ANALYSIS.md`, `SEO_GEO_OPPORTUNITY_MATRIX.md`; §7.3.1 — **no site/GTM changes** |
| 2026-10-30 | GA4 property clarification | Main **`G-T4TE22LLC1`** (code); catalog **`G-Z0DMMQVTQN`** → prior screenshot metrics **NOT_APPLICABLE**; main GA4 **NOT_VERIFIED** — §1.4d; docs updated |
| 2026-10-30 | GA4 production read-only diagnostic | Live load `G-T4TE22LLC1`, cookies, SPA `page_view`; no WhatsApp/tel events; stream URL www/http note — `GA4_MAIN_PROPERTY_DIAGNOSTIC.md` |
| 2026-10-30 | GA4 collect + consent audit | `g/collect` NOT_VERIFIED; 3 consent states identical for GA; duplicate `page_view`; CTA plan §14; §1.4e; `verify-ga4-collect.mjs` |
| 2026-10-30 | GA4 main historical baseline | Owner: 571 users, 4187 events, ChatGPT 4 users / 16 sessions, 40 404 views; Realtime still NOT_VERIFIED — §1.4f |
| 2026-10-31 | Growth phase roadmap | `GEO_GROWTH_ROADMAP_90_DAYS.md` + §11 — commercial map, service audits, 90d tasks; **no site changes** |
| 2026-10-31 | Growth Sprint 1 pack | `GEO_GROWTH_SPRINT_1.md` — 5 pages, GSC-backed, patches list; **no site changes** |
| 2026-10-31 | Sprint 1 v2 pricing policy | `GEO_GROWTH_SPRINT_1.md` v2 + §11.1 — «החל מ-», StartingOffer, P-01 calculator label; **no site changes** |
| 2026-10-31 | Sprint 1 local implementation | §13.1–13.2 + internal links GO #1–7/#9; FAQ sync; screenshots `migration-audit/sprint1-starting-offer/`; **uncommitted** |
| 2026-10-31 | Sprint 1 Production deploy | `62b9d60` on `main`; GitHub Deployment 7457226667; https://adwrks.co.il |
| 2026-10-31 | Sprint 2 plan approved (research) | `GEO_GROWTH_SPRINT_2.md` — 10 actions, case study intake, Round 1 parallel |
| 2026-10-31 | Sprint 2 site implementation | **`a23cfe1`** — Hub FAQ, Ads/SEO scope, About, posts 14288/17923, case-study shell; GitHub deployment **7457352889** (Production) |
| 2026-10-31 | Case studies published | **`115f5a1`** — 4 verified cases on service pages; deploy **7457440882** |
| 2026-10-31 | Sprint 2 closure | **`930e049`** — case-study UX, Meta neutral copy, Hub discoverability, SEO price links, trackers; deploy **7457486322** |
| 2026-10-31 | Case study PDF cross-check deploy | **`6525c37`** — Express/Meta/Tal data fixes, verify scripts, source log; GitHub deployment **7457537564**; live `data-dpl-id` **`dpl_BMbs93LJgHxBtbechiwr9d1kM8AT`**; PDFs **not** in Git |
| 2026-10-31 | Case study UX compact cards | **`4bd54be`** — grid SEO, card teasers, details for full data; GitHub deployment **7457594103**; smoke **PASS** |
| 2026-10-31 | Sprint 3 UI — case study balance | **`3f97314`** — no asymmetric screenshots, verified badge, centered section header, LTR metrics, equal card/CTA layout; deploy **7457653036** |
| 2026-10-31 | Sprint 3 UI — service areas hub | **`df4425f`** — region panels, removed duplicate city cards; visual QA script; deploy **7457711335** |
| 2026-10-31 | GEO/AEO final — production audit script | **`qa-geo-production-audit.mjs`** — 8 URLs, robots/llms/hreflang (hrefLang fix); Round 1 **NOT_RUN** |
| 2026-10-31 | GEO/AEO final — llms.txt | Hebrew link to `/אזורי-פעילות/` |
| 2026-10-31 | GEO/AEO final — measurement report | `GEO_AEO_FINAL_EXECUTION_REPORT_2026-10-31.md` + `OWNER_ACTIONS_GEO_FINAL.md`; baseline anchor **df4425f** |
| 2026-10-31 | GEO/AEO final — deploy | **`fc1d07c`** pushed; GitHub deployment **7457761694**; prod audit PASS |
| 2026-10-31 | Premium UX (out of GEO scope) | **`14c909a`** · deploy **7457871919** |
| 2026-10-31 | GEO/AEO project closure | **`GEO_AEO_PROJECT_CLOSURE.md`** — Round 1 **NOT_RUN**; no GEO code deploy |

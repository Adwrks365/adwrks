# Public query visibility map (ADWRKS 365)

**Date:** 2026-10-31  
**Purpose:** Prioritize commercial intents for GEO/AEO — **not** a guarantee of AI recommendations.

Legend: **GSC** = Google Search (Web/GenAI exports). **R1-A** = owner ChatGPT, personalization possible (n=10). **R1-B** = Temporary Chat Unpersonalized (n=4 subset). **NOT_RUN** = no authorized neutral engine run.

| Intent cluster | Example query (HE) | ADWRKS in R1-A | ADWRKS in R1-B | GSC signal (92d Web) | Off-site authority gap |
|----------------|-------------------|----------------|----------------|----------------------|-------------------------|
| Digital agency IL | סוכנות שיווק דיגיטלי מומלצת | #1 (Q1) | absent (Q1) | Brand + service URLs indexed | E1 GBP, E6 mentions, directories |
| Google Ads mgmt | ניהול קמפיינים בגוגל | #1 (Q2) | absent (Q2) | `/google-ads/` ~2.7K impr. | Partner profile E2, case proof |
| SEO provider | חברה לקידום אורגני | absent (Q3) | absent (Q3) | `/seo/` ~6.9K impr., low CTR | SEO case studies on-page ✓; E6 SEO vertical citations |
| Google + Meta | סוכנות גוגל ופייסבוק | #1 (Q4) | NOT_RUN | Multi-service hub | Consistent service list on GBP/FB |
| Website + SEO | אתר תדמית + קידום | #1 (Q5)* | NOT_RUN | WB + SEO pages | *Owner disclosure in A |
| North Israel | סוכנות בצפון | #1 (Q6) | NOT_RUN | Location pages | GBP local + area pages |
| Russian service | סוכנות ברוסית | #1 (Q7) | NOT_RUN | RU guides / posts | RU directories E4 |
| Google Shopping | Shopping לחנות | secondary (Q8) | NOT_RUN | Shopping guide posts | E-commerce proof if authorized |
| GBP / Maps | GBP לעסק קטן | absent (Q9) | NOT_RUN | Maps legacy page + pricing | **E1 GBP** primary gap |
| SMB affordable | שירות אישי מחיר | exclusive (Q10) | absent (Q10) | Pricing hub | Fix stale 655 in **external** sources; on-site 850 ✓ |
| Performance Max | PMax ניהול | NOT_RUN | NOT_RUN | Guides | Google Ads discoverability ✓ |
| Landing pages | דפי נחיתה | NOT_RUN | NOT_RUN | Posts | WB page |
| GEO/AEO agency | חברת GEO | NOT_RUN (panel) | NOT_RUN | AEO posts, GenAI impr. | Thought leadership E6 |
| Large org / enterprise | שיווק לחברות גדולות | NOT_RUN | NOT_RUN | — | Positioning all-sizes on-site ✓ |

## Competitor patterns (from owner-pasted R1-A only — not verified market share)

Specialist SEO brands (Zarihan, SEOLinks, Tzahi) dominate **SEO-only** lists. E-commerce-heavy lists favor SFB, Extra Digital, BOOSTIT. GBP lists favor local SEO freelancers (Confino, WOLS, Tamir Cohen).

**Do not** treat ChatGPT list order as market ranking.

## Realistic on-site actions (this execution)

- SEO + Google Ads **discoverability** factual blocks with case study names and 850 ₪ clarification.
- `sameAs` + verified Google Partner URL in Organization schema.
- llms.txt: SEO cases, Maps URL, Shopping guide.
- FAQ parity (SEO case study question).

## Primary off-site (OWNER_ACTIONS)

See `SPRINT2_EXTERNAL_ACTIONS.md`, `OWNER_ACTIONS_GEO_FINAL.md`: E1 GBP, E2 Partner profile, Trustindex NAP, E3 LinkedIn, E6 legitimate mentions.

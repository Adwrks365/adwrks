# Location pages — fundamental content, UX & navigation rewrite (2026)

Branch: `feat/location-fundamental-content-2026`  
Scope: 25 location pages (HE + EN), hub, menus, FAQ layout — **no URL / canonical / hreflang / PR #13 SEO meta changes**.

## Content pipeline (after)

1. Base copy (`copy-he.ts` / `copy-en.ts` + `copy-*-extra.ts`)
2. `location-hero-copy-2026.ts` — H1 + opening paragraph
3. `location-section-rewrite-2026.ts` — explicit section copy (challenges, services intro, selected FAQ)
4. `location-content-ux-2026.ts` — audience lists + CTA/contact copy only (**regex polish removed from pipeline**)
5. `location-seo-meta-2026.ts` — SEO title/description (unchanged)

## Navigation — cities by region

| Region | Cities (HE labels) |
|--------|-------------------|
| **צפון** | כרמיאל, חיפה, קריות, עכו, עפולה |
| **שרון** | נתניה, חדרה, הרצליה, כפר סבא, רעננה |
| **מרכז** | תל אביב, רמת גן, פתח תקווה, ראשון לציון, חולון, בת ים |
| **דרום** | באר שבע, אשדוד, אשקלון |
| **ירושלים והסביבה** | ירושלים |

**Before:** נתניה וחדרה appeared under **צפון**; נתניה was duplicated under **שרון**.  
**After:** Sharon holds נתניה + חדרה; north has no Sharon cities. Menu order: צפון → שרון → מרכז → דרום → ירושלים.

Source: `web/src/lib/pages/locations/nav.ts` — also drives hub region cards and footer.

## UX fixes

- **FAQ (location pages):** `.sp-section-faq .sp-faq-list` centered with max-width; Q/A `text-align: start` for RTL/LTR.
- **Hierarchy:** Hero + work/challenges stay start-aligned; audience + contact + FAQ centered where already intended.

## Content rewrite — sample before / after (openings)

| Page | Before (gist) | After (gist) |
|------|----------------|--------------|
| **הרצליה** | הייטק, מסר חד, Google Ads/SEO בלבד | שאלה + מגוון שירותים (גוגל, SEO, Meta, אתרים, ליווי, מדידה) — per owner example |
| **ראשון לציון** | «ניצח מקומית» בפתיחה | פתיחה על נוכחות דיגיטלית + מגוון ערוצים בלי סלוגן ניצחון |
| **רמת גן** | דגש PPC/SEO, tracking בגוף | פתיחה מבדילה מול תל אביב + שירותים מלאים |
| **נתניה** | תייר מול תושב בלבד | חוף/נדל״ן/מסחר + פילוח קהלים ומגוון שירותים |
| **חדרה** | פילוח צפון–שרון טכני | צומת שרון–צפון + מעטפת שיווק מלאה |
| **כרמיאל** | תחרות מול חיפה והמרכז | שאלת עסק + מגוון שירותים לעסק בגליל |
| **ירושלים** | אמון + Google/Meta | תוכן, SEO, מודעות, אתרים — מחזור אמון |
| **דרום (region)** | שני ערוצים בלבד | B2B/B2C/תיירות + מדידת פניות |

Additional section fixes: e.g. ראשון `challengesTitle` → «איך העסק שלכם יכול להתבלט מול המתחרים?»; north/jerusalem bullet lists without nurturing/remarketing jargon; tel-aviv startup FAQ in plain Hebrew.

## Per-page change log (visible copy)

| ID | HE | EN | Main changes |
|----|----|----|--------------|
| hub | Hero | Hero | Broader service list in opening |
| karmiel | Hero, services intro, challenges title | Hero, services intro, challenges title | |
| north | Hero, services intro, challenge bullets | Hero, services intro | |
| krayot | Hero, challenges title, services intro | Hero, challenges title, services intro | |
| center | Hero, challenges title, services intro | Hero, challenges title, services intro | |
| sharon | Hero, intro, services, FAQ, CTAs | Hero, services, FAQ | FAQ no longer says נתניה בצפון |
| south | Hero, audience title, services, CTAs | Hero, audience title, services | |
| haifa | Hero, services intro | Hero, services intro | |
| tel-aviv | Hero, services, FAQ | Hero, services, FAQ | |
| jerusalem | Hero, services, challenge bullets | Hero, services | |
| beer-sheva | Hero, services | Hero, services | |
| netanya | Hero, challenges title, services | Hero, challenges title, services | |
| ramat-gan | Hero, challenges, services, CTAs | Hero, challenges, services | |
| petah-tikva | Hero, services | Hero, services | |
| rishon-lezion | Hero, challenges title+intro, services | Hero, challenges title, services | |
| holon | Hero, challenges title, services | Hero, challenges title, services | |
| bat-yam | Hero, services | Hero, services | |
| akko | Hero, services | Hero, services | |
| hadera | Hero, challenges title, services | Hero, challenges title, services | |
| afula | Hero, services | Hero, services | |
| herzliya | Hero, services, local FAQ | Hero, services | |
| kfar-saba | Hero, challenges title, services | Hero, challenges title, services | |
| raanana | Hero, challenges title, services | Hero, challenges title, services | |
| ashdod | Hero, challenges title, services | Hero, challenges title, services | |
| ashkelon | Hero, services | Hero, services | |

## QA executed

| Check | Command / method |
|-------|----------------|
| TypeScript + build | `npm run build` in `web/` |
| Content UX + jargon | `npx tsx scripts/qa-location-content-ux-2026.mjs` |
| SEO meta frozen | part of content UX + `qa-location-seo-2026.mjs` |
| Nav geography | `npx tsx scripts/qa-location-nav-groups.mjs` |
| Polish pipeline off | `npx tsx scripts/qa-location-content-ux-polish-regression.mjs` |
| Visual (recommended before merge) | `QA_BASE=... npx tsx scripts/qa-location-visual-all-2026.mjs` |
| Manual | Full read of openings + FAQ on hub, herzliya, rishon, ramat-gan, netanya, hadera, karmiel, jerusalem, south — HE + EN |

## Known remaining / follow-up

- Legacy strings may still exist in base `copy-*-extra.ts` files but are **overridden** on display for patched fields; further consolidation into one source per page is optional.
- `location-content-ux-polish.ts` kept for unit tests only — not applied at runtime.
- Service/blog smoke: run existing sprint QA scripts if merging to production.

**No merge or deploy without owner approval. Batch8 not started.**

## PR #15 follow-up (review fixes)

- קריות: «מסייעת **לעסקים**»; ניסוח חיפוש ברור.
- נתניה: פתיח מחדש (שאלה + סוגי עסקים + תושבים/אורחים).
- FAQ: `faqHe`/`faqEn` משחזרים שאלת «שירות מ…» + שאלה מקומית (שרון, הרצליה, נתניה HE/EN).
- ראשון לציון: `challengesIntro` בלי טענת מחיר לליד.
- Heroes: הוסרו «מחירים שונים» / תחרות לא מבוססת; מעבר ידני על פתיחים עיקריים.
- QA חדש: `qa-location-faq-rewrite.mjs`, `qa-location-sample-8-2026.mjs`.
# Phase 3.3G — Master Visual Polish, Content Restoration & Final UX Repair

**Date:** 2026-09-30  
**Status:** Complete for manual review. Not a full visual redesign of every page.  
**Stop:** No Phase 3.4, no SEO Phase 4, no commit, push, deploy, or WordPress/DNS changes.

---

## 1. Phase 3.3F regression

The earlier “12 broken images” result was a timing failure during a server restart (`httpResult: 0` while `naturalWidth`/`naturalHeight` were already non-zero, all on one article).

Clean rerun against a stable server, before the 3.3G rebuild:

| Metric | Result |
|--------|--------|
| URLs | 74 |
| Images | 1017 |
| BROKEN AFTER | **0** |

Post-rebuild audit on the Phase 3.3G server: **74 URLs, 1017 images, BROKEN AFTER = 0**.

Phase 3.3F article behavior verified on the live page:

- Helpful yes/no vote is at the article end, not in the sidebar.
- Author card remains at the article end.
- TOC is inside the article column and closed by default.
- ROI article renders a single page H1 (embedded H1 still downgraded in `prepareArticleBodyHtml`).

---

## 2. Real image failures

No genuine missing files were found in the stable 1017-image audit. Failures from the interrupted run were not deleted or hidden.

---

## 3. Shared design-system changes

Targeted, not a site-wide restyle:

- Split homepage media uses a shared `home-split-media` frame (`object-fit: contain`, max height) so images are not clipped by the section.
- Article-end modules share one full-width shell aligned to the article column.
- TOC width matches the article column (removed the extra 46rem cap).
- Contact inputs share a minimum height and focus treatment.
- Privacy consent uses one component and one wording.

Service pages were not rebuilt in this pass.

---

## 4. Homepage tools / platforms

Replaced the small logos-in-a-box row with a CSS marquee of the same eight verified assets (Google, Facebook, Instagram, YouTube, WordPress, Canva, ChatGPT, Gemini).

- Original proportions, larger optical size.
- Duplicate set is `aria-hidden` for a seamless loop.
- Pauses on hover/focus.
- `prefers-reduced-motion` stops the animation and shows one wrapping row.

Heading remains: **עובדים עם הכלים והפלטפורמות המובילים בדיגיטל**.

---

## 5. Homepage / About content

**About — “כך אנחנו בונים מנוע צמיחה דיגיטלי לעסק”** was already rendered from the migrated About extract. It was not removed.

**Homepage — “התוצאות מדברות בעד עצמן”** was missing from the Next.js homepage. Restored from the WordPress page source with the three verified quotes:

- שחר טיירי
- טל שינה
- רביב ברגר

Subtitle and note kept from the same source. No extra testimonials were invented.

Google reviews CTA added under the existing recommendation carousel:

`https://g.page/r/CddogUmVq6U-EAE/review` — “צפו בכל הביקורות בגוגל”.

Partner badge removed from under the agency photo. A compact “Google Partner” text link plus “עובדים עם Google ו-Meta” sits with the copy. The badge remains in the footer.

360° image uses the shared contain frame so it is not cut off by the section edge.

Vision block keeps the original paragraph and adds only a small kicker (`AIO · SEO · PPC`).

---

## 6. Footer

Kept the compact grid. Added:

- Smaller Google Partner badge in the brand column.
- Compact Facebook card linking to `https://www.facebook.com/927847237389026?ref=embed_page` (no iframe, so the footer does not grow with an embed).
- Existing phone, email, WhatsApp (contact column only), hours, address, nav, services, and legal links.

“עקבו אחרינו” is still Facebook, Instagram, and YouTube only.

---

## 7. Contact forms / privacy

Shared unchecked checkbox on the homepage/contact form and the article sidebar form:

“אני מאשר/ת את מדיניות הפרטיות ומסכים/ה לשימוש בפרטים שמסרתי לצורך יצירת קשר.”

“מדיניות הפרטיות” links to `/privacy-policy/`.

The API rejects submissions without `privacyConsent` of `on` / `true`. Email stays required on the main contact form and optional on `formType: "article"`.

---

## 8. Article TOC

- Full width of the article column.
- `<details>` closed by default.
- Label: תוכן עניינים.
- Existing H2/H3 extraction, RTL, keyboard summary, and header `scroll-margin` unchanged.

---

## 9. Article-end alignment

Rating, author, related grid, and CTA sit in `.article-end-shell`, which uses the same desktop column as the article body. Modules are `width: 100%`. Rating and author are not in the sidebar.

---

## 10. Author bio

Expanded with verified facts only: accompaniment since 2018, SEO, paid media, social, websites, digital strategy, and work with Google and Meta. No personal author, certifications, or client counts were added.

---

## 11. Helpful voting

Headline: **הכתבה עניינה אותך?**  
Options: **כן** / **לא**.

There is no public vote total. localStorage stores only this browser’s selection. It is not presented as a site-wide count. No historic Rate My Post numbers and no Review/AggregateRating schema. No Supabase.

---

## 12. Accessibility icon and floating controls

The wheelchair glyph was replaced with a standing figure with outstretched arms (inline SVG, no screenshot asset). The button still opens the existing accessibility panel (`aria-label="נגישות"`). Scroll-to-top remains conditional, so the left capsule does not reserve an empty slot. WhatsApp and phone stay on the right.

---

## 13. Visual QA

Playwright (`scripts/qa-phase-3-3g.js`): **71 passed, 0 failed**.

Screenshots: `migration-audit/visual-qa-phase-3-3g/` at **390 and 1440** for homepage, about, contact, services hub, SEO, Google Ads, social, website building, blog, one category archive, and five articles (PageSpeed 2026, ROI, SEO 2026, Google Ads article, PPC vs SEO).

Inspected directly:

- Homepage 1440 and 390: logo strip, stats, vision, 360 image, restored quotes, Google reviews link, footer.
- PageSpeed article 1440 (top): closed TOC in the article column, Facebook proof and related items in the sidebar, accessibility control present.

Not captured at 360, 430, 768, and 1920 for every page. Overflow checks at 390 and 1440 passed.

---

## 14. Remaining problems

- Service and About layouts were not fully recomposed in this pass. Some split sections can still feel uneven.
- Article-end alignment was verified by layout CSS and selectors, not by a full-page end-of-article screenshot in this run.
- Helpful voting cannot show a real public tally until a shared backend exists.
- The Facebook footer item is a link card, not a Page Plugin embed.
- Marquee motion should be checked by eye; reduced-motion fallback is in CSS.

---

## 15. Validation

| Check | Result |
|-------|--------|
| `npm run lint` | PASS |
| `npx tsc --noEmit` | PASS (also inside `npm run build`) |
| `npm run build` | PASS |
| Playwright 3.3G | 71 / 0 |
| Image audit (stable, before and after this rebuild) | 74 URLs, 1017 images, BROKEN AFTER = 0 |

---

## 16. Unchanged

Routes, slugs, canonicals, metadata, schema, and production WordPress were not modified. Nothing was committed, pushed, or deployed.

Local review: **http://localhost:3000**

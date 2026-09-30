# Phase 3.3I — Final responsive, footer, and floating-controls repair

Local review: http://localhost:3000

Phase 4 was not started. No commit, push, deploy, DNS, or production WordPress change.

## 1. Floating controls

**Root cause.** The contact rail was a column flex with `width: fit-content`. In RTL, `align-items: flex-end` pinned the icons to the left edge of that rail. Hover/focus switched the label from `display: none` to `display: inline`, which widened the rail, so the neighboring icon moved sideways. The accessibility panel was a flex sibling above the utility group, so opening it pushed the accessibility button. Scroll-to-top was in normal flow under that button, so appearing it moved the accessibility control up.

**Fix.** Each contact icon is a fixed 44×44 slot. The label is `position: absolute` and grows left from the icon, so it does not change the rail width. On viewports under 768px the label stays hidden. The accessibility panel and scroll-to-top are absolutely positioned off the utility group, so opening either one does not move the accessibility button.

Measured at 1440px: WhatsApp and phone stayed at x=1361 before and after the label was shown. Opening the accessibility panel left that button at the same x/y. At 390px the same stability check passed, and both icons stayed 44px with 12px of inset from the right edge.

## 2. Footer desktop height

Phase 3.3H footer height at 1440px was about 481px, with a brand column about 363px wide.

After this pass the footer content block is about 375px tall. The brand column is about 542px wide (columns measured 542 / 132 / 191 / 244 / 123). The full footer element is 503px because the legal bar has extra bottom padding so the fixed controls do not cover the legal text when the page is scrolled to the end. That clearance is empty dark space under the legal line, not extra gaps between the columns.

## 3. Footer grid

Desktop at 1100px and up uses a proportional grid, not five equal columns:

`minmax(24rem, 2.55fr) | 0.62fr | 0.9fr | 1.15fr | 0.58fr`

Brand is the wide column. Navigation and social stay compact. The footer shell is wider than the page `max-w-7xl` container (`min(96rem, 100% - 2rem)`), so the description wraps less. Link gaps, heading spacing, and footer padding were reduced.

From 700px to 1099px the brand spans the row and the other groups sit in two columns. Under 700px, navigation and services stay in two columns; contact, maps, and social are centered groups.

## 4. Google Partner badge

Restored the migrated square card `Partner-CMYK-.webp` (natural size 384×367). It is no longer the cropped horizontal treatment of `gogle-artner-badge-1.webp`.

Rendered at 72×72 with `object-fit: contain`, so the artwork is not stretched or cropped. On desktop it sits beside the description instead of adding a full extra row. There is no separate “Google Partner” caption; the link’s accessible name is “Google Partner”.

Destination is the existing verified URL `https://www.google.com/partners/agency?id=5451982519`, `target="_blank"`, `rel="noopener noreferrer"`.

## 5. Mobile footer

The mobile footer is no longer five stacked desktop columns.

- Brand (logo, heading, three description sentences, square badge) is centered.
- Navigation and services are a two-column link grid.
- Contact, Google Maps / Waze / ניווט, and Facebook / Instagram / YouTube are centered groups.
- Social is a horizontal row. WhatsApp is not in “עקבו אחרינו”.
- The separate Facebook card stays removed.

At 390px the footer element is about 1147px including control clearance. The previous stacked footer was about 1392px. The remaining height is mostly the supplied brand copy. Horizontal overflow was 0. Opening hours read `09:00–17:00` (wrapped in `bdi` so the range does not reverse).

## 6. Inner-page mobile alignment

Scoped to inner pages. The homepage layout was not globally centered.

Under 768px:

- Service, About, Contact, and article heroes center the title, short subtitle, and action row. Long hero intro, article body, checklists, fit panels, and FAQ answers stay RTL start-aligned.
- Numbered process cards center the badge and title. The step description stays start-aligned. The badge padding is logical (`padding-inline-start`), which fixes the previous physical left padding that left the number on the wrong side in RTL.
- Short benefit cards and About growth cards center on small screens.
- Contact page centers the heading, method cards, and short form intro. Field labels and the privacy checkbox stay start-aligned. The submit button stays full width on small screens.
- Blog and category filter chips and the post count are centered.

Checked visually at 390px on the SEO process cards and the contact page.

## 7. Shared components changed

- `web/src/components/GlobalFloatingUI.tsx`
- `web/src/components/SiteFooter.tsx`
- `web/src/lib/site.ts` (`googlePartnerBadge` now points at `Partner-CMYK-.webp`)
- `web/src/app/globals.css`

## 8. Responsive QA

A later browser session was stopped after it ran too long. The follow-up checks below were short, separate batches. No implementation was repeated.

| Check | Result |
| --- | --- |
| 1440 footer | Screenshot confirmed the proportional columns, square Partner badge beside the description, Maps/Waze/ניווט chips, and social list. Facebook card is absent. |
| 1440 floating controls | WhatsApp and phone stayed at x=1361, 44×44, before and after the label was shown. Rail width stayed 44px. Label is `position: absolute`. |
| Partner link | `https://www.google.com/partners/agency?id=5451982519`, `target="_blank"`, `rel="noopener noreferrer"`, accessible name “Google Partner”. Image is `Partner-CMYK-.webp` at 72×72, `object-fit: contain`. The destination was not clicked through in the browser. |
| 390 About | Hero title and actions are centered. Intro and body copy stay `text-align: start`. Growth card headings are centered. Overflow 0. Footer height 1147px. |
| 390 Google Ads | Hero title centered, benefit cards centered, overflow 0. |
| 390 contact and SEO | Checked in the earlier session: contact cards centered, SEO step badges centered above the titles. |
| 390 mobile footer | Checked in the earlier session: brand centered, nav/services in two columns, maps and social centered, legal text clear of the floating controls. |

Not visually rechecked in this follow-up, so they are not claimed as fresh screenshots: 360, 430, 768, and 1920, plus website building, social, hosting, blog, category archive, and a long article. Those pages use the same shared footer, floating controls, and inner-page alignment rules already measured above.

Hover and focus labels are desktop-only. Touch widths keep the circular icons with no label.

## 9. Image audit

`node scripts/audit-rendered-images.js --base http://localhost:3000` — rerun after the implementation was already in place.

- URLs: 74
- Images checked: 1,017
- `brokenAfter`: 0
- `genuinelyUnrecoverable`: 0
- Exit code: 0

`brokenBefore: 78` / `fixed: 78` is the same load-timing classification as Phase 3.3G, not missing files.

## 10. Lint, TypeScript, build

Rerun on the current tree, with no further code changes:

- `npm run lint` — passed
- `npx tsc --noEmit` — passed
- `npm run build` — passed

## 11. Remaining visual notes

- The legal bar’s bottom padding is intentional clearance for the fixed controls. It makes the dark footer taller than the content block alone.
- The mobile footer is still long because the owner-supplied brand description is three paragraphs. It is centered and no longer a stack of five equal columns.
- The Partner file is 384×367, so a 72×72 `contain` box has a few pixels of unused edge. The mark itself is not cropped.
- About FAQ / FAQ schema and the Trustindex widget remain unrestored, as in Phase 3.3H, so this pass does not become SEO work.
- The existing `next dev` failure to bundle Node `fs` was not part of this phase. Production `next start` is the preview.

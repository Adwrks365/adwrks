/**
 * Regression — stripLegacyArticleContactBlocks preserves substantive body, drops footers.
 * npx tsx scripts/qa-legacy-contact-blocks-regression.mjs
 */
import { getContentByPath } from "../src/lib/content/loader.ts";
import { prepareArticleBodyHtml } from "../src/lib/content/article.ts";
import { stripLegacyArticleContactBlocks } from "../src/lib/content/legacy-blocks.ts";
import { countTagBalance } from "../src/lib/content/article-html-sanitize.ts";

const PROFESSIONAL = `<section class="elementor-section elementor-top-section"><div class="elementor-widget-wrap elementor-element-populated">
<h3 class="elementor-heading-title">Services we offer</h3>
<h3 class="elementor-heading-title">How we work</h3>
<p>Paragraph one about digital marketing strategy.</p>
<p>Paragraph two about measurement and reporting.</p>
<p>Paragraph three about channel mix.</p>
<p>Paragraph four about realistic expectations.</p>
<div class="elementor-element elementor-widget elementor-widget-social-icons"><a href="tel:0795599449">Call</a></div>
<div class="elementor-element elementor-widget elementor-widget-icon-list"><a href="tel:0795599449">Phone</a></div>
<img alt="Google Partner" src="/wp-content/uploads/google-meta-partners.webp"/>
</div></section>`;

const FOOTER_ONLY = `<section class="elementor-section elementor-top-section"><div class="elementor-widget-wrap">
<p><a href="tel:0795599449">079-5599449</a></p>
<div class="elementor-widget-social-icons"></div>
</div></section>`;

const FOOTER_HE = `<section class="elementor-section elementor-top-section"><p>דרכים ליצירת קשר</p><p>טלפון</p></section>`;

/** Contact Elementor widget sandwiched between professional copy — only widget removed. */
const MID_CONTACT = `<section class="elementor-section elementor-top-section elementor-top-section"><div class="elementor-widget-wrap elementor-element-populated">
<h3 class="elementor-heading-title">Professional topic</h3>
<p>Professional paragraph A before contact widget.</p>
<p>Professional paragraph B before contact widget.</p>
<div class="elementor-element elementor-element-a1b2c3d elementor-widget elementor-widget-text-editor" data-id="a1b2c3d">
<div class="elementor-widget-container"><p>דרכים ליצירת קשר</p><p>אנחנו כאן לכל שאלה, בדרך הנוחה ביותר עבורך</p></div>
</div>
<p>Professional paragraph C after contact widget.</p>
<p>Professional paragraph D after contact widget.</p>
<p>Professional paragraph E after contact widget.</p>
</div></section>`;

const COLUMN_CONTACT = `<section class="elementor-section elementor-top-section">
<div class="elementor-container elementor-column-gap-default">
<div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-colwrap" data-element_type="column">
<div class="elementor-widget-wrap elementor-element-populated">
<h3 class="elementor-heading-title">Guide section</h3>
<p>Professional paragraph A inside column before widget.</p>
<p>Professional paragraph B inside column before widget.</p>
<div class="elementor-element elementor-element-a1b2c3d elementor-widget elementor-widget-text-editor" data-id="a1b2c3d">
<div class="elementor-widget-container"><p>דרכים ליצירת קשר</p><p>טלפון: 079-5599449</p></div>
</div>
<p>Professional paragraph C inside column after widget.</p>
<p>Professional paragraph D inside column after widget.</p>
<p>Professional paragraph E inside column after widget.</p>
</div>
</div>
</div>
</section>`;

let failed = 0;

function assert(cond, msg) {
  if (!cond) {
    console.error("FAIL", msg);
    failed++;
  } else {
    console.log("OK", msg);
  }
}

const colOut = stripLegacyArticleContactBlocks(COLUMN_CONTACT);
assert(colOut.includes("Professional paragraph A inside column before widget."), "column-fixture: before A");
assert(colOut.includes("Professional paragraph B inside column before widget."), "column-fixture: before B");
assert(colOut.includes("Professional paragraph C inside column after widget."), "column-fixture: after C");
assert(colOut.includes("Professional paragraph E inside column after widget."), "column-fixture: after E");
assert(colOut.includes("elementor-column"), "column-fixture: column wrapper kept");
assert(colOut.includes("elementor-widget-wrap"), "column-fixture: widget wrap kept");
assert(!colOut.includes("דרכים ליצירת קשר"), "column-fixture: contact widget removed");
const colBal = countTagBalance(colOut);
assert(Math.abs(colBal.div) <= 1 && Math.abs(colBal.section) <= 1, "column-fixture: DOM tag balance");

const midOut = stripLegacyArticleContactBlocks(MID_CONTACT);
assert(midOut.includes("Professional paragraph A before contact widget."), "mid-fixture: content before contact kept");
assert(midOut.includes("Professional paragraph B before contact widget."), "mid-fixture: content before contact kept (B)");
assert(midOut.includes("Professional paragraph C after contact widget."), "mid-fixture: content after contact kept");
assert(midOut.includes("Professional paragraph E after contact widget."), "mid-fixture: content after contact kept (E)");
assert(!midOut.includes("דרכים ליצירת קשר"), "mid-fixture: contact widget text removed");
const midBal = countTagBalance(midOut);
assert(Math.abs(midBal.div) <= 1 && Math.abs(midBal.p) <= 1, "mid-fixture: DOM tag balance");

const proOut = stripLegacyArticleContactBlocks(PROFESSIONAL);
assert(proOut.includes("Services we offer"), "substantive headings kept");
assert(proOut.includes("Paragraph four"), "substantive paragraphs kept");
assert(!proOut.includes("tel:0795599449"), "phone/social widgets stripped in substantive section");

const footOut = stripLegacyArticleContactBlocks(FOOTER_ONLY);
assert(!footOut.includes("tel:0795599449"), "phone-only footer section removed");

const heOut = stripLegacyArticleContactBlocks(FOOTER_HE);
assert(heOut.trim().length === 0, "hebrew contact-only section removed");

const agency = getContentByPath("/en/digital-marketing-agency-maximize/", "en");
const full = prepareArticleBodyHtml(agency.content, "en", agency.path, { skipBatch9: true });
assert(full.html.length > 8000, "elementor-18480 body preserved after shared strip hooks");
assert(full.html.includes("digital marketing"), "18480 professional copy present");

const gbpHe = getContentByPath("/google-business-profile/", "he");
const gbpFull = prepareArticleBodyHtml(gbpHe.content, "he", gbpHe.path, { skipBatch9: true });
for (const keep of ["מהו פרופיל העסק", "כיצד להגדיר", "לקוחות ממליצים"]) {
  assert(gbpFull.html.includes(keep), `batch8 HE GBP preserves “${keep}” after widget strip`);
}
assert(
  gbpFull.html.length > 5000,
  "batch8 HE GBP body mass preserved after widget-level contact strip",
);

process.exit(failed ? 1 : 0);
/**
 * Regression — replaceLegacyInlinePricingCalculator keeps surrounding body copy.
 * npx tsx scripts/qa-legacy-pricing-calculator-regression.mjs
 */
import { replaceLegacyInlinePricingCalculator } from "../src/lib/content/article.ts";
import { countTagBalance } from "../src/lib/content/article-html-sanitize.ts";

const LEGACY_CALC_WIDGET = `<div class="calculator-container"><form id="siteCostCalculator"><select id="siteType"><option value="1800">Landing</option></select></form></div>`;

const FIXTURE = `<section class="elementor-section elementor-top-section">
<div class="elementor-container elementor-column-gap-default">
<div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-colwrap">
<div class="elementor-widget-wrap elementor-element-populated">
<p>Professional paragraph A before legacy pricing calculator.</p>
<div class="elementor-element elementor-element-6a9fe60 elementor-widget elementor-widget-html" data-id="6a9fe60" id="calculator">
<!DOCTYPE html><html lang="en"><body>${LEGACY_CALC_WIDGET}</body></html>
</div>
<p>Professional paragraph B after legacy pricing calculator.</p>
<p><a href="/en/seo/">SEO services guide</a> and <img src="/wp-content/uploads/sample-diagram.webp" alt="Pricing diagram"/></p>
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

const out = replaceLegacyInlinePricingCalculator(FIXTURE);
assert(out.includes("Professional paragraph A before legacy pricing calculator."), "pricing-fixture: before kept");
assert(out.includes("Professional paragraph B after legacy pricing calculator."), "pricing-fixture: after kept");
assert(out.includes("SEO services guide"), "pricing-fixture: link kept");
assert(out.includes("sample-diagram.webp"), "pricing-fixture: image kept");
assert(out.includes("elementor-container"), "pricing-fixture: container kept");
assert(out.includes("elementor-column"), "pricing-fixture: column kept");
assert(out.includes("elementor-widget-wrap"), "pricing-fixture: widget-wrap kept");
assert(out.includes("data-adwrks-pricing-calculator"), "pricing-fixture: react embed slot");
assert(!out.includes("siteCostCalculator"), "pricing-fixture: legacy form removed");
assert(!out.includes("<!DOCTYPE"), "pricing-fixture: nested document removed");
assert(/elementor-element-6a9fe60/.test(out), "pricing-fixture: original widget root id preserved");
const bal = countTagBalance(out);
assert(Math.abs(bal.div) <= 1 && Math.abs(bal.section) <= 1, "pricing-fixture: DOM tag balance");

if (failed) {
  console.error("pricing calculator regression failed", failed);
  process.exit(1);
}
console.log("pricing calculator regression OK");
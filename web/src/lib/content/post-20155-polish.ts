/** Post 20155 — Google Maps advertising: remove empty legacy FAQ heading; restore YouTube embed. */

const POST_MARKER = "elementor-20155";
const YOUTUBE_ID = "GL-T8JKm5Zw";

const VIDEO_SECTION = `<section class="elementor-section elementor-top-section adwrks-article-video-section" data-adwrks-maps-video="20155" data-element_type="section">
<div class="elementor-container elementor-column-gap-default">
<div class="elementor-column elementor-col-100 elementor-top-column">
<div class="elementor-widget-wrap elementor-element-populated">
<div class="elementor-element elementor-widget elementor-widget-heading" data-element_type="widget" data-widget_type="heading.default">
<h2 class="elementor-heading-title elementor-size-default" id="סרטון-פרסום-בגוגל-מפות">סרטון: פרסום ופרופיל העסק בגוגל מפות</h2>
</div>
<div class="adwrks-article-video-embed" style="position:relative;padding-bottom:56.25%;height:0;max-width:100%;overflow:hidden;border-radius:12px;margin:0.75rem 0 1rem">
<iframe title="סרטון YouTube — פרסום בגוגל מפות" style="position:absolute;inset:0;width:100%;height:100%;border:0" src="https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe>
</div>
<p class="adwrks-article-video-embed__fallback"><a href="https://youtu.be/${YOUTUBE_ID}" rel="noopener noreferrer" target="_blank">צפייה בסרטון ב-YouTube</a></p>
</div></div></div></section>`;

/** Drop the legacy h2-only FAQ block so the injected accordion is the sole FAQ region. */
function stripOrphanLegacyFaqHeading(html: string): string {
  const sectionRe = /<section class="elementor-section elementor-top-section[\s\S]*?<\/section>/gi;
  let result = html.replace(sectionRe, (section) =>
    section.includes("elementor-element-677ebf3") ? "" : section,
  );
  result = result.replace(
    /<h2[^>]*id="שאלות-ותשובות"[^>]*>\s*שאלות ותשובות\s*<\/h2>/i,
    "",
  );
  return result;
}

/** Elementor video widgets migrate empty; re-inject embed once before testimonials. */
function ensureMapsYoutubeEmbed(html: string): string {
  if (html.includes(YOUTUBE_ID) || html.includes(`youtube.com/embed/${YOUTUBE_ID}`)) {
    return html;
  }
  const testimonial = html.match(/<h2[^>]*id="לקוחות-ממליצים"/);
  if (!testimonial || testimonial.index === undefined) {
    return `${html}${VIDEO_SECTION}`;
  }
  return `${html.slice(0, testimonial.index)}${VIDEO_SECTION}${html.slice(testimonial.index)}`;
}

/** Remove stripped empty video section shell (optional cleanup). */
function stripEmptyLegacyVideoSection(html: string): string {
  return html.replace(
    /<section class="elementor-section elementor-top-section elementor-element elementor-element-e909db9[\s\S]*?<\/section>\s*/i,
    "",
  );
}

export function polishGoogleMapsArticleHtml(html: string): string {
  if (!html.includes(POST_MARKER)) return html;
  let result = html;
  result = stripOrphanLegacyFaqHeading(result);
  result = stripEmptyLegacyVideoSection(result);
  result = ensureMapsYoutubeEmbed(result);
  return result;
}
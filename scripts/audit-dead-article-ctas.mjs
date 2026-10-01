import fs from "fs";
import {
  auditArticleCtaLinks,
  isBrokenArticleCtaHref,
  isRepairedArticleCtaAnchor,
  repairArticleCtaLinks,
  wrapRepairedArticleCtaBlocks,
} from "../web/src/lib/content/article-ctas.ts";
import {
  stripEmptyElementorSections,
  stripEmptyImageWidgets,
  stripLeadingRedundantElementorSections,
  stripLegacyArticleContactBlocks,
} from "../web/src/lib/content/legacy-blocks.ts";

const posts = JSON.parse(
  fs.readFileSync("web/src/data/content/posts.json", "utf8"),
);

const ELEMENTOR_BUTTON_RE =
  /<a\s([^>]*class="[^"]*elementor-button[^"]*"[^>]*)>[\s\S]*?<\/a>/gi;

function readHref(attrs) {
  return attrs.match(/\shref="([^"]*)"/i)?.[1] ?? "";
}

function prepareForRender(raw) {
  let html = raw;
  html = stripLegacyArticleContactBlocks(html);
  html = stripEmptyImageWidgets(html);
  html = stripEmptyElementorSections(html);
  html = stripLeadingRedundantElementorSections(html);
  html = stripEmptyImageWidgets(html);
  html = repairArticleCtaLinks(html);
  html = wrapRepairedArticleCtaBlocks(html);
  return html;
}

let totalButtons = 0;
let brokenBefore = 0;
let repaired = 0;
let brokenAfter = 0;
const samples = [];

for (const post of posts) {
  const path = decodeURIComponent(new URL(post.link).pathname);
  const stripped = stripLegacyArticleContactBlocks(post.content);
  const before = auditArticleCtaLinks(stripped, post.id, path);

  for (const cta of before.ctas) {
    totalButtons++;
    if (cta.broken) {
      brokenBefore++;
      if (samples.length < 10) {
        samples.push({ path, label: cta.label, href: cta.href });
      }
    }
  }

  const renderedHtml = prepareForRender(post.content);

  let match;
  ELEMENTOR_BUTTON_RE.lastIndex = 0;
  while ((match = ELEMENTOR_BUTTON_RE.exec(renderedHtml)) !== null) {
    const attrs = match[1];
    const href = readHref(attrs);
    if (isRepairedArticleCtaAnchor(attrs)) {
      repaired++;
      continue;
    }
    if (isBrokenArticleCtaHref(href, renderedHtml)) {
      brokenAfter++;
    }
  }
}

const report = {
  articles: posts.length,
  totalButtonsInBody: totalButtons,
  brokenBefore,
  repaired,
  brokenAfter,
  removedWithContactSections: "CTAs inside stripped legacy contact blocks are not rendered",
  action: "data-open-contextual-popup → ContextualLeadPopup (in_article_cta)",
  samples,
};

fs.mkdirSync("migration-audit/phase-5g4-qa", { recursive: true });
fs.writeFileSync(
  "migration-audit/phase-5g4-qa/cta-audit.json",
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));

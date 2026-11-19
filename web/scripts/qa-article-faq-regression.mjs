/**
 * FAQ detection / visibility regression (legacy, injected, none).
 * npx tsx scripts/qa-article-faq-regression.mjs
 */
import { getContentByPath } from "../src/lib/content/loader.ts";
import { prepareArticleBodyHtml } from "../src/lib/content/article.ts";
import { normalizePath } from "../src/lib/content/paths.ts";
import {
  countVisibleFaqSections,
  htmlHasLegacyArticleFaq,
} from "../src/lib/content/article-faq-detect.ts";

const CASES = [
  {
    key: "shopping-he-injected",
    path: "/google-shopping-guide/",
    locale: "he",
    expectLegacyRaw: false,
    expectInject: true,
    maxSections: 1,
  },
  {
    key: "shopping-en-injected",
    path: "/en/google-shopping-guide/",
    locale: "en",
    expectLegacyRaw: false,
    expectInject: true,
    maxSections: 1,
  },
  {
    key: "office-he-injected",
    path: "/משרד-פרסום-דיגיטלי/",
    locale: "he",
    expectLegacyRaw: false,
    expectInject: true,
    maxSections: 1,
  },
  {
    key: "agency-he-injected",
    path: "/סוכנות-שיווק-דיגיטלית/",
    locale: "he",
    expectLegacyRaw: false,
    expectInject: true,
    maxSections: 1,
  },
  {
    key: "marketing-he-legacy-only",
    path: "/שיווק-דיגיטלי-לעסקים/",
    locale: "he",
    expectLegacyRaw: true,
    expectInject: false,
    maxSections: 1,
  },
  {
    key: "seo-ai-pilot-lead-only",
    path: "/seo-2026-ai-answers/",
    locale: "he",
    expectLegacyRaw: false,
    expectInject: false,
    maxSections: 0,
  },
  {
    key: "speed-no-faq",
    path: "/בדיקת-מהירות-אתר/",
    locale: "he",
    expectLegacyRaw: false,
    expectInject: false,
    maxSections: 0,
  },
];

let failed = 0;

for (const c of CASES) {
  const pathKey = normalizePath(c.path);
  const content = getContentByPath(pathKey, c.locale);
  if (!content) {
    console.error("MISSING", c.key);
    failed++;
    continue;
  }
  const rawLegacy = htmlHasLegacyArticleFaq(content.content);
  const { html } = prepareArticleBodyHtml(content.content, c.locale, content.path);
  const audit = countVisibleFaqSections(html);
  const hasInjected = audit.injectedBlocks > 0;

  const okRaw = rawLegacy === c.expectLegacyRaw;
  const okInject = hasInjected === c.expectInject;
  const okSections = audit.totalSections <= c.maxSections;

  if (!okRaw || !okInject || !okSections) {
    console.error("FAIL", c.key, { rawLegacy, audit, expect: c });
    failed++;
  } else {
    console.log("OK", c.key, audit);
  }
}

process.exit(failed ? 1 : 0);
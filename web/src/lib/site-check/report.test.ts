import assert from "node:assert/strict";
import test from "node:test";
import { presentFindings, rankIssues, type AnalyzablePage } from "./findings";
import { parsePageHtml, phonesInText } from "./parse-page";
import { buildSiteCheckReport } from "./report";
import { selectInnerPages } from "./select-pages";
import type { ParsedPage } from "./types";

function page(overrides: Partial<AnalyzablePage> & Pick<AnalyzablePage, "url" | "label">): AnalyzablePage {
  const parsed: ParsedPage = {
    title: "שירות",
    metaDescription: "תיאור",
    robots: "",
    h1: ["שירות"],
    navLinks: [
      { href: "https://example.co.il/about/", text: "אודות", inNav: true },
      { href: "https://example.co.il/contact/", text: "יצירת קשר", inNav: true },
    ],
    links: [],
    hasForm: true,
    hasPurchaseCta: false,
    telHrefs: ["tel:0501234567"],
    hasWhatsapp: false,
    contactPhones: [],
    heroImages: [],
    visibleTextLength: 400,
    ...overrides.parsed,
  };
  return {
    role: "home",
    headerRobots: "",
    truncated: false,
    readable: true,
    parsed,
    ...overrides,
  };
}

test("phone text without a tel link becomes one finding", () => {
  const issues = rankIssues([
    page({
      url: "https://example.co.il/lift/",
      label: "מנוף",
      role: "inner",
      parsed: {
        title: "מנוף",
        metaDescription: "תיאור",
        robots: "",
        h1: ["מנוף"],
        navLinks: [],
        links: [],
        hasForm: false,
        hasPurchaseCta: false,
        telHrefs: [],
        hasWhatsapp: false,
        contactPhones: ["0501234567"],
        heroImages: [],
        visibleTextLength: 300,
      },
    }),
  ]);
  const shown = presentFindings(issues, "he");
  assert.equal(shown.length, 1);
  assert.match(shown[0].observation, /אינו לחיץ/);
  assert.match(shown[0].why, /מובייל/);
  assert.equal(shown[0].pageUrl, "https://example.co.il/lift/");
});

test("a tel link keeps a visible phone number out of the findings", () => {
  const html = `<title>דף</title><h1>שלום</h1><a href="tel:0501234567">050-123-4567</a><p>${"תוכן ".repeat(40)}</p>`;
  const parsed = parsePageHtml(html, "https://example.co.il/");
  assert.equal(parsed.telHrefs.length, 1);
  assert.deepEqual(parsed.contactPhones, []);
  const issues = rankIssues([
    page({
      url: "https://example.co.il/",
      label: "דף הבית",
      parsed,
    }),
  ]);
  assert.equal(issues.some((issue) => issue.type === "phone-not-tappable"), false);
});

test("at most three findings, highest priority first", () => {
  const issues = rankIssues([
    page({
      url: "https://example.co.il/",
      label: "דף הבית",
      headerRobots: "noindex",
      parsed: {
        title: "",
        metaDescription: "",
        robots: "",
        h1: [],
        navLinks: [
          { href: "https://example.co.il/a/", text: "אודות", inNav: true },
          { href: "https://example.co.il/b/", text: "שירותים", inNav: true },
        ],
        links: [],
        hasForm: false,
        hasPurchaseCta: false,
        telHrefs: [],
        hasWhatsapp: false,
        contactPhones: [],
        heroImages: [],
        visibleTextLength: 200,
      },
    }),
  ]);
  assert.equal(issues.length, 3);
  assert.deepEqual(
    issues.map((issue) => issue.type),
    ["noindex", "missing-title", "missing-h1"],
  );
});

test("thin html does not invent a missing heading", () => {
  const parsed = parsePageHtml("<html><title>x</title><body></body></html>", "https://example.co.il/");
  const issues = rankIssues([
    page({
      url: "https://example.co.il/",
      label: "דף הבית",
      readable: parsed.visibleTextLength >= 120,
      parsed,
    }),
  ]);
  assert.equal(issues.some((issue) => issue.type === "missing-h1"), false);
});

test("duplicate titles are one finding and the lead note matches the screen", () => {
  const home = page({ url: "https://example.co.il/", label: "דף הבית" });
  const service = page({
    url: "https://example.co.il/service/",
    label: "שירות",
    role: "inner",
    parsed: { ...home.parsed, title: "שירות" },
  });
  home.parsed = { ...home.parsed, title: "שירות" };
  const findings = presentFindings(rankIssues([home, service]), "he");
  assert.equal(findings.length, 1);
  const report = buildSiteCheckReport({
    locale: "he",
    inputUrl: "https://example.co.il/",
    homeIsRoot: true,
    homeUrl: "https://example.co.il/",
    pages: [
      { url: home.url, label: home.label, role: "home", status: "ok" },
      { url: service.url, label: service.label, role: "inner", status: "ok" },
    ],
    failedUrls: ["https://example.co.il/missing/"],
    thinCount: 0,
    nothingReadable: false,
    findings,
    analyzable: [home, service],
    partialScan: true,
    contentPlanned: 3,
    contentScanned: 2,
    brokenLinksVerified: 0,
    linkProbesRun: 4,
    imageProbesRun: 1,
    brokenImagesCount: 0,
    imageProbeStats: {
      imagesProbed: 1,
      pagesWithImages: 1,
      loadedOk: 1,
      broken: 0,
      unverified: 0,
    },
    durationMs: 1200,
  });
  assert.match(report.scopeLine, /דף הבית/);
  assert.equal(report.topicSummaries.length, 3);
  assert.equal(report.metrics.contentScanned, 2);
  assert.match(report.leadNote, /כתובת האתר: example\.co\.il/);
  assert.match(report.leadNote, new RegExp(findings[0].observation));
  assert.match(report.leadNote, new RegExp(findings[0].why));
  assert.doesNotMatch(report.leadNote, /תכנית עבודה/);
  assert.equal(report.findings.length, 1);
});

test("inner page selection prefers contact and service links", () => {
  const picked = selectInnerPages(
    "https://example.co.il/",
    [
      { href: "https://example.co.il/blog/post/", text: "מאמר", inNav: false },
      { href: "https://example.co.il/contact/", text: "יצירת קשר", inNav: true },
      { href: "https://example.co.il/crane-service/", text: "שירות מנוף", inNav: true },
      { href: "https://other.test/", text: "חיצוני", inNav: true },
      { href: "https://example.co.il/", text: "בית", inNav: true },
    ],
    null,
    3,
  );
  assert.equal(picked[0], "https://example.co.il/contact/");
  assert.ok(picked.includes("https://example.co.il/crane-service/"));
  assert.equal(picked.some((url) => url.includes("other.test")), false);
});

test("israeli phone parser ignores short numbers", () => {
  assert.deepEqual(phonesInText("שנת 2024 ומחיר 1500"), []);
  assert.deepEqual(phonesInText("התקשרו 03-1234567"), ["031234567"]);
});

test("contact phones need contact context", () => {
  const parsed = parsePageHtml(
    `<title>דף</title><h1>שלום</h1><p>Leads 050-1234567 +18%</p><p>טלפון: 079-5599449</p>`,
    "https://example.co.il/",
  );
  assert.deepEqual(parsed.contactPhones, ["0795599449"]);
});

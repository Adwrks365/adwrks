import type { PageSpeedInsightsLabels } from "./pagespeed-insights-data";

export const PAGESPEED_INSIGHTS_LABELS_EN: PageSpeedInsightsLabels = {
  title: "Website speed test (PageSpeed Insights)",
  intro: "Enter a URL to get Lighthouse scores from Google — performance, accessibility, best practices, and SEO.",
  urlLabel: "Website URL",
  urlPlaceholder: "example.com",
  urlHint: "With or without www, and with or without https. For example: example.com",
  strategy: "Device",
  strategyMobile: "Mobile",
  strategyDesktop: "Desktop",
  submit: "Run test",
  retry: "New test",
  running: "Running test… Results will appear in a few seconds.",
  poweredBy: "Powered by the Google PageSpeed Insights API",
  remaining: "{count} checks left today (max {limit}).",
  limitReached: "Daily limit reached ({limit} checks). Try again tomorrow.",
  errorGeneric: "Could not complete the test. Check the URL and try again.",
  errorInvalidUrl: "Invalid URL.",
  errorUnavailable: "The speed test is unavailable right now.",
  categories: {
    performance: "Performance",
    accessibility: "Accessibility",
    bestPractices: "Best practices",
    seo: "SEO",
  },
  performanceHint: "Recommendation",
  resultsHeading: "{strategy} results",
  psiNote:
    "Scores come from the same PageSpeed Insights API. Small differences vs pagespeed.web.dev can happen due to run timing and cache.",
  switchStrategyHint: "Running a {strategy} test uses another daily check ({count} left today).",
};

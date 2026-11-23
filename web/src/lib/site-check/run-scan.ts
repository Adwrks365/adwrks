import { discoverSitemapUrls } from "./discover-sitemap";
import { fetchPagesWithBudget } from "./fetch-pool";
import { presentFindings, rankIssues, type AnalyzablePage } from "./findings";
import { parsePageHtml } from "./parse-page";
import { probeInternalLink } from "./probe-link";
import { buildSiteCheckReport } from "./report";
import { pageIntent, pickLinksToProbe, planScanUrls, samePage } from "./select-pages";
import type { ScannedPage, SiteCheckLocale, SiteCheckReport } from "./types";
import { canonicalScanUrl, siteOrigin } from "./url-canonical";
import type { FetchFailureReason } from "./fetch-page";
import { fetchPublicHtml } from "./fetch-page";
import { normalizePageSpeedTargetUrl } from "@/lib/pagespeed/validate-url";

const READABLE_MIN = 120;
const MAX_PAGES = 20;
const FETCH_CONCURRENCY = 3;
const SCAN_BUDGET_MS = 24_000;
const MAX_LINK_PROBES = 8;

function displayUrl(url: string): string {
  try {
    return decodeURI(url);
  } catch {
    return url;
  }
}

function labelFor(
  url: string,
  title: string,
  isEntry: boolean,
  isHome: boolean,
  locale: SiteCheckLocale,
): string {
  let path = "/";
  try {
    path = new URL(url).pathname.replace(/\/+$/, "") || "/";
  } catch {
    path = "/";
  }
  if (isEntry && !isHome) return locale === "en" ? "Page you entered" : "העמוד שהוזן";
  if (isHome && path === "/") return locale === "en" ? "Homepage" : "דף הבית";
  const clean = title.replace(/\s+/g, " ").trim();
  if (clean && clean.length <= 48) return clean;
  if (path !== "/") return displayUrl(path);
  return locale === "en" ? "Inner page" : "עמוד פנימי";
}

export type SiteCheckFailure = {
  ok: false;
  reason: "invalid_url" | "home_unreadable";
  normalizedUrl?: string;
  finalUrl?: string;
  fetchReason?: FetchFailureReason;
  httpStatus?: number;
};

export async function runSiteCheck(
  rawUrl: string,
  locale: SiteCheckLocale,
): Promise<SiteCheckReport | SiteCheckFailure> {
  const started = Date.now();
  const inputUrl = normalizePageSpeedTargetUrl(rawUrl);
  if (!inputUrl) return { ok: false, reason: "invalid_url" };

  const entryCanonical = canonicalScanUrl(inputUrl);
  const origin = siteOrigin(inputUrl);
  if (!entryCanonical || !origin) return { ok: false, reason: "invalid_url" };
  const homeUrl = origin;

  const sitemapUrls = await discoverSitemapUrls(origin).catch(() => [] as string[]);

  let discoveryHtml = "";
  let discoveryLinks: ReturnType<typeof parsePageHtml>["links"] = [];

  const entryFetch = await fetchPublicHtml(entryCanonical);
  if (entryFetch.ok) {
    const parsed = parsePageHtml(entryFetch.html, entryFetch.url);
    discoveryLinks = parsed.links;
    discoveryHtml = entryFetch.html;
  }

  if (!samePage(entryCanonical, homeUrl)) {
    const homeFetch = await fetchPublicHtml(homeUrl);
    if (homeFetch.ok) {
      const homeParsed = parsePageHtml(homeFetch.html, homeFetch.url);
      discoveryLinks = [...discoveryLinks, ...homeParsed.links];
    }
  } else if (!entryFetch.ok) {
    const homeFetch = await fetchPublicHtml(homeUrl);
    if (!homeFetch.ok) {
      return {
        ok: false,
        reason: "home_unreadable",
        normalizedUrl: displayUrl(entryCanonical),
        finalUrl: displayUrl(homeFetch.url),
        fetchReason: homeFetch.reason,
        httpStatus: homeFetch.httpStatus,
      };
    }
    const parsed = parsePageHtml(homeFetch.html, homeFetch.url);
    discoveryLinks = parsed.links;
  }

  if (!entryFetch.ok && !samePage(entryCanonical, homeUrl)) {
    return {
      ok: false,
      reason: "home_unreadable",
      normalizedUrl: displayUrl(entryCanonical),
      finalUrl: displayUrl(entryFetch.url),
      fetchReason: entryFetch.reason,
      httpStatus: entryFetch.httpStatus,
    };
  }

  const plannedUrls = planScanUrls({
    entryUrl: entryCanonical,
    homeUrl,
    links: discoveryLinks,
    sitemapUrls,
    maxPages: MAX_PAGES,
  });

  const elapsedBeforePool = Date.now() - started;
  const poolBudget = Math.max(4_000, SCAN_BUDGET_MS - elapsedBeforePool);
  const { results, timedOut } = await fetchPagesWithBudget(plannedUrls, {
    concurrency: FETCH_CONCURRENCY,
    deadlineMs: poolBudget,
  });

  const loaded: Array<{
    url: string;
    html: string;
    headerRobots: string;
    truncated: boolean;
    isEntry: boolean;
    isHome: boolean;
  }> = [];
  const failedUrls: string[] = [];

  for (let i = 0; i < plannedUrls.length; i += 1) {
    const planned = plannedUrls[i]!;
    const row = results[i];
    const isEntry = samePage(planned, entryCanonical);
    const isHome = samePage(planned, homeUrl);
    if (!row || !row.ok) {
      failedUrls.push(planned);
      continue;
    }
    loaded.push({
      url: row.url,
      html: row.html,
      headerRobots: row.headerRobots,
      truncated: row.truncated,
      isEntry,
      isHome,
    });
  }

  if (loaded.length === 0) {
    const fallback = entryFetch.ok ? entryFetch : await fetchPublicHtml(homeUrl);
    if (!fallback.ok) {
      return {
        ok: false,
        reason: "home_unreadable",
        normalizedUrl: displayUrl(entryCanonical),
        finalUrl: displayUrl(fallback.url),
        fetchReason: fallback.reason,
        httpStatus: fallback.httpStatus,
      };
    }
    loaded.push({
      url: fallback.url,
      html: fallback.html,
      headerRobots: fallback.headerRobots,
      truncated: fallback.truncated,
      isEntry: samePage(fallback.url, entryCanonical),
      isHome: samePage(fallback.url, homeUrl),
    });
  }

  const probeSource = loaded.find((page) => page.isEntry) ?? loaded.find((page) => page.isHome) ?? loaded[0]!;
  const probeParsed = parsePageHtml(probeSource.html, probeSource.url);
  const toProbe = pickLinksToProbe(homeUrl, probeParsed.links, MAX_LINK_PROBES);
  const brokenLinks: { url: string; label: string; fromLabel: string }[] = [];

  for (const href of toProbe) {
    if (Date.now() - started > SCAN_BUDGET_MS) break;
    const probe = await probeInternalLink(href);
    if (probe !== "broken") continue;
    let label = href;
    try {
      label = new URL(href).pathname;
    } catch {
      /* keep full url */
    }
    brokenLinks.push({
      url: displayUrl(href),
      label,
      fromLabel: labelFor(probeSource.url, probeParsed.title, probeSource.isEntry, probeSource.isHome, locale),
    });
    if (brokenLinks.length >= 3) break;
  }

  const analyzable: AnalyzablePage[] = loaded.map((page) => {
    const parsed = parsePageHtml(page.html, page.url);
    const readable = parsed.visibleTextLength >= READABLE_MIN;
    return {
      url: displayUrl(page.url),
      label: labelFor(page.url, parsed.title, page.isEntry, page.isHome, locale),
      role: page.isHome ? "home" : "inner",
      parsed,
      headerRobots: page.headerRobots,
      truncated: page.truncated,
      readable,
      intent: pageIntent(page.url, parsed.title),
      isEntry: page.isEntry,
    };
  });

  const pages: ScannedPage[] = [
    ...analyzable.map((page) => ({
      url: page.url,
      label: page.label,
      role: page.role,
      status: page.readable ? ("ok" as const) : ("thin" as const),
    })),
    ...failedUrls
      .filter((url, index, all) => all.indexOf(url) === index)
      .filter((url) => !analyzable.some((page) => samePage(page.url, url)))
      .map((url) => ({
        url: displayUrl(url),
        label: displayUrl(url),
        role: samePage(url, homeUrl) ? ("home" as const) : ("inner" as const),
        status: "failed" as const,
      })),
  ];

  const findings = presentFindings(rankIssues(analyzable, { brokenLinks, locale }), locale);
  const pagesPlanned = plannedUrls.length;
  const pagesScanned = analyzable.length;
  const partialScan = timedOut || failedUrls.length > 0 || pagesScanned < pagesPlanned;
  const durationMs = Date.now() - started;
  const homeForSpeed = analyzable.find((page) => page.role === "home")?.url ?? homeUrl;

  return buildSiteCheckReport({
    locale,
    inputUrl: entryCanonical,
    homeIsRoot: samePage(entryCanonical, homeUrl),
    homeUrl: homeForSpeed,
    pages,
    failedUrls: pages.filter((page) => page.status === "failed").map((page) => page.url),
    thinCount: analyzable.filter((page) => !page.readable).length,
    nothingReadable: analyzable.every((page) => !page.readable),
    findings,
    analyzable,
    partialScan,
    pagesPlanned,
    pagesScanned: analyzable.length,
    durationMs,
  });
}
import { discoverSitemapUrls } from "./discover-sitemap";
import { detectSiteKindFromSignals } from "./site-kind";
import { fetchPagesWithBudget } from "./fetch-pool";
import { presentFindings, rankIssues, type AnalyzablePage } from "./findings";
import { parsePageHtml } from "./parse-page";
import { tallyImageProbeResult } from "./image-probe-stats";
import type { ImageProbeStats } from "./types";
import { probeImageAsset, probeInternalLink } from "./probe-link";
import { selectHeroImagesToProbe } from "./select-hero-images";
import { buildBusinessInsights } from "./business-insights";
import {
  auditStorePages,
  countPageTypes,
  formatPageTypeSummary,
} from "./page-type-summary";
import { suggestSearchPhrases } from "./search-phrase-suggest";
import { attachCommerceKind, extractItemProductUrls } from "./store-page-classify";
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

  let discoveryHtml = "";
  let discoveryLinks: ReturnType<typeof parsePageHtml>["links"] = [];

  const entryFetch = await fetchPublicHtml(entryCanonical, { timeoutMs: 12_000, retries: 2 });
  const sitemapUrls = entryFetch.ok
    ? await Promise.race([
        discoverSitemapUrls(origin),
        new Promise<string[]>((resolve) => setTimeout(() => resolve([]), 2_500)),
      ]).catch(() => [] as string[])
    : [];
  if (entryFetch.ok) {
    const parsed = parsePageHtml(entryFetch.html, entryFetch.url);
    discoveryLinks = parsed.links;
    discoveryHtml = entryFetch.html;
  }

  let homeParsedForKind: ReturnType<typeof parsePageHtml> | null = null;

  if (!samePage(entryCanonical, homeUrl)) {
    const homeFetch = await fetchPublicHtml(homeUrl, { timeoutMs: 12_000, retries: 2 });
    if (homeFetch.ok) {
      const homeParsed = parsePageHtml(homeFetch.html, homeFetch.url);
      homeParsedForKind = homeParsed;
      discoveryLinks = [...discoveryLinks, ...homeParsed.links];
    }
  } else if (!entryFetch.ok) {
    const homeFetch = await fetchPublicHtml(homeUrl, { timeoutMs: 12_000, retries: 2 });
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

  const entryParsedForKind = entryFetch.ok ? parsePageHtml(entryFetch.html, entryFetch.url) : null;
  if (!homeParsedForKind && entryParsedForKind) homeParsedForKind = entryParsedForKind;
  const siteKind = detectSiteKindFromSignals({
    entryIsHome: samePage(entryCanonical, homeUrl),
    entryParsed: entryParsedForKind,
    homeParsed: homeParsedForKind,
    innerLinkCount: discoveryLinks.length,
  });

  const planPageBudget = siteKind === "store" ? Math.max(12, MAX_PAGES - 6) : MAX_PAGES;
  const plannedUrls = planScanUrls({
    entryUrl: entryCanonical,
    homeUrl,
    links: discoveryLinks,
    sitemapUrls,
    maxPages: planPageBudget,
    siteKind,
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
  let duplicatePlannedPages = 0;

  function addLoadedPage(page: (typeof loaded)[number]): boolean {
    const existing = loaded.find((item) => samePage(item.url, page.url));
    if (existing) {
      existing.isHome ||= page.isHome;
      existing.isEntry ||= page.isEntry;
      return false;
    }
    loaded.push(page);
    return true;
  }

  for (let i = 0; i < plannedUrls.length; i += 1) {
    const planned = plannedUrls[i]!;
    const row = results[i];
    const isEntry = samePage(planned, entryCanonical);
    const isHome = samePage(planned, homeUrl);
    if (!row || !row.ok) {
      failedUrls.push(planned);
      continue;
    }
    const added = addLoadedPage({
      url: row.url,
      html: row.html,
      headerRobots: row.headerRobots,
      truncated: row.truncated,
      isEntry,
      isHome,
    });
    if (!added) duplicatePlannedPages += 1;
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

  if (siteKind === "store" && loaded.length < MAX_PAGES) {
    const seenProductUrls = new Set(
      loaded.map((page) => canonicalScanUrl(page.url)).filter((value): value is string => Boolean(value)),
    );
    const pendingItemUrls: string[] = [];
    for (const page of loaded) {
      const parsed = parsePageHtml(page.html, page.url);
      for (const itemUrl of extractItemProductUrls(page.html, page.url, parsed, 10)) {
        const canonical = canonicalScanUrl(itemUrl);
        if (!canonical || seenProductUrls.has(canonical)) continue;
        seenProductUrls.add(canonical);
        pendingItemUrls.push(canonical);
        if (pendingItemUrls.length >= 8) break;
      }
      if (pendingItemUrls.length >= 8) break;
    }
    const maxExtra = Math.min(6, MAX_PAGES - loaded.length, pendingItemUrls.length);
    for (let i = 0; i < maxExtra; i += 1) {
      if (Date.now() - started > SCAN_BUDGET_MS - 4_000) break;
      const href = pendingItemUrls[i]!;
      const extra = await fetchPublicHtml(href, { timeoutMs: 10_000, retries: 1 });
      if (!extra.ok) continue;
      addLoadedPage({
        url: extra.url,
        html: extra.html,
        headerRobots: extra.headerRobots,
        truncated: extra.truncated,
        isEntry: false,
        isHome: false,
      });
    }
  }

  const probeSource = loaded.find((page) => page.isEntry) ?? loaded.find((page) => page.isHome) ?? loaded[0]!;
  const probeParsed = parsePageHtml(probeSource.html, probeSource.url);
  const toProbe = pickLinksToProbe(homeUrl, probeParsed.links, MAX_LINK_PROBES, siteKind);
  const brokenLinks: { url: string; label: string; fromLabel: string }[] = [];
  let linkProbesRun = 0;
  let linksVerifiedOk = 0;

  for (const href of toProbe) {
    if (Date.now() - started > SCAN_BUDGET_MS) break;
    linkProbesRun += 1;
    const probe = await probeInternalLink(href);
    if (probe === "ok") linksVerifiedOk += 1;
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
    const base: AnalyzablePage = {
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
    return siteKind === "store" ? attachCommerceKind(base, page.html) : base;
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

  const brokenImages: { url: string; pageUrl: string; pageLabel: string }[] = [];
  const imageStats: ImageProbeStats = {
    imagesProbed: 0,
    pagesWithImages: 0,
    loadedOk: 0,
    broken: 0,
    unverified: 0,
  };
  const heroCandidates = selectHeroImagesToProbe(analyzable, homeUrl, siteKind);
  const pagesWithProbe = new Set<string>();
  for (const candidate of heroCandidates) {
    if (Date.now() - started > SCAN_BUDGET_MS) break;
    const probe = await probeImageAsset(candidate.imageUrl);
    imageStats.imagesProbed += 1;
    pagesWithProbe.add(candidate.pageUrl);
    const bucket = tallyImageProbeResult(probe);
    imageStats[bucket] += 1;
    if (probe === "broken") {
      brokenImages.push({
        url: displayUrl(candidate.imageUrl),
        pageUrl: candidate.pageUrl,
        pageLabel: candidate.pageLabel,
      });
      if (brokenImages.length >= 2) break;
    }
  }
  imageStats.pagesWithImages = pagesWithProbe.size;
  const imageProbesRun = imageStats.imagesProbed;

  const ranked = rankIssues(analyzable, { brokenLinks, brokenImages, locale, siteKind });
  const rankedTop = ranked.slice(0, 3);
  const findings = presentFindings(ranked, locale);
  const pageTypeCounts = countPageTypes(analyzable);
  const pageTypeSummary = formatPageTypeSummary(locale, siteKind, pageTypeCounts);
  const suggestedSearchPhrases = suggestSearchPhrases(analyzable, siteKind, locale);
  const storeAudit = siteKind === "store" ? auditStorePages(analyzable, locale) : null;
  const businessInsights = buildBusinessInsights({
    locale,
    findings,
    ranked: rankedTop,
  });
  const contentPlanned = siteKind === "store" ? MAX_PAGES : plannedUrls.length - duplicatePlannedPages;
  const contentScanned = analyzable.length;
  const partialScan = timedOut || failedUrls.length > 0 || contentScanned < contentPlanned;
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
    businessInsights,
    siteKind,
    pageTypeSummary,
    storeSnapshot: storeAudit,
    suggestedSearchPhrases,
    analyzable,
    partialScan,
    contentPlanned,
    contentScanned,
    brokenLinksVerified: brokenLinks.length,
    linkProbesRun,
    linksVerifiedOk,
    imageProbesRun,
    brokenImagesCount: brokenImages.length,
    imageProbeStats: imageStats,
    durationMs,
  });
}
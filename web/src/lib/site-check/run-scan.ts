import { fetchPublicHtml, type FetchFailureReason } from "./fetch-page";
import { presentFindings, rankIssues, type AnalyzablePage } from "./findings";
import { parsePageHtml } from "./parse-page";
import { buildSiteCheckReport } from "./report";
import { samePage, selectInnerPages } from "./select-pages";
import type { ScannedPage, SiteCheckLocale, SiteCheckReport } from "./types";
import { normalizePageSpeedTargetUrl } from "@/lib/pagespeed/validate-url";

const READABLE_MIN = 120;

function displayUrl(url: string): string {
  try {
    return decodeURI(url);
  } catch {
    return url;
  }
}

function labelFor(url: string, title: string, isPrimary: boolean, locale: SiteCheckLocale): string {
  let path = "/";
  try {
    path = new URL(url).pathname.replace(/\/+$/, "") || "/";
  } catch {
    path = "/";
  }
  if (isPrimary && path === "/") return locale === "en" ? "Homepage" : "דף הבית";
  if (isPrimary) return locale === "en" ? "Page you entered" : "העמוד שהוזן";
  const clean = title.replace(/\s+/g, " ").trim();
  if (clean && clean.length <= 48) return clean;
  if (path !== "/") return displayUrl(path);
  return locale === "en" ? "Inner page" : "עמוד פנימי";
}

function originHome(url: string): string {
  const parsed = new URL(url);
  return new URL("/", parsed.origin).toString();
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
  const inputUrl = normalizePageSpeedTargetUrl(rawUrl);
  if (!inputUrl) return { ok: false, reason: "invalid_url" };

  const homeUrl = originHome(inputUrl);
  const homeIsRoot = samePage(inputUrl, homeUrl);
  const preferred = homeIsRoot ? null : inputUrl;
  const homeFetch = await fetchPublicHtml(homeIsRoot ? inputUrl : homeUrl);

  const failedUrls: string[] = [];
  let loadedPrimary = homeFetch;
  const failureFrom = (result: Extract<typeof homeFetch, { ok: false }>): SiteCheckFailure => ({
    ok: false,
    reason: "home_unreadable",
    normalizedUrl: displayUrl(inputUrl),
    finalUrl: displayUrl(result.url),
    fetchReason: result.reason,
    httpStatus: result.httpStatus,
  });

  if (!homeFetch.ok) {
    failedUrls.push(homeUrl);
    if (!preferred) return failureFrom(homeFetch);
    loadedPrimary = await fetchPublicHtml(preferred);
  }
  if (!loadedPrimary.ok) return failureFrom(loadedPrimary);

  const primaryParsed = parsePageHtml(loadedPrimary.html, loadedPrimary.url);
  const innerUrls = selectInnerPages(
    loadedPrimary.url,
    primaryParsed.links,
    homeFetch.ok ? preferred : null,
    3,
  );
  const innerFetches = [];
  for (const url of innerUrls) {
    innerFetches.push({ url, result: await fetchPublicHtml(url) });
  }

  const loaded: Array<{ url: string; html: string; headerRobots: string; truncated: boolean; isPrimary: boolean }> = [
    {
      url: loadedPrimary.url,
      html: loadedPrimary.html,
      headerRobots: loadedPrimary.headerRobots,
      truncated: loadedPrimary.truncated,
      isPrimary: true,
    },
  ];
  for (const inner of innerFetches) {
    if (!inner.result.ok) {
      failedUrls.push(inner.url);
      continue;
    }
    loaded.push({
      url: inner.result.url,
      html: inner.result.html,
      headerRobots: inner.result.headerRobots,
      truncated: inner.result.truncated,
      isPrimary: false,
    });
  }

  const analyzable: AnalyzablePage[] = loaded.map((page) => {
    const parsed = page.isPrimary ? primaryParsed : parsePageHtml(page.html, page.url);
    const readable = parsed.visibleTextLength >= READABLE_MIN;
    return {
      url: displayUrl(page.url),
      label: labelFor(page.url, parsed.title, page.isPrimary, locale),
      role: page.isPrimary ? "home" : "inner",
      parsed,
      headerRobots: page.headerRobots,
      truncated: page.truncated,
      readable,
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
      .filter((url) => url !== homeUrl || !homeFetch.ok)
      .filter((url, index, all) => all.indexOf(url) === index)
      .map((url) => ({
        url: displayUrl(url),
        label: displayUrl(url),
        role: samePage(url, homeUrl) ? ("home" as const) : ("inner" as const),
        status: "failed" as const,
      })),
  ];

  const findings = presentFindings(rankIssues(analyzable), locale);

  return buildSiteCheckReport({
    locale,
    inputUrl,
    homeIsRoot: samePage(loadedPrimary.url, homeUrl),
    pages,
    failedUrls: pages.filter((page) => page.status === "failed").map((page) => page.url),
    thinCount: analyzable.filter((page) => !page.readable).length,
    nothingReadable: analyzable.every((page) => !page.readable),
    findings,
  });
}

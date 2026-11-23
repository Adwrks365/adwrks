import { isLocalSiteCheckFixtureUrl, normalizePageSpeedTargetUrl } from "@/lib/pagespeed/validate-url";
import { isPublicHostname } from "./fetch-page";

const PROBE_TIMEOUT_MS = 4_000;
const PROBE_RETRY_DELAY_MS = 700;

export type LinkProbeResult = "ok" | "broken" | "blocked" | "timeout";

/** Only definite “missing page” statuses become broken-link findings (not 429/5xx). */
export function isDefiniteBrokenLinkStatus(status: number): boolean {
  return status === 404 || status === 410;
}

function isTransientProbeStatus(status: number): boolean {
  return (
    status === 408 ||
    status === 429 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    status >= 500
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function probeInternalLink(rawUrl: string): Promise<LinkProbeResult> {
  const current = normalizePageSpeedTargetUrl(rawUrl);
  if (!current) return "blocked";
  let parsed: URL;
  try {
    parsed = new URL(current);
  } catch {
    return "blocked";
  }
  if (!isLocalSiteCheckFixtureUrl(parsed)) {
    const hostCheck = await isPublicHostname(parsed.hostname);
    if (hostCheck !== true) return "blocked";
  }

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(current, {
        method: "GET",
        redirect: "follow",
        cache: "no-store",
        signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
        headers: {
          Accept: "text/html,application/xhtml+xml",
          "User-Agent": "Mozilla/5.0 (compatible; AdwrksSiteCheck/1.0; +https://adwrks.co.il/)",
        },
      });
      if (isDefiniteBrokenLinkStatus(response.status)) return "broken";
      if (isTransientProbeStatus(response.status)) {
        if (attempt === 0) {
          await sleep(PROBE_RETRY_DELAY_MS);
          continue;
        }
        return "timeout";
      }
      if (response.status >= 400) return "timeout";
      return "ok";
    } catch {
      if (attempt === 0) {
        await sleep(PROBE_RETRY_DELAY_MS);
        continue;
      }
      return "timeout";
    }
  }
  return "timeout";
}
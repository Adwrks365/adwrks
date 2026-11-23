import { isLocalSiteCheckFixtureUrl, normalizePageSpeedTargetUrl } from "@/lib/pagespeed/validate-url";
import { isPublicHostname } from "./fetch-page";

const PROBE_TIMEOUT_MS = 4_000;

export type LinkProbeResult = "ok" | "broken" | "blocked" | "timeout";

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
    if (response.status >= 400) return "broken";
    return "ok";
  } catch {
    return "timeout";
  }
}
const BLOCKED_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "[::1]",
  "metadata.google.internal",
]);

function isPrivateIpv4(host: string): boolean {
  const parts = host.split(".").map((p) => Number.parseInt(p, 10));
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n) || n < 0 || n > 255)) {
    return false;
  }
  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  return false;
}

const LOCAL_FIXTURE_PATH = "/site-check-sample";

/** Dev/preview fixture HTML under `public/site-check-sample/` (blocked hosts otherwise). */
export function isLocalSiteCheckFixtureUrl(parsed: URL): boolean {
  const path = parsed.pathname.replace(/\/+$/, "") || "/";
  if (!path.startsWith(LOCAL_FIXTURE_PATH)) return false;
  const host = parsed.hostname.toLowerCase();
  const port = parsed.port || (parsed.protocol === "https:" ? "443" : "80");
  if ((host === "localhost" || host === "127.0.0.1") && port === "3000") return true;
  if (host.endsWith(".vercel.app") && (port === "443" || port === "")) return true;
  if (host === "adwrks.co.il" || host === "www.adwrks.co.il") return true;
  return false;
}

/** Normalize and validate a public http(s) URL for PageSpeed checks. */
export function normalizePageSpeedTargetUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let parsed: URL;
  try {
    parsed = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return null;
  }

  const host = parsed.hostname.toLowerCase();
  if (isLocalSiteCheckFixtureUrl(parsed)) {
    parsed.hash = "";
    return parsed.toString();
  }
  if (!host || host.endsWith(".local") || BLOCKED_HOSTS.has(host)) {
    return null;
  }

  if (isPrivateIpv4(host)) {
    return null;
  }

  if (host.includes(":") && (host.startsWith("fe80:") || host.startsWith("fc") || host.startsWith("fd"))) {
    return null;
  }

  parsed.hash = "";
  return parsed.toString();
}

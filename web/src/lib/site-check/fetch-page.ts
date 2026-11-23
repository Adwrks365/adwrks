import { lookup } from "node:dns/promises";
import { isLocalSiteCheckFixtureUrl, normalizePageSpeedTargetUrl } from "@/lib/pagespeed/validate-url";

const MAX_BYTES = 800_000;
const MAX_REDIRECTS = 3;
const FETCH_TIMEOUT_MS = 10_000;
const FETCH_RETRY_DELAY_MS = 500;

export type FetchFailureReason =
  | "blocked"
  | "dns"
  | "http"
  | "not_html"
  | "timeout"
  | "empty";

export type FetchHtmlResult =
  | { ok: true; url: string; html: string; headerRobots: string; truncated: boolean }
  | { ok: false; url: string; reason: FetchFailureReason; httpStatus?: number };

function isPrivateAddress(address: string): boolean {
  const host = address.toLowerCase().replace(/^\[|\]$/g, "");
  if (host === "::1" || host === "0:0:0:0:0:0:0:1") return true;
  if (host.startsWith("fe80:") || host.startsWith("fc") || host.startsWith("fd")) return true;
  if (host.startsWith("::ffff:")) return isPrivateAddress(host.slice(7));

  const parts = host.split(".").map((part) => Number.parseInt(part, 10));
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n) || n < 0 || n > 255)) return false;
  const [a, b] = parts;
  if (a === 10 || a === 127 || a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  return false;
}

export async function isPublicHostname(hostname: string): Promise<true | FetchFailureReason> {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (!host || host.endsWith(".local") || host === "metadata.google.internal" || host === "metadata") {
    return "blocked";
  }
  if (isPrivateAddress(host)) return "blocked";
  try {
    const records = await lookup(host, { all: true, verbatim: true });
    if (records.length === 0) return "dns";
    if (records.some((record) => isPrivateAddress(record.address))) return "blocked";
    return true;
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
    if (code === "ENOTFOUND" || code === "ESERVFAIL") return "dns";
    return "blocked";
  }
}

async function readBody(response: Response): Promise<{ html: string; truncated: boolean } | null> {
  const reader = response.body?.getReader();
  if (!reader) {
    const text = await response.text();
    if (!text) return null;
    return { html: text.slice(0, MAX_BYTES), truncated: text.length > MAX_BYTES };
  }
  const chunks: Uint8Array[] = [];
  let total = 0;
  let truncated = false;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    if (total + value.byteLength > MAX_BYTES) {
      chunks.push(value.slice(0, MAX_BYTES - total));
      truncated = true;
      await reader.cancel().catch(() => undefined);
      break;
    }
    chunks.push(value);
    total += value.byteLength;
  }
  const html = new TextDecoder("utf-8", { fatal: false }).decode(concat(chunks));
  if (!html.trim()) return null;
  return { html, truncated };
}

function concat(chunks: Uint8Array[]): Uint8Array {
  const size = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
  const out = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPublicHtmlOnce(rawUrl: string, timeoutMs: number): Promise<FetchHtmlResult> {
  let current = normalizePageSpeedTargetUrl(rawUrl);
  if (!current) return { ok: false, url: rawUrl, reason: "blocked" };

  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    let parsed: URL;
    try {
      parsed = new URL(current);
    } catch {
      return { ok: false, url: current, reason: "blocked" };
    }
    if (!isLocalSiteCheckFixtureUrl(parsed)) {
      const hostCheck = await isPublicHostname(parsed.hostname);
      if (hostCheck !== true) {
        return { ok: false, url: current, reason: hostCheck };
      }
    }

    let response: Response;
    try {
      response = await fetch(current, {
        method: "GET",
        redirect: "manual",
        cache: "no-store",
        signal: AbortSignal.timeout(timeoutMs),
        headers: {
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "he,en;q=0.8",
          "User-Agent": "Mozilla/5.0 (compatible; AdwrksSiteCheck/1.0; +https://adwrks.co.il/)",
        },
      });
    } catch (error) {
      const code = error && typeof error === "object" && "cause" in error ? (error.cause as { code?: string })?.code : "";
      const direct =
        error && typeof error === "object" && "code" in error ? String((error as { code?: string }).code) : "";
      if (code === "ENOTFOUND" || direct === "ENOTFOUND") {
        return { ok: false, url: current, reason: "dns" };
      }
      return { ok: false, url: current, reason: "timeout" };
    }

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location || hop === MAX_REDIRECTS) return { ok: false, url: current, reason: "http" };
      try {
        current = new URL(location, current).toString();
      } catch {
        return { ok: false, url: current, reason: "blocked" };
      }
      const next = normalizePageSpeedTargetUrl(current);
      if (!next) return { ok: false, url: current, reason: "blocked" };
      current = next;
      continue;
    }

    if (!response.ok) {
      return { ok: false, url: current, reason: "http", httpStatus: response.status };
    }
    const type = response.headers.get("content-type") ?? "";
    if (!/text\/html|application\/xhtml\+xml/i.test(type)) {
      return { ok: false, url: current, reason: "not_html" };
    }
    const body = await readBody(response);
    if (!body) return { ok: false, url: current, reason: "empty" };
    return {
      ok: true,
      url: current,
      html: body.html,
      headerRobots: response.headers.get("x-robots-tag") ?? "",
      truncated: body.truncated,
    };
  }

  return { ok: false, url: current, reason: "http" };
}

export async function fetchPublicHtml(
  rawUrl: string,
  options?: { timeoutMs?: number; retries?: number },
): Promise<FetchHtmlResult> {
  const timeoutMs = options?.timeoutMs ?? FETCH_TIMEOUT_MS;
  const retries = Math.max(1, options?.retries ?? 2);
  let last: FetchHtmlResult = { ok: false, url: rawUrl, reason: "timeout" };
  for (let attempt = 0; attempt < retries; attempt += 1) {
    last = await fetchPublicHtmlOnce(rawUrl, timeoutMs);
    if (last.ok) return last;
    if (attempt < retries - 1 && (last.reason === "timeout" || last.httpStatus === 429)) {
      await sleep(FETCH_RETRY_DELAY_MS * (attempt + 1));
      continue;
    }
    return last;
  }
  return last;
}

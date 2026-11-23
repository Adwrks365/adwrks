import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "adwrks_site_check_day";
const COOKIE_MAX_AGE = 60 * 60 * 48;
export const SITE_CHECK_DAILY_LIMIT = 8;

type UsagePayload = { date: string; count: number };

export type SiteCheckUsage = { limit: number; remaining: number; used: number };

type IpBucket = { date: string; count: number };

function utcDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Production deploys only — Preview uses cookie quota like dev/staging with configured secret. */
function isProductionDeploy(): boolean {
  return process.env.VERCEL_ENV === "production";
}

function getSecret(): string | null {
  const candidates = [
    process.env.SITE_CHECK_USAGE_SECRET,
    process.env.PAGESPEED_USAGE_SECRET,
    process.env.ARTICLE_RATING_VOTER_SECRET,
    process.env.PAGESPEED_API_KEY,
  ];
  for (const value of candidates) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  if (process.env.NODE_ENV !== "production") return "dev-site-check-usage";
  return null;
}

function ipStore(): Map<string, IpBucket> {
  const globalRef = globalThis as typeof globalThis & {
    __adwrksSiteCheckIpQuota?: Map<string, IpBucket>;
  };
  if (!globalRef.__adwrksSiteCheckIpQuota) {
    globalRef.__adwrksSiteCheckIpQuota = new Map();
  }
  return globalRef.__adwrksSiteCheckIpQuota;
}

function clientIpKey(request: Request | undefined, secret: string): string | null {
  if (!request) return null;
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const direct = request.headers.get("x-real-ip")?.trim();
  const ip = forwarded || direct;
  if (!ip) return null;
  return createHmac("sha256", secret).update(ip).digest("base64url").slice(0, 24);
}

function readIpUsed(key: string | null, today: string): number {
  if (!key) return 0;
  const bucket = ipStore().get(key);
  if (!bucket || bucket.date !== today) return 0;
  return bucket.count;
}

function writeIpUsed(key: string | null, today: string, count: number): void {
  if (!key) return;
  ipStore().set(key, { date: today, count });
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function encodeUsage(payload: UsagePayload, secret: string): string {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${body}.${sign(body, secret)}`;
}

function decodeUsage(value: string, secret: string): UsagePayload | null {
  const dot = value.lastIndexOf(".");
  if (dot <= 0) return null;
  const body = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  const expected = sign(body, secret);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as UsagePayload;
    if (typeof parsed.date !== "string" || typeof parsed.count !== "number" || parsed.count < 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

function mergeUsed(cookieUsed: number, ipUsed: number, limit: number, production: boolean): number {
  if (!production) return Math.min(cookieUsed, limit);
  return Math.min(Math.max(cookieUsed, ipUsed), limit);
}

export async function readSiteCheckUsage(request?: Request): Promise<SiteCheckUsage | null> {
  const secret = getSecret();
  if (!secret) return null;
  const limit = SITE_CHECK_DAILY_LIMIT;
  const today = utcDateKey();
  const raw = (await cookies()).get(COOKIE_NAME)?.value;
  const usage = raw ? decodeUsage(raw, secret) : null;
  const cookieUsed = usage && usage.date === today ? Math.min(usage.count, limit) : 0;
  const ipUsed = isProductionDeploy()
    ? readIpUsed(clientIpKey(request, secret), today)
    : 0;
  const used = mergeUsed(cookieUsed, ipUsed, limit, isProductionDeploy());
  return { limit, remaining: Math.max(0, limit - used), used };
}

export async function consumeSiteCheck(request?: Request): Promise<SiteCheckUsage | null> {
  const secret = getSecret();
  if (!secret) return null;
  const current = await readSiteCheckUsage(request);
  if (!current || current.remaining <= 0) return null;

  const today = utcDateKey();
  const nextCount = current.used + 1;
  const production = isProductionDeploy();
  const ipKey = clientIpKey(request, secret);

  if (production) {
    writeIpUsed(ipKey, today, nextCount);
  }

  try {
    (await cookies()).set(COOKIE_NAME, encodeUsage({ date: today, count: nextCount }, secret), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });
  } catch (error) {
    console.warn("[site-check] quota cookie not persisted", {
      message: error instanceof Error ? error.message : "unknown",
      production,
    });
    if (production && !ipKey) {
      return null;
    }
  }

  return {
    limit: current.limit,
    remaining: Math.max(0, current.limit - nextCount),
    used: nextCount,
  };
}
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "adwrks_site_check_day";
const COOKIE_MAX_AGE = 60 * 60 * 48;
export const SITE_CHECK_DAILY_LIMIT = 8;

type UsagePayload = { date: string; count: number };

export type SiteCheckUsage = { limit: number; remaining: number; used: number };

function utcDateKey(): string {
  return new Date().toISOString().slice(0, 10);
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

export async function readSiteCheckUsage(): Promise<SiteCheckUsage | null> {
  const secret = getSecret();
  if (!secret) return null;
  const limit = SITE_CHECK_DAILY_LIMIT;
  const today = utcDateKey();
  const raw = (await cookies()).get(COOKIE_NAME)?.value;
  const usage = raw ? decodeUsage(raw, secret) : null;
  const used = usage && usage.date === today ? Math.min(usage.count, limit) : 0;
  return { limit, remaining: Math.max(0, limit - used), used };
}

export async function consumeSiteCheck(): Promise<SiteCheckUsage | null> {
  const secret = getSecret();
  if (!secret) return null;
  const current = await readSiteCheckUsage();
  if (!current || current.remaining <= 0) return null;
  const next = { date: utcDateKey(), count: current.used + 1 };
  try {
    (await cookies()).set(COOKIE_NAME, encodeUsage(next, secret), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });
  } catch {
    return null;
  }
  return { limit: current.limit, remaining: current.remaining - 1, used: next.count };
}

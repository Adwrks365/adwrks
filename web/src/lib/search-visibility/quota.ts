import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "adwrks_visibility_day";
const COOKIE_MAX_AGE = 60 * 60 * 48;

export const SEARCH_VISIBILITY_DAILY_LIMIT = Number.parseInt(
  process.env.SEARCH_VISIBILITY_DAILY_LIMIT ?? "1",
  10,
);

type UsagePayload = { date: string; count: number };

function utcDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getSecret(): string | null {
  const candidates = [
    process.env.SEARCH_VISIBILITY_USAGE_SECRET,
    process.env.SITE_CHECK_USAGE_SECRET,
    process.env.PAGESPEED_USAGE_SECRET,
    process.env.PAGESPEED_API_KEY,
  ];
  for (const value of candidates) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  if (process.env.VERCEL_ENV === "preview") {
    const host = process.env.VERCEL_URL?.trim();
    if (host) return `visibility-preview:${host}`;
  }
  if (process.env.NODE_ENV !== "production") return "dev-visibility-usage";
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
    if (typeof parsed.date !== "string" || typeof parsed.count !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

export type VisibilityUsage = { limit: number; remaining: number; used: number };

export async function readVisibilityUsage(): Promise<VisibilityUsage | null> {
  const secret = getSecret();
  const limit = Number.isFinite(SEARCH_VISIBILITY_DAILY_LIMIT) ? Math.max(1, SEARCH_VISIBILITY_DAILY_LIMIT) : 1;
  if (!secret) return null;
  const today = utcDateKey();
  let raw: string | undefined;
  try {
    raw = (await cookies()).get(COOKIE_NAME)?.value;
  } catch {
    raw = undefined;
  }
  const payload = raw ? decodeUsage(raw, secret) : null;
  const used = payload?.date === today ? payload.count : 0;
  return { limit, remaining: Math.max(0, limit - used), used };
}

export async function consumeVisibilityReport(): Promise<VisibilityUsage | null> {
  const secret = getSecret();
  const limit = Number.isFinite(SEARCH_VISIBILITY_DAILY_LIMIT) ? Math.max(1, SEARCH_VISIBILITY_DAILY_LIMIT) : 1;
  if (!secret) return null;
  const today = utcDateKey();
  const current = await readVisibilityUsage();
  if (!current || current.remaining <= 0) return { limit, remaining: 0, used: limit };

  const next: UsagePayload = { date: today, count: (current.used ?? 0) + 1 };
  const encoded = encodeUsage(next, secret);
  try {
    (await cookies()).set(COOKIE_NAME, encoded, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
  } catch {
    return null;
  }
  return { limit, remaining: Math.max(0, limit - next.count), used: next.count };
}
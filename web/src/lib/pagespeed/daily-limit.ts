import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { PAGESPEED_DAILY_LIMIT } from "./pagespeed-insights-data";

const COOKIE_NAME = "adwrks_psi_day";
const COOKIE_MAX_AGE = 60 * 60 * 48;

type UsagePayload = {
  date: string;
  count: number;
};

function utcDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getSecret(): string | null {
  const fromEnv = process.env.PAGESPEED_USAGE_SECRET?.trim();
  if (fromEnv) return fromEnv;
  const voter = process.env.ARTICLE_RATING_VOTER_SECRET?.trim();
  if (voter) return voter;
  const apiKey = process.env.PAGESPEED_API_KEY?.trim();
  if (apiKey) return `psi-usage:${apiKey}`;
  if (process.env.NODE_ENV !== "production") {
    return "dev-pagespeed-usage-secret";
  }
  return null;
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function encodeUsage(payload: UsagePayload, secret: string): string {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = sign(body, secret);
  return `${body}.${sig}`;
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
    const json = Buffer.from(body, "base64url").toString("utf8");
    const parsed = JSON.parse(json) as UsagePayload;
    if (typeof parsed.date !== "string" || typeof parsed.count !== "number") return null;
    if (!Number.isFinite(parsed.count) || parsed.count < 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

export type PageSpeedUsageState = {
  limit: number;
  remaining: number;
  used: number;
};

export async function readPageSpeedUsage(): Promise<PageSpeedUsageState> {
  const secret = getSecret();
  const today = utcDateKey();
  const limit = PAGESPEED_DAILY_LIMIT;

  if (!secret) {
    return { limit, remaining: 0, used: limit };
  }

  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) {
    return { limit, remaining: limit, used: 0 };
  }

  const usage = decodeUsage(raw, secret);
  if (!usage || usage.date !== today) {
    return { limit, remaining: limit, used: 0 };
  }

  const used = Math.min(usage.count, limit);
  return { limit, remaining: Math.max(0, limit - used), used };
}

/** Consume one daily check if quota remains; returns updated usage or null when exhausted. */
export async function consumePageSpeedCheck(): Promise<PageSpeedUsageState | null> {
  const secret = getSecret();
  const today = utcDateKey();
  const limit = PAGESPEED_DAILY_LIMIT;

  if (!secret) {
    return null;
  }

  const current = await readPageSpeedUsage();
  if (current.remaining <= 0) {
    return null;
  }

  const next: UsagePayload = {
    date: today,
    count: current.used + 1,
  };

  const cookieStore = await cookies();
  try {
    cookieStore.set(COOKIE_NAME, encodeUsage(next, secret), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
  } catch {
    /* Cookie write may fail in some contexts; still honor in-memory count for this request. */
  }

  const used = next.count;
  return { limit, remaining: Math.max(0, limit - used), used };
}

import { NextResponse } from "next/server";
import { normalizePageSpeedTargetUrl } from "@/lib/pagespeed/validate-url";
import { consumeSiteCheck, readSiteCheckUsage } from "@/lib/site-check/quota";
import { runSiteCheck } from "@/lib/site-check/run-scan";
import type { SiteCheckLocale } from "@/lib/site-check/types";

export const maxDuration = 60;
export const runtime = "nodejs";

function localeOf(value: unknown): SiteCheckLocale {
  return value === "en" ? "en" : "he";
}

export async function POST(request: Request) {
  const usage = await readSiteCheckUsage(request);
  if (!usage) {
    console.error("[site-check] quota unavailable — missing usage secret in this environment");
    return NextResponse.json({ ok: false, message: "service_unavailable" }, { status: 503 });
  }
  if (usage.remaining <= 0) {
    return NextResponse.json(
      { ok: false, message: "daily_limit", limit: usage.limit, remaining: 0 },
      { status: 429 },
    );
  }

  let body: { url?: string; locale?: string };
  try {
    body = (await request.json()) as { url?: string; locale?: string };
  } catch {
    return NextResponse.json({ ok: false, message: "invalid_body" }, { status: 400 });
  }

  const rawUrl = (body.url || "").trim();
  const normalizedUrl = normalizePageSpeedTargetUrl(rawUrl);
  if (!normalizedUrl) {
    return NextResponse.json({ ok: false, message: "invalid_url" }, { status: 400 });
  }

  const consumed = await consumeSiteCheck(request);
  if (!consumed) {
  const usageAfter = await readSiteCheckUsage(request);
    if (usageAfter && usageAfter.remaining <= 0) {
      return NextResponse.json(
        { ok: false, message: "daily_limit", limit: usageAfter.limit, remaining: 0 },
        { status: 429 },
      );
    }
    console.error("[site-check] quota consume failed", {
      vercelEnv: process.env.VERCEL_ENV,
      remaining: usageAfter?.remaining,
    });
    return NextResponse.json({ ok: false, message: "service_unavailable" }, { status: 503 });
  }

  const report = await runSiteCheck(rawUrl, localeOf(body.locale));
  if (!report.ok) {
    console.info("[site-check] scan failed", {
      input: body.url,
      reason: report.reason,
      normalizedUrl: report.normalizedUrl,
      finalUrl: report.finalUrl,
      fetchReason: report.fetchReason,
      httpStatus: report.httpStatus,
    });
    return NextResponse.json(
      {
        ok: false,
        message: report.reason,
        normalizedUrl: report.normalizedUrl,
        finalUrl: report.finalUrl,
        fetchReason: report.fetchReason,
        httpStatus: report.httpStatus,
        limit: consumed.limit,
        remaining: consumed.remaining,
      },
      { status: report.reason === "invalid_url" ? 400 : 422 },
    );
  }

  return NextResponse.json({
    ...report,
    limit: consumed.limit,
    remaining: consumed.remaining,
  });
}

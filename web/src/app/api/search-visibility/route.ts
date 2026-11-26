import { NextResponse } from "next/server";
import { visibilityCostEstimate } from "@/lib/search-visibility/cost-estimate";
import { runVisibilityCheck, visibilityProviderMode } from "@/lib/search-visibility/run-visibility-check";
import { consumeVisibilityReport, readVisibilityUsage } from "@/lib/search-visibility/quota";
import type { SearchVisibilityLocale } from "@/lib/search-visibility/types";
import type { SiteKind } from "@/lib/site-check/site-kind";

export const maxDuration = 30;
export const runtime = "nodejs";

const MAX_QUERIES = 3;

function localeOf(value: unknown): SearchVisibilityLocale {
  return value === "en" ? "en" : "he";
}

function siteKindOf(value: unknown): SiteKind {
  const v = String(value ?? "");
  if (v === "store" || v === "service" || v === "landing") return v;
  return "general";
}

export async function GET() {
  const mode = visibilityProviderMode();
  const usage = await readVisibilityUsage();
  return NextResponse.json({
    mode,
    usage,
    maxQueries: MAX_QUERIES,
    costEstimate: visibilityCostEstimate(),
  });
}

export async function POST(request: Request) {
  if (visibilityProviderMode() === "off") {
    return NextResponse.json({ ok: false, message: "unavailable" }, { status: 503 });
  }

  const usageBefore = await readVisibilityUsage();
  if (!usageBefore) {
    return NextResponse.json({ ok: false, message: "unavailable" }, { status: 503 });
  }
  if (usageBefore.remaining <= 0) {
    return NextResponse.json(
      { ok: false, message: "daily_limit", limit: usageBefore.limit, remaining: 0 },
      { status: 429 },
    );
  }

  let body: {
    locale?: string;
    domain?: string;
    homeUrl?: string;
    serviceUrl?: string | null;
    siteKind?: string;
    queries?: string[];
    country?: string;
    language?: string;
    device?: string;
    partialScan?: boolean;
    demoScenario?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, message: "invalid_body" }, { status: 400 });
  }

  const queries = Array.isArray(body.queries)
    ? body.queries.map((q) => String(q).trim()).filter(Boolean).slice(0, MAX_QUERIES)
    : [];
  if (queries.length === 0) {
    return NextResponse.json({ ok: false, message: "invalid_queries" }, { status: 400 });
  }

  const domain = String(body.domain ?? "").trim().toLowerCase().replace(/^www\./, "");
  const homeUrl = String(body.homeUrl ?? "").trim();
  if (!domain || !homeUrl) {
    return NextResponse.json({ ok: false, message: "invalid_body" }, { status: 400 });
  }

  const report = await runVisibilityCheck({
    locale: localeOf(body.locale),
    domain,
    homeUrl,
    serviceUrl: body.serviceUrl,
    siteKind: siteKindOf(body.siteKind),
    queries,
    country: String(body.country ?? "IL").toUpperCase(),
    language: String(body.language ?? (body.locale === "en" ? "en" : "he")).toLowerCase(),
    device: body.device === "desktop" ? "desktop" : "mobile",
    partialScan: Boolean(body.partialScan),
    demoScenario: body.demoScenario,
  });

  if (!report) {
    return NextResponse.json({ ok: false, message: "unavailable" }, { status: 503 });
  }

  await consumeVisibilityReport();
  const usageAfter = await readVisibilityUsage();
  return NextResponse.json({
    ...report,
    usage: usageAfter ?? usageBefore,
  });
}
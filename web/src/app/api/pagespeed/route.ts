import { NextResponse } from "next/server";
import {
  consumePageSpeedCheck,
  readPageSpeedUsage,
} from "@/lib/pagespeed/daily-limit";
import type { PageSpeedStrategy } from "@/lib/pagespeed/pagespeed-insights-data";
import { normalizePageSpeedTargetUrl } from "@/lib/pagespeed/validate-url";

type LighthouseCategory = {
  score?: number | null;
};

function isPageSpeedConfigured(): boolean {
  return Boolean(process.env.PAGESPEED_API_KEY?.trim());
}

function parseStrategy(value: unknown): PageSpeedStrategy {
  return value === "desktop" ? "desktop" : "mobile";
}

function scoreFromCategory(category: LighthouseCategory | undefined): number | null {
  if (!category || category.score == null || !Number.isFinite(category.score)) {
    return null;
  }
  return Math.round(category.score * 100);
}

export async function GET() {
  if (!isPageSpeedConfigured()) {
    return NextResponse.json(
      { ok: false, message: "unavailable" },
      { status: 503 },
    );
  }

  const usage = await readPageSpeedUsage();
  return NextResponse.json({
    ok: true,
    limit: usage.limit,
    remaining: usage.remaining,
    used: usage.used,
  });
}

export async function POST(request: Request) {
  if (!isPageSpeedConfigured()) {
    return NextResponse.json(
      { ok: false, message: "unavailable" },
      { status: 503 },
    );
  }

  let body: { url?: string; strategy?: string };
  try {
    body = (await request.json()) as { url?: string; strategy?: string };
  } catch {
    return NextResponse.json({ ok: false, message: "invalid_body" }, { status: 400 });
  }

  const targetUrl = normalizePageSpeedTargetUrl(body.url || "");
  if (!targetUrl) {
    return NextResponse.json({ ok: false, message: "invalid_url" }, { status: 400 });
  }

  const usageBefore = await readPageSpeedUsage();
  if (usageBefore.remaining <= 0) {
    return NextResponse.json(
      {
        ok: false,
        message: "daily_limit",
        limit: usageBefore.limit,
        remaining: 0,
        used: usageBefore.used,
      },
      { status: 429 },
    );
  }

  const strategy = parseStrategy(body.strategy);
  const apiKey = process.env.PAGESPEED_API_KEY!.trim();
  const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  endpoint.searchParams.set("url", targetUrl);
  endpoint.searchParams.set("strategy", strategy);
  endpoint.searchParams.set("key", apiKey);
  endpoint.searchParams.set("category", "performance");
  endpoint.searchParams.set("category", "accessibility");
  endpoint.searchParams.set("category", "best-practices");
  endpoint.searchParams.set("category", "seo");

  let upstream: Response;
  try {
    upstream = await fetch(endpoint.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
      next: { revalidate: 0 },
    });
  } catch (error) {
    console.error("[pagespeed] upstream fetch failed", {
      code: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json({ ok: false, message: "upstream_error" }, { status: 502 });
  }

  let data: {
    error?: { message?: string };
    lighthouseResult?: {
      categories?: Record<string, LighthouseCategory>;
      finalUrl?: string;
    };
  };

  try {
    data = (await upstream.json()) as typeof data;
  } catch {
    return NextResponse.json({ ok: false, message: "upstream_error" }, { status: 502 });
  }

  if (!upstream.ok || data.error) {
    console.error("[pagespeed] API error", {
      status: upstream.status,
      message: data.error?.message,
    });
    return NextResponse.json(
      {
        ok: false,
        message: "upstream_error",
        detail: data.error?.message,
      },
      { status: 502 },
    );
  }

  const categories = data.lighthouseResult?.categories ?? {};
  const scores = {
    performance: scoreFromCategory(categories.performance),
    accessibility: scoreFromCategory(categories.accessibility),
    bestPractices: scoreFromCategory(categories["best-practices"]),
    seo: scoreFromCategory(categories.seo),
  };

  const usageAfter = await consumePageSpeedCheck();
  if (!usageAfter) {
    return NextResponse.json(
      { ok: false, message: "daily_limit", limit: usageBefore.limit, remaining: 0 },
      { status: 429 },
    );
  }

  return NextResponse.json({
    ok: true,
    url: targetUrl,
    finalUrl: data.lighthouseResult?.finalUrl ?? targetUrl,
    strategy,
    scores,
    limit: usageAfter.limit,
    remaining: usageAfter.remaining,
    used: usageAfter.used,
  });
}

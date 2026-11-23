import { NextResponse } from "next/server";
import { siteCheckFixtureHtml } from "@/lib/site-check/fixture-html";

export function GET() {
  return new NextResponse(siteCheckFixtureHtml("index"), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
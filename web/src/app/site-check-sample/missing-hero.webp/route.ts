import { NextResponse } from "next/server";

/** Fixture asset that returns 404 for broken-hero image probes. */
export function GET() {
  return new NextResponse("Not found", { status: 404 });
}
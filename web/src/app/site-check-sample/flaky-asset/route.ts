import { NextResponse } from "next/server";

/** 503 — probes classify as unverified (not a confirmed 404/410 broken asset). */
export function GET() {
  return new NextResponse("Unavailable", { status: 503 });
}

export function HEAD() {
  return new NextResponse(null, { status: 503 });
}
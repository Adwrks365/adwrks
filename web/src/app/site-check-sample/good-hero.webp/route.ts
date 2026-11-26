import { NextResponse } from "next/server";

const TINY_WEBP = Buffer.from(
  "UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAgA0JaQAA3AA/vuUAAA=",
  "base64",
);

export function GET() {
  return new NextResponse(TINY_WEBP, {
    status: 200,
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "no-store",
    },
  });
}
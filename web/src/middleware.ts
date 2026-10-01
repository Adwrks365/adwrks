import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isPreviewOrNonProductionDeployment, isProductionHostname } from "@/lib/indexing";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");

  if (!isPreviewOrNonProductionDeployment() && isProductionHostname(host)) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};

import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { isPreviewOrNonProductionDeployment, isProductionHostname } from "@/lib/indexing";
import { isRoutablePathname } from "@/lib/routing/routable-path-index";

const intlMiddleware = createMiddleware(routing);

const JUNK_PATH =
  /\/wp-(admin|login|content|includes)|\/xmlrpc\.php|\/\.env|\/\.git|\.php$|\/feed\/?$/i;

function fastNotFound(): NextResponse {
  return new NextResponse("Not Found", {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (JUNK_PATH.test(pathname)) {
    return fastNotFound();
  }

  const routable = isRoutablePathname(pathname);

  if (!routable) {
    return fastNotFound();
  }

  const response = intlMiddleware(request);

  const host = request.headers.get("host");
  if (!isPreviewOrNonProductionDeployment() && isProductionHostname(host)) {
    return response;
  }

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots\\.txt|sitemap\\.xml|sitemap-he\\.xml|sitemap-en\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { isPreviewOrNonProductionDeployment, isProductionHostname } from "@/lib/indexing";
import { resolveLegacyRedirect } from "@/lib/routing/legacy-redirects";
import { isRoutablePathname } from "@/lib/routing/routable-path-index";

const intlMiddleware = createMiddleware(routing);

const JUNK_PATH =
  /\/wp-(admin|login|content|includes|json)|\/xmlrpc\.php|\/\.env|\/\.git|\.php$/i;

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

  if (isRoutablePathname(pathname)) {
    const response = intlMiddleware(request);
    return applyProductionRobots(request, response);
  }

  const legacyTarget = resolveLegacyRedirect(pathname);
  if (legacyTarget) {
    const url = request.nextUrl.clone();
    url.pathname = legacyTarget;
    return NextResponse.redirect(url, 308);
  }

  return fastNotFound();
}

function applyProductionRobots(request: NextRequest, response: NextResponse): NextResponse {
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

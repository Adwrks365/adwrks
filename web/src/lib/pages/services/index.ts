import { googleAdsPage } from "./google-ads";
import { hostingPlansPage } from "./hosting-plans";
import { mainServicesPage } from "./main-services";
import { seoPage } from "./seo";
import { socialMediaPage } from "./social-media-management";
import type { ServicePageContent } from "./types";
import { websiteBuildingPage } from "./website-building";

const SERVICE_PAGES: ServicePageContent[] = [
  seoPage,
  googleAdsPage,
  websiteBuildingPage,
  socialMediaPage,
  hostingPlansPage,
  mainServicesPage,
];

const byPath = new Map<string, ServicePageContent>(
  SERVICE_PAGES.map((p) => [p.path, p]),
);

export function getVerifiedServicePage(path: string): ServicePageContent | null {
  return byPath.get(path) ?? null;
}

export function getAllServicePagePaths(): string[] {
  return SERVICE_PAGES.map((p) => p.path);
}

export { SERVICE_PAGES };

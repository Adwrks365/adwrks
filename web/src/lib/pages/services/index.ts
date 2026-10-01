import type { ServicePageContent } from "./types";

/** Legacy verified pages — active routes use dedicated composers in ContentPage. */
const SERVICE_PAGES: ServicePageContent[] = [];

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

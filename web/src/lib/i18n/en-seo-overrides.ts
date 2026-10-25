import overrides from "@/data/content-en/en-seo-overrides.json";
import { normalizePath } from "@/lib/content/paths";

export type EnSeoOverride = {
  title: string;
  description: string;
};

const BY_PATH = overrides as Record<string, EnSeoOverride>;

export function getEnSeoOverride(pathKey: string): EnSeoOverride | undefined {
  const key = normalizePath(pathKey);
  return BY_PATH[key];
}

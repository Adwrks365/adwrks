import { normalizePath } from "@/lib/content/paths";
import aliasesJson from "@/data/content-en/en-internal-link-aliases.json";

const ALIASES = new Map(
  Object.entries(aliasesJson as Record<string, string>).map(([he, en]) => [
    normalizePath(he),
    normalizePath(en),
  ]),
);

/** Legacy Hebrew paths (typos / WP junk) → canonical EN routes. */
export function resolveEnInternalLinkAlias(path: string): string | null {
  return ALIASES.get(normalizePath(path)) ?? null;
}

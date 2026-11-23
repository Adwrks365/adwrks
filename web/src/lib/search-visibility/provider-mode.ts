export function visibilityProviderMode(): "off" | "mock" | "live" {
  const raw = process.env.SEARCH_VISIBILITY_PROVIDER?.trim().toLowerCase();

  if (raw === "off" || raw === "disabled" || raw === "false") return "off";

  if (raw === "live" || raw === "dataforseo") {
    if (process.env.DATAFORSEO_LOGIN?.trim() && process.env.DATAFORSEO_PASSWORD?.trim()) return "live";
    return "off";
  }

  if (raw === "mock" || raw === "demo") return "mock";

  return "off";
}
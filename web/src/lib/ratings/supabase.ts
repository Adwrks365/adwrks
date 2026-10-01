import { getRatingsConfig } from "@/lib/ratings/config";

type SupabaseFetchOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

export async function supabaseFetch(
  path: string,
  options: SupabaseFetchOptions = {},
): Promise<Response> {
  const config = getRatingsConfig();
  if (!config) {
    throw new Error("ratings_not_configured");
  }

  const url = `${config.url}/rest/v1/${path.replace(/^\//, "")}`;

  return fetch(url, {
    ...options,
    cache: "no-store",
    headers: {
      apikey: config.secretKey,
      Authorization: `Bearer ${config.secretKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

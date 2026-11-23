import { domainToUnicode } from "node:url";

export function displayUrlReadable(raw: string): string {
  try {
    const url = new URL(raw);
    const host = domainToUnicode(url.hostname.replace(/^www\./i, ""));
    const path = decodeURI(url.pathname) + (url.search ? url.search : "");
    return `${host}${path === "/" ? "" : path}`;
  } catch {
    try {
      return decodeURI(raw);
    } catch {
      return raw;
    }
  }
}

export function displayHostReadable(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  try {
    const host = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`).hostname;
    return domainToUnicode(host.replace(/^www\./i, ""));
  } catch {
    return trimmed;
  }
}
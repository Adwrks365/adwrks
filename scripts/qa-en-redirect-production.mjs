#!/usr/bin/env node
/** Production QA: /en redirect chain and EN home canonical. */
const GOOGLEBOT =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

async function headChain(url, init = {}) {
  const hops = [];
  let current = url;
  for (let i = 0; i < 12; i++) {
    const res = await fetch(current, { ...init, redirect: "manual" });
    const location = res.headers.get("location");
    hops.push({ url: current, status: res.status, location });
    if (res.status < 300 || res.status >= 400 || !location) break;
    current = new URL(location, current).href;
  }
  return hops;
}

function assert(condition, message) {
  if (!condition) {
    console.error("FAIL:", message);
    process.exitCode = 1;
    return false;
  }
  console.log("OK:", message);
  return true;
}

const enNoSlash = "https://adwrks.co.il/en";
const enSlash = "https://adwrks.co.il/en/";
const wwwEn = "https://www.adwrks.co.il/en";

const enHops = await headChain(enNoSlash, { headers: { "User-Agent": GOOGLEBOT } });
assert(
  enHops[0]?.status === 308 || enHops[0]?.status === 301,
  `/en returns redirect (${enHops[0]?.status})`,
);
const firstLoc = enHops[0]?.location ?? "";
assert(
  firstLoc.includes("/en/"),
  `/en Location ends with /en/ (${firstLoc})`,
);

const enDirect = await fetch(enSlash, { headers: { "User-Agent": GOOGLEBOT } });
assert(enDirect.status === 200, `/en/ returns 200 (${enDirect.status})`);

const html = await enDirect.text();
assert(
  html.includes('rel="canonical" href="https://adwrks.co.il/en/"') ||
    html.includes("rel='canonical' href='https://adwrks.co.il/en/'"),
  "EN home canonical is https://adwrks.co.il/en/",
);

const wwwHops = await headChain(wwwEn, { headers: { "User-Agent": GOOGLEBOT } });
const final = wwwHops[wwwHops.length - 1];
assert(final?.status === 200, `www/en chain ends with 200 (${final?.status})`);
assert(
  wwwHops.length <= 4,
  `www/en redirect hops <= 4 (got ${wwwHops.length})`,
);
assert(
  final?.url?.replace(/\/$/, "") === enSlash.replace(/\/$/, "") ||
    final?.url?.includes("/en/"),
  `www/en final URL is /en/ (${final?.url})`,
);

if (process.exitCode) {
  console.error("\nQA failed.");
  process.exit(1);
}
console.log("\nAll EN redirect QA checks passed.");

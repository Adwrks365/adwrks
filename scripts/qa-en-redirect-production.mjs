#!/usr/bin/env node
/** Production QA: /en redirect chain and EN home canonical. */
const GOOGLEBOT =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

const GOOGLEBOT_MOBILE =
  "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

async function headChain(url, init = {}) {
  const hops = [];
  let current = url;
  const seen = new Set();
  for (let i = 0; i < 12; i++) {
    const res = await fetch(current, { ...init, redirect: "manual" });
    const location = res.headers.get("location");
    hops.push({ url: current, status: res.status, location });
    if (seen.has(current)) {
      hops.push({ loop: true, url: current });
      break;
    }
    seen.add(current);
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

function runRedirectChecks(label, ua) {
  const init = { headers: { "User-Agent": ua } };
  const enNoSlash = "https://adwrks.co.il/en";
  const enSlash = "https://adwrks.co.il/en/";
  const wwwEn = "https://www.adwrks.co.il/en";

  return (async () => {
    const enSlashHead = await fetch(enSlash, { ...init, redirect: "manual" });
    assert(
      enSlashHead.status === 200,
      `[${label}] GET /en/ is 200, not redirect (${enSlashHead.status})`,
    );

    const enHops = await headChain(enNoSlash, init);
    assert(
      enHops[0]?.status === 308 || enHops[0]?.status === 301,
      `[${label}] /en returns redirect (${enHops[0]?.status})`,
    );
    const firstLoc = enHops[0]?.location ?? "";
    assert(
      firstLoc.includes("/en/"),
      `[${label}] /en Location ends with /en/ (${firstLoc})`,
    );
    assert(!enHops.some((h) => h.loop), `[${label}] /en chain has no redirect loop`);
    const enFinal = enHops[enHops.length - 1];
    assert(
      enHops.length <= 2 || enFinal?.status === 200,
      `[${label}] /en chain <= 2 hops or ends 200 (hops=${enHops.length}, status=${enFinal?.status})`,
    );

    const enFollow = await fetch(enNoSlash, init);
    assert(
      enFollow.status === 200 && enFollow.url.replace(/\/$/, "").endsWith("/en"),
      `[${label}] /en with follow ends 200 on /en/ (${enFollow.status}, ${enFollow.url})`,
    );

    const enDirect = await fetch(enSlash, init);
    assert(enDirect.status === 200, `[${label}] /en/ returns 200 (${enDirect.status})`);

    const html = await enDirect.text();
    assert(
      html.includes('rel="canonical" href="https://adwrks.co.il/en/"') ||
        html.includes("rel='canonical' href='https://adwrks.co.il/en/'"),
      `[${label}] EN home canonical is https://adwrks.co.il/en/`,
    );

    const wwwHops = await headChain(wwwEn, init);
    assert(!wwwHops.some((h) => h.loop), `[${label}] www/en chain has no redirect loop`);
    const final = wwwHops[wwwHops.length - 1];
    assert(final?.status === 200, `[${label}] www/en chain ends with 200 (${final?.status})`);
    assert(
      wwwHops.length <= 4,
      `[${label}] www/en redirect hops <= 4 (got ${wwwHops.length})`,
    );
    assert(
      final?.url?.includes("/en/"),
      `[${label}] www/en final URL is /en/ (${final?.url})`,
    );
  })();
}

await runRedirectChecks("desktop", GOOGLEBOT);
await runRedirectChecks("mobile", GOOGLEBOT_MOBILE);

if (process.exitCode) {
  console.error("\nQA failed.");
  process.exit(1);
}
console.log("\nAll EN redirect QA checks passed.");

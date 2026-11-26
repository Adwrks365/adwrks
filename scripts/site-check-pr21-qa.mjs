const BASE = process.env.SITE_CHECK_BASE ?? "http://localhost:3000";

const cases = [
  "adwrks.co.il",
  "nanasite.co.il",
  "https://insytix.co/services",
  "http://localhost:3000/site-check-sample/",
];

async function scan(url) {
  const started = Date.now();
  const res = await fetch(`${BASE}/api/site-check/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, locale: "he" }),
  });
  const data = await res.json();
  return {
    url,
    status: res.status,
    ms: Date.now() - started,
    planned: data.pagesPlanned,
    scanned: data.pagesScanned,
    partial: data.partialScan,
    findings: data.findings?.length ?? 0,
    headline: data.clearTitle ?? data.findings?.[0]?.observation?.slice(0, 60),
  };
}

const rows = [];
for (const url of cases) rows.push(await scan(url));
console.table(rows);
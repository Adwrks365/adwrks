import fs from "fs";

const files = [
  [".gsc-coverage-1/טבלה.csv", "5xx"],
  [".gsc-coverage-2/טבלה.csv", "404"],
];

async function statusOf(url, follow = false) {
  try {
    const res = await fetch(url, {
      redirect: follow ? "follow" : "manual",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AdwrksGSCCheck/1.0)" },
    });
    const loc = res.headers.get("location");
    return { status: res.status, location: loc, finalUrl: follow ? res.url : undefined };
  } catch (e) {
    return { status: "ERR", error: String(e) };
  }
}

for (const [file, label] of files) {
  const lines = fs.readFileSync(file, "utf8").trim().split(/\n/).slice(1);
  const urls = lines.map((l) => l.split(",")[0]);
  console.log(`\n=== ${label} (${urls.length} URLs) ===`);
  const byStatus = new Map();
  for (const url of urls) {
    const manual = await statusOf(url, false);
    const final = await statusOf(url, true);
    const key =
      manual.status >= 300 && manual.status < 400
        ? `${manual.status} -> ${final.status} (${new URL(final.finalUrl || url).pathname})`
        : String(manual.status);
    byStatus.set(key, (byStatus.get(key) ?? 0) + 1);
    if (manual.status >= 500 || final.status >= 500 || manual.status === "ERR") {
      console.log("PROBLEM", manual.status, final.status, url);
    }
    if (manual.status === 404 && final.status === 404) {
      console.log("STILL_404", url);
    }
  }
  console.log("Summary:");
  for (const [k, v] of [...byStatus.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${v}\t${k}`);
  }
}

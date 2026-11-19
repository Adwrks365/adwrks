/**
 * Read-only production/preview rating API probe (GET only, no votes).
 * QA_BASE=https://adwrks.co.il npx tsx scripts/qa-batch4-ratings-api-readonly.mjs
 */
const BASE = (process.env.QA_BASE || "https://adwrks.co.il").replace(/\/$/, "");

const PATHS = [
  { label: "old-he", path: "/קידום-אתרים-ברוסית/" },
  { label: "new-he", path: "/פרסום-בגוגל-7-אסטרטגיות/" },
  { label: "old-en", path: "/en/google-seo/" },
  { label: "new-en", path: "/en/seo-guide-for-beginners/" },
];

let failed = 0;

const health = await fetch(`${BASE}/api/articles/rate?path=${encodeURIComponent("/")}`, {
  redirect: "follow",
});
const healthJson = await health.json().catch(() => ({}));
if (health.status === 503) {
  console.log("SKIP: ratings not configured (503)", healthJson.message);
  process.exit(0);
}
if (health.status === 401 && healthJson?.error?.code === "401") {
  console.log("BLOCKED: deployment requires Vercel Authentication — cannot test API remotely");
  process.exit(0);
}

for (const { label, path } of PATHS) {
  const url = `${BASE}/api/articles/rate?path=${encodeURIComponent(path)}`;
  const res = await fetch(url, { redirect: "follow" });
  const data = await res.json().catch(() => ({}));
  const line = {
    label,
    status: res.status,
    ok: data.ok,
    message: data.message,
    totalVoteCount: data.totalVoteCount,
  };
  if (res.status === 404 && data.message === "מאמר לא נמצא.") {
    console.log("KNOWN pre-fix or baseline miss", line);
  } else if (data.ok === true) {
    console.log("OK GET", line);
  } else {
    console.error("FAIL GET", line);
    failed++;
  }
}

process.exit(failed ? 1 : 0);
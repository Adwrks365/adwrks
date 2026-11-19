const base = process.argv[2] || "http://localhost:3000";
const paths = [
  "/seo/",
  "/google-ads/",
  "/website-building/",
  "/hosting-plans/",
  "/%d7%9e%d7%97%d7%99%d7%a8-%d7%a7%d7%99%d7%93%d7%95%d7%9d-%d7%90%d7%aa%d7%a8%d7%99%d7%9d/",
  "/%d7%91%d7%a0%d7%99%d7%99%d7%aa-%d7%90%d7%aa%d7%a8%d7%99%d7%9d-%d7%91%d7%a8%d7%95%d7%a1%d7%99%d7%aa/",
  "/%d7%a7%d7%99%d7%93%d7%95%d7%9d-%d7%90%d7%aa%d7%a8%d7%99%d7%9d-%d7%91%d7%a8%d7%95%d7%a1%d7%99%d7%aa/",
];
for (const p of paths) {
  const res = await fetch(`${base}${p}`, { redirect: "manual" });
  console.log(res.status, p);
}
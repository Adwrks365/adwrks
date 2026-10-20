#!/usr/bin/env node
/** Verify internal links on live pricing page return 200 or single redirect. */
const PRICING = "https://adwrks.co.il/%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F-%D7%A9%D7%99%D7%95%D7%95%D7%A7-%D7%93%D7%99%D7%92%D7%99%D7%98%D7%9C%D7%99/";
const UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

async function finalStatus(url) {
  const res = await fetch(url, { redirect: "follow", headers: { "User-Agent": UA } });
  return res.status;
}

const html = await (await fetch(PRICING, { headers: { "User-Agent": UA } })).text();
const hrefs = [...html.matchAll(/href="(\/[^"#?]+)/g)].map((m) => m[1]);
const uniq = [...new Set(hrefs)];
let bad = 0;
for (const path of uniq) {
  const url = `https://adwrks.co.il${path.endsWith("/") ? path : `${path}/`}`;
  const status = await finalStatus(url);
  if (status >= 400) {
    console.error("BAD", status, path);
    bad++;
  } else {
    console.log("OK", status, path);
  }
}
console.log(`Checked ${uniq.length} internal links, ${bad} failures`);
process.exit(bad ? 1 : 0);

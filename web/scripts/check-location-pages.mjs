import http from "node:http";

const port = Number(process.env.PORT || 3002);
const paths = [
  "/סוכנות-פרסום-שיווק-בכרמיאל/",
  "/אזורי-פעילות/",
  "/סוכנות-שיווק-דיגיטלי-בחיפה/",
  "/en/service-areas/",
  "/en/digital-marketing-agency-carmiel/",
];

function get(pathname) {
  return new Promise((resolve) => {
    http
      .get(`http://localhost:${port}${encodeURI(pathname)}`, (res) => {
        let body = "";
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          const h1 = body.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1] ?? "";
          resolve({
            status: res.statusCode,
            path: pathname,
            location: body.includes("sp-page--location"),
            h1: h1.slice(0, 60),
          });
        });
      })
      .on("error", (error) => resolve({ status: "ERR", path: pathname, error: error.message }));
  });
}

for (const pathname of paths) {
  console.log(JSON.stringify(await get(pathname)));
}

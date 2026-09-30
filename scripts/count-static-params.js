const fs = require("fs");
const path = require("path");

const AUDIT_DIR = path.join(__dirname, "..", "migration-audit");
const POSTS_PER_PAGE = 10;

function decodePathSegments(p) {
  return p
    .split("/")
    .map((s) => {
      if (!s) return s;
      try {
        return decodeURIComponent(s);
      } catch {
        return s;
      }
    })
    .join("/");
}

function normalizePath(input) {
  if (!input || input === "/") return "/";
  let p = input;
  if (p.startsWith("http")) p = new URL(p).pathname;
  if (!p.startsWith("/")) p = `/${p}`;
  p = decodePathSegments(p);
  if (!p.endsWith("/")) p = `${p}/`;
  return p;
}

function pathFromLink(link) {
  return normalizePath(link);
}

function slugSegmentsFromPath(p) {
  const n = normalizePath(p);
  if (n === "/") return [];
  return n.slice(1, -1).split("/");
}

const pages = JSON.parse(fs.readFileSync(path.join(AUDIT_DIR, "pages.json"), "utf8"));
const posts = JSON.parse(fs.readFileSync(path.join(AUDIT_DIR, "posts.json"), "utf8"));
const categories = JSON.parse(fs.readFileSync(path.join(AUDIT_DIR, "categories.json"), "utf8"));

const routes = new Map();
for (const page of pages) routes.set(pathFromLink(page.link), "page");
for (const post of posts) routes.set(pathFromLink(post.link), "post");
for (const cat of categories) routes.set(pathFromLink(cat.link), "category");

const params = [{}];
for (const routePath of routes.keys()) {
  if (routePath === "/") continue;
  params.push({ slug: slugSegmentsFromPath(routePath) });
}

const postsByCat = new Map(categories.map((c) => [c.id, []]));
for (const post of posts) {
  for (const cid of post.categories || []) {
    postsByCat.get(cid)?.push(post);
  }
}

for (const cat of categories) {
  const count = (postsByCat.get(cat.id) || []).length;
  const totalPages = Math.ceil(count / POSTS_PER_PAGE);
  for (let page = 2; page <= totalPages; page++) {
    params.push({ slug: [...slugSegmentsFromPath(pathFromLink(cat.link)), "page", String(page)] });
  }
}

console.log("Static params:", params.length);
console.log("Sample:", params.slice(0, 5));

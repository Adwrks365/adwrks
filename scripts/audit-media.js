#!/usr/bin/env node
/**
 * Audit migrated media usage across posts and local public assets.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const AUDIT = path.join(ROOT, "migration-audit");
const PUBLIC_UPLOADS = path.join(ROOT, "web", "public", "wp-content", "uploads");

const UPLOAD_RE =
  /https?:\/\/(?:www\.)?adwrks\.co\.il(\/wp-content\/uploads\/[A-Za-z0-9_\-./%]+\.(?:webp|png|jpe?g|gif|svg|avif|ico))/gi;

function localExists(localPath) {
  const full = path.join(ROOT, "web", "public", localPath.replace(/^\//, ""));
  return fs.existsSync(full) && fs.statSync(full).size > 0;
}

function extractUploadPaths(html) {
  const paths = new Set();
  if (!html) return paths;
  let m;
  while ((m = UPLOAD_RE.exec(html))) {
    paths.add(m[1].split("?")[0]);
  }
  return paths;
}

function main() {
  const posts = JSON.parse(fs.readFileSync(path.join(AUDIT, "posts.json"), "utf8"));
  const media = JSON.parse(fs.readFileSync(path.join(AUDIT, "media.json"), "utf8"));
  let map = {};
  const mapFile = path.join(AUDIT, "media-map.json");
  if (fs.existsSync(mapFile)) {
    map = JSON.parse(fs.readFileSync(mapFile, "utf8")).mapping || {};
  }

  const report = {
    mediaCatalogued: media.length,
    postsTotal: posts.length,
    postsWithFeatured: 0,
    postsMissingFeatured: [],
    postsMissingInlineImages: [],
    brokenLocalAssets: [],
    remoteOnlyReferences: [],
    migratedFilesOnDisk: 0,
  };

  if (fs.existsSync(PUBLIC_UPLOADS)) {
    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(p);
        else report.migratedFilesOnDisk++;
      }
    };
    walk(PUBLIC_UPLOADS);
  }

  for (const post of posts) {
    const featuredId = post.featuredMedia || post.featured_media;
    if (featuredId) {
      report.postsWithFeatured++;
    } else {
      report.postsMissingFeatured.push(post.link || post.slug);
    }

    const inlinePaths = extractUploadPaths(post.content || "");
    const missingInline = [];
    for (const uploadPath of inlinePaths) {
      const remote = `https://adwrks.co.il${uploadPath}`;
      const local = map[remote] || uploadPath;
      if (!localExists(local)) {
        missingInline.push(uploadPath);
        if (!report.brokenLocalAssets.includes(uploadPath)) {
          report.brokenLocalAssets.push(uploadPath);
        }
      }
    }
    if (missingInline.length) {
      report.postsMissingInlineImages.push({
        slug: post.slug,
        missing: missingInline,
      });
    }
  }

  const outFile = path.join(AUDIT, "media-audit-report.json");
  fs.writeFileSync(outFile, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main();

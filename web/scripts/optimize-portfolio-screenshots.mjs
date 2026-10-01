/**
 * Phase 5H.2 — copy owner-supplied screencaptures and create display WebP derivatives.
 * Run from web/: node scripts/optimize-portfolio-screenshots.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, "..");
const downloads = path.join(process.env.USERPROFILE ?? "", "Downloads");

const SOURCES = [
  {
    id: "xn-hebrew-domain",
    source: "screencapture-xn-9hcb0aidfdcug0cm-xn-4dbrk0ce-2026-09-30-09_22_50.png",
  },
  {
    id: "ramatgancranes",
    source: "screencapture-ramatgancranes-co-il-2026-09-30-09_22_29.png",
  },
  {
    id: "insytix",
    source: "screencapture-insytix-co-2026-09-30-09_22_11.png",
  },
  {
    id: "michel-drive",
    source: "screencapture-michel-drive-co-il-2026-09-30-09_21_34.png",
  },
  {
    id: "project-eng",
    source: "screencapture-project-eng-co-il-2026-09-30-09_20_36.png",
  },
  {
    id: "menofeyhasdai",
    source: "screencapture-menofeyhasdai-co-il-2026-09-30-09_20_19.png",
  },
  {
    id: "amiya-movings",
    source: "screencapture-amiya-movings-co-il-2026-09-30-09_19_59.png",
  },
  {
    id: "em-biuvit",
    source: "screencapture-em-biuvit-co-il-2026-09-30-09_19_37.png",
  },
];

const outOriginals = path.join(webRoot, "public/images/portfolio/originals");
const outDisplay = path.join(webRoot, "public/images/portfolio");

const DISPLAY_MAX_WIDTH = 960;
const WEBP_QUALITY = 82;

fs.mkdirSync(outOriginals, { recursive: true });
fs.mkdirSync(outDisplay, { recursive: true });

const results = [];
let missing = false;

for (const item of SOURCES) {
  const srcPath = path.join(downloads, item.source);
  if (!fs.existsSync(srcPath)) {
    console.error(`MISSING: ${item.source}`);
    missing = true;
    continue;
  }

  const originalName = `${item.id}.png`;
  const displayName = `${item.id}.webp`;
  const originalOut = path.join(outOriginals, originalName);
  const displayOut = path.join(outDisplay, displayName);

  fs.copyFileSync(srcPath, originalOut);

  const meta = await sharp(srcPath).metadata();
  const pipeline = sharp(srcPath);
  if (meta.width && meta.width > DISPLAY_MAX_WIDTH) {
    pipeline.resize({ width: DISPLAY_MAX_WIDTH, withoutEnlargement: true });
  }
  await pipeline.webp({ quality: WEBP_QUALITY, effort: 4 }).toFile(displayOut);

  const displayStat = fs.statSync(displayOut);
  results.push({
    id: item.id,
    sourceFile: item.source,
    originalPath: `/images/portfolio/originals/${originalName}`,
    displayPath: `/images/portfolio/${displayName}`,
    width: meta.width,
    height: meta.height,
    displayBytes: displayStat.size,
    originalBytes: fs.statSync(originalOut).size,
  });
}

console.log(JSON.stringify(results, null, 2));

if (missing) {
  process.exit(1);
}

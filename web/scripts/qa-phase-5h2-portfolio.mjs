/**
 * Phase 5H.2 portfolio QA — dataset, assets, sitemap.
 * Run from web/: node scripts/qa-phase-5h2-portfolio.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, "..");

const LEGACY_FILES = [
  "3-1.png",
  "omanut.png",
  "2.png",
  "5.png",
  "aharon-plumber.png",
  "1-1.png",
  "bali_burger.png",
  "6.png",
  "dudizehavi-ins.png",
  "7.png",
  "4-1.png",
  "amit-bageva.png",
  "betkal-pro.png",
  "amir-madari.png",
];

const NEW_DISPLAY = [
  "xn-hebrew-domain.webp",
  "ramatgancranes.webp",
  "insytix.webp",
  "michel-drive.webp",
  "project-eng.webp",
  "menofeyhasdai.webp",
  "amiya-movings.webp",
  "em-biuvit.webp",
];

const uploads = path.join(webRoot, "public/wp-content/uploads");
const portfolio = path.join(webRoot, "public/images/portfolio");

const legacyOk = LEGACY_FILES.every((f) => fs.existsSync(path.join(uploads, f)));
const newOk = NEW_DISPLAY.every((f) => fs.existsSync(path.join(portfolio, f)));

const urlsPath = path.join(webRoot, "src/data/content/urls.json");
const urlCount = JSON.parse(fs.readFileSync(urlsPath, "utf8")).sitemapUrls.length;

const report = {
  legacyCount: LEGACY_FILES.length,
  legacyFilesPresent: legacyOk,
  newCount: NEW_DISPLAY.length,
  newDisplayPresent: newOk,
  totalExpected: 22,
  sitemapUrls: urlCount,
  sitemapOk: urlCount === 74,
};

console.log(JSON.stringify(report, null, 2));
if (!legacyOk || !newOk || urlCount !== 74) process.exit(1);

/**
 * Cross-check published case study constants against UBS PDF exports.
 * Run from repo root: node web/scripts/verify-case-study-sources.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFParse } from "pdf-parse";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, "..", "..", "geo-measurement", "case-study-sources");

const checks = [];

function expect(name, ok) {
  checks.push({ name, ok });
  if (!ok) console.error("FAIL:", name);
}

async function pdfText(file) {
  const buf = fs.readFileSync(path.join(srcDir, file));
  const parser = new PDFParse({ data: buf });
  return (await parser.getText()).text;
}

const hasdai = await pdfText("ubs_rank_tracking_menofeyhasdai-co-il_2026-10-31.pdf");
expect("Hasdai 86 keywords", /Keywords Tracked[\s\S]*86\/300/.test(hasdai));
expect("Hasdai 31 up", hasdai.includes("Keywords Moved Up\n31"));
expect("Hasdai 3 down", hasdai.includes("Keywords Moved Down\n3"));
expect("Hasdai 52 unchanged", hasdai.includes("Keywords Unchanged\n52"));

const express = await pdfText("ubs_rank_tracking_express-hovalot-co-il_2026-10-31.pdf");
expect("Express 59 keywords", /59\/300/.test(express));
expect("Express 10 up", express.includes("Keywords Moved Up\n10"));
expect("Express 28 down", express.includes("Keywords Moved Down\n28"));
expect("Express 21 unchanged", express.includes("Keywords Unchanged\n21"));
expect("Express no Beit Shemesh phrase", !express.includes("בית שמש"));

const failed = checks.filter((c) => !c.ok);
console.log(JSON.stringify({ ok: failed.length === 0, total: checks.length, failed: failed.map((f) => f.name) }, null, 2));
process.exit(failed.length ? 1 : 0);

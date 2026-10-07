#!/usr/bin/env node
/**
 * Regenerates English post content with internal link rewriting.
 * Run: node web/scripts/translate-posts.mjs
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const generator = path.join(scriptDir, "generate-i18n-data.mjs");

const result = spawnSync(process.execPath, [generator], { stdio: "inherit" });
if (result.status !== 0) process.exit(result.status ?? 1);

console.log("translate-posts: regenerated content-en/posts.json via generate-i18n-data.mjs");

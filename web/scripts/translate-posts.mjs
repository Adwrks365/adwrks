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

const generatorResult = spawnSync(process.execPath, [generator], { stdio: "inherit" });
if (generatorResult.status !== 0) process.exit(generatorResult.status ?? 1);

const contentTranslator = path.join(scriptDir, "translate-posts-content.mjs");
const translateArgs = [contentTranslator, ...process.argv.slice(2)];
const translateResult = spawnSync(process.execPath, translateArgs, { stdio: "inherit" });
if (translateResult.status !== 0) process.exit(translateResult.status ?? 1);

console.log("translate-posts: routes + EN post bodies updated");

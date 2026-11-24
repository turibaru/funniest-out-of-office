// The Funniest Out-of-Office — entrypoint.
// Reads entry.txt (shipped in this repo) at runtime and writes its single
// line to $MAKEFUN_OUTPUT_DIR/entry.txt. No network, no DOM, no writes
// into this repository.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  fail("MAKEFUN_OUTPUT_DIR is not set");
}

const here = dirname(fileURLToPath(import.meta.url));
let text;
try {
  text = readFileSync(join(here, "entry.txt"), "utf8");
} catch (err) {
  fail(`cannot read entry.txt: ${err.message}`);
}

// Single line, 1-140 characters, not only whitespace (gate: UTF-8 text).
if (text.includes("\n") || text.includes("\r")) {
  fail("entry.txt must be a single line");
}
const chars = [...text];
if (chars.length < 1 || chars.length > 140) {
  fail(`entry must be 1-140 characters, got ${chars.length}`);
}
if (text.trim().length === 0) {
  fail("entry must not be only whitespace");
}

try {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), text, "utf8");
} catch (err) {
  fail(`cannot write output: ${err.message}`);
}

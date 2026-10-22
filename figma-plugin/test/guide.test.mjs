// Runs every "Do" example in the style guide (content/pages/*.md) through the plugin.
// A Do example that gets an error or warning means the guide and the plugin disagree: fix one of them.
// Run with: node --test figma-plugin/test   (build first: node figma-plugin/build.mjs)
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const engine = require("../src/engine.js");
const rulesJson = JSON.parse(readFileSync(new URL("../../rules.json", import.meta.url), "utf8"));
const c = engine.compile(rulesJson);
const pagesDir = new URL("../../content/pages/", import.meta.url);

// Known disagreements, waiting on a guide change. Each entry: "page | example text" -> why.
// Remove an entry once the guide is fixed; the test fails if an entry is no longer needed.
const KNOWN = {};

// Notes in parentheses that describe the example rather than being part of it, like "(as a link)" or "(in a table)".
const NOTE = /\s*\((?:as |in |instead of |if |unless |only |for |when |e\.g\.|with |without )[^)]*\)\s*$/i;

function examples() {
  const out = [];
  for (const file of readdirSync(pagesDir).filter((f) => f.endsWith(".md"))) {
    const page = file.slice(0, -3);
    const md = readFileSync(new URL(file, pagesDir), "utf8");
    const block = /^::: (dont|do)\b[^\n]*\n([\s\S]*?)^:::\s*$/gm;
    let m;
    while ((m = block.exec(md))) {
      for (const line of m[2].split("\n")) {
        const item = /^\s*[-*]\s+\*(.+)\*\s*$/.exec(line);
        if (!item) continue;
        const raw = item[1].replace(/\*\*/g, "").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").trim(); // links read as their text
        const inTable = /\(in a table\)\s*$/i.test(raw);
        const text = raw.replace(NOTE, "").replace(/^[“"]|[”"]$/g, "").trim();
        out.push({ page, kind: m[1], text, key: page + " | " + raw.replace(/^[“"]|[”"]$/g, ""), context: inTable ? "table-header" : "body" });
      }
    }
  }
  return out;
}

// In a finished design, legal document names are links.
const legalLinks = (text) => rulesJson.data.legalDocuments.flatMap((name) => {
  const out = [];
  for (let i = text.indexOf(name); i !== -1; i = text.indexOf(name, i + 1)) out.push({ start: i, end: i + name.length });
  return out;
});
const problems = (ex) => engine.check(c, { text: ex.text, context: ex.context, links: legalLinks(ex.text) })
  .filter((i) => i.severity !== "suggestion").map((i) => i.ruleId);

test("every Do example in the guide passes the plugin", () => {
  const all = examples();
  const dos = all.filter((e) => e.kind === "do");
  assert.ok(dos.length > 200, "found the guide's examples");
  const failures = [];
  const used = new Set();
  for (const ex of dos) {
    const ids = problems(ex);
    if (!ids.length) continue;
    if (KNOWN[ex.key]) { used.add(ex.key); continue; }
    failures.push(`${ex.page}: “${ex.text}” → ${[...new Set(ids)].join(", ")}`);
  }
  assert.deepEqual(failures, [], "Do examples the plugin flags (fix the guide or the rule):\n" + failures.join("\n"));
  const stale = Object.keys(KNOWN).filter((k) => !used.has(k));
  assert.deepEqual(stale, [], "KNOWN entries that no longer fail; remove them");
});

test("the plugin catches most Don't examples it can check", () => {
  const donts = examples().filter((e) => e.kind === "dont");
  const caught = donts.filter((e) => engine.check(c, { text: e.text, context: e.context }).length);
  // Many Don'ts are about tone or judgment and can't be checked mechanically, so this only guards against big regressions.
  assert.ok(caught.length / donts.length > 0.5, `caught ${caught.length} of ${donts.length} Don't examples`);
});

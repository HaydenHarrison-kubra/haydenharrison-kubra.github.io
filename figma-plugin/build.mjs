// Builds the Figma plugin and the published rules file. No dependencies; run with: node figma-plugin/build.mjs
//
// Inputs:  ../content/sections.json, glossary.json, standard-copy.json, ../content/pages/*.md (headings for guide links),
//          rules/*.mjs, config/*.json, src/*
// Outputs: ../rules.json (fetched live by the plugin), manifest.json, dist/code.js, dist/ui.html

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import styleRules from "./rules/style-guide.mjs";
import grammarRules from "./rules/grammar.mjs";
import * as data from "./rules/data.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const site = path.resolve(here, "..");
const read = (p) => readFileSync(p, "utf8");
const fail = (msg) => { console.error("Build failed: " + msg); process.exit(1); };

const plugin = JSON.parse(read(path.join(here, "config/plugin.json")));
const contexts = JSON.parse(read(path.join(here, "config/contexts.json")));
const engine = createRequire(import.meta.url)("./src/engine.js");
const siteUrl = plugin.siteUrl.replace(/\/?$/, "/");

// ---------- site data ----------
const readJson = (p) => JSON.parse(read(path.join(site, p)));
const SECTIONS = readJson("content/sections.json").sections;
const GLOSSARY = readJson("content/glossary.json");
const STANDARD_COPY = readJson("content/standard-copy.json");

// Same as slugify() in app.js, so links land on the right heading.
const slugify = (s) => s.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function mdInlineToText(s) {
  return s
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/\\([\\`*_[\]{}()#+\-.!|"'<>])/g, "\u0000$1")
    .replace(/[*`]/g, "")
    .replace(/\u0000/g, "")
    .replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
    .trim();
}

// page slug -> { title, anchors: Map(heading text -> [anchor, anchor-2, ...]) }
const pages = {};
for (const sec of SECTIONS) {
  for (const slug of sec.children) {
    const md = read(path.join(site, "content/pages", slug + ".md"));
    const title = (md.match(/^title:\s*(.+)$/m) || [])[1];
    const used = {};
    const anchors = new Map();
    for (const line of md.split("\n")) {
      const h = /^(##|###)\s+(.+)$/.exec(line);
      if (!h) continue;
      const text = mdInlineToText(h[2]);
      let a = slugify(text) || "section";
      used[a] = (used[a] || 0) + 1;
      if (used[a] > 1) a += "-" + used[a];
      if (!anchors.has(text)) anchors.set(text, []);
      anchors.get(text).push(a);
    }
    pages[slug] = { title: title ? JSON.parse(title) : slug, anchors };
  }
}

function resolveGuide(spec, ruleId) {
  if (!spec) return null;
  const [slug, heading, nth = 1] = spec;
  const page = pages[slug];
  if (!page) fail(`rule "${ruleId}" links to unknown page "${slug}"`);
  const list = page.anchors.get(heading);
  if (!list || !list[nth - 1]) fail(`rule "${ruleId}" links to heading "${heading}", which isn't on ${slug}.md. Headings there: ${[...page.anchors.keys()].join(" | ")}`);
  return { url: `${siteUrl}#${slug}/${list[nth - 1]}`, label: `${page.title} › ${heading}` };
}

// ---------- rules ----------
const serialize = (r) => (r instanceof RegExp ? { source: r.source, flags: r.flags } : r);
const rules = [];
function addRule(r, category) {
  const rule = { category, ...r };
  for (const k of ["pattern", "skipInToken"]) if (rule[k]) rule[k] = serialize(rule[k]);
  if (r.guide) rule.guide = Array.isArray(r.guide) ? resolveGuide(r.guide, r.id) : r.guide;
  if (r.guideByContext) {
    rule.guideByContext = {};
    for (const [ctx, g] of Object.entries(r.guideByContext)) rule.guideByContext[ctx] = resolveGuide(g, r.id);
  }
  rules.push(rule);
}
styleRules.forEach((r) => addRule(r, r.category || "style"));
grammarRules.forEach((r) => addRule(r, r.category || "grammar"));

// Glossary-driven rules. Only plain variants become checks; qualified ones like "Total (if unclear…)" need judgment.
const plainVariant = (v) => /^[A-Za-z0-9][A-Za-z0-9 +&\-.]*$/.test(v);
const coveredByHandRules = new Set(["soon", "upcoming", "additional charges", "est", "edt"]);
const baseTerm = (t) => t.replace(/\s*\([^)]*\)\s*$/, "");
const parenAcronym = (t) => (t.match(/\(([A-Z]{2,})\)\s*$/) || [])[1];
const glossaryGuide = (g) => ({ url: `${siteUrl}#glossary/${slugify(g.term)}`, label: `Glossary › ${g.term}` });
const preferredFor = (name) => GLOSSARY.find((g) => g.kind === "Preferred term" && (g.avoid || []).includes(name));
const covered = new Set();

for (const g of GLOSSARY) {
  const guide = glossaryGuide(g);
  const id = "glossary-" + slugify(g.term);
  const variants = (g.avoid || []).filter(plainVariant).filter((v) => !coveredByHandRules.has(v.toLowerCase()));
  if (["Product name", "Third-party brand", "Legal document", "Abbreviation"].includes(g.kind)) {
    const canonical = baseTerm(g.term);
    if (variants.length) {
      addRule({ id, type: "term", terms: variants, caseSensitive: true, fix: canonical, safeFix: true, severity: "error",
        message: `Use “${canonical}”`, detail: g.note, guide }, "style");
      variants.forEach((v) => covered.add(v.toLowerCase()));
    }
    if (g.kind !== "Abbreviation" && !/lowercase/i.test(g.note)) {
      addRule({ id: id + "-case", type: "term", terms: [canonical], caseSensitive: false, skipExact: true, fix: canonical, safeFix: true, severity: "error",
        message: `Write “${canonical}” exactly`, detail: g.note, guide }, "style");
    }
  } else if (g.kind === "Internal term") {
    if (variants.length) {
      addRule({ id: id + "-variants", type: "term", terms: variants, caseSensitive: false, severity: "warning",
        message: "Avoid this term in consumer UI", detail: g.note, guide }, "style");
      variants.forEach((v) => covered.add(v.toLowerCase()));
    }
    const names = [baseTerm(g.term), parenAcronym(g.term)].filter(Boolean).filter((n) => !covered.has(n.toLowerCase()));
    if (!names.length) continue;
    for (const name of names) {
      const preferred = preferredFor(name);
      addRule({ id: id + (names.length > 1 ? "-" + slugify(name) : ""), type: "term", terms: [name], caseSensitive: name !== name.toLowerCase(),
        fix: preferred ? preferred.term : undefined, severity: "warning",
        message: `Avoid “${name}” in consumer UI`, detail: g.note, guide }, "style");
      covered.add(name.toLowerCase());
    }
  } else if (g.kind === "Preferred term") {
    const fresh = variants.filter((v) => !covered.has(v.toLowerCase()));
    if (!fresh.length) continue;
    addRule({ id, type: "term", terms: fresh, caseSensitive: false, severity: "suggestion",
      message: `Use “${g.term}” instead`, detail: g.note, guide }, "style");
    fresh.forEach((v) => covered.add(v.toLowerCase()));
  }
}

// ---------- validation ----------
const ids = new Set();
for (const r of rules) {
  if (ids.has(r.id)) fail(`duplicate rule id "${r.id}"`);
  ids.add(r.id);
  if (!["error", "warning", "suggestion"].includes(r.severity)) fail(`rule "${r.id}" has an invalid severity`);
  if (!["style", "grammar", "compliance"].includes(r.category)) fail(`rule "${r.id}" has an invalid category`);
  if (!engine.runnerTypes.includes(r.type || "pattern")) fail(`rule "${r.id}" uses unknown type "${r.type}"`);
  if ((r.type || "pattern") === "pattern" && !r.pattern) fail(`rule "${r.id}" needs a pattern`);
  if (r.pattern) { try { new RegExp(r.pattern.source, r.pattern.flags); } catch (e) { fail(`rule "${r.id}" has a bad pattern: ${e.message}`); } }
  if (r.fix && typeof r.fix === "object" && !engine.fixerNames.includes(r.fix.fn)) fail(`rule "${r.id}" uses unknown fixer "${r.fix.fn}"`);
  if (r.category !== "grammar" && !r.guide) fail(`style rule "${r.id}" needs a guide link`);
}
const ctxIds = new Set(contexts.contexts.map((c) => c.id).concat("body"));
for (const c of contexts.contexts) {
  if (c.parent && !ctxIds.has(c.parent)) fail(`context "${c.id}" has unknown parent "${c.parent}"`);
  for (const p of c.patterns || []) { try { new RegExp(p, "i"); } catch (e) { fail(`context "${c.id}" has a bad pattern: ${p}`); } }
}
for (const r of rules) {
  for (const c of [].concat(r.contexts === "any" || !r.contexts ? [] : r.contexts, r.exceptContexts || [])) {
    if (!ctxIds.has(c)) fail(`rule "${r.id}" refers to unknown context "${c}" (see config/contexts.json)`);
  }
}

// ---------- rules.json ----------
const glossaryNames = GLOSSARY.filter((g) => ["Product name", "Third-party brand", "Legal document"].includes(g.kind)).flatMap((g) => [baseTerm(g.term), parenAcronym(g.term)]).filter(Boolean);
const glossaryAcronyms = GLOSSARY.flatMap((g) => [baseTerm(g.term), parenAcronym(g.term)]).filter((t) => t && /^[A-Z][A-Z0-9&\-]+$/.test(t));
const standardCopy = STANDARD_COPY.flatMap((cat) => cat.items.map((item) => ({
  id: item.id, title: item.title, category: cat.id, text: item.text, placeholders: item.placeholders || {},
  guide: { url: `${siteUrl}#standard-copy/${item.id}`, label: `Standard Copy › ${item.title}` }
})));
for (const cat of Object.keys(data.standardCopyChecks)) {
  if (!STANDARD_COPY.some((c) => c.id === cat)) fail(`standardCopyChecks refers to unknown Standard Copy category "${cat}"`);
}

const payload = {
  rules,
  data: {
    properNouns: [...new Set([...data.properNouns, ...glossaryNames])],
    acronyms: [...new Set([...data.acronyms, ...glossaryAcronyms])],
    abbreviations: data.abbreviations,
    anPrefixes: data.anPrefixes,
    aPrefixes: data.aPrefixes,
    misspellings: data.misspellings,
    splitVerbs: data.splitVerbs,
    contractions: data.contractions,
    legalDocuments: GLOSSARY.filter((g) => g.kind === "Legal document").map((g) => g.term),
    standardCopy,
    standardCopyCategories: Object.fromEntries(STANDARD_COPY.map((cat) => [cat.id, {
      name: cat.name, guide: { url: `${siteUrl}#standard-copy/${cat.id}`, label: `Standard Copy \u203A ${cat.name}` }
    }])),
    standardCopyChecks: data.standardCopyChecks
  }
};
const version = createHash("sha1").update(JSON.stringify(payload)).digest("hex").slice(0, 8);
// When the rule inputs last changed (from git), shown in the plugin's header.
let updated;
try {
  updated = execFileSync("git", ["log", "-1", "--format=%cs", "--", "content", "figma-plugin/rules", "figma-plugin/config"], { cwd: site, encoding: "utf8" }).trim();
} catch (e) {}
if (!updated) updated = new Date().toISOString().slice(0, 10);
const rulesJson = { schema: engine.SCHEMA, version, updated, siteUrl, ...payload };
engine.compile(rulesJson); // fails loudly if the engine can't read what we built

const rulesText = JSON.stringify(rulesJson, null, 1) + "\n";
writeFileSync(path.join(site, "rules.json"), rulesText);

// ---------- plugin ----------
const origin = new URL(siteUrl).origin;
const manifest = {
  name: plugin.name,
  id: plugin.id,
  api: "1.0.0",
  main: "dist/code.js",
  ui: "dist/ui.html",
  editorType: ["figma"],
  documentAccess: "dynamic-page",
  networkAccess: { allowedDomains: [origin], reasoning: "Downloads the latest rules from the KUBRA Content Style Guide." }
};
writeFileSync(path.join(here, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

const banner = "/* Generated by figma-plugin/build.mjs — edit the files in figma-plugin/src instead. */\n";
mkdirSync(path.join(here, "dist"), { recursive: true });
const code = read(path.join(here, "src/code.js")).replace("/*__CONTEXTS__*/null", JSON.stringify({ contexts: contexts.contexts, ignore: contexts.ignore || {}, links: contexts.links || {}, textOnlyButtons: contexts.textOnlyButtons || {} }));
if (code.includes("__CONTEXTS__")) fail("src/code.js is missing the contexts placeholder");
writeFileSync(path.join(here, "dist/code.js"), banner + code);

const safeScript = (s) => s.replace(/<\/script/gi, "<\\/script");
let ui = read(path.join(here, "src/ui.html"));
ui = ui.replace("/*__ENGINE__*/", () => safeScript(read(path.join(here, "src/engine.js"))));
ui = ui.replace("/*__RULES__*/null", () => safeScript(JSON.stringify(rulesJson)));
ui = ui.replace("__RULES_URL__", () => siteUrl + "rules.json");
ui = ui.replace("__SITE_URL__", () => siteUrl);
if (/__(ENGINE|RULES|RULES_URL|SITE_URL)__/.test(ui)) fail("src/ui.html is missing a placeholder");
writeFileSync(path.join(here, "dist/ui.html"), "<!-- Generated by figma-plugin/build.mjs — edit figma-plugin/src/ui.html instead. -->\n" + ui);

const counts = rules.reduce((acc, r) => ((acc[r.category] = (acc[r.category] || 0) + 1), acc), {});
console.log(`Built rules ${version} (updated ${updated}): ${rules.length} rules — ${Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(", ")}; ${standardCopy.length} standard copy snippets.`);
console.log("Wrote rules.json, figma-plugin/manifest.json, figma-plugin/dist/code.js, figma-plugin/dist/ui.html");

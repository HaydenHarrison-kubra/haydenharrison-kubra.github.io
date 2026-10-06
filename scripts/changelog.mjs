// Generates changelog.json from git history. Run by the publish workflow; also safe to run locally.
//
//   node scripts/changelog.mjs         writes changelog.json (unpublished changes show as "Unreleased")
//   node scripts/changelog.mjs --tag   first tags HEAD with the next version (v2.0.N) if guide content or plugin rules changed
//
// Versions are git tags. Everything published in one push becomes one version. See changelog.config.json.

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, appendFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(path.join(root, p), "utf8");
const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
const config = JSON.parse(read("changelog.config.json"));
const SKIP = /\[skip changelog\]/i;
const ignored = (sha) => config.ignoreCommits.some((short) => sha.startsWith(short));

// ---------- what changed ----------
const { sections } = JSON.parse(read("content/sections.json"));
const titles = { overview: "Overview", glossary: "Glossary", "standard-copy": "Standard Copy" };
for (const sec of sections) {
  titles[sec.slug] = sec.name;
  for (const slug of sec.children) {
    const file = path.join("content/pages", slug + ".md");
    const m = existsSync(path.join(root, file)) && /^title:\s*(.+)$/m.exec(read(file));
    titles[slug] = m ? JSON.parse(m[1]) : slug;
  }
}

// A changed file maps to a page (slug) or the Figma plugin. Anything else (site code, styles) isn't in the changelog.
function classify(file) {
  let m;
  if ((m = /^content\/(?:pages|sections)\/(.+)\.md$/.exec(file))) return { page: m[1] };
  if (file === "content/overview.md") return { page: "overview" };
  if (file === "content/glossary.json") return { page: "glossary" };
  if (file === "content/standard-copy.json") return { page: "standard-copy" };
  if (file === "content/sections.json") return { page: null };
  if (/^figma-plugin\/(rules|config)\//.test(file)) return { plugin: true };
  return null;
}

function commits(range) {
  const raw = execFileSync("git", ["log", "--no-merges", "--reverse", "--format=%x1e%H%x1f%cs%x1f%s%x1f%b%x1f", "--name-only", ...(range ? [range] : [])], { cwd: root, encoding: "utf8" });
  return raw.split("\x1e").filter((c) => c.trim()).map((c) => {
    const [sha, date, subject, body, files] = c.split("\x1f");
    const changed = files.split("\n").map((f) => f.trim()).filter(Boolean);
    return { sha, date, subject: subject.trim(), body, files: changed, tracked: changed.map(classify).filter(Boolean) };
  });
}

const counts = (c) => c.tracked.length && !SKIP.test(c.subject + "\n" + c.body) && !ignored(c.sha);

// Generic messages ("Update forms.md", from GitHub's web editor or a CMS) become "Updated Forms".
function describe(c) {
  const generic = /^(?:(?:update|create|add|edit|delete|rename|change)[ds]?\s+\S+\.(?:md|json|mjs)|update(?:d)?|add files via upload|initial commit)$/i;
  if (!generic.test(c.subject)) return c.subject;
  const names = [...new Set(c.tracked.map((t) => (t.plugin ? "Figma plugin rules" : t.page ? titles[t.page] || t.page : "Navigation")))];
  return "Updated " + names.join(", ");
}

// ---------- versions ----------
const parseVersion = (tag) => (/^v(\d+)\.(\d+)\.(\d+)$/.exec(tag) || []).slice(1).map(Number);
const tags = git("tag", "--list", "v*").split("\n").filter((t) => parseVersion(t).length === 3)
  .sort((a, b) => { const x = parseVersion(a), y = parseVersion(b); return x[0] - y[0] || x[1] - y[1] || x[2] - y[2]; });

if (process.argv.includes("--tag")) {
  const last = tags[tags.length - 1];
  const headTags = git("tag", "--points-at", "HEAD").split("\n").filter((t) => parseVersion(t).length === 3);
  const pending = commits(last ? `${last}..HEAD` : undefined).filter(counts);
  if (headTags.length) {
    console.log(`HEAD is already ${headTags[0]}`);
  } else if (!pending.length) {
    console.log("No guide content or plugin rule changes since " + (last || "the start") + "; no new version.");
  } else {
    const [major, minor] = config.version.split(".").map(Number);
    const prev = last ? parseVersion(last) : null;
    const patch = prev && prev[0] === major && prev[1] === minor ? prev[2] + 1 : 0;
    const tag = `v${major}.${minor}.${patch}`;
    git("tag", tag, "HEAD");
    tags.push(tag);
    console.log("Tagged " + tag);
    if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `tag=${tag}\n`);
  }
}

const versions = [];
const versionOf = {}; // commit sha -> version
tags.forEach((tag, i) => {
  const version = tag.slice(1);
  const range = i === 0 ? tag : `${tags[i - 1]}..${tag}`;
  const list = commits(range);
  list.forEach((c) => { versionOf[c.sha] = version; });
  const date = git("log", "-1", "--format=%cs", tag);
  const legacy = config.history[version];
  const relevant = list.filter(counts);
  const entry = legacy
    ? { version, date, released: true, changes: legacy.changes, pages: legacy.pages || [], plugin: !!legacy.plugin }
    : {
        version, date, released: true,
        changes: [...new Set(relevant.map(describe))],
        pages: [...new Set(relevant.flatMap((c) => c.tracked.map((t) => t.page).filter(Boolean)))],
        plugin: relevant.some((c) => c.tracked.some((t) => t.plugin))
      };
  if (entry.changes.length) versions.push(entry);
});

const unreleased = commits(tags.length ? `${tags[tags.length - 1]}..HEAD` : undefined).filter(counts);
if (unreleased.length) {
  versions.push({
    version: "Unreleased", date: null, released: false,
    changes: [...new Set(unreleased.map(describe))],
    pages: [...new Set(unreleased.flatMap((c) => c.tracked.map((t) => t.page).filter(Boolean)))],
    plugin: unreleased.some((c) => c.tracked.some((t) => t.plugin))
  });
}

// ---------- page update dates ----------
const released = versions.filter((v) => v.released);
const first = released[0];
const pages = {};
const touch = (slug, date, version) => {
  if (!pages[slug] || date >= pages[slug].date) pages[slug] = { date, version };
};
if (first) for (const slug of Object.keys(titles)) touch(slug, first.date, first.version);
for (const c of commits().filter(counts)) {
  const version = versionOf[c.sha] || "Unreleased";
  for (const t of c.tracked) if (t.page) touch(t.page, c.date, version);
}
for (const [slug, version] of Object.entries(config.lastUpdated || {})) {
  const v = released.find((x) => x.version === version);
  if (v) touch(slug, v.date, v.version);
}

const latest = released[released.length - 1];
const out = {
  version: latest ? latest.version : config.version,
  updated: latest ? latest.date : null,
  versions: versions.reverse(),
  pages
};
writeFileSync(path.join(root, "changelog.json"), JSON.stringify(out, null, 1) + "\n");
console.log(`changelog.json: ${released.length} versions (latest ${out.version}, ${out.updated})` + (unreleased.length ? `, ${unreleased.length} unreleased change(s)` : ""));

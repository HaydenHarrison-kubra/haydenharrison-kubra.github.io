// Exercises dist/code.js against a small fake Figma document. Run with: node --test figma-plugin/test/*.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const engine = require("../src/engine.js");
const compiled = engine.compile(JSON.parse(readFileSync(new URL("../../rules.json", import.meta.url), "utf8")));
const code = readFileSync(new URL("../dist/code.js", import.meta.url), "utf8");

let nextId = 1;
const registry = new Map();
class FakeNode {
  constructor(type, name, props = {}) {
    Object.assign(this, { id: String(nextId++), type, name, visible: true, parent: null, children: [] }, props);
    registry.set(this.id, this);
  }
  add(...kids) { kids.forEach((k) => { k.parent = this; this.children.push(k); }); return this; }
  findAllWithCriteria({ types }) {
    const out = [];
    const walk = (n) => n.children.forEach((c) => { if (types.includes(c.type)) out.push(c); walk(c); });
    walk(this);
    return out;
  }
}
class FakeText extends FakeNode {
  constructor(characters, props = {}) {
    super("TEXT", props.name || characters, { characters, autoRename: !props.name, textStyleId: "", fontName: { family: "Inter", style: "Regular" }, hasMissingFont: false, data: {}, ...props });
  }
  getStyledTextSegments(fields) {
    const base = { hyperlink: null, textDecoration: "NONE", textCase: "ORIGINAL", fontName: this.fontName, textStyleId: this.textStyleId, fills: this.fills || [], fillStyleId: "" };
    const runs = this.runs || [{ start: 0, end: this.characters.length }];
    return runs.map((r) => Object.assign({}, base, { characters: this.characters.slice(r.start, r.end) }, r));
  }
  getRangeAllFontNames() { return [this.fontName]; }
  insertCharacters(start, chars) { this.characters = this.characters.slice(0, start) + chars + this.characters.slice(start); }
  deleteCharacters(start, end) { this.characters = this.characters.slice(0, start) + this.characters.slice(end); }
  getPluginData(k) { return this.data[k] || ""; }
  setPluginData(k, v) { this.data[k] = v; }
}
const component = (name, setName) => {
  const set = setName ? new FakeNode("COMPONENT_SET", setName) : null;
  const main = new FakeNode("COMPONENT", name);
  if (set) set.add(main);
  return main;
};
const FILLED = [{ type: "SOLID", visible: true, opacity: 1 }];
const instance = (main, variantProperties = null, name = main.name, props = {}) =>
  new FakeNode("INSTANCE", name, { variantProperties, fills: FILLED, strokes: [], getMainComponentAsync: async () => main, ...props });

// ---------- fake document ----------
const page = new FakeNode("PAGE", "Checkout");
const screen = new FakeNode("FRAME", "Payment screen");
const button = instance(component("Size=Large, Type=Primary", "Button")).add(new FakeText("Click Here", { name: "Label" }));
const heading = new FakeText("Payment Settings.", { textStyleId: "S:heading" });
const errorAlert = instance(component("Type=Error", "Alert"), { Type: "Error" }).add(new FakeText("Oops! Something went wrong"));
const body = new FakeText("Pay the the bill by 5 PM");
const hiddenFrame = new FakeNode("FRAME", "Old", { visible: false }).add(new FakeText("Recieve alerts"));
const iconOnly = new FakeText("chevron-up", { fontName: { family: "KUBRA Icons", style: "Regular" } });
const iconStyled = new FakeText("wallet", { textStyleId: "S:icon" });
const mixed = new FakeText("circle-user Your Account", { runs: [
  { start: 0, end: 11, fontName: { family: "Font Awesome 6 Pro", style: "Solid" } },
  { start: 11, end: 24 }
] });
const buttonSet = component("Type=Primary", "Button");
const textVariant = instance(buttonSet, { Type: "Text" }).add(new FakeText("View full payment history"));
const noBackground = instance(buttonSet, { Type: "Primary" }, "Button", { fills: [], strokes: [] }).add(new FakeText("Read Terms and Conditions"));
const filledLong = instance(buttonSet, { Type: "Primary" }).add(new FakeText("View full payment history"));
const solid = (hex, extra = {}) => [{ type: "SOLID", visible: true, opacity: 1, ...extra,
  color: { r: parseInt(hex.slice(1, 3), 16) / 255, g: parseInt(hex.slice(3, 5), 16) / 255, b: parseInt(hex.slice(5, 7), 16) / 255 } }];
const DARK = solid("#1e1e1e");
const legalBlue = new FakeText("See our Privacy Policy", { fills: DARK, runs: [{ start: 0, end: 8 }, { start: 8, end: 22, fills: solid("#1a73e8") }] });
const legalVar = new FakeText("Read the Terms of Use", { fills: DARK, runs: [{ start: 0, end: 9 }, { start: 9, end: 21, fills: solid("#1e1e1e", { boundVariables: { color: { id: "V:link" } } }) }] });
const legalPlain = new FakeText("Read the Privacy Policy", { fills: DARK });
const legal = new FakeText("By continuing, you accept the Terms of Use", { runs: [{ start: 0, end: 30 }, { start: 30, end: 42, textStyleId: "S:link" }] });
page.add(screen.add(button, heading, errorAlert, body, hiddenFrame, iconOnly, iconStyled, mixed, legal));
const linksFrame = new FakeNode("FRAME", "Links");
page.add(linksFrame.add(legalBlue, legalVar, legalPlain));
const buttonsFrame = new FakeNode("FRAME", "Buttons");
page.add(buttonsFrame.add(textVariant, noBackground, filledLong));

const messages = [];
const storage = {};
const figma = {
  mixed: Symbol("mixed"),
  currentPage: Object.assign(page, { selection: [] }),
  skipInvisibleInstanceChildren: false,
  showUI() {},
  ui: { postMessage: (m) => messages.push(m), onmessage: null },
  on() {},
  getStyleByIdAsync: async (id) => ({ "S:heading": { name: "Heading/H2" }, "S:icon": { name: "Icon/24" }, "S:link": { name: "Body/Link" } })[id] || null,
  getNodeByIdAsync: async (id) => registry.get(id) || null,
  loadFontAsync: async () => {},
  variables: { getVariableByIdAsync: async (id) => ({ "V:link": { name: "Text/Link" } })[id] || null },
  clientStorage: { getAsync: async (k) => storage[k], setAsync: async (k, v) => { storage[k] = v; } },
  commitUndo() {},
  notify() {},
  viewport: { scrollAndZoomIntoView() {} },
  setCurrentPageAsync: async () => {},
  openExternal() {}
};
vm.runInNewContext(code, { figma, __html__: "", setTimeout, console, Promise, JSON });
const send = (msg) => figma.ui.onmessage(msg);
// Round-trip through JSON: objects created inside the vm sandbox have a different prototype.
const last = (type) => JSON.parse(JSON.stringify(messages.filter((m) => m.type === type).pop()));

test("ready returns selection count and cached rules", async () => {
  storage.rules = { schema: 1 };
  await send({ type: "ready" });
  assert.deepEqual(last("init"), { type: "init", selection: 0, cachedRules: { schema: 1 } });
});

test("scan finds visible text and works out what each layer is", async () => {
  await send({ type: "scan", scope: "page", includeHidden: false });
  const result = last("scan-result");
  const byText = Object.fromEntries(result.items.map((i) => [i.text, i]));
  assert.equal(result.items.length, 12);
  assert.equal(result.hiddenSkipped, 1);
  assert.equal(result.iconsSkipped, 2, "icon-font and icon-style layers are skipped");
  assert.equal(byText["Click Here"].context, "button", "a renamed 'Label' layer inside a Button is a button");
  assert.equal(byText["Payment Settings."].context, "heading");
  assert.match(byText["Payment Settings."].contextSource, /Heading\/H2/);
  assert.equal(byText["Oops! Something went wrong"].context, "error");
  assert.equal(byText["Pay the the bill by 5 PM"].context, "body");
  assert.equal(byText["Click Here"].frame, "Payment screen");

  const issues = (t) => engine.check(compiled, byText[t]).map((i) => i.ruleId);
  assert.ok(issues("Click Here").includes("button-click"));
  assert.ok(issues("Payment Settings.").includes("heading-punctuation"));
  assert.ok(issues("Oops! Something went wrong").includes("oops"));
  assert.ok(issues("Pay the the bill by 5 PM").includes("repeated-word"));

  const byId = Object.fromEntries(result.items.map((i) => [i.id, i]));
  const tv = byId[textVariant.children[0].id], nb = byId[noBackground.children[0].id], fl = byId[filledLong.children[0].id];
  assert.equal(tv.context, "text-button");
  assert.equal(tv.contextParent, "button");
  assert.match(tv.contextSource, /text-only variant/);
  assert.equal(nb.context, "text-button");
  assert.match(nb.contextSource, /no background or border/);
  assert.equal(fl.context, "button");
  assert.ok(engine.check(compiled, fl).some((i) => i.ruleId === "button-length"));
  assert.ok(!engine.check(compiled, tv).some((i) => /length/.test(i.ruleId)));

  const legalLinkIssue = (t) => engine.check(compiled, byText[t]).some((i) => i.ruleId === "legal-link");
  assert.ok(!legalLinkIssue("See our Privacy Policy"), "blue text counts as a link");
  assert.ok(!legalLinkIssue("Read the Terms of Use"), "a color variable named Link counts as a link");
  assert.ok(legalLinkIssue("Read the Privacy Policy"), "dark text is not a link");

  const mixedItem = byText["circle-user Your Account"];
  assert.deepEqual(mixedItem.skip, [{ start: 0, end: 11 }]);
  const mixedIssues = engine.check(compiled, mixedItem);
  assert.ok(!mixedIssues.some((i) => /circle/.test(i.match) && i.replacement === null && i.ruleId !== "sentence-case"), "icon name isn't checked as copy");
  const legalItem = byText["By continuing, you accept the Terms of Use"];
  assert.deepEqual(legalItem.linkStyled, [{ start: 30, end: 42 }]);
  assert.ok(!engine.check(compiled, legalItem).some((i) => i.ruleId === "legal-link"), "a link text style counts as linked");

  await send({ type: "scan", scope: "page", includeHidden: true });
  assert.equal(last("scan-result").items.length, 13);
});

test("fixes keep working when several land in one layer", async () => {
  const item = last("scan-result").items.find((i) => i.id === body.id);
  const fixes = engine.check(compiled, item).filter((i) => i.safeFix)
    .map((i) => ({ nodeId: item.id, start: i.start, end: i.end, expected: i.match, replacement: i.replacement }));
  assert.ok(fixes.length >= 2);
  await send({ type: "apply-fixes", fixes });
  assert.equal(body.characters, "Pay the bill by 5 p.m.");
  assert.equal(last("fix-result").applied, fixes.length);
  assert.equal(last("nodes-updated").items[0].text, "Pay the bill by 5 p.m.");
});

test("stale fixes are refused instead of corrupting text", async () => {
  await send({ type: "apply-fixes", fixes: [{ nodeId: body.id, start: 0, end: 3, expected: "Xyz", replacement: "Abc" }] });
  assert.equal(body.characters, "Pay the bill by 5 p.m.");
  assert.equal(last("fix-result").applied, 0);
  assert.match(last("fix-result").failed[0].reason, /changed since the scan/);
});

test("ignore is saved on the layer", async () => {
  await send({ type: "ignore", nodeId: heading.id, key: "heading-punctuation|.", ignored: true });
  assert.deepEqual(JSON.parse(heading.data.ignored), ["heading-punctuation|."]);
  assert.deepEqual(last("nodes-updated").items[0].ignored, ["heading-punctuation|."]);
  await send({ type: "ignore", nodeId: heading.id, key: "heading-punctuation|.", ignored: false });
  assert.equal(heading.data.ignored, "");
});

test("selection scan only includes selected layers", async () => {
  figma.currentPage.selection = [errorAlert];
  await send({ type: "scan", scope: "selection" });
  assert.deepEqual(last("scan-result").items.map((i) => i.text), ["Oops! Something went wrong"]);
});

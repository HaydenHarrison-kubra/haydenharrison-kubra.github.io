// KUBRA Copy Audit: Figma main thread. Finds text layers, works out what kind of text each one is, and applies fixes.
// The rules themselves run in the UI (src/ui.html + src/engine.js).
// Written in ES2017 (no optional chaining or object spread) for the Figma plugin sandbox.

var CONTEXTS = /*__CONTEXTS__*/null;
var MAX_LAYERS = 3000;
var IGNORED_KEY = "ignored";

figma.showUI(__html__, { width: 420, height: 680, themeColors: true });
figma.skipInvisibleInstanceChildren = true;

var contextDefs = CONTEXTS.contexts.map(function (c) {
  return { id: c.id, label: c.label, parent: c.parent || null, strong: !!c.strong, res: c.patterns.map(function (p) { return new RegExp(p, "i"); }) };
});
function patterns(list) { return (list || []).map(function (p) { return new RegExp(p, "i"); }); }
var iconFonts = patterns(CONTEXTS.ignore && CONTEXTS.ignore.fontFamilies);
var iconStyles = patterns(CONTEXTS.ignore && CONTEXTS.ignore.textStyles);
var linkCfg = CONTEXTS.links || {};
var linkStyles = patterns(linkCfg.textStyles);
var linkColorNames = patterns(linkCfg.colorNames);
var linkHexes = (linkCfg.colors || []).map(hexToRgb).filter(Boolean);

function hexToRgb(hex) {
  var m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || "");
  return m ? { r: parseInt(m[1], 16) / 255, g: parseInt(m[2], 16) / 255, b: parseInt(m[3], 16) / 255 } : null;
}

// Blue = hue roughly 190-255 degrees, clearly saturated, not near-black or near-white.
function isBlue(c) {
  var max = Math.max(c.r, c.g, c.b), min = Math.min(c.r, c.g, c.b), l = (max + min) / 2, d = max - min;
  if (d < 0.08 || l < 0.15 || l > 0.8) return false;
  var s = d / (1 - Math.abs(2 * l - 1));
  var h = max === c.r ? ((c.g - c.b) / d) % 6 : max === c.g ? (c.b - c.r) / d + 2 : (c.r - c.g) / d + 4;
  h = (h * 60 + 360) % 360;
  return s >= 0.35 && h >= 190 && h <= 255;
}

function isLinkColor(color) {
  if (!color) return false;
  if (linkHexes.some(function (h) { return Math.abs(h.r - color.r) < 0.02 && Math.abs(h.g - color.g) < 0.02 && Math.abs(h.b - color.b) < 0.02; })) return true;
  return !!linkCfg.blueText && isBlue(color);
}
function anyMatch(res, s) { return !!s && res.some(function (r) { return r.test(s); }); }
var textOnlyCfg = CONTEXTS.textOnlyButtons || {};
var textOnlyVariants = patterns(textOnlyCfg.variantValues);
var textButtonDef = contextDefs.filter(function (d) { return d.id === "text-button"; })[0] || null;

// ---------- context detection ----------
function bestMatch(strings) {
  var best = -1;
  strings.forEach(function (s) {
    if (!s) return;
    for (var i = 0; i < contextDefs.length; i++) {
      if (best !== -1 && i >= best) break;
      var d = contextDefs[i];
      for (var j = 0; j < d.res.length; j++) {
        if (d.res[j].test(s)) { best = i; break; }
      }
    }
  });
  return best === -1 ? null : contextDefs[best];
}

var styleNames = {};
async function textStyleName(node) {
  var id = node.textStyleId;
  if (id === figma.mixed) {
    var segs = node.getStyledTextSegments(["textStyleId"]);
    id = segs.length ? segs[0].textStyleId : "";
  }
  return styleNameById(id);
}

async function styleNameById(id) {
  if (!id || typeof id !== "string") return "";
  if (!(id in styleNames)) {
    try {
      var style = await figma.getStyleByIdAsync(id);
      styleNames[id] = style ? style.name : "";
    } catch (e) {
      styleNames[id] = "";
    }
  }
  return styleNames[id];
}

var componentInfo = {};
async function componentStrings(node) {
  if (componentInfo[node.id]) return componentInfo[node.id];
  var out = [node.name];
  try {
    var main = node.type === "INSTANCE" ? await node.getMainComponentAsync() : node;
    if (main) {
      out.push(main.name);
      if (main.parent && main.parent.type === "COMPONENT_SET") out.push(main.parent.name);
    }
    if (node.type === "INSTANCE" && node.variantProperties) {
      for (var k in node.variantProperties) out.push(node.variantProperties[k]);
    }
  } catch (e) {
    // Missing or remote components: fall back to the layer name.
  }
  componentInfo[node.id] = out;
  return out;
}

function visiblePaint(paints) {
  if (paints === figma.mixed) return true;
  return (paints || []).some(function (p) { return p.visible !== false && (p.opacity === undefined || p.opacity > 0); });
}

// Why a button counts as text-only (no container), or null. Text-only buttons may use up to 5 words.
function textOnlyReason(button) {
  var values = [];
  try {
    if (button.variantProperties) for (var k in button.variantProperties) values.push(button.variantProperties[k]);
  } catch (e) {}
  for (var i = 0; i < values.length; i++) {
    if (anyMatch(textOnlyVariants, values[i])) return "text-only variant “" + values[i] + "”";
  }
  if (!textOnlyCfg.checkBackground) return null;
  if (visiblePaint(button.fills) || visiblePaint(button.strokes)) return null;
  var containers = ("children" in button ? button.children : []).filter(function (ch) {
    return (ch.type === "FRAME" || ch.type === "RECTANGLE") && ch.visible !== false && (visiblePaint(ch.fills) || visiblePaint(ch.strokes));
  });
  return containers.length ? null : "no background or border";
}

// Priority: a control the text sits in (e.g. Button) > text style > renamed layer name > nearest other component.
async function classify(node) {
  var own = node.autoRename ? null : bestMatch([node.name]);
  var styleName = await textStyleName(node);
  var style = styleName ? bestMatch([styleName]) : null;
  var strong = null, weak = null;
  var n = node.parent, depth = 0;
  while (n && n.type !== "PAGE" && n.type !== "DOCUMENT" && depth < 30) {
    if (n.type === "INSTANCE" || n.type === "COMPONENT" || n.type === "COMPONENT_SET") {
      var m = bestMatch(await componentStrings(n));
      if (m && m.strong) {
        strong = { def: m, source: "component “" + n.name + "”" };
        var why = m.id === "button" && textButtonDef ? textOnlyReason(n) : null;
        if (why) strong = { def: textButtonDef, source: strong.source + ", " + why };
        break;
      }
      if (m && !weak) weak = { def: m, source: "component “" + n.name + "”" };
      if (weak) break;
    }
    n = n.parent;
    depth++;
  }
  var pick =
    (own && own.strong && { def: own, source: "layer name" }) ||
    strong ||
    (style && { def: style, source: "text style “" + styleName + "”" }) ||
    (own && { def: own, source: "layer name" }) ||
    weak;
  return pick ? { id: pick.def.id, label: pick.def.label, parent: pick.def.parent, source: pick.source } : { id: "body", label: "Body text", parent: null, source: "no matching component or style" };
}

// ---------- layer description ----------
function isHidden(node) {
  for (var n = node; n && n.type !== "PAGE"; n = n.parent) if (n.visible === false) return true;
  return false;
}

function topFrameName(node) {
  var n = node;
  while (n.parent && n.parent.type !== "PAGE" && n.parent.type !== "DOCUMENT") n = n.parent;
  return n === node ? "" : n.name;
}

function ranges(node, field, test) {
  if (!node.characters.length) return [];
  return node.getStyledTextSegments([field]).filter(test).map(function (s) { return { start: s.start, end: s.end }; });
}

function readIgnored(node) {
  try { return JSON.parse(node.getPluginData(IGNORED_KEY) || "[]"); } catch (e) { return []; }
}

// Font family and text style for each run of text, used to find icon-font words and link-styled text.
var variableNames = {};
async function variableName(id) {
  if (!id) return "";
  if (!(id in variableNames)) {
    try {
      var v = await figma.variables.getVariableByIdAsync(id);
      variableNames[id] = v ? v.name : "";
    } catch (e) {
      variableNames[id] = "";
    }
  }
  return variableNames[id];
}

// Whether a run of text looks like a link by its color: a link color style or variable, a configured link color, or blue.
async function linkColored(seg) {
  var paints = Array.isArray(seg.fills) ? seg.fills : [];
  var paint = paints.filter(function (p) { return p.visible !== false && p.type === "SOLID"; })[0];
  var names = [await styleNameById(seg.fillStyleId)];
  if (paint && paint.boundVariables && paint.boundVariables.color) names.push(await variableName(paint.boundVariables.color.id));
  if (names.some(function (n) { return anyMatch(linkColorNames, n); })) return true;
  return paint ? isLinkColor(paint.color) : false;
}

// Font, text style, and link-ness for each run of text, used to find icon-font words and link-styled text.
async function styleRuns(node) {
  if (!node.characters.length) return [];
  var segs = node.getStyledTextSegments(["fontName", "textStyleId", "fills", "fillStyleId"]);
  var out = [];
  for (var i = 0; i < segs.length; i++) {
    var style = await styleNameById(segs[i].textStyleId);
    out.push({
      start: segs[i].start, end: segs[i].end,
      family: segs[i].fontName ? segs[i].fontName.family : "",
      style: style,
      link: anyMatch(linkStyles, style) || (await linkColored(segs[i]))
    });
  }
  return out;
}

function onlyIcons(text, icons) {
  for (var i = 0; i < text.length; i++) {
    if (/\s/.test(text.charAt(i))) continue;
    var covered = icons.some(function (r) { return i >= r.start && i < r.end; });
    if (!covered) return false;
  }
  return true;
}

// Returns null for layers that are only icon-font text (like "chevron-up"); those aren't copy.
async function describe(node) {
  var runs = await styleRuns(node);
  var toRange = function (r) { return { start: r.start, end: r.end }; };
  var icons = runs.filter(function (r) { return anyMatch(iconFonts, r.family) || anyMatch(iconStyles, r.style); }).map(toRange);
  if (icons.length && onlyIcons(node.characters, icons)) return null;
  var ctx = await classify(node);
  return {
    skip: icons,
    linkStyled: runs.filter(function (r) { return r.link; }).map(toRange),
    id: node.id,
    name: node.name,
    text: node.characters,
    context: ctx.id,
    contextParent: ctx.parent,
    contextLabel: ctx.label,
    contextSource: ctx.source,
    frame: topFrameName(node),
    links: ranges(node, "hyperlink", function (s) { return !!s.hyperlink; }),
    underline: ranges(node, "textDecoration", function (s) { return s.textDecoration === "UNDERLINE"; }),
    upper: ranges(node, "textCase", function (s) { return s.textCase === "UPPER" || s.textCase === "SMALL_CAPS" || s.textCase === "SMALL_CAPS_FORCED"; }),
    titleCase: ranges(node, "textCase", function (s) { return s.textCase === "TITLE"; }),
    italic: ranges(node, "fontName", function (s) { return /italic|oblique/i.test(s.fontName.style); }),
    ignored: readIgnored(node)
  };
}

// ---------- scan ----------
function pause() { return new Promise(function (resolve) { setTimeout(resolve, 0); }); }

async function scan(scope, includeHidden) {
  var roots = scope === "selection" ? figma.currentPage.selection.slice() : [figma.currentPage];
  var nodes = [], seen = {};
  roots.forEach(function (root) {
    var found = root.type === "TEXT" ? [root] : ("findAllWithCriteria" in root ? root.findAllWithCriteria({ types: ["TEXT"] }) : []);
    found.forEach(function (t) {
      if (!seen[t.id]) { seen[t.id] = true; nodes.push(t); }
    });
  });
  var hiddenSkipped = 0;
  if (!includeHidden) {
    var visible = nodes.filter(function (t) { return !isHidden(t); });
    hiddenSkipped = nodes.length - visible.length;
    nodes = visible;
  }
  var truncated = nodes.length > MAX_LAYERS;
  if (truncated) nodes = nodes.slice(0, MAX_LAYERS);

  componentInfo = {};
  var items = [], iconsSkipped = 0;
  for (var i = 0; i < nodes.length; i++) {
    var item = await describe(nodes[i]);
    if (item) items.push(item); else iconsSkipped++;
    if (i % 100 === 99) {
      figma.ui.postMessage({ type: "scan-progress", done: i + 1, total: nodes.length });
      await pause();
    }
  }
  figma.ui.postMessage({ type: "scan-result", scope: scope, items: items, truncated: truncated, limit: MAX_LAYERS, hiddenSkipped: hiddenSkipped, iconsSkipped: iconsSkipped });
}

// ---------- fixes ----------
async function loadFonts(node) {
  var fonts = node.characters.length ? node.getRangeAllFontNames(0, node.characters.length) : [node.fontName];
  await Promise.all(fonts.map(function (f) { return figma.loadFontAsync(f); }));
}

// Each fix: { nodeId, start, end, expected, replacement }. Inserting after the old text and then deleting it keeps the original styling.
async function applyFixes(fixes) {
  var byNode = {};
  fixes.forEach(function (f) { (byNode[f.nodeId] = byNode[f.nodeId] || []).push(f); });
  var applied = 0, failed = [], updated = [];
  for (var id in byNode) {
    var node = await figma.getNodeByIdAsync(id);
    if (!node || node.type !== "TEXT") { failed.push({ nodeId: id, reason: "The layer no longer exists." }); continue; }
    if (node.hasMissingFont) { failed.push({ nodeId: id, reason: "This layer uses a font that isn’t installed." }); continue; }
    try {
      await loadFonts(node);
    } catch (e) {
      failed.push({ nodeId: id, reason: "Couldn’t load this layer’s fonts." });
      continue;
    }
    var list = byNode[id].sort(function (a, b) { return b.start - a.start; });
    var lastStart = Infinity;
    for (var i = 0; i < list.length; i++) {
      var f = list[i];
      if (f.end > lastStart || node.characters.slice(f.start, f.end) !== f.expected) {
        failed.push({ nodeId: id, reason: "The text changed since the scan. Scan again." });
        continue;
      }
      if (f.replacement) node.insertCharacters(f.end, f.replacement, "BEFORE");
      node.deleteCharacters(f.start, f.end);
      lastStart = f.start;
      applied++;
    }
    var fresh = await describe(node);
    if (fresh) updated.push(fresh);
  }
  if (applied) figma.commitUndo();
  figma.ui.postMessage({ type: "nodes-updated", items: updated });
  figma.ui.postMessage({ type: "fix-result", applied: applied, failed: failed });
}

async function setIgnored(nodeId, key, ignored) {
  var node = await figma.getNodeByIdAsync(nodeId);
  if (!node || node.type !== "TEXT") return;
  var list = readIgnored(node).filter(function (k) { return k !== key; });
  if (ignored) list.push(key);
  try {
    node.setPluginData(IGNORED_KEY, list.length ? JSON.stringify(list) : "");
  } catch (e) {
    figma.notify("Can’t save ignored issues in a file you can’t edit.");
    return;
  }
  var fresh = await describe(node);
  figma.ui.postMessage({ type: "nodes-updated", items: fresh ? [fresh] : [] });
}

async function selectNode(nodeId) {
  var node = await figma.getNodeByIdAsync(nodeId);
  if (!node) { figma.notify("That layer no longer exists."); return; }
  var page = node;
  while (page && page.type !== "PAGE") page = page.parent;
  if (page && page !== figma.currentPage) await figma.setCurrentPageAsync(page);
  figma.currentPage.selection = [node];
  figma.viewport.scrollAndZoomIntoView([node]);
}

// ---------- messages ----------
figma.ui.onmessage = async function (msg) {
  try {
    if (msg.type === "ready") {
      var cached = null;
      try { cached = await figma.clientStorage.getAsync("rules"); } catch (e) {}
      figma.ui.postMessage({ type: "init", selection: figma.currentPage.selection.length, cachedRules: cached || null });
    } else if (msg.type === "scan") {
      await scan(msg.scope, !!msg.includeHidden);
    } else if (msg.type === "apply-fixes") {
      await applyFixes(msg.fixes || []);
    } else if (msg.type === "ignore") {
      await setIgnored(msg.nodeId, msg.key, msg.ignored);
    } else if (msg.type === "select") {
      await selectNode(msg.nodeId);
    } else if (msg.type === "cache-rules") {
      await figma.clientStorage.setAsync("rules", msg.rules);
    } else if (msg.type === "open-url") {
      figma.openExternal(msg.url);
    } else if (msg.type === "notify") {
      figma.notify(msg.text);
    }
  } catch (e) {
    figma.ui.postMessage({ type: "error", message: String((e && e.message) || e) });
  }
};

figma.on("selectionchange", function () {
  figma.ui.postMessage({ type: "selection", count: figma.currentPage.selection.length });
});
figma.on("currentpagechange", function () {
  figma.ui.postMessage({ type: "page-changed", selection: figma.currentPage.selection.length });
});

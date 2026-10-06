// KUBRA Content Style Guide 2.0 — interactive site logic
(function () {
  "use strict";

  var ICONS = {
    search: '<circle cx="11" cy="11" r="7.5"/><path d="m20.5 20.5-4.2-4.2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowLeft: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    external: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    chevronUp: '<path d="m18 15-6-6-6 6"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3.5 2"/>',
    glossary: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="m8.5 13 3.5-7 3.5 7M9.6 11h4.8"/>',
    quote: '<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/>',
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
    landmark: '<path d="M3 21h18M5 18v-7M9.5 18v-7M14.5 18v-7M19 18v-7M12 3l9 5H3z"/>',
    message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 13h5"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M12 11h4M12 16h4M8 11h.01M8 16h.01"/>',
    scale: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1ZM2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1ZM7 21h10M12 3v18M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
    book: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>'
  };

  var HERO_ART =
    '<svg class="hero-art" viewBox="0 0 560 560" fill="none" aria-hidden="true">' +
    '<circle cx="330" cy="230" r="200" stroke="rgba(255,255,255,.07)" stroke-width="70"/>' +
    '<circle cx="330" cy="230" r="120" stroke="rgba(255,255,255,.12)" stroke-width="1.5"/>' +
    '<circle cx="330" cy="230" r="270" stroke="#7dbd41" stroke-opacity=".6" stroke-width="2.5" stroke-dasharray="1 12" stroke-linecap="round"/>' +
    '<path d="M130 230a200 200 0 0 1 200-200" stroke="#ffc627" stroke-width="3" stroke-linecap="round"/>' +
    '<circle cx="130" cy="230" r="9" fill="#ffc627"/>' +
    '<circle cx="186" cy="390" r="5" fill="#7dbd41"/>' +
    "</svg>";

  var START_HERE = ["voice", "tone", "accessibility", "buttons-and-ctas", "message-types", "decision-guidelines"];
  var EXTRA_ROUTES = {
    "standard-copy": { title: "Standard Copy", icon: "quote" },
    glossary: { title: "Glossary", icon: "glossary" },
    changelog: { title: "Changelog", icon: "history" }
  };
  var KIND_COLORS = {
    "Product name": "#037eb4",
    "Third-party brand": "#546473",
    "Legal document": "#03587c",
    "Abbreviation": "#b88400",
    "Preferred term": "#5e9e2a",
    "Internal term": "#e0661a"
  };
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  var state = {
    activeSlug: "overview",
    renderedSlug: null,
    forceRender: false,
    activeTags: [],
    query: "",
    pendingHighlight: null,
    exampleCount: 0,
    glossKinds: []
  };
  var META = [];
  // Loaded from content/*.json and the generated changelog.json (see loadContent).
  var SECTIONS = [], EXTRA_TAGS = [], GLOSSARY = [], STANDARD_COPY = [], CHANGELOG = null;
  var els = {};
  var tocObserver = null;
  var toastTimer = null;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function icon(name) {
    return '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + "</svg>";
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function slugify(s) {
    return s.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function formatDate(iso) {
    var p = iso.split("-");
    return MONTHS[parseInt(p[1], 10) - 1] + " " + parseInt(p[2], 10) + ", " + p[0];
  }

  function pageBySlug(slug) { return META.find(function (m) { return m.slug === slug; }); }
  function sectionBySlug(slug) { return SECTIONS.find(function (s) { return s.slug === slug; }); }
  function sectionFor(slug) {
    return SECTIONS.find(function (s) { return s.slug === slug || s.children.indexOf(slug) !== -1; });
  }
  function isRoute(slug) { return slug === "overview" || !!EXTRA_ROUTES[slug] || !!sectionBySlug(slug) || !!pageBySlug(slug); }
  function secStyle(sec) { return ' style="--c:' + sec.color + '"'; }
  function colorStyle(c) { return ' style="--c:' + c + '"'; }

  // ---------- Content loading (content/*.md) ----------
  var DD = {
    do: { head: "abf5d1", cell: "e3fcef", emoji: "✅", label: "Do's" },
    dont: { head: "ffbdad", cell: "ffebe6", emoji: "❌", label: "Don'ts" }
  };
  var PANELS = { callout: "panel-custom", note: "panel-note" };

  function parseFrontMatter(src) {
    var m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(src);
    if (!m) return { data: {}, body: src };
    var data = {};
    m[1].split(/\r?\n/).forEach(function (line) {
      var i = line.indexOf(":");
      if (i === -1) return;
      var key = line.slice(0, i).trim();
      var raw = line.slice(i + 1).trim();
      try { data[key] = JSON.parse(raw); } catch (e) { data[key] = raw.replace(/^["']|["']$/g, ""); }
    });
    return { data: data, body: src.slice(m[0].length) };
  }

  // Markdown plus fenced blocks: "::: do" / "::: dont" (optional custom label) and "::: callout" / "::: note".
  function renderMarkdown(src) {
    var lines = src.split(/\r?\n/);
    var segments = [];
    var md = [];
    for (var i = 0; i < lines.length; i++) {
      var open = /^:::\s*(do|dont|callout|note)\b\s*(.*)$/.exec(lines[i]);
      if (!open) { md.push(lines[i]); continue; }
      var body = [];
      for (i++; i < lines.length && !/^:::\s*$/.test(lines[i]); i++) body.push(lines[i]);
      segments.push({ type: "md", text: md.join("\n") });
      segments.push({ type: "block", kind: open[1], label: open[2].trim(), body: body.join("\n") });
      md = [];
    }
    segments.push({ type: "md", text: md.join("\n") });

    var blocks = [];
    var out = "";
    for (var s = 0; s < segments.length; s++) {
      var seg = segments[s];
      if (seg.type === "md") { out += seg.text; continue; }
      if (PANELS[seg.kind]) {
        blocks.push('<div data-type="' + PANELS[seg.kind] + '">' + renderMarkdown(seg.body) + "</div>");
      } else {
        // Do/don't blocks separated only by blank lines share one table.
        var group = [seg];
        while (s + 2 < segments.length && !segments[s + 1].text.trim() && DD[segments[s + 2].kind]) {
          group.push(segments[s + 2]);
          s += 2;
        }
        blocks.push(ddTable(group));
      }
      out += "\n\n<!--block:" + (blocks.length - 1) + "-->\n\n";
    }
    return marked.parse(out).replace(/<!--block:(\d+)-->/g, function (_, n) { return blocks[+n]; });
  }

  // Emits the same markup the do/don't styles and copy buttons key on.
  function ddTable(group) {
    var head = "";
    var cells = "";
    group.forEach(function (b) {
      var d = DD[b.kind];
      head += '<th style="background-color: #' + d.head + '"><p><strong>' + d.emoji + " " + esc(b.label || d.label) + "</strong></p></th>";
      cells += '<td style="background-color: #' + d.cell + '">' + renderMarkdown(b.body) + "</td>";
    });
    return "<table><thead><tr>" + head + "</tr></thead><tbody><tr>" + cells + "</tr></tbody></table>";
  }

  function fetchJson(path, optional) {
    return fetch(path, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error(path + " (" + r.status + ")");
      return r.json();
    }).catch(function (e) {
      if (optional) return null;
      throw e;
    });
  }

  function loadContent() {
    // No bare-URL/email autolinking: examples like name@example.com must stay plain text.
    marked.use({ tokenizer: { url: function () { return undefined; } } });
    return Promise.all([
      fetchJson("content/sections.json"),
      fetchJson("content/glossary.json"),
      fetchJson("content/standard-copy.json"),
      fetchJson("changelog.json", true) // generated on publish; the site works without it
    ]).then(function (r) {
      SECTIONS = r[0].sections;
      EXTRA_TAGS = r[0].topics || [];
      GLOSSARY = r[1];
      STANDARD_COPY = r[2];
      CHANGELOG = r[3];
      return loadPages();
    });
  }

  function loadPages() {
    var jobs = [{ slug: "overview", path: "content/overview.md" }];
    SECTIONS.forEach(function (sec) {
      jobs.push({ slug: sec.slug, path: "content/sections/" + sec.slug + ".md" });
      sec.children.forEach(function (slug) {
        jobs.push({ slug: slug, path: "content/pages/" + slug + ".md", section: sec });
      });
    });
    return Promise.all(jobs.map(function (job) {
      return fetch(job.path).then(function (r) {
        if (!r.ok) throw new Error(job.path + " (" + r.status + ")");
        return r.text();
      });
    })).then(function (sources) {
      var holder = document.getElementById("templates");
      sources.forEach(function (src, i) {
        var job = jobs[i];
        var fm = parseFrontMatter(src);
        var t = document.createElement("template");
        t.setAttribute("data-page", job.slug);
        t.innerHTML = renderMarkdown(fm.body);
        holder.appendChild(t);
        if (job.section) {
          META.push({ slug: job.slug, title: fm.data.title || job.slug, blurb: fm.data.blurb || "", tags: [job.section.slug].concat(fm.data.topics || []) });
        }
      });
    });
  }

  function getTemplate(slug) { return document.querySelector('template[data-page="' + slug + '"]'); }
  function getTemplateHTML(slug) { var t = getTemplate(slug); return t ? t.innerHTML : ""; }

  var textCache = {};
  function getTemplateText(slug) {
    if (textCache[slug] !== undefined) return textCache[slug];
    var t = getTemplate(slug);
    if (!t) return "";
    // Join text nodes with spaces so adjacent cells/paragraphs don't run together.
    var parts = [];
    var walker = document.createTreeWalker(t.content, NodeFilter.SHOW_TEXT, null, false);
    var n;
    while ((n = walker.nextNode())) parts.push(n.nodeValue);
    textCache[slug] = parts.join(" ").replace(/[✅❌]️?/g, "").replace(/\s+/g, " ").replace(/\s+([.,;:!?)])/g, "$1").trim();
    return textCache[slug];
  }

  // ---------- Versions and update dates (from the generated changelog.json) ----------
  function pageUpdated(slug) {
    if (!CHANGELOG) return null;
    if (slug && CHANGELOG.pages && CHANGELOG.pages[slug]) return CHANGELOG.pages[slug];
    return slug ? null : { date: CHANGELOG.updated, version: CHANGELOG.version };
  }
  function versionAnchor(version) { return slugify(/^\d/.test(version) ? "v" + version : version); }

  function docMeta(slug) {
    var u = pageUpdated(slug);
    if (!u || !u.date) return "";
    var dot = '<span class="dot" aria-hidden="true">·</span>';
    return '<div class="doc-meta">' + icon("clock") +
      '<span>Updated <time datetime="' + u.date + '">' + formatDate(u.date) + "</time></span>" + dot +
      (u.version
        ? '<a href="#changelog/' + versionAnchor(u.version) + '" data-route="changelog/' + versionAnchor(u.version) + '">Version ' + esc(u.version) + "</a>"
        : '<a href="#changelog" data-route="changelog">Changelog</a>') + "</div>";
  }

  // ---------- Theme ----------
  function isDark() {
    var current = document.documentElement.getAttribute("data-theme");
    return current === "dark" || (!current && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }

  function toggleTheme() {
    var next = isDark() ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("sg-theme", next); } catch (e) {}
    updateThemeIcon();
  }

  function updateThemeIcon() {
    var dark = isDark();
    els.themeBtn.innerHTML = icon(dark ? "sun" : "moon");
    els.themeBtn.title = dark ? "Switch to light mode" : "Switch to dark mode";
  }

  // ---------- Index ----------
  function buildIndex() {
    META.forEach(function (m) {
      m._text = (m.title + " " + getTemplateText(m.slug)).toLowerCase();
      var t = getTemplate(m.slug);
      if (t) state.exampleCount += t.content.querySelectorAll('td[style*="e3fcef"] li, td[style*="ffebe6"] li').length;
    });
    GLOSSARY.forEach(function (g) {
      g.anchor = slugify(g.term);
      g._text = [g.term, g.kind, g.note].concat(g.avoid || []).join(" ").toLowerCase();
    });
    GLOSSARY.sort(function (a, b) { return a.term.toLowerCase().localeCompare(b.term.toLowerCase()); });
    STANDARD_COPY.forEach(function (cat) {
      cat.items.forEach(function (item) {
        item.category = cat;
        item._text = [cat.name, item.title, item.context || "", item.text].concat(item.tags || []).join(" ").toLowerCase();
      });
    });
  }

  function allSnippets() {
    return STANDARD_COPY.reduce(function (acc, cat) { return acc.concat(cat.items); }, []);
  }
  function snippetById(id) {
    return allSnippets().find(function (s) { return s.id === id; });
  }

  // ---------- Toast ----------
  function toast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { els.toast.classList.remove("show"); }, 1800);
  }

  // ---------- Sidebar ----------
  function navTop(slug, label, ic) {
    return '<a class="nav-top" href="#' + slug + '" data-route="' + slug + '">' + icon(ic) + "<span>" + esc(label) + "</span></a>";
  }

  function renderSidebar() {
    var html = navTop("overview", "Overview", "home");
    html += '<div class="nav-label">Sections</div>';
    SECTIONS.forEach(function (sec) {
      html += '<div class="nav-section" data-section="' + sec.slug + '"' + secStyle(sec) + ">";
      html += '<div class="nav-section-head">';
      html += '<a class="nav-section-link" href="#' + sec.slug + '" data-route="' + sec.slug + '">' + icon(sec.icon) + "<span>" + esc(sec.name) + "</span></a>";
      html += '<button type="button" class="nav-caret" aria-expanded="true" aria-label="Toggle ' + esc(sec.name) + '">' + icon("chevron") + "</button>";
      html += '</div><div class="nav-children">';
      sec.children.forEach(function (slug) {
        var page = pageBySlug(slug);
        if (page) html += '<a class="nav-leaf" href="#' + slug + '" data-route="' + slug + '">' + esc(page.title) + "</a>";
      });
      html += "</div></div>";
    });
    html += '<div class="nav-label">Resources</div>';
    Object.keys(EXTRA_ROUTES).forEach(function (slug) {
      html += navTop(slug, EXTRA_ROUTES[slug].title, EXTRA_ROUTES[slug].icon);
    });
    els.sidebarNav.innerHTML = html;

    $all(".nav-caret", els.sidebarNav).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var collapsed = btn.closest(".nav-section").classList.toggle("collapsed");
        btn.setAttribute("aria-expanded", String(!collapsed));
      });
    });
  }

  function syncSidebar() {
    $all("[data-route]", els.sidebarNav).forEach(function (el) {
      var on = el.getAttribute("data-route") === state.activeSlug;
      el.classList.toggle("active", on);
      if (on) el.setAttribute("aria-current", "page"); else el.removeAttribute("aria-current");
    });
    var sec = sectionFor(state.activeSlug);
    if (sec) {
      var secEl = $('.nav-section[data-section="' + sec.slug + '"]', els.sidebarNav);
      if (secEl && secEl.classList.contains("collapsed")) {
        secEl.classList.remove("collapsed");
        $(".nav-caret", secEl).setAttribute("aria-expanded", "true");
      }
    }
  }

  // ---------- Topic filters ----------
  function renderTagFilters() {
    els.tagRow.innerHTML = EXTRA_TAGS.map(function (tag) {
      return '<button type="button" class="chip" data-tag="' + esc(tag) + '" aria-pressed="false">' + esc(tag) + "</button>";
    }).join("");
    $all("[data-tag]", els.tagRow).forEach(function (el) {
      el.addEventListener("click", function () {
        var tag = el.getAttribute("data-tag");
        var idx = state.activeTags.indexOf(tag);
        if (idx === -1) state.activeTags.push(tag); else state.activeTags.splice(idx, 1);
        applyTagFilters();
      });
    });
  }

  function pageMatchesTags(page) {
    return page.tags.some(function (t) { return state.activeTags.indexOf(t) !== -1; });
  }

  function applyTagFilters() {
    $all("[data-tag]", els.tagRow).forEach(function (el) {
      el.setAttribute("aria-pressed", String(state.activeTags.indexOf(el.getAttribute("data-tag")) !== -1));
    });
    els.clearTags.classList.toggle("show", state.activeTags.length > 0);

    var filtering = state.activeTags.length > 0;
    SECTIONS.forEach(function (sec) {
      var secEl = $('.nav-section[data-section="' + sec.slug + '"]', els.sidebarNav);
      var any = false;
      sec.children.forEach(function (slug) {
        var page = pageBySlug(slug);
        var match = !filtering || (page && pageMatchesTags(page));
        var leaf = $('[data-route="' + slug + '"]', secEl);
        if (leaf) leaf.classList.toggle("dimmed", !match);
        if (match) any = true;
      });
      secEl.classList.toggle("dimmed", !any);
    });

    if (state.query) runSearch(state.query);
  }

  // ---------- Content enhancements ----------
  function wrapTables(container) {
    $all("table", container).forEach(function (t) {
      var w = document.createElement("div");
      w.className = "table-wrap";
      t.parentNode.insertBefore(w, t);
      w.appendChild(t);
    });
  }

  function decorateDoDont(container) {
    $all('th[style*="abf5d1"], th[style*="ffbdad"]', container).forEach(function (th) {
      var isDo = th.getAttribute("style").indexOf("abf5d1") !== -1;
      var table = th.closest("table");
      if (table && table.querySelectorAll("thead th, tr:first-child > th").length === 2) table.classList.add("dd-table");
      var walker = document.createTreeWalker(th, NodeFilter.SHOW_TEXT, null, false);
      var n;
      while ((n = walker.nextNode())) n.nodeValue = n.nodeValue.replace(/[✅❌]️?\s*/g, "");
      var target = th.querySelector("strong") || th.querySelector("p") || th;
      target.insertAdjacentHTML("afterbegin", '<span class="dd-badge">' + icon(isDo ? "check" : "close") + "</span>");
    });
  }

  function copyText(text, onDone, onFail) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onDone).catch(function () { if (onFail) onFail(); });
      return;
    }
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      onDone();
    } catch (err) { if (onFail) onFail(); }
  }

  function addCopyButtons(container) {
    $all('td[style*="e3fcef"] li, td[style*="e3fcef"] > p, td[style*="ffebe6"] li, td[style*="ffebe6"] > p', container).forEach(function (el) {
      var text = el.textContent.trim();
      if (!text) return;
      el.classList.add("has-copy");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.title = "Copy example";
      btn.setAttribute("aria-label", "Copy example: " + text);
      btn.innerHTML = icon("copy");
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        copyText(text, function () {
          btn.innerHTML = icon("check");
          btn.classList.add("copied");
          setTimeout(function () {
            btn.innerHTML = icon("copy");
            btn.classList.remove("copied");
          }, 1200);
        });
      });
      el.appendChild(btn);
    });
  }

  function anchorLink(slug, anchor, label) {
    return '<a class="anchor" href="#' + slug + "/" + anchor + '" data-copy-anchor="' + anchor + '" title="Copy link to this section" aria-label="Copy link to ' + esc(label) + '">' + icon("link") + "</a>";
  }

  // Gives every h2/h3 a stable id and a copy-link button; returns the h2s for the TOC.
  function addHeadingAnchors(container, slug) {
    var used = {};
    var h2s = [];
    $all("h2, h3", container).forEach(function (h) {
      var label = h.textContent.trim();
      var anchor = slugify(label) || "section";
      used[anchor] = (used[anchor] || 0) + 1;
      if (used[anchor] > 1) anchor += "-" + used[anchor];
      h.id = "a-" + anchor;
      h.setAttribute("data-anchor-name", anchor);
      h.insertAdjacentHTML("beforeend", anchorLink(slug, anchor, label));
      if (h.tagName === "H2") h2s.push({ el: h, anchor: anchor, label: label });
    });
    return h2s;
  }

  function enhanceContent(container) {
    wrapTables(container);
    decorateDoDont(container);
    addCopyButtons(container);
    $all('a[href^="http"]', container).forEach(function (a) {
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  // ---------- Table of contents ----------
  function buildToc(layout, heads, slug) {
    var tocEl = $(".toc", layout);
    if (heads.length < 2) {
      tocEl.remove();
      layout.classList.add("no-toc");
      return;
    }
    var html = '<div class="toc-title">On this page</div>';
    heads.forEach(function (h) {
      html += '<a href="#' + slug + "/" + h.anchor + '" data-anchor="' + h.anchor + '">' + esc(h.label) + "</a>";
    });
    tocEl.innerHTML = html;

    if (!("IntersectionObserver" in window)) return;
    tocObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) setActiveToc(en.target.getAttribute("data-anchor-name")); });
    }, { rootMargin: "-80px 0px -70% 0px" });
    heads.forEach(function (h) { tocObserver.observe(h.el); });
    setActiveToc(heads[0].anchor);
  }

  function setActiveToc(anchor) {
    $all(".toc a", els.content).forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-anchor") === anchor);
    });
  }

  function scrollToAnchor(anchor, smooth) {
    var el = document.getElementById("a-" + anchor);
    if (!el) return false;
    el.scrollIntoView({ behavior: smooth && !reduceMotion ? "smooth" : "auto", block: "start" });
    el.classList.remove("flash");
    void el.offsetWidth;
    el.classList.add("flash");
    return true;
  }

  // ---------- In-page match highlighting ----------
  function highlight(container, query) {
    var regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "ig");
    var walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
    var nodes = [];
    var n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(function (node) {
      regex.lastIndex = 0;
      if (!regex.test(node.nodeValue)) return;
      regex.lastIndex = 0;
      var frag = document.createDocumentFragment();
      var last = 0, m;
      while ((m = regex.exec(node.nodeValue))) {
        frag.appendChild(document.createTextNode(node.nodeValue.slice(last, m.index)));
        var mark = document.createElement("mark");
        mark.textContent = m[0];
        frag.appendChild(mark);
        last = m.index + m[0].length;
      }
      frag.appendChild(document.createTextNode(node.nodeValue.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
  }

  var matchState = { marks: [], index: 0 };

  function showMatches(query) {
    var content = $(".doc .content", els.content);
    if (!content) return;
    highlight(content, query);
    var marks = $all("mark", content);
    if (!marks.length) return;
    matchState = { marks: marks, index: 0 };

    var bar = document.createElement("div");
    bar.className = "match-bar";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Search matches");
    bar.innerHTML = icon("search") +
      '<span class="mb-text"><b class="mb-pos"></b> for “' + esc(query) + "”</span>" +
      '<button type="button" class="mb-btn" data-match="prev" aria-label="Previous match">' + icon("chevronUp") + "</button>" +
      '<button type="button" class="mb-btn" data-match="next" aria-label="Next match">' + icon("chevron") + "</button>" +
      '<button type="button" class="mb-btn" data-match="clear" aria-label="Clear highlights">' + icon("close") + "</button>";
    content.parentNode.insertBefore(bar, content);
    bar.addEventListener("click", function (e) {
      var b = e.target.closest("[data-match]");
      if (!b) return;
      var action = b.getAttribute("data-match");
      if (action === "clear") clearMatches();
      else goToMatch(matchState.index + (action === "next" ? 1 : -1), true);
    });
    goToMatch(0, false);
  }

  function goToMatch(i, smooth) {
    var marks = matchState.marks;
    if (!marks.length) return;
    matchState.index = (i + marks.length) % marks.length;
    marks.forEach(function (m, j) { m.classList.toggle("current", j === matchState.index); });
    var target = marks[matchState.index];
    var top = target.getBoundingClientRect().top + window.pageYOffset - window.innerHeight / 3;
    window.scrollTo({ top: Math.max(0, top), behavior: smooth && !reduceMotion ? "smooth" : "auto" });
    var pos = $(".match-bar .mb-pos", els.content);
    if (pos) pos.textContent = (matchState.index + 1) + " of " + marks.length + " match" + (marks.length === 1 ? "" : "es");
  }

  function clearMatches() {
    var content = $(".doc .content", els.content);
    if (!content) return;
    $all("mark", content).forEach(function (m) { m.replaceWith(document.createTextNode(m.textContent)); });
    content.normalize();
    var bar = $(".match-bar", els.content);
    if (bar) bar.remove();
    matchState = { marks: [], index: 0 };
  }

  // ---------- Pages ----------
  function breadcrumb(parts) {
    return '<nav class="breadcrumb" aria-label="Breadcrumb">' + parts.join('<span class="sep" aria-hidden="true">/</span>') + "</nav>";
  }
  function crumbLink(slug, label) {
    return '<a href="#' + slug + '" data-route="' + slug + '">' + esc(label) + "</a>";
  }
  function stat(value, label) {
    return "<div><dt>" + esc(label) + "</dt><dd>" + esc(value) + "</dd></div>";
  }

  function renderOverview() {
    var html = '<section class="hero">' + HERO_ART +
      '<div class="eyebrow">KUBRA · Version ' + esc(CHANGELOG ? CHANGELOG.version : "2.0") + "</div>" +
      "<h1>Content Style Guide</h1>" +
      '<p class="hero-lead">' + esc(getTemplateText("overview")) + "</p>" +
      '<div class="hero-actions">' +
      '<button type="button" class="btn btn-light" data-action="search">' + icon("search") + "<span>Search the guide</span><kbd>/</kbd></button>" +
      '<a class="btn btn-outline-light" href="#foundations" data-route="foundations"><span>Start with Foundations</span>' + icon("arrowRight") + "</a>" +
      "</div>" +
      '<dl class="hero-stats">' +
      stat(SECTIONS.length, "Sections") +
      stat(META.length, "Guideline pages") +
      stat(state.exampleCount, "Do & don’t examples") +
      stat(GLOSSARY.length, "Glossary terms") +
      "</dl></section>";

    html += '<section class="home-block"><div class="block-head"><h2>Browse by section</h2><p>Organized the same way as the Confluence space</p></div><div class="section-grid">';
    SECTIONS.forEach(function (sec) {
      var n = sec.children.length;
      html += '<a class="section-card" href="#' + sec.slug + '" data-route="' + sec.slug + '"' + secStyle(sec) + ">" +
        '<span class="icon-tile">' + icon(sec.icon) + "</span>" +
        '<span><span class="sc-title">' + esc(sec.name) + '</span><span class="sc-desc">' + esc(sec.blurb) + "</span></span>" +
        '<span class="sc-meta"><span>' + n + " page" + (n === 1 ? "" : "s") + "</span>" + icon("arrowRight") + "</span></a>";
    });
    html += "</div></section>";

    html += '<section class="home-block"><div class="block-head"><h2>Start here</h2><p>The pages writers reach for most</p></div><div class="quick-grid">';
    START_HERE.forEach(function (slug) {
      var page = pageBySlug(slug);
      var sec = sectionFor(slug);
      if (!page || !sec) return;
      html += quickLink(slug, sec.name, page.title, sec.color);
    });
    html += "</div></section>";

    var latest = pageUpdated();
    html += '<section class="home-block"><div class="block-head"><h2>Resources</h2></div><div class="quick-grid">';
    html += quickLink("standard-copy", allSnippets().length + " ready-to-paste messages", "Standard Copy", "#037eb4");
    html += quickLink("glossary", GLOSSARY.length + " terms", "Glossary", "#b88400");
    html += quickLink("changelog", latest ? "Version " + latest.version + " · " + formatDate(latest.date) : "Updates", "Changelog", "#5e9e2a");
    html += "</div></section>";

    els.content.innerHTML = html;
  }

  function quickLink(slug, eyebrow, title, color) {
    return '<a class="quick-link" href="#' + slug + '" data-route="' + slug + '"' + colorStyle(color) + ">" +
      '<span><span class="eyebrow">' + esc(eyebrow) + '</span><span class="ql-title">' + esc(title) + "</span></span>" +
      icon("arrowRight") + "</a>";
  }

  function renderSectionLanding(sec) {
    var html = breadcrumb([crumbLink("overview", "Style Guide"), "<span>" + esc(sec.name) + "</span>"]);
    html += '<header class="section-head"' + secStyle(sec) + '><span class="icon-tile lg">' + icon(sec.icon) + "</span>" +
      '<div><div class="eyebrow">Section</div><h1 class="page-title">' + esc(sec.name) + "</h1></div></header>";
    html += '<div class="content section-intro">' + getTemplateHTML(sec.slug) + "</div>";
    html += '<div class="page-list"' + secStyle(sec) + ">";
    sec.children.forEach(function (slug, i) {
      var page = pageBySlug(slug);
      if (!page) return;
      html += '<a class="page-row" href="#' + slug + '" data-route="' + slug + '">' +
        '<span class="pr-num">' + (i < 9 ? "0" : "") + (i + 1) + "</span>" +
        '<span><span class="pr-title">' + esc(page.title) + '</span><span class="pr-desc">' + esc(page.blurb) + "</span></span>" +
        icon("arrowRight") + "</a>";
    });
    html += "</div>";
    els.content.innerHTML = html;
    enhanceContent(els.content);
  }

  function renderLeafPage(page, sec) {
    var idx = sec.children.indexOf(page.slug);
    var prev = idx > 0 ? pageBySlug(sec.children[idx - 1]) : null;
    var next = idx < sec.children.length - 1 ? pageBySlug(sec.children[idx + 1]) : null;
    var topics = page.tags.filter(function (t) { return EXTRA_TAGS.indexOf(t) !== -1; });

    var html = '<div class="doc-layout"><article class="doc">';
    html += breadcrumb([crumbLink("overview", "Style Guide"), crumbLink(sec.slug, sec.name), "<span>" + esc(page.title) + "</span>"]);
    html += '<header class="doc-head"' + secStyle(sec) + '><div class="eyebrow">' + esc(sec.name) + "</div>";
    html += '<h1 class="page-title">' + esc(page.title) + "</h1>";
    html += '<p class="page-lead">' + esc(page.blurb) + "</p>";
    if (topics.length) {
      html += '<div class="page-tags">' + topics.map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div>";
    }
    html += docMeta(page.slug);
    html += "</header>";
    html += '<div class="content">' + getTemplateHTML(page.slug) + "</div>";

    if (prev || next) {
      html += '<nav class="pager" aria-label="Previous and next pages">';
      if (prev) html += '<a class="prev" href="#' + prev.slug + '" data-route="' + prev.slug + '"><span class="dir">' + icon("arrowLeft") + "Previous</span><span class=\"t\">" + esc(prev.title) + "</span></a>";
      if (next) html += '<a class="next" href="#' + next.slug + '" data-route="' + next.slug + '"><span class="dir">Next' + icon("arrowRight") + "</span><span class=\"t\">" + esc(next.title) + "</span></a>";
      html += "</nav>";
    }
    html += '</article><aside class="toc" aria-label="On this page"></aside></div>';

    els.content.innerHTML = html;
    var layout = $(".doc-layout", els.content);
    var content = $(".content", layout);
    enhanceContent(content);
    buildToc(layout, addHeadingAnchors(content, page.slug), page.slug);
  }

  // ---------- Glossary ----------
  function renderGlossary() {
    var sources = {};
    GLOSSARY.forEach(function (g) { sources[g.source] = true; });
    var kinds = Object.keys(KIND_COLORS);
    state.glossKinds = [];

    var html = breadcrumb([crumbLink("overview", "Style Guide"), "<span>Glossary</span>"]);
    html += '<header class="doc-head"><div class="eyebrow">Resources</div><h1 class="page-title">Glossary</h1>';
    html += '<p class="page-lead">Approved product names, abbreviations, and preferred terms, compiled from ' + Object.keys(sources).length + " reference pages in this guide.</p>";
    html += docMeta("glossary") + "</header>";
    html += '<div class="gloss-tools">' +
      '<label class="gloss-search">' + icon("search") + '<input id="glossFilter" type="search" placeholder="Filter ' + GLOSSARY.length + ' terms" autocomplete="off" aria-label="Filter glossary terms"></label>' +
      '<div class="chip-row" id="glossKinds">' + kinds.map(function (k) {
        return '<button type="button" class="chip kind-chip" data-kind="' + esc(k) + '" aria-pressed="' + (state.glossKinds.indexOf(k) !== -1) + '"' + colorStyle(KIND_COLORS[k]) + '><span class="kind-dot"></span>' + esc(k) + "</button>";
      }).join("") + "</div></div>";
    html += '<nav class="az-bar" id="azBar" aria-label="Jump to letter"></nav><div id="glossList"></div>';
    els.content.innerHTML = html;

    var input = $("#glossFilter", els.content);
    input.addEventListener("input", drawGlossary);
    $all("[data-kind]", els.content).forEach(function (chip) {
      chip.addEventListener("click", function () {
        var k = chip.getAttribute("data-kind");
        var i = state.glossKinds.indexOf(k);
        if (i === -1) state.glossKinds.push(k); else state.glossKinds.splice(i, 1);
        chip.setAttribute("aria-pressed", String(i === -1));
        drawGlossary();
      });
    });
    drawGlossary();
  }

  function drawGlossary() {
    var q = ($("#glossFilter", els.content).value || "").trim().toLowerCase();
    var items = GLOSSARY.filter(function (g) {
      return (!q || g._text.indexOf(q) !== -1) && (!state.glossKinds.length || state.glossKinds.indexOf(g.kind) !== -1);
    });

    var groups = {};
    items.forEach(function (g) {
      var letter = g.term.charAt(0).toUpperCase();
      if (!/[A-Z]/.test(letter)) letter = "#";
      (groups[letter] = groups[letter] || []).push(g);
    });

    var az = "";
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(function (L) {
      az += groups[L]
        ? '<a href="#glossary/letter-' + L.toLowerCase() + '" data-anchor="letter-' + L.toLowerCase() + '">' + L + "</a>"
        : '<span aria-hidden="true">' + L + "</span>";
    });
    $("#azBar", els.content).innerHTML = az;

    var list = $("#glossList", els.content);
    if (!items.length) {
      list.innerHTML = '<div class="empty"><strong>No matching terms</strong>Try a different word or clear the type filters.</div>';
      return;
    }
    var html = "";
    Object.keys(groups).sort().forEach(function (L) {
      html += '<section class="gloss-group"><h2 class="gloss-letter" id="a-letter-' + L.toLowerCase() + '">' + L + '</h2><div class="gloss-list">';
      groups[L].forEach(function (g) {
        var src = pageBySlug(g.source);
        html += '<article class="gloss-item" id="a-' + g.anchor + '"' + colorStyle(KIND_COLORS[g.kind]) + ">" +
          '<div class="gi-head"><h3 class="gi-term">' + esc(g.term) + "</h3>" + anchorLink("glossary", g.anchor, g.term) +
          '<span class="kind">' + esc(g.kind) + "</span></div>" +
          '<p class="gi-note">' + esc(g.note) + "</p>";
        if (g.avoid && g.avoid.length) {
          html += '<div class="gi-avoid"><span class="gi-label">Not</span>' + g.avoid.map(function (a) { return "<s>" + esc(a) + "</s>"; }).join("") + "</div>";
        }
        if (src) html += '<a class="gi-source" href="#' + src.slug + '" data-route="' + src.slug + '">' + esc(src.title) + icon("arrowRight") + "</a>";
        html += "</article>";
      });
      html += "</div></section>";
    });
    list.innerHTML = html;
    if (q) $all(".gi-term, .gi-note, .gi-avoid s", list).forEach(function (el) { highlight(el, q); });
  }

  // ---------- Standard copy ----------
  function snippetHTML(item) {
    var html = esc(item.text);
    var keys = Object.keys(item.placeholders || {}).sort(function (a, b) { return b.length - a.length; });
    keys.forEach(function (k) {
      var label = esc(item.placeholders[k]);
      html = html.split(esc(k)).join('<span class="ph" title="Replace with ' + label + '">' + esc(k) + "</span>");
    });
    return html;
  }

  function renderStandardCopy() {
    var html = breadcrumb([crumbLink("overview", "Style Guide"), "<span>Standard Copy</span>"]);
    html += '<header class="doc-head"><div class="eyebrow">Resources</div><h1 class="page-title">Standard Copy</h1>';
    html += '<p class="page-lead">Approved, ready-to-paste copy for common messages. Use it word for word and replace only the <span class="ph">highlighted</span> placeholders.</p>' + docMeta("standard-copy") + "</header>";

    STANDARD_COPY.forEach(function (cat) {
      html += '<section class="copy-cat">';
      html += '<h2 class="copy-cat-title" id="a-' + cat.id + '">' + esc(cat.name) + anchorLink("standard-copy", cat.id, cat.name) + "</h2>";
      if (cat.intro) html += '<p class="copy-cat-intro">' + esc(cat.intro) + "</p>";
      if (cat.related && cat.related.length) {
        html += '<div class="copy-related"><span>Related guidance</span>' + cat.related.map(function (slug) {
          var p = pageBySlug(slug);
          return p ? '<a href="#' + slug + '" data-route="' + slug + '">' + esc(p.title) + icon("arrowRight") + "</a>" : "";
        }).join("") + "</div>";
      }
      html += '<div class="copy-list">';
      cat.items.forEach(function (item) {
        var keys = Object.keys(item.placeholders || {});
        html += '<article class="copy-item" id="a-' + item.id + '">' +
          '<div class="ci-head"><div class="ci-title"><h3>' + esc(item.title) + "</h3>" + anchorLink("standard-copy", item.id, item.title) + "</div>" +
          '<button type="button" class="btn-copy" data-copy-snippet="' + item.id + '">' + icon("copy") + "<span>Copy</span></button></div>";
        if (item.tags && item.tags.length) {
          html += '<div class="page-tags">' + item.tags.map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div>";
        }
        if (item.context) html += '<p class="ci-context">' + esc(item.context) + "</p>";
        html += '<blockquote class="ci-text">' + snippetHTML(item) + "</blockquote>";
        if (keys.length) {
          html += '<div class="ci-foot"><div class="ci-replace"><span class="gi-label">Replace</span>' + keys.map(function (k) {
            return '<span class="ci-ph"><span class="ph">' + esc(k) + "</span>" + esc(item.placeholders[k]) + "</span>";
          }).join("") + "</div></div>";
        }
        html += "</article>";
      });
      html += "</div></section>";
    });
    els.content.innerHTML = html;
  }

  function copySnippet(btn) {
    var item = snippetById(btn.getAttribute("data-copy-snippet"));
    if (!item) return;
    copyText(item.text, function () {
      toast("Copied to clipboard");
      btn.classList.add("copied");
      btn.innerHTML = icon("check") + "<span>Copied</span>";
      setTimeout(function () {
        btn.classList.remove("copied");
        btn.innerHTML = icon("copy") + "<span>Copy</span>";
      }, 1500);
    }, function () { toast("Couldn’t copy — select the text instead"); });
  }

  // ---------- Changelog ----------
  function renderChangelog() {
    var html = breadcrumb([crumbLink("overview", "Style Guide"), "<span>Changelog</span>"]);
    html += '<header class="doc-head"><div class="eyebrow">Resources</div><h1 class="page-title">Changelog</h1>';
    html += '<p class="page-lead">Every published change to the guide\u2019s content and the Figma plugin\u2019s rules, newest first. Each update gets a version number automatically when it\u2019s published.</p></header>';
    var versions = (CHANGELOG && CHANGELOG.versions) || [];
    if (!versions.length) {
      els.content.innerHTML = html + '<div class="empty"><strong>No changelog yet</strong>It\u2019s generated when the site is published.</div>';
      return;
    }
    html += '<ol class="timeline">';
    versions.forEach(function (v) {
      var label = /^\d/.test(v.version) ? "Version " + v.version : v.version;
      html += '<li class="tl-entry" id="a-' + versionAnchor(v.version) + '"' + colorStyle(v.released ? "#5e9e2a" : "#b88400") + ">" +
        (v.date ? '<time class="tl-date" datetime="' + v.date + '">' + formatDate(v.date) + "</time>" : '<span class="tl-date">Not published</span>') +
        '<div class="tl-card"><div class="tl-top"><h2>' + esc(label) + "</h2>" +
        (v.plugin ? '<span class="kind"' + colorStyle("#037eb4") + ">Figma plugin</span>" : "") + "</div>";
      html += "<ul>" + v.changes.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul>";
      if (v.pages === "all") {
        html += '<div class="tl-pages"><span class="tag">All ' + META.length + " pages</span></div>";
      } else if (v.pages && v.pages.length) {
        html += '<div class="tl-pages">' + v.pages.map(function (slug) {
          var p = pageBySlug(slug) || sectionBySlug(slug);
          var title = p ? (p.title || p.name) : EXTRA_ROUTES[slug] ? EXTRA_ROUTES[slug].title : slug === "overview" ? "Overview" : null;
          return title ? '<a class="tag" href="#' + slug + '" data-route="' + slug + '">' + esc(title) + "</a>" : "";
        }).join("") + "</div>";
      }
      html += "</div></li>";
    });
    html += "</ol>";
    els.content.innerHTML = html;
  }

  // ---------- Render ----------
  function renderActivePage() {
    var slug = state.activeSlug;
    syncSidebar();
    if (tocObserver) { tocObserver.disconnect(); tocObserver = null; }
    matchState = { marks: [], index: 0 };

    var sec = sectionBySlug(slug);
    var page = pageBySlug(slug);
    var parent = sectionFor(slug);
    if (slug === "standard-copy") renderStandardCopy();
    else if (slug === "glossary") renderGlossary();
    else if (slug === "changelog") renderChangelog();
    else if (sec) renderSectionLanding(sec);
    else if (page && parent) renderLeafPage(page, parent);
    else renderOverview();

    state.renderedSlug = slug;
    var title = page ? page.title : sec ? sec.name : EXTRA_ROUTES[slug] ? EXTRA_ROUTES[slug].title : null;
    document.title = (title ? title + " · " : "") + "KUBRA Content Style Guide";
    window.scrollTo(0, 0);

    if (state.pendingHighlight) {
      var q = state.pendingHighlight;
      state.pendingHighlight = null;
      showMatches(q);
    }
  }

  // ---------- Routing ----------
  function parseHash() {
    var raw = window.location.hash.replace(/^#/, "");
    var i = raw.indexOf("/");
    var slug = (i === -1 ? raw : raw.slice(0, i)) || "overview";
    var anchor = i === -1 ? "" : decodeURIComponent(raw.slice(i + 1));
    if (!isRoute(slug)) return { slug: "overview", anchor: "" };
    return { slug: slug, anchor: anchor };
  }

  function go(route) {
    resetSearch();
    closeMobileSidebar();
    state.forceRender = true;
    if (window.location.hash.replace(/^#/, "") === route) onHashChange();
    else window.location.hash = route;
  }

  function onHashChange() {
    var r = parseHash();
    if (state.query) resetSearch();
    if (r.slug !== state.renderedSlug || state.forceRender) {
      state.forceRender = false;
      state.activeSlug = r.slug;
      renderActivePage();
    } else if (!r.anchor) {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    }
    if (r.anchor) scrollToAnchor(r.anchor, false);
  }

  function setAnchorInUrl(anchor) {
    var url = "#" + state.activeSlug + "/" + anchor;
    if (window.history && history.replaceState) history.replaceState(null, "", url);
    return window.location.href.split("#")[0] + url;
  }

  function onDocClick(e) {
    if (!e.target.closest) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;

    var snippetBtn = e.target.closest("[data-copy-snippet]");
    if (snippetBtn) {
      copySnippet(snippetBtn);
      return;
    }

    var copyAnchor = e.target.closest("a[data-copy-anchor]");
    if (copyAnchor) {
      e.preventDefault();
      var a = copyAnchor.getAttribute("data-copy-anchor");
      var url = setAnchorInUrl(a);
      scrollToAnchor(a, true);
      copyText(url, function () { toast("Link copied"); }, function () { toast("Link is in the address bar"); });
      return;
    }

    var route = e.target.closest("a[data-route]");
    if (route) {
      e.preventDefault();
      var q = route.getAttribute("data-highlight");
      state.pendingHighlight = q || null;
      go(route.getAttribute("data-route"));
      return;
    }

    var inPage = e.target.closest("a[data-anchor]");
    if (inPage) {
      e.preventDefault();
      var anchor = inPage.getAttribute("data-anchor");
      setAnchorInUrl(anchor);
      scrollToAnchor(anchor, true);
      return;
    }

    if (e.target.closest('[data-action="search"]')) {
      e.preventDefault();
      focusSearch();
    }
  }

  // ---------- Search ----------
  function snippet(text, q) {
    var i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i === -1) return text.slice(0, 160) + "…";
    var start = Math.max(0, i - 70);
    var end = Math.min(text.length, i + q.length + 90);
    return (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
  }

  function runSearch(q) {
    state.query = q;
    els.search.classList.toggle("has-value", q.length > 0);
    if (!q.trim()) {
      state.query = "";
      renderActivePage();
      return;
    }
    if (tocObserver) { tocObserver.disconnect(); tocObserver = null; }
    state.renderedSlug = null;
    var lower = q.trim().toLowerCase();
    var matches = META.filter(function (m) {
      return m._text.indexOf(lower) !== -1 && (state.activeTags.length === 0 || pageMatchesTags(m));
    });
    matches.sort(function (a, b) {
      return (a.title.toLowerCase().indexOf(lower) !== -1 ? 0 : 1) - (b.title.toLowerCase().indexOf(lower) !== -1 ? 0 : 1);
    });
    var terms = state.activeTags.length ? [] : GLOSSARY.filter(function (g) { return g._text.indexOf(lower) !== -1; }).slice(0, 6);
    var snippets = state.activeTags.length ? [] : allSnippets().filter(function (s) { return s._text.indexOf(lower) !== -1; });

    var html = '<header class="results-head"><div class="eyebrow">Search</div>';
    html += '<h1 class="page-title">' + matches.length + " page" + (matches.length === 1 ? "" : "s") + "</h1>";
    html += "<p>match “" + esc(q.trim()) + "”" + (state.activeTags.length ? " in " + esc(state.activeTags.join(", ")) : "") + "</p></header>";

    if (snippets.length) {
      html += '<div class="results-group"><div class="results-label">' + icon("quote") + "Standard copy</div><div class=\"term-results\">";
      snippets.forEach(function (s) {
        html += '<a class="term-result" href="#standard-copy/' + s.id + '" data-route="standard-copy/' + s.id + '"' + colorStyle("#037eb4") + ">" +
          '<span class="tr-term">' + esc(s.title) + '</span><span class="kind">' + esc(s.category.name) + "</span>" +
          '<span class="tr-note">' + esc(s.text) + "</span></a>";
      });
      html += "</div></div>";
    }

    if (terms.length) {
      html += '<div class="results-group"><div class="results-label">' + icon("glossary") + "Glossary</div><div class=\"term-results\">";
      terms.forEach(function (g) {
        html += '<a class="term-result" href="#glossary/' + g.anchor + '" data-route="glossary/' + g.anchor + '"' + colorStyle(KIND_COLORS[g.kind]) + ">" +
          '<span class="tr-term">' + esc(g.term) + '</span><span class="kind">' + esc(g.kind) + "</span>" +
          '<span class="tr-note">' + esc(g.note) + "</span></a>";
      });
      html += "</div></div>";
    }

    if (matches.length === 0) {
      html += '<div class="empty"><strong>No matching pages</strong>Try a different term' + (state.activeTags.length ? ", or clear the topic filters" : "") + ".</div>";
    } else {
      if (terms.length || snippets.length) html += '<div class="results-label">' + icon("book") + "Pages</div>";
      html += '<div class="results">';
      matches.forEach(function (m) {
        var sec = sectionFor(m.slug);
        html += '<a class="result" href="#' + m.slug + '" data-route="' + m.slug + '" data-highlight="' + esc(q.trim()) + '"' + (sec ? secStyle(sec) : "") + ">" +
          '<div class="eyebrow">' + (sec ? esc(sec.name) : "") + "</div>" +
          '<div class="result-title">' + esc(m.title) + "</div>" +
          '<div class="result-snippet">' + esc(snippet(getTemplateText(m.slug), lower)) + "</div></a>";
      });
      html += "</div>";
    }
    els.content.innerHTML = html;
    $all(".result-title, .result-snippet, .tr-term, .tr-note", els.content).forEach(function (el) { highlight(el, lower); });
    window.scrollTo(0, 0);
  }

  function resetSearch() {
    els.searchInput.value = "";
    els.search.classList.remove("has-value");
    state.query = "";
  }

  function focusSearch() {
    closeMobileSidebar();
    els.searchInput.focus();
    els.searchInput.select();
  }

  // ---------- Mobile sidebar ----------
  function setSidebar(open) {
    els.sidebar.classList.toggle("open", open);
    els.backdrop.classList.toggle("show", open);
    els.menuBtn.setAttribute("aria-expanded", String(open));
    els.menuBtn.innerHTML = icon(open ? "close" : "menu");
  }
  function closeMobileSidebar() { if (els.sidebar.classList.contains("open")) setSidebar(false); }

  // ---------- Init ----------
  function init() {
    els.sidebar = $("#sidebar");
    els.sidebarNav = $("#sidebarNav");
    els.backdrop = $("#backdrop");
    els.tagRow = $("#tagRow");
    els.clearTags = $("#clearTags");
    els.content = $("#content");
    els.search = $("#search");
    els.searchInput = $("#searchInput");
    els.searchClear = $("#searchClear");
    els.themeBtn = $("#themeToggle");
    els.menuBtn = $("#menuToggle");
    els.toast = $("#toast");

    $all("[data-icon]").forEach(function (el) { el.innerHTML = icon(el.getAttribute("data-icon")); });
    var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    $("#searchKbd").textContent = isMac ? "⌘K" : "Ctrl K";

    updateThemeIcon();
    els.themeBtn.addEventListener("click", toggleTheme);
    els.content.innerHTML = '<p class="loading">Loading the style guide…</p>';
    loadContent().then(start, function (err) {
      els.content.innerHTML = '<div class="empty"><strong>Couldn’t load the style guide content</strong>' + esc(err.message) +
        (location.protocol === "file:" ? ". Open the site through a local web server (see README)." : ".") + "</div>";
    });
  }

  function start() {
    var latest = pageUpdated();
    if (latest) $("#footerSync").textContent = "Version " + latest.version + " · Updated " + formatDate(latest.date);
    buildIndex();
    renderSidebar();
    renderTagFilters();

    els.clearTags.addEventListener("click", function () { state.activeTags = []; applyTagFilters(); });
    els.menuBtn.addEventListener("click", function () { setSidebar(!els.sidebar.classList.contains("open")); });
    els.backdrop.addEventListener("click", closeMobileSidebar);
    document.addEventListener("click", onDocClick);

    var debounce;
    els.searchInput.addEventListener("input", function () {
      clearTimeout(debounce);
      var val = els.searchInput.value;
      els.search.classList.toggle("has-value", val.length > 0);
      debounce = setTimeout(function () { runSearch(val); }, 120);
    });
    els.searchInput.addEventListener("keydown", function (e) {
      if (e.key !== "Enter") return;
      var first = $(".result, .term-result", els.content);
      if (first) first.click();
    });
    els.searchClear.addEventListener("click", function () {
      resetSearch();
      renderActivePage();
      els.searchInput.focus();
    });

    document.addEventListener("keydown", function (e) {
      var tag = (e.target.tagName || "").toLowerCase();
      var typing = tag === "input" || tag === "textarea" || e.target.isContentEditable;
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        focusSearch();
      } else if (e.key === "Escape") {
        if (e.target === els.searchInput && els.searchInput.value) {
          resetSearch();
          renderActivePage();
        } else if (matchState.marks.length) {
          clearMatches();
        }
        closeMobileSidebar();
      } else if (e.key === "Enter" && e.target === document.body && matchState.marks.length) {
        e.preventDefault();
        goToMatch(matchState.index + (e.shiftKey ? -1 : 1), true);
      }
    });

    if (window.matchMedia) {
      var mq = window.matchMedia("(prefers-color-scheme: dark)");
      if (mq.addEventListener) mq.addEventListener("change", updateThemeIcon);
    }

    window.addEventListener("hashchange", onHashChange);
    onHashChange();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

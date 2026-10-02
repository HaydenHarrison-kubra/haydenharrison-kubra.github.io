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

  var state = { activeSlug: "overview", activeTags: [], query: "", exampleCount: 0 };
  var els = {};
  var tocObserver = null;
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
    return "h-" + s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function pageBySlug(slug) { return META.find(function (m) { return m.slug === slug; }); }
  function sectionBySlug(slug) { return SECTIONS.find(function (s) { return s.slug === slug; }); }
  function sectionFor(slug) {
    return SECTIONS.find(function (s) { return s.slug === slug || s.children.indexOf(slug) !== -1; });
  }
  function isRoute(slug) { return slug === "overview" || !!sectionBySlug(slug) || !!pageBySlug(slug); }
  function secStyle(sec) { return ' style="--c:' + sec.color + '"'; }

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
  }

  // ---------- Sidebar ----------
  function renderSidebar() {
    var html = '<a class="nav-home" href="#overview" data-route="overview">' + icon("home") + "<span>Overview</span></a>";
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

  function copyText(text, onDone) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onDone).catch(function () {});
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
    } catch (err) {}
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
  function buildToc(article, layout) {
    var tocEl = $(".toc", layout);
    var heads = $all(".content h2", article);
    if (tocObserver) { tocObserver.disconnect(); tocObserver = null; }
    if (heads.length < 2) {
      tocEl.remove();
      layout.classList.add("no-toc");
      return;
    }
    var used = {};
    var html = '<div class="toc-title">On this page</div>';
    heads.forEach(function (h) {
      var id = slugify(h.textContent);
      used[id] = (used[id] || 0) + 1;
      if (used[id] > 1) id += "-" + used[id];
      h.id = id;
      html += '<a href="#' + state.activeSlug + '" data-toc="' + id + '">' + esc(h.textContent) + "</a>";
    });
    tocEl.innerHTML = html;

    if (!("IntersectionObserver" in window)) return;
    tocObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) setActiveToc(en.target.id); });
    }, { rootMargin: "-80px 0px -70% 0px" });
    heads.forEach(function (h) { tocObserver.observe(h); });
    setActiveToc(heads[0].id);
  }

  function setActiveToc(id) {
    $all(".toc a", els.content).forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-toc") === id);
    });
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
      '<div class="eyebrow">KUBRA · Version 2.0</div>' +
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
      html += '<a class="quick-link" href="#' + slug + '" data-route="' + slug + '"' + secStyle(sec) + ">" +
        '<span><span class="eyebrow">' + esc(sec.name) + '</span><span class="ql-title">' + esc(page.title) + "</span></span>" +
        icon("arrowRight") + "</a>";
    });
    html += "</div></section>";

    els.content.innerHTML = html;
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
    enhanceContent($(".content", layout));
    buildToc($(".doc", layout), layout);
  }

  function renderActivePage() {
    var slug = state.activeSlug;
    syncSidebar();
    if (tocObserver) { tocObserver.disconnect(); tocObserver = null; }

    var sec = sectionBySlug(slug);
    var page = pageBySlug(slug);
    var parent = sectionFor(slug);
    if (sec) {
      renderSectionLanding(sec);
      enhanceContent(els.content);
    } else if (page && parent) {
      renderLeafPage(page, parent);
    } else {
      renderOverview();
    }

    var title = page ? page.title : sec ? sec.name : null;
    document.title = (title ? title + " · " : "") + "KUBRA Content Style Guide";
    window.scrollTo(0, 0);
  }

  // ---------- Routing ----------
  function go(slug) {
    resetSearch();
    closeMobileSidebar();
    if (window.location.hash.replace("#", "") === slug) renderActivePage();
    else window.location.hash = slug;
  }

  function onHashChange() {
    var slug = window.location.hash.replace("#", "") || "overview";
    state.activeSlug = isRoute(slug) ? slug : "overview";
    resetSearch();
    renderActivePage();
  }

  function onDocClick(e) {
    if (!e.target.closest) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    var route = e.target.closest("a[data-route]");
    if (route) {
      e.preventDefault();
      go(route.getAttribute("data-route"));
      return;
    }
    var toc = e.target.closest("a[data-toc]");
    if (toc) {
      e.preventDefault();
      var target = document.getElementById(toc.getAttribute("data-toc"));
      if (target) target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
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

  function runSearch(q) {
    state.query = q;
    els.search.classList.toggle("has-value", q.length > 0);
    if (!q.trim()) {
      state.query = "";
      renderActivePage();
      return;
    }
    if (tocObserver) { tocObserver.disconnect(); tocObserver = null; }
    var lower = q.trim().toLowerCase();
    var matches = META.filter(function (m) {
      return m._text.indexOf(lower) !== -1 && (state.activeTags.length === 0 || pageMatchesTags(m));
    });
    matches.sort(function (a, b) {
      return (a.title.toLowerCase().indexOf(lower) !== -1 ? 0 : 1) - (b.title.toLowerCase().indexOf(lower) !== -1 ? 0 : 1);
    });

    var html = '<header class="results-head"><div class="eyebrow">Search</div>';
    html += '<h1 class="page-title">' + matches.length + " result" + (matches.length === 1 ? "" : "s") + "</h1>";
    html += "<p>for “" + esc(q.trim()) + "”" + (state.activeTags.length ? " in " + esc(state.activeTags.join(", ")) : "") + "</p></header>";

    if (matches.length === 0) {
      html += '<div class="empty"><strong>No matching pages</strong>Try a different term' + (state.activeTags.length ? ", or clear the topic filters" : "") + ".</div>";
    } else {
      html += '<div class="results">';
      matches.forEach(function (m) {
        var sec = sectionFor(m.slug);
        html += '<a class="result" href="#' + m.slug + '" data-route="' + m.slug + '"' + (sec ? secStyle(sec) : "") + ">" +
          '<div class="eyebrow">' + (sec ? esc(sec.name) : "") + "</div>" +
          '<div class="result-title">' + esc(m.title) + "</div>" +
          '<div class="result-snippet">' + esc(snippet(getTemplateText(m.slug), lower)) + "</div></a>";
      });
      html += "</div>";
    }
    els.content.innerHTML = html;
    $all(".result-title, .result-snippet", els.content).forEach(function (el) { highlight(el, lower); });
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

    $all("[data-icon]").forEach(function (el) { el.innerHTML = icon(el.getAttribute("data-icon")); });
    var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    $("#searchKbd").textContent = isMac ? "⌘K" : "Ctrl K";

    updateThemeIcon();
    buildIndex();
    renderSidebar();
    renderTagFilters();

    els.themeBtn.addEventListener("click", toggleTheme);
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
        }
        closeMobileSidebar();
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

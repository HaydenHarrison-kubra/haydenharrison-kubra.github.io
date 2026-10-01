// KUBRA Style Guide 2.0 — interactive site logic
(function () {
  "use strict";

  var state = {
    activeSlug: "overview",
    activeTags: [],
    query: "",
  };

  var els = {};

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function getTemplateHTML(slug) {
    var tmpl = document.querySelector('template[data-page="' + slug + '"]');
    return tmpl ? tmpl.innerHTML : "";
  }

  function getTemplateText(slug) {
    var tmpl = document.querySelector('template[data-page="' + slug + '"]');
    if (!tmpl) return "";
    return (tmpl.content.textContent || "").replace(/\s+/g, " ").trim();
  }

  // ---------- Theme ----------
  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem("sg-theme"); } catch (e) {}
    if (saved === "dark" || saved === "light") {
      document.documentElement.setAttribute("data-theme", saved);
    }
    updateThemeIcon();
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute("data-theme");
    var isDark = current === "dark" || (!current && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
    var next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("sg-theme", next); } catch (e) {}
    updateThemeIcon();
  }

  function updateThemeIcon() {
    if (!els.themeBtn) return;
    var current = document.documentElement.getAttribute("data-theme");
    var isDark = current === "dark" || (!current && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
    els.themeBtn.textContent = isDark ? "☀" : "☾";
    els.themeBtn.title = isDark ? "Switch to light mode" : "Switch to dark mode";
  }

  // ---------- Index build ----------
  function buildSearchIndex() {
    META.forEach(function (m) {
      m._text = (m.title + " " + getTemplateText(m.slug)).toLowerCase();
    });
  }

  // ---------- Sidebar render ----------
  function renderSidebar() {
    var html = "";
    SECTIONS.forEach(function (sec) {
      html += '<div class="nav-section" data-section="' + sec.slug + '">';
      html += '<div class="nav-section-head" data-nav-section="' + sec.slug + '"><span>' + sec.icon + " " + sec.name + "</span><span class=\"caret\">▾</span></div>";
      html += '<div class="nav-children">';
      sec.children.forEach(function (slug) {
        var page = META.find(function (m) { return m.slug === slug; });
        if (!page) return;
        html += '<div class="nav-leaf" data-nav-leaf="' + slug + '">' + page.title + "</div>";
      });
      html += "</div></div>";
    });
    els.sidebarNav.innerHTML = html;

    $all("[data-nav-section]", els.sidebarNav).forEach(function (el) {
      el.addEventListener("click", function () {
        el.closest(".nav-section").classList.toggle("collapsed");
      });
    });
    $all("[data-nav-leaf]", els.sidebarNav).forEach(function (el) {
      el.addEventListener("click", function () {
        navigate(el.getAttribute("data-nav-leaf"));
        closeMobileSidebar();
      });
    });
  }

  function renderTagFilters() {
    var html = "";
    SECTIONS.forEach(function (sec) {
      html += '<span class="chip" data-tag="' + sec.slug + '">' + sec.icon + " " + sec.name + "</span>";
    });
    EXTRA_TAGS.forEach(function (tag) {
      html += '<span class="chip" data-tag="' + tag + '">' + tag + "</span>";
    });
    els.tagRow.innerHTML = html;
    $all("[data-tag]", els.tagRow).forEach(function (el) {
      el.addEventListener("click", function () {
        var tag = el.getAttribute("data-tag");
        var idx = state.activeTags.indexOf(tag);
        if (idx === -1) state.activeTags.push(tag);
        else state.activeTags.splice(idx, 1);
        applyTagFilters();
      });
    });
  }

  function applyTagFilters() {
    $all("[data-tag]", els.tagRow).forEach(function (el) {
      el.classList.toggle("active", state.activeTags.indexOf(el.getAttribute("data-tag")) !== -1);
    });
    els.clearTags.classList.toggle("show", state.activeTags.length > 0);

    if (state.activeTags.length === 0) {
      $all(".nav-section, .nav-leaf", els.sidebarNav).forEach(function (el) { el.classList.remove("dimmed"); });
      return;
    }

    SECTIONS.forEach(function (sec) {
      var sectionEl = $('.nav-section[data-section="' + sec.slug + '"]', els.sidebarNav);
      var anyVisible = false;
      sec.children.forEach(function (slug) {
        var page = META.find(function (m) { return m.slug === slug; });
        var leafEl = $('[data-nav-leaf="' + slug + '"]', sectionEl);
        var matches = page && page.tags.some(function (t) { return state.activeTags.indexOf(t) !== -1; });
        if (leafEl) leafEl.classList.toggle("dimmed", !matches);
        if (matches) anyVisible = true;
      });
      if (sectionEl) sectionEl.classList.toggle("dimmed", !anyVisible);
    });
  }

  function clearTagFilters() {
    state.activeTags = [];
    applyTagFilters();
  }

  // ---------- Copy buttons ----------
  function addCopyButtons(container) {
    var targets = $all(
      'td[style*="e3fcef"] li, td[style*="e3fcef"] > p, td[style*="ffebe6"] li, td[style*="ffebe6"] > p',
      container
    );
    targets.forEach(function (el) {
      if (!el.textContent || !el.textContent.trim()) return;
      if (el.querySelector(".copy-btn")) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.title = "Copy example text";
      btn.textContent = "⧉";
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var text = el.textContent.replace(/⧉|✓/g, "").trim();
        var done = function () {
          btn.textContent = "✓";
          btn.classList.add("copied");
          setTimeout(function () {
            btn.textContent = "⧉";
            btn.classList.remove("copied");
          }, 1100);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(function () {});
        } else {
          try {
            var ta = document.createElement("textarea");
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
            done();
          } catch (err) {}
        }
      });
      el.appendChild(btn);
    });
  }

  // ---------- Highlight ----------
  function highlight(container, query) {
    if (!query) return;
    var regex;
    try {
      regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "ig");
    } catch (e) {
      return;
    }
    var walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
    var nodes = [];
    var n;
    while ((n = walker.nextNode())) {
      if (n.parentNode && (n.parentNode.tagName === "SCRIPT" || n.parentNode.tagName === "STYLE")) continue;
      nodes.push(n);
    }
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
        if (regex.lastIndex === m.index) regex.lastIndex++;
      }
      frag.appendChild(document.createTextNode(node.nodeValue.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
  }

  // ---------- Page rendering ----------
  function sectionFor(slug) {
    return SECTIONS.find(function (sec) { return sec.slug === slug || sec.children.indexOf(slug) !== -1; });
  }

  function renderOverview() {
    var html = '<div class="breadcrumb">KUBRA Style Guide 2.0</div>';
    html += '<h1 class="page-title">📂 KUBRA Style Guide 2.0</h1>';
    html += '<div class="content">' + getTemplateHTML("overview") + "</div>";
    html += '<div class="card-grid">';
    SECTIONS.forEach(function (sec) {
      html += '<div class="card" data-goto="' + sec.slug + '"><h4>' + sec.icon + " " + sec.name + "</h4><p>" + sec.children.length + " page" + (sec.children.length === 1 ? "" : "s") + "</p></div>";
    });
    html += "</div>";
    els.content.innerHTML = html;
    bindCardNav();
  }

  function renderSectionLanding(sec) {
    var html = '<div class="breadcrumb"><a data-goto="overview" href="#overview">Style Guide 2.0</a> / ' + sec.name + "</div>";
    html += '<h1 class="page-title">' + sec.icon + " " + sec.name + "</h1>";
    html += '<div class="content">' + getTemplateHTML(sec.slug) + "</div>";
    html += '<div class="card-grid">';
    sec.children.forEach(function (slug) {
      var page = META.find(function (m) { return m.slug === slug; });
      if (!page) return;
      html += '<div class="card" data-goto="' + slug + '"><h4>' + page.title + "</h4><p>" + page.blurb + "</p></div>";
    });
    html += "</div>";
    els.content.innerHTML = html;
    bindCardNav();
  }

  function renderLeafPage(page, sec) {
    var idx = sec.children.indexOf(page.slug);
    var prevSlug = idx > 0 ? sec.children[idx - 1] : null;
    var nextSlug = idx < sec.children.length - 1 ? sec.children[idx + 1] : null;
    var prevPage = prevSlug && META.find(function (m) { return m.slug === prevSlug; });
    var nextPage = nextSlug && META.find(function (m) { return m.slug === nextSlug; });

    var html = '<div class="breadcrumb"><a data-goto="overview" href="#overview">Style Guide 2.0</a> / <a data-goto="' + sec.slug + '" href="#' + sec.slug + '">' + sec.name + "</a></div>";
    html += '<h1 class="page-title">' + page.title + "</h1>";
    html += '<div class="page-tags">';
    page.tags.forEach(function (t) {
      var label = SECTIONS.find(function (s) { return s.slug === t; });
      html += '<span class="chip">' + (label ? label.icon + " " + label.name : t) + "</span>";
    });
    html += "</div>";
    html += '<div class="content">' + getTemplateHTML(page.slug) + "</div>";

    html += '<div class="page-nav-footer">';
    html += prevPage
      ? '<a data-goto="' + prevPage.slug + '" href="#' + prevPage.slug + '"><span class="dir">← Previous</span>' + prevPage.title + "</a>"
      : "<span></span>";
    html += nextPage
      ? '<a data-goto="' + nextPage.slug + '" href="#' + nextPage.slug + '"><span class="dir">Next →</span>' + nextPage.title + "</a>"
      : "<span></span>";
    html += "</div>";

    els.content.innerHTML = html;
    addCopyButtons(els.content);
    bindCardNav();
  }

  function bindCardNav() {
    $all("[data-goto]", els.content).forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        navigate(el.getAttribute("data-goto"));
      });
    });
  }

  function renderActivePage() {
    var slug = state.activeSlug;
    $all(".nav-leaf", els.sidebarNav).forEach(function (el) {
      el.classList.toggle("active", el.getAttribute("data-nav-leaf") === slug);
    });

    if (slug === "overview") {
      renderOverview();
    } else {
      var sec = SECTIONS.find(function (s) { return s.slug === slug; });
      if (sec) {
        renderSectionLanding(sec);
      } else {
        var page = META.find(function (m) { return m.slug === slug; });
        var parentSec = sectionFor(slug);
        if (page && parentSec) {
          renderLeafPage(page, parentSec);
        } else {
          renderOverview();
        }
      }
    }

    if (state.query) highlight(els.content, state.query);
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  function navigate(slug) {
    state.activeSlug = slug;
    window.location.hash = slug;
  }

  // ---------- Search ----------
  function snippet(text, q) {
    var lower = text.toLowerCase();
    var i = lower.indexOf(q.toLowerCase());
    if (i === -1) return text.slice(0, 140) + "…";
    var start = Math.max(0, i - 60);
    var end = Math.min(text.length, i + q.length + 80);
    return (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
  }

  function runSearch(q) {
    state.query = q;
    els.searchClear.classList.toggle("show", q.length > 0);
    if (!q) {
      renderActivePage();
      return;
    }
    var lower = q.toLowerCase();
    var matches = META.filter(function (m) { return m._text.indexOf(lower) !== -1; });
    matches.sort(function (a, b) {
      var aTitle = a.title.toLowerCase().indexOf(lower) !== -1 ? 0 : 1;
      var bTitle = b.title.toLowerCase().indexOf(lower) !== -1 ? 0 : 1;
      return aTitle - bTitle;
    });
    if (state.activeTags.length > 0) {
      matches = matches.filter(function (m) { return m.tags.some(function (t) { return state.activeTags.indexOf(t) !== -1; }); });
    }

    var html = '<div class="breadcrumb">Search results for "' + q + '" — ' + matches.length + " match" + (matches.length === 1 ? "" : "es") + "</div>";
    html += '<h1 class="page-title">🔎 Search</h1>';
    if (matches.length === 0) {
      html += '<p class="no-results">No pages matched your search. Try a different term, or clear filters.</p>';
    } else {
      html += '<ul class="search-results-list">';
      matches.forEach(function (m) {
        var sec = sectionFor(m.slug);
        html += "<li>";
        html += '<div class="result-card" data-goto="' + m.slug + '">';
        html += '<div class="result-section">' + (sec ? sec.icon + " " + sec.name : "") + "</div>";
        html += '<div class="result-title">' + m.title + "</div>";
        html += '<div class="result-snippet">' + snippet(getTemplateText(m.slug), q) + "</div>";
        html += "</div></li>";
      });
      html += "</ul>";
    }
    els.content.innerHTML = html;
    $all("[data-goto]", els.content).forEach(function (el) {
      el.addEventListener("click", function () {
        els.searchInput.value = "";
        state.query = "";
        els.searchClear.classList.remove("show");
        navigate(el.getAttribute("data-goto"));
      });
    });
    highlight(els.content, q);
  }

  // ---------- Mobile sidebar ----------
  function closeMobileSidebar() {
    els.sidebar.classList.remove("open");
  }

  // ---------- Init ----------
  function onHashChange() {
    var slug = window.location.hash.replace("#", "") || "overview";
    state.activeSlug = slug;
    if (!state.query) renderActivePage();
    else {
      // keep search view but sync active highlight state
      renderActivePage();
    }
  }

  function init() {
    els.sidebar = $("#sidebar");
    els.sidebarNav = $("#sidebarNav");
    els.tagRow = $("#tagRow");
    els.clearTags = $("#clearTags");
    els.content = $("#content");
    els.searchInput = $("#searchInput");
    els.searchClear = $("#searchClear");
    els.themeBtn = $("#themeToggle");
    els.menuBtn = $("#menuToggle");

    initTheme();
    buildSearchIndex();
    renderSidebar();
    renderTagFilters();

    els.themeBtn.addEventListener("click", toggleTheme);
    els.clearTags.addEventListener("click", clearTagFilters);
    els.menuBtn.addEventListener("click", function () {
      els.sidebar.classList.toggle("open");
    });

    var debounceTimer;
    els.searchInput.addEventListener("input", function () {
      clearTimeout(debounceTimer);
      var val = els.searchInput.value;
      debounceTimer = setTimeout(function () { runSearch(val); }, 120);
    });
    els.searchClear.addEventListener("click", function () {
      els.searchInput.value = "";
      els.searchClear.classList.remove("show");
      state.query = "";
      renderActivePage();
      els.searchInput.focus();
    });

    window.addEventListener("hashchange", onHashChange);
    onHashChange();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

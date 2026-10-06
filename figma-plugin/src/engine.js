/* KUBRA Copy Audit rules engine. Runs in the plugin UI and in the Node tests (test/engine.test.mjs). */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.CopyAudit = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var SCHEMA = 1;
  var SEVERITY_RANK = { error: 0, warning: 1, suggestion: 2 };
  var WORD_CHAR = /[A-Za-z0-9]/;

  // ---------- helpers ----------
  function toRe(spec, addFlags) {
    var flags = spec.flags || "";
    (addFlags || "").split("").forEach(function (f) { if (f && flags.indexOf(f) === -1) flags += f; });
    return new RegExp(spec.source, flags);
  }
  function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  // Character-for-character, so offsets stay valid.
  function normQuotes(s) { return s.replace(/[“”„‟″]/g, '"').replace(/[‘’‚‛′]/g, "'"); }
  function collapse(s) { return s.replace(/\s+/g, " ").trim(); }
  function matchCase(original, replacement) {
    if (original.length > 1 && original === original.toUpperCase() && original !== original.toLowerCase()) return replacement.toUpperCase();
    if (/^[A-Z]/.test(original)) return replacement.charAt(0).toUpperCase() + replacement.slice(1);
    return replacement;
  }
  function expand(template, m) {
    return template.replace(/\$(\$|&|\d)/g, function (_, t) {
      if (t === "$") return "$";
      if (t === "&") return m[0];
      return m[+t] == null ? "" : m[+t];
    });
  }
  function tokenAround(text, start, end) {
    var s = start, e = end;
    while (s > 0 && !/\s/.test(text.charAt(s - 1))) s--;
    while (e < text.length && !/\s/.test(text.charAt(e))) e++;
    return text.slice(s, e);
  }
  function words(s) { return (s.toLowerCase().match(/[a-z0-9']+/g) || []); }
  function similarity(a, b) {
    var A = {}, B = {}, inter = 0, union = 0, k;
    words(a).forEach(function (w) { A[w] = true; });
    words(b).forEach(function (w) { B[w] = true; });
    for (k in A) { union++; if (B[k]) inter++; }
    for (k in B) if (!A[k]) union++;
    return union ? inter / union : 0;
  }
  function overlaps(a, b) { return a.start < b.end && a.end > b.start; }

  var FIXERS = {
    "time-ampm": function (m) { return m[1] + " " + m[2].toLowerCase() + ".m."; },
    "split-verb": function (m, data) { return m[1] + " " + matchCase(m[2], data.splitVerbs[m[2].toLowerCase()] || m[2]); },
    "match-case": function (m, data, spec) { return matchCase(m[0], spec.value); },
    "it-is": function (m) { return (m[1].charAt(0) === "I" ? "It’s " : "it’s ") + m[2]; },
    "you-are": function (m) { return (m[1].charAt(0) === "Y" ? "You’re " : "you’re ") + m[2]; },
    "lose": function (m) { return matchCase(m[1], "lose") + " " + m[2]; },
    "remove-hyphen": function (m) { return m[0].replace("-", ""); }
  };

  function fixFor(rule, m, c) {
    if (rule.fix == null) return null;
    if (typeof rule.fix === "string") return expand(rule.fix, m);
    var fn = FIXERS[rule.fix.fn];
    return fn ? fn(m, c.data, rule.fix) : null;
  }

  // ---------- proper nouns ----------
  function properNounRanges(text, c) {
    var ranges = [];
    c.properNouns.forEach(function (pn) {
      var i = text.indexOf(pn);
      while (i !== -1) {
        var r = { start: i, end: i + pn.length };
        if (!WORD_CHAR.test(text.charAt(i - 1)) && !WORD_CHAR.test(text.charAt(r.end)) && !ranges.some(function (x) { return overlaps(x, r); })) ranges.push(r);
        i = text.indexOf(pn, i + 1);
      }
    });
    return ranges;
  }
  // Puts proper nouns back in their official casing. Outside all-caps text, only distinctive names are restored
  // (multi-word, internal capitals, or symbols), since single words like "May" or "Discover" are often not names.
  function restoreProperNouns(text, c, distinctiveOnly) {
    var lower = text.toLowerCase();
    var out = text.split("");
    c.properNouns.forEach(function (pn) {
      if (distinctiveOnly && !/\s|[^A-Za-z]|.[A-Z]/.test(pn)) return;
      var needle = pn.toLowerCase();
      var i = lower.indexOf(needle);
      while (i !== -1) {
        if (!WORD_CHAR.test(lower.charAt(i - 1)) && !WORD_CHAR.test(lower.charAt(i + needle.length))) {
          for (var k = 0; k < pn.length; k++) out[i + k] = pn.charAt(k);
        }
        i = lower.indexOf(needle, i + 1);
      }
    });
    return out.join("");
  }

  // ---------- personal names ----------
  // People's names can't be listed, so treat capitalized words as names when they're addressed directly:
  // after a greeting ("Hi Dana", "Welcome, Joe Smith") or after a comma at the end of a phrase ("Thanks for paying, Joe").
  var GREETING = /^(hi|hello|hey|welcome|thanks|thank|dear|congratulations|congrats|morning|afternoon|evening|bye|goodbye)$/i;
  var NOT_NAMES = { a: 1, an: 1, the: 1, and: 1, or: 1, to: 1, of: 1, for: 1, in: 1, on: 1, at: 1, by: 1, with: 1, your: 1, our: 1, my: 1, back: 1, you: 1, we: 1, us: 1, all: 1, everyone: 1, again: 1, here: 1, there: 1 };
  function personalNames(text, list) {
    var names = {};
    var gap = function (i) { return text.slice(list[i - 1].start + list[i - 1].w.length, list[i].start); };
    var isName = function (w) { return /^[A-Z][a-z]+(?:['\u2019\-][A-Za-z]+)*$/.test(w) && !NOT_NAMES[w.toLowerCase()]; };
    function markRun(i) {
      var run = [];
      for (var j = i; j < list.length && isName(list[j].w); j++) {
        run.push(j);
        if (j + 1 >= list.length || !/^\s+$/.test(gap(j + 1))) break;
      }
      if (!run.length) return;
      var last = list[run[run.length - 1]];
      if (/^\s*($|[,.!?:;])/.test(text.slice(last.start + last.w.length))) run.forEach(function (k) { names[k] = true; });
    }
    for (var i = 1; i < list.length; i++) {
      var g = gap(i);
      if (/,\s*$/.test(g) || (/^[\s,]+$/.test(g) && GREETING.test(list[i - 1].w))) markRun(i);
    }
    return names;
  }

  // ---------- runners ----------
  var RUNNERS = {
    pattern: function (rule, text, item, c) {
      var out = [], re = rule.re, m;
      re.lastIndex = 0;
      while ((m = re.exec(text))) {
        if (m[0] === "") { re.lastIndex++; continue; }
        var start = m.index, end = start + m[0].length;
        if (rule.skipRe && rule.skipRe.test(tokenAround(text, start, end))) continue;
        out.push({ start: start, end: end, match: m[0], replacement: fixFor(rule, m, c) });
      }
      return out;
    },

    term: function (rule, text) {
      var out = [];
      var hay = rule.caseSensitive ? text : text.toLowerCase();
      // A banned variant inside the correct name (e.g. "Cash Payments" in "Retail Cash Payments") isn't a match.
      var correct = [];
      if (typeof rule.fix === "string" && rule.fix) {
        for (var p = text.indexOf(rule.fix); p !== -1; p = text.indexOf(rule.fix, p + 1)) correct.push({ start: p, end: p + rule.fix.length });
      }
      rule.terms.forEach(function (t) {
        var needle = rule.caseSensitive ? t : t.toLowerCase();
        var i = hay.indexOf(needle);
        while (i !== -1) {
          var end = i + needle.length;
          if (!WORD_CHAR.test(text.charAt(i - 1)) && !WORD_CHAR.test(text.charAt(end))) {
            var match = text.slice(i, end);
            var hit = { start: i, end: end };
            var skip = (rule.skipExact && match === rule.fix) || (rule.skipRe && rule.skipRe.test(tokenAround(text, i, end))) ||
              correct.some(function (r) { return r.start <= hit.start && r.end >= hit.end; });
            if (!skip) out.push({ start: i, end: end, match: match, replacement: rule.fix != null ? rule.fix : null });
          }
          i = hay.indexOf(needle, i + 1);
        }
      });
      return out;
    },

    "word-map": function (rule, text, item, c) {
      var out = [], re = c.misspellRe, m;
      if (!re) return out;
      re.lastIndex = 0;
      while ((m = re.exec(text))) {
        var right = c.data.misspellings[m[0].toLowerCase()];
        out.push({ start: m.index, end: m.index + m[0].length, match: m[0], replacement: matchCase(m[0], right), message: "Possible misspelling: “" + m[0] + "”" });
      }
      return out;
    },

    "word-count": function (rule, text) {
      var trimmed = text.trim();
      var n = trimmed ? trimmed.split(/\s+/).filter(function (w) { return /[A-Za-z0-9]/.test(w); }).length : 0;
      if (n <= rule.max) return [];
      var start = text.indexOf(trimmed);
      return [{ start: start, end: start + trimmed.length, match: trimmed, replacement: null, message: rule.message + " (" + n + " words)" }];
    },

    "sentence-case": function (rule, text, item, c) {
      var letters = text.replace(/[^A-Za-z]/g, "");
      if (letters.length < 2) return [];
      var allCaps = letters.length >= 4 && letters === letters.toUpperCase();
      var masks = allCaps ? [] : properNounRanges(text, c);
      var wordRe = /[A-Za-z][A-Za-z'’\-]*/g, m, list = [];
      while ((m = wordRe.exec(text))) list.push({ w: m[0], start: m.index });
      if (!list.length) return [];
      var names = allCaps ? {} : personalNames(text, list);
      var placeholders = [], pm, phRe = /\{\{[^}]*\}\}|\{[^}]*\}|\[[^\]]*\]|<[^>]*>|%[A-Za-z_]+%/g;
      while ((pm = phRe.exec(text))) placeholders.push({ start: pm.index, end: pm.index + pm[0].length });
      var out = text.split(""), changed = false;
      list.forEach(function (wd, wi) {
        if (names[wi]) return;
        if (masks.concat(placeholders).some(function (r) { return wd.start >= r.start && wd.start < r.end; })) return;
        var w = wd.w;
        var between = wi === 0 ? text.slice(0, wd.start) : text.slice(list[wi - 1].start + list[wi - 1].w.length, wd.start);
        var isStart = wi === 0 || /[.!?:\n]/.test(between);
        if (allCaps) {
          if (c.acronyms[w]) return;
          var lowered = w.toLowerCase();
          var fixed = isStart ? lowered.charAt(0).toUpperCase() + lowered.slice(1) : lowered;
          for (var k = 0; k < w.length; k++) out[wd.start + k] = fixed.charAt(k);
          if (fixed !== w) changed = true;
          return;
        }
        if (w.length > 1 && /^[A-Z0-9'’\-]+$/.test(w)) return; // acronym
        if (/[a-z][A-Z]/.test(w) || w === "I") return;          // CamelCase brand or pronoun
        if (isStart) {
          if (/^[a-z]/.test(w)) { out[wd.start] = w.charAt(0).toUpperCase(); changed = true; }
          return;
        }
        if (/^[A-Z][a-z]/.test(w)) { out[wd.start] = w.charAt(0).toLowerCase(); changed = true; }
      });
      if (!changed) return [];
      var result = out.join("");
      result = restoreProperNouns(result, c, !allCaps);
      if (result === text) return [];
      return [{ start: 0, end: text.length, match: text, replacement: result, message: allCaps ? "Don’t use all caps" : rule.message }];
    },

    "all-caps": function (rule, text, item, c) {
      var out = [];
      var runRe = /\b[A-Z][A-Z0-9'’&\-]*[A-Z0-9](?:[ \t]+[A-Z][A-Z0-9'’&\-]*[A-Z0-9])*\b/g, m;
      while ((m = runRe.exec(text))) {
        var parts = m[0].split(/[ \t]+/);
        var significant = parts.filter(function (w) { return !c.acronyms[w] && c.properNouns.indexOf(w) === -1 && /[A-Z]{2}/.test(w); });
        var flag = significant.length >= 2 || significant.some(function (w) { return w.replace(/[^A-Z]/g, "").length >= 4; });
        if (!flag) continue;
        var before = text.slice(0, m.index);
        var atStart = !before.trim() || /[.!?:]\s*$/.test(before);
        var fixed = parts.map(function (w) { return significant.indexOf(w) === -1 ? w : w.toLowerCase(); }).join(" ");
        if (atStart) fixed = fixed.charAt(0).toUpperCase() + fixed.slice(1);
        fixed = restoreProperNouns(fixed, c);
        var original = m[0];
        out.push({ start: m.index, end: m.index + original.length, match: original, replacement: original.indexOf("\t") === -1 && !/ {2}/.test(original) ? fixed : null });
      }
      return out;
    },

    format: function (rule, text, item, c) {
      var out = [];
      var linkish = (item.links || []).concat(item.linkStyled || []);
      var legal = (c.data.legalDocuments || []).map(function (d) { return d.toLowerCase(); });
      var ranges = rule.check === "underlineNotLink"
        ? (item.underline || []).filter(function (u) {
            if (linkish.some(function (l) { return overlaps(u, l); })) return false;
            var t = text.slice(u.start, u.end).toLowerCase();
            return !legal.some(function (d) { return t.indexOf(d) !== -1; }); // underlined legal names are styled as links
          })
        : (item[rule.check] || []);
      ranges.forEach(function (r) {
        var match = text.slice(r.start, r.end);
        if (match.trim()) out.push({ start: r.start, end: r.end, match: match, replacement: null });
      });
      return out;
    },

    "link-text": function (rule, text, item) {
      var out = [];
      (item.links || []).forEach(function (l) {
        var raw = text.slice(l.start, l.end);
        var t = raw.trim().toLowerCase();
        if (!t) return;
        var hit = false;
        if (rule.check === "vague") hit = rule.phrases.indexOf(t.replace(/[.!?,;:]+$/, "")) !== -1;
        else if (rule.check === "article") hit = /^(a|an|the|our)\s/.test(t);
        else if (rule.check === "punctuation") hit = /[.,;:!?]$/.test(t);
        if (hit) out.push({ start: l.start, end: l.end, match: raw, replacement: null });
      });
      return out;
    },

    // Names that must always be links (legal documents). Linked = a Figma hyperlink, a link text style, or an underline.
    "must-link": function (rule, text, item, c) {
      var out = [];
      var linked = [].concat(item.links || [], item.linkStyled || [], item.underline || []);
      var lower = text.toLowerCase();
      (c.data.legalDocuments || []).forEach(function (name) {
        var needle = name.toLowerCase();
        for (var i = lower.indexOf(needle); i !== -1; i = lower.indexOf(needle, i + 1)) {
          var r = { start: i, end: i + needle.length };
          if (WORD_CHAR.test(text.charAt(i - 1)) || WORD_CHAR.test(text.charAt(r.end))) continue;
          if (linked.some(function (l) { return l.start <= r.start && l.end >= r.end; })) continue;
          out.push({ start: r.start, end: r.end, match: text.slice(r.start, r.end), replacement: null, message: "Link “" + name + "”" });
        }
      });
      return out;
    },

    // US/Canada phone numbers in any common format -> (xxx) xxx-xxxx, or +1 (xxx) xxx-xxxx with a country code.
    phone: function (rule, text) {
      var out = [], re = /\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}/g, m;
      var phoneWords = /\b(call|phone|mobile|cell|text|sms|fax|contact|number)\b/i.test(text);
      while ((m = re.exec(text))) {
        var raw = m[0], start = m.index, end = start + raw.length;
        re.lastIndex = start + 1;
        if (/\d/.test(text.charAt(end))) continue;
        if (!/^(?:\(\d{3}\) ?|\d{3}[-. ]?)\d{3}[-. ]?\d{4}$/.test(raw)) continue; // unbalanced parentheses
        var before = text.slice(0, start);
        var cc = /(\+ ?1|1)([-. ]?)$/.exec(before);
        if (cc && cc[1] === "1" && /[\d+]/.test(before.charAt(cc.index - 1))) cc = null; // a "1" that's part of another number
        if (!cc && /\d/.test(before.slice(-1))) continue;
        var d = raw.replace(/\D/g, "");
        var bare = d === raw && (!cc || (cc[1] === "1" && !cc[2]));
        if (bare && !phoneWords) continue;                                          // bare digits could be an account number
        var from = cc ? cc.index : start;
        var fixed = (cc ? "+1 " : "") + "(" + d.slice(0, 3) + ") " + d.slice(3, 6) + "-" + d.slice(6);
        var match = text.slice(from, end);
        if (fixed !== match) out.push({ start: from, end: end, match: match, replacement: fixed });
        re.lastIndex = end;
      }
      return out;
    },

    "card-number": function (rule, text) {
      var out = [], re = /\d(?:[ -]?\d){12,18}/g, m;
      while ((m = re.exec(text))) {
        var end = m.index + m[0].length;
        if (/\d/.test(text.charAt(m.index - 1)) || /\d/.test(text.charAt(end))) continue;
        var digits = m[0].replace(/\D/g, "");
        var grouped = /^\d{4}([ -])\d{4}\1\d{4}\1\d{3,4}$/.test(m[0]);
        if (grouped || luhn(digits)) out.push({ start: m.index, end: end, match: m[0], replacement: null });
      }
      return out;
    },

    "a-an": function (rule, text, item, c) {
      var out = [], re = /\b(a|an)(\s+)([A-Za-z][\w'’\-]*)/gi, m;
      while ((m = re.exec(text))) {
        var art = m[1], next = m[3];
        if (art === "A") {
          var before = text.slice(0, m.index).trim();
          if (before && !/[.!?:]$/.test(before)) continue; // a capital "A" mid-sentence is probably a label, like "Plan A"
        }
        var wantAn = needsAn(next, c.data);
        if (wantAn === null || wantAn === (art.length === 2)) continue;
        var correct = wantAn ? "an" : "a";
        var fixed = art.charAt(0) === art.charAt(0).toUpperCase() ? correct.charAt(0).toUpperCase() + correct.slice(1) : correct;
        out.push({ start: m.index, end: m.index + art.length, match: art, replacement: fixed, message: "Use “" + correct + "” before “" + next + "”" });
      }
      return out;
    },

    "sentence-start": function (rule, text, item, c) {
      var out = [], re = /([.!?])(\s+)([a-z])/g, m;
      while ((m = re.exec(text))) {
        var token = (text.slice(0, m.index).match(/(\S+)$/) || ["", ""])[1].toLowerCase().replace(/^[("“‘']+/, "");
        if (m[1] === "." && (c.abbreviations[token] || /\.$/.test(token) || /^[a-z]$/.test(token) || /\.[a-z]$/.test(token))) continue;
        var pos = m.index + m[1].length + m[2].length;
        out.push({ start: pos, end: pos + 1, match: m[3], replacement: m[3].toUpperCase() });
      }
      return out;
    },

    balance: function (rule, text) {
      var out = [], stack = [];
      for (var i = 0; i < text.length; i++) {
        var ch = text.charAt(i);
        if (ch === "(" || ch === "“") stack.push({ ch: ch, i: i });
        else if (ch === ")" || ch === "”") {
          var want = ch === ")" ? "(" : "“";
          if (stack.length && stack[stack.length - 1].ch === want) stack.pop();
          else out.push({ start: i, end: i + 1, match: ch, replacement: null });
        }
      }
      stack.forEach(function (s) { out.push({ start: s.i, end: s.i + 1, match: s.ch, replacement: null }); });
      return out.slice(0, 1);
    },

    "curly-quotes": function (rule, text) {
      var first = -1, last = -1, out = text.split("");
      for (var i = 0; i < text.length; i++) {
        var ch = text.charAt(i);
        if (ch !== "'" && ch !== '"') continue;
        var prev = i === 0 ? " " : text.charAt(i - 1), next = text.charAt(i + 1) || " ";
        var rep;
        if (ch === '"') rep = /[\s(\[{—–\-]/.test(prev) ? "“" : "”";
        else if (WORD_CHAR.test(prev)) rep = "’";
        else if (/\d/.test(next)) rep = "’";             // ’90s
        else if (/[\s(\[{“"]/.test(prev)) rep = "‘";
        else rep = "’";
        out[i] = rep;
        if (first === -1) first = i;
        last = i;
      }
      if (first === -1) return [];
      return [{ start: first, end: last + 1, match: text.slice(first, last + 1), replacement: out.slice(first, last + 1).join("") }];
    },

    "contractions-mixed": function (rule, text, item, c) {
      var norm = normQuotes(text).toLowerCase(), contracted = null, expanded = null;
      c.data.contractions.forEach(function (pair) {
        if (!contracted && new RegExp("\\b" + escapeRe(pair[0]) + "(?![\\w'])").test(norm)) contracted = pair[0];
        if (!expanded) {
          var mm = new RegExp("\\b" + escapeRe(pair[1]) + "\\b").exec(norm);
          if (mm) expanded = { form: pair[1], index: mm.index };
        }
      });
      if (!contracted || !expanded) return [];
      return [{ start: expanded.index, end: expanded.index + expanded.form.length, match: text.substr(expanded.index, expanded.form.length), replacement: null,
        detail: "This layer also uses “" + contracted.replace("'", "’") + ".” Pick one style per surface." }];
    },

    "single-sentence-period": function (rule, text, item, c) {
      var t = text.replace(/\s+$/, "");
      if (t.slice(-1) !== "." || t.slice(-2) === "..") return [];
      var body = t.slice(0, -1);
      if (/[.!?](\s|$)/.test(body)) return [];
      var lastToken = (body.match(/(\S+)$/) || ["", ""])[1].toLowerCase();
      if (c.abbreviations[lastToken] || /\.[a-z]$/.test(lastToken)) return [];
      return [{ start: t.length - 1, end: t.length, match: ".", replacement: "" }];
    }
  };

  function luhn(digits) {
    if (digits.length < 13 || digits.length > 19) return false;
    var sum = 0, dbl = false;
    for (var i = digits.length - 1; i >= 0; i--) {
      var d = +digits.charAt(i);
      if (dbl) { d *= 2; if (d > 9) d -= 9; }
      sum += d;
      dbl = !dbl;
    }
    return sum % 10 === 0;
  }

  function needsAn(word, data) {
    if (/^[A-Z][A-Z0-9]*$/.test(word) && word !== "I") return "AEFHILMNORSX".indexOf(word.charAt(0)) !== -1; // read as letters
    var w = word.toLowerCase();
    var i;
    for (i = 0; i < data.anPrefixes.length; i++) if (w.indexOf(data.anPrefixes[i]) === 0) return true;
    for (i = 0; i < data.aPrefixes.length; i++) if (w.indexOf(data.aPrefixes[i]) === 0) return false;
    if (/^[aeiou]/.test(w)) return true;
    if (/^[a-z]/.test(w)) return false;
    return null;
  }

  // ---------- standard copy ----------
  function compileSnippet(s) {
    var keys = Object.keys(s.placeholders || {}).sort(function (a, b) { return b.length - a.length; });
    var parts = [{ lit: s.text }];
    keys.forEach(function (k) {
      var next = [];
      parts.forEach(function (p) {
        if (p.lit == null) { next.push(p); return; }
        var pieces = p.lit.split(k);
        pieces.forEach(function (piece, i) {
          if (piece) next.push({ lit: piece });
          if (i < pieces.length - 1) next.push({ ph: k });
        });
      });
      parts = next;
    });
    var source = parts.map(function (p) { return p.ph ? "([\\s\\S]+?)" : escapeRe(normQuotes(p.lit)).replace(/\s+/g, "\\s+"); }).join("");
    return { id: s.id, title: s.title, category: s.category, text: s.text, parts: parts, re: new RegExp(source, "g"), hasPlaceholders: keys.length > 0, guide: s.guide };
  }

  function findApproved(c, text) {
    var norm = normQuotes(text), ranges = [], issues = [], matched = {};
    c.snippets.forEach(function (sn) {
      var m;
      sn.re.lastIndex = 0;
      while ((m = sn.re.exec(norm))) {
        if (!m[0]) { sn.re.lastIndex++; continue; }
        var start = m.index, end = start + m[0].length, k = 1;
        ranges.push({ start: start, end: end });
        matched[sn.category] = true;
        var approved = sn.parts.map(function (p) { return p.ph ? m[k++] : p.lit; }).join("");
        var raw = text.slice(start, end);
        if (collapse(raw) !== collapse(approved)) {
          issues.push({ ruleId: "standard-copy-punctuation", category: "compliance", severity: "warning", start: start, end: end, match: raw, replacement: approved, safeFix: true,
            message: "Match the approved punctuation",
            detail: "This is “" + sn.title + ".” Its quotation marks or apostrophes differ from the approved text.", guide: sn.guide });
        }
      }
    });
    var lower = norm.toLowerCase();
    Object.keys(c.copyChecks).forEach(function (cat) {
      if (matched[cat]) return;
      var chk = c.copyChecks[cat];
      if (!chk.anchors.some(function (a) { return lower.indexOf(a) !== -1; })) return;
      var best = null, bestScore = -1;
      c.snippets.forEach(function (sn) {
        if (sn.category !== cat) return;
        var score = similarity(text, sn.text);
        if (score > bestScore) { best = sn; bestScore = score; }
      });
      if (!best) return;
      var catInfo = (c.data.standardCopyCategories || {})[cat];
      issues.push({ ruleId: "standard-copy-" + cat, category: "compliance", severity: chk.severity, start: 0, end: text.length, match: text,
        replacement: best.hasPlaceholders || chk.autoFix === false ? null : best.text, approvedText: best.text,
        message: chk.message,
        detail: (chk.detail ? chk.detail + " " : "") + "Closest approved version: “" + best.title + ".”" +
          (chk.detail ? "" : " Use the version for this product and program word for word" + (best.hasPlaceholders ? ", replacing only the placeholders." : ".")),
        guide: catInfo ? catInfo.guide : best.guide });
    });
    return { ranges: ranges, issues: issues };
  }

  // ---------- public API ----------
  function compile(rules) {
    if (!rules || rules.schema !== SCHEMA) throw new Error("These rules need a newer version of the plugin.");
    var data = rules.data || {};
    var c = { version: rules.version, updated: rules.updated, siteUrl: rules.siteUrl, data: data, rules: [] };
    rules.rules.forEach(function (r) {
      var x = Object.assign({}, r);
      if (r.pattern) x.re = toRe(r.pattern, "g");
      if (r.skipInToken) x.skipRe = toRe(r.skipInToken);
      if (!RUNNERS[x.type || "pattern"]) return; // unknown check from a newer rules file: skip it
      c.rules.push(x);
    });
    var miss = Object.keys(data.misspellings || {});
    c.misspellRe = miss.length ? new RegExp("\\b(?:" + miss.map(escapeRe).join("|") + ")\\b", "gi") : null;
    c.properNouns = (data.properNouns || []).slice().sort(function (a, b) { return b.length - a.length; });
    c.acronyms = {};
    (data.acronyms || []).forEach(function (a) { c.acronyms[a] = true; });
    c.abbreviations = {};
    (data.abbreviations || []).forEach(function (a) { c.abbreviations[a.toLowerCase()] = true; });
    c.snippets = (data.standardCopy || []).map(compileSnippet);
    c.copyChecks = data.standardCopyChecks || {};
    return c;
  }

  // A context with a parent (text-button -> button) gets its parent's rules unless a rule excludes it.
  function appliesTo(rule, ctx, parent) {
    var inc = rule.contexts, exc = rule.exceptContexts || [];
    if (exc.indexOf(ctx) !== -1 || (parent && exc.indexOf(parent) !== -1)) return false;
    if (inc && inc !== "any" && inc.indexOf(ctx) === -1 && !(parent && inc.indexOf(parent) !== -1)) return false;
    return true;
  }

  // Icon-font text (like "chevron-up") is blanked out with spaces so it can't trigger rules; offsets stay the same.
  var MASK = " ";
  function maskRanges(text, ranges) {
    var out = text.split("");
    ranges.forEach(function (r) { for (var i = r.start; i < r.end && i < out.length; i++) out[i] = MASK; });
    return out.join("");
  }
  // Maps an issue found in masked text back onto the real text, or drops it if it only concerns icons.
  function unmask(issue, original, skip) {
    if (!skip.some(function (r) { return overlaps(issue, r); })) return issue;
    if (skip.some(function (r) { return r.start <= issue.start && r.end >= issue.end; })) return null;
    var match = original.slice(issue.start, issue.end);
    if (issue.replacement != null) {
      if (issue.replacement.length !== issue.match.length) return null;
      var rep = issue.replacement.split("");
      for (var k = issue.start; k < issue.end; k++) {
        if (skip.some(function (r) { return k >= r.start && k < r.end; })) rep[k - issue.start] = original.charAt(k);
      }
      issue.replacement = rep.join("");
    }
    issue.match = match;
    return issue;
  }

  function check(c, item, opts) {
    var cats = (opts && opts.categories) || {};
    var original = item.text || "";
    var skip = item.skip || [];
    var text = skip.length ? maskRanges(original, skip) : original;
    if (!text.trim()) return [];
    var ctx = item.context || "body";
    var parentCtx = item.contextParent || null;
    var approved = findApproved(c, text);
    var found = cats.compliance === false ? [] : approved.issues.slice();

    c.rules.forEach(function (rule) {
      if (cats[rule.category] === false || !appliesTo(rule, ctx, parentCtx)) return;
      RUNNERS[rule.type || "pattern"](rule, text, item, c).forEach(function (h) {
        if (rule.exemptApproved !== false && approved.ranges.some(function (r) { return overlaps(h, r); })) return;
        if (h.replacement != null && h.replacement === h.match) return;
        found.push({
          ruleId: rule.id, category: rule.category, severity: rule.severity,
          message: h.message || rule.message, detail: h.detail || rule.detail || "",
          start: h.start, end: h.end, match: h.match,
          replacement: h.replacement == null ? null : h.replacement,
          safeFix: !!rule.safeFix && h.replacement != null,
          standalone: !!rule.standalone,
          guide: (rule.guideByContext && (rule.guideByContext[ctx] || rule.guideByContext[parentCtx])) || rule.guide || null
        });
      });
    });
    if (skip.length) found = found.map(function (i) { return unmask(i, original, skip); }).filter(Boolean);

    // Keep the most severe issue per exact range (preferring one with a fix), then attach ignore state.
    found.sort(function (a, b) {
      return SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] || (a.replacement == null) - (b.replacement == null) || a.start - b.start;
    });
    var seen = {}, ignored = item.ignored || [];
    var result = found.filter(function (i) {
      var k = i.start + ":" + i.end + (i.standalone ? ":" + i.ruleId : "");
      if (seen[k]) return false;
      seen[k] = true;
      return true;
    });
    result.forEach(function (i) {
      i.key = i.ruleId + "|" + i.match;
      i.ignored = ignored.indexOf(i.key) !== -1;
    });
    result.sort(function (a, b) { return a.start - b.start || SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]; });
    return result;
  }

  return { SCHEMA: SCHEMA, compile: compile, check: check, runnerTypes: Object.keys(RUNNERS), fixerNames: Object.keys(FIXERS) };
});

// General grammar, spelling, and typography checks. Runs entirely inside the plugin.
// Same rule fields as style-guide.mjs. Typography follows the Chicago Manual of Style (curly quotes and apostrophes).

export default [
  {
    id: "misspelling", type: "word-map", severity: "warning", safeFix: true,
    message: "Possible misspelling"
  },
  {
    id: "repeated-word", severity: "warning",
    pattern: /\b(\w+)\s+\1\b/gi, fix: "$1", safeFix: true,
    message: "Repeated word"
  },
  {
    id: "a-an", type: "a-an", severity: "warning",
    message: "Check “a” vs. “an”"
  },
  {
    id: "sentence-start", type: "sentence-start", severity: "warning", safeFix: true,
    message: "Capitalize the first word of a sentence"
  },
  {
    id: "double-space", severity: "suggestion",
    pattern: /(\S)( {2,})(?=\S)/g, fix: "$1 ", safeFix: true,
    message: "Extra space"
  },
  {
    id: "space-before-punctuation", severity: "warning",
    pattern: /(\w)\s+([,;:!?]|\.(?!\d))(?=\s|$)/g, fix: "$1$2", safeFix: true,
    message: "Remove the space before punctuation"
  },
  {
    id: "missing-space-comma", severity: "warning",
    pattern: /([A-Za-z])([,;])([A-Za-z])/g, fix: "$1$2 $3", safeFix: true,
    message: "Add a space after punctuation"
  },
  {
    id: "missing-space-sentence", severity: "warning",
    pattern: /([a-z]{2})([.!?])([A-Z][a-z])/g, fix: "$1$2 $3", safeFix: true,
    message: "Add a space between sentences"
  },
  {
    id: "doubled-punctuation", severity: "warning",
    pattern: /([!?,;:])\1+/g, fix: "$1", safeFix: true,
    message: "Doubled punctuation"
  },
  {
    id: "double-period", severity: "warning",
    pattern: /(^|[^.])\.\.(?!\.)/g, fix: "$1.", safeFix: true,
    message: "Doubled period"
  },
  {
    id: "lowercase-i", severity: "warning",
    pattern: /(^|[\s(“"‘'])i(?=[\s,!?;:’']|$)/g, fix: "$1I", safeFix: true,
    message: "Capitalize “I”"
  },
  {
    id: "unbalanced", type: "balance", severity: "suggestion",
    message: "Unmatched parenthesis or quotation mark"
  },
  {
    id: "curly-quotes", type: "curly-quotes", severity: "suggestion", safeFix: true,
    message: "Use curly quotes and apostrophes",
    detail: "Chicago style uses curly (“smart”) quotes and apostrophes, not straight ones. The style guide also says to avoid quotation marks in UI copy where you can."
  },

  // Commonly confused words
  {
    id: "could-of", severity: "warning",
    pattern: /\b(could|should|would|must|might) of\b/gi, fix: "$1 have", safeFix: true,
    message: "Use “have,” not “of”"
  },
  {
    id: "its-own", severity: "warning",
    pattern: /\bit['’]s own\b/gi, fix: { fn: "match-case", value: "its own" }, safeFix: true,
    message: "Use “its” (possessive)"
  },
  {
    id: "its-contraction", severity: "warning",
    pattern: /\b(its) (a|an|the|not|been|going|time|important|easy|ready|now|possible|available)\b/gi, fix: { fn: "it-is" },
    message: "Use “it’s” (it is)"
  },
  {
    id: "your-youre", severity: "warning",
    pattern: /\b(your) (welcome|going|not|being|doing|all set)\b/gi, fix: { fn: "you-are" },
    message: "Use “you’re” (you are)"
  },
  {
    id: "then-than", severity: "warning",
    pattern: /\b(more|less|better|greater|fewer|rather|other|higher|lower|larger|smaller|earlier|later|older|newer|faster|slower|sooner|easier|quicker|cheaper|bigger) then\b/gi, fix: "$1 than", safeFix: true,
    message: "Use “than” for comparisons"
  },
  {
    id: "lose-loose", severity: "warning",
    pattern: /\b(loose) (your|my|access|data|money|progress|changes)\b/gi, fix: { fn: "lose" },
    message: "Use “lose” (to misplace)"
  },
  {
    id: "split-verb", severity: "warning",
    pattern: /\b(to|will|can|please|must|you can|you['’]ll|easily|quickly) (setup|login|logout|signup|signin|checkout|backup|lookup)\b/gi, fix: { fn: "split-verb" }, safeFix: true,
    message: "Use two words for the verb",
    detail: "“Set up your account” (verb) vs. “the setup” (noun)."
  },
  {
    id: "login-to", severity: "warning",
    pattern: /\blogin to\b/gi, fix: { fn: "match-case", value: "log in to" }, safeFix: true,
    message: "Use “log in” as a verb"
  },
  {
    id: "e-mail", severity: "suggestion",
    pattern: /\be-mail(?:s|ed|ing)?\b/gi, fix: { fn: "remove-hyphen" }, safeFix: true,
    message: "Write “email” without a hyphen"
  }
];

// Hard rules from the KUBRA Content Style Guide. Each rule links to the guideline it enforces:
// guide: [page slug, exact heading text on that page]. The build fails if a heading doesn't exist.
//
// Rule fields
//   id, severity ("error" | "warning" | "suggestion"), message, detail
//   contexts: list of context ids (see config/contexts.json) or "any" (default); exceptContexts: list
//   type: "pattern" (default, uses `pattern`) or a special check implemented in src/engine.js
//   fix: replacement template ("$1", "$&") or { fn: "<fixer>", value } — omit when there's no safe automatic fix
//   safeFix: true if the fix can be applied in bulk ("Fix all safe")

const SENTENCE_CASE_CONTEXTS = ["button", "heading", "label", "menu", "toggle", "checkbox", "tab"];
const MESSAGE_CONTEXTS = ["error", "success", "banner", "tooltip", "modal"];
// Carrier SMS keywords. Quoting them (Reply “STOP”) is required in SMS compliance language.
const SMS_KEYWORDS = "STOP|HELP|START|UNSTOP|CANCEL|END|QUIT|UNSUBSCRIBE|STOPALL|INFO|YES";

export default [
  // ---------- Buttons ----------
  {
    id: "button-click", severity: "error", contexts: ["button"],
    pattern: /\bclick(?:s|ed|ing)?\b/gi,
    message: "Don’t use “click” in buttons",
    detail: "Users may be on mobile or assistive tech, and the button already implies the interaction.",
    guide: ["buttons-and-ctas", 'Avoid the Word "Click"']
  },
  {
    id: "button-generic", severity: "warning", contexts: ["button"],
    pattern: /^\s*(?:Submit|Continue|OK|Okay|Done|Proceed|Go|Confirm)\s*$/gi,
    message: "Generic button label",
    detail: "Name the action and its object, like “Pay bill” or “Save changes.”",
    guide: ["buttons-and-ctas", "Use Clear, Action-Oriented Language"]
  },
  {
    id: "button-yes-no", severity: "warning", contexts: ["button"],
    pattern: /^\s*(?:Yes|No)\s*$/gi,
    message: "Avoid “Yes” and “No” buttons",
    detail: "They’re ambiguous out of context. Use explicit labels like “Confirm payment” and “Cancel payment.”",
    guide: ["buttons-and-ctas", 'Avoid "Yes" and "No" Buttons']
  },
  {
    id: "button-missing-object", severity: "warning", contexts: ["button"],
    pattern: /^\s*(?:Delete|Remove|Disable|Deactivate)\s*$/gi,
    message: "Say what will be deleted or removed",
    detail: "Destructive buttons must include the object, like “Delete payment method.”",
    guide: ["buttons-and-ctas", "Destructive or Irreversible Actions"]
  },
  {
    id: "button-length", type: "word-count", max: 3, severity: "warning", contexts: ["button"], exceptContexts: ["text-button"],
    message: "Button label is longer than 3 words",
    detail: "Buttons with a background or border: aim for 1–2 words, 3 at most. Text-only buttons can use up to 5.",
    guide: ["buttons-and-ctas", "Keep Button Text Concise"]
  },
  {
    id: "text-button-length", type: "word-count", max: 5, severity: "warning", contexts: ["text-button"],
    message: "Text-only button label is longer than 5 words",
    detail: "Text-only buttons can use up to 5 words when needed for clarity.",
    guide: ["buttons-and-ctas", "Keep Button Text Concise"]
  },
  {
    id: "button-punctuation", severity: "warning", contexts: ["button"],
    pattern: /[.!:;]+(?=\s*$)/g, fix: "", safeFix: true,
    message: "Remove punctuation from button labels",
    guide: ["buttons-and-ctas", "Keep Button Text Concise"]
  },
  {
    id: "empty-state-cta", severity: "warning", contexts: ["button", "link"],
    pattern: /^\s*(?:Get started now!?|Learn more)\s*$/gi,
    message: "Vague call to action",
    detail: "Use a short, action-driven label that says what happens next.",
    guide: ["empty-states", "CTAs in Empty States"]
  },

  // ---------- Capitalization ----------
  {
    id: "sentence-case", type: "sentence-case", severity: "warning", contexts: SENTENCE_CASE_CONTEXTS,
    message: "Use sentence case",
    detail: "Capitalize only the first word and proper nouns. Check that any product names or proper nouns in the suggestion are still capitalized.",
    guide: ["titles-and-headings", "Capitalization"],
    guideByContext: {
      button: ["buttons-and-ctas", "Use Sentence Case"],
      label: ["forms", "Field Labels"],
      menu: ["menus", "Field Label"]
    }
  },
  {
    id: "all-caps", type: "all-caps", severity: "warning",
    message: "Don’t use all caps",
    detail: "All caps reads as shouting and is announced awkwardly by screen readers. Acronyms are fine.",
    guide: ["formatting", "All Caps"]
  },
  {
    id: "text-case-upper", type: "format", check: "upper", severity: "warning",
    message: "Text is set to uppercase in Figma",
    detail: "The text style or Type settings use the Uppercase (or small caps) option. Use normal capitalization instead.",
    guide: ["formatting", "All Caps"]
  },
  {
    id: "text-case-title", type: "format", check: "titleCase", severity: "warning", contexts: SENTENCE_CASE_CONTEXTS,
    message: "Text is set to Title Case in Figma",
    detail: "The text style or Type settings use the Title Case option. Turn it off and write in sentence case.",
    guide: ["titles-and-headings", "Capitalization"]
  },

  // ---------- Headings ----------
  {
    id: "heading-punctuation", severity: "warning", contexts: ["heading"],
    pattern: /[.!:;]+(?=\s*$)/g, fix: "", safeFix: true,
    message: "Don’t end headings with punctuation",
    detail: "Question marks are the only exception.",
    guide: ["titles-and-headings", "Punctuation"]
  },

  // ---------- Links ----------
  {
    id: "link-vague", type: "link-text", check: "vague", severity: "warning",
    phrases: ["click here", "here", "click", "learn more", "read more", "more", "this link", "link", "details", "more info", "more information"],
    message: "Link text doesn’t describe the destination",
    detail: "Avoid “click here,” “learn more,” and “here.” Say where the link goes, like “View payment history.”",
    guide: ["hyperlinks", "Link Text"]
  },
  {
    id: "link-article", type: "link-text", check: "article", severity: "suggestion",
    message: "Don’t start link text with “a,” “an,” “the,” or “our”",
    guide: ["hyperlinks", "Articles and Formatting"]
  },
  {
    id: "link-punctuation", type: "link-text", check: "punctuation", severity: "suggestion",
    message: "Keep punctuation out of link text",
    detail: "Unless it’s part of an official title.",
    guide: ["hyperlinks", "Articles and Formatting"]
  },
  {
    id: "click-here", severity: "warning", exceptContexts: ["button"],
    pattern: /\bclick here\b/gi,
    message: "Avoid “click here”",
    detail: "It’s meaningless out of context. Describe the destination or action instead.",
    guide: ["hyperlinks", "Link Text"]
  },

  // ---------- Formatting ----------
  {
    id: "underline-not-link", type: "format", check: "underlineNotLink", severity: "warning",
    message: "Underline is only for links",
    detail: "Underlined text that isn’t a link looks broken. Use bold for emphasis instead.",
    guide: ["formatting", "Underline"]
  },
  {
    id: "italic-in-error", type: "format", check: "italic", severity: "warning", contexts: ["error", "banner"],
    message: "Don’t use italics in error messages",
    detail: "Italics reduce readability and aren’t used in error, legal, or PCI content.",
    guide: ["formatting", "Italics"]
  },

  // ---------- Special characters ----------
  {
    id: "slash", severity: "warning",
    pattern: /[A-Za-z]\s?\/\s?[A-Za-z]/g, skipInToken: /(?:https?:|www\.|\.[a-z]{2,}\/)|^\(?[MDY]{1,4}(?:\/[MDY]{1,4})+/i,
    message: "Avoid slashes",
    detail: "Slashes are hard for screen readers. Use “or” or “and” instead, like “Enable or disable.” Dates are fine.",
    guide: ["special-characters", "Slashes ( / )"]
  },
  {
    id: "ampersand", severity: "warning",
    pattern: /\s&\s/g, fix: " and ", safeFix: true,
    message: "Use “and” instead of “&”",
    detail: "Ampersands are only for official names, like OG&E.",
    guide: ["special-characters", "Ampersands ( & )"]
  },
  {
    id: "quotation-marks", severity: "suggestion",
    pattern: new RegExp(`["“](?!(?:${SMS_KEYWORDS})["”])[^"“”\\n]+["”]`, "g"),
    message: "Avoid quotation marks in UI copy",
    detail: "They can confuse screen readers. If a quote is required, use curly quotes. Approved copy and quoted SMS keywords, like “STOP” and “HELP,” are fine.",
    guide: ["special-characters", 'Quotation Marks ( " " )']
  },
  {
    id: "em-dash", severity: "suggestion",
    pattern: /\s?—\s?|\s–\s/g,
    message: "Avoid dashes in UI copy",
    detail: "Use a period or comma instead. En dashes in number ranges, like “1–2,” are fine.",
    guide: ["special-characters", "Hyphens and Dashes"]
  },
  {
    id: "label-parentheses", severity: "suggestion", contexts: ["label", "menu", "toggle", "checkbox"],
    pattern: /\((?!(?:s|es)\))(?!\d{3}\) \d{3}-\d{4})[^)]*\)/g,
    message: "Avoid parentheses in UI labels",
    detail: "Phone area codes, like (480) 111-1111, are fine.",
    guide: ["special-characters", "Parentheses ( )"]
  },
  {
    id: "parenthetical-plural", severity: "warning",
    contexts: ["heading", "menu", "button", "table-header", "error", "success", "banner", "tab", "modal", "tooltip"],
    pattern: /\b([A-Za-z]+)\((s|es)\)/g, fix: "$1$2", safeFix: true,
    message: "Use the plural form instead of “(s)”",
    detail: "Parenthetical plurals are only for input instructions, like “Upload file(s).”",
    guide: ["plurals", "Parenthetical Plurals (Limited, Intentional Use)"]
  },
  {
    id: "trademark-symbol", severity: "suggestion",
    pattern: /[™®℠]/g, fix: "",
    message: "Leave trademark symbols out of UI copy",
    detail: "Use them only in legal or formal documentation, and only when required.",
    guide: ["copyright-and-trademarks", "Trademark Symbols (™ and ®)"]
  },

  // ---------- Tone ----------
  {
    id: "oops", severity: "warning",
    pattern: /\b(?:oops|whoops|uh[- ]?oh|yikes)\b/gi,
    message: "Avoid “Oops,” “Uh-oh,” and similar",
    detail: "Keep a calm, factual tone, especially in financial flows.",
    guide: ["accessibility-high-risk", "Language to Avoid in High-Risk Flows"]
  },
  {
    id: "emoji", severity: "warning",
    pattern: /(?![©®™])\p{Extended_Pictographic}/gu,
    message: "Avoid emoji",
    detail: "Payment and billing experiences aren’t the place for emoji or celebratory language.",
    guide: ["content-principles", "Prefer Facts Over Emotion in Transactional Moments"]
  },
  {
    id: "exclamation", severity: "warning",
    pattern: /!+/g,
    message: "Avoid exclamation points",
    detail: "Keep messages calm and factual.",
    guide: ["content-principles", "Prefer Facts Over Emotion in Transactional Moments"],
    guideByContext: { tooltip: ["tooltips", "Structure, Length, and Punctuation"] }
  },
  {
    id: "apology", severity: "suggestion",
    pattern: /\b(?:sorry|we apologi[sz]e|apologies)\b/gi,
    message: "Acknowledge the issue without apologizing",
    detail: "It’s fine to recognize inconvenience, but skip apologies and emotional language.",
    guide: ["tone", "Empathy Without Apology"]
  },
  {
    id: "dont-worry", severity: "warning",
    pattern: /\b(?:don['’]t worry|no worries)\b/gi,
    message: "Avoid vague reassurance",
    detail: "State what happened, why (when known), and what happens next.",
    guide: ["voice", "Trustworthy"]
  },
  {
    id: "minimizing", severity: "suggestion",
    pattern: /\b(?:just|simply)\b/gi,
    message: "Avoid minimizing words like “just” and “simply”",
    guide: ["accessibility-high-risk", "Language to Avoid in High-Risk Flows"]
  },
  {
    id: "vague-timing", severity: "suggestion",
    pattern: /\b(?:soon|shortly|upcoming)\b/gi,
    message: "Say exactly when",
    detail: "Avoid relative timing like “soon” or “shortly.” Give a date or time frame.",
    guide: ["legal-content", "Timing"]
  },
  {
    id: "urgency", severity: "warning",
    pattern: /\b(?:act now|don['’]t miss out|limited time(?: only)?|last chance|hurry)\b/gi,
    message: "Avoid urgency and pressure tactics",
    guide: ["commercial-communications", "Tone and Voice"]
  },
  {
    id: "you-must", severity: "suggestion",
    pattern: /\byou must\b/gi,
    message: "Guide, don’t lecture",
    detail: "Phrase it as an instruction, like “Select a payment method.”",
    guide: ["content-principles", "Guide, Don't Lecture"]
  },
  {
    id: "are-you-sure", severity: "warning",
    pattern: /\bare you sure\b/gi,
    message: "Don’t ask “Are you sure?”",
    detail: "State the action and its consequence instead, like “Delete payment method?”",
    guide: ["modals-and-confirmation-dialogs", "Title"]
  },
  {
    id: "contractions-mixed", type: "contractions-mixed", severity: "suggestion",
    message: "Don’t mix contracted and full forms",
    detail: "Pick one style per surface. Avoid contractions in legal, compliance, and PCI content.",
    guide: ["tone", "Contractions"]
  },

  // ---------- Messages ----------
  {
    id: "blame", severity: "warning",
    pattern: /\byou (?:entered|provided|typed|selected|chose) (?:an? )?(?:incorrect|invalid|wrong|bad)\b/gi,
    message: "Don’t blame the user",
    detail: "Say what needs to be corrected, like “Enter a 9-digit routing number.”",
    guide: ["message-types", "Error Severity Types"]
  },
  {
    id: "invalid", severity: "warning",
    pattern: /\binvalid (?:input|entry|code|data|information|value|request)\b/gi,
    message: "Say what’s wrong and how to fix it",
    detail: "“Invalid input” doesn’t tell users what to change.",
    guide: ["accessibility", "3. Error messages must identify the error and help users fix it"]
  },
  {
    id: "error-code-only", severity: "warning",
    pattern: /^\s*error(?: code)?:?\s*\d+\s*$/gi,
    message: "An error code alone doesn’t help users",
    detail: "Explain what happened and what to do next.",
    guide: ["accessibility", "3. Error messages must identify the error and help users fix it"]
  },
  {
    id: "single-sentence-period", type: "single-sentence-period", severity: "suggestion", contexts: ["success", "banner", "tooltip"],
    fix: "", safeFix: true,
    message: "Drop the period on single-sentence messages",
    guide: ["message-types", "Structure, Length, and Punctuation"],
    guideByContext: { banner: ["banners", "Punctuation"], tooltip: ["tooltips", "Structure, Length, and Punctuation"] }
  },
  {
    id: "vague-fees", severity: "warning",
    pattern: /\b(?:additional|extra|small|other) (?:fees?|charges?)\b/gi,
    message: "Name the fee and the amount",
    guide: ["accessibility-high-risk", "4. Fees, Penalties, and Charges"]
  },
  {
    id: "suspicious-activity", severity: "suggestion",
    pattern: /\bsuspicious activity\b/gi,
    message: "Don’t imply wrongdoing",
    detail: "Be calm and factual, and explain the next steps.",
    guide: ["accessibility-high-risk", "6. Account Lockouts and Security Holds"]
  },
  {
    id: "otp", severity: "warning",
    pattern: /\bOTP\b/g, fix: "verification code",
    message: "Avoid “OTP”",
    detail: "Say “verification code” unless the term is defined for that audience.",
    guide: ["accessibility-high-risk", "1. Authentication and Verification (MFA, OTP, Identity Checks)"]
  },

  // ---------- Forms and controls ----------
  {
    id: "label-colon", severity: "warning", contexts: ["label"],
    pattern: /:(?=\s*$)/g, fix: "", safeFix: true,
    message: "Remove the colon from field labels",
    guide: ["forms", "Field Labels"]
  },
  {
    id: "label-verb", severity: "suggestion", contexts: ["label"],
    pattern: /^\s*(?:Enter|Select|Choose|Type|Provide|Input)\b/g,
    message: "Use a noun for field labels",
    detail: "Labels name the data, like “Billing address,” not the action.",
    guide: ["forms", "Field Labels"]
  },
  {
    id: "label-article", severity: "suggestion", contexts: ["label"],
    pattern: /^\s*(?:The|A|An|Your)\s/g,
    message: "Leave articles and “your” out of field labels",
    guide: ["forms", "Field Labels"]
  },
  {
    id: "label-required", severity: "suggestion", contexts: ["label"],
    pattern: /\s*\(required\)|^\s*\*|\*(?=\s*$)/gi,
    message: "Don’t mark every field as required",
    detail: "Mark optional fields instead, and note required selections at the form level.",
    guide: ["forms", "Required vs. Optional Fields"]
  },
  {
    id: "vague-placeholder", severity: "warning",
    pattern: /^\s*(?:choose one|select one|please select|select an option|type here|enter (?:a )?date|enter text|enter value)\s*\.?\s*$/gi,
    message: "Vague placeholder",
    detail: "Show the expected format or a valid example instead.",
    guide: ["menus", "Placeholder Text"]
  },
  {
    id: "toggle-action", severity: "suggestion", contexts: ["toggle"],
    pattern: /^\s*(?:turn (?:on|off)|enable|disable|activate|deactivate)\b/gi,
    message: "Label the setting, not the action",
    detail: "Toggle labels name the state being enabled, like “Autopay.”",
    guide: ["forms", "Label the State Being Enabled, Not the Action"]
  },
  {
    id: "checkbox-vague", severity: "warning", contexts: ["checkbox"],
    pattern: /^\s*(?:I agree|I accept|Agree|Accept|Yes)\s*\.?\s*$/gi,
    message: "Say what the user is agreeing to",
    guide: ["legal-content", "Checkbox Pattern (Required)"]
  },
  {
    id: "consent-vague", severity: "suggestion",
    pattern: /^\s*(?:stay informed|receive updates|get updates)\s*$/gi,
    message: "Consent language must say what users will receive",
    guide: ["commercial-communications", "Consent Language"]
  },
  {
    id: "instruction-filler", severity: "suggestion",
    pattern: /\b(?:let['’]s get started|just follow these steps|please go ahead and)\b|^\s*please (?:enter|select|choose|provide)\b/gi,
    message: "Cut conversational filler",
    guide: ["instructional-text", "Voice and Tone"]
  },
  {
    id: "positional", severity: "suggestion",
    pattern: /\b(?:(?:button|field|link|option|section|form|box) (?:above|below)|(?:see|listed|shown) (?:above|below)|on the (?:left|right)|to the (?:left|right)|in (?:red|green))\b/gi,
    message: "Avoid directions that rely on layout or color",
    detail: "Refer to the label or component name instead.",
    guide: ["accessibility", "Don't rely on formatting, position, or color to convey meaning"]
  },
  {
    id: "following-table", severity: "suggestion",
    pattern: /\bthe following table\b/gi,
    message: "Don’t introduce tables with “the following table”",
    guide: ["tables", "Introducing Tables"]
  },

  // ---------- Abbreviations and time ----------
  {
    id: "time-format", severity: "warning",
    pattern: /\b(\d{1,2}(?::\d{2})?)\s?([AaPp])\.?\s?[Mm]\.?(?![\w])/g, fix: { fn: "time-ampm" }, safeFix: true,
    message: "Write times as “a.m.” and “p.m.”",
    guide: ["abbreviations-and-acronyms", "Time"]
  },
  {
    id: "time-zone", severity: "suggestion",
    pattern: /\b(?:EST|EDT)\b/g, fix: "ET",
    message: "Use “ET”",
    detail: "Only specify standard or daylight time when accuracy requires it.",
    guide: ["abbreviations-and-acronyms", "Time"]
  },

  // ---------- Phone numbers ----------
  {
    id: "phone-format", type: "phone", severity: "warning", safeFix: true,
    message: "Format phone numbers as (xxx) xxx-xxxx",
    detail: "With a country code, use +1 (xxx) xxx-xxxx.",
    guide: ["abbreviations-and-acronyms", "Phone Numbers"]
  },

  // ---------- PCI ----------
  {
    id: "card-number", type: "card-number", severity: "error", category: "compliance",
    message: "Don’t show full card or account numbers",
    detail: "Mask them, like “•••• 1234.” This includes real-looking placeholder examples.",
    guide: ["pci-compliance", "Sensitive Data (Do Not Expose)"]
  },
  {
    id: "ssn", severity: "error", category: "compliance",
    pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
    message: "Don’t show full Social Security numbers",
    guide: ["pci-compliance", "Sensitive Data (Do Not Expose)"]
  },

  // ---------- Legal documents ----------
  {
    id: "legal-link", type: "must-link", severity: "warning", standalone: true, exemptApproved: false,
    exceptContexts: ["button", "link", "menu", "tab", "heading", "table-header"],
    message: "Link this legal document",
    detail: "Terms of Use, Terms and Conditions, and Privacy Policy must always link to the document. Text counts as linked if it’s blue, has a Figma link, uses a link text style or color, or is underlined.",
    guide: ["legal-content", "Linking Legal Documents"]
  },

  // ---------- Names ----------
  {
    id: "kubra-name", type: "term", terms: ["KUBRA"], caseSensitive: false, skipExact: true, fix: "KUBRA", safeFix: true, severity: "warning",
    skipInToken: /\.[a-z]|@|\//i,
    message: "Write “KUBRA” in all caps",
    guide: ["copyright-and-trademarks", "Always Use Official Names"]
  }
];

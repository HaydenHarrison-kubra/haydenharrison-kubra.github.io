// Run with: node --test figma-plugin/test   (build first: node figma-plugin/build.mjs)
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const engine = require("../src/engine.js");
const rulesJson = JSON.parse(readFileSync(new URL("../../rules.json", import.meta.url), "utf8"));
const c = engine.compile(rulesJson);

const PARENTS = { "text-button": "button", "menu-placeholder": "placeholder", "rich-tooltip": "tooltip" };
const check = (text, context = "body", extra = {}) => engine.check(c, { text, context, contextParent: PARENTS[context] || null, ...extra });
const ids = (text, context, extra) => check(text, context, extra).map((i) => i.ruleId);
const find = (text, context, ruleId, extra) => check(text, context, extra).find((i) => i.ruleId === ruleId);
const applyFix = (text, issue) => text.slice(0, issue.start) + issue.replacement + text.slice(issue.end);
const expectFix = (text, context, ruleId, fixed, extra) => {
  const issue = find(text, context, ruleId, extra);
  assert.ok(issue, `expected ${ruleId} on "${text}" (${context}); got ${ids(text, context, extra).join(", ") || "nothing"}`);
  assert.equal(applyFix(text, issue), fixed);
};
const expectRule = (text, context, ruleId, extra) =>
  assert.ok(find(text, context, ruleId, extra), `expected ${ruleId} on "${text}" (${context}); got ${ids(text, context, extra).join(", ") || "nothing"}`);
const expectClean = (text, context = "body", extra) => assert.deepEqual(ids(text, context, extra), [], `expected no issues on "${text}" (${context})`);
// No errors or warnings (suggestions allowed).
const expectNoProblems = (text, context = "body", extra) =>
  assert.deepEqual(check(text, context, extra).filter((i) => i.severity !== "suggestion").map((i) => i.ruleId), [], `expected no errors or warnings on "${text}" (${context})`);

const fill = (snippet, values) => Object.keys(snippet.placeholders).reduce((t, k) => t.split(k).join(values[k] || "Acme Utilities"), snippet.text);
const snippets = rulesJson.data.standardCopy;
const sms = (id) => snippets.find((s) => s.id === id);

// Link ranges for every legal document name in the text, as a finished design would have.
const legalLinks = (text) => rulesJson.data.legalDocuments.flatMap((name) => {
  const out = [];
  for (let i = text.indexOf(name); i !== -1; i = text.indexOf(name, i + 1)) out.push({ start: i, end: i + name.length });
  return out;
});

test("approved standard copy passes untouched", () => {
  for (const s of snippets) {
    expectClean(s.text, "body", { links: legalLinks(s.text) });
    const filled = fill(s, { "Joe Smith": "Dana Lee", "(480) 111-1111": "(602) 555-0142" });
    expectClean(filled, "body", { links: legalLinks(filled) });
  }
  expectRule(sms("myhq-non-consumer").text, "body", "legal-link");
  expectClean("Something went wrong due to a system error. Please try again later.", "error");
});

test("standard copy: wrong punctuation gets the exact approved text back", () => {
  const filled = fill(sms("bizhq-consumer"), { "Joe Smith": "Dana Lee", "(480) 111-1111": "(602) 555-0142" });
  const straight = filled.replace(/[“”]/g, '"').replace(/’/g, "'");
  const issue = find(straight, "body", "standard-copy-punctuation", { links: legalLinks(straight) });
  assert.ok(issue);
  assert.equal(applyFix(straight, issue), filled);
  assert.ok(!find(straight, "body", "curly-quotes", { links: legalLinks(straight) }), "approved range is exempt from the generic quote check");
});

test("standard copy: edited SMS disclosures are errors", () => {
  const issue = find("Msg and data rates may apply. Reply STOP to cancel.", "body", "standard-copy-sms-compliance");
  assert.equal(issue.severity, "error");
  assert.ok(issue.approvedText);
  assert.equal(issue.replacement, null, "a person picks the right SMS version");
  assert.match(issue.guide.url, /#standard-copy\/sms-compliance$/);
  expectRule("Something went wrong. Try again.", "error", "standard-copy-error-messages");
  assert.ok(!find("KUBRA: Your payment is due March 15. Reply STOP to unsubscribe", "body", "standard-copy-sms-compliance"), "transactional SMS isn't an opt-in disclosure");
  expectFix("Oops, something went wrong", "error", "standard-copy-error-messages", "Something went wrong due to a system error. Please try again later.");
});

test("buttons", () => {
  expectRule("Click to pay", "button", "button-click");
  expectRule("Submit", "button", "button-generic");
  expectRule("Yes", "button", "button-yes-no");
  expectRule("Delete", "button", "button-missing-object");
  expectRule("Review and confirm your scheduled payment", "button", "button-length");
  expectFix("Pay bill.", "button", "button-punctuation", "Pay bill");
  expectFix("Pay Bill", "button", "sentence-case", "Pay bill");
  expectFix("PAY BILL", "button", "sentence-case", "Pay bill");
  expectRule("Learn more", "link", "empty-state-cta");
  // Do examples from the Buttons and CTAs page
  for (const ok of ["Pay bill", "Save changes", "Confirm payment", "Download statement", "Cancel payment", "Add payment method", "View details",
    "Save payment method", "Delete payment method", "Cancel scheduled payment", "Remove bank account", "View transaction details", "Cancel", "Go back"]) {
    expectNoProblems(ok, "button");
  }
  // Longer labels from the guide are fine on text-only buttons
  for (const ok of ["Read Terms and Conditions", "View full payment history"]) expectNoProblems(ok, "text-button");
});

test("button length depends on the button style", () => {
  expectRule("View full payment history", "button", "button-length");
  expectNoProblems("View full payment history", "text-button");
  expectNoProblems("Review your scheduled payment details", "text-button");
  expectRule("Review and confirm your scheduled payment details", "text-button", "text-button-length");
  assert.ok(!find("Review and confirm your scheduled payment details", "text-button", "button-length"));
  // Text-only buttons follow every other button rule
  expectRule("Click to view details", "text-button", "button-click");
  expectFix("View Payment History", "text-button", "sentence-case", "View payment history");
  assert.match(find("View Payment History", "text-button", "sentence-case").guide.url, /buttons-and-ctas/);
});

test("names in greetings and direct address aren't flagged", () => {
  for (const ok of ["Welcome, Joe", "Hi Dana", "Welcome back, Joe Smith", "Thanks for paying, Joe", "Good morning, Dana", "Hello {firstName}", "Welcome, [First name]"]) {
    expectClean(ok, "heading");
  }
  expectFix("Welcome Back, Joe", "heading", "sentence-case", "Welcome back, Joe");
  expectFix("Welcome To Your Account", "heading", "sentence-case", "Welcome to your account");
  expectFix("Pay [Amount] Now", "button", "sentence-case", "Pay [Amount] now");
});

test("sentence case keeps proper nouns and acronyms", () => {
  expectClean("Manage Storm Center alerts", "heading");
  expectNoProblems("Set up EZ-PAY with PayPal", "text-button");
  expectClean("Update SMS settings", "heading");
  expectFix("Turn On Pay-by-Text Reminders", "heading", "sentence-case", "Turn on Pay-by-Text reminders");
  expectFix("PAY WITH PAYPAL", "button", "sentence-case", "Pay with PayPal");
  expectClean("How do I update my billing information?", "heading");
  expectClean("Payment Settings", "table-header");
});

test("headings and labels", () => {
  expectFix("Payment settings.", "heading", "heading-punctuation", "Payment settings");
  expectFix("Account number:", "label", "label-colon", "Account number");
  expectRule("Enter billing address", "label", "label-verb");
  expectRule("The account number", "label", "label-article");
  expectRule("Payment method (required)", "label", "label-required");
  expectRule("Email address (work)", "label", "label-parentheses");
  expectClean("Upload file(s)", "label");
  expectFix("Account(s)", "heading", "parenthetical-plural", "Accounts");
  expectRule("Turn on autopay", "toggle", "toggle-action");
  expectRule("I agree", "checkbox", "checkbox-vague");
  expectRule("Choose one", "placeholder", "vague-placeholder");
});

test("glossary terms", () => {
  expectFix("Enroll in Pay by Text", "body", "glossary-pay-by-text", "Enroll in Pay-by-Text");
  expectFix("Use Ez Pay today", "body", "glossary-ez-pay", "Use EZ-PAY today");
  expectFix("Pay with Paypal", "body", "glossary-paypal", "Pay with PayPal");
  expectFix("Pay with paypal", "body", "glossary-paypal-case", "Pay with PayPal");
  expectFix("Open StormCenter", "body", "glossary-storm-center", "Open Storm Center");
  expectFix("Enter your PAN", "body", "glossary-pan", "Enter your card number");
  expectFix("Enter your RTN", "body", "glossary-rtn", "Enter your routing number");
  expectRule("Tokenization mismatch", "error", "glossary-tokenization");
  expectFix("Contact Kubra support", "body", "kubra-name", "Contact KUBRA support");
  expectClean("Visit kubra.com for details", "body");
  expectClean("Manage payment reminders for your account", "body");
  expectClean("Retail Cash Payments (RCP)", "body");
  expectFix("Pay with Cash Payments", "body", "glossary-retail-cash-payments-rcp", "Pay with Retail Cash Payments");
});

test("special characters and typography", () => {
  expectFix("Billing & payments", "heading", "ampersand", "Billing and payments");
  expectClean("Contact OG&E", "body");
  expectRule("Enable/disable alerts", "body", "slash");
  expectClean("03/15/2026", "label");
  assert.ok(!find("Due 03/15/2026", "body", "slash"), "dates aren't slashes");
  expectClean("Use MM/DD/YYYY format", "body");
  expectClean("Go to https://kubra.com/pay", "body");
  expectRule("Select the “Advanced” option", "body", "quotation-marks");
  expectRule('Select the "Advanced" option', "body", "curly-quotes");
  expectFix("You'll receive a receipt", "body", "curly-quotes", "You’ll receive a receipt");
  expectFix('Type "yes" to confirm', "body", "curly-quotes", "Type “yes” to confirm");
  expectRule("Your payment — processed today", "body", "em-dash");
  expectClean("Aim for 1–2 words", "body");
  expectFix("EZ-PAY®", "body", "trademark-symbol", "EZ-PAY");
});

test("tone and messages", () => {
  expectRule("Oops! Try again", "error", "oops");
  expectRule("Nice work 🎉", "success", "emoji");
  expectClean("© 2026 KUBRA. All rights reserved", "body");
  expectRule("Payment complete!", "success", "exclamation");
  expectRule("Sorry about that", "error", "apology");
  expectRule("Don't worry, it's fine", "body", "dont-worry");
  expectRule("Simply enter your code", "body", "minimizing");
  expectRule("Your payment will post soon", "body", "vague-timing");
  expectRule("Act now!", "body", "urgency");
  expectRule("You must select a payment method", "body", "you-must");
  expectRule("Are you sure?", "modal", "are-you-sure");
  expectRule("You entered incorrect information", "error", "blame");
  expectRule("Invalid input", "error", "invalid");
  expectRule("Error 404", "error", "error-code-only");
  expectFix("Payment method saved.", "success", "single-sentence-period", "Payment method saved");
  expectClean("Payment method saved. You can change it any time.", "success");
  expectClean("Payment sent to Acme Inc.", "success");
  expectRule("Additional fees may apply", "body", "vague-fees");
  expectFix("Enter the OTP", "body", "otp", "Enter the verification code");
  expectRule("You can't cancel. Payments do not refund", "body", "contractions-mixed");
});

test("time, PCI, and layout language", () => {
  expectFix("Due by 5 PM", "body", "time-format", "Due by 5:00 PM");
  expectFix("Due by 5 p.m.", "body", "time-format", "Due by 5:00 PM.");
  expectFix("Due by 5 p.m. on Friday", "body", "time-format", "Due by 5:00 PM on Friday");
  expectFix("Opens at 9:30am", "body", "time-format", "Opens at 9:30 AM");
  expectFix("Opens at 9:30 a.m.", "body", "time-format", "Opens at 9:30 AM.");
  expectClean("Opens at 9:30 AM ET", "body");
  expectClean("Maintenance in progress. Some features may be unavailable until 2:00 AM ET.", "banner");
  expectFix("Support hours are 8:00 AM to 5:00 PM EST", "body", "time-zone", "Support hours are 8:00 AM to 5:00 PM ET");
  expectFix("Call by 5:00 PM CDT", "body", "time-zone", "Call by 5:00 PM CT");
  expectRule("Card 4111 1111 1111 1111", "body", "card-number");
  expectRule("Card number 4111111111111111 is invalid", "error", "card-number");
  expectClean("Card ending in •••• 1234", "body");
  expectClean("Call (480) 111-1111", "body");
  expectRule("SSN 123-45-6789", "body", "ssn");
  expectRule("Click the button below", "body", "positional");
  expectRule("The following table outlines fees", "body", "following-table");
});

test("formatting from Figma styles", () => {
  const text = "View payment history";
  expectRule(text, "body", "underline-not-link", { underline: [{ start: 0, end: 4 }] });
  expectClean(text, "body", { underline: [{ start: 0, end: 20 }], links: [{ start: 0, end: 20 }] });
  expectRule("Pay bill", "button", "text-case-upper", { upper: [{ start: 0, end: 8 }] });
  expectRule("Pay bill", "button", "text-case-title", { titleCase: [{ start: 0, end: 8 }] });
  expectRule("Payment failed", "error", "italic-in-error", { italic: [{ start: 0, end: 14 }] });
  expectRule("Click here to view your bill", "body", "link-vague", { links: [{ start: 0, end: 10 }] });
  expectRule("Read the brand guidelines", "body", "link-article", { links: [{ start: 5, end: 25 }] });
});

test("grammar", () => {
  expectFix("Pay the the bill", "body", "repeated-word", "Pay the bill");
  expectFix("We couldn't recieve your payment", "body", "misspelling", "We couldn't receive your payment");
  expectFix("Recieve alerts", "body", "misspelling", "Receive alerts");
  expectFix("There was a error", "body", "a-an", "There was an error");
  expectFix("Make an payment", "body", "a-an", "Make a payment");
  expectFix("Send a SMS", "body", "a-an", "Send an SMS");
  expectClean("Create a user account in an hour", "body");
  expectClean("Choose Plan A or Plan B", "body");
  expectFix("Payment failed. try again", "body", "sentence-start", "Payment failed. Try again");
  assert.ok(!find("Use a card, e.g. a debit card", "body", "sentence-start"), "no capital needed after e.g.");
  expectFix("Pay  now", "body", "double-space", "Pay now");
  expectFix("Hello , world", "body", "space-before-punctuation", "Hello, world");
  expectFix("Saved.Next, review", "body", "missing-space-sentence", "Saved. Next, review");
  expectFix("Wait!!", "body", "doubled-punctuation", "Wait!");
  expectFix("You could of paid", "body", "could-of", "You could have paid");
  expectFix("It's own settings", "body", "its-own", "Its own settings");
  expectFix("Its not available", "body", "its-contraction", "It’s not available");
  expectFix("Your welcome", "body", "your-youre", "You’re welcome");
  expectFix("Faster then before", "body", "then-than", "Faster than before");
  expectFix("You'll want to setup autopay", "body", "split-verb", "You'll want to set up autopay");
  expectFix("Login to your account", "body", "sign-in-word", "Sign in to your account");
  expectFix("You need to login first", "body", "sign-in-word", "You need to sign in first");
  expectFix("Your login details", "body", "sign-in-word", "Your sign-in details");
  expectFix("Log in to pay your bill", "body", "sign-in-verb", "Sign in to pay your bill");
  expectFix("You've been logged out", "body", "sign-in-verb", "You've been signed out");
  expectFix("Log off", "body", "sign-in-verb", "Sign out");
  expectFix("Login", "button", "sign-in-button", "Sign in");
  expectFix("Logout", "button", "sign-in-button", "Sign out");
  assert.ok(!find("Sign in to view your sign-in history", "body", "sign-in-word"));
  assert.ok(!find("Open the catalog in a new tab", "body", "sign-in-verb"));
  expectFix("Check your e-mail", "body", "e-mail", "Check your email");
  expectFix("Then i saved it", "body", "lowercase-i", "Then I saved it");
  expectRule("Pay now (or later", "body", "unbalanced");
});

test("legal document names: capitalized and linked", () => {
  expectFix("You accept the terms and conditions", "body", "glossary-terms-and-conditions", "You accept the Terms and Conditions");
  expectFix("Read our T&Cs", "body", "glossary-terms-and-conditions", "Read our Terms and Conditions");
  expectFix("See the Privacy policy", "body", "glossary-privacy-policy", "See the Privacy Policy");
  expectRule("See our Privacy Policy", "body", "legal-link");
  const both = check("You accept the terms of use", "body").map((i) => i.ruleId);
  assert.ok(both.includes("glossary-terms-of-use") && both.includes("legal-link"), "wrong case and missing link both show: " + both);
  const t = "See our Privacy Policy";
  expectClean(t, "body", { links: [{ start: 8, end: 22 }] });
  expectClean(t, "body", { linkStyled: [{ start: 8, end: 22 }] });
  expectClean(t, "body", { underline: [{ start: 8, end: 22 }] });
  expectNoProblems("Read Terms and Conditions", "text-button");
  expectClean("Privacy Policy", "heading");
  expectFix("Read Terms And Conditions And Pay", "heading", "sentence-case", "Read Terms and Conditions and pay");
});

test("icon-font text is ignored", () => {
  expectClean("chevron-up", "body", { skip: [{ start: 0, end: 10 }] });
  expectClean("circle-user Pay bill", "button", { skip: [{ start: 0, end: 11 }] });
  expectFix("wallet Pay Bill", "button", "sentence-case", "wallet Pay bill", { skip: [{ start: 0, end: 6 }] });
  expectRule("arrow-right Submit", "button", "button-generic", { skip: [{ start: 0, end: 11 }] });
  assert.ok(!find("globe Pay bill", "button", "a-an", { skip: [{ start: 0, end: 5 }] }));
});

test("phone numbers", () => {
  expectClean("(480) 111-1111", "toggle");
  expectClean("Call (480) 111-1111 for help", "body");
  for (const bad of ["480-111-1111", "480.111.1111", "480 111 1111", "(480)111-1111", "(480) 111 1111"]) {
    expectFix(`Call ${bad} for help`, "body", "phone-format", "Call (480) 111-1111 for help");
  }
  expectFix("Mobile number 4801111111", "body", "phone-format", "Mobile number (480) 111-1111");
  assert.ok(!find("Account 4801111111", "body", "phone-format"), "10 bare digits without phone context could be an account number");
  expectClean("Call +1 (480) 111-1111", "body");
  expectClean("+1 (480) 111-1111", "toggle");
  for (const bad of ["1-480-111-1111", "+1 480-111-1111", "+1-480-111-1111", "+1.480.111.1111", "1 (480) 111-1111", "+1(480)111-1111", "+1 480 111 1111"]) {
    expectFix(`Call ${bad} for help`, "body", "phone-format", "Call +1 (480) 111-1111 for help");
  }
  expectFix("Text 14801111111", "body", "phone-format", "Text +1 (480) 111-1111");
  assert.ok(!find("Account 14801111111", "body", "phone-format"));
  assert.ok(!find("Due 2026-10-06", "body", "phone-format"));
  expectRule("Email address (work)", "label", "label-parentheses");
});

test("quoted SMS keywords are allowed outside approved copy", () => {
  const text = "Message and data rates may apply. Message frequency varies. Consumer can reply “STOP” to opt out or “HELP” for help.";
  assert.ok(!find(text, "body", "quotation-marks"));
  expectFix('Reply "STOP" to opt out', "body", "curly-quotes", "Reply “STOP” to opt out");
  expectRule("Select the “Advanced” option", "body", "quotation-marks");
  expectClean("Reply START to resume", "body");
});

test("numbers, dates, and times", () => {
  expectFix("Open until 12 PM", "body", "noon", "Open until noon");
  expectFix("Open until 12:00 PM", "body", "noon", "Open until noon");
  expectRule("Pay by midnight", "body", "midnight-deadline");
  expectClean("Pay by 11:59 PM ET on March 15", "body");
  expectFix("9:00 AM–5:00 PM ET", "body", "time-range-dash", "9:00 AM to 5:00 PM ET");
  expectRule("Open 9:00 to 5:00 PM", "body", "time-range-ampm");
  expectClean("Open 9:00 AM to 5:00 PM ET", "body");
  expectFix("Due March 15th", "body", "date-ordinal", "Due March 15");
  expectFix("Due Mar. 3rd", "body", "date-ordinal", "Due Mar 3");
  expectClean("Charged on the 15th of each month", "body");
  expectFix("Starting June, 2026", "body", "date-comma", "Starting June 2026");
  expectFix("Due March 15 2026", "body", "date-missing-comma", "Due March 15, 2026");
  expectClean("Due March 15, 2026, at 5:00 PM ET", "body");
  expectFix("Due Sept. 3", "body", "month-abbreviation", "Due Sep 3");
  expectFix("Due Oct. 3", "body", "month-abbreviation", "Due Oct 3");
  expectClean("Due Sep 3", "body");
  expectFix("Mon., Sep 3", "body", "day-abbreviation", "Mon, Sep 3");
  expectFix("Thurs., Sep 3", "body", "day-abbreviation", "Thu, Sep 3");
  expectFix("Billing period March 1-31", "body", "date-range-dash", "Billing period March 1 through March 31");
  expectRule("Available from Mar 1–31", "body", "from-dash");
  expectFix("Arrives in 3-5 business days", "body", "number-range-dash", "Arrives in 3 to 5 business days");
  expectRule("Your payment is due tomorrow", "body", "relative-due-date");
  expectRule("Autopay renews in 3 days", "body", "relative-due-date");
  expectClean("Posted 2 hours ago", "body");
  expectFix("Save 5 % today", "body", "percent-space", "Save 5% today");
  expectFix("A five percent fee", "body", "percent-word", "A 5% fee");
  expectFix("Your 1st payment", "body", "ordinal-word", "Your first payment");
  expectClean("Your 12th payment", "body");
  expectFix("Your 12ᵗʰ payment", "body", "superscript-ordinal", "Your 12th payment");
  expectRule("12 payments are scheduled.", "body", "sentence-starts-with-numeral");
  expectClean("You have 12 scheduled payments.", "body");
  expectClean("3 accounts", "label");
  expectFix("Balance $12500.00", "body", "money-commas", "Balance $12,500.00");
  expectFix("Raised $1.2M", "body", "money-abbreviation", "Raised $1.2 million");
  expectFix("Up to $5K", "body", "money-abbreviation", "Up to $5,000");
  expectRule("Refund ($25.00)", "body", "money-parentheses");
  expectFix("Amount due: $125", "body", "money-cents", "Amount due: $125.00");
  expectClean("Amount due: $125.00", "body");
  expectClean("Fees range from $10 to $25", "body");
  expectClean("$1.2 million raised", "body");
});

test("punctuation and wording", () => {
  expectFix("Use a card (e.g., Visa)", "body", "latin-abbreviation", "Use a card (for example, Visa)");
  expectFix("Your billing period, i.e., the month", "body", "latin-abbreviation", "Your billing period, that is, the month");
  expectRule("Visa, Mastercard, etc.", "body", "etc");
  expectFix("Processing...", "body", "ellipsis", "Processing…");
  expectClean("Processing…", "body");
  expectFix("Pay with a card, bank account or cash.", "body", "serial-comma", "Pay with a card, bank account, or cash.");
  expectClean("Pay with a card, bank account, or cash.", "body");
  assert.ok(!find("If you're ready, select Pay and confirm.", "body", "serial-comma"));
  assert.ok(!find("Hi, Joe and Dana", "heading", "serial-comma"));
  expectFix("Click Pay bill to continue", "body", "interaction-verb", "Select Pay bill to continue");
  expectFix("Tap on the card", "body", "interaction-verb", "Select the card");
  assert.ok(!find("Click Here", "button", "interaction-verb"), "buttons have their own click rule");
  expectFix("Add it to the whitelist", "body", "inclusive-list", "Add it to the allowlist");
  expectFix("He or she can pay", "body", "inclusive-pronouns", "They can pay");
  expectFix("Update his or her account", "body", "inclusive-pronouns", "Update their account");
  expectRule("Hey guys", "heading", "inclusive-guys");
  expectRule("Choose the 4th option", "body", "ordinal-word");
});

test("ignored issues are marked, and categories can be turned off", () => {
  const issue = find("Submit", "button", "button-generic");
  const again = check("Submit", "button", { ignored: [issue.key] }).find((i) => i.ruleId === "button-generic");
  assert.equal(again.ignored, true);
  assert.ok(!engine.check(c, { text: "Pay the the bill", context: "body" }, { categories: { grammar: false } }).some((i) => i.ruleId === "repeated-word"));
});

test("audit fixes: periods, sign-in, dates, and false positives", () => {
  // Times keep the period that ends a sentence.
  assert.ok(!find("Please pay by 5:00 PM.", "body", "time-format"));
  expectFix("Pay at 12 PM.", "body", "noon", "Pay at noon.");
  expectFix("12 PM is the cutoff", "body", "noon", "Noon is the cutoff");
  // Sign-in: URLs, domains, nouns, and compound adjectives.
  assert.ok(!find("Visit kubra.com/login to pay", "body", "sign-in-word"));
  assert.ok(!find("Use Login.gov to verify", "body", "sign-in-word"));
  expectFix("Add a login to your account", "body", "sign-in-word", "Add a sign-in to your account");
  expectFix("The log in page", "body", "sign-in-verb", "The sign-in page");
  assert.equal(find("Your login details", "body", "sign-in-word").safeFix, false, "no bulk fix for login words");
  // A time isn't the end of a date range.
  assert.ok(!find("Due Mar 15 - 5:00 PM ET", "body", "date-range-dash"));
  expectFix("Mar 1-31", "body", "date-range-dash", "Mar 1 through Mar 31");
  // "click" and "tap" that aren't instructions.
  for (const t of ["Double-click the file", "One-click payments", "Tap your card on the reader", "Tap to Pay on iPhone", "Click and drag the slider"]) {
    assert.ok(!find(t, "body", "interaction-verb"), t);
  }
  // Names stay capitalized.
  expectFix("Sign In With Apple", "button", "sentence-case", "Sign in with Apple");
  expectFix("Ship To United States", "heading", "sentence-case", "Ship to United States");
  // Legal acceptance, "Five percent", ordinals in dates.
  assert.ok(!find("You must accept the Terms and Conditions to continue.", "body", "you-must"));
  assert.ok(!find("Five percent of your payment goes to fees.", "body", "percent-word"));
  expectFix("You save five percent", "body", "percent-word", "You save 5%");
  assert.ok(!find("Due Mar 1st", "body", "ordinal-word"));
  expectFix("Due Mar 1st", "body", "date-ordinal", "Due Mar 1");
  // Phone numbers, promotions, and minimums.
  assert.ok(!find("Text us from 555-123-4567", "body", "from-dash"));
  for (const t of ["Get $10 off", "Payments of $25 or more qualify", "Save $5/month", "Pay up to $500 today"]) {
    assert.ok(!find(t, "body", "money-cents"), t);
  }
  expectFix("A payment of $125 is due", "body", "money-cents", "A payment of $125.00 is due");
  // Small ones.
  assert.ok(!ids("Sign in to TD Bank", "body").some((id) => /^glossary-transaction/.test(id)));
  assert.ok(!find("We just sent a code", "body", "minimizing"));
  assert.ok(find("Just enter your code", "body", "minimizing"));
  assert.ok(!find("EST. 1999", "body", "time-zone"));
});

test("new checks", () => {
  expectRule("Payment posted 10/20/2026.", "body", "numeric-date");
  expectFix("Due March 15, 2026 at 5:00 PM ET.", "body", "date-year-comma", "Due March 15, 2026, at 5:00 PM ET.");
  assert.ok(!find("Due March 15, 2026.", "body", "date-year-comma"));
  expectRule("Pay by 5:00 PM on March 20.", "body", "deadline-time-zone");
  assert.ok(!find("Pay by 5:00 PM ET on March 20.", "body", "deadline-time-zone"));
  assert.ok(!find("Pay by 11:59 PM on March 20 (ET).", "body", "deadline-time-zone"));
  expectRule("Send us your card number and we’ll update it.", "body", "card-data-free-text");
  expectRule("Reply with your full account number", "body", "card-data-free-text");
  expectRule("Learn more", "tooltip", "tooltip-link", { links: [{ start: 0, end: 10 }] });
  expectRule("Due on the 15th", "tooltip", "tooltip-bold", { bold: [{ start: 11, end: 15 }] });
  expectRule("Your routing number is on your check", "tooltip", "tooltip-length");
  assert.ok(!find("Copy account number", "tooltip", "tooltip-length"));
  assert.ok(!find("Your routing number is on your check", "rich-tooltip", "tooltip-length"));
  expectRule("Details", "heading", "heading-generic");
  assert.ok(!find("Payment details", "heading", "heading-generic"));
  expectRule("© 2026 KUBRA", "button", "copyright-in-ui");
  assert.ok(!find("© 2026 KUBRA. All rights reserved.", "body", "copyright-in-ui"), "footers are body text");
  expectRule("Your refund may take a while", "body", "vague-timing");
  expectRule("Changes apply next billing cycle", "body", "vague-timing");
  expectRule("Payment method", "menu-placeholder", "dropdown-placeholder", { contextParent: "placeholder" });
  assert.ok(!find("Select a payment method", "menu-placeholder", "dropdown-placeholder", { contextParent: "placeholder" }));
});

test("rules file lists the engine features it needs", () => {
  assert.ok(rulesJson.requires.runners.every((r) => engine.runnerTypes.includes(r)));
  assert.ok(rulesJson.requires.fixers.every((f) => engine.fixerNames.includes(f)));
  assert.ok(rulesJson.requires.fixers.includes("sign-in-word"));
});

test("rules file is consistent", () => {
  assert.equal(rulesJson.schema, engine.SCHEMA);
  for (const r of rulesJson.rules) {
    if (r.guide) assert.match(r.guide.url, /^https:\/\/.+#[a-z0-9-]+\/[a-z0-9-]+$/);
  }
});

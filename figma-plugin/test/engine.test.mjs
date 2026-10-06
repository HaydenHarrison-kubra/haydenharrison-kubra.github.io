// Run with: node --test figma-plugin/test   (build first: node figma-plugin/build.mjs)
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const engine = require("../src/engine.js");
const rulesJson = JSON.parse(readFileSync(new URL("../../rules.json", import.meta.url), "utf8"));
const c = engine.compile(rulesJson);

const PARENTS = { "text-button": "button" };
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
  expectClean("Due 03/15/2026", "body");
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
  expectClean("Payment scheduled for 10 a.m.", "success");
  expectRule("Additional fees may apply", "body", "vague-fees");
  expectFix("Enter the OTP", "body", "otp", "Enter the verification code");
  expectRule("You can't cancel. Payments do not refund", "body", "contractions-mixed");
});

test("time, PCI, and layout language", () => {
  expectFix("Due by 5 PM", "body", "time-format", "Due by 5 p.m.");
  expectFix("Opens at 9:30am", "body", "time-format", "Opens at 9:30 a.m.");
  expectClean("Opens at 9:30 a.m. ET", "body");
  expectFix("Support hours are 8 a.m. to 5 p.m. EST", "body", "time-zone", "Support hours are 8 a.m. to 5 p.m. ET");
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
  expectClean("Use a card, e.g. a debit card", "body");
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
  expectFix("Login to your account", "body", "login-to", "Log in to your account");
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

test("ignored issues are marked, and categories can be turned off", () => {
  const issue = find("Submit", "button", "button-generic");
  const again = check("Submit", "button", { ignored: [issue.key] }).find((i) => i.ruleId === "button-generic");
  assert.equal(again.ignored, true);
  assert.ok(!engine.check(c, { text: "Pay the the bill", context: "body" }, { categories: { grammar: false } }).some((i) => i.ruleId === "repeated-word"));
});

test("rules file is consistent", () => {
  assert.equal(rulesJson.schema, engine.SCHEMA);
  for (const r of rulesJson.rules) {
    if (r.guide) assert.match(r.guide.url, /^https:\/\/.+#[a-z0-9-]+\/[a-z0-9-]+$/);
  }
});

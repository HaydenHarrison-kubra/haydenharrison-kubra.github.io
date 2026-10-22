---
title: "Forms"
blurb: "Field labels, placeholders, checkboxes, radios, and toggles."
topics: ["Accessibility"]
---

This section covers form-wide principles and guidance specific to each input type: field labels, placeholder text, checkboxes, radio buttons, and toggles.

## Form titles

Form titles should clearly describe the purpose of the form, stay concise, and use sentence case.

## Field labels

Field labels identify the data being entered. They are always visible and are never replaced by placeholder text. Use nouns or noun phrases (not actions), sentence case, and no articles or trailing punctuation unless needed for clarity.

::: do

- *Card number*
- *Billing address*
- *Payment amount*

:::

::: dont

- *Primary account number (unless the audience is technical/admin)*
- *Enter billing address*
- *The account number:*

:::

### Tone in payment and compliance flows

Field labels should sound factual, not conversational. Avoid second-person phrasing ("your"), urgency, and marketing language — those tones belong in helper text or system messaging, not labels.

::: do

- *Payment amount*
- *Account number*
- *Expiration date*

:::

::: dont

- *How much do you want to pay?*
- *Customer financial identifier*
- *Secure payment amount*

:::

### Accessibility

Labels must be programmatically associated with their input, stay visible at all times, and make sense when read alone — avoid positional language ("above," "below"). If a label needs more explanation, add helper text rather than lengthening the label. (See Placeholder Text for how labels and placeholders work together.)

## Placeholder text

Labels identify the field. Placeholders guide input. Placeholder text disappears — important information must not. Use placeholders to reduce errors, not to explain concepts.

::: details More detail

Use placeholder text to show format or a valid example. Do not use it to explain what a field is for, communicate requirements, or replace helper text. **Never replace or repeat the label.**

:::

### Format examples

Always show the expected format for structured data:

- Dates: MM/DD/YYYY
- Time: HH:MM AM/PM
- Phone: (XXX) XXX-XXXX
- Email: name@example.com (generic, non-real)
- Currency: 100.00 (no symbol unless the field requires one)
- Search: Search transactions
- Dropdowns: Select a payment method

::: details More detail

*Avoid vague prompts ("Enter date," "Choose one," "Type here") and ambiguous or real-looking examples ("3/15/26," "4111 1111 1111 1111").*

:::

### Singular vs. plural

Use parenthetical pluralization only when a field genuinely accepts one or multiple values — Enter keyword(s), Upload file(s).

::: details More detail

When multiple values are always expected, use the standard plural instead — Add tags, not Add tag(s).

:::

### Accessibility

Placeholder text isn't reliably announced by screen readers, disappears once a user starts typing, and has lower contrast by default. Never put required instructions only in a placeholder — pair it with a label and, where accuracy matters, helper text.

## Checkboxes

Checkboxes let users select one or more independent options — preferences, optional settings, consent, filters, and feature configuration. Use a checkbox when the user can select zero, one, or multiple options and the action doesn't need immediate confirmation.

::: details More detail

For mutually exclusive choices, use radio buttons instead.

:::

### Structure and tone

Use sentence case and complete phrases that are clear on their own. Checkbox labels are neutral and descriptive, like field labels — but may include a verb when the checkbox enables or activates something.

::: do

- *Save payment method for future use*
- *Receive payment reminders*

:::

::: dont

- *SAVE PAYMENT METHOD FOR FUTURE USE*
- *Service fee (unclear what checking it does)*

:::

### Multiple checkbox options

Keep sentence case and grammatical structure consistent across a list — don't mix fragments and full sentences.

### Helper text and accessibility

Add helper text beneath checkboxes with financial or technical implications (e.g., Save payment method for future use — Helper text: Your card will be stored securely for future payments). The clickable area must include both the checkbox and its full label text, and the label must stand alone — avoid vague labels like "I agree" or "Yes" without context.

## Radio buttons

Use radio buttons when only one option can be selected and all options should be visible at once.

::: details More detail

Don't use them when multiple selections are allowed (use checkboxes instead) or there are too many options to display comfortably.

:::

### Group label and option structure

Group labels are neutral and descriptive, never phrased as a question. Options are short nouns or noun phrases in sentence case, not full sentences — radio buttons are selections, not conversational responses.

::: do

- *Payment method*
- *Credit card*
- *Bank transfer*
- *PayPal*

:::

::: dont

- *How would you like to pay?*
- *Bill me monthly*

:::

### Parallel structure and payment clarity

All options in a group must share the same grammatical structure, and when options carry different financial impact, that difference must be explicit.

::: do

- *One-time payment*
- *Recurring monthly payment*

:::

::: dont

- *One-time*
- *Monthly*

:::

::: details More detail

*If context alone doesn't clarify the impact, add brief helper text (e.g., for Billing frequency: Annual billing includes a 10% discount).*

:::

### Accessibility and common mistakes

Groups need a programmatically associated label, keyboard navigation, and a clearly announced selected state — never rely on color alone. Every option should make sense read alone; avoid "first option" or "second option."

::: details More detail

Common mistakes: framing options conversationally, mixing structures, and using marketing language in billing choices.

:::

## Toggles

Toggles turn a persistent setting on or off. Use them only when the setting is independent, the effect is reversible, and the change is immediate or clearly saved — otherwise use a confirmation dialog.

### Label the state being enabled, not the action

Describe the state that results when the toggle is ON. Don't describe the act of toggling, and don't describe the OFF state — the label should never change with the state.

::: do

- *AutoPay*
- *Receive payment reminders*
- *Paperless billing*

:::

::: dont

- *Turn on AutoPay*
- *Disable AutoPay*
- *AutoPay (On)*

:::

*Toggles must announce their on/off state to assistive technology and never encode it in the label text.*

::: details More detail

*Unlike field labels, toggles may start with a verb because they describe enabling a state. Keep tone neutral and functional — avoid phrases like "Stay in the loop."*

:::

### When not to use a toggle

Avoid toggles for destructive actions, one-time confirmations, payment submissions, or legal acknowledgment — use a confirmation dialog or explicit button instead.

::: details More detail

If the user is selecting options in a form before submitting, use checkboxes; if the choice is immediate and persistent, use a toggle.

:::

## Helper text

Use helper text when input format is complex, the field has financial or legal implications, or extra explanation improves accuracy. Keep it neutral and factual, and don't duplicate the label.

::: details More detail

- Routing number — Helper text: Must be 9 digits.
- Payment amount — Helper text: Enter the amount you want to pay.

:::

## Required vs. optional fields

Don't label every field "required." Indicate optional fields when needed, and note required selections at the form level rather than encoding "required" into a label, checkbox, or group heading.

::: do

- *Phone number (optional)*
- *Form-level instruction: "You must accept the Terms and Conditions to continue."*

:::

::: dont

- *Payment method (required)*
- <em>\*Payment method</em>
- *Asterisk-only indicators*

:::

## Grouping and layout

Group related fields together logically — payment details, billing address, contact information — and use headings or spacing to separate sections.

::: details More detail

Avoid overwhelming users with long, unstructured forms.

:::

## Accessibility

Forms must be fully keyboard navigable, use visible and persistent labels, associate labels programmatically with their inputs, provide clear and actionable error messages, and never rely on color or position ("field above") for meaning. This aligns with WCAG guidelines and common industry patterns, including Material, Apple HIG, and Microsoft.

## Special characters and plurals

Across labels, checkboxes, and radio buttons: no slashes, no parenthetical plurals (aside from the placeholder exception above), and no ampersands or undefined abbreviations.

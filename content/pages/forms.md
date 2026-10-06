---
title: "Forms"
blurb: "Field labels, placeholders, checkboxes, radios, and toggles."
topics: ["Accessibility"]
---

This section covers form-wide principles and guidance specific to each input type: field labels, placeholder text, checkboxes, radio buttons, and toggles.

## Form Titles

Form titles should clearly describe the purpose of the form, stay concise, and use title case.

## Field Labels

Field labels identify the data being entered. They are always visible and are never replaced by placeholder text. Use nouns or noun phrases (not actions), sentence case, no articles or trailing punctuation unless needed.

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

### Tone in Payment and Compliance Flows

Field labels should sound factual, not conversational. Avoid second-person phrasing ("your"), urgency, and marketing language.

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

Labels must be programmatically associated with their input, stay visible at all times, and make sense when read alone — avoid positional language ("above," "below").

## Placeholder Text

Labels identify the field. Placeholders guide input. Placeholder text disappears — important information must not. Use it to show format or a valid example, never to explain concepts or replace helper text.

### Format Examples

- Dates: MM/DD/YYYY
- Time: HH:MM
- Phone: (XXX) XXX-XXXX
- Email: name@example.com (generic, non-real)
- Currency: 100.00 (no symbol unless the field requires one)
- Search: Search transactions
- Dropdowns: Select a payment method

*Avoid vague prompts ("Enter date," "Choose one," "Type here") and real-looking examples ("4111 1111 1111 1111").*

### Singular vs. Plural

Use parenthetical pluralization only when a field genuinely accepts one or multiple values — "Enter keyword(s)," "Upload file(s)." When multiple values are always expected, use the standard plural — "Add tags," not "Add tag(s)."

### Accessibility

Placeholder text isn't reliably announced by screen readers, disappears once typing starts, and has lower contrast by default. Never put required instructions only in a placeholder.

## Checkboxes

Let users select one or more independent options. Use when the user can select zero, one, or multiple options and the action doesn't need immediate confirmation. For mutually exclusive choices, use radio buttons.

::: do

- *Save payment method for future use*
- *Receive payment reminders*

:::

::: dont

- *SAVE PAYMENT METHOD FOR FUTURE USE*
- *Service fee (unclear what checking it does)*

:::

Add helper text beneath checkboxes with financial or technical implications. The clickable area must include both the checkbox and its full label text; avoid vague labels like "I agree" or "Yes" without context.

## Radio Buttons

Use when only one option can be selected and all options should be visible at once. Group labels are neutral and descriptive, never phrased as a question.

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

When options carry different financial impact, that difference must be explicit — add helper text if context alone doesn't clarify.

## Toggles

Turn a persistent setting on or off. Use only when the setting is independent, reversible, and the change is immediate or clearly saved.

### Label the State Being Enabled, Not the Action

::: do

- *Enable autopay*
- *Receive payment reminders*
- *Use paperless billing*

:::

::: dont

- *Turn on autopay*
- *Disable autopay*
- *Enable autopay (On)*

:::

Avoid toggles for destructive actions, one-time confirmations, payment submissions, or legal acknowledgment — use a confirmation dialog or explicit button instead.

## Helper Text

Use when input format is complex, the field has financial or legal implications, or extra explanation improves accuracy. Keep it neutral and factual; don't duplicate the label.

## Required vs. Optional Fields

Don't label every field "required." Indicate optional fields when needed, and note required selections at the form level.

::: do

- *Phone number (optional)*
- *Form-level instruction: "You must accept the Terms and Conditions to continue."*

:::

::: dont

- *Payment Method (required)*
- <em>\*Payment Method</em>
- *Asterisk-only indicators*

:::

## Accessibility

Forms must be fully keyboard navigable, use visible and persistent labels, associate labels programmatically with inputs, provide clear and actionable error messages, and never rely on color or position for meaning.

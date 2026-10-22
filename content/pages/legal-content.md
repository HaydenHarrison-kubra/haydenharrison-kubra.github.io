---
title: "Legal Content"
blurb: "Tone, consent language, and escalation triggers."
topics: ["Payments"]
---

## Accuracy overrides style

Legal meaning must never be altered for tone, brevity, or readability.

- Do not paraphrase legal text without approval
- Do not simplify language if it changes meaning
- Do not remove qualifiers (e.g., "may", "subject to", "up to")

If clarity and compliance conflict, escalate for legal review.

## Tone and voice

Legal content follows a more formal tone than UI copy but should still align with clarity standards. Legal tone should be neutral, precise, formal, and non-conversational.

::: dont

- *Friendly or casual phrasing*
- *Marketing tone*
- *Humor or reassurance*

:::

### Fees

::: do

- *A service fee of $2.50 will be added to this payment.*

:::

::: dont

- *Additional fees may apply*
- *A small fee may be charged*

:::

## Placement guidelines

Legal content should appear before the action it governs, close to the relevant interaction, and in a consistent location across flows.

::: details More detail

**Examples:** near payment confirmation, near consent checkboxes, in confirmation dialogs.

:::

## Separate legal content from UI copy

Legal content should not be embedded inside field labels, buttons, toggle labels, or inline errors. Instead, use helper text, linked documents, or dedicated sections or modals.

::: details More detail

This prevents cognitive overload and maintains clarity.

:::

## Consent and agreement language

Consent must be explicit, clear, unambiguous, and actionable.

### Timing

::: do

- *Payments will be processed on the due date.*
- *Funds typically appear within 3 to 5 business days.*

:::

::: dont

- *Soon*
- *Shortly*

:::

## When to escalate

Escalate to legal or compliance teams when introducing new financial terms, modifying fee language, changing refund or cancellation policies, adjusting consent or authorization wording, or translating legal content. Do not independently rewrite legal text.

## Keep legal content clear and scannable

Even when legally required, content should be structured, broken into sections, and easy to scan.

::: details More detail

Use short paragraphs, lists where appropriate, and clear headings. Avoid large blocks of dense text.

:::

### Checkbox pattern (required)

::: do

- *I agree to the [Terms and Conditions](#legal-content/linking-legal-documents)*

:::

::: dont

- *Agree*
- *I accept*

:::

The label must make sense when read independently.

## Conditional language

Use precise qualifiers when required. Do not remove qualifiers like "may" if legally required.

::: do

- *A late fee may apply if payment is not received by 11:59 PM ET on March 20.*

:::

## Common mistakes to avoid

Avoid changing, mixing, or hiding legal content.

::: details More detail

- Simplifying legal content without approval
- Mixing legal and instructional text
- Hiding legal content behind interactions
- Using inconsistent terminology
- Adding tone or personality to legal copy

:::

## Do not hide legal information

Legal content must be visible when relevant, accessible before user action, and not hidden behind tooltips or hover states. Users must be able to review legal terms before submitting payment, enabling AutoPay, or accepting agreements.

## Linking legal documents

Legal document names are proper nouns. Use the official name, capitalized as shown below, and link it to the document every time it appears, including in consent language, disclosures, and SMS opt-in copy.

- Terms of Use
- Terms and Conditions
- Privacy Policy

::: do

- *Read the Terms and Conditions*
- *View Privacy Policy*
- *See ABC Company’s Terms of Use (as a link)*

:::

::: dont

- *Read the terms and conditions*
- *Terms & Conditions · T&Cs*
- *Privacy Policy (as plain, unlinked text)*

:::

## Financial disclosures

Disclosures must be specific, use consistent terminology, and avoid vague phrasing.

## Recurring payments (AutoPay)

AutoPay and recurring billing require special care. Content must clearly state that payments are automatic, when payments occur, and how to cancel.

::: do

- *AutoPay — Helper text: Payments will be automatically processed on your due date each month. You can turn off AutoPay anytime in Settings.*

:::

::: dont

- *Automatic payments enabled*
- *Payments will be handled*

:::

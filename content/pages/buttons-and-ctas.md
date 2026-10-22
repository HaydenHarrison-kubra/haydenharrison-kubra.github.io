---
title: "Buttons and CTAs"
blurb: "Action-oriented, accessible button copy."
topics: ["Accessibility", "Payments"]
---

Buttons initiate actions. In payment and billing flows, they often authorize transactions, confirm irreversible changes, or move users forward in critical processes. Button copy must be clear, action-driven, specific, consistent, and unambiguous about impact.

## Use clear, action-oriented language

Buttons should describe what will happen when selected, not what the user is doing.

::: do

- *Pay bill*
- *Save changes*
- *Confirm payment*
- *Download statement*

:::

::: dont

- *Submit*
- *Continue*
- *OK*
- *Done*

:::

::: details More detail

The goal is to avoid vague or abstract labels, as generic CTAs increase uncertainty in financial flows.

:::

## Keep button text concise

How long a label can be depends on the button style. Avoid punctuation unless required.

| Button style | Label length |
|---|---|
| Buttons with a container (filled or outlined) | Aim for 1–2 words, 3 at most when needed for clarity |
| Text-only buttons (no background or border, like tertiary or link-style buttons) | Up to 5 words when needed for clarity |

::: do

- *Cancel payment*
- *Add payment method*
- *View details*
- *View full payment history (text-only button)*

:::

::: dont

- *Click here to continue*
- *Proceed to the next step*
- *Review and confirm your scheduled payment (too long for any button)*

:::

## Use sentence case

Buttons follow sentence case. Capitalize proper nouns only.

::: do

- *Pay bill*
- *Save payment method*

:::

::: dont

- *Pay Bill*
- *PAY BILL*

:::

## Primary button

Represents the main action on the screen.

- Must clearly state the primary outcome
- Should never be vague
- Should not require interpretation

## Secondary button

Used for cancellation or navigation away from the primary action. Use: **Cancel** or **Go back**.

::: details More detail

**Avoid mixing intent:** if the primary action is **Cancel payment**, do not use **Cancel** as the secondary button. Instead, if the primary button is **Cancel payment**, the secondary button should be **Go back**. This prevents ambiguity.

:::

## Destructive or irreversible actions

When a button performs a destructive action:

- The label must clearly state the consequence
- Avoid generic confirmation labels

::: do

- *Delete payment method*
- *Cancel scheduled payment*
- *Remove bank account*

:::

::: dont

- *Confirm*
- *Delete (without object — the object must be included)*

:::

## Avoid "Yes" and "No" buttons

Yes/No buttons are ambiguous and inaccessible when read out of context. Use buttons like **Confirm payment** and **Cancel payment** — this aligns with accessibility best practices and reduces cognitive load.

## Accessibility considerations

Buttons must be keyboard accessible, have clear accessible names, and make sense when read aloud independently — not relying on surrounding text.

::: do

- *View transaction details*
- *Read Terms and Conditions*

:::

::: dont

- *Click here*
- *Learn more*
- *Continue*

:::

## Avoid the word "Click"

Do not use "click" in button copy — users may be on mobile or assistive devices, "click" is device-specific, and the button already implies interaction.

## Tone and voice

Button copy should be direct, neutral, calm, and confident. Buttons are transactional, not conversational.

## Button hierarchy consistency

Across the product:

- Use consistent terminology for the same action
- Do not vary between "Cancel," "Go back," and "Back" without reason
- Do not introduce synonyms casually

::: details More detail

Consistency builds trust in financial systems.

:::

## Button copy length and layout

Do not shorten buttons to fit layout at the expense of clarity.

::: details More detail

If the copy becomes too long: reevaluate the action, use a confirmation dialog, or adjust layout. Clarity overrides visual compactness.

:::

## Common mistakes to avoid

- Using generic CTAs in financial flows
- Hiding destructive action behind vague language
- Mixing terminology across flows
- Using "Yes/No"
- Using punctuation for emphasis
- Using marketing tone

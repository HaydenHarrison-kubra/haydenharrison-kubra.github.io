---
title: "Formatting"
blurb: "Bold, italics, underline, caps, monospace, and color."
---

Formatting is how we add structure and emphasis without adding words. Like voice, our approach to formatting stays consistent regardless of context.

## Principles

### Purposeful

Every formatting choice must carry meaning. Formatting is a signal, not decoration. If removing the formatting doesn't change the meaning, remove it. Reserve each style for a single, predictable job.

::: do

- *"Your payment of **$1,250.00** is due **March 15**."*

:::

::: dont

- *"Your payment is due **soon**, so please make sure to **pay it on time**."*

:::

### Consistent

The same kind of information is formatted the same way everywhere. Format amounts, dates, and system states the same way across every surface. Don't mix conventions within a single screen.

::: do

- *"Payment pending" · "Payment scheduled" · "Payment completed"*

:::

::: dont

- *"Payment pending" · "PAYMENT SCHEDULED" · "Payment completed"*

:::

### Accessible

Formatting must work for screen readers, high-contrast modes, and users who adjust text size. Never rely on styling alone to convey meaning. Pair color or weight with a text label or icon.

::: do

- *Red text and the label "Payment failed."*

:::

::: dont

- *Red text alone to imply something went wrong.*

:::

## Formatting by Element

Each element below has one primary job. Use it for that job only.

### Bold

Bold draws the eye to the single most important piece of information on a screen. Use for critical data users must not miss: amounts, due dates, deadlines. Limit to one idea per screen.

::: do

- *"Transfer **$500.00** to your linked account."*

:::

::: dont

- *"Transfer **$500.00** to your **linked account** before the **deadline** shown above."*

:::

### Italics

Italics reduce readability and are difficult for many users, including those with dyslexia. Use rarely — acceptable only when referring to a word or term as itself. Never use italics in error, legal, or PCI-related content.

::: do

- *"The status processing means the payment has not yet cleared."*

:::

::: dont

- *"Your payment is still processing and may take some time."*

:::

### Underline

Underlines signal links. Nothing else. Never underline for emphasis, or users will read it as a broken or unresponsive link.

::: do

- *"See your full transaction history." (as a link)*

:::

::: dont

- *"This payment is <u>final</u> and cannot be reversed."*

:::

### All Caps

Never, under any circumstances, use capitalization as a formatting tool. It reads as shouting and is announced awkwardly by screen readers.

::: do

- *"Payment failed. Please try again."*

:::

::: dont

- *"PAYMENT FAILED. PLEASE TRY AGAIN."*

:::

### Monospace / Code

Use a monospace style for strings users must read or copy exactly — reference IDs, confirmation codes, and error codes. Do not use monospace for ordinary numbers, amounts, or dates.

::: do

- *"Reference your transaction ID `TXN-99432` when contacting support."*

:::

::: dont

- *"Your payment of `$1,250.00` is due soon."*

:::

### Color

Color reinforces meaning but never carries it alone. Always pair color with text, an icon, or both.

::: do

- *Green checkmark and "Payment completed."*

:::

::: dont

- *A green dot with no label to indicate success.*

:::

## Guidelines

### Emphasis Restraint

Emphasis works only when it's scarce. Limit emphasis to one primary point per screen or message. Don't stack styles (bold and italic and color) on the same element.

::: do

- *"Your account will be charged **$49.00** on the 1st of each month."*

:::

::: dont

- *"Your account will be charged **$49.00** on the **1st of each month**."*

:::

### Formatting in Sensitive Content

In legal, compliance, and PCI flows, formatting must not introduce ambiguity. Keep legal and compliance text in plain, unstyled prose unless a label is genuinely required.

::: do

- *"You cannot cancel this payment after submission."*

:::

::: dont

- *"You **cannot** cancel this payment after submission."*

:::

### What to Avoid (Across All Contexts)

- Bolding entire sentences or paragraphs
- Italics for emphasis
- Underlines on anything that isn't a link
- All caps as a substitute for emphasis
- Color, weight, or styling as the only signal of meaning
- Mixing formatting conventions within one surface
- Decorative formatting that adds no meaning

### When in Doubt

1. Default to no formatting — plain text is the baseline.
1. Add emphasis only when it changes what the user notices first.
1. Use the element built for the job (bold for emphasis, monospace for codes, underline for links).
1. Match the pattern already used elsewhere in the product.

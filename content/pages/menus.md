---
title: "Menus"
blurb: "Dropdown structure, labels, and option ordering."
topics: ["Accessibility", "Payments"]
---

## Dropdown structure

A dropdown includes:

1. A field label
1. A placeholder or default value
1. A list of options

Each component must be clear and consistent.

## Field label

Follow the Field Label guidelines: sentence case, neutral noun phrase, no punctuation, no verbs, no instructional phrasing.

::: do

- *Payment method*
- *Country*
- *Billing frequency*

:::

::: dont

- *Choose payment method*
- *Select a country*
- *Billing Frequency*

:::

## Dropdowns

Dropdown menus allow users to select one option from a list of choices. Unlike radio buttons, options are hidden until the user opens the menu.

**Dropdowns should be used when:**

- There are more options than can be displayed comfortably as radio buttons
- Only one option can be selected

Prefer radio buttons for high-risk choices. If a dropdown is unavoidable, follow High-risk payment dropdowns below.

*If the decision has financial impact or requires comparison between a small number of options, use radio buttons instead.*

## High-risk payment dropdowns

Some dropdowns require additional clarity.

### 1. Payment method

::: do

- *Label: Payment method*
- *Placeholder: Select a payment method*
- *Options: Credit card, Bank account (ACH), PayPal*

:::

::: dont

- *Card*
- *Bank*
- *ACH (unless defined for that audience)*

:::

### 2. Account selection

When users have multiple accounts, include identifying information to prevent mistakes.

::: do

- *Checking account ending in 1234*
- *Savings account ending in 5678*

:::

::: dont

- *Checking*
- *Savings (ambiguity increases financial risk)*

:::

### 3. Date or billing cycle

The financial impact must be explicit.

::: do

- *One-time payment*
- *Recurring monthly payment*

:::

::: dont

- *Monthly*
- *One-time*

:::

## Placeholder text

Dropdown placeholder text must begin with "Select," clearly indicate the action required, and not repeat the label verbatim.

::: do

- *Label: Country → Placeholder: Select a country*
- *Label: Payment method → Placeholder: Select a payment method*

:::

::: dont

- *Choose one*
- *Please select*

:::

::: details More detail

Placeholders should guide action without sounding conversational.

:::

## Alphabetical and logical ordering

Organize dropdown options logically: alphabetically (countries, names, static lists), chronologically (date ranges), by frequency of use (if data supports it), or by order of importance.

::: details More detail

Be consistent across similar dropdowns in the product.

:::

## Option labels

Options within a dropdown must be sentence case, parallel in structure, concise, and clear when read independently.

### Structure

Options are typically noun phrases.

::: do

- *Credit card*
- *Bank transfer*
- *PayPal*

:::

::: dont

- *Pay with credit card*
- *Use bank transfer*
- *PayPal option*

:::

## Accessibility requirements

Dropdowns must be keyboard navigable, have clear focus states, and announce expanded/collapsed and selected state. Writers must ensure options make sense read alone, don't rely on visual grouping alone, and placeholder text is meaningful.

::: dont

- *Select the option at the top*
- *Choose the first item*

:::

## When to use a dropdown vs. radio buttons

Use a dropdown when there are more than ~5–7 options, screen space is limited, or the options do not require comparison. Use radio buttons when there are fewer options, financial consequences differ, or comparison improves clarity. *In payment flows, if a decision affects money movement, default to radio buttons when possible.*

## Voice and tone

Dropdowns are neutral and functional. They should not be conversational, contain marketing language, imply urgency, or contain emotional phrasing.

::: details More detail

Keep tone consistent with field labels.

:::

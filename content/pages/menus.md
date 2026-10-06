---
title: "Menus"
blurb: "Dropdown structure, labels, and option ordering."
topics: ["Accessibility", "Payments"]
---

## Dropdown Structure

A dropdown includes a field label, a placeholder or default value, and a list of options. Each component must be clear and consistent.

## Field Label

Sentence case, neutral noun phrase, no punctuation, no verbs, no instructional phrasing.

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

Use when there are more options than can be displayed as radio buttons, only one option can be selected, and the choice is not time-sensitive or high-risk. If the decision has financial impact, use radio buttons instead.

## High-Risk Payment Dropdowns

### 1. Payment Method

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

### 2. Account Selection

::: do

- *Checking account ending in 1234*
- *Savings account ending in 5678*

:::

::: dont

- *Checking*
- *Savings (ambiguity increases financial risk)*

:::

### 3. Date or Billing Cycle

::: do

- *One-time payment*
- *Recurring monthly payment*

:::

::: dont

- *Monthly*
- *One-time*

:::

## Placeholder Text

Must begin with "Select," clearly indicate the action required, and not repeat the label verbatim.

::: do

- *Label: Country → Placeholder: Select a country*
- *Label: Payment method → Placeholder: Select a payment method*

:::

::: dont

- *Choose one*
- *Please select*

:::

## Alphabetical and Logical Ordering

Organize dropdown options alphabetically (countries, names, static lists), chronologically (date ranges), by frequency of use, or by order of importance. Be consistent across similar dropdowns.

## Option Labels

Sentence case, parallel in structure, concise, clear when read independently — typically noun phrases.

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

## When to Use a Dropdown vs. Radio Buttons

Use a dropdown when there are more than ~5–7 options, screen space is limited, or options don't require comparison. Use radio buttons when there are fewer options, financial consequences differ, or comparison improves clarity. In payment flows, default to radio buttons when a decision affects money movement.

---
title: "Plurals"
blurb: "Standard plurals vs. parenthetical (s) usage."
---

Clear pluralization helps users understand quantity, capability, and expectation — especially in forms, tables, and transactional interfaces. Inconsistent or decorative pluralization can introduce confusion or visual clutter.

## Governing principle

Pluralization should communicate meaning, not style.

Use plurals to clarify:

- Whether one or many items are allowed
- Whether a list represents a collection
- Whether an action affects multiple entities

Avoid plurals that exist only to "cover all cases."

## Standard plural usage

When a label, heading, or message refers to more than one item, use the standard plural form without punctuation.

::: do

- *Payments · Accounts · Transactions*

:::

::: dont

- *Payment(s) · Account(s)*

:::

::: details More detail

This aligns with Material and Microsoft guidance: parenthetical plurals should be avoided unless they convey functional meaning.

:::

## Parenthetical plurals (limited, intentional use)

Parenthetical plurals — `(s)` / `(es)` — are allowed only when they communicate input flexibility, not when displaying information. Only use `(s)` when involving actions; read-only content should use the plural version.

**Approved use:** input instructions or placeholders where the field explicitly supports one or multiple values.

::: do

- *Enter keyword(s)*
- *Upload file(s)*
- *Add reference ID(s)*

:::

::: dont

- *Transaction(s)*
- *Select option(s)*
- *File(s) uploaded successfully*

:::

::: details More detail

In form inputs, parentheticals can reduce verbosity without misleading users.

**Do not use parenthetical plurals in:**

- Headings or subheadings
- Menu items or navigation
- Button labels
- Table headers
- Success, error, or warning messages

:::

## Displayed content vs. input content

**When displaying data.** If the UI displays multiple items (tables, summaries, lists), use the standard plural form.

::: do

- *Payment methods · Active workspaces*

:::

**When only one item is expected.** Use the singular form, even if future expansion is possible.

::: do

- *Payment method*

:::

::: dont

- *Payment method(s)*

:::

## Consistency rules

- Do not mix singular and plural forms within the same UI surface
- Use the same plural form for the same concept across similar experiences
- Avoid switching pluralization to solve layout issues — adjust layout instead

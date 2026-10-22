---
title: "Lists"
blurb: "Bulleted vs. numbered, consistency, and accessibility."
topics: ["Accessibility"]
---

Lists should make complex information easier to scan, never harder to interpret. In payment systems, clarity in lists directly supports trust and accuracy.

## Bulleted lists

Use when items can appear in any order, do not represent sequence, and do not imply priority. **Examples:** features, benefits, filter options, system capabilities.

## Numbered lists

Use when items must be completed in order, represent a sequence, or indicate ranking or priority. **Examples:** payment steps, verification process, setup instructions. *Do not use numbered lists for unordered content.*

## Consistency is mandatory

All items within a list must follow the same grammatical structure. Choose one format — all sentence fragments, or all complete sentences — and apply it consistently. *Never mix.*

### 1. Sentence fragment list

::: do

- *Enter your payment details*
- *Review the transaction summary*
- *Confirm the payment*

:::

::: dont

- *Enter your payment details*
- *Review the transaction summary.*
- *Confirm the payment (no mixing punctuation or form)*

:::

### 2. Complete sentence list

::: do

- *Enter your payment details.*
- *Review the transaction summary.*
- *Confirm the payment. (If one item requires a period, all must use periods.)*

:::

## Capitalization

- Capitalize the first letter of the first word in each item.
- Use sentence case unless proper nouns apply.

## List length

Lists should be concise, contain only essential information, and avoid long paragraphs.

::: details More detail

*If a list item exceeds two lines, reconsider structure. For complex content, use subheadings instead.*

:::

## Parallel structure

Parallel structure improves clarity and accessibility.

::: do

- *One-time payment*
- *Recurring monthly payment*

:::

::: dont

- *Pay once*
- *Recurring monthly payment (each item must follow the same grammatical pattern)*

:::

## Accessibility considerations

Lists must be structured using semantic HTML (not visually formatted text), not rely on visual indentation alone, and avoid positional references ("first option above"). For numbered lists, do not refer to the item by number in body text — if order changes, references break.

## Error summary lists

Error summaries should identify the field, briefly state the issue, and link to the affected field.

::: do

- *Card number must be 16 digits.*
- *Expiration date is required.*

:::

::: dont

- *Invalid input*
- *Please correct the errors below*

:::

## Instructional lists

When guiding a user through payment steps, avoid conversational transitions in structured steps.

::: do

1. *Enter your payment details.*
1. *Review the transaction summary.*
1. *Confirm the payment.*

:::

::: dont

- *First, enter your payment details…*
- *Then review the transaction summary…*
- *Finally, confirm the payment*

:::

## Avoid these common mistakes

- Mixing fragments and sentences
- Inconsistent punctuation
- Overly long list items
- Vague or abstract phrasing
- Referring to list position instead of content
- Using decorative symbols

## Special characters and plurals

Follow global rules: no slashes, no parenthetical plurals, avoid ampersands, no decorative punctuation.

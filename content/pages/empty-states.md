---
title: "Empty States"
blurb: "Onboarding, no-results, and system-limited states."
---

An empty state appears when a page, table, or section has no data to display. Empty states guide users when content is missing, unavailable, or not yet created. Across KUBRA products, empty states should be clear, instructive, and actionable. They should reduce uncertainty and help users understand what to do next.

## Purpose of an empty state

An effective empty state should:

1. Explain why nothing is displayed
2. Clarify whether this is expected
3. Provide next steps when applicable

Empty states should never leave users wondering whether something is broken.

## Types of empty states

### 1. First-time empty state (onboarding)

Occurs when a user has not yet created or configured anything. **Goal:** encourage setup or creation. These states should guide users toward the primary action.

::: do

- *"No workspaces yet" — Create workspace*
- *"No saved payment methods" — Add payment method*

:::

### 2. No results empty state (filtered/search)

Occurs when a search or filter returns no matches. **Goal:** help users adjust input. Avoid implying system failure.

::: do

- *"No \[thing\] found. Try adjusting your filters or search terms."*
- *If there are no filters, use: "Try adjusting your search terms"*

:::

### 3. System-limited empty state

Occurs when data is unavailable due to configuration, permissions, or environment limitations. **Goal:** clarify context. If the issue blocks progress, escalate to an error instead.

::: do

- *"No data available for this date range"*
- *"You don't have access to this workspace"*

:::

## Tone

Empty states should be neutral, supportive, and direct. Avoid humor, filler, or marketing tone.

::: details More detail

FANG guidance consistently favors practical, supportive language over playful copy in productivity tools.

:::

::: do

- *"No reports available"*

:::

::: dont

- *"Looks like it's a little empty in here!"*

:::

## Structure

Empty states can include a short header, supporting body text (optional), and a primary CTA (if action is possible). Keep empty states concise and avoid large blocks of text.

### Simple empty state (single sentence)

Use when no additional explanation is needed. No period needed.

::: do

- *"No transactions available"*

:::

### Instructional empty state (header + body + CTA)

Use when user action is expected.

::: do

**Header:** No map layers added

**Body:** Add a layer to display data on the map.

**CTA:** Add layer

:::

## CTAs in empty states

- Use clear, action-driven verbs
- Keep CTAs short (1–2 words)
- Avoid vague CTAs like "OK" or "Learn more" unless contextually appropriate

::: do

- *Add layer*
- *Create report*

:::

::: dont

- *Get started now!*

:::

## Length and punctuation

- Keep text concise and scannable
- Avoid exceeding one short paragraph
- Do not use a period for single-sentence fragments
- Use punctuation only when multiple sentences are necessary

## What to avoid

- Vague statements ("Nothing here yet")
- Emotional tone
- Over-explaining system behavior
- Repeating visible UI labels
- Using empty states to promote unrelated features

::: do

- *"No scheduled payments"*

:::

::: dont

- *"Oops! You don't have anything here yet."*

:::

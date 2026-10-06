---
title: "Empty States"
blurb: "Onboarding, no-results, and system-limited states."
---

An empty state appears when a page, table, or section has no data to display. Empty states should be clear, instructive, and actionable, and should never leave users wondering whether something is broken.

## Types of Empty States

### 1. First-Time Empty State (Onboarding)

Occurs when a user has not yet created or configured anything. **Goal:** encourage setup or creation.

::: do

- *"No workspaces yet" — Create workspace*
- *"No saved payment methods" — Add payment method*

:::

### 2. No Results Empty State (Filtered/Search)

Occurs when a search or filter returns no matches. **Goal:** help users adjust input. Avoid implying system failure.

::: do

- *"No \[thing\] found. Try adjusting your filters or search terms."*

:::

### 3. System-Limited Empty State

Occurs when data is unavailable due to configuration, permissions, or environment limitations. If the issue blocks progress, escalate to an error instead.

::: do

- *"No data available for this date range"*
- *"You don't have access to this workspace"*

:::

## Tone

Neutral, supportive, direct. Avoid humor, filler, or marketing tone.

::: do

- *"No reports available"*

:::

::: dont

- *"Looks like it's a little empty in here!"*

:::

## Structure

Can include a short header, supporting body text (optional), and a primary CTA (if action is possible).

### Simple Empty State (Single Sentence)

::: do

- *"No transactions available"*

:::

### Instructional Empty State (Header + Body + CTA)

::: do

**Header:** No map layers added

**Body:** Add a layer to display data on the map.

**CTA:** Add layer

:::

## CTAs in Empty States

Use clear, action-driven verbs; keep CTAs short (1–2 words); avoid vague CTAs like "OK" or "Learn more."

::: do

- *Add layer*
- *Create report*

:::

::: dont

- *Get started now!*

:::

## What to Avoid

- Vague statements ("Nothing here yet")
- Emotional tone
- Over-explaining system behavior
- Repeating visible UI labels
- Using empty states to promote unrelated features

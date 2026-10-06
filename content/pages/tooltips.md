---
title: "Tooltips"
blurb: "Brief, optional clarification — never required instruction."
topics: ["Errors & Messaging"]
---

A tooltip is a small, contextual overlay that provides additional information when a user hovers over or taps an element. Tooltips are used to clarify specific UI elements, not to deliver critical instructions or system messages. Users must be able to complete tasks without relying on tooltips.

## Purpose of a Tooltip

A tooltip should clarify a label, icon, or control; define unfamiliar terminology; provide concise, supporting information. Tooltips are supplemental — they should not introduce new workflows or required steps.

## When to Use a Tooltip

Use when a label or icon may be unclear, a term requires brief explanation, or a compact interface limits space for inline explanation. **Examples:** explaining a technical field (e.g., CNAME), clarifying a system state, defining domain-specific terminology.

## When Not to Use a Tooltip

Do not use when the information is critical to task completion, the message contains more than a few short lines, a warning/error/confirmation is required, or the information should be permanently visible. FANG guidelines discourage using tooltips for essential instructions because they are hidden by default and not always accessible on mobile.

## Tone

Neutral, informative, concise. Avoid conversational phrasing, filler, or promotional tone.

::: do

- *"Required for domain verification"*

:::

::: dont

- *"You'll want to make sure this is filled out correctly!"*

:::

## Structure, Length, and Punctuation

Keep tooltips short (ideally 1–3 lines, maximum 5), one idea per tooltip. Follow banner punctuation rules; avoid exclamation points.

## Content Guidelines

::: do

- Explain what the element does
- Define unfamiliar terms
- Keep language concrete and direct
- Make icon tooltips actionable when appropriate

*"Determines how often the data refreshes" · "Unique identifier assigned to this workspace"*

:::

::: dont

- Repeat the visible label
- Include unnecessary background information
- Add links or formatted text
- Rely on tooltips for compliance disclosures
- Overload the tooltip with technical detail

:::

## When in Doubt

1. Ask whether the information is optional
1. Confirm the user can complete the task without it
1. Ensure the explanation can be concise

If the information is essential, use inline text instead.

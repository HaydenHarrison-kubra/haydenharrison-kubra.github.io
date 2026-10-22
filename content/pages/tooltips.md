---
title: "Tooltips"
blurb: "Brief, optional clarification — never required instruction."
topics: ["Errors & Messaging"]
---

A tooltip is a small, contextual overlay that provides additional information when a user hovers over or taps an element. Tooltips are used to clarify specific UI elements, not to deliver critical instructions or system messages. Tooltips should be brief, precise, and optional. Users must be able to complete tasks without relying on tooltips.

## Purpose of a tooltip

A tooltip should:

- Clarify a label, icon, or control
- Define unfamiliar terminology
- Provide concise, supporting information

Tooltips are supplemental. They should not introduce new workflows or required steps.

## When to use a tooltip

Use a tooltip when:

- A label or icon may be unclear
- A term requires brief explanation
- A compact interface limits space for inline explanation

::: details More detail

**Examples:**

- Explaining a technical field (e.g., CNAME)
- Clarifying a system state or configuration option
- Defining domain-specific terminology

:::

## When not to use a tooltip

Do not use a tooltip when:

- The information is critical to task completion
- The message needs more than 5 lines
- A warning, error, or confirmation is required
- The information should be permanently visible

Avoid using tooltips for essential instructions because they are hidden by default and not always accessible on mobile. If the information is required for success, use inline instructional text instead.

## Tone

Tooltips should be neutral, informative, and concise. Avoid conversational phrasing, filler, or promotional tone.

::: do

- *"Required for domain verification"*

:::

::: dont

- *"You'll want to make sure this is filled out correctly!"*

:::

## Structure and length

- Standard tooltips use 4 words or fewer. Rich tooltips can run up to 5 lines. If it needs more, use inline instructional text instead.
- Use sentence fragments when appropriate
- Focus on one idea per tooltip

::: details More detail

Avoid multi-paragraph explanations or complex instructions.

:::

## Punctuation

Follow banner punctuation rules:

- Do not use a period if the tooltip is a single sentence or fragment
- Use punctuation only when the tooltip contains more than one sentence, or a comma improves clarity

Avoid exclamation points.

## Content guidelines

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

*Tooltip for "Workspace Name" that says "Enter the workspace name" · Including documentation links*

:::

## When in doubt

If the information is essential, use inline text instead.

::: details More detail

If you're unsure whether to use a tooltip:

1. Ask whether the information is optional
2. Confirm the user can complete the task without it
3. Ensure the explanation can be concise

:::

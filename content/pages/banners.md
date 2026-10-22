---
title: "Banners"
blurb: "Persistent, page-level messaging."
topics: ["Errors & Messaging"]
---

A banner is a persistent, system-level message that appears within a page or workflow to communicate important information. Banners are used to surface success, error, warning, or informational messages that are relevant to the current context. Banners persist for the duration of a session or until dismissed, and should be used sparingly to avoid message fatigue.

## When to use a banner

Use a banner when the message:

- Affects multiple elements on the page
- Is not tied to a single field or control
- Needs to remain visible as the user continues working
- Applies to the current session or state

::: details More detail

**Examples:**

- System maintenance notices
- Page-level errors
- Global configuration changes
- Non-blocking warnings or informational updates

:::

## When not to use a banner

Do not use a banner when:

- The message applies to a single field (use inline messaging)
- Immediate confirmation is required (use a dialog)
- The outcome is obvious or already visible
- The message would duplicate another message type

::: details More detail

Overusing banners reduces their effectiveness.

:::

## Structure and length

- Keep banners concise and focused
- Ideally no more than 3 lines
- Focus on a single idea or action

::: details More detail

**Longer explanations should be moved to:**

- Inline content
- Linked help articles
- Modals, if confirmation is required

:::

## Headers in banners

Use a header only when additional detail is necessary, such as:

- Consumer-facing experiences
- Complex or unfamiliar concepts
- Actions with downstream impact

::: do

- *"Maintenance in progress. Some features may be unavailable until 2:00 AM ET."*

:::

::: details More detail

Avoid headers for simple, self-explanatory messages.

:::

## Actions and links in banners

- Include a CTA only if the user needs to act
- Keep CTAs short (1–2 words)
- Use action-oriented verbs

::: do

- *View details*
- *Retry*

:::

::: dont

- *OK*

:::

::: details More detail

- Avoid vague actions like "OK" or "Learn more" unless contextually appropriate

Do not overload banners with multiple CTAs.

:::

## Punctuation

- Do not use a period if the banner message is a single sentence or fragment
- Use punctuation only when the banner contains multiple sentences, or a comma or clause improves clarity

This rule applies consistently across all banner types.

## Placement

- Place banners at the top of the affected page or section
- Keep banners visually close to the content they reference
- Avoid placing banners where they obscure primary actions

## When in doubt

Use a modal only when the user must make a decision before continuing. If a page-level action failed and the user can still move around, use an error banner.

::: details More detail

If you're unsure whether to use a banner:

1. Ask whether the message affects the entire page
2. Determine if the user can continue without responding
3. Identify the correct message type

:::

---
title: "Banners"
blurb: "Persistent, page-level messaging."
topics: ["Errors & Messaging"]
---

A banner is a persistent, system-level message that appears within a page or workflow to communicate important information. Banners persist for the duration of a session or until dismissed, and should be used sparingly to avoid message fatigue.

## When to Use a Banner

Use a banner when the message affects multiple elements on the page, is not tied to a single field or control, needs to remain visible as the user continues working, or applies to the current session or state. **Examples:** system maintenance notices, page-level errors, global configuration changes, non-blocking warnings or informational updates.

## When Not to Use a Banner

Do not use a banner when the message applies to a single field (use inline messaging), immediate confirmation is required (use a dialog), the outcome is obvious, or the message would duplicate another message type.

## Structure and Length

Keep banners concise and focused, ideally no more than 3 lines, one idea or action. Longer explanations should move to inline content, linked help articles, or modals.

## Headers in Banners

Use a header only when additional detail is necessary.

::: do

- *"Maintenance in progress. Some features may be unavailable until 2:00 AM ET."*

:::

## Actions and Links in Banners

Include a CTA only if the user needs to act; keep CTAs short (1–2 words); use action-oriented verbs.

::: do

- *View details*
- *Retry*

:::

::: dont

- *OK*

:::

## Punctuation

Do not use a period if the banner message is a single sentence or fragment. Use punctuation only for multiple sentences or clarity.

## Placement

Place banners at the top of the affected page or section, visually close to the content they reference, avoiding obscuring primary actions.

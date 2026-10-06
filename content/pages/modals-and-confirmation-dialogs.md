---
title: "Modals and Confirmation Dialogs"
blurb: "Structuring title, body, and CTAs for destructive actions."
topics: ["Errors & Messaging", "Payments"]
---

A modal interrupts the current workflow to require user attention or confirmation before proceeding. Confirmation dialogs are a specific type of modal used when an action may result in significant change, data loss, or irreversible impact. Because modals block progress, they should be used intentionally and sparingly.

## When to Use a Confirmation Dialog

Use when an action permanently deletes data, removes access or permissions, cancels payments or scheduled actions, affects multiple users/systems/environments, or cannot be easily undone. **Examples:** deleting a workspace, cancelling a scheduled payment, resetting map configurations, removing a shared access role.

## When Not to Use a Modal

Do not use when the action is low-risk and reversible, a warning banner is sufficient, the action is expected and routine, or the confirmation exists only to "double check."

## Structure of a Confirmation Dialog

A confirmation dialog typically includes a title, body copy, primary CTA, and secondary CTA.

### Title

State the action or consequence directly; be short and clear; avoid conversational phrasing. Do not ask "Are you sure?" — instead, state the action.

::: do

- *"Delete workspace?"*
- *"Cancel scheduled payment?"*
- *"Remove user access?"*

:::

::: dont

- *"Are you sure?"*

:::

### Body Copy

Explain the consequences, clarify scope, and indicate whether the action is reversible. Keep it concise and factual.

::: do

- *"Deleting this workspace will permanently remove all associated reports and user access."*

:::

::: dont

- *"This action may have consequences you should consider carefully."*

:::

### Primary and Secondary CTAs

**Primary CTA** — use a verb that clearly reflects the action: Delete, Cancel payment, Remove access. **Secondary CTA** — use "Cancel" for most interactions, or "Go back" when the primary action includes the word "Cancel," to prevent confusion (e.g., Primary: "Cancel payment" · Secondary: "Go back").

### Full Examples

::: do

**Title:** Delete workspace?

**Body:** Deleting this workspace will permanently remove all associated data.

**Primary:** Delete **Secondary:** Cancel

:::

::: dont

**Title:** Are you sure you want to proceed?

**Buttons:** Yes / No

:::

## Tone

Direct, neutral, and serious when appropriate. Avoid emotional language, alarmist phrasing, and humor.

::: do

- *"This action cannot be undone."*

:::

::: dont

- *"This is your last chance!"*

:::

## When in Doubt

1. Assess whether the action is reversible
1. Evaluate potential impact or data loss
1. Determine whether the user would reasonably expect confirmation

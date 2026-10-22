---
title: "Modals and Confirmation Dialogs"
blurb: "Structuring title, body, and CTAs for destructive actions."
topics: ["Errors & Messaging", "Payments"]
---

A modal interrupts the current workflow to require user attention or confirmation before proceeding. Confirmation dialogs are a specific type of modal used when an action may result in significant change, data loss, or irreversible impact. Because modals block progress, they should be used intentionally and sparingly.

## When to use a confirmation dialog

Use a confirmation dialog when an action:

- Permanently deletes data
- Removes access or permissions
- Cancels payments or scheduled actions
- Affects multiple users, systems, or environments
- Cannot be easily undone

::: details More detail

**Examples:**

- Deleting a workspace
- Cancelling a scheduled payment
- Resetting map configurations
- Removing a shared access role

:::

## When not to use a modal

Do not use a modal when:

- The action is low-risk and reversible
- A warning banner is sufficient
- The action is expected and routine
- The confirmation exists only to "double check"

## Structure of a confirmation dialog

A confirmation dialog typically includes:

1. Title
2. Body copy
3. Primary CTA
4. Secondary CTA

Each element must work together to clarify intent and reduce ambiguity.

### Title

The title should state the action or consequence directly, be short and clear, and avoid conversational phrasing. Do not ask "Are you sure?" — instead, state the action.

::: details More detail

The title should focus on the decision being made.

:::

::: do

- *"Delete workspace?"*
- *"Cancel scheduled payment?"*
- *"Remove user access?"*

:::

::: dont

- *"Are you sure?"*

:::

### Body copy

The body should explain the consequences of the action, clarify scope (what is affected), and indicate whether the action is reversible. Keep it concise and factual — avoid over-explaining or repeating the title.

::: do

- *"Deleting this workspace will permanently remove all associated reports and user access."*

:::

::: dont

- *"This action may have consequences you should consider carefully."*

:::

### Primary and secondary CTAs

**Primary CTA** — use a verb that clearly reflects the action, match the risk level, and avoid vague labels.

::: do

- *Delete*
- *Cancel payment*
- *Remove access*

:::

**Secondary CTA** — use "Cancel" for most interactions, or "Go back" when the primary action includes the word "Cancel," to prevent confusion.

::: do

- *Primary: "Cancel payment" · Secondary: "Go back"*

:::

::: details More detail

This prevents users from wondering: "Am I cancelling this dialog or cancelling the payment?"

:::

### Full examples

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

Confirmation dialogs should be direct, neutral, and serious when appropriate. Avoid emotional language, alarmist phrasing, and humor.

::: do

- *"This action cannot be undone."*

:::

::: dont

- *"This is your last chance!"*

:::

## Punctuation

- Titles should not include punctuation unless they are phrased as a question
- Body copy follows standard sentence rules
- Do not overuse exclamation points

## When in doubt

If confirmation is unnecessary, remove the modal and rely on clear inline messaging instead.

::: details More detail

If you're unsure whether to use a confirmation dialog:

1. Assess whether the action is reversible
2. Evaluate potential impact or data loss
3. Determine whether the user would reasonably expect confirmation

:::

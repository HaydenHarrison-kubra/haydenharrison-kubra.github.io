---
title: "Accessibility"
blurb: "Global accessibility rules and a pre-publish checklist."
topics: ["Accessibility"]
---

## Goals for Accessible Copy

Accessible UI copy should be perceivable (users can find and understand the content, including with assistive tech), operable (users can complete tasks without relying on a single input type), understandable (instructions and errors are clear and actionable), and robust (content works across browsers, devices, and assistive tech). These map to WCAG's foundational principles.

## Global Writing Rules That Improve Accessibility

### Use plain language without removing necessary precision

Prefer common words ("pay", "confirm", "amount due") over internal jargon. When technical terms are required (e.g., "PAN", "CNAME"), define once in context and then stay consistent.

### Don't rely on formatting, position, or color to convey meaning

Avoid instructions like "See the field in red" or "Click the button on the right." Instead, reference the label or component name: "In **Card number**, enter…"

### Avoid special characters that screen readers may read inconsistently

Avoid slashes for choices ("and/or") and quotation marks for emphasis. Prefer full words. See the Special Characters page for full guidance.

## UI Patterns: What Writers Must Do

### 1. Labels and controls must be self-explanatory

Labels should clearly describe the input (not just the data type). Avoid placeholder-only labeling — placeholders disappear and are not a reliable label substitute.

::: do

- *Payment amount*
- *Card expiration date*

:::

::: dont

- *Amount*
- *A placeholder acting as a label (e.g., "Enter amount" with no separate label)*

:::

### 2. Instructional text must be specific and step-based

When users must do something in a particular order or format: use numbered steps for sequences, and give examples for formats (date, email, phone). Avoid "above/below" directionals; refer to field names instead — this also helps screen reader users.

### 3. Error messages must identify the error and help users fix it

WCAG requires that errors are identified in text, and (for many contexts) that suggestions are provided. Required for form/field errors: say what went wrong (what field + what issue), and say how to fix it (format, range, required info).

::: do

- *"Routing number must be 9 digits."*
- *"Enter a valid email address in the format name@example.com."*

:::

::: dont

- *"Invalid input"*
- *"Error 404"*
- *"Something went wrong" (unless it's truly unknown and unrecoverable)*

:::

**Note:** When the cause is unknown, it's acceptable to attribute it to a system error and provide next steps ("try again later"), but don't leave users without an action.

### 4. Maintain user input whenever possible

If a user submits a form and there's an error: do not clear the entire form, keep completed fields intact, and move focus to the error summary or first error. This reduces cognitive load and supports users with motor and cognitive disabilities.

### 5. Authentication and verification flows must be accessible

WCAG 2.2 added new success criteria for accessible authentication and redundant entry. If your flows require re-entering data or rely on puzzles or memory-only steps, treat this as an accessibility risk area. Avoid "remember your answer from earlier" as the only path; provide alternatives and clear instructions (especially for MFA, OTP, verification links).

## Component-Specific Copy Guidance

### Buttons and links

Use action + object ("Pay bill", "Save payment method"). Avoid "Click here" — it is contextless when read out of context. Link text should describe the destination ("Read the brand guidelines"), not an action cue.

### Dialogs and confirmation

Title states the decision or action. Body explains impact and what happens next. Buttons are explicit (avoid yes/no).

### Tooltips

Don't hide essential instructions only in tooltips. Tooltips should clarify, not carry required content.

## ARIA and Interaction Patterns

Writers aren't responsible for Accessible Rich Internet Applications Suite (ARIA) implementation, but copy decisions affect it. When you see custom components (non-native dropdowns, tabs, accordions, complex tables), align with the ARIA Authoring Practices Guide patterns. Writers should flag interactive elements without labels, icon-only buttons without accessible names, and errors that appear visually but aren't announced in text.

## Accessibility Checklist for Writers (Ship-Ready)

Before you publish UI copy, confirm:

- Every control has a clear, unique label
- Instructions don't rely on color or position ("red", "right side", "above")
- Error messages identify the field + issue + fix (when possible)
- Unknown errors give a next step and don't blame the user
- Link text is meaningful out of context
- Special characters aren't used as shortcuts for meaning
- Critical info is not tooltip-only
- Copy is consistent and predictable across similar flows (helps cognitive accessibility)

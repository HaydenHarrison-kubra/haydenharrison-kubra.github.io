---
title: "Decision Guidelines"
blurb: "A decision hierarchy for resolving copy conflicts."
topics: ["Payments"]
---

## Decision Hierarchy (Use This First)

When making a decision, apply this order of priority — top to bottom:

| Priority | Ask Yourself | Rule |
|---|---|---|
| **1. Accuracy** (highest priority) | Is the content factually and legally correct? Does it reflect how the system actually behaves? | If not accurate, stop and escalate. |
| **2. Clarity** | Will the user understand this immediately? Does it reduce confusion and cognitive load? | Choose the clearest option, even if it is longer. |
| **3. Risk** (payments, legal, security) | Does this affect money, consent, or account access? Could ambiguity create financial or legal issues? | If yes, choose the most explicit and safest wording. |
| **4. Consistency** | Does this match existing patterns? Is this term already defined in the system? | Prefer consistency over introducing new phrasing. |
| **5. Brevity** (lowest priority) | Can this be shortened without losing meaning? | Never sacrifice clarity or accuracy for brevity. |

## Decision Framework (Step-by-Step)

Use this when you're unsure what to write:

::: note

**Step 1 — Identify the context**

- UI element (button, label, error, etc.)
- User goal
- Risk level (low vs. high)

:::

::: note

**Step 2 — Check existing patterns**

- Canonical Copy Library
- Terminology Registry
- Similar UI components

*If a pattern exists → reuse it.*

:::

::: note

**Step 3 — Apply the hierarchy**

- Is it accurate?
- Is it clear?
- Is it safe (especially for payments)?
- Is it consistent?

:::

::: note

**Step 4 — Choose the simplest valid option**

- Avoid overthinking phrasing
- Avoid inventing new patterns

:::

::: note

**Step 5 — Escalate if needed**

Escalate for review if the decision affects payments, legal/compliance, new terminology, or cross-product consistency.

:::

## Common Decision Scenarios

### Scenario 1: "Continue" vs. Specific CTA

*Why: Specificity reduces financial risk.*

::: do

- *Confirm payment*

:::

::: dont

- *Continue*

:::

### Scenario 2: Short vs. Clear

::: do

- *Cancel scheduled payment*

:::

::: dont

- *Cancel*

:::

### Scenario 3: Technical vs. User-Friendly

::: do

- *Card number*

:::

::: dont

- *PAN*

:::

### Scenario 4: Friendly vs. Neutral Tone

::: do

- *Enter your payment details*

:::

::: dont

- *Let's get started*

:::

### Scenario 5: Acronym vs. Full Term

::: do

- *Routing number*

:::

::: dont

- *RTN*

:::

## When to Reuse vs. Create New Copy

**Reuse when:** the same action exists elsewhere, a canonical pattern exists, or the meaning is identical. **Create new copy when:** the action is new, the context is meaningfully different, or reusing would create confusion.

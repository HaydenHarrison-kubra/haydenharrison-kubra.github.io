---
title: "Message Types"
blurb: "Success, error, warning, and informational messages."
topics: ["Errors & Messaging"]
---

## Success

A success message confirms that a user action completed as expected. Success messages should provide clear confirmation without unnecessary emphasis. They exist to confirm outcomes, reinforce system reliability, and let users move on.

### Success Message Types

#### 1. Item-Based Success Messages (One of Many)

Use when an action affects a single item within a list, collection, or set. Approved templates:

- **\[item type\] \[item identifier\] \[action\] successfully** — e.g. "Layer Flood Zones added successfully"
- **\[item identifier\] \[item type\] \[action\] successfully** — e.g. "Map view Downtown updated successfully"
- **\[item identifier\] \[action\] to \[location or section\] successfully** — e.g. "Report 0898765 added to workspace successfully"

Include identifiers when ambiguity is possible; choose the structure that reads most naturally; maintain consistency within the same workflow.

#### 2. Section-Based Success Messages (One of One)

Use when an action affects an entire section, configuration, or system-level setting. Template: **\[section name\] \[action\] successfully** — e.g. "Notification preferences updated successfully," "Map settings reset successfully." Avoid restating information already visible on the screen.

### Structure, Length, and Punctuation

Keep success messages concise, focused on a single completed action. Do not use a period if the message is a single sentence or fragment.

### When to Use Additional Detail

Add supporting text only when it helps users understand impact, scope, or timing.

::: do

- *"Configuration updated successfully. Changes may take up to 15 minutes to appear across all environments."*

:::

### What to Avoid

- Over-celebratory or congratulatory language
- Generic confirmations ("Done," "Success")
- Emotional modifiers ("Great," "Awesome," "Perfect")
- Multiple actions in a single message
- Passive constructions that obscure what changed

::: do

- *"Changes saved successfully"*

:::

::: dont

- *"Your changes were successfully applied"*

:::

### Tone

Success messages should be neutral, professional, calm and factual — across all product types, including internal tools.

::: do

- *"Layer settings updated successfully"*
- *"Payment submitted successfully"*
- *"Workspace created successfully"*

:::

::: dont

- *"You're all set!"*
- *"Nice work—everything's done 🎉"*

:::

### Voice

Use active voice; be specific about what changed; avoid unnecessary auxiliary verbs when clarity is preserved.

::: do

- *"Settings saved successfully"*

:::

::: dont

- *"Your settings have been successfully saved"*

:::

## Error

An error message appears after an attempted action fails or cannot be completed. Error messages should clearly explain what went wrong, why it happened (when known), and what the user can do next.

### Error Severity Types

#### 1. Recoverable Errors (User Can Fix)

Occurs when user input is missing, invalid, or incomplete. Use active voice, clearly state what needs to be corrected, avoid blaming language.

::: do

- *"Enter a valid billing ZIP code"*

:::

::: dont

- *"Invalid input provided"*
- *"You entered incorrect information"*

:::

#### 2. Blocking Errors (Action Cannot Continue)

Prevents the user from proceeding, often due to permissions, dependencies, or unmet requirements. Explain what is blocking the action and offer next steps.

::: do

- *"You don't have permission to edit this workspace. Contact an administrator to request access."*

:::

#### 3. System Errors (User Cannot Fix)

The system fails or an external dependency is unavailable. Use passive voice, take responsibility on behalf of the system, set expectations clearly, avoid exposing internal details.

::: do Standard message

- *"Something went wrong due to a system error. Please try again later."*

:::

### Tone and Voice

Error messages should be polite and empathetic, calm and professional, neutral in emotional intensity. Prefer clear, direct language; use passive voice selectively when cause is unknown; use active voice when the user can fix the issue.

::: do

- *"We couldn't load this map due to a system error"*

:::

::: dont

- *"Uh-oh! Something went wrong"*

:::

### What to Avoid

- Generic errors like "Error 404" or "Request failed"
- Overloading messages with technical detail
- Blaming the user
- Leaving users without a clear next step
- Apologizing excessively

### Inline Errors

**Pattern 1 — Required Field:** "Card number is required." **Pattern 2 — Format Error:** "Card number must be 16 digits." **Pattern 3 — Constraint Error:** "Payment amount must be greater than $0." **Pattern 4 — System/Validation Error:** "We couldn't verify this account. Check the details and try again."

#### Placement and Timing

Inline errors must appear near the affected field and be visually associated with the input — not require scrolling. They should appear on blur or on submission, not while typing.

#### High-Risk Payment Error Patterns

::: do

**Payment amount:** "Enter an amount greater than $0" · "Payment amount exceeds your available balance"

**Card information:** "Card number must be 16 digits" · "Expiration date is invalid"

**Routing number:** "Routing number must be 9 digits"

**Verification codes:** "The verification code is expired. Request a new code."

:::

#### Inline Errors vs. System/Banner Errors

Inline errors are field-level; banner/system errors are page or system-level. Do not use inline errors for API outages, payment system failures, or global form errors.

## Warning

A warning message alerts users to a potential risk, significant change, or irreversible outcome before an action is taken.

### Tone and Voice

Direct, neutral, cautionary without being alarming. Use active voice; address the action and its impact clearly.

::: do

- *"Deleting this layer will remove it from all map views"*

:::

::: dont

- *"Warning! This action is dangerous!"*

:::

### When to Use a Warning Message

Use when an action may result in data loss, causes a significant change that cannot be easily undone, affects multiple users/systems/environments, or has downstream impact not immediately visible.

### Warning Banners vs. Confirmation Dialogs

**Warning banners** — reversible or low-to-moderate risk, user can continue without immediate confirmation. **Confirmation dialogs** — destructive or irreversible, significant impact, explicit confirmation required.

### Structure and Content

Keep warnings short (3 lines or fewer), focused on one risk. Clearly state the risk, name the impacted item, keep close to the affected action.

## Informational

An informational message provides context, status, or guidance without indicating success, failure, or risk.

### Tone and Voice

Neutral, calm, factual. Use clear, declarative, active language.

::: do

- *"Map data refreshes every 15 minutes"*

:::

::: dont

- *"Map data may refresh from time to time"*

:::

### Message Type Comparison

| **Message Type** | **Purpose** | **Timing** |
|---|---|---|
| Informational | Provide context or guidance | Before or during an action |
| Warning | Highlight potential risk | Before an action |
| Error | Indicate failure | After an action |
| Success | Confirm completion | After an action |

### When Not to Use an Informational Message

Do not use when an action failed (use error), succeeded (use success), has potential data loss (use warning), or confirmation is required (use a dialog).

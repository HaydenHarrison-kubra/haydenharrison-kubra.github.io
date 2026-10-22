---
title: "Message Types"
blurb: "Success, error, warning, and informational messages."
topics: ["Errors & Messaging"]
---

## Success

A success message confirms that a user action completed as expected. Across KUBRA products — whether consumer-facing, administrative, mapping-related, or internal — success messages should provide clear confirmation without unnecessary emphasis.

::: details More detail

Success messages are not rewards or celebrations. They exist to confirm outcomes, reinforce system reliability, and let users move on.

:::

### Success message types

Success messages generally fall into two categories. Choosing the correct type prevents redundancy and confusion.

#### 1. Item-based success messages (one of many)

Use when an action affects a single item within a list, collection, or set. Approved templates:

- **\[item type\] \[item identifier\] \[action\] successfully** — e.g. "Layer Flood Zones added successfully"
- **\[item identifier\] \[item type\] \[action\] successfully** — e.g. "Map view Downtown updated successfully"
- **\[item identifier\] \[action\] to \[location or section\] successfully** — e.g. "Report 0898765 added to workspace successfully"

::: details More detail

Guidance:

- Include identifiers when ambiguity is possible
- Choose the structure that reads most naturally in context
- Maintain consistency within the same workflow or screen

:::

#### 2. Section-based success messages (one of one)

Use when an action affects an entire section, configuration, or system-level setting. Template: **\[section name\] \[action\] successfully** — e.g. "Notification preferences updated successfully," "Map settings reset successfully."

::: details More detail

Guidance:

- Avoid restating information already visible on the screen
- Do not include item-level details if the scope is clearly global

:::

### Structure and length

- Keep success messages concise
- Focus on a single completed action
- Avoid bundling multiple outcomes into one message

### Punctuation

- Do not use a period if the message is a single sentence or fragment
- Use punctuation only when the message contains more than one sentence, or a comma or other punctuation is required for clarity

### When to use additional detail

Add supporting text only when it helps users understand impact, scope, or timing, such as:

- Delayed system updates
- Changes that affect multiple areas
- Actions that are not immediately visible

::: do

- *"Configuration updated successfully. Changes may take up to 15 minutes to appear across all environments."*

:::

### What to avoid

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

Success messages should be neutral, professional, calm, and factual. Avoid enthusiasm, humor, or emotional language — this applies across all product types, including internal tools and non-consumer workflows.

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

- Use active voice
- Be specific about what changed
- Avoid unnecessary auxiliary verbs when clarity is preserved

::: do

- *"Settings saved successfully"*

:::

::: dont

- *"Your settings have been successfully saved"*

:::

### When in doubt

When uncertainty remains, default to the shortest clear confirmation.

::: details More detail

1. State the completed action
2. Name the affected item or section
3. Add timing or scope details only if they matter

:::

## Error

An error message appears after an attempted action fails or cannot be completed. Error messages should clearly explain what went wrong, why it happened (when known), and what the user can do next.

::: details More detail

Across KUBRA products, error messages should reduce uncertainty, preserve trust, and help users recover — especially in high-stakes technical or financial workflows.

:::

### Error severity types

All error messages fall into one of three categories. Identifying the type helps determine structure, tone, and content.

#### 1. Recoverable errors (user can fix)

These errors occur when user input is missing, invalid, or incomplete.

**Guidance:** use active voice, clearly state what needs to be corrected, and avoid blaming language.

::: details More detail

**Characteristics:**

- The user can resolve the issue immediately
- The error is specific and actionable
- The system is functioning correctly

:::

::: do

- *"Enter a valid billing ZIP code"*

:::

::: dont

- *"Invalid input provided"*
- *"You entered incorrect information"*

:::

#### 2. Blocking errors (action cannot continue)

These errors prevent the user from proceeding, often due to permissions, dependencies, or unmet requirements.

**Guidance:** explain what is blocking the action, state what must happen before the user can proceed, and offer next steps when possible.

::: details More detail

**Characteristics:**

- The user may or may not be able to fix the issue
- Additional steps or prerequisites are required
- The system may still be functioning normally

:::

::: do

- *"You don't have permission to edit this workspace. Contact an administrator to request access."*

:::

#### 3. System errors (user cannot fix)

These errors occur when the system fails or an external dependency is unavailable.

**Guidance:** use passive voice, take responsibility on behalf of the system, set expectations clearly, and avoid exposing internal details.

::: details More detail

**Characteristics:**

- The user is not at fault
- Retrying may or may not resolve the issue
- The cause is often unknown or technical

:::

::: do Standard message

- *"Something went wrong due to a system error. Please try again later."*

:::

### Structure and length

- Keep error messages concise
- Focus on a single issue per message
- Avoid stacking multiple errors in one banner

### Punctuation

- Do not use a period if the message is a single sentence or fragment
- Use punctuation only when the message contains more than one sentence, or a comma or other punctuation improves clarity

### Tone

Error messages should be polite and empathetic, calm and professional, and neutral in emotional intensity. Avoid humor, sarcasm, or overly casual phrasing.

::: details More detail

Errors are moments of friction, and tone should stabilize, not amplify. This aligns with FANG guidance, which recommends neutral, steady language in failure states.

:::

::: do

- *"We couldn't load this map due to a system error"*

:::

::: dont

- *"Uh-oh! Something went wrong"*

:::

### Voice

Prefer clear, direct language. Use passive voice selectively when the cause is unknown or the system is responsible. Use active voice when the user can fix the issue or the action required is clear.

::: do

- *"The file couldn't be uploaded due to a system error" (passive — system responsible)*
- *"Enter a valid account number to continue" (active — user can fix)*

:::

### What to avoid

- Generic errors like "Error 404" or "Request failed"
- Overloading messages with technical detail
- Blaming the user
- Leaving users without a clear next step
- Apologizing excessively

::: do

- *"We couldn't complete this request due to a system error"*

:::

::: dont

- *"We're really sorry, this is frustrating and unexpected"*

:::

### When in doubt

When uncertainty remains, default to clarity and responsibility over detail.

::: details More detail

1. Identify the error type (recoverable, blocking, or system)
2. State what failed
3. Clarify whether the user can act
4. Provide next steps if available

:::

### Inline errors

#### Structure of an inline error

Most inline errors follow one of these patterns:

**Pattern 1: Required Field**

::: do

- *"This field is required"*
- *"Expiration date is required"*
- *Preferred, using the field name: "Card number is required"*

:::

**Pattern 2: Format Error**

::: do

- *"Card number must be 16 digits"*
- *"Enter a valid email address"*

:::

**Pattern 3: Constraint Error**

::: do

- *"Payment amount must be greater than $0"*
- *"Password must be at least 8 characters"*

:::

**Pattern 4: System or Validation Error** — use when validation depends on backend systems or the cause is not fully known.

::: do

- *"We couldn't verify this account. Check the details and try again."*

:::

#### Placement

Inline errors must appear near the affected field, be visually associated with the input, and not require scrolling to discover. Do not rely solely on top-of-page error summaries.

#### Timing

Inline errors should appear after the user leaves the field (on blur), or on form submission.

::: details More detail

Avoid showing errors before the user interacts with the field, or while the user is actively typing (unless necessary).

:::

#### Common mistakes to avoid

::: details More detail

- Vague errors with no solution
- Blaming language
- Overly technical jargon
- Long, multi-sentence explanations
- Duplicate errors across fields
- Showing errors too early

:::

#### High-risk payment error patterns

::: do

**Payment amount:**

- *"Enter an amount greater than $0"*
- *"Payment amount exceeds your available balance"*

**Card information:**

- *"Card number must be 16 digits"*
- *"Expiration date is invalid"*

**Routing number:**

- *"Routing number must be 9 digits"*

**Verification codes:**

- *"The verification code has expired. Request a new code."*

:::

::: dont

**Verification codes:**

- *"Invalid code"*
- *"Incorrect OTP"*

:::

#### Voice and tone for inline errors

Inline errors should be calm, neutral, direct, and supportive. Do not over-apologize or add emotion.

::: dont

- *"Sorry! Something went wrong"*
- *"Oops"*
- *"That didn't work"*

:::

#### Inline errors vs. system/banner errors

| **Type** | **Scope** |
|---|---|
| Inline error | Field-level issue |
| Banner/system error | Page or system-level issue |

Do not use inline errors for:

- API outages
- Payment system failures
- Global form errors

#### Banners vs. inline errors

**Error banners** — use when the error affects the entire page or workflow, the action cannot be completed, or immediate attention is required.

Use a modal only when the user must make a decision before continuing. Use an error banner when a page-level action failed and the user can still move around.

**Inline errors** — use when the error is tied to a specific field or input, and the user can fix the issue locally.

Avoid duplicating the same error in both places.

## Warning

A warning message alerts users to a potential risk, significant change, or irreversible outcome before an action is taken. Warnings help users make informed decisions without blocking progress unless necessary.

::: details More detail

Across KUBRA products, warnings should be clear, direct, and easy to scan, especially in technical, administrative, or high-impact workflows.

:::

### Tone

Warning messages should be direct, neutral, and cautionary without being alarming. Avoid emotional language, dramatization, or urgency unless the situation truly requires it.

::: do

- *"Deleting this layer will remove it from all map views"*

:::

::: dont

- *"Warning! This action is dangerous!"*

:::

### Voice

- Use active voice
- Address the action and its impact clearly
- Avoid conditional or vague phrasing

::: do

- *"Removing this workspace will revoke access for all members"*

:::

::: dont

- *"This could possibly result in access being removed"*

:::

### When to use a warning message

Use a warning message when an action:

- May result in data loss
- Causes a significant change that cannot be easily undone
- Affects multiple users, systems, or environments
- Has downstream impact that may not be immediately visible

Warnings are appropriate before the action occurs.

### When not to use a warning message

Do not use a warning message when:

- The user is completely blocked (use an error instead)
- The outcome is catastrophic or irreversible without confirmation (use a modal)

::: details More detail

- The message only provides general information
- The risk is minimal or obvious

FANG patterns recommend escalating to confirmation dialogs for high-impact actions rather than relying on inline warnings.

:::

### Warning banners vs. confirmation dialogs

**Warning banners** — use when the user can continue without immediate confirmation, the warning provides context or caution, and the action is reversible or low-to-moderate risk.

::: do

- *"Changes to map settings may affect shared views"*

:::

**Confirmation dialogs** — use when the action is destructive or irreversible, the impact is significant, and explicit confirmation is required.

::: do

- *"Deleting this workspace will permanently remove all associated data."*

:::

*(Confirmation dialogs follow their own guidelines.)*

### Structure and length

- Keep warnings short and scannable
- Ideally 3 lines or fewer
- Focus on one risk per message

### Punctuation

- Do not use a period if the message is a single sentence or fragment
- Use punctuation only when the message contains more than one sentence, or a comma or clause improves clarity

### Content guidelines

::: do

- Clearly state the risk
- Name the impacted item or area
- Keep the warning close to the affected action
- Include a link only if it helps users understand or mitigate the risk

*"Disabling this setting will stop automated alerts"*

:::

::: dont

- Use jargon or internal system terminology
- Bury important details
- Use warnings to block progress
- Use warning banners for catastrophic outcomes

*"Proceeding may result in unintended consequences" · "System integrity could be compromised"*

:::

### When in doubt

If confirmation is required, use a confirmation dialog, not a warning banner.

::: details More detail

1. Ask whether the user needs to know something before acting
2. Assess whether the action is reversible
3. Decide if confirmation is required

:::

## Informational

An informational message provides context, status, or guidance without indicating success, failure, or risk. Informational messages help users understand the system or their options while allowing them to continue without interruption.

::: details More detail

Across KUBRA products, informational messages should be clear, neutral, and unobtrusive.

:::

### Tone

Informational messages should be neutral, calm, and factual. Avoid emotional language, urgency, or implication of risk.

::: do

- *"Changes are saved automatically"*

:::

::: dont

- *"Important: Don't forget your changes are saved!"*

:::

### Voice

- Use clear, declarative language
- Prefer active voice
- Avoid conditional phrasing that suggests uncertainty unless uncertainty exists

::: do

- *"Map data refreshes every 15 minutes"*

:::

::: dont

- *"Map data may refresh from time to time"*

:::

### Message type comparison

| **Message Type** | **Purpose** | **Timing** |
|---|---|---|
| Informational | Provide context or guidance | Before or during an action |
| Warning | Highlight potential risk | Before an action |
| Error | Indicate failure | After an action |
| Success | Confirm completion | After an action |

### When to use an informational message

Use informational messages when:

- Explaining system behavior
- Providing status that is neither success nor failure
- Offering guidance that helps users proceed confidently
- Clarifying constraints, limits, or defaults

::: details More detail

Examples: "Only administrators can edit workspace settings" · "This report includes data from the last 30 days" · "Some features may be unavailable during maintenance"

:::

### When not to use an informational message

Do not use informational messages when:

- An action has failed (use an error)
- An action succeeded (use a success message)
- There is potential data loss or irreversible impact (use a warning)
- Confirmation is required (use a dialog)

Informational messages should never replace or soften more appropriate message types.

### Placement and presentation

Informational messages are often displayed as inline text, informational banners, helper text near inputs, or non-blocking callouts.

::: details More detail

They should:

- Appear close to the relevant content or action
- Not interrupt workflow
- Be easy to dismiss or ignore if no longer needed

:::

### Structure and length

- Keep informational messages concise
- Focus on one idea at a time
- Use sentence fragments when appropriate

### Punctuation

- Do not use a period if the message is a single sentence or fragment
- Use punctuation only when needed for clarity or multiple sentences

### Content guidelines

::: do

- State facts clearly
- Use consistent terminology
- Anticipate common user questions
- Keep language instructional, not promotional

*"You can update this setting at any time"*

:::

::: dont

- Use urgency without cause
- Include calls to action unless necessary
- Use warnings or error phrasing
- Over-explain obvious behavior

*"Please be advised that you should take note of the following information"*

:::

### When in doubt

If the message suggests risk or blocks progress, escalate to a warning or error instead.

::: details More detail

1. Ask whether the message communicates context, not consequence
2. Confirm no action is required
3. Ensure the message does not imply risk or failure

:::

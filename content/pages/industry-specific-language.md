---
title: "Industry-specific Language"
blurb: "Safe terms vs. terms that need context or definition."
---

## User-familiar terms (preferred)

These are commonly understood by most users and should be used consistently. **Examples:** card number, payment amount, billing address, due date, service fee.

::: details More detail

These terms require no explanation, should be standardized across the product, and are preferred over internal alternatives.

:::

## Financial terminology

Financial language must be precise, consistent, and unambiguous.

### Amounts

::: do

- *Payment amount*
- *Amount due*

:::

::: dont

- *Total (if unclear what it includes)*
- *Balance (unless defined)*

:::

### Fees

::: do

- *Service fee*
- *Late fee*

:::

::: dont Don'ts (vague terms)

- *Additional charges*
- *Processing fee (unless defined and consistent)*

:::

### Timing

::: do

- *Due date*
- *Processing date*

:::

::: dont

- *Soon*
- *Upcoming*

:::

## Semi-technical terms (use with care)

These are understood by some users but may require context. **Examples:** routing number, ACH (bank transfer), AutoPay, recurring payment.

::: details More detail

Use the term if necessary, add helper text if clarification is needed, and avoid introducing multiple terms for the same concept.

:::

::: do

- *Bank account (ACH)*
- *Routing number — Helper text: A 9-digit number used to identify your bank.*

:::

## Utility-specific language

Because your products may interact with utilities: use terminology familiar to utility customers, and avoid internal provider language.

::: do

- *Account number*
- *Service address*
- *Billing period*

:::

::: dont

- *Meter ID (unless required)*
- *Service unit identifier*

:::

## Technical or internal terms (avoid or define)

These include system-level terminology, internal product names, and backend or infrastructure language. **Examples:** PAN (Primary Account Number), CNAME, transaction division (TD), tokenization. Avoid these in consumer-facing UI when possible, replace with user-friendly alternatives, and if required, define on first use.

::: do

- *Card number (instead of PAN)*
- *System configuration (CNAME) (only if necessary and defined)*

:::

## Do not expose internal language

Avoid exposing internal or system terminology to users unless it is required for functionality, appears in external-facing documentation, or is defined clearly.

::: do Use Instead

- *We couldn't process your card. Check the number and try again.*

:::

::: dont Avoid

- *PAN validation failed*
- *TD configuration error*
- *Tokenization mismatch*

:::

## Voice and tone considerations

Industry language should remain neutral, clear, and non-technical (when possible).

::: details More detail

Avoid overly technical phrasing, jargon used for authority, and mixing simple and complex terms unnecessarily.

:::

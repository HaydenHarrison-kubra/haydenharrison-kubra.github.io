---
title: "Industry-specific Language"
blurb: "Safe terms vs. terms that need context or definition."
---

## User-Familiar Terms (Preferred)

Commonly understood by most users. **Examples:** card number, payment amount, billing address, due date, service fee. Require no explanation; standardized across the product.

## Financial Terminology

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

## Semi-Technical Terms (Use with Care)

**Examples:** routing number, ACH (bank transfer), autopay, recurring payment. Add helper text if clarification is needed; avoid introducing multiple terms for the same concept.

::: do

- *Bank account (ACH)*
- *Routing number — Helper text: A 9-digit number used to identify your bank.*

:::

## Utility-Specific Language

::: do

- *Account number*
- *Service address*
- *Billing period*

:::

::: dont

- *Meter ID (unless required)*
- *Service unit identifier*

:::

## Technical or Internal Terms (Avoid or Define)

**Examples:** PAN (Primary Account Number), CNAME, transaction division (TD), tokenization. Avoid in consumer-facing UI when possible; define on first use if required.

::: do

- *Card number (instead of PAN)*
- *System configuration (CNAME) (only if necessary and defined)*

:::

## Do Not Expose Internal Language

::: do Use Instead

- *We couldn't process your card. Check the number and try again.*

:::

::: dont Avoid

- *PAN validation failed*
- *TD configuration error*
- *Tokenization mismatch*

:::

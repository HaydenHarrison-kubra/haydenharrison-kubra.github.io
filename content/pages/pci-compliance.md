---
title: "PCI Compliance"
blurb: "Handling sensitive payment data safely."
topics: ["Accessibility", "Payments"]
---

## Sensitive Data (Do Not Expose)

Must never be fully displayed or requested in plain text: full card number (PAN), CVV/security code, full bank account numbers, full routing numbers (outside secure input fields).

::: do

- *•••• •••• •••• 1234*
- *Card ending in 1234*
- *Account ending in 5678*

:::

::: dont

- *4111 1111 1111 1234*
- *Full card or account numbers in UI text*

:::

## Third-Party Payment Providers

::: do

- *Payments are processed securely through a third-party provider.*

:::

::: dont

- *"We store your card for future use" (unless verified and compliant)*

:::

## Input Field Guidance

Sensitive information must only be collected through secure, masked input fields and PCI-compliant components.

::: do

- *Label: Card number*
- *Placeholder: \*\*\*\* \*\*\*\* \*\*\*\* 1234 (or blank, depending on system)*

:::

::: dont

- *"Enter your full card number in the message box"*
- *"Provide your card details below" (if unclear where/how)*

:::

## Accessibility Considerations

Masked data must remain understandable when read aloud.

::: do

- *"Card ending in one two three four"*

:::

::: dont

- *Read out masked symbols without context (e.g., "••••")*

:::

## Error Messaging and PCI

Error messages must never reveal sensitive data.

::: do

- *We couldn't process this card. Check the number and try again.*

:::

::: dont

- *"Card number 4111 1111 1111 1234 is invalid"*

:::

## Logging and Debugging Language

::: do

- *Tell the user to contact support if the issue continues. Do not share your full card details.*

:::

::: dont

- *"Send us your card number so we can investigate"*
- *"Paste your payment details here"*

:::

## Screenshots and UI Content

Assume users may take screenshots, share screens, or save confirmations. Sensitive data should never appear fully visible in confirmations, receipts, or summaries.

## Payment Confirmations

::: do

- *Payment of $125.00 completed on August 27, 2026 using card ending in 1234.*

:::

::: dont

- *Payment of $125.00 was made. Thank you!*

:::

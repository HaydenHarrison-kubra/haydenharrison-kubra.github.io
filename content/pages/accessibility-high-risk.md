---
title: "Accessibility: High Risk"
blurb: "Precision guidance for auth, payments, fees, and lockouts."
topics: ["Accessibility", "Payments", "Errors & Messaging"]
---

This covers high-risk user moments in payment and billing flows where unclear or inaccessible copy can cause financial harm, user frustration, or compliance issues. These patterns require extra precision, predictability, and accessibility review.

## What Qualifies as "High-Risk" Copy

A flow is considered high-risk when it involves money movement or authorization, account access or identity verification, irreversible or time-sensitive actions, fees, penalties, or service disruption, or compliance or regulatory disclosure. In these contexts, clarity and accessibility override tone, brevity, and stylistic preference.

## 1. Authentication and Verification (MFA, OTP, Identity Checks)

**Risks:** cognitive load, memory reliance, time pressure, screen reader interruptions.

**Accessibility requirements:** do not rely on memory alone (WCAG 2.2: Accessible Authentication), provide clear instructions and recovery paths, avoid jargon like "OTP" unless defined.

**Instructional copy:**

::: do

- *"Enter the 6-digit code we sent to your phone number ending in 1234." (Explains what it is, where it came from, and what to do.)*

:::

::: dont

- *"Enter OTP"*
- *"Check your device"*

:::

**Error copy:**

::: do

- *"The verification code is expired. Request a new code to continue." (Actionable and neutral.)*

:::

::: dont

- *"Invalid code"*
- *"Authentication failed"*

:::

**Recovery** — always include a secondary path: resend code, use a different method, or contact support.

## 2. Payment Failures

**Risks:** user anxiety, repeated failed attempts, blame perception, duplicate payments.

**Accessibility and UX rules:** clearly state whether money was charged, separate failure reason from next step, avoid emotional or apologetic language.

**Known issue:** "We couldn't process this payment because the card has expired." "Update your card details and try again."

**Unknown issue:** "We couldn't process this payment due to a system error." "No funds were charged. Please try again later."

::: do

- *Explicit outcome and clear next step*

:::

::: dont

- *"Something went wrong" (without context)*

:::

## 3. Scheduled Payments and Autopay

**Risks:** unintended charges, missed payments, trust erosion.

**Accessibility requirements:** clearly state when the action occurs, confirm changes in plain language, avoid relative time ("soon", "later").

::: do

- *"Autopay is scheduled to run on March 15 each month."*
- *"Changes to this payment will apply starting April 15."*

:::

::: dont

- *"Your changes were saved"*
- *"Next billing cycle"*

:::

## 4. Fees, Penalties, and Charges

**Risks:** legal exposure, user confusion, perceived deception.

**Accessibility and compliance rules:** do not hide fees behind tooltips alone, avoid vague language ("may apply" unless legally required), use consistent terminology for the same fee.

::: do

- *"A service fee of $2.50 will be added to this payment."*
- *"A late fee may apply if payment is not received by March 20."*

:::

::: dont

- *"Additional charges may occur"*
- *"Small processing fee"*

:::

## 5. Refunds, Reversals, and Cancellations

**Risks:** false expectations, timing disputes, support escalation.

**Accessibility requirements:** clearly state processing time, separate system action from bank action, avoid guarantees unless contractually accurate.

**Refund confirmation:** "Your refund has been initiated." "Funds typically appear in your account within 3 to 5 business days."

**Cancellation:** "This payment has been canceled and will not be processed."

::: dont

- *"Refunded successfully" (without timeline)*
- *"It may take some time"*

:::

## 6. Account Lockouts and Security Holds

**Risks:** panic, repeated failed attempts, accessibility barriers during stress.

**Accessibility and tone rules:** be calm and factual, do not imply wrongdoing, always explain next steps.

**Lockout notice:** "Your account is temporarily locked due to multiple unsuccessful sign-in attempts." "Try again in 15 minutes or reset your password."

::: dont

- *"Suspicious activity detected"*
- *"Your account has been restricted" (without cause)*

:::

## 7. Service Disruptions and System Outages

**Risks:** loss of trust, repeated retries, support overload.

**Accessibility rules:** use banners, not tooltips, state scope and impact, set expectations.

**Banner:** "Some payment services are temporarily unavailable. Please try again later."

**If partial impact:** "Payments by bank transfer are currently unavailable. Card payments are not affected."

::: dont

- *"We're experiencing issues"*
- *"Service disruption detected"*

:::

## Language to Avoid in High-Risk Flows

Never use humor or emojis; "Oops", "Uh-oh", "Yikes"; blame ("You entered…"); minimizing language ("Just", "Simply"); or ambiguous timing ("Soon", "Shortly").

## When to Escalate for Review

Escalate copy for accessibility and legal review if it mentions fees, penalties, or refunds; affects account access or identity; blocks a user from completing a payment; changes scheduled or recurring payments; or relates to PCI or regulatory requirements.

## Accessibility Checklist for High-Risk Copy

Before shipping, confirm:

- The outcome is explicit (charged / not charged / pending)
- Timeframes are specific and realistic
- Errors explain what happened and what to do next
- Users are not required to remember information
- Critical info is not tooltip-only
- Language does not imply fault or judgment
- Copy works when read aloud by a screen reader

# Closed testing runbook (14 days)

Use this checklist for the **second** production-access attempt after rejection.

## Before day 1

- [ ] Build production AAB: `cd application && eas build -p android --profile production`
- [ ] Upload AAB to **Closed testing** (not only Internal)
- [ ] Recruit **15–17** testers on real Android phones (buffer for drop-offs)
- [ ] Privacy policy live at the URL in `application/app.json` → `extra.legal.privacyPolicyUrl`
- [ ] Deploy Cloud Function: `cd functions/functions && npm run deploy` (includes `deleteUserAccount`)

## Tester onboarding

1. Play Console → **Testing → Closed testing** → create or reuse a track.
2. Add testers via email list or Google Group.
3. Share the **opt-in link** — each person must accept and install from Play Store.
4. Confirm **Testers → Opted in** shows ≥12 names before starting the 14-day clock.

## Daily (14 days)

- [ ] Opted-in count still ≥12
- [ ] Note any tester who uninstalled (replace from buffer list)

## During the 14 days (required for approval)

Ship **at least 2–3** closed-test releases. Example schedule:

| Day | Version (example) | Release notes (be specific) |
|-----|-------------------|-----------------------------|
| 1 | 1.0.1 | Added privacy policy links, account deletion, removed unused microphone permission, health disclaimer on login. |
| 7 | 1.0.2 | Improved login error messages; profile shows app version for bug reports. |
| 12 | 1.0.3 | Fixes from tester feedback: [list actual bugs fixed]. |

Collect feedback via WhatsApp, email, or a Google Form. Save screenshots or quotes for the production questionnaire.

## Core flows testers must exercise

- Phone OTP login
- Complete profile / photo
- Book an appointment
- Open chat with clinic
- View history (if applicable to role)
- Sign out and sign back in

## After day 14

When Dashboard shows eligibility, complete the questionnaire using [PRODUCTION_ACCESS_QUESTIONNAIRE.md](./PRODUCTION_ACCESS_QUESTIONNAIRE.md).

Do **not** promote to Production until Google approves production access.

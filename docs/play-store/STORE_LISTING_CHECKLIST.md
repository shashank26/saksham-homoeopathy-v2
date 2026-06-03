# Play Console store & policy checklist

Complete in [Google Play Console](https://play.google.com/console) while closed testing runs.

## Store listing

- [ ] App name: **Saksham Homoeopathy**
- [ ] Short description (80 chars) — clinic appointments & patient communication
- [ ] Full description — scope: bookings, chat, history for existing patients; not emergency care
- [ ] Screenshots: login, home, bookings, chat, profile (phone + 7" tablet if supporting tablets)
- [ ] Feature graphic 1024×500
- [ ] App icon matches `application/assets/images/icon.png`
- [ ] Category: Medical or Health & Fitness (choose best fit)
- [ ] Contact email: `support@sakshamhomoeopathy.com` (or your clinic email)

## Privacy policy

- [ ] Host [../privacy-policy.html](../privacy-policy.html) at the URL configured in the app (`extra.legal.privacyPolicyUrl`)
- [ ] Play Console → **App content → Privacy policy** — same HTTPS URL

## Data safety (align with the app)

Declare at minimum:

| Data type | Collected | Shared | Purpose |
|-----------|-----------|--------|---------|
| Phone number | Yes | No | Account management, authentication |
| Name | Yes | No | Account management |
| Photos | Yes | No | Profile picture (user-selected) |
| Messages | Yes | No | In-app chat with clinic |
| Health info | Yes | No | Medicine/history records entered by clinic |
| App activity | Optional | No | Analytics if added later |

- [ ] Data encrypted in transit: **Yes**
- [ ] Users can request deletion: **Yes** (in-app Delete account)
- [ ] Data deletion URL or in-app path documented

## App access

- [ ] Login required → provide **test phone number** and OTP instructions for reviewers, or a demo video link

## Content rating

- [ ] Complete IARC questionnaire honestly (medical/clinic context, user-generated chat)

## Target audience

- [ ] Set age band appropriately (not primarily children)

## Health apps

- [ ] If prompted, declare app does not provide diagnosis-only AI or emergency triage

## App signing

- [ ] Play App Signing enabled
- [ ] Upload key SHA-1 registered in Firebase — see [FIREBASE_RELEASE.md](./FIREBASE_RELEASE.md)

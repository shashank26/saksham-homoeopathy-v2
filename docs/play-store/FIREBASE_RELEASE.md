# Firebase & release signing checklist

Use this when building with `eas build --profile production`.

## Upload keystore SHA-1 in Firebase

1. Open [Firebase Console](https://console.firebase.google.com) → Project **saksham-homoeopathy-66ec9** → Project settings → Your apps → Android `com.arniparth.sakshamhomoeopathy`.
2. Add the **SHA-1** (and SHA-256) of the certificate used to sign the **Play upload** AAB:
   - EAS: `eas credentials -p android` → view keystore fingerprints, or
   - Play Console → Setup → App signing → **App signing key certificate**.
3. Ensure `application/google-services.json` includes an `oauth_client` entry whose `certificate_hash` matches that SHA-1 (lowercase, no colons).

## Play Integrity / App Check

1. Firebase → App Check → register the Android app.
2. Enable **Play Integrity** for release builds (`application/services/AppCheck.ts` uses `playIntegrity` when not in `__DEV__`).
3. Enforce App Check on Firestore/Storage/Functions only after testing closed-track builds successfully.

## Build command

```bash
cd application
eas build --platform android --profile production
```

Upload the resulting `.aab` to **Internal testing** first, then **Closed testing**.

## Phone OTP — supported countries

The app supports OTP login for: **India (+91)**, **USA (+1)**, **Canada (+1)**, **Singapore (+65)**, **Germany (+49)**, **Australia (+61)**, and **UAE (+971)**.

### Firebase Console setup

1. **Authentication → Sign-in method → Phone** — ensure the Phone provider is enabled.
2. **Authentication → Settings → SMS region policy** — allow SMS to all supported regions:
   - India, United States, Canada, Singapore, Germany, Australia, United Arab Emirates
3. **Authentication → Sign-in method → Phone numbers for testing** — add test E.164 numbers per country for QA (e.g. `+919876543210`, `+15555550100`). Use these in development to avoid SMS quota and cost.
4. Confirm **App Check** and release signing (SHA-1 on Android, APNs on iOS) are configured — OTP verification depends on them in production builds.

### Play / App Store reviewers

Provide at least one Firebase test phone number and OTP code per region in the **App access** section of Play Console / App Store Connect.

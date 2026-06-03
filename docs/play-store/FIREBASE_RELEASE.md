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

# App release and in-app update prompt

Use this checklist whenever you upload a new build to **closed testing** or **production**.

## Firestore setup (one-time)

1. Firebase Console → **Firestore** → create collection `config` (if missing).
2. Add document **`appCurrentVersion`** with a block per platform:

```json
{
  "android": { "mandatory": false, "major": 1, "minor": 0 },
  "ios": { "mandatory": false, "major": 1, "minor": 0 }
}
```

   - `major` / `minor` — the current published version for that platform.
   - `mandatory` — `true` forces the update (blocking, no Later); `false` shows a dismissible prompt.

3. Firebase Console → **Firestore → Rules** — allow clients to read this doc:

```
match /config/appCurrentVersion {
  allow read: if true;
  allow write: if false;
}
```

Manage writes via Firebase Console or Admin SDK only.

## After each EAS build

1. Build: `cd application && eas build -p android --profile production` (or iOS).
2. From the EAS build output / `app.json`, note the **version** (e.g. `1.1.0`) — only `major.minor` matters here.
3. Update Firestore `config/appCurrentVersion`:
   - Set `android.major` / `android.minor` (and `ios.*` when applicable) to the new version.
   - Set `mandatory: true` only when you need to **force** older installs to update (blocking prompt).
4. Upload the AAB/IPA to Play Console closed testing or production (or App Store Connect).
5. On a device with an **older** build installed, open the app — the update prompt should appear within seconds (realtime listener).

## Prompt behavior

Comparison uses **major.minor only** (patch and native build number are ignored).

| Installed vs config | User sees |
|---------------------|-----------|
| Below `major.minor`, `mandatory: true` | **Update required** — blocking, no Later |
| Below `major.minor`, `mandatory: false` | **Update available** — Update or Later |
| At or above `major.minor` | No prompt |
| Doc missing | No prompt |
| Development (`__DEV__`) | No prompt |

**Later** dismisses until you increase `major` / `minor` again.

## Store URLs

- Default Android URL is in [`application/app.json`](../application/app.json) → `extra.stores.android`.
- iOS uses `extra.stores.ios`; set it when the app is live on the App Store.

See also [CLOSED_TESTING.md](./CLOSED_TESTING.md) and [FIREBASE_RELEASE.md](./FIREBASE_RELEASE.md).

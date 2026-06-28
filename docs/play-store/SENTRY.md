# Sentry (Production Only)

Sentry is configured for the `react-native` project under org `arniparth-fq`. It only sends data in production builds (`__DEV__ === false`).

## Local builds

1. Create a Sentry auth token with **Project: Release** and **Org: Read** scopes.
2. Add it to `application/.env.local` (gitignored):

```properties
SENTRY_AUTH_TOKEN=<your-token>
```

3. Build via the npm script or `local-build.sh` (both source `.env.local`, write `.env.sentry-build-plugin` for Gradle, and use the global `eas` CLI):

```bash
cd application
npm run build:android:production
# or from repo root:
./local-build.sh production
```

Do **not** run bare `eas build --local` — it does not load `.env.local`, and the Sentry source-map upload step will fail without `SENTRY_AUTH_TOKEN`.

To skip Sentry uploads for a quick local build (no source maps), use the `production-local` profile:

```bash
bash scripts/eas-local-build.sh --platform android --profile production-local --local
```

## EAS cloud builds

Add the same token as an EAS project secret so source maps upload during production builds:

```bash
cd application
eas secret:create --name SENTRY_AUTH_TOKEN --value <your-token> --scope project
```

The `@sentry/react-native/expo` plugin in `app.json` reads `SENTRY_AUTH_TOKEN` automatically during native builds.

## Verify

1. Run `npx expo start` in dev — no events should appear in Sentry.
2. Build with the `production` EAS profile and trigger a test error — it should appear in the Sentry dashboard.

#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if [[ -f .env.local ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
fi

PROFILE=""
for arg in "$@"; do
  if [[ "$arg" == "--profile" ]]; then
    PROFILE="__next__"
    continue
  fi
  if [[ "$PROFILE" == "__next__" ]]; then
    PROFILE="$arg"
    break
  fi
done

if [[ -z "${SENTRY_AUTH_TOKEN:-}" ]]; then
  if [[ "$PROFILE" == "production" ]]; then
    echo "ERROR: SENTRY_AUTH_TOKEN is not set."
    echo "Add it to application/.env.local, then run:"
    echo "  npm run build:android:production"
    echo "Do not run bare 'eas build --local' — it does not load .env.local."
    exit 1
  fi
else
  export SENTRY_AUTH_TOKEN
  export SENTRY_ORG="${SENTRY_ORG:-arniparth-fq}"
  export SENTRY_PROJECT="${SENTRY_PROJECT:-react-native}"

  # Sentry Gradle plugin reads this file during the native build.
  cat > .env.sentry-build-plugin <<EOF
SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
SENTRY_ORG=${SENTRY_ORG}
SENTRY_PROJECT=${SENTRY_PROJECT}
EOF
fi

if ! command -v eas >/dev/null 2>&1; then
  echo "ERROR: eas CLI is not installed. Run: npm install -g eas-cli"
  exit 1
fi

exec eas build "$@"

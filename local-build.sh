#!/usr/bin/env bash
# Local EAS builds for Saksham Homoeopathy
# Usage:
#   ./local-build.sh production   # Play Store AAB (closed / production track)
#   ./local-build.sh development  # Dev client build

set -euo pipefail

export ANDROID_SDK_ROOT="${ANDROID_SDK_ROOT:-$HOME/Library/Android/sdk}"
export PATH="$PATH:$ANDROID_SDK_ROOT/emulator:$ANDROID_SDK_ROOT/tools:$ANDROID_SDK_ROOT/tools/bin:$ANDROID_SDK_ROOT/platform-tools"

PROFILE="${1:-production}"

cd "$(dirname "$0")/application"

if [[ -f .env.local ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
fi

case "$PROFILE" in
  production)
    npm run build:android:production
    ;;
  development)
    npm run build:android:development
    ;;
  *)
    echo "Unknown profile: $PROFILE (use production or development)"
    exit 1
    ;;
esac

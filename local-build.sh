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

case "$PROFILE" in
  production)
    eas build --platform android --profile production --local
    ;;
  development)
    eas build --platform android --profile development --local
    ;;
  *)
    echo "Unknown profile: $PROFILE (use production or development)"
    exit 1
    ;;
esac

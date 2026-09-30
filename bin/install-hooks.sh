#!/usr/bin/env bash
# install-hooks.sh — put the rules where git will actually run them.
#
# Project: __PROJECT_ID__
#
# git does not run .githooks/ by itself. It runs whatever `core.hooksPath` points
# at, and a fresh clone has that unset, which means every new machine silently
# has NO guards. This sets it, for this clone, and says so out loud — a guard
# that is installed quietly is a guard whose absence nobody notices.
set -euo pipefail

BOLD=$'\033[1m'; GRN=$'\033[32m'; YEL=$'\033[33m'; OFF=$'\033[0m'
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

[ -d .githooks ] || { printf 'no .githooks/ here — wrong directory?\n' >&2; exit 1; }

chmod +x .githooks/* 2>/dev/null || true
git config core.hooksPath .githooks

printf '%sgit hooks installed%s  (core.hooksPath = %s)\n\n' "$BOLD" "$OFF" "$(git config core.hooksPath)"
for h in .githooks/*; do
  [ -x "$h" ] || continue
  printf '  %-22s %s\n' "$(basename "$h")" "$(head -2 "$h" | tail -1 | sed 's/^# //')"
done
printf '\n'
printf '%sRun this in every clone.%s A new machine without it has no guards, and\n' "$YEL" "$OFF"
printf 'the absence of a guard is invisible by definition.\n\n'
printf 'Deliberate overrides exist and are named:\n'
printf '  AIGF_SKIP_BRANCH=1  AIGF_SKIP_SECRETS=1  AIGF_SKIP_TRUTH=1  AIGF_SKIP_PRIVACY=1\n'
printf '  AIGF_ALLOW_MAIN_PUSH=1  AIGF_ALLOW_FORCE_PUSH=1\n'

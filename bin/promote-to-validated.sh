#!/usr/bin/env bash
# Promote main to validated — the gate between "the work landed" and "the work
# serves the public".
#
# Project: learnai  (owner zerwiz)
#
# The house method, taken from Way of Teams (RULES/06-deploy-branches.md):
#
#   main       <- PRs land here. Bad code CAN land here. That is allowed.
#   validated  <- the ONLY branch bin/deploy.sh will let the server pull.
#
# So this script is the only path from one to the other, and it refuses to
# promote anything the checks have not seen. It does not merge, it fast-forwards
# the branch pointer: validated is meant to be a NAME for a commit that passed,
# and a merge commit in between would make "what is live" a question.
#
#   bin/promote-to-validated.sh            # check, promote, say what moved
#   bin/promote-to-validated.sh --yes      # same; --yes is here for symmetry
set -euo pipefail

BOLD=$'\033[1m'; DIM=$'\033[2m'; RED=$'\033[31m'; GRN=$'\033[32m'; YEL=$'\033[33m'; OFF=$'\033[0m'
say()  { printf '%s\n' "$*"; }
step() { printf '%s==>%s %s\n' "$BOLD" "$OFF" "$*"; }
die()  { printf '%s%s%s\n' "$RED" "$*" "$OFF" >&2; exit 1; }

SOURCE="main"
TARGET="validated"

step "checking $SOURCE"
git fetch --quiet origin
git rev-parse --verify "origin/$SOURCE" >/dev/null 2>&1 || die "there is no origin/$SOURCE."

# The four checks a promotion must not skip. They are the same ones the deploy
# runs, and they run HERE because a promotion that cannot be verified is just a
# rename of main.
say "  ${DIM}lint${OFF}";        bun run lint  >/dev/null || die "lint failed. main does not go to validated broken."
say "  ${DIM}types and build${OFF}"
bun run build >/dev/null || die "the build failed. main does not go to validated unbuilt."
say "  ${DIM}schema${OFF}"
if [ -f prisma/schema.prisma ]; then
  npx --no-install prisma migrate status >/dev/null 2>&1 || die "cannot read the migration state."
  npx --no-install prisma migrate status 2>&1 | grep -qi "pending migration" \
    && die "there are pending migrations. A schema change ships with its tables or not at all."
fi
say "  ${DIM}privacy${OFF}"
node scripts/privacy-check.mjs >/dev/null 2>&1 || die "the privacy check refused. main does not go to validated undeclared."

# ---- what is actually moving ------------------------------------------------
if git rev-parse --verify "origin/$TARGET" >/dev/null 2>&1; then
  BEHIND="$(git rev-list --count "origin/$TARGET..origin/$SOURCE")"
  AHEAD="$(git rev-list --count "origin/$SOURCE..origin/$TARGET")"
  [ "$AHEAD" != "0" ] && die "$TARGET is AHEAD of $SOURCE by $AHEAD commit(s).
    Someone promoted, then $SOURCE moved backwards, or $TARGET was changed by hand.
    validated must always be reachable from $SOURCE. Look before you overwrite."
  [ "$BEHIND" = "0" ] && { say "  ${DIM}$TARGET is already at $SOURCE — nothing to promote.${OFF}"; exit 0; }
else
  BEHIND="$(git rev-list --count "origin/$SOURCE")"
  say "  ${DIM}$TARGET does not exist yet; it will be created at $SOURCE.${OFF}"
fi

step "promoting $SOURCE -> $TARGET"
git push --quiet origin "origin/$SOURCE:refs/heads/$TARGET" || die "the push was refused."
SHA="$(git rev-parse "origin/$SOURCE")"
say "  ${GRN}$TARGET is now ${SHA:0:7}${OFF} — $BEHIND commit(s) promoted."
say ""
say "  Production pulls $TARGET, never $SOURCE. Now ship it:"
say "    git checkout $TARGET && git pull && bash bin/deploy.sh --yes"

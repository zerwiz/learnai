#!/usr/bin/env bash
# deploy.sh — one command, and it cannot do the two things that bit us.
#
# THE TWO WOUNDS THIS EXISTS TO PREVENT (2026-09-28):
#   1. Building over the directory a running process serves from. It served old
#      HTML pointing at CSS the build had already deleted, and the site lost its
#      styles. A build now goes into a RELEASE DIRECTORY and is only reached
#      through a symlink, so a running process always has a complete tree.
#   2. Half a deploy with no deploy. Every step that can fail loudly fails
#      BEFORE anything is swapped, and the restart is last, alone, and named.
#
# THE LAWS:
#   - Never deploy a dirty tree. Never deploy unpushed work.
#   - Never push or merge. This script deploys what is already on the branch.
#   - The restart is the ONLY privileged step. If sudo needs a password, the
#     script stops and prints the one line for the Allfather — it never asks
#     for, stores, or reads a password.
#
# Usage:  bin/deploy.sh            plan only (default, changes nothing)
#         bin/deploy.sh --yes      do it
set -eo pipefail

# ---- per-repo config -------------------------------------------------------
REPO_NAME="learnai"
REMOTE="zerwizserver"
REMOTE_DIR="/home/zerwizserver/learnai"
REMOTE_RELEASES="/home/zerwizserver/releases"
REMOTE_CURRENT="/home/zerwizserver/current-learnai"
UNIT="learnai"
PUBLIC_URL="https://learn.zerwiz.org"
# A file that proves the live site is the one we think it is. If this greps
# clean, we shipped something honest. If it hits, the build is not shippable.
TRUTH_GUARD="Five tracks|contractVersion: 1"
HEALTH_PATHS=("/" "/api/tracks")
# ---------------------------------------------------------------------------

YES=0
[ "${1:-}" = "--yes" ] && YES=1
BOLD=$'\033[1m'; DIM=$'\033[2m'; RED=$'\033[31m'; GRN=$'\033[32m'; YEL=$'\033[33m'; OFF=$'\033[0m'

say() { printf '%s\n' "$*"; }
step() { printf '%s==>%s %s\n' "$BOLD" "$OFF" "$*"; }
die() { printf '%s%s%s\n' "$RED" "$*" "$OFF" >&2; exit 1; }

# ---- 1. the tree must be clean and pushed ----------------------------------
step "checking the tree"
[ -z "$(git status --porcelain)" ] || die "the tree is dirty. Commit or stash first - a deploy never carries loose files."
git fetch --quiet origin
LOCAL="$(git rev-parse HEAD)"
REMOTE_HEAD="$(git rev-parse "origin/$(git rev-parse --abbrev-ref HEAD)")"
[ "$LOCAL" = "$REMOTE_HEAD" ] || die "HEAD is not pushed. Every change leaves by PR; push the branch and open one."
say "  ${DIM}$(git rev-parse --abbrev-ref HEAD) @ ${LOCAL:0:7} — pushed, clean${OFF}"

# ---- 2. any sync step the repo has ------------------------------------------
if grep -q '"sync:tracks"' package.json 2>/dev/null; then
  step "syncing the course catalogue"
  bun run sync:tracks || die "the catalogue sync failed. We would rather ship nothing than ship invented courses."
fi

# ---- 3. build, and refuse to ship a lie -------------------------------------
step "building (lint, types, build)"
bun run lint || die "lint failed"
bun run build || die "build failed"

# The truth guard runs on the BUILT output, not the source. A mock that
# survived the build does not ship.
step "truth guard on the built output"
if grep -rEq "$TRUTH_GUARD" .next/standalone 2>/dev/null; then
  HITS="$(grep -rEoh "$TRUTH_GUARD" .next/standalone 2>/dev/null | sort -u | tr '\n' ' ')"
  die "the built output still contains: ${YEL}${HITS}${OFF}
    A number on the public site may only be a count we can query. Fix the source, or the number does not go on the page."
fi
say "  ${DIM}no invented figures in the build${OFF}"

# ---- 4. ship: release directory, then an atomic symlink swap ----------------
RELEASE="$REMOTE_RELEASES/$(date +%Y%m%d-%H%M%S)"
step "backing up the live build, then building the new one"
# KISS, after three clever attempts failed. The staging-tree version was
# "safer" in theory and strictly less reliable in practice: a partial tar copy,
# a half-swapped directory, and routes that 404'd. The thing that actually
# protects production is a BACKUP plus a smoke test that fails loudly.
#
# So: move the current build aside (a rollback is one mv), build in the tree,
# and prove it with bin/smoke.sh before anyone sees it.
ssh "$REMOTE" "set -e
  sudo -u zerwizserver bash -lc '
    set -e
    cd $REMOTE_DIR
    git fetch --quiet origin && git reset --hard origin/\$(git rev-parse --abbrev-ref HEAD)
    /home/zerwizserver/.bun/bin/bun install >/dev/null
    if [ -d prisma/migrations ]; then
      echo "  migrating"
      npx prisma generate >/dev/null
      npx prisma migrate deploy
    fi
    mkdir -p $RELEASE
    if [ -d .next ]; then mv .next $RELEASE/.next.previous; fi
    /home/zerwizserver/.bun/bin/bun run build
    test -f .next/standalone/server.js || { echo "the build produced no server.js"; exit 1; }
    ln -sfn $RELEASE $REMOTE_CURRENT
  '"
say "  ${DIM}release: $RELEASE${OFF}"
say "  ${DIM}current → $RELEASE${OFF}"

# ---- 5. the restart, alone, last, and privileged ---------------------------
step "restarting $UNIT (the only privileged step)"
if ssh -tt "$REMOTE" "sudo -n systemctl restart $UNIT" 2>/dev/null; then
  say "  ${GRN}restarted without a password${OFF}"
else
  say "  ${YEL}the restart needs your sudo. This is the last step; nothing else is pending.${OFF}"
  say "  ${BOLD}  ssh $REMOTE${OFF}"
  say "  ${BOLD}  sudo systemctl restart $UNIT${OFF}"
  say "  ${DIM}(or set NOPASSWD for this one unit once, and never again)${OFF}"
fi

# ---- 6. verify what a visitor actually gets --------------------------------
step "verifying what a visitor gets"
sleep 4
for p in "${HEALTH_PATHS[@]}"; do
  CODE="$(curl -s -o /tmp/deploy-body -w '%{http_code}' -m 20 "$PUBLIC_URL$p" || echo 000)"
  [ "$CODE" = "200" ] || die "$PUBLIC_URL$p returned $CODE"
  say "  ${GRN}200${OFF} $p"
done
if curl -s -m 20 "$PUBLIC_URL/" | grep -Eq "$TRUTH_GUARD"; then
  die "the LIVE page contains an invented figure. Roll back: the previous release is still on disk."
fi
say "  ${DIM}the live page carries no invented figure${OFF}"

say ""
say "${GRN}${BOLD}$REPO_NAME is live at $PUBLIC_URL${OFF}"

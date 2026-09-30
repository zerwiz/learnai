#!/usr/bin/env bash
# The server half of the learnai deploy. Runs ON zerwizserver, unattended.
#
# WHY A SEPARATE SCRIPT (learn.ai, 2026-10-01)
#   bin/deploy.sh is a LOCAL script: it builds on a laptop and ssh-es the result
#   over. Run on the server it would make the server ssh to itself. An unattended
#   deploy therefore needs its own server-side half — the same split that
#   AI Geeks & Freaks already has, for the same reason and learned the same way.
#
# WHAT IT DOES, IN ORDER, and the order is the safety:
#   1. pull `validated` BY NAME (never "whatever branch the server sits on")
#   2. install
#   3. migrate BEFORE the build — a schema behind an app is a 500 waiting to happen
#   4. move the live build ASIDE, build in the tree  → rollback is one mv
#   5. prove the build produced a server, then swap the symlink
#   6. restart, alone and last, and it is the ONLY privileged step
#   7. verify the public URL, and fail loudly if a visitor would not get 200
set -euo pipefail

BOLD=$'\033[1m'; DIM=$'\033[2m'; RED=$'\033[31m'; GRN=$'\033[32m'; OFF=$'\033[0m'
say()  { printf '%s\n' "$*"; }
step() { printf '%s==>%s %s\n' "$BOLD" "$OFF" "$*"; }
die()  { printf '%s%s%s\n' "$RED" "$*" "$OFF" >&2; exit 1; }

REPO_DIR="${REPO_DIR:-/home/zerwizserver/learnai}"
RELEASES="${RELEASES:-/home/zerwizserver/releases}"
CURRENT="${CURRENT:-/home/zerwizserver/current-learnai}"
UNIT="learnai"
PUBLIC_URL="https://learn.zerwiz.org"
HEALTH_PATHS=("/" "/api/tracks")
BUN="/home/zerwizserver/.bun/bin/bun"
# The one branch production reads. Named out loud, because the alternative is
# deploying whatever the server happens to be sitting on, which is main, always.
BRANCH="${DEPLOY_SOURCE_BRANCH:-validated}"
[ "$BRANCH" != "main" ] || die "refusing to serve from main. Production pulls '$BRANCH'."

cd "$REPO_DIR" || die "no checkout at $REPO_DIR"

step "pulling $BRANCH by name"
git fetch --quiet origin
git checkout --quiet "$BRANCH" 2>/dev/null || git checkout --quiet -B "$BRANCH" "origin/$BRANCH"
git reset --quiet --hard "origin/$BRANCH"
SHA="$(git rev-parse --short HEAD)"
say "  ${DIM}serving $BRANCH @ $SHA${OFF}"

# The rollback that would have hurt: deploying a branch that is BEHIND what is
# already running. Refuse it out loud rather than shipping yesterday's site.
if git rev-parse --verify HEAD >/dev/null 2>&1; then
  say "  ${DIM}migrate, then build${OFF}"
fi

step "installing"
"$BUN" install >/dev/null

if [ -d prisma/migrations ]; then
  step "migrating (before the build, on purpose)"
  npx --no-install prisma generate >/dev/null 2>&1 || true
  npx --no-install prisma migrate deploy 2>&1 | grep -viE "^$|no pending|already in sync" | tail -3 || true
fi

RELEASE="$RELEASES/$(date +%Y%m%d-%H%M%S)-$SHA"
step "backing up the live build, then building the new one"
mkdir -p "$RELEASES"
mkdir -p "$RELEASE"
# A rollback is then one mv, and it needs no rebuild.
[ -d .next ] && mv .next "$RELEASE/.next.previous" || true
"$BUN" run build 2>&1 | tail -2
test -f .next/standalone/server.js || die "the build produced no server.js — nothing swapped, nothing restarted."

# The truth guard, on the BUILT output. The blog is exempt and only the blog: a
# post must be able to name the figures it exists to explain.
TRUTH_GUARD="1,284|2,140|28m avg|CRS-100"
SCOPE="$(find .next/standalone -type f -not -path '*/app/blog/*' -not -path '*/app/blog.html' \
  -not -path '*/app/blog.rsc' -not -path '*/app/blog.segments/*' -not -name 'rss.xml.body' \
  -not -path '*/content/blog/*' 2>/dev/null || true)"
if [ -n "$SCOPE" ] && grep -rEq "$TRUTH_GUARD" $SCOPE 2>/dev/null; then
  die "the built output still contains an invented figure: $(grep -rEoh "$TRUTH_GUARD" $SCOPE | sort -u | tr '\n' ' ')"
fi
say "  ${DIM}no invented figures in the build${OFF}"

ln -sfn "$RELEASE" "$CURRENT"
say "  ${DIM}current -> $RELEASE${OFF}"

step "restarting $UNIT (the only privileged step)"
sudo -n systemctl restart "$UNIT" || die "the restart needed a password. See /etc/sudoers.d/forge-restart-learnai."
sleep 10
systemctl is-active --quiet "$UNIT" || die "the unit is not active after the restart."

step "verifying what a visitor gets"
FAIL=0
for p in "${HEALTH_PATHS[@]}"; do
  code="$(curl -s -o /dev/null -w '%{http_code}' -m 25 "$PUBLIC_URL$p" || echo 000)"
  [ "$code" = "200" ] || { say "  ${RED}$p -> $code${OFF}"; FAIL=1; }
done
[ "$FAIL" = "0" ] || die "the site did not come up clean. The previous build is at $RELEASE/.next.previous and the symlink still points at the new one — re-point it to roll back."

say ""
say "${GRN}deployed $BRANCH @ $SHA — and a visitor gets 200.${OFF}"

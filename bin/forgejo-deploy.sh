#!/usr/bin/env bash
# Push this site to OUR Forgejo, and let the server deploy itself.
#
#   bin/forgejo-deploy.sh                 check, promote, push, report
#   bin/forgejo-deploy.sh --user <name>   target another registered forge account
#   bin/forgejo-deploy.sh --dry-run       change nothing, say exactly what would happen
#
# WHY THIS EXISTS
#   The house forge is https://forgejo.zerwiz.org — "Way Of Teams Forge", running
#   on zerwizserver, reached through the cloudflared-forgejo tunnel. It is the
#   place our own accounts live, and it is the TRIGGER for production: a push to
#   `validated` there is what makes zerwizserver rebuild the site (see
#   /home/zerwizserver/.local/bin/aigf-watch-validated and RULES/06).
#
#   So there are two deploy doors and they are not the same thing:
#     bin/deploy.sh          person -> laptop -> server, over ssh
#     bin/forgejo-deploy.sh  person -> our forge -> the server notices by itself
#
#   Both pull `validated`. Neither ever ships `main`.
#
# SECRETS
#   The token is read from the environment or from the vault. It is never
#   written into this repository, never echoed, and never placed in the remote
#   URL permanently — the token is passed for the one push and the remote is put
#   back the way it was found, so a later `git remote -v` cannot leak it.
set -euo pipefail

BOLD=$'\033[1m'; DIM=$'\033[2m'; RED=$'\033[31m'; GRN=$'\033[32m'; YEL=$'\033[33m'; OFF=$'\033[0m'
say()  { printf '%s\n' "$*"; }
step() { printf '%s==>%s %s\n' "$BOLD" "$OFF" "$*"; }
die()  { printf '%s%s%s\n' "$RED" "$*" "$OFF" >&2; exit 1; }

FORGE_HOST="${FORGE_HOST:-forgejo.zerwiz.org}"
FORGE_URL="https://$FORGE_HOST"
REPO_SLUG="${REPO_SLUG:-learnai}"
BRANCH="${DEPLOY_SOURCE_BRANCH:-validated}"
OWNER="${FORGEJO_OWNER:-zerwiz}"
DRY=0

while [ $# -gt 0 ]; do
  case "$1" in
    --user)   OWNER="${2:?--user needs an account name}"; shift 2 ;;
    --dry-run) DRY=1; shift ;;
    --repo)   REPO_SLUG="${2:?--repo needs a name}"; shift 2 ;;
    -h|--help) sed -n '2,20p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) die "unknown option: $1" ;;
  esac
done

# ---- the token: environment first, then the vault ---------------------------
# Never a value in this file, and never in a command that gets logged.
token() {
  if [ -n "${FORGEJO_TOKEN:-}" ]; then printf '%s' "$FORGEJO_TOKEN"; return 0; fi
  local vault="${YMIR_HOME:-$HOME/Documents/ymirhome}/hodd/secrets/forgejo.env"
  if [ -r "$vault" ]; then
    sed -n 's/^FORGEJO_TOKEN=//p' "$vault" | head -1
    return 0
  fi
  return 1
}

# ---- 1. the forge must actually be there ------------------------------------
step "checking the forge"
curl -s -o /dev/null -m 20 "$FORGE_URL/api/v1/version" \
  || die "$FORGE_URL does not answer. The tunnel (cloudflared-forgejo on zerwizserver) is down."
say "  ${DIM}$FORGE_URL is up${OFF}"

# ---- 2. the account must be one of ours -------------------------------------
# "Registered on our forge" is the whole point: this script does not push to a
# stranger's forge, it pushes to an account that exists on this one, and it says
# which one before it does anything.
step "checking the account"
TOKEN="$(token || true)"
[ -n "$TOKEN" ] || die "no token. Put FORGEJO_TOKEN in the environment, or create
  \$YMIR_HOME/hodd/secrets/forgejo.env with a line:  FORGEJO_TOKEN=...
  Mint one with:  docker exec -u git forgejo forgejo admin user generate-access-token --username $OWNER --scopes write:repository,write:user --raw"

WHOAMI="$(curl -s -m 20 -H "Authorization: token $TOKEN" "$FORGE_URL/api/v1/user" \
  | sed -n 's/.*"login":"\([^"]*\)".*/\1/p' | head -1)"
[ -n "$WHOAMI" ] || die "the token was refused by the forge. It may have been revoked or expired."
say "  ${DIM}authenticated as @$WHOAMI${OFF}"
[ "$WHOAMI" = "$OWNER" ] || say "  ${YEL}note: pushing to @$OWNER while authenticated as @$WHOAMI${OFF}"

# ---- 3. the repository, created if this account does not have one ------------
step "checking the repository"
CODE="$(curl -s -o /dev/null -w '%{http_code}' -m 20 -H "Authorization: token $TOKEN" \
  "$FORGE_URL/api/v1/repos/$OWNER/$REPO_SLUG")"
if [ "$CODE" = "404" ]; then
  say "  $OWNER/$REPO_SLUG does not exist yet"
  if [ "$DRY" = "1" ]; then
    say "  ${DIM}dry run: would create it with default branch '$BRANCH'${OFF}"
  else
    curl -s -o /dev/null -m 30 -X POST -H "Authorization: token $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"name\":\"$REPO_SLUG\",\"private\":false,\"auto_init\":true,\"default_branch\":\"$BRANCH\"}" \
      "$FORGE_URL/api/v1/user/repos" || die "could not create the repository."
    say "  ${GRN}created${OFF} $OWNER/$REPO_SLUG"
  fi
elif [ "$CODE" = "200" ]; then
  say "  ${DIM}$OWNER/$REPO_SLUG exists${OFF}"
else
  die "the forge answered $CODE for the repository. That is not a 'missing repo' and this script will not guess."
fi

# ---- 4. what is being promoted ----------------------------------------------
step "checking $BRANCH"
[ "$BRANCH" != "main" ] || die "refusing to push main for a deploy. main is where work lands; validated is what serves."
git fetch --quiet origin
git rev-parse --verify "origin/$BRANCH" >/dev/null 2>&1 \
  || die "there is no origin/$BRANCH. Run bin/promote-to-validated.sh first — the gate cannot be met by a branch that does not exist."

LOCAL_SHA="$(git rev-parse "origin/$BRANCH")"
REMOTE_SHA="$(curl -s -m 20 -H "Authorization: token $TOKEN" \
  "$FORGE_URL/api/v1/repos/$OWNER/$REPO_SLUG/branches/$BRANCH" \
  | sed -n 's/.*"id":"\([0-9a-f]\{40\}\)".*/\1/p' | head -1)"

if [ "$REMOTE_SHA" = "$LOCAL_SHA" ]; then
  say "  ${DIM}the forge is already at ${LOCAL_SHA:0:7} — nothing to do, and no deploy will fire${OFF}"
  say ""
  say "  ${FORGE_URL}/$OWNER/$REPO_SLUG/src/branch/$BRANCH"
  exit 0
fi
say "  ${DIM}forge has ${REMOTE_SHA:0:7}, we have ${LOCAL_SHA:0:7} — the server will deploy within a minute${OFF}"

if [ "$DRY" = "1" ]; then
  say "  ${DIM}dry run: would push origin/$BRANCH -> $OWNER/$REPO_SLUG${OFF}"
  exit 0
fi

# ---- 5. push, with the token for the one command and not a moment longer -----
step "pushing"
REMOTE_NAME="forgejo"
git remote get-url "$REMOTE_NAME" >/dev/null 2>&1 || git remote add "$REMOTE_NAME" "$FORGE_URL/$OWNER/$REPO_SLUG.git"
CLEAN_URL="$(git remote get-url "$REMOTE_NAME")"
# The token goes in for this push only. A credential left in a remote URL is a
# credential that shows up in every `git remote -v` from then on.
git remote set-url "$REMOTE_NAME" "https://${TOKEN}@${FORGE_HOST}/${OWNER}/${REPO_SLUG}.git"
PUSH_OK=0
git push --force "$REMOTE_NAME" "$BRANCH" || PUSH_OK=1
git remote set-url "$REMOTE_NAME" "$CLEAN_URL"
[ "$PUSH_OK" = "0" ] || die "the push failed. The remote has been put back the way it was."

say "  ${GRN}pushed${OFF} $BRANCH @ ${LOCAL_SHA:0:7} -> $OWNER/$REPO_SLUG"
say ""
say "  ${FORGE_URL}/$OWNER/$REPO_SLUG"
say "  The server is watching that branch. It will pull, migrate, build clean, swap the"
say "  release and restart by itself — usually inside a minute, and it verifies the"
say "  public URL afterwards. Watch it with:"
say "    ssh zerwizserver 'tail -f ~/.state/aigf-autodeploy.log'"

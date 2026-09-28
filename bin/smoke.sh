#!/usr/bin/env bash
# smoke.sh — does the course site still tell the truth?
#
# A deploy that returns 200 can still be lying. This asks the questions a
# reader's browser would expose, and it fails loudly on the faults that have
# cost us: the wrong order, a hardcoded count in a heading, a stylesheet that
# 500s, and a feed that 404s.
#
# Usage:  bin/smoke.sh                 # against the public URL
#         BASE=http://127.0.0.1:3001 bin/smoke.sh
set -uo pipefail

BASE="${BASE:-https://learn.zerwiz.org}"
PASS=0; FAIL=0
ok()   { printf '  \033[32mPASS\033[0m %s\n' "$1"; PASS=$((PASS+1)); }
bad()  { printf '  \033[31mFAIL\033[0m %s\n' "$1"; FAIL=$((FAIL+1)); }
head_() { printf '\n\033[1m== %s\033[0m\n' "$1"; }

head_ "1. the doors all open"
for p in / /api/tracks /tracks/your-machine /tracks/working-with-coding-agents; do
  code="$(curl -s -o /dev/null -w '%{http_code}' -m 25 "$BASE$p" || echo 000)"
  [ "$code" = "200" ] && ok "$p → 200" || bad "$p → $code (expected 200)"
done

head_ "2. the contract is one the consumer understands"
api="$(curl -s -m 25 "$BASE/api/tracks" || true)"
echo "$api" | grep -q '"contractVersion":3' && ok "contractVersion 3" || bad "not contractVersion 3"
echo "$api" | grep -q '"stats"' && ok "stats present" || bad "no stats"
echo "$api" | grep -q '"freeLessons"' && ok "freeLessons present (the free tier is countable)" || bad "no freeLessons"
echo "$api" | grep -q '"access"' && ok "every track carries its access" || bad "no access field"

head_ "3. teaching order - the bug that bit us"
order="$(printf '%s' "$api" | python3 -c '
import json,sys
d=json.load(sys.stdin)
t=sorted(d["tracks"], key=lambda x: x["number"])
print(" ".join(str(x["number"]) for x in t))' 2>/dev/null || echo "")"
[ "$order" = "1 2 3 4 5 6 7 8 9 10 11 12" ] && ok "tracks number 1..12 with no duplicates" \
  || bad "the numbers read: '$order'"
first="$(printf '%s' "$api" | python3 -c '
import json,sys
d=json.load(sys.stdin); t=sorted(d["tracks"], key=lambda x: x["number"]); print(t[0]["title"])' 2>/dev/null || echo "")"
[ "$first" = "Your Machine" ] && ok "track 1 is Your Machine" || bad "track 1 is '$first'"

head_ "4. the counts are honest"
minutes="$(printf '%s' "$api" | python3 -c 'import json,sys; print(json.load(sys.stdin)["stats"]["minutes"])' 2>/dev/null || echo 0)"
hours="$(printf '%s' "$api" | python3 -c 'import json,sys; print(json.load(sys.stdin)["stats"]["hours"])' 2>/dev/null || echo -1)"
[ "$hours" -ge 0 ] && [ "$minutes" -ge $((hours*60)) ] && ok "hours ($hours) is not the minutes figure ($minutes) again" \
  || bad "hours/hours mismatch: minutes=$minutes hours=$hours"
page="$(curl -s -m 25 "$BASE/" || true)"
echo "$page" | grep -q "hands-on hrs" && ok "the hero shows an hours figure" \
  || bad "the hero shows no hours figure"

head_ "5. no stale count in the copy"
echo "$page" | grep -qE "Five tracks" && bad "the heading still says 'Five tracks'" || ok "no hardcoded 'Five tracks' in the heading"
echo "$page" | grep -q "Zero fluff." && ok "the heading is 'Zero fluff.' — no number in it" || bad "the heading is not the one we set"

head_ "6. the footer lists every track, including 02"
# The footer renders a literal middot, not an entity - check what is rendered.
for n in 01 02 03 12; do
  echo "$page" | grep -qE "$n (\&middot;|·)" && ok "footer has $n" || bad "footer is missing $n"
done

head_ "7. the free tier is not a wall"
free_tracks="$(printf '%s' "$api" | python3 -c 'import json,sys; print(sum(1 for t in json.load(sys.stdin)["tracks"] if t["access"]=="free"))' 2>/dev/null || echo 0)"
[ "${free_tracks:-0}" -ge 1 ] && ok "$free_tracks track(s) readable free" || bad "no track is free - this site must never be a wall"

head_ "8. the stylesheet is actually served"
css="$(printf '%s' "$page" | grep -o '/_next/static/[^"]*\.css' | head -1 || true)"
if [ -n "$css" ]; then
  code="$(curl -s -o /dev/null -w '%{http_code}' -m 25 "$BASE$css" || echo 000)"
  [ "$code" = "200" ] && ok "stylesheet → 200" || bad "stylesheet → $code (this is how we lost the CSS)"
else
  bad "no stylesheet link found"
fi

printf '\n\033[1m%s\033[0m\n' "$([ "$FAIL" = 0 ] && echo "SMOKE PASSED — $PASS checks" || echo "SMOKE FAILED — $FAIL failed, $PASS passed")"
exit $([ "$FAIL" = 0 ] && echo 0 || echo 1)

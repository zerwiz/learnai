#!/usr/bin/env bash
# Regenerate LearnAI brand assets from brand/*.svg into public/.
# Requires: rsvg-convert, imagemagick (magick).
set -euo pipefail

cd "$(dirname "$0")/.."
OUT=public
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

command -v rsvg-convert >/dev/null || { echo "rsvg-convert missing"; exit 1; }
command -v magick >/dev/null || { echo "imagemagick missing"; exit 1; }

echo "→ icon.svg"
cp brand/icon.svg "$OUT/icon.svg"

echo "→ favicon.ico (16/32/48)"
for s in 16 32 48; do
  rsvg-convert -w "$s" -h "$s" brand/icon.svg -o "$TMP/fav$s.png"
done
magick "$TMP/fav16.png" "$TMP/fav32.png" "$TMP/fav48.png" "$OUT/favicon.ico"

echo "→ icon-192.png / icon-512.png"
rsvg-convert -w 192 -h 192 brand/icon.svg -o "$OUT/icon-192.png"
rsvg-convert -w 512 -h 512 brand/icon.svg -o "$OUT/icon-512.png"

echo "→ apple-icon.png (180, full-bleed)"
rsvg-convert -w 180 -h 180 brand/icon-square.svg -o "$OUT/apple-icon.png"

echo "→ og.png (1200x630)"
rsvg-convert -w 1200 -h 630 brand/og.svg -o "$OUT/og.png"

echo "done:"
ls -la "$OUT" | grep -E "icon|favicon|og\.png"

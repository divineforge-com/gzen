#!/usr/bin/env bash
# Build every wasm/<game>/ entry point into site/static/play/<game>/.
# Safe to run when there are no games yet: it prints a note and exits 0.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
shopt -s nullglob
games=()
for dir in "$root"/wasm/*/; do
  [ -f "$dir/main.go" ] && games+=("$(basename "$dir")")
done

if [ ${#games[@]} -eq 0 ]; then
  echo "build-wasm: no games under wasm/, nothing to build"
  exit 0
fi

command -v go >/dev/null || { echo "build-wasm: go is required to build ${games[*]}" >&2; exit 1; }
goroot="$(go env GOROOT)"
wasm_exec="$goroot/lib/wasm/wasm_exec.js"
[ -f "$wasm_exec" ] || wasm_exec="$goroot/misc/wasm/wasm_exec.js"

for game in "${games[@]}"; do
  out="$root/site/static/play/$game"
  mkdir -p "$out"
  echo "build-wasm: $game -> site/static/play/$game/game.wasm"
  (cd "$root/wasm/$game" && GOOS=js GOARCH=wasm go build -trimpath -ldflags="-s -w" -o "$out/game.wasm" .)
  cp "$wasm_exec" "$out/wasm_exec.js"
  if [ -f "$root/wasm/$game/index.html" ]; then
    cp "$root/wasm/$game/index.html" "$out/index.html"
  else
    cat >"$out/index.html" <<HTML
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>$game · gZen</title><style>html,body{margin:0;height:100%;background:#15120f}canvas{display:block}</style></head>
<body><script src="wasm_exec.js"></script><script>
const go = new Go();
WebAssembly.instantiateStreaming(fetch("game.wasm"), go.importObject).then((r) => go.run(r.instance));
</script></body></html>
HTML
  fi
done

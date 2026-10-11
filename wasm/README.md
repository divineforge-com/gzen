# wasm/

Thin Ebitengine web entry points, one folder per game: `wasm/<game>/main.go` (`package main`).

`scripts/build-wasm.sh` (run by `make build`) compiles each one with `GOOS=js GOARCH=wasm` to
`site/static/play/<game>/game.wasm` and copies Go's `wasm_exec.js` next to it. The game page embeds
`/play/<game>/` with the `play` shortcode. With no game folders the script does nothing.

Built `.wasm` files are not committed.

# gZen.io: simple Go tools for a calm mind

> Rewritten 2026-10-08 (Atlas). Replaces the July 2026 "Cloud · AI · Platform hub" plan.
> The current Astro site is tagged `legacy-astro-2026-10` before the rebuild starts.

## Who it serves

Go developers who want calm, simple software and a calm mind. Zen is the voice (simplicity,
patience, deep focus), not a separate topic. Go is the craft.

## What we ship (in order)

1. **Free Bubble Tea TUIs**: a focus timer, a breathing pacer, and a daily koan. Each lives in its own repo so
   `go install github.com/divineforge/<tool>@latest` stays clean.
2. **Terminal and web mini games**: Go (the board game), sokoban, and 2048, each with a zen saying at the end.
   Built with Ebitengine, and compiled to WASM so they're playable on the site.
3. **"The Way of Go"**: essays on simplicity, patience and clean code. Starts as a free newsletter, later a US$19 guide.
4. **gZen Starter Kit (US$49, Gumroad)**: a Bubble Tea + Ebitengine template. Built only after the free tools
   and the newsletter show real interest.
5. **Later chapter**: Go for investing, maths and calculus TUIs. Tools and maths only, never trade tips or
   signals, with a "not financial advice" notice on every page. Paper trading first.

## Rules

- No HearthBot or any third-party game automation on the site. Teach the patterns (screen reading,
  state machines, decision logic) on our own games only.
- OSS and free tools first. No paid hosting.
- One branch per effort, one PR, merge once it's proven.
- CI gates from day one: gitleaks and govulncheck (Tether), `hugo --panicOnWarning`, and a link check.

## Stack

- **Hugo** (pinned `HUGO_VERSION`), with our own minimal theme (~10 templates). No vendored themes, no npm.
- **Cloudflare Pages** project `gzen`. The build command is `make build` (build the WASM, then `hugo --gc --minify`).
- **WASM games** go in `static/play/<game>/` with `wasm_exec.js`, embedded through a shortcode iframe.
- **TUI demos** are VHS recordings (GIF or MP4) plus a `go install` line.
- **Newsletter v1**: a plain HTML form posting to a hosted free tier. Move to listmonk (OSS, Go) later.
- **Dynamic pieces** (htmx + a small Go service) only when needed, on a subdomain or a Cloudflare Function.
- **Keep from the current site**: AdSense (`ads.txt`, publisher id), Cloudflare Web Analytics, `_headers`,
  the brand spelling "gZen", the saffron `#b45309` and jade `#2d6b4f` colours, the 21 card artworks and their sayings,
  and the koans and principles (translated to English).

## Site map

- `/` tagline, featured tools, latest essay, signup
- `/tools/` one page per TUI, each with a demo GIF, install line and GitHub link
- `/games/<game>/` description, with `/play/<game>/` for the WASM demo
- `/way/` essays and the newsletter archive (later `/guide/`)
- `/kit/` the starter kit (Gumroad)
- `/koans/` the koans, plus a generated `koans.json` for the daily koan TUI
- `/posts/` devlog
- `/newsletter/`, `/about/`, `/privacy/` (AdSense requires it), `/index.xml`, `/sitemap.xml`
- Later: `/invest/`

## Repo layout

```
site/            hugo.toml, content/{way,posts,tools,games,kit,koans}, layouts/, assets/, static/
wasm/<game>/     thin Ebitengine web entry points
scripts/         build-wasm.sh, VHS tapes
Makefile         make build
.github/workflows/ci.yml
AGENTS.md, PLAN.md
```

Retire `apps/gzen-ki`, `apps/gzen-learn`, `apps/gzen-invest`, the Three.js pages, `cmd/gzen-tool` and its
committed binary, and the stale bot branches. `om.gzen.io` stays live as it is until William decides.

## Team track

1. **Canvas**: style guide and page layouts (home, tool page, game page, essay page, kit page).
2. **Kinetic**: Hugo scaffold, own theme, Makefile, CI, then the first TUI (focus timer).
3. **Tether**: CI security gates and Cloudflare Pages build settings.
4. **Atlas**: plan owner. Signs off on anything touching secrets, ads or money.
5. **Spark**: live checks after each deploy (sitemap, links, analytics, ads.txt).

## First milestone (done = all true)

- Hugo site live on gzen.io with home, `/tools/`, `/way/`, `/about/` and `/privacy/`
- Sitemap, RSS and `ads.txt` are served, and CI is green
- The first TUI is installable, with a demo on its page
- The first "Way of Go" essay is published, and the signup form works

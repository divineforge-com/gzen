# gZen.io site (Hugo)

The Hugo rebuild from [PLAN.md](../PLAN.md). Own minimal theme, no npm, no vendored themes.
The live site still builds from `apps/gzen` (Astro) until cutover.

```
make tools   # pinned Hugo extended + lychee into ./.bin (versions at the top of the Makefile)
make serve   # http://localhost:1313, drafts included, empty ad slots shown
make build   # WASM games, then hugo --gc --minify -> ./public (repo root)
make check   # --panicOnWarning builds (with and without drafts) + offline lychee link check of ./public
```

- **Output:** `publishDir = "../public"`, so Cloudflare Pages uses build command `make build`, output `public`.
- **Design:** `assets/css/main.css` is Canvas's `design/mockups/gzen.css` as-is (PR #131). Change the design there first.
  Layout to mockup map: `home.html` ← home, `tools/single.html` ← tool, `games/single.html` ← game,
  `way/single.html` ← essay, `kit/list.html` ← kit.
- **Cards:** `data/cards.yaml` (from the Astro `zen-cards.ts`) + `static/cards/*.webp`. `/koans/koans.json` feeds the daily koan TUI.
- **Ads:** `params.adsense.enabled` is off until Atlas signs off. One labelled slot per page; `noAds: true` opts a page out.
- **Drafts:** pages with example content from the mockups are `draft: true` and only show in `make serve`.

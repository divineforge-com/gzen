# CLAUDE.md — GZen.io · 善聚慧生

This file governs agent behavior on this repository. Read it fully before any action.

---

## Project Identity

**GZen.io** is a multi-site ecosystem:
- **`gzen.io`** (landing gateway)
- **`ki.gzen.io`** (TCM & philosophy notebooks - GZen Ki)
- **`learn.gzen.io`** (meditative learning - GZen Learn)
- **`invest.gzen.io`** (mindful investing infographics - GZen Invest)

The core mission: *collect goodness from around the world and multiply it through Buddha's teachings and traditional wisdom*.

- **Language translation menus**: English first, then Chinese, then Japanese.
- **Monorepo setup**: Manage via `gzen-tool` in the root directory.

---

## Tech Stack (Hugo + Blowfish)

- **Generator**: Hugo extended
- **Themes**: Blowfish theme (for main sites)
- **CSS overrides**: Built-in Hugo Pipes (edit `assets/css/custom.css`)
- **Deployment**: Cloudflare Pages

---

## Workspace Helper commands
- Build all sites: `./gzen-tool build`
- Deploy all sites: `./gzen-tool deploy`
- Lint content structure: `./gzen-tool lint`
- Local preview in any app directory: `hugo server`

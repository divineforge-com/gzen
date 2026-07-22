# CLAUDE.md — gZen.io · Cloud · AI · Platform

This file governs agent behavior on this repository. Read it fully before any action.

---

## Project Identity

**gZen.io** is a multi-site monorepo:
- **`gzen.io`** — Cloud · AI · Platform blog, GDE/AWS Champion portfolio, and resource hub (**English only**)
- **`ki.gzen.io`** — TCM & philosophy notebooks (side project)
- **`learn.gzen.io`** — meditative language learning (side project)
- **`invest.gzen.io`** — mindful investing infographics (side project)

The main site (`apps/gzen`) covers Go content pillars: TUI, Web Apps, API, Cloud & Infrastructure, AI SDKs, General Go Engineering, Platform Engineering, and Business & Consulting.

- **Language**: English only — content lives in `apps/gzen/content/` (no `en/`/`zh/`/`ja/` subdirs)
- **Monorepo setup**: Manage via `gzen-tool` in the root directory

---

## Tech Stack (Hugo + Blowfish)

- **Generator**: Hugo extended (`apps/gzen/.hugo-version`)
- **Theme**: Blowfish (custom overrides)
- **Typography**: JetBrains Mono (code/headings) + system UI body
- **CSS**: Built-in Hugo Pipes (edit `assets/css/custom.css`)
- **Deployment**: Cloudflare Pages via `.github/workflows/deploy-gzen.yml`

---

## Workspace Helper Commands
- Build all sites: `./gzen-tool build`
- Deploy all sites: `./gzen-tool deploy` (needs `CLOUDFLARE_API_TOKEN`)
- Local preview main site: `cd apps/gzen && hugo server -p 1318`

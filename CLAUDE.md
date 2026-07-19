# CLAUDE.md — gZen.io · Cloud · AI · Platform

This file governs agent behavior on this repository. Read it fully before any action.

---

## Project Identity

**gZen.io** is a multi-site monorepo:
- **`gzen.io`** — Cloud · AI · Platform blog, GDE/AWS Champion portfolio, and resource hub
- **`ki.gzen.io`** — TCM & philosophy notebooks (side project)
- **`learn.gzen.io`** — meditative language learning (side project)
- **`invest.gzen.io`** — mindful investing infographics (side project)

The main site (`apps/gzen`) covers eight Go content pillars: TUI, Web Apps, API, Cloud & Infrastructure, AI SDKs, General Go Engineering, Cloud Architecture & Platform Engineering, and Business & Consulting.

- **Language ordering**: English primary, Chinese secondary, Japanese tertiary
- **Monorepo setup**: Manage via `gzen-tool` in the root directory

---

## Tech Stack (Hugo + Blowfish)

- **Generator**: Hugo extended
- **Theme**: Blowfish (custom overrides)
- **Typography**: JetBrains Mono (code/headings) + Noto Sans/Serif SC (body)
- **CSS**: Built-in Hugo Pipes (edit `assets/css/custom.css`)
- **Deployment**: Cloudflare Pages

---

## Workspace Helper Commands
- Build all sites: `./gzen-tool build`
- Deploy all sites: `./gzen-tool deploy`
- Lint content structure: `./gzen-tool lint`
- Local preview in any app directory: `hugo server`

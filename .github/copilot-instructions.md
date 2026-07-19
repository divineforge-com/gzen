# Copilot Instructions for gZen.io

## Project Overview

gZen.io is a Go (Golang) advocacy blog and portfolio built with **Hugo** (Blowfish theme) and deployed on **Cloudflare Pages**. The main site covers six content pillars: TUI, Web Apps, API, Cloud & Infrastructure, AI SDKs, and General Go Engineering.

**Live site:** [gzen.io](https://gzen.io)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Generator | Hugo Extended |
| Theme | Blowfish (custom overrides) |
| Styling | Tailwind CSS + custom CSS |
| Typography | JetBrains Mono (code/headings) + Noto Sans/Serif SC (body) |
| Hosting | Cloudflare Pages |
| Monorepo | gzen-tool (custom Go CLI) |

---

## Repository Structure

```
apps/
  gzen/                 # Go advocacy hub (gzen.io)
    content/            # Trilingual pages (en, zh, ja) + blog posts
    layouts/            # Templates, partials, shortcodes
    assets/css/         # Custom styling
  gzen-ki/              # TCM & Philosophy (side project)
  gzen-learn/           # Language learning (side project)
  gzen-invest/          # Investment infographics (side project)
```

---

## Development Commands

```bash
# Local preview
cd apps/gzen && hugo server

# Build all sites
./gzen-tool build

# Deploy all sites
./gzen-tool deploy
```

---

## Content Pillars

1. **TUI** — Bubble Tea, Charm, Cobra + Viper
2. **Web Apps** — net/http, Gin, Echo, Chi, Templ, HTMX
3. **API** — REST, gRPC, Connect-Go, OpenAPI
4. **Cloud** — Cloudflare Workers, GCP, serverless, Ko
5. **AI SDKs** — Go ADK, Gemini, LangChain Go, PicoClaw
6. **General Go** — concurrency, testing, profiling, generics

---

## Design Conventions

- **Warm palette**: cream background, saffron accents, earth tones
- **JetBrains Mono** for code blocks, headings, and UI labels
- Trilingual: English primary, Chinese secondary, Japanese tertiary
- Static-first: zero runtime dependencies, CDN-delivered

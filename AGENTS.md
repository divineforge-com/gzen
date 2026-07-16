# AGENTS.md — GZen.io · Go Advocacy Hub

> Go Beyond. Build Better.

This is the primary reference for all AI agents working on this repository. **Read this before making any changes.**

---

## What Is GZen.io

GZen.io is a **Go (Golang) advocacy blog and portfolio** — covering TUI, web apps, APIs, cloud infrastructure, AI SDKs, and general Go engineering. It also serves as a GDE roadmap, recommendation hub, and donation landing for Go open-source work.

Additional side projects live in the monorepo:
- `apps/gzen-ki` — TCM & philosophy notebooks (ki.gzen.io)
- `apps/gzen-learn` — meditative language learning (learn.gzen.io)
- `apps/gzen-invest` — infographic capital (invest.gzen.io)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Hugo** (static site generator) |
| Theme | **Blowfish** (custom overrides) |
| Styling | Tailwind CSS + custom CSS |
| Fonts | **JetBrains Mono** (code/headings) + Noto Sans/Serif SC (body) |
| Hosting | **Cloudflare Pages** — auto-deploy on push to `main` |
| Monorepo | `gzen-tool` (Go CLI) — parallel multi-site builds |

---

## Repository Layout

```
apps/
  gzen/                 # Go advocacy hub (gzen.io)
    content/            # Trilingual pages (en, zh, ja) + blog posts
    layouts/            # Templates, partials, shortcodes
    assets/css/         # Custom styling
  gzen-ki/              # TCM & Philosophy (ki.gzen.io)
  gzen-learn/           # Language learning (learn.gzen.io)
  gzen-invest/          # Investment infographics (invest.gzen.io)
```

---

## Design Constraints

1. **Warm Palette** — Background `#fffaf4` (cream), text `#2f2118` (dark brown), accent `#d97845` (saffron)
2. **Readability** — `line-height: 1.8+` for CJK body text
3. **Code-first aesthetic** — JetBrains Mono for code blocks and technical headings, communicating precision and craftsmanship
4. **No Heavy Frameworks** — Pure HTML + Vanilla JS, built by Hugo in <300ms
5. **Trilingual** — English primary, Chinese secondary, Japanese tertiary

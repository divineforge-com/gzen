# AGENTS.md — gZen.io · Cloud · AI · Platform

> Go Beyond. Build Better. Cloud-Native. AI-Powered.

This is the primary reference for all AI agents working on this repository. **Read this before making any changes.**

---

## What Is gZen.io

gZen.io is a **Cloud · AI · Platform portfolio and advocacy hub** powered by Go (Golang) — connecting developers through technical articles, talks, and curated resources covering cloud architecture, AI SDKs, platform engineering, and general Go engineering.

**Target**: AWS Champion Builder with Go as the primary language.

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
| Fonts | **JetBrains Mono** (code/headings) + system-ui (body) |
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

## Local Preview Ports

| App | Port |
|-----|------|
| gZen.io (gzen) | `1318` |
| gZen Ki (ki) | `1319` |
| gZen Invest (invest) | `1320` |
| gZen Learn (learn) | `1321` |

---

## Workflow Pattern

After any code change, **build test + send notification**:
1. Run build verification (e.g. `hugo --gc --minify`)
2. Notify via **Telegram bot** — use the configured bot token and chat ID to send build result summary

Telegram config (set as env vars):
- `TELEGRAM_BOT_TOKEN` — bot token
- `TELEGRAM_CHAT_ID` — target chat

---

## Design Constraints

1. **Warm Palette** — Background `#fffaf4` (cream), text `#2f2118` (dark brown), accent `#d97845` (saffron)
2. **Readability** — `line-height: 1.8+` for body text
3. **Code-first aesthetic** — JetBrains Mono for code blocks and technical headings, communicating precision and craftsmanship
4. **No Heavy Frameworks** — Pure HTML + Vanilla JS, built by Hugo in <300ms
5. **Trilingual** — English primary, Chinese secondary, Japanese tertiary

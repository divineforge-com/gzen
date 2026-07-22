# AGENTS.md — gZen.io · Cloud · AI · Platform

> Go Beyond. Build Better. Cloud-Native. AI-Powered.

This is the primary reference for all AI agents working on this repository. **Read this before making any changes.**

---

## What Is gZen.io

gZen.io is a **Cloud · AI · Platform portfolio and advocacy hub** powered by Go (Golang) — connecting developers through technical articles, talks, and curated resources covering cloud architecture, AI SDKs, platform engineering, and general Go engineering.

**Target**: AWS Champion Builder with Go as the primary language.

**Language**: English only (no zh/ja content or routes).

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
| Hosting | **Cloudflare Pages** — GitHub Action `deploy-gzen.yml` on push to `main` |
| Monorepo | `gzen-tool` (Go CLI) — parallel multi-site builds |

---

## Repository Layout

```
apps/
  gzen/                 # Go advocacy hub (gzen.io) — EN only
    content/            # English pages + blog posts (flat, no language subdir)
    layouts/            # Templates, partials, shortcodes
    assets/css/         # Custom styling
    wrangler.toml       # CF Pages project config for this app
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

## Deploy (gzen.io)

Cloudflare Pages project **gzen**:
- Root directory: `apps/gzen`
- Build command: `hugo --gc --minify`
- Output directory: `public`
- Env: `HUGO_VERSION=0.147.9`
- Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`

Do **not** point the CF project root at the monorepo root with `./public` — that path is empty.

---

## Workflow Pattern

After any code change, **build test**:
1. `cd apps/gzen && hugo --gc --minify`
2. Confirm routes exist at `/`, `/blog/`, `/about/` (no `/en/` prefix)

---

## Design Constraints

1. **Warm Palette** — Background `#fffaf4` (cream), text `#2f2118` (dark brown), accent `#d97845` (saffron)
2. **Readability** — `line-height: 1.8+` for body text
3. **Code-first aesthetic** — JetBrains Mono for code blocks and technical headings
4. **No Heavy Frameworks** — Pure HTML + Vanilla JS, built by Hugo
5. **English only** — no multilingual content dirs or language switcher

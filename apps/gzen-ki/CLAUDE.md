# CLAUDE.md — 元気・健康笔记 / GZen Ki

> Instructions for Claude Code, Claude API agents, and the Claude Agent SDK.

## Project Overview

A Hugo-based multilingual (Chinese/Japanese/English) digital health notebook on Traditional Chinese Medicine (TCM), deployed at **https://genki.gzen.io** via Cloudflare Pages. Part of the **GZen.io** umbrella — technology-powered notebooks and products for the greater good of humanity.

## Active Development Branch

```
claude/hugo-tcm-blog-setup-DQyvD
```

Always develop on this branch. Push here. Do NOT push to `main` without explicit instruction.

## Tech Stack

| Layer | Detail |
|-------|--------|
| Static site | Hugo extended ≥ 0.147.7 |
| Theme | Custom `themes/gzen` (warm jade / Scholar's Studio aesthetic) |
| Deployment | Cloudflare Pages (NOT GitHub Actions — deploy.yml has been removed) |
| Content | Markdown with trilingual frontmatter |
| Herb data | `data/herbs.yaml` |
| Diagrams | `static/diagrams/` (SVG, Excalidraw-compatible) |

## Content Architecture

| Section | Path | Topic |
|---------|------|-------|
| Notes | `/content/notes/` | General TCM fundamentals |
| Qi-Blood | `/content/qixue/` | Qi & Blood theory |
| Spleen-Stomach | `/content/piwei/` | Digestive health |
| Materia Medica | `/content/bencao/` | Herbal medicine |
| Food Therapy | `/content/shiliao/` | Dietary therapy |
| Qigong | `/content/qigong/` | Tai Ji Quan, Ba Duan Jin movement arts |
| Gallery | `/content/gallery/` | TCM herb gallery (pulls from data/herbs.yaml) |

## Frontmatter Template

```yaml
---
title: "中文标题"
title_ja: "日本語タイトル"
title_en: "English Title"
date: 2026-04-05
description: "简体中文描述。"
description_ja: "日本語の説明。"
description_en: "English description."
tags: ["标签1", "标签2"]
---
```

## Theme Architecture

```
themes/gzen/
├── layouts/
│   ├── _default/     # baseof.html, list.html, single.html, search.html
│   ├── gallery/      # list.html (custom herb gallery grid)
│   ├── index.html    # homepage
│   ├── partials/     # header.html, footer.html, head-extra.html
│   └── shortcodes/   # diagram.html, excalidraw.html
└── static/css/
    └── style.css     # all styles — warm jade + Scholar's Studio palette
```

### Available Shortcodes

```
{{< diagram src="/diagrams/file.svg" alt="..." caption="..." >}}
{{< excalidraw src="/diagrams/file.svg" alt="..." caption="..." type="image" >}}
{{< excalidraw src="https://excalidraw.com/#..." type="embed" >}}
```

## Commands

```bash
hugo server          # local dev with hot reload (localhost:1313)
hugo --minify        # production build → public/
bash scripts/new-note.sh <section> <slug> [title]
```

## Contribution Rules

1. All articles: trilingual Chinese (primary), Japanese + English (secondary)
2. New sections need: `_index.md`, section articles, entry in `themes/gzen/layouts/index.html` section cards, and nav entry in `themes/gzen/layouts/partials/header.html`
3. Herb data lives in `data/herbs.yaml` — edit there, not in content files
4. Diagrams go in `static/diagrams/` as SVG (Excalidraw-compatible preferred)
5. Never commit `public/`, `resources/_gen/`, `.hugo_build.lock`
6. CSS variables live in `:root {}` in `style.css` — use them, don't hardcode colors

## GZen Ecosystem Context

This site is the TCM/wellness branch of **GZen.io** — a universe of technology-powered learning notebooks. The long-term vision: make traditional health wisdom (TCM, Tai Ji, Ba Duan Jin, food therapy) accessible to everyone, eventually connecting back to the GZen product umbrella. Content should be accurate, compassionate, and practical.

The favicon character **気** (Japanese: ki / Chinese: qì) is the unifying symbol — the vital life force energy that flows through all living things and all GZen content.

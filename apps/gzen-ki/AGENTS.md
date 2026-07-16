# AGENTS.md — Universal Agent Instructions

> Compatible with: OpenAI Codex, Google Gemini CLI, GitHub Copilot Workspace, Claude Code, and any agent following the AGENTS.md convention.

## Project

**元気・健康笔记 / GZen Ki** — A Hugo static site for Traditional Chinese Medicine knowledge, deployed at https://genki.gzen.io via Cloudflare Pages.

Part of the GZen.io umbrella: technology-powered notebooks for the greater good of humanity.

## Branch Policy

- **Development branch**: `claude/hugo-tcm-blog-setup-DQyvD`
- Push all work here. Do NOT touch `main` unless explicitly asked.
- Always `git fetch origin` before starting new work to check for upstream changes.

## Build & Run

```bash
# Prerequisites: Hugo extended ≥ 0.147.7
hugo server          # dev server, hot reload at localhost:1313
hugo --minify        # production build to public/
```

The site is deployed by **Cloudflare Pages** watching the main branch. There is no GitHub Actions CI — do not recreate `.github/workflows/deploy.yml`.

## Project Structure

```
gzen-ki/
├── CLAUDE.md                 # Claude-specific instructions
├── AGENTS.md                 # This file (universal agents)
├── hugo.toml                 # Hugo config (baseURL, theme, params)
├── content/                  # All Markdown content
│   ├── gallery/              # TCM herb gallery
│   ├── qigong/               # Tai Ji + Ba Duan Jin
│   ├── notes/                # General TCM notes
│   ├── qixue/                # Qi & Blood theory
│   ├── piwei/                # Spleen & Stomach
│   ├── bencao/               # Materia Medica (herbs)
│   └── shiliao/              # Food therapy
├── data/
│   └── herbs.yaml            # Herb gallery data source
├── static/
│   ├── favicon.svg           # 気 jade square favicon
│   └── diagrams/             # SVG educational diagrams
├── themes/gzen/              # Custom Hugo theme
│   ├── layouts/              # HTML templates
│   └── static/css/style.css  # All styles
└── scripts/
    └── new-note.sh           # Helper to scaffold new articles
```

## Content Frontmatter

Every article must have trilingual frontmatter:

```yaml
---
title: "中文标题"
title_ja: "日本語タイトル"
title_en: "English Title"
date: YYYY-MM-DD
description: "中文摘要。"
description_ja: "日本語の説明。"
description_en: "English description."
tags: ["tag1", "tag2"]
---
```

## Style Guide

- **CSS variables**: All colors/spacing use CSS custom properties defined in `:root {}` in `themes/gzen/static/css/style.css`. Never hardcode colors.
- **Language**: Chinese simplified (zh-Hans) primary. Japanese and English as secondary translations.
- **Tone**: Educational, respectful, accessible. TCM is traditional wisdom — present it accurately without dismissing Western medicine.
- **No emojis in prose** — emojis are allowed only in section card icons in `index.html`.

## Data Files

- `data/herbs.yaml` — source of truth for herb gallery. Each entry has: `id`, `name_zh`, `pinyin`, `name_en`, `name_ja`, `category`, `nature`, `nature_zh`, `flavor_zh`, `meridians`, `functions_zh`, `functions_en`, `common_uses`, `color`, `emoji`.

## Do Not

- Do not recreate `.github/workflows/` — Cloudflare Pages handles deployment
- Do not commit `public/`, `resources/_gen/`, `.hugo_build.lock`, `node_modules/`
- Do not add inline styles to HTML templates — use CSS classes
- Do not create duplicate content between `data/herbs.yaml` and content Markdown

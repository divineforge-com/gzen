# gZen monorepo — brand split

## K.I.L.O.

| | App | Domain |
|---|-----|--------|
| **K** | `apps/gzen-ki` | ki.gzen.io |
| **I** | `apps/gzen-invest` | invest.gzen.io |
| **L** | `apps/gzen-learn` | learn.gzen.io |
| **O** | `apps/gzen-om` | om.gzen.io (唵) |

Portal: `apps/gzen` (Astro) → gzen.io

## Design

- bg `#fafafa` · ink `#111` · muted `#6b6b6b` · accent `#b45309`
- Vast whitespace, four tiles, one Hawaiian kilo quote

## Deploy

Cloudflare Pages auto-builds from `main`. Each CF project is configured in the dashboard:

| Project | Root dir | Build command | Output dir | Domain |
|---------|----------|---------------|------------|--------|
| `gzen` | `apps/gzen` | `npm run build` | `dist` | gzen.io |
| `gzen-om` | `apps/gzen-om` | `hugo --gc --minify` | `public` | om.gzen.io |

Push to `main` → CF auto-builds.

## Notify when changes are ready to see

**Development technique:** after any **visible** change (portal UI, deploy, favicon, design), notify William via **StackySentinel** (`@divineforgeBot`) with a Tailscale or production URL. Do not wait for “where do I look?”.

- Skill: `.agents/skills/stackysentinel-notify/SKILL.md` (also `~/.grok/skills/stackysentinel-notify/`)
- Script: `.agents/skills/stackysentinel-notify/scripts/notify.sh`
- Portal dev: `http://rustypandora.banjo-scala.ts.net:1318` (port 1318)
- Bot is **not** Nova (`@novananamiBot`)

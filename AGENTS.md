# gZen monorepo

gZen is a slow walking game on a low-poly 3D world. Read `DIRECTION.md` before adding a page, a simulator, or a character.

Technology advocacy, architecture principles, Go, and Kubernetes live in DivineForge (`../dforge`), not here. The Atrium moves here as encounters on the path. STACKY is the in-world presence. Do not feature him on the public home page until `/world` actually contains him.

## Portal

`apps/gzen` (Astro) → [gzen.io](https://gzen.io)

| Route | What it is |
|-------|------------|
| `/world` | Third-person walk across a low-poly world: Jiangnan Canals, Bamboo Grove, Himalaya, and Nordic Fjord. Sit with a teaching, speak with a wanderer, leave a note. |
| `/sanctuary` | Interactive contemplative 3D diorama: orbit the garden, focus the singing bell, koi pond, crane peak, and bamboo grove. |
| `/cards` | 21 collectible Zen Mind cards across Stillness (止), Impermanence (变), Empty Mind (空), and Loving Presence (慈). |

## Design

- bg `#fafafa` · ink `#111` · muted `#6b6b6b` · accent saffron `#b45309` · jade `#2d6b4f`
- Warm, quiet canvas. Name the product **gZen** (lowercase g, capital Z).

## Deploy

Cloudflare Pages auto-builds from `main`. The CF project is configured in the dashboard:

| Project | Root dir | Build command | Output dir | Domain |
|---------|----------|---------------|------------|--------|
| `gzen` | `apps/gzen` | `npm run build` | `dist` | gzen.io |

Push to `main` → CF auto-builds.

## Notify when changes are ready to see

**Development technique:** after any **visible** change (portal UI, deploy, favicon, design), notify William via **StackySentinel** (`@divineforgeBot`) with a Tailscale or production URL. Do not wait for “where do I look?”.

- Skill: `.agents/skills/stackysentinel-notify/SKILL.md` (also `~/.grok/skills/stackysentinel-notify/`)
- Script: `.agents/skills/stackysentinel-notify/scripts/notify.sh`
- Portal dev: `http://rustypandora.banjo-scala.ts.net:1318` (port 1318)
- Asset proposals (local only): `http://rustypandora.banjo-scala.ts.net:1318/proposal` — Stacky command `proposal.sh` / `npm run proposal`
- Bot is **not** Nova (`@novananamiBot`)

# AGENTS.md — gZen monorepo

> Playground · nexus · URI fabric. Observe first (Hawaiian *kilo*).

## Brands

| Brand | Role |
|-------|------|
| **gZen** | Imagination playground, multi-knowledge notebooks, tool/self-host URIs, portal |
| **DivineForge** | Personal tech lab — essays, satire, speaking, consulting, advocacy (`divineforge.com`) |

Do **not** publish engineering/speaking/consulting content on gzen.io. That lives on DivineForge.

## K.I.L.O.

Hawaiian *kilo* = careful observation.

| | App | Domain |
|---|-----|--------|
| **K** | gzen-ki | ki.gzen.io |
| **I** | gzen-invest | invest.gzen.io |
| **L** | gzen-learn | learn.gzen.io |
| **O** | gzen-om | om.gzen.io (唵 · Buddhism · ZH primary) |

Portal: `apps/gzen` → gzen.io (Tesla-minimal single page).  
Path fabric: `/ki` `/invest` `/learn` `/om` → subdomains.

## Layout

```
apps/
  gzen/        # portal only
  gzen-ki/
  gzen-invest/
  gzen-learn/
  gzen-om/     # Chinese dharma notes
```

## Deploy

- Portal: `.github/workflows/deploy-gzen.yml` → CF project `gzen`
- Om: add CF project `gzen-om` + workflow when DNS ready
- Tool: `./gzen-tool build|deploy`

## Design (portal)

- bg `#fafafa` · ink `#111` · muted `#6b6b6b` · accent `#b45309`
- Vast whitespace, four tiles, one quote — nothing else

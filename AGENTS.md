# AGENTS.md — GZen.io · 善聚慧生 Agent Reference

> 聚善：禅生定，定生慧  
> Goodness gathers; from stillness comes wisdom.

This is the primary reference for all AI agents working on this repository. **Read this before making any changes.**

---

## What Is GZen.io

GZen.io is a multi-site ecosystem bridging traditional wisdom and health, cognitive learning, and long-term financial principles with modern lightweight engineering.

Core design principles:
- **Language ordering**: English primary → Chinese secondary → Japanese tertiary in translation menus
- **Buddhist & TCM grounding**: Traditional health wisdom (TCM, Qigong) and philosophy live on `ki.gzen.io` (GZen Ki)
- **Umbrella branding**: The main gateway `gzen.io` links to all ecosystem products and showcases engineering ethics (Clarity before tools, right tool use)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Hugo** (static site generator) |
| Styling | **Blowfish Tailwind pipeline** |
| Fonts | Noto Sans SC / Noto Serif SC + system-ui |
| Lunar calendar | Vanilla JS — `static/js/lunar.js` (now lives in `apps/gzen-ki/`) |
| Deployment | **Cloudflare Pages** — auto-deploy on push to `main` |

---

## Repository Layout

```
apps/
  gzen/                 # Main landing gateway (gzen.io)
    content/            # Gateway pages (zh, en, ja)
    layouts/            # Gateway templates & footer overrides
    assets/css/         # Gateway styling
  gzen-ki/              # TCM & Philosophy (ki.gzen.io / genki.gzen.io)
    content/            # Trilingual articles (koans, principles, notes, etc.)
    layouts/            # Custom templates
    static/js/lunar.js  # Lunar cycle & lotus stage tracker
  gzen-learn/           # Language learning (learn.gzen.io)
  gzen-invest/          # Investment infographics (invest.gzen.io)
```

---

## Design Constraints

1. **Warm Palette** — Background `#fffaf4` (cream), text `#2f2118` (dark brown), saffron `#d97845`, jade `#2d6b4f`
2. **Readability** — `line-height: 1.8+` for CJK body text
3. **No Heavy Frameworks** — Pure HTML + Vanilla JS, built by Hugo in <300ms

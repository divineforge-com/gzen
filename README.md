# GZen.io · Monorepo

GZen.io is a multi-site ecosystem bridging ancient wisdom, traditional wellness, cognitive learning, and long-term financial stewardship with modern high-performance engineering.

**Main Entry Hub:** [gzen.io](https://gzen.io)

---

## Ecosystem Applications

| Directory | Subdomain | Role & Description |
|-----------|-----------|--------------------|
| [`apps/gzen`](./apps/gzen) | [gzen.io](https://gzen.io) | **Ecosystem Entry Gateway**: Features GZen's core principles, domains, and lightweight technical architecture. |
| [`apps/gzen-ki`](./apps/gzen-ki) | [ki.gzen.io](https://ki.gzen.io) | **元気・健康 / Serene Wisdom Notebooks**: Rooted in TCM, Qi & Blood flow, Tai Ji, Yijing, and Buddhist-inspired philosophy/lunar rhythms. |
| [`apps/gzen-learn`](./apps/gzen-learn) | [learn.gzen.io](https://learn.gzen.io) | **知与学 / Meditative Learning**: Language learning for Japanese, Korean, and Russian guided by mindful concentration. |
| [`apps/gzen-invest`](./apps/gzen-invest) | [invest.gzen.io](https://invest.gzen.io) | **资与财 / Infographic Capital**: Explaining compound growth and long-term dividends through visual SVG diagrams. |

---

## Technical Architecture

GZen.io follows the engineering principles of **Clarity before Tools** and **Right Tool Use**:
- **Framework**: [Hugo](https://gohugo.io) static site generator (zero client-side JS runtimes).
- **Theme pipeline**: [Blowfish](https://blowfish.page) theme + custom CSS overrides.
- **Monorepo Manager**: Custom Go-based CLI [`gzen-tool`](./cmd/gzen-tool) for concurrent multi-site builds and Cloudflare Page deployment.
- **AI Automation**: Low-footprint Go-based AI agent **PicoClaw** (<10MB RAM) for lunar rhythm automation.
- **Hosting**: Cloudflare Pages.

---

## Development & Workspace Tool

We use the compiled `gzen-tool` binary in the root directory to manage monorepo tasks.

```bash
# List all apps
./gzen-tool list

# Build all applications concurrently
./gzen-tool build

# Run lint checks on main content structure
./gzen-tool lint

# Deploy all applications to Cloudflare Pages
./gzen-tool deploy
```

For local preview, navigate to any specific app and run the Hugo development server:
```bash
cd apps/gzen
hugo server
```

---

## Design Systems & Aesthetic

- **Background**: Warm Cream (`#fffaf4`) representing natural parchment.
- **Ink**: Grounded Earth Brown (`#2f2118`) for text.
- **Accent**: Saffron Orange (`#d97845`) and Jade Green (`#2d6b4f`).
- **Typography**: CJK-first Serif/Sans (Noto Serif SC and Noto Sans SC) with line heights `≥ 1.8`.

# gZen.io · Monorepo

gZen.io is a **Cloud · AI · Platform portfolio and advocacy hub** powered by Go (Golang) — a technical blog and portfolio covering cloud architecture, AI SDKs, platform engineering, and general Go engineering. Built with Hugo and deployed on Cloudflare Pages.

**Target**: AWS Champion Builder with Go as the primary language.

**Site:** [gzen.io](https://gzen.io)

---

## What's Here

| Directory | Subdomain | Purpose |
|-----------|-----------|---------|
| [`apps/gzen`](./apps/gzen) | [gzen.io](https://gzen.io) | **Go advocacy hub** — blog, GDE portfolio, speaking, recommendations, donation |
| [`apps/gzen-ki`](./apps/gzen-ki) | [ki.gzen.io](https://ki.gzen.io) | **TCM & Philosophy notebooks** (side project) |
| [`apps/gzen-learn`](./apps/gzen-learn) | [learn.gzen.io](https://learn.gzen.io) | **Meditative language learning** (side project) |
| [`apps/gzen-invest`](./apps/gzen-invest) | [invest.gzen.io](https://invest.gzen.io) | **Infographic capital** (side project) |

---

## Content Pillars (gzen.io)

The main site covers six Go domains:

- **TUI** — Bubble Tea, Charm ecosystem, terminal UI patterns
- **Web Apps** — Gin, Echo, Chi, Templ, HTMX
- **API** — REST, gRPC, Connect-Go, OpenAPI codegen
- **Cloud** — Cloudflare Workers, GCP, serverless Go, infra-as-code
- **AI SDKs** — Go ADK, Gemini SDK, LangChain Go, PicoClaw
- **General Go** — concurrency, testing, profiling, module design

---

## Technical Architecture

- **Generator**: [Hugo](https://gohugo.io) Extended — zero client-side runtime
- **Theme**: [Blowfish](https://blowfish.page) + custom CSS overrides
- **Typography**: JetBrains Mono (code/headings) + system UI body
- **Language**: English only
- **Hosting**: Cloudflare Pages — GitHub Action deploy on `main` (`apps/gzen`)
- **Monorepo tool**: Custom Go CLI [`gzen-tool`](./cmd/gzen-tool) — parallel multi-site builds

---

## Development

```bash
# List all apps
./gzen-tool list

# Build all sites concurrently
./gzen-tool build

# Deploy to Cloudflare Pages
./gzen-tool deploy

# Local preview for gzen.io
cd apps/gzen && hugo server
```

---

## Design Principles

1. **Clarity before Tools** — choose the right tool, use it well, keep it simple
2. **Warm minimalism** — cream palette, saffron accents, generous whitespace
3. **Code-first aesthetic** — JetBrains Mono typography communicates precision and craftsmanship
4. **Developer experience** — fast builds, zero runtime deps, English-first clarity

---

*Built with [Hugo](https://gohugo.io) & [Blowfish](https://blowfish.page/) · Deployed on [Cloudflare Pages](https://pages.cloudflare.com/)*

# GZen.io · Monorepo

GZen.io is a **Go (Golang) advocacy hub** — a technical blog and portfolio covering TUI, web apps, APIs, cloud infrastructure, AI SDKs, and general Go engineering. Built with Hugo and deployed on Cloudflare Pages.

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
- **Typography**: JetBrains Mono (code/headings) + Noto Sans/Serif SC (body)
- **Hosting**: Cloudflare Pages — instant global CDN
- **Monorepo tool**: Custom Go CLI [`gzen-tool`](./cmd/gzen-tool) — parallel multi-site builds in <200ms

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
4. **Developer experience** — fast builds, zero runtime deps, trilingual from day one

---

*Built with [Hugo](https://gohugo.io) & [Blowfish](https://blowfish.page/) · Deployed on [Cloudflare Pages](https://pages.cloudflare.com/)*

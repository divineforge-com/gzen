# GZen.io — Go Advocacy Hub

> **Updated 2026-07-16**: Repurposed from ecosystem gateway to a focused Go (Golang) advocacy blog, technical portfolio, and GDE roadmap site.

---

## Project Vision

GZen.io becomes a **Go-centric technical blog and portfolio** that promotes the Go ecosystem across the full stack — from terminal UIs to cloud infrastructure to AI SDKs. The site serves as:

- **A technical blog** with deep-dive articles on Go patterns, frameworks, and tooling
- **A GDE roadmap** tracking conference talks, workshops, and community contributions
- **A recommendation hub** for Go books, courses, tools, and libraries the author endorses
- **A donation & sponsorship landing** to support open-source Go work
- **A playground index** linking to interactive Go examples, benchmarks, and side projects

### Target Audience

Go developers of all levels — from newcomers exploring the ecosystem to experienced engineers evaluating frameworks and patterns for production systems.

---

## Brand & Identity

| Element | Current | New Direction |
|---------|---------|---------------|
| **Domain** | gzen.io | Keep |
| **Subtitle** | 善聚慧生 / "Where Goodness Gathers" | Go engineering tenets: *Simplicity, Concurrency, Readability* |
| **Tagline** | 禅生定，定生慧 | "Go Beyond. Build Better." or "Crafted in Go." |
| **Emblem** | Lotus SVG (善 mark) | Stylized **GZ monogram** or abstract **Go-inspired geometric** mark |
| **Mood** | Buddhist serene | Warm, precise, craftsmanship-oriented — developer-focused |

The brand evolution keeps the **GZen** name and warm aesthetic while shifting the thematic context from Buddhist philosophy to **Go engineering craftsmanship**.

---

## Content Pillars

Six main content areas, each with dedicated tag/category and corresponding blog posts:

### 1. TUI — Terminal User Interfaces
Frameworks & libraries for building CLI/TUI apps in Go:
- Charm ecosystem (Bubble Tea, Lip Gloss, Bubbles)
- tview / termui / gocui
- Terminal color, input, layout patterns
- Building modern CLI tools with Cobra + Viper

### 2. Web Apps — HTTP & Web Frameworks
Server-side Go for the web:
- net/http stdlib patterns (2xx handler signatures, middleware)
- Gin / Echo / Chi / Fiber — when to use which
- Templ & HTMX — Go-native HTML rendering
- Real-time with WebSockets + Gorilla

### 3. API — REST, gRPC, Connect
Building and consuming APIs in Go:
- RESTful service design with OpenAPI + ogen/oapi-codegen
- gRPC + Protocol Buffers workflow
- Connect-Go — gRPC-compatible, HTTP-friendly
- GraphQL with gqlgen

### 4. Cloud & Infrastructure
Deploying Go applications in production:
- Cloudflare Workers / Pages + Go via TinyGo or WASM
- GCP services with Go SDKs
- Infrastructure-as-Code with Pulumi (Go)
- Container images: minimal distroless + Ko
- Serverless Go patterns

### 5. AI SDKs — Go & Machine Learning
Using AI/ML from Go:
- Google AI SDK for Go (Gemini)
- Go ADK (Agent Development Kit) — code-first agent orchestration
- LangChain Go
- Building AI-powered CLI tools
- PicoClaw — ultra-lightweight Go AI agent (<10MB RAM)

### 6. General Go Engineering
Core Go patterns every developer should know:
- Concurrency: goroutines, channels, select, sync primitives
- Generics: real-world use cases
- Testing: subtests, fuzzing, table-driven tests, benchmarking
- Profiling: pprof, tracing, memory optimization
- Module design: structuring Go projects
- Code generation: go:generate, stringer, genny

---

## Site Structure (gzen.io)

```
gzen.io/
├── (homepage)            # Hero + featured posts + pillar cards + CTA
├── blog/                 # Go technical articles
│   ├── (archive)         # Chronological listing with tag filters
│   └── [slug]/           # Individual post (code blocks, TOC, related)
├── speaking/             # GDE roadmap: talks, workshops, conferences
│   ├── upcoming/         # Scheduled appearances
│   ├── past/             # Archived talks with slides/video links
│   └── topics/           # Talk proposals by subject
├── recommend/            # Curated Go resources
│   ├── books/
│   ├── courses/
│   ├── tools/
│   └── libraries/
├── playground/           # Links to interactive Go examples & repos
├── donate/               # Sponsorship / BuyMeACoffee / GitHub Sponsors
└── about/                # Bio, GDE journey, tech stack, contact
```

### Navigation

```
[GZ logo]  Blog  Speaking  Resources  Playground  Donate  [EN | CN | JP]
```

---

## Technical Architecture

### Stack (unchanged — proven and performant)

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Generator** | Hugo (Extended) | Go-built, sub-200ms builds, zero runtime deps |
| **Theme** | Blowfish (custom overrides) | Proven trilingual support, search-ready |
| **Styling** | Tailwind CSS + custom CSS | Warm palette retained, code-friendly additions |
| **Fonts** | **JetBrains Mono** (code/headings) + Noto Sans/Serif (body) | Developer aesthetic, Go branding alignment |
| **Hosting** | Cloudflare Pages | Global CDN, instant deploy, custom domain |
| **CI** | GitHub Actions | Hugo build + deploy on push to main |
| **Monorepo** | gzen-tool (Go CLI) | Parallel multi-site builds via Goroutines |

### Why JetBrains Mono

| Consideration | JetBrains Mono | Fira Code |
|---------------|---------------|-----------|
| **Aesthetic** | Sharp, precise, modern — matches Go's design philosophy | Rounded, softer, more generic |
| **Ligatures** | Yes (=>, ->, !=, etc.) — clean code display | Yes — but less distinctive |
| **Brand association** | Built by IDE tool-makers → resonates with "builder" audience | Generic open-source project |
| **Pairing** | Excellent with Noto Sans for UI text | Good, but similar weight profile |
| **Recognition** | Highly recognizable in developer community | Common, less distinctive |

**Recommendation: JetBrains Mono** — used for code blocks, technical headings, and monospace display elements. Its precision communicates "tool craftsmanship" and aligns visually with Go's emphasis on clarity and engineering rigor.

---

## Design System

### Color Palette (evolved — warmer, code-friendly)

```css
/* Tailwind Config (proposed additions) */
:root {
  --gzen-bg:       #fffaf4;    /* Warm cream — keep */
  --gzen-surface:  #fff4e8;    /* Light surface — keep */
  --gzen-ink:      #2f2118;    /* Dark brown text — keep */
  --gzen-muted:    #7c624d;    /* Muted text — keep */
  --gzen-accent:   #d97845;    /* Saffron accent — keep */
  --gzen-code-bg:  #f5efe8;    /* Code block background — new */
  --gzen-link:     #2d6b4f;    /* Jade green for links — keep */
  --gzen-border:   #ead9c3;    /* Border color — keep */
}
```

### Typography

| Role | Font | Weight |
|------|------|--------|
| **Body (EN)** | Noto Sans / system-ui | 300 / 400 |
| **Body (CJK)** | Noto Sans SC / JP | 300 / 400 |
| **Headings** | Noto Serif SC / Noto Serif | 400 / 500 |
| **Code / Tech headings** | **JetBrains Mono** | 400 / 500 / 700 |
| **UI labels** | JetBrains Mono | 500 |

### Layout

- **Max width**: 48rem (article content) / 58rem (homepage hero)
- **Line height**: 1.8 (body) / 1.5 (code blocks)
- **Code blocks**: syntax-highlighted with monokai theme (keep existing)
- **Cards**: glassmorphism frosted surfaces (keep existing pattern)

---

## Cleanup Inventory

### Remove / Archive
| File / Section | Reason |
|---------------|--------|
| `content/en/about.md` — ecosystem domain descriptions | No longer relevant; rewrite for Go focus |
| `content/zh/about.md` — same | Rewrite |
| `content/ja/about.md` — same | Rewrite |
| `layouts/partials/home/custom.html` — lotus hero, philosophical banner, ecosystem grid | Replace with Go-focused hero + pillar cards |
| `layouts/partials/footer.html` — ecosystem link section | Replace with Go topic links |
| `layouts/partials/header/basic.html` — Ki/Learn/Invest nav | Replace with Blog/Speaking/Resources/Donate |
| `layouts/partials/extend-footer.html` — language-toggle.js | Keep (still needed) |
| `config/_default/menus.toml` — ecosystem menu items | Replace with new nav structure |
| `assets/css/custom.css` — lotus animations, philosophical tagline styles | Keep base framework; remove lotus-specific animations, replace with Go-themed elements |
| `static/images/yijing-*.png` | Remove (not Go-related) |
| `archetypes/koans.md`, `archetypes/principles.md` | Remove (Buddhist content types) |
| `scripts/new-post.js` | Review / rewrite for Go blog posts |
| `scripts/prune-branches.sh` | Keep or remove (git utility) |
| TODO.md | Replace with new Go-focused checklist |
| PLAN.md (this file replaces the old) | Replaced |

### Keep
| File / Section | Reason |
|---------------|--------|
| Hugo config (`hugo.toml`) | Base structure works; update params |
| `assets/css/schemes/gzen.css` | Color scheme is solid |
| `assets/css/custom.css` — base grid, cards, nav, footer framework | Reusable layout primitives |
| `tailwind.config.js` | Custom colors, fonts; add JetBrains Mono |
| `i18n/*.toml` — keep EN/ZH/JA structure | i18n still needed; update translation strings |
| `layouts/partials/extend-head.html` | Font loading — add JetBrains Mono |
| `static/_headers`, `static/_redirects`, `robots.txt` | Deployment config |

---

## Implementation Roadmap

### Phase 0: Plan & Confirm (this document)
- [x] Audit current state
- [x] Define new vision & content pillars
- [x] Identity cleanup inventory
- [ ] Confirm plan with stakeholders
- [ ] Populate AGENTS.md with new conventions

### Phase 1: Cleanup & Foundation
- [ ] Rewrite ABOUT pages (EN/ZH/JA) — Go-focused bio, tech stack, GDE journey
- [ ] Update Hugo config params — hero text, taglines, descriptions
- [ ] Add JetBrains Mono to font loading & Tailwind config
- [ ] Replace homepage — Go hero, pillar cards, featured posts
- [ ] Update header nav — Blog / Speaking / Resources / Playground / Donate
- [ ] Update footer — Go topic links + donation CTA
- [ ] Rewrite i18n strings for new navigation
- [ ] Remove old archetypes, images, scripts
- [ ] Replace emblem (lotus → GZ mark)

### Phase 2: Blog System
- [ ] Create blog section in Hugo content structure
- [ ] Blog list template (chronological, tag filters, pagination)
- [ ] Blog single template (code blocks, TOC, related posts)
- [ ] Tag taxonomy pages
- [ ] RSS feed generation
- [ ] Seed 3-5 initial Go blog posts

### Phase 3: Supporting Pages
- [ ] Speaking page — conference talks, workshops, slides, videos
- [ ] GDE roadmap timeline
- [ ] Recommendations page — books, courses, tools, libs
- [ ] Playground index — interactive Go examples
- [ ] Donate page — GitHub Sponsors, BuyMeACoffee
- [ ] About page — bio, journey, stack, credits

### Phase 4: Aesthetic Polish
- [ ] Refine hero visual (Go-themed emblem, code snippet background)
- [ ] Code block styling with JetBrains Mono
- [ ] Syntax highlighting polish
- [ ] Responsive testing
- [ ] Performance audit (Lighthouse >90)
- [ ] Open Graph images for blog posts
- [ ] Sitemap & SEO metadata

### Phase 5: Launch & Iterate
- [ ] Deploy to Cloudflare Pages
- [ ] Cross-browser testing
- [ ] Publish first Go blog posts
- [ ] Share on social / dev.to / Go community
- [ ] Iterate on content based on feedback

---

## Content Strategy

### Blog Post Cadence
- **Goal**: 2-4 posts per month
- **Topics**: Rotate across the 6 content pillars
- **Format**: 
  - Title: descriptive, search-friendly
  - Intro: problem context + what reader will learn
  - Body: code-heavy with explanations, benchmarks where applicable
  - Conclusion: summary + call to action (comment, share, donate)

### Go GDE Roadmap
- Track conference talk submissions (CFP tracker)
- Archive delivered talks with slides + video embeds
- Log workshop materials and community contributions
- Measure toward GDE nomination criteria

---

## Go-Centric Design Elements

### Hero Section Concept
```
┌─────────────────────────────────────────────────┐
│  [GZ MARK]                                       │
│                                                  │
│  func main() {                                   │
│    fmt.Println("Go Beyond. Build Better.")       │
│  }                                                │
│                                                  │
│  ┌──────────────────┐  ┌──────────────────┐     │
│  │  Latest: Concur- │  │  Upcoming Talk:  │     │
│  │  rency Patterns  │  │  Go at Cloudflare│     │
│  │  in Go 1.24      │  │  (GopherCon EU)  │     │
│  └──────────────────┘  └──────────────────┘     │
└─────────────────────────────────────────────────┘
```

The hero combines **code display** (JetBrains Mono) with action-oriented elements — a signature look that immediately communicates "this is a Go site."

---

## Monorepo Impact

The other apps (`gzen-ki`, `gzen-learn`, `gzen-invest`) remain unchanged in the monorepo. GZen.io's homepage will still link to them as **side projects** rather than primary ecosystem offerings. The `gzen-tool` build/deploy workflow continues unchanged.

---

**Status**: Planning Phase  
**Last Updated**: 2026-07-16  
**Next Step**: Confirm plan, begin Phase 1 cleanup

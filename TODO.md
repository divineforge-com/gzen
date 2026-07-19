# gZen.io — Go Advocacy Hub Implementation Checklist

Tracks the transformation from ecosystem gateway to Go advocacy blog and portfolio.

---

## Phase 0: Plan & Confirm
- [x] Audit current site state
- [x] Define new vision (Go advocacy hub)
- [x] Identify cleanup inventory
- [x] Write updated PLAN.md
- [x] Update README.md
- [x] Confirm direction before execution

## Phase 1: Cleanup & Foundation

### Content Rewrites
- [x] Rewrite `content/en/about.md` — Go-focused bio, tech stack, GDE journey
- [x] Rewrite `content/zh/about.md` — matching Chinese version
- [x] Rewrite `content/ja/about.md` — matching Japanese version

### Configuration
- [x] Update `hugo.toml` — hero text, taglines, descriptions for all 3 languages
- [x] Update `config/_default/params.toml` — mainSections, article defaults
- [x] Update `config/_default/menus.toml` — Blog, Speaking, Resources, Playground, Donate

### Homepage
- [x] Rewrite `layouts/partials/home/custom.html` — Go hero, pillar cards, featured posts
- [x] Remove philosophical banner, lotus SVG, ecosystem grid
- [x] Add Go code snippet hero visual

### Header & Footer
- [x] Update `layouts/partials/header/basic.html` — nav: Blog / Speaking / Resources / Playground / Donate
- [x] Update `layouts/partials/footer.html` — Go topic links + donation CTA

### i18n
- [x] Update `i18n/en.toml` — new nav strings, Go-focused labels
- [x] Update `i18n/zh.toml` — matching Chinese
- [x] Update `i18n/ja.toml` — matching Japanese

### Design
- [x] Add JetBrains Mono to `extend-head.html` font loading
- [x] Update `tailwind.config.js` — add JetBrains Mono
- [x] Update `assets/css/custom.css` — replace lotus styles, add code block aesthetics
- [x] Create Go-themed emblem (GZ monogram or geometric mark)

### Cleanup
- [x] Remove `static/images/yijing-mountain.png`
- [x] Remove `static/images/yijing-yin-yang.png`
- [x] Remove `archetypes/koans.md`
- [x] Remove `archetypes/principles.md`
- [x] Remove `scripts/new-post.js` (or rewrite for Go posts)
- [x] Remove `scripts/prune-branches.sh` (if not needed)
- [x] Update `AGENTS.md` with new identity

### Branding Polish (2026-07-18)
- [x] Remove legacy `[params.ecosystem]` from `hugo.toml`
- [x] Fix `unsafe = false` → `true` for content rendering
- [x] Add Noto Sans JP + Noto Serif JP font loading for Japanese locale
- [x] Verify OG default image is Go-branded ✅

## Phase 2: Blog System

- [x] Create `content/en/blog/` directory structure
- [x] Create `content/zh/blog/` directory structure
- [x] Create `content/ja/blog/` directory structure
- [ ] Blog list template (`layouts/blog/list.html`) — chronological, tag filter, pagination
- [ ] Blog single template (`layouts/blog/single.html`) — code blocks, TOC, related posts
- [ ] Tag taxonomy support
- [ ] RSS feed generation
- [x] Seed 3-5 initial Go blog posts (EN)
- [ ] Translate seed posts to ZH/JA

## Phase 3: Supporting Pages

- [x] Speaking page — talk archive, slides, video embeds, upcoming
- [x] GDE roadmap timeline
- [x] Recommendations page — books, courses, tools, libraries
- [x] Playground index — interactive Go examples
- [x] Donate page — GitHub Sponsors, BuyMeACoffee
- [x] About page — bio, journey, stack, credits
- [ ] Polish Speaking page with actual talk content

## Phase 4: Aesthetic Polish

- [x] Refine hero visual (code snippet + Go emblem)
- [x] Code block styling with JetBrains Mono
- [x] Syntax highlighting polish
- [x] Open Graph images for blog posts
- [ ] Responsive testing (mobile, tablet, desktop)
- [ ] Performance audit (Lighthouse >90)
- [ ] Sitemap & SEO metadata
- [ ] Accessibility audit

## Phase 5: Launch & Iterate

- [ ] Deploy to Cloudflare Pages
- [ ] Cross-browser testing
- [ ] Publish first 3 Go blog posts
- [ ] Share on dev.to / Go community / social
- [ ] Iterate based on feedback

---

**Status**: Phase 1 complete / Phase 2 in progress
**Last Updated**: 2026-07-18

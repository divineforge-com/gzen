# GZen.io — Go Advocacy Hub Implementation Checklist

Tracks the transformation from ecosystem gateway to Go advocacy blog and portfolio.

---

## Phase 0: Plan & Confirm
- [x] Audit current site state
- [x] Define new vision (Go advocacy hub)
- [x] Identify cleanup inventory
- [x] Write updated PLAN.md
- [x] Update README.md
- [ ] Confirm direction before execution

## Phase 1: Cleanup & Foundation

### Content Rewrites
- [ ] Rewrite `content/en/about.md` — Go-focused bio, tech stack, GDE journey
- [ ] Rewrite `content/zh/about.md` — matching Chinese version
- [ ] Rewrite `content/ja/about.md` — matching Japanese version

### Configuration
- [ ] Update `hugo.toml` — hero text, taglines, descriptions for all 3 languages
- [ ] Update `config/_default/params.toml` — mainSections, article defaults
- [ ] Update `config/_default/menus.toml` — Blog, Speaking, Resources, Playground, Donate

### Homepage
- [ ] Rewrite `layouts/partials/home/custom.html` — Go hero, pillar cards, featured posts
- [ ] Remove philosophical banner, lotus SVG, ecosystem grid
- [ ] Add Go code snippet hero visual

### Header & Footer
- [ ] Update `layouts/partials/header/basic.html` — nav: Blog / Speaking / Resources / Playground / Donate
- [ ] Update `layouts/partials/footer.html` — Go topic links + donation CTA

### i18n
- [ ] Update `i18n/en.toml` — new nav strings, Go-focused labels
- [ ] Update `i18n/zh.toml` — matching Chinese
- [ ] Update `i18n/ja.toml` — matching Japanese

### Design
- [ ] Add JetBrains Mono to `extend-head.html` font loading
- [ ] Update `tailwind.config.js` — add JetBrains Mono
- [ ] Update `assets/css/custom.css` — replace lotus styles, add code block aesthetics
- [ ] Create Go-themed emblem (GZ monogram or geometric mark)

### Cleanup
- [ ] Remove `static/images/yijing-mountain.png`
- [ ] Remove `static/images/yijing-yin-yang.png`
- [ ] Remove `archetypes/koans.md`
- [ ] Remove `archetypes/principles.md`
- [ ] Remove `scripts/new-post.js` (or rewrite for Go posts)
- [ ] Remove `scripts/prune-branches.sh` (if not needed)
- [ ] Update `AGENTS.md` with new identity

## Phase 2: Blog System

- [ ] Create `content/en/blog/` directory structure
- [ ] Create `content/zh/blog/` directory structure
- [ ] Create `content/ja/blog/` directory structure
- [ ] Blog list template (`layouts/blog/list.html`) — chronological, tag filter, pagination
- [ ] Blog single template (`layouts/blog/single.html`) — code blocks, TOC, related posts
- [ ] Tag taxonomy support
- [ ] RSS feed generation
- [ ] Seed 3-5 initial Go blog posts (EN)
- [ ] Translate seed posts to ZH

## Phase 3: Supporting Pages

- [ ] Speaking page — talk archive, slides, video embeds, upcoming
- [ ] GDE roadmap timeline
- [ ] Recommendations page — books, courses, tools, libraries
- [ ] Playground index — interactive Go examples
- [ ] Donate page — GitHub Sponsors, BuyMeACoffee
- [ ] About page — bio, journey, stack, credits

## Phase 4: Aesthetic Polish

- [ ] Refine hero visual (code snippet + Go emblem)
- [ ] Code block styling with JetBrains Mono
- [ ] Syntax highlighting polish
- [ ] Responsive testing (mobile, tablet, desktop)
- [ ] Performance audit (Lighthouse >90)
- [ ] Open Graph images for blog posts
- [ ] Sitemap & SEO metadata
- [ ] Accessibility audit

## Phase 5: Launch & Iterate

- [ ] Deploy to Cloudflare Pages
- [ ] Cross-browser testing
- [ ] Publish first 3 Go blog posts
- [ ] Share on dev.to / Go community / social
- [ ] Iterate based on feedback

---

**Status**: Phase 0 (Planning)
**Last Updated**: 2026-07-16

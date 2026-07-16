# GitHub Copilot Instructions

## Project: 元気・健康笔記 / GZen Ki

A Hugo static site for Traditional Chinese Medicine (TCM) knowledge — part of GZen.io.
Deployed via **Cloudflare Pages** (not GitHub Actions).

## Key Facts for Copilot

- **Hugo** extended ≥ 0.147.7 — Go template syntax (`{{ }}`) throughout layouts
- **Theme**: `themes/gzen/` — custom, warm jade / Scholar's Studio aesthetic
- **Primary language**: Simplified Chinese (zh-Hans) with Japanese + English
- **Data-driven gallery**: herb data in `data/herbs.yaml`, template in `themes/gzen/layouts/gallery/list.html`
- **No JavaScript frameworks** — vanilla JS only, no npm/node
- **No CSS preprocessors** — plain CSS with custom properties in `:root`

## Hugo Template Patterns

```html
<!-- Iterate over site data -->
{{ range .Site.Data.herbs }}
  {{ .name_zh }} — {{ .pinyin }}
{{ end }}

<!-- Get a page param -->
{{ .Params.title_en }}

<!-- Link to section -->
<a href="{{ "/gallery/" | relURL }}">Gallery</a>

<!-- Shortcode usage -->
{{< excalidraw src="/diagrams/ba-duan-jin.svg" alt="八段锦" caption="八段锦功法图" >}}
```

## CSS Custom Properties

All colors/spacing from `themes/gzen/static/css/style.css` `:root`:
- `--color-accent`: jade green `#2d6b4f`
- `--color-vermilion`: cinnabar red `#bf3325`
- `--color-bg`: rice paper `#fdfaf5`
- `--color-header-bg`: deep jade `#1a3a28`
- `--font-sans`: Noto Serif SC (Chinese-optimized serif)

## Do Not Suggest

- GitHub Actions workflows (Cloudflare Pages handles CI/CD)
- npm packages or node_modules
- Inline styles in templates
- JavaScript frameworks or bundlers
- Hardcoded color values (use CSS vars)

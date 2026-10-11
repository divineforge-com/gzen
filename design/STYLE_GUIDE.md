# gZen style guide (Hugo rebuild)

> Canvas, 2026-10-08, for `PLAN.md` (PR #130). Kinetic ports `mockups/gzen.css` to
> `site/assets/css/main.css` as-is, then turns each mockup into a Hugo layout.
> Mockup copy, tool names and repo paths are **example content** until the real tools exist.

## The feeling

Quiet paper, dark ink, one warm accent. A page should feel like a well-kept notebook:
lots of white space, one idea per section, nothing that blinks. Go is the craft, Zen is the voice.

## Colour

| Token | Light | Dark | Use |
|---|---|---|---|
| `--paper` | `#faf7f2` | `#15120f` | page background |
| `--paper-2` | `#f3eee6` | `#1e1a16` | inline code, game stage |
| `--line` | `#e6dfd3` | `#2e2822` | borders, dividers |
| `--ink` | `#1c1917` | `#ede8e1` | text |
| `--ink-2` / `--ink-3` | `#57534e` / `#78716c` | `#b8afa4` / `#8f867b` | secondary and meta text |
| `--saffron` | `#b45309` | `#e39a4f` | the one accent: links, primary button, kanji, focus ring |
| `--jade` | `#2d6b4f` | `#74b894` | eyebrows, tags, notices |
| `--code-bg` | `#1c1917` | `#0e0c0a` | install lines, code, terminal frames |

Saffron and jade are kept from the current site. Dark mode follows the system (`prefers-color-scheme`), no toggle.
Saffron on paper and white on saffron both pass WCAG AA for text.

## Type

System fonts only, no webfonts, nothing to download.

- **Serif** (Iowan Old Style, Palatino, Charter, Georgia) for headings, essays, koans and prices.
- **Sans** (system UI stack) for navigation, buttons and short UI text.
- **Mono** (SF Mono, JetBrains Mono if installed, Menlo) for install lines and code.
- Base size 18px (17px on phones), scale ×1.25. Essays use the serif at 1.25rem with 1.75 line height.
- The brand is always written **gZen**; in the logo the `g` is saffron.

## Space and layout

- 8px grid (`--s1` to `--s9`). Sections get `--s8` (64px) top and bottom, separated by a hairline.
- Two widths: `--read` 40rem for text, `--wide` 64rem for grids and the home page.
- One column on phones. `.split` becomes one column under 48rem; the nav hides Kit and Koans under 40rem (they stay in the footer).

## Components (all in `gzen.css`)

| Component | Class | Notes |
|---|---|---|
| Header and footer | `.site-head`, `.site-foot` | nav: Tools, Games, Way, Kit, Koans; footer adds Newsletter, About, Privacy, RSS |
| Install line | `.install` | the hero of every tool and game page. Dark, mono, `$` prompt, Copy button stays visible |
| Terminal frame | `.term` | wraps the VHS GIF or MP4, 16:10 |
| Card | `.card`, `.tag` | tool, game and essay teasers; optional 4:3 card art on top |
| Koan | `.koan` | big saffron kanji, italic serif saying, card name and number as caption |
| Prose | `.prose` | essays: serif body, dark code blocks, saffron-ruled quotes |
| Signup | `.signup` | saffron-wash box with one email field and one button |
| Game embed | `.play` | square stage for the `/play/<game>/` iframe, key hints underneath |
| Price | `.price`, `.ticks` | kit page |
| Ad slot | `.ad` | see the rule below |
| Notice | `.notice` | jade-ruled box, used for "not financial advice" on the later `/invest/` pages |

Buttons: `.btn-primary` (saffron, one per view) and `.btn-ghost` (outline).

## Pages

| Page | Mockup | Hugo layout | Shape |
|---|---|---|---|
| Home `/` | `home.html` | `index.html` | hero with tagline, install line and demo; three tool cards; latest essay next to a koan; signup |
| Tool `/tools/<tool>/` | `tool.html` | `tools/single.html` | title, lede, install line, demo GIF, usage, keys, built-with, koan, ad |
| Game `/games/<game>/` | `game.html` | `games/single.html` | stage left with the WASM iframe, install and notes right; more games; ad |
| Essay `/way/<slug>/` | `essay.html` | `way/single.html` | eyebrow and number, title, date and read time, 21:9 card-art hero, prose, signup, previous and next, ad |
| Kit `/kit/` | `kit.html` | `kit/single.html` | promise and checklist left, price card right; FAQ. Shows "Join the waitlist" until launch |

Screenshots are in `shots/` (desktop 1280px and mobile 390px).

## Card art

The 22 card artworks (1200×896 webp, soft painterly light) are the only imagery. Use them as essay heroes
(cropped 21:9), on the kit card and on `/koans/`. No stock photos, no icons beyond the kanji.
Every image gets real alt text describing the scene.

## Rules

- **Ads:** at most one AdSense slot per page, after the main content, always labelled "Advertisement".
  Never inside a game, a demo, the install line or the signup. No ads on `/kit/` or `/privacy/`.
- **Motion:** only a 2px card lift and colour fades. Everything stops under `prefers-reduced-motion`.
- **Focus:** a 2px saffron ring on every interactive element. Never remove outlines.
- **Accessibility:** one `h1` per page, real `<button>`s, labelled inputs, AA contrast in both modes.
- **Weight:** no JavaScript except the Copy button and the game iframe. No npm, no webfonts.

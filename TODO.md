# gZen.io — TODO

Direction lives in `DIRECTION.md` (a slow walking game on a low-poly world). The old Go-advocacy-hub checklist that used to be here is retired; Go, Kubernetes and architecture advocacy are DivineForge.

## Cards
- [ ] Add art for #022 The Ocean Tide, #023 The Open Valley, #024 The Unfailing Spring (`apps/gzen/public/assets/cards/zen-0NN.webp`), then set `image` in `src/data/zen-cards.ts`. They appear on the site automatically and the visible count updates itself (`CARD_COUNT`).
- [ ] Wire an image generator into `scripts/generate_zen_cards.py` (`generate_image()`), or paint the art by hand.

## Site basics
- [x] Per-page canonical and og:url, og:image, twitter summary_large_image
- [x] `/sitemap.xml`
- [x] HSTS; CSP in report-only mode (enforce once the console is quiet with AdSense on)
- [ ] Flip `Content-Security-Policy-Report-Only` to `Content-Security-Policy` in `apps/gzen/public/_headers`
- [ ] Pick the AdSense slot ids for real ad units (`ZenAdSlot` still uses a placeholder slot id)
- [ ] Analytics: no GA4 property exists for gzen.io yet (Cloudflare Web Analytics only)

## Proposals waiting on William
- [ ] Remove or archive the unused `apps/gzen-ki`, `gzen-learn`, `gzen-invest`, `enlight`, `gzen-om` Hugo sites and the committed `gzen-tool` binary
- [ ] Delete the PNG originals in `apps/gzen/public/assets/game-design/` and `public/assets/cards` sources now that pages use WebP

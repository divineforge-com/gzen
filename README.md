# gZen.io — a slow walking game

A low-poly 3D world you walk: four shores, a contemplative sanctuary, and Zen Mind cards. STACKY is the presence to meet on the path (see `DIRECTION.md`). DivineForge introduces this place. **Astro** static site → [gzen.io](https://gzen.io).

| | Route |
|---|--------|
| Walk the World | [/world](https://gzen.io/world) — third-person walk across four low-poly shores |
| 3D Sanctuary | [/sanctuary](https://gzen.io/sanctuary) — interactive garden diorama |
| Zen Mind Cards | [/cards](https://gzen.io/cards) — 21 collectible cards shown (24 in `apps/gzen/src/data/zen-cards.ts`; #022–#024 stay hidden until their art exists) |
| Contemplation | [/enlight](https://gzen.io/enlight) — principles, koans, stillness |
| Game design | [/game-design](https://gzen.io/game-design) — the design document |

Technology advocacy, architecture principles, Go, and Kubernetes → [divineforge.com](https://divineforge.com)

## Portal app

```bash
cd apps/gzen
npm install
npm run dev      # http://localhost:1318
npm run build    # → dist/
```

Cloudflare Pages project `gzen`: root `apps/gzen`, build `npm run build` (Node 22.12+), output `dist`.

The card count shown anywhere on the site comes from `CARD_COUNT` in `src/data/zen-cards.ts`: a card only appears once it has an `image`. `/sitemap.xml` is generated from `src/pages`.

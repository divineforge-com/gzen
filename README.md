# gZen.io — Zen gaming & mindfulness

A quiet portal for a walkable low-poly world, a contemplative 3D sanctuary, and collectible Zen Mind cards. **Astro** static site → [gzen.io](https://gzen.io).

| | Route |
|---|--------|
| Walk the World | [/world](https://gzen.io/world) — third-person walk across four low-poly shores |
| 3D Sanctuary | [/sanctuary](https://gzen.io/sanctuary) — interactive garden diorama |
| Zen Mind Cards | [/cards](https://gzen.io/cards) — 21 collectible cards |

Engineering / speaking / consulting → [divineforge.com](https://divineforge.com)

## Portal app

```bash
cd apps/gzen
npm install
npm run dev      # http://localhost:1318
npm run build    # → dist/
```

Cloudflare Pages project `gzen`: root `apps/gzen`, build `npm run build`, output `dist`.

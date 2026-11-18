# gZen.io — a slow walking game

A low-poly 3D world you walk: four shores, a contemplative sanctuary, and Zen Mind cards. The Atrium's encounters are moving here from DivineForge. STACKY is the presence to meet on the path (see `DIRECTION.md`). **Astro** static site → [gzen.io](https://gzen.io).

| | Route |
|---|--------|
| Walk the World | [/world](https://gzen.io/world) — third-person walk across four low-poly shores |
| 3D Sanctuary | [/sanctuary](https://gzen.io/sanctuary) — interactive garden diorama |
| Zen Mind Cards | [/cards](https://gzen.io/cards) — 21 collectible cards |

Technology advocacy, architecture principles, Go, and Kubernetes → [divineforge.com](https://divineforge.com)

## Portal app

```bash
cd apps/gzen
npm install
npm run dev      # http://localhost:1318
npm run build    # → dist/
```

Cloudflare Pages project `gzen`: root `apps/gzen`, build `npm run build`, output `dist`.

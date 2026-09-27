# Brand — gZen portal & DivineForge publication

## gZen = Zen gaming & mindfulness

- Portal: [gzen.io](https://gzen.io), app `apps/gzen`
- **Walk the World** (`/world`) — third-person walk across a low-poly world: Jiangnan Canals, Bamboo Grove, Himalaya, Nordic Fjord
- **Sanctuary** (`/sanctuary`) — interactive contemplative 3D garden (bell, koi, crane, bamboo)
- **Zen Mind Cards** (`/cards`) — 21 collectibles in four spheres: Stillness (止), Impermanence (变), Empty Mind (空), Loving Presence (慈)
- Voice: quiet, contemplative, unhurried. Write **gZen** (lowercase g, capital Z)
- Palette: bg `#fafafa` · ink `#111` · muted `#6b6b6b` · saffron `#b45309` · jade `#2d6b4f`
- Tech blog content does not live here

## DivineForge = engineering publication

- Essays / speaking / consulting / advocacy
- Separate repo: `../divineforge/web` → divineforge.com

## Deploy

- Cloudflare Pages project `gzen`: root `apps/gzen`, build `npm run build`, output `dist`, domain gzen.io
- Push to `main` auto-builds

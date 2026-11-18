# Brand — gZen portal & DivineForge publication

Direction: `DIRECTION.md`. This file is the name, the routes, and the voice.

## gZen = a slow walking game

- Portal: [gzen.io](https://gzen.io), app `apps/gzen`
- **Walk the World** (`/world`) — third-person walk across a low-poly world: Jiangnan Canals, Bamboo Grove, Himalaya, Nordic Fjord
- **Sanctuary** (`/sanctuary`) — interactive contemplative 3D garden (bell, koi, crane, bamboo)
- **Zen Mind Cards** (`/cards`) — collectibles in four spheres: Stillness (止), Impermanence (变), Empty Mind (空), Loving Presence (慈)
- The Atrium's encounters move here from DivineForge. **STACKY** is the presence you meet on the path, inside the low-poly world. Do not put a chat widget on the page, and do not claim STACKY is in the scene until the scene has him.
- Voice: quiet, contemplative, unhurried. Write **gZen** (lowercase g, capital Z). Never GrowZen.
- Palette in this file: bg `#fafafa` · ink `#111` · muted `#6b6b6b` · saffron `#b45309` · jade `#2d6b4f`. Some pages also use `#fffaf4`, `#2f2118`, and `#d97845`. Do not invent a third palette.
- Go, Kubernetes, and architecture essays do not live here

## DivineForge = technology advocacy

- Architecture principles, Go, Kubernetes, and written teardowns
- Separate repo: `../dforge` (`web/` → divineforge.com)
- StackySentinel (`@divineforgeBot`) over there is the operator notify bot, not the in-world STACKY

## Deploy

- Cloudflare Pages project `gzen`: root `apps/gzen`, build `npm run build`, output `dist`, domain gzen.io
- Push to `main` auto-builds

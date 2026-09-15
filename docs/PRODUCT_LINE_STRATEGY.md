# gZen 4-Output Product Strategy & Revenue Blueprint

**Target**: A cohesive, serene, and commercially viable digital ecosystem anchored in Buddhist contemplation, AI companion intelligence, and slow immersive 3D experiences.

---

## 1. The 4 Product Outputs & Domains

| Pillar | Domain / Route | Technical Stack | Core Purpose & Value Proposition |
|---|---|---|---|
| **The Web Portal** | `gzen.io` | Astro 5 static on Cloudflare Pages | The central gateway & philosophy anchor. Clean, minimalist entrypoint showcasing the gZen unified ecosystem and direct navigation to all 3 sister experiences. |
| **The Contemplative Game** | `zen.gzen.io` | Three.js + Blender (Seidan M4) on Cloudflare Pages | An interactive 3D diorama world rooted in Slow Transit, Zen gardens, Kyoto water nodes, and bell meditation. Zero-dopamine contemplative space. |
| **The Wisdom Vault** | `enlight.gzen.io` | Hugo / Astro Markdown Knowledge Base | Deep Buddhist philosophy, Brahmaviharas commentaries, daily mindful prompts, and contemplative lessons (formerly gzen-ki / learn). |
| **The AI Nexus Companion** | `nexus.gzen.io` | Lightweight Web UI + Tailscale MLX / Antigravity | A mindful AI conversational companion offering thoughtful guidance, reflection prompts, and emotional grounding without noisy chat sludge. |

---

## 2. Monetization & Feasible Income Potential

1. **Freemium Contemplative Memberships ($5–$12/mo or $49/yr)**:
   - Free access to the daily diorama and wisdom quotes.
   - Supporter tier unlocks custom Zen diorama biomes (Nordic Fjord, Himalayan Peak), private journaling cloud sync, and custom ambient audio stems.
2. **AI Nexus Guided Reflections (Token/Subscription model)**:
   - Daily grounding check-ins, personal Dharma coaching prompts, and mindful habit tracking.
3. **Digital Zen Artifacts & Micro-Patronage**:
   - Buy Me a Coffee / Stripe donation seals.
   - High-aesthetic downloadable 4K wallpapers, 3D printable Zen garden STLs/models generated from Blender.

---

## 3. Development Cadence & Hourly Iteration

- **Branch**: `dev` across both local repo and Seidan mirror.
- **Seidan Dev Port Mapping**:
  - `gzen.io` & `zen.gzen.io` (Sanctuary 3D): Port 1318
  - `enlight.gzen.io` (Wisdom): Hugo dev port 1319
  - `nexus.gzen.io` (AI Companion): Port 1320 / MLX studio
- **Hourly Agent Verification Loop**:
  - Automated cron checks pipeline status, syncs assets, and updates Discord with fresh clickable previews.

# Direction — gZen

Updated 2026-11-20 (William's call). This file wins over `PLAN.md`, `docs/PRODUCT_LINE_STRATEGY.md`, `docs/zen-rebrand/HANDOFF-PLAN.md` (all retired stubs), and over any note that calls this site GrowZen.

## What gZen is

gZen is **one experience** that blends:

- **Gaming**: a game you play, not a brochure.
- **Game creation**: the making of the game is part of the place (tuning the world, art, cards, tools).
- **Low-poly 3D**: faceted shores, small readable landmarks, a wanderer you can see.
- **Zen**: stillness, teachings, Zen Mind cards, the sanctuary.
- **Ki (health)**: breath, qigong and taiji, body-and-mind practice, food and rest, drawn from `apps/gzen-ki`.
- **Enlightenment**: koans, principles, contemplative reading.

These are not six products. They are six ways of being on one walk. The walk stays the spine: a person crosses a shore, stops when something catches them, meets a teaching or a practice, and leaves lighter.

The world has four shores (Jiangnan Canals, Bamboo Grove, Himalaya, Nordic Fjord), a sanctuary diorama, and the Zen Mind cards (Stillness 止, Impermanence 变, Empty Mind 空, Loving Presence 慈). Keep building on that. Do not replace it with a blog, a generic wellness tracker, or a Go tutorial.

## What the two sites share

One person. Attention is the craft.

- DivineForge is a system you can click, and a sentence he wants to remember. It introduces this place and links here.
- gZen is a shore you walk. STACKY is the presence on the path, inside the low-poly world. Not a chat widget, not a shopkeeper, and not a claim on the home page until `/world` contains him.
- On DivineForge, StackySentinel (`@divineforgeBot`) is only the operator notify bot.

## What belongs, and what does not

In scope: gaming, game creation, low-poly 3D, zen, ki (health), enlightenment, and the cards, cosmetics and supporter tier that grow out of them.

Ki is in scope. Content from `apps/gzen-ki` (qigong, taiji, Ba Duan Jin, constitution types, herbs and food notes) can be folded in, for example as a **ki shore** inside `/world` with short practices, rather than as a separate site. Fold in; do not run it as a second product. Health content is practice and reflection, not medical advice; say so where it appears.

Still off the portal: Go, Kubernetes, architecture principles, simulators, and technology advocacy (DivineForge: `../dforge`). `apps/gzen-learn` (language lessons) and `apps/gzen-invest` (investing) are off-direction. `apps/gzen-ki`, `enlight` and `gzen-om` are source material to merge into the portal, not sites to deploy separately. Subdomains `zen.`, `enlight.`, `nexus.`, `ki.`, `invest.`, `learn.` do not exist and are not planned; everything lives on gzen.io.

Not yet: an AI companion or a chat window. Not a habit streak with punishment. Not an account wall: someone can walk without signing in.

## Money

William's order (2026-11-20): **product sales and microtransactions first**, then a supporter tier, with AdSense kept light and decided later (William reviews the ad unit himself). Monetization stays out of the way of the walk.

1. **Product sales and microtransactions (first).**
   - Cosmetics: art-style sets, wanderer outfits, card backs and foil variants, washi and seal (chop) sets.
   - Card packs and art sets: a pack is a visible, fixed list of cards or art you can see before buying. It is never a random draw.
   - Small digital goods: wallpapers, printable cards, ambient sound packs, practice sheets.
   - Free core stays free. No gacha or loot boxes, no pay-to-win, no pay-to-skip, no countdown pressure.
   - Built as a **Market** inside the walk. Until a payment provider is chosen the Market shows items with "coming soon" prices; no checkout exists and none should be added without William's go-ahead.
2. **Supporter tier (second).** A small recurring or one-off tier that saves progress across devices and unlocks supporter cosmetics, and removes ads if ads are running. It is an act of generosity (dāna), not a gate: everything in the walk stays playable without it.
3. **AdSense, light and later (third).** One unit is live on `/cards` today. William reviews ad placement later. Rules whatever the placement: never on the game canvas (`/world`, `/sanctuary`, `/emporium`, any Phaser or three.js scene), never inside a contemplative moment (sitting with a teaching, a breath practice, a bell), at most one labelled unit per reading page, no pop-ups, interstitials or video ads.

Analytics: gzen.io gets its own GA4 property so product and market interest can be measured. Only real numbers are quoted.

## Phased roadmap

Proposals; each phase ships on its own.

- **Phase 0 (now):** quick-wins merged (SEO, card-art 404, accessibility, headers). GA4 for gzen.io. The Emporium port joined into gzen as the **Market** hub (UI and catalog only, "coming soon" prices). Replace placeholder home copy ("SYS // KINETIC", "SOVEREIGN", "Gaming & Zen") with one plain promise. Delete unused components (`GiftSection`, `Hero`, `ElementGrid`, `ElementCard`).
- **Phase 1:** a persistent player (local first): cards earned, teachings read, seals collected. Card art for #022 to #024. Daily Dharma Seed. Pick a payment provider with William, then sell the first small items: a free cosmetic set, then paid card packs and art sets.
- **Phase 2:** a **ki shore** in `/world` built from `apps/gzen-ki` (a few breath and qigong practices, clearly not medical advice). Wanderer wardrobe. More paid cosmetics (outfits, seal sets) and small digital goods.
- **Phase 3:** supporter tier (cross-device save, supporter cosmetics, ad-free). Game creation: tuning of world parameters (`game-genes.json` style) and shareable paths or art-style sets. Creator-made cosmetics with revenue share.
- **Phase 4:** asynchronous notes, letters, cranes and lanterns across the network (edge worker, see the GDD). Optional physical bridges (a seal set or anthology). Revisit ad placement with William's review.

## Voice and name

Write **gZen** (lowercase g, capital Z). Never GrowZen.

Quiet, concrete, unhurried. One shore is about ten minutes. No streak, no save-state nag.

Palette is already split in the pages (`#b45309` and `#d97845`, `#fafafa` and `#fffaf4`). Do not invent a third. Reconcile the tokens in a later visual pass. `BRAND.md` is the name and the route list. This file is the direction.

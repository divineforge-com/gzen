import { ZEN_CARDS, SPHERES } from './zen-cards';

/**
 * Market catalog (UI and data only).
 * There is no checkout: every item shows "Coming soon". Do not add a payment
 * integration here without William's go-ahead. Rules (see DIRECTION.md):
 * packs are fixed, visible lists (never random draws); no pay-to-win.
 */
export type MarketKind = 'cosmetic' | 'pack' | 'digital';

export interface MarketItem {
  id: string;
  kind: MarketKind;
  name: string;
  blurb: string;
  /** Visible contents of a pack or set */
  contents?: string[];
  /** Shown instead of a price until a payment provider is agreed */
  price: 'Coming soon';
}

const COMING: 'Coming soon' = 'Coming soon';

export const COSMETICS: MarketItem[] = [
  { id: 'art-ink-wash', kind: 'cosmetic', name: 'Ink Wash art style', blurb: 'A soft sumi-e look for your Zen Mind cards.', price: COMING },
  { id: 'art-golden-hour', kind: 'cosmetic', name: 'Golden Hour low-poly set', blurb: 'Warm evening light for the four shores.', price: COMING },
  { id: 'outfit-saffron', kind: 'cosmetic', name: 'Saffron wanderer robe', blurb: 'An outfit for the wanderer. Purely visual.', price: COMING },
  { id: 'outfit-indigo', kind: 'cosmetic', name: 'Indigo wanderer robe', blurb: 'A deep blue outfit with a pale sash.', price: COMING },
  { id: 'card-back-lotus', kind: 'cosmetic', name: 'Lotus card back', blurb: 'A new back for every card you own.', price: COMING },
  { id: 'washi-gold-leaf', kind: 'cosmetic', name: 'Gold Leaf washi and Cinnabar seal', blurb: 'Writing paper and a carved seal for your notes.', price: COMING },
];

/** Packs are built from the real card list so contents are always accurate and visible. */
export const CARD_PACKS: MarketItem[] = SPHERES.filter((s) => s.id !== 'all').map((sphere) => {
  const cards = ZEN_CARDS.filter((c) => c.sphere === sphere.id);
  return {
    id: `pack-${sphere.id}`,
    kind: 'pack' as const,
    name: `${sphere.label} pack`,
    blurb: `${cards.length} cards, all shown below. No random draws.`,
    contents: cards.map((c) => `${c.number} ${c.title}`),
    price: COMING,
  };
});

export const DIGITAL_GOODS: MarketItem[] = [
  { id: 'wallpapers-shores', kind: 'digital', name: 'Four Shores wallpapers', blurb: 'Phone and desktop wallpapers of the four low-poly shores.', price: COMING },
  { id: 'cards-printable', kind: 'digital', name: 'Printable Zen Mind cards', blurb: 'Print-ready PDF of the cards.', price: COMING },
  { id: 'sound-bells', kind: 'digital', name: 'Bell and bowl sound pack', blurb: 'Ambient bell and singing-bowl loops.', price: COMING },
  { id: 'sheet-morning', kind: 'digital', name: 'Morning reflection sheet', blurb: 'A one-page, five-minute morning practice.', price: COMING },
];

export const MARKET_SECTIONS: { id: string; title: string; note: string; items: MarketItem[] }[] = [
  { id: 'cosmetics', title: 'Cosmetics', note: 'Visual only. Never required to play.', items: COSMETICS },
  { id: 'packs', title: 'Card packs', note: 'Fixed lists you can read before you ever buy.', items: CARD_PACKS },
  { id: 'digital', title: 'Small digital goods', note: 'Downloads that sit outside the game.', items: DIGITAL_GOODS },
];

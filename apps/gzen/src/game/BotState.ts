/**
 * Market wanderers and merchants (personalities and state).
 * Internal keys (spark, atlas, tether, kinetic, ying, canvas) are kept so sprites,
 * zones and the DOM wiring stay stable; the visible names are gzen's own:
 * Willow, Ridge, Cedar, Tea, Lantern and Brush.
 */

export interface BotProfile {
  name: string;
  role: string;
  color: string;
  /** Dark body fill used by procedural voxels */
  baseBg: string;
  quotes: {
    select: string[];
    move: string[];
    collide: string[];
    idle: string[];
    goal: string[];
    greet: string[];
  };
}

export const BOT_PROFILES: Record<string, BotProfile> = {
  spark: {
    name: 'Willow',
    role: 'The Card Keeper',
    color: '#3DBF7A',
    baseBg: '#E8F6EE',
    quotes: {
      select: [
        "Willow here. Pick a card, any card, slowly.",
        "Cards are small teachings you can hold.",
        "Let us see what the willow has kept for you.",
      ],
      move: [
        "Soft steps. The canal does not hurry.",
        "Walking is how a card gets read.",
        "One foot, one breath.",
      ],
      collide: [
        "A wall. The willow bends, so I will too.",
        "Blocked. Nothing to fight; I will go around.",
        "Stone does not mind. I turn.",
      ],
      idle: [
        "Standing is fine. A card is better with a pause.",
        "The canal keeps moving. So can you.",
        "No hurry. I am here.",
      ],
      goal: [
        "There. A card finds its reader.",
        "Stillness reached, one tile at a time.",
        "Good. Rest here a moment.",
      ],
      greet: [
        "Welcome to the Card Stall. Twenty-one cards, four spheres.",
        "Hello, wanderer. Browse, nothing is rushed.",
        "The packs are not open yet, but the cards are free to read.",
      ],
    },
  },
  atlas: {
    name: 'Ridge',
    role: 'The Teacher',
    color: '#A8B83A',
    baseBg: '#F2F4E4',
    quotes: {
      select: [
        "Ridge listening. The mountain does not lean.",
        "Ready. One teaching at a time.",
        "Clarity before tools. I am steady.",
      ],
      move: [
        "Slowly up the ridge.",
        "Each step is its own teaching.",
        "No rush. The summit is the same either way.",
      ],
      collide: [
        "A wall. Notice it, then go around.",
        "Blocked: the second arrow is being angry about it.",
        "Even the mountain has edges.",
      ],
      idle: [
        "Sit with it. That is the teaching.",
        "Stillness is not doing nothing.",
        "The cup is empty, and so am I.",
      ],
      goal: [
        "Arrived. Nothing to add.",
        "Simplicity before scale. Well walked.",
        "The teaching lands when you stop chasing it.",
      ],
      greet: [
        "Teaching Hall. Koans and principles, read slowly.",
        "Welcome. Take one teaching with you, not ten.",
        "Ask what you are carrying that you could set down.",
      ],
    },
  },
  tether: {
    name: 'Cedar',
    role: 'The Wayfinder',
    color: '#4A9BC7',
    baseBg: '#E6F2F7',
    quotes: {
      select: [
        "Cedar here. The fjord is calm and so am I.",
        "Ready to point you to the walk.",
        "Path found. Shall we?",
      ],
      move: [
        "Following the shoreline.",
        "Cold air, clear head.",
        "Steady, the fjord is long.",
      ],
      collide: [
        "A wall. The water goes around, and so do we.",
        "Blocked. The path is elsewhere.",
        "Turn, do not argue with stone.",
      ],
      idle: [
        "The water is still. Join it.",
        "Waiting is also a way to walk.",
        "Breathe in. Out.",
      ],
      goal: [
        "Here. The shore is quiet.",
        "Good crossing.",
        "Arrived, without arriving anywhere in particular.",
      ],
      greet: [
        "The Walk Gate. /world is four low-poly shores, one path.",
        "Welcome. Walk off the plaza and the world begins.",
        "The sanctuary is a short walk from here, too.",
      ],
    },
  },
  kinetic: {
    name: 'Tea',
    role: 'The Breath Keeper',
    color: '#8B6BC9',
    baseBg: '#F0EAF7',
    quotes: {
      select: [
        "Tea here. Steam rising, shoulders dropping.",
        "Ready for a breath.",
        "Bamboo bends and does not break.",
      ],
      move: [
        "Gentle steps, soft knees.",
        "Walking meditation: heel, then toe.",
        "Let the breath set the pace.",
      ],
      collide: [
        "A wall. Exhale, turn.",
        "Blocked. No need to push.",
        "Bamboo sways around it.",
      ],
      idle: [
        "Shoulders down. Jaw soft.",
        "Three slow breaths, if you like.",
        "Rest is part of the practice.",
      ],
      goal: [
        "Arrived. Notice your breathing.",
        "Good. A little warmer, a little quieter.",
        "The body walked; the mind caught up.",
      ],
      greet: [
        "Ki Pavilion. Breath, qigong and taiji notes, not medical advice.",
        "Welcome. Sit if you like; tea is imaginary but warm.",
        "If something hurts, see a professional. Otherwise, breathe with me.",
      ],
    },
  },
  ying: {
    name: 'Lantern',
    role: 'The Merchant',
    color: '#E07A9B',
    baseBg: '#FBEBF0',
    quotes: {
      select: [
        "Lantern lit. Browse as long as you like.",
        "The market is open, softly.",
        "Ready to show you the shelves.",
      ],
      move: [
        "Light steps, lit path.",
        "Walking the market, slowly.",
        "Nothing here is urgent.",
      ],
      collide: [
        "A wall. The lantern goes around.",
        "Blocked. I will find another aisle.",
        "No rush, no crowd.",
      ],
      idle: [
        "Take your time. The stall is not going anywhere.",
        "Browsing is welcome. Buying is optional.",
        "Standing in the light is fine.",
      ],
      goal: [
        "There. A good spot to look around.",
        "The shelves are tidy. Have a look.",
        "Well found.",
      ],
      greet: [
        "Welcome to the Market. Cosmetics, card packs, small goods. Prices are coming soon.",
        "Hello! Nothing is for sale yet. Everything is being prepared with care.",
        "No gacha, no pressure. Packs will always show what is inside.",
      ],
    },
  },
  canvas: {
    name: 'Brush',
    role: 'The Maker',
    color: '#D4A017',
    baseBg: '#F7F0DC',
    quotes: {
      select: [
        "Brush up. Ink is wet.",
        "Ready to make something small.",
        "Every game starts as a sketch.",
      ],
      move: [
        "Drawing a line across the floor.",
        "Steps like strokes.",
        "Low-poly: few lines, careful ones.",
      ],
      collide: [
        "A wall. Edit the plan, not the world.",
        "Blocked. A new route is a new design.",
        "Constraint is half of craft.",
      ],
      idle: [
        "Thinking in shapes.",
        "A pause before the next stroke.",
        "Idle hands, busy eyes.",
      ],
      goal: [
        "Done. Ship the small thing.",
        "A tidy stroke. Good.",
        "Made, and made quietly.",
      ],
      greet: [
        "Maker's Studio. Art styles, seals, and how the walk gets built.",
        "Welcome. Press B on a tile to place or clear a stone.",
        "Game creation lives here. Today it is stones; later, whole paths.",
      ],
    },
  },
};

export const BOT_KEYS = Object.keys(BOT_PROFILES);

export type QuoteType = keyof BotProfile['quotes'];

export class BotStateManager {
  private activeBotKey: string = 'spark';
  private gridX: number = 0;
  private gridY: number = 0;
  private gridZ: number = 0;
  private lastActionTime: number = Date.now();
  private quoteCooldown: number = 4000;
  private lastQuoteTime: number = 0;

  constructor(startX: number, startY: number, startZ: number) {
    this.gridX = startX;
    this.gridY = startY;
    this.gridZ = startZ;
  }

  getActiveBotKey(): string {
    return this.activeBotKey;
  }

  getActiveBot(): BotProfile {
    return BOT_PROFILES[this.activeBotKey];
  }

  setActiveBot(key: string): string {
    if (BOT_PROFILES[key]) {
      this.activeBotKey = key;
      this.lastActionTime = Date.now();
      return this.getRandomQuote('select');
    }
    return '';
  }

  getPosition() {
    return { x: this.gridX, y: this.gridY, z: this.gridZ };
  }

  setPosition(x: number, y: number, z: number) {
    this.gridX = x;
    this.gridY = y;
    this.gridZ = z;
    this.lastActionTime = Date.now();
  }

  getRandomQuote(type: QuoteType): string {
    const profile = this.getActiveBot();
    const list = profile.quotes[type];
    const index = Math.floor(Math.random() * list.length);
    return list[index];
  }

  getQuoteFor(botKey: string, type: QuoteType): string {
    const profile = BOT_PROFILES[botKey];
    if (!profile) return '';
    const list = profile.quotes[type];
    return list[Math.floor(Math.random() * list.length)];
  }

  getQuoteWithCooldown(type: QuoteType): string | null {
    const now = Date.now();
    if (
      type === 'select' ||
      type === 'collide' ||
      type === 'goal' ||
      type === 'greet' ||
      now - this.lastQuoteTime > this.quoteCooldown
    ) {
      this.lastQuoteTime = now;
      return this.getRandomQuote(type);
    }
    return null;
  }

  checkIdle(): string | null {
    const now = Date.now();
    if (now - this.lastActionTime > 8000 && now - this.lastQuoteTime > 8000) {
      this.lastQuoteTime = now;
      this.lastActionTime = now;
      return this.getRandomQuote('idle');
    }
    return null;
  }
}

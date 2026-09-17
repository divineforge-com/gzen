export interface ZenCardData {
  id: string;
  number: string;
  sphere: 'stillness' | 'impermanence' | 'empty-mind' | 'presence';
  sphereLabel: string;
  kanji: string;
  title: string;
  subtitle: string;
  quote: string;
  commentary: string;
  madeDate: string;
  themeColor: string;
  bgGradient: string;
  accentGlow: string;
  icon: string;
  image?: string;
}

export interface SphereCategory {
  id: 'all' | 'stillness' | 'impermanence' | 'empty-mind' | 'presence';
  label: string;
  kanji: string;
  color: string;
}

export const SPHERES: SphereCategory[] = [
  { id: 'all', label: 'All Spheres', kanji: '全', color: '#111111' },
  { id: 'stillness', label: 'Stillness · 止', kanji: '止', color: '#2d6b4f' },
  { id: 'impermanence', label: 'Impermanence · 变', kanji: '变', color: '#b45309' },
  { id: 'empty-mind', label: 'Empty Mind · 空', kanji: '空', color: '#334155' },
  { id: 'presence', label: 'Loving Presence · 慈', kanji: '慈', color: '#c2410c' }
];

export const ZEN_CARDS: ZenCardData[] = [
  // Group I: Stillness (止 · Śamatha)
  {
    id: 'zen-001',
    image: '/assets/cards/zen-001.webp',
    number: '#001',
    sphere: 'stillness',
    sphereLabel: 'Stillness · Śamatha',
    kanji: '止',
    title: 'The Anchor Breath',
    subtitle: 'Rooted in the Unmoving Center',
    quote: 'When the storm rises outside, drop the anchor inward. One conscious breath restores the kingdom.',
    commentary: 'Returning to the anchor of the breath dissolves the illusion of frantic urgency.',
    madeDate: '2026.SEP.17',
    themeColor: '#2d6b4f',
    bgGradient: 'linear-gradient(135deg, #1e4a36 0%, #2d6b4f 50%, #3f8f6b 100%)',
    accentGlow: 'rgba(45, 107, 79, 0.4)',
    icon: 'anchor'
  },
  {
    id: 'zen-002',
    image: '/assets/cards/zen-002.webp',
    number: '#002',
    sphere: 'stillness',
    sphereLabel: 'Stillness · Śamatha',
    kanji: '岳',
    title: 'Silent Mountain',
    subtitle: 'Immovable Dignity',
    quote: 'The mountain does not lean away from the howling wind. Be still and let the seasonal clouds pass through.',
    commentary: 'The inner witness remains unshaken regardless of emotional or mental turbulence.',
    madeDate: '2026.SEP.17',
    themeColor: '#2d6b4f',
    bgGradient: 'linear-gradient(135deg, #1b382b 0%, #285e46 50%, #448364 100%)',
    accentGlow: 'rgba(40, 94, 70, 0.4)',
    icon: 'mountain'
  },
  {
    id: 'zen-003',
    image: '/assets/cards/zen-003.webp',
    number: '#003',
    sphere: 'stillness',
    sphereLabel: 'Stillness · Śamatha',
    kanji: '矢',
    title: 'The Second Arrow',
    subtitle: 'Ending Self-Inflicted Wounds',
    quote: 'Pain is the first arrow shot by life. Suffering is the second arrow shot by your reaction. Put down the bow.',
    commentary: 'Acknowledge difficulty cleanly without multiplying it with fear, guilt, or grievance.',
    madeDate: '2026.SEP.17',
    themeColor: '#2d6b4f',
    bgGradient: 'linear-gradient(135deg, #1f4234 0%, #2e6650 50%, #529477 100%)',
    accentGlow: 'rgba(46, 102, 80, 0.4)',
    icon: 'arrow'
  },
  {
    id: 'zen-004',
    image: '/assets/cards/zen-004.webp',
    number: '#004',
    sphere: 'stillness',
    sphereLabel: 'Stillness · Śamatha',
    kanji: '潭',
    title: 'Clear Water',
    subtitle: 'Natural Clarity in Resting',
    quote: 'Water muddy from agitation clarifies itself when allowed to rest. Do not stir what needs settling.',
    commentary: 'Stop churning thoughts with more analysis. The mind clears on its own when stillness is granted.',
    madeDate: '2026.SEP.17',
    themeColor: '#2d6b4f',
    bgGradient: 'linear-gradient(135deg, #184131 0%, #27634d 50%, #3e8d6f 100%)',
    accentGlow: 'rgba(39, 99, 77, 0.4)',
    icon: 'droplet'
  },
  {
    id: 'zen-005',
    image: '/assets/cards/zen-005.webp',
    number: '#005',
    sphere: 'stillness',
    sphereLabel: 'Stillness · Śamatha',
    kanji: '歇',
    title: 'The Sacred Pause',
    subtitle: 'The Space Between Waves',
    quote: 'Between stimulus and response lies your freedom. In that single conscious breath, you choose peace.',
    commentary: 'True mastery is not speed of reaction, but the spaciousness before replying.',
    madeDate: '2026.SEP.17',
    themeColor: '#2d6b4f',
    bgGradient: 'linear-gradient(135deg, #234839 0%, #337158 50%, #4da07e 100%)',
    accentGlow: 'rgba(51, 113, 88, 0.4)',
    icon: 'pause'
  },

  // Group II: Impermanence (无常 · Anicca)
  {
    id: 'zen-006',
    image: '/assets/cards/zen-006.webp',
    number: '#006',
    sphere: 'impermanence',
    sphereLabel: 'Impermanence · Anicca',
    kanji: '流',
    title: 'River Log',
    subtitle: 'The Art of Non-Clinging',
    quote: 'Neither attach to the shore nor sink to the bottom. Flow lightly with what is.',
    commentary: 'Clinging to yesterday or dragging anticipation into tomorrow creates artificial drag.',
    madeDate: '2026.SEP.17',
    themeColor: '#b45309',
    bgGradient: 'linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)',
    accentGlow: 'rgba(180, 83, 9, 0.4)',
    icon: 'waves'
  },
  {
    id: 'zen-007',
    image: '/assets/cards/zen-007.webp',
    number: '#007',
    sphere: 'impermanence',
    sphereLabel: 'Impermanence · Anicca',
    kanji: '枫',
    title: 'Autumn Leaf',
    subtitle: 'Effortless Transition',
    quote: 'The leaf does not resist the autumn wind. Grace is letting go without mourning the branch.',
    commentary: 'Every ending is the silent opening of unburdened soil for what comes next.',
    madeDate: '2026.SEP.17',
    themeColor: '#b45309',
    bgGradient: 'linear-gradient(135deg, #85370d 0%, #c05621 50%, #dd6b20 100%)',
    accentGlow: 'rgba(192, 86, 33, 0.4)',
    icon: 'leaf'
  },
  {
    id: 'zen-008',
    image: '/assets/cards/zen-008.webp',
    number: '#008',
    sphere: 'impermanence',
    sphereLabel: 'Impermanence · Anicca',
    kanji: '云',
    title: 'Transient Cloud',
    subtitle: 'The Vastness of the Sky',
    quote: 'Thoughts and feelings are weather patterns in the vast sky. You are the sky, not the storm.',
    commentary: 'Identify with the open container of consciousness rather than transient mental clouds.',
    madeDate: '2026.SEP.17',
    themeColor: '#b45309',
    bgGradient: 'linear-gradient(135deg, #7c3e10 0%, #b85d18 50%, #e07d2c 100%)',
    accentGlow: 'rgba(184, 93, 24, 0.4)',
    icon: 'cloud'
  },
  {
    id: 'zen-009',
    image: '/assets/cards/zen-009.webp',
    number: '#009',
    sphere: 'impermanence',
    sphereLabel: 'Impermanence · Anicca',
    kanji: '朴',
    title: 'The Uncarved Block',
    subtitle: 'Return to Natural Essence',
    quote: 'Return to natural simplicity before concepts, titles, and labels took hold.',
    commentary: 'Unadorned direct experience always cuts through sophisticated mental entanglements.',
    madeDate: '2026.SEP.17',
    themeColor: '#b45309',
    bgGradient: 'linear-gradient(135deg, #6c2e0b 0%, #9c4411 50%, #cb6427 100%)',
    accentGlow: 'rgba(156, 68, 17, 0.4)',
    icon: 'box'
  },
  {
    id: 'zen-010',
    image: '/assets/cards/zen-010.webp',
    number: '#010',
    sphere: 'impermanence',
    sphereLabel: 'Impermanence · Anicca',
    kanji: '露',
    title: 'Morning Dew',
    subtitle: 'Luminous & Fleeting',
    quote: 'Glistening for a single dawn, yet holding the reflection of the entire universe.',
    commentary: 'The brevity of life is not its flaw, but the exact spark that makes it precious.',
    madeDate: '2026.SEP.17',
    themeColor: '#b45309',
    bgGradient: 'linear-gradient(135deg, #883f12 0%, #be5b1c 50%, #e57e38 100%)',
    accentGlow: 'rgba(190, 91, 28, 0.4)',
    icon: 'sun'
  },

  // Group III: Empty Mind (空 / 初心 · Shoshin)
  {
    id: 'zen-011',
    image: '/assets/cards/zen-011.webp',
    number: '#011',
    sphere: 'empty-mind',
    sphereLabel: 'Empty Mind · Shoshin',
    kanji: '盅',
    title: 'The Empty Cup',
    subtitle: 'Making Room for Insight',
    quote: 'A cup full of yesterday’s tea cannot receive fresh water. Empty yourself to receive the new.',
    commentary: 'Drop pre-conceived expertise before every problem to see reality without bias.',
    madeDate: '2026.SEP.17',
    themeColor: '#334155',
    bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    accentGlow: 'rgba(51, 65, 85, 0.4)',
    icon: 'cup'
  },
  {
    id: 'zen-012',
    number: '#012',
    sphere: 'empty-mind',
    sphereLabel: 'Empty Mind · Shoshin',
    kanji: '初',
    title: 'Beginner’s Mind',
    subtitle: 'Endless Possibility',
    quote: 'In the beginner’s mind there are many possibilities; in the expert’s mind there are few.',
    commentary: 'Retain the wonder and curiosity of a novice even after thousands of hours of practice.',
    madeDate: '2026.SEP.17',
    themeColor: '#334155',
    bgGradient: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
    accentGlow: 'rgba(71, 85, 105, 0.4)',
    icon: 'sparkles'
  },
  {
    id: 'zen-013',
    number: '#013',
    sphere: 'empty-mind',
    sphereLabel: 'Empty Mind · Shoshin',
    kanji: '磬',
    title: 'Silent Bell',
    subtitle: 'The Sound of Silence',
    quote: 'Listen not only to the sound of the bell, but to the silence that swallows the ring.',
    commentary: 'Inspiration is birthed from the silence behind the notes, not the clamor.',
    madeDate: '2026.SEP.17',
    themeColor: '#334155',
    bgGradient: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)',
    accentGlow: 'rgba(55, 65, 81, 0.4)',
    icon: 'bell'
  },
  {
    id: 'zen-014',
    number: '#014',
    sphere: 'empty-mind',
    sphereLabel: 'Empty Mind · Shoshin',
    kanji: '释',
    title: 'Unburdened Hands',
    subtitle: 'The Freedom of Total Release',
    quote: 'If you let go a little, you will have a little peace. If you let go completely, you will have complete peace.',
    commentary: 'Open hands can receive all things; clenched fists cannot even hold water.',
    madeDate: '2026.SEP.17',
    themeColor: '#334155',
    bgGradient: 'linear-gradient(135deg, #182232 0%, #2b394e 50%, #43546f 100%)',
    accentGlow: 'rgba(67, 84, 111, 0.4)',
    icon: 'hand'
  },
  {
    id: 'zen-015',
    number: '#015',
    sphere: 'empty-mind',
    sphereLabel: 'Empty Mind · Shoshin',
    kanji: '镜',
    title: 'The Mirror Mind',
    subtitle: 'Pure Reflection Without Retention',
    quote: 'The mirror reflects everything perfectly without retaining a single shadow when it departs.',
    commentary: 'Respond accurately to present demands without accumulating baggage or residue.',
    madeDate: '2026.SEP.17',
    themeColor: '#334155',
    bgGradient: 'linear-gradient(135deg, #16202c 0%, #283747 50%, #3e5062 100%)',
    accentGlow: 'rgba(62, 80, 98, 0.4)',
    icon: 'disc'
  },

  // Group IV: Loving Presence (慈 · Metta)
  {
    id: 'zen-016',
    number: '#016',
    sphere: 'presence',
    sphereLabel: 'Loving Presence · Mettā',
    kanji: '灯',
    title: 'Gentle Lamp',
    subtitle: 'Undiminished Radiance',
    quote: 'A single flame can light a thousand candles without diminishing its own radiance.',
    commentary: 'Sharing wisdom, patience, and warmth never depletes the true source within you.',
    madeDate: '2026.SEP.17',
    themeColor: '#c2410c',
    bgGradient: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #ea580c 100%)',
    accentGlow: 'rgba(194, 65, 12, 0.4)',
    icon: 'flame'
  },
  {
    id: 'zen-017',
    number: '#017',
    sphere: 'presence',
    sphereLabel: 'Loving Presence · Mettā',
    kanji: '罗',
    title: 'Indra’s Net',
    subtitle: 'Universal Interconnection',
    quote: 'In every jewel of the net, every other jewel is reflected. No one walks alone.',
    commentary: 'Your quiet healing reverberates through the entire fabric of life.',
    madeDate: '2026.SEP.17',
    themeColor: '#c2410c',
    bgGradient: 'linear-gradient(135deg, #882b0e 0%, #c74513 50%, #f06429 100%)',
    accentGlow: 'rgba(199, 69, 19, 0.4)',
    icon: 'grid'
  },
  {
    id: 'zen-018',
    number: '#018',
    sphere: 'presence',
    sphereLabel: 'Loving Presence · Mettā',
    kanji: '聆',
    title: 'Compassionate Ear',
    subtitle: 'Healing Through Pure Listening',
    quote: 'Deep listening is the art of hearing the unspoken ache before offering a single word.',
    commentary: 'Provide an unhurried, generous space where others feel entirely witnessed.',
    madeDate: '2026.SEP.17',
    themeColor: '#c2410c',
    bgGradient: 'linear-gradient(135deg, #78260b 0%, #b83a0e 50%, #e6521a 100%)',
    accentGlow: 'rgba(184, 58, 14, 0.4)',
    icon: 'heart'
  },
  {
    id: 'zen-019',
    number: '#019',
    sphere: 'presence',
    sphereLabel: 'Loving Presence · Mettā',
    kanji: '竹',
    title: 'Rooted Bamboo',
    subtitle: 'Resilient Softness',
    quote: 'Bows with the gale and snaps back upright. Softness overcomes rigidity every time.',
    commentary: 'Strength is not stiff defiance, but flexible resilience rooted in deep compassion.',
    madeDate: '2026.SEP.17',
    themeColor: '#c2410c',
    bgGradient: 'linear-gradient(135deg, #6c230b 0%, #a8360f 50%, #d84b1b 100%)',
    accentGlow: 'rgba(168, 54, 15, 0.4)',
    icon: 'feather'
  },
  {
    id: 'zen-020',
    number: '#020',
    sphere: 'presence',
    sphereLabel: 'Loving Presence · Mettā',
    kanji: '莲',
    title: 'The Lotus Root',
    subtitle: 'Purity Born from Friction',
    quote: 'Out of dark silt and heavy mud blooms the purest blossom. Transform friction into awakening.',
    commentary: 'Do not despise difficulties. They are the exact nutrient needed for your deepest awakening.',
    madeDate: '2026.SEP.17',
    themeColor: '#c2410c',
    bgGradient: 'linear-gradient(135deg, #832e12 0%, #c54817 50%, #ee6327 100%)',
    accentGlow: 'rgba(197, 72, 23, 0.4)',
    icon: 'flower'
  }
];

export function getCardsBySphere(sphere: string): ZenCardData[] {
  if (sphere === 'all') return ZEN_CARDS;
  return ZEN_CARDS.filter(c => c.sphere === sphere);
}

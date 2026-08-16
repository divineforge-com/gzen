/**
 * gZen Tri-Elemental Data Architecture & Practice Matrix
 * The Three Sovereign Elements: Water (水) · Earth (地) · Fire (火)
 *
 * Core Pitch: "The Ever-Shifting Balance."
 * High velocity without friction. Absolute stillness within execution.
 * Master the vessel, anchor the foundation, command the signal.
 */

export type ElementLetter = "Z" | "E" | "N";

export interface ElementData {
  letter: ElementLetter;
  element: "Water" | "Earth" | "Fire";
  kanji: "水" | "地" | "火";
  numeral: "01" | "02" | "03";
  archetype: string;
  tagline: string;
  label: string;
  name: string;
  subname: string;
  host: string;
  href: string;
  blurb: string;
  practiceTitle: string;
  practicePillar: string;
  practiceDetail: string;
  affirmation: string;
  geometryName: string;
  geometrySymbol: string;
  tone: string;
  toneSecondary: string;
  gradient: string;
  shortcut: string;
}

export const elements: readonly ElementData[] = [
  {
    letter: "Z",
    element: "Water",
    kanji: "水",
    numeral: "01",
    archetype: "The Fluid Sanctuary",
    tagline: "Yield to nothing, adapt to everything.",
    label: "ZEN",
    name: "Zen",
    subname: "Somatic Stillness & Fluid Sanctuary",
    host: "zen.gzen.io",
    href: "https://zen.gzen.io/",
    blurb: "The vessel must hold before any strategy executes. Deep autonomic stillness, effortless recovery, and unbroken clarity under high velocity.",
    practiceTitle: "Practice · Somatic Stillness",
    practicePillar: "Somatic Architecture",
    practiceDetail: "Body as sanctuary, sleep as shield. If the biological vessel cracks, no strategy holds. Master effortless observation to move with absolute fluid precision.",
    affirmation: "Yield to nothing, adapt to everything.",
    geometryName: "Sacred Enso Tri-Monad",
    geometrySymbol: "水 · ○ △",
    tone: "#22d3ee",
    toneSecondary: "#0d9488",
    gradient: "linear-gradient(135deg, #0d9488 0%, #22d3ee 50%, #38bdf8 100%)",
    shortcut: "Z",
  },
  {
    letter: "E",
    element: "Earth",
    kanji: "地",
    numeral: "02",
    archetype: "The Sovereign Ground",
    tagline: "Rooted deep, compounding perpetually.",
    label: "ECONOMY",
    name: "Economy",
    subname: "Capital Architecture & Sovereign Ground",
    host: "eco.gzen.io",
    href: "https://eco.gzen.io/",
    blurb: "Immutable leverage and asymmetric capital systems. Ground your output into unshakeable reserves, geometric compounding, and perpetual freedom.",
    practiceTitle: "Practice · Capital Foundation",
    practicePillar: "Capital Architecture",
    practiceDetail: "Unshakeable leverage. Transform asymmetric kinetic output into immutable balance sheets, automated reserves, and true sovereign autonomy.",
    affirmation: "Rooted deep, compounding perpetually.",
    geometryName: "Sacred Octahedron Lattice",
    geometrySymbol: "地 · ◇ ⬡",
    tone: "#fbbf24",
    toneSecondary: "#d97706",
    gradient: "linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fde68a 100%)",
    shortcut: "E",
  },
  {
    letter: "N",
    element: "Fire",
    kanji: "火",
    numeral: "03",
    archetype: "The Solar Catalyst",
    tagline: "Ignite the signal, incinerate the noise.",
    label: "NEXUS",
    name: "Nexus",
    subname: "Command Syntax & Neural Synthesis",
    host: "nexus.gzen.io",
    href: "https://nexus.gzen.io/",
    blurb: "Knowledge synthesis, agentic orchestration, and lightning prompt syntax. Turn dense cognitive complexity into instant, executable velocity.",
    practiceTitle: "Practice · Command Ignition",
    practicePillar: "Command Syntax",
    practiceDetail: "Precision mental models and agentic infrastructure. Channel cognitive energy into pure directional signal to orchestrate autonomous intelligence.",
    affirmation: "Ignite the signal, incinerate the noise.",
    geometryName: "Sacred Solar Constellation",
    geometrySymbol: "火 · ⬡ ⚯",
    tone: "#f97316",
    toneSecondary: "#ef4444",
    gradient: "linear-gradient(135deg, #ef4444 0%, #f97316 50%, #fdba74 100%)",
    shortcut: "N",
  },
] as const;

export const site = {
  name: "gZen",
  shortName: "gZen",
  title: "gZen — Water · Earth · Fire | The Ever-Shifting Balance",
  description:
    "High velocity without friction. Absolute stillness within execution. Master the three sovereign elements — Water (Zen), Earth (Economy), and Fire (Neural).",
  url: "https://gzen.io/",
  eyebrow: "gZen · the three sovereign elements",
  hook: "The Ever-Shifting Balance.",
  subhead: "High velocity without friction. Absolute stillness within execution. Master the vessel, anchor the foundation, command the signal.",
  maxim: "Water adapts without yield. Earth compounds without tremor. Fire transforms without hesitation. gZen is the axis where all three become one.",
  cta: "Enter the elemental practice",
  originWhisper: "gzen · water · earth · fire · perpetual equilibrium",
} as const;

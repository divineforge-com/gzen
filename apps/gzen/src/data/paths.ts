export type Path = {
  letter: "Z" | "E" | "N";
  label: string;
  name: string;
  subname: string;
  host: string;
  href: string;
  blurb: string;
  advocacy: string;
  protocolPillar: string;
  protocolDetail: string;
  flowTag: string;
  pole: "G" | "Zen" | "Both";
  /** Sacred Geometric Shape signature */
  geometryName: string;
  geometrySymbol: string;
  /** Accent for glyph and glass sheen — quiet but distinct */
  tone: string;
  shortcut: string;
};

export const paths: readonly Path[] = [
  {
    letter: "Z",
    label: "ZEN",
    name: "Zen",
    subname: "Somatic Vitality & Monastic Stillness",
    host: "zen.gzen.io",
    href: "https://zen.gzen.io/",
    blurb: "Body as fuel, mind as sanctuary. Vitality for relentless execution.",
    advocacy: "Mastering somatic endurance and quiet cognitive stability under high-velocity demands.",
    protocolPillar: "Protocol · Energy",
    protocolDetail: "Body and sleep first. If the vessel is empty, no plan holds.",
    flowTag: "Vitality & Stillness",
    pole: "Zen",
    geometryName: "Sacred Enso Tri-Monad",
    geometrySymbol: "○ · △",
    tone: "#3da374",
    shortcut: "Z",
  },
  {
    letter: "E",
    label: "ECONOMY",
    name: "Economy",
    subname: "Personal Economy & Capital Architecture",
    host: "economy.gzen.io",
    href: "https://economy.gzen.io/",
    blurb: "Capital built with clarity. Accumulate, allocate, and scale without noise.",
    advocacy: "High-signal wealth engineering, sovereign allocation, and noise-free capital scaling.",
    protocolPillar: "Protocol · Work",
    protocolDetail: "Capital and outcomes. High intensity, clear allocation, then stop cleanly.",
    flowTag: "Capital Architecture",
    pole: "G",
    geometryName: "Sacred Octahedron Lattice",
    geometrySymbol: "◇ · ⬡",
    tone: "#e0682b",
    shortcut: "E",
  },
  {
    letter: "N",
    label: "NEURAL",
    name: "Neural",
    subname: "Command Language, Graph & Persuasion",
    host: "neural.gzen.io",
    href: "https://neural.gzen.io/",
    blurb: "High-signal command language. Art, syntax, and negotiation stripped of noise.",
    advocacy: "Advancing precision cognitive graphs, structured negotiation syntax, and articulate power.",
    protocolPillar: "Protocol · Zest",
    protocolDetail: "Joy, signal, and command — authentic clarity rather than leftover energy.",
    flowTag: "Signal & Syntax",
    pole: "Both",
    geometryName: "Sacred Neural Constellation",
    geometrySymbol: "⬡ · ⚯",
    tone: "#4d8ee8",
    shortcut: "N",
  },
] as const;

/** Two temperatures of the same brand — monastery default, ignite optional */
export const site = {
  name: "gZen",
  shortName: "gZen",
  title: "gZen — Zen · Economy · Neural",
  description:
    "High-velocity execution, absolute mental clarity. Three sovereign portals — Zen, Economy, and Neural. Master the vessel, build capital, command the signal.",
  url: "https://gzen.io/",
  hook: "High velocity. Absolute stillness.",
  subhead: "Execute at full force. Live without the friction.",
  themes: {
    monastery: {
      id: "monastery" as const,
      label: "Cool monastery",
      tagline: "Protect your peace.",
      lede: "Still mind. Clear edge. Nothing wasted.",
      themeColor: "#06080c",
    },
    ignite: {
      id: "ignite" as const,
      label: "Warm ignition",
      tagline: "Full force. Zero noise.",
      lede: "Drive without the spiral.",
      themeColor: "#0c0907",
    },
  },
  originWhisper: "zen · observe before you move",
} as const;

export type ThemeId = keyof typeof site.themes;

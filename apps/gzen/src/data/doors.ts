export type Door = {
  letter: "K" | "I" | "L" | "O";
  label: string;
  name: string;
  host: string;
  href: string;
  blurb: string;
  /** Accent for glyph — quiet but distinct */
  tone: string;
};

export const doors: readonly Door[] = [
  {
    letter: "K",
    label: "KI",
    name: "Ki",
    host: "ki.gzen.io",
    href: "https://ki.gzen.io/",
    blurb: "Vitality, body, and traditional practice.",
    tone: "#2d6b4f",
  },
  {
    letter: "I",
    label: "INVEST",
    name: "Invest",
    host: "invest.gzen.io",
    href: "https://invest.gzen.io/",
    blurb: "Capital clarity. Charts. Quiet study.",
    tone: "#b45309",
  },
  {
    letter: "L",
    label: "LEARN",
    name: "Learn",
    host: "learn.gzen.io",
    href: "https://learn.gzen.io/",
    blurb: "Languages — one honest lesson at a time.",
    tone: "#3b6ea5",
  },
  {
    letter: "O",
    label: "OM · 唵",
    name: "Om",
    host: "om.gzen.io",
    href: "https://om.gzen.io/",
    blurb: "Buddhist teaching. Stillness before speech.",
    tone: "#8b5a2b",
  },
] as const;

/** Two temperatures of the same brand — monastery default, ignite optional */
export const site = {
  name: "gZen.IO",
  shortName: "gZen",
  title: "gZen.IO — Observe first",
  description:
    "gZen.IO — observe first. Four doors. No noise. Ki · Invest · Learn · Om.",
  url: "https://gzen.io/",
  themes: {
    monastery: {
      id: "monastery" as const,
      label: "Cool monastery",
      tagline: "Observe first.",
      lede: "Four doors. No noise.",
      themeColor: "#04050a",
    },
    ignite: {
      id: "ignite" as const,
      label: "Warm ignition",
      tagline: "Ignite observation.",
      lede: "A quiet nexus of imagination, study, and tools.",
      themeColor: "#0a0705",
    },
  },
  /** Whisper only — not a co-brand on the first fold */
  originWhisper: "kilo · to observe before you move",
} as const;

export type ThemeId = keyof typeof site.themes;

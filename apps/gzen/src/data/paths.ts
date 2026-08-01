export type Path = {
  letter: "K" | "I" | "L" | "O";
  label: string;
  name: string;
  host: string;
  href: string;
  blurb: string;
  pole: "G" | "Zen" | "Both";
  /** Accent for glyph — quiet but distinct */
  tone: string;
};

export const paths: readonly Path[] = [
  {
    letter: "K",
    label: "KI",
    name: "Ki",
    host: "ki.gzen.io",
    href: "https://ki.gzen.io/",
    blurb: "Body as fuel. Vitality so drive never burns the vessel.",
    pole: "Both",
    tone: "#2d6b4f",
  },
  {
    letter: "I",
    label: "INVEST",
    name: "Invest",
    host: "invest.gzen.io",
    href: "https://invest.gzen.io/",
    blurb: "Capital with clarity. Build wealth without the noise.",
    pole: "G",
    tone: "#c45c26",
  },
  {
    letter: "L",
    label: "LEARN",
    name: "Learn",
    host: "learn.gzen.io",
    href: "https://learn.gzen.io/",
    blurb: "One honest lesson. Skill that builds in silence.",
    pole: "G",
    tone: "#3b6ea5",
  },
  {
    letter: "O",
    label: "OM · 唵",
    name: "Om",
    host: "om.gzen.io",
    href: "https://om.gzen.io/",
    blurb: "Stillness before speech. Guard the mind that executes.",
    pole: "Zen",
    tone: "#8b5a2b",
  },
] as const;

/** Two temperatures of the same brand — monastery default, ignite optional */
export const site = {
  name: "gZen",
  shortName: "gZen",
  title: "gZen — The hustle without the burnout",
  description:
    "The hustle without the burnout. High-intensity execution with absolute mental clarity. Four paths — Ki, Invest, Learn, Om. Build with force. Rest with intention.",
  url: "https://gzen.io/",
  hook: "The hustle without the burnout.",
  subhead:
    "Build with force. Rest with intention.",
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
      lede: "Drive without the anxiety spiral.",
      themeColor: "#0c0907",
    },
  },
  originWhisper: "kilo · observe before you move",
  anatomy: {
    title: "The anatomy of a gZen achiever",
    lead: "Two poles — Fire and Peace, and the Flow between them. Neither works alone.",
    fire: {
      label: "The Fire · G",
      title: "Drive",
      points: [
        "Financial freedom as craft, not frenzy",
        "Daily execution with hard edges",
        "Personal accountability without self-violence",
        "Relentless focus — then a clean stop",
      ],
    },
    peace: {
      label: "The Peace · Zen",
      title: "Stillness",
      points: [
        "Digital boundaries you actually keep",
        "Mental clarity before more tools",
        "Slow analog moments that refill the tank",
        "Emotional stability under pressure",
      ],
    },
  },
  framework: {
    title: "Strategic Flow",
    lead: "From chaotic busyness to deliberate motion. Urgent when it matters. Patient where it compounds.",
    matrix: [
      {
        q: "Urgent action",
        a: "Ship the thing. Cut the noise. Move while the window is open.",
      },
      {
        q: "Patient progress",
        a: "Skills, capital, health, and mind — compound on a long clock.",
      },
      {
        q: "Hard stop",
        a: "Protect recovery as seriously as you protect deadlines.",
      },
      {
        q: "Observe first",
        a: "See clearly before you force a path. Then execute without drama.",
      },
    ],
  },
  protocol: {
    title: "Daily gZen Protocol",
    lead: "Three check-ins. No account. No setup. Just the practice.",
    steps: [
      {
        name: "Energy",
        detail: "Body and sleep first. If the vessel is empty, no plan holds.",
      },
      {
        name: "Work",
        detail: "One primary outcome. High intensity. Then stop cleanly.",
      },
      {
        name: "Zest",
        detail: "Joy and peace as metrics — not leftovers after the grind.",
      },
    ],
  },
} as const;

export type ThemeId = keyof typeof site.themes;

/** Brand mark candidates for local /proposal review (never production). */
export const markProposals = [
  {
    id: "enso-g",
    file: "01-enso-g.svg",
    name: "Enso-g",
    pitch: "Open zen circle as the bowl of a lowercase g. Incomplete ring = observation, not certainty.",
  },
  {
    id: "orbit-g",
    file: "02-orbit-g.svg",
    name: "Orbit-g",
    pitch: "Monoline g; ear becomes a thin orbital path around a quiet core.",
  },
  {
    id: "ignite-g",
    file: "03-ignite-g.svg",
    name: "Ignite-g",
    pitch: "Geometric modular g — terminal spark = ignite observation.",
  },
  {
    id: "void-g",
    file: "04-void-g.svg",
    name: "Void-g",
    pitch: "Filled geometric g cut from a square field. High contrast at 16px.",
  },
] as const;

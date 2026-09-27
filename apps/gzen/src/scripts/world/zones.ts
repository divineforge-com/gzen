import { PLAYER_RADIUS } from "./frame.ts";

export type ZoneId = "jiangnan" | "bamboo" | "himalaya" | "fjord";

export type Teaching = {
  title: string;
  zh: string;
  line: string;
  source: string;
};

export type ZoneDef = {
  id: ZoneId;
  name: string;
  kanji: string;
  x: number;
  z: number;
  radius: number;
  ground: number;
  rim: number;
  teaching: Teaching;
  altar: { x: number; z: number };
  fellow: {
    id: string;
    name: string;
    x: number;
    z: number;
    sash: number;
    line: string;
    ask: string;
  };
  blocks: { x: number; z: number; r: number }[];
};

/** Quadrant islands around a crossing at the origin. Matches the four-zone concept map. */
export const ZONES: ZoneDef[] = [
  {
    id: "jiangnan",
    name: "Jiangnan Canals",
    kanji: "江南",
    x: -36,
    z: 28,
    radius: 13,
    ground: 0xe4efe4,
    rim: 0xc5d5c4,
    teaching: {
      title: "The Empty Cup",
      zh: "清明，始于放空，而非累加。",
      line: "Clarity begins by emptying, not by adding.",
      source: "空杯问禅",
    },
    altar: { x: -32, z: 34 },
    fellow: {
      id: "willow",
      name: "Willow",
      x: -42,
      z: 30,
      sash: 0x2d6b4f,
      line: "I filled the hour with explanations, and left no quiet for the other person to think.",
      ask: "What are you carrying that could be set down?",
    },
    blocks: [
      { x: -38, z: 22, r: 2.1 },
      { x: -38, z: 30, r: 1.5 },
    ],
  },
  {
    id: "bamboo",
    name: "Bamboo Grove",
    kanji: "竹",
    x: -30,
    z: -34,
    radius: 12,
    ground: 0xcfe3c4,
    rim: 0x8faf78,
    teaching: {
      title: "Clarity Before Tools",
      zh: "清晰地理解问题，比任何试图解决它的工具都更有价值。",
      line: "A clearly understood problem is worth more than any tool picked up to solve it.",
      source: "清明先于工具",
    },
    altar: { x: -26, z: -40 },
    fellow: {
      id: "tea",
      name: "Tea",
      x: -36,
      z: -30,
      sash: 0xc84b31,
      line: "I reached for a method before I could say the problem in one sentence.",
      ask: "Can you say the thing in front of you in one sentence?",
    },
    blocks: [{ x: -30, z: -28, r: 2.3 }],
  },
  {
    id: "himalaya",
    name: "Himalayan Ridge",
    kanji: "峰",
    x: 34,
    z: -30,
    radius: 13,
    ground: 0xd5d3dc,
    rim: 0xb7b3c4,
    teaching: {
      title: "The Second Arrow",
      zh: "苦，不在于事件本身，而在于对事件的叙述。",
      line: "Suffering is not the event. It is the story told about the event.",
      source: "第二支箭",
    },
    altar: { x: 40, z: -34 },
    fellow: {
      id: "ridge",
      name: "Ridge",
      x: 28,
      z: -36,
      sash: 0xe5b96f,
      line: "The trouble lasted an hour. The story I told about it lasted two days.",
      ask: "Which arrow are you still holding?",
    },
    blocks: [{ x: 34, z: -24, r: 2.4 }],
  },
  {
    id: "fjord",
    name: "Fjord of Stillness",
    kanji: "湾",
    x: 36,
    z: 32,
    radius: 13,
    ground: 0xc5d5cf,
    rim: 0x8aa396,
    teaching: {
      title: "The Drifting Log",
      zh: "一根浮木顺流而下，不执着于任何一岸。",
      line: "A log that clings to neither bank reaches the sea.",
      source: "河中浮木",
    },
    altar: { x: 42, z: 36 },
    fellow: {
      id: "cedar",
      name: "Cedar",
      x: 30,
      z: 36,
      sash: 0x6b5b4d,
      line: "I stopped steering. The water already knew the way to the sea.",
      ask: "Where are you gripping the bank?",
    },
    blocks: [{ x: 36, z: 26, r: 1.8 }],
  },
];

export type PathSeg = { ax: number; az: number; bx: number; bz: number; half: number };

export const PATHS: PathSeg[] = ZONES.map((zone) => ({
  ax: zone.x,
  az: zone.z,
  bx: 0,
  bz: 0,
  half: 1.9,
}));

export const PLAZA_RADIUS = 5;

function distToSegment(x: number, z: number, path: PathSeg): number {
  const abx = path.bx - path.ax;
  const abz = path.bz - path.az;
  const len2 = abx * abx + abz * abz;
  const t = len2 < 1e-6 ? 0 : Math.max(0, Math.min(1, ((x - path.ax) * abx + (z - path.az) * abz) / len2));
  const px = path.ax + abx * t - x;
  const pz = path.az + abz * t - z;
  return Math.hypot(px, pz);
}

export function zoneAt(x: number, z: number): ZoneDef | null {
  let best: ZoneDef | null = null;
  let bestD = Infinity;
  for (const zone of ZONES) {
    const d = Math.hypot(x - zone.x, z - zone.z);
    if (d <= zone.radius + 0.4 && d < bestD) {
      best = zone;
      bestD = d;
    }
  }
  return best;
}

export function canWalkAt(x: number, z: number): boolean {
  for (const zone of ZONES) {
    for (const block of zone.blocks) {
      if (Math.hypot(x - block.x, z - block.z) < block.r + PLAYER_RADIUS) return false;
    }
  }
  for (const zone of ZONES) {
    if (Math.hypot(x - zone.x, z - zone.z) <= zone.radius - 0.15) return true;
  }
  if (Math.hypot(x, z) <= PLAZA_RADIUS) return true;
  for (const path of PATHS) {
    if (distToSegment(x, z, path) <= path.half) return true;
  }
  return false;
}

/** A dry spot just off the altar, toward the middle of the shore. */
export function spawnFor(zone: ZoneDef): { x: number; z: number } {
  const dx = zone.x - zone.altar.x;
  const dz = zone.z - zone.altar.z;
  const len = Math.hypot(dx, dz) || 1;
  return { x: zone.altar.x + (dx / len) * 1.5, z: zone.altar.z + (dz / len) * 1.5 };
}

export function zoneLabel(x: number, z: number): { name: string; kanji: string } {
  const zone = zoneAt(x, z);
  if (zone) return { name: zone.name, kanji: zone.kanji };
  if (Math.hypot(x, z) < PLAZA_RADIUS + 2) return { name: "The Crossing", kanji: "径" };
  return { name: "The Path", kanji: "道" };
}

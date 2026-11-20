/**
 * DivineForge Emporium — Wide 28×18 Gather-style Architecture & Digital Goods Hall.
 *
 * Tile codes:
 *  0  walkable floor (emerald courtyard turf)
 *  1  wall / solid stone pillar
 *  2  portal / spawn pad
 *  3  desk / sentinel workstation (blocking)
 *  4  zone rug (walkable, tinted per sentinel pavilion)
 *  5  plant / bonsai decor (blocking)
 *  6  architecture / meeting table (blocking)
 *  7  cobblestone grand avenue (walkable)
 *  8  server / K8s cluster rack (blocking)
 *  9  blueprint bookshelf / archive rack (blocking)
 * 10  courtyard lantern post (blocking)
 * 11  zen water basin / fountain (blocking)
 */

export type TileCode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export interface ZoneDef {
  id: string;
  botKey: string;
  label: string;
  color: string;
  /** Inclusive rug bounds in grid space */
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  /** Default NPC home tile */
  homeX: number;
  homeY: number;
}

export const LAB_ZONES: ZoneDef[] = [
  {
    id: 'spark-bay',
    botKey: 'spark',
    label: 'Digital Goods Counter',
    color: '#3DBF7A',
    x0: 2,
    y0: 2,
    x1: 7,
    y1: 5,
    homeX: 4,
    homeY: 4,
  },
  {
    id: 'atlas-vault',
    botKey: 'atlas',
    label: 'K8s & Blueprint Vault',
    color: '#A8B83A',
    x0: 11,
    y0: 2,
    x1: 16,
    y1: 5,
    homeX: 13,
    homeY: 4,
  },
  {
    id: 'tether-hub',
    botKey: 'tether',
    label: 'gZen & Portal Conservatory',
    color: '#4A9BC7',
    x0: 20,
    y0: 2,
    x1: 25,
    y1: 5,
    homeX: 22,
    homeY: 4,
  },
  {
    id: 'kinetic-forge',
    botKey: 'kinetic',
    label: 'Tools & IoT Forge',
    color: '#8B6BC9',
    x0: 2,
    y0: 10,
    x1: 7,
    y1: 13,
    homeX: 4,
    homeY: 12,
  },
  {
    id: 'ying-tidepool',
    botKey: 'ying',
    label: 'STACKY Command Plaza',
    color: '#E07A9B',
    x0: 11,
    y0: 9,
    x1: 16,
    y1: 12,
    homeX: 13,
    homeY: 11,
  },
  {
    id: 'canvas-studio',
    botKey: 'canvas',
    label: 'Story & Satire Studio',
    color: '#D4A017',
    x0: 20,
    y0: 10,
    x1: 25,
    y1: 13,
    homeX: 22,
    homeY: 12,
  },
];

/** Player default spawn (grand south gate entrance) */
export const SPAWN = { x: 13, y: 15 };

/**
 * Build the 28×18 Emporium Hall grid:
 * 6 themed Sentinel pavilions connected by wide cobblestone avenues,
 * server racks, blueprint bookshelves, zen water basins, and glowing lanterns.
 */
export function buildLabGrid(): number[][] {
  const W = 28;
  const H = 18;
  const grid: number[][] = Array.from({ length: H }, () => Array(W).fill(0));

  // Perimeter stone walls
  for (let x = 0; x < W; x++) {
    grid[0][x] = 1;
    grid[H - 1][x] = 1;
  }
  for (let y = 0; y < H; y++) {
    grid[y][0] = 1;
    grid[y][W - 1] = 1;
  }

  // Grand South Gate entrance (rows 16-17, columns 12..15)
  grid[H - 1][12] = 7;
  grid[H - 1][13] = 2; // golden portal pad
  grid[H - 1][14] = 2; // golden portal pad
  grid[H - 1][15] = 7;

  // Zone rugs (walkable)
  for (const zone of LAB_ZONES) {
    for (let y = zone.y0; y <= zone.y1; y++) {
      for (let x = zone.x0; x <= zone.x1; x++) {
        if (grid[y][x] === 0) grid[y][x] = 4;
      }
    }
  }

  // Main East-West Grand Avenue (rows 7..8 across the entire hall)
  for (let x = 1; x < W - 1; x++) {
    for (const y of [7, 8]) {
      if (grid[y][x] === 0) grid[y][x] = 7;
    }
  }

  // South Courtyard Promenade (row 15 across x = 4..23)
  for (let x = 4; x <= 23; x++) {
    if (grid[15][x] === 0) grid[15][x] = 7;
  }

  // North-South Connectors (West col 8..9, Center col 13..14, East col 18..19)
  for (let y = 1; y < H - 1; y++) {
    for (const x of [8, 9, 13, 14, 18, 19]) {
      if (grid[y][x] === 0) grid[y][x] = 7;
    }
  }

  // Structural colonnade pillars framing the avenues
  const pillars: [number, number][] = [
    [9, 6],
    [18, 6],
    [9, 9],
    [18, 9],
    [9, 14],
    [18, 14],
  ];
  for (const [x, y] of pillars) {
    grid[y][x] = 1;
  }

  // Sentinel workstation desks (code 3) inside each pavilion
  const desks: [number, number][] = [
    [3, 2],
    [6, 2], // Spark's Digital Goods Counter
    [12, 2],
    [15, 2], // Atlas's Blueprint Vault
    [21, 2],
    [24, 2], // Tether's Portal Conservatory
    [3, 10],
    [6, 10], // Kinetic's Tools Forge
    [21, 10],
    [24, 10], // Canvas's Satire Studio
  ];
  for (const [x, y] of desks) {
    grid[y][x] = 3;
  }

  // Architecture / Collaboration tables (code 6)
  grid[10][12] = 6; // Ying's STACKY Command table left
  grid[10][15] = 6; // Ying's STACKY Command table right
  grid[3][5] = 6; // Spark's showcase table
  grid[12][5] = 6; // Kinetic's hardware test bench

  // Server & Kubernetes Cluster Racks (code 8)
  const servers: [number, number][] = [
    [11, 2],
    [16, 2],
    [11, 3],
    [16, 3], // Atlas's K8s Cluster Vault racks
    [2, 10],
    [2, 11], // Kinetic's Sentinel Daemon racks
  ];
  for (const [x, y] of servers) {
    grid[y][x] = 8;
  }

  // Blueprint & Story Bookshelves (code 9)
  const shelves: [number, number][] = [
    [2, 2],
    [7, 2], // Spark's Knowledge OS shelves
    [20, 10],
    [25, 10],
    [25, 11], // Canvas's Satire & Story shelves
  ];
  for (const [x, y] of shelves) {
    grid[y][x] = 9;
  }

  // Zen Water Basins / Fountains (code 11)
  const fountains: [number, number][] = [
    [20, 2],
    [25, 2], // Tether's gZen Conservatory water features
    [6, 15],
    [21, 15], // South Courtyard reflection basins
  ];
  for (const [x, y] of fountains) {
    grid[y][x] = 11;
  }

  // Glowing Courtyard Lanterns (code 10)
  const lanterns: [number, number][] = [
    [8, 6],
    [19, 6],
    [10, 8],
    [17, 8],
    [11, 14],
    [16, 14],
    [11, 16],
    [16, 16],
  ];
  for (const [x, y] of lanterns) {
    grid[y][x] = 10;
  }

  // Botanical Plants & Bonsai Trees (code 5)
  const plants: [number, number][] = [
    [1, 1],
    [10, 1],
    [17, 1],
    [26, 1],
    [1, 6],
    [26, 6],
    [1, 9],
    [26, 9],
    [1, 16],
    [4, 16],
    [23, 16],
    [26, 16],
  ];
  for (const [x, y] of plants) {
    grid[y][x] = 5;
  }

  // Keep spawn walkable
  grid[SPAWN.y][SPAWN.x] = 2;

  return grid;
}

export function isBlocking(tile: number): boolean {
  return (
    tile === 1 ||
    tile === 3 ||
    tile === 5 ||
    tile === 6 ||
    tile === 8 ||
    tile === 9 ||
    tile === 10 ||
    tile === 11
  );
}

export function isWalkable(tile: number): boolean {
  return !isBlocking(tile);
}

export function zoneAt(x: number, y: number): ZoneDef | null {
  return (
    LAB_ZONES.find((z) => x >= z.x0 && x <= z.x1 && y >= z.y0 && y <= z.y1) ?? null
  );
}

/**
 * Top-Down Projection Configuration and Coordinate Conversion Helpers
 * Wide-viewport 2D Emporium Hall: flat 32x32 grid tiles, crisp pixel art,
 * dynamic camera viewport that scales with browser width.
 */

export interface Screen2D {
  x: number;
  y: number;
}

export const TOPDOWN_CONFIG = {
  /** Size of one grid tile in world pixels (flat square) */
  tileSize: 32,

  /** Wide Emporium Hall footprint (28 columns × 18 rows = 896×576 world px) */
  gridSizeX: 28,
  gridSizeY: 18,

  /** World-space position of grid tile (0,0) — leaves lush courtyard padding around the hall */
  originX: 512,
  originY: 400,

  /** Grass & garden padding (tiles) around the hall so wide cameras never show void */
  paddingTiles: 12,

  /** Milliseconds per tile when walking */
  walkDuration: 130,

  /** Camera follow vertical offset (world px) so the player sits comfortably above HUD */
  followOffsetY: -18,
};

/** Pixel sprite cell size (24×24 chibi pixel characters) */
export const PIXEL_SHEET = {
  frameWidth: 24,
  frameHeight: 24,
  directions: 4, // 0 down, 1 up, 2 left, 3 right
  /** rows: 0 idle, 1–3 walk cycle */
  animRows: 4,
  get columns() {
    return this.directions;
  },
  get rows() {
    return this.animRows;
  },
  frameIndex(dir: number, animRow: number): number {
    return animRow * this.directions + dir;
  },
};

/** Grid (x, y) → world pixel position (top-left of the tile) */
export function gridToWorld(x: number, y: number): Screen2D {
  return {
    x: TOPDOWN_CONFIG.originX + x * TOPDOWN_CONFIG.tileSize,
    y: TOPDOWN_CONFIG.originY + y * TOPDOWN_CONFIG.tileSize,
  };
}

/** World pixel position → grid tile (or null when outside the grid) */
export function worldToGrid(wx: number, wy: number): Screen2D | null {
  const gx = Math.floor((wx - TOPDOWN_CONFIG.originX) / TOPDOWN_CONFIG.tileSize);
  const gy = Math.floor((wy - TOPDOWN_CONFIG.originY) / TOPDOWN_CONFIG.tileSize);
  if (isWithinBounds(gx, gy)) return { x: gx, y: gy };
  return null;
}

/**
 * Top-down depth sort: y dominates (north draws first), x breaks ties
 * so east/west neighbours stack stably.
 */
export function getDepth(x: number, y: number): number {
  return y * 1000 + x;
}

/** Exact hall rectangle in world pixels (without outer grass padding) */
export function getHallRect() {
  const { tileSize, gridSizeX, gridSizeY, originX, originY } = TOPDOWN_CONFIG;
  return {
    x: originX,
    y: originY,
    width: gridSizeX * tileSize,
    height: gridSizeY * tileSize,
    centerX: originX + (gridSizeX * tileSize) / 2,
    centerY: originY + (gridSizeY * tileSize) / 2,
  };
}

/** Camera bounds rect (world px) covering the hall plus outer garden padding */
export function getWorldBounds() {
  const { tileSize, gridSizeX, gridSizeY, originX, originY, paddingTiles } = TOPDOWN_CONFIG;
  const pad = paddingTiles * tileSize;
  return {
    x: originX - pad,
    y: originY - pad,
    width: gridSizeX * tileSize + pad * 2,
    height: gridSizeY * tileSize + pad * 2,
  };
}

export function isWithinBounds(x: number, y: number): boolean {
  return x >= 0 && x < TOPDOWN_CONFIG.gridSizeX && y >= 0 && y < TOPDOWN_CONFIG.gridSizeY;
}

import Phaser from 'phaser';
import { PIXEL_SHEET, TOPDOWN_CONFIG } from './TopDownConfig';
import { BOT_PROFILES, BOT_KEYS } from './BotState';

export interface BotSpriteConfig {
  name: string;
  mainColor: string;
  baseBg: string;
}

/**
 * GBA / Pokémon Emerald art pipeline — flat pixel tiles + chibi pixel characters.
 * No gradients, no glow: hard rects, 4-colour-ish shading, ink outlines.
 *
 * Spritesheet layout (per bot key `bot-{name}`):
 *   frame  = 24 × 24
 *   cols   = 4 directions  (0 down, 1 up, 2 left, 3 right)
 *   rows   = 4 anim rows   (0 idle, 1–3 walk cycle)
 *   index  = row * 4 + dir
 */
export class TextureGenerator {
  private static botCanvases: Map<string, HTMLCanvasElement> = new Map();
  private static tileCanvases: Map<string, HTMLCanvasElement> = new Map();

  /** Emerald-inspired hard palette */
  static readonly PX = {
    grass: '#4a8c3f',
    grassDark: '#3f7a35',
    grassLight: '#55a04a',
    path: '#c4a45a',
    pathDark: '#b3924a',
    wall: '#6b5a3e',
    wallLight: '#7d6a4a',
    wallDark: '#57472f',
    wallInk: '#3a2e20',
    water: '#204060',
    waterLight: '#3f6ea0',
    waterLighter: '#7fb8c9',
    wood: '#8b6b45',
    woodDark: '#5f4528',
    woodLight: '#a9855a',
    rug: '#f0e8d4',
    rugBorder: '#c8bda0',
    plant: '#3d7a52',
    plantLight: '#5a9e6f',
    pot: '#c4785a',
    potLight: '#d0845f',
    paper: '#f8f0d8',
    ink: '#38281a',
    shadow: 'rgba(20, 26, 14, 0.28)',
  };

  static generateTextures(scene: Phaser.Scene) {
    this.botCanvases.clear();
    this.tileCanvases.clear();
    this.generateTiles(scene);
    this.generateBots(scene);
    this.registerAnimations(scene);
  }

  // ---------------------------------------------------------------------------
  // Pixel primitives
  // ---------------------------------------------------------------------------

  private static px(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string
  ) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  }

  private static registerTile(
    scene: Phaser.Scene,
    key: string,
    canvas: HTMLCanvasElement
  ) {
    this.tileCanvases.set(key, canvas);
    if (scene.textures.exists(key)) scene.textures.remove(key);
    scene.textures.addCanvas(key, canvas);
  }

  // ---------------------------------------------------------------------------
  // Tiles — 32×32 flat squares
  // ---------------------------------------------------------------------------

  private static generateTiles(scene: Phaser.Scene) {
    const T = TOPDOWN_CONFIG.tileSize;
    const P = this.PX;

    const make = (draw: (ctx: CanvasRenderingContext2D) => void, key: string) => {
      const c = document.createElement('canvas');
      c.width = T;
      c.height = T;
      const ctx = c.getContext('2d')!;
      draw(ctx);
      this.registerTile(scene, key, c);
    };

    // ── Grass floor (code 0) ──
    make((ctx) => {
      this.px(ctx, 0, 0, T, T, P.grass);
      for (let y = 0; y < T; y += 4) {
        for (let x = 0; x < T; x += 4) {
          if (((x / 4 + y / 4) & 1) === 0) this.px(ctx, x, y, 4, 4, P.grassDark);
        }
      }
      // light tufts + dark speckles (fixed positions → stable texture)
      const tufts: [number, number][] = [
        [2, 2],
        [14, 10],
        [26, 18],
        [8, 26],
        [22, 4],
        [4, 16],
      ];
      for (const [x, y] of tufts) this.px(ctx, x, y, 2, 2, P.grassLight);
      const dark: [number, number][] = [
        [18, 14],
        [6, 20],
        [28, 8],
        [12, 28],
      ];
      for (const [x, y] of dark) this.px(ctx, x, y, 2, 2, P.grassDark);
    }, 'tile-ground');

    // ── Path (code 7) ──
    make((ctx) => {
      this.px(ctx, 0, 0, T, T, P.path);
      for (let y = 2; y < T; y += 6) {
        for (let x = 2; x < T; x += 6) {
          this.px(ctx, x, y, 2, 2, P.pathDark);
        }
      }
      this.px(ctx, 0, 0, T, 1, '#d0b268');
    }, 'tile-path');

    // ── Wall block (code 1) ──
    make((ctx) => {
      this.px(ctx, 0, 0, T, T, P.wall);
      this.px(ctx, 0, 0, T, 8, P.wallLight); // ledge top
      this.px(ctx, 0, 26, T, 6, P.wallDark); // base shadow
      // brick seams
      this.px(ctx, 10, 8, 1, 18, P.wallDark);
      this.px(ctx, 21, 8, 1, 18, P.wallDark);
      this.px(ctx, 0, 16, T, 1, P.wallDark);
      // outline
      ctx.strokeStyle = P.wallInk;
      ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, T - 1, T - 1);
    }, 'tile-wall');

    // ── Goal / spawn pad (code 2) ──
    make((ctx) => {
      this.px(ctx, 0, 0, T, T, P.water);
      this.px(ctx, 1, 1, T - 2, T - 2, '#2c5580');
      // inner ring
      this.px(ctx, 4, 4, T - 8, T - 8, P.waterLight);
      this.px(ctx, 6, 6, T - 12, T - 12, P.water);
      // center diamond
      this.px(ctx, 13, 10, 6, 2, P.waterLighter);
      this.px(ctx, 12, 12, 8, 4, P.waterLighter);
      this.px(ctx, 13, 16, 6, 2, P.waterLighter);
      // corner studs
      this.px(ctx, 2, 2, 2, 2, P.waterLighter);
      this.px(ctx, 28, 2, 2, 2, P.waterLighter);
      this.px(ctx, 2, 28, 2, 2, P.waterLighter);
      this.px(ctx, 28, 28, 2, 2, P.waterLighter);
    }, 'tile-goal');

    // ── Desk (code 3) — wooden desk with monitor ──
    make((ctx) => {
      this.px(ctx, 0, 0, T, T, P.grass);
      // desk top
      this.px(ctx, 3, 12, 26, 16, P.wood);
      this.px(ctx, 3, 12, 26, 2, P.woodLight);
      this.px(ctx, 3, 12, 2, 16, P.woodDark);
      // monitor
      this.px(ctx, 11, 4, 10, 9, P.ink);
      this.px(ctx, 12, 5, 8, 7, P.water);
      this.px(ctx, 13, 6, 6, 4, '#7fd4c1');
      this.px(ctx, 13, 6, 2, 1, '#c8f2ea');
      // keyboard
      this.px(ctx, 7, 23, 18, 3, P.wallDark);
      this.px(ctx, 9, 24, 2, 1, P.wall);
      this.px(ctx, 13, 24, 2, 1, P.wall);
      this.px(ctx, 17, 24, 2, 1, P.wall);
      // mug
      this.px(ctx, 24, 14, 4, 6, P.paper);
      this.px(ctx, 25, 13, 2, 2, '#b0603a');
    }, 'tile-desk');

    // ── Zone rug (code 4) — tinted per bot zone ──
    make((ctx) => {
      this.px(ctx, 0, 0, T, T, P.rug);
      this.px(ctx, 0, 0, T, 2, P.rugBorder);
      this.px(ctx, 0, 30, T, 2, P.rugBorder);
      this.px(ctx, 0, 0, 2, T, P.rugBorder);
      this.px(ctx, 30, 0, 2, T, P.rugBorder);
      this.px(ctx, 3, 3, T - 6, T - 6, '#e4d8bc');
      // corner dots + center mark
      this.px(ctx, 4, 4, 2, 2, '#ffffff');
      this.px(ctx, 26, 4, 2, 2, '#ffffff');
      this.px(ctx, 4, 26, 2, 2, '#ffffff');
      this.px(ctx, 26, 26, 2, 2, '#ffffff');
      this.px(ctx, 14, 14, 4, 4, '#d0c09c');
    }, 'tile-rug');

    // ── Plant (code 5) — pot + leaves ──
    make((ctx) => {
      this.px(ctx, 0, 0, T, T, P.grass);
      // leaves
      this.px(ctx, 11, 8, 2, 2, P.plant);
      this.px(ctx, 14, 6, 2, 2, P.plantLight);
      this.px(ctx, 13, 10, 2, 2, P.plant);
      this.px(ctx, 16, 9, 2, 2, P.plantLight);
      this.px(ctx, 9, 11, 2, 2, P.plant);
      this.px(ctx, 12, 12, 2, 2, P.plantLight);
      // pot
      this.px(ctx, 9, 15, 14, 2, P.potLight);
      this.px(ctx, 10, 17, 12, 10, P.pot);
      this.px(ctx, 10, 17, 2, 10, P.potLight);
      this.px(ctx, 10, 25, 12, 2, '#a85e42');
    }, 'tile-plant');

    // ── Meeting table (code 6) ──
    make((ctx) => {
      this.px(ctx, 0, 0, T, T, P.grass);
      this.px(ctx, 2, 8, 28, 18, P.wood);
      this.px(ctx, 2, 8, 28, 2, P.woodLight);
      this.px(ctx, 2, 8, 2, 18, P.woodDark);
      this.px(ctx, 2, 24, 28, 2, P.woodDark);
      // papers
      this.px(ctx, 6, 12, 7, 5, P.paper);
      this.px(ctx, 7, 13, 5, 1, '#d4c8a8');
      this.px(ctx, 18, 14, 6, 4, '#e8dcc0');
      // mug
      this.px(ctx, 24, 11, 4, 5, '#d4a017');
      this.px(ctx, 25, 10, 2, 2, '#f0d878');
    }, 'tile-table');

    // ── Server / K8s Cluster Rack (code 8) ──
    make((ctx) => {
      this.px(ctx, 0, 0, T, T, P.grass);
      // shadow
      this.px(ctx, 4, 26, 24, 4, P.shadow);
      // rack chassis
      this.px(ctx, 5, 2, 22, 26, '#1e293b');
      this.px(ctx, 5, 2, 22, 3, '#334155');
      this.px(ctx, 7, 6, 18, 20, '#0f172a');
      // blade servers + blinking LEDs
      for (const by of [8, 13, 18, 23]) {
        this.px(ctx, 8, by, 16, 3, '#1e293b');
        this.px(ctx, 9, by + 1, 2, 1, '#22d3ee');
        this.px(ctx, 12, by + 1, 2, 1, '#34d399');
        this.px(ctx, 16, by + 1, 6, 1, '#475569');
      }
    }, 'tile-server');

    // ── Blueprint Bookshelf / Archive Rack (code 9) ──
    make((ctx) => {
      this.px(ctx, 0, 0, T, T, P.grass);
      this.px(ctx, 3, 2, 26, 26, P.woodDark);
      this.px(ctx, 3, 2, 26, 3, P.woodLight);
      this.px(ctx, 5, 6, 22, 8, '#3a2818');
      this.px(ctx, 5, 16, 22, 9, '#3a2818');
      // colorful book spines row 1
      const colors1 = ['#3dbf7a', '#4a9bc7', '#d4a017', '#e07a9b', '#8b6bc9', '#f8f0d8'];
      colors1.forEach((col, i) => {
        this.px(ctx, 6 + i * 3, 7, 2, 7, col);
      });
      // book spines + scroll row 2
      const colors2 = ['#d4a017', '#3dbf7a', '#f8f0d8', '#4a9bc7', '#e07a9b'];
      colors2.forEach((col, i) => {
        this.px(ctx, 6 + i * 4, 17, 3, 8, col);
      });
    }, 'tile-bookshelf');

    // ── Courtyard Lantern Post (code 10) ──
    make((ctx) => {
      this.px(ctx, 0, 0, T, T, P.path);
      // warm ground glow
      ctx.fillStyle = 'rgba(250, 204, 21, 0.22)';
      ctx.fillRect(4, 6, 24, 22);
      // stone base + post
      this.px(ctx, 11, 23, 10, 5, P.wallDark);
      this.px(ctx, 12, 21, 8, 3, P.wallLight);
      this.px(ctx, 14, 13, 4, 9, P.wallInk);
      // lantern housing + glowing core
      this.px(ctx, 10, 4, 12, 2, P.wallInk);
      this.px(ctx, 11, 6, 10, 7, '#facc15');
      this.px(ctx, 13, 7, 6, 5, '#fef08a');
      this.px(ctx, 11, 13, 10, 1, P.wallInk);
    }, 'tile-lantern');

    // ── Zen Water Basin / Fountain (code 11) ──
    make((ctx) => {
      this.px(ctx, 0, 0, T, T, P.grass);
      // stone rim
      this.px(ctx, 3, 5, 26, 22, P.wallLight);
      this.px(ctx, 3, 24, 26, 3, P.wallDark);
      // azure water pool
      this.px(ctx, 6, 8, 20, 15, P.water);
      this.px(ctx, 8, 10, 16, 11, P.waterLight);
      // fountain spout & ripples
      this.px(ctx, 14, 12, 4, 5, P.waterLighter);
      this.px(ctx, 10, 17, 12, 2, P.waterLighter);
      this.px(ctx, 15, 9, 2, 3, '#ffffff');
    }, 'tile-fountain');

    // ── Tile cursor — corner brackets ──
    make((ctx) => {
      ctx.fillStyle = 'rgba(248, 240, 216, 0.16)';
      ctx.fillRect(4, 4, T - 8, T - 8);
      ctx.fillStyle = P.paper;
      // corners
      this.px(ctx, 1, 1, 10, 2, P.paper);
      this.px(ctx, 1, 1, 2, 10, P.paper);
      this.px(ctx, 21, 1, 10, 2, P.paper);
      this.px(ctx, 29, 1, 2, 10, P.paper);
      this.px(ctx, 1, 29, 10, 2, P.paper);
      this.px(ctx, 1, 21, 2, 10, P.paper);
      this.px(ctx, 21, 29, 10, 2, P.paper);
      this.px(ctx, 29, 21, 2, 10, P.paper);
    }, 'tile-cursor');
  }

  // ---------------------------------------------------------------------------
  // Chibi pixel characters — 24×24, 4 directions × 4 anim rows
  // ---------------------------------------------------------------------------

  private static botLook(key: string): {
    skin: string;
    hair: string;
    pants: string;
    prop: 'spark' | 'cable' | 'book' | 'key' | 'wrench' | 'camera' | 'wave';
    /** Optional own colour for the prop (counts toward the 8-colour budget). */
    propColor?: string;
    /** Hair style: default fringe, short crop, or long (1–2 px past the head). */
    hairStyle?: 'default' | 'short' | 'long';
    /** Broad build: torso 12 px instead of 10, arms one pixel further out. */
    broad?: boolean;
  } {
    const p = BOT_PROFILES[key];
    const looks: Record<string, ReturnType<typeof this.botLook>> = {
      spark: { skin: '#F5D0B0', hair: '#E8A838', pants: this.mixHex(p.color, '#1d2418', 0.5), prop: 'spark' },
      tether: { skin: '#E8C4A8', hair: '#4A6FA5', pants: this.mixHex(p.color, '#1d2418', 0.5), prop: 'cable' },
      atlas: { skin: '#D4A574', hair: '#3D3429', pants: this.mixHex(p.color, '#1d2418', 0.5), prop: 'book' },
      // Canvas, the Lens: near-black short crop (same ink as the shoes, so it costs no
      // palette slot), broad build, small camera with a glass-blue lens pixel.
      canvas: {
        skin: '#B98058',
        hair: '#2a2418',
        pants: this.mixHex(p.color, '#1d2418', 0.5),
        prop: 'camera',
        propColor: '#7fb8c9',
        hairStyle: 'short',
        broad: true,
      },
      kinetic: { skin: '#C9956C', hair: '#2A1F3D', pants: this.mixHex(p.color, '#1d2418', 0.5), prop: 'wrench' },
      // Ying, the Hermes chair: long dark hair (shoe ink again), sea-teal wave prop.
      ying: {
        skin: '#F3D9C4',
        hair: '#2a2418',
        pants: this.mixHex(p.color, '#1d2418', 0.5),
        prop: 'wave',
        propColor: '#19E3FF',
        hairStyle: 'long',
      },
    };
    return looks[key] ?? looks.spark;
  }

  static drawBotFrame(
    ctx: CanvasRenderingContext2D,
    bot: BotSpriteConfig,
    cellX: number,
    cellY: number,
    dir: number,
    animRow: number
  ) {
    const look = this.botLook(bot.name);
    const p = BOT_PROFILES[bot.name];
    const shirt = p.color;
    const accent = this.mixHex(p.color, '#ffffff', 0.25);

    // ── ground shadow ──
    this.px(ctx, cellX + 5, cellY + 21, 14, 2, this.PX.shadow);

    // Walk cycle: row 1 = step A, row 2 = pass-through (bob), row 3 = step B
    const bob = animRow === 2 ? -1 : 0;
    const stride = animRow === 0 ? 0 : animRow === 1 ? 1 : animRow === 3 ? -1 : 0;

    const faceDown = dir === 0;
    const faceUp = dir === 1;
    const faceLeft = dir === 2;
    const faceRight = dir === 3;

    // ── legs / shoes (behind body) ──
    const legShiftX = faceLeft ? -stride : faceRight ? stride : 0;
    const legShiftY = faceDown || faceUp ? stride : 0;
    const lx = cellX + 8 + legShiftX;
    const rx = cellX + 13 + legShiftX;
    const ly = cellY + 17 + legShiftY + bob;
    const ry = cellY + 17 - legShiftY + bob;
    this.px(ctx, lx, ly, 3, 4, look.pants);
    this.px(ctx, rx, ry, 3, 4, look.pants);
    this.px(ctx, lx - 1, ly + 3, 4, 2, '#2a2418');
    this.px(ctx, rx - 1, ry + 3, 4, 2, '#2a2418');

    // ── head ──
    const headY = cellY + 2 + bob;
    const skin = look.skin;
    const hair = look.hair;
    // skull
    this.px(ctx, cellX + 8, headY, 8, 8, skin);
    // hair
    const hairStyle = look.hairStyle ?? 'default';
    this.px(ctx, cellX + 8, headY, 8, 2, hair);
    if (faceUp) {
      this.px(ctx, cellX + 8, headY + 2, 8, 6, hair); // full back of head
    } else if (hairStyle === 'short') {
      // short crop: back of head only to the ears, tiny sideburns in front
      if (faceLeft) this.px(ctx, cellX + 14, headY, 2, 5, hair);
      else if (faceRight) this.px(ctx, cellX + 8, headY, 2, 5, hair);
      else {
        this.px(ctx, cellX + 8, headY + 2, 1, 2, hair);
        this.px(ctx, cellX + 15, headY + 2, 1, 2, hair);
      }
    } else if (faceLeft) {
      this.px(ctx, cellX + 13, headY, 3, 8, hair); // hair back on the right
    } else if (faceRight) {
      this.px(ctx, cellX + 8, headY, 3, 8, hair); // hair back on the left
    } else {
      this.px(ctx, cellX + 8, headY + 2, 2, 3, hair); // fringe sides
      this.px(ctx, cellX + 14, headY + 2, 2, 3, hair);
    }
    // face
    if (faceDown) {
      this.px(ctx, cellX + 10, headY + 4, 1, 2, this.PX.ink); // eyes
      this.px(ctx, cellX + 13, headY + 4, 1, 2, this.PX.ink);
      this.px(ctx, cellX + 11, headY + 7, 2, 1, this.PX.ink); // mouth
    } else if (faceLeft) {
      this.px(ctx, cellX + 9, headY + 4, 1, 2, this.PX.ink);
    } else if (faceRight) {
      this.px(ctx, cellX + 14, headY + 4, 1, 2, this.PX.ink);
    }

    // ── neck ──
    this.px(ctx, cellX + 11, headY + 7, 2, 2, skin);

    // ── body ──
    // Broad build (Canvas): torso 12 px wide instead of 10, arms one pixel further out.
    const w = look.broad ? 1 : 0;
    const bodyY = headY + 8;
    this.px(ctx, cellX + 7 - w, bodyY, 10 + 2 * w, 8, shirt);
    this.px(ctx, cellX + 15 + w, bodyY, 2, 8, this.mixHex(shirt, '#1d2418', 0.3)); // shade
    this.px(ctx, cellX + 8 - w, bodyY + 3, 8 + 2 * w, 2, accent); // role stripe

    // ── arms (skin) with walk swing ──
    const armSwing = stride * (faceLeft || faceRight ? 1 : 0);
    this.px(ctx, cellX + 5 - w, bodyY + armSwing, 2, 6, skin);
    this.px(ctx, cellX + 17 + w, bodyY - armSwing, 2, 6, skin);
    this.px(ctx, cellX + 5 - w, bodyY + 5 + armSwing, 3, 2, skin); // hands
    this.px(ctx, cellX + 16 + w, bodyY + 5 - armSwing, 3, 2, skin);

    // ── long hair falls over the shoulders / back (drawn over the body) ──
    if (hairStyle === 'long') {
      if (faceUp) {
        this.px(ctx, cellX + 8, headY + 8, 8, 2, hair); // 2 px past the head, down the back
      } else if (faceLeft) {
        this.px(ctx, cellX + 13, headY + 8, 3, 2, hair);
      } else if (faceRight) {
        this.px(ctx, cellX + 8, headY + 8, 3, 2, hair);
      } else {
        this.px(ctx, cellX + 8, headY + 5, 2, 5, hair); // side locks past the jaw
        this.px(ctx, cellX + 14, headY + 5, 2, 5, hair);
      }
    }

    // ── role prop (accent pixels at the shoulder) ──
    const propX = faceLeft || faceUp ? cellX + 3 - 2 * w : cellX + 18 + w; // broad: camera overlaps the outer arm pixel, 1 px frame margin kept
    const propY = bodyY + 1;
    const propC = look.propColor ?? accent;
    switch (look.prop) {
      case 'spark': // tiny bolt
        this.px(ctx, propX + 1, propY, 1, 3, accent);
        this.px(ctx, propX, propY + 1, 2, 1, accent);
        this.px(ctx, propX + 1, propY + 2, 1, 3, accent);
        break;
      case 'cable': // curl
        this.px(ctx, propX, propY, 3, 1, accent);
        this.px(ctx, propX + 2, propY + 1, 1, 2, accent);
        this.px(ctx, propX, propY + 2, 2, 1, accent);
        break;
      case 'book': // small tome
        this.px(ctx, propX, propY, 3, 3, accent);
        this.px(ctx, propX + 1, propY, 1, 3, this.PX.ink);
        break;
      case 'key': // key
        this.px(ctx, propX, propY, 1, 3, accent);
        this.px(ctx, propX - 1, propY, 2, 1, accent);
        this.px(ctx, propX, propY + 3, 1, 1, accent);
        break;
      case 'wrench': // wrench
        this.px(ctx, propX, propY + 1, 3, 1, accent);
        this.px(ctx, propX + 1, propY, 1, 3, accent);
        break;
      case 'camera': {
        // 4×4 compact camera: ink body, viewfinder bump, one lens pixel facing out
        this.px(ctx, propX + 1, propY - 1, 2, 1, this.PX.ink); // viewfinder
        this.px(ctx, propX, propY, 4, 3, this.PX.ink); // body
        const lensX = faceLeft || faceUp ? propX + 1 : propX + 2;
        this.px(ctx, lensX, propY + 1, 1, 1, propC); // lens
        break;
      }
      case 'wave': // little sea-teal wave crest
        this.px(ctx, propX + 1, propY, 2, 1, propC);
        this.px(ctx, propX, propY + 1, 1, 1, propC);
        this.px(ctx, propX, propY + 2, 3, 1, propC);
        break;
    }
  }

  static buildBotSpritesheet(bot: BotSpriteConfig): HTMLCanvasElement {
    const { frameWidth, frameHeight, directions, animRows } = PIXEL_SHEET;
    const canvas = document.createElement('canvas');
    canvas.width = frameWidth * directions;
    canvas.height = frameHeight * animRows;
    const ctx = canvas.getContext('2d')!;

    for (let row = 0; row < animRows; row++) {
      for (let dir = 0; dir < directions; dir++) {
        this.drawBotFrame(ctx, bot, dir * frameWidth, row * frameHeight, dir, row);
      }
    }
    return canvas;
  }

  private static generateBots(scene: Phaser.Scene) {
    const botsConfig: BotSpriteConfig[] = BOT_KEYS.map((key) => ({
      name: key,
      mainColor: BOT_PROFILES[key].color,
      baseBg: BOT_PROFILES[key].baseBg,
    }));

    const { frameWidth, frameHeight } = PIXEL_SHEET;

    botsConfig.forEach((bot) => {
      const canvasBot = this.buildBotSpritesheet(bot);
      this.botCanvases.set(bot.name, canvasBot);

      const texKey = `bot-${bot.name}`;
      if (scene.textures.exists(texKey)) scene.textures.remove(texKey);
      scene.textures.addSpriteSheet(texKey, canvasBot as unknown as HTMLImageElement, {
        frameWidth,
        frameHeight,
      });
    });
  }

  private static registerAnimations(scene: Phaser.Scene) {
    BOT_KEYS.forEach((key) => {
      for (let dir = 0; dir < PIXEL_SHEET.directions; dir++) {
        const idleKey = `bot-${key}-idle-${dir}`;
        const walkKey = `bot-${key}-walk-${dir}`;

        if (scene.anims.exists(idleKey)) scene.anims.remove(idleKey);
        if (scene.anims.exists(walkKey)) scene.anims.remove(walkKey);

        scene.anims.create({
          key: idleKey,
          frames: [{ key: `bot-${key}`, frame: PIXEL_SHEET.frameIndex(dir, 0) }],
          frameRate: 1,
          repeat: -1,
        });

        scene.anims.create({
          key: walkKey,
          frames: [1, 2, 3, 2].map((row) => ({
            key: `bot-${key}`,
            frame: PIXEL_SHEET.frameIndex(dir, row),
          })),
          frameRate: 8,
          repeat: -1,
        });
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Export helpers (kept for the dev export pipeline)
  // ---------------------------------------------------------------------------

  static exportAllSpritesheets() {
    const stamp = new Date().toISOString().slice(0, 10);
    this.botCanvases.forEach((canvas, name) => {
      this.downloadCanvas(canvas, `aether-bot-${name}-pixel-${stamp}.png`);
    });
  }

  static exportBotSpritesheet(botKey: string) {
    const canvas = this.botCanvases.get(botKey);
    if (!canvas) {
      console.warn(`[TextureGenerator] No spritesheet for bot "${botKey}"`);
      return;
    }
    this.downloadCanvas(canvas, `aether-bot-${botKey}-pixel.png`);
  }

  private static downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  static getBotCanvas(botKey: string): HTMLCanvasElement | undefined {
    return this.botCanvases.get(botKey);
  }

  // ---------------------------------------------------------------------------
  // Color utils
  // ---------------------------------------------------------------------------

  /** Mix hex toward another (t 0..1 toward b) */
  private static mixHex(a: string, b: string, t: number): string {
    const parse = (h: string) => [
      parseInt(h.slice(1, 3), 16),
      parseInt(h.slice(3, 5), 16),
      parseInt(h.slice(5, 7), 16),
    ];
    const [ar, ag, ab] = parse(a);
    const [br, bg, bb] = parse(b);
    const r = Math.round(ar + (br - ar) * t);
    const g = Math.round(ag + (bg - ag) * t);
    const bl = Math.round(ab + (bb - ab) * t);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bl.toString(16).padStart(2, '0')}`;
  }
}

if (typeof window !== 'undefined') {
  (window as unknown as { AetherSprites: typeof TextureGenerator }).AetherSprites =
    TextureGenerator;
}

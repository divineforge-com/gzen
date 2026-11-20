import Phaser from 'phaser';
import {
  getDepth,
  getHallRect,
  getWorldBounds,
  gridToWorld,
  isWithinBounds,
  TOPDOWN_CONFIG,
  worldToGrid,
} from '../TopDownConfig';
import type { Screen2D } from '../TopDownConfig';
import { TextureGenerator } from '../TextureGenerator';
import { BotStateManager, BOT_PROFILES } from '../BotState';
import { BotEntity } from '../BotEntity';
import {
  buildLabGrid,
  isWalkable,
  LAB_ZONES,
  SPAWN,
  zoneAt,
} from '../WorldMap';
import { CameraControls } from '../CameraControls';

export class GameScene extends Phaser.Scene {
  private botManager: BotStateManager;
  private tilesGroup!: Phaser.GameObjects.Group;
  private cursorSprite: Phaser.GameObjects.Sprite | null = null;
  private cameraControls: CameraControls | null = null;

  private mazeGrid: number[][] = buildLabGrid();

  private bots: Map<string, BotEntity> = new Map();
  private activeKey = 'spark';

  private keys: Record<string, Phaser.Input.Keyboard.Key> | null = null;
  private tileObjectsMap: Map<string, Phaser.GameObjects.Sprite> = new Map();

  private nearbyKey: string | null = null;
  private lastProximityGreet = 0;
  private keyMoveCooldown = 0;
  /** When true, camera frames the full 28×18 Emporium Hall until player moves or clicks Focus */
  private overviewMode = false;

  /** Touch overlay virtual keys (movement held, A/B one-shot) */
  private virtualKeys: Record<string, boolean> = {
    up: false,
    down: false,
    left: false,
    right: false,
    a: false,
    b: false,
  };

  // ── Phase 1: Guest Welcome state ──
  private greeterPhase: 'idle' | 'walking' | 'greeting' | 'done' = 'idle';
  private welcomeAccepted = false;
  private idleTimer = 0;
  private readonly IDLE_RESCUE_MS = 20000;

  // ── Phase 2: Content manifest ──
  private contentManifest: any = null;

  private lastStatusPos = { x: -1, y: -1 };

  constructor() {
    super({ key: 'GameScene' });
    this.botManager = new BotStateManager(SPAWN.x, SPAWN.y, 0);
  }

  preload() {
    TextureGenerator.generateTextures(this);
  }

  /** Compute a wide-viewport camera zoom based on current canvas width */
  private computeDefaultZoom(): number {
    const cam = this.cameras.main;
    const hall = getHallRect();
    // On wide desktop screens, pick a zoom that fills ~70-85% of the hall width
    if (cam.width >= 1100) {
      const fitW = (cam.width * 0.86) / hall.width;
      return Phaser.Math.Clamp(Number(fitW.toFixed(2)), 1.25, 1.85);
    }
    if (cam.width >= 768) {
      return 1.25;
    }
    return 1.05;
  }

  create() {
    this.tilesGroup = this.add.group();
    this.cameras.main.setBackgroundColor('#2a4528');

    // Full-bleed grass backdrop covering the camera bounds
    const b = getWorldBounds();
    this.add.tileSprite(
      b.x + b.width / 2,
      b.y + b.height / 2,
      b.width,
      b.height,
      'tile-ground'
    ).setDepth(-1000);

    const cam = this.cameras.main;
    cam.setBounds(b.x, b.y, b.width, b.height);

    this.renderMap();
    this.spawnAllBots();

    const initialZoom = this.computeDefaultZoom();
    cam.setZoom(initialZoom);

    // Figma-style zoom + pan (supports wide overview zoom out down to 0.65x)
    this.cameraControls = new CameraControls(this, {
      minZoom: 0.65,
      maxZoom: 3.25,
      onViewChange: (zoom) => this.updateZoomHud(zoom),
      onPanModeChange: (active) => this.updatePanToolHud(active),
    });
    this.updateZoomHud(initialZoom);
    this.updatePanToolHud(false);

    // Responsive camera resize when browser viewport changes width/height
    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      this.cameras.main.setSize(gameSize.width, gameSize.height);
      if (this.overviewMode) {
        this.fitWholeWorld();
      }
    });

    if (this.input.keyboard) {
      this.keys = this.input.keyboard.addKeys(
        'W,A,S,D,UP,DOWN,LEFT,RIGHT,B,E'
      ) as Record<string, Phaser.Input.Keyboard.Key>;
    }

    this.cursorSprite = this.add.sprite(0, 0, 'tile-cursor');
    this.cursorSprite.setOrigin(0.5, 0.5);
    this.cursorSprite.setVisible(false);
    this.cursorSprite.setDepth(29000);

    this.input.on('pointermove', (p: Phaser.Input.Pointer) => this.handlePointerMove(p));
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => this.handlePointerDown(p));

    // On wide viewports, start with the wide camera framing the entire Emporium Hall
    if (cam.width >= 900) {
      this.fitWholeWorld();
    } else {
      this.focusOnPlayer(initialZoom);
    }

    this.logConsole('SYSTEM', 'The Emporium floor is open — WASD/Arrows to walk, click any tile to pathfind, or use Fit World to view all 6 pavilions.', 'system');
    this.logConsole(
      this.botManager.getActiveBot().name,
      this.botManager.getRandomQuote('select'),
      this.botManager.getActiveBotKey()
    );

    this.setupDOMBindings();
    this.updateNearbyPanel(null);
    this.setupWelcomeOverlay();
    this.loadContentManifest();
    this.setupConsultForm();
  }

  shutdown() {
    this.cameraControls?.destroy();
    this.cameraControls = null;
  }

  // ---------------------------------------------------------------------------
  // Bots
  // ---------------------------------------------------------------------------

  private spawnAllBots() {
    this.bots.forEach((b) => b.destroy());
    this.bots.clear();

    // Place each bot at its lab zone home; active player starts at SPAWN then walks in.
    for (const zone of LAB_ZONES) {
      const isActive = zone.botKey === this.activeKey;
      const x = isActive ? SPAWN.x : zone.homeX;
      const y = isActive ? SPAWN.y : zone.homeY;

      const entity = new BotEntity(
        this,
        zone.botKey,
        x,
        y,
        isActive ? 'player' : 'npc',
        this.mazeGrid
      );

      entity.sprite.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        if (this.cameraControls?.shouldIgnoreClick(pointer)) return;
        pointer.event?.stopPropagation?.();
        this.selectBot(zone.botKey, true);
      });

      this.bots.set(zone.botKey, entity);
    }

    // Sync manager position to active bot
    const active = this.bots.get(this.activeKey)!;
    this.botManager.setPosition(active.gridX, active.gridY, 0);
    this.botManager.setActiveBot(this.activeKey);
  }

  private getPlayer(): BotEntity {
    return this.bots.get(this.activeKey)!;
  }

  private occupiedTiles(excludeKey?: string): Set<string> {
    const set = new Set<string>();
    this.bots.forEach((bot, key) => {
      if (key === excludeKey) return;
      set.add(`${bot.gridX},${bot.gridY}`);
    });
    return set;
  }

  private selectBot(botKey: string, fromClick = false) {
    if (!this.bots.has(botKey) || botKey === this.activeKey) {
      if (botKey === this.activeKey && fromClick) {
        this.overviewMode = false;
        this.focusOnPlayer();
      }
      return;
    }

    // Previous player becomes NPC at their current tile (home shifts to current pos)
    const prev = this.bots.get(this.activeKey);
    if (prev) {
      prev.setMode('npc');
      prev.homeX = prev.gridX;
      prev.homeY = prev.gridY;
      prev.clearPath();
    }

    this.activeKey = botKey;
    this.overviewMode = false;
    const next = this.bots.get(botKey)!;
    next.setMode('player');
    next.clearPath();
    next.homeX = next.gridX;
    next.homeY = next.gridY;

    const selectQuote = this.botManager.setActiveBot(botKey);
    this.botManager.setPosition(next.gridX, next.gridY, 0);

    const profile = BOT_PROFILES[botKey];
    this.logConsole(profile.name, selectQuote, botKey);
    next.showSpeech(selectQuote);

    // Roster buttons
    document.querySelectorAll('.bot-btn, [data-quick-bot]').forEach((btn) => {
      const key = btn.getAttribute('data-bot') || btn.getAttribute('data-quick-bot');
      btn.classList.toggle('active', key === botKey);
    });

    const liveMsg = document.getElementById('bot-live-msg');
    if (liveMsg) {
      liveMsg.innerHTML = `<span class="console-name" style="color: ${profile.color};">${profile.name}:</span> ${selectQuote}`;
    }

    this.lastStatusPos = { x: -1, y: -1 };
    this.updatePlayerStatus();
    this.cameras.main.flash(160, 20, 30, 40);
  }

  // ---------------------------------------------------------------------------
  // Map render
  // ---------------------------------------------------------------------------

  private tileKeyFor(code: number): string {
    switch (code) {
      case 1:
        return 'tile-wall';
      case 2:
        return 'tile-goal';
      case 3:
        return 'tile-desk';
      case 4:
        return 'tile-rug';
      case 5:
        return 'tile-plant';
      case 6:
        return 'tile-table';
      case 7:
        return 'tile-path';
      case 8:
        return 'tile-server';
      case 9:
        return 'tile-bookshelf';
      case 10:
        return 'tile-lantern';
      case 11:
        return 'tile-fountain';
      default:
        return 'tile-ground';
    }
  }

  private renderMap() {
    this.tilesGroup.clear(true, true);
    this.tileObjectsMap.clear();

    const T = TOPDOWN_CONFIG.tileSize;

    for (let y = 0; y < TOPDOWN_CONFIG.gridSizeY; y++) {
      for (let x = 0; x < TOPDOWN_CONFIG.gridSizeX; x++) {
        const tileType = this.mazeGrid[y][x];
        const w = gridToWorld(x, y);
        const cx = w.x + T / 2;
        const cy = w.y + T / 2;

        const tileSprite = this.add.sprite(cx, cy, this.tileKeyFor(tileType));
        tileSprite.setOrigin(0.5, 0.5);
        tileSprite.setDepth(getDepth(x, y));

        // Tint zone rugs with bot colors
        if (tileType === 4) {
          const z = zoneAt(x, y);
          if (z) {
            const c = Phaser.Display.Color.HexStringToColor(z.color);
            tileSprite.setTint(c.color);
            tileSprite.setAlpha(0.92);
          }
        }

        this.tilesGroup.add(tileSprite);
        this.tileObjectsMap.set(`${x},${y}`, tileSprite);

        // Zone labels (once per zone, centered above its top row so bot name tags never overlap)
        const z = zoneAt(x, y);
        if (z && x === z.x0 && y === z.y0) {
          const lx = (z.x0 + z.x1) / 2;
          const lw = gridToWorld(lx, z.y0);
          const label = this.add.text(lw.x + T / 2, lw.y - 12, z.label, {
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '8px',
            color: z.color,
            stroke: '#241a10',
            strokeThickness: 3,
            align: 'center',
          });
          label.setOrigin(0.5, 0.5);
          label.setDepth(28500);
          label.setAlpha(0.96);
          this.tilesGroup.add(label);
        }

        // Portal bob
        if (tileType === 2) {
          const exitMarker = this.add.sprite(cx, cy - 10, 'tile-goal');
          exitMarker.setOrigin(0.5, 0.5);
          exitMarker.setScale(0.5);
          exitMarker.setTint(0xffd700);
          exitMarker.setDepth(getDepth(x, y) + 0.7);
          this.tweens.add({
            targets: exitMarker,
            y: '-=6',
            scaleX: 0.55,
            scaleY: 0.55,
            duration: 900,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
          });
          this.tilesGroup.add(exitMarker);
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Update loop
  // ---------------------------------------------------------------------------

  update(_time: number, delta: number) {
    this.keyMoveCooldown = Math.max(0, this.keyMoveCooldown - delta);

    // Smooth camera follow (skipped while user is panning/zooming or in Fit World overview)
    this.followPlayer(delta);

    // Drive all bots
    this.bots.forEach((bot, key) => {
      bot.update(this.time.now, this.occupiedTiles(key), key === this.activeKey);
    });

    // Sync manager to player grid + portal check after any move
    const player = this.getPlayer();
    if (!player.isMoving) {
      const prev = this.botManager.getPosition();
      if (prev.x !== player.gridX || prev.y !== player.gridY) {
        this.botManager.setPosition(player.gridX, player.gridY, 0);
        this.checkPortal(player);
      } else {
        this.botManager.setPosition(player.gridX, player.gridY, 0);
      }
    }

    // Idle chatter for active bot
    const idleQuote = this.botManager.checkIdle();
    if (idleQuote) {
      this.logConsole(
        this.botManager.getActiveBot().name,
        idleQuote,
        this.botManager.getActiveBotKey()
      );
      player.showSpeech(idleQuote);
    }

    // Proximity detection (Gather-style)
    this.updateProximity();

    // ── Phase 2: Update zone content based on player position ──
    this.updatePlayerZone();

    // ── Phase 1: Idle rescue — if visitor hasn't moved in 20s, nearest bot approaches ──
    if (this.welcomeAccepted && this.greeterPhase === 'done') {
      if (player.isMoving || this.keyMoveCooldown > 0) {
        this.idleTimer = 0;
      } else {
        this.idleTimer += delta;
        if (this.idleTimer >= this.IDLE_RESCUE_MS) {
          this.idleRescue();
          this.idleTimer = 0;
        }
      }
    }

    this.updatePlayerStatus();

    if (player.isMoving) return;

    // Keyboard + touch D-pad (flat top-down coordinates: W/Up -> dy=-1, S/Down -> dy=1, A/Left -> dx=-1, D/Right -> dx=1)
    if (this.keys && this.keyMoveCooldown <= 0) {
      let dx = 0;
      let dy = 0;
      const vk = this.virtualKeys;

      if (this.keys.W.isDown || this.keys.UP.isDown || vk.up) {
        dy = -1;
      } else if (this.keys.S.isDown || this.keys.DOWN.isDown || vk.down) {
        dy = 1;
      } else if (this.keys.A.isDown || this.keys.LEFT.isDown || vk.left) {
        dx = -1;
      } else if (this.keys.D.isDown || this.keys.RIGHT.isDown || vk.right) {
        dx = 1;
      } else if (Phaser.Input.Keyboard.JustDown(this.keys.B) || vk.b) {
        // B = build wall
        vk.b = false;
        this.deployVoxelInFront();
      } else if (Phaser.Input.Keyboard.JustDown(this.keys.E) || vk.a) {
        // E / A = interact with nearby bot
        vk.a = false;
        this.interactNearby();
      }

      if (dx !== 0 || dy !== 0) {
        this.overviewMode = false;
        this.keyMoveCooldown = 130;
        player.tryStep(
          dx,
          dy,
          () => {
            this.cameras.main.shake(80, 0.004);
            const q = this.botManager.getQuoteWithCooldown('collide');
            if (q) {
              this.logConsole(player.key, q, player.key);
              player.showSpeech(q);
            }
          },
          () => {
            const q = this.botManager.getQuoteWithCooldown('move');
            if (q) this.logConsole(BOT_PROFILES[player.key].name, q, player.key);
          }
        );
      }
    }
  }

  /** Lerp the camera toward the player */
  private followPlayer(delta: number) {
    if (
      this.overviewMode ||
      this.cameraControls?.isActivelyPanning() ||
      this.cameraControls?.isSpaceHeld() ||
      this.cameraControls?.isPanMode()
    ) {
      return;
    }
    const player = this.getPlayer();
    const cam = this.cameras.main;
    const targetX = player.sprite.x;
    const targetY = player.sprite.y + TOPDOWN_CONFIG.followOffsetY;

    const t = 1 - Math.pow(0.0008, delta / 1000);
    const cx = cam.scrollX + cam.width / 2;
    const cy = cam.scrollY + cam.height / 2;
    cam.scrollX += (targetX - cx) * t;
    cam.scrollY += (targetY - cy) * t;

    const b = getWorldBounds();
    const vw = cam.width / cam.zoom;
    const vh = cam.height / cam.zoom;
    if (vw < b.width) {
      cam.scrollX = Phaser.Math.Clamp(cam.scrollX, b.x, b.x + b.width - vw);
    } else {
      cam.scrollX = b.x + (b.width - vw) / 2;
    }
    if (vh < b.height) {
      cam.scrollY = Phaser.Math.Clamp(cam.scrollY, b.y, b.y + b.height - vh);
    } else {
      cam.scrollY = b.y + (b.height - vh) / 2;
    }
  }

  private focusOnPlayer(zoom?: number) {
    this.overviewMode = false;
    const player = this.getPlayer();
    this.cameraControls?.focusOn(
      player.sprite.x,
      player.sprite.y + TOPDOWN_CONFIG.followOffsetY,
      zoom ?? this.computeDefaultZoom()
    );
  }

  /** Zoom and center camera so the entire 28×18 Emporium Hall fills the viewport */
  private fitWholeWorld() {
    this.overviewMode = true;
    const cam = this.cameras.main;
    const hall = getHallRect();
    const padX = 96;
    const padY = 148;
    const zoomX = cam.width / (hall.width + padX);
    const zoomY = cam.height / (hall.height + padY);
    const fitZoom = Phaser.Math.Clamp(Math.min(zoomX, zoomY), 0.65, 2.2);
    this.cameraControls?.focusOn(hall.centerX, hall.centerY + 26, Number(fitZoom.toFixed(2)));
  }

  private checkPortal(player: BotEntity) {
    if (this.mazeGrid[player.gridY]?.[player.gridX] === 2) {
      const q = this.botManager.getRandomQuote('goal');
      this.logConsole(BOT_PROFILES[player.key].name, q, player.key);
      player.showSpeech(q);
      this.cameras.main.flash(400, 255, 215, 0);
    }
  }

  private updateProximity() {
    const player = this.getPlayer();
    let closest: BotEntity | null = null;
    let best = Infinity;

    this.bots.forEach((bot, key) => {
      if (key === this.activeKey) return;
      const d = player.distanceTo(bot);
      if (d <= 2 && d < best) {
        best = d;
        closest = bot;
      }
    });

    const nextKey = closest ? (closest as BotEntity).key : null;
    if (nextKey !== this.nearbyKey) {
      this.nearbyKey = nextKey;
      this.updateNearbyPanel(nextKey);
      if (nextKey && this.time.now - this.lastProximityGreet > 6000) {
        this.lastProximityGreet = this.time.now;
        const greet = this.botManager.getQuoteFor(nextKey, 'greet');
        const npc = this.bots.get(nextKey)!;
        npc.showSpeech(greet);
        this.logConsole(BOT_PROFILES[nextKey].name, greet, nextKey);
      }
    }
  }

  private updateNearbyPanel(botKey: string | null) {
    const el = document.getElementById('nearby-bot');
    if (!el) return;
    if (!botKey) {
      el.innerHTML = `<span class="nearby-empty">Walk near a bot to interact · press A / E</span>`;
      el.dataset.bot = '';
    } else {
      const p = BOT_PROFILES[botKey];
      el.innerHTML = `
        <span class="nearby-dot" style="background:${p.color};box-shadow:0 0 8px ${p.color}"></span>
        <span class="nearby-name" style="color:${p.color}">${p.name}</span>
        <span class="nearby-role">${p.role}</span>
        <span class="nearby-hint">Press A / E to chat · tap to possess</span>
      `;
      el.dataset.bot = botKey;
    }
    const chip = document.getElementById('topbar-nearby');
    if (chip) {
      chip.textContent = botKey ? `Near: ${BOT_PROFILES[botKey].name}` : '';
      chip.classList.toggle('hidden', !botKey);
    }
  }

  private interactNearby() {
    if (!this.nearbyKey) {
      this.logConsole('SYSTEM', 'No bot nearby. Step closer to a zone mate.', 'system');
      return;
    }
    const greet = this.botManager.getQuoteFor(this.nearbyKey, 'greet');
    const npc = this.bots.get(this.nearbyKey)!;
    npc.showSpeech(greet);
    this.logConsole(BOT_PROFILES[this.nearbyKey].name, greet, this.nearbyKey);

    // Player also responds
    const player = this.getPlayer();
    const reply = this.botManager.getRandomQuote('select');
    player.showSpeech(reply);
  }

  // ---------------------------------------------------------------------------
  // Pointer / pathfinding
  // ---------------------------------------------------------------------------

  private getGridFromPointer(pointer: Phaser.Input.Pointer): Screen2D | null {
    return worldToGrid(pointer.worldX, pointer.worldY);
  }

  private handlePointerMove(pointer: Phaser.Input.Pointer) {
    if (
      this.cameraControls?.isActivelyPanning() ||
      this.cameraControls?.isSpaceHeld() ||
      this.cameraControls?.isPanMode()
    ) {
      this.cursorSprite?.setVisible(false);
      return;
    }

    const gridPos = this.getGridFromPointer(pointer);
    if (gridPos && this.cursorSprite) {
      const w = gridToWorld(gridPos.x, gridPos.y);
      this.cursorSprite.setPosition(
        w.x + TOPDOWN_CONFIG.tileSize / 2,
        w.y + TOPDOWN_CONFIG.tileSize / 2
      );
      this.cursorSprite.setVisible(true);
    } else {
      this.cursorSprite?.setVisible(false);
    }
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer) {
    if (this.cameraControls?.shouldIgnoreClick(pointer)) return;
    if (pointer.button !== 0) return;

    const gridPos = this.getGridFromPointer(pointer);
    if (!gridPos) return;

    // Click another bot tile → select them
    for (const [key, bot] of this.bots) {
      if (bot.gridX === gridPos.x && bot.gridY === gridPos.y && key !== this.activeKey) {
        this.selectBot(key, true);
        return;
      }
    }

    const tileType = this.mazeGrid[gridPos.y][gridPos.x];
    if (isWalkable(tileType)) {
      this.overviewMode = false;
      this.logConsole(
        'SYSTEM',
        `Routing to tile [${gridPos.x}, ${gridPos.y}]...`,
        'action'
      );
      this.pathfindPlayerTo(gridPos.x, gridPos.y);
    } else if (tileType === 1) {
      this.toggleBlock(gridPos.x, gridPos.y);
    }
  }

  private updateZoomHud(zoom: number) {
    const el = document.getElementById('zoom-level');
    if (el) el.textContent = `${Math.round(zoom * 100)}%`;
  }

  private updatePanToolHud(active: boolean) {
    const btn = document.getElementById('pan-tool-btn');
    if (!btn) return;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    const parent = document.getElementById('phaser-canvas-parent');
    parent?.classList.toggle('pan-mode', active);
  }

  private deployVoxelInFront() {
    const player = this.getPlayer();
    let fx = player.gridX;
    let fy = player.gridY;
    if (player.heading === 0) fy += 1; // down
    else if (player.heading === 1) fy -= 1; // up
    else if (player.heading === 2) fx -= 1; // left
    else if (player.heading === 3) fx += 1; // right
    if (isWithinBounds(fx, fy)) this.toggleBlock(fx, fy);
  }

  private toggleBlock(x: number, y: number) {
    if (x === SPAWN.x && y === SPAWN.y) return;
    for (const z of LAB_ZONES) {
      if (x === z.homeX && y === z.homeY) return;
    }

    const current = this.mazeGrid[y][x];
    if (current === 2 || current === 4) return;

    const next = current === 1 ? 0 : 1;
    this.mazeGrid[y][x] = next;
    this.logConsole(
      'SYSTEM',
      `Voxel [${x},${y}] ${next === 1 ? 'DEPLOYED' : 'CLEARED'}.`,
      'action'
    );
    this.renderMap();
  }

  private pathfindPlayerTo(tx: number, ty: number) {
    const player = this.getPlayer();
    if (player.gridX === tx && player.gridY === ty) return;

    const queue: { x: number; y: number; path: { x: number; y: number }[] }[] = [
      { x: player.gridX, y: player.gridY, path: [] },
    ];
    const visited = new Set<string>([`${player.gridX},${player.gridY}`]);
    const dirs = [
      { dx: 1, dy: 0 },
      { dx: 0, dy: -1 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
    ];

    let found: { x: number; y: number }[] | null = null;

    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (curr.x === tx && curr.y === ty) {
        found = curr.path;
        break;
      }
      for (const d of dirs) {
        const nx = curr.x + d.dx;
        const ny = curr.y + d.dy;
        const key = `${nx},${ny}`;
        if (
          isWithinBounds(nx, ny) &&
          isWalkable(this.mazeGrid[ny][nx]) &&
          !visited.has(key)
        ) {
          const occupied = this.occupiedTiles(this.activeKey);
          if (occupied.has(key) && !(nx === tx && ny === ty)) continue;
          visited.add(key);
          queue.push({ x: nx, y: ny, path: [...curr.path, { x: nx, y: ny }] });
        }
      }
    }

    if (found && found.length > 0) {
      player.enqueuePath(found);
      player.faceToward(found[0].x, found[0].y);
      player.playIdle();
    } else {
      this.logConsole('SYSTEM', 'Path unreachable across the hall.', 'system');
      this.cameras.main.shake(80, 0.003);
    }
  }

  // ---------------------------------------------------------------------------
  // DOM
  // ---------------------------------------------------------------------------

  setVirtualKey(action: string, down: boolean) {
    if (action in this.virtualKeys) {
      this.virtualKeys[action] = down;
    }
  }

  private setupDOMBindings() {
    // Roster buttons (inside drawer & quick bar)
    document.querySelectorAll('.bot-btn, [data-quick-bot]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const el = e.currentTarget as HTMLElement;
        const botKey = el.getAttribute('data-bot') || el.getAttribute('data-quick-bot');
        if (botKey) this.selectBot(botKey, true);
      });
    });

    // Bottom drawer: pull-tab toggles expanded state
    const drawerTab = document.getElementById('drawer-tab');
    drawerTab?.addEventListener('click', () => {
      document.getElementById('bottom-drawer')?.classList.toggle('open');
    });

    // Bottom drawer: tab switching
    document.querySelectorAll('.drawer-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        document.getElementById('bottom-drawer')?.classList.add('open');
        document.querySelectorAll('.drawer-tab-btn').forEach((b) => {
          b.classList.toggle('active', b === btn);
        });
        document.querySelectorAll('.drawer-panel').forEach((panel) => {
          panel.classList.toggle('active', panel.id === `drawer-panel-${tab}`);
        });
      });
    });

    // Touch controls → virtual keys
    const vkBindings: Record<string, string> = {
      'dpad-up': 'up',
      'dpad-down': 'down',
      'dpad-left': 'left',
      'dpad-right': 'right',
      'btn-a': 'a',
      'btn-b': 'b',
    };
    for (const [id, action] of Object.entries(vkBindings)) {
      const el = document.getElementById(id);
      if (!el) continue;
      const set = (down: boolean) => (e: Event) => {
        e.preventDefault();
        this.setVirtualKey(action, down);
      };
      el.addEventListener('pointerdown', set(true));
      el.addEventListener('pointerup', set(false));
      el.addEventListener('pointerleave', set(false));
      el.addEventListener('pointercancel', set(false));
    }

    // Canvas chrome: pan tool + zoom + fit world + focus player
    document.getElementById('pan-tool-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const on = this.cameraControls?.togglePanMode() ?? false;
      this.logConsole(
        'SYSTEM',
        on
          ? 'Pan tool on — drag the canvas to move camera freely. Press H or Esc to exit.'
          : 'Pan tool off — click the floor to pathfind again.',
        'action'
      );
    });
    document.getElementById('zoom-in-btn')?.addEventListener('click', () => {
      const cam = this.cameras.main;
      this.cameraControls?.zoomAt(cam.width / 2, cam.height / 2, 140);
    });
    document.getElementById('zoom-out-btn')?.addEventListener('click', () => {
      const cam = this.cameras.main;
      this.cameraControls?.zoomAt(cam.width / 2, cam.height / 2, -140);
    });
    document.getElementById('zoom-fit-btn')?.addEventListener('click', () => {
      this.fitWholeWorld();
      this.logConsole('SYSTEM', 'Camera widened to show the full 28×18 Emporium Hall.', 'action');
    });
    document.getElementById('zoom-reset-btn')?.addEventListener('click', () => {
      this.focusOnPlayer();
    });
    document.getElementById('zoom-focus-btn')?.addEventListener('click', () => {
      this.focusOnPlayer();
    });
  }

  private logConsole(name: string, message: string, styleClass: string) {
    const consoleBox = document.getElementById('bot-console');
    if (consoleBox) {
      const line = document.createElement('div');
      line.className = `console-line ${styleClass}`;

      if (styleClass === 'system') {
        line.innerHTML = `<span class="console-name">[SYSTEM]:</span> ${message}`;
      } else if (styleClass === 'action') {
        line.innerHTML = `<span class="console-name">[ACTION]:</span> ${message}`;
      } else {
        const color = BOT_PROFILES[styleClass]?.color || '#fff';
        line.innerHTML = `<span class="console-name" style="color: ${color};">${name}:</span> ${message}`;
      }

      consoleBox.appendChild(line);
      while (consoleBox.children.length > 40) {
        consoleBox.removeChild(consoleBox.firstChild!);
      }
      consoleBox.scrollTop = consoleBox.scrollHeight;
    }

    if (styleClass === 'system') {
      this.showDialog('SYSTEM', '#8a7355', message);
    } else if (styleClass === 'action') {
      this.showDialog('ACTION', '#c4783a', message);
    } else {
      const color = BOT_PROFILES[styleClass]?.color || '#3dbf7a';
      this.showDialog(name, color, message);
    }
  }

  private showDialog(speaker: string, color: string, message: string) {
    const box = document.getElementById('dialog-box');
    const nameEl = document.getElementById('dialog-speaker');
    const textEl = document.getElementById('dialog-text');
    if (!box || !textEl) return;
    box.classList.add('show');
    if (nameEl) {
      nameEl.textContent = speaker;
      nameEl.style.color = color;
    }
    textEl.textContent = message;
  }

  private updatePlayerStatus() {
    const player = this.getPlayer();
    if (
      player.gridX === this.lastStatusPos.x &&
      player.gridY === this.lastStatusPos.y &&
      this.lastStatusPos.x !== -1
    ) {
      return;
    }
    this.lastStatusPos = { x: player.gridX, y: player.gridY };

    const profile = BOT_PROFILES[player.key];
    const dot = document.getElementById('player-status-dot');
    if (dot) dot.style.background = profile.color;
    const nameEl = document.getElementById('player-status-name');
    if (nameEl) {
      nameEl.textContent = profile.name;
      nameEl.style.color = profile.color;
    }
    const zoneEl = document.getElementById('player-status-zone');
    const z = zoneAt(player.gridX, player.gridY);
    if (zoneEl) zoneEl.textContent = z ? z.label : 'Emporium Grand Hall';
  }

  // ═══════════════════════════════════════════════════════════════════
  //  Phase 1 — Guest Welcome: overlay, greeter, idle rescue
  // ═══════════════════════════════════════════════════════════════════

  private setupWelcomeOverlay() {
    const overlay = document.getElementById('welcome-overlay');
    if (!overlay) return;

    const params = new URLSearchParams(window.location.search);
    const botParam = params.get('bot');
    if (botParam && this.bots.has(botParam)) {
      this.selectBot(botParam);
    }
    const skipOverlay = params.get('enter') === '1' || localStorage.getItem('emporium-visited');
    if (skipOverlay) {
      overlay.classList.add('hidden');
      this.welcomeAccepted = true;
      this.greeterPhase = 'done';
      if (params.get('view') === 'fit' || this.cameras.main.width >= 900) {
        this.fitWholeWorld();
      }
      return;
    }

    document.getElementById('welcome-enter')?.addEventListener('click', () => {
      overlay.classList.add('fade-out');
      setTimeout(() => overlay.classList.add('hidden'), 400);
      this.welcomeAccepted = true;
      localStorage.setItem('emporium-visited', '1');
      this.triggerGreeter();
    });

    document.getElementById('welcome-wander')?.addEventListener('click', () => {
      overlay.classList.add('fade-out');
      setTimeout(() => overlay.classList.add('hidden'), 400);
      this.welcomeAccepted = true;
      localStorage.setItem('emporium-visited', '1');
      this.greeterPhase = 'done';
      this.logConsole('SYSTEM', 'Feel free to explore. Tap any tile to walk or click a Sentinel to switch characters.', 'system');
    });

    document.getElementById('choice-tour')?.addEventListener('click', () => {
      document.getElementById('greeter-choices')?.classList.add('hidden');
      this.logConsole('Tether', 'Great! First stop: the Digital Goods Counter in the North-West wing — that\'s Spark\'s corner.', 'tether');
      this.greeterPhase = 'done';
      this.fitWholeWorld();
    });

    document.getElementById('choice-explore')?.addEventListener('click', () => {
      document.getElementById('greeter-choices')?.classList.add('hidden');
      this.logConsole('Tether', 'Find me if you get lost. Use Fit World in the top-right camera bar to see all 6 pavilions.', 'tether');
      this.greeterPhase = 'done';
    });
  }

  private triggerGreeter() {
    this.greeterPhase = 'walking';
    const ying = this.bots.get('ying') || this.bots.get('tether');
    if (!ying) return;

    const greetX = SPAWN.x;
    const greetY = SPAWN.y - 1;

    const queue: { x: number; y: number; path: { x: number; y: number }[] }[] = [
      { x: ying.gridX, y: ying.gridY, path: [] },
    ];
    const visited = new Set<string>([`${ying.gridX},${ying.gridY}`]);
    const dirs = [{ dx: 1, dy: 0 }, { dx: 0, dy: -1 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }];
    let foundPath: { x: number; y: number }[] | null = null;

    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (curr.x === greetX && curr.y === greetY) {
        foundPath = curr.path;
        break;
      }
      for (const d of dirs) {
        const nx = curr.x + d.dx;
        const ny = curr.y + d.dy;
        const key = `${nx},${ny}`;
        if (isWithinBounds(nx, ny) && isWalkable(this.mazeGrid[ny][nx]) && !visited.has(key)) {
          const occupied = this.occupiedTiles(ying.key);
          if (occupied.has(key) && !(nx === greetX && ny === greetY)) continue;
          visited.add(key);
          queue.push({ x: nx, y: ny, path: [...curr.path, { x: nx, y: ny }] });
        }
      }
    }

    if (foundPath && foundPath.length > 0) {
      ying.enqueuePath(foundPath);
      ying.faceToward(foundPath[0].x, foundPath[0].y);

      this.time.delayedCall(foundPath.length * 140 + 400, () => {
        this.greeterPhase = 'greeting';
        ying.showSpeech(
          `Welcome to The Emporium! Six pavilions span this hall — from K8s & Go Blueprints to Digital Goods, gZen, and Developer Tools.`
        );
        this.logConsole(
          BOT_PROFILES[ying.key].name,
          'Welcome to The Emporium! Six pavilions span this hall — explore freely or take a quick overview.',
          ying.key
        );

        const choices = document.getElementById('greeter-choices');
        choices?.classList.remove('hidden');

        this.time.delayedCall(8000, () => {
          if (this.greeterPhase === 'greeting') {
            choices?.classList.add('hidden');
            this.greeterPhase = 'done';
          }
        });
      });
    }
  }

  private idleRescue() {
    const player = this.getPlayer();
    let closest: BotEntity | null = null;
    let bestDist = Infinity;

    this.bots.forEach((bot, key) => {
      if (key === this.activeKey) return;
      const d = bot.distanceTo(player);
      if (d < bestDist && d > 0) {
        bestDist = d;
        closest = bot;
      }
    });

    if (closest && bestDist < 8) {
      const rescueLines = [
        'Still there? Need a hand?',
        'Everything okay? I\'m right here.',
        'Tip: Click "Fit World" in the top-right to see the whole Emporium!',
      ];
      const line = rescueLines[Math.floor(Math.random() * rescueLines.length)] as string;
      (closest as BotEntity).showSpeech(line);
      this.logConsole(
        BOT_PROFILES[(closest as BotEntity).key].name,
        line,
        (closest as BotEntity).key
      );
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  //  Phase 2 — Content Showcase: manifest + zone display
  // ═══════════════════════════════════════════════════════════════════

  private async loadContentManifest() {
    try {
      const res = await fetch('/content-manifest.json');
      if (res.ok) this.contentManifest = await res.json();
    } catch {
      this.contentManifest = null;
    }
  }

  private updatePlayerZone() {
    if (!this.contentManifest) return;
    const player = this.getPlayer();
    const z = zoneAt(player.gridX, player.gridY);
    const panel = document.getElementById('zone-content');
    if (!panel) return;

    if (!z) {
      panel.innerHTML = '<span class="nearby-empty">Step onto any colored pavilion rug to inspect its blueprints, tools, or starter kits.</span>';
      return;
    }

    const zoneData = this.contentManifest.zones[z.id];
    if (!zoneData) {
      panel.innerHTML = '<span class="nearby-empty">Nothing here yet. Keep exploring.</span>';
      return;
    }

    let html = '';
    for (const t of zoneData.teasers) {
      const url = zoneData.link.startsWith('http')
        ? `${zoneData.link}/${t.slug}`.replace(/\/$/, '')
        : `https://divineforge.com${zoneData.link}/${t.slug}`;
      html += `<a href="${url}" target="_blank" class="content-teaser">
        <span class="content-teaser-type">${t.type}</span>
        <span class="content-teaser-title">${t.title}</span>
      </a>`;
    }
    html += `<a href="${zoneData.link}" target="_blank" class="content-zone-link">All ${zoneData.label} →</a>`;
    panel.innerHTML = html;
  }

  // ═══════════════════════════════════════════════════════════════════
  //  Phase 3 — Consultation Intake
  // ═══════════════════════════════════════════════════════════════════

  private setupConsultForm() {
    const form = document.getElementById('consult-form') as HTMLFormElement | null;
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = (document.getElementById('consult-name') as HTMLInputElement).value.trim();
      const email = (document.getElementById('consult-email') as HTMLInputElement).value.trim();
      const brief = (document.getElementById('consult-brief') as HTMLTextAreaElement).value.trim();
      const status = document.getElementById('consult-status');
      const submitBtn = form.querySelector('button') as HTMLButtonElement;

      if (!name || !email) {
        if (status) { status.textContent = 'Name and email are required.'; status.className = 'consult-status error'; status.classList.remove('hidden'); }
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        const res = await fetch('https://www.divineforge.com/api/consult', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, brief, source: 'emporium' }),
        });
        if (res.ok) {
          if (status) { status.textContent = 'Brief sent! We\'ll reply within two working days.'; status.className = 'consult-status success'; status.classList.remove('hidden'); }
          form.reset();
          this.logConsole('SYSTEM', 'Consultation brief sent. Kinetic will review it.', 'action');
        } else {
          throw new Error('Server error');
        }
      } catch {
        if (status) { status.textContent = 'Something went wrong. Email hi@divineforge.com directly.'; status.className = 'consult-status error'; status.className.replace('hidden', ''); status.classList.remove('hidden'); }
      }

      submitBtn.disabled = false;
      submitBtn.textContent = 'Send brief →';
    });
  }
}

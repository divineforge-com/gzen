import Phaser from 'phaser';
import { getDepth, gridToWorld, PIXEL_SHEET, TOPDOWN_CONFIG } from './TopDownConfig';
import { BOT_PROFILES } from './BotState';
import { isWalkable } from './WorldMap';

export type BotMode = 'player' | 'npc';

/**
 * Pokémon-style top-down avatar: 24×24 pixel sprite + name tag + speech.
 * Player-controlled or light AI wander within a home radius.
 *
 * Headings: 0 down (facing camera), 1 up, 2 left, 3 right.
 */
export class BotEntity {
  readonly key: string;
  mode: BotMode;

  gridX: number;
  gridY: number;
  heading: number = 0;

  sprite: Phaser.GameObjects.Sprite;
  nameTag: Phaser.GameObjects.Container;
  private nameText: Phaser.GameObjects.Text;
  private selectionRing: Phaser.GameObjects.Graphics;

  private scene: Phaser.Scene;
  private mazeGrid: number[][];

  isMoving = false;
  private movementQueue: { x: number; y: number }[] = [];

  // NPC wander
  homeX: number;
  homeY: number;
  private nextWanderAt = 0;
  private wanderRadius = 2;

  private speechContainer: Phaser.GameObjects.Container | null = null;

  constructor(
    scene: Phaser.Scene,
    key: string,
    gridX: number,
    gridY: number,
    mode: BotMode,
    mazeGrid: number[][]
  ) {
    this.scene = scene;
    this.key = key;
    this.mode = mode;
    this.gridX = gridX;
    this.gridY = gridY;
    this.homeX = gridX;
    this.homeY = gridY;
    this.mazeGrid = mazeGrid;

    const profile = BOT_PROFILES[key];
    const pos = this.tileCenter(gridX, gridY);

    this.sprite = scene.add.sprite(pos.x, pos.y, `bot-${key}`);
    this.sprite.setOrigin(0.5, 1.0); // feet anchored to tile center
    this.sprite.setDepth(getDepth(gridX, gridY) + 0.5);
    this.sprite.setInteractive({ useHandCursor: true });
    this.sprite.setData('botKey', key);

    // Selection ring under feet (pixel square ring)
    this.selectionRing = scene.add.graphics();
    this.selectionRing.setDepth(getDepth(gridX, gridY) + 0.3);
    this.drawSelectionRing(false);

    // Name tag (pixel font, dark outline)
    this.nameText = scene.add.text(0, 0, profile.name, {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '8px',
      color: '#f8f0d8',
      stroke: '#38281a',
      strokeThickness: 3,
    });
    this.nameText.setOrigin(0.5, 0.5);

    this.nameTag = scene.add.container(pos.x, pos.y - 26, [this.nameText]);
    this.nameTag.setDepth(30000);

    this.playIdle();
  }

  /** Center of the tile the entity stands on, in world px */
  private tileCenter(x = this.gridX, y = this.gridY) {
    const w = gridToWorld(x, y);
    return { x: w.x + TOPDOWN_CONFIG.tileSize / 2, y: w.y + TOPDOWN_CONFIG.tileSize / 2 };
  }

  setMode(mode: BotMode) {
    this.mode = mode;
    this.drawSelectionRing(mode === 'player');
    if (mode === 'player') {
      this.sprite.setScale(1.08);
    } else {
      this.sprite.setScale(1);
    }
  }

  private drawSelectionRing(active: boolean) {
    this.selectionRing.clear();
    const profile = BOT_PROFILES[this.key];
    const color = Phaser.Display.Color.HexStringToColor(profile.color).color;

    if (active) {
      this.selectionRing.lineStyle(2, 0xf8f0d8, 1);
      this.selectionRing.strokeRect(-12, -5, 24, 8);
      this.selectionRing.lineStyle(1, color, 0.9);
      this.selectionRing.strokeRect(-12, -5, 24, 8);
    } else {
      this.selectionRing.lineStyle(1, color, 0.35);
      this.selectionRing.strokeRect(-11, -4, 22, 7);
    }
  }

  private refreshWorldPos() {
    const pos = this.tileCenter();
    this.sprite.setPosition(pos.x, pos.y);
    this.selectionRing.setPosition(pos.x, pos.y);
    this.nameTag.setPosition(pos.x, pos.y - 26);
    this.syncVisualDepth();
    if (this.speechContainer) {
      this.speechContainer.setPosition(pos.x, pos.y - 34);
    }
  }

  private syncVisualDepth() {
    const d = getDepth(this.gridX, this.gridY);
    this.sprite.setDepth(d + 0.5);
    this.selectionRing.setDepth(d + 0.3);
  }

  playIdle() {
    const anim = `bot-${this.key}-idle-${this.heading}`;
    if (this.sprite.anims.currentAnim?.key !== anim) {
      this.sprite.play(anim);
    }
  }

  playWalk() {
    const anim = `bot-${this.key}-walk-${this.heading}`;
    if (this.sprite.anims.currentAnim?.key !== anim) {
      this.sprite.play(anim);
    }
  }

  /** dir: 0 down, 1 up, 2 left, 3 right */
  faceToward(tx: number, ty: number) {
    const dx = tx - this.gridX;
    const dy = ty - this.gridY;
    if (dy === 1) this.heading = 0;
    else if (dy === -1) this.heading = 1;
    else if (dx === -1) this.heading = 2;
    else if (dx === 1) this.heading = 3;
  }

  private applyHeading(dx: number, dy: number) {
    if (dy === 1) this.heading = 0;
    else if (dy === -1) this.heading = 1;
    else if (dx === -1) this.heading = 2;
    else if (dx === 1) this.heading = 3;
  }

  /** Immediate single-step move if walkable */
  tryStep(dx: number, dy: number, onBlocked?: () => void, onMoved?: () => void): boolean {
    if (this.isMoving) return false;
    const tx = this.gridX + dx;
    const ty = this.gridY + dy;
    if (
      ty < 0 ||
      tx < 0 ||
      ty >= this.mazeGrid.length ||
      tx >= this.mazeGrid[0].length ||
      !isWalkable(this.mazeGrid[ty][tx])
    ) {
      onBlocked?.();
      return false;
    }
    this.applyHeading(dx, dy);
    this.moveToTile(tx, ty, onMoved);
    return true;
  }

  enqueuePath(path: { x: number; y: number }[]) {
    this.movementQueue = path;
  }

  clearPath() {
    this.movementQueue = [];
  }

  private moveToTile(tx: number, ty: number, onComplete?: () => void) {
    this.isMoving = true;
    this.playWalk();
    const target = this.tileCenter(tx, ty);
    const depth = getDepth(tx, ty);

    // Face the direction of travel before stepping
    this.applyHeading(tx - this.gridX, ty - this.gridY);

    this.scene.tweens.add({
      targets: this.sprite,
      x: target.x,
      y: target.y,
      duration: TOPDOWN_CONFIG.walkDuration,
      onUpdate: () => {
        this.sprite.setDepth(depth + 0.5);
        this.selectionRing.setPosition(this.sprite.x, this.sprite.y);
        this.selectionRing.setDepth(depth + 0.3);
        this.nameTag.setPosition(this.sprite.x, this.sprite.y - 26);
        if (this.speechContainer) {
          this.speechContainer.setPosition(this.sprite.x, this.sprite.y - 34);
        }
      },
      onComplete: () => {
        this.gridX = tx;
        this.gridY = ty;
        this.isMoving = false;
        this.refreshWorldPos();
        this.playIdle();
        onComplete?.();
      },
    });
  }

  /**
   * Per-frame driver: process path queue; NPCs wander when idle.
   */
  update(time: number, occupied: Set<string>, selfIsPlayer: boolean) {
    if (this.speechContainer) {
      this.speechContainer.setPosition(this.sprite.x, this.sprite.y - 34);
    }

    if (this.isMoving) return;

    if (this.movementQueue.length > 0) {
      const next = this.movementQueue.shift()!;
      this.faceToward(next.x, next.y);
      // Avoid stacking on other bots mid-path
      const occKey = `${next.x},${next.y}`;
      if (occupied.has(occKey)) {
        this.movementQueue.unshift(next);
        return;
      }
      this.moveToTile(next.x, next.y);
      return;
    }

    if (this.mode === 'npc' && time >= this.nextWanderAt) {
      this.scheduleWander(occupied);
      this.nextWanderAt = time + 2200 + Math.random() * 3500;
    }

    if (selfIsPlayer) {
      this.drawSelectionRing(true);
    }
  }

  private scheduleWander(occupied: Set<string>) {
    const dirs = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
      { dx: 0, dy: 0 }, // stay
    ];
    // Shuffle
    for (let i = dirs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
    }

    for (const d of dirs) {
      if (d.dx === 0 && d.dy === 0) return;
      const tx = this.gridX + d.dx;
      const ty = this.gridY + d.dy;
      const dist = Math.abs(tx - this.homeX) + Math.abs(ty - this.homeY);
      if (dist > this.wanderRadius) continue;
      if (
        ty < 0 ||
        tx < 0 ||
        ty >= this.mazeGrid.length ||
        tx >= this.mazeGrid[0].length ||
        !isWalkable(this.mazeGrid[ty][tx])
      )
        continue;
      if (occupied.has(`${tx},${ty}`)) continue;
      this.faceToward(tx, ty);
      this.moveToTile(tx, ty);
      return;
    }
  }

  showSpeech(message: string) {
    if (this.speechContainer) {
      this.speechContainer.destroy();
      this.speechContainer = null;
    }

    const profile = BOT_PROFILES[this.key];
    const bubbleWidth = 180;
    const padding = 10;

    const txt = this.scene.add.text(0, 0, message, {
      fontFamily: 'Nunito, sans-serif',
      fontSize: '11px',
      fontStyle: '700',
      color: '#38281a',
      align: 'center',
      wordWrap: { width: bubbleWidth - padding * 2 },
    });
    txt.setOrigin(0.5, 0.5);

    const bubbleHeight = Math.max(34, txt.height + padding * 2);
    const botColor = Phaser.Display.Color.HexStringToColor(profile.color).color;

    const bg = this.scene.add.graphics();
    bg.fillStyle(0xf8f0d8, 0.97);
    bg.lineStyle(2, botColor, 1);
    const rx = -bubbleWidth / 2;
    const ry = -bubbleHeight - 4;
    bg.fillRoundedRect(rx, ry, bubbleWidth, bubbleHeight, 6);
    bg.strokeRoundedRect(rx, ry, bubbleWidth, bubbleHeight, 6);
    bg.beginPath();
    bg.moveTo(-6, -4);
    bg.lineTo(0, 2);
    bg.lineTo(6, -4);
    bg.closePath();
    bg.fill();
    bg.stroke();

    txt.setPosition(0, ry + bubbleHeight / 2);

    const pos = this.tileCenter();
    this.speechContainer = this.scene.add.container(pos.x, pos.y - 34, [bg, txt]);
    this.speechContainer.setDepth(31000);
    this.speechContainer.setScale(0);
    this.scene.tweens.add({
      targets: this.speechContainer,
      scaleX: 1,
      scaleY: 1,
      duration: 140,
      ease: 'Back.easeOut',
    });
    this.scene.tweens.add({
      targets: this.speechContainer,
      alpha: 0,
      y: '-=10',
      delay: 3600,
      duration: 320,
      onComplete: () => {
        this.speechContainer?.destroy();
        this.speechContainer = null;
      },
    });
  }

  destroy() {
    this.sprite.destroy();
    this.nameTag.destroy();
    this.selectionRing.destroy();
    this.speechContainer?.destroy();
  }

  /** Distance in grid steps (manhattan) */
  distanceTo(other: BotEntity): number {
    return Math.abs(this.gridX - other.gridX) + Math.abs(this.gridY - other.gridY);
  }

  get frameHint() {
    return PIXEL_SHEET.frameIndex(this.heading, 0);
  }
}

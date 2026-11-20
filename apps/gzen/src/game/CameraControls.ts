import Phaser from 'phaser';

export interface CameraControlsOptions {
  minZoom?: number;
  maxZoom?: number;
  /** Multiplicative step per wheel notch / trackpad tick */
  zoomIntensity?: number;
  /** Called when zoom or pan settles — e.g. update UI */
  onViewChange?: (zoom: number) => void;
  /** Called when hand/pan tool is toggled on or off */
  onPanModeChange?: (active: boolean) => void;
}

/**
 * Figma-like canvas navigation for Phaser cameras:
 *  - Wheel / pinch (ctrl+wheel): zoom toward cursor
 *  - Hand tool button, H key, Space/Alt/middle-drag: pan
 *  - +/- keys: zoom in/out toward center
 *  - 0 or Ctrl/Cmd+0: reset view
 */
export class CameraControls {
  private scene: Phaser.Scene;
  private cam: Phaser.Cameras.Scene2D.Camera;

  readonly minZoom: number;
  readonly maxZoom: number;
  private zoomIntensity: number;
  private onViewChange?: (zoom: number) => void;
  private onPanModeChange?: (active: boolean) => void;

  private isPanning = false;
  /** Sticky hand tool (button / H) — left-drag pans until turned off */
  private handToolActive = false;
  private lastX = 0;
  private lastY = 0;
  private spaceDown = false;
  private altDown = false;
  private didPanThisGesture = false;

  /** Suppress next click-as-action after a pan gesture */
  suppressNextClick = false;

  private boundKeyDown: (e: KeyboardEvent) => void;
  private boundKeyUp: (e: KeyboardEvent) => void;
  private boundBlur: () => void;

  constructor(scene: Phaser.Scene, opts: CameraControlsOptions = {}) {
    this.scene = scene;
    this.cam = scene.cameras.main;
    this.minZoom = opts.minZoom ?? 0.35;
    this.maxZoom = opts.maxZoom ?? 2.75;
    this.zoomIntensity = opts.zoomIntensity ?? 0.00135;
    this.onViewChange = opts.onViewChange;
    this.onPanModeChange = opts.onPanModeChange;

    this.boundKeyDown = (e) => this.onDomKeyDown(e);
    this.boundKeyUp = (e) => this.onDomKeyUp(e);
    this.boundBlur = () => {
      this.spaceDown = false;
      this.altDown = false;
      this.endPan();
      this.setCursor();
    };

    this.attach();
  }

  private attach() {
    // Zoom (wheel + trackpad pinch which browsers often emit as ctrl+wheel)
    this.scene.input.on(
      'wheel',
      (
        pointer: Phaser.Input.Pointer,
        _over: unknown,
        _dx: number,
        deltaY: number,
        _dz: number,
        event?: WheelEvent
      ) => {
        // Prefer zoom always on canvas — Figma uses pinch/ctrl for zoom;
        // for a game lab, wheel-to-zoom is the expected default.
        event?.preventDefault?.();
        this.zoomAt(pointer.x, pointer.y, -deltaY);
      }
    );

    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const wantPan =
        pointer.middleButtonDown() ||
        (pointer.leftButtonDown() &&
          (this.handToolActive || this.spaceDown || this.altDown));

      if (wantPan) {
        this.beginPan(pointer);
        // Stop game objects from also receiving this as a click when possible
        pointer.event?.preventDefault?.();
      }
    });

    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!this.isPanning) return;
      const dx = pointer.x - this.lastX;
      const dy = pointer.y - this.lastY;
      if (dx !== 0 || dy !== 0) {
        this.didPanThisGesture = true;
        // Scroll in world space: screen delta / zoom
        this.cam.scrollX -= dx / this.cam.zoom;
        this.cam.scrollY -= dy / this.cam.zoom;
        this.lastX = pointer.x;
        this.lastY = pointer.y;
        this.emitView();
      }
    });

    this.scene.input.on('pointerup', () => this.endPan());
    this.scene.input.on('pointerupoutside', () => this.endPan());

    // Keyboard via DOM so Space/Alt don't fight Phaser key JustDown oddly
    window.addEventListener('keydown', this.boundKeyDown, { passive: false });
    window.addEventListener('keyup', this.boundKeyUp);
    window.addEventListener('blur', this.boundBlur);

    // Prevent browser back/forward on horizontal trackpad over canvas
    const canvas = this.scene.game.canvas;
    canvas.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
      },
      { passive: false }
    );
    canvas.style.touchAction = 'none';
  }

  destroy() {
    window.removeEventListener('keydown', this.boundKeyDown);
    window.removeEventListener('keyup', this.boundKeyUp);
    window.removeEventListener('blur', this.boundBlur);
  }

  private onDomKeyDown(e: KeyboardEvent) {
    // Ignore when typing in inputs
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) {
      return;
    }

    if (e.code === 'Space') {
      e.preventDefault();
      if (!e.repeat) {
        this.spaceDown = true;
        this.setCursor();
      }
      return;
    }
    if (e.key === 'Alt') {
      this.altDown = true;
      this.setCursor();
      return;
    }

    // H = toggle sticky hand / pan tool (Figma-style)
    if ((e.key === 'h' || e.key === 'H') && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      if (!e.repeat) this.togglePanMode();
      return;
    }

    // Escape exits pan mode
    if (e.key === 'Escape' && this.handToolActive) {
      e.preventDefault();
      this.setPanMode(false);
      return;
    }

    const cmd = e.metaKey || e.ctrlKey;

    // Zoom shortcuts
    if (e.key === '=' || e.key === '+' || (cmd && e.key === '=')) {
      e.preventDefault();
      this.zoomAt(this.cam.width / 2, this.cam.height / 2, 120);
      return;
    }
    if (e.key === '-' || e.key === '_' || (cmd && e.key === '-')) {
      e.preventDefault();
      this.zoomAt(this.cam.width / 2, this.cam.height / 2, -120);
      return;
    }
    // Reset view: 0 or Ctrl/Cmd+0
    if (e.key === '0' || (cmd && e.key === '0')) {
      e.preventDefault();
      this.resetView();
      return;
    }
  }

  private onDomKeyUp(e: KeyboardEvent) {
    if (e.code === 'Space') {
      this.spaceDown = false;
      if (!this.isPanning) this.setCursor();
    }
    if (e.key === 'Alt') {
      this.altDown = false;
      if (!this.isPanning) this.setCursor();
    }
  }

  private beginPan(pointer: Phaser.Input.Pointer) {
    this.isPanning = true;
    this.lastX = pointer.x;
    this.lastY = pointer.y;
    this.didPanThisGesture = false;
    this.setCursor(true);
  }

  private endPan() {
    if (!this.isPanning) return;
    if (this.didPanThisGesture) {
      // Swallow the click that would fire after drag
      this.suppressNextClick = true;
    }
    this.isPanning = false;
    this.setCursor();
  }

  /** Returns true if the scene should ignore this pointer as a game click */
  shouldIgnoreClick(pointer?: Phaser.Input.Pointer): boolean {
    if (this.isPanning) return true;
    if (this.handToolActive || this.spaceDown || this.altDown) return true;
    if (pointer?.middleButtonDown() || pointer?.button === 1) return true;
    if (this.suppressNextClick) {
      this.suppressNextClick = false;
      return true;
    }
    return false;
  }

  isSpaceHeld(): boolean {
    return this.spaceDown;
  }

  isActivelyPanning(): boolean {
    return this.isPanning;
  }

  isPanMode(): boolean {
    return this.handToolActive;
  }

  /** Sticky hand tool — left-drag pans without holding Space */
  setPanMode(active: boolean) {
    if (this.handToolActive === active) {
      this.setCursor();
      return;
    }
    this.handToolActive = active;
    this.setCursor();
    this.onPanModeChange?.(active);
  }

  togglePanMode(): boolean {
    this.setPanMode(!this.handToolActive);
    return this.handToolActive;
  }

  /**
   * Zoom keeping the world point under (screenX, screenY) stable.
   * delta > 0 zooms in.
   */
  zoomAt(screenX: number, screenY: number, delta: number) {
    const cam = this.cam;
    const oldZoom = cam.zoom;

    // Smooth exponential zoom
    const factor = Math.exp(delta * this.zoomIntensity);
    const newZoom = Phaser.Math.Clamp(oldZoom * factor, this.minZoom, this.maxZoom);
    if (Math.abs(newZoom - oldZoom) < 0.0001) return;

    // World point under cursor before zoom
    const before = cam.getWorldPoint(screenX, screenY);

    cam.setZoom(newZoom);

    // After zoom, same screen point maps to different world — correct scroll
    const after = cam.getWorldPoint(screenX, screenY);
    cam.scrollX += before.x - after.x;
    cam.scrollY += before.y - after.y;

    this.emitView();
  }

  resetView(originScrollX = 0, originScrollY = 0) {
    this.cam.setZoom(1);
    this.cam.scrollX = originScrollX;
    this.cam.scrollY = originScrollY;
    this.emitView();
  }

  /** Center camera on a world position */
  focusOn(worldX: number, worldY: number, zoom?: number) {
    if (zoom != null) {
      this.cam.setZoom(Phaser.Math.Clamp(zoom, this.minZoom, this.maxZoom));
    }
    this.cam.centerOn(worldX, worldY);
    this.emitView();
  }

  getZoom(): number {
    return this.cam.zoom;
  }

  getZoomPercent(): number {
    return Math.round(this.cam.zoom * 100);
  }

  private emitView() {
    this.onViewChange?.(this.cam.zoom);
  }

  private setCursor(panning = this.isPanning) {
    const canvas = this.scene.game.canvas;
    if (panning) {
      canvas.style.cursor = 'grabbing';
    } else if (this.handToolActive || this.spaceDown || this.altDown) {
      canvas.style.cursor = 'grab';
    } else {
      canvas.style.cursor = 'default';
    }
  }
}

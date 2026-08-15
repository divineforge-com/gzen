# gZen Motion & Teleportation Portal Specification

**Brand Split**: Z · E · N Triad (Zen · Economy · Neural)  
**Target App**: `apps/gzen` (gzen.io landing, Astro 5 static)  
**Design Persona**: UX/UI + Motion Designer (Tesla/xAI-clean minimal + gZen saffron & cream)

---

## 1. anime.js Integration Architecture

### Package & Version Recommendation
- **Installation**:
  ```bash
  npm i animejs
  ```
- **Recommended Version**: `animejs` **v4.5.0** (latest stable release on npm).
  - **Why v4?** Native ES module (ESM) export structure cleanly integrates into Astro 5 client bundling (`import anime from 'animejs'`) without requiring CJS interop helpers or legacy script loaders.
  - **Fallback**: If v3 syntax is preferred by team conventions, `animejs@^3.2.2` works with standard `import anime from 'animejs'`.

### Astro 5 Client Script Integration Pattern
Astro 5 compiles client scripts placed inside component `<script>` tags using Vite into optimized, cache-busted static bundles.
- **Global Portal Controller Pattern**:
  Keep animation logic modular inside `src/scripts/portal-motion.ts` and initialize it from `src/scripts/portal.ts` or `<script>` tags inside `index.astro` / `PathGrid.astro`.

```ts
// src/scripts/portal-motion.ts
import anime from "animejs";

export function initPortalAnimations(): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  // Entrance & interaction timelines initialized here
}
```

- **SSR Safety**: Since Astro 5 renders HTML at build time, all `anime.js` manipulations MUST run client-side inside standard browser DOM events (`DOMContentLoaded`, Astro page lifecycle, or client `<script>` module execution).

---

## 2. Teleportation Entrance Timeline

### Motion Choreography
The entrance sequence unfolds as a synchronized spatial energy wave when stepping onto gZen.io:

```
[0ms] ─────────────────── [200ms] ───────────── [500ms] ───────────── [600ms] ──────────── [900ms] ──── [1600ms]
 Ambient Wash Fade         Hero Z·E·N Unfold    Portal Rings Draw      Cards Stagger Lift    CTA & Glyphs Pulse
 opacity: 0 -> 1           spacing & scale      strokeDashoffset -> 0  translateY & scale    scale: 0.85 -> 1.0
```

| Phase | Target Selector | Property Animated | From -> To | Duration | Easing | Stagger / Delay |
|---|---|---|---|---|---|---|
| **Phase 1** | `.hero-zen-letters span` | `opacity`, `translateY`, `letterSpacing` | `0 -> 1`, `24px -> 0px`, `0.05em -> 0.25em` | 800ms | `cubicBezier(0.16, 1, 0.3, 1)` | `stagger(100ms)`, start @ 200ms |
| **Phase 2** | `.portal-ring-path` | `strokeDashoffset` | `anime.setDashoffset -> 0` | 1000ms | `cubicBezier(0.25, 1, 0.5, 1)` | `stagger(150ms)`, start @ 500ms |
| **Phase 3** | `.portal-card` | `opacity`, `translateY`, `scale` | `0 -> 1`, `40px -> 0px`, `0.95 -> 1.0` | 900ms | `cubicBezier(0.16, 1, 0.3, 1)` | `stagger(120ms)`, start @ 600ms |
| **Phase 4** | `.portal-glyph`, `.teleport-cta` | `opacity`, `scale` | `0 -> 1`, `0.85 -> 1.0` | 600ms | `cubicBezier(0.34, 1.56, 0.64, 1)` (elastic pop) | `stagger(80ms)`, start @ 900ms |

### Implementer Code Blueprint
```ts
import anime from "animejs";

export function playEntranceTimeline() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const tl = anime.timeline({
    easing: "cubicBezier(0.16, 1, 0.3, 1)",
  });

  tl.add({
    targets: ".hero-zen-letters .glyph",
    opacity: [0, 1],
    translateY: [24, 0],
    letterSpacing: ["0.05em", "0.25em"],
    duration: 800,
    delay: anime.stagger(100),
  })
    .add(
      {
        targets: ".portal-ring-path",
        strokeDashoffset: [anime.setDashoffset, 0],
        duration: 1000,
        easing: "cubicBezier(0.25, 1, 0.5, 1)",
        delay: anime.stagger(150),
      },
      "-=600"
    )
    .add(
      {
        targets: ".portal-card",
        opacity: [0, 1],
        translateY: [40, 0],
        scale: [0.95, 1],
        duration: 900,
        delay: anime.stagger(120),
      },
      "-=800"
    )
    .add(
      {
        targets: ".portal-glyph, .teleport-cta",
        opacity: [0, 1],
        scale: [0.85, 1],
        duration: 600,
        delay: anime.stagger(80),
      },
      "-=500"
    );
}
```

---

## 3. Per-Card Hover & Pointer Interactions

Each portal card reacts dynamically to the user's presence with zero spatial clutter:

### A. Portal-Ring Morph (Stroke-Draw & Rotation)
- **Behavior**: On `mouseenter`, the portal's concentric SVG rings spin smoothly, brighten to saffron accent (`var(--accent)`), and thicken.
- **Code Sketch**:
  ```ts
  function bindRingMorph(card: HTMLElement) {
    const ringOuter = card.querySelector(".portal-ring-outer");
    const ringInner = card.querySelector(".portal-ring-inner");

    card.addEventListener("mouseenter", () => {
      anime({
        targets: ringOuter,
        rotate: "+=180deg",
        stroke: "var(--accent)",
        strokeWidth: [1, 2],
        duration: 1200,
        easing: "cubicBezier(0.2, 0.8, 0.2, 1)",
      });
      anime({
        targets: ringInner,
        rotate: "-=90deg",
        opacity: [0.4, 0.85],
        duration: 800,
        easing: "easeOutQuad",
      });
    });
  }
  ```

### B. Magnetic 3D Tilt
- **Behavior**: Cursor position relative to card center computes subtle pitch (`rotateX`) and roll (`rotateY`).
- **Code Sketch**:
  ```ts
  function bindMagneticTilt(card: HTMLElement) {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    card.addEventListener("mousemove", (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      anime({
        targets: card,
        rotateY: x * 12,
        rotateX: -y * 12,
        translateZ: 10,
        duration: 180,
        easing: "easeOutQuad",
      });
    });

    card.addEventListener("mouseleave", () => {
      anime({
        targets: card,
        rotateY: 0,
        rotateX: 0,
        translateZ: 0,
        duration: 600,
        easing: "cubicBezier(0.16, 1, 0.3, 1)",
      });
    });
  }
  ```

### C. Letter Glyph Pulse
- **Behavior**: Prominent card letter (`Z`, `E`, `N`) pulses warmly on card focus.
- **Code Sketch**:
  ```ts
  function pulseGlyph(glyphEl: HTMLElement) {
    anime({
      targets: glyphEl,
      scale: [1, 1.08, 1],
      opacity: [0.85, 1, 0.85],
      duration: 1400,
      easing: "easeInOutSine",
      loop: false,
    });
  }
  ```

### D. Particle / Teleport Dust Drift
- **Behavior**: Concentric dust particles drift slowly toward portal core, accelerating on mouse hover.
- **Code Sketch**:
  ```ts
  function animateDustParticles(container: HTMLElement) {
    anime({
      targets: container.querySelectorAll(".dust-particle"),
      translateY: () => anime.random(-20, -60),
      translateX: () => anime.random(-15, 15),
      scale: [0.4, 1, 0.2],
      opacity: [0, 0.6, 0],
      duration: () => anime.random(2000, 4000),
      delay: anime.stagger(200),
      loop: true,
      easing: "easeInOutQuad",
    });
  }
  ```

---

## 4. Triad Layout & Teleport CTA Behavior

### Layout Architecture
- **Desktop (≥ 900px)**: 3-column horizontal triad grid (`grid-template-columns: repeat(3, 1fr)`). Equal weight cards with monolithic portal aspect ratio (`aspect-ratio: 4 / 5` or `min-height: 440px`).
- **Mobile (< 900px)**: Stacked vertical portals (`grid-template-columns: 1fr`). Clean horizontal row cards with portal ring left, Z/E/N title center, arrow right.

### Teleport CTA Step-Through Metaphor
Clicking a portal card or its **Teleport CTA** initiates a seamless spatial step-through prior to location navigation:

1. Intercept navigation (`e.preventDefault()`).
2. Selected portal ring expands to fill view (`scale: 1.6`, `opacity: 0.1`, `duration: 350ms`).
3. Non-selected portals contract into background (`scale: 0.88`, `opacity: 0`, `duration: 250ms`).
4. Window redirects to destination domain (`ki.gzen.io`, `invest.gzen.io`, `learn.gzen.io`) at animation completion.

```ts
function bindTeleportStepThrough(card: HTMLAnchorElement) {
  card.addEventListener("click", (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey) return; // Allow opening in new tab
    e.preventDefault();
    const href = card.href;

    anime.timeline({ easing: "cubicBezier(0.7, 0, 0.84, 0)" })
      .add({
        targets: card,
        scale: 1.5,
        opacity: 0.1,
        duration: 350,
      })
      .add(
        {
          targets: `.portal-card:not([data-path="${card.dataset.path}"])`,
          scale: 0.88,
          opacity: 0,
          duration: 250,
        },
        "-=350"
      )
      .finished.then(() => {
        window.location.href = href;
      });
  });
}
```

---

## 5. Accessibility, Reduced-Motion & Coarse-Pointer Fallbacks

- **Reduced Motion (`prefers-reduced-motion: reduce`)**:
  - All `anime.js` timelines check `window.matchMedia("(prefers-reduced-motion: reduce)").matches` and exit early.
  - Elements render immediately with `opacity: 1`, `transform: none`, and `strokeDashoffset: 0`.
  - Hover states revert to instant CSS transitions (`transition: border-color 0.2s, background-color 0.2s`).
- **Coarse Pointer (Mobile / Touch)**:
  - 3D magnetic tilt is disabled to avoid touch scrolling interference.
  - Ring stroke animations trigger on `:active` tap state instead of continuous hover.

---

## 6. Integration Touchpoints in Existing Codebase

| File | Change Description |
|---|---|
| `src/data/paths.ts` | Re-shape `Path` type to `letter: "Z" \| "E" \| "N"`. Define 3 portal paths:<br>• **Z**: Zen (`om.gzen.io` / `ki.gzen.io`) — Mind-body-soul energy flow<br>• **E**: Economy (`invest.gzen.io`) — Personal economy & capital leverage<br>• **N**: Neural (`learn.gzen.io`) — Neural language & cognitive clarity |
| `src/components/PathCard.astro` | Replace K/I/L/O SVG icon logic with concentric portal ring SVG (`.portal-ring-path`, `.portal-ring-outer`, `.portal-ring-inner`). Add `.portal-glyph`, `.teleport-cta` elements, and `data-path="Z"|"E"|"N"`. |
| `src/components/PathGrid.astro` | Update header copy to **Z · E · N**, change desktop CSS grid to `grid-template-columns: repeat(3, 1fr)`, update keyboard shortcuts hint from `<kbd>K</kbd><kbd>I</kbd><kbd>L</kbd><kbd>O</kbd>` to `<kbd>Z</kbd> <kbd>E</kbd> <kbd>N</kbd>`. |
| `src/scripts/portal.ts` | Update `initKeyboardHint()` to bind keys `Z`, `E`, `N` to highlight and navigate corresponding portal cards. Import and initialize `initPortalAnimations()`. |
| `src/pages/index.astro` | Update hero title to feature Z·E·N brand mark spans for synchronized timeline target selection. |

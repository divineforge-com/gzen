# gZen Motion & Teleportation Architecture (GSAP + Anime.js v4)

**Brand Split**: Z · E · N Triad (Zen · Economy · Neural)  
**Target App**: `apps/gzen` (gzen.io landing, Astro 5 static)  
**Design Language**: Tesla/xAI-clean minimal + gZen saffron & cream  
**Motion Stack**: GSAP 3.15+ (Timelines, quickTo, Inertia, SVG Draw) & Anime.js v4 (Springs & Micro-interactions)

---

## 1. Dual-Engine Motion Architecture

In modern high-performance Astro 5 web apps, combining **GSAP** (GreenSock) and **Anime.js** provides optimal performance and aesthetic quality:

| Role | Engine | Why |
|---|---|---|
| **Timeline Choreography & Intro Sequencing** | **GSAP** (`gsap.timeline()`) | Absolute timeline control, label alignment, nested staggers, and sub-pixel precision. |
| **Magnetic 3D Tilt & Pointer Tracking** | **GSAP** (`gsap.quickTo()`) | Zero garbage collection overhead, continuous 60fps tracking without RAF lag. |
| **SVG Path Drawing & Concentric Ring Spin** | **GSAP** (`gsap.to()`) & CSS | Hardware-accelerated stroke transforms and continuous smooth drift. |
| **Elastic Spring Micro-Interactions** | **Anime.js v4** (`animate`, `spring`) | Compact declarative springs for keyboard shortcuts and toggle switches. |
| **Accessibility Fallback** | `prefers-reduced-motion` | Automatic bypass of transforms with immediate DOM state resolution. |

---

## 2. GSAP Integration Patterns in Astro 5

### Native ESM Import
Astro 5 and Vite cleanly bundle GSAP via native ESM:

```ts
import { gsap } from "gsap";
```

### High-Performance Magnetic 3D Physics (`quickTo`)
Avoid recreating tweens inside continuous `mousemove` event listeners. Instead, create persistent `quickTo` functions:

```ts
function initMagneticCard(card: HTMLElement) {
  const setRotX = gsap.quickTo(card, "rotateX", { duration: 0.35, ease: "power2.out" });
  const setRotY = gsap.quickTo(card, "rotateY", { duration: 0.35, ease: "power2.out" });
  const setZ = gsap.quickTo(card, "z", { duration: 0.35, ease: "power2.out" });

  card.addEventListener("mousemove", (e: MouseEvent) => {
    const rect = card.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const yPct = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    setRotX(-yPct * 4.5);
    setRotY(xPct * 4.5);
    setZ(10);
  });

  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      z: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.7)",
    });
  });
}
```

---

## 3. Teleportation Entrance Sequence

The entrance sequence synchronizes the hero title, Z·E·N portals, and ambient field into an orchestrated wave:

```
[0ms] ───────────────── [150ms] ───────────── [350ms] ───────────── [500ms] ──────────── [850ms]
 Ambient Wash Fade       Hero Wordmark        Portal Headings       Cards Stagger In      Badges & Glows
 opacity: 0 -> 1         y: 30->0, scale: 0.96  opacity: 0 -> 1       y: 40->0, scale: 0.95  scale pop
```

```ts
export function playEntranceChoreography() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.fromTo(
    ".hero .reveal",
    { opacity: 0, y: 28, scale: 0.97 },
    { opacity: 1, y: 0, scale: 1, duration: 0.85, stagger: 0.08 }
  )
  .fromTo(
    ".paths-head .reveal, .paths-head",
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.7 },
    "-=0.5"
  )
  .fromTo(
    ".path",
    { opacity: 0, y: 36, scale: 0.96 },
    { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1 },
    "-=0.4"
  );
}
```

---

## 4. SVG Portal Ring Mechanics

Each portal (Zen, Economy, Neural) features concentric geometric SVG rings that respond dynamically to pointer proximity and focus:

1. **Zen Portal (Enso Circle + Vitality Spark)**:
   - Outer ring spins smoothly on enter (`rotate: "+=180deg"`).
   - Inner spark pulses with warm emerald / forest tone (`#2d6b4f`).

2. **Economy Portal (Capital Geometric Diamond)**:
   - Diamond facet rotates and brightens with saffron gold (`#d97706`).
   - SVG stroke expands from 1.2px to 2.2px.

3. **Neural Portal (Command Signal Network)**:
   - Interconnected node network draws connection rays via `strokeDashoffset`.
   - Indigo accent pulse (`#3b82f6`).

---

## 5. Teleport Navigation Step-Through

Clicking a portal card initiates a cinematic spatial step-through:

```ts
export function bindTeleportStepThrough(card: HTMLAnchorElement) {
  card.addEventListener("click", (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return; // Allow new-tab opening
    e.preventDefault();
    const href = card.href;

    gsap.timeline({
      onComplete: () => {
        window.location.href = href;
      },
    })
    .to(card, {
      scale: 1.04,
      borderColor: "var(--accent)",
      boxShadow: "0 0 40px rgba(235, 120, 39, 0.4)",
      duration: 0.2,
      ease: "power2.out",
    })
    .to(
      ".path:not([data-path='" + card.dataset.path + "'])",
      {
        opacity: 0.2,
        scale: 0.96,
        duration: 0.25,
        ease: "power2.inOut",
      },
      0
    );
  });
}
```

---

## 6. Accessibility & Performance Directives

1. **Reduced Motion**: If `prefers-reduced-motion: reduce` is active, completely skip GSAP/Anime timelines and set opacity/transforms to neutral immediately.
2. **Coarse Pointer**: Disable 3D tilt tracking on mobile/touch screens (`@media (pointer: coarse)`) to preserve native fluid touch scrolling.
3. **GPU Layering**: Animate exclusively `transform` (`x`, `y`, `z`, `rotate`, `scale`) and `opacity`. Never animate `top`, `left`, `margin`, or `width`/`height`.
4. **Cleanup & Garbage Collection**: Reuse tween instances or clear timers to ensure zero memory accumulation across long SPA sessions.

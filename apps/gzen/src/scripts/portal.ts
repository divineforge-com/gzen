import { gsap } from "gsap";
import { animate } from "animejs";
import { ANIMATION_SEEDS } from "../data/animation-seeds";

/**
 * gZen Kinetic Motion & Teleportation Engine
 * Dual-Engine Synergy: GSAP 3.15+ (Timelines, quickTo, Inertia) + Anime.js v4 (Elastic Springs)
 *
 * Design Language: Tesla/xAI ultra-clean minimalism + gZen saffron & cool monastery tones.
 */

const STORAGE_KEY = "gzen-theme";
type ThemeId = "monastery" | "ignite";

const THEME_COLORS: Record<ThemeId, string> = {
  monastery: "#0c0d0e",
  ignite: "#120e0a",
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(pointer: coarse)").matches;

function currentTheme(): ThemeId {
  const root = document.documentElement;
  const theme = root.getAttribute("data-theme") as ThemeId | null;
  return theme === "ignite" ? "ignite" : "monastery";
}

function applyTheme(theme: ThemeId) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Non-blocking storage fallback
  }

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", THEME_COLORS[theme]);
  }

  // Micro-interaction on theme toggle knob
  const knob = document.querySelector<HTMLElement>(".theme-toggle .knob");
  if (knob && !reduceMotion) {
    gsap.fromTo(
      knob,
      { scale: 0.82 },
      { scale: 1, duration: 0.35, ease: "back.out(2)" }
    );
  }
}

function initThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    applyTheme(currentTheme() === "monastery" ? "ignite" : "monastery");
  });
}

/**
 * 1. Intro Stagger Choreography (GSAP Timeline)
 */
function initIntroChoreography() {
  if (reduceMotion) {
    gsap.set(".reveal, .hero-flow, .path, .foot, .geo-stage, .geo-readouts", { opacity: 1, y: 0, scale: 1 });
    return;
  }

  const tl = gsap.timeline({
    defaults: {
      ease: ANIMATION_SEEDS.easings.smoothEntrance.gsap,
    },
  });

  // Kinetic Geometric Stage & Ambient Core reveal
  tl.fromTo(
    "#geoStage",
    { opacity: 0, scale: 0.72, rotate: -18 },
    { opacity: 0.82, scale: 1, rotate: 0, duration: 1.35, ease: "power2.out" }
  )
    .fromTo(
      ".geo-readouts",
      { opacity: 0 },
      { opacity: 0.45, duration: 1.1, ease: "power2.out" },
      "-=1.0"
    )
    // Hero ambient glow entrance
    .fromTo(
      ".hero-flow",
      { opacity: 0, scale: 0.75 },
      { opacity: 0.85, scale: 1, duration: 1.2, ease: "power2.out" },
      "-=0.9"
    )
    .fromTo(
      [
        ".hero .eyebrow",
        ".hero .wordmark",
        ".hero .hook",
        ".hero .subhead",
        ".hero .theme-line",
        ".hero .cta-row",
      ],
      { opacity: 0, y: 26, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: ANIMATION_SEEDS.timings.introDuration,
        stagger: ANIMATION_SEEDS.timings.introStagger,
      },
      "-=0.9"
    )
    // Section header & portal cards reveal
    .fromTo(
      ".paths-head",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7 },
      "-=0.5"
    )
    .fromTo(
      ".path",
      { opacity: 0, y: 32, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.75,
        stagger: 0.09,
      },
      "-=0.4"
    )
    .fromTo(
      ".foot",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6 },
      "-=0.3"
    );
}

/**
 * 2. High-Performance 3D Kinetic Tilt & Magnetic Specular Illumination (GSAP quickTo)
 */
function initKineticCards() {
  if (reduceMotion || isTouch) return;

  const cards = Array.from(document.querySelectorAll<HTMLAnchorElement>(".path"));

  cards.forEach((card) => {
    // Pre-allocate quickTo setters for 60fps GC-free tracking
    const setRotX = gsap.quickTo(card, "rotateX", {
      duration: ANIMATION_SEEDS.timings.tiltInertia,
      ease: "power2.out",
    });
    const setRotY = gsap.quickTo(card, "rotateY", {
      duration: ANIMATION_SEEDS.timings.tiltInertia,
      ease: "power2.out",
    });
    const setZ = gsap.quickTo(card, "z", {
      duration: ANIMATION_SEEDS.timings.tiltInertia,
      ease: "power2.out",
    });
    const setScale = gsap.quickTo(card, "scale", {
      duration: 0.3,
      ease: "power2.out",
    });

    let bounds: DOMRect | null = null;
    const svgZ = card.querySelector<SVGCircleElement>(".portal-svg-z .ring-outer");
    const svgE = card.querySelector<SVGPathElement>(".portal-svg-e .diamond-head");
    const svgN = card.querySelectorAll<SVGCircleElement>(".portal-svg-n circle");

    const onEnter = () => {
      bounds = card.getBoundingClientRect();
      setScale(ANIMATION_SEEDS.timings.hoverScale);

      // Micro-animations on portal SVG glyphs
      if (svgZ) {
        gsap.to(svgZ, { rotation: "+=120", transformOrigin: "20px 20px", duration: 1.0, ease: "power2.out" });
      }
      if (svgE) {
        gsap.to(svgE, { y: -2, duration: 0.35, ease: "back.out(2)" });
      }
      if (svgN.length) {
        gsap.to(svgN, { scale: 1.25, transformOrigin: "center", duration: 0.3, stagger: 0.05, ease: "back.out(2)" });
      }
    };

    const onMove = (e: MouseEvent) => {
      if (!bounds) bounds = card.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;
      const xPct = (x / bounds.width - 0.5) * 2;
      const yPct = (y / bounds.height - 0.5) * 2;

      const rotX = -yPct * ANIMATION_SEEDS.spatialTilt.maxPitchDeg;
      const rotY = xPct * ANIMATION_SEEDS.spatialTilt.maxRollDeg;

      setRotX(rotX);
      setRotY(rotY);
      setZ(ANIMATION_SEEDS.spatialTilt.elevationPx);

      // Smoothly project specular radial sheen
      card.style.setProperty("--mx", `${((x / bounds.width) * 100).toFixed(1)}%`);
      card.style.setProperty("--my", `${((y / bounds.height) * 100).toFixed(1)}%`);
    };

    const onLeave = () => {
      bounds = null;
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        z: 0,
        scale: 1,
        duration: 0.65,
        ease: ANIMATION_SEEDS.easings.magneticReturn.gsap,
      });

      card.style.removeProperty("--mx");
      card.style.removeProperty("--my");

      // Reset SVG glyph transforms
      if (svgE) {
        gsap.to(svgE, { y: 0, duration: 0.4, ease: "power2.out" });
      }
      if (svgN.length) {
        gsap.to(svgN, { scale: 1, duration: 0.3, ease: "power2.out" });
      }
    };

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
  });
}

/**
 * 3. Cinematic Teleportation Step-Through Transition
 */
function initTeleportation() {
  const cards = Array.from(document.querySelectorAll<HTMLAnchorElement>(".path"));
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener("click", (e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // Permit opening new tabs
      e.preventDefault();
      const href = card.href;

      if (reduceMotion) {
        window.location.href = href;
        return;
      }
      const otherCards = cards.filter((c) => c !== card);
      const tl = gsap.timeline({
        onComplete: () => {
          window.location.href = href;
        },
      });

      tl.to(card, {
        scale: 1.035,
        borderColor: "var(--accent)",
        boxShadow: "0 0 45px rgba(235, 120, 39, 0.4)",
        duration: 0.25,
        ease: "power2.out",
      }).to(
        otherCards,
        {
          opacity: 0.2,
          scale: 0.96,
          duration: 0.22,
          ease: "power2.inOut",
        },
        0
      );
    });
  });
}

/**
 * 4. Multi-Layer Scroll Parallax (GSAP Ticker Lerp)
 */
function initScrollParallax() {
  if (reduceMotion) return;

  const heroFlow = document.querySelector<HTMLElement>(".hero-flow");
  const wordmark = document.querySelector<HTMLElement>(".wordmark");
  const starfield = document.querySelector<HTMLElement>(".starfield");
  const pathsGrid = document.querySelector<HTMLElement>(".paths .grid");

  let targetScrollY = 0;
  let currentScrollY = 0;

  window.addEventListener(
    "scroll",
    () => {
      targetScrollY = window.scrollY;
    },
    { passive: true }
  );

  gsap.ticker.add(() => {
    // Silky lerp for sub-pixel motion
    currentScrollY += (targetScrollY - currentScrollY) * 0.12;

    if (heroFlow) {
      heroFlow.style.transform = `translate(-50%, calc(-50% + ${currentScrollY * 0.28}px)) scale(${
        1 + (currentScrollY / 1200) * 0.15
      })`;
    }

    if (wordmark) {
      wordmark.style.transform = `translate3d(0, ${currentScrollY * 0.12}px, 0)`;
      wordmark.style.opacity = `${Math.max(0.12, 1 - currentScrollY / 500)}`;
    }

    if (starfield) {
      starfield.style.transform = `translate3d(0, ${-currentScrollY * 0.06}px, 0)`;
    }

    if (pathsGrid && currentScrollY > 20) {
      pathsGrid.style.transform = `translate3d(0, ${Math.min(12, currentScrollY * 0.02)}px, 0)`;
    }
  });
}

/**
 * 5. Kinetic Sacred & Coordinate Geometry Engine (Scroll & Parallax Driven)
 */
function initGeometricField() {
  const geoStage = document.getElementById("geoStage");
  const geoOuterDial = document.getElementById("geoOuterDial");
  const geoPolyhedra = document.getElementById("geoPolyhedra");
  const geoEnsoPath = document.getElementById("geoEnsoPath");
  const geoHexA = document.querySelector<SVGPolygonElement>(".geo-hex-a");
  const geoHexB = document.querySelector<SVGPolygonElement>(".geo-hex-b");
  const geoTelemetryX = document.querySelector<HTMLElement>(".geo-telemetry-x");
  const geoVertices = document.getElementById("geoVertices");

  if (!geoStage || !geoOuterDial || !geoPolyhedra) return;

  if (reduceMotion) {
    gsap.set(geoStage, { opacity: 0.8 });
    return;
  }

  const cfg = ANIMATION_SEEDS.geometricField;

  // 3D Perspective Mouse Tilt (GC-Free quickTo setters)
  let setStageRotX: ((v: number) => void) | null = null;
  let setStageRotY: ((v: number) => void) | null = null;
  let setStageX: ((v: number) => void) | null = null;
  let setStageY: ((v: number) => void) | null = null;

  if (!isTouch) {
    setStageRotX = gsap.quickTo(geoStage, "rotateX", {
      duration: cfg.tiltInertia,
      ease: "power2.out",
    });
    setStageRotY = gsap.quickTo(geoStage, "rotateY", {
      duration: cfg.tiltInertia,
      ease: "power2.out",
    });
    setStageX = gsap.quickTo(geoStage, "x", {
      duration: cfg.tiltInertia,
      ease: "power2.out",
    });
    setStageY = gsap.quickTo(geoStage, "y", {
      duration: cfg.tiltInertia,
      ease: "power2.out",
    });

    window.addEventListener(
      "pointermove",
      (e) => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;

        if (setStageRotX) setStageRotX(-ny * cfg.perspectiveMaxPitchDeg);
        if (setStageRotY) setStageRotY(nx * cfg.perspectiveMaxRollDeg);
        if (setStageX) setStageX(nx * 18);
        if (setStageY) setStageY(ny * 14);
      },
      { passive: true }
    );
  }

  // Scroll-Driven Kinetic Evolution Loop
  let baseDialAngle = 0;
  let basePolyAngle = 0;
  let targetScrollY = 0;
  let smoothScrollY = 0;

  window.addEventListener(
    "scroll",
    () => {
      targetScrollY = window.scrollY;
    },
    { passive: true }
  );

  gsap.ticker.add(() => {
    // Increment ambient idle rotation
    baseDialAngle = (baseDialAngle + cfg.rotationSpeedIdle) % 360;
    basePolyAngle = (basePolyAngle + cfg.counterRotationSpeedIdle) % 360;

    // Smooth scroll position lerp
    smoothScrollY += (targetScrollY - smoothScrollY) * 0.12;

    // 1. Dial & Polyhedra Counter-Rotations
    const dialAngle = baseDialAngle + smoothScrollY * cfg.scrollRotationFactor;
    const polyAngle = basePolyAngle + smoothScrollY * cfg.scrollCounterFactor;

    geoOuterDial.style.transform = `rotate(${dialAngle.toFixed(2)}deg)`;
    geoPolyhedra.style.transform = `rotate(${polyAngle.toFixed(2)}deg)`;

    // 2. Hexagram Harmonic Sub-Rotations
    if (geoHexA) {
      geoHexA.style.transform = `rotate(${(smoothScrollY * 0.15).toFixed(2)}deg)`;
      geoHexA.style.transformOrigin = "400px 400px";
    }
    if (geoHexB) {
      geoHexB.style.transform = `rotate(${(-smoothScrollY * 0.22).toFixed(2)}deg)`;
      geoHexB.style.transformOrigin = "400px 400px";
    }

    // 3. Stage Vertical Parallax & Dynamic Expansion
    const stageY = smoothScrollY * 0.38;
    const stageScale = 1 + Math.min(0.28, (smoothScrollY / 700) * cfg.scrollScaleFactor);
    geoStage.style.transform = `translate(-50%, calc(-50% + ${stageY.toFixed(1)}px)) scale(${stageScale.toFixed(3)})`;

    // 4. Enso SVG Dynamic Stroke Unfold
    if (geoEnsoPath) {
      const unfoldOffset = Math.max(0, cfg.ensoDashUnfoldLength - smoothScrollY * 1.35);
      geoEnsoPath.style.strokeDashoffset = `${unfoldOffset.toFixed(1)}`;
    }

    // 5. Telemetry Axis Translation
    if (geoTelemetryX) {
      const axisOffset = smoothScrollY * 0.25;
      geoTelemetryX.style.transform = `translateY(${axisOffset.toFixed(1)}px)`;
    }

    // 6. Harmonic Vertices Constellation Pulse
    if (geoVertices) {
      const vertexOpacity = Math.min(1, 0.65 + Math.sin(smoothScrollY * 0.01 + baseDialAngle * 0.05) * 0.35);
      geoVertices.style.opacity = `${vertexOpacity.toFixed(2)}`;
    }
  });
}
/**
 * 6. Ambient Cursor Glow with Smooth Lerp
 */
function initAmbientPointer() {
  if (reduceMotion || isTouch) return;

  const shell = document.getElementById("shell");
  if (!shell) return;

  let targetX = 0.5;
  let targetY = 0.3;
  let currentX = 0.5;
  let currentY = 0.3;

  window.addEventListener(
    "pointermove",
    (e) => {
      targetX = e.clientX / window.innerWidth;
      targetY = e.clientY / window.innerHeight;
    },
    { passive: true }
  );

  gsap.ticker.add(() => {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    shell.style.setProperty("--px", `${(currentX * 100).toFixed(2)}%`);
    shell.style.setProperty("--py", `${(currentY * 100).toFixed(2)}%`);
  });
}

/**
 * 7. Z · E · N Keyboard Teleportation (Anime.js Spring Pop)
 */
function initKeyboardHint() {
  const pathEls = Array.from(document.querySelectorAll<HTMLAnchorElement>(".path"));
  if (!pathEls.length) return;

  window.addEventListener("keydown", (e) => {
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) {
      return;
    }

    const key = e.key.toUpperCase();
    if (!["Z", "E", "N"].includes(key)) return;

    const path = pathEls.find((d) => d.dataset.path === key);
    if (path) {
      e.preventDefault();
      path.focus();

      if (reduceMotion) {
        if (path.href) window.location.href = path.href;
        return;
      }

      // Snappy elastic spring pop
      animate(path, {
        scale: [0.95, 1.035, 1],
        duration: 380,
        ease: "outBack(2)",
      });

      path.classList.add("path-key-flash");
      window.setTimeout(() => {
        path.classList.remove("path-key-flash");
        if (path.href) {
          window.location.href = path.href;
        }
      }, 340);
    }
  });
}

// Lifecycle Initializations
initThemeToggle();
initIntroChoreography();
initKineticCards();
initTeleportation();
initScrollParallax();
initGeometricField();
initAmbientPointer();
initKeyboardHint();

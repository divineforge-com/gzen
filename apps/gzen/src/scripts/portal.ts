import { gsap } from "gsap";
import { animate } from "animejs";
import { ANIMATION_SEEDS } from "../data/animation-seeds";

/**
 * gZen Tri-Elemental Kinetic Motion & Practice Ignition Engine
 * Dual-Engine Stack: GSAP 3.15+ (Timelines, quickTo, Inertia, Parallax) + Anime.js v4 (Elastic Springs)
 *
 * Design Language: Tesla/xAI ultra-clean minimalism + Tri-Elemental Sovereignty (Water · Earth · Fire).
 */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(pointer: coarse)").matches;

/**
 * 1. Intro Stagger Choreography (GSAP Timeline)
 */
function initIntroChoreography() {
  if (reduceMotion) {
    gsap.set(".reveal, .hero-flow, .element-card, .foot, #geoStage, .geo-readouts", {
      opacity: 1,
      y: 0,
      scale: 1,
    });
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
    { opacity: 0.85, scale: 1, rotate: 0, duration: 1.35, ease: "power2.out" }
  )
    .fromTo(
      ".geo-readouts",
      { opacity: 0 },
      { opacity: 0.5, duration: 1.1, ease: "power2.out" },
      "-=1.0"
    )
    // Hero ambient elemental aura entrance
    .fromTo(
      ".hero-flow",
      { opacity: 0, scale: 0.75 },
      { opacity: 0.9, scale: 1, duration: 1.2, ease: "power2.out" },
      "-=0.9"
    )
    .fromTo(
      [
        ".hero .eyebrow",
        ".hero .wordmark",
        ".hero .hook",
        ".hero .subhead",
        ".hero .element-trinity-row",
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
    // Elements section header & element cards reveal
    .fromTo(
      ".elements-head",
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.7 },
      "-=0.5"
    )
    .fromTo(
      ".element-card",
      { opacity: 0, y: 36, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.75,
        stagger: 0.1,
      },
      "-=0.4"
    )
    .fromTo(
      ".foot",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6 },
      "-=0.3"
    );
}

/**
 * 2. Scroll-Triggered In-Card Centerpiece Activation
 * Unspools outer dials and scales inner geometry as each card scrolls into the focal viewport
 */
function initScrollTriggeredCenterpieces() {
  if (reduceMotion) return;

  const cards = Array.from(document.querySelectorAll<HTMLElement>(".element-card"));
  if (!cards.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const card = entry.target as HTMLElement;
        const letter = card.dataset.element;
        const svg = card.querySelector<SVGSVGElement>(".geo-svg");
        if (!svg) return;

        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
          // Card entered focal zone
          const dial = svg.querySelector<SVGElement>(".geo-dial");
          const polyGroup = svg.querySelector<SVGElement>(
            ".geo-triangle-group, .geo-octahedron-group, .geo-neural-constellation"
          );
          const nodes = svg.querySelectorAll<SVGElement>(".geo-node");
          const enso = svg.querySelector<SVGPathElement>(".geo-enso-path");

          if (dial) {
            gsap.to(dial, {
              rotation: "+=60",
              transformOrigin: "100px 100px",
              duration: 1.4,
              ease: "power2.out",
            });
          }

          if (polyGroup) {
            gsap.fromTo(
              polyGroup,
              { scale: 0.92, transformOrigin: "100px 100px" },
              { scale: 1.04, duration: 0.8, ease: "back.out(1.5)" }
            );
          }

          if (nodes.length) {
            gsap.fromTo(
              nodes,
              { scale: 0.6, transformOrigin: "center" },
              { scale: 1.25, duration: 0.5, stagger: 0.05, ease: "back.out(2)" }
            );
          }

          if (enso && letter === "Z") {
            gsap.fromTo(
              enso,
              { strokeDashoffset: 120 },
              { strokeDashoffset: 0, duration: 1.2, ease: "power2.out" }
            );
          }
        }
      });
    },
    {
      threshold: [0.25, 0.5, 0.75],
      rootMargin: "-40px 0px -40px 0px",
    }
  );

  cards.forEach((card) => observer.observe(card));
}

/**
 * 3. High-Performance 3D Kinetic Tilt & Mobile Touch Gesture Engine
 * Desktop: 60fps GC-Free Magnetic 3D Physics (gsap.quickTo)
 * Mobile: Tactile Touch Compression, Specular Finger Glow, Elastic Swipe Snap, and Haptic Feedback
 */
function initKineticCards() {
  if (reduceMotion) return;

  const cards = Array.from(document.querySelectorAll<HTMLAnchorElement>(".element-card"));
  if (!cards.length) return;

  cards.forEach((card) => {
    const letter = card.dataset.element;
    const svg = card.querySelector<SVGSVGElement>(".geo-svg");
    const ambientDisc = card.querySelector<SVGCircleElement>(".geo-ambient-disc");
    const dial = card.querySelector<SVGElement>(".geo-dial");
    const polyGroup = card.querySelector<SVGElement>(
      ".geo-triangle-group, .geo-octahedron-group, .geo-neural-constellation"
    );
    const centerPulse = card.querySelector<SVGElement>(".geo-center-pulse");

    const triggerGlyphEnter = () => {
      if (dial) {
        gsap.to(dial, {
          rotation: "+=90",
          transformOrigin: "100px 100px",
          duration: 1.2,
          ease: "power2.out",
        });
      }
      if (polyGroup) {
        gsap.to(polyGroup, {
          scale: 1.08,
          transformOrigin: "100px 100px",
          duration: 0.35,
          ease: "back.out(1.8)",
        });
      }
      if (ambientDisc) {
        gsap.to(ambientDisc, { r: 88, duration: 0.4, ease: "power2.out" });
      }
      if (centerPulse) {
        gsap.to(centerPulse, { scale: 1.4, transformOrigin: "100px 100px", duration: 0.4, ease: "back.out(2)" });
      }
    };

    const resetGlyphs = () => {
      if (polyGroup) {
        gsap.to(polyGroup, {
          scale: 1,
          transformOrigin: "100px 100px",
          duration: 0.45,
          ease: "power2.out",
        });
      }
      if (ambientDisc) {
        gsap.to(ambientDisc, { r: 75, duration: 0.45, ease: "power2.out" });
      }
      if (centerPulse) {
        gsap.to(centerPulse, { scale: 1, transformOrigin: "100px 100px", duration: 0.4, ease: "power2.out" });
      }
    };

    if (!isTouch) {
      // Desktop 3D Magnetic Parallax Tracking
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

      card.addEventListener("mouseenter", () => {
        bounds = card.getBoundingClientRect();
        setScale(ANIMATION_SEEDS.timings.hoverScale);
        triggerGlyphEnter();
      });

      card.addEventListener("mousemove", (e: MouseEvent) => {
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

        card.style.setProperty("--mx", `${((x / bounds.width) * 100).toFixed(1)}%`);
        card.style.setProperty("--my", `${((y / bounds.height) * 100).toFixed(1)}%`);
      });

      card.addEventListener("mouseleave", () => {
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
        resetGlyphs();
      });
    } else {
      // Mobile Touch Gestures & Tactile Compression
      let touchStartX = 0;
      let touchStartY = 0;
      let bounds: DOMRect | null = null;
      let isTouching = false;

      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length !== 1) return;
        const touch = e.touches[0];
        bounds = card.getBoundingClientRect();
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        isTouching = true;

        card.classList.add("is-touching");

        // Micro haptic pulse on mobile touch
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          try {
            navigator.vibrate(ANIMATION_SEEDS.mobileGestures.hapticPulseDurationMs);
          } catch {
            // Non-blocking haptic fallback
          }
        }

        // Tactile compression
        gsap.to(card, {
          scale: ANIMATION_SEEDS.mobileGestures.touchCompressionScale,
          duration: 0.12,
          ease: "power2.out",
        });

        const x = touch.clientX - bounds.left;
        const y = touch.clientY - bounds.top;
        card.style.setProperty("--mx", `${((x / bounds.width) * 100).toFixed(1)}%`);
        card.style.setProperty("--my", `${((y / bounds.height) * 100).toFixed(1)}%`);

        triggerGlyphEnter();
      };

      const onTouchMove = (e: TouchEvent) => {
        if (!isTouching || !bounds || e.touches.length !== 1) return;
        const touch = e.touches[0];
        const dx = touch.clientX - touchStartX;
        const dy = touch.clientY - touchStartY;

        // Update dynamic specular finger highlight
        const x = touch.clientX - bounds.left;
        const y = touch.clientY - bounds.top;
        card.style.setProperty("--mx", `${((x / bounds.width) * 100).toFixed(1)}%`);
        card.style.setProperty("--my", `${((y / bounds.height) * 100).toFixed(1)}%`);

        // Horizontal swipe micro-deflection
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 6) {
          const maxDisp = ANIMATION_SEEDS.mobileGestures.maxSwipeDisplacementPx;
          const clampedX = Math.sign(dx) * Math.min(maxDisp, Math.abs(dx) * 0.28);
          gsap.set(card, { x: clampedX });
        }
      };

      const onTouchEnd = () => {
        if (!isTouching) return;
        isTouching = false;
        bounds = null;
        card.classList.remove("is-touching");

        // Elastic spring-damper snap return
        gsap.to(card, {
          scale: 1,
          x: 0,
          duration: 0.48,
          ease: ANIMATION_SEEDS.mobileGestures.touchReturnSpring,
        });

        window.setTimeout(() => {
          if (!isTouching) {
            card.style.removeProperty("--mx");
            card.style.removeProperty("--my");
          }
        }, 250);

        resetGlyphs();
      };

      card.addEventListener("touchstart", onTouchStart, { passive: true });
      card.addEventListener("touchmove", onTouchMove, { passive: true });
      card.addEventListener("touchend", onTouchEnd, { passive: true });
      card.addEventListener("touchcancel", onTouchEnd, { passive: true });
    }
  });
}

/**
 * 4. Cinematic Teleportation Step-Through Transition with Mobile Haptics
 */
function initTeleportation() {
  const cards = Array.from(document.querySelectorAll<HTMLAnchorElement>(".element-card"));
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener("click", (e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // Permit opening new tabs
      e.preventDefault();
      const href = card.href;

      // Multi-pulse teleportation haptic on mobile
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate([12, 35, 18]);
        } catch {
          // Non-blocking
        }
      }

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
        borderColor: "var(--element-tone)",
        boxShadow: "0 0 45px rgba(34, 211, 238, 0.4)",
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
 * 5. Multi-Layer Scroll Parallax (GSAP Ticker Lerp)
 */
function initScrollParallax() {
  if (reduceMotion) return;

  const heroFlow = document.querySelector<HTMLElement>(".hero-flow");
  const wordmark = document.querySelector<HTMLElement>(".wordmark");
  const starfield = document.querySelector<HTMLElement>(".starfield");
  const elementsGrid = document.querySelector<HTMLElement>(".elements-section .grid");

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
      wordmark.style.opacity = `${Math.max(0.15, 1 - currentScrollY / 550)}`;
    }

    if (starfield) {
      starfield.style.transform = `translate3d(0, ${-currentScrollY * 0.06}px, 0)`;
    }

    if (elementsGrid && currentScrollY > 20) {
      elementsGrid.style.transform = `translate3d(0, ${Math.min(12, currentScrollY * 0.02)}px, 0)`;
    }
  });
}

/**
 * 6. Kinetic Sacred & Coordinate Geometry Engine (Scroll & Parallax Driven)
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
 * 7. Ambient Cursor Glow with Smooth Lerp
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
 * 8. Mobile Device Orientation (Gyroscope Parallax)
 */
function initDeviceOrientationParallax() {
  if (reduceMotion || typeof window === "undefined" || !("DeviceOrientationEvent" in window)) return;

  const geoStage = document.getElementById("geoStage");
  if (!geoStage) return;

  const cfg = ANIMATION_SEEDS.mobileGestures;
  let targetRoll = 0;
  let targetPitch = 0;
  let currentRoll = 0;
  let currentPitch = 0;

  const handleOrientation = (e: DeviceOrientationEvent) => {
    if (e.gamma === null || e.beta === null) return;
    const normRoll = Math.max(-1, Math.min(1, e.gamma / 25));
    const normPitch = Math.max(-1, Math.min(1, (e.beta - 38) / 25));

    targetRoll = normRoll * cfg.gyroMaxRollDeg;
    targetPitch = normPitch * cfg.gyroMaxPitchDeg;
  };

  window.addEventListener("deviceorientation", handleOrientation, { passive: true });

  gsap.ticker.add(() => {
    currentRoll += (targetRoll - currentRoll) * 0.08;
    currentPitch += (targetPitch - currentPitch) * 0.08;

    if (Math.abs(currentRoll) > 0.05 || Math.abs(currentPitch) > 0.05) {
      geoStage.style.setProperty("--gyro-rot-x", `${(-currentPitch).toFixed(2)}deg`);
      geoStage.style.setProperty("--gyro-rot-y", `${currentRoll.toFixed(2)}deg`);
    }
  });
}

/**
 * 9. Z · E · N Keyboard Teleportation (Anime.js Spring Pop)
 */
function initKeyboardHint() {
  const cardEls = Array.from(document.querySelectorAll<HTMLAnchorElement>(".element-card"));
  if (!cardEls.length) return;

  window.addEventListener("keydown", (e) => {
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) {
      return;
    }

    const key = e.key.toUpperCase();
    if (!["Z", "E", "N"].includes(key)) return;

    const card = cardEls.find((d) => d.dataset.element === key);
    if (card) {
      e.preventDefault();
      card.focus();

      if (reduceMotion) {
        if (card.href) window.location.href = card.href;
        return;
      }

      // Snappy elastic spring pop
      animate(card, {
        scale: [0.95, 1.04, 1],
        duration: 380,
        ease: "outBack(2)",
      });

      card.classList.add("element-key-flash");
      window.setTimeout(() => {
        card.classList.remove("element-key-flash");
        if (card.href) {
          window.location.href = card.href;
        }
      }, 340);
    }
  });
}

// Lifecycle Initializations
initIntroChoreography();
initScrollTriggeredCenterpieces();
initKineticCards();
initTeleportation();
initDeviceOrientationParallax();
initScrollParallax();
initGeometricField();
initAmbientPointer();
initKeyboardHint();

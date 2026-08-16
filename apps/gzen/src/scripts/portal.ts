import { gsap } from "gsap";
import { animate } from "animejs";
import { ANIMATION_SEEDS } from "../data/animation-seeds";

/**
 * gZen Tri-Elemental Kinetic Motion, Web Audio Resonance & Practice Ignition Engine
 * Dual-Engine Stack: GSAP 3.15+ (Timelines, quickTo, Inertia, Parallax) + Anime.js v4 (Elastic Springs)
 *
 * Design Language: Tesla/xAI ultra-clean minimalism + Tri-Elemental Sovereignty (Water · Earth · Fire).
 */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(pointer: coarse)").matches;

// Elemental Configuration Map
const ELEMENT_CONFIG = {
  Z: {
    name: "Water",
    kanji: "水",
    tone: "#22d3ee",
    secondary: "#0d9488",
    glow: "rgba(34, 211, 238, 0.14)",
    cursorGlow: "rgba(34, 211, 238, 0.08)",
    audioFreq: 432,
    subFreq: 216,
    waveform: "sine" as OscillatorType,
  },
  E: {
    name: "Earth",
    kanji: "地",
    tone: "#fbbf24",
    secondary: "#d97706",
    glow: "rgba(251, 191, 36, 0.14)",
    cursorGlow: "rgba(251, 191, 36, 0.08)",
    audioFreq: 528,
    subFreq: 264,
    waveform: "triangle" as OscillatorType,
  },
  N: {
    name: "Fire",
    kanji: "火",
    tone: "#f97316",
    secondary: "#ef4444",
    glow: "rgba(249, 115, 22, 0.14)",
    cursorGlow: "rgba(249, 115, 22, 0.08)",
    audioFreq: 741,
    subFreq: 370.5,
    waveform: "triangle" as OscillatorType,
  },
} as const;

type ElementKey = keyof typeof ELEMENT_CONFIG;

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
        ".hero .hero-actions",
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
 * Global Elemental Audio Resonance Manager (Zero-Dependency Web Audio API)
 */
let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let osc1: OscillatorNode | null = null;
let osc2: OscillatorNode | null = null;
let biquadFilter: BiquadFilterNode | null = null;
let isAudioActive = false;
let currentActiveElement: ElementKey = "Z";

function setResonanceFrequency(elementKey: ElementKey) {
  currentActiveElement = elementKey;
  const cfg = ELEMENT_CONFIG[elementKey];

  if (isAudioActive && audioCtx && osc1 && osc2 && masterGain) {
    const now = audioCtx.currentTime;
    try {
      osc1.frequency.cancelScheduledValues(now);
      osc2.frequency.cancelScheduledValues(now);
      osc1.frequency.exponentialRampToValueAtTime(cfg.audioFreq, now + 0.6);
      osc2.frequency.exponentialRampToValueAtTime(cfg.subFreq, now + 0.6);

      const statusEl = document.getElementById("audio-status-indicator");
      if (statusEl) {
        statusEl.textContent = `${cfg.kanji} ${cfg.audioFreq}Hz`;
      }
    } catch {
      // Fallback direct set
      osc1.frequency.setValueAtTime(cfg.audioFreq, now);
      osc2.frequency.setValueAtTime(cfg.subFreq, now);
    }
  }
}

function initWebAudioResonance() {
  const toggleBtn = document.getElementById("audio-resonance-toggle");
  const statusIndicator = document.getElementById("audio-status-indicator");
  if (!toggleBtn) return;

  const startAudio = async () => {
    try {
      const AudioContextClass = window.AudioContext;
      if (!AudioContextClass) return;

      if (!audioCtx) {
        audioCtx = new AudioContextClass();
      }
      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }

      const cfg = ELEMENT_CONFIG[currentActiveElement];

      // Master gain node
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 1.2);

      // Lowpass Filter for warm, analog harmonic tone
      biquadFilter = audioCtx.createBiquadFilter();
      biquadFilter.type = "lowpass";
      biquadFilter.frequency.setValueAtTime(850, audioCtx.currentTime);
      biquadFilter.Q.setValueAtTime(1.2, audioCtx.currentTime);

      // Fundamental Oscillator
      osc1 = audioCtx.createOscillator();
      osc1.type = cfg.waveform;
      osc1.frequency.setValueAtTime(cfg.audioFreq, audioCtx.currentTime);

      // Sub-harmonic Octave Oscillator
      osc2 = audioCtx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(cfg.subFreq, audioCtx.currentTime);

      // Routing
      osc1.connect(biquadFilter);
      osc2.connect(biquadFilter);
      biquadFilter.connect(masterGain);
      masterGain.connect(audioCtx.destination);

      osc1.start();
      osc2.start();

      isAudioActive = true;
      toggleBtn.classList.add("active");
      if (statusIndicator) {
        statusIndicator.textContent = `${cfg.kanji} ${cfg.audioFreq}Hz`;
      }
    } catch {
      // Audio autoplay policy or device fallback
      isAudioActive = false;
    }
  };

  const stopAudio = () => {
    if (!audioCtx || !masterGain) return;
    try {
      const now = audioCtx.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

      setTimeout(() => {
        try {
          osc1?.stop();
          osc2?.stop();
          osc1?.disconnect();
          osc2?.disconnect();
        } catch {}
        osc1 = null;
        osc2 = null;
        isAudioActive = false;
        toggleBtn.classList.remove("active");
        if (statusIndicator) {
          statusIndicator.textContent = "Muted";
        }
      }, 520);
    } catch {
      isAudioActive = false;
      toggleBtn.classList.remove("active");
      if (statusIndicator) statusIndicator.textContent = "Muted";
    }
  };

  toggleBtn.addEventListener("click", () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try { navigator.vibrate(10); } catch {}
    }

    if (isAudioActive) {
      stopAudio();
    } else {
      startAudio();
    }
  });
}

/**
 * 2. Dynamic Global Elemental Resonance (Harmonic Shift)
 * Modulates background GeometricField, cursor glow, and Web Audio across Water, Earth, and Fire
 */
function initGlobalElementalResonance() {
  const root = document.documentElement;
  const cards = Array.from(document.querySelectorAll<HTMLElement>(".element-card"));
  const geoStage = document.getElementById("geoStage");

  const applyElementalTheme = (key: ElementKey) => {
    const cfg = ELEMENT_CONFIG[key];
    currentActiveElement = key;

    // Update CSS Custom Properties
    root.style.setProperty("--active-element-tone", cfg.tone);
    root.style.setProperty("--cursor-glow", cfg.cursorGlow);

    if (geoStage) {
      geoStage.style.setProperty("--geo-active-tone", cfg.tone);
    }

    // Sync Web Audio frequency
    setResonanceFrequency(key);

    // Sync Mobile Swipe Dots
    const dots = document.querySelectorAll<HTMLElement>(".swipe-dot");
    dots.forEach((dot) => {
      const target = dot.dataset.swipeTarget;
      if (target === key) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  };

  // Scroll focal tracking with IntersectionObserver
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          const card = entry.target as HTMLElement;
          const letter = card.dataset.element as ElementKey | undefined;
          if (letter && ELEMENT_CONFIG[letter]) {
            applyElementalTheme(letter);
          }
        }
      });
    },
    {
      threshold: [0.35, 0.6, 0.8],
      rootMargin: "-60px 0px -60px 0px",
    }
  );

  cards.forEach((card) => {
    observer.observe(card);

    // Hover focal shift for desktop
    if (!isTouch) {
      card.addEventListener("mouseenter", () => {
        const letter = card.dataset.element as ElementKey | undefined;
        if (letter && ELEMENT_CONFIG[letter]) {
          applyElementalTheme(letter);
        }
      });
    }
  });
}

/**
 * 3. Interactive Hero Trinity Badges (Smooth Scroll & Focal Snap)
 */
function initHeroTrinityBadges() {
  const pills = Array.from(document.querySelectorAll<HTMLAnchorElement>(".tri-pill"));
  if (!pills.length) return;

  pills.forEach((pill) => {
    pill.addEventListener("click", (e) => {
      e.preventDefault();
      const targetKey = pill.dataset.target as ElementKey | undefined;
      if (!targetKey) return;

      const targetCard = document.getElementById(`element-${targetKey}`);
      if (!targetCard) return;

      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try { navigator.vibrate(15); } catch {}
      }

      // Smooth scroll to card
      targetCard.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });

      // Focal Snap Pulse
      animate(targetCard, {
        scale: [1, 1.035, 1],
        duration: 450,
        ease: "outBack(2)",
      });

      targetCard.classList.add("element-key-flash");
      setTimeout(() => {
        targetCard.classList.remove("element-key-flash");
      }, 500);
    });
  });
}

/**
 * 4. Interactive In-Card Micro-Practices (Water Breath Pacer, Earth Compounding, Fire Spark)
 */
function initInCardMicroPractices() {
  // WATER: 4-7-8 Somatic Breath Pacer
  const breathCard = document.getElementById("element-Z");
  if (breathCard) {
    const breathBtn = breathCard.querySelector<HTMLButtonElement>('[data-action="breath"]');
    const phaseLabel = breathCard.querySelector<HTMLElement>("[data-breath-phase]");
    const barInhale = breathCard.querySelector<HTMLElement>('[data-phase-bar="inhale"]');
    const barHold = breathCard.querySelector<HTMLElement>('[data-phase-bar="hold"]');
    const barExhale = breathCard.querySelector<HTMLElement>('[data-phase-bar="exhale"]');
    const disc = breathCard.querySelector<SVGCircleElement>(".geo-ambient-disc");

    let isBreathing = false;
    let breathTimer: number | null = null;
    let breathPhase: "inhale" | "hold" | "exhale" = "inhale";

    const clearBars = () => {
      barInhale?.classList.remove("active");
      barHold?.classList.remove("active");
      barExhale?.classList.remove("active");
    };

    const runBreathCycle = () => {
      if (!isBreathing) return;

      // 1. Inhale (4s)
      breathPhase = "inhale";
      clearBars();
      barInhale?.classList.add("active");
      if (phaseLabel) phaseLabel.textContent = "INHALE (4s) · EXPAND VESSEL";

      if (disc) {
        gsap.to(disc, { attr: { r: 85 }, opacity: 0.9, duration: 4, ease: "sine.inOut" });
      }

      breathTimer = window.setTimeout(() => {
        if (!isBreathing) return;

        // 2. Hold (7s)
        breathPhase = "hold";
        clearBars();
        barHold?.classList.add("active");
        if (phaseLabel) phaseLabel.textContent = "HOLD (7s) · IMMUTABLE STILLNESS";

        if (disc) {
          gsap.to(disc, { opacity: 0.6, duration: 7, ease: "sine.inOut" });
        }

        breathTimer = window.setTimeout(() => {
          if (!isBreathing) return;

          // 3. Exhale (8s)
          breathPhase = "exhale";
          clearBars();
          barExhale?.classList.add("active");
          if (phaseLabel) phaseLabel.textContent = "EXHALE (8s) · RELEASE FRICTION";

          if (disc) {
            gsap.to(disc, { attr: { r: 55 }, opacity: 0.4, duration: 8, ease: "sine.inOut" });
          }

          breathTimer = window.setTimeout(() => {
            if (isBreathing) runBreathCycle();
          }, 8000);
        }, 7000);
      }, 4000);
    };

    if (breathBtn) {
      breathBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          try { navigator.vibrate(12); } catch {}
        }

        isBreathing = !isBreathing;
        if (isBreathing) {
          const btnText = breathBtn.querySelector<HTMLElement>(".btn-text");
          if (btnText) btnText.textContent = "Pause Breath Guide";
          breathBtn.style.borderColor = "var(--element-tone)";
          runBreathCycle();
        } else {
          clearTimeout(breathTimer);
          clearBars();
          const btnText = breathBtn.querySelector<HTMLElement>(".btn-text");
          if (btnText) btnText.textContent = "Begin 4-7-8 Rhythm";
          if (phaseLabel) phaseLabel.textContent = "4-7-8 RHYTHM · PAUSED";
          breathBtn.style.borderColor = "";
          if (disc) gsap.to(disc, { attr: { r: 75 }, opacity: 0.5, duration: 1 });
        }
      });
    }
  }

  // EARTH: Compounding Capital Tier Simulator
  const earthCard = document.getElementById("element-E");
  if (earthCard) {
    const tierBtns = Array.from(earthCard.querySelectorAll<HTMLButtonElement>(".tier-btn"));
    const multLabel = earthCard.querySelector<HTMLElement>("[data-compound-mult]");
    const readoutLabel = earthCard.querySelector<HTMLElement>("[data-compound-readout]");
    const octaGroup = earthCard.querySelector<SVGGElement>(".geo-octahedron-group");

    const tierData: Record<string, { label: string; readout: string; scale: number; rot: number }> = {
      "1": { label: "1.0x BASE VELOCITY", readout: "100% Focused Linear Output", scale: 0.95, rot: 0 },
      "3.2": { label: "3.2x ASYMMETRIC", readout: "+320% Compounded Reserve", scale: 1.08, rot: 15 },
      "10": { label: "10.0x SOVEREIGN", readout: "+1,000% Immutable Shield", scale: 1.22, rot: 45 },
    };

    tierBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        tierBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const tier = btn.dataset.tier || "3.2";
        const data = tierData[tier];

        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          try { navigator.vibrate(10); } catch {}
        }

        if (multLabel && data) multLabel.textContent = data.label;
        if (readoutLabel && data) {
          const valEl = readoutLabel.querySelector(".readout-value");
          if (valEl) valEl.textContent = data.readout;
        }

        if (octaGroup && data) {
          gsap.to(octaGroup, {
            scale: data.scale,
            rotation: data.rot,
            transformOrigin: "100px 100px",
            duration: 0.6,
            ease: "back.out(1.8)",
          });
        }
      });
    });
  }

  // FIRE: Neural Command Syntax Spark Simulator
  const fireCard = document.getElementById("element-N");
  if (fireCard) {
    const sparkBtn = fireCard.querySelector<HTMLButtonElement>('[data-action="spark"]');
    const sparkStatus = fireCard.querySelector<HTMLElement>("[data-spark-status]");
    const nodes = Array.from(fireCard.querySelectorAll<HTMLElement>(".spark-node"));
    const svgNodes = Array.from(fireCard.querySelectorAll<SVGElement>(".geo-node"));

    let isSparking = false;

    if (sparkBtn) {
      sparkBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isSparking) return;
        isSparking = true;

        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          try { navigator.vibrate([15, 30, 20]); } catch {}
        }

        // Step 1: Prompt
        nodes.forEach((n) => n.classList.remove("active"));
        nodes[0]?.classList.add("active");
        if (sparkStatus) sparkStatus.textContent = "SYNTAX // PROMPT DISPATCHED";

        gsap.fromTo(svgNodes, { scale: 1 }, { scale: 1.5, stagger: 0.04, duration: 0.25, ease: "power2.out" });

        // Step 2: L1 Bridge Orchestration
        setTimeout(() => {
          nodes.forEach((n) => n.classList.remove("active"));
          nodes[1]?.classList.add("active");
          if (sparkStatus) sparkStatus.textContent = "ORCHESTRATE // L1 KINETIC BRIDGE";

          // Step 3: Velocity Execution
          setTimeout(() => {
            nodes.forEach((n) => n.classList.remove("active"));
            nodes[2]?.classList.add("active");
            if (sparkStatus) sparkStatus.textContent = "EXECUTE // 60FPS SYNTHESIS";

            // Reset after delay
            setTimeout(() => {
              nodes.forEach((n) => n.classList.remove("active"));
              nodes[0]?.classList.add("active");
              if (sparkStatus) sparkStatus.textContent = "STANDBY // READY";
              isSparking = false;
            }, 1200);
          }, 450);
        }, 400);
      });
    }
  }
}

/**
 * 5. Mobile Swipe Carousel Rail Tracking
 */
function initMobileSwipeCarousel() {
  const carousel = document.getElementById("elements-carousel");
  const dots = Array.from(document.querySelectorAll<HTMLButtonElement>(".swipe-dot"));
  if (!carousel || !dots.length) return;

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const targetKey = dot.dataset.swipeTarget;
      if (!targetKey) return;

      const targetCard = document.getElementById(`element-${targetKey}`);
      if (targetCard) {
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          try { navigator.vibrate(10); } catch {}
        }

        targetCard.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    });
  });

  // Track horizontal scroll for dot active state
  let scrollTimeout: number | null = null;
  carousel.addEventListener(
    "scroll",
    () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        const scrollLeft = carousel.scrollLeft;
        const width = carousel.offsetWidth;
        const index = Math.round(scrollLeft / (width * 0.85));
        const clamped = Math.max(0, Math.min(index, dots.length - 1));

        dots.forEach((d, i) => {
          if (i === clamped) d.classList.add("active");
          else d.classList.remove("active");
        });
      }, 60);
    },
    { passive: true }
  );
}

/**
 * 6. Scroll-Triggered In-Card Centerpiece Activation
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
 * 7. High-Performance 3D Kinetic Tilt & Mobile Touch Gesture Engine
 */
function initKineticCards() {
  const cards = Array.from(document.querySelectorAll<HTMLElement>(".element-card"));
  if (!cards.length) return;

  const cfg = {
    tiltInertia: ANIMATION_SEEDS.timings.tiltInertia || 0.35,
    maxTiltDeg: ANIMATION_SEEDS.spatialTilt.maxPitchDeg || 4.5,
    hoverElevateZ: ANIMATION_SEEDS.spatialTilt.elevationPx || 8,
  };

  cards.forEach((card) => {
    const glowEl = card.querySelector<HTMLElement>(".element-ambient-glow");
    let bounds = card.getBoundingClientRect();

    const updateBounds = () => {
      bounds = card.getBoundingClientRect();
    };

    window.addEventListener("resize", updateBounds, { passive: true });
    window.addEventListener("scroll", updateBounds, { passive: true });

    if (!isTouch) {
      const setRotX = gsap.quickTo(card, "rotateX", {
        duration: cfg.tiltInertia,
        ease: "power2.out",
      });
      const setRotY = gsap.quickTo(card, "rotateY", {
        duration: cfg.tiltInertia,
        ease: "power2.out",
      });
      const setZ = gsap.quickTo(card, "z", {
        duration: cfg.tiltInertia,
        ease: "power2.out",
      });

      const onPointerMove = (e: PointerEvent) => {
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;

        const normX = (x / bounds.width - 0.5) * 2;
        const normY = (y / bounds.height - 0.5) * 2;

        const rotX = -normY * cfg.maxTiltDeg;
        const rotY = normX * cfg.maxTiltDeg;

        setRotX(rotX);
        setRotY(rotY);
        setZ(cfg.hoverElevateZ);

        if (glowEl) {
          card.style.setProperty("--mx", `${x.toFixed(1)}px`);
          card.style.setProperty("--my", `${y.toFixed(1)}px`);
        }
      };

      const onPointerLeave = () => {
        setRotX(0);
        setRotY(0);
        setZ(0);
        if (glowEl) {
          card.style.setProperty("--mx", "50%");
          card.style.setProperty("--my", "40%");
        }
      };

      card.addEventListener("pointermove", onPointerMove, { passive: true });
      card.addEventListener("pointerleave", onPointerLeave, { passive: true });
    } else {
      let touchStartX = 0;
      let isTouching = false;

      const onTouchStart = (e: TouchEvent) => {
        isTouching = true;
        updateBounds();
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        const x = touch.clientX - bounds.left;
        const y = touch.clientY - bounds.top;

        if (glowEl) {
          card.style.setProperty("--mx", `${x.toFixed(1)}px`);
          card.style.setProperty("--my", `${y.toFixed(1)}px`);
        }

        gsap.to(card, {
          scale: 0.985,
          duration: 0.12,
          ease: "power2.out",
        });
      };

      const onTouchMove = (e: TouchEvent) => {
        if (!isTouching) return;
        const touch = e.touches[0];
        const x = touch.clientX - bounds.left;
        const y = touch.clientY - bounds.top;

        if (glowEl) {
          card.style.setProperty("--mx", `${x.toFixed(1)}px`);
          card.style.setProperty("--my", `${y.toFixed(1)}px`);
        }

        const deltaX = (touch.clientX - touchStartX) * 0.15;
        const clampedDeltaX = Math.max(-12, Math.min(12, deltaX));
        card.style.transform = `translateX(${clampedDeltaX.toFixed(1)}px) scale(0.985)`;
      };

      const onTouchEnd = () => {
        isTouching = false;
        gsap.to(card, {
          scale: 1,
          x: 0,
          duration: 0.35,
          ease: "elastic.out(1, 0.7)",
        });
      };

      card.addEventListener("touchstart", onTouchStart, { passive: true });
      card.addEventListener("touchmove", onTouchMove, { passive: true });
      card.addEventListener("touchend", onTouchEnd, { passive: true });
      card.addEventListener("touchcancel", onTouchEnd, { passive: true });
    }
  });
}

/**
 * 8. Cinematic Teleportation Step-Through Transition with Mobile Haptics
 */
function initTeleportation() {
  const cards = Array.from(document.querySelectorAll<HTMLAnchorElement>(".element-card"));
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener("click", (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      // Do not navigate if user clicked inside micro-practice interactive widget
      if (target && target.closest(".micro-practice")) {
        return;
      }

      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      const href = card.href;

      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try { navigator.vibrate([12, 35, 18]); } catch {}
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
 * 9. Multi-Layer Scroll Parallax (GSAP Ticker Lerp)
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

    if (elementsGrid && currentScrollY > 20 && !isTouch) {
      elementsGrid.style.transform = `translate3d(0, ${Math.min(12, currentScrollY * 0.02)}px, 0)`;
    }
  });
}

/**
 * 10. Kinetic Sacred & Coordinate Geometry Engine (Scroll & Parallax Driven)
 */
function initGeometricField() {
  const geoStage = document.getElementById("geoStage");
  const geoOuterDial = document.getElementById("geoOuterDial");
  const geoPolyhedra = document.getElementById("geoPolyhedra");
  const geoPhiRings = document.getElementById("geoPhiRings");
  const geoEnsoPath = document.getElementById("geoEnsoPath");
  const geoHexA = document.getElementById("geoHexA") || document.querySelector<SVGPolygonElement>(".geo-hex-a");
  const geoHexB = document.getElementById("geoHexB") || document.querySelector<SVGPolygonElement>(".geo-hex-b");
  const geoTelemetryX = document.querySelector<HTMLElement>(".geo-telemetry-x");
  const geoTelemetryY = document.querySelector<HTMLElement>(".geo-telemetry-y");
  const geoVertices = document.getElementById("geoVertices");

  if (!geoStage || !geoOuterDial || !geoPolyhedra) return;

  if (reduceMotion) {
    gsap.set(geoStage, { opacity: 0.8 });
    return;
  }

  const cfg = ANIMATION_SEEDS.geometricField;

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

  // Base angles for continuous silky idle auto-rotation at the top
  let baseDialAngle = 0;
  let basePolyAngle = 0;
  let basePulse = 0;
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
    // 1. Continuous auto-rotation at idle
    baseDialAngle = (baseDialAngle + 0.22) % 360;
    basePolyAngle = (basePolyAngle - 0.28) % 360;
    basePulse += 0.025;

    // 2. Smooth scroll tracking with lerp
    smoothScrollY += (targetScrollY - smoothScrollY) * 0.10;

    // 3. Scroll-driven decomposition & rotation factors
    const dialAngle = baseDialAngle + smoothScrollY * 0.44;
    const polyAngle = basePolyAngle - smoothScrollY * 0.58;

    // Layer A: Outer Dial rotation & slight radial dilation
    const dialScale = 1 + smoothScrollY * 0.00035;
    geoOuterDial.style.transform = `rotate(${dialAngle.toFixed(2)}deg) scale(${dialScale.toFixed(4)})`;
    geoOuterDial.style.transformOrigin = "400px 400px";

    // Layer B: Nested Polyhedra counter-rotation & dimensional expansion
    const polyScale = 1 + smoothScrollY * 0.00045;
    geoPolyhedra.style.transform = `rotate(${polyAngle.toFixed(2)}deg) scale(${polyScale.toFixed(4)})`;
    geoPolyhedra.style.transformOrigin = "400px 400px";

    // Layer C: Concentric Phi Rings — Radial Decomposition on Scroll
    if (geoPhiRings) {
      const phiScale = 1 + smoothScrollY * 0.00095 + Math.sin(basePulse) * 0.015;
      const phiRot = (baseDialAngle * 0.35 + smoothScrollY * 0.15).toFixed(2);
      geoPhiRings.style.transform = `rotate(${phiRot}deg) scale(${phiScale.toFixed(4)})`;
      geoPhiRings.style.transformOrigin = "400px 400px";
    }

    // Layer D: Interlocking Hexagram Star 3D Opposing Shearing
    if (geoHexA) {
      const hexARot = (baseDialAngle * 0.5 + smoothScrollY * 0.32).toFixed(2);
      const hexATransX = (smoothScrollY * 0.02).toFixed(1);
      const hexATransY = (-smoothScrollY * 0.015).toFixed(1);
      geoHexA.style.transform = `translate(${hexATransX}px, ${hexATransY}px) rotate(${hexARot}deg)`;
      geoHexA.style.transformOrigin = "400px 400px";
    }
    if (geoHexB) {
      const hexBRot = (-baseDialAngle * 0.45 - smoothScrollY * 0.38).toFixed(2);
      const hexBTransX = (-smoothScrollY * 0.02).toFixed(1);
      const hexBTransY = (smoothScrollY * 0.015).toFixed(1);
      geoHexB.style.transform = `translate(${hexBTransX}px, ${hexBTransY}px) rotate(${hexBRot}deg)`;
      geoHexB.style.transformOrigin = "400px 400px";
    }

    // Layer E: Stage Global Descent & Panoramic Decomposition Expansion
    const stageY = smoothScrollY * 0.44;
    const stageScale = 1 + Math.min(0.65, (smoothScrollY / 550) * 0.48);
    geoStage.style.transform = `translate(-50%, calc(-50% + ${stageY.toFixed(1)}px)) scale(${stageScale.toFixed(3)})`;

    // Layer F: Dynamic Enso Vector Arc Unspooling
    if (geoEnsoPath) {
      const unfoldOffset = Math.max(0, 700 - smoothScrollY * 1.55);
      geoEnsoPath.style.strokeDashoffset = `${unfoldOffset.toFixed(1)}`;
    }

    // Layer G: Coordinate Telemetry Axes Parallax
    if (geoTelemetryX) {
      const axisOffset = smoothScrollY * 0.28;
      geoTelemetryX.style.transform = `translateY(${axisOffset.toFixed(1)}px)`;
    }
    if (geoTelemetryY) {
      const axisYOffset = Math.sin(basePulse * 0.5) * 6;
      geoTelemetryY.style.transform = `translateX(${axisYOffset.toFixed(1)}px)`;
    }

    // Layer H: Vertex Constellation Radial Dispersion
    if (geoVertices) {
      const vertScale = 1 + smoothScrollY * 0.00065;
      const vertRot = (smoothScrollY * 0.12).toFixed(2);
      const vertexOpacity = Math.min(1, 0.72 + Math.sin(smoothScrollY * 0.01 + baseDialAngle * 0.05) * 0.28);
      geoVertices.style.transform = `rotate(${vertRot}deg) scale(${vertScale.toFixed(4)})`;
      geoVertices.style.transformOrigin = "400px 400px";
      geoVertices.style.opacity = `${vertexOpacity.toFixed(2)}`;
    }
  });
}

/**
 * 11. Ambient Cursor Glow with Smooth Lerp
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
 * 12. Mobile Device Orientation (Gyroscope Parallax)
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
 * 13. Z · E · N Keyboard Teleportation (Anime.js Spring Pop)
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
initWebAudioResonance();
initGlobalElementalResonance();
initHeroTrinityBadges();
initInCardMicroPractices();
initMobileSwipeCarousel();
initScrollTriggeredCenterpieces();
initKineticCards();
initTeleportation();
initDeviceOrientationParallax();
initScrollParallax();
initGeometricField();
initAmbientPointer();
initKeyboardHint();

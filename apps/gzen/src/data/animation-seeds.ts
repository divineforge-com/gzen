/**
 * gZen Motion & Teleportation Seed Tokens
 * Reference & configuration seed for GSAP (GreenSock) & Anime.js v4 kinetic stack.
 *
 * Design Language: Tesla/xAI ultra-clean minimalism + gZen saffron & cool monastery tones.
 */

export interface EasingPreset {
  gsap: string;
  css: string;
  anime: string;
  description: string;
}

export interface AnimationTiming {
  introDuration: number;
  introStagger: number;
  tiltInertia: number;
  hoverScale: number;
  teleportDuration: number;
  glowFadeDuration: number;
}

export interface MotionSeedConfig {
  easings: {
    smoothEntrance: EasingPreset;
    snappySpring: EasingPreset;
    subtleFloat: EasingPreset;
    teleportWarp: EasingPreset;
    magneticReturn: EasingPreset;
  };
  timings: AnimationTiming;
  spatialTilt: {
    maxPitchDeg: number;
    maxRollDeg: number;
    elevationPx: number;
    perspectivePx: number;
  };
  portalRings: {
    baseStrokeWidth: number;
    hoverStrokeWidth: number;
    rotationDuration: number;
    pulseScaleRange: [number, number];
  };
  particles: {
    count: number;
    driftSpeed: number;
    ambientOpacity: [number, number];
  };
  geometricField: {
    rotationSpeedIdle: number;
    counterRotationSpeedIdle: number;
    scrollRotationFactor: number;
    scrollCounterFactor: number;
    scrollScaleFactor: number;
    tiltInertia: number;
    perspectiveMaxPitchDeg: number;
    perspectiveMaxRollDeg: number;
    ensoDashUnfoldLength: number;
  };
  mobileGestures: {
    touchCompressionScale: number;
    touchReturnSpring: string;
    swipeThresholdPx: number;
    maxSwipeDisplacementPx: number;
    gyroMaxPitchDeg: number;
    gyroMaxRollDeg: number;
    gyroInertia: number;
    hapticPulseDurationMs: number;
  };
}

export const ANIMATION_SEEDS: MotionSeedConfig = {
  easings: {
    smoothEntrance: {
      gsap: "power3.out",
      css: "cubic-bezier(0.16, 1, 0.3, 1)",
      anime: "outExpo",
      description: "Silky deceleration for typography and container reveals without overshoot",
    },
    snappySpring: {
      gsap: "back.out(1.7)",
      css: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      anime: "outBack(1.7)",
      description: "Elastic kinetic pop for interactive chips, shortcuts, and focus indicators",
    },
    subtleFloat: {
      gsap: "sine.inOut",
      css: "cubic-bezier(0.45, 0.05, 0.55, 0.95)",
      anime: "inOutSine",
      description: "Gentle continuous ambient breathing for starfield and hero flow aura",
    },
    teleportWarp: {
      gsap: "power4.inOut",
      css: "cubic-bezier(0.7, 0, 0.84, 0)",
      anime: "inOutExpo",
      description: "Instantaneous warp acceleration for portal navigation and transitions",
    },
    magneticReturn: {
      gsap: "elastic.out(1, 0.6)",
      css: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      anime: "outElastic(1, 0.6)",
      description: "Physical spring-damper snap when pointer leaves magnetic 3D cards",
    },
  },
  timings: {
    introDuration: 0.85,
    introStagger: 0.08,
    tiltInertia: 0.35,
    hoverScale: 1.015,
    teleportDuration: 0.4,
    glowFadeDuration: 0.45,
  },
  spatialTilt: {
    maxPitchDeg: 4.5,
    maxRollDeg: 4.5,
    elevationPx: 8,
    perspectivePx: 1000,
  },
  portalRings: {
    baseStrokeWidth: 1.25,
    hoverStrokeWidth: 2.2,
    rotationDuration: 12.0,
    pulseScaleRange: [0.98, 1.02],
  },
  particles: {
    count: 36,
    driftSpeed: 0.15,
    ambientOpacity: [0.15, 0.75],
  },
  geometricField: {
    rotationSpeedIdle: 0.02,
    counterRotationSpeedIdle: -0.028,
    scrollRotationFactor: 0.28,
    scrollCounterFactor: -0.38,
    scrollScaleFactor: 0.16,
    tiltInertia: 0.45,
    perspectiveMaxPitchDeg: 7.5,
    perspectiveMaxRollDeg: 7.5,
    ensoDashUnfoldLength: 700,
  },
  mobileGestures: {
    touchCompressionScale: 0.978,
    touchReturnSpring: "elastic.out(1, 0.7)",
    swipeThresholdPx: 35,
    maxSwipeDisplacementPx: 14,
    gyroMaxPitchDeg: 6.0,
    gyroMaxRollDeg: 6.0,
    gyroInertia: 0.35,
    hapticPulseDurationMs: 8,
  },
};

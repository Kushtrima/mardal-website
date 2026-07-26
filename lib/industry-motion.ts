/**
 * The industries drawing, ported from the Industries film.
 *
 * The film plays on a 1920×1080 stage with the dot ring centred just off the
 * right edge, so the same coordinates are kept here and the SVG viewBox does
 * the scaling. Five industries, five motion ideas: the page holds still and the
 * ring carries the idea. Each scene is a pure function of `progress` (0 → 1
 * across its own duration), so the component only has to drive that one number
 * and write the result onto elements it already rendered.
 */

export const STAGE = { width: 1920, height: 1080 };

const CX = 1760;
const CY = 540;
const R = 470;
const DOT = 42;
/** A full ring of 20 dots, 18° apart; it meets the frame on the right edge. */
const RING_COUNT = 20;
const RING_STEP = 18;
/** The ring indices inside the frame — 72°…288°. */
const VIS_A = 4;
const VIS_B = 16;
const VIS_COUNT = VIS_B - VIS_A + 1;
/** Of those, the ones with room to their right for a rail. */
const BAR_A = 7;
const BAR_B = 13;
const BAR_COUNT = BAR_B - BAR_A + 1;
/** The seats the Public Sector scene fills in, one between each pair. */
const SEAT_A = 4;
const SEAT_B = 15;

/** Held still at this point of the scene when the visitor prefers less motion. */
export const REST_PROGRESS = 0.45;

export const SCENE_SECONDS: Record<string, number> = {
  "financial-services": 5,
  healthcare: 6.4,
  manufacturing: 6.4,
  automotive: 5.4,
  "public-sector": 6.2,
};

/** How many of each shape a scene can ask for, so the pools are rendered once. */
export const POOL = {
  dots: RING_COUNT,
  extras: SEAT_B - SEAT_A + 1,
  rails: BAR_COUNT,
  movers: BAR_COUNT,
  /** Every dot in frame, with at most three beats overlapping on any one. */
  pulses: VIS_COUNT * 3,
  lanes: 2,
};

export const RING_CENTER = { x: CX, y: CY };

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rad = (degrees: number) => (degrees * Math.PI) / 180;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** Rises from `start`, taking `span` of the scene to get there. */
const ease = (progress: number, start: number, span: number) =>
  easeInOutCubic(clamp((progress - start) / span, 0, 1));

/** Up over the first pair, held, then back down over the second. */
const hold = (
  progress: number,
  inAt: number,
  inSpan: number,
  outAt: number,
  outSpan: number,
) => ease(progress, inAt, inSpan) * (1 - ease(progress, outAt, outSpan));

const ringAngle = (index: number) => index * RING_STEP;
const ringX = (angle: number, radius = R) => CX + radius * Math.cos(rad(angle));
const ringY = (angle: number, radius = R) => CY - radius * Math.sin(rad(angle));
/** Along the ring at that angle, for dots that lie down as they travel. */
const tangentDeg = (angle: number) =>
  (Math.atan2(-Math.cos(rad(angle)), -Math.sin(rad(angle))) * 180) / Math.PI;

/* Rounded, because the server and the browser disagree on the last digit of a
   sine and React then reports the rendered SVG as a hydration mismatch. */
const round = (value: number) => Math.round(value * 1000) / 1000;

/** The ring itself, walked in 3° steps — the same path the film draws. */
export const RING_PATH = (() => {
  let path = "";

  for (let angle = 0; angle <= 360; angle += 3) {
    path +=
      (angle ? " L " : "M ") +
      ringX(angle).toFixed(1) +
      " " +
      ringY(angle).toFixed(1);
  }

  return `${path} Z`;
})();

export const RING_DOTS = Array.from({ length: RING_COUNT }, (_, index) => {
  const angle = ringAngle(index);

  return { x: round(ringX(angle)), y: round(ringY(angle)) };
});

/** The two posts the ring indexes between in the Manufacturing scene. */
export const GATE_LINES = [
  { x: 1216, y1: 440, y2: 640 },
  { x: 1364, y1: 440, y2: 640 },
];

export type ArtDot = {
  x: number;
  y: number;
  /** Half-width and half-height, so a dot can stretch along its travel. */
  rx: number;
  ry: number;
  corner: number;
  rot: number;
  fill: number;
  stroke: number;
};

export type ArtRail = { x: number; y: number; width: number; opacity: number };
export type ArtMover = { x: number; y: number; opacity: number };
export type ArtPulse = { x: number; y: number; r: number; opacity: number };
export type ArtLane = { scale: number; opacity: number };

export type ArtFrame = {
  ring: { opacity: number; width: number };
  lanes: ArtLane[];
  gate: number;
  rails: ArtRail[];
  movers: ArtMover[];
  pulses: ArtPulse[];
  dots: ArtDot[];
  extras: ArtDot[];
};

const makeDot = (
  x: number,
  y: number,
  rx = DOT,
  ry = DOT,
  corner = DOT,
  rot = 0,
  fill = 1,
  stroke = 0,
): ArtDot => ({ x, y, rx, ry, corner, rot, fill, stroke });

const baseDots = () => RING_DOTS.map((dot) => makeDot(dot.x, dot.y));

const baseFrame = (): ArtFrame => ({
  ring: { opacity: 0.55, width: 2.5 },
  lanes: [],
  gate: 0,
  rails: [],
  movers: [],
  pulses: [],
  dots: baseDots(),
  extras: [],
});

/* ── 1. Financial Services — value moves out along the lines and back ────── */

/** How far past the ring each rail reaches, as a share of its run. */
const REACH = [0.58, 0.86, 0.44, 0.92, 0.5, 0.78, 0.62];

function financial(progress: number): ArtFrame {
  const frame = baseFrame();

  for (let k = 0; k < BAR_COUNT; k += 1) {
    const angle = ringAngle(BAR_A + k);
    const x = ringX(angle);
    const y = ringY(angle);
    const draw =
      ease(progress, 0.02 + k * 0.025, 0.24) *
      (1 - ease(progress, 0.72 + k * 0.011, 0.16));

    if (draw <= 0.005) continue;

    const end = Math.min(1886, x + 130 + REACH[k] * 420);
    frame.rails.push({ x, y, width: (end - x) * draw, opacity: draw });

    const travel =
      ease(progress, 0.22 + k * 0.025, 0.34) -
      ease(progress, 0.6 + k * 0.02, 0.28);

    if (travel > 0.01) {
      frame.movers.push({
        x: lerp(x, end, travel),
        y,
        opacity: Math.min(1, draw),
      });
    }
  }

  return frame;
}

/* ── 2. Healthcare — a lub-dub pulse runs through the whole line ─────────── */

const BEATS: [number, number][] = [
  [0.03, 1],
  [0.13, 0.6],
  [0.32, 1],
  [0.42, 0.6],
  [0.6, 1],
  [0.7, 0.6],
];
const BEAT_LEN = 0.28;

function healthcare(progress: number): ArtFrame {
  const frame = baseFrame();

  for (let i = VIS_A; i <= VIS_B; i += 1) {
    const angle = ringAngle(i);
    const x = ringX(angle);
    const y = ringY(angle);
    /* The beat reaches the far end of the line a little later. */
    const along = (angle - 90) / 180;
    let scale = 1;

    for (const [at, strength] of BEATS) {
      const t = progress - at - along * 0.05;
      if (t < 0 || t > BEAT_LEN) continue;

      const attack = clamp(t / 0.035, 0, 1);
      const decay = Math.pow(1 - t / BEAT_LEN, 2);
      scale += 0.4 * strength * attack * decay;

      if (frame.pulses.length < POOL.pulses) {
        frame.pulses.push({
          x,
          y,
          r: DOT + t * 380,
          opacity: strength * 0.4 * (1 - t / BEAT_LEN),
        });
      }
    }

    frame.dots[i] = makeDot(x, y, DOT * scale, DOT * scale, DOT * scale);
  }

  return frame;
}

/* ── 3. Manufacturing — the ring indexes forward one slot at a time ──────── */

function manufacturing(progress: number): ArtFrame {
  const frame = baseFrame();
  const steps = 5;
  const step = progress * steps;
  const index = Math.floor(step);
  const advance =
    (index + easeOutCubic(clamp((step - index) / 0.62, 0, 1))) * RING_STEP;
  const gate = hold(progress, 0.02, 0.12, 0.86, 0.12);

  frame.gate = gate;
  frame.dots = RING_DOTS.map((_, i) => {
    const angle = ringAngle(i) + advance;
    /* How near this dot is to the gate at 180°. */
    const off = Math.abs((((angle - 180 + 540) % 360) - 180));
    const near = clamp(1 - off / 26, 0, 1) * gate;
    const worked = clamp(near * 2.4, 0, 1);
    const size = DOT * (1 + 0.05 * near);

    return makeDot(
      ringX(angle),
      ringY(angle),
      size,
      size,
      lerp(DOT, 5, worked),
      0,
      1 - worked,
      worked,
    );
  });

  return frame;
}

/* ── 4. Automotive — the line splits into two lanes and overtakes ────────── */

function automotive(progress: number): ArtFrame {
  const frame = baseFrame();
  const lane = hold(progress, 0.05, 0.25, 0.74, 0.22);
  /* Two slots' worth of overtake. */
  const pass = (at: number) =>
    36 * easeInOutCubic(clamp((at - 0.18) / 0.6, 0, 1));
  const advance = pass(progress);
  const speed = clamp(
    (pass(progress + 0.004) - pass(progress - 0.004)) / 0.008 / 90,
    0,
    1,
  );

  frame.ring = { opacity: 0.55 * (1 - 0.7 * lane), width: 2.5 };

  if (lane > 0.002) {
    frame.lanes = [
      { scale: (R + 62 * lane) / R, opacity: 0.45 * lane },
      { scale: (R - 62 * lane) / R, opacity: 0.45 * lane },
    ];
  }

  frame.dots = RING_DOTS.map((_, i) => {
    /* The outer lane pulls ahead while the inner one drops back. */
    const outer = i % 2 === 0;
    const angle = ringAngle(i) + (outer ? advance : -advance);
    const radius = R + (outer ? 62 : -62) * lane;
    const stretch = DOT + 34 * speed * lane;

    return makeDot(
      ringX(angle, radius),
      ringY(angle, radius),
      stretch,
      DOT,
      DOT,
      tangentDeg(angle),
    );
  });

  return frame;
}

/* ── 5. Public Sector — the gaps fill in until nobody is left out ────────── */

function publicSector(progress: number): ArtFrame {
  const frame = baseFrame();
  let whole = 0;

  for (let i = SEAT_A; i <= SEAT_B; i += 1) {
    /* Counts in from the bottom of the arc. */
    const k = SEAT_B - i;
    const filled =
      ease(progress, k * 0.045, 0.2) *
      (1 - ease(progress, 0.7 + k * 0.011, 0.17));

    whole = Math.max(whole, filled);
    if (filled <= 0.01) continue;

    const angle = ringAngle(i) + RING_STEP / 2;
    const size = 30 * filled;
    frame.extras.push(
      makeDot(ringX(angle), ringY(angle), size, size, size, 0, filled),
    );
  }

  frame.ring = { opacity: 0.55 + 0.3 * whole, width: 2.5 + 1.5 * whole };
  frame.dots = RING_DOTS.map((dot) =>
    makeDot(
      dot.x,
      dot.y,
      DOT - 1.25,
      DOT - 1.25,
      DOT - 1.25,
      0,
      1 - whole,
      whole,
    ),
  );

  return frame;
}

const SCENES: Record<string, (progress: number) => ArtFrame> = {
  "financial-services": financial,
  healthcare,
  manufacturing,
  automotive,
  "public-sector": publicSector,
};

/** The scene for an industry; an unknown one falls back to the bare ring. */
export function industryFrame(industry: string, progress: number): ArtFrame {
  const scene = SCENES[industry];

  return scene ? scene(progress) : baseFrame();
}

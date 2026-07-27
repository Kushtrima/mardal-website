/**
 * The industries drawing, ported from the Industries film.
 *
 * The film plays on a 1920×1080 stage: the dot ring sits on the left and its
 * arc fades out past the halfway point, with the industry list on the right.
 * The same coordinates are kept here and the SVG viewBox does the scaling.
 * Seven industries, seven motion concepts — each scene is a pure function of
 * `progress` (0 → 1 across its own duration), so the component only has to
 * drive that one number and write the result onto elements it already
 * rendered.
 */

export const STAGE = { width: 1920, height: 1080 };

const CX = 700;
const CY = 540;
const R = 470;
const DOT = 24;
/** A full ring of 20 dots, 18° apart; only the left half is ever drawn. */
const RING_COUNT = 20;
const RING_STEP = 18;
/** The dots at rest — 108°…252°. */
const VIS_A = 6;
const VIS_B = 14;
const VIS_COUNT = VIS_B - VIS_A + 1;

/** Held still at this point of the scene when the visitor prefers less motion. */
export const REST_PROGRESS = 0.45;

export const SCENE_SECONDS: Record<string, number> = {
  finance: 5,
  healthcare: 6.4,
  manufacturing: 6.4,
  automotive: 5.4,
  retail: 5.6,
  logistics: 5.8,
  "public-sector": 6.2,
};

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

/** How far round from the left pole, where the drawing is strongest. */
const dev = (angle: number) => Math.abs((((angle - 180 + 540) % 360) - 180));
/** Dots fade out past the halfway point; the arc fades a little later. */
const vis = (angle: number) => clamp((95 - dev(angle)) / 16, 0, 1);
const lineVis = (angle: number) => clamp((118 - dev(angle)) / 32, 0, 1);

/* Rounded, because the server and the browser disagree on the last digit of a
   sine and React then reports the rendered SVG as a hydration mismatch. */
const round = (value: number) => Math.round(value * 1000) / 1000;

/**
 * The ring, walked in 4° steps as separate segments so it can fade to nothing
 * on the right — and so the Logistics scene can brighten the stretch a
 * shipment has already passed.
 */
export const RING_SEGMENTS = (() => {
  const segments: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    /** Where the segment sits, for scenes that light part of the arc. */
    angle: number;
    opacity: number;
  }[] = [];

  for (let angle = 60; angle < 300; angle += 4) {
    const opacity = Math.min(lineVis(angle), lineVis(angle + 4));
    if (opacity < 0.02) continue;

    segments.push({
      x1: round(ringX(angle)),
      y1: round(ringY(angle)),
      x2: round(ringX(angle + 4)),
      y2: round(ringY(angle + 4)),
      angle: angle + 2,
      opacity: round(opacity),
    });
  }

  return segments;
})();

export const RING_DOTS = Array.from({ length: RING_COUNT }, (_, index) => {
  const angle = ringAngle(index);

  return { x: round(ringX(angle)), y: round(ringY(angle)) };
});

/** The two posts the ring indexes between in the Manufacturing scene. */
export const GATE_LINES = [
  { x: 156, y1: 440, y2: 640 },
  { x: 304, y1: 440, y2: 640 },
];

export type ArtDot = {
  x: number;
  y: number;
  /** Half-width and half-height, so a dot can stretch or take a shape. */
  rx: number;
  ry: number;
  corner: number;
  rot: number;
  /** Whether the dot is drawn at all here — the fade toward the right. */
  op: number;
  fill: number;
  stroke: number;
};

export type ArtMover = { x: number; y: number; opacity: number };
export type ArtPulse = { x: number; y: number; r: number; opacity: number };
export type ArtLane = { scale: number; opacity: number };

export type ArtFrame = {
  /** One value per ring segment, so a scene can light part of the arc. */
  ring: { opacities: number[]; width: number };
  lanes: ArtLane[];
  gate: number;
  movers: ArtMover[];
  pulses: ArtPulse[];
  dots: ArtDot[];
};

/** How many of each shape a scene can ask for, so the pools are rendered once. */
export const POOL = {
  /** Finance splits every ring position into four. */
  dots: RING_COUNT * 4,
  movers: 1,
  /** Every dot in frame, with at most three beats overlapping on any one. */
  pulses: VIS_COUNT * 3,
  lanes: 2,
  segments: RING_SEGMENTS.length,
};

const makeDot = (
  x: number,
  y: number,
  rx = DOT,
  ry = DOT,
  corner = DOT,
  rot = 0,
  op = 1,
  fill = 1,
  stroke = 0,
): ArtDot => ({ x, y, rx, ry, corner, rot, op, fill, stroke });

const baseDots = () =>
  RING_DOTS.map((dot, index) =>
    makeDot(dot.x, dot.y, DOT, DOT, DOT, 0, vis(ringAngle(index))),
  );

/** The arc at a given strength, optionally brightened along part of its run. */
const arc = (strength = 0.55, boost?: (angle: number) => number) =>
  RING_SEGMENTS.map((segment) => {
    const value = segment.opacity * strength;

    return boost ? Math.min(1, value + boost(segment.angle)) : value;
  });

const baseFrame = (): ArtFrame => ({
  ring: { opacities: arc(), width: 2.5 },
  lanes: [],
  gate: 0,
  movers: [],
  pulses: [],
  dots: baseDots(),
});

/* ── 1. Finance — compounding: each dot splits in two, then four ─────────── */

const SPLIT_ONE = 4.6;
const SPLIT_TWO = 2.3;

function finance(progress: number): ArtFrame {
  const frame = baseFrame();
  const dots: ArtDot[] = [];

  for (let i = 0; i < RING_COUNT; i += 1) {
    const origin = ringAngle(i);
    /* The split runs down the line rather than everywhere at once. */
    const lag = clamp((VIS_B - i) / VIS_COUNT, 0, 1) * 0.14;
    const first = hold(progress, 0.04 + lag, 0.22, 0.7 + lag * 0.4, 0.24);
    const second = hold(progress, 0.3 + lag, 0.22, 0.62 + lag * 0.4, 0.22);
    const halved = lerp(DOT, DOT * 0.72, first);
    const size = lerp(halved, halved * 0.74, second);

    for (let k = 0; k < 4; k += 1) {
      const away = k < 2 ? -1 : 1;
      const apart = k % 2 ? 1 : -1;
      const angle =
        origin + away * SPLIT_ONE * first + apart * SPLIT_TWO * second;

      dots.push(
        makeDot(
          ringX(angle),
          ringY(angle),
          size,
          size,
          size,
          0,
          vis(angle),
        ),
      );
    }
  }

  frame.dots = dots;

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
    const seen = vis(angle);
    /* The beat reaches the far end of the line a little later. */
    const along = (angle - 108) / 144;
    let scale = 1;

    for (const [at, strength] of BEATS) {
      const t = progress - at - along * 0.05;
      if (t < 0 || t > BEAT_LEN) continue;

      const attack = clamp(t / 0.035, 0, 1);
      const decay = Math.pow(1 - t / BEAT_LEN, 2);
      scale += 0.15 * strength * attack * decay;

      if (frame.pulses.length < POOL.pulses) {
        frame.pulses.push({
          x,
          y,
          r: DOT + t * 380,
          opacity: strength * 0.4 * (1 - t / BEAT_LEN) * seen,
        });
      }
    }

    frame.dots[i] = makeDot(
      x,
      y,
      DOT * scale,
      DOT * scale,
      DOT * scale,
      0,
      seen,
    );
  }

  return frame;
}

/* ── 3. Manufacturing — the ring indexes forward one slot at a time ─────── */

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
    /* How near this dot is to the gate at the left pole. */
    const near = clamp(1 - dev(angle) / 26, 0, 1) * gate;
    const worked = clamp(near * 2.4, 0, 1);
    const size = DOT * (1 + 0.05 * near);

    return makeDot(
      ringX(angle),
      ringY(angle),
      size,
      size,
      lerp(DOT, 5, worked),
      0,
      vis(angle),
      1 - worked,
      worked,
    );
  });

  return frame;
}

/* ── 4. Automotive — the line splits into two lanes and overtakes ───────── */

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

  frame.ring = { opacities: arc(0.55 * (1 - 0.7 * lane)), width: 2.5 };

  if (lane > 0.002) {
    frame.lanes = [
      { scale: (R + 58 * lane) / R, opacity: 0.45 * lane },
      { scale: (R - 58 * lane) / R, opacity: 0.45 * lane },
    ];
  }

  frame.dots = RING_DOTS.map((_, i) => {
    /* The outer lane pulls ahead while the inner one drops back. */
    const outer = i % 2 === 0;
    const angle = ringAngle(i) + (outer ? advance : -advance);
    const radius = R + (outer ? 58 : -58) * lane;
    const stretch = DOT + 34 * speed * lane;

    return makeDot(
      ringX(angle, radius),
      ringY(angle, radius),
      stretch,
      DOT,
      DOT,
      tangentDeg(angle),
      vis(angle),
    );
  });

  return frame;
}

/* ── 5. Retail — the line becomes an assortment, then evens out again ───── */

/** Half-width, half-height and corner for each piece of stock. */
const GOODS: [number, number, number][] = [
  [20, 31, 5],
  [31, 19, 4],
  [24, 24, 3],
  [23, 23, 23],
  [15, 34, 6],
  [34, 15, 7],
  [23, 30, 11],
  [28, 21, 3],
  [17, 27, 5],
  [30, 17, 6],
];

function retail(progress: number): ArtFrame {
  const frame = baseFrame();

  frame.dots = RING_DOTS.map((_, i) => {
    const angle = ringAngle(i);
    const k = Math.max(0, i - VIS_A);
    const shown = hold(
      progress,
      0.05 + k * 0.045,
      0.22,
      0.62 + k * 0.028,
      0.24,
    );
    const goods = GOODS[i % GOODS.length];

    return makeDot(
      ringX(angle),
      ringY(angle),
      lerp(DOT, goods[0], shown),
      lerp(DOT, goods[1], shown),
      lerp(DOT, goods[2], shown),
      0,
      vis(angle),
    );
  });

  return frame;
}

/* ── 6. Logistics — a shipment is tracked down the line ─────────────────── */

const TRACK_FROM = 108;
const TRACK_TO = 252;

function logistics(progress: number): ArtFrame {
  const frame = baseFrame();
  /* The line goes open, then fills back in behind the shipment. */
  const open = ease(progress, 0.02, 0.13);
  const run = easeInOutCubic(clamp((progress - 0.17) / 0.74, 0, 1));
  const front = lerp(TRACK_FROM - 8, TRACK_TO + 8, run);
  const live = clamp(run * 12, 0, 1) * clamp((1 - run) * 12, 0, 1);
  const passed = (angle: number) => clamp((front - angle) / 9, 0, 1);

  frame.ring = {
    opacities: arc(0.55, (angle) =>
      angle > front
        ? 0
        : 0.4 * clamp(1 - (front - angle) / 150, 0, 1) * open,
    ),
    width: 2.5,
  };

  frame.dots = RING_DOTS.map((_, i) => {
    const angle = ringAngle(i);
    const solid = 1 - open * (1 - passed(angle));

    return makeDot(
      ringX(angle),
      ringY(angle),
      DOT - 1.25,
      DOT - 1.25,
      DOT - 1.25,
      0,
      vis(angle),
      solid,
      1 - solid,
    );
  });

  frame.movers.push({
    x: ringX(front),
    y: ringY(front),
    opacity: live * open,
  });

  return frame;
}

/* ── 7. Public Sector — the gaps fill in until nobody is left out ───────── */

function publicSector(progress: number): ArtFrame {
  const frame = baseFrame();
  const seats: ArtDot[] = [];
  let whole = 0;

  for (let i = VIS_A; i < VIS_B; i += 1) {
    /* Counts in from the bottom of the arc. */
    const k = VIS_B - 1 - i;
    const filled =
      ease(progress, k * 0.045, 0.2) *
      (1 - ease(progress, 0.7 + k * 0.011, 0.17));

    whole = Math.max(whole, filled);
    if (filled <= 0.01) continue;

    const angle = ringAngle(i) + RING_STEP / 2;
    const size = 13 * filled;
    seats.push(
      makeDot(
        ringX(angle),
        ringY(angle),
        size,
        size,
        size,
        0,
        filled * vis(angle),
      ),
    );
  }

  frame.ring = { opacities: arc(0.55 + 0.3 * whole), width: 2.5 + 1.5 * whole };
  frame.dots = RING_DOTS.map((dot, index) =>
    makeDot(
      dot.x,
      dot.y,
      DOT - 1.25,
      DOT - 1.25,
      DOT - 1.25,
      0,
      vis(ringAngle(index)),
      1 - whole,
      whole,
    ),
  ).concat(seats);

  return frame;
}

const SCENES: Record<string, (progress: number) => ArtFrame> = {
  finance,
  healthcare,
  manufacturing,
  automotive,
  retail,
  logistics,
  "public-sector": publicSector,
};

/** The scene for an industry; an unknown one falls back to the bare ring. */
export function industryFrame(industry: string, progress: number): ArtFrame {
  const scene = SCENES[industry];

  return scene ? scene(progress) : baseFrame();
}

/**
 * The hero film, ported from the reference piece.
 *
 * Every bar is a stack of small boxes, and the whole loop is those boxes
 * moving between five poses: they draw out of short marks on two rows, break
 * apart onto an even lattice, gather into nine columns, spread into a single
 * row of thin lines, then open back into the field, run a wave through it and
 * withdraw to the marks they started from. The last frame is the first, so the
 * loop closes without a cut.
 *
 * Pure geometry: no DOM, no React, no clock of its own. `heroFrame` is given a
 * time and fills an array that was allocated once — the component owns the
 * frame loop and writes the numbers onto elements it already made.
 */

const W = 1920;
/** Upper row: fixed top edge, its length is what changes. */
const ROWA = 635;
/** Lower row: runs off the bottom of the frame, its top edge is what changes. */
const ROWB = 865;
/** Below the frame — where the lower row bottoms out. */
const FOOT = 1400;

export const HERO_FIELD = { width: W, height: FOOT } as const;

/** One colour per pose, carried across each hand-off. */
const C_ENTER = "#8362b8";
const C_GRID = "#f1ce6d";
const C_PILL = "#6fdd9f";
const C_ROW = "#8ec5ef";
const C_WAVE = "#dacdf9";

type Bar = {
  x: number;
  w: number;
  row: "a" | "b";
  /** Upper-row bars only: how far down they reach when settled. */
  len?: number;
  /** Depth, 0 (far) to 1 (near). */
  d: number;
};

/** The bar field, in x order. */
const BARS: Bar[] = [
  { x: 6, w: 16, row: "a", len: 765, d: 0.15 },
  { x: 65, w: 16, row: "a", len: 765, d: 0.17 },
  { x: 124, w: 17, row: "b", d: 0.19 },
  { x: 180, w: 17, row: "a", len: 228, d: 0.22 },
  { x: 236, w: 17, row: "a", len: 228, d: 0.25 },
  { x: 263, w: 16, row: "a", len: 228, d: 0.26 },
  { x: 290, w: 16, row: "b", d: 0.28 },
  { x: 317, w: 16, row: "a", len: 228, d: 0.3 },
  { x: 343, w: 16, row: "a", len: 228, d: 0.32 },
  { x: 370, w: 17, row: "a", len: 228, d: 0.34 },
  { x: 398, w: 16, row: "b", d: 0.37 },
  { x: 424, w: 16, row: "a", len: 228, d: 0.39 },
  { x: 451, w: 16, row: "a", len: 228, d: 0.42 },
  { x: 526, w: 16, row: "a", len: 228, d: 0.5 },
  { x: 600, w: 16, row: "a", len: 228, d: 0.58 },
  { x: 643, w: 16, row: "b", d: 0.62 },
  { x: 686, w: 17, row: "b", d: 0.67 },
  { x: 740, w: 16, row: "b", d: 0.73 },
  { x: 794, w: 16, row: "a", len: 228, d: 0.78 },
  { x: 848, w: 16, row: "a", len: 228, d: 0.83 },
  { x: 901, w: 16, row: "a", len: 228, d: 0.87 },
  { x: 956, w: 16, row: "a", len: 228, d: 0.9 },
  { x: 1009, w: 17, row: "b", d: 0.91 },
  { x: 1037, w: 16, row: "a", len: 765, d: 0.92 },
  { x: 1064, w: 16, row: "a", len: 765, d: 0.92 },
  { x: 1131, w: 16, row: "a", len: 765, d: 0.91 },
  { x: 1199, w: 16, row: "b", d: 0.89 },
  { x: 1267, w: 16, row: "b", d: 0.84 },
  { x: 1334, w: 17, row: "b", d: 0.79 },
  { x: 1394, w: 16, row: "b", d: 0.73 },
  { x: 1453, w: 16, row: "a", len: 765, d: 0.67 },
  { x: 1513, w: 16, row: "b", d: 0.6 },
  { x: 1572, w: 16, row: "b", d: 0.53 },
  { x: 1628, w: 16, row: "b", d: 0.47 },
  { x: 1684, w: 16, row: "a", len: 228, d: 0.42 },
  { x: 1711, w: 16, row: "b", d: 0.39 },
  { x: 1738, w: 16, row: "b", d: 0.37 },
  { x: 1765, w: 16, row: "b", d: 0.34 },
  { x: 1791, w: 16, row: "a", len: 228, d: 0.32 },
  { x: 1818, w: 16, row: "b", d: 0.3 },
  { x: 1846, w: 16, row: "b", d: 0.28 },
  { x: 1872, w: 16, row: "b", d: 0.26 },
  { x: 1898, w: 16, row: "a", len: 228, d: 0.25 },
];

/** Each bar's centre across the field, 0 to 1 — what every stagger reads. */
const U = BARS.map((b) => (b.x + b.w / 2) / W);

const clamp = (v: number, min: number, max: number) =>
  v < min ? min : v > max ? max : v;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Takes either a hex or the `rgb()` string a previous mix produced, since one
 *  mix is fed into another where two colour moves overlap. */
function toRgb(colour: string) {
  if (colour.charAt(0) !== "#") {
    const parts = colour.replace(/[^0-9,.]/g, "").split(",");
    return [Number(parts[0]), Number(parts[1]), Number(parts[2])] as const;
  }
  return [
    parseInt(colour.slice(1, 3), 16),
    parseInt(colour.slice(3, 5), 16),
    parseInt(colour.slice(5, 7), 16),
  ] as const;
}

/** Colours are mixed to whole numbers so the server and browser agree. */
function mix(a: string, b: string, t: number) {
  const x = toRgb(a);
  const y = toRgb(b);
  return `rgb(${Math.round(lerp(x[0], y[0], t))},${Math.round(
    lerp(x[1], y[1], t),
  )},${Math.round(lerp(x[2], y[2], t))})`;
}

type Module = {
  row: "a" | "b";
  u: number;
  bar: number;
  /** Which box of its bar, and how many the bar has. */
  j: number;
  n: number;
  x: number;
  w: number;
  solidTop: number;
  solidH: number;
  /** Its slot on the lattice, and how late it leaves for it. */
  gx: number;
  gy: number;
  gLag: number;
  /** Its place in a column, and which column that is, 0 to 1. */
  pillX: number;
  pillW: number;
  pillTop: number;
  pillH: number;
  pcol: number;
};

/** Settled geometry — the pose every scene is measured against. */
function settled(b: Bar) {
  return b.row === "a"
    ? { x: b.x, w: b.w, top: ROWA, h: b.len ?? 0 }
    : { x: b.x, w: b.w, top: ROWB, h: FOOT - ROWB };
}

/**
 * The band every pose stands in.
 *
 * The lattice set it — ten rows of boxes at a 40 pitch — and the other three
 * are fitted to it, so each pose is the same height and sits in the same place
 * as the one before. Move these two numbers and the whole film follows.
 */
const BAND_TOP = 670;
const BAND_FOOT = 1046;
const BAND = BAND_FOOT - BAND_TOP;

/**
 * The settled field is drawn ROWA..FOOT, taller than the band, so it is mapped
 * into it rather than given a height of its own. Derived, not typed: the two
 * cannot drift apart.
 */
const BAR_SCALE = BAND / (FOOT - ROWA);

/**
 * How far the wave stretches and squashes a bar as it runs through the field.
 *
 * It is what decides how tall the settled pose gets, not the bars themselves:
 * across the field k spans 1 +/- this at the same moment, so the phase stands
 * 459 + 1071 x WAVE_A units tall. At the 0.5 it was drawn at that came to 994,
 * against 640 for the lattice, 431 for the columns and 386 for the row — the
 * one pose towering over the other three. 0.15 brings it to 620, in among
 * them.
 */
const WAVE_A = 0.15;
/** The lower row's share. Its foot is pinned, so this only lifts its top. */
const WAVE_B = 0.15;

const MODULES: Module[] = [];
BARS.forEach((b, i) => {
  const g = settled(b);
  const step = g.w * 2.4;
  /* Counted off the drawn height, so how many boxes a bar breaks into — and
     therefore every other pose, which is built from those same boxes — does
     not change with the scale. */
  const n = Math.max(1, Math.round(g.h / step));
  const seg = g.h / n;
  const scaledTop = BAND_TOP + (g.top - ROWA) * BAR_SCALE;
  const scaledSeg = seg * BAR_SCALE;
  for (let j = 0; j < n; j++) {
    MODULES.push({
      row: b.row,
      u: U[i],
      bar: i,
      j,
      n,
      x: g.x,
      w: g.w,
      solidTop: scaledTop + j * scaledSeg,
      solidH: scaledSeg,
      gx: 0,
      gy: 0,
      gLag: 0,
      pillX: 0,
      pillW: 0,
      pillTop: 0,
      pillH: 0,
      pcol: 0,
    });
  }
});

export const HERO_MODULE_COUNT = MODULES.length;

/* Ten full rows of evenly spaced boxes. Slots are handed out in x order, so a
   box from a left-hand bar lands in a left-hand slot: the field reorganises
   with the least travel instead of scattering. */
const GROWS = 10;
const GBOX = 16;
const GPITCH = 40;
const GMARGIN = 6;
const GY0 = BAND_FOOT - GBOX - (GROWS - 1) * GPITCH;
{
  const n = MODULES.length;
  const per = Math.floor(n / GROWS);
  const rem = n % GROWS;
  const slots: { x: number; y: number }[] = [];
  for (let r = 0; r < GROWS; r++) {
    const count = per + (r < rem ? 1 : 0);
    const step = (W - 2 * GMARGIN - GBOX) / (count - 1);
    for (let c = 0; c < count; c++) {
      slots.push({ x: GMARGIN + c * step, y: GY0 + r * GPITCH });
    }
  }
  slots.sort((p, q) => p.x - q.x || p.y - q.y);
  const order = MODULES.map((_, i) => i).sort(
    (i, j) =>
      MODULES[i].x - MODULES[j].x || MODULES[i].solidTop - MODULES[j].solidTop,
  );
  order.forEach((mi, k) => {
    const slot = slots[k];
    MODULES[mi].gx = slot.x;
    MODULES[mi].gy = slot.y;
    MODULES[mi].gLag = k / (order.length - 1);
  });
}

/* Nine even columns. Boxes are bucketed by where they already sit on the
   lattice, so each joins the column it is nearest to. */
const NP = 9;
const PW = 176;
const PMARG = 22;
const PGAP = (W - 2 * PMARG - NP * PW) / (NP - 1);
/* Proportions as drawn, scaled so the tallest column fills the band. */
const PILLH = [262, 371, 206, 340, 172, 376, 234, 308, 273];
{
  const n = MODULES.length;
  const per = Math.floor(n / NP);
  const rem = n % NP;
  const byX = MODULES.map((_, i) => i).sort(
    (a, b) => MODULES[a].gx - MODULES[b].gx || MODULES[a].gy - MODULES[b].gy,
  );
  let k = 0;
  for (let c = 0; c < NP; c++) {
    const count = per + (c < rem ? 1 : 0);
    const idx = byX.slice(k, k + count);
    k += count;
    idx.sort((a, b) => MODULES[a].gy - MODULES[b].gy || MODULES[a].gx - MODULES[b].gx);
    const colH = PILLH[c % PILLH.length];
    const band = colH / count;
    idx.forEach((mi, j) => {
      const m = MODULES[mi];
      m.pillX = PMARG + c * (PW + PGAP);
      m.pillW = PW;
      m.pillTop = BAND_FOOT - colH + j * band;
      m.pillH = band;
      m.pcol = c / (NP - 1);
    });
  }
}

/** One even row of thin lines. */
const ROWTOP = BAND_TOP;
const ROWLEN = BAND;
const ROWW = 16;
const ROWX = BARS.map((_, i) => 44 + i * ((1876 - ROWW - 44) / (BARS.length - 1)));

/** The pivot of the loop: the field withdraws to short marks and grows back
 *  out of them, so it never empties. */
const SEEDA = 78;
const SEEDB_TOP = 1004;

/* Every change of shape runs on the same clock, in seconds, so a scene takes
   the same time to move however long it then holds. */
const XLAG = 0.85;
const XEACH = 2.3;
const move = (t: number, lag: number) =>
  easeInOutCubic(clamp((t - lag * XLAG) / XEACH, 0, 1));

type Pose = { x: number; w: number; top: number; h: number };

const poseSolid = (m: Module): Pose => ({
  x: m.x,
  w: m.w,
  top: m.solidTop,
  h: m.solidH + 1.4,
});
const poseBox = (m: Module): Pose => ({ x: m.gx, w: GBOX, top: m.gy, h: GBOX });
const posePill = (m: Module): Pose => ({
  x: m.pillX,
  w: m.pillW,
  top: m.pillTop,
  h: m.pillH + 1.4,
});
const poseRow = (m: Module): Pose => {
  const seg = ROWLEN / m.n;
  return { x: ROWX[m.bar], w: ROWW, top: ROWTOP + m.j * seg, h: seg + 1.4 };
};
const poseSeed = (m: Module): Pose => {
  if (m.row === "a") {
    const seg = SEEDA / m.n;
    return { x: m.x, w: m.w, top: ROWA + m.j * seg, h: seg + 1.4 };
  }
  const seg = (FOOT - SEEDB_TOP) / m.n;
  return { x: m.x, w: m.w, top: SEEDB_TOP + m.j * seg, h: seg + 1.4 };
};

function blend(a: Pose, b: Pose, t: number, out: Frame) {
  out.x = lerp(a.x, b.x, t);
  out.w = lerp(a.w, b.w, t);
  out.y = lerp(a.top, b.top, t);
  out.h = lerp(a.h, b.h, t);
}

export type Frame = { x: number; y: number; w: number; h: number; fill: string };

/** The scenes, in order, with how long each holds. */
/* The two purple scenes — the field drawing out of its seed marks, and the
   wave that withdraws it back to them — are held at zero for now, so the loop
   runs lattice, columns, row and closes. Their own seconds are kept beside
   them: put 3.45 and 7.6 back to restore the full loop. */
const SCENES = [
  { name: "enter", seconds: 0 /* 3.45 */ },
  { name: "grid", seconds: 4.1 },
  { name: "pillars", seconds: 4.2 },
  { name: "row", seconds: 3.45 },
  { name: "bars", seconds: 3.45 },
  { name: "wave", seconds: 0 /* 7.6 */ },
] as const;

export const HERO_LOOP_SECONDS = SCENES.reduce((n, s) => n + s.seconds, 0);

/** An array the component can allocate once and hand back every frame. */
export function createHeroFrames(): Frame[] {
  /* The state the server paints and the first frame starts from: the two-band
     field, which is where the cycle hands over to the lattice. */
  return MODULES.map((m) => ({
    x: m.x,
    y: m.solidTop,
    w: m.w,
    h: m.solidH,
    fill: C_ENTER,
  }));
}

/**
 * Paints one frame of the loop into `frames`.
 *
 * @param elapsed seconds since the loop began; wraps on its own.
 */
export function heroFrame(elapsed: number, frames: Frame[]) {
  const loop = ((elapsed % HERO_LOOP_SECONDS) + HERO_LOOP_SECONDS) %
    HERO_LOOP_SECONDS;

  let scene = 0;
  let local = loop;
  while (scene < SCENES.length - 1 && local >= SCENES[scene].seconds) {
    local -= SCENES[scene].seconds;
    scene += 1;
  }
  const progress = local / SCENES[scene].seconds;

  for (let i = 0; i < MODULES.length; i++) {
    const m = MODULES[i];
    const f = frames[i];

    switch (SCENES[scene].name) {
      // The field draws out of the marks it withdrew to.
      case "enter": {
        const t = move(local, m.row === "a" ? m.u : 1 - m.u);
        blend(poseSeed(m), poseSolid(m), t, f);
        f.fill = C_ENTER;
        break;
      }
      // The bars come apart and every box takes a slot on one even lattice.
      case "grid": {
        /* Opens from the two-band field, which the bars scene before it ends
           on, so the cycle hands over without a cut. */
        const from = poseSolid(m);
        const to = poseBox(m);
        const tx = move(local, m.gLag);
        const ty = move(local - 0.5, m.gLag);
        f.x = lerp(from.x, to.x, tx);
        f.w = lerp(from.w, to.w, tx);
        f.y = lerp(from.top, to.top, ty);
        f.h = lerp(from.h, to.h, ty);
        f.fill = mix(C_ENTER, C_GRID, tx);
        break;
      }
      // The boxes migrate sideways and pack into nine columns.
      case "pillars": {
        const from = poseBox(m);
        const to = posePill(m);
        const tx = move(local, m.pcol);
        const ty = move(local - 0.5, m.pcol);
        f.x = lerp(from.x, to.x, tx);
        f.w = lerp(from.w, to.w, tx);
        f.y = lerp(from.top, to.top, ty);
        f.h = lerp(from.h, to.h, ty);
        f.fill = mix(C_GRID, C_PILL, tx);
        break;
      }
      // The columns break down into one even row of thin lines.
      case "row": {
        const t = move(local, m.u);
        blend(posePill(m), poseRow(m), t, f);
        f.fill = mix(C_PILL, C_ROW, t);
        break;
      }
      // The row opens back into the two-band field the loop rests on, and
      // hands straight back to the lattice.
      case "bars": {
        const t = move(local, m.u);
        blend(poseRow(m), poseSolid(m), t, f);
        f.fill = mix(C_ROW, C_ENTER, t);
        break;
      }
      // The row opens back into the field, a wave runs through it, and the
      // wave carries on into the withdrawal that Enter grows out of.
      default: {
        const tw = move(local, m.u);
        const s: Pose = { x: 0, w: 0, top: 0, h: 0 };
        const a = poseRow(m);
        const b = poseSolid(m);
        s.x = lerp(a.x, b.x, tw);
        s.w = lerp(a.w, b.w, tw);
        s.top = lerp(a.top, b.top, tw);
        s.h = lerp(a.h, b.h, tw);

        const q = clamp((progress - 0.43) / 0.33, 0, 1);
        const env = Math.sin(Math.PI * clamp(q, 0, 1));
        const phase = q * Math.PI * 3;
        // Part way through, the field returns to the brand colour it opened on.
        const back = easeInOutCubic(clamp((progress - 0.237) / 0.21, 0, 1));
        const fill = mix(mix(C_ROW, C_WAVE, tw), C_ENTER, back);
        const out = easeInOutCubic(
          clamp((progress - 0.72 - m.u * 0.1) / 0.18, 0, 1),
        );

        if (m.row === "a") {
          const dv = env * Math.sin(phase - m.u * 3.4);
          const k = 1 + WAVE_A * dv;
          f.x = s.x;
          f.w = s.w;
          f.y = ROWA + (s.top - ROWA) * k;
          f.h = s.h * k;
        } else {
          const dv = env * Math.sin(phase + m.u * 3.4 + Math.PI / 2);
          const k = 1 + WAVE_B * dv;
          f.x = s.x;
          f.w = s.w;
          f.y = FOOT - (FOOT - s.top) * k;
          f.h = s.h * k;
        }

        if (out > 0) {
          const now: Pose = { x: f.x, w: f.w, top: f.y, h: f.h };
          blend(now, poseSeed(m), out, f);
        }
        f.fill = fill;
        break;
      }
    }
  }
}

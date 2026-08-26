/**
 * How a traced hero pattern moves: a belt per band, some left, some right.
 *
 * Owner, 2026-08-26, correcting the first attempt: not a lullaby — some go left
 * and some go right, travelling until they run off their own end, and what
 * leaves one side comes back on the other. And leave the pattern design alone.
 *
 * The first version drifted each bar a few pixels and brought it back, which is
 * what "lullaby" was about and he was right: it read as one object breathing
 * rather than as anything travelling.
 *
 *     ── The belt, and why it needs no wrapping arithmetic ──
 *
 * Each band is drawn TWICE, the second copy exactly one canvas width away on
 * the side the band is travelling from. The pair then slides by exactly that
 * width and starts over. At the end of a lap the trailing copy is standing
 * precisely where the leading one began, so the restart is invisible and there
 * is no modulo, no bar jumping the gap, and no seam to tune. It costs a second
 * set of rectangles, which sit outside the viewBox and are clipped away
 * whenever they are not needed.
 *
 * The alternative — wrapping each bar's own position with `gsap.utils.wrap` —
 * is the same idea with the seam left in: a bar pops from one edge to the other
 * in a single frame, and it only hides if the bar happens to be fully off the
 * canvas at that moment, which for a 554-pixel bar it never is.
 *
 *     ── Why the band moves as one piece ──
 *
 * "Do not break the pattern design." A belt cannot keep the whole drawing
 * intact — bands sliding past each other is the motion that was asked for, and
 * the vertical alignments between bands go with it. What it CAN keep is every
 * band's own composition, and that is what giving a band one direction and one
 * speed does: the bars inside it hold their spacing exactly, for good, because
 * they are one object as far as the tween is concerned.
 *
 * Per-bar speeds were the other option and would smear each band into a
 * scatter within about ten seconds.
 *
 *     ── Why bands rather than rows ──
 *
 * The artwork is not laid out in rows. Clustering its bars by their vertical
 * centres gives lopsided groups of 2 to 43, because the drawing is a scatter
 * with dense patches, not a page of lines. A band of fixed height instead:
 * neighbours travel together, and each band opposes the one above it.
 */

/** Height of a band, in the artwork's own pixels. */
export const DRIFT_BAND = 68;

/** Seconds for one lap — a full canvas width. A texture, not an event. */
export const DRIFT_QUICK = 28;
export const DRIFT_SLOW = 56;

/** A traced bar: [x, y, width, height] in the artwork's own pixels. */
export type Bar = readonly [number, number, number, number];

/** A hero drawing traced off its PNG: the canvas it was drawn on, and its bars. */
export type Pattern = {
  readonly width: number;
  readonly height: number;
  readonly bars: ReadonlyArray<Bar>;
};

export type Band = {
  /** Its index down the artwork; also what decides its direction. */
  index: number;
  /** -1 left, 1 right. */
  direction: number;
  /** Seconds to travel one canvas width. */
  duration: number;
  bars: Bar[];
};

/**
 * Deterministic 0..1 from an integer — the sine hash, no `Math.random`.
 *
 * Bands need different speeds or the whole drawing shears as one piece. It has
 * to be deterministic so a band does not change character between two renders
 * of the same page, and so this file can be tested at all.
 */
export function driftHash(n: number): number {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** Which band a bar's own position puts it in, before neighbours are considered. */
export function bandOf([, y, , height]: Bar): number {
  return Math.floor((y + height / 2) / DRIFT_BAND);
}

/** Do these two rectangles share an edge? */
export function touching(a: Bar, b: Bar): boolean {
  const [ax, ay, aw, ah] = a;
  const [bx, by, bw, bh] = b;
  const across = Math.min(ax + aw, bx + bw) - Math.max(ax, bx);
  const down = Math.min(ay + ah, by + bh) - Math.max(ay, by);

  return (
    (across > 0 && (ay + ah === by || by + bh === ay)) ||
    (down > 0 && (ax + aw === bx || bx + bw === ax))
  );
}

/**
 * The artwork sorted into the belts that carry it, top to bottom.
 *
 * **Touching bars ride together, whatever their middles say.** The trace cuts
 * one drawn shape into several rectangles wherever its vertical extent changes
 * — an L is two of them, and a stepped block is three — and two pieces of one
 * shape put on different belts do not drift apart gracefully, they tear. 26
 * pairs in this artwork straddle a boundary, the first at [472,109].
 *
 * So adjacency wins over position: a bar joins whatever band the piece it is
 * touching ended up in, and the group settles on the band of its topmost member.
 * A hairline is a rendering artefact; this is not — it opens to a full canvas
 * width and closes again, once a lap, for as long as the page is open.
 */
export function bandsOf(bars: ReadonlyArray<Bar>): Band[] {
  const settled = bars.map(bandOf);

  /* Repeated until nothing moves: a chain of three pieces spanning two
     boundaries needs the first pass's answer before the second can use it. */
  for (let pass = 0; pass < bars.length; pass += 1) {
    let moved = false;

    for (let a = 0; a < bars.length; a += 1) {
      for (let b = a + 1; b < bars.length; b += 1) {
        if (settled[a] === settled[b]) continue;
        if (!touching(bars[a], bars[b])) continue;

        const top = Math.min(settled[a], settled[b]);
        settled[a] = top;
        settled[b] = top;
        moved = true;
      }
    }

    if (!moved) break;
  }

  const found = new Map<number, Bar[]>();
  bars.forEach((bar, at) => {
    const existing = found.get(settled[at]);
    if (existing) existing.push(bar);
    else found.set(settled[at], [bar]);
  });

  return [...found.entries()]
    .sort(([a], [b]) => a - b)
    .map(([index, banded]) => ({
      index,
      direction: index % 2 === 0 ? -1 : 1,
      duration: DRIFT_QUICK + driftHash(index) * (DRIFT_SLOW - DRIFT_QUICK),
      bars: banded,
    }));
}

/**
 * A band's bars as one path's worth of subpaths.
 *
 * **This is what closes the pale lines between blocks.** Two bars sharing an
 * edge are two shapes, and the shared boundary lands on a fraction of a pixel —
 * the artwork is 1447 units wide drawn at about 480, so nearly every edge does.
 * Each side gets its own partial coverage of that pixel and the two composite to
 * less than one. Inside a single path they are one shape: the rasteriser
 * accumulates the fill region before working out coverage, so a boundary between
 * two subpaths has nothing to composite. The mask never had the problem at all,
 * because a PNG is one shape by construction.
 *
 *     ── Measured, and it took two changes, not one ──
 *
 * Counting pale pixels with solid colour on both sides — the shape of a hairline
 * — on the Branding drawing:
 *
 *                      as rects   as one path
 *     slivers dropped       501           418
 *     slivers kept          572             9
 *
 * Neither alone is a fix. Dropping the trace's one-pixel slivers as
 * anti-aliasing takes out the pieces that JOIN bars, which opens real gaps that
 * no rendering change can close; keeping them without the path change makes it
 * slightly worse, because there are then more edges to seam. Together they land
 * at 9, against 14 for the original PNG mask rasterised the same way.
 *
 * A third change was tried and thrown away: small bridging rectangles laid over
 * every join, 291 of them on this drawing. They moved all three of the patterns
 * measured by exactly nothing — 9, 16 and 122 before and after — because the
 * path already had it. The measurement is the only reason to know that.
 *
 * Nothing is nudged, overlapped or snapped — the geometry is the trace, to the
 * pixel. Which is also what makes the sliver fix affordable: 303 subpaths and
 * 116 are the same 32 elements.
 */
export function barsPath(bars: ReadonlyArray<Bar>): string {
  return bars
    .map(([x, y, width, height]) => `M${x} ${y}h${width}v${height}h${-width}z`)
    .join("");
}

/**
 * Where a band's second copy stands: one canvas width away, on the side the
 * band is coming FROM, so it is the thing that arrives as the first copy leaves.
 */
export function trailingOffset(direction: number, canvasWidth: number): number {
  return -direction * canvasWidth;
}

/**
 * The banner across the top of a service page: a field of horizontal blocks,
 * the same redacted-text language the cards on the homepage are drawn in.
 *
 * Generated rather than traced. The card artwork is a fixed set of rectangles
 * lifted off the reference's own pixels, which is right for a box of a known
 * size and no use for a band that has to run the width of any window — so this
 * lays its own out on a grid: every row walked left to right, a block, a gap,
 * a block, with a block now and then twice the height so it merges into the
 * row beneath and the field stops reading as stripes.
 *
 * Rolled once, at module scope, from a counter rather than from chance. The
 * server and the browser have to draw the same thing, and `Math.random` would
 * give them two different fields and a hydration mismatch. Same seed, same
 * banner, every render.
 */

/**
 * The grid the blocks are laid on.
 *
 * Sized to the reference's own grain rather than to a round number. Its band
 * runs about forty cells across and twenty down, with cells a little wider
 * than they are tall. 52 x 22 came out finer than that and read as a texture;
 * 38 x 12 came out coarser and read as a wall. On a 1728 screen this gives
 * cells of roughly 38 x 23, and blocks between 75 and 375px wide — the
 * reference's own range.
 */
const COLS = 46;
const ROWS = 18;

/** [column, row, width in columns, height in rows] */
type Block = readonly [number, number, number, number];

/**
 * A small deterministic generator, so the field is the same on both sides of
 * the wire. Numerical Recipes' constants — nothing subtle is being asked of
 * it, only that it never surprises anyone.
 */
function seeded(seed: number) {
  let state = seed >>> 0;

  return function next() {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function layOut(): Block[] {
  const random = seeded(0x4d41524d);
  const blocks: Block[] = [];

  for (let row = 0; row < ROWS; row++) {
    /* Not every row starts on the margin, or the left edge becomes a rule. */
    let x = random() < 0.45 ? 1 + Math.floor(random() * 3) : 0;

    while (x < COLS) {
      /* Blocks are the field and the ground shows between them, not the other
         way round — but only about three parts to one. Wider blocks against
         narrower gaps closed the ground up almost entirely, which is a wall
         rather than a pattern. */
      const width = Math.min(2 + Math.floor(random() * 7), COLS - x);
      /* A block twice the height every so often. Where it overlaps the row
         below, the two read as one shape — which is what keeps the field from
         looking like ruled lines. */
      const height = random() < 0.22 ? 2 : 1;

      blocks.push([x, row, width, height]);

      x += width + 1 + Math.floor(random() * 3);
    }
  }

  return blocks;
}

const BLOCKS = layOut();

export function ServiceBanner({ tint = "two" }: { tint?: "one" | "two" | "three" | "four" }) {
  return (
    <div className={`service-banner service-banner--${tint}`} aria-hidden="true">
      <svg
        className="service-banner__field"
        viewBox={`0 0 ${COLS} ${ROWS}`}
        preserveAspectRatio="none"
        focusable="false"
      >
        {BLOCKS.map(([x, y, w, h]) => (
          <rect key={`${x}-${y}-${w}`} x={x} y={y} width={w} height={h} />
        ))}
      </svg>
    </div>
  );
}

/**
 * A piece of writing's own drawing.
 *
 * This site has no photographs and will not use stock, so writing has to find
 * its picture somewhere honest. It finds it in the language the rest of the
 * site already speaks: the arrangement behind all five service heroes, drawn
 * rather than traced, and set fresh for each piece.
 *
 * Read off `public/ai-automation-pattern.png`. Four properties make that
 * drawing recognisable and all four are rules here —
 *
 *   1. every edge lands on a column, so bars line up down the drawing;
 *   2. four weights, not a continuum, and the hairline is one of them;
 *   3. a thick bar is often shadowed by a hairline just above it;
 *   4. it is mostly empty. The black between the bars is the drawing.
 *
 * **A new piece needs no work to get its own pattern.** Every value below is
 * derived from the slug through a seeded generator, so writing a post is the
 * whole of it: give it an address and it has a drawing, permanently. That
 * matters twice over. The server and the browser render identical markup,
 * which `Math.random()` would break under RSC. And a piece keeps its drawing
 * for as long as it keeps its address — the picture is a property of the
 * writing, not of the moment the page was built.
 *
 * `tests/blog-pattern.test.mjs` asserts every published piece draws something
 * different, so a duplicate is a failing build rather than something to notice
 * later.
 */

/** Hairline, rule, bar, block. Discrete, because a continuum of heights reads
 *  as noise where four weights read as a system. */
const WEIGHTS = [1, 3, 6, 12];

/** One column and one row band, in user units, shared by both densities so the
 *  card mark and the article plate are the same drawing at two sizes rather
 *  than two drawings. */
const UNIT = 11;
const BAND = 8;

/**
 * How much grid a given box gets.
 *
 * Not one grid scaled. A mark is ~124px across: at plate density its hairlines
 * land under a third of a pixel and the whole thing greys out. Three separate
 * attempts at this mark failed the same way — artwork made of bars does not
 * survive being shrunk, it has to be redrawn at the size it will be seen.
 *
 * Both are close to 16:9 so a box can hold either without distortion.
 */
const DENSITIES = {
  /* Every value here matches what the mark was built and approved with, so
     these being knobs rather than constants changes nothing it draws. */
  mark: { columns: 12, rows: 6, quiet: 0, skip: 0.42, maxSpan: 4 },
  /* Coarser and emptier than the mark, in three ways that all pull the same
     direction: a 22-column grid rather than 28 so each bar is a bigger share
     of the drawing, `skip` up from 0.42 so fewer of the places on it are
     taken, and `quiet` emptying whole bands. The drawing this is taken from is
     not a texture — it is perhaps sixty large pieces with clear channels of
     nothing running between them, and it was the count that made the first
     version read as noise. `quiet` is zero on the mark: six rows cannot afford
     to lose one, and the roll only happens when it is non-zero. */
  plate: { columns: 22, rows: 17, quiet: 0.3, skip: 0.58, maxSpan: 5 },
} as const;

export type PatternDensity = keyof typeof DENSITIES;

type Block = { x: number; y: number; width: number; height: number };

/** FNV-1a. A slug is short and this only has to spread, not to be secure. */
function seedFrom(text: string): number {
  let hash = 2166136261;

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

/** mulberry32. Small, stable, and enough for deciding where a bar goes. */
function generator(seed: number): () => number {
  let state = seed;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function composePattern(
  slug: string,
  density: PatternDensity = "mark",
): Block[] {
  const { columns, rows, quiet, skip, maxSpan } = DENSITIES[density];
  /* The density is in the seed, so a piece's mark and its plate are two
     compositions of one drawing rather than the same one twice. */
  const random = generator(seedFrom(`${slug}:${density}`));
  const height = rows * BAND;
  const blocks: Block[] = [];

  for (let row = 0; row < rows; row += 1) {
    if (quiet > 0 && random() < quiet) continue;

    const y = row * BAND;
    let column = 0;

    while (column < columns) {
      /* The gaps are the composition. Skipping this often is what keeps the
         drawing from filling in and turning into a bar chart. */
      if (random() < skip) {
        column += 1 + Math.floor(random() * 2);
        continue;
      }

      const span = Math.min(columns - column, 1 + Math.floor(random() * maxSpan));
      const roll = random();
      const weight =
        roll < 0.18
          ? WEIGHTS[0]
          : roll < 0.6
            ? WEIGHTS[1]
            : roll < 0.88
              ? WEIGHTS[2]
              : WEIGHTS[3];

      const x = column * UNIT;
      const width = span * UNIT;

      /* A block on the last band would otherwise run past the viewBox and be
         cut by it, which reads as a rendering fault rather than as a crop. */
      const blockHeight = Math.min(weight, height - y);

      /* The shadow hairline, and only above something with enough weight to
         cast one. Set a column short so the two edges step rather than stack. */
      if (blockHeight >= WEIGHTS[2] && y >= 2 && random() < 0.32) {
        blocks.push({
          x,
          y: y - 2,
          width: Math.max(UNIT, width - UNIT),
          height: 1,
        });
      }

      blocks.push({ x, y, width, height: blockHeight });
      column += span + 1 + Math.floor(random() * 2);
    }
  }

  return blocks;
}

export function BlogPattern({
  slug,
  density = "mark",
  className = "blog-pattern",
}: {
  slug: string;
  density?: PatternDensity;
  className?: string;
}) {
  const { columns, rows } = DENSITIES[density];

  return (
    <svg
      className={className}
      viewBox={`0 0 ${columns * UNIT} ${rows * BAND}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      {composePattern(slug, density).map((block) => (
        <rect
          key={`${block.x}-${block.y}-${block.height}`}
          x={block.x}
          y={block.y}
          width={block.width}
          height={block.height}
        />
      ))}
    </svg>
  );
}

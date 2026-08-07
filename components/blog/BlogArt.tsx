/**
 * A mark for a piece of writing: a page of text with every word blacked out.
 *
 * This site has no photographs and will not use stock, so an index of writing
 * has to find its picture somewhere honest. It finds it in the language the
 * rest of the site already speaks — the redaction bars behind the difference
 * cards and inside all five service hero masks — drawn fresh for each piece
 * rather than repeated.
 *
 * RedactedLines could not do this. Its geometry is one fixed drawing traced
 * from a reference, 716 by 336 with no headroom, so its `offset` slides the
 * window off the bottom into empty space rather than onto different bars.
 *
 * Every value here is derived from the slug through a seeded generator, which
 * matters for two reasons. The server and the browser render the same markup,
 * which `Math.random()` would break under RSC. And a piece keeps its mark for
 * as long as it keeps its address: the drawing is a property of the writing,
 * not of the moment the page was built.
 */

const WIDTH = 720;
const HEIGHT = 405;

/* The page these bars are set on. Margins wide enough to read as a page rather
   than as a pattern that happens to stop. */
const MARGIN_X = 56;
const MARGIN_TOP = 44;
const LINE_HEIGHT = 26;
const BAR_HEIGHT = 9;
/* The space between two blacked-out words. Narrow, because it is a word space
   and not a column gutter. */
const WORD_GAP = 9;

/** FNV-1a. A slug is short and this only has to spread, not to be secure. */
function seedFrom(text: string): number {
  let hash = 2166136261;

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

/** mulberry32. Small, stable, and enough for deciding word widths. */
function generator(seed: number): () => number {
  let state = seed;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

type Bar = { x: number; y: number; width: number };

/**
 * Sets the page.
 *
 * Lines run the full measure until a paragraph ends, and the last line of a
 * paragraph stops short the way a real one does. That single rule is what makes
 * this read as writing rather than as a bar chart lying on its side.
 */
function compose(slug: string): Bar[] {
  const random = generator(seedFrom(slug));
  const bars: Bar[] = [];
  const measure = WIDTH - MARGIN_X * 2;

  let y = MARGIN_TOP;
  /* How many lines are left in the paragraph being set. */
  let linesLeft = 2 + Math.floor(random() * 4);

  while (y + BAR_HEIGHT <= HEIGHT - MARGIN_TOP) {
    const lastLine = linesLeft === 1;
    /* A closing line runs between a third and four fifths of the measure; every
       other line fills it. */
    const lineWidth = lastLine
      ? measure * (0.32 + random() * 0.48)
      : measure;

    let x = MARGIN_X;

    while (x < MARGIN_X + lineWidth - 12) {
      const remaining = MARGIN_X + lineWidth - x;
      const word = Math.min(
        remaining,
        /* Word lengths, roughly: mostly short, occasionally long. */
        18 + random() * (random() < 0.22 ? 128 : 62),
      );

      bars.push({ x, y, width: word });
      x += word + WORD_GAP;
    }

    y += LINE_HEIGHT;
    linesLeft -= 1;

    if (linesLeft === 0) {
      /* A paragraph break: one line of air, then a new run. */
      y += Math.round(LINE_HEIGHT * 0.7);
      linesLeft = 2 + Math.floor(random() * 4);
    }
  }

  return bars;
}

export function BlogArt({
  slug,
  className = "blog-art",
}: {
  slug: string;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      {compose(slug).map((bar) => (
        <rect
          key={`${bar.x}-${bar.y}`}
          x={bar.x.toFixed(1)}
          y={bar.y}
          width={bar.width.toFixed(1)}
          height={BAR_HEIGHT}
        />
      ))}
    </svg>
  );
}

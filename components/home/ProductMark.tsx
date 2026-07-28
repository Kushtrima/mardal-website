import { cn } from "../../lib/cn";

/**
 * The product drawings, traced from the reference.
 *
 * Bars on a 17-row lattice: 596 x 360, rows every 15.375px, each bar 15 tall.
 * Read off the reference by pixel classification rather than drawn by eye — a
 * regular lattice agrees with the source image on 97.7% of its pixels, which is
 * the same as the raw trace, so the geometry here is the reference's own with
 * the scan's half-pixel wobble taken out.
 *
 * The reference gives two arrangements and uses one of them twice. Repeating a
 * drawing across a row of three reads as a mistake rather than as a pattern, so
 * the third is that same arrangement turned over — the same vocabulary, no
 * third invention.
 *
 * No grey panel: the bars sit straight on the page.
 */

/** [x, y, width] — every bar is BAR_HEIGHT tall. */
type Bar = readonly [number, number, number];

const VIEW_WIDTH = 596;
const VIEW_HEIGHT = 360;
const BAR_HEIGHT = 15;

/** As traced. */
const ARRANGEMENT: readonly Bar[] = [
  [36, 44, 101], [137, 59, 83], [36, 75, 101], [137, 90, 83],
  [36, 106, 101], [473, 106, 67], [137, 121, 167], [36, 136, 101],
  [304, 136, 236], [137, 152, 167], [36, 167, 101], [304, 167, 236],
  [137, 182, 167], [36, 198, 101], [304, 198, 236], [220, 213, 84],
  [36, 228, 184], [304, 228, 102], [220, 244, 84], [406, 244, 134],
  [36, 259, 184], [220, 275, 84], [406, 275, 134], [36, 290, 184],
];

/** Turned left to right, as the reference's middle panel is. */
const MIRRORED: readonly Bar[] = ARRANGEMENT.map(
  ([x, y, w]) => [VIEW_WIDTH - (x + w), y, w] as const,
);

/**
 * Turned top to bottom: the lattice runs from y 44 to y 290, so reflecting a
 * row about its centre is 334 - y, which lands every bar back on the lattice.
 */
const FLIPPED: readonly Bar[] = ARRANGEMENT.map(
  ([x, y, w]) => [x, 334 - y, w] as const,
);

const marks = {
  first: ARRANGEMENT,
  second: MIRRORED,
  third: FLIPPED,
} as const;

export type ProductMarkName = keyof typeof marks;

type ProductMarkProps = {
  mark: ProductMarkName;
  className?: string;
};

export function ProductMark({ mark, className }: ProductMarkProps) {
  return (
    <svg
      className={cn("product-mark", className)}
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      role="presentation"
      aria-hidden="true"
    >
      {marks[mark].map(([x, y, w]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={BAR_HEIGHT} />
      ))}
    </svg>
  );
}

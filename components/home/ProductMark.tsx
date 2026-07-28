import { cn } from "../../lib/cn";

/**
 * The product drawings: one for each, in bars.
 *
 * The grid is the reference's own, read off it by pixel classification rather
 * than guessed — a 17-row lattice in a 596 x 360 field, rows every 15.375px,
 * each bar 15 tall, and bars that start and stop on seven shared edges. Keeping
 * that grid is what makes three different drawings look like one family.
 *
 * What changed from the reference is the density and the count. Its drawing
 * carries 24 bars over 21.3% of the field, which reads as crowded at the size
 * these sit at; each of these carries 14, over 14.5% to 17%.
 *
 * Each is two masses that interlock along a ragged edge — the reference's
 * character — and each hands over in a different place: the first from left to
 * right on the way down, the second the other way and starting higher, the
 * third meeting in the middle instead of crossing. Three arrangements, not one
 * turned three ways.
 *
 * No grey panel: the bars sit straight on the page.
 */

/** [x, y, width] — every bar is BAR_HEIGHT tall. */
type Bar = readonly [number, number, number];

const VIEW_WIDTH = 596;
const VIEW_HEIGHT = 360;
const BAR_HEIGHT = 15;

/** Left mass handing over to the right on the way down. */
const FIRST: readonly Bar[] = [
  [36, 44, 101], [36, 75, 101], [473, 90, 67], [36, 106, 184],
  [220, 121, 186], [36, 136, 184], [220, 152, 84], [36, 167, 101],
  [220, 182, 253], [36, 198, 184], [220, 213, 186], [36, 228, 101],
  [304, 244, 236], [36, 259, 101],
];

/** The same hand-over reversed, right to left, and starting a row higher. */
const SECOND: readonly Bar[] = [
  [406, 44, 134], [304, 75, 236], [36, 90, 184], [220, 106, 320],
  [36, 121, 101], [304, 136, 236], [36, 152, 268], [304, 167, 169],
  [36, 182, 101], [304, 198, 169], [36, 213, 184], [406, 228, 134],
  [36, 244, 101], [36, 275, 101],
];

/** Two masses that meet in the middle rather than crossing. */
const THIRD: readonly Bar[] = [
  [36, 59, 101], [473, 75, 67], [36, 90, 184], [406, 106, 134],
  [36, 121, 184], [304, 136, 236], [36, 152, 268], [406, 167, 134],
  [36, 182, 184], [304, 198, 236], [36, 213, 101], [406, 228, 134],
  [137, 259, 167], [137, 290, 83],
];

const marks = {
  first: FIRST,
  second: SECOND,
  third: THIRD,
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

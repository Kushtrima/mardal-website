/**
 * The bars behind a card title: rows of redaction blocks, the way a page of
 * text looks with every word blacked out.
 *
 * Not a pattern of my own — the rectangles below are traced from the reference,
 * straight off its pixels. The reference paints the same bars on each of its
 * cards and each title hides a different part of them, so two of its panels
 * were merged to recover what is covered; painted back over the original these
 * reproduce 98% of its pixels.
 *
 * Fixed geometry rather than anything rolled at runtime, so the server and the
 * browser draw the same thing, and every card carries the same drawing.
 */

/** [x, y, width, height] in the reference panel own pixels. */
const BARS: ReadonlyArray<readonly [number, number, number, number]> = [
  [106, 0, 255, 5],
  [416, 0, 56, 15],
  [106, 5, 183, 5],
  [355, 5, 6, 25],
  [106, 10, 117, 5],
  [106, 26, 117, 5],
  [416, 26, 56, 15],
  [106, 32, 183, 5],
  [106, 37, 244, 4],
  [0, 42, 223, 10],
  [294, 42, 56, 4],
  [703, 42, 13, 16],
  [471, 43, 116, 4],
  [0, 52, 107, 6],
  [703, 68, 13, 11],
  [0, 69, 107, 31],
  [294, 80, 56, 4],
  [587, 80, 129, 20],
  [222, 85, 122, 15],
  [0, 111, 107, 15],
  [222, 111, 122, 4],
  [587, 111, 129, 4],
  [222, 115, 78, 16],
  [703, 115, 13, 11],
  [376, 128, 30, 9],
  [106, 159, 117, 5],
  [376, 159, 30, 20],
  [471, 164, 116, 4],
  [106, 165, 194, 5],
  [0, 170, 300, 4],
  [703, 170, 13, 15],
  [0, 174, 222, 11],
  [299, 181, 41, 4],
  [299, 195, 41, 4],
  [703, 195, 13, 17],
  [0, 196, 223, 3],
  [0, 200, 106, 3],
  [373, 201, 33, 8],
  [0, 205, 106, 17],
  [222, 207, 76, 9],
  [587, 212, 129, 10],
  [407, 213, 65, 14],
  [587, 222, 117, 5],
  [587, 238, 117, 5],
  [407, 239, 65, 3],
  [410, 242, 62, 10],
  [587, 243, 129, 10],
  [0, 245, 48, 25],
  [55, 245, 52, 25],
  [222, 250, 76, 8],
  [703, 254, 13, 16],
  [294, 259, 4, 6],
  [294, 265, 56, 4],
  [0, 280, 44, 3],
  [294, 280, 56, 4],
  [703, 280, 13, 16],
  [0, 283, 107, 12],
  [471, 286, 116, 11],
  [410, 297, 6, 11],
  [471, 298, 233, 14],
  [355, 308, 61, 4],
  [355, 312, 6, 11],
  [355, 323, 61, 13],
  [471, 323, 233, 4],
  [471, 327, 116, 9],
];

/** The panel the bars were traced from. */
const WIDTH = 716;
const HEIGHT = 336;

export function RedactedLines({
  className = "difference-card__lines",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {BARS.map(([x, y, width, height]) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={width}
          height={height}
        />
      ))}
    </svg>
  );
}

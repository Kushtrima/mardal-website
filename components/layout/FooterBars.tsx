/**
 * The bar field in the corner of the footer panel.
 *
 * The hero's bars stand up off the bottom edge; these do the same in white on
 * the accent, which is what the reference shows. Fixed geometry rather than
 * anything rolled at runtime, so the server and the browser draw the same
 * thing and React has nothing to complain about.
 *
 * The field is cropped by the panel rather than sitting inside it.
 */
const VIEW_WIDTH = 640;
const VIEW_HEIGHT = 240;

/**
 * [x, y, width] — each bar runs from y to the bottom edge.
 *
 * The widths and the gaps vary on purpose. Set on a regular pitch they read as
 * a comb rather than as the hero's field, which is what the first pass did.
 */
const BARS: ReadonlyArray<readonly [number, number, number]> = [
  [0, 96, 9], [18, 22, 14], [44, 132, 8], [60, 108, 18],
  [88, 34, 10], [106, 146, 22], [138, 118, 9], [156, 28, 16],
  [182, 140, 11], [202, 100, 8], [218, 44, 20], [248, 126, 10],
  [266, 16, 12], [288, 150, 26], [322, 112, 9], [340, 38, 15],
  [364, 134, 8], [380, 104, 21], [410, 26, 11], [430, 144, 9],
  [448, 120, 17], [474, 48, 10], [492, 138, 24], [524, 108, 9],
  [542, 20, 13], [564, 148, 8], [580, 124, 19], [608, 32, 12],
  [628, 142, 12],
];

export function FooterBars() {
  return (
    <svg
      className="site-footer__bars"
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      preserveAspectRatio="xMaxYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      {BARS.map(([x, y, width]) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={width}
          height={VIEW_HEIGHT - y}
        />
      ))}
    </svg>
  );
}

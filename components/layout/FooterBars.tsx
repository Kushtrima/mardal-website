/**
 * The bar field in the corner of the footer panel, traced from the reference.
 *
 * Read straight off its pixels rather than drawn by eye: 22 bars, every one of
 * them 10 units wide, standing on two tiers — a tall one the full height of the
 * field and a short one exactly half of it. The gaps between them are irregular
 * and are the reference's own, not a rhythm of mine.
 *
 * In the reference the field is 636 x 198 in a 1084 x 572 panel, so it covers
 * the right 58.4% and the bottom 34.6%, and the last bar is cut off by the
 * panel's edge. Those proportions are kept in the CSS.
 *
 * Fixed geometry rather than anything rolled at runtime, so the server and the
 * browser draw the same thing.
 */
const VIEW_WIDTH = 636;
const VIEW_HEIGHT = 198;
const BAR_WIDTH = 10;

/** Half height, the reference's second tier. */
const SHORT = VIEW_HEIGHT / 2;

/** [x, y] — each bar runs from y to the foot of the field. */
const BARS: ReadonlyArray<readonly [number, number]> = [
  [0, 0], [39, SHORT], [76, 0], [94, SHORT], [112, 0], [130, SHORT],
  [147, 0], [197, 0], [225, SHORT], [261, 0], [296, 0], [332, SHORT],
  [350, 0], [395, SHORT], [439, SHORT], [479, 0], [518, SHORT],
  [555, 0], [573, SHORT], [590, 0], [608, SHORT], [626, 0],
];

export function FooterBars() {
  return (
    <svg
      className="site-footer__bars"
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {BARS.map(([x, y]) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={BAR_WIDTH}
          height={VIEW_HEIGHT - y}
        />
      ))}
    </svg>
  );
}

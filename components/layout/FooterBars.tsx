/**
 * The bar field the footer stands on, traced from the reference.
 *
 * It was a field in the bottom-right corner, 58.4% of the panel wide. It is the
 * panel's floor now — full width, edge to edge, under everything. The traced
 * geometry is unchanged and is still the only source of the arrangement.
 *
 * There are three kinds of bar, not two. Nine hang from the top of the field
 * and stop at its halfway line without ever reaching the bottom; ten stand on
 * the bottom half; three run the full height. Reading only where each bar
 * begins and assuming it ran to the foot of the field — which is what an
 * earlier pass did — turns the nine into full-height bars and draws a
 * different picture entirely.
 *
 * The field is 636 x 198 in the reference's 1084 x 572 panel, so it takes the
 * right 58.4% and is cut off by the panel's edge. Every bar is 10 wide and the
 * halfway line falls at 99.
 *
 * Fixed geometry rather than anything rolled at runtime, so the server and the
 * browser draw the same thing.
 */
const RUN_WIDTH = 636;
const VIEW_HEIGHT = 198;
const BAR_WIDTH = 10;
const HALF = VIEW_HEIGHT / 2;

type Kind = "top" | "foot" | "full";
type Bar = readonly [x: number, kind: Kind];

/** In the reference's own order, left to right. */
const TRACED: readonly Bar[] = [
  [0, "full"],
  [39, "foot"],
  [76, "top"],
  [94, "foot"],
  [112, "top"],
  [130, "foot"],
  [147, "top"],
  [197, "top"],
  [225, "foot"],
  [261, "top"],
  [296, "top"],
  [332, "foot"],
  [350, "full"],
  [395, "foot"],
  [439, "foot"],
  [479, "full"],
  [518, "foot"],
  [555, "top"],
  [573, "foot"],
  [590, "top"],
  [608, "foot"],
  [626, "top"],
];

/**
 * The run laid down twice, because the floor is twice as wide as the corner was.
 *
 * Stretching the traced 636 across the whole panel instead would have doubled
 * every bar's width — 10 units of 636 read at 1300px is a 20px bar — and the
 * bar's slenderness is the thing being looked at. Two runs keep it at 10 and
 * keep the spacing the reference has.
 *
 * The second pass rotates the three kinds rather than copying them: what hung
 * from the top now stands on the floor, what stood runs the full height, and
 * what ran full height hangs. Same density, same rhythm, different silhouette —
 * so the eye does not find the seam at halfway.
 */
const ROTATE: Record<Kind, Kind> = { top: "foot", foot: "full", full: "top" };
const VIEW_WIDTH = RUN_WIDTH * 2;
const BARS: readonly Bar[] = [
  ...TRACED,
  ...TRACED.map(([x, kind]): Bar => [x + RUN_WIDTH, ROTATE[kind]]),
];

/** Where each kind starts and how far it runs. */
const SPAN = {
  top: [0, HALF],
  foot: [HALF, HALF],
  full: [0, VIEW_HEIGHT],
} as const;

export function FooterBars() {
  return (
    <svg
      className="site-footer__bars"
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {BARS.map(([x, kind]) => {
        const [y, height] = SPAN[kind];

        return (
          <rect key={x} x={x} y={y} width={BAR_WIDTH} height={height} />
        );
      })}
    </svg>
  );
}

/**
 * The Websites hero drawing, as rectangles rather than as pixels.
 *
 * It was `public/web-platforms-apps-pattern-v6.png` used as a CSS mask — flat colour behind, the
 * bars cut out of it by the image's alpha. A bar in a mask cannot move: it is
 * not an element, so there is nothing to animate and no way to move one and
 * leave its neighbour. The owner asked for all five heroes to travel, each in
 * its OWN drawing, so each was read back out of its own alpha channel.
 *
 *     python3 SVG/trace-pattern.py public/web-platforms-apps-pattern-v6.png
 *
 * **A trace, not a redraw.** Nothing here was placed by hand or by eye. The trace is EXACT: rasterised back and
 * compared with the PNG at the size it is drawn, the mean alpha error is 0.00 of
 * 255. This artwork was exported from vector and has no anti-aliased edges to
 * lose, so the 46 rectangles below are the drawing, not an approximation of it.
 *
 * The PNG stays in `public/`. It is the source this was traced from.
 */

import type { Pattern } from "./pattern-drift";

/** [x, y, width, height], in the artwork's own 1447x1087 pixels. */
const BARS = [
  [443, 8, 147, 56],
  [704, 8, 55, 25],
  [1432, 8, 15, 25],
  [443, 69, 147, 18],
  [443, 111, 262, 28],
  [758, 111, 675, 26],
  [758, 137, 321, 4],
  [1079, 140, 113, 20],
  [822, 141, 257, 4],
  [443, 142, 262, 20],
  [1078, 145, 1, 25],
  [822, 150, 256, 20],
  [1078, 192, 369, 29],
  [1191, 221, 256, 3],
  [443, 263, 316, 27],
  [1432, 263, 15, 50],
  [203, 340, 241, 27],
  [1191, 340, 242, 58],
  [0, 425, 444, 95],
  [1078, 425, 355, 25],
  [1191, 450, 242, 1],
  [1078, 452, 355, 17],
  [1191, 469, 242, 4],
  [203, 537, 502, 43],
  [758, 537, 65, 36],
  [203, 585, 387, 17],
  [0, 619, 823, 28],
  [954, 619, 238, 28],
  [203, 647, 620, 2],
  [443, 649, 380, 2],
  [0, 650, 204, 15],
  [0, 772, 444, 32],
  [758, 772, 65, 26],
  [954, 772, 125, 26],
  [0, 821, 204, 35],
  [704, 821, 375, 49],
  [0, 861, 204, 21],
  [704, 872, 119, 23],
  [0, 914, 204, 43],
  [443, 914, 147, 33],
  [1078, 914, 355, 46],
  [1078, 960, 114, 13],
  [0, 982, 204, 33],
  [704, 982, 55, 59],
  [0, 1080, 444, 7],
  [1078, 1080, 369, 7],
] as const;

export const websitesPattern: Pattern = {
  width: 1447,
  height: 1087,
  bars: BARS,
};

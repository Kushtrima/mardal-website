/**
 * The CRM Solution hero drawing, as rectangles rather than as pixels.
 *
 * It was `public/crm-solutions-pattern-v5.png` used as a CSS mask — flat colour behind, the
 * bars cut out of it by the image's alpha. A bar in a mask cannot move: it is
 * not an element, so there is nothing to animate and no way to move one and
 * leave its neighbour. The owner asked for all five heroes to travel, each in
 * its OWN drawing, so each was read back out of its own alpha channel.
 *
 *     python3 SVG/trace-pattern.py public/crm-solutions-pattern-v5.png
 *
 * **A trace, not a redraw.** Nothing here was placed by hand or by eye. The trace is EXACT: rasterised back and
 * compared with the PNG at the size it is drawn, the mean alpha error is 0.00 of
 * 255. This artwork was exported from vector and has no anti-aliased edges to
 * lose, so the 44 rectangles below are the drawing, not an approximation of it.
 *
 * The PNG stays in `public/`. It is the source this was traced from.
 */

import type { Pattern } from "./pattern-drift";

/** [x, y, width, height], in the artwork's own 1447x1087 pixels. */
const BARS = [
  [0, 40, 204, 33],
  [443, 40, 316, 30],
  [954, 40, 493, 25],
  [1191, 65, 256, 4],
  [954, 67, 237, 17],
  [1191, 69, 1, 15],
  [0, 109, 204, 34],
  [589, 109, 116, 48],
  [1191, 109, 242, 52],
  [0, 145, 204, 22],
  [443, 197, 147, 37],
  [758, 197, 675, 33],
  [822, 230, 611, 19],
  [1078, 249, 355, 65],
  [203, 323, 556, 33],
  [1191, 323, 256, 27],
  [203, 356, 241, 3],
  [0, 376, 444, 95],
  [822, 376, 370, 27],
  [1432, 376, 15, 55],
  [822, 403, 133, 7],
  [955, 405, 124, 21],
  [954, 410, 1, 16],
  [1432, 436, 15, 24],
  [758, 498, 65, 29],
  [1191, 498, 242, 32],
  [1191, 532, 256, 22],
  [589, 596, 116, 92],
  [1191, 596, 242, 28],
  [589, 697, 170, 33],
  [822, 697, 133, 36],
  [704, 730, 55, 10],
  [0, 767, 1, 31],
  [1078, 767, 114, 111],
  [1432, 767, 15, 31],
  [0, 917, 444, 36],
  [589, 917, 170, 30],
  [822, 917, 257, 26],
  [704, 947, 55, 7],
  [704, 959, 55, 23],
  [589, 993, 490, 28],
  [589, 1021, 116, 8],
  [822, 1021, 257, 3],
  [589, 1034, 170, 19],
] as const;

export const crmSolutionPattern: Pattern = {
  width: 1447,
  height: 1087,
  bars: BARS,
};

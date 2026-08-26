/**
 * The Software hero drawing, as rectangles rather than as pixels.
 *
 * It was `public/custom-software-pattern-v5.png` used as a CSS mask — flat colour behind, the
 * bars cut out of it by the image's alpha. A bar in a mask cannot move: it is
 * not an element, so there is nothing to animate and no way to move one and
 * leave its neighbour. The owner asked for all five heroes to travel, each in
 * its OWN drawing, so each was read back out of its own alpha channel.
 *
 *     python3 SVG/trace-pattern.py public/custom-software-pattern-v5.png
 *
 * **A trace, not a redraw.** Nothing here was placed by hand or by eye. The trace is EXACT: rasterised back and
 * compared with the PNG at the size it is drawn, the mean alpha error is 0.00 of
 * 255. This artwork was exported from vector and has no anti-aliased edges to
 * lose, so the 40 rectangles below are the drawing, not an approximation of it.
 *
 * The PNG stays in `public/`. It is the source this was traced from.
 */

import type { Pattern } from "./pattern-drift";

/** [x, y, width, height], in the artwork's own 1447x1087 pixels. */
const BARS = [
  [589, 40, 116, 35],
  [822, 40, 257, 29],
  [589, 80, 116, 22],
  [0, 114, 590, 28],
  [954, 114, 479, 92],
  [0, 142, 444, 30],
  [444, 145, 146, 25],
  [0, 223, 204, 32],
  [1432, 223, 15, 50],
  [0, 300, 204, 31],
  [589, 300, 116, 25],
  [1191, 300, 256, 30],
  [589, 328, 170, 21],
  [203, 380, 241, 114],
  [822, 380, 133, 37],
  [1432, 380, 15, 118],
  [0, 515, 204, 25],
  [1432, 515, 15, 59],
  [0, 543, 444, 16],
  [0, 613, 1, 28],
  [203, 613, 241, 55],
  [704, 613, 55, 37],
  [1191, 613, 242, 53],
  [0, 646, 1, 19],
  [589, 688, 116, 59],
  [758, 688, 434, 32],
  [822, 720, 370, 20],
  [203, 856, 502, 26],
  [954, 856, 125, 35],
  [203, 882, 241, 9],
  [0, 908, 444, 58],
  [758, 908, 197, 26],
  [1432, 908, 15, 50],
  [0, 993, 590, 32],
  [758, 993, 197, 29],
  [1432, 993, 15, 43],
  [758, 1022, 65, 6],
  [0, 1053, 1, 28],
  [589, 1053, 116, 34],
  [1078, 1053, 355, 32],
] as const;

export const softwarePattern: Pattern = {
  width: 1447,
  height: 1087,
  bars: BARS,
};

/**
 * Geometry for the hero banner.
 *
 * The bars belong to the hero alone — they are not repeated anywhere else on
 * the page.
 */

export type LineRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** Viewbox of the CorelDRAW export the hero banner was traced from. */
export const HERO_VIEWBOX = {
  width: 47154.21,
  height: 12725.67,
} as const;

/** The 22 bars of the original banner. */
export const heroLineRects: LineRect[] = [
  { x: 0, y: 17.19, width: 799.96, height: 12703.57 },
  { x: 2919.5, y: 6360.38, width: 799.95, height: 6360.38 },
  { x: 5643.15, y: 0, width: 799.98, height: 6360.38 },
  { x: 6970.54, y: 6360.38, width: 799.95, height: 6360.38 },
  { x: 8273.82, y: 0, width: 799.96, height: 6360.38 },
  { x: 9602.81, y: 6360.38, width: 799.96, height: 6360.38 },
  { x: 10904.45, y: 0, width: 799.96, height: 6360.38 },
  { x: 14560.33, y: 0, width: 799.98, height: 6360.38 },
  { x: 16670.56, y: 6360.38, width: 799.95, height: 6360.38 },
  { x: 19311.46, y: 17.17, width: 799.95, height: 6360.38 },
  { x: 21943.72, y: 17.17, width: 799.98, height: 6360.38 },
  { x: 24584.59, y: 6251.68, width: 799.98, height: 6473.98 },
  { x: 25921.9, y: 17.19, width: 799.96, height: 12703.57 },
  { x: 29223.76, y: 6251.68, width: 799.96, height: 6473.98 },
  { x: 32530.32, y: 6360.38, width: 799.98, height: 6360.38 },
  { x: 35449.81, y: 17.19, width: 799.96, height: 12703.57 },
  { x: 38369.3, y: 6360.38, width: 799.95, height: 6360.38 },
  { x: 41092.97, y: 0, width: 799.96, height: 6360.38 },
  { x: 42420.34, y: 6360.38, width: 799.96, height: 6360.38 },
  { x: 43723.61, y: 0, width: 799.98, height: 6360.38 },
  { x: 45052.63, y: 6360.38, width: 799.94, height: 6360.38 },
  { x: 46354.26, y: 0, width: 799.95, height: 6360.38 },
];

/** Narrows every bar and drops a half-width bar into each gap. */
export function densifyLines(lines: LineRect[]): LineRect[] {
  return lines.flatMap((line, index) => {
    const narrowWidth = line.width * 0.5;
    const narrowedLine = {
      ...line,
      x: line.x + (line.width - narrowWidth) / 2,
      width: narrowWidth,
    };
    const nextLine = lines[index + 1];

    if (!nextLine) return [narrowedLine];

    const patternSource = index % 2 === 0 ? line : nextLine;
    const nextCenter = nextLine.x + nextLine.width / 2;
    const currentCenter = line.x + line.width / 2;
    const addedWidth = patternSource.width * 0.5;

    return [
      narrowedLine,
      {
        x: (currentCenter + nextCenter) / 2 - addedWidth / 2,
        y: patternSource.y,
        width: addedWidth,
        height: patternSource.height,
      },
    ];
  });
}

/** 43 bars — what the hero actually renders. */
export const heroBandLines = densifyLines(heroLineRects);

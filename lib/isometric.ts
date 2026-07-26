/**
 * A small isometric drawing system.
 *
 * The four Why Mardal illustrations are thin-line isometric drawings, so the
 * sections below reuse that language rather than inventing a second one. A
 * scene is described as blocks on a grid; this module projects them to
 * polygons and works out the viewBox, so no coordinates are hand-tuned.
 */

export type IsoBlock = {
  /** Grid position. `z` is the height the block sits at, so blocks can float. */
  x: number;
  y: number;
  z: number;
  /** Footprint and height. `h: 0` draws a flat plate. */
  w: number;
  d: number;
  h: number;
};

export type IsoFace = {
  kind: "top" | "left" | "right";
  points: string;
};

export type IsoScene = {
  faces: IsoFace[][];
  viewBox: string;
};

/** Classic 2:1-ish isometric projection. */
const ISO_X = 0.866;
const ISO_Y = 0.5;

type Point = { sx: number; sy: number };

function project(x: number, y: number, z: number): Point {
  return {
    sx: (x - y) * ISO_X,
    sy: (x + y) * ISO_Y - z,
  };
}

const toPoints = (points: Point[]) =>
  points
    .map(({ sx, sy }) => `${Math.round(sx * 1000) / 1000},${Math.round(sy * 1000) / 1000}`)
    .join(" ");

/**
 * The three faces a viewer can see: the top, and the two sides nearest the
 * camera (largest x and largest y).
 */
function blockFaces(block: IsoBlock): IsoFace[] {
  const { x, y, z, w, d, h } = block;
  const x1 = x + w;
  const y1 = y + d;
  const z1 = z + h;

  const top: IsoFace = {
    kind: "top",
    points: toPoints([
      project(x, y, z1),
      project(x1, y, z1),
      project(x1, y1, z1),
      project(x, y1, z1),
    ]),
  };

  if (h === 0) return [top];

  return [
    {
      kind: "left",
      points: toPoints([
        project(x, y1, z1),
        project(x1, y1, z1),
        project(x1, y1, z),
        project(x, y1, z),
      ]),
    },
    {
      kind: "right",
      points: toPoints([
        project(x1, y, z1),
        project(x1, y1, z1),
        project(x1, y1, z),
        project(x1, y, z),
      ]),
    },
    top,
  ];
}

/**
 * Painter's order: blocks further from the camera first. Depth is the
 * footprint centre, with height breaking ties so a floating block lands on top
 * of whatever it hovers over.
 */
function depth(block: IsoBlock) {
  return block.x + block.w / 2 + (block.y + block.d / 2);
}

function buildScene(blocks: IsoBlock[]): IsoScene {
  const ordered = [...blocks].sort((a, b) => depth(a) - depth(b) || a.z - b.z);
  const faces = ordered.map(blockFaces);

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const block of blocks) {
    for (const corner of [
      project(block.x, block.y, block.z),
      project(block.x + block.w, block.y, block.z),
      project(block.x, block.y + block.d, block.z),
      project(block.x + block.w, block.y + block.d, block.z),
      project(block.x, block.y, block.z + block.h),
      project(block.x + block.w, block.y, block.z + block.h),
      project(block.x, block.y + block.d, block.z + block.h),
      project(block.x + block.w, block.y + block.d, block.z + block.h),
    ]) {
      minX = Math.min(minX, corner.sx);
      minY = Math.min(minY, corner.sy);
      maxX = Math.max(maxX, corner.sx);
      maxY = Math.max(maxY, corner.sy);
    }
  }

  const pad = 0.12;
  const round = (value: number) => Math.round(value * 1000) / 1000;

  return {
    faces,
    viewBox: [
      round(minX - pad),
      round(minY - pad),
      round(maxX - minX + pad * 2),
      round(maxY - minY + pad * 2),
    ].join(" "),
  };
}

const block = (
  x: number,
  y: number,
  z: number,
  w: number,
  d: number,
  h: number,
): IsoBlock => ({ x, y, z, w, d, h });

/** A flat field of tiles, used by the platform scene. */
function tileField(columns: number, rows: number, pitch: number, size: number) {
  const tiles: IsoBlock[] = [];

  for (let column = 0; column < columns; column += 1) {
    for (let row = 0; row < rows; row += 1) {
      tiles.push(block(column * pitch, row * pitch, 0, size, size, 0.1));
    }
  }

  return tiles;
}

const scenes = {
  /** Routine work below, intelligence lifting out of it. */
  "ai-automation": [
    block(0, 0, 0, 1, 1, 0.18),
    block(1.15, 0, 0, 1, 1, 0.18),
    block(0, 1.15, 0, 1, 1, 0.18),
    block(1.15, 1.15, 0, 1, 1, 0.18),
    block(0.575, 0.575, 1.3, 1, 1, 1),
  ],
  /** Four systems, joined on every side. */
  "system-integration": [
    block(0, 0, 0, 0.85, 0.85, 0.85),
    block(1.95, 0, 0, 0.85, 0.85, 0.85),
    block(0, 1.95, 0, 0.85, 0.85, 0.85),
    block(1.95, 1.95, 0, 0.85, 0.85, 0.85),
    block(0.8, 0.28, 0.32, 1.2, 0.3, 0.12),
    block(0.8, 2.23, 0.32, 1.2, 0.3, 0.12),
    block(0.28, 0.8, 0.32, 0.3, 1.2, 0.12),
    block(2.23, 0.8, 0.32, 0.3, 1.2, 0.12),
  ],
  /** Everything narrowing down to one place to work. */
  "crm-solutions": [
    block(0, 0, 0, 2.6, 2.6, 0.22),
    block(0.45, 0.45, 0.22, 1.7, 1.7, 0.22),
    block(0.85, 0.85, 0.44, 0.9, 0.9, 0.22),
    block(1.05, 1.05, 0.66, 0.5, 0.5, 0.6),
  ],
  /** Parts cut to fit each other rather than a standard shape. */
  "custom-software": [
    block(0, 0, 0, 1.2, 0.8, 1.35),
    block(1.3, 0, 0, 0.8, 1.9, 0.7),
    block(0, 0.9, 0, 0.7, 1, 0.95),
    block(0.8, 1.1, 0, 0.9, 0.8, 1.7),
    block(0, 2, 0, 2.1, 0.6, 0.45),
  ],
  /** A broad surface with room to build on. */
  "web-platforms": [
    ...tileField(4, 3, 0.85, 0.75),
    block(0.85, 0.85, 0.1, 0.75, 0.75, 0.95),
    block(2.55, 0, 0.1, 0.75, 0.75, 0.6),
  ],
  /** A core held on a base, with a second piece kept clear of it. */
  "arvena-ai": [
    block(0, 0, 0, 2.2, 2.2, 0.16),
    block(0.65, 0.65, 0.16, 0.9, 0.9, 1),
    block(1.85, -0.35, 1.45, 0.55, 0.55, 0.55),
  ],
  /** Cards fanned out, one per guest. */
  ftesa: [
    block(0, 0, 0, 1.6, 1.1, 0.1),
    block(0.5, 0.55, 0.8, 1.6, 1.1, 0.1),
    block(1, 1.1, 1.6, 1.6, 1.1, 0.1),
  ],
  /** A run along one rail, from first call to final invoice. Kept low and
      blocky so it reads as stages, not as the hero's bars. */
  ihrauto: [
    block(0, 0.9, 0, 3.4, 0.55, 0.1),
    block(0.05, 0.6, 0.1, 0.72, 0.95, 0.5),
    block(0.9, 0.6, 0.1, 0.72, 0.95, 0.72),
    block(1.75, 0.6, 0.1, 0.72, 0.95, 0.94),
    block(2.6, 0.6, 0.1, 0.72, 0.95, 1.16),
  ],
  /** One block, used as the marker above each sector in the industries strip.
      It is a mark rather than a drawing, so it stays a single cube. */
  "sector-mark": [block(0, 0, 0, 1, 1, 1)],
  /** The flagship — a taller relative of the Arvena product drawing, since it
      is the same product looked at more closely. */
  "case-study": [
    block(0, 0, 0, 2.8, 2.8, 0.18),
    block(0.5, 0.5, 0.18, 1.8, 1.8, 0.18),
    block(1, 1, 0.36, 0.8, 0.8, 1.7),
    block(0.1, 2.35, 1.2, 0.55, 0.55, 0.55),
    block(2.35, 0.1, 1.55, 0.5, 0.5, 0.5),
  ],
} satisfies Record<string, IsoBlock[]>;

export type IsoSceneName = keyof typeof scenes;

/** Describes the drawing rather than repeating the heading beside it. */
export const isoSceneLabels: Record<IsoSceneName, string> = {
  "ai-automation": "Animated isometric tiles beneath a raised cube",
  "system-integration": "Animated isometric blocks joined on every side",
  "crm-solutions": "Animated isometric steps narrowing to one point",
  "custom-software": "Animated isometric blocks fitted to each other",
  "web-platforms": "Animated isometric tiled surface",
  "arvena-ai": "Animated isometric core resting on a base",
  ftesa: "Animated isometric cards fanned out",
  ihrauto: "Animated isometric run of blocks along a rail",
  "sector-mark": "Isometric cube",
  "case-study": "Animated isometric layered platform",
};

const built = Object.fromEntries(
  Object.entries(scenes).map(([name, blocks]) => [name, buildScene(blocks)]),
) as Record<IsoSceneName, IsoScene>;

export function isometricScene(name: IsoSceneName): IsoScene {
  return built[name];
}

/** Number of tint phases defined in globals.css. */
export const ISO_PHASE_COUNT = 5;

/** Stepping by 3 (coprime with 5) keeps neighbouring blocks out of sync. */
export function isoPhaseClass(index: number) {
  return `iso-block--phase-${((index * 3) % ISO_PHASE_COUNT) + 1}`;
}

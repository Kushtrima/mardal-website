import { cn } from "../../lib/cn";
import {
  isoPhaseClass,
  isoSceneLabels,
  isometricScene,
} from "../../lib/isometric";
import type { IsoSceneName } from "../../lib/isometric";

type IsometricArtProps = {
  scene: IsoSceneName;
  className?: string;
  /** Shifts the tint cycle, so repeats of one scene do not pulse together. */
  phase?: number;
};

/**
 * Thin-line isometric drawing, in the same language as the Why Mardal
 * illustrations: `currentColor` fill, ink hairline, and a slow tint cycle
 * driven entirely by CSS keyframes — no JavaScript.
 */
export function IsometricArt({ scene, className, phase = 0 }: IsometricArtProps) {
  const { faces, viewBox } = isometricScene(scene);

  return (
    <svg
      className={cn("iso-art", className)}
      viewBox={viewBox}
      role="img"
      aria-label={isoSceneLabels[scene]}
    >
      {faces.map((blockFaces, index) => (
        <g className={cn("iso-block", isoPhaseClass(index + phase))} key={index}>
          {blockFaces.map((face) => (
            <polygon
              className={`iso-block__face iso-block__face--${face.kind}`}
              points={face.points}
              key={face.kind}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

import { cn } from "../../lib/cn";

const pixelArrowDots = [
  [1, 3],
  [2, 3],
  [3, 3],
  [4, 3],
  [5, 3],
  [6, 3],
  [6, 2],
  [6, 4],
  [6, 1],
  [6, 5],
  [7, 2],
  [7, 4],
  [7, 3],
  [8, 3],
] as const;

export type PixelArrowSize = "small" | "compact" | "medium" | "large";
export type PixelArrowDirection = "right" | "left" | "up" | "up-right";
export type PixelArrowShape = "circle" | "square";

type PixelArrowProps = {
  animated?: boolean;
  className?: string;
  direction?: PixelArrowDirection;
  shape?: PixelArrowShape;
  size?: PixelArrowSize;
};

export function PixelArrow({
  animated = true,
  className,
  direction = "right",
  shape = "circle",
  size = "medium",
}: PixelArrowProps) {
  const isCornerArrow = direction === "up-right";

  return (
    <span
      className={cn(
        "pixel-arrow",
        `pixel-arrow--${size}`,
        `pixel-arrow--${direction}`,
        `pixel-arrow--${shape}`,
        animated && "pixel-arrow--animated",
        className,
      )}
      aria-hidden="true"
    >
      {isCornerArrow ? (
        <>
          <span className="pixel-arrow__corner-shaft" data-step="0" />
          <span className="pixel-arrow__corner-head-top" data-step="1" />
          <span className="pixel-arrow__corner-head-side" data-step="2" />
        </>
      ) : (
        pixelArrowDots.map(([column, row], step) => (
          <span
            key={`${column}-${row}`}
            data-column={column}
            data-row={row}
            data-step={step}
          />
        ))
      )}
    </span>
  );
}

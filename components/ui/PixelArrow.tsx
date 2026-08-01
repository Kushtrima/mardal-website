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

const pixelCornerArrowDots = [
  [1, 8, 0],
  [2, 7, 2],
  [3, 6, 4],
  [4, 5, 6],
  [5, 4, 8],
  [6, 3, 10],
  [7, 2, 12],
  [8, 1, 13],
  [5, 2, 13],
  [6, 2, 13],
  [8, 2, 13],
  [5, 1, 13],
  [6, 1, 13],
  [7, 1, 13],
  [7, 3, 13],
  [8, 3, 13],
  [7, 4, 13],
  [8, 4, 13],
] as const;

export type PixelArrowSize = "small" | "compact" | "medium" | "large";
export type PixelArrowDirection = "right" | "left" | "up" | "up-right";
export type PixelArrowShape = "circle" | "square";
export type PixelArrowVariant = "pixel" | "corner";

type PixelArrowProps = {
  animated?: boolean;
  className?: string;
  direction?: PixelArrowDirection;
  shape?: PixelArrowShape;
  size?: PixelArrowSize;
  variant?: PixelArrowVariant;
};

export function PixelArrow({
  animated = true,
  className,
  direction = "right",
  shape = "circle",
  size = "medium",
  variant = "pixel",
}: PixelArrowProps) {
  const isCornerArrow = variant === "corner";

  return (
    <span
      className={cn(
        "pixel-arrow",
        `pixel-arrow--${size}`,
        `pixel-arrow--${direction}`,
        `pixel-arrow--${shape}`,
        `pixel-arrow--${variant}`,
        animated && "pixel-arrow--animated",
        className,
      )}
      aria-hidden="true"
    >
      {isCornerArrow ? (
        pixelCornerArrowDots.map(([column, row, step]) => (
          <span
            key={`${column}-${row}`}
            data-column={column}
            data-row={row}
            data-step={step}
          />
        ))
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

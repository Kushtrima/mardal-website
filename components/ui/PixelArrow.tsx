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
  [1, 9, 0],
  [2, 9, 1],
  [2, 8, 2],
  [3, 8, 3],
  [3, 7, 4],
  [4, 7, 5],
  [4, 6, 6],
  [5, 6, 7],
  [5, 5, 8],
  [6, 5, 9],
  [8, 5, 12],
  [9, 5, 13],
  [6, 4, 10],
  [7, 4, 11],
  [8, 4, 12],
  [9, 4, 13],
  [7, 3, 11],
  [8, 3, 12],
  [9, 3, 13],
  [5, 2, 9],
  [6, 2, 10],
  [7, 2, 11],
  [8, 2, 12],
  [9, 2, 13],
  [5, 1, 9],
  [6, 1, 10],
  [7, 1, 11],
  [8, 1, 12],
  [9, 1, 13],
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

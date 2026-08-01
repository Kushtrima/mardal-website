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

export type PixelArrowSize = "small" | "medium" | "large";
export type PixelArrowDirection = "right" | "left";

type PixelArrowProps = {
  animated?: boolean;
  className?: string;
  direction?: PixelArrowDirection;
  size?: PixelArrowSize;
};

export function PixelArrow({
  animated = true,
  className,
  direction = "right",
  size = "medium",
}: PixelArrowProps) {
  return (
    <span
      className={cn(
        "pixel-arrow",
        `pixel-arrow--${size}`,
        direction === "left" && "pixel-arrow--left",
        animated && "pixel-arrow--animated",
        className,
      )}
      aria-hidden="true"
    >
      {pixelArrowDots.map(([column, row], step) => (
        <span
          key={`${column}-${row}`}
          data-column={column}
          data-row={row}
          data-step={step}
        />
      ))}
    </span>
  );
}

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
  [1, 1, 0],
  [2, 1, 1],
  [1, 2, 0],
  [2, 2, 1],
  [3, 2, 2],
  [2, 3, 2],
  [3, 3, 3],
  [4, 3, 4],
  [3, 4, 4],
  [4, 4, 5],
  [5, 4, 6],
  [9, 4, 13],
  [4, 5, 6],
  [5, 5, 7],
  [6, 5, 8],
  [8, 5, 12],
  [9, 5, 13],
  [5, 6, 8],
  [6, 6, 9],
  [7, 6, 11],
  [8, 6, 12],
  [9, 6, 13],
  [6, 7, 9],
  [7, 7, 11],
  [8, 7, 12],
  [9, 7, 13],
  [5, 8, 8],
  [6, 8, 9],
  [7, 8, 11],
  [8, 8, 12],
  [9, 8, 13],
  [4, 9, 6],
  [5, 9, 8],
  [6, 9, 9],
  [7, 9, 11],
  [8, 9, 12],
  [9, 9, 13],
] as const;

const pixelXDots = [
  [1, 1],
  [7, 1],
  [2, 2],
  [6, 2],
  [3, 3],
  [5, 3],
  [4, 4],
  [3, 5],
  [5, 5],
  [2, 6],
  [6, 6],
  [1, 7],
  [7, 7],
] as const;

export type PixelArrowSize = "small" | "compact" | "medium" | "large";
export type PixelArrowDirection =
  | "right"
  | "left"
  | "up"
  | "up-right"
  | "down-right";
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

type PixelXProps = {
  animated?: boolean;
  className?: string;
  shape?: PixelArrowShape;
  size?: PixelArrowSize;
};

export function PixelX({
  animated = true,
  className,
  shape = "circle",
  size = "medium",
}: PixelXProps) {
  return (
    <span
      className={cn(
        "pixel-arrow",
        "pixel-x",
        `pixel-arrow--${size}`,
        `pixel-arrow--${shape}`,
        animated && "pixel-arrow--animated",
        className,
      )}
      aria-hidden="true"
    >
      {pixelXDots.map(([column, row], step) => (
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

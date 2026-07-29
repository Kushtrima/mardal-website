import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

/**
 * The page's one measure: the window, less its margins.
 *
 * There used to be a `wide` variant on top of this, and every caller asked for
 * it — which was the tell that it was not a variant at all. It set a
 * `max-width` above the width the base already computed, and `max-width` can
 * only reduce a width, so it never once had an effect.
 */
export function Container({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("container", className)} {...props} />;
}

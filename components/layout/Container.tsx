import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  wide?: boolean;
};

export function Container({
  wide = false,
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn("container", wide && "container--wide", className)}
      {...props}
    />
  );
}

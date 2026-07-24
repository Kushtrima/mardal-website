import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "../../lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "small" | "default" | "large";

type CommonProps = {
  children: ReactNode;
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

type LinkButtonProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type NativeButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

export type ButtonProps = LinkButtonProps | NativeButtonProps;

export function Button({
  children,
  className,
  size = "default",
  variant = "primary",
  ...props
}: ButtonProps) {
  const classes = cn(
    "button",
    `button--${variant}`,
    size !== "default" && `button--${size}`,
    className,
  );

  if ("href" in props && props.href) {
    return (
      <a
        className={classes}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={classes}
      type="button"
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}

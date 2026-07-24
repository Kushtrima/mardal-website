"use client";

import { useLayoutEffect, useRef } from "react";
import type { HTMLAttributes } from "react";
import gsap from "gsap";
import { revealPresets, type RevealPreset } from "../../lib/motion";

type RevealProps = HTMLAttributes<HTMLDivElement> & {
  delay?: number;
  preset?: RevealPreset;
};

export function Reveal({
  children,
  delay = 0,
  preset = "up",
  ...props
}: RevealProps) {
  const element = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!element.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(element.current, { clearProps: "all" });
      return;
    }

    const animation = revealPresets[preset];
    const context = gsap.context(() => {
      gsap.fromTo(element.current, animation.from, {
        ...animation.to,
        delay,
        duration: 0.8,
        ease: "power3.out",
      });
    }, element);

    return () => context.revert();
  }, [delay, preset]);

  return (
    <div ref={element} {...props}>
      {children}
    </div>
  );
}

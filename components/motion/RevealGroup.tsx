"use client";

import { useLayoutEffect, useRef } from "react";
import type { HTMLAttributes } from "react";
import gsap from "gsap";
import { revealPresets } from "../../lib/motion";
import type { RevealPreset } from "../../lib/motion";

type RevealGroupProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "ol" | "ul";
  preset?: RevealPreset;
  stagger?: number;
};

/**
 * Staggers `[data-reveal-item]` descendants in once the group scrolls into
 * view, and optionally draws a single `[data-reveal-line]` connector with them.
 *
 * It renders the layout element itself, so it adds no extra DOM. Keeping the
 * observer here means each section stays a server component and its copy never
 * reaches the browser bundle.
 */
export function RevealGroup({
  as = "div",
  preset = "up",
  stagger = 0.09,
  children,
  ...rest
}: RevealGroupProps) {
  const groupRef = useRef<HTMLElement | null>(null);
  const setGroup = (node: HTMLElement | null) => {
    groupRef.current = node;
  };

  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    const items = Array.from(
      group.querySelectorAll<HTMLElement>("[data-reveal-item]"),
    );
    const line = group.querySelector<HTMLElement>("[data-reveal-line]");
    const animated = line ? [...items, line] : items;

    if (!items.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(animated, { clearProps: "all" });
      return;
    }

    // The connector runs across the track on wide screens and down it once the
    // steps stack, so it has to grow along the matching axis.
    const isStacked = window.matchMedia("(max-width: 48rem)").matches;
    const lineFrom = isStacked
      ? { scaleY: 0, transformOrigin: "center top" }
      : { scaleX: 0, transformOrigin: "left center" };
    const lineTo = isStacked ? { scaleY: 1 } : { scaleX: 1 };

    const { from, to } = revealPresets[preset];
    gsap.set(items, from);
    if (line) gsap.set(line, lineFrom);

    let timeline: gsap.core.Timeline | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        timeline = gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to(items, {
            ...to,
            duration: 0.82,
            stagger,
          });

        if (line) {
          timeline.to(
            line,
            {
              ...lineTo,
              duration: 1.1,
              ease: "power2.inOut",
            },
            "-=0.55",
          );
        }

        observer.disconnect();
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.06,
      },
    );

    observer.observe(group);

    return () => {
      observer.disconnect();
      timeline?.kill();
      gsap.killTweensOf(animated);
      gsap.set(animated, { clearProps: "all" });
    };
  }, [preset, stagger]);

  if (as === "ol") {
    return (
      <ol {...rest} ref={setGroup}>
        {children}
      </ol>
    );
  }

  if (as === "ul") {
    return (
      <ul {...rest} ref={setGroup}>
        {children}
      </ul>
    );
  }

  return (
    <div {...rest} ref={setGroup}>
      {children}
    </div>
  );
}

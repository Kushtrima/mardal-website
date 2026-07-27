"use client";

import { useEffect } from "react";
import gsap from "gsap";

/**
 * The bars redraw when you point at a box.
 *
 * Nothing follows the cursor and no colour changes — the drawing the box
 * already carries is what answers. Each bar grows from its own left edge, and
 * they are staggered by how far across the box they sit, so the redraw reads
 * as a single sweep rather than sixty-five things starting at once.
 *
 * This attaches to the grid rather than to each box: one listener, and the
 * boxes stay server-rendered.
 */
export function CardBarsHover() {
  useEffect(() => {
    const grid = document.querySelector<HTMLElement>(".difference-grid");
    if (!grid) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* Which box the pointer is in. Every bar is its own element, so crossing
       one fires an event of its own — without this, the sweep restarted on
       every bar the pointer touched, and only ran once when it happened to
       cross the plain colour between them. */
    let current: Element | null = null;

    function handleOver(event: PointerEvent) {
      const card =
        (event.target as Element | null)?.closest?.(".difference-card") ?? null;

      if (card === current) return;
      current = card;
      if (!card) return;

      const bars = card.querySelectorAll<SVGRectElement>(
        ".difference-card__lines rect",
      );
      if (!bars.length) return;

      /* Ordered by where each bar sits across the box, so the sweep runs left
         to right whatever order they were drawn in. */
      const ordered = Array.from(bars).sort(
        (a, b) => Number(a.getAttribute("x")) - Number(b.getAttribute("x")),
      );

      gsap.fromTo(
        ordered,
        { scaleX: 0 },
        {
          duration: 0.55,
          ease: "power3.out",
          scaleX: 1,
          stagger: { each: 0.006 },
          overwrite: true,
        },
      );
    }

    function handleLeave() {
      current = null;
    }

    /* pointerover bubbles, so one listener covers every box and every bar. */
    grid.addEventListener("pointerover", handleOver);
    grid.addEventListener("pointerleave", handleLeave);

    return () => {
      grid.removeEventListener("pointerover", handleOver);
      grid.removeEventListener("pointerleave", handleLeave);
      gsap.killTweensOf(".difference-card__lines rect");
    };
  }, []);

  return null;
}

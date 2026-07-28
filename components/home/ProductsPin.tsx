"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Holds the products heading in place while the three products are scrolled
 * past it.
 *
 * `position: sticky` cannot do this here. ScrollSmoother moves the page by
 * transforming its content inside a wrapper that is fixed and never scrolls, so
 * there is no scrolling ancestor for sticky to measure against and it simply
 * scrolls away — checked in the browser before writing this. Pinning is the
 * mechanism that works once the smoother owns the scroll.
 */

/** Where the heading comes to rest: clear of the top of the screen, not
 *  jammed against it. */
const HEADER_CLEARANCE = 148;

/** Below this the two columns stack, and the heading just sits above them. */
const MIN_WIDTH = "(min-width: 60rem)";

export function ProductsPin() {
  useEffect(() => {
    if (!window.matchMedia(MIN_WIDTH).matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const layout = document.querySelector<HTMLElement>(".products-layout");
      const intro = document.querySelector<HTMLElement>(".products-intro");
      const row = document.querySelector<HTMLElement>(".products-row");
      if (!layout || !intro || !row) return;

      ScrollTrigger.create({
        trigger: layout,
        start: `top top+=${HEADER_CLEARANCE}`,
        /* Let go once the list has given up all the height it has over the
           heading — any further and the heading would drag the page. */
        end: () => `+=${Math.max(0, row.offsetHeight - intro.offsetHeight)}`,
        pin: intro,
        /* The column already reserves its own height in the grid, so the pin
           must not add any more or the section grows by the pinned distance. */
        pinSpacing: false,
        invalidateOnRefresh: true,
      });
    });

    return () => {
      context.revert();
    };
  }, []);

  return null;
}

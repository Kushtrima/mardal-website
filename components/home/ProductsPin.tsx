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
const HEADER_CLEARANCE = 88;

/**
 * The width the two columns collapse at, in pixels.
 *
 * This is the container query in globals.css written again — `@container
 * products (max-width: 58rem)` on .products-section — and it has to be, because
 * the heading may only be pinned while there is a second column beside it to
 * pin it against.
 *
 * It used to be a viewport query at 60rem, and viewport is the wrong measure:
 * the layout answers to the section's own width. The two disagreed between 929
 * and 959px, where the columns were still side by side and nothing pinned —
 * the heading simply scrolled away, which is what a laptop window sized into
 * that band would have shown.
 */
const TWO_COLUMN_MIN_PX = 58 * 16;

export function ProductsPin() {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>(".products-section");
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);

    let context: gsap.Context | undefined;

    function build() {
      if (context) return;

      context = gsap.context(() => {
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
    }

    function teardown() {
      context?.revert();
      context = undefined;
    }

    /**
     * Kept in step with the width, rather than decided once and forgotten.
     *
     * This ran a single time on mount before. Load the page in a narrow window
     * and there was no pin for the rest of the session however wide it was
     * afterwards; load it wide and the pin stayed on into widths where the
     * columns had already stacked. Neither corrected itself without a reload,
     * which is the shape of a heading that "does not stick on a laptop".
     */
    function sync() {
      if (section!.clientWidth > TWO_COLUMN_MIN_PX) {
        build();
        return;
      }

      teardown();
    }

    /* The section's own width, which is what the container query reads, not the
       window's — they are the same here today, and this stays right if the page
       ever grows a margin. */
    const observer = new ResizeObserver(sync);
    observer.observe(section);
    sync();

    return () => {
      observer.disconnect();
      teardown();
    };
  }, []);

  return null;
}

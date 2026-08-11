"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Holds a rail in place while the column beside it is scrolled past.
 *
 * Two callers: the sector index on /case-studies, and the record rail on a
 * story page. The selectors are props with the index's own as defaults, so the
 * mechanism below — which is the interesting part, and the part that took a
 * browser to get right — is written once.
 *
 * `position: sticky` cannot do this here, and this is the second place on the
 * site to find that out — see ProductsPin, which holds the products heading the
 * same way and for the same reason. ScrollSmoother moves the page by
 * transforming its content inside a wrapper that is fixed and never scrolls, so
 * there is no scrolling ancestor for sticky to measure against and it simply
 * scrolls away. Pinning is the mechanism that works once the smoother owns the
 * scroll.
 */

/** Where the index comes to rest: clear of the top of the screen, not jammed
 *  against it. The same clearance the products heading takes. */
const HEADER_CLEARANCE = 88;

/**
 * The width the layout collapses at, written as the exact complement of the
 * rule in globals.css — `@media (max-width: 64rem)` on .clients-layout.
 *
 * Read through matchMedia rather than compared against a pixel constant, so the
 * two are the same query in the same units and cannot drift apart. ProductsPin
 * carries the scar from doing this the other way: a viewport number that
 * disagreed with the container query it was standing in for left a band of
 * widths where the layout was two columns and nothing pinned.
 *
 * The index may only be pinned while there is a column of work beside it to pin
 * it against. Stacked, it is a block of words above that work and pinning it
 * would hold it over the thing it is meant to be filtering.
 */
const TWO_COLUMN = "(min-width: 64.0625rem)";

export function ClientsPin({
  section: sectionSelector = ".clients-index",
  layout: layoutSelector = ".clients-layout",
  rail: railSelector = ".clients-filter",
  body: bodySelector = ".clients-work",
}: {
  section?: string;
  layout?: string;
  rail?: string;
  body?: string;
} = {}) {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>(sectionSelector);
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);

    let context: gsap.Context | undefined;

    function build() {
      if (context) return;

      context = gsap.context(() => {
        const layout = document.querySelector<HTMLElement>(layoutSelector);
        const filter = document.querySelector<HTMLElement>(railSelector);
        const work = document.querySelector<HTMLElement>(bodySelector);
        if (!layout || !filter || !work) return;

        ScrollTrigger.create({
          trigger: layout,
          start: `top top+=${HEADER_CLEARANCE}`,
          /* Let go once the work has given up all the height it has over the
             index — any further and the index would drag the page past the last
             card. Filtering to a sector with two entries makes this zero or
             negative, which is right: there is nothing to hold it for. */
          end: () => `+=${Math.max(0, work.offsetHeight - filter.offsetHeight)}`,
          pin: filter,
          /* The column already reserves its width in the grid, so the pin must
             not add spacing or the section grows by the pinned distance. */
          pinSpacing: false,
          invalidateOnRefresh: true,
        });
      });
    }

    function teardown() {
      context?.revert();
      context = undefined;
    }

    const twoColumn = window.matchMedia(TWO_COLUMN);

    function sync() {
      if (twoColumn.matches) {
        build();
        return;
      }

      teardown();
    }

    /* The work changes height every time a sector is chosen — eight cards to
       two is most of the page — and the pin's end is measured, not guessed. Left
       alone it would keep the distance it was built with and hold the index
       over empty space, or let go of it early. Refreshing on the change in
       height is what keeps the two in step, and it cannot feed back: the pin
       adds no spacing, so nothing it does changes the height being watched. */
    const observer = new ResizeObserver(() => {
      if (twoColumn.matches) ScrollTrigger.refresh();
    });
    const work = document.querySelector<HTMLElement>(bodySelector);
    if (work) observer.observe(work);

    twoColumn.addEventListener("change", sync);
    sync();

    return () => {
      observer.disconnect();
      twoColumn.removeEventListener("change", sync);
      teardown();
    };
  }, [sectionSelector, layoutSelector, railSelector, bodySelector]);

  return null;
}

"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Holds a rail in place while the column beside it is scrolled past.
 *
 * One caller today: the rail on /case-studies. It said two — the sector index
 * and the record rail on a story page — and the second is `StorySteps`, which
 * holds its own rail with its own mechanism rather than calling this. The
 * selectors stay props anyway: they are what let the one caller be checked
 * against, and the pin's target is read back out of this file by
 * tests/rendered-html.test.mjs, which is the only place the choice is visible.
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
  /* **The box inside the rail, and never the rail itself.**

     It was `.clients-filter` — the list alone — until the owner asked for
     "Selected work" to stick with it. The obvious target was `.clients-rail`,
     which holds both, and that was wrong in a way nothing here would have
     caught: `.clients-rail` is a direct child of `.clients-layout`, which is a
     grid. Pinning wraps its target in a `pin-spacer` and takes the element out
     of flow inside it, so the spacer becomes the grid item — and then every
     refresh re-measures a box the grid lays itself out from, which can move the
     work column, whose height the observer below watches in order to decide
     when to refresh. Round and round.

     `.clients-rail__inner` exists for exactly this. The grid item stays put and
     what is pinned is everything inside it. */
  rail: railSelector = ".clients-rail__inner",
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
    let lastHeight = 0;
    let queued = 0;

    const observer = new ResizeObserver((entries) => {
      if (!twoColumn.matches) return;

      /* Only a real change, and only once a frame.
       *
       * A ResizeObserver whose callback can affect the thing it observes is a
       * loop waiting for a rounding error, and `ScrollTrigger.refresh()` is a
       * full re-measure of the page. Two guards rather than one because they
       * catch different halves: the height check drops a callback that reports
       * the same box twice, which sub-pixel layout does constantly, and the
       * frame gate stops a refresh being asked for again while the last one is
       * still settling. */
      const height = Math.round(entries[0]?.contentRect.height ?? 0);
      if (height === lastHeight) return;
      lastHeight = height;

      if (queued) return;
      queued = window.requestAnimationFrame(() => {
        queued = 0;
        ScrollTrigger.refresh();
      });
    });
    const work = document.querySelector<HTMLElement>(bodySelector);
    if (work) observer.observe(work);

    twoColumn.addEventListener("change", sync);
    sync();

    return () => {
      observer.disconnect();
      if (queued) window.cancelAnimationFrame(queued);
      twoColumn.removeEventListener("change", sync);
      teardown();
    };
  }, [sectionSelector, layoutSelector, railSelector, bodySelector]);

  return null;
}

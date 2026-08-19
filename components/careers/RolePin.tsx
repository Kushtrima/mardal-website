"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Holds the role's name and facts in place while its writing is scrolled past.
 *
 * `position: sticky` cannot do this here, and that is not a preference — the
 * page runs ScrollSmoother, which moves the content by transforming it inside a
 * wrapper that is fixed and never scrolls. There is no scrolling ancestor for
 * sticky to measure against, so it simply travels away with everything else.
 * ProductsPin found this on the homepage and says so in the same words; this is
 * the same mechanism applied to a two-column page.
 */

/** Where the rail comes to rest: clear of the top of the screen, not jammed
 *  against it. The header's own clearance, matching the homepage pin. */
const HEADER_CLEARANCE = 88;

/**
 * The width the two columns collapse at, in pixels — the media query in
 * globals.css written again, and it has to be: the rail may only be pinned
 * while there is a column beside it to pin it against. Below this the two
 * stack, and a pinned rail would hold a heading over its own body text.
 */
const TWO_COLUMN_MIN_PX = 64 * 16;

export function RolePin() {
  useEffect(() => {
    const layout = document.querySelector<HTMLElement>(".role-page__layout");
    if (!layout) return;

    gsap.registerPlugin(ScrollTrigger);

    let context: gsap.Context | undefined;

    function build() {
      if (context) return;

      context = gsap.context(() => {
        const rail = document.querySelector<HTMLElement>(".role-page__rail");
        const body = document.querySelector<HTMLElement>(".role-page__body");
        if (!rail || !body) return;

        ScrollTrigger.create({
          trigger: layout!,
          start: `top top+=${HEADER_CLEARANCE}`,
          /* Let go once the writing has given up all the height it has over the
             rail. Any further and the rail would drag the page past the end of
             what it belongs to — including the form, which is the one thing on
             this page a reader has to be able to reach. */
          end: () => `+=${Math.max(0, body.offsetHeight - rail.offsetHeight)}`,
          pin: rail,
          /* The column already reserves its height in the grid, so the pin must
             not add any more or the page grows by the pinned distance. */
          pinSpacing: false,
          invalidateOnRefresh: true,
        });
      });
    }

    function teardown() {
      context?.revert();
      context = undefined;
    }

    /* Kept in step with the width rather than decided once on mount. Deciding
       once is how a pin survives into a width where the columns have already
       stacked, and how a window that starts narrow never gets one however wide
       it is afterwards — neither corrects itself without a reload. */
    function sync() {
      if (layout!.clientWidth > TWO_COLUMN_MIN_PX) {
        build();
        return;
      }

      teardown();
    }

    const observer = new ResizeObserver(sync);
    observer.observe(layout);
    sync();

    return () => {
      observer.disconnect();
      teardown();
    };
  }, []);

  return null;
}

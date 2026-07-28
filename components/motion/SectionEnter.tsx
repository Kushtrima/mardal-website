"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Each section settles into place as it comes up the screen.
 *
 * Tied to scroll position, not to a clock. That distinction is the whole point:
 * a timed fade competes with the page's own movement and loses — while you are
 * scrolling, everything is already travelling hundreds of pixels, so another
 * 64px over 900ms does not separate from it, and two attempts at that read as
 * nothing at all.
 *
 * Anchoring it to scroll gives the section a different rate to the page. It
 * arrives low and catches up, and that lag is visible for as long as the
 * section is entering, at any scrolling speed. It also cannot be missed by
 * scrolling quickly past it, because there is no window to miss.
 */

/** How far behind the page the section starts. */
const LAG = 110;

/**
 * The range it catches up over, as ScrollTrigger positions.
 *
 * From the section's top touching the bottom of the viewport, to that top
 * reaching 45% of the way up the screen — a little over half a viewport of
 * scrolling.
 */
const START = "top bottom";
const END = "top 45%";

/** Fraction of that range the fade is finished in, so text is never faint by
 *  the time it is somewhere you would read it. */
const FADE_SHARE = 0.6;

export function SectionEnter() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(
        "main > section[data-route-section]",
      );

      sections.forEach((section) => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: START,
            end: END,
            /* A little smoothing so a trackpad's jitter does not show up in
               the movement, but not so much that it lags behind the finger. */
            scrub: 0.5,
          },
        });

        /* Linear against the scroll on purpose. An ease would vary the rate
           the section catches up at, and it is the steady difference in rate
           that the eye picks out. */
        timeline
          .fromTo(
            section,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: FADE_SHARE, ease: "none" },
            0,
          )
          .fromTo(
            section,
            { y: LAG },
            { y: 0, duration: 1, ease: "none" },
            0,
          );
      });
    });

    return () => {
      context.revert();
    };
  }, []);

  return null;
}

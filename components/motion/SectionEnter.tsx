"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Every section enters the same way: it arrives a little behind the page and
 * catches up.
 *
 * The movement is tied to scroll POSITION, not to a clock, and that is the
 * whole of it. A timed rise competes with the page's own travel and loses —
 * while you scroll, everything on screen is already moving 800-2500px a second,
 * so 80px spread over a second is a three to eight percent change in rate,
 * which is at or under the point where the eye can separate two speeds at all.
 * Three attempts at a timed entry read as nothing, and that was the correct
 * reading each time.
 *
 * Anchored to scroll, the section gives back a fixed FRACTION of the distance
 * the page travels, so it moves at three quarters of the speed of everything
 * around it for the whole of its entrance — whether you inch down the page or
 * throw it. A quarter-speed difference is not something the eye can miss: it
 * is the same signal as one surface sliding across another. It cannot be
 * scrolled past either, because there is no window to miss; flick through and
 * it plays fast, stop halfway and it sits halfway.
 *
 * Then it resolves to exactly zero and locks, which is what separates it from
 * parallax. Parallax keeps its offset and drifts forever, and announces itself.
 * This one arrives.
 */

/**
 * How much less the section travels than the page, across its entrance.
 *
 * THE dial. Below about 0.15 it drops back under the threshold that made the
 * timed versions invisible; above about 0.35 the gap it opens starts reading as
 * a layout fault rather than as a rate.
 */
const LAG_RATIO = 0.25;

/** Bounds on the derived distance, so it stays sane on a laptop and a 27". */
const MIN_LAG = 96;
const MAX_LAG = 160;

/**
 * The window it catches up over, measured against the section's HEADING rather
 * than its top edge.
 *
 * Sections open with a band of space, and that band is not a constant: 111px
 * for Why Mardal, Different and Products, but 235px for Industries. Measured
 * from the top edge, a third of the movement is spent on empty white and
 * Industries becomes the odd one out. Measured from the heading, the movement
 * happens where the ink is and all four behave alike.
 */
const START = "top 95%";
const END = "top 41%";

/** Fraction of the window the fade takes, and how faint it starts. */
const FADE_FROM = 0.62;
const FADE_SHARE = 0.5;

export function SectionEnter() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    /* A collapsing address bar must not re-measure everything mid-scroll. */
    ScrollTrigger.config({ ignoreMobileResize: true });

    const context = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(
        "main > section[data-route-section]",
      );

      sections.forEach((section) => {
        /* Every section already names its heading for screen readers, so there
           is nothing to add to the markup to find it. */
        const headingId = section.getAttribute("aria-labelledby");
        const heading = headingId ? document.getElementById(headingId) : null;

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: heading ?? section,
            start: START,
            end: END,
            /* Enough to turn a wheel's steps into movement, and to leave the
               last of it to glide home once the page comes to rest. Short
               enough that it still tracks the hand. */
            scrub: 0.4,
            /* The distance is derived from the viewport, so it has to be
               recomputed rather than remembered when that changes. */
            invalidateOnRefresh: true,
          },
        });

        timeline
          /* Linear on purpose. An ease would vary the rate it catches up at,
             and it is the steady difference in rate that the eye picks out. */
          .fromTo(
            section,
            {
              y: () =>
                gsap.utils.clamp(
                  MIN_LAG,
                  MAX_LAG,
                  window.innerHeight * (1 - 0.41) * LAG_RATIO,
                ),
            },
            { y: 0, duration: 1, ease: "none" },
            0,
          )
          /* Shallow, and secondary to the movement. Plain opacity that never
             reaches zero: a section can be faint for a moment, but it can
             never be blank. */
          .fromTo(
            section,
            { opacity: FADE_FROM },
            { opacity: 1, duration: FADE_SHARE, ease: "none" },
            0,
          );
      });
    });

    /* The display face changes where every heading sits, so the trigger
       positions are only right once it has loaded. */
    void document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => {
      context.revert();
    };
  }, []);

  return null;
}

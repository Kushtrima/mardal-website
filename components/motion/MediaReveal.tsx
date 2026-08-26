"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The page stops at the photograph while it resolves, then carries on.
 *
 * The frame is pinned for most of a screen of scroll. Over that hold it opens
 * from a band across its middle to its whole height, and the picture inside
 * settles from a little oversized to exactly its own size. Then the pin
 * releases and the page resumes.
 *
 * **The fifth treatment this plate has had, and the owner's pick from what was
 * left.** A scale-settle, a sideways open, a downward uncover and five slices
 * came before it. They are named here so the next person does not re-propose
 * one, and because what is wrong with each is not obvious from a still: the
 * sideways open animates the width, which was ruled out with the full-width
 * plate; the slices needed five copies of the picture and a `min-width` to
 * survive the minifier.
 *
 * **What makes this one different in kind:** every other entrance here happens
 * while the page is moving past. This one holds the page still. It is the only
 * effect on the site a reader can feel in the scrollbar, and the only one that
 * makes the page longer — `pinSpacing` inserts the hold as real scroll length.
 *
 * Still tied to scroll POSITION rather than to a clock, which is the decision
 * `SectionEnter` is built on: the hold is not a pause on a timer, it is scroll
 * distance spent in one place, so it plays fast when the page is thrown and
 * sits halfway when it is stopped halfway.
 *
 * And it RESOLVES — `inset(0)` and scale 1, where it locks.
 *
 * Attached by attribute, so the next photograph gets it by carrying
 * `data-media-reveal` and nothing here has to know about it.
 */

/** How much of the frame is covered, top and bottom, when the hold begins. */
const BANDED = 30;

/** How much larger the picture is than its frame at the start of the hold. */
const OVERSIZE = 1.1;

/**
 * How long the page is held, as a fraction of the window's height.
 *
 * This is the cost of the effect, stated as a number: the page grows by exactly
 * this much, and `SectionWash` imports it — the wash begins where this hold
 * ends, and it is the only way to say where that is. A pinned element cannot
 * express its own release in ScrollTrigger's relative terms: it does not move
 * while it is held, so `center center` resolves to the GRAB and any offset past
 * that is delayed by the whole hold again. Below about half a screen the hold is not long enough to read as
 * one, and above about one screen it stops feeling like a pause and starts
 * feeling like the page has stopped responding.
 */
export const HOLD = 0.8;

export function MediaReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const frames = gsap.utils.toArray<HTMLElement>("[data-media-reveal]");

      frames.forEach((frame) => {
        const picture = frame.querySelector<HTMLElement>("img");
        if (!picture) return;

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: frame,
            /* Centred rather than `top top`: the plate is held in the middle of
               the window, which is where a reader stopped in front of something
               expects it to be — and it means the hold does not depend on the
               plate being shorter than the window. */
            start: "center center",
            end: () => `+=${window.innerHeight * HOLD}`,
            pin: frame,
            pinSpacing: true,
            /* Short: the hold is already the pause, and a slow scrub on top of a
               pin reads as lag rather than as smoothing. */
            scrub: 0.3,
            /* The distance is derived from the viewport, so it has to be
               recomputed rather than remembered when that changes. */
            invalidateOnRefresh: true,
          },
        });

        timeline
          .fromTo(
            frame,
            { clipPath: `inset(${BANDED}% 0% ${BANDED}% 0%)` },
            /* Linear, like the section entrance: it is the steady difference in
               rate that the eye picks out, and an ease would vary it. */
            { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration: 1 },
            0,
          )
          .fromTo(
            picture,
            { scale: OVERSIZE },
            { scale: 1, ease: "none", duration: 1 },
            0,
          );
      });
    });

    /* The frame reserves its own height through `aspect-ratio`, so the page does
       not grow when the picture decodes and the triggers below it stay put. What
       does move them is the display face, which changes where every heading
       sits — the same refresh `SectionEnter` waits for. */
    void document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => context.revert();
  }, []);

  return null;
}

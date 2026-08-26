"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Each photograph is drawn open from one edge while the picture inside it moves
 * the other way.
 *
 * The frame starts closed against one side and uncovers across; the picture
 * behind it is offset toward that same side and slides back to centre as the
 * frame opens. The two travel in opposite directions over the same scroll, so
 * what reads is a photograph being revealed rather than a box growing — the
 * image appears to hold still against the page while its window widens.
 *
 * They alternate sides, which is what makes three of them a set: the left one
 * opens from its left edge, the middle from its right, the wide one from its
 * left again. Which side is a composition decision, so it lives in the markup as
 * `data-cluster-from` beside the arrangement it belongs to.
 *
 * **The seventh treatment on this page and the second on this group.** The plate
 * above has had a scale-settle, a sideways open, a downward uncover, five slices
 * and the pin-and-hold it kept; this group had a depth arrival before this. They
 * are listed so the next person does not re-propose one.
 *
 * **Everything happens inside the frame**, which is worth more than it sounds.
 * The previous effect moved the frames themselves, so every offset had to be
 * checked against the neighbours it might collide with — and it did collide,
 * twice, once by 252px and once by 77. Nothing here leaves its own box, so there
 * is nothing to check and no separate behaviour for a stacked layout.
 *
 * Tied to scroll POSITION rather than a clock, and it RESOLVES: `inset(0)` and
 * zero, where it locks. Parallax drifts forever; this arrives.
 */

/** How far the picture is pushed toward the opening edge, as a percentage. */
const COUNTER = 14;

/** The window a picture opens over, measured against itself. */
const START = "top 88%";
const END = "top 42%";

export function MediaCluster() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-cluster-from]");

      items.forEach((item) => {
        const picture = item.querySelector<HTMLElement>("img");
        if (!picture) return;

        const fromLeft = item.dataset.clusterFrom !== "right";
        /* Closed against the edge it opens from: all of the frame is clipped
           away on the far side, and that side retreats to nothing. */
        const closed = fromLeft
          ? "inset(0% 100% 0% 0%)"
          : "inset(0% 0% 0% 100%)";

        const timeline = gsap.timeline({
          scrollTrigger: {
            /* The picture, not the group. Keyed to the group, the lower two
               finished arriving 677px below the fold and only the first one
               appeared to do anything. */
            trigger: item,
            start: START,
            end: END,
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .fromTo(
            item,
            { clipPath: closed },
            /* Linear, like every entrance here: it is the steady difference in
               rate that the eye picks out, and an ease would vary it. */
            { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration: 1 },
            0,
          )
          .fromTo(
            picture,
            { xPercent: fromLeft ? -COUNTER : COUNTER },
            { xPercent: 0, ease: "none", duration: 1 },
            0,
          );
      });
    });

    /* The frames reserve their own heights through `aspect-ratio`, so the page
       does not grow when the pictures decode. What does move the triggers is the
       display face — the same refresh `SectionEnter` waits for. */
    void document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => context.revert();
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * A photograph arrives in slices that land flush.
 *
 * Each slice carries its own fifth of the picture. They start displaced along
 * the frame's short axis — alternating up and down, so the run reads as a set of
 * pieces rather than as one thing tilted — and come home at staggered times, the
 * last of them a little after the first. When they are all home the picture is
 * whole and nothing marks where the joins were.
 *
 * **The fourth treatment this plate has had**, and the owner's own pick from
 * four. A scale-settle, a sideways open and a downward uncover came before it.
 * It echoes the redaction bars the five service heroes carry, which is the one
 * visual language this site already has — the same idea, on a photograph.
 *
 * **Tied to scroll position, not to a clock**, which is the decision
 * `SectionEnter` is built on and for the same reason — while you are scrolling,
 * everything on screen is already moving 800 to 2500px a second, and a timed
 * entrance is a few percent change in rate that the eye cannot separate. Given
 * back as a fraction of the distance the page travels, it plays fast when you
 * throw the page and sits halfway when you stop halfway.
 *
 * And it RESOLVES: every slice ends at exactly zero, where it locks. Parallax
 * keeps its offset and drifts forever; this arrives.
 *
 * Attached by attribute, so the next photograph gets it by carrying
 * `data-media-reveal` with slices inside, and nothing here has to know about it.
 */

/**
 * How far a slice starts from home, as a percentage of the frame's height.
 *
 * 16 for a version, which is 126px on a 790px frame — large enough that the
 * gaps it opens at the top and bottom of the plate read as a layout fault
 * rather than as pieces on their way in. 10 is 79px, which is a slice clearly
 * out of place and not a hole in the page.
 */
const TRAVEL = 10;

/** Seconds between one slice setting off and the next, against a 1s move. */
const APART = 0.14;

/**
 * How faint a slice is while it is still out.
 *
 * Never zero: a slice can be faint for a moment, but a blank column reads as a
 * picture that failed to load rather than as one arriving.
 *
 * 0.55 rather than the 0.35 it started at. That number was chosen while the
 * section's own fade was still multiplying into it — 0.62 x 0.35 is 0.217, and
 * the photograph came in as a ghost. With the section entrance off this is the
 * only opacity on the plate, so it can be what it was meant to be.
 */
const FAINT = 0.55;

/** The window they land over, in the same terms `SectionEnter` uses. */
const START = "top 92%";
const END = "top 48%";

export function MediaReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const frames = gsap.utils.toArray<HTMLElement>("[data-media-reveal]");

      frames.forEach((frame) => {
        const slices = frame.querySelectorAll<HTMLElement>("[data-plate-slice]");
        if (!slices.length) return;

        /* **The displacement is SET, then tweened away.** A staggered
           `fromTo` was the obvious way to write this and it does not work: it
           renders each target's from-values when that target's turn arrives, so
           at the head of the window only the first slice was displaced. Measured
           at `126/0.35` on the first and `0/1.00` on the other four — four fifths
           of the picture never moved, and the fifth read as a glitch rather than
           as an entrance. `immediateRender: true` on the tween does not reach
           the staggered sub-tweens either; it was tried and measured the same.

           Set up front and tweened home, every slice holds its start until its
           own turn comes, because the start is simply where it already is. */
        gsap.set(slices, {
          /* Alternating, so the run is a set of pieces rather than one thing
             leaning. Percent of the slice's own height, so it holds at every
             width without being recomputed. */
          yPercent: (index: number) => (index % 2 ? -TRAVEL : TRAVEL),
          opacity: FAINT,
        });

        gsap.to(slices, {
          yPercent: 0,
          opacity: 1,
          /* Linear, like the section entrance: it is the steady difference in
             rate that the eye picks out, and an ease would vary it. */
          ease: "none",
          duration: 1,
          stagger: { each: APART },
          scrollTrigger: {
            trigger: frame,
            start: START,
            end: END,
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        });
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

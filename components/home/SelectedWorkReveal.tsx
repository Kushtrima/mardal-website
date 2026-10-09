"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { playOnArrival } from "../../lib/play-on-arrival";

/**
 * Selected Work, arriving as it comes into view — in the same hand as the
 * section above it (FusionReveal), which the owner asked to be smooth and
 * elegant the same day this one was built.
 *
 *   - The heading's lines rise out of their own masks, one after the next, on
 *     the long expo ease; VIEW ALL fades in beside the last of them.
 *   - Each picture opens upward from its foot while the photograph inside
 *     settles from a little oversized to its own size — the frame and the
 *     image moving together, each on its own ease, so the picture reads as
 *     revealed rather than slid in.
 *   - The three lines under it fade up as it finishes.
 *
 * Played once per block, when it comes into view: no pin, no scrub, nothing
 * tied to the scroll (owner, 2026-10-05, of the section above: "remove the on
 * scroll effect put a normal effect from gsap").
 *
 * Start states are set first, outside the tweens — a tween waiting on its
 * trigger is put back to what the element was before it on a refresh, so
 * "before" has to be the hidden state (measured on FusionReveal). Nothing is
 * hidden by the stylesheet: without this script the section stands whole.
 */

const START = "top 85%";
const RISE = { duration: 1.4, ease: "expo.out", stagger: 0.12 };

export function SelectedWorkReveal() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector<HTMLElement>("[data-selected-work]");
    if (!section) return;
    const head = section.querySelector<HTMLElement>(".selected-work__head");
    const all = section.querySelector<HTMLElement>("[data-selected-work-all]");
    if (!head || !all) return;
    const lines = section.querySelectorAll<HTMLElement>("[data-selected-work-line]");
    const items = [
      ...section.querySelectorAll<HTMLElement>("[data-selected-work-item]"),
    ];

    /* Reduced motion: the same order, nothing travels — fades only. */
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const context = gsap.context(() => {
      gsap.set(lines, still ? { opacity: 0 } : { yPercent: 120 });
      gsap.set(all, { opacity: 0, y: still ? 0 : 12 });

      /* Each entrance played by lib/play-on-arrival, so coming Back past
         it still shows it. */
      playOnArrival(
        gsap
          .timeline({ paused: true })
          .to(lines, still ? { opacity: 1, ...RISE } : { yPercent: 0, ...RISE }, 0)
          .to(all, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 0.35),
        head,
        START,
      );

      items.forEach((item, index) => {
        const frame = item.querySelector<HTMLElement>("[data-selected-work-frame]");
        const image = item.querySelector<HTMLElement>("[data-selected-work-image]");
        const meta = item.querySelector<HTMLElement>("[data-selected-work-meta]");
        if (!frame || !image || !meta) return;

        if (still) gsap.set(frame, { opacity: 0 });
        else {
          gsap.set(frame, { clipPath: "inset(100% 0% 0% 0%)" });
          gsap.set(image, { scale: 1.14, transformOrigin: "50% 100%" });
        }
        gsap.set(meta, { opacity: 0, y: still ? 0 : 16 });

        /* Side by side, a pair comes into view together: the second of each
           row a beat behind the first so the pair reads left to right. */
        const timeline = gsap.timeline({
          delay: item.hasAttribute("data-selected-work-feature")
            ? 0
            : (index % 2) * 0.15,
          paused: true,
        });
        if (still) {
          timeline.to(frame, { opacity: 1, duration: 1, ease: "power2.out" }, 0);
        } else {
          timeline
            .to(
              frame,
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" },
              0,
            )
            .to(image, { scale: 1, duration: 2, ease: "expo.out" }, 0.15);
        }
        timeline.to(
          meta,
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
          still ? 0.3 : 0.9,
        );
        playOnArrival(timeline, item, START);
      });
    });

    return () => context.revert();
  }, []);

  return null;
}

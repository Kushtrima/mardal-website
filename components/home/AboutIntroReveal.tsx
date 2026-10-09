"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { playOnArrival } from "../../lib/play-on-arrival";

/**
 * "about", arriving as it comes into view — in the same hand as the sections
 * above it (FusionReveal, SelectedWorkReveal): the word rises out of its mask
 * on the long expo ease, then its red square grows up from the baseline, and
 * the paragraph fades up beside it. Played once; no pin, no scrub.
 *
 * Start states are set first, outside the tweens — a tween waiting on its
 * trigger is put back to what the element was before it on a refresh, so
 * "before" has to be the hidden state (measured on FusionReveal). Nothing is
 * hidden by the stylesheet: without this script the section stands whole.
 */

const START = "top 85%";

export function AboutIntroReveal() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector<HTMLElement>("[data-about-intro]");
    if (!section) return;
    const line = section.querySelector<HTMLElement>("[data-about-line]");
    const mark = section.querySelector<HTMLElement>("[data-about-mark]");
    const copy = section.querySelector<HTMLElement>("[data-about-copy]");
    if (!line || !mark || !copy) return;

    /* Reduced motion: the same order, nothing travels — fades only, and the
       square is simply there. */
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const context = gsap.context(() => {
      gsap.set(line, still ? { opacity: 0 } : { yPercent: 120 });
      if (!still) gsap.set(mark, { scaleY: 0, transformOrigin: "50% 100%" });
      gsap.set(copy, { opacity: 0, y: still ? 0 : 24 });

      /* Played by lib/play-on-arrival, so coming Back past it still shows it. */
      const timeline = gsap.timeline({ paused: true });
      timeline.to(
        line,
        still
          ? { opacity: 1, duration: 1, ease: "power2.out" }
          : { yPercent: 0, duration: 1.4, ease: "expo.out" },
        0,
      );
      if (!still) {
        timeline.to(mark, { scaleY: 1, duration: 0.9, ease: "power3.inOut" }, 0.55);
      }
      timeline.to(
        copy,
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
        0.35,
      );
      playOnArrival(timeline, section, START);
    });

    return () => context.revert();
  }, []);

  return null;
}

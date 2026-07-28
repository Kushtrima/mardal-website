"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

/**
 * Smooth scrolling for the whole page.
 *
 * The wheel and the trackpad stop moving the page directly. They feed a target
 * position instead, and the page eases towards it, so scrolling carries weight
 * and comes to rest rather than stopping dead. Everything that reads position —
 * the section entrances included — rides on the same eased value, which is why
 * they finally have something to be smooth against.
 */

/** Seconds the page takes to catch up with where you have scrolled to. */
const SMOOTH = 1.1;

/**
 * Below this width the mobile menu takes over, and it is `position: fixed`
 * inside the content that ScrollSmoother transforms — which would pin it to the
 * page rather than the screen. Small screens keep native scrolling, which is
 * what they expect anyway.
 */
const MIN_WIDTH = "(min-width: 48rem)";

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia(MIN_WIDTH).matches) return;

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: SMOOTH,
      /* Lets markup opt into moving at its own rate via data-speed/data-lag. */
      effects: true,
      /* Takes over the browser's own scrolling so the two cannot disagree,
         which is what causes the jitter you otherwise get on a trackpad. */
      normalizeScroll: true,
      ignoreMobileResize: true,
    });

    return () => {
      smoother.kill();
    };
  }, []);

  return null;
}

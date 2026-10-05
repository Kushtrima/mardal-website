"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The footer, arriving — in the hand of the homepage's sections: the lists
 * and the line at the foot fade up as each comes into view, and the wordmark
 * rises out of its line. Played once; no pin, no scrub.
 *
 * Start states are set first, outside the tweens, so a refresh resets a
 * waiting tween to the hidden state rather than to the finished one; nothing
 * is hidden by the stylesheet, and without this script the footer stands
 * whole.
 */

/* As soon as a block's top is on screen: the line at the foot is the last
   thing on the page, and a later start is a point the page cannot scroll to —
   it would wait there, invisible, for good. */
const START = "top bottom";

export function FooterReveal() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const footer = document.querySelector<HTMLElement>("[data-footer]");
    if (!footer) return;
    const fades = [...footer.querySelectorAll<HTMLElement>("[data-footer-fade]")];
    const brand = footer.querySelector<HTMLElement>("[data-footer-brand]");

    /* Reduced motion: the same order, nothing travels — fades only. */
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const once = (trigger: Element) => ({ trigger, start: START, once: true });

    const context = gsap.context(() => {
      fades.forEach((block) => {
        gsap.set(block, { opacity: 0, y: still ? 0 : 24 });
        gsap.to(block, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: once(block),
        });
      });

      if (brand) {
        gsap.set(brand, still ? { opacity: 0 } : { yPercent: 105 });
        gsap.to(brand, {
          ...(still ? { opacity: 1 } : { yPercent: 0 }),
          duration: still ? 1 : 1.6,
          ease: still ? "power2.out" : "expo.out",
          scrollTrigger: once(brand.parentElement ?? brand),
        });
      }
    });

    return () => context.revert();
  }, []);

  return null;
}

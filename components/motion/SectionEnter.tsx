"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Each section arrives with one small movement.
 *
 * Not choreography: the section rises a little and settles, once, as it comes
 * into view. The same distance and the same ease every time, so scrolling the
 * page has a rhythm rather than a series of separate tricks.
 *
 * Anything already on screen when the page loads is left alone — a section you
 * are looking at should not animate out from under you.
 */

/** How far it rises, and how long it takes to settle. */
const RISE = 36;
const DURATION = 1;

export function SectionEnter() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(
        "main > section[data-route-section]",
      );

      sections.forEach((section) => {
        /* Already in view: nothing to enter. */
        if (section.getBoundingClientRect().top < window.innerHeight * 0.9) {
          return;
        }

        gsap.fromTo(
          section,
          { y: RISE, autoAlpha: 0 },
          {
            duration: DURATION,
            /* expo.out arrives quickly and settles slowly — the section is in
               place before the movement finishes, so it reads as smooth rather
               than as something being animated. */
            ease: "expo.out",
            y: 0,
            autoAlpha: 1,
            scrollTrigger: {
              trigger: section,
              start: "top 88%",
              once: true,
            },
          },
        );
      });
    });

    return () => {
      context.revert();
    };
  }, []);

  return null;
}

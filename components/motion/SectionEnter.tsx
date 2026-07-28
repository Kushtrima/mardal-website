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
const RISE = 64;
const DURATION = 0.9;

/**
 * How far down the viewport the section's top has to reach before it starts.
 *
 * Sections open with a band of space, so their heading sits 110–240px below
 * their top edge. Starting this late means the heading is already on screen
 * when the movement runs — start it any earlier and the whole thing plays out
 * below the fold, which is exactly what it did at 88%.
 */
const START = "top 62%";

export function SectionEnter() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(
        "main > section[data-route-section]",
      );

      sections.forEach((section) => {
        /* Already in view, or scrolled past: nothing to enter. */
        if (section.getBoundingClientRect().top < window.innerHeight * 0.62) {
          return;
        }

        gsap.fromTo(
          section,
          { y: RISE, autoAlpha: 0 },
          {
            duration: DURATION,
            /* power2.out spends its second half still visibly moving. expo.out
               was tried first and is 75% done inside 200ms — real, measurable,
               and far too quick to read as anything. */
            ease: "power2.out",
            y: 0,
            autoAlpha: 1,
            scrollTrigger: {
              trigger: section,
              start: START,
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

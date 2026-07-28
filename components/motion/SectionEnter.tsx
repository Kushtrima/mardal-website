"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Each section has an entry: it comes up into place as you arrive at it.
 *
 * This rides on the smooth scrolling rather than fighting it. A flick of the
 * trackpad now decelerates into a stop instead of ending dead, and the entry
 * runs against that easing — which is what gives it something to be smooth
 * against, and why earlier attempts at the same movement disappeared into the
 * page's own motion.
 */

/** How far below its place the section starts. */
const RISE = 80;
const DURATION = 1.1;

/**
 * Where the section's top has to reach before the entry runs.
 *
 * Sections open with a band of space, so their heading sits 110-240px lower
 * than their top edge. At 65% that puts the heading between 78% and 93% of the
 * way down the screen — on screen, with room to be watched arriving.
 */
const START = "top 65%";

export function SectionEnter() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(
        "main > section[data-route-section]",
      );

      sections.forEach((section) => {
        gsap.set(section, { autoAlpha: 0, y: RISE });

        ScrollTrigger.create({
          trigger: section,
          start: START,
          once: true,
          onEnter: () => {
            gsap.to(section, {
              duration: DURATION,
              ease: "power3.out",
              autoAlpha: 1,
              y: 0,
              overwrite: "auto",
            });
          },
        });
      });

      /* A section can already be past its trigger on load — a reload partway
         down the page, or a link straight to an anchor. ScrollTrigger fires
         those immediately rather than leaving them blank. */
      ScrollTrigger.refresh();
    });

    return () => {
      context.revert();
    };
  }, []);

  return null;
}

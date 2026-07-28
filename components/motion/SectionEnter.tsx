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
 * Where the section's HEADING has to reach before the entry runs.
 *
 * Measured against the heading rather than the section's top edge, because the
 * band of space each section opens with is not the same size: 111px for Why
 * Mardal, Different and Products, but 235px for Industries. Triggering off the
 * top edge fires all four at different visual moments and makes Industries the
 * odd one out. Off the heading they all arrive alike.
 */
const START = "top 92%";

export function SectionEnter() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(
        "main > section[data-route-section]",
      );

      sections.forEach((section) => {
        /* Every section names its own heading for screen readers already, so
           there is nothing new to add to the markup to find it. */
        const headingId = section.getAttribute("aria-labelledby");
        const heading = headingId ? document.getElementById(headingId) : null;

        /* Plain opacity, not autoAlpha: autoAlpha also writes
           `visibility: hidden`, so anything that stopped the tween finishing
           would leave a whole section unreadable. Opacity alone can only ever
           leave it faint. */
        gsap.set(section, { opacity: 0, y: RISE });

        ScrollTrigger.create({
          trigger: heading ?? section,
          start: START,
          once: true,
          onEnter: () => {
            gsap.to(section, {
              duration: DURATION,
              ease: "power3.out",
              opacity: 1,
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

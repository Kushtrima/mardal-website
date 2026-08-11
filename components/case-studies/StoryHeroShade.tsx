"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Brings a shade up the foot of the hero picture as the page is scrolled, and
 * leaves the picture alone until it is.
 *
 * The opening had a gradient over it at rest — heavy at the top so the menu
 * could be read, heavy at the foot so the lede could. Owner took both off: the
 * picture is meant to be the picture when you arrive. What is left is the one
 * moment cover is actually needed, which is on the way out — the foot of the
 * image is where the page below it begins, and an unshaded edge there is a
 * photograph stopping rather than a page continuing.
 *
 * Scrubbed rather than played: the shade is tied to the scroll position, so it
 * is exactly as far up as you are down, and running the scroll backwards takes
 * it back down. A timed fade triggered at a threshold would arrive after the
 * edge it exists to soften had already been looked at.
 *
 * ScrollTrigger rather than `animation-timeline: scroll()`, for the same reason
 * the two pins on this site are ScrollTriggers: ScrollSmoother owns the scroll
 * here, and the CSS timeline reads a scroller that the smoother has replaced.
 */
export function StoryHeroShade() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".story-hero");
    const shade = document.querySelector<HTMLElement>(".story-hero__shade");
    if (!hero || !shade) return;

    gsap.registerPlugin(ScrollTrigger);

    /* Honoured the way the other thirteen effects on this site honour it: the
       check happens before anything is built, and the resting state is the one
       a reader who has asked for no motion should get — which here is no shade,
       because the shade is the motion. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        shade,
        { opacity: 0 },
        {
          opacity: 1,
          /* No easing. The shade is a readout of scroll position, and an eased
             readout lies about where you are. */
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            /* Full by the time half the opening has gone. Any longer and it
               arrives after the edge it is covering has already left. */
            end: "+=50%",
            scrub: true,
          },
        },
      );
    });

    return () => context.revert();
  }, []);

  return null;
}

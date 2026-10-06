"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { focusWords } from "../../lib/focus-words";

/**
 * **The opening arrives** — owner, 2026-10-06: "i want the text to have an
 * enter effect a reval"; of a first (each line rising out of its own), "i
 * dont like it"; then "check for GSAP librarys"; and of words rising out of
 * masks, "still the same but before was one with the blur that i like it".
 * So the heading's words come into focus one after the next (focusWords, on
 * GSAP's SplitText), then "Service" with its plus and, last, the note with
 * its plus. Less motion: everything is simply there.
 */

const SETTLE = { duration: 1, ease: "power3.out" };

export function ServicesHeroReveal() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-services-hero]");
    const title = hero?.querySelector<HTMLElement>("[data-services-hero-title]");
    if (!hero || !title) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const first = hero.querySelectorAll<HTMLElement>("[data-services-hero-first]");
    const last = hero.querySelectorAll<HTMLElement>("[data-services-hero-last]");

    const undo = focusWords(title, (timeline) => {
      timeline
        .to(first, { opacity: 1, y: 0, ...SETTLE }, 0.5)
        .to(last, { opacity: 1, y: 0, ...SETTLE }, 0.85);
    });

    return () => {
      undo();
      gsap.set([...first, ...last], { clearProps: "all" });
    };
  }, []);

  return null;
}

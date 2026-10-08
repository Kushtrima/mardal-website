"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { focusWords } from "../../lib/focus-words";

/**
 * **The project's opening arrives** — the picture settling from a little
 * larger, the name's words coming into focus one after the next (focusWords,
 * the entrance the services' and the homepage's headings take), then the
 * industry over it. Less motion: everything is simply there.
 */
export function ProjectHeroReveal() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-project-hero]");
    const title = hero?.querySelector<HTMLElement>("[data-project-hero-title]");
    if (!hero || !title) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const image = hero.querySelector<HTMLElement>("[data-project-hero-image]");
    const meta = hero.querySelector<HTMLElement>("[data-project-hero-meta]");

    const settle = image
      ? gsap.fromTo(image, { scale: 1.08 }, { scale: 1, duration: 1.8, ease: "power3.out" })
      : undefined;
    const undo = focusWords(title, (timeline) => {
      if (meta) {
        timeline.to(meta, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 0.45);
      }
    });

    return () => {
      undo();
      settle?.kill();
      gsap.set([image, meta].filter(Boolean), { clearProps: "all" });
    };
  }, []);

  return null;
}

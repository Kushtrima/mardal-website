"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { focusWords } from "../../lib/focus-words";

/**
 * **How the pieces arrive** — owner, 2026-10-08: "i want to have also new
 * aproach on apearing the blogs cards". Each piece once, as it reaches the
 * screen: its title's words come into focus one after the next (focusWords,
 * the entrance the openings' headings take), then its date and its thesis
 * come up under it. Played, not tied to the scroll; once, not again on the
 * way back. Less motion: everything is simply there.
 */
export function BlogEntriesReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const undo: Array<() => void> = [];
    const triggers = [...document.querySelectorAll<HTMLElement>("[data-blog-entry]")].map(
      (entry) => {
        const title = entry.querySelector<HTMLElement>("[data-blog-entry-title]");
        const after = entry.querySelectorAll<HTMLElement>("[data-blog-entry-after]");
        return ScrollTrigger.create({
          trigger: entry,
          start: "top 88%",
          once: true,
          onEnter: () => {
            if (!title) return;
            undo.push(
              focusWords(title, (timeline) => {
                timeline.to(
                  after,
                  { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.12 },
                  0.35,
                );
              }),
            );
          },
        });
      },
    );

    return () => {
      triggers.forEach((trigger) => trigger.kill());
      undo.forEach((revert) => revert());
      gsap.set("[data-blog-entry-after]", { clearProps: "all" });
    };
  }, []);

  return null;
}

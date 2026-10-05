"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * "Our expertise": its arrival, and its two buttons.
 *
 * **The arrival**, in the hand of the sections above it: the label fades in,
 * and each row in turn draws its cross — the upright out of its own foot, the
 * crossbar from the centre — while its word rises out of its mask. Played
 * once per row as it comes into view. Start states are set first, outside the
 * tweens, so a refresh resets a waiting tween to the hidden state rather than
 * to the finished one; nothing is hidden by the stylesheet.
 *
 * **The buttons.** Under a pointer a row opens on hover, in CSS alone. A tap
 * or the keyboard has no hover, so each word is a button that keeps its own
 * `aria-expanded`, and the stylesheet opens the row that says it is open.
 */

const START = "top 85%";

export function ExpertiseReveal() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector<HTMLElement>("[data-expertise]");
    if (!section) return;
    const label = section.querySelector<HTMLElement>("[data-expertise-label]");
    const rows = [...section.querySelectorAll<HTMLElement>("[data-expertise-row]")];
    const toggles = [
      ...section.querySelectorAll<HTMLButtonElement>("[data-expertise-toggle]"),
    ];

    const onToggle = (event: Event) => {
      const button = event.currentTarget as HTMLButtonElement;
      const open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", open ? "false" : "true");
    };
    toggles.forEach((button) => button.addEventListener("click", onToggle));

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const context = gsap.context(() => {
      if (label) {
        gsap.set(label, { opacity: 0 });
        gsap.to(label, {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: section, start: START, once: true },
        });
      }

      rows.forEach((row) => {
        const up = row.querySelector<HTMLElement>("[data-expertise-up]");
        const across = row.querySelector<HTMLElement>("[data-expertise-across]");
        const word = row.querySelector<HTMLElement>("[data-expertise-word]");
        if (!up || !across || !word) return;

        gsap.set(up, { scaleY: 0, transformOrigin: "50% 100%" });
        gsap.set(across, { scaleX: 0, transformOrigin: "50% 50%" });
        gsap.set(word, still ? { opacity: 0 } : { yPercent: 120 });

        gsap
          .timeline({ scrollTrigger: { trigger: row, start: START, once: true } })
          .to(up, { scaleY: 1, duration: 1, ease: "power3.inOut" }, 0)
          .to(across, { scaleX: 1, duration: 0.9, ease: "power3.inOut" }, 0.3)
          .to(
            word,
            still
              ? { opacity: 1, duration: 1, ease: "power2.out" }
              : { yPercent: 0, duration: 1.4, ease: "expo.out" },
            0.2,
          );
      });
    });

    return () => {
      toggles.forEach((button) => button.removeEventListener("click", onToggle));
      context.revert();
    };
  }, []);

  return null;
}

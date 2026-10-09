"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { playOnArrival } from "../../lib/play-on-arrival";

/**
 * The products, arriving as they come into view — in the hand of the sections
 * above them (FusionReveal, SelectedWorkReveal, ExpertiseReveal):
 *
 *   - The label fades in, the heading's lines rise out of their own masks on
 *     the long expo ease, then the red full stop grows up from the baseline,
 *     as about's square does; the summary fades up under them.
 *   - Each product's picture opens upward from its foot while the photograph
 *     inside settles from a little oversized, and its lines, words and link
 *     fade up as it finishes — Selected Work's arrival. Side by side, the
 *     three come in a beat apart, left to right.
 *
 * Played once per block as it comes into view; no pin, no scrub. Start states
 * are set first, outside the tweens, so a refresh resets a waiting tween to
 * the hidden state rather than to the finished one; nothing is hidden by the
 * stylesheet, and without this script the section stands whole.
 */

const START = "top 85%";

export function ProductsReveal() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector<HTMLElement>("[data-products]");
    if (!section) return;
    const label = section.querySelector<HTMLElement>("[data-products-label]");
    const summary = section.querySelector<HTMLElement>("[data-products-summary]");
    if (!label || !summary) return;
    const lines = section.querySelectorAll<HTMLElement>("[data-products-line]");
    const stop = section.querySelector<HTMLElement>("[data-products-stop]");
    const rows = [...section.querySelectorAll<HTMLElement>("[data-product]")];

    /* Reduced motion: the same order, nothing travels — fades only. */
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const context = gsap.context(() => {
      gsap.set(label, { opacity: 0 });
      gsap.set(lines, still ? { opacity: 0 } : { yPercent: 120 });
      gsap.set(summary, { opacity: 0, y: still ? 0 : 24 });
      if (stop && !still) gsap.set(stop, { scaleY: 0, transformOrigin: "50% 100%" });

      /* Each entrance played by lib/play-on-arrival, so coming Back past
         it still shows it. */
      const head = gsap.timeline({ paused: true });
      head
        .to(label, { opacity: 1, duration: 1, ease: "power2.out" }, 0)
        .to(
          lines,
          still
            ? { opacity: 1, duration: 1, ease: "power2.out", stagger: 0.12 }
            : { yPercent: 0, duration: 1.4, ease: "expo.out", stagger: 0.12 },
          0.1,
        )
        .to(summary, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }, 0.45);
      if (stop && !still) {
        head.to(stop, { scaleY: 1, duration: 0.9, ease: "power3.inOut" }, 0.75);
      }
      playOnArrival(head, section, START);

      /* One column on a phone, and one band under the next on the products
         page: each comes in as it is reached, no beat. */
      const single =
        section.classList.contains("products--page") ||
        window.matchMedia("(max-width: 40rem)").matches;

      rows.forEach((row, index) => {
        const frame = row.querySelector<HTMLElement>("[data-product-frame]");
        const image = row.querySelector<HTMLElement>("[data-product-image]");
        const fades = row.querySelectorAll<HTMLElement>("[data-product-fade]");
        if (!frame || !image) return;

        if (still) gsap.set(frame, { opacity: 0 });
        else {
          gsap.set(frame, { clipPath: "inset(100% 0% 0% 0%)" });
          gsap.set(image, { scale: 1.14, transformOrigin: "50% 100%" });
        }
        gsap.set(fades, { opacity: 0, y: still ? 0 : 16 });

        const timeline = gsap.timeline({
          delay: single ? 0 : index * 0.15,
          paused: true,
        });
        if (still) {
          timeline.to(frame, { opacity: 1, duration: 1, ease: "power2.out" }, 0);
        } else {
          timeline
            .to(
              frame,
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" },
              0,
            )
            .to(image, { scale: 1, duration: 2, ease: "expo.out" }, 0.15);
        }
        timeline.to(
          fades,
          { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.08 },
          still ? 0.3 : 0.9,
        );
        playOnArrival(timeline, row, START);
      });
    });

    return () => context.revert();
  }, []);

  return null;
}

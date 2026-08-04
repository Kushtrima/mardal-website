"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CARD_TRAVEL = [72, 108, 92, 64, 84] as const;

/**
 * Gives the advanced AI cards a scroll-led entrance without making the
 * surrounding section drift. The card remains attached to the user's hand:
 * scrolling backwards cleanly reverses the same movement.
 */
export function AiCapabilitiesMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(
        "[data-ai-capability-card]",
      );

      cards.forEach((card, index) => {
        const cardDetails = card.querySelectorAll<HTMLElement>(
          ".ai-capability-card__title, .ai-capability-card__copy, .ai-capability-card__list",
        );

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: index % 2 === 0 ? "top 94%" : "top 90%",
            end: index % 2 === 0 ? "top 47%" : "top 43%",
            scrub: 0.55,
          },
        });

        timeline
          .fromTo(
            card,
            {
              y: CARD_TRAVEL[index] ?? 72,
              scale: 0.965,
              opacity: 0.42,
              filter: "brightness(0.66) saturate(0.76)",
              transformOrigin: "50% 100%",
            },
            {
              y: 0,
              scale: 1,
              opacity: 1,
              filter: "brightness(1) saturate(1)",
              duration: 1,
              ease: "none",
            },
            0,
          )
          .fromTo(
            cardDetails,
            { y: 22, opacity: 0.58 },
            {
              y: 0,
              opacity: 1,
              duration: 0.72,
              stagger: 0.035,
              ease: "none",
            },
            0.16,
          );
      });
    });

    void document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => context.revert();
  }, []);

  return null;
}

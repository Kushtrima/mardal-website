"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Turns the service offerings into one pinned stack.
 *
 * The section stays in one viewport position while each new panel rises from
 * below and lands directly on the previous one. The covered text fades away
 * as the new content takes its exact position.
 */
export function AiAutomationOfferingsScroll() {
  useEffect(() => {
    let context: gsap.Context | undefined;

    const frame = window.requestAnimationFrame(() => {
      const section = document.querySelector<HTMLElement>(
        "[data-service-offerings]",
      );
      if (!section) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const cards = gsap.utils.toArray<HTMLElement>(
        "[data-service-offering]",
        section,
      );
      if (cards.length < 2) return;

      gsap.registerPlugin(ScrollTrigger);
      section.classList.add("is-scroll-stack");

      context = gsap.context(() => {
        cards.forEach((card, index) => {
          gsap.set(card, {
            autoAlpha: index === 0 ? 1 : 0,
            yPercent: index === 0 ? 0 : 104,
            zIndex: index + 1,
          });
        });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () =>
              `+=${window.innerHeight * (cards.length - 1) * 1.15}`,
            pin: true,
            scrub: 0.55,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        cards.slice(1).forEach((card, index) => {
          const coveredCard = cards[index];

          timeline
            .to(
              coveredCard,
              {
                autoAlpha: 0,
                y: -18,
                duration: 0.72,
                ease: "none",
              },
              index,
            )
            .to(
              card,
              {
                autoAlpha: 1,
                yPercent: 0,
                duration: 1,
                ease: "none",
              },
              index,
            );
        });
      }, section);

      void document.fonts.ready.then(() => ScrollTrigger.refresh());
    });

    return () => {
      window.cancelAnimationFrame(frame);
      context?.revert();

      const section = document.querySelector<HTMLElement>(
        "[data-service-offerings]",
      );
      section?.classList.remove("is-scroll-stack");
    };
  }, []);

  return null;
}

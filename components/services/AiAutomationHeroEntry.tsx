"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";

/**
 * A single route-entry sequence for the AI & Automation hero.
 *
 * The pattern keeps its responsive CSS transform untouched; its motion is a
 * clip reveal, while the three text elements use shallow positional movement.
 */
export function AiAutomationHeroEntry() {
  useLayoutEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-service-hero]");
    if (!hero) return;

    const title = hero.querySelector<HTMLElement>(
      "[data-service-hero-title]",
    );
    const pattern = hero.querySelector<HTMLElement>(
      "[data-service-hero-pattern]",
    );
    const support = hero.querySelector<HTMLElement>(
      "[data-service-hero-support]",
    );
    const cta = hero.querySelector<HTMLElement>("[data-service-hero-cta]");
    const targets = [title, pattern, support, cta].filter(
      (target): target is HTMLElement => target !== null,
    );

    if (!targets.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(targets, { clearProps: "all" });
      return;
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      if (title) {
        timeline.fromTo(
          title,
          {
            autoAlpha: 0,
            clipPath: "inset(0 0 100% 0)",
            y: 52,
          },
          {
            autoAlpha: 1,
            clipPath: "inset(0 0 0% 0)",
            duration: 0.95,
            y: 0,
          },
          0,
        );
      }

      if (pattern) {
        timeline.fromTo(
          pattern,
          {
            autoAlpha: 0,
            clipPath: "inset(0 0 0 100%)",
          },
          {
            autoAlpha: 1,
            clipPath: "inset(0 0 0 0%)",
            duration: 1.05,
            ease: "power3.inOut",
          },
          0.22,
        );
      }

      if (support) {
        timeline.fromTo(
          support,
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, duration: 0.72, y: 0 },
          0.58,
        );
      }

      if (cta) {
        timeline.fromTo(
          cta,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, duration: 0.66, y: 0 },
          0.72,
        );
      }
    }, hero);

    return () => {
      context.revert();
    };
  }, []);

  return null;
}

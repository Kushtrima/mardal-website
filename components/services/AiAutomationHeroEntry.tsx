"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * A single route-entry sequence for the AI & Automation hero.
 *
 * The pattern keeps its responsive CSS transform untouched; its motion is a
 * clip reveal, while the three text elements use shallow positional movement.
 */
export function AiAutomationHeroEntry() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const hero = document.querySelector<HTMLElement>("[data-service-hero]");
    const page = document.querySelector<HTMLElement>("[data-service-page]");
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
      if (page) {
        page.style.setProperty("--service-surface", "#050505");
        page.style.setProperty("--service-ink", "#f5f5f5");
      }
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
            onComplete: () => {
              gsap.set(title, { clearProps: "clipPath" });
            },
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

      if (page) {
        gsap.to(page, {
          "--service-surface": "#050505",
          "--service-ink": "#f5f5f5",
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "bottom bottom",
            end: "bottom 35%",
            scrub: true,
          },
        });
      }
    }, hero);

    return () => {
      context.revert();
    };
  }, []);

  return null;
}

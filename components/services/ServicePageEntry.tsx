"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Shared route-entry sequence for editorial service-page heroes.
 *
 * The pattern keeps its responsive CSS transform untouched; its motion is a
 * clip reveal, while the three text elements use shallow positional movement.
 */
export function ServicePageEntry() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const hero = document.querySelector<HTMLElement>("[data-service-hero]");
    if (!hero) return;

    /* Only the unwritten pages carry one — see PlaceholderPage. Every other
       hero here is named by its own heading and has nothing to put above it, so
       this is queried the way the blur and the fade below are: a hero without
       one simply does not get the tween. */
    const eyebrow = hero.querySelector<HTMLElement>(
      "[data-service-hero-eyebrow]",
    );
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
    const targets = [eyebrow, title, pattern, support, cta].filter(
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

      /* With the title, not before it. The two are one block — the name of the
         page and the sentence it stands over — and an eyebrow already sitting
         there while the heading is still uncovering reads as a label the page
         arrived around rather than as part of it. It settles first because it
         is one short line and the heading is a clip reveal of two. */
      if (eyebrow) {
        timeline.fromTo(
          eyebrow,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, duration: 0.66, y: 0 },
          0,
        );
      }

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

      /* The surface used to scrub from the white page to near-black as the
         hero left. The page is black now, so there is nothing to travel to and
         the service pages hold one ground the whole way down. The hero's own
         entrance above is untouched. */
    }, hero);

    /* The dissolve, on the same numbers as the homepage bar field: the pair
       fades in between 12% and 62% of the hero's height, while the blur's top
       edge travels from 34% down to -45% across the hero's full height, so the
       blurred band grows upward as the hero leaves. Pages without the two
       elements simply do not get it. */
    const blur = hero.querySelector<HTMLElement>("[data-service-hero-blur]");
    const fade = hero.querySelector<HTMLElement>("[data-service-hero-fade]");
    let updateScrollBlur: (() => void) | null = null;

    if (blur && fade) {
      const setBlurOpacity = gsap.quickTo(blur, "opacity", {
        duration: 0.28,
        ease: "power2.out",
      });
      const setFadeOpacity = gsap.quickTo(fade, "opacity", {
        duration: 0.32,
        ease: "power2.out",
      });
      const setBlurBoundary = gsap.quickTo(blur, "--service-hero-blur-start", {
        duration: 0.28,
        ease: "power2.out",
      });

      updateScrollBlur = () => {
        const heroHeight = hero.offsetHeight;
        const start = heroHeight * 0.12;
        const end = heroHeight * 0.62;
        const progress = Math.min(
          1,
          Math.max(0, (window.scrollY - start) / (end - start)),
        );
        const movementProgress = Math.min(
          1,
          Math.max(0, (window.scrollY - start) / (heroHeight - start)),
        );

        setBlurOpacity(progress);
        setFadeOpacity(progress);
        setBlurBoundary(34 - movementProgress * 79);
      };

      updateScrollBlur();
      window.addEventListener("scroll", updateScrollBlur, { passive: true });
    }

    return () => {
      if (updateScrollBlur) {
        window.removeEventListener("scroll", updateScrollBlur);
      }
      context.revert();
    };
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const START = "top 88%";
const END = "top 48%";
const SCRUB = 0.4;
const EASE = "power2.inOut";
const COMMIT = 0.4;
const REVERSAL = 0.02;
const START_FRACTION = 0.88;

export function SectionEnter() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(
        "main > section[data-route-section]",
      );

      sections.forEach((section) => {
        const headingId = section.getAttribute("aria-labelledby");
        const heading = headingId ? document.getElementById(headingId) : null;
        const anchor = heading ?? section;

        if (
          anchor.getBoundingClientRect().top <
          window.innerHeight * START_FRACTION
        ) {
          return;
        }

        const crossed = { progress: 0 };
        const shown = { progress: 0 };
        let committed = false;

        function paint() {
          gsap.set(section, {
            clipPath: `inset(0% ${(1 - shown.progress) * 100}% 0% 0%)`,
          });
        }

        function settle() {
          gsap.set(section, { clearProps: "clipPath" });
          section.style.removeProperty("clip-path");
        }

        function finish() {
          committed = true;
          settle();
        }

        function commit() {
          committed = true;

          gsap.to(shown, {
            progress: 1,
            duration: COMMIT,
            ease: "power2.out",
            onUpdate: paint,
            onComplete: finish,
          });
        }

        paint();

        gsap.to(crossed, {
          progress: 1,
          ease: EASE,
          scrollTrigger: {
            trigger: anchor,
            start: START,
            end: END,
            scrub: SCRUB,
          },
          onUpdate: () => {
            if (committed) return;

            if (crossed.progress < shown.progress - REVERSAL) {
              commit();
              return;
            }

            if (crossed.progress <= shown.progress) return;
            shown.progress = crossed.progress;

            if (shown.progress >= 0.999) {
              finish();
              return;
            }

            paint();
          },
        });
      });
    });

    let live = true;
    document.fonts?.ready.then(() => {
      if (live) ScrollTrigger.refresh();
    });

    function handlePreference() {
      if (reduced.matches) context.revert();
    }

    reduced.addEventListener("change", handlePreference);

    return () => {
      live = false;
      reduced.removeEventListener("change", handlePreference);
      context.revert();
    };
  }, []);

  return null;
}

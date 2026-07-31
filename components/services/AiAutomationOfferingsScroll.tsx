"use client";

import { useEffect } from "react";
import gsap from "gsap";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Progressively enhances the native service details rows.
 *
 * Scrolling, focus, keyboard interaction, and the open state all remain native
 * browser behavior. JavaScript only keeps one row open per chapter and adds a
 * restrained reveal to the newly opened panel.
 */
export function AiAutomationOfferingsScroll() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const animatedPanels = new Set<HTMLElement>();
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);

    const frame = window.requestAnimationFrame(() => {
      const section = document.querySelector<HTMLElement>(
        "[data-service-offerings]",
      );
      if (!section) return;

      const chapters = Array.from(
        section.querySelectorAll<HTMLElement>("[data-service-chapter]"),
      );

      chapters.forEach((chapter) => {
        const rows = Array.from(
          chapter.querySelectorAll<HTMLDetailsElement>(
            "details[data-service-row]",
          ),
        );

        if (rows.length === 0) return;

        const initiallyOpenRows = rows.filter((row) => row.open);
        initiallyOpenRows.slice(1).forEach((row) => {
          row.open = false;
        });

        rows.forEach((row) => {
          const panel = row.querySelector<HTMLElement>(
            "[data-service-row-panel]",
          );

          const handleToggle = () => {
            if (!panel) return;

            gsap.killTweensOf(panel);
            animatedPanels.add(panel);

            if (!row.open) {
              gsap.set(panel, { clearProps: "opacity,transform" });
              return;
            }

            rows.forEach((otherRow) => {
              if (otherRow !== row && otherRow.open) {
                otherRow.open = false;
              }
            });

            if (reducedMotion.matches) {
              gsap.set(panel, { clearProps: "opacity,transform" });
              return;
            }

            gsap.fromTo(
              panel,
              {
                opacity: 0,
                y: 12,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.38,
                ease: "power2.out",
                clearProps: "opacity,transform",
                overwrite: true,
              },
            );
          };

          row.addEventListener("toggle", handleToggle);
          cleanups.push(() => row.removeEventListener("toggle", handleToggle));
        });
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
      cleanups.forEach((cleanup) => cleanup());
      gsap.killTweensOf(Array.from(animatedPanels));
      gsap.set(Array.from(animatedPanels), {
        clearProps: "opacity,transform",
      });
    };
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";
import gsap from "gsap";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Progressively enhances the native service details rows.
 *
 * The details elements remain accessible without JavaScript. With JavaScript,
 * their height and content animate as one continuous gesture while each
 * chapter keeps a single focused service open.
 */
export function AiAutomationOfferingsScroll() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const activeTimelines = new Map<
      HTMLDetailsElement,
      gsap.core.Timeline
    >();
    const targetStates = new Map<HTMLDetailsElement, boolean>();
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
          targetStates.set(row, row.open);

          const summary = row.querySelector<HTMLElement>("summary");
          const panel = row.querySelector<HTMLElement>(
            "[data-service-row-panel]",
          );
          if (!summary || !panel) return;

          const setRowState = (shouldOpen: boolean) => {
            targetStates.set(row, shouldOpen);
            activeTimelines.get(row)?.kill();

            if (reducedMotion.matches) {
              row.open = shouldOpen;
              gsap.set([row, panel], {
                clearProps: "height,overflow,opacity,transform",
              });
              return;
            }

            const startHeight = row.offsetHeight;
            let endHeight: number;

            // A rapid second interaction can interrupt the previous tween.
            // Remove its temporary height before measuring the new destination.
            gsap.set(row, { clearProps: "height,overflow" });

            if (shouldOpen) {
              row.open = true;
              endHeight = row.offsetHeight;
            } else {
              // Measure the native closed height synchronously, then restore
              // the open state so the content remains visible while it folds.
              row.open = false;
              endHeight = row.offsetHeight;
              row.open = true;
            }

            gsap.set(row, {
              height: startHeight,
              overflow: "clip",
            });

            if (shouldOpen && !panel.style.opacity) {
              gsap.set(panel, { opacity: 0, y: 22 });
            }

            const timeline = gsap.timeline({
              onComplete: () => {
                if (!shouldOpen) {
                  row.open = false;
                }

                gsap.set([row, panel], {
                  clearProps: "height,overflow,opacity,transform",
                });
                activeTimelines.delete(row);
              },
            });

            timeline.to(
              row,
              {
                height: endHeight,
                duration: shouldOpen ? 0.82 : 0.68,
                ease: "power3.inOut",
              },
              0,
            );

            timeline.to(
              panel,
              shouldOpen
                ? {
                    opacity: 1,
                    y: 0,
                    duration: 0.58,
                    ease: "power3.out",
                  }
                : {
                    opacity: 0,
                    y: -12,
                    duration: 0.32,
                    ease: "power2.in",
                  },
              shouldOpen ? 0.18 : 0,
            );

            activeTimelines.set(row, timeline);
          };

          const handleClick = (event: MouseEvent) => {
            event.preventDefault();
            const shouldOpen = !targetStates.get(row);

            if (shouldOpen) {
              rows.forEach((otherRow) => {
                if (otherRow !== row && targetStates.get(otherRow)) {
                  const otherSummary =
                    otherRow.querySelector<HTMLElement>("summary");
                  otherSummary?.click();
                }
              });
            }

            setRowState(shouldOpen);
          };

          summary.addEventListener("click", handleClick);
          cleanups.push(() => summary.removeEventListener("click", handleClick));
        });
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
      cleanups.forEach((cleanup) => cleanup());
      activeTimelines.forEach((timeline) => timeline.kill());
      const animatedRows = Array.from(activeTimelines.keys());
      const animatedPanels = animatedRows
        .map((row) =>
          row.querySelector<HTMLElement>("[data-service-row-panel]"),
        )
        .filter((panel): panel is HTMLElement => Boolean(panel));
      gsap.set([...animatedRows, ...animatedPanels], {
        clearProps: "height,overflow,opacity,transform",
      });
    };
  }, []);

  return null;
}

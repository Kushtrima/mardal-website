"use client";

import { useEffect } from "react";
import gsap from "gsap";

/**
 * The hero pattern travels: each band slides one full canvas width, some left
 * and some right, and starts the lap again.
 *
 * No wrapping arithmetic and no `gsap.utils.wrap`, because the markup already
 * solves it — `ServiceHeroBars` draws every band twice, one canvas width apart,
 * so a lap of exactly that width leaves the second copy standing where the first
 * one began. `ease: "none"` and `repeat: -1` are then the whole animation: the
 * restart lands on a frame identical to the one before it.
 *
 * Every band starts at zero. First paint is the traced artwork exactly as it
 * was approved, which was the owner's other condition, and the bands come apart
 * on their own within a lap because none of them takes the same time over one.
 *
 * This reads direction and speed off the rendered groups rather than importing
 * the artwork, so it animates whichever pattern it finds and knows about none
 * of them.
 */
export function PatternDrift() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const svg = document.querySelector<SVGSVGElement>("[data-pattern-bars]");
    if (!svg) return;

    const bands = Array.from(
      svg.querySelectorAll<SVGGElement>("[data-pattern-band]"),
    );
    if (!bands.length) return;

    const lap = svg.viewBox.baseVal.width;

    const tweens = bands.map((band) =>
      gsap.fromTo(
        band,
        { x: 0 },
        {
          x: Number(band.dataset.patternDirection) * lap,
          duration: Number(band.dataset.patternDuration),
          ease: "none",
          repeat: -1,
        },
      ),
    );

    /* Nothing runs while the hero is off screen. It is the top of a long page,
       so most of a visit is spent below it, and this is a set of transforms a
       frame competing with ScrollSmoother for the same budget. */
    const watcher = new IntersectionObserver(
      ([entry]) => {
        for (const tween of tweens) {
          if (entry.isIntersecting) tween.resume();
          else tween.pause();
        }
      },
      { rootMargin: "100px" },
    );
    watcher.observe(svg);

    return () => {
      watcher.disconnect();
      for (const tween of tweens) tween.kill();
      gsap.set(bands, { clearProps: "transform" });
    };
  }, []);

  return null;
}

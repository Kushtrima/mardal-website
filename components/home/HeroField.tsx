"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  createHeroFrames,
  heroFrame,
  HERO_FIELD,
  HERO_MODULE_COUNT,
} from "../../lib/hero-motion";

/**
 * The hero's bar field.
 *
 * The boxes are rendered once and then painted by hand: a single frame loop
 * writes attributes straight onto them, rather than re-rendering five hundred
 * elements through React sixty times a second. The film owns the geometry; this
 * owns the clock and the DOM.
 */
export function HeroField() {
  const svgRef = useRef<SVGSVGElement>(null);
  /* The settled pose, which is also what the server sends. */
  const initial = useMemo(() => createHeroFrames(), []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const boxes = Array.from(
      svg.querySelectorAll<SVGRectElement>(".hero-field__box"),
    );
    if (!boxes.length) return;

    const frames = createHeroFrames();
    /* Last value written per box, so an unchanged attribute is left alone. */
    const painted = frames.map(() => ({ x: 0, y: 0, w: 0, h: 0, fill: "" }));

    function paint(elapsed: number) {
      heroFrame(elapsed, frames);

      for (let i = 0; i < boxes.length; i++) {
        const f = frames[i];
        const was = painted[i];
        const box = boxes[i];

        const x = Math.round(f.x * 100) / 100;
        const y = Math.round(f.y * 100) / 100;
        const w = Math.round(Math.max(0, f.w) * 100) / 100;
        const h = Math.round(Math.max(0, f.h) * 100) / 100;

        if (x !== was.x) box.setAttribute("x", `${(was.x = x)}`);
        if (y !== was.y) box.setAttribute("y", `${(was.y = y)}`);
        if (w !== was.w) box.setAttribute("width", `${(was.w = w)}`);
        if (h !== was.h) box.setAttribute("height", `${(was.h = h)}`);
        if (f.fill !== was.fill) box.setAttribute("fill", (was.fill = f.fill));
      }
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      paint(0);
      return;
    }

    let frame = 0;
    let start = 0;
    /* Time only advances while the hero is on screen, so a loop that ran while
       it was scrolled past does not jump when it comes back. */
    let elapsed = 0;
    let last = 0;

    function tick(now: number) {
      if (!start) {
        start = now;
        last = now;
      }
      elapsed += Math.min(now - last, 100) / 1000;
      last = now;
      paint(elapsed);
      frame = requestAnimationFrame(tick);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !frame) {
          last = performance.now();
          frame = requestAnimationFrame(tick);
        } else if (!entry.isIntersecting && frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { rootMargin: "0px" },
    );
    observer.observe(svg);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <svg
      className="hero-field"
      /* The band, not the frame — see HERO_FIELD. Its box is given the band's
         own proportion in the stylesheet, so nothing is cropped either way;
         YMax keeps it standing on the foot if the two ever disagree. */
      viewBox={`0 ${HERO_FIELD.top} ${HERO_FIELD.width} ${HERO_FIELD.height}`}
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
      ref={svgRef}
    >
      {Array.from({ length: HERO_MODULE_COUNT }, (_, i) => (
        <rect
          className="hero-field__box"
          key={i}
          x={initial[i].x}
          y={initial[i].y}
          width={initial[i].w}
          height={initial[i].h}
          fill={initial[i].fill}
        />
      ))}
    </svg>
  );
}

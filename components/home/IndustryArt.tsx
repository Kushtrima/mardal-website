"use client";

import { useEffect, useRef } from "react";
import {
  GATE_LINES,
  POOL,
  REST_PROGRESS,
  RING_CENTER,
  RING_DOTS,
  RING_PATH,
  SCENE_SECONDS,
  STAGE,
  industryFrame,
} from "../../lib/industry-motion";
import type { ArtDot } from "../../lib/industry-motion";
import type { IndustryId } from "../../lib/industries";

const MOVER_RADIUS = 13;
const slots = (count: number) => Array.from({ length: count }, (_, i) => i);

/** Scales a lane arc around the ring's centre instead of rebuilding its path. */
const laneTransform = (scale: number) =>
  `translate(${RING_CENTER.x} ${RING_CENTER.y}) scale(${scale.toFixed(4)}) ` +
  `translate(${-RING_CENTER.x} ${-RING_CENTER.y})`;

function writeDot(rect: SVGRectElement, dot: ArtDot, opacity: number) {
  rect.setAttribute("x", (-dot.rx).toFixed(1));
  rect.setAttribute("y", (-dot.ry).toFixed(1));
  rect.setAttribute("width", (dot.rx * 2).toFixed(1));
  rect.setAttribute("height", (dot.ry * 2).toFixed(1));
  rect.setAttribute("rx", dot.corner.toFixed(1));
  rect.setAttribute("ry", Math.min(dot.corner, dot.ry).toFixed(1));
  rect.setAttribute(
    "transform",
    `translate(${dot.x.toFixed(1)} ${dot.y.toFixed(1)}) rotate(${dot.rot.toFixed(1)})`,
  );
  rect.setAttribute("opacity", opacity.toFixed(3));
}

type IndustryArtProps = {
  industry: IndustryId;
  /** Called each time the scene reaches the end of its run. */
  onCycleEnd?: () => void;
};

/**
 * The industries drawing. Every scene draws from the same set of shapes, so the
 * elements are rendered once and each frame is written straight onto their
 * attributes — no React work between frames.
 */
export function IndustryArt({ industry, onCycleEnd }: IndustryArtProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  /* Kept in a ref so a new handler does not restart the scene mid-run. */
  const cycleRef = useRef(onCycleEnd);
  const ringRef = useRef<SVGPathElement>(null);
  const gateRef = useRef<SVGGElement>(null);
  const laneRefs = useRef<(SVGPathElement | null)[]>([]);
  const railRefs = useRef<(SVGLineElement | null)[]>([]);
  const moverRefs = useRef<(SVGCircleElement | null)[]>([]);
  const pulseRefs = useRef<(SVGCircleElement | null)[]>([]);
  const dotRefs = useRef<(SVGRectElement | null)[]>([]);
  const maskRefs = useRef<(SVGRectElement | null)[]>([]);
  const extraRefs = useRef<(SVGRectElement | null)[]>([]);

  useEffect(() => {
    cycleRef.current = onCycleEnd;
  }, [onCycleEnd]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    function paint(progress: number) {
      const frame = industryFrame(industry, progress);

      const ring = ringRef.current;
      if (ring) {
        ring.setAttribute("stroke-opacity", frame.ring.opacity.toFixed(3));
        ring.setAttribute("stroke-width", frame.ring.width.toFixed(2));
      }

      laneRefs.current.forEach((lane, index) => {
        if (!lane) return;
        const value = frame.lanes[index];

        lane.setAttribute("stroke-opacity", (value?.opacity ?? 0).toFixed(3));
        if (value) lane.setAttribute("transform", laneTransform(value.scale));
      });

      gateRef.current?.setAttribute(
        "stroke-opacity",
        (0.8 * frame.gate).toFixed(3),
      );

      railRefs.current.forEach((line, index) => {
        if (!line) return;
        const rail = frame.rails[index];

        if (!rail) {
          line.setAttribute("stroke-opacity", "0");
          return;
        }

        line.setAttribute("x1", rail.x.toFixed(1));
        line.setAttribute("y1", rail.y.toFixed(1));
        line.setAttribute("x2", (rail.x + rail.width).toFixed(1));
        line.setAttribute("y2", rail.y.toFixed(1));
        line.setAttribute("stroke-opacity", (0.6 * rail.opacity).toFixed(3));
      });

      moverRefs.current.forEach((circle, index) => {
        if (!circle) return;
        const mover = frame.movers[index];

        if (!mover) {
          circle.setAttribute("opacity", "0");
          return;
        }

        circle.setAttribute("cx", mover.x.toFixed(1));
        circle.setAttribute("cy", mover.y.toFixed(1));
        circle.setAttribute("opacity", mover.opacity.toFixed(3));
      });

      pulseRefs.current.forEach((circle, index) => {
        if (!circle) return;
        const pulse = frame.pulses[index];

        if (!pulse) {
          circle.setAttribute("stroke-opacity", "0");
          return;
        }

        circle.setAttribute("cx", pulse.x.toFixed(1));
        circle.setAttribute("cy", pulse.y.toFixed(1));
        circle.setAttribute("r", pulse.r.toFixed(1));
        circle.setAttribute("stroke-opacity", pulse.opacity.toFixed(3));
      });

      frame.dots.forEach((dot, index) => {
        const mask = maskRefs.current[index];
        const rect = dotRefs.current[index];

        /* The backing rect keeps the ring from showing through a dot that has
           gone hollow. */
        if (mask) writeDot(mask, dot, 1);
        if (!rect) return;

        writeDot(rect, dot, 1);
        rect.setAttribute("fill-opacity", dot.fill.toFixed(3));
        rect.setAttribute("stroke-opacity", dot.stroke.toFixed(3));
      });

      extraRefs.current.forEach((rect, index) => {
        if (!rect) return;
        const extra = frame.extras[index];

        if (!extra) {
          rect.setAttribute("opacity", "0");
          return;
        }

        writeDot(rect, extra, extra.fill);
      });
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      paint(REST_PROGRESS);
      return;
    }

    const duration = SCENE_SECONDS[industry] ?? 5;
    let frame = 0;
    let start = 0;
    let run = 0;

    function tick(now: number) {
      if (!start) start = now;

      const elapsed = (now - start) / 1000;
      const finished = Math.floor(elapsed / duration);

      paint((elapsed % duration) / duration);
      frame = requestAnimationFrame(tick);

      /* Last, so the scene has painted its closing frame before whatever the
         handler does — usually moving on to the next industry. */
      if (finished > run) {
        run = finished;
        cycleRef.current?.();
      }
    }

    /* Nothing to run while the section is off screen. */
    const observer = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(frame);
        if (!entry?.isIntersecting) return;

        start = 0;
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0 },
    );

    observer.observe(svg);
    paint(0);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [industry]);

  return (
    <svg
      className="industry-art"
      ref={svgRef}
      viewBox={`0 0 ${STAGE.width} ${STAGE.height}`}
      /* Held to the right edge, so the ring keeps hanging off the page however
         tall the section grows. */
      preserveAspectRatio="xMaxYMid meet"
      data-industry={industry}
    >
      <path className="industry-art__ring" d={RING_PATH} ref={ringRef} />

      <g className="industry-art__lanes">
        {slots(POOL.lanes).map((index) => (
          <path
            d={RING_PATH}
            strokeOpacity="0"
            ref={(node) => {
              laneRefs.current[index] = node;
            }}
            key={index}
          />
        ))}
      </g>

      <g className="industry-art__gate" strokeOpacity="0" ref={gateRef}>
        {GATE_LINES.map((line) => (
          <line
            x1={line.x}
            y1={line.y1}
            x2={line.x}
            y2={line.y2}
            key={line.x}
          />
        ))}
      </g>

      <g className="industry-art__rails">
        {slots(POOL.rails).map((index) => (
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="0"
            strokeOpacity="0"
            ref={(node) => {
              railRefs.current[index] = node;
            }}
            key={index}
          />
        ))}
      </g>

      <g className="industry-art__movers">
        {slots(POOL.movers).map((index) => (
          <circle
            cx="0"
            cy="0"
            r={MOVER_RADIUS}
            opacity="0"
            ref={(node) => {
              moverRefs.current[index] = node;
            }}
            key={index}
          />
        ))}
      </g>

      <g className="industry-art__pulses">
        {slots(POOL.pulses).map((index) => (
          <circle
            cx="0"
            cy="0"
            r="0"
            strokeOpacity="0"
            ref={(node) => {
              pulseRefs.current[index] = node;
            }}
            key={index}
          />
        ))}
      </g>

      <g className="industry-art__masks">
        {RING_DOTS.map((dot, index) => (
          <rect
            x={-42}
            y={-42}
            width={84}
            height={84}
            rx={42}
            ry={42}
            transform={`translate(${dot.x} ${dot.y})`}
            ref={(node) => {
              maskRefs.current[index] = node;
            }}
            key={`${dot.x},${dot.y}`}
          />
        ))}
      </g>

      <g className="industry-art__dots">
        {RING_DOTS.map((dot, index) => (
          <rect
            x={-42}
            y={-42}
            width={84}
            height={84}
            rx={42}
            ry={42}
            transform={`translate(${dot.x} ${dot.y})`}
            ref={(node) => {
              dotRefs.current[index] = node;
            }}
            key={`${dot.x},${dot.y}`}
          />
        ))}
      </g>

      <g className="industry-art__extras">
        {slots(POOL.extras).map((index) => (
          <rect
            x="0"
            y="0"
            width="0"
            height="0"
            opacity="0"
            ref={(node) => {
              extraRefs.current[index] = node;
            }}
            key={index}
          />
        ))}
      </g>
    </svg>
  );
}

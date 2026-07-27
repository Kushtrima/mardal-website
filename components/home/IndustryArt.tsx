"use client";

import { useEffect, useRef } from "react";
import {
  GATE_LINES,
  POOL,
  REST_PROGRESS,
  RING_SEGMENTS,
  SCENE_SECONDS,
  STAGE,
  industryFrame,
} from "../../lib/industry-motion";
import type { ArtDot } from "../../lib/industry-motion";
import type { IndustryId } from "../../lib/industries";

const MOVER_RADIUS = 8;
const RING_CENTER = { x: 700, y: 540 };
const slots = (count: number) => Array.from({ length: count }, (_, i) => i);

/** Scales a lane arc around the ring's centre instead of rebuilding it. */
const laneTransform = (scale: number) =>
  `translate(${RING_CENTER.x} ${RING_CENTER.y}) scale(${scale.toFixed(4)}) ` +
  `translate(${-RING_CENTER.x} ${-RING_CENTER.y})`;

/** The arc, as the segments that let it fade out and light up in parts. */
function RingArc() {
  return (
    <>
      {RING_SEGMENTS.map((segment) => (
        <line
          x1={segment.x1}
          y1={segment.y1}
          x2={segment.x2}
          y2={segment.y2}
          strokeOpacity={segment.opacity}
          key={segment.angle}
        />
      ))}
    </>
  );
}

function writeDot(rect: SVGRectElement, dot: ArtDot) {
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
  rect.setAttribute("opacity", dot.op.toFixed(3));
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
  const ringRef = useRef<SVGGElement>(null);
  const segmentRefs = useRef<(SVGLineElement | null)[]>([]);
  const gateRef = useRef<SVGGElement>(null);
  const laneRefs = useRef<(SVGGElement | null)[]>([]);
  const moverRefs = useRef<(SVGCircleElement | null)[]>([]);
  const pulseRefs = useRef<(SVGCircleElement | null)[]>([]);
  const dotRefs = useRef<(SVGRectElement | null)[]>([]);
  const maskRefs = useRef<(SVGRectElement | null)[]>([]);

  useEffect(() => {
    cycleRef.current = onCycleEnd;
  }, [onCycleEnd]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    function paint(progress: number) {
      const frame = industryFrame(industry, progress);

      ringRef.current?.setAttribute(
        "stroke-width",
        frame.ring.width.toFixed(2),
      );
      segmentRefs.current.forEach((line, index) => {
        line?.setAttribute(
          "stroke-opacity",
          (frame.ring.opacities[index] ?? 0).toFixed(3),
        );
      });

      laneRefs.current.forEach((lane, index) => {
        if (!lane) return;
        const value = frame.lanes[index];

        lane.setAttribute("opacity", (value?.opacity ?? 0).toFixed(3));
        if (value) lane.setAttribute("transform", laneTransform(value.scale));
      });

      gateRef.current?.setAttribute(
        "stroke-opacity",
        (0.8 * frame.gate).toFixed(3),
      );

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

      dotRefs.current.forEach((rect, index) => {
        const mask = maskRefs.current[index];
        const dot = frame.dots[index];

        if (!dot) {
          rect?.setAttribute("opacity", "0");
          mask?.setAttribute("opacity", "0");
          return;
        }

        /* The backing rect keeps the arc from showing through a dot that has
           gone hollow. */
        if (mask) writeDot(mask, dot);
        if (!rect) return;

        writeDot(rect, dot);
        rect.setAttribute("fill-opacity", dot.fill.toFixed(3));
        rect.setAttribute("stroke-opacity", dot.stroke.toFixed(3));
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

    /* The run starts when the section is actually reached rather than when its
       edge first touches the viewport, and stops again once it is behind. */
    const observer = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(frame);
        if (!entry?.isIntersecting) return;

        start = 0;
        frame = requestAnimationFrame(tick);
      },
      { rootMargin: "-20% 0px -20% 0px" },
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
      /* Held to the left edge, where the film puts the ring. */
      preserveAspectRatio="xMinYMid meet"
      data-industry={industry}
    >
      <g className="industry-art__ring" ref={ringRef}>
        {RING_SEGMENTS.map((segment, index) => (
          <line
            x1={segment.x1}
            y1={segment.y1}
            x2={segment.x2}
            y2={segment.y2}
            strokeOpacity={segment.opacity}
            ref={(node) => {
              segmentRefs.current[index] = node;
            }}
            key={segment.angle}
          />
        ))}
      </g>

      <g className="industry-art__lanes">
        {slots(POOL.lanes).map((index) => (
          <g
            opacity="0"
            ref={(node) => {
              laneRefs.current[index] = node;
            }}
            key={index}
          >
            <RingArc />
          </g>
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
        {slots(POOL.dots).map((index) => (
          <rect
            x="0"
            y="0"
            width="0"
            height="0"
            opacity="0"
            ref={(node) => {
              maskRefs.current[index] = node;
            }}
            key={index}
          />
        ))}
      </g>

      <g className="industry-art__dots">
        {slots(POOL.dots).map((index) => (
          <rect
            x="0"
            y="0"
            width="0"
            height="0"
            opacity="0"
            ref={(node) => {
              dotRefs.current[index] = node;
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
    </svg>
  );
}

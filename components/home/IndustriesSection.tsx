"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "../layout/Container";
import { PixelArrow } from "../ui/PixelArrow";
import { solutions } from "../../content/home";

/** The rule beside each industry takes the next of the four brand colours. */
const TINTS = ["one", "two", "three", "four"] as const;

/** How long each industry holds before the next one takes over, on the clock
 *  rather than the scrollbar. */
const HOLD_MS = 3000;

/**
 * How much page each industry is given while the section is held.
 *
 * A fraction of the window, so the run takes the same number of wheel turns on
 * a laptop as on a monitor.
 */
const STEP_VH = 0.45;

/**
 * How long a wheel gesture is ignored after it has moved the run on.
 *
 * A flick of a wheel or a trackpad does not arrive as one event; it arrives as
 * a burst, and then as a tail of momentum that can run for the best part of a
 * second. Without this, one flick spent the whole run in a blur. It has to
 * outlast that tail and still be under the time it takes to look at an
 * industry and decide to move on.
 */
const STEP_LOCK_MS = 700;

/** Below this the two columns stack and there is no room to hold anything. */
const MIN_WIDTH = "(min-width: 60rem)";

/** Whether the section is driven by the scrollbar or by a timer. */
function canPin() {
  return (
    window.matchMedia(MIN_WIDTH).matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function IndustriesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  /* What the wheel counts from. The rendered index comes from the scroll
     position; this follows it so a gesture knows which step it is leaving. */
  const indexRef = useRef(0);

  /**
   * Held in place, and stepped through one industry per gesture.
   *
   * The section stops under the header and the scroll position IS the index, so
   * scrolling back up walks the list backwards, which a timer can never do.
   *
   * The wheel is taken over while the section is held, and that is the point of
   * this rather than a detail of it. Left to the page, how many industries went
   * by depended on how hard the wheel was turned, and a firm flick took four or
   * five of them before anything could be read. Here a gesture is worth exactly
   * one industry however hard it is made: the page is sent to the next stop and
   * the wheel is ignored until it has settled there.
   *
   * At either end of the list the wheel is handed straight back, so the section
   * lets go and the page carries on as it always did — there is no way to get
   * stuck in it.
   */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !canPin()) return;

    gsap.registerPlugin(ScrollTrigger);

    const count = solutions.items.length;
    let trigger: ScrollTrigger | undefined;
    let lockedUntil = 0;

    function onWheel(event: WheelEvent) {
      if (!trigger || !trigger.isActive) return;

      const direction = event.deltaY > 0 ? 1 : -1;
      const next = indexRef.current + direction;

      /* Off either end: give the wheel back rather than swallowing it, so the
         page scrolls out of the section the way it arrived. */
      if (next < 0 || next > count - 1) return;

      event.preventDefault();

      if (performance.now() < lockedUntil) return;
      lockedUntil = performance.now() + STEP_LOCK_MS;

      /* Sent to the middle of the step rather than its edge: the smoother
         glides rather than jumps, and a target on the boundary would sit one
         pixel from tipping into the industry next door. */
      const step = (trigger.end - trigger.start) / count;
      window.scrollTo(0, Math.round(trigger.start + (next + 0.5) * step));
    }

    const context = gsap.context(() => {
      trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${count * STEP_VH * window.innerHeight}`,
        pin: true,
        invalidateOnRefresh: true,
        /* The scroll position stays the one source of the index, whatever
           moved it — the wheel, a dragged scrollbar, a keyboard. The gesture
           above only chooses where to send the page. */
        onUpdate: (self) => {
          const index = Math.min(count - 1, Math.floor(self.progress * count));
          indexRef.current = index;
          setActiveIndex(index);
        },
      });
    }, section);

    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      context.revert();
    };
  }, []);

  /* The clock is the fallback, not a second driver: where the section is held,
     the scrollbar owns the run and a timer underneath it would fight for the
     same index. */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (canPin()) return;

    let timer: number | undefined;

    function start() {
      if (timer) return;

      timer = window.setInterval(() => {
        setActiveIndex((index) => (index + 1) % solutions.items.length);
      }, HOLD_MS);
    }

    function stop() {
      if (!timer) return;

      window.clearInterval(timer);
      timer = undefined;
    }

    /* The run belongs to the section: it starts when the list comes into view
       and stops when it leaves, rather than ticking away out of sight. */
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          return;
        }

        stop();
      },
      { rootMargin: "-20% 0px -20% 0px" },
    );
    observer.observe(list);

    return () => {
      observer.disconnect();
      stop();
    };
  }, []);

  return (
    <section
      className="industries-section"
      id={solutions.id}
      aria-labelledby="industries-title"
      data-route-section
      ref={sectionRef}
    >
      {/* The drawing is centred on this block, with the words either side of
          it: the line and the way on to the left, the industries to the
          right.

          data-enter-mode="none" opts the section out of the arrival every other
          section gets. That arrival is a scroll-driven transform on this same
          element, and a pin is measured while its ancestor's transform is
          applied — the two would fight over where the section rests. */}
      <div className="industries-body" data-enter data-enter-mode="none">
        <Container className="industries-layout">
          <div className="industries-header">
            <h2
              className="industries-title"
              id="industries-title"
            >
              {solutions.lede}
            </h2>
          </div>

          <div className="industries-intro">
            <ul className="industries-list" ref={listRef}>
              {solutions.items.map((industry, index) => (
                <li key={industry.id}>
                  {/* Not a control any more. The scrollbar alone brings an
                      industry forward, so there is nothing here to press: a
                      button that answers to nothing is a trap for anyone
                      arriving on it by keyboard. It keeps its id, which the
                      menu still points at. */}
                  {/* data-cursor is gone with the interaction. It is the hook
                      for the hover mark and for the finger cursor, and both
                      would now be promising something the word cannot do. */}
                  <div
                    className={`industries-item industries-item--${TINTS[index % TINTS.length]}`}
                    id={industry.id}
                    data-active={index === activeIndex}
                  >
                    <span className="industries-item__name">
                      {/* A rule out to the left of the name, shown only on the
                          industry the run is on. A second copy of it turns
                          upright a moment later and the two make a cross. */}
                      <span className="industries-item__mark" aria-hidden="true" />
                      <span
                        className="industries-item__mark industries-item__mark--cross"
                        aria-hidden="true"
                      />
                      {industry.title}
                    </span>
                    <span className="industries-item__note">
                      {industry.descriptor}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            {/* Under the run rather than beside the heading: it is where you go
                once you have read the list, so it belongs at the end of it.
                Inside this block rather than the grid, because the block
                carries the indent that puts the list where it is — placed as a
                grid row it landed 286px to the left of the names, level with
                nothing at all. */}
            <a className="industries-explore" href="#contact">
              Explore
              <PixelArrow
                className="industries-explore__arrow"
                direction="up-right"
                size="small"
              />
            </a>
          </div>
        </Container>
      </div>
    </section>
  );
}

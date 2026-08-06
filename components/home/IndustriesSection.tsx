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
 * a laptop as on a monitor. Seven industries at this rate hold the section for
 * a little over three screens.
 */
const STEP_VH = 0.45;

/** Below this the two columns stack and there is no room to hold anything. */
const MIN_WIDTH = "(min-width: 60rem)";

/**
 * How far the page has to travel before a pointed-at industry gives the run
 * back.
 *
 * Comfortably past the smoother's own settling drift, and comfortably under
 * one turn of a wheel, so resting on an industry keeps it while a deliberate
 * scroll takes it away.
 */
const RELEASE_PX = 40;

/** Whether the section is driven by the scrollbar or by a timer. */
function canPin() {
  return (
    window.matchMedia(MIN_WIDTH).matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function IndustriesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  /* Held while the visitor is pointing at the list: their choice outranks the
     run through the industries, and the run picks up again when they leave. */
  const heldRef = useRef(false);
  /* Where the page stood when the visitor took hold, so the release below is
     measured from one fixed mark rather than frame to frame. */
  const holdFromRef = useRef<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  /**
   * Held in place, and stepped through by the scrollbar.
   *
   * The section stops under the header and each industry takes its turn as the
   * page travels the distance below — the scroll position IS the index, so
   * scrolling back up walks the list backwards, which a timer can never do.
   *
   * Pointing at an industry still overrules it, and that needs the hold below
   * to survive. ScrollSmoother ticks ScrollTrigger every frame whether or not
   * the page has travelled, so an update that simply re-asserts the scroll
   * index would overwrite a hover within about 16ms — measured: focusing an
   * industry left the index exactly where the scrollbar had it, at a scroll
   * position that had not moved a pixel.
   *
   * So an update that has not travelled does nothing at all, and one that has
   * clears the hold. A hover therefore stands for as long as the page is
   * still, and the first real turn of the wheel takes the run back.
   */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !canPin()) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () =>
          `+=${solutions.items.length * STEP_VH * window.innerHeight}`,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (heldRef.current) {
            /* Measured from where the hold began rather than between frames.
               The smoother is still easing for some time after the page stops
               being pushed, and frame-to-frame that drift is indistinguishable
               from a slow scroll — it cleared the hold before a hover could be
               seen. Against a fixed mark it is simply a few pixels that never
               reach the threshold. */
            const from = holdFromRef.current;
            if (
              from !== null &&
              Math.abs(window.scrollY - from) < RELEASE_PX
            ) {
              return;
            }

            heldRef.current = false;
            holdFromRef.current = null;
          }

          const count = solutions.items.length;
          /* The last industry would hold for a single pixel at progress 1
             without the clamp, since floor(1 * count) is off the end. */
          const index = Math.min(count - 1, Math.floor(self.progress * count));
          setActiveIndex(index);
        },
      });
    }, section);

    return () => {
      context.revert();
    };
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    /* The clock is the fallback, not a second driver: where the section is
       held, the scrollbar owns the run and a timer underneath it would fight
       for the same index. */
    if (canPin()) return;

    let timer: number | undefined;

    function start() {
      if (timer) return;

      timer = window.setInterval(() => {
        if (heldRef.current) return;

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
        /* Letting go is a pointer leaving the list, and a finger never leaves
           it — so on a touch screen one tap would hold that industry for good
           and the run would never pick up again. Scrolling the list away is
           the touch equivalent of leaving it. */
        heldRef.current = false;
      },
      { rootMargin: "-20% 0px -20% 0px" },
    );
    observer.observe(list);

    return () => {
      observer.disconnect();
      stop();
    };
  }, []);

  function hold(index: number) {
    heldRef.current = true;
    holdFromRef.current = window.scrollY;
    setActiveIndex(index);
  }

  function release() {
    heldRef.current = false;
    holdFromRef.current = null;
  }

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

            <a className="industries-explore" href="#contact">
              Explore
              <PixelArrow
                className="industries-explore__arrow"
                direction="up-right"
                size="small"
              />
            </a>
          </div>

          <div className="industries-intro">
            <ul
              className="industries-list"
              ref={listRef}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse") release();
              }}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) release();
              }}
            >
              {solutions.items.map((industry, index) => (
                <li key={industry.id}>
                  {/* A button rather than plain text: pointing at an industry
                      is what brings it forward, and it has to work from the
                      keyboard too. */}
                  <button
                    className={`industries-item industries-item--${TINTS[index % TINTS.length]}`}
                    id={industry.id}
                    data-cursor={TINTS[index % TINTS.length]}
                    type="button"
                    aria-pressed={index === activeIndex}
                    onClick={() => hold(index)}
                    onFocus={() => hold(index)}
                    onPointerEnter={(event) => {
                      if (event.pointerType === "mouse") hold(index);
                    }}
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
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>
    </section>
  );
}

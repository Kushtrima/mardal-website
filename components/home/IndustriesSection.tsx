"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "../layout/Container";
import { PixelArrow } from "../ui/PixelArrow";
import { solutions } from "../../content/home";

/** The rule beside each industry takes the next of the four brand colours. */
const TINTS = ["one", "two", "three", "four"] as const;

/** How long each industry holds before the next one takes over. */
const HOLD_MS = 3000;

export function IndustriesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  /* Held while the visitor is pointing at the list: their choice outranks the
     run through the industries, and the run picks up again when they leave. */
  const heldRef = useRef(false);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
    setActiveIndex(index);
  }

  function release() {
    heldRef.current = false;
  }

  return (
    <section
      className="industries-section"
      id={solutions.id}
      aria-labelledby="industries-title"
      data-route-section
    >
      {/* The drawing is centred on this block, with the words either side of
          it: the line and the way on to the left, the industries to the
          right. */}
      <div className="industries-body">
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

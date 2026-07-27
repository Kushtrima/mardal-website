"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "../layout/Container";
import { RevealGroup } from "../motion/RevealGroup";
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
      ([entry]) => (entry.isIntersecting ? start() : stop()),
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
        <Container className="industries-layout" wide>
          <RevealGroup className="industries-header" stagger={0.12}>
            <h2
              className="industries-title"
              id="industries-title"
              data-reveal-item
            >
              {solutions.lede}
            </h2>

            <a className="industries-explore" href="#contact" data-reveal-item>
              Explore
              <svg
                className="industries-explore__arrow"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M3.5 12h16.5M13.5 5.5 20 12l-6.5 6.5" />
              </svg>
            </a>
          </RevealGroup>

          <RevealGroup
            className="industries-intro"
            preset="upSmall"
            stagger={0.08}
          >
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
                <li key={industry.id} data-reveal-item>
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
          </RevealGroup>
        </Container>
      </div>
    </section>
  );
}

"use client";

import { useCallback, useRef, useState } from "react";
import { Container } from "../layout/Container";
import { RevealGroup } from "../motion/RevealGroup";
import { IndustryArt } from "./IndustryArt";
import { solutions } from "../../content/home";

export function IndustriesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  /* Held while the visitor is pointing at the list: their choice outranks the
     run through the industries, and the run picks up again when they leave. */
  const heldRef = useRef(false);
  const active = solutions.items[activeIndex] ?? solutions.items[0];

  const handleCycleEnd = useCallback(() => {
    if (heldRef.current) return;

    setActiveIndex((index) => (index + 1) % solutions.items.length);
  }, []);

  function hold(index: number) {
    heldRef.current = true;
    setActiveIndex(index);
  }

  return (
    <section
      className="industries-section"
      id={solutions.id}
      aria-labelledby="industries-title"
      data-route-section
    >
      <Container wide>
        <RevealGroup className="industries-intro" preset="upSmall" stagger={0.08}>
          <h2
            className="section-label industries-title"
            id="industries-title"
            data-reveal-item
          >
            {solutions.lede}
          </h2>

          <ul
            className="industries-list"
            onPointerLeave={(event) => {
              if (event.pointerType === "mouse") heldRef.current = false;
            }}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                heldRef.current = false;
              }
            }}
          >
            {solutions.items.map((industry, index) => (
              <li key={industry.id} data-reveal-item>
                {/* A button rather than plain text: pointing at an industry is
                    what swaps the drawing, and it has to work from the keyboard
                    too. */}
                <button
                  className="industries-item"
                  id={industry.id}
                  type="button"
                  aria-pressed={index === activeIndex}
                  onClick={() => hold(index)}
                  onFocus={() => hold(index)}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") hold(index);
                  }}
                >
                  <span className="industries-item__name">
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

      {/* Outside the container, so the drawing is measured against the page and
          not the text column. Last in the DOM so it falls under the list once
          the layout stacks. */}
      <RevealGroup className="industries-art" preset="fade" aria-hidden="true">
        <div className="industries-art__stage" data-reveal-item>
          <IndustryArt industry={active.id} onCycleEnd={handleCycleEnd} />
        </div>
      </RevealGroup>
    </section>
  );
}

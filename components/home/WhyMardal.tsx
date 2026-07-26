"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Container } from "../layout/Container";
import { whyMardal } from "../../content/home";
import { AnimatedIpoImage } from "./AnimatedIpoImage";
import { AnimatedRecommendationsImage } from "./AnimatedRecommendationsImage";
import { AnimatedRecurringImage } from "./AnimatedRecurringImage";
import { AnimatedSupportImage } from "./AnimatedSupportImage";

const artwork = {
  columns: AnimatedIpoImage,
  cycle: AnimatedRecurringImage,
  handoff: AnimatedRecommendationsImage,
  orbit: AnimatedSupportImage,
} as const;

export function WhyMardal() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const introLabel = section.querySelector<HTMLElement>("[data-why-label]");
    const introTitle = section.querySelector<HTMLElement>("[data-why-title]");
    const grid = section.querySelector<HTMLElement>("[data-why-grid]");
    const copy = section.querySelector<HTMLElement>("[data-why-copy]");
    const cardElements = Array.from(
      section.querySelectorAll<HTMLElement>("[data-why-card]"),
    );
    const animatedElements = [
      introLabel,
      introTitle,
      copy,
      ...cardElements,
    ].filter((element): element is HTMLElement => Boolean(element));

    if (
      !introLabel ||
      !introTitle ||
      !grid ||
      !copy ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      gsap.set(animatedElements, { clearProps: "all" });
      return;
    }

    gsap.set([introLabel, introTitle], {
      autoAlpha: 0,
      y: 36,
    });
    gsap.set(copy, {
      autoAlpha: 0,
      y: 28,
    });
    gsap.set(cardElements, {
      autoAlpha: 0,
      scale: 0.985,
      y: 64,
    });

    let introTimeline: gsap.core.Timeline | undefined;
    let gridTimeline: gsap.core.Timeline | undefined;

    const introObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        introTimeline = gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to(introLabel, {
            autoAlpha: 1,
            duration: 0.65,
            y: 0,
          })
          .to(
            introTitle,
            {
              autoAlpha: 1,
              duration: 0.95,
              y: 0,
            },
            "-=0.38",
          );

        introObserver.disconnect();
      },
      {
        rootMargin: "0px 0px -14% 0px",
        threshold: 0.05,
      },
    );

    const gridObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        gridTimeline = gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to(copy, {
            autoAlpha: 1,
            duration: 0.75,
            y: 0,
          })
          .to(
            cardElements,
            {
              autoAlpha: 1,
              duration: 0.9,
              scale: 1,
              stagger: 0.12,
              y: 0,
            },
            "-=0.38",
          );

        gridObserver.disconnect();
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.04,
      },
    );

    introObserver.observe(section.querySelector(".why-intro") ?? section);
    gridObserver.observe(grid);

    return () => {
      introObserver.disconnect();
      gridObserver.disconnect();
      introTimeline?.kill();
      gridTimeline?.kill();
      gsap.killTweensOf(animatedElements);
      gsap.set(animatedElements, { clearProps: "all" });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="why-section"
      id="company"
      aria-labelledby="why-title"
    >
      <Container wide>
        <div className="why-intro">
          <p className="why-label" data-why-label>
            {whyMardal.label}
          </p>
          <h2 className="why-title" id="why-title" data-why-title>
            {whyMardal.titleLines.map((line) => (
              <span className="why-title__line" key={line}>
                {line}
              </span>
            ))}
          </h2>
        </div>

        <div className="why-grid" data-why-grid>
          <p className="why-copy" data-why-copy>
            {whyMardal.copy}
          </p>

          {whyMardal.cards.map((card) => {
            const Art = artwork[card.art];

            return (
              <article
                className={`why-card why-card--${card.position}`}
                key={card.position}
                data-why-card
              >
                <div className="why-card__art">
                  <Art />
                </div>

                {/* Held in the corner rather than in the flow, so the drawing
                    can take the card's full width. */}
                <p className="why-card__label">{card.label}</p>

                <h3 className="why-card__title">{card.title}</h3>
                <p className="why-card__copy">{card.copy}</p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

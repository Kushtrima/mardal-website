"use client";

import { useLayoutEffect, useRef } from "react";
import type { PointerEvent } from "react";
import gsap from "gsap";
import { Container } from "../layout/Container";
import { SiteHeader } from "../layout/SiteHeader";
import { HERO_VIEWBOX, heroBandLines } from "../../lib/lines";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const navigationRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const linesRef = useRef<SVGSVGElement>(null);
  const linesBlurRef = useRef<HTMLDivElement>(null);
  const linesFadeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (
      !heroRef.current ||
      !linesBlurRef.current ||
      !linesFadeRef.current
    ) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      gsap.set(
        [
          navigationRef.current,
          copyRef.current,
          linesRef.current,
          "[data-hero-line]",
        ],
        { clearProps: "all" },
      );
      return;
    }

    const setBlurOpacity = gsap.quickTo(linesBlurRef.current, "opacity", {
      duration: 0.28,
      ease: "power2.out",
    });
    const setFadeOpacity = gsap.quickTo(linesFadeRef.current, "opacity", {
      duration: 0.32,
      ease: "power2.out",
    });
    const setBlurBoundary = gsap.quickTo(
      linesBlurRef.current,
      "--hero-lines-blur-start",
      {
        duration: 0.28,
        ease: "power2.out",
      },
    );

    const updateScrollBlur = () => {
      if (!heroRef.current) return;

      const heroHeight = heroRef.current.offsetHeight;
      const start = heroHeight * 0.12;
      const end = heroHeight * 0.62;
      const progress = Math.min(
        1,
        Math.max(0, (window.scrollY - start) / (end - start)),
      );
      const movementProgress = Math.min(
        1,
        Math.max(0, (window.scrollY - start) / (heroHeight - start)),
      );

      setBlurOpacity(progress);
      setFadeOpacity(progress);
      setBlurBoundary(34 - movementProgress * 79);
    };

    const context = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(navigationRef.current, {
          autoAlpha: 0,
          duration: 0.75,
          y: -24,
        })
        .from(
          "[data-hero-line]",
          {
            duration: 1.05,
            stagger: 0.09,
            yPercent: 115,
          },
          "-=0.35",
        )
        .from(
          copyRef.current,
          {
            autoAlpha: 0,
            duration: 0.8,
            y: 28,
          },
          "-=0.7",
        )
        .from(
          linesRef.current,
          {
            autoAlpha: 0,
            duration: 1.25,
            scaleY: 0.45,
            transformOrigin: "bottom center",
          },
          "-=0.65",
        );
    }, heroRef);

    updateScrollBlur();
    window.addEventListener("scroll", updateScrollBlur, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollBlur);
      context.revert();
    };
  }, []);

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (
      event.pointerType !== "mouse" ||
      !heroRef.current ||
      !linesRef.current
    ) {
      return;
    }

    const bounds = heroRef.current.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const lineImages =
      linesRef.current.querySelectorAll<SVGRectElement>(".hero-line");

    lineImages.forEach((line) => {
      const linePosition =
        ((line.x.baseVal.value + line.width.baseVal.value / 2) /
          HERO_VIEWBOX.width) *
        bounds.width;
      const distance = Math.abs(x - linePosition);
      const influence = Math.max(0, 1 - distance / (bounds.width * 0.14));
      const red = Math.round(131 + (8 - 131) * influence);
      const green = Math.round(98 + (8 - 98) * influence);
      const blue = Math.round(184 + (10 - 184) * influence);

      gsap.to(line, {
        duration: 0.32,
        ease: "power2.out",
        fill: `rgb(${red} ${green} ${blue})`,
        overwrite: "auto",
      });
    });
  }

  function handlePointerLeave() {
    if (!linesRef.current) return;

    gsap.to(linesRef.current.querySelectorAll(".hero-line"), {
      duration: 0.7,
      ease: "power2.out",
      fill: "#8362b8",
      overwrite: "auto",
    });
  }

  return (
    <section
      className="hero"
      aria-labelledby="hero-title"
      ref={heroRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <SiteHeader ref={navigationRef} />

      <Container className="hero-content" wide>
        <h1 className="hero-title" id="hero-title">
          <span className="hero-title-mask">
            <span data-hero-line>Innovation</span>
          </span>
          <span className="hero-title-mask">
            <span data-hero-line>lives here.</span>
          </span>
        </h1>

        <p className="hero-copy" ref={copyRef}>
          We build the
          <br />
          technology behind
          <br />
          your growth.
        </p>
      </Container>

      <div className="hero-lines" aria-hidden="true">
        <svg
          className="hero-lines-art"
          viewBox={`0 0 ${HERO_VIEWBOX.width} ${HERO_VIEWBOX.height}`}
          preserveAspectRatio="none"
          ref={linesRef}
        >
          {heroBandLines.map((line, index) => (
            <rect
              className="hero-line"
              x={line.x}
              y={line.y}
              width={line.width}
              height={line.height}
              fill="currentColor"
              key={`${line.x}-${index}`}
            />
          ))}
        </svg>
        <div className="hero-lines-blur" ref={linesBlurRef} />
        <div className="hero-lines-fade" ref={linesFadeRef} />
      </div>
    </section>
  );
}

"use client";

import { useLayoutEffect, useRef } from "react";
import type { PointerEvent } from "react";
import gsap from "gsap";
import Link from "next/link";
import { Container } from "../layout/Container";
import { Button } from "../ui/Button";

const navigation = [
  { label: "Services", href: "#services" },
  { label: "Solutions", href: "#solutions" },
  { label: "Products", href: "#products" },
  { label: "Case study", href: "#case-study" },
  { label: "Company", href: "#company" },
] as const;

const heroLines = [
  { x: 0, y: 17.19, width: 799.96, height: 12703.57 },
  { x: 2919.5, y: 6360.38, width: 799.95, height: 6360.38 },
  { x: 5643.15, y: 0, width: 799.98, height: 6360.38 },
  { x: 6970.54, y: 6360.38, width: 799.95, height: 6360.38 },
  { x: 8273.82, y: 0, width: 799.96, height: 6360.38 },
  { x: 9602.81, y: 6360.38, width: 799.96, height: 6360.38 },
  { x: 10904.45, y: 0, width: 799.96, height: 6360.38 },
  { x: 14560.33, y: 0, width: 799.98, height: 6360.38 },
  { x: 16670.56, y: 6360.38, width: 799.95, height: 6360.38 },
  { x: 19311.46, y: 17.17, width: 799.95, height: 6360.38 },
  { x: 21943.72, y: 17.17, width: 799.98, height: 6360.38 },
  { x: 24584.59, y: 6251.68, width: 799.98, height: 6473.98 },
  { x: 25921.9, y: 17.19, width: 799.96, height: 12703.57 },
  { x: 29223.76, y: 6251.68, width: 799.96, height: 6473.98 },
  { x: 32530.32, y: 6360.38, width: 799.98, height: 6360.38 },
  { x: 35449.81, y: 17.19, width: 799.96, height: 12703.57 },
  { x: 38369.3, y: 6360.38, width: 799.95, height: 6360.38 },
  { x: 41092.97, y: 0, width: 799.96, height: 6360.38 },
  { x: 42420.34, y: 6360.38, width: 799.96, height: 6360.38 },
  { x: 43723.61, y: 0, width: 799.98, height: 6360.38 },
  { x: 45052.63, y: 6360.38, width: 799.94, height: 6360.38 },
  { x: 46354.26, y: 0, width: 799.95, height: 6360.38 },
] as const;

const denseHeroLines = heroLines.flatMap((line, index) => {
  const narrowWidth = line.width * 0.5;
  const narrowedLine = {
    ...line,
    x: line.x + (line.width - narrowWidth) / 2,
    width: narrowWidth,
  };
  const nextLine = heroLines[index + 1];

  if (!nextLine) return [narrowedLine];

  const patternSource = index % 2 === 0 ? line : nextLine;
  const nextCenter = nextLine.x + nextLine.width / 2;
  const currentCenter = line.x + line.width / 2;
  const addedWidth = patternSource.width * 0.5;

  return [
    narrowedLine,
    {
      x: (currentCenter + nextCenter) / 2 - addedWidth / 2,
      y: patternSource.y,
      width: addedWidth,
      height: patternSource.height,
    },
  ];
});

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const navigationRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const linesRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    if (!heroRef.current) return;

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

    return () => context.revert();
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
        ((line.x.baseVal.value + line.width.baseVal.value / 2) / 47154.21) *
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
      <header className="site-header">
        <Container wide>
          <nav className="site-nav" aria-label="Main navigation" ref={navigationRef}>
            <Link className="brand" href="/" aria-label="Mardal home">
              {/* Supplied vector wordmark is already optimized and self-contained. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="brand-logo"
                src="/SVG/logo.svg"
                alt="Mardal"
                width="694"
                height="164"
              />
            </Link>

            <ul className="nav-list">
              {navigation.map((item) => (
                <li key={item.label}>
                  <a className="nav-link" href={item.href}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <Button className="hero-nav-cta" href="#contact">
              Hire us
            </Button>
          </nav>
        </Container>
      </header>

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
          viewBox="0 0 47154.21 12725.67"
          preserveAspectRatio="none"
          ref={linesRef}
        >
          {denseHeroLines.map((line, index) => (
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
      </div>
    </section>
  );
}

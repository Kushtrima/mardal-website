"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Container } from "../layout/Container";
import { SiteHeader } from "../layout/SiteHeader";
import { HeroField } from "./HeroField";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const navigationRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
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

    /* Where the blur begins before anything is scrolled, read from the
       stylesheet rather than written here as well.

       It was a literal in the sweep below, so the number lived in two places
       and the stylesheet's copy was the dead one: moving the boundary in CSS
       appeared to do nothing, because the first scroll wrote this one over it.
       Read once, here, before the sweep has set the property on the element —
       after that, what is on the element is whatever the animation last put
       there. */
    const blurStart =
      Number.parseFloat(
        getComputedStyle(linesBlurRef.current).getPropertyValue(
          "--hero-lines-blur-start",
        ),
      ) || 0;

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
      /* The same 79 points of travel, from wherever the stylesheet starts it. */
      setBlurBoundary(blurStart - movementProgress * 79);
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
        /* The field has its own opening — it draws itself out of the marks it
           rests on — so it only needs fading in. */
        .from(
          linesRef.current,
          {
            autoAlpha: 0,
            duration: 1.25,
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

  /* No pointer colouring on the field any more: the film runs its own colour
     from pose to pose, and a hover tint would fight it. */

  return (
    <section className="hero" aria-labelledby="hero-title" ref={heroRef}>
      <SiteHeader ref={navigationRef} />

      <Container className="hero-content">
        <h1 className="hero-title" id="hero-title">
          <span className="hero-title-mask">
            <span data-hero-line>Innovation</span>
          </span>
          <span className="hero-title-mask">
            <span data-hero-line>lives here.</span>
          </span>
        </h1>

        <p className="hero-copy" ref={copyRef}>
          We build the platforms, apps, CRM
          <br />
          systems, custom software and
          <br />
          applied AI a business runs on,
          <br />
          and the integrations between them.
        </p>
      </Container>

      <div className="hero-lines" aria-hidden="true" ref={linesRef}>
        <HeroField />
        <div className="hero-lines-blur" ref={linesBlurRef} />
        <div className="hero-lines-fade" ref={linesFadeRef} />
      </div>
    </section>
  );
}

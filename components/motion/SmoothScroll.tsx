"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

/**
 * Smooth scrolling for the whole page.
 *
 * The wheel and the trackpad stop moving the page directly. They feed a target
 * position instead, and the page eases towards it, so scrolling carries weight
 * and comes to rest rather than stopping dead. Everything that reads position —
 * the section entrances included — rides on the same eased value, which is why
 * they finally have something to be smooth against.
 */

/** Seconds the page takes to catch up with where you have scrolled to. */
const SMOOTH = 1.1;

/**
 * Below this width the mobile menu takes over, and it is `position: fixed`
 * inside the content that ScrollSmoother transforms — which would pin it to the
 * page rather than the screen. Small screens keep native scrolling, which is
 * what they expect anyway.
 */
const MIN_WIDTH = "(min-width: 48rem)";

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia(MIN_WIDTH).matches) return;

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: SMOOTH,
      /* Lets markup opt into moving at its own rate via data-speed/data-lag. */
      effects: true,
      /* Takes over the browser's own scrolling so the two cannot disagree,
         which is what causes the jitter you otherwise get on a trackpad. */
      normalizeScroll: true,
      ignoreMobileResize: true,
    });
    let directScrollTween: gsap.core.Tween | undefined;

    /**
     * Anchor links have to go through the smoother.
     *
     * normalizeScroll means the browser's own scroll position is no longer the
     * one the page is drawn at, so letting a `#section` link set it directly
     * leaves the two disagreeing — the address updates and the page does not
     * arrive. Every in-page link in the header menu and the footer is one of
     * these, so they all have to be handed over.
     */
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const link = (event.target as Element | null)?.closest?.("a");
      const href = link?.getAttribute("href");
      if (!href?.startsWith("#") || href.length < 2) return;

      const target = document.getElementById(href.slice(1));
      if (!target) return;

      event.preventDefault();
      const shouldScrollDirectly =
        link?.hasAttribute("data-scroll-direct") ?? false;
      const shouldPreserveView =
        link?.hasAttribute("data-scroll-preserve-view") ?? false;
      const requestedDuration = Number.parseFloat(
        link?.getAttribute("data-scroll-duration") ?? "",
      );
      const scrollDuration = Number.isFinite(requestedDuration)
        ? Math.min(Math.max(requestedDuration, 0.3), 4)
        : 1.35;

      if (shouldScrollDirectly) {
        directScrollTween?.kill();

        const destination = smoother.offset(target, "top top");
        const approachDistance = Math.min(window.innerHeight * 0.72, 720);
        const currentPosition = smoother.scrollTop();
        const approachPosition = shouldPreserveView
          ? currentPosition
          : destination >= currentPosition
            ? Math.max(currentPosition, destination - approachDistance)
            : Math.min(currentPosition, destination + approachDistance);
        const scrollState = { value: approachPosition };

        smoother.scrollTo(approachPosition, false);
        directScrollTween = gsap.to(scrollState, {
          value: destination,
          duration: scrollDuration,
          ease: "power3.inOut",
          overwrite: true,
          onUpdate: () => smoother.scrollTop(scrollState.value),
        });
      } else {
        smoother.scrollTo(target, true, "top 12%");
      }
      history.pushState(null, "", href);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      directScrollTween?.kill();
      smoother.kill();
    };
  }, []);

  return null;
}

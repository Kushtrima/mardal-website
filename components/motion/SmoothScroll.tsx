"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { MOBILE_MENU } from "../../lib/breakpoints";

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
 * The smoother runs exactly where the mobile menu does not.
 *
 * The menu is `position: fixed`, and a fixed element inside content that is being
 * transformed is fixed to that content rather than to the screen. So the two
 * cannot both be true anywhere.
 *
 * The gate said `(min-width: 48rem)` and gave that exact reason — but 48rem is
 * not where the menu appears. The stylesheet switches to it at `(max-width:
 * 64rem), (hover: none)`, so the menu was the navigation for every width up to
 * 1024px AND for every touch device at any width. The band where both were true —
 * 769 to 1024px on a mouse, an iPad at any size — was a real trap: scroll down,
 * open the menu, and its `inset: 0` resolves against the whole document, so the
 * panel's content is laid out at the top of the page, a screen or more above what
 * you can see, while `#smooth-wrapper`'s `overflow: hidden` clips it. A black
 * sheet with nothing in it, the body already locked, and the Close button
 * off-screen with the rest of the header. A reload was the only way out. Nobody
 * found it because a reviewer on a wide window with a mouse is on the one side of
 * it that works.
 *
 * It was then briefly written as a positive `(min-width: 64.0625rem) and (hover:
 * hover)` — right at every width anyone would test, and still holed: a viewport at
 * 1024.5px, which browser zoom produces routinely, matches neither that nor
 * `max-width: 64rem`. **A complement of a two-clause query cannot be written
 * exactly**, so none is written. The menu's own query is imported and negated;
 * see lib/breakpoints.ts.
 */

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    /**
     * Built and killed as the window crosses the line, rather than decided once.
     *
     * It used to read the query on mount and return, which leaves whichever
     * answer was true at load standing for the rest of the visit. Drag a window
     * from 900px to 1400px and there is no smoother on a page that should have
     * one; rotate a tablet the other way and — before the query above was
     * corrected — the smoother stayed running under a menu it breaks. A window
     * that changes is the ordinary case on a laptop, not an edge one.
     */
    const mobileMenu = window.matchMedia(MOBILE_MENU);
    let smoother: ScrollSmoother | undefined;
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
      /* Only while there is a smoother to hand the scroll to. The listener is
         added and removed with it, so this is the belt to that braces — and it
         is what keeps anchor links native at the widths where the browser is
         doing the scrolling itself. */
      if (!smoother) return;
      /* Held for the rest of the handler. `smoother` is rebuilt and cleared as
         the window crosses the line, and a tween below outlives this call — a
         reader who resizes past the breakpoint mid-glide would otherwise land in
         `onUpdate` with nothing to call. Teardown kills that tween, so the
         instance captured here is only ever used while it is alive. */
      const active = smoother;
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
      const requestedEase = link?.getAttribute("data-scroll-ease");
      const scrollDuration = Number.isFinite(requestedDuration)
        ? Math.min(Math.max(requestedDuration, 0.3), 4)
        : 1.35;
      const scrollEase =
        requestedEase === "sine.in" || requestedEase === "sine.inOut"
          ? requestedEase
          : "power3.inOut";

      if (shouldScrollDirectly) {
        directScrollTween?.kill();

        const destination = active.offset(target, "top top");
        const approachDistance = shouldPreserveView
          ? Math.min(window.innerHeight * 0.9, 900)
          : Math.min(window.innerHeight * 0.72, 720);
        const currentPosition = active.scrollTop();
        const approachPosition =
          destination >= currentPosition
            ? Math.max(currentPosition, destination - approachDistance)
            : Math.min(currentPosition, destination + approachDistance);
        const scrollState = { value: approachPosition };

        active.scrollTo(approachPosition, false);
        directScrollTween = gsap.to(scrollState, {
          value: destination,
          duration: scrollDuration,
          ease: scrollEase,
          overwrite: true,
          onUpdate: () => active.scrollTop(scrollState.value),
        });
      } else {
        active.scrollTo(target, true, "top 12%");
      }
      history.pushState(null, "", href);
    };

    function build() {
      if (smoother) return;

      smoother = ScrollSmoother.create({
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

      document.addEventListener("click", handleClick);
    }

    function teardown() {
      if (!smoother) return;

      document.removeEventListener("click", handleClick);
      directScrollTween?.kill();
      directScrollTween = undefined;
      /* Puts the transform back and hands the scroll to the browser. Leaving it
         killed but not cleared would strand the page at whatever offset the
         smoother had written. */
      smoother.kill();
      smoother = undefined;
    }

    function sync() {
      /* The menu is on screen, so the smoother must not be — a fixed panel inside
         transformed content is fixed to the page rather than to the screen. */
      if (mobileMenu.matches) {
        teardown();
        return;
      }

      build();
    }

    sync();
    mobileMenu.addEventListener("change", sync);

    return () => {
      mobileMenu.removeEventListener("change", sync);
      teardown();
    };
  }, []);

  return null;
}

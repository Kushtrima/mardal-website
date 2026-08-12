"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { BLUR, IN, OUT } from "../../lib/page-transition";

/**
 * One transition between every page on the site: the page you are leaving
 * dissolves, the route changes while nothing is on screen, and the page you have
 * arrived at dissolves in.
 *
 * ── The sheet this replaced, and why it was wrong ──
 * The first version closed a `position: fixed` veil over the page and opened it
 * again on the other side. It was built, looked at and rejected, and the reason
 * is worth keeping because it is not a matter of taste: the veil was
 * `var(--canvas)`, and this site's canvas is black. A black sheet closing over a
 * black page is not a sheet anybody can see — all that reaches a reader is the
 * content disappearing, a pause, and different content. That reads as the page
 * stalling, not as a page turning.
 *
 * So nothing is put in front of the page. The page itself goes.
 *
 * ── Opacity, and opacity only ──
 * `#smooth-content` is the one element that holds every page, so it is the one
 * thing worth fading — and opacity is the only property that may be touched on
 * it. **ScrollSmoother owns that element's transform**: it moves the page by
 * writing `translateY` there on every frame, so animating `y` here would be two
 * things writing one property, and the page would fight the scroll. A drift
 * would look better and cannot be had at this level.
 *
 * Opacity is also free of the thing that made the first version defensive:
 * it changes nothing any ScrollTrigger measured, because it changes no layout.
 * A pinned run, both story piles and every section entrance are untouched.
 *
 * ── What it deliberately does not touch ──
 * The pages' own arrivals. `ServicePageEntry` and `SectionEnter` still play when
 * a page mounts; they now play as the page comes up from nothing rather than
 * against a page that was already there.
 */

/* The movement itself is described in one place, because the Clients index makes
   the same one when it swaps its work — see lib/page-transition.ts for the shape
   of it, why it is opacity and blur and nothing else, and the `filter` trap. */

/**
 * The page never stays dark longer than this, whatever the router does.
 *
 * The second half is driven by the path changing, so a navigation that fails, is
 * cancelled, or resolves to the route it started on would otherwise leave a
 * reader looking at nothing. A fault costs a second, not the page.
 */
const STUCK_MS = 2000;

export function RouteTransition() {
  const router = useRouter();
  const pathname = usePathname();
  /** Which path was faded out. The fade back in fires on a path change, and
   *  without this it would also fire on the first render of every page —
   *  bringing up a page that never went down. */
  const leavingRef = useRef<string | null>(null);
  const timerRef = useRef<number | undefined>(undefined);
  /**
   * Whether the next path change is a navigation, and **this is what stops the
   * transition firing on things that are not one.**
   *
   * The arrival used to run on every path change, which sounds like the correct
   * generous rule and is not: `usePathname` also moves when the address is
   * rewritten under a page that has not changed. The Clients index does exactly
   * that — choosing a sector is a filter, and it corrects the address with
   * `history.replaceState` so the view stays linkable. Next patches that method
   * to keep its router in step, so `/case-studies` becoming
   * `/case-studies/healthcare` reached this file looking identical to a
   * navigation, and every sector you pressed blurred the whole page out and back.
   * Seen on the page, not reasoned about.
   *
   * So a path change only counts when something actually navigated: a click this
   * file took the default action from, or the browser's own history buttons,
   * which announce themselves through `popstate`. Anything else moves the address
   * and leaves the page alone, which is what a filter is.
   */
  const armedRef = useRef(false);

  /* Back and Forward. There is no click to take, and by the time a browser says
     `popstate` the move has already happened — so there is nothing to fade out
     and the arrival below is the whole transition. */
  useEffect(() => {
    function onPop() {
      armedRef.current = true;
    }

    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  /* Leaving: a click that is going to another page on this site. */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function onClick(event: MouseEvent) {
      /* Everything a browser does with a click that is not "follow this link".
         A middle click opens a tab, a modifier opens a window, and a handler
         that has already answered the click owns it. */
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const link = (event.target as Element | null)?.closest?.("a");
      const href = link?.getAttribute("href");
      if (!link || !href) return;

      /* Off the site, out of the tab, or a download: the browser's job. */
      if (link.target && link.target !== "_self") return;
      if (link.hasAttribute("download")) return;
      if (!href.startsWith("/")) return;

      /* Anchors on the current page belong to SmoothScroll, which eases the page
         to them. Fading the page out over a scroll would hide the very movement
         it exists to introduce. */
      if (href.startsWith("/#") || href.startsWith("#")) return;

      const to = new URL(href, window.location.origin);
      if (to.origin !== window.location.origin) return;
      /* Already here. The Clients index rewrites its own address as sectors are
         chosen, so this is a real case rather than a defensive line. */
      if (to.pathname === window.location.pathname) return;

      const content = document.querySelector<HTMLElement>("#smooth-content");
      if (!content) return;

      /* One leaving at a time. Two links pressed inside the fade would queue two
         pushes, and the second would arrive on a page still coming up. */
      if (leavingRef.current !== null) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      leavingRef.current = window.location.pathname;
      armedRef.current = true;

      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        leavingRef.current = null;
        gsap.to(content, { opacity: 1, duration: IN, clearProps: "pointerEvents" });
      }, STUCK_MS);

      gsap.fromTo(
        content,
        { filter: "blur(0px)" },
        {
          opacity: 0,
          filter: `blur(${BLUR}px)`,
          duration: OUT,
          ease: "power2.in",
          /* Nothing is clickable on the way out. At opacity 0 the page is still
             there and still takes a pointer, and a second click landing on a
             page that has already left is how you get two navigations from one
             gesture. */
          pointerEvents: "none",
        },
      );

      /* **The route is pushed on a timer, not on the tween finishing.**
       *
       * It hung off `onComplete` and that is a lost click waiting to happen:
       * GSAP's ticker sleeps whenever the tab is hidden, so a reader who taps a
       * link and immediately switches app has had the default action taken away
       * by the line above and gets no navigation in return — the page simply
       * eats the press. Found by watching exactly that: in a hidden tab the
       * `preventDefault` ran, the tween never advanced a frame, and the path
       * never changed.
       *
       * A timer fires whether the tab is watched or not, so the navigation is
       * guaranteed and the fade is what it should be — decoration over it. Timed
       * to the fade so the swap still happens behind a dark page when anyone is
       * actually looking. */
      window.setTimeout(() => router.push(href), OUT * 1000);
    }

    /* **Capture, and that one argument is the whole of whether this works.**
     *
     * It was written on the bubble phase and nothing faded on any real
     * navigation — only on the footer, which is the one place the site writes
     * plain `<a>`. Everything else is `next/link`, whose own handler runs at the
     * React root on the way up, before the event reaches `document`: it calls
     * `preventDefault` and navigates, so by the time this saw the click the page
     * had already gone and the guard on the first line sent it home. The effect
     * was there and unreachable.
     *
     * Capture runs on the way DOWN, so this sees the click first. Verified in the
     * browser rather than assumed: `next/link` honours a `preventDefault` from
     * here and does not navigate, which is what makes the fade possible without
     * two navigations racing.
     *
     * **And propagation is deliberately left alone.** Stopping it would have
     * been the obvious way to keep Link out, and it would have swallowed the
     * `onClick` every mega-menu link carries to shut the panel behind it. The
     * event still bubbles, so those handlers all still run — this only takes the
     * default action, which is the one thing it needs. */
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.clearTimeout(timerRef.current);
    };
  }, [router]);

  /**
   * Arriving. **Every path change, not only the ones this file caused.**
   *
   * This was gated on having handled the click that started it, and that was the
   * fault the owner named: the back button, the forward button, and any link the
   * guards above step over all changed the page with no movement at all, so the
   * transition was on most navigations rather than on navigation. The incoming
   * half has no business knowing how it got here.
   *
   * So the page is put down to nothing and brought up, whatever moved it. Where
   * a click was caught it is already down and this only lifts it; where one was
   * not — Back, most of all — the drop is instant and the rise is the whole
   * transition. That is the right way round: going back is a thing that has
   * already happened by the time a browser tells you about it, and there is
   * nothing left to animate out.
   *
   * `armedRef` is what decides. It is false until something navigates, which
   * also keeps this off the first page anyone lands on: a page loading already
   * has its own arrival — every section has one — and putting this over the top
   * of that would be two openings at once.
   */
  useEffect(() => {
    if (!armedRef.current) return;
    armedRef.current = false;

    const content = document.querySelector<HTMLElement>("#smooth-content");
    if (!content) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    leavingRef.current = null;
    window.clearTimeout(timerRef.current);

    /* Top of the new page, and it has to go through the smoother: it owns the
       scroll position while it runs, so setting the window's own leaves the two
       disagreeing — the address moves and the page does not. Below 48rem there
       is no smoother and the window is the answer again. */
    const smoother = ScrollSmoother.get();
    if (smoother) {
      smoother.scrollTo(0, false);
    } else {
      window.scrollTo(0, 0);
    }

    /* Down before up, and set rather than tweened. Arriving by Back there is
       nothing to fade out from, and arriving from a click the page is already
       here — either way this is the one line that makes the rise the same length
       every time instead of starting from wherever the outgoing half got to. */
    gsap.set(content, { opacity: 0, filter: `blur(${BLUR}px)` });

    gsap.to(content, {
      opacity: 1,
      filter: "blur(0px)",
      duration: IN,
      ease: "power2.out",
      /* Given back rather than set, so the page returns to whatever the
         stylesheet says rather than to values written here. A filter left on the
         wrapper would sit under every page from then on. */
      clearProps: "pointerEvents,filter",
      /* Everything that measured itself against the old page measures again once
         the new one is up. The pinned runs and both story piles are
         ScrollTriggers, and one built while the page was at opacity 0 has read
         the right layout at the wrong scroll. */
      onComplete: () => ScrollTrigger.refresh(),
    });
  }, [pathname]);

  return null;
}

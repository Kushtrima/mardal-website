import gsap from "gsap";

/**
 * The one description of how this site changes what is on screen.
 *
 * Two places move content out and bring different content back: the transition
 * between pages, and the Clients index swapping its work when a sector is
 * chosen. They were asked to be the same movement, so the numbers live here once
 * rather than being written twice and drifting — which is the same argument the
 * menu is in `content/home.ts` for.
 *
 * ── The shape of it ──
 * Out faster than in. Leaving should feel like a decision taken and arriving like
 * something settling; equal halves read as a machine cycling. Both were less than
 * half this at first and the change was over before it registered as a change.
 *
 * ── Why opacity and blur and nothing else ──
 * Neither changes layout, so nothing any ScrollTrigger measured moves — and on
 * the page transition the thing being faded is `#smooth-content`, whose
 * transform ScrollSmoother writes on every frame, so anything positional there
 * would be two things fighting over one property.
 *
 * Opacity alone reads as a light being turned down. A little blur with it reads
 * as the content leaving.
 *
 * ── The one trap ──
 * **Always animate `filter` from an explicit `blur(0px)`.** It defaults to
 * `none`, which is not a number, and GSAP asked to interpolate from that has
 * driven a filter far past its target in this codebase before — the cards went
 * nearly black.
 */

/** Seconds the outgoing content takes to leave. */
export const OUT = 0.5;

/** Seconds the incoming content takes to arrive. */
export const IN = 0.85;

/** Pixels of blur at the far end of both halves. */
export const BLUR = 7;

/**
 * ── Why the movement itself lives here and not at the call sites ──
 *
 * The numbers were shared and the tweens were not, so the same two tweens were
 * written out four times between the page transition and the Clients filter — and
 * one of the four was incomplete in a way nothing could catch. The page
 * transition's stuck-navigation recovery restored `opacity` and never mentioned
 * `filter`, so on the one path it exists for — a navigation that fails, is
 * cancelled, or resolves to the route it started on — the whole site was left
 * under an inline `blur(7px)` with no way back but a reload. The recovery path
 * was the one place the fault could not recover from.
 *
 * A fifth partial copy is now impossible to write by accident: there are three
 * verbs, they are the only ones, and `tests/page-transition.test.mjs` fails if a
 * consumer starts writing its own.
 */

/** Takes content out: dimmed, blurred, and no longer clickable. */
export function fadeOut(element: HTMLElement) {
  return gsap.fromTo(
    element,
    /* Always from an explicit `blur(0px)`. `filter` defaults to `none`, which is
       not a number, and GSAP asked to interpolate from it has driven a filter far
       past its target in this codebase before. */
    { filter: "blur(0px)" },
    {
      opacity: 0,
      filter: `blur(${BLUR}px)`,
      duration: OUT,
      ease: "power2.in",
      /* At opacity 0 the content is still there and still takes a pointer, and a
         second press landing on something already leaving is how one gesture
         becomes two navigations. */
      pointerEvents: "none",
    },
  );
}

/**
 * Puts content down instantly.
 *
 * Only ever paired with `fadeIn` below, and only where the rise must be the same
 * length every time — arriving by Back there was no fade out to come up from, and
 * arriving from a click the outgoing half may have reached anywhere.
 */
export function hide(element: HTMLElement) {
  gsap.set(element, { opacity: 0, filter: `blur(${BLUR}px)` });
}

/**
 * Brings content back from wherever it is.
 *
 * **`clearProps` is the load-bearing part of this function**, not housekeeping.
 * It is what hands `filter` and `pointerEvents` back to the stylesheet, and a
 * copy of this tween that forgot it is what left the site blurred. Written once,
 * it cannot be forgotten once.
 */
export function fadeIn(element: HTMLElement) {
  return gsap.to(element, {
    opacity: 1,
    filter: "blur(0px)",
    duration: IN,
    ease: "power2.out",
    clearProps: "pointerEvents,filter",
  });
}

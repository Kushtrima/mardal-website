"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The covers come off the five plates, one after another.
 *
 * **This is the only thing in the section that moves, and it moves once.** The
 * page already holds two scrubbed compositions — the Fusion mark being drawn and
 * the Products pin — and a third block answering the wheel frame by frame would
 * make the middle of this page a machine. So no pin and no scrub: the block is
 * entered, the covers leave, and it is finished. Scroll back up and the pictures
 * are still pictures.
 *
 * **The markup is the finished state and this puts the covers ON.** The
 * stylesheet leaves every cover collapsed against its own right edge, so a
 * reader whose JavaScript never arrives — or who has asked for no motion, which
 * returns below before anything is armed — sees the five pictures. The covered
 * state exists only inside this effect, which is the same way `FusionReveal`
 * clips the heading it uncovers: an effect that hides content in CSS is an
 * effect that can fail with the content still hidden.
 */

/**
 * How long one cover takes to leave, in seconds.
 *
 * `--duration-handover` is 900ms and this is that token's own case, stated in
 * the design skill in as many words: a change that happens on its own while
 * being watched. Much under half a second a cover does not read as leaving, it
 * reads as switching off.
 */
const COVER = 0.9;

/**
 * The gap between one cover leaving and the next.
 *
 * Five read as a sequence at this spacing and as one event much under it. The
 * whole run is 1.46s, which is a beat rather than a performance — and it is
 * short enough that a reader who scrolls straight through still sees it happen
 * rather than arriving after it.
 */
const STAGGER = 0.14;

export function WorkReveal() {
  useEffect(() => {
    /* **Asked before anything is armed, and the answer is to do nothing.** The
       section is complete without this — that is what the stylesheet holds — so
       a reduced-motion reader is not given a stilled version of the effect, they
       are given the page. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const scatter = document.querySelector<HTMLElement>("[data-work-scatter]");
    if (!scatter) return;

    const covers = gsap.utils.toArray<HTMLElement>("[data-work-cover]", scatter);
    if (covers.length === 0) return;

    const context = gsap.context(() => {
      /* **The covered state is set outright, not implied by a `fromTo`.**

         It was a `fromTo`, and measuring the page found only the FIRST cover
         wearing its `from` value: a stagger gives each target its own start
         time, and a `from` state is rendered when the tween that owns it begins.
         The other four sat at the stylesheet's collapsed state until their turn
         came and then appeared — a cover dropping over a picture that had been
         visible for a second, which is the opposite of the effect. */
      gsap.set(covers, { scaleX: 1 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: scatter,
            /* Under the fold by a fifth of a screen, so the block is settled and
               in view before the first cover moves. Higher and the sequence is
               half over by the time it is being looked at. */
            start: "top 78%",
            /* It happens once. A reveal that re-arms is a reveal the reader can
               catch doing it, and this one is about the work being shown rather
               than about the covers. */
            once: true,
          },
        })
        /* **Off to the right, so each picture is uncovered left to right** — the
           direction it is read in. `transformOrigin` is what decides that and
           the stylesheet sets it, so nothing has to be said here: the cover
           collapses against its own right edge rather than shrinking to its
           middle.

           `scaleX` and not a width or a clip: a rectangle is the one shape a
           transform cannot distort, and the plate under it never re-lays-out. */
        .to(covers, {
          scaleX: 0,
          /* GSAP's reading of `--ease-handover`, cubic-bezier(0.4, 0, 0.2, 1) —
             the same curve the stylesheet gives every other handover. */
          ease: "power2.inOut",
          duration: COVER,
          stagger: STAGGER,
        });
    });

    return () => context.revert();
  }, []);

  return null;
}

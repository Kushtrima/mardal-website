"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HOLD } from "./MediaReveal";

/**
 * The page changes colour as you scroll past the photograph, and changes back
 * after the ones below it.
 *
 * It begins where the big plate has finished opening — the pin has released and
 * the picture is whole — and the colour comes in over the plate's way out. It
 * holds while the three rooms are on screen and drains back to the page colour
 * as the last of them leaves.
 *
 * **Scrubbed, not toggled**, which is a correction. This was a class toggle with
 * a 700ms cross-fade, on the reasoning that a colour has no travel to compete
 * with the page's and that a scrubbed colour spends its window in a muddy
 * in-between. The owner asked for the opposite in as many words — start when the
 * image is open, and change as he scrolls — and he is right about this page: the
 * wash is not an effect ON the section, it is the section arriving, and it
 * should be as answerable to the hand as everything else here.
 *
 * The colour is read from `--wash-about` rather than written here, so the token
 * stays the single place it is decided and the dark page gets its own half.
 *
 * **It washes every surface that paints the page's ground**, and finding them
 * all took two goes.
 *
 * First it washed the body alone, and nothing appeared to happen at all:
 * `.service-page` sets `background: var(--service-surface)` on the `<main>`, an
 * opaque layer over the body for the height of the page. It was "verified" by
 * reading `getComputedStyle(document.body)`, which reported the colour changing
 * correctly at every scroll position. The property WAS changing. Measuring the
 * property is not measuring the page.
 *
 * Then it washed the main as well, and the colour ended in a hard horizontal
 * line: `html` and `.site-footer` both carry `background: var(--canvas)` too, so
 * the yellow stopped exactly where the main's box did and white took over below
 * it. A wash that misses one ground is not a paler wash, it is a seam.
 *
 * All four move together now. `html` matters most and is the least obvious: it
 * has a background of its own, so the body's does NOT propagate to the canvas
 * and everything the main does not cover is painted by the root element.
 */

/**
 * Fraction of the run spent arriving, and fraction spent leaving.
 *
 * The run is long — from the pin's release to the last photograph leaving, about
 * 2100px on an 850px window — so these are small. At 0.18 the colour was still
 * arriving 900px after the picture had finished opening, which is not "as I
 * scroll", it is a page that changes colour somewhere further down. 0.10 of that
 * run is about 210px: a few turns of a wheel.
 */
const IN = 0.1;
const OUT = 0.1;

/** Resolves a custom property to a real colour, `light-dark()` included. */
function resolve(token: string): string {
  const probe = document.createElement("span");
  probe.style.cssText = `position:absolute;visibility:hidden;background:${token}`;
  document.body.append(probe);
  const colour = getComputedStyle(probe).backgroundColor;
  probe.remove();
  return colour;
}

export function SectionWash() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const frame = document.querySelector<HTMLElement>("[data-wash]");
    const to = document.querySelector<HTMLElement>("[data-wash-end]");
    if (!frame || !to) return;

    /* Everything that reads `--canvas` and paints. Missing any one of them puts
       a hard edge where that element's box ends. */
    const surfaces = [
      document.documentElement,
      document.body,
      frame.closest("main"),
      document.querySelector<HTMLElement>(".site-footer"),
    ].filter((element): element is HTMLElement => Boolean(element));

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: frame,
          /* **Where the pin lets go, computed rather than described.**

             Three relative expressions were tried against the real page and all
             three were wrong, in both directions:

               `bottom 80%` on the section    colour a third in before the
                                              picture had opened
               `center center-=hold` on frame started 680px LATE (2450 against
                                              a release at 1780)
               `center center` on the frame   started at the GRAB, 1087
               `bottom bottom` on the section started early again

             The reason none of them work is the pin. The frame does not move
             while it is held, so it cannot express its own release: every
             position on it resolves to the grab, and every offset past that is
             delayed by the whole hold on top.

             So this is arithmetic instead. The pin grabs when the frame's centre
             meets the window's centre and lets go `HOLD` screens later, and both
             of those are numbers this can work out. `getBoundingClientRect` is
             safe inside a start function because ScrollTrigger reverts pins
             before it calls one — the frame is measured where it naturally
             sits, not where it is being held. */
          start: () => {
            const box = frame.getBoundingClientRect();
            const centre = box.top + window.scrollY + box.height / 2;
            const grabs = centre - window.innerHeight / 2;
            return grabs + window.innerHeight * HOLD;
          },
          /* Ends against a different element, so one tween covers the whole run
             — two scrubbed tweens on one property fight over it. */
          endTrigger: to,
          /* **Finished by the time the next section is in view, not as it
             leaves.** The section after this one is on white by instruction, so
             the drain has to complete BEFORE it arrives rather than under it —
             at `bottom top` the colour was still going while the white section
             filled the screen, which reads as the yellow following you down.

             `bottom center` puts the last of it while the marker section is
             still half on screen. It went the other way once too: at
             `bottom 25%` the colour drained at a scroll of 3200 where the rooms
             still filled the window, their foot 894px down an 850px viewport. */
          end: "bottom center",
          /* Short. The wash is answering the hand directly here rather than
             smoothing a movement, and half a second of lag on a colour reads as
             the page being slow rather than as easing. */
          scrub: 0.3,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .fromTo(
          surfaces,
          { backgroundColor: () => resolve("var(--canvas)") },
          {
            backgroundColor: () => resolve("var(--wash-about)"),
            ease: "none",
            duration: IN,
          },
          0,
        )
        /* Held while the pictures are on screen. A colour that starts leaving
           the moment it arrives never reads as the page's colour, only as a
           tint passing over it. */
        .to(
          surfaces,
          {
            backgroundColor: () => resolve("var(--canvas)"),
            ease: "none",
            duration: OUT,
          },
          1 - OUT,
        );
    });

    return () => {
      context.revert();
      for (const surface of surfaces) {
        surface.style.removeProperty("background-color");
      }
    };
  }, []);

  return null;
}

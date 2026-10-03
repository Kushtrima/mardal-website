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
 * holds while the three rooms and the note below them are on screen, and then
 * turns into a second colour rather than draining back to the page's.
 *
 * **Four grounds, not two.** White above the photograph, `--wash-about` through
 * the middle of the page, `--wash-about-end` from the end of the notes, and
 * `--wash-about-close` under the line the page ends on. Each holds until the
 * next one starts: a scrubbed tween keeps its end state past its trigger, so
 * everything below a stop carries that stop's colour.
 *
 * The fourth is driven separately and does not tween the property at all — see
 * below for why, and for how its start is made to meet the third's end exactly.
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

/**
 * How far the last hop takes, as a fraction of the window.
 *
 * Half a screen. It is longer than the two above it — those are 0.1 of a run
 * about 2100px long, roughly 210px each — because this one has nothing else
 * happening around it: the two before it arrive under a photograph opening and
 * under notes replacing one another, and this one arrives under a single
 * sentence that is not moving. A change that lands in 210px there reads as part
 * of what is happening; the same 210px here reads as a flash.
 */
const CLOSE = 0.5;

/** Resolves a custom property to a real colour. */
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
          /* **Finished by the time the next section is in view, not under it.**
             The section after this one is a ground of its own, so the change has
             to complete BEFORE it arrives — at `bottom top` the colour was still
             moving while that section filled the screen, which reads as the
             page's colour following you down rather than as a section arriving.

             It was `bottom center`, which put the last of it while the marker
             section was still half on screen. Owner, 2026-08-26: the orange
             below has to start earlier. That one begins exactly where this ends,
             so this is what moved — half a window earlier, to the moment the
             closing section's top edge appears.

             **The cost is the yellow, and it is worth stating.** The run is
             shorter by half a window, and the pink hop is the last tenth of the
             run, so the yellow now ends about 380px sooner than it did. He asked
             for the yellow longer once; this takes some of that back. It is the
             only way the two can move: the orange cannot start before the pink
             has finished without both of them painting the same pixels.

             It went the other way once too: at `bottom 25%` it changed at a
             scroll of 3200 where the rooms still filled the window, their foot
             894px down an 850px viewport. */
          end: "bottom bottom",
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
        /* Held while the pictures are on screen, then turned into the second
           colour. A colour that starts leaving the moment it arrives never
           reads as the page's colour, only as a tint passing over it. */
        .to(
          surfaces,
          {
            backgroundColor: () => resolve("var(--wash-about-end)"),
            ease: "none",
            duration: OUT,
          },
          1 - OUT,
        );

      /* **The fourth ground, on a trigger of its own.**

         Owner, 2026-08-26, with a swatch: transition to this colour on the new
         text. That text is the last thing on the page and it sits BELOW the
         marker the run above ends at, so it cannot be one more stop on that
         timeline without re-timing every stop before it — and those were tuned
         by him, twice, for where the yellow arrives and how it ends.

         **It does not tween the property.** Two scrubbed tweens on one
         background fight over it: whichever rendered last in a frame wins, and
         the loser goes on re-applying its own start value from outside its
         range. So this reads its trigger's progress and paints, which leaves it
         with nothing to hold when it is not running — above its start the
         timeline owns the colour and this is silent.

         The tween is on a plain object, and that is what buys the silence: a
         `.to()` does not render until it is reached, so nothing is painted at
         load. Coming back up, `t` settles at effectively zero, which is the
         colour the timeline leaves anyway.

         **Its start is the timeline's end, exactly.** That one ends at the
         journey's `bottom bottom`; this begins at the statement's `top bottom`,
         and the two sections share a border edge — so both resolve to the same
         scroll position without either being told about the other. Earlier and
         they overlap and fight; later and the page sits finished-pink for a
         stretch with nothing happening.

         Both were `center` and both moved together, half a window earlier, when
         the owner asked for the orange sooner. Moving one alone is the bug this
         pairing exists to prevent — and moving THIS one alone is the tempting
         version, because it is the one he asked about. */
      const close = document.querySelector<HTMLElement>("[data-wash-close]");
      if (close) {
        /* Resolved once rather than per frame — `resolve` puts a probe in the
           document and reads it back, which is not a thing to do at 60Hz. Taken
           again on refresh, which is when a theme change would land. */
        let from = resolve("var(--wash-about-end)");
        let to = resolve("var(--wash-about-close)");
        const state = { t: 0 };

        gsap.to(state, {
          t: 1,
          ease: "none",
          onUpdate: () => {
            if (state.t <= 0) return;
            const colour = gsap.utils.interpolate(from, to, state.t);
            for (const surface of surfaces) {
              surface.style.backgroundColor = colour;
            }
          },
          scrollTrigger: {
            trigger: close,
            start: "top bottom",
            end: () => "+=" + window.innerHeight * CLOSE,
            scrub: 0.3,
            invalidateOnRefresh: true,
            onRefresh: () => {
              from = resolve("var(--wash-about-end)");
              to = resolve("var(--wash-about-close)");
            },
          },
        });
      }
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

"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { playOnArrival } from "../../lib/play-on-arrival";

/**
 * Human Creativity + Artificial Intelligence, arriving as it comes into view.
 *
 * Chosen by the owner from three models, 2026-08-26. The two that lost are
 * worth recording, because both were reasonable and both were wrong:
 *
 *   1. Slide, scale, fade — the plus up from below getting bigger, then the two
 *      halves in from the sides. Competent, and it could have been any section
 *      on any site. "I need to be more creative."
 *   2. The plus drawn stroke by stroke, and the four heading lines weaving in
 *      alternating left-right-left-right. He kept the plus and rejected the
 *      weave: four things travelling at once is busy, and it reads as a device
 *      applied to the words rather than as the words arriving.
 *
 * On 2026-10-05 it stopped being scrolled — "remove the on scroll effect put a
 * normal effect from gsap" — and then, the same day, "make a smoother intro for
 * this page more elegant". What was not elegant was all of it at once: the
 * upright rising 90px as it drew, the mark growing under it, the crossbar
 * overshooting, both halves wiped across in the same second. So:
 *
 *   - **One block at a time, as each comes into view.** The composition is
 *     taller than a laptop screen, and a single timeline started at its top
 *     finished "Artificial Intelligence" and the sentence below the fold.
 *   - **The rules** are not drawn any more: since 2026-10-06 they simply
 *     stand, from here to the foot of the page ("no reveal").
 *   - **Each heading line rises out of its own mask**, one after the next, on a
 *     long expo ease: the motion the big menu's words already make. Never two
 *     halves at once; never sideways.
 *   - **The mark is still drawn, and only drawn** — the upright out of its own
 *     foot, the crossbar from the centre, as he chose — with no travel, no
 *     growth and no overshoot, on an ease that starts and settles softly.
 *   - **The sentence last**, a short fade up.
 *
 * Every start state is set first, outside the tweens: with a tween waiting on
 * its trigger, a refresh puts it back to what the element was before it, so
 * "before" has to be the hidden state or a block would show and then vanish as
 * it played (measured 2026-10-05). Nothing is hidden by the stylesheet, so a
 * page with this script blocked shows the section whole.
 *
 * **And a block the page arrives at, or past, still plays** — owner,
 * 2026-10-09: "sometimes when i scroll in mobile version i dont se at all
 * Human Creativity". Coming Back to the homepage puts the scroll below this
 * section in one jump while the page is still being measured, and a jump
 * seen during a measure takes no action, so Human Creativity stayed in its
 * mask (reproduced: back from Clients, the left half 52px down, the right
 * risen). So each block's tween waits paused and is played on the way in
 * from either side, or as soon as a measure finds the page at or past it
 * (lib/play-on-arrival.ts, which every entrance of this kind now uses).
 */

/** How far up the screen a block has to come before it arrives: far enough in
 *  that it is seen arriving rather than caught finishing. */
const START = "top 85%";

/** The headings' rise: long and decelerating, a line every eighth of a
 *  second. */
const RISE = { duration: 1.4, ease: "expo.out", stagger: 0.12 };

/** The mark: drawn, so eased at both ends — it starts and comes to rest
 *  without a jolt. */
const DRAW = "power3.inOut";

export function FusionReveal() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector<HTMLElement>("[data-fusion]");
    if (!section) return;
    const up = section.querySelector<HTMLElement>("[data-fusion-up]");
    const across = section.querySelector<HTMLElement>("[data-fusion-across]");
    const left = section.querySelector<HTMLElement>('[data-fusion-half="left"]');
    const right = section.querySelector<HTMLElement>('[data-fusion-half="right"]');
    const copy = section.querySelector<HTMLElement>("[data-fusion-copy]");
    if (!up || !across || !left || !right || !copy) return;
    const leftLines = left.querySelectorAll<HTMLElement>("[data-fusion-line]");
    const rightLines = right.querySelectorAll<HTMLElement>("[data-fusion-line]");

    /* **Reduced motion keeps the order and drops the travel.** The rules and
       the strokes still draw, because being drawn is the idea here rather than
       the decoration; the lines fade in where they would have risen, and the
       sentence does not lift. */
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hidden = still ? { opacity: 0 } : { yPercent: 120 };
    const shown = still ? { opacity: 1 } : { yPercent: 0 };

    const context = gsap.context(() => {
      gsap.set(up, { scaleY: 0, transformOrigin: "50% 100%" });
      gsap.set(across, { scaleX: 0, transformOrigin: "50% 50%" });
      gsap.set([...leftLines, ...rightLines], hidden);
      gsap.set(copy, { opacity: 0, y: still ? 0 : 24 });

      /* Human Creativity. */
      playOnArrival(gsap.to(leftLines, { ...shown, ...RISE, paused: true }), left, START);

      /* The mark, then Artificial Intelligence rising beside it while the
         crossbar is still opening. */
      playOnArrival(
        gsap
          .timeline({ paused: true })
          .to(up, { scaleY: 1, duration: 1.1, ease: DRAW }, 0)
          .to(across, { scaleX: 1, duration: 1, ease: DRAW }, 0.35)
          .to(rightLines, { ...shown, ...RISE }, 0.2),
        right,
        START,
      );

      /* The sentence, once its own top is on the screen. */
      playOnArrival(
        gsap.to(copy, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          paused: true,
        }),
        copy,
        "top 92%",
      );
    });

    return () => context.revert();
  }, []);

  return null;
}

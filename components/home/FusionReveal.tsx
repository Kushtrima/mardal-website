"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Human Creativity + Artificial Intelligence, assembled as you scroll.
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
 * What is left is one idea rather than two. **The mark is drawn and the words
 * are uncovered — neither is moved.** The upright grows out of its own foot, the
 * crossbar opens from the centre, and then a clip crosses each half and the type
 * is simply there behind it. A word that travels is a word being moved; a word
 * behind a moving edge is a word being drawn, which is the same act as the mark
 * beside it.
 *
 * And they close on the mark from opposite directions: the crossbar opens from
 * the centre outward, the halves uncover from the edges inward.
 *
 * The paragraph is the only thing on screen that moves, which is what separates
 * the body from the heading rather than repeating it.
 */

/**
 * Screens of scroll the section is held for.
 *
 * Five things happen in it and the last of them is a paragraph that has to be
 * readable when it lands, so this is longer than a single-beat reveal wants.
 * Under about 2 the strokes draw faster than the eye reads them as drawing —
 * they simply appear — and over about 3 the pin outstays the composition.
 */
const HOLD = 2.5;

/** Where each beat sits on the scrub. See the model for what they look like. */
const UPRIGHT = { at: 0, run: 0.32 };
const CROSSBAR = { at: 0.3, run: 0.22 };
const LEFT = { at: 0.5, run: 0.3 };
/* Four percent behind the left, so the pair reads as a pair rather than as one
   movement mirrored. */
const RIGHT = { at: 0.54, run: 0.3 };
const COPY = { at: 0.82, run: 0.15 };
/* Held whole to the end of the pin, so the composition is complete for a moment
   before the page moves on. Without it the timeline's last tween IS the end of
   the scrub, and the paragraph lands exactly as the pin releases. */
const HELD = 0.03;

export function FusionReveal() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector<HTMLElement>("[data-fusion]");
    if (!section) return;

    const up = section.querySelector<HTMLElement>("[data-fusion-up]");
    const across = section.querySelector<HTMLElement>("[data-fusion-across]");
    const plus = section.querySelector<HTMLElement>("[data-fusion-plus]");
    const left = section.querySelector<HTMLElement>('[data-fusion-half="left"]');
    const right = section.querySelector<HTMLElement>('[data-fusion-half="right"]');
    const copy = section.querySelector<HTMLElement>("[data-fusion-copy]");
    if (!up || !across || !plus || !left || !right || !copy) return;

    /* **Reduced motion keeps the order and drops the travel.** The strokes still
       draw and the clips still open, because being drawn is the idea here rather
       than the decoration — it is not an effect on the section, it is the
       section arriving. What goes is everything that flies: the upright's rise,
       the mark's growth, the paragraph's lift. */
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + window.innerHeight * HOLD,
          pin: true,
          /* Short. The composition is answering the hand directly rather than
             smoothing a movement, and half a second of lag on a stroke being
             drawn reads as the page being slow. */
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });

      /* **The upright draws out of its own foot.** `transformOrigin` at the
         bottom is what makes `scaleY` run upward instead of from the middle —
         the difference between a line being drawn and a line being stretched.

         The centring is CSS `translate`, an independent property, so this
         `transform` composes on top of it rather than overwriting it. */
      timeline.fromTo(
        up,
        { scaleY: 0, y: still ? 0 : 90, transformOrigin: "50% 100%" },
        { scaleY: 1, y: 0, ease: "power2.out", duration: UPRIGHT.run },
        UPRIGHT.at,
      );

      /* The mark keeps a little growth of its own under the strokes, so it reads
         as arriving as well as being drawn. */
      if (!still) {
        timeline.fromTo(
          plus,
          { scale: 0.72 },
          { scale: 1, ease: "power2.out", duration: UPRIGHT.run },
          UPRIGHT.at,
        );
      }

      /* **The crossbar opens from the centre, both ways at once**, a little past
         its width and back. `back.out` is what makes a drawn line read as struck
         rather than stretched, and it is the one place on this page an ease
         overshoots. */
      timeline.fromTo(
        across,
        { scaleX: 0, transformOrigin: "50% 50%" },
        {
          scaleX: 1,
          ease: still ? "power2.out" : "back.out(1.7)",
          duration: CROSSBAR.run,
        },
        CROSSBAR.at,
      );

      /* **Clipped, not moved — and clipped rather than sized.** A width or a
         `max-width` animated across a heading re-wraps it on every frame; a clip
         leaves the type laid out at its final size and crosses it.

         The insets run past the box top and bottom by a fifth of an em so
         ascenders and descenders are never shaved by a rounding difference. */
      timeline.fromTo(
        left,
        { clipPath: "inset(-0.2em 100% -0.2em 0)" },
        {
          clipPath: "inset(-0.2em 0% -0.2em 0)",
          ease: "power2.out",
          duration: LEFT.run,
        },
        LEFT.at,
      );

      timeline.fromTo(
        right,
        { clipPath: "inset(-0.2em 0 -0.2em 100%)" },
        {
          clipPath: "inset(-0.2em 0 -0.2em 0%)",
          ease: "power2.out",
          duration: RIGHT.run,
        },
        RIGHT.at,
      );

      timeline.fromTo(
        copy,
        { opacity: 0, y: still ? 0 : 48 },
        { opacity: 1, y: 0, ease: "power2.out", duration: COPY.run },
        COPY.at,
      );

      /* An empty tween, and it is not filler: a scrub maps the whole scroll to
         the timeline's duration, so without something occupying the last of it
         the paragraph would land at the exact moment the pin lets go. */
      timeline.to({}, { duration: HELD }, COPY.at + COPY.run);
    });

    return () => context.revert();
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Running text arrives a few words at a time, drifting in from the right.
 *
 * **This is the service pages' word treatment, played forwards.** Owner, looking
 * at the About notes: this text changing on scroll the way it does in services,
 * right to left. There, `ServiceOfferingsScroll.renderWordExit` takes a card's
 * copy AWAY as you scroll through it — words in groups of three, each group
 * staggered across the run, each fading while it drifts `x: -14` — so the copy
 * leaves toward the left in reading order.
 *
 * Here the same shape runs the other way: groups of three arrive from `x: +14`
 * and settle at zero, first group first. What reads is the same rhythm, which is
 * the point of borrowing it rather than inventing a second one.
 *
 * The numbers are the service run's own — three to a group, a 0.22 window per
 * group over a 0.78 spread, smoothstepped — copied deliberately so the two read
 * as one idea. They are duplicated rather than shared because the service
 * version is a hand-written render function driven by a pinned journey, not a
 * tween, and pulling one out of the other would couple a page to a page.
 *
 * **Per paragraph, not per section.** A note here is three paragraphs and most
 * of a screen tall; staggered as one block the last words would arrive long
 * after they were read, and the first would have finished before the paragraph
 * they belong to was on screen.
 *
 * Tied to scroll POSITION rather than a clock, and it RESOLVES: every word ends
 * at zero and full opacity.
 *
 * **The paragraph is readable to a screen reader the whole time**, because the
 * markup carries `aria-label` with the unsplit sentence — a paragraph of
 * separate word spans is otherwise read as fragments. The service pages solve it
 * the same way. And the words fade with `opacity` rather than `autoAlpha` so
 * they stay in find-in-page before they arrive; see the note at the render.
 */

/** Words to a group, and how far a group starts to the right. */
const GROUP = 3;
const DRIFT = 14;

/** Share of the run a single group takes, and the spread across all of them. */
const WINDOW = 0.22;
const SPREAD = 0.78;

/** The window a paragraph arrives over, in the same terms `SectionEnter` uses. */
const START = "top 88%";
const END = "top 52%";

export function ProseReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const paragraphs = gsap.utils.toArray<HTMLElement>("[data-prose-line]");

      paragraphs.forEach((paragraph) => {
        const words = gsap.utils.toArray<HTMLElement>(
          "[data-prose-word]",
          paragraph,
        );
        if (!words.length) return;

        const groups = Math.max(Math.ceil(words.length / GROUP), 1);

        /* Written as one render rather than a timeline of tweens: the service
           version is a render function too, and a group's progress is a function
           of the run's progress rather than something with its own clock. */
        const render = (progress: number) => {
          words.forEach((word, index) => {
            const group = Math.floor(index / GROUP);
            const start = groups === 1 ? 0 : (group / (groups - 1)) * SPREAD;
            const local = gsap.utils.clamp(0, 1, (progress - start) / WINDOW);
            const eased = local * local * (3 - 2 * local);

            /* **`opacity`, not `autoAlpha`.** The service version uses
               autoAlpha, which sets `visibility: hidden` at zero — right there,
               where the words start VISIBLE and are being taken away. Here they
               start hidden, and hidden text is out of the accessibility tree and
               out of find-in-page until it arrives. Transparent text is still
               findable and still selectable. */
            gsap.set(word, { opacity: eased, x: (1 - eased) * DRIFT });
          });
        };

        render(0);

        ScrollTrigger.create({
          trigger: paragraph,
          start: START,
          end: END,
          scrub: 0.4,
          invalidateOnRefresh: true,
          onUpdate: (self) => render(self.progress),
        });
      });
    });

    return () => context.revert();
  }, []);

  return null;
}

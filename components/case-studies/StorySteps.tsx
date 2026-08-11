"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pilotStory } from "../../content/case-studies";

/**
 * The three states as a ruled index that un-stacks.
 *
 * ── What this is, and why it is not the accordion it replaced ──
 * The owner sent ref.digital/work/sopfeu as the reference. That section was
 * read here before it was rebuilt, and the finding was that nothing in it opens:
 *
 *   Every entry is `position: sticky`, and each one is sticky twice over. While
 *   its reading is still ahead of you it is anchored to the BOTTOM of the
 *   window; once you have reached it, it is anchored to the TOP. The offsets
 *   step by exactly one row height per entry — measured at 15.79 / 45.78 /
 *   75.77px on that page — so both anchors are tight piles rather than four
 *   things landing on the same line. The readings are always rendered, at full
 *   height, in the space between the two piles.
 *
 * So the whole index is present from the first moment, stacked at the foot of
 * the window, and it empties from the top of that stack into a second stack at
 * the top of the window, one entry per reading. The entry you are reading is
 * the last one in the top pile, and the reading is beside and below it.
 *
 * That is a better shape than an accordion for these three: the order is the
 * argument, and a list that is whole from the start states the order before it
 * states anything else. An accordion hides it — you cannot see what is coming.
 *
 * ── Why this is JavaScript and not two lines of CSS ──
 * `position: sticky` cannot run on this site. ScrollSmoother moves the page by
 * transforming its content inside a wrapper that never scrolls, so a sticky
 * element has no scrolling ancestor to measure itself against and simply
 * drifts. That is the fourth place on this site to find it out, after
 * ProductsPin, the sector index and the story rail.
 *
 * ScrollTrigger's `pin` is the usual answer here, but it is the wrong tool for
 * this one: a pin holds an element where it already is, and this needs each bar
 * placed on a chosen line — one of two, depending on which side of its own
 * reading you are. So the two anchors are computed instead. It is the sticky
 * algorithm, written out:
 *
 *   held = clamp(natural, topLine, footLine)   →   y = held − natural
 *
 * where `natural` is where the bar would sit with no transform at all, and the
 * two lines are the piles. Between the lines the term is zero and the bar is in
 * ordinary flow, which is the whole point — it travels with its own reading and
 * nothing has to drive it.
 *
 * The bars are translated, never taken out of flow, so the space each one
 * occupies stays behind it and no reading ever moves under the reader.
 */

/** Both piles sit flush against the window's edges. They were inset — 88px at
 *  the top to clear the site header, 24 at the foot — and the inset was a hole:
 *  the bars are the only opaque thing in this column, so anything the piles did
 *  not cover was a window onto the reading sliding past behind them. Two lines
 *  of a paragraph showed above the top pile and one under the foot pile, cut in
 *  half by the rules. Owner caught it on the page.
 *
 *  At zero there is nothing to leak through: the piles ARE the edges of the
 *  reading, and everything outside them is off the screen rather than behind
 *  something. It also states the mechanism better — a list held against the top
 *  of the window reads as held; one floating 88px below it reads as adrift. */
const HEAD_CLEARANCE = 0;
const FOOT_CLEARANCE = 0;

/** Exactly the complement of the stylesheet's `max-width: 64rem`, read back
 *  through matchMedia in the same units — the fault ProductsPin carries a
 *  comment about. Below it the entries are one column with the reading under
 *  its own title, and there are no piles: a pile of full-width bars on a phone
 *  is a third of the screen spent on furniture. */
const TWO_COLUMN = "(min-width: 64.0625rem)";

export function StorySteps() {
  useEffect(() => {
    const list = document.querySelector<HTMLElement>(".story-index");
    if (!list) return;

    const bars = gsap.utils.toArray<HTMLElement>(".story-index__bar", list);
    if (bars.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);

    /* Nothing is set from here for a reader who asked for no motion: with no
       transforms the entries are already a ruled index with each reading under
       its own title, which is the same content in the same order. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const wide = window.matchMedia(TWO_COLUMN);

    const context = gsap.context(() => {
      /* Where each bar sits with no transform, as an offset down the list, and
         how tall each one is. Measured rather than assumed: a title that wraps
         to two lines makes its bar taller than its neighbours, and a pile built
         on one row height would then overlap itself. */
      let natural: number[] = [];
      let heights: number[] = [];

      const measure = () => {
        gsap.set(bars, { y: 0 });
        const top = list.getBoundingClientRect().top;
        natural = [];
        heights = [];
        for (const bar of bars) {
          const box = bar.getBoundingClientRect();
          natural.push(box.top - top);
          heights.push(box.height);
        }
      };

      /** Height of the bars before index `i` — the depth of the top pile once
       *  `i` entries have been read — and of `i` and everything after it, which
       *  is the depth of the foot pile while `i` is still ahead. */
      const before = (i: number) =>
        heights.slice(0, i).reduce((sum, height) => sum + height, 0);
      const fromHere = (i: number) =>
        heights.slice(i).reduce((sum, height) => sum + height, 0);

      const place = () => {
        if (!wide.matches) {
          gsap.set(bars, { y: 0 });
          return;
        }

        const box = list.getBoundingClientRect();
        const view = window.innerHeight;

        bars.forEach((bar, i) => {
          const from = box.top + natural[i];

          /* The two anchors. Read in this order because the top one has to win
             on a short window, where they cross: an entry you have reached
             belongs at the top whatever room is left underneath. */
          let held = from;
          const footLine = view - FOOT_CLEARANCE - fromHere(i);
          if (held > footLine) held = footLine;
          const topLine = HEAD_CLEARANCE + before(i);
          if (held < topLine) held = topLine;

          /* Neither pile may leave the list. This is what sticky's containing
             block does, and without it the foot pile would appear all at once
             the instant the list's top edge crossed the bottom of the window,
             rather than rising into place with it — and the top pile would hang
             on over the section that follows. */
          const floor = box.top + before(i);
          const ceiling = box.bottom - fromHere(i);
          held = Math.min(Math.max(held, floor), ceiling);

          gsap.set(bar, { y: held - from });
        });
      };

      ScrollTrigger.create({
        trigger: list,
        /* The whole time any part of the list is on screen. The piles are a
           position, not a sequence — there is no progress to run through, so
           there is nothing to scrub and no distance to reserve. */
        start: "top bottom",
        end: "bottom top",
        invalidateOnRefresh: true,
        onRefresh: () => {
          measure();
          place();
        },
        onUpdate: place,
        onLeave: () => gsap.set(bars, { y: 0 }),
        onLeaveBack: () => gsap.set(bars, { y: 0 }),
      });
    }, list);

    return () => context.revert();
  }, []);

  return (
    <div className="story-index">
      <ol className="story-index__list">
        {pilotStory.passages.map((passage, index) => (
          /* One shape three times: title, reading, and one picture beside both.
             Varying it was tried twice — an entry with two pictures and an entry
             with none — and both broke the list rather than enriching it. See
             the note on `passages` in the content for what each one did. */
          <li className="story-index__entry" key={passage.id}>
            {/* The bar is the thing that travels, so it is one box: opaque to
                the page's own black, ruled along its top, and holding both the
                number and the title. A screen reader gets the three headings in
                order and takes the sequence from that, so the number is
                decoration and is hidden from it. */}
            <div className="story-index__bar">
              <span className="story-index__number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="story-index__title">{passage.heading}</h2>
            </div>

            {/* The reading, under its own title in the same column — where the
                reference puts it, and it is right: the title is the sentence
                the paragraph finishes, and a paragraph a column away from its
                title is two things instead of one. */}
            <div className="story-index__text">
              {passage.paragraphs.map((paragraph) => (
                <p className="story-index__copy" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* One frame, beside both, running the height of the entry.
                Square-cornered like the plate above — a rounded window is a
                card with a photograph in it. */}
            <figure className="story-index__shot">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={passage.image}
                alt=""
                width="1600"
                height="1000"
                loading="lazy"
                decoding="async"
              />
            </figure>
          </li>
        ))}
      </ol>
    </div>
  );
}

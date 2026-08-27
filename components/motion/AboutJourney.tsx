"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The notes below the photographs replace one another as you scroll.
 *
 * The block pins, the heading holds its place on the left — going and returning
 * rather than cutting when the note behind it changes — and the copy arrives
 * from the right — the next note standing a column over until the scroll brings
 * it in, while the one being replaced dissolves away leftward a few words at a
 * time. When the last one has arrived the pin releases and the page carries on.
 *
 * **This is the service journey, and deliberately so.** The owner asked for it
 * by pointing at a service page: the same movement, with one difference he named
 * — there the heading travels with its card, here it stays where it is and
 * CHANGES when the note behind it does. So the heading is not in the stage at
 * all; it is a separate element whose text is swapped, which is also what makes
 * it announceable.
 *
 * The numbers are `ServiceOfferingsScroll`'s own: a column offset of a card plus
 * the gap, words leaving in groups of three over a 0.22 window and a 0.78
 * spread, smoothstepped, drifting 14px. Copied rather than shared because that
 * one is wound through a pinned run with a skip control, five chapters and a
 * navigation rail; lifting the shape is honest, lifting the machinery would tie
 * this page to that one.
 */

/** Words to a group as they leave, and how far each drifts. */
const GROUP = 3;
const DRIFT = 14;

/** Share of a note's run a word group takes, and the spread across them. */
const WINDOW = 0.22;
const SPREAD = 0.78;

/** How much scroll each note is given, as a fraction of the window's height. */
const PER_NOTE = 0.9;

/**
 * Where in a note's run the next one starts arriving, and where the one being
 * replaced has finished leaving.
 *
 * **They do not overlap, and that is the point.** The service journey has two
 * cards on screen at once — the one being read and the next standing a column
 * over — which is right there, where the cards are half the stage and the pair
 * reads as a set. Here it read as two notes side by side, which is what the
 * owner asked to change: one at a time, the second arriving as the first goes.
 *
 * So the outgoing words are gone by LEAVES and the incoming one does not begin
 * until HANDOVER, with a little air between them.
 */
const LEAVES = 0.5;
const HANDOVER = 0.55;

/** How long the heading takes to go, and how far it drifts doing it. */
const TITLE_FADE = 0.18;
const TITLE_LIFT = 8;

const smooth = (value: number) => value * value * (3 - 2 * value);

export function AboutJourney() {
  useEffect(() => {
    /* The only gate. It used to be two: this, and `(max-width: 64rem)` for
       "a phone has nothing stacked to slide".

       That second one went on 2026-08-27 — owner: the same scroll effect on
       mobile — and the sentence it was written on had stopped being true anyway.
       The stage stacks its cards at every width now; only a reader who has asked
       for no motion gets them back in flow, and that reader is already turned
       away here. The stylesheet no longer has a width where the two disagree. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const viewport = document.querySelector<HTMLElement>("[data-journey]");
    const stage = document.querySelector<HTMLElement>("[data-journey-stage]");
    const heading = document.querySelector<HTMLElement>("[data-journey-title]");
    if (!viewport || !stage || !heading) return;

    const cards = gsap.utils.toArray<HTMLElement>("[data-journey-card]", stage);
    if (cards.length < 2) return;

    /* **The stage is as tall as its tallest note, measured rather than declared.**

       The cards are absolute, so the stage has no height of its own and the
       stylesheet gives it a 22rem floor. That number was written for a column
       beside a heading on a desktop; one column on a phone is far taller — the
       third paragraph of the first note alone runs past it at 390px — and the
       pin would have held a box the note had grown out of, with the words
       running into whatever came next.

       Read off the cards, which is a number that cannot be wrong at a width
       nobody tested. `offsetHeight` is the layout box, so the transforms the run
       puts on these do not disturb it.

       On `refreshInit` rather than once: it fires BEFORE ScrollTrigger takes its
       measurements, so the height is already correct when the pin is sized. A
       rotation, a resize, or a web font landing late all arrive through it. */
    const sizeStage = () => {
      const tallest = cards.reduce(
        (most, card) => Math.max(most, card.offsetHeight),
        0,
      );
      if (tallest > 0) stage.style.minHeight = `${Math.ceil(tallest)}px`;
    };

    sizeStage();
    ScrollTrigger.addEventListener("refreshInit", sizeStage);

    const context = gsap.context(() => {
      const wordGroups = cards.map((card) =>
        gsap.utils.toArray<HTMLElement>("[data-journey-word]", card),
      );

      let announced = -1;

      const leave = (words: HTMLElement[], progress: number) => {
        const groups = Math.max(Math.ceil(words.length / GROUP), 1);
        /* Scaled to LEAVES rather than to the whole run, so the last group is
           gone before the next note starts arriving. */
        const fade = gsap.utils.clamp(0, 1, (progress - 0.02) / (LEAVES - 0.02));

        words.forEach((word, index) => {
          const group = Math.floor(index / GROUP);
          const start = groups === 1 ? 0 : (group / (groups - 1)) * SPREAD;
          const eased = smooth(gsap.utils.clamp(0, 1, (fade - start) / WINDOW));
          gsap.set(word, { opacity: 1 - eased, x: eased * -DRIFT });
        });
      };

      const arrive = (words: HTMLElement[]) => {
        gsap.set(words, { opacity: 1, x: 0 });
      };

      const render = (progress: number) => {
        const position = progress * cards.length;
        const index = Math.min(Math.floor(position), cards.length - 1);
        const local = gsap.utils.clamp(0, 1, position - index);
        const next = Math.min(index + 1, cards.length - 1);
        const last = index === cards.length - 1;

        /* The incoming note only starts moving part way through the outgoing
           one's run, so the two are not sliding past each other the whole time. */
        const handover = smooth(
          next === index
            ? 0
            : gsap.utils.clamp(0, 1, (local - HANDOVER) / (1 - HANDOVER)),
        );

        /* A card is the stage now, so it travels a stage's width. It was 48%
           with the next one parked beside it, which is the service layout and
           is what put two notes on screen together. */
        const column = stage.clientWidth;

        cards.forEach((card, at) => {
          const isCurrent = at === index;
          const isNext = at === next && next !== index;

          gsap.set(card, {
            /* The incoming one is invisible until it starts moving, so nothing
               shows through the one still being read. */
            opacity: isCurrent ? 1 : isNext ? handover : 0,
            x: isCurrent ? 0 : isNext ? (1 - handover) * column : column,
            zIndex: isNext ? 2 : isCurrent ? 1 : 0,
            pointerEvents: isCurrent && handover < 0.5 ? "auto" : "none",
          });
        });

        if (last) arrive(wordGroups[index]);
        else leave(wordGroups[index], local);
        if (next !== index) arrive(wordGroups[next]);

        /* **The heading goes before it changes, and comes back after.** It used
           to swap its text on one frame, which is a cut in the middle of a
           block where everything else is scrubbed.

           It leaves upward as the note under it dissolves, and the text is
           written while nothing is on screen to see it change — the window
           between the words being gone at LEAVES and the next note starting at
           HANDOVER exists for exactly this. Then it arrives from below with the
           note it belongs to. */
        const leaving = smooth(
          gsap.utils.clamp(0, 1, (local - (LEAVES - TITLE_FADE)) / TITLE_FADE),
        );
        const swapped = !last && local >= LEAVES;
        const showing = swapped ? next : index;
        const opacity = last ? 1 : Math.max(1 - leaving, handover);

        gsap.set(heading, {
          opacity,
          y: swapped
            ? (1 - handover) * TITLE_LIFT
            : -leaving * TITLE_LIFT,
        });

        /* Only written when it changes. Setting the same string every frame
           makes a polite live region announce on every one of them. */
        if (showing !== announced) {
          announced = showing;
          heading.textContent = cards[showing].dataset.journeyHeading ?? "";
        }
      };

      render(0);

      ScrollTrigger.create({
        trigger: viewport,
        start: "center center",
        end: () => `+=${window.innerHeight * PER_NOTE * cards.length}`,
        pin: viewport,
        pinSpacing: true,
        scrub: 0.4,
        invalidateOnRefresh: true,
        onUpdate: (self) => render(self.progress),
      });
    });

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", sizeStage);
      /* Set outside the gsap context, so reverting the context does not take it
         — and left behind it would pin a stale height onto the flow layout. */
      stage.style.minHeight = "";
      context.revert();
    };
  }, []);

  return null;
}

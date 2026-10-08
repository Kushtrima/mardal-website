"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { fadeIn, fadeOut, hide, OUT } from "../../lib/page-transition";
import { Container } from "../layout/Container";
import { RollingLabel } from "../ui/RollingLabel";
import {
  caseStudies,
  clientEntries,
  pilotStory,
} from "../../content/case-studies";

/* The four, cycled. Named here rather than set as a colour on the element,
   because the render test fails the build on a server-rendered `style=` — the
   card carries which of the four it is and globals.css owns what that means.

   Four against a grid that is two cards wide at every width: the card under any
   card is a different colour, which is the rule the coloured boxes on the
   homepage were built to. */
const TINTS = ["one", "two", "three", "four"] as const;

/**
 * **Three shapes, two to a row at most, sometimes one** — owner, 2026-10-08:
 * "i want the project to have three format Box, wide and portrat and to be
 * mixed", "the images need to start always from the [vertical] line not in
 * the middle", then "max 2 project in one row sometimes 1". So on the page's
 * own four columns, each picture starting on a line, rows of two and of one
 * by turns. A row of two is two halves — a portrait and a wide one, then a
 * box and a portrait. A row of one stands alone with the rest of its row
 * empty — a wide one from the second line to the edge, then a box over the
 * first half. The shape is the card's PLACE in that rhythm, not the entry's,
 * so a filtered list keeps the rhythm too.
 */
type Format = "wide" | "box" | "portrait";
type Slot = {
  format: Format;
  /** Columns of the four it takes. */
  span: number;
  /** The line it starts on; set on a row's first picture, so every row
   *  begins a row of its own. */
  start?: number;
  row: number;
  place: number;
};

/** Each row's pictures: shape, columns, and — a row's first — its line. */
const ROWS: Record<number, readonly (readonly [Format, number, number?])[][]> = {
  1: [[["wide", 3, 2]], [["box", 2, 1]]],
  2: [
    [["portrait", 2, 1], ["wide", 2]],
    [["box", 2, 1], ["portrait", 2]],
  ],
};

/** Rows of two and of one, by turns: eight is 2 + 1 + 2 + 1 + 2. */
function arrange(count: number): Slot[] {
  const slots: Slot[] = [];
  const used: Record<number, number> = { 1: 0, 2: 0 };
  let size = 2;
  while (slots.length < count) {
    const take = Math.min(size, count - slots.length);
    const shapes = ROWS[take][used[take]++ % ROWS[take].length];
    shapes.forEach(([format, span, start], index) =>
      slots.push({ format, span, start, row: take, place: index + 1 }),
    );
    size = take === 2 ? 1 : 2;
  }
  return slots;
}

/** What a picture is drawn at, by its share of the page: on a phone a half
 *  or the whole width, else its columns' share. */
function sizesFor(slot: Slot) {
  const phone = slot.row === 2 ? 50 : 100;
  return `(max-width: 40rem) ${phone}vw, ${(slot.span / 4) * 100}vw`;
}

const ALL: string = caseStudies.filters.all;
/** All first, then the seven — the order they stand in the row. */
const CHOICES: readonly string[] = [ALL, ...caseStudies.filters.items];

/**
 * The Clients index: FILTERS under the opening, and the work under it.
 *
 * ── FILTERS ──
 * Owner, 2026-10-08, with a picture of "-¦- FILTERS": "under the hero add
 * this then when click to open …". Then: "i want when open menu to open on
 * the left horisontally as menu, then to be selectd only All and active with
 * red underline". So the choices open in one row beside FILTERS, wiped in
 * from it as the bar's row of pages is from Menu, the nearest first; All
 * first and chosen when the page arrives; one chosen at a time, the chosen
 * one underlined in the red. It replaced the rail down the left that held the
 * same seven and the pin that held it against the scroll (owner: remove it).
 * An entry is shown under a discipline when it lists it; several list more
 * than one.
 *
 * In the browser and nowhere else: the disciplines have no routes, so a
 * choice is state and only state — nothing touches the address bar.
 *
 * ── The two states, and why they are two ──
 * `chosen` is what is CHOSEN and `listed` is what the grid is SHOWING. They are
 * the same value a moment apart, and the moment is the point: the underline
 * has to move on the press, while the cards leave and different cards arrive
 * on the shared page-transition movement. Presses in a run are gathered: the
 * cards go out once and come back once, with the last choice.
 */
export function ClientsIndex() {
  const [open, setOpen] = useState(false);
  const [chosen, setChosen] = useState(ALL);
  const [listed, setListed] = useState(ALL);
  const workRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  /** The work is on screen before it is ever swapped, so the arrival below must
   *  not run for the list the page was served with. */
  const firstRef = useRef(true);
  /** A swap waiting for the cards to finish leaving. */
  const swapRef = useRef<number | undefined>(undefined);
  /** The choice as of the last press, not the last render: two presses
   *  before React has drawn the first must both count. */
  const chosenRef = useRef(ALL);

  function choose(next: string) {
    if (next === chosenRef.current) return;
    chosenRef.current = next;
    setChosen(next);

    const work = workRef.current;
    if (!work || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setListed(next);
      return;
    }

    /* Out once for a run of presses, and the swap on a timer rather than on
       the tween finishing, for the reason the page transition pushes its route
       on one: GSAP's ticker sleeps while the tab is hidden, and a list that
       only changed when a tween completed would never change for anyone who
       pressed and looked away. */
    if (swapRef.current === undefined) fadeOut(work);
    window.clearTimeout(swapRef.current);
    swapRef.current = window.setTimeout(() => {
      swapRef.current = undefined;
      setListed(next);
    }, OUT * 1000);
  }

  /* Escape shuts the list and hands the focus back to FILTERS. */
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => window.clearTimeout(swapRef.current), []);

  /* The new list arriving. `useLayoutEffect` so it is hidden before the
     browser paints it, and comes up through the same blur the old one left
     in. */
  useLayoutEffect(() => {
    if (firstRef.current) {
      firstRef.current = false;
      return;
    }

    const work = workRef.current;
    if (!work) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    hide(work);
    fadeIn(work);
  }, [listed]);

  const shown =
    listed === ALL
      ? clientEntries
      : clientEntries.filter((entry) =>
          (entry.disciplines as readonly string[]).includes(listed),
        );

  const slots = arrange(shown.length);

  return (
    <section
      className="clients-index"
      aria-labelledby="clients-index-title"
      data-route-section
    >
      <Container data-enter data-enter-mode="fade">
        <h2 className="visually-hidden" id="clients-index-title">
          Delivered work
        </h2>

        {/* FILTERS on the first rule, and the choices opening in a row
            beside it — wrapping, where the row is narrow, in the room beside
            it — the work moving down under them if they take more than its
            line. */}
        <div className="clients-filters" data-open={open ? "true" : "false"}>
          <button
            className="clients-filters__toggle"
            type="button"
            ref={toggleRef}
            data-roll
            aria-expanded={open}
            aria-controls="clients-filters-list"
            onClick={() => setOpen((wasOpen) => !wasOpen)}
          >
            {/* The Menu's split plus; it stays a plus while the list is
                open, as the Menu's does. */}
            <span className="clients-filters__plus" aria-hidden="true" />
            <RollingLabel>{caseStudies.filters.button}</RollingLabel>
          </button>

          <div className="clients-filters__panel">
            <ul
              className="clients-filters__list"
              id="clients-filters-list"
              aria-label={caseStudies.filters.label}
            >
              {CHOICES.map((item) => (
                <li className="clients-filters__item" key={item}>
                  <button
                    className="clients-filters__option"
                    type="button"
                    data-roll
                    aria-pressed={chosen === item}
                    /* Out of the tab order while the row is shut. */
                    tabIndex={open ? undefined : -1}
                    onClick={() => choose(item)}
                  >
                    <RollingLabel>{item}</RollingLabel>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="clients-work" ref={workRef}>
          <ul className="clients-grid">
            {shown.map((entry, index) => {
              const slot = slots[index];
              /* The picture. Stock frames for now, at the owner's ask, so the
                 card can be judged against real photography — see
                 content/case-studies.ts for why they must not ship.

                 The tint stays under the image rather than being dropped with
                 the drawing. It is what stands in the box while a remote
                 frame is still in flight, and what is left there if it never
                 arrives — a card whose picture fails should be a coloured
                 panel, not a broken one. */
              const plate = (
                <div
                  className="clients-card__plate"
                  data-tint={TINTS[index % TINTS.length]}
                  /* Where the ground and the mark are drawn — see
                     `data-opens` on the article. Marked on every card, not
                     only the ones that open: it says "this is the box the
                     treatment paints in", and whether it paints is the
                     article's to say. */
                  data-opens-mark
                >
                  {/* Decorative, so alt is empty: these photographs are of
                      nothing to do with the work, and describing one to a
                      screen reader would be describing a placeholder. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="clients-card__art"
                    src={entry.image}
                    srcSet={`${entry.image.replace("/1200/1200", "/600/600")} 600w, ${entry.image} 1200w`}
                    sizes={sizesFor(slot)}
                    alt=""
                    width="1200"
                    height="1200"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              );

              return (
                <li
                  key={entry.slug}
                  data-format={slot.format}
                  data-span={slot.span}
                  data-start={slot.start}
                  data-row={slot.row}
                  data-place={slot.place}
                >
                  {/* A card is a link only where there is a story behind it,
                      which today is one of the eight. The other seven are
                      articles and go nowhere, on purpose: a card that looks
                      like a link and answers with an empty page is worse than
                      a card that never offered. */}
                  <article
                    className={`clients-card${
                      "story" in entry ? " clients-card--linked" : ""
                    }`}
                    /* The sector as data rather than as a word on the page.
                       It is no longer shown or filtered on — the owner took
                       the industry off the card and out of the rail — but it
                       is still what each entry IS, and the one test that has
                       to tell two entries apart reads it from here rather
                       than from a line of text that has been restyled three
                       times in a day. */
                    data-sector={entry.sector}
                    /* **The hook the hover treatment hangs off, and it is
                       deliberately not a Clients class.**

                       A card that opens something darkens and draws a plus on
                       its picture. That is a rule about cards in general
                       rather than about this page, so the stylesheet answers
                       to `[data-opens]` and `[data-opens-mark]` — any card
                       anywhere adopts the whole treatment by carrying those
                       two attributes, with no CSS written for it.

                       Set from the entry rather than by hand: a card gets it
                       the moment a story exists behind it, which is the same
                       condition that makes it a link at all. When the other
                       seven are written they gain it with them. */
                    data-opens={"story" in entry ? "true" : undefined}
                  >
                    {/* The link wraps the picture, and where it sits in this
                        tree is the whole of how much of the card can be
                        clicked — it is not a nesting preference. The
                        stylesheet stretches this anchor over the card with an
                        inset pseudo-element, and an inset pseudo-element
                        measures from the nearest POSITIONED ancestor. While
                        the anchor sat inside the heading, that ancestor was
                        the heading, and the target was one word. */}
                    {"story" in entry ? (
                      <Link
                        className="clients-card__link"
                        href={`/case-studies/${entry.slug}`}
                        /* The only thing inside this link is an image with an
                           empty alt, on purpose — so without a label the one
                           clickable card on the page announces itself as
                           "link" with nothing to say where it goes. Named
                           from the study rather than from a sentence written
                           here, so it cannot drift from the page it opens. */
                        aria-label={pilotStory.title}
                      >
                        {plate}
                      </Link>
                    ) : (
                      plate
                    )}

                    {/* The name, and nothing else — owner, 2026-10-08:
                        "remove the service complete under the project".
                        (Industry, services and country stood under it from
                        2026-09-30.) The heading tag stays: it is what puts
                        each card in the page's outline. */}
                    <h3 className="clients-card__name">{entry.name}</h3>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}

"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { fadeIn, fadeOut, hide, OUT } from "../../lib/page-transition";
import { ClientsPin } from "./ClientsPin";
import { Container } from "../layout/Container";
import {
  ALL_WORK,
  caseStudies,
  clientEntries,
  pilotStory,
} from "../../content/case-studies";
import { industries } from "../../content/home";

/* The four, cycled. Named here rather than set as a colour on the element,
   because the render test fails the build on a server-rendered `style=` — the
   card carries which of the four it is and globals.css owns what that means.

   Four against a grid that is two cards wide at every width: the card under any
   card is a different colour, which is the rule the coloured boxes on the
   homepage were built to. */
const TINTS = ["one", "two", "three", "four"] as const;

/**
 * Where the section comes to rest when a filter is chosen.
 *
 * The same 88 `ClientsPin` holds the rail at, and it has to be: the rail is
 * pinned to that line while there is anything to pin it for, so landing the
 * section anywhere else would move the rail by the difference at exactly the
 * moment the reader is watching it. Written out rather than imported, because
 * the pin's copy is a private constant and one of the two files would have to
 * export a number that is really a shared decision — this comment is the link.
 */
const SECTION_CLEARANCE = 88;

/**
 * The Clients index: one list, with a rail down the left filtering it by what
 * kind of work each entry is.
 *
 * ── What it filters on, and what it used to ──
 * Seven disciplines — UX/UI Design through AI & Automation — with `All` at the
 * foot, chosen by default. It filtered by the client's INDUSTRY until
 * 2026-08-25, over seven prerendered routes, and the owner replaced the
 * taxonomy: what the page indexes is the work rather than whose industry it was
 * for.
 *
 * ── Which is why this filters in the browser and the sectors filtered on the
 * server ──
 * A sector was an address: `/case-studies/finance` painted Finance first,
 * because the route decided it before anything rendered. The disciplines have
 * no routes — the owner took those away with the taxonomy — so a discipline is
 * state and only state. Nothing here touches the address bar, and that is the
 * one thing the old filter did that this deliberately does not: writing
 * `/case-studies/websites` into history would hand out a link that 404s on
 * reload.
 *
 * ── The two states, and why they are two ──
 * `filter` is what is CHOSEN and `listed` is what the grid is SHOWING. They are
 * the same value a moment apart, and the moment is the point: the mark has to
 * move on the press, while the cards leave and different cards arrive on the
 * shared page-transition movement. Held as one state the rail sat dead for half
 * a second after every press.
 */
export function ClientsIndex() {
  const [filter, setFilter] = useState<string>(ALL_WORK);

  /* Shut, and only where the stylesheet acts on it. A phone spends a screen on
     an index before it reaches a card, so on a phone the rail is one row until
     it is asked for. The state is carried at every width and read at one: on
     the wide page the rail is always open and this does nothing, which is why
     there is no width in this file. */
  const [open, setOpen] = useState(false);

  const [listed, setListed] = useState<string>(ALL_WORK);
  const workRef = useRef<HTMLDivElement>(null);
  /** The work is on screen before it is ever swapped, so the arrival below must
   *  not run for the list the page was served with. */
  const firstRef = useRef(true);

  function choose(next: string) {
    if (next === filter) return;

    setFilter(next);

    /* Shut behind the choice. On the wide page nothing closes because nothing
       was open; on a phone the rail has done its job the moment something is
       picked, and leaving it standing would put the answer below the question
       again. */
    setOpen(false);

    const work = workRef.current;
    const noMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!work || noMotion) {
      setListed(next);
      return;
    }

    fadeOut(work);

    /* Swapped on a timer rather than on the tween finishing, for the reason the
       page transition pushes its route on one: GSAP's ticker sleeps while the
       tab is hidden, and a list that only changed when a tween completed would
       simply never change for anyone who pressed and looked away. */
    window.setTimeout(() => setListed(next), OUT * 1000);
  }

  /**
   * The work arriving, and the reader put at the top of it.
   *
   * ── Why the scroll is here at all ──
   * **Measured on 2026-08-25: the work column is 1933px with all eight cards
   * and 456px with Branding's two, while the rail beside it is 513.** So
   * choosing a short view takes about 1400px out of the document under a reader
   * who is scrolled into it — the browser clamps their position, and
   * `ClientsPin` lets go of the rail in the same frame, because the distance it
   * holds the rail for is the work column's height MINUS the rail's and that
   * has just gone to zero. Both move at once. The owner saw it as the whole
   * left-hand column jumping up.
   *
   * Neither half is wrong on its own. A rail cannot be held against a column
   * shorter than itself, and a page that has lost its content is shorter. What
   * was missing is that nobody decided where the reader should be afterwards,
   * so the browser decided, and a clamp is not a decision.
   *
   * Top of the section, then — which is where someone who has just changed what
   * they are looking at wants to be. It happens under the same blur the cards
   * arrive through, so it reads as the page answering rather than as a jump.
   *
   * ── `useLayoutEffect`, not `useEffect` ──
   * This runs after React has written the new list and before the browser
   * paints. In `useEffect` the reader would see one frame at the clamped
   * position first, which is the flicker this exists to remove.
   *
   * ── Through the smoother where there is one ──
   * `window.scrollTo` sets the native position, which ScrollSmoother then eases
   * towards over the next few frames — a scroll it did not perform and has to
   * catch up with. `scrollTo(target, false)` is the same instruction given to
   * the thing that actually owns the scroll. The fallback is for reduced motion
   * and for a page where the smoother never built.
   */
  useLayoutEffect(() => {
    if (firstRef.current) {
      firstRef.current = false;
      return;
    }

    const work = workRef.current;
    if (!work) return;

    const section = work.closest(".clients-index");
    if (section) {
      const smoother = ScrollSmoother.get();

      if (smoother) {
        smoother.scrollTo(section, false, `top top+=${SECTION_CLEARANCE}`);
      } else {
        const top =
          section.getBoundingClientRect().top + window.scrollY - SECTION_CLEARANCE;
        window.scrollTo(0, Math.max(0, Math.round(top)));
      }
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    hide(work);
    fadeIn(work);
  }, [listed]);

  /* An entry is in a view if it does that kind of work — several of them do
     more than one, which is what makes the filter worth having: seven views
     each holding one card is the failure the sector routes had. */
  const shown =
    listed === ALL_WORK
      ? clientEntries
      : clientEntries.filter((entry) =>
          (entry.disciplines as readonly string[]).includes(listed),
        );

  /* The client's industry, by its own name. Declared once in content/home.ts and
     read by the homepage's Industries run as well, so a sector renamed there is
     renamed here rather than in two places. */
  const sectorTitle = (id: string) =>
    industries.find((industry) => industry.id === id)?.title ?? id;

  return (
    <section
      className="clients-index"
      aria-labelledby="clients-index-title"
      data-route-section
    >
      <ClientsPin />

      <Container data-enter data-enter-mode="fade">
        <h2 className="visually-hidden" id="clients-index-title">
          Delivered work
        </h2>

        {/* An index down the side rather than a strip across the top. Three
            treatments of the row were tried when this was a filter and none of
            them stopped it reading as a toolbar — eight words in a line above a
            grid is a control bar wherever you put it, and this site does not
            have control bars. Standing it up made it an index, and an index is
            what it still is now that nothing in it is pressable. */}
        <div className="clients-layout">
          <div className="clients-rail">
            {/* **The pinned element, and it is deliberately not the grid item
                above it.**

                ScrollTrigger pins by wrapping its target in a `pin-spacer` and
                taking the element out of normal flow inside it. Pin a grid
                CHILD and that spacer becomes the grid item — so every refresh
                re-measures something the grid is laid out from, the work column
                beside it can move, and `ClientsPin` is watching that column's
                height with a ResizeObserver in order to decide when to refresh.
                That is a loop, and it is what the owner saw as the page moving
                up and down on every press.

                It only appeared when the heading was asked to stick: the pin
                used to target `.clients-filter`, three levels down and
                incapable of moving the grid. This box restores that — the grid
                item never moves, and what is held against the scroll is
                everything inside it. */}
            <div className="clients-rail__inner">
              {/* Two authored lines, the way every heading on this site is set:
                where the line turns is a decision about the copy rather than
                something left to the width of the column. Outside the holder
                below, which is a two-row grid on a phone — a third thing in it
                would be a third row and the disclosure would open the wrong
                one. */}
              <p className="clients-rail__title">
                {caseStudies.rail.title.map((line) => (
                  <span className="clients-rail__title-line" key={line}>
                    {line}
                  </span>
                ))}
              </p>

              {/* The state is carried on the holder rather than on the rail, so
                the stylesheet can open a row around it: the two are a grid and
                its track, and a track is the one thing that can be animated
                from nothing to the height of whatever is standing in it. */}
              <div
                className="clients-filter-holder"
                data-open={open ? "true" : "false"}
              >
                {/* The rail, shut, on a phone. It names what you are looking at
                  rather than what it does — a reader who has chosen Websites is
                  told Websites, and the mark beside it says there is more.
                  `Filter` over it would be a label on a control, and this site
                  labels nothing. */}
                <button
                  className="clients-filter__toggle"
                  type="button"
                  aria-expanded={open}
                  aria-controls="clients-filter"
                  onClick={() => setOpen((wasOpen) => !wasOpen)}
                >
                  <span className="clients-filter__toggle-label">
                    {filter === ALL_WORK ? caseStudies.rail.all : filter}
                  </span>
                  <span
                    className="clients-filter__toggle-mark"
                    aria-hidden="true"
                  />
                </button>

                <div
                  className="clients-filter"
                  id="clients-filter"
                  role="group"
                  aria-label="Filter the work"
                >
                  {caseStudies.rail.items.map((item) => (
                    <button
                      className={`clients-filter__item${
                        filter === item ? " is-current" : ""
                      }`}
                      key={item}
                      type="button"
                      aria-pressed={filter === item}
                      onClick={() => choose(item)}
                    >
                      <span className="clients-filter__label">{item}</span>
                    </button>
                  ))}

                  {/* `All` closes the rail rather than opening it: the seven are a
                    list, and the way out of one of them is not the eighth
                    member of that list. It is chosen when the page arrives. */}
                  <button
                    className={`clients-filter__item clients-filter__item--all${
                      filter === ALL_WORK ? " is-current" : ""
                    }`}
                    type="button"
                    aria-pressed={filter === ALL_WORK}
                    onClick={() => choose(ALL_WORK)}
                  >
                    <span className="clients-filter__label">
                      {caseStudies.rail.all}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="clients-work" ref={workRef}>
            {/* No empty state any more. It existed because a sector could be
                chosen that held nothing, and every sector was in that state;
                with no filter the grid is always all eight entries and the
                branch that drew the redaction bars is unreachable. */}
            <ul className="clients-grid">
              {shown.map((entry, index) => {
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
                      alt=""
                      width="640"
                      height="360"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                );

                return (
                  <li key={entry.slug}>
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

                      {/* Three plain lines: the name, where it is, and what
                          the client does. All set the same — body face, one
                          size, no labels above them.

                          **The industry is back and it is no longer the rail's
                          taxonomy.** It came off when the sectors did, because
                          the rail carried the same seven words and the card was
                          repeating the filter that had put it there. The rail
                          filters by DISCIPLINE now, so the two say different
                          things and the card can carry both: what kind of work
                          this was, in the rail, and whose industry it was for,
                          here.

                          The heading tag stays. It is what puts each card in
                          the page's outline; styling it flat is a look, not a
                          demotion. */}
                      <h3 className="clients-card__name">{entry.name}</h3>

                      {/* A label over each fact, and none over the name — the
                          owner's distinction, 2026-08-25. The name is the
                          card's heading; a word above a heading is a caption on
                          it, and the two facts under it are the things that
                          need saying what they are.

                          A description list again, because that is what a run
                          of label-and-value pairs is. It was one for a day, then
                          three bare `<p>`s when the labels came off, and the
                          markup follows the labels rather than the other way
                          round. */}
                      <dl className="clients-card__facts">
                        <div className="clients-card__fact">
                          <dt>{caseStudies.fields.location}</dt>
                          <dd>{entry.location}</dd>
                        </div>
                        <div className="clients-card__fact">
                          <dt>{caseStudies.fields.industry}</dt>
                          <dd>{sectorTitle(entry.sector)}</dd>
                        </div>
                      </dl>
                    </article>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

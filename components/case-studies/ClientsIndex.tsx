"use client";

import { useState } from "react";
import Link from "next/link";
import { ClientsPin } from "./ClientsPin";
import { Container } from "../layout/Container";
import { RedactedLines } from "../home/RedactedLines";
import {
  ALL_SECTORS,
  caseStudies,
  clientEntries,
} from "../../content/case-studies";
import { industries } from "../../content/home";

/* The four, cycled. Named here rather than set as a colour on the element,
   because the render test fails the build on a server-rendered `style=` — the
   card carries which of the four it is and globals.css owns what that means.

   Four against a grid that is three cards wide at full width and two below
   that: on both, the card under any card is a different colour, which is the
   rule the coloured boxes on the homepage were built to. */
const TINTS = ["one", "two", "three", "four"] as const;

/**
 * The Clients index: seven sectors as a filter over one list, rather than seven
 * pages to navigate between.
 *
 * The argument for one page is that there is not enough work to fill seven, and
 * a route holding one entry reads emptier than a list holding everything. The
 * argument for the filter is the one the menu could not answer: having chosen
 * Finance from the header, changing your mind should not mean going back up to
 * the header to do it. Every other sector is on screen the whole time, and so
 * is the way back to all of them.
 *
 * Where the sector comes from is the part worth reading. It arrives as a prop,
 * decided by the route on the server, so `/case-studies/finance` paints Finance
 * first rather than painting everything and then correcting itself. That is
 * also why there is no effect in here reaching for the URL: an effect that sets
 * state on mount is a second render every visitor pays for, and it would flash
 * the full list on the way past.
 *
 * Changing sector after that is state, not navigation — instant, and it leaves
 * the hero alone rather than replaying the page's arrival seven times while
 * someone looks through seven sectors. The address bar is corrected behind it
 * so any view is still a link that can be sent.
 *
 * A client component, which the house style keeps small and specific — this one
 * holds a filter and nothing else. The hero above it is server-rendered.
 */
export function ClientsIndex({ initialSector }: { initialSector: string }) {
  const [sector, setSector] = useState<string>(initialSector);

  function choose(next: string) {
    setSector(next);

    /* replaceState rather than pushState, and rather than a router push. Moving
       along a filter is not moving through the site: a reader who has run
       across five sectors should get back where they came from with one press
       of Back rather than six, and none of those five should have re-run the
       page's entry animation. */
    window.history.replaceState(
      null,
      "",
      next === ALL_SECTORS ? "/case-studies" : `/case-studies/${next}`,
    );
  }

  const shown =
    sector === ALL_SECTORS
      ? clientEntries
      : clientEntries.filter((entry) => entry.sector === sector);

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

        {/* An index down the side rather than a strip across the top.
            Three treatments of the row were tried and none of them stopped it
            reading as a toolbar — a lit word, a filled block, a mark drawn
            underneath — because the problem was never the marking, it was the
            shape: eight words in a line above a grid is a control bar wherever
            you put it, and this site does not have control bars.

            Standing it up makes it an index, which is a thing this site does
            have, and it buys the one gesture the row could never carry: the
            mega menu's own way of marking a name — a rule drawn from the left
            and the word stepping aside to let it in. That could not work across
            a line, where a word that travels lands on its neighbour. Down a
            column there is nowhere for it to go but right. */}
        <div className="clients-layout">
          <div
            className="clients-filter"
            role="group"
            aria-label={caseStudies.filterLabel}
          >
            {industries.map((industry) => (
              <button
                className={`clients-filter__item${
                  sector === industry.id ? " is-current" : ""
                }`}
                key={industry.id}
                type="button"
                aria-pressed={sector === industry.id}
                onClick={() => choose(industry.id)}
              >
                <span className="clients-filter__label">{industry.title}</span>
              </button>
            ))}

            {/* All closes the index rather than opening it. At the top it read
                as a list that began with an eighth thing which is not a sector;
                at the foot it reads as what it does — the way back out of
                whichever one you are in. */}
            <button
              className={`clients-filter__item clients-filter__item--all${
                sector === ALL_SECTORS ? " is-current" : ""
              }`}
              type="button"
              aria-pressed={sector === ALL_SECTORS}
              onClick={() => choose(ALL_SECTORS)}
            >
              <span className="clients-filter__label">
                {caseStudies.filterAll}
              </span>
            </button>
          </div>

          <div className="clients-work">
            {shown.length === 0 ? (
              /* A sector with nothing in it, which today is every sector — the
                 bars stand in for writing that is genuinely not there, exactly
                 as they do on the Blog index. */
              <div className="clients-empty">
                <div className="clients-empty__lines" aria-hidden="true">
                  <RedactedLines className="clients-empty__bars" />
                </div>

                <p className="clients-empty__title">
                  {caseStudies.empty.title}
                </p>
                <p className="clients-empty__copy">{caseStudies.empty.copy}</p>
              </div>
            ) : (
              <ul className="clients-grid">
                {shown.map((entry, index) => {
                  /* The picture. Stock frames for now, at the owner's ask, so
                     the card can be judged against real photography — see
                     content/case-studies.ts for why they must not ship. The
                     box is the one thing here that is permanent: 242x136, so a
                     screenshot of the delivered system drops straight in later
                     without the grid moving.

                     The tint stays under the image rather than being dropped
                     with the drawing. It is what stands in the box while a
                     remote frame is still in flight, and what is left there if
                     it never arrives — a card whose picture fails should be a
                     coloured panel, not a broken one.

                     Named here rather than written inline because where a
                     story exists the whole plate goes inside the link, and the
                     two branches must be the same picture. */
                  const plate = (
                    <div
                      className="clients-card__plate"
                      data-tint={TINTS[index % TINTS.length]}
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

                      {/* The sector, standing on the picture rather than under
                          it. There is no project name to put here — the name
                          would be the client's, and that is the decision
                          nobody has made.

                          It reads against whatever photograph lands behind it
                          because the picture is darkened under it, not because
                          the word carries a shadow of its own: a shadowed word
                          is legible and looks it, and this site sets type flat
                          everywhere else. */}
                      <h3 className="clients-card__title">
                        {sectorTitle(entry.sector)}
                      </h3>
                    </div>
                  );

                  return (
                    <li key={entry.slug}>
                      {/* A card is a link only where there is a story behind
                          it, which today is one of the eight. The other seven
                          are articles and go nowhere, on purpose: a card that
                          looks like a link and answers with an empty page is
                          worse than a card that never offered. */}
                      <article
                        className={`clients-card${
                          "story" in entry ? " clients-card--linked" : ""
                        }`}
                      >
                        {/* The link wraps the picture, and where it sits in
                            this tree is the whole of how much of the card can
                            be clicked — it is not a nesting preference.

                            The stylesheet stretches this anchor over the card
                            with an inset pseudo-element, and an inset
                            pseudo-element measures from the nearest positioned
                            ancestor. While the anchor sat inside the heading,
                            that ancestor was the heading — which is absolutely
                            positioned in the corner of the picture and shrinks
                            to the word in it. So the target was the word
                            `Healthcare`, on a card whose hover lights the
                            whole panel. Out here the nearest positioned
                            ancestor is the card, and the promise the hover
                            makes is the one the pointer gets.

                            Still one target and one thing to announce: the img
                            is silent, so the link is named by the heading
                            inside it exactly as it was when it was the
                            heading's child. */}
                        {"story" in entry ? (
                          <Link
                            className="clients-card__link"
                            href={`/case-studies/${entry.sector}/${entry.slug}`}
                          >
                            {plate}
                          </Link>
                        ) : (
                          plate
                        )}

                        {/* Who it was for, then what it was. A list of pairs
                            rather than two paragraphs, because a reader
                            comparing two entries is comparing the same two
                            questions and the answers should line up down the
                            page. */}
                        <dl className="clients-card__facts">
                          <div className="clients-card__fact">
                            <dt>{caseStudies.fields.client}</dt>
                            <dd>{entry.client}</dd>
                          </div>
                          <div className="clients-card__fact">
                            <dt>{caseStudies.fields.description}</dt>
                            <dd>{entry.description}</dd>
                          </div>
                        </dl>
                      </article>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

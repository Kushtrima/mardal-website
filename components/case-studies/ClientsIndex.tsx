"use client";

import { useState } from "react";
import { BlogPattern } from "../blog/BlogPattern";
import { ClientsPin } from "./ClientsPin";
import { Container } from "../layout/Container";
import { RedactedLines } from "../home/RedactedLines";
import {
  ALL_SECTORS,
  caseStudies,
  clientEntries,
} from "../../content/case-studies";
import { industries } from "../../content/home";

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
                {shown.map((entry) => (
                  <li key={entry.slug}>
                    <article className="clients-card">
                      <p className="clients-card__sector">
                        {sectorTitle(entry.sector)}
                      </p>

                      <h3 className="clients-card__title">{entry.title}</h3>

                      {/* The entry's own mark, from its own slug, the way a
                          blog card takes one from its piece. Nothing to choose
                          per entry and no two alike. */}
                      <BlogPattern
                        slug={entry.slug}
                        className="clients-card__mark"
                      />

                      {/* The hero's three promises, answered in order. A list
                          of pairs rather than three paragraphs, because a
                          reader comparing two entries is comparing the same
                          three questions and the answers should line up down
                          the page. */}
                      <dl className="clients-card__facts">
                        <div className="clients-card__fact">
                          <dt>{caseStudies.fields.replaced}</dt>
                          <dd>{entry.replaced}</dd>
                        </div>
                        <div className="clients-card__fact">
                          <dt>{caseStudies.fields.now}</dt>
                          <dd>{entry.now}</dd>
                        </div>
                        <div className="clients-card__fact">
                          <dt>{caseStudies.fields.owns}</dt>
                          <dd>{entry.owns}</dd>
                        </div>
                      </dl>
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

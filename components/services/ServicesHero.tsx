import { Fragment } from "react";
import { Container } from "../layout/Container";
import { ServicesHeroReveal } from "./ServicesHeroReveal";

/** What an opening says: its label, the heading's lines, its full stop and
 *  the note. */
export type PageHeroContent = {
  readonly label: string;
  readonly titleLines: readonly string[];
  readonly titleStop: string;
  readonly note: string;
};

/**
 * **The services page's opening** — the owner's comp of 2026-10-06 ("this is
 * what we need"), on the page's own four columns and their hairlines: the
 * site's plus, in the red, where the comp marks a rule — at the top on the
 * second and fourth, "Service" beside the first; at the foot on the same two,
 * the note beside the second — and between them the heading, its first line
 * set in to the second rule, the longest of the four running the column's
 * whole width (the stylesheet sizes it to).
 *
 * **And the products page's, in its own words** — owner, 2026-10-07: "make
 * same hero banner but with different text". `name` is the page's, for the
 * heading's id and, where it is not the services', a class of its own the
 * stylesheet sizes its heading by.
 *
 * **And the clients'** — owner, 2026-10-08: "change the hero of Client to be
 * same design as in product and service". **And About's**, the same day.
 */
export function ServicesHero({
  hero,
  name,
}: {
  hero: PageHeroContent;
  name: "services" | "products" | "clients" | "about";
}) {
  return (
    <section
      className={name === "services" ? "services-hero" : `services-hero services-hero--${name}`}
      aria-labelledby={`${name}-hero-title`}
      /* The bar says no "Operating from Kosova" over it (the stylesheet). */
      data-services-hero
    >
      <ServicesHeroReveal />

      <Container className="services-hero__inner">
        <p className="services-hero__label" data-services-hero-first>
          <span className="services-hero__mark" aria-hidden="true" />
          {hero.label}
        </p>
        <span
          className="services-hero__mark services-hero__mark--top"
          aria-hidden="true"
          data-services-hero-first
        />

        <h1
          className="services-hero__title"
          id={`${name}-hero-title`}
          data-services-hero-title
        >
          {hero.titleLines.map((line, index) => (
            <span className="services-hero__title-line" key={line}>
              {/* A hyphenated word kept whole where a phone wraps the line. */}
              {line.split(" ").map((word, wordIndex) => (
                <Fragment key={`${word}-${wordIndex}`}>
                  {wordIndex > 0 ? " " : null}
                  {word.includes("-") ? (
                    <span className="services-hero__whole">{word}</span>
                  ) : (
                    word
                  )}
                </Fragment>
              ))}
              {index === hero.titleLines.length - 1 ? (
                <span className="services-hero__stop">{hero.titleStop}</span>
              ) : null}
            </span>
          ))}
        </h1>

        <span
          className="services-hero__mark services-hero__mark--foot"
          aria-hidden="true"
          data-services-hero-last
        />
        <p className="services-hero__note" data-services-hero-last>
          <span className="services-hero__mark" aria-hidden="true" />
          <span>{hero.note}</span>
        </p>
      </Container>
    </section>
  );
}

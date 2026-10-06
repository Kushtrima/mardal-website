import { Fragment } from "react";
import { Container } from "../layout/Container";
import { ServicesHeroReveal } from "./ServicesHeroReveal";
import { ServicesRules } from "./ServicesRules";
import { servicesHero } from "../../content/services-index";

/**
 * **The services page's opening** — the owner's comp of 2026-10-06 ("this is
 * what we need"), on the page's own four columns and their hairlines: the
 * site's plus, in the red, where the comp marks a rule — at the top on the
 * second and fourth, "Service" beside the first; at the foot on the same two,
 * the note beside the second — and between them the heading, its first line
 * set in to the second rule, the longest of the four running the column's
 * whole width (the stylesheet sizes it to).
 */
export function ServicesHero() {
  return (
    <section
      className="services-hero"
      aria-labelledby="services-hero-title"
      /* The bar says no "Operating from Kosova" over it (the stylesheet). */
      data-services-hero
    >
      {/* The page's five hairlines, from the top of the page, gone one by one
          before the wheel (ServicesRules). */}
      <ServicesRules />
      <ServicesHeroReveal />

      <Container className="services-hero__inner">
        <p className="services-hero__label" data-services-hero-first>
          <span className="services-hero__mark" aria-hidden="true" />
          {servicesHero.label}
        </p>
        <span
          className="services-hero__mark services-hero__mark--top"
          aria-hidden="true"
          data-services-hero-first
        />

        <h1
          className="services-hero__title"
          id="services-hero-title"
          data-services-hero-title
        >
          {servicesHero.titleLines.map((line, index) => (
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
              {index === servicesHero.titleLines.length - 1 ? (
                <span className="services-hero__stop">{servicesHero.titleStop}</span>
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
          <span>{servicesHero.note}</span>
        </p>
      </Container>
    </section>
  );
}

import { Container } from "../layout/Container";
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
      /* The page's hairlines run through it — see [data-ruled]. */
      data-ruled
    >
      <Container className="services-hero__inner">
        <p className="services-hero__label">
          <span className="services-hero__mark" aria-hidden="true" />
          {servicesHero.label}
        </p>
        <span
          className="services-hero__mark services-hero__mark--top"
          aria-hidden="true"
        />

        <h1 className="services-hero__title" id="services-hero-title">
          {servicesHero.titleLines.map((line) => (
            <span className="services-hero__title-line" key={line}>
              {line}
            </span>
          ))}
        </h1>

        <span
          className="services-hero__mark services-hero__mark--foot"
          aria-hidden="true"
        />
        <p className="services-hero__note">
          <span className="services-hero__mark" aria-hidden="true" />
          <span>{servicesHero.note}</span>
        </p>
      </Container>
    </section>
  );
}

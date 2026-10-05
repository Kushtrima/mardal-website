import { Container } from "../layout/Container";
import { SiteFooter } from "../layout/SiteFooter";
import { HeaderSpace } from "../layout/HeaderSpace";
import { ClientsIndex } from "./ClientsIndex";
import { SectionEnter } from "../motion/SectionEnter";
import { ServicePageEntry } from "../services/ServicePageEntry";
import { PixelArrow } from "../ui/PixelArrow";
import { RollingLabel } from "../ui/RollingLabel";
import { caseStudies } from "../../content/case-studies";
import { products } from "../../content/home";

/**
 * The Clients page: the hero, and the delivered work under it.
 *
 * One route renders it. Two did — `/case-studies` and `/case-studies/[sector]`,
 * differing by which sector arrived already chosen — until the owner replaced
 * the industry taxonomy on 2026-08-25. The seven sector routes went with it,
 * and this stopped taking a prop.
 *
 * Built on the same bones as every other page here. `service-hero` and its
 * `data-service-hero-*` hooks are the site's editorial page opening rather than
 * anything to do with services, and ServicePageEntry drives them, so this
 * arrives and dissolves exactly as the service pages and the Blog do.
 *
 * ServicePageEntry alone rather than ServicePageMotion, which would also bring
 * ServiceOfferingsScroll. There is no journey here.
 */
export function ClientsPage() {
  return (
    <>
      <SectionEnter />
      <ServicePageEntry />

      {/* `--clients` is the section, `--case-studies` is this page in it. The
          first is what the stylesheet's phone heading rule is written against,
          so a new page under /case-studies inherits it by carrying the class
          rather than by having a rule added for it. */}
      <main
        className="service-page service-page--clients service-page--case-studies"
        id="main-content"
        data-service-page
      >
        <HeaderSpace />

        <section
          className="service-hero service-hero--bare"
          aria-labelledby="case-studies-title"
          data-service-hero
        >
          <Container className="service-hero__inner">
            <div className="service-hero__intro">
              <h1
                className="service-hero__title"
                id="case-studies-title"
                data-service-hero-title
              >
                {caseStudies.titleLines.map((line) => (
                  <span className="service-hero__title-line" key={line}>
                    {line}
                  </span>
                ))}
              </h1>
            </div>

            {/* No artwork. Every other hero on the site carries one — the five
                service pages mask a PNG of the redaction language and the Blog
                draws the vector — and this one carried a generated plate seeded
                from its slug. Owner took it out.

                What it leaves is the reason the rest of this hero moves: the
                drawing held the right half of the opening and the title's
                measure reserved 30rem for it. With the box gone the words take
                the room instead — the heading is no longer cut short of a
                picture that is not there, and the support line and the way in
                stand where it stood. */}

            {/* The sentence and the way in, held together instead of placed
                separately. On the service pages they are the two ends of the
                hero's bottom row, and that only works while there is artwork
                between them; here they are one block standing where the drawing
                stood, so they need one box rather than two grid areas that
                happen to line up.

                It is the box that moves to the right edge — the words inside it
                stay set to the left, as they were. Shrink-wrapped to its
                longest line, so "right" means the writing ends on the edge
                rather than a wide box ending there with the text stopping short
                inside it.

                ServicePageEntry finds both by their data attributes with a
                descendant query, so wrapping them changes nothing it does. */}
            <div className="service-hero__aside">
              <p className="service-hero__support" data-service-hero-support>
                {caseStudies.support}
              </p>

              <a
                className="service-hero__cta"
                data-roll
                href={products.ctaHref}
                data-service-hero-cta
              >
                <RollingLabel>{caseStudies.heroCta}</RollingLabel>
                <PixelArrow
                  className="service-hero__cta-arrow"
                  direction="up-right"
                  size="small"
                />
              </a>
            </div>
          </Container>

          {/* The same dissolve the other heroes leave on: a blur boundary
              travelling up the block and a gradient taking what is left into
              the page. Outside the container so both run the full width. */}
          <div
            className="service-hero__blur"
            aria-hidden="true"
            data-service-hero-blur
          />
          <div
            className="service-hero__fade"
            aria-hidden="true"
            data-service-hero-fade
          />
        </section>

        {/* Every entry, once, with a rail down the left saying what kind of
            work this site holds. It was a filter over seven sectors; see the
            component for what replaced it and why nothing in the rail is
            pressable. */}
        <ClientsIndex />
      </main>

      <SiteFooter />
    </>
  );
}

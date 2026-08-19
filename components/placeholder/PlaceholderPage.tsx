import { Container } from "../layout/Container";
import { SiteFooter } from "../layout/SiteFooter";
import { SiteHeader } from "../layout/SiteHeader";
import { RedactedLines } from "../home/RedactedLines";
import { SectionEnter } from "../motion/SectionEnter";
import { ServicePageEntry } from "../services/ServicePageEntry";
import { PixelArrow } from "../ui/PixelArrow";
import {
  placeholderTitleLines,
  placeholders,
  type PlaceholderKey,
} from "../../content/placeholders";

/**
 * A page that exists before its writing does.
 *
 * Twelve routes render this and differ by one word, which is the whole reason
 * it is a component rather than twelve near-identical files: the day one of
 * them is written, its route file stops calling this and nothing else moves.
 *
 * Built on the same bones as every other page here. `service-hero` and its
 * `data-service-hero-*` hooks are the site's editorial page opening rather than
 * anything to do with services — the Blog and Clients both use it — so this
 * arrives and dissolves exactly as they do, and a reader who lands on an
 * unwritten page gets the site rather than a notice.
 *
 * ServicePageEntry alone rather than ServicePageMotion, which would also bring
 * ServiceOfferingsScroll. There is no journey here, and no body at all.
 */
export function PlaceholderPage({ page }: { page: PlaceholderKey }) {
  const content = placeholders[page];

  return (
    <>
      <SectionEnter />
      <ServicePageEntry />

      <main
        className="service-page service-page--placeholder"
        id="main-content"
        data-service-page
      >
        <SiteHeader />

        <section
          className="service-hero"
          aria-labelledby="placeholder-title"
          data-service-hero
        >
          <Container className="service-hero__inner">
            <div className="service-hero__intro">
              {/* The one line that tells the twelve apart. Every other page on
                  the site is named by its own heading; these share one, so the
                  name has to be said somewhere, and the eyebrow is where this
                  site already says a small thing above a big one.

                  It is the only hero on the site with one, which is why it
                  carries a hook of its own: without it the name would sit there
                  from the first frame while the heading under it was still
                  uncovering, and ServicePageEntry moves what it is given. */}
              <p
                className="eyebrow service-hero__eyebrow"
                data-service-hero-eyebrow
              >
                {content.label}
              </p>

              <h1
                className="service-hero__title"
                id="placeholder-title"
                data-service-hero-title
              >
                {placeholderTitleLines.map((line) => (
                  <span className="service-hero__title-line" key={line}>
                    {line}
                  </span>
                ))}
              </h1>
            </div>

            {/* The redaction bars, doing here what they do on the Blog's empty
                state and for the same reason. Everywhere else on this site they
                are decoration standing in for writing; on these twelve pages
                they stand in for writing that is genuinely not there yet, which
                is the one place the motif is literal rather than decorative.

                Each page slides the window down the drawing, so twelve pages
                are not twelve copies of one picture. */}
            <div
              className="service-hero__pattern service-hero__pattern--lines"
              aria-hidden="true"
              data-service-hero-pattern
            >
              <RedactedLines
                className="service-hero__lines"
                offset={content.patternOffset}
              />
            </div>

            <p className="service-hero__support" data-service-hero-support>
              {content.support}
            </p>

            {/* The point of the page. A reader who wanted Products and was told
                it is being written has been given nothing unless they are also
                told where the products are today — so this goes to the nearest
                real thing rather than to a generic call to action. */}
            <a
              className="service-hero__cta"
              href={content.ctaHref}
              data-service-hero-cta
            >
              {content.cta}
              <PixelArrow
                className="service-hero__cta-arrow"
                direction="up-right"
                size="small"
              />
            </a>
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
      </main>

      <SiteFooter />
    </>
  );
}

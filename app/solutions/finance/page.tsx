import type { Metadata } from "next";
import { Container } from "../../../components/layout/Container";
import { SiteFooter } from "../../../components/layout/SiteFooter";
import { SiteHeader } from "../../../components/layout/SiteHeader";
import { IndustryArt } from "../../../components/home/IndustryArt";
import { SectionEnter } from "../../../components/motion/SectionEnter";
import { ServicePageEntry } from "../../../components/services/ServicePageEntry";
import { PixelArrow } from "../../../components/ui/PixelArrow";
import { finance } from "../../../content/finance";
import { products } from "../../../content/home";

export const metadata: Metadata = {
  title: finance.title,
  description: finance.lede,
};

/**
 * The first of the industry pages, and the pilot for the rest.
 *
 * It is built on the service pages' bones on purpose. `service-hero` and its
 * `data-service-hero-*` hooks are not really about services any more; they are
 * this site's editorial page opening, and ServicePageEntry drives them. Reusing
 * them means this page arrives, dissolves and scrolls exactly as the five
 * service pages do, rather than being a second opinion about how a Mardal page
 * behaves. The one thing that is its own is the artwork.
 *
 * ServicePageEntry is mounted directly rather than ServicePageMotion, which
 * also brings ServiceOfferingsScroll. There is no journey on this page yet.
 * When the body sections land, that is the moment to switch.
 */
export default function FinancePage() {
  return (
    <>
      <SectionEnter />
      <ServicePageEntry />

      <main
        className="service-page service-page--finance"
        id="main-content"
        data-service-page
      >
        <SiteHeader />

        <section
          className="service-hero"
          aria-labelledby="solution-title"
          data-service-hero
        >
          <Container className="service-hero__inner">
            <div className="service-hero__intro">
              <h1
                className="service-hero__title"
                id="solution-title"
                data-service-hero-title
              >
                {finance.titleLines.map((line) => (
                  <span className="service-hero__title-line" key={line}>
                    {line}
                  </span>
                ))}
              </h1>
            </div>

            {/* Where the service pages put a still mask, this puts the
                industries drawing, keyed to Finance. It was written for the
                homepage industries run, styled, and then never mounted
                anywhere. It belongs here: it is the one piece of artwork on the
                site that already knows what an industry is.

                It keeps data-service-hero-pattern so the entry clips it in from
                the right like every other hero artwork. The drawing runs its
                own film underneath that, which is untouched. */}
            <div
              className="service-hero__pattern service-hero__pattern--art"
              aria-hidden="true"
              data-service-hero-pattern
            >
              <IndustryArt industry="finance" />
            </div>

            <p className="service-hero__support" data-service-hero-support>
              {finance.support}
            </p>

            <a
              className="service-hero__cta"
              href={products.ctaHref}
              data-service-hero-cta
            >
              {finance.heroCta}
              <PixelArrow
                className="service-hero__cta-arrow"
                direction="up-right"
                size="small"
              />
            </a>
          </Container>

          {/* The same dissolve the service heroes leave on: a blur boundary
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

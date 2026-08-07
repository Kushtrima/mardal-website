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

        {/* The service pages' overview, reused whole. Its grid gives the copy
            three of its four tracks and the heading the fourth, which is why
            the content carries exactly three columns. */}
        <section
          className="service-overview"
          aria-labelledby="solution-overview-title"
          data-route-section
        >
          <Container
            className="service-overview__inner"
            data-enter
            data-enter-mode="fade"
          >
            <h2
              className="service-overview__title"
              id="solution-overview-title"
            >
              {finance.overview.title}
            </h2>

            <div className="service-overview__columns">
              {finance.overview.columns.map((column) => (
                <p className="service-overview__copy" key={column}>
                  {column}
                </p>
              ))}
            </div>
          </Container>
        </section>

        {/* The five services in this sector's terms, each pointing at its own
            page. This is the one part of an industry page that has somewhere
            to send you, so it is a list of links rather than a list of claims.

            Not the service pages' journey: that is a pinned horizontal run
            built for chapters of capability copy, and five lines do not need
            to be scrolled through sideways. */}
        <section
          className="solution-build"
          aria-labelledby="solution-build-title"
          data-route-section
        >
          <Container data-enter data-enter-mode="fade">
            <h2 className="solution-build__title" id="solution-build-title">
              {finance.build.title}
            </h2>

            <ul className="solution-build__list">
              {finance.build.items.map((item) => (
                <li key={item.id}>
                  <a className="solution-build__item" href={item.href}>
                    <h3 className="solution-build__name">{item.title}</h3>
                    <p className="solution-build__copy">{item.copy}</p>
                    <PixelArrow
                      className="solution-build__arrow"
                      direction="up-right"
                      size="small"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section
          className="service-cta"
          id="finance-cta"
          aria-labelledby="solution-cta-title"
          data-route-section
        >
          <Container>
            <div
              className="service-cta__inner"
              data-enter
              data-enter-mode="none"
            >
              <h2 className="service-cta__title" id="solution-cta-title">
                {finance.cta.title}
              </h2>

              <a className="service-cta__link" href={products.ctaHref}>
                {finance.cta.label}
                <PixelArrow
                  className="service-cta__arrow"
                  direction="up-right"
                  size="small"
                />
              </a>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

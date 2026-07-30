import type { Metadata } from "next";
import { Container } from "../../../components/layout/Container";
import { SiteFooter } from "../../../components/layout/SiteFooter";
import { SiteHeader } from "../../../components/layout/SiteHeader";
import { SectionEnter } from "../../../components/motion/SectionEnter";
import { AiAutomationHeroEntry } from "../../../components/services/AiAutomationHeroEntry";
import { AiAutomationOfferingsScroll } from "../../../components/services/AiAutomationOfferingsScroll";
import { aiAutomation } from "../../../content/ai-automation";
import { products } from "../../../content/home";

export const metadata: Metadata = {
  title: aiAutomation.title,
  description: aiAutomation.lede,
};

/**
 * The first of the service pages.
 *
 * An editorial service hero leads into a practical explanation of the work
 * and the two core service areas.
 */
export default function AiAutomationPage() {
  return (
    <>
      <SectionEnter />
      <AiAutomationHeroEntry />
      <AiAutomationOfferingsScroll />

      <main id="main-content">
        <SiteHeader />

        <section
          className="service-hero"
          aria-labelledby="service-title"
          data-service-hero
        >
          <Container className="service-hero__inner">
            <div className="service-hero__intro">
              <h1
                className="service-hero__title"
                id="service-title"
                data-service-hero-title
              >
                {aiAutomation.lede}
              </h1>
            </div>

            <div
              className="service-hero__pattern"
              aria-hidden="true"
              data-service-hero-pattern
            />

            <p className="service-hero__support" data-service-hero-support>
              {aiAutomation.support}
            </p>

            <a
              className="service-hero__cta"
              href={products.ctaHref}
              data-service-hero-cta
            >
              {aiAutomation.heroCta}
              <span className="service-hero__cta-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          </Container>
        </section>

        <section
          className="service-overview"
          aria-labelledby="service-overview-title"
          data-route-section
        >
          <Container className="service-overview__inner">
            <h2 className="service-overview__title" id="service-overview-title">
              {aiAutomation.overview.title}
            </h2>

            <div className="service-overview__columns">
              {aiAutomation.overview.columns.map((column) => (
                <p className="service-overview__copy" key={column}>
                  {column}
                </p>
              ))}
            </div>
          </Container>
        </section>

        <section
          className="service-offerings"
          aria-labelledby="service-offerings-title"
          data-service-offerings
        >
          <Container className="service-offerings__inner">
            <h2 className="visually-hidden" id="service-offerings-title">
              AI and automation services
            </h2>

            {aiAutomation.offerings.map((offering) => (
              <article
                className="service-offering"
                id={offering.id}
                key={offering.id}
                data-service-offering
              >
                <h3 className="service-offering__title">{offering.title}</h3>

                <p className="service-offering__copy">{offering.copy}</p>

                <div className="service-offering__rule" aria-hidden="true" />

                <ul className="service-offering__list">
                  {offering.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </Container>
        </section>

        <section
          className="service-cta"
          aria-labelledby="service-cta-title"
          data-route-section
        >
          <Container>
            <div className="service-cta__inner">
              <h2 className="service-cta__title" id="service-cta-title">
                {aiAutomation.cta.title}
              </h2>
              <p className="service-cta__copy">{aiAutomation.cta.copy}</p>

              <a className="service-cta__link" href={products.ctaHref}>
                {aiAutomation.cta.label}
                <svg
                  className="service-cta__arrow"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M3.5 12h16.5M13.5 5.5 20 12l-6.5 6.5" />
                </svg>
              </a>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

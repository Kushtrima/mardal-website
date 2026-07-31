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

      <main className="service-page" id="main-content">
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
                <span className="service-hero__title-line">
                  Turn repetitive work
                </span>
                <span className="service-hero__title-line">
                  into intelligent workflows.
                </span>
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
          <Container className="service-overview__inner" data-enter>
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
              AI &amp; Automation Services
            </h2>

            {aiAutomation.chapters.map((chapter, chapterIndex) => (
              <section
                className={`service-chapter service-chapter--${
                  chapterIndex === 0 ? "ai" : "automation"
                }`}
                key={chapter.id}
                aria-labelledby={`${chapter.id}-title`}
                data-service-chapter
              >
                <header className="service-chapter__header">
                  <h3 id={`${chapter.id}-title`}>{chapter.title}</h3>
                  {"description" in chapter && <p>{chapter.description}</p>}
                </header>

                <div className="service-chapter__rows">
                  {chapter.services.map((service) => (
                    <details
                      className="service-row"
                      id={service.id}
                      key={service.id}
                      data-service-row
                    >
                      <summary className="service-row__summary">
                        <span className="service-row__title">
                          {service.title}
                        </span>
                      </summary>

                      <div className="service-row__panel" data-service-row-panel>
                        <section className="service-row__detail-block">
                          <h4>Overview</h4>
                          <p>{service.copy}</p>
                        </section>

                        <section className="service-row__detail-block">
                          <h4>Key Uses</h4>
                          <ul>
                            {service.items.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </section>

                        <section className="service-row__detail-block">
                          <h4>In Practice</h4>
                          <p>{service.example}</p>
                        </section>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </Container>
        </section>

        <section
          className="service-cta"
          aria-labelledby="service-cta-title"
          data-route-section
        >
          <Container>
            <div className="service-cta__inner" data-enter>
              <h2 className="service-cta__title" id="service-cta-title">
                {aiAutomation.cta.title}
              </h2>

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

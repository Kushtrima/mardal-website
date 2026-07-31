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
  const serviceCards = aiAutomation.chapters.flatMap(
    (chapter, groupIndex) =>
      chapter.services.map((service, serviceIndex) => ({
        ...service,
        groupIndex,
        serviceIndex,
      })),
  );

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
          <div className="service-journey" data-service-viewport>
            <Container className="service-journey__layout">
              <h2 className="visually-hidden" id="service-offerings-title">
                AI &amp; Automation Services
              </h2>

              <nav
                className="service-journey__nav"
                aria-label="Service categories"
              >
                {aiAutomation.chapters.map((chapter, index) => (
                  <a
                    className={`service-journey__nav-link${
                      index === 0 ? " is-active" : ""
                    }`}
                    href={`#${chapter.services[0].id}`}
                    key={chapter.id}
                    data-service-group-link={index}
                    aria-current={index === 0 ? "true" : undefined}
                  >
                    {index === 0 ? "AI Solutions" : "Automation"}
                  </a>
                ))}
              </nav>

              <div className="service-journey__stage">
                <h3
                  className="service-journey__current-title"
                  data-service-current-title
                  aria-live="polite"
                >
                  {serviceCards[0].title}
                </h3>

                <div className="service-journey__window" data-service-stage>
                  <div className="service-journey__track" data-service-track>
                    {serviceCards.map((service) => (
                      <article
                        className="service-card"
                        id={service.id}
                        key={service.id}
                        data-service-card
                        data-service-group={service.groupIndex}
                        data-service-title={service.title}
                      >
                        <h4 className="service-card__mobile-title">
                          {service.title}
                        </h4>

                        <p className="service-card__copy">{service.copy}</p>

                        <div className="service-card__mobile-details">
                          <div>
                            <p className="service-detail__label">Key uses</p>
                            <ul className="service-detail__uses">
                              {service.items.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <p className="service-detail__label">
                              In practice
                            </p>
                            <p className="service-detail__example">
                              {service.example}
                            </p>
                          </div>
                        </div>

                        <span
                          className="service-card__number"
                          aria-hidden="true"
                        >
                          {String(service.serviceIndex + 1).padStart(2, "0")}
                        </span>
                      </article>
                    ))}
                  </div>
                </div>

                <div
                  className="service-journey__details"
                  data-service-details
                >
                  {serviceCards.map((service, index) => (
                    <div
                      className={`service-journey__detail${
                        index === 0 ? " is-active" : ""
                      }`}
                      key={service.id}
                      data-service-detail={service.id}
                      aria-hidden={index === 0 ? undefined : "true"}
                    >
                      <div>
                        <p className="service-detail__label">Key uses</p>
                        <ul className="service-detail__uses">
                          {service.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="service-detail__label">In practice</p>
                        <p className="service-detail__example">
                          {service.example}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <a
                className="service-journey__next"
                href={`#${aiAutomation.chapters[1].services[0].id}`}
                data-service-next-link
              >
                <span data-service-next-label>Automation</span>
                <span aria-hidden="true">→</span>
              </a>
            </Container>
          </div>
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

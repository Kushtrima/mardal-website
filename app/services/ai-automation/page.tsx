import type { Metadata } from "next";
import { Fragment } from "react";
import { Container } from "../../../components/layout/Container";
import { SiteFooter } from "../../../components/layout/SiteFooter";
import { SiteHeader } from "../../../components/layout/SiteHeader";
import { SectionEnter } from "../../../components/motion/SectionEnter";
import { ServicePageMotion } from "../../../components/services/ServicePageMotion";
import { PixelArrow, PixelX } from "../../../components/ui/PixelArrow";
import { aiAutomation } from "../../../content/ai-automation";
import { products } from "../../../content/home";

export const metadata: Metadata = {
  title: aiAutomation.title,
  description: aiAutomation.lede,
};

function ServiceWords({ className, text }: { className: string; text: string }) {
  const words = text.trim().split(/\s+/);

  return (
    <p className={className} aria-label={text}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span data-service-word>{word}</span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </p>
  );
}

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
        capabilities: `${service.items.join(". ")}.`,
      })),
  );

  return (
    <>
      <SectionEnter />
      <ServicePageMotion />

      <main
        className="service-page service-page--ai-automation"
        id="main-content"
        data-service-page
      >
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
              <PixelArrow
                className="service-hero__cta-arrow"
                direction="up-right"
                size="small"
              />
            </a>
          </Container>
        </section>

        <section
          className="service-overview"
          aria-labelledby="service-overview-title"
          data-route-section
        >
          <Container
            className="service-overview__inner"
            data-enter
            data-enter-mode="fade"
          >
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

                        <div className="service-card__body">
                          <ServiceWords
                            className="service-card__copy"
                            text={service.copy}
                          />

                          <ServiceWords
                            className="service-card__capabilities"
                            text={service.capabilities}
                          />

                          <ServiceWords
                            className="service-card__example"
                            text={service.example}
                          />
                        </div>

                        <span
                          className="service-card__number"
                          aria-hidden="true"
                          data-service-number
                        >
                          {String(service.serviceIndex + 1).padStart(2, "0")}
                        </span>
                      </article>
                    ))}
                  </div>
                </div>
              </div>

              <div className="service-journey__controls">
                <a
                  className="service-journey__skip"
                  href="#ai-capabilities"
                  data-scroll-direct
                  data-scroll-duration="1.5"
                  data-scroll-ease="sine.in"
                  data-scroll-preserve-view
                  data-service-skip
                >
                  <PixelX
                    className="service-journey__skip-icon"
                    size="small"
                  />
                  <span>Skip</span>
                </a>

                <a
                  className="service-journey__next"
                  href={`#${aiAutomation.chapters[1].services[0].id}`}
                  data-service-next-link
                >
                  <span data-service-next-label>Automation</span>
                  <PixelArrow
                    className="service-journey__next-arrow"
                    direction="up-right"
                    size="small"
                  />
                </a>
              </div>
            </Container>
          </div>
        </section>

        <section
          className="ai-capabilities"
          id="ai-capabilities"
          aria-labelledby="ai-capabilities-title"
          data-route-section
        >
          <Container
            className="ai-capabilities__inner"
            data-enter
            data-enter-mode="none"
          >
            <header className="ai-capabilities__header">
              <p className="ai-capabilities__eyebrow">
                {aiAutomation.advancedCapabilities.eyebrow}
              </p>
              <h2
                className="ai-capabilities__title"
                id="ai-capabilities-title"
              >
                {aiAutomation.advancedCapabilities.title}
              </h2>
              <p className="ai-capabilities__intro">
                {aiAutomation.advancedCapabilities.intro}
              </p>
            </header>

            <div className="ai-capabilities__stage">
              {aiAutomation.advancedCapabilities.items.map(
                (capability, index) => (
                  <article
                    className={`ai-capability-chapter ai-capability-chapter--${capability.id}`}
                    key={capability.id}
                  >
                    <div className="ai-capability-chapter__signal">
                      <span
                        className="ai-capability-chapter__index"
                        aria-hidden="true"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="ai-capability-chapter__category">
                        {capability.category}
                      </span>
                    </div>

                    <div className="ai-capability-chapter__content">
                      <h3 className="ai-capability-chapter__title">
                        {capability.title}
                      </h3>

                      <div className="ai-capability-chapter__details">
                        <p className="ai-capability-chapter__copy">
                          {capability.copy}
                        </p>

                        <ul className="ai-capability-chapter__points">
                          {capability.points.map((point) => (
                            <li
                              className="ai-capability-chapter__point"
                              key={point}
                            >
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </article>
                ),
              )}
            </div>
          </Container>
        </section>

        <section
          className="service-cta"
          id="ai-automation-cta"
          aria-labelledby="service-cta-title"
          data-route-section
        >
          <Container>
            <div
              className="service-cta__inner"
              data-enter
              data-enter-mode="none"
            >
              <h2 className="service-cta__title" id="service-cta-title">
                {aiAutomation.cta.title}
              </h2>

              <a className="service-cta__link" href={products.ctaHref}>
                {aiAutomation.cta.label}
                <PixelArrow
                  className="service-cta__arrow"
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

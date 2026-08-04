import type { Metadata } from "next";
import { Fragment } from "react";
import { Container } from "../../../components/layout/Container";
import { SiteFooter } from "../../../components/layout/SiteFooter";
import { SiteHeader } from "../../../components/layout/SiteHeader";
import { SectionEnter } from "../../../components/motion/SectionEnter";
import { ServicePageMotion } from "../../../components/services/ServicePageMotion";
import { PixelArrow, PixelX } from "../../../components/ui/PixelArrow";
import { crmSolutions } from "../../../content/crm-solutions";
import { products } from "../../../content/home";

export const metadata: Metadata = {
  title: crmSolutions.title,
  description: crmSolutions.description,
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

export default function CrmSolutionsPage() {
  const serviceCards = crmSolutions.chapters.flatMap(
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
        className="service-page service-page--crm-solutions"
        id="main-content"
        data-service-page
      >
        <SiteHeader />

        <section
          className="service-hero"
          aria-labelledby="crm-solutions-title"
          data-service-hero
        >
          <Container className="service-hero__inner">
            <div className="service-hero__intro">
              <h1
                className="service-hero__title"
                id="crm-solutions-title"
                data-service-hero-title
              >
                {crmSolutions.heroTitleLines.map((line) => (
                  <span className="service-hero__title-line" key={line}>
                    {line}
                  </span>
                ))}
              </h1>
            </div>

            <div
              className="service-hero__pattern service-hero__pattern--crm-solutions"
              aria-hidden="true"
              data-service-hero-pattern
            />

            <p className="service-hero__support" data-service-hero-support>
              {crmSolutions.support}
            </p>

            <a
              className="service-hero__cta"
              href={products.ctaHref}
              data-service-hero-cta
            >
              {crmSolutions.heroCta}
              <PixelArrow
                className="service-hero__cta-arrow"
                direction="up-right"
                size="small"
              />
            </a>
          </Container>
        </section>

        <section
          className="service-offerings"
          aria-labelledby="crm-solutions-services-title"
          data-service-offerings
        >
          <div className="service-journey" data-service-viewport>
            <Container className="service-journey__layout">
              <h2
                className="visually-hidden"
                id="crm-solutions-services-title"
              >
                CRM Solutions Services
              </h2>

              <nav
                className="service-journey__nav"
                aria-label="Service categories"
              >
                {crmSolutions.chapters.map((chapter, index) => (
                  <a
                    className={`service-journey__nav-link${
                      index === 0 ? " is-active" : ""
                    }`}
                    href={`#${chapter.services[0].id}`}
                    key={chapter.id}
                    data-service-group-link={index}
                    aria-current={index === 0 ? "true" : undefined}
                  >
                    {chapter.title}
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
                  href="#crm-solutions-cta"
                  data-scroll-direct
                  data-scroll-duration="2.4"
                  data-scroll-ease="sine.inOut"
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
                  href={`#${crmSolutions.chapters[1].services[0].id}`}
                  data-service-next-link
                >
                  <span data-service-next-label>
                    {crmSolutions.chapters[1].title}
                  </span>
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
          className="service-cta"
          id="crm-solutions-cta"
          aria-labelledby="crm-solutions-cta-title"
          data-route-section
        >
          <Container>
            <div className="service-cta__inner" data-enter>
              <h2
                className="service-cta__title"
                id="crm-solutions-cta-title"
              >
                {crmSolutions.cta.title}
              </h2>

              <a className="service-cta__link" href={products.ctaHref}>
                {crmSolutions.cta.label}
                <PixelArrow className="service-cta__arrow" size="small" />
              </a>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

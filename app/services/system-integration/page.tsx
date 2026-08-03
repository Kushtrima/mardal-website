import type { Metadata } from "next";
import { Container } from "../../../components/layout/Container";
import { SiteFooter } from "../../../components/layout/SiteFooter";
import { SiteHeader } from "../../../components/layout/SiteHeader";
import { SectionEnter } from "../../../components/motion/SectionEnter";
import { ServicePageMotion } from "../../../components/services/ServicePageMotion";
import { PixelArrow } from "../../../components/ui/PixelArrow";
import { systemIntegration } from "../../../content/system-integration";
import { products } from "../../../content/home";

export const metadata: Metadata = {
  title: systemIntegration.title,
  description: systemIntegration.description,
};

function ServiceWords({ className, text }: { className: string; text: string }) {
  const words = text.trim().split(/\s+/);

  return (
    <p className={className} aria-label={text}>
      {words.map((word, index) => (
        <span data-service-word key={`${word}-${index}`}>
          {word}
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}

export default function SystemIntegrationPage() {
  const serviceCards = systemIntegration.chapters.flatMap(
    (chapter, groupIndex) =>
      chapter.services.map((service, serviceIndex) => ({
        ...service,
        groupIndex,
        serviceIndex,
        copy:
          serviceIndex === 0
            ? `${chapter.description} ${service.copy}`
            : service.copy,
        capabilities: `${service.items.join(". ")}.`,
      })),
  );

  return (
    <>
      <SectionEnter />
      <ServicePageMotion />

      <main
        className="service-page service-page--system-integration"
        id="main-content"
        data-service-page
      >
        <SiteHeader />

        <section
          className="service-hero"
          aria-labelledby="system-integration-title"
          data-service-hero
        >
          <Container className="service-hero__inner">
            <div className="service-hero__intro">
              <h1
                className="service-hero__title"
                id="system-integration-title"
                data-service-hero-title
              >
                {systemIntegration.heroTitleLines.map((line) => (
                  <span className="service-hero__title-line" key={line}>
                    {line}
                  </span>
                ))}
              </h1>
            </div>

            <div
              className="service-hero__pattern service-hero__pattern--system-integration"
              aria-hidden="true"
              data-service-hero-pattern
            />

            <p className="service-hero__support" data-service-hero-support>
              {systemIntegration.support}
            </p>

            <a
              className="service-hero__cta"
              href={products.ctaHref}
              data-service-hero-cta
            >
              {systemIntegration.heroCta}
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
          aria-labelledby="system-integration-services-title"
          data-service-offerings
        >
          <div className="service-journey" data-service-viewport>
            <Container className="service-journey__layout">
              <h2
                className="visually-hidden"
                id="system-integration-services-title"
              >
                System Integration Services
              </h2>

              <nav
                className="service-journey__nav"
                aria-label="Service categories"
              >
                {systemIntegration.chapters.map((chapter, index) => (
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

              <a
                className="service-journey__next"
                href={`#${systemIntegration.chapters[1].services[0].id}`}
                data-service-next-link
              >
                <span data-service-next-label>
                  {systemIntegration.chapters[1].title}
                </span>
                <PixelArrow
                  className="service-journey__next-arrow"
                  direction="up-right"
                  size="small"
                />
              </a>
            </Container>
          </div>
        </section>

        <section
          className="service-cta"
          aria-labelledby="system-integration-cta-title"
          data-route-section
        >
          <Container>
            <div className="service-cta__inner" data-enter>
              <h2
                className="service-cta__title"
                id="system-integration-cta-title"
              >
                {systemIntegration.cta.title}
              </h2>

              <a className="service-cta__link" href={products.ctaHref}>
                {systemIntegration.cta.label}
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

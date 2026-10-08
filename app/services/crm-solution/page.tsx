import type { Metadata } from "next";
import { Fragment } from "react";
import { Container } from "../../../components/layout/Container";
import { SiteFooter } from "../../../components/layout/SiteFooter";
import { HeaderSpace } from "../../../components/layout/HeaderSpace";
import { SectionEnter } from "../../../components/motion/SectionEnter";
import { ServicePageMotion } from "../../../components/services/ServicePageMotion";
import { PatternDrift } from "../../../components/services/PatternDrift";
import { ServiceHeroBars } from "../../../components/services/ServiceHeroBars";
import { PixelArrow, PixelX } from "../../../components/ui/PixelArrow";
import { RollingLabel } from "../../../components/ui/RollingLabel";
import { crmSolution } from "../../../content/crm-solution";
import { products } from "../../../content/home";
import { crmSolutionPattern } from "../../../lib/crm-solution-pattern";
import { buildServiceCards } from "../../../lib/service-cards";
import { ServicesFooterRules } from "../../../components/services/ServicesFooterRules";

export const metadata: Metadata = {
  title: crmSolution.title,
  description: crmSolution.description,
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
  const serviceCards = buildServiceCards(crmSolution.chapters);

  return (
    <>
      <SectionEnter />
      <ServicePageMotion />
      <PatternDrift />

      <main
        className="service-page service-page--crm-solution"
        id="main-content"
        data-service-page
      >
        {/* The page's five lines, grey, from its top to its foot — owner,
            2026-10-08: "add the vertical lines to the rest of the pages". */}
        <ServicesFooterRules />
        <HeaderSpace />

        <section
          className="service-hero"
          aria-labelledby="crm-solution-title"
          data-service-hero
        >
          <Container className="service-hero__inner">
            <div className="service-hero__intro">
              <h1
                className="service-hero__title"
                id="crm-solution-title"
                data-service-hero-title
              >
                {crmSolution.heroTitleLines.map((line) => (
                  <span className="service-hero__title-line" key={line}>
                    {line}
                  </span>
                ))}
              </h1>
            </div>

            <div
              className="service-hero__pattern service-hero__pattern--crm-solution"
              aria-hidden="true"
              data-service-hero-pattern
            >
              <ServiceHeroBars
                className="service-hero__bars"
                pattern={crmSolutionPattern}
              />
            </div>

            <p className="service-hero__support" data-service-hero-support>
              {crmSolution.support}
            </p>

            <a
              className="service-hero__cta"
              data-roll
              href={products.ctaHref}
              data-service-hero-cta
            >
              <RollingLabel>{crmSolution.heroCta}</RollingLabel>
              <PixelArrow
                className="service-hero__cta-arrow"
                direction="up-right"
                size="small"
              />
            </a>
          </Container>

          {/* The hero dissolves as it is scrolled past, the same pair the
              homepage bar field uses: a blur boundary that travels up the
              block, and a gradient that takes what is left into the page.
              Outside the container so both run the full width of the page,
              the way the homepage field does. */}
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

        <section
          className="service-offerings"
          aria-labelledby="crm-solution-services-title"
          data-route-section
          data-enter-mode="fade"
          data-service-offerings
        >
          <div className="service-journey" data-service-viewport>
            <Container className="service-journey__layout">
              <h2
                className="visually-hidden"
                id="crm-solution-services-title"
              >
                CRM Solution Services
              </h2>

              <nav
                className="service-journey__nav"
                aria-label="Service categories"
              >
                {crmSolution.chapters.map((chapter, index) => (
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
                  href="#crm-solution-cta"
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
                  data-roll
                  href={`#${crmSolution.chapters[1].services[0].id}`}
                  data-service-next-link
                >
                  <span data-service-next-label>
                    <RollingLabel>{crmSolution.chapters[1].title}</RollingLabel>
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
          id="crm-solution-cta"
          aria-labelledby="crm-solution-cta-title"
          data-route-section
        >
          <Container>
            <div
              className="service-cta__inner"
              data-enter
              data-enter-mode="none"
            >
              <h2
                className="service-cta__title"
                id="crm-solution-cta-title"
              >
                {crmSolution.cta.title}
              </h2>

              <a className="service-cta__link" data-roll href={products.ctaHref}>
                <RollingLabel>{crmSolution.cta.label}</RollingLabel>
                <PixelArrow className="service-cta__arrow" direction="up-right" size="small" />
              </a>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter rules={<ServicesFooterRules />} />
    </>
  );
}

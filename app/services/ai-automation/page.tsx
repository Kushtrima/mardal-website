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
  const serviceFrames = aiAutomation.chapters.flatMap(
    (chapter, groupIndex) =>
      chapter.services.flatMap((service) => [
        {
          id: service.id,
          groupIndex,
          serviceTitle: service.title,
          frameIndex: 0,
          label: "Overview",
          kind: "overview" as const,
          copy: service.copy,
          items: service.items,
          example: service.example,
        },
        {
          id: `${service.id}-key-uses`,
          groupIndex,
          serviceTitle: service.title,
          frameIndex: 1,
          label: "Key uses",
          kind: "uses" as const,
          copy: service.copy,
          items: service.items,
          example: service.example,
        },
        {
          id: `${service.id}-in-practice`,
          groupIndex,
          serviceTitle: service.title,
          frameIndex: 2,
          label: "In practice",
          kind: "example" as const,
          copy: service.copy,
          items: service.items,
          example: service.example,
        },
      ]),
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
                  {serviceFrames[0].serviceTitle}
                </h3>

                <div className="service-journey__window" data-service-stage>
                  <div className="service-journey__track" data-service-track>
                    {serviceFrames.map((frame) => (
                      <article
                        className="service-card"
                        id={frame.id}
                        key={frame.id}
                        data-service-card
                        data-service-group={frame.groupIndex}
                        data-service-title={frame.serviceTitle}
                        data-service-frame={frame.frameIndex}
                        aria-label={`${frame.serviceTitle}: ${frame.label}`}
                      >
                        {frame.frameIndex === 0 && (
                          <h4 className="service-card__mobile-title">
                            {frame.serviceTitle}
                          </h4>
                        )}

                        <p className="service-card__label">{frame.label}</p>

                        {frame.kind === "overview" && (
                          <p className="service-card__copy">{frame.copy}</p>
                        )}

                        {frame.kind === "uses" && (
                          <ul className="service-card__uses">
                            {frame.items.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        )}

                        {frame.kind === "example" && (
                          <p className="service-card__example">
                            {frame.example}
                          </p>
                        )}

                        <span
                          className="service-card__number"
                          aria-hidden="true"
                        >
                          {String(frame.frameIndex + 1).padStart(2, "0")}
                        </span>
                      </article>
                    ))}
                  </div>
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

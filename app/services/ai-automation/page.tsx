import type { Metadata } from "next";
import { Container } from "../../../components/layout/Container";
import { SiteFooter } from "../../../components/layout/SiteFooter";
import { SiteHeader } from "../../../components/layout/SiteHeader";
import { SectionEnter } from "../../../components/motion/SectionEnter";
import { aiAutomation } from "../../../content/ai-automation";
import { products } from "../../../content/home";

export const metadata: Metadata = {
  title: aiAutomation.title,
  description: aiAutomation.lede,
};

/**
 * The first of the service pages.
 *
 * An editorial service hero leads with one proposition. Its fragmented field
 * is drawn from the supplied pattern reference, but sits directly on the
 * site's white canvas rather than inside a coloured banner.
 */
export default function AiAutomationPage() {
  return (
    <>
      <SectionEnter />

      <main id="main-content">
        <SiteHeader />

        <section className="service-hero" aria-labelledby="service-title">
          <Container className="service-hero__inner">
            <div className="service-hero__intro">
              <h1 className="service-hero__title" id="service-title">
                {aiAutomation.lede}
              </h1>
            </div>

            <div className="service-hero__pattern" aria-hidden="true" />

            <p className="service-hero__support">{aiAutomation.support}</p>

            <a className="service-hero__cta" href={products.ctaHref}>
              {aiAutomation.heroCta}
              <span className="service-hero__cta-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          </Container>
        </section>

        <section
          className="service-blocks"
          aria-labelledby="service-blocks-title"
          data-route-section
        >
          <Container>
            <h2 className="visually-hidden" id="service-blocks-title">
              What this covers
            </h2>

            <div className="service-blocks__grid">
              {aiAutomation.blocks.map((block) => (
                <article className="service-block" id={block.id} key={block.id}>
                  <p className="service-block__label">{block.label}</p>
                  <h3 className="service-block__title">{block.title}</h3>
                  <p className="service-block__copy">{block.copy}</p>
                </article>
              ))}
            </div>
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

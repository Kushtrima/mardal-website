import type { Metadata } from "next";
import { Container } from "../../../components/layout/Container";
import { ServiceBanner } from "../../../components/services/ServiceBanner";
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
 * It opens the way the homepage does — the words first, the field of bars
 * under them — so the two read as the same site rather than as a landing page
 * bolted on. The bars are the card language from the homepage, generated wide
 * enough to run the width of the window instead of traced to a box.
 */
export default function AiAutomationPage() {
  return (
    <>
      <SectionEnter />

      <main id="main-content">
        <SiteHeader />

        <section className="service-head" aria-labelledby="service-title">
          <Container>
            <p className="section-label">{aiAutomation.eyebrow}</p>
            <h1 className="service-head__title" id="service-title">
              {aiAutomation.title}
            </h1>
            <p className="service-head__lede">{aiAutomation.lede}</p>
          </Container>
        </section>

        <ServiceBanner tint="two" />

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

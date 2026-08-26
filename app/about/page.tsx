import type { Metadata } from "next";
import { Container } from "../../components/layout/Container";
import { SiteFooter } from "../../components/layout/SiteFooter";
import { HeaderSpace } from "../../components/layout/HeaderSpace";
import { SectionEnter } from "../../components/motion/SectionEnter";
import { ServicePageEntry } from "../../components/services/ServicePageEntry";
import { PixelArrow } from "../../components/ui/PixelArrow";
import { about } from "../../content/about";

export const metadata: Metadata = {
  title: about.title,
  description: about.description,
};

/**
 * About, and the third of the unwritten pages to be written.
 *
 * Built on the same bones as every other page here — `service-hero` and its
 * `data-service-hero-*` hooks are the site's editorial page opening rather than
 * anything to do with services — so it arrives and dissolves as Careers,
 * Clients and the five service pages do.
 *
 * `service-hero--bare` because there is no artwork, and the owner asked for the
 * sentence at the bottom LEFT — so the class is kept and only its axis is turned
 * over, in `.service-page--about`. It gathers the sentence and the way in into
 * one block, which is what Clients, Careers and the unwritten pages carry; the
 * block simply stands at the other end of the row.
 *
 * Reused rather than rebuilt because the phone half of that class is a fix for a
 * real collision, and going without it reproduced the collision exactly:
 * measured at 320 to 600, the sentence ran under the link, which is the same
 * overlap its own comment was written about. The base rule pins the support
 * bottom-left and the way in bottom-right, and a 113-character sentence does not
 * fit between them.
 */
export default function AboutPage() {
  return (
    <>
      <SectionEnter />
      <ServicePageEntry />

      <main
        className="service-page service-page--about"
        id="main-content"
        data-service-page
      >
        <HeaderSpace />

        <section
          className="service-hero service-hero--bare"
          aria-labelledby="about-title"
          data-service-hero
        >
          <Container className="service-hero__inner">
            <div className="service-hero__intro">
              <h1
                className="service-hero__title"
                id="about-title"
                data-service-hero-title
              >
                {/* The leading space matters and is invisible until it does.
                    The spans are rendered adjacent with nothing between them,
                    which is fine while they are blocks — and on a phone they
                    are set inline so the sentence can be balanced at a size the
                    authored break cannot reach, and without this it reads
                    `Mardal,a`. Inside the span rather than between them, so no
                    Fragment is needed, and it collapses to nothing when the
                    span is a block again. */}
                {about.titleLines.map((line, index) => (
                  <span className="service-hero__title-line" key={line}>
                    {index > 0 ? " " : null}
                    {line}
                  </span>
                ))}
              </h1>
            </div>

            <div className="service-hero__aside">
              <p className="service-hero__support" data-service-hero-support>
                {about.support}
              </p>

              <a
                className="service-hero__cta"
                href={about.ctaHref}
                data-service-hero-cta
              >
                {about.cta}
                <PixelArrow
                  className="service-hero__cta-arrow"
                  direction="up-right"
                  size="small"
                />
              </a>
            </div>
          </Container>

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

      </main>

      <SiteFooter />
    </>
  );
}

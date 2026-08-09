import type { Metadata } from "next";
import { Container } from "../../components/layout/Container";
import { SiteFooter } from "../../components/layout/SiteFooter";
import { SiteHeader } from "../../components/layout/SiteHeader";
import { BlogPattern } from "../../components/blog/BlogPattern";
import { SectionEnter } from "../../components/motion/SectionEnter";
import { ServicePageEntry } from "../../components/services/ServicePageEntry";
import { PixelArrow } from "../../components/ui/PixelArrow";
import { caseStudies } from "../../content/case-studies";
import { products } from "../../content/home";

export const metadata: Metadata = {
  title: caseStudies.title,
  description: caseStudies.lede,
};

/**
 * The Case Studies page, hero only.
 *
 * Built on the same bones as every other page here. `service-hero` and its
 * `data-service-hero-*` hooks are the site's editorial page opening rather than
 * anything to do with services, and ServicePageEntry drives them, so this
 * arrives and dissolves exactly as the service pages and the Blog do.
 *
 * ServicePageEntry alone rather than ServicePageMotion, which would also bring
 * ServiceOfferingsScroll. There is no journey here, and no body yet.
 *
 * Nothing links to this route yet. The header still opens Case Studies as a
 * panel holding one dead anchor; turning that into a plain link to this page is
 * the next step and a change to the menu rather than to this file.
 */
export default function CaseStudiesPage() {
  return (
    <>
      <SectionEnter />
      <ServicePageEntry />

      <main
        className="service-page service-page--case-studies"
        id="main-content"
        data-service-page
      >
        <SiteHeader />

        <section
          className="service-hero"
          aria-labelledby="case-studies-title"
          data-service-hero
        >
          <Container className="service-hero__inner">
            <div className="service-hero__intro">
              <h1
                className="service-hero__title"
                id="case-studies-title"
                data-service-hero-title
              >
                {caseStudies.titleLines.map((line) => (
                  <span className="service-hero__title-line" key={line}>
                    {line}
                  </span>
                ))}
              </h1>
            </div>

            {/* Drawn, not masked. The five service heroes each carry a PNG of
                the redaction language and the Blog carries the vector of it;
                this page takes the generated one, so there is no sixth image
                to cut and the drawing belongs to the route the way a piece's
                drawing belongs to its slug. Seeded "case-studies", so it is
                this page's permanently and no other page can land on it.

                BlogPattern is the site's drawing generator rather than anything
                to do with the blog — it is only shelved under components/blog
                because that is where it was first needed. Left where it is: a
                move is a refactor and this is not one. */}
            <div
              className="service-hero__pattern service-hero__pattern--drawn"
              aria-hidden="true"
              data-service-hero-pattern
            >
              <BlogPattern
                slug={caseStudies.slug}
                density="plate"
                className="service-hero__drawing"
              />
            </div>

            <p className="service-hero__support" data-service-hero-support>
              {caseStudies.support}
            </p>

            <a
              className="service-hero__cta"
              href={products.ctaHref}
              data-service-hero-cta
            >
              {caseStudies.heroCta}
              <PixelArrow
                className="service-hero__cta-arrow"
                direction="up-right"
                size="small"
              />
            </a>
          </Container>

          {/* The same dissolve the other heroes leave on: a blur boundary
              travelling up the block and a gradient taking what is left into
              the page. Outside the container so both run the full width. */}
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

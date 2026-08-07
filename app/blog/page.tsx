import type { Metadata } from "next";
import { Container } from "../../components/layout/Container";
import { SiteFooter } from "../../components/layout/SiteFooter";
import { SiteHeader } from "../../components/layout/SiteHeader";
import { RedactedLines } from "../../components/home/RedactedLines";
import { SectionEnter } from "../../components/motion/SectionEnter";
import { ServicePageEntry } from "../../components/services/ServicePageEntry";
import { PixelArrow } from "../../components/ui/PixelArrow";
import { blog } from "../../content/blog";
import { products } from "../../content/home";

export const metadata: Metadata = {
  title: blog.title,
  description: blog.lede,
};

/**
 * The Blog page, hero only.
 *
 * Built on the same bones as every other page here. `service-hero` and its
 * `data-service-hero-*` hooks are the site's editorial page opening rather than
 * anything to do with services, and ServicePageEntry drives them, so this
 * arrives and dissolves exactly as the service pages do.
 *
 * ServicePageEntry alone rather than ServicePageMotion, which would also bring
 * ServiceOfferingsScroll. There is no journey here, and no body at all yet.
 */
export default function BlogPage() {
  return (
    <>
      <SectionEnter />
      <ServicePageEntry />

      <main
        className="service-page service-page--blog"
        id="main-content"
        data-service-page
      >
        <SiteHeader />

        <section
          className="service-hero"
          aria-labelledby="blog-title"
          data-service-hero
        >
          <Container className="service-hero__inner">
            <div className="service-hero__intro">
              <h1
                className="service-hero__title"
                id="blog-title"
                data-service-hero-title
              >
                {blog.titleLines.map((line) => (
                  <span className="service-hero__title-line" key={line}>
                    {line}
                  </span>
                ))}
              </h1>
            </div>

            {/* The redaction bars, which are already this site's hero language:
                every service mask is the same idea drawn as a PNG, and the
                comments on those call it that. Here the drawing itself is used
                rather than a picture of one, because it is the one piece of
                artwork on the site that is literally a page of writing, which
                is what this page is for.

                It keeps data-service-hero-pattern so the entry clips it in from
                the right like every other hero artwork. */}
            <div
              className="service-hero__pattern service-hero__pattern--lines"
              aria-hidden="true"
              data-service-hero-pattern
            >
              <RedactedLines className="service-hero__lines" />
            </div>

            <p className="service-hero__support" data-service-hero-support>
              {blog.support}
            </p>

            <a
              className="service-hero__cta"
              href={products.ctaHref}
              data-service-hero-cta
            >
              {blog.heroCta}
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

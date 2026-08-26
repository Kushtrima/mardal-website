import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Container } from "../../components/layout/Container";
import { SiteFooter } from "../../components/layout/SiteFooter";
import { HeaderSpace } from "../../components/layout/HeaderSpace";
import { SectionEnter } from "../../components/motion/SectionEnter";
import { MediaReveal } from "../../components/motion/MediaReveal";
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
      <MediaReveal />

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

        {/* **No heading, and it is a `data-route-section` all the same.** That
            attribute is what hands a block the site's entrance, and SectionEnter
            reads `trigger: inner ?? heading ?? section` — a section without one
            triggers on itself. Giving it a heading would mean writing a line of
            copy nobody asked for so that a motion hook could find something.

            **Back inside the `Container`.** It was full-bleed for a version —
            owner asked for full width and then for not-full-width — so the plate
            takes the page's own column and stands on the same left and right
            edges as the heading and the sentence above it. */}
        <section className="about-plate" data-route-section>
          <Container>
            {/* **Five copies of one picture, each clipped to a fifth of the
                frame.** The slices arrive staggered and land flush, which is the
                entrance the owner picked from four.

                Copies rather than one image with five masks, because each slice
                has to move on its own — and copies rather than five background
                images, because a background cannot carry `srcset` and the
                responsive ladder is the reason a phone gets 107KB instead of
                947. Every copy is the same URL, so it is one request and one
                decode; only the first carries the alt, since it is one
                photograph however many boxes it is drawn in. */}
            {/* **The plate opts OUT of the section entrance**, which every
                `data-route-section` gets for free and which this one must not
                have. `SectionEnter` gives a section a y-lag of 96 to 160px and a
                fade from 0.62; the slices bring their own displacement and their
                own fade. Together that is two vertical motions on two different
                scroll windows, and two opacities that MULTIPLY — the photograph
                started at 0.217 and arrived through a ghost, a shear and a snap.

                `data-enter` nominates this block and `data-enter-mode="none"`
                turns the section's entrance off, which is the opt-out the CTA
                sections already use. One motion instead of three. */}
            <figure
              className="about-plate__frame"
              data-media-reveal
              data-enter
              data-enter-mode="none"
              style={{ "--slices": about.photo.slices } as CSSProperties}
            >
              {Array.from({ length: about.photo.slices }, (_, slice) => (
                <div
                  className="about-plate__slice"
                  key={slice}
                  data-plate-slice
                  style={{ "--slice": slice } as CSSProperties}
                >
                  <img
                    className="about-plate__image"
                    src={about.photo.src}
                    srcSet={about.photo.widths
                      .map((width) => `/about-office-${width}.webp ${width}w`)
                      .join(", ")}
                    /* The plate is the page's COLUMN, not the page, so the
                       gutters come off before a rung is chosen. Written out
                       rather than as `var(--page-gutter)`: `sizes` is parsed
                       before the cascade exists and custom properties are not
                       available to it, so a `var()` here is not a smaller
                       number, it is an invalid value and the whole attribute is
                       dropped. The gutter is `clamp(1rem, 4vw, 2.5rem)`. */
                    sizes="calc(100vw - 2 * clamp(1rem, 4vw, 2.5rem))"
                    alt={slice === 0 ? about.photo.alt : ""}
                    aria-hidden={slice === 0 ? undefined : true}
                    width={about.photo.width}
                    height={about.photo.height}
                    /* Lazy is safe BECAUSE the frame reserves its own height
                       through `aspect-ratio`: nothing below it moves when the
                       picture arrives, so no scroll trigger is measured against
                       a page that is about to grow. */
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </figure>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

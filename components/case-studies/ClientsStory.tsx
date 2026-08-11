import Link from "next/link";
import { Container } from "../layout/Container";
import { SiteFooter } from "../layout/SiteFooter";
import { SiteHeader } from "../layout/SiteHeader";
import { SectionEnter } from "../motion/SectionEnter";
import { ServicePageEntry } from "../services/ServicePageEntry";
import { PixelArrow } from "../ui/PixelArrow";
import { pilotStory } from "../../content/case-studies";
import { industries, products } from "../../content/home";

/**
 * One customer's story — the page a card on the index opens.
 *
 * A pilot, and the only one: seven more cards go nowhere on purpose, because
 * nowhere is where they should go until someone has written them. What is being
 * judged here is the shape, not the words.
 *
 * Built on the same bones as the index it came from. The opening is the site's
 * editorial hero with the same `data-service-hero-*` hooks, so it arrives and
 * dissolves the way every other page here does, and it carries no artwork for
 * the same reason the index no longer does — the picture on this page is the
 * work itself.
 *
 * A server component throughout. There is no state on this page: it is a page
 * of writing about one job.
 */
export function ClientsStory() {
  const sector = industries.find(
    (industry) => industry.id === pilotStory.sector,
  );

  return (
    <>
      <SectionEnter />
      <ServicePageEntry />

      <main
        className="service-page service-page--story"
        id="main-content"
        data-service-page
      >
        <SiteHeader />

        <section
          className="service-hero story-hero"
          aria-labelledby="story-title"
          data-service-hero
        >
          <Container className="service-hero__inner story-hero__inner">
            <div className="service-hero__intro story-hero__intro">
              {/* Where you are, and the way back up, in one line. The sector is
                  a link rather than a label because it is the view of the index
                  this story sits in — leaving a story should put you back among
                  the ones like it, not at the top of everything. */}
              <p className="story-hero__trail">
                <Link className="story-hero__back" href="/case-studies">
                  {pilotStory.backLabel}
                </Link>
                <span aria-hidden="true">·</span>
                <Link
                  className="story-hero__back"
                  href={`/case-studies/${pilotStory.sector}`}
                >
                  {sector?.title}
                </Link>
              </p>

              <h1
                className="service-hero__title story-hero__title"
                id="story-title"
                data-service-hero-title
              >
                {pilotStory.titleLines.map((line) => (
                  <span className="service-hero__title-line" key={line}>
                    {line}
                  </span>
                ))}
              </h1>
            </div>

            <div className="service-hero__aside story-hero__aside">
              <p className="service-hero__support" data-service-hero-support>
                {pilotStory.lede}
              </p>

              <a
                className="service-hero__cta"
                href={products.ctaHref}
                data-service-hero-cta
              >
                {pilotStory.cta}
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

        <section className="story" data-route-section>
          <Container data-enter data-enter-mode="fade">
            {/* The cover, full width of the column. It is the first thing a
                story has that an index card cannot show: the work at a size you
                can read it at. */}
            <div className="story__cover">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="story__cover-art"
                src={pilotStory.cover}
                alt=""
                width="1600"
                height="900"
              />
            </div>

            <div className="story__body">
              {/* The facts, down the left, held against the reading. They are
                  what a reader scans before deciding to read — who, what
                  sector, what job, when it left — and they belong beside the
                  writing rather than buried in it. */}
              <dl className="story__facts">
                {pilotStory.facts.map((fact) => (
                  <div className="story__fact" key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>

              {/* The three questions the index has been promising since the
                  hero was written. On a card they are one line each; this is
                  where they are actually answered. */}
              <div className="story__sections">
                {pilotStory.sections.map((section) => (
                  <section className="story__section" key={section.id}>
                    <h2 className="story__heading">{section.heading}</h2>
                    <p className="story__copy">{section.body}</p>
                  </section>
                ))}
              </div>
            </div>

            {/* Two more of the work. A story earns more than one picture — it
                is the only page on this site where the pictures are the
                argument rather than the texture. */}
            <ul className="story__gallery">
              {pilotStory.gallery.map((image) => (
                <li key={image}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="story__shot"
                    src={image}
                    alt=""
                    width="1200"
                    height="900"
                    loading="lazy"
                    decoding="async"
                  />
                </li>
              ))}
            </ul>

            {/* Out the way you came in. A story that ends with nothing under it
                ends the visit — the Blog closes the same way. */}
            <p className="story__out">
              <Link className="story__out-link" href="/case-studies">
                {pilotStory.backLabel}
                <PixelArrow
                  className="story__out-arrow"
                  direction="up-right"
                  size="small"
                />
              </Link>
            </p>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

import Link from "next/link";
import { StoryHeroShade } from "./StoryHeroShade";
import { StorySteps } from "./StorySteps";
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
 * Two columns, owner's shape: the record down the left, the reading down the
 * right. The rail is held against the scroll rather than travelling with it,
 * which is the whole point of putting it there — a reader three paragraphs into
 * what the system replaced can still see who it was for.
 *
 * Four bodies were built under this hero before this one and each was rejected:
 * a cover with a text block and a gallery, an image essay of alternating
 * plates, a staged sequence down a ruled spine, and then nothing at all. They
 * are in the history if any is ever wanted back.
 *
 * A pilot, and the only one: seven more cards go nowhere on purpose, because
 * nowhere is where they should go until someone has written them.
 *
 * Built on the same bones as the index it came from. `service-hero` and its
 * `data-service-hero-*` hooks are the site's editorial page opening, and
 * ServicePageEntry drives them, so this arrives and dissolves the way every
 * other page here does. No artwork, for the same reason the index has none.
 *
 * A server component throughout. There is no state on this page.
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

          {/* The right half of the opening, running the full height of the
              window rather than starting under the bar: the header is a sibling
              above this section, so this is pulled up by exactly the height
              that sibling occupies and the menu ends up standing on the
              picture.

              Outside the Container, the way the blur and the fade are, so it
              reaches the window's edge instead of stopping at a gutter. Behind
              everything — the intro and the aside both carry z-index 1 and this
              carries none — so the heading, the lede and the way in keep their
              places over it. */}
          <div className="story-hero__art" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="story-hero__art-image"
              src={pilotStory.heroImage}
              alt=""
              width="1200"
              height="1600"
            />

            {/* Nothing at rest. StoryHeroShade brings this up the foot of the
                picture as the page is scrolled — the one moment cover is
                actually needed, which is where the image meets the page below
                it rather than where a reader first looks at it. */}
            <span className="story-hero__shade" />
          </div>

          <StoryHeroShade />

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

        {/* The record across the page, under the opening, and the reading
            below it. It was a rail down the left held against the scroll —
            owner's change. A row states the job once, at the top, the way a
            record should be read: at a glance, before the account rather than
            beside it.

            No pin here any more. The rail was held because a reader three
            paragraphs down could otherwise no longer see who it was for; a row
            that is read and passed has nothing to hold. ClientsPin stays where
            it was written and the sector index still uses it. */}
        <section className="story" data-route-section>
          <Container data-enter data-enter-mode="fade">
            <dl className="story-record">
              {pilotStory.facts.map((fact) => (
                <div className="story-record__fact" key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>

            {/* Three short paragraphs about the client company, in one row
                above the plate. No headings — three labels over three
                thirty-word paragraphs is more label than paragraph, and the row
                is one statement in three parts rather than three sections.

                Every one is a slot, and has to be: the office cannot be named
                until sign-off exists, and nothing about it is written down
                anywhere this repo can reach. */}
            <div className="story-about">
              {pilotStory.about.map((paragraph) => (
                <p className="story-about__copy" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* The plate. Big, but stopped at the container the record is ruled
                to rather than run to the window's edges — the record above it
                and the reading below both stop there, and a picture that breaks
                that line makes the two of them look inset rather than making
                itself look large.

                Square corners. Everything else on this site that carries a
                radius is a card or a panel — a thing with edges of its own. A
                plate is a window onto the work, and a rounded window is a card
                with a photograph in it. */}
            <figure className="story-plate">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="story-plate__art"
                src={pilotStory.plate}
                alt=""
                width="2000"
                height="1125"
                loading="lazy"
                decoding="async"
              />
            </figure>

            {/* The three states as a numbered index that un-stacks on the way
                down: the whole list waits piled at the foot of the window and
                empties into a pile at the top, one entry per reading, with the
                picture beside it. The owner sent ref.digital/work/sopfeu for
                this and that section was read before this was rebuilt — nothing
                in it opens, which turns out to be the point of it. The finding
                is written up in StorySteps.tsx.

                Better for these three than the accordion it replaced: the order
                is the argument here, and a list that is whole from the first
                moment states the order before it states anything else. */}
            <StorySteps />

            <div className="story-reading">
              <p className="story-out">
                <Link className="story-out__link" href="/case-studies">
                  {pilotStory.backLabel}
                  <PixelArrow
                    className="story-out__arrow"
                    direction="up-right"
                    size="small"
                  />
                </Link>
              </p>
            </div>
          </Container>
        </section>

      </main>

      <SiteFooter />
    </>
  );
}

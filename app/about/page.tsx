import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Fragment } from "react";
import { Container } from "../../components/layout/Container";
import { SiteFooter } from "../../components/layout/SiteFooter";
import { HeaderSpace } from "../../components/layout/HeaderSpace";
import { SectionEnter } from "../../components/motion/SectionEnter";
import { MediaCluster } from "../../components/motion/MediaCluster";
import { AboutJourney } from "../../components/motion/AboutJourney";
import { ProseReveal } from "../../components/motion/ProseReveal";
import { SectionWash } from "../../components/motion/SectionWash";
import { MediaReveal } from "../../components/motion/MediaReveal";
import { ServicePageEntry } from "../../components/services/ServicePageEntry";
import { PixelArrow } from "../../components/ui/PixelArrow";
import { about } from "../../content/about";

/**
 * Which edge each photograph opens from, which is a composition decision rather
 * than a motion one — so it sits with the arrangement and `MediaCluster` reads
 * it off the markup.
 *
 * They alternate across the block: the tall one on the left opens from its left,
 * the small one in the middle from its right, the wide one on the right from its
 * left again. Alternating is what makes three of them a set rather than three
 * things doing the same thing at different times.
 */
const ROOM_OPENS_FROM: Record<string, "left" | "right"> = {
  glass: "left",
  timber: "right",
  window: "left",
};

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
/** A heading beside its prose. Two sections on this page are this shape. */
function ProseSection({
  id,
  title,
  paragraphs,
  washEnd = false,
}: {
  id: string;
  title: string;
  paragraphs: readonly string[];
  /** Marks where the page's colour drains back. See `SectionWash`. */
  washEnd?: boolean;
}) {
  return (
    <section
      className="about-prose"
      aria-labelledby={id}
      data-route-section
      data-wash-end={washEnd ? "" : undefined}
    >
      <Container className="about-prose__inner">
        <h2 className="about-prose__title" id={id}>
          {title}
        </h2>

        <div className="about-prose__copy">
          {paragraphs.map((paragraph) => (
            /* **`aria-label` carries the whole sentence.** The words are split
               into spans so they can arrive in groups, and a screen reader
               meeting a paragraph of separate spans reads it as fragments. The
               service pages solve it the same way — see `ServiceWords`. */
            <p
              className="about-prose__paragraph"
              key={paragraph.slice(0, 24)}
              aria-label={paragraph}
              data-prose-line
            >
              {paragraph.split(/\s+/).map((word, index, all) => (
                <Fragment key={`${word}-${index}`}>
                  <span data-prose-word>{word}</span>
                  {index < all.length - 1 ? " " : null}
                </Fragment>
              ))}
            </p>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <SectionEnter />
      <ServicePageEntry />
      <MediaReveal />
      <MediaCluster />
      <SectionWash />
      <ProseReveal />
      <AboutJourney />

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
        {/* **No heading, and it is a `data-route-section` all the same.** That
            attribute is how SectionEnter finds a block, and this one declines
            what it finds — see the figure. Giving the section a heading would
            mean writing a line of copy nobody asked for so that a motion hook
            could find something.

            Inside the `Container`: the plate stands on the same left and right
            edges as the heading and the sentence above it. */}
        <section className="about-plate" data-route-section>
          <Container>
            {/* **The page holds while the picture resolves.** `MediaReveal` pins
                this frame for most of a screen of scroll and opens it over that
                hold, so the reader stops at the photograph rather than passing
                it. The owner's pick from the three entrances left after the
                slices; the four before it are recorded there.

                One picture again. The slices were five copies of it, each
                clipped to a fifth, and they went with the effect they existed
                for — along with the `min-width` that kept the minifier from
                breaking them.

                **It opts OUT of the section entrance.** A block that animates
                something of its own must not also be animating itself: two
                y-motions on two scroll windows, and two opacities multiplying to
                0.217, is what broke the entrance before this one. */}
            <figure
              className="about-plate__frame"
              data-media-reveal
              data-wash="about"
              data-enter
              data-enter-mode="none"
            >
              <img
                className="about-plate__image"
                src={about.photo.src}
                srcSet={about.photo.widths
                  .map((width) => `/about-office-${width}.webp ${width}w`)
                  .join(", ")}
                /* The plate is the page's COLUMN, not the page, so the gutters
                   come off before a rung is chosen. Written out rather than as
                   `var(--page-gutter)`: `sizes` is parsed before the cascade
                   exists and custom properties are not available to it, so a
                   `var()` here is not a smaller number, it is an invalid value
                   and the whole attribute is dropped. */
                sizes="calc(100vw - 2 * clamp(1rem, 4vw, 2.5rem))"
                alt={about.photo.alt}
                width={about.photo.width}
                height={about.photo.height}
                /* Lazy is safe BECAUSE the frame reserves its own height through
                   `aspect-ratio`: nothing below it moves when the picture
                   arrives, so no scroll trigger is measured against a page that
                   is about to grow. */
                loading="lazy"
                decoding="async"
              />
            </figure>
          </Container>
        </section>

        {/* Two prose sections wear the same shape, so it is written once and
            called twice. Both take the site's scroll entrance: they are prose
            with nothing of their own moving, which is what `SectionEnter` was
            written for. The plate and the rooms decline it because they animate
            themselves. */}
        <ProseSection
          id="about-prose-title"
          title={about.story.title}
          paragraphs={about.story.paragraphs}
        />

        <section
          className="about-rooms"
          aria-labelledby="about-rooms-title"
          data-route-section
        >
          {/* Named for a screen reader, which needs the group to be something
              rather than three loose images. "Inside the studio" was the first
              try and is the same claim the alts are written to avoid — it says
              these rooms are Mardal's, which nothing I have been told does. */}
          <h2 className="visually-hidden" id="about-rooms-title">
            Workspaces
          </h2>

          <Container
            className="about-rooms__inner"
            data-media-cluster
            data-enter
            data-enter-mode="none"
          >
            {about.rooms.map((room) => (
              <figure
                className={`about-rooms__frame about-rooms__frame--${room.name}`}
                key={room.name}
                data-cluster-from={ROOM_OPENS_FROM[room.name]}
                style={
                  {
                    "--room-ratio": `${room.width} / ${room.height}`,
                  } as CSSProperties
                }
              >
                <img
                  className="about-rooms__image"
                  src={`/${room.file}-${room.widths[1]}.webp`}
                  srcSet={room.widths
                    .map((width) => `/${room.file}-${width}.webp ${width}w`)
                    .join(", ")}
                  sizes={room.sizes}
                  alt={room.alt}
                  width={room.width}
                  height={room.height}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            ))}
          </Container>
        </section>

        {/* **The colour runs to the end of this, not to the end of the
            photographs.** Owner: leave the yellow longer, for this text too. The
            wash spans from the big picture opening to whatever carries
            `data-wash-end`, so extending it is moving that marker rather than
            retuning anything. */}
        {/* **The two notes are one block that replaces itself.** Owner, pointing
            at a service page: that movement, with the heading staying where it
            is and changing rather than travelling with its copy. So the heading
            sits outside the stage — which is also what lets it be announced.

            It carries `data-wash-end`: the page's colour changes over this
            block, and the pin makes it the longest thing on the page. */}
        <section
          className="about-journey"
          aria-labelledby="about-journey-title"
          data-route-section
          data-enter
          data-enter-mode="none"
          data-wash-end
        >
          <div className="about-journey__viewport" data-journey>
            <Container className="about-journey__layout">
              {/* Swapped by `AboutJourney` as the note behind it changes.
                  `aria-live` because the text under it changes without the page
                  navigating, and a reader who cannot see the swap gets nothing
                  otherwise. */}
              <h2
                className="about-journey__title"
                id="about-journey-title"
                data-journey-title
                aria-live="polite"
              >
                {about.notes[0].title}
              </h2>

              <div className="about-journey__stage" data-journey-stage>
                {about.notes.map((note) => (
                  <article
                    className="about-journey__card"
                    key={note.title}
                    data-journey-card
                    data-journey-heading={note.title}
                  >
                    {note.paragraphs.map((paragraph) => (
                      /* `aria-label` carries the unsplit sentence; the spans are
                         only there so the words can leave in groups. */
                      <p
                        className="about-journey__paragraph"
                        key={paragraph.slice(0, 24)}
                        aria-label={paragraph}
                      >
                        {paragraph.split(/\s+/).map((word, index, all) => (
                          <Fragment key={`${word}-${index}`}>
                            <span data-journey-word>{word}</span>
                            {index < all.length - 1 ? " " : null}
                          </Fragment>
                        ))}
                      </p>
                    ))}
                  </article>
                ))}
              </div>
            </Container>
          </div>
        </section>

        {/* **The last thing on the page, and the owner asked for it as a
            title.** So it wears the display face at a heading's size, centred,
            and it is a `<p>` — 211 characters announced as a landmark is not a
            heading, whatever it is set in. See `about.closing`.

            No `aria-labelledby`, and that is not an omission: the section has
            nothing to name it but the sentence itself, and SectionEnter reads
            `inner ?? heading ?? section`, so a section without one triggers on
            its own box. The plate above does the same.

            It sits on the page's third ground. The wash finishes at the journey
            above — `data-wash-end` — and a scrubbed tween holds its end state
            past its trigger, so everything below carries `--wash-about-end`
            rather than draining back to white. */}
        <section
          className="about-statement"
          data-route-section
          data-wash-close
        >
          <Container>
            <p className="about-statement__line">{about.closing}</p>
          </Container>
        </section>

        {/* **The client list, in the arrangement the owner pointed at**: the
            label on the left, the names in two columns on the right. That is
            also this page's own shape — the history and the notes both put a
            heading on columns 1-4 and their content on 6-12 — so the reference
            supplies the arrangement and the page supplies the type.

            A real `<ul>`. Seven names in two columns is a list whatever it is
            drawn as, and a screen reader that announces "list, 7 items" is
            telling the reader something the columns tell everyone else.

            The names themselves are the delivered archive, not the invented
            eight on the Clients page — see `about.clients` for which is which
            and for the one thing the owner should decide knowingly. */}
        <section
          className="about-clients"
          aria-labelledby="about-clients-title"
          data-route-section
        >
          <Container className="about-clients__inner">
            <h2 className="about-clients__title" id="about-clients-title">
              {about.clients.title}
            </h2>

            <ul className="about-clients__list">
              {about.clients.names.map((name) => (
                <li className="about-clients__name" key={name}>
                  {name}
                </li>
              ))}
            </ul>
          </Container>
        </section>

      </main>

      <SiteFooter />
    </>
  );
}

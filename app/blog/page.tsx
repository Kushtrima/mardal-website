import type { Metadata } from "next";
import { Container } from "../../components/layout/Container";
import { SiteFooter } from "../../components/layout/SiteFooter";
import { HeaderSpace } from "../../components/layout/HeaderSpace";
import { RedactedLines } from "../../components/home/RedactedLines";
import { SectionEnter } from "../../components/motion/SectionEnter";
import { ServicePageEntry } from "../../components/services/ServicePageEntry";
import { PixelArrow } from "../../components/ui/PixelArrow";
import { RollingLabel } from "../../components/ui/RollingLabel";
import { blog, formatDate, readingMinutes } from "../../content/blog";
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
 *
 * **No artwork, 2026-08-27 — owner, pointing at Careers.** The redaction bars
 * came out of the hero and the foot gathered into one block at the right, which
 * is `service-hero--bare` and nothing else: one class on the section carries the
 * foot, the measure and the phone layout. Careers, Clients and the eleven
 * unwritten pages already open this way; this is the fourth.
 *
 * The bars themselves have not left the page — the empty state below still
 * draws them, and there they are standing in for writing that genuinely is not
 * there yet rather than decorating a hero.
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
        <HeaderSpace />

        <section
          className="service-hero service-hero--bare"
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
                {/* The leading space matters and is invisible until it does,
                    and Careers already shipped the bug it prevents. The spans
                    are rendered adjacent with nothing between them, which is
                    fine while they are blocks — and below 48rem they are set
                    inline so the browser can balance the sentence at a size the
                    authored break cannot reach on a 288px column. Without this
                    that reads `thingswe’re`.

                    A real space rather than a `::after`: pseudo-element content
                    is not in `textContent`, so nothing reading the page could
                    tell the words had been joined. It collapses to nothing when
                    the spans are blocks again. */}
                {blog.titleLines.map((line, index) => (
                  <span className="service-hero__title-line" key={line}>
                    {index > 0 ? " " : null}
                    {line}
                  </span>
                ))}
              </h1>
            </div>

            {/* The sentence and the way in, as one block on the right edge.

                They were the two ends of the hero's bottom row, which only
                reads as an arrangement while there is a drawing between them
                holding the middle. With the bars gone they were two things at
                opposite edges of an empty row — the same thing Clients found
                when its plate came out, and Careers and the unwritten pages
                after it. The wrapper is what `service-hero--bare` places; it is
                not decoration and must not be flattened away. */}
            <div className="service-hero__aside">
              <p className="service-hero__support" data-service-hero-support>
                {blog.support}
              </p>

              <a
                className="service-hero__cta"
                data-roll
                href={products.ctaHref}
                data-service-hero-cta
              >
                <RollingLabel>{blog.heroCta}</RollingLabel>
                <PixelArrow
                  className="service-hero__cta-arrow"
                  direction="up-right"
                  size="small"
                />
              </a>
            </div>
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

        {/* An index of writing needs something to look at, and the first
            version of this had nothing: three ruled rows of text on a black
            field, which reads as a directory listing rather than as a
            publication. Every piece carries a mark now, and the newest is given
            the width to lead with.

            The marks are drawn, not photographed. This site has no pictures and
            will not use stock, so the picture comes from the language it
            already speaks: a page of writing with the words blacked out, set
            fresh for each piece from its own slug. */}
        <section
          className="blog-index"
          aria-labelledby="blog-index-title"
          data-route-section
        >
          <Container data-enter data-enter-mode="fade">
            <h2 className="visually-hidden" id="blog-index-title">
              Writing
            </h2>

            {blog.posts.length === 0 ? (
              /* Today's real state, so it is a screen rather than an absence.
                 The bars are the whole reason they are on this page: everywhere
                 else on this site they are decoration standing in for writing,
                 and here they are standing in for writing that is genuinely not
                 there yet. When the first piece lands they go, and the words
                 take their place. */
              <div className="blog-empty">
                <div className="blog-empty__lines" aria-hidden="true">
                  <RedactedLines className="blog-empty__bars" />
                </div>

                <p className="blog-empty__title">{blog.empty.title}</p>
                <p className="blog-empty__copy">{blog.empty.copy}</p>
              </div>
            ) : (
              /* One card a piece, read top to bottom: when it was published,
                 what it argues, and how long it takes. The thesis is carried
                 whole rather than truncated — it is the sentence the reader is
                 choosing on, and half of it is worse than none. */
              <ul className="blog-grid">
                {blog.posts.map((post) => (
                  <li key={post.slug}>
                    <a className="blog-card" href={`/blog/${post.slug}`}>
                      {/* No mark under the headline any more. A piece's drawing
                          is drawn at plate size when the piece is opened; on the
                          index it was a second, smaller copy of the same thing
                          sitting under every title.

                          What it stood in stays. The card holds a min-height and
                          the foot is dropped to the bottom by `margin-top:
                          auto`, so the title keeps the top, the foot keeps the
                          bottom, and the space between them is the space it
                          was — 81px at a 1358 window, mark or no mark. */}
                      <h3 className="blog-card__title">{post.title}</h3>

                      <span className="blog-card__foot">
                        <span className="blog-card__thesis">{post.thesis}</span>

                        {/* When it was written and how long it takes, and no
                            byline. Every piece here is by the same person, so a
                            name on each card is the one fact on it a reader
                            cannot act on — three cards saying it three times,
                            in the place the date and the length had to share.
                            It is a byline on the piece itself, where it is
                            saying something.

                            The day there is a second writer it belongs in THIS
                            line, ahead of the date, rather than back on a row of
                            its own. */}
                        <span className="blog-card__stamp">
                          <time dateTime={post.date}>
                            {formatDate(post.date)}
                          </time>
                          <span aria-hidden="true">·</span>
                          <span>{readingMinutes(post)} min read</span>
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

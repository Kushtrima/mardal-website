import type { Metadata } from "next";
import { Container } from "../../components/layout/Container";
import { SiteFooter } from "../../components/layout/SiteFooter";
import { SiteHeader } from "../../components/layout/SiteHeader";
import { BlogArt } from "../../components/blog/BlogArt";
import { RedactedLines } from "../../components/home/RedactedLines";
import { SectionEnter } from "../../components/motion/SectionEnter";
import { ServicePageEntry } from "../../components/services/ServicePageEntry";
import { PixelArrow } from "../../components/ui/PixelArrow";
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
 */
export default function BlogPage() {
  const [lead, ...rest] = blog.posts;

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
              <>
                {/* The lead. One piece gets the width, because an index where
                    everything is the same size asks the reader to choose
                    without telling them anything, and the first piece here is
                    the argument the others rest on. */}
                <a className="blog-lead" href={`/blog/${lead.slug}`}>
                  <span className="blog-lead__art blog-plate" aria-hidden="true">
                    <BlogArt slug={lead.slug} className="blog-art" />
                  </span>

                  <span className="blog-lead__words">
                    <span className="blog-lead__meta">
                      <time dateTime={lead.date}>{formatDate(lead.date)}</time>
                      <span aria-hidden="true">·</span>
                      <span>{readingMinutes(lead)} min read</span>
                    </span>

                    <h3 className="blog-lead__title">{lead.title}</h3>
                    <span className="blog-lead__thesis">{lead.thesis}</span>

                    <span className="blog-lead__more">
                      Read it
                      <PixelArrow
                        className="blog-lead__arrow"
                        direction="up-right"
                        size="small"
                      />
                    </span>
                  </span>
                </a>

                {rest.length > 0 ? (
                  <ul className="blog-grid">
                    {rest.map((post) => (
                      <li key={post.slug}>
                        <a className="blog-card" href={`/blog/${post.slug}`}>
                          <span className="blog-card__art blog-plate" aria-hidden="true">
                            <BlogArt slug={post.slug} className="blog-art" />
                          </span>

                          <span className="blog-card__meta">
                            <time dateTime={post.date}>
                              {formatDate(post.date)}
                            </time>
                            <span aria-hidden="true">·</span>
                            <span>{readingMinutes(post)} min read</span>
                          </span>

                          <h3 className="blog-card__title">{post.title}</h3>
                          <span className="blog-card__thesis">
                            {post.thesis}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </>
            )}
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

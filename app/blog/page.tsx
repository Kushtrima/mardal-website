import type { Metadata } from "next";
import { Container } from "../../components/layout/Container";
import { SiteFooter } from "../../components/layout/SiteFooter";
import { HeaderSpace } from "../../components/layout/HeaderSpace";
import { RedactedLines } from "../../components/home/RedactedLines";
import { SectionEnter } from "../../components/motion/SectionEnter";
import { blog, blogHero, formatDate, readingMinutes } from "../../content/blog";
import { BlogEntriesReveal } from "../../components/blog/BlogEntriesReveal";
import { ServicesHero } from "../../components/services/ServicesHero";
import { ServicesRules } from "../../components/services/ServicesRules";
import { ServicesFooterRules } from "../../components/services/ServicesFooterRules";

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

      <main
        className="service-page service-page--blog"
        id="main-content"
        data-service-page
      >
        {/* The page's five lines in the red, turning grey as the opening is
            scrolled away, as the other openings' (ServicesRules). */}
        <ServicesRules />
        <HeaderSpace />

        {/* The services', the products', the clients' and About's opening, in
            the Blog's words — owner, 2026-10-08: "change the hero as
            others". */}
        <ServicesHero hero={blogHero} name="blog" />

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
          <BlogEntriesReveal />
          <Container data-enter data-enter-mode="none">

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
              /* **Three to a row, the picture only under the pointer** —
                 owner, 2026-10-08: "i would like in 3 blog post in on row
                 and maybe only image on hover", from a reference card (a
                 line of facts, a picture, the title). On the page's lines:
                 "Writing" on the first, the pieces from the second, third
                 and fourth. Each card: its reading time and date; its
                 picture; the title. Under the pointer the picture reveals
                 itself again — the red sweeps up over it and lifts off the
                 top — and the title turns red ("i want image to be visible
                 not text, then when hover … revealing again"). Each arrives
                 once as it reaches the screen (BlogEntriesReveal). */
              <div className="blog-row">
                <h2 className="blog-row__label" id="blog-index-title">
                  {blog.indexLabel}
                </h2>
                <ul className="blog-cards">
                  {blog.posts.map((post) => (
                    <li className="blog-card" key={post.slug} data-blog-entry>
                      <a className="blog-card__link" href={`/blog/${post.slug}`}>
                        <p className="blog-card__meta" data-blog-entry-after>
                          <span>{readingMinutes(post)} min read</span>
                          <time dateTime={post.date}>{formatDate(post.date)}</time>
                        </p>
                        <span className="blog-card__field" data-blog-entry-after>
                          {/* A stand-in, decorative: alt is empty. */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            className="blog-card__image"
                            src={post.cover}
                            srcSet={`${post.cover.replace("/1200/960", "/600/480")} 600w, ${post.cover} 1200w`}
                            sizes="(max-width: 40rem) 100vw, (max-width: 64rem) 50vw, 25vw"
                            alt=""
                            width="1200"
                            height="960"
                            loading="lazy"
                            decoding="async"
                          />
                        </span>
                        <h3 className="blog-card__title" data-blog-entry-title>
                          {post.title}
                        </h3>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Container>
        </section>
      </main>

      <SiteFooter rules={<ServicesFooterRules />} />
    </>
  );
}

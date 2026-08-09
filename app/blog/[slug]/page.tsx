import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "../../../components/layout/Container";
import { SiteFooter } from "../../../components/layout/SiteFooter";
import { SiteHeader } from "../../../components/layout/SiteHeader";
import { BlogPattern } from "../../../components/blog/BlogPattern";
import { SectionEnter } from "../../../components/motion/SectionEnter";
import { PixelArrow } from "../../../components/ui/PixelArrow";
import { blog, formatDate, readingMinutes } from "../../../content/blog";
import { products } from "../../../content/home";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return blog.posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blog.posts.find((entry) => entry.slug === slug);
  if (!post) return {};

  return { title: post.title, description: post.thesis };
}

/**
 * One piece.
 *
 * Not built on service-hero. Those heroes hold a title against artwork and
 * dissolve as you leave them, which is right for a page that is selling and
 * wrong for one that is being read: the reader's next move here is down into
 * the words, and a full-height opening puts a screenful of nothing between the
 * title and the first line of the argument. So the title, the date and the
 * length sit directly above the prose, and the reading begins in the first
 * viewport.
 */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const index = blog.posts.findIndex((entry) => entry.slug === slug);
  if (index === -1) notFound();

  const post = blog.posts[index];

  /* The piece on either side of this one, both wrapping, so the ends of the run
     are not dead ends: the first piece's left-hand offer is the last piece, and
     the last piece's right-hand offer is the first.

     Two rather than one, because a single "read next" is nothing to anyone who
     has already read the piece it names — and the pair is what makes the row
     read as a position in a run rather than as a suggestion. */
  const count = blog.posts.length;
  const previous =
    count > 1 ? blog.posts[(index - 1 + count) % count] : undefined;
  const next = count > 1 ? blog.posts[(index + 1) % count] : undefined;
  /* At two published pieces the piece before is also the piece after. Printing
     it on both sides would offer one thing twice and read as a bug; the right
     side keeps it. */
  const before =
    previous && previous.slug !== next?.slug ? previous : undefined;

  return (
    <>
      <SectionEnter />

      <main className="service-page blog-post" id="main-content">
        <SiteHeader />

        <article className="blog-article">
          <Container className="blog-article__inner">
            <header className="blog-article__head">
              <p className="blog-article__meta">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden="true">·</span>
                <span>{readingMinutes(post)} min read</span>
              </p>

              <h1 className="blog-article__title">{post.title}</h1>

              {/* The thesis again, as a standfirst. It is the sentence the
                  index promised, so the piece should open by keeping that
                  promise rather than making the reader find it. Set larger than
                  the body and lighter than the title, which is what a standfirst
                  is for. */}
              <p className="blog-article__standfirst">{post.thesis}</p>

              {/* Under the standfirst rather than in the meta line above it: a
                  person's name set in the tracked upper case that line uses
                  would shout, and a byline belongs next to the writing it is
                  claiming rather than next to the filing information. */}
              <p className="blog-article__byline">{post.author}</p>
            </header>

            {/* The piece's own drawing, the same language the index card
                showed, at the head of the reading rather than as a banner
                above it. It is the handover: you clicked this drawing, here it
                is again at full size, the words start underneath. */}
            <div className="blog-article__art" aria-hidden="true">
              <BlogPattern
                slug={post.slug}
                density="plate"
                className="blog-art"
              />
            </div>

            {/* Blocks rather than markup in a string, so a note and an argument
                render through one template instead of two that each half-fit. */}
            <div className="blog-article__body">
              {post.body.map((block, index) => {
                if (block.type === "h") {
                  return (
                    <h2 className="blog-article__heading" key={index}>
                      {block.text}
                    </h2>
                  );
                }

                if (block.type === "quote") {
                  return (
                    <blockquote className="blog-article__quote" key={index}>
                      {block.text}
                    </blockquote>
                  );
                }

                /* ol when the count carries meaning, ul when it does not, so
                   the element says what the list is rather than leaving the
                   marker to say it. */
                if (block.type === "list") {
                  const List = block.ordered ? "ol" : "ul";

                  return (
                    <List
                      className={
                        block.ordered
                          ? "blog-article__list"
                          : "blog-article__list blog-article__list--plain"
                      }
                      key={index}
                    >
                      {block.items.map((item) => (
                        <li className="blog-article__item" key={item}>
                          {item}
                        </li>
                      ))}
                    </List>
                  );
                }

                return (
                  <p className="blog-article__copy" key={index}>
                    {block.text}
                  </p>
                );
              })}
            </div>

            {/* Somewhere to go next, before the call to action. Someone who has
                finished a piece and is not ready to write an email is looking
                for the next piece, and a page that only offers contact loses
                them.

                One row: the piece behind on the left, the piece ahead on the
                right, the way out of the run in the middle. It replaced a
                stacked list that carried each piece's drawing, thesis, date and
                length — a second index printed under every article, when what a
                reader wants at the foot of a piece is a direction, not a
                catalogue. Titles only, at the owner's call.

                It runs the full content column rather than the prose's 38rem.
                The left and right have to reach the edges of the page for the
                row to read as two directions rather than as a list that happens
                to be spread out, and 80rem is where every other section on this
                site ends. */}
            <nav className="blog-more" aria-labelledby="blog-more-title">
              <h2 className="visually-hidden" id="blog-more-title">
                {blog.more.title}
              </h2>

              <div className="blog-more__row">
                {/* An empty cell when there is nothing behind, so the middle
                    stays in the middle. The grid holds the position; the link
                    only fills it. */}
                {before ? (
                  <a
                    className="blog-more__side blog-more__side--back"
                    href={`/blog/${before.slug}`}
                  >
                    <PixelArrow
                      className="blog-more__arrow"
                      direction="left"
                      size="small"
                    />
                    <span className="blog-more__name">{before.title}</span>
                  </a>
                ) : (
                  <span className="blog-more__side" aria-hidden="true" />
                )}

                <a className="blog-more__all" href="/blog">
                  {blog.more.all}
                </a>

                {next ? (
                  <a
                    className="blog-more__side blog-more__side--on"
                    href={`/blog/${next.slug}`}
                  >
                    <span className="blog-more__name">{next.title}</span>
                    <PixelArrow
                      className="blog-more__arrow"
                      direction="right"
                      size="small"
                    />
                  </a>
                ) : (
                  <span className="blog-more__side" aria-hidden="true" />
                )}
              </div>
            </nav>
          </Container>
        </article>

        <section
          className="service-cta"
          aria-labelledby="blog-cta-title"
          data-route-section
        >
          <Container>
            <div
              className="service-cta__inner"
              data-enter
              data-enter-mode="none"
            >
              <h2 className="service-cta__title" id="blog-cta-title">
                {blog.cta.title}
              </h2>

              <a className="service-cta__link" href={products.ctaHref}>
                {blog.cta.label}
                <PixelArrow
                  className="service-cta__arrow"
                  direction="up-right"
                  size="small"
                />
              </a>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

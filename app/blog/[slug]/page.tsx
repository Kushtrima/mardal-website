import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "../../../components/layout/Container";
import { SiteFooter } from "../../../components/layout/SiteFooter";
import { SiteHeader } from "../../../components/layout/SiteHeader";
import { BlogArt } from "../../../components/blog/BlogArt";
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
  /* Wraps, so the last piece offers the first rather than offering nothing.
     With three of them a dead end at the bottom of the run is a third of the
     readers with nowhere to go. */
  const next =
    blog.posts.length > 1
      ? blog.posts[(index + 1) % blog.posts.length]
      : undefined;

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
            </header>

            {/* The piece's own mark, the same one the index showed, at the head
                of the reading rather than as a banner above it. It is the
                handover: you clicked this drawing, here it is again, the words
                start underneath. */}
            <div className="blog-article__art blog-plate" aria-hidden="true">
              <BlogArt slug={post.slug} className="blog-art" />
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
                them. The next piece is offered by name, because "read more" is
                not an offer. */}
            <nav className="blog-next" aria-label="More writing">
              {next ? (
                <a className="blog-next__piece" href={`/blog/${next.slug}`}>
                  <span className="blog-next__label">Read next</span>
                  <span className="blog-next__title">{next.title}</span>
                  <PixelArrow
                    className="blog-next__arrow"
                    direction="up-right"
                    size="small"
                  />
                </a>
              ) : null}

              <a className="blog-article__back" href="/blog">
                <PixelArrow
                  className="blog-article__back-arrow"
                  direction="left"
                  size="small"
                />
                All writing
              </a>
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

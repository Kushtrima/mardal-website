import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "../../../components/layout/Container";
import { SiteFooter } from "../../../components/layout/SiteFooter";
import { SiteHeader } from "../../../components/layout/SiteHeader";
import { SectionEnter } from "../../../components/motion/SectionEnter";
import { PixelArrow } from "../../../components/ui/PixelArrow";
import { blog, readingMinutes } from "../../../content/blog";
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
  const post = blog.posts.find((entry) => entry.slug === slug);
  if (!post) notFound();

  return (
    <>
      <SectionEnter />

      <main className="service-page blog-post" id="main-content">
        <SiteHeader />

        <article className="blog-article">
          <Container className="blog-article__inner">
            <header className="blog-article__head">
              <h1 className="blog-article__title">{post.title}</h1>

              <p className="blog-article__meta">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span aria-hidden="true">·</span>
                <span>{readingMinutes(post)} min read</span>
              </p>
            </header>

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

            {/* Back to the list before the call to action: someone who has read
                one piece and is not ready to write an email is looking for the
                next piece, and sending them only to contact loses them. */}
            <a className="blog-article__back" href="/blog">
              <PixelArrow
                className="blog-article__back-arrow"
                direction="left"
                size="small"
              />
              All writing
            </a>
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

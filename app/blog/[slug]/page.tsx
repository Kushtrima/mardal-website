import type { Metadata } from "next";
import { pageMetadata } from "../../../lib/page-metadata";
import { notFound } from "next/navigation";
import { Container } from "../../../components/layout/Container";
import { SiteFooter } from "../../../components/layout/SiteFooter";
import { HeaderSpace } from "../../../components/layout/HeaderSpace";
import { ArticleContents } from "../../../components/blog/ArticleContents";
import { blog, formatDate, readingMinutes } from "../../../content/blog";
import { ServicesFooterRules } from "../../../components/services/ServicesFooterRules";

type Params = { slug: string };

/** A heading's address in the piece, from its words. */
function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

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

  return pageMetadata(post.title, post.thesis, "article");
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
      <main className="service-page blog-post" id="main-content">
        {/* The page's five lines, grey, from its top to its foot — owner,
            2026-10-08: "add the vertical lines to the rest of the pages". */}
        <ServicesFooterRules />
        <HeaderSpace />

        <article className="blog-article">
          <Container className="blog-article__inner">
            {/* **A professional piece — owner, 2026-10-08**: "change the
                structure font remove that design inside the blog when open
                because there needs to be image right and make as a
                professional blog so on the right to be title online offline
                when scrollin in the middle to be text". On the page's four
                columns: the date and reading time, the title large, the
                thesis and the author; the piece's picture the whole width
                (in place of the drawing); then the text in the middle two
                columns and its headings down the right (ArticleContents),
                the one being read lit. One face throughout, the site's. */}
            {/* The bar says no "Operating from Kosova" over it — owner,
                2026-10-08 (the stylesheet). */}
            <header className="blog-article__head" data-article-hero>
              <p className="blog-article__meta">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden="true">·</span>
                <span>{readingMinutes(post)} min read</span>
              </p>
              <h1 className="blog-article__title">{post.title}</h1>
              <p className="blog-article__standfirst">{post.thesis}</p>
              <p className="blog-article__byline">{post.author}</p>
            </header>

            <figure className="blog-article__cover">
              {/* A stand-in, decorative: alt is empty (content/blog.ts). */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="blog-article__cover-image"
                src={post.cover}
                srcSet={`${post.cover.replace("/1200/960", "/600/480")} 600w, ${post.cover} 1200w`}
                sizes="100vw"
                alt=""
                width="1200"
                height="960"
                loading="eager"
              />
            </figure>

            <div className="blog-article__body" data-article-body>
              {post.body.map((block, index) => {
                if (block.type === "h") {
                  return (
                    <h2
                      className="blog-article__heading"
                      id={headingId(block.text)}
                      key={index}
                    >
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

            <aside className="blog-article__aside">
              <ArticleContents
                label={blog.contents}
                headings={post.body
                  .filter((block) => block.type === "h")
                  .map((block) => ({ id: headingId(block.text), text: block.text }))}
              />
            </aside>

            <nav className="blog-more" aria-labelledby="blog-more-title">
              <h2 className="visually-hidden" id="blog-more-title">
                {blog.more.title}
              </h2>

              {/* Two long arrows and no words on the page — owner,
                  2026-10-08: "remove the text leave it only arrows and bring
                  it more inside also remove that All writing": the piece
                  behind from the second line, the piece ahead ending on the
                  fourth, as the project page ends. The titles stay for a
                  screen reader. */}
              <div className="blog-more__row">
                {before ? (
                  <a
                    className="blog-more__side blog-more__side--back"
                    href={`/blog/${before.slug}`}
                  >
                    <MoreArrow back />
                    <span className="visually-hidden">{before.title}</span>
                  </a>
                ) : null}

                {next ? (
                  <a
                    className="blog-more__side blog-more__side--on"
                    href={`/blog/${next.slug}`}
                  >
                    <span className="visually-hidden">{next.title}</span>
                    <MoreArrow />
                  </a>
                ) : null}
              </div>
            </nav>
          </Container>
        </article>

      </main>

      <SiteFooter rules={<ServicesFooterRules />} />
    </>
  );
}

/** The long thin arrow, back or on — owner, 2026-10-08, of the row that
 *  ends a piece: "change the font, chage the arrws and remove that
 *  horisontal grey line". The arrows the project page's Back and Next
 *  Project draw. */
function MoreArrow({ back = false }: { back?: boolean }) {
  return (
    <svg
      className="blog-more__arrow"
      viewBox="0 0 64 12"
      aria-hidden="true"
      focusable="false"
    >
      <path d={back ? "M63 6H1M7 1 1 6l6 5" : "M1 6h62M57 1l6 5-6 5"} />
    </svg>
  );
}

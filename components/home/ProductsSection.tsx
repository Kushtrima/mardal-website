import { Container } from "../layout/Container";
import { RollingLabel } from "../ui/RollingLabel";
import { ProductsReveal } from "./ProductsReveal";
import { products } from "../../content/home";
import { productsIntro } from "../../content/products-index";

/** The widths each product's photograph is offered at. */
const PRODUCT_WIDTHS = [480, 800, 1200, 1600];

/**
 * The products — redesigned on the owner's word, 2026-10-05: "pls
 * redesign this section"; then "you have to use our new concept text color
 * etc", of a version that still spoke the old one.
 *
 * So it is written in the homepage's own hand: the label on the first rule as
 * "Our / expertise" is, the heading from the second at the headings' size —
 * its full stop the site's red square, as about's "o" is — and the sentence
 * under it at the paragraphs' size. Then the products, one to a column from
 * the second rule to the fourth, each a picture with its lines under it as
 * Selected Work's are, black on white; its words, and the link with VIEW
 * ALL's thin arrow. Under the pointer the name turns red and rolls.
 *
 * It also carries the ids the header menu and the footer link to — #products
 * and one per product.
 *
 * **And the products page's body** (`page`) — owner, 2026-10-07: "put those
 * two products in this page below", after "a paragraf and a title" of his
 * context, and each one opening "its one page". The same section in the same
 * hand, with that page's label, heading and paragraph (content/
 * products-index.ts) and each product's link going to its own page (until
 * those pages were deleted, 2026-10-08); on that page's hairlines rather
 * than its own.
 *
 * **There each product is a band of its own** — owner, 2026-10-07, "lets
 * try your version" of a presentation unlike the homepage's: one under the
 * other, the name over a picture three quarters wide, the words in the
 * quarter beside it, the second mirrored. Where it stands is on a redaction
 * bar.
 */
export function ProductsSection({ page = false }: { page?: boolean }) {
  const intro = page ? productsIntro : products;
  const titleId = page ? "products-list-title" : "products-title";
  return (
    <section
      className={page ? "products products--page" : "products"}
      /* The page's hairlines run through it — see [data-ruled] in globals.css;
         the products page draws its own (ServicesRules). */
      data-ruled={page ? undefined : true}
      id={page ? "products-list" : products.id}
      aria-labelledby={titleId}
      data-route-section
      data-products
      /* Its own entrance, ProductsReveal; the site's section entrance
         moving the same block at the same moment would fight it. */
      data-enter-mode="none"
    >
      <ProductsReveal />

      <Container className="products__layout">
        <p className="products__label" data-products-label>
          {intro.labelLines.map((line) => (
            <span className="products__label-line" key={line}>
              {line}
            </span>
          ))}
        </p>

        <h2 className="products__title" id={titleId}>
          {intro.titleLines.map((line, index) => (
            /* What rises: the line is the mask it rises out of. */
            <span className="products__title-line" key={line}>
              <span className="products__rise" data-products-line>
                {line}
                {index === intro.titleLines.length - 1 ? (
                  /* The full stop, drawn as the red square; the character is
                     still there for a screen reader. */
                  <span className="products__stop" data-products-stop>
                    <span className="visually-hidden">{intro.titleStop}</span>
                  </span>
                ) : null}
              </span>
            </span>
          ))}
        </h2>

        <p className="products__lede" data-products-summary>
          {intro.summary}
        </p>

        <ul className="products__list">
          {products.items.map((product) => (
            <li className="product" id={product.id} key={product.id} data-product>
              {page ? (
                /* On the products page the name leads its band, over the
                   picture, at the heading's size — and stays still under
                   the pointer: only the link answers there (owner,
                   2026-10-07). */
                <h3 className="product__name" data-product-fade>
                  {product.title}
                </h3>
              ) : null}

              {/* What opens on arrival: the frame from its foot, the
                  photograph inside settling to its size. */}
              <div className="product__frame" data-product-frame>
                {/* The photograph service resizes it itself (srcSet below). */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="product__image"
                  src={product.image}
                  /* The photograph's own service sends it at the width asked
                     for, so a phone takes a phone's (sizes: the full column
                     there, a quarter of the page above it). */
                  srcSet={PRODUCT_WIDTHS.map(
                    (width) => `${product.image.replace(/([?&])w=\d+/, `$1w=${width}`)} ${width}w`,
                  ).join(", ")}
                  sizes={
                    page
                      ? "(max-width: 40rem) 100vw, (max-width: 64rem) 50vw, 75vw"
                      : "(max-width: 40rem) 100vw, 25vw"
                  }
                  alt={product.imageAlt}
                  width="1600"
                  height="1000"
                  loading="lazy"
                  decoding="async"
                  data-product-image
                />
              </div>

              {/* Its lines, as Selected Work sets a piece's: the name and
                  where it stands. No field under the name — owner,
                  2026-10-07: "delete under name the section like Mental
                  Health and Evends". */}
              {page ? (
                /* Where it stands, on the site's redaction bar: both are
                   unfinished, and the bar says so. */
                <p className="product__status" data-product-fade>
                  <span className="product__bar">{`${product.status}, ${product.year}`}</span>
                </p>
              ) : (
                <div className="product__meta" data-product-fade>
                  <h3 className="product__name">
                    <RollingLabel>{product.title}</RollingLabel>
                  </h3>
                  <p className="product__line">{`${product.status}, ${product.year}`}</p>
                </div>
              )}

              <p className="product__copy" data-product-fade>
                {product.description}
              </p>

              <a
                className="product__cta"
                data-roll
                data-product-fade
                /* Each product's own page was deleted on 2026-10-08 (owner:
                   "delete it all"), so on the products page too the link
                   writes to Mardal, as the homepage's does. */
                href={products.ctaHref}
              >
                <RollingLabel>{products.cta}</RollingLabel>
                {/* VIEW ALL's arrow: a hairline, still while the word rolls. */}
                <svg
                  className="product__arrow"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M2 14 14 2M4.5 2H14v9.5" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

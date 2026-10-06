import { Container } from "../layout/Container";
import { RollingLabel } from "../ui/RollingLabel";
import { ProductsReveal } from "./ProductsReveal";
import { products } from "../../content/home";

/** The widths each product's photograph is offered at. */
const PRODUCT_WIDTHS = [480, 800, 1200, 1600];

/**
 * The three products — redesigned on the owner's word, 2026-10-05: "pls
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
 * It also carries the four ids the header menu and the footer link to —
 * #products and one per product.
 */
export function ProductsSection() {
  return (
    <section
      className="products"
      /* The page's hairlines run through it — see [data-ruled] in globals.css. */
      data-ruled
      id={products.id}
      aria-labelledby="products-title"
      data-route-section
      data-products
      /* Its own entrance, ProductsReveal; the site's section entrance
         moving the same block at the same moment would fight it. */
      data-enter-mode="none"
    >
      <ProductsReveal />

      <Container className="products__layout">
        <p className="products__label" data-products-label>
          {products.labelLines.map((line) => (
            <span className="products__label-line" key={line}>
              {line}
            </span>
          ))}
        </p>

        <h2 className="products__title" id="products-title">
          {products.titleLines.map((line, index) => (
            /* What rises: the line is the mask it rises out of. */
            <span className="products__title-line" key={line}>
              <span className="products__rise" data-products-line>
                {line}
                {index === products.titleLines.length - 1 ? (
                  /* The full stop, drawn as the red square; the character is
                     still there for a screen reader. */
                  <span className="products__stop" data-products-stop>
                    <span className="visually-hidden">{products.titleStop}</span>
                  </span>
                ) : null}
              </span>
            </span>
          ))}
        </h2>

        <p className="products__lede" data-products-summary>
          {products.summary}
        </p>

        <ul className="products__list">
          {products.items.map((product) => (
            <li className="product" id={product.id} key={product.id} data-product>
              {/* What opens on arrival: the frame from its foot, the
                  photograph inside settling to its size. */}
              <div className="product__frame" data-product-frame>
                <img
                  className="product__image"
                  src={product.image}
                  /* The photograph's own service sends it at the width asked
                     for, so a phone takes a phone's (sizes: the full column
                     there, a quarter of the page above it). */
                  srcSet={PRODUCT_WIDTHS.map(
                    (width) => `${product.image.replace(/([?&])w=\d+/, `$1w=${width}`)} ${width}w`,
                  ).join(", ")}
                  sizes="(max-width: 40rem) 100vw, 25vw"
                  alt={product.imageAlt}
                  width="1600"
                  height="1000"
                  loading="lazy"
                  decoding="async"
                  data-product-image
                />
              </div>

              {/* Its lines, as Selected Work sets a piece's: the name, the
                  field, and where it stands. */}
              <div className="product__meta" data-product-fade>
                <h3 className="product__name">
                  <RollingLabel>{product.title}</RollingLabel>
                </h3>
                <p className="product__line">{product.field}</p>
                <p className="product__line">{`${product.status}, ${product.year}`}</p>
              </div>

              <p className="product__copy" data-product-fade>
                {product.description}
              </p>

              <a
                className="product__cta"
                data-roll
                data-product-fade
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

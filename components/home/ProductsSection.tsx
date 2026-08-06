import { Container } from "../layout/Container";
import { PixelArrow } from "../ui/PixelArrow";
import { ProductsPin } from "./ProductsPin";
import { products } from "../../content/home";

/**
 * The three products: the words on the left, the products down the right.
 *
 * The heading column is held in place while the products are scrolled past it,
 * so it is still there when you reach the last one. Each product leads with a
 * photograph — none of the three has an interface worth showing yet, so the
 * image stands for what it is about rather than claiming to be it.
 *
 * It also carries the four ids the header menu and the footer link to —
 * #products and one per product.
 */
export function ProductsSection() {
  return (
    <section
      className="products-section"
      id={products.id}
      aria-labelledby="products-title"
      data-route-section
    >
      <ProductsPin />

      <Container>
        <div className="products-layout">
          {/* The column stretches so the rule beside it runs the full height;
              the block inside it stays its own height so there is something
              left to hold in place. */}
          <div className="products-intro-col">
            <div className="products-intro">
              <p className="section-label">{products.eyebrow}</p>
              <h2 className="section-title products-title" id="products-title">
                {products.titleLines.map((line) => (
                  <span className="products-title__line" key={line}>
                    {line}
                  </span>
                ))}
              </h2>
              <p className="section-lede products-lede">{products.summary}</p>
            </div>
          </div>

          {/* The products carry the section's arrival, not the section: the
              heading beside them is pinned, and a pin inside something that
              moves is measured wrong. */}
          <ul className="products-row" data-enter>
            {products.items.map((product) => (
              <li className="product" id={product.id} key={product.id}>
                {/* The facts sit low against the rule, level with the foot of
                    the picture, as they do in the reference. */}
                <div className="product__facts">
                  <div className="product-fact">
                    <p className="product-fact__label">
                      {products.factLabels.status}
                    </p>
                    <p className="product-fact__value">{product.status}</p>
                  </div>
                  <div className="product-fact">
                    <p className="product-fact__label">
                      {products.factLabels.field}
                    </p>
                    <p className="product-fact__value">{product.field}</p>
                  </div>
                  <div className="product-fact">
                    <p className="product-fact__label">
                      {products.factLabels.year}
                    </p>
                    <p className="product-fact__value">{product.year}</p>
                  </div>
                </div>

                <div className="product__main">
                  <img
                    className="product__image"
                    src={product.image}
                    alt={product.imageAlt}
                    width="1600"
                    height="1000"
                    loading="lazy"
                    decoding="async"
                  />

                  <h3 className="product__name">{product.title}</h3>
                  <p className="product__copy">{product.description}</p>

                  <a className="product__cta" href={products.ctaHref}>
                    {products.cta}
                    <PixelArrow
                      className="product__arrow"
                      direction="up-right"
                      size="small"
                    />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
